"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { estimateReadingTime } from "@/lib/blog";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";
import type { BlogPostSummary } from "@/sanity/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

function BlogCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link href={`/blog/${post.slug.current}`} className="card-base card-shadow group block overflow-hidden p-0">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-light-teal">
        {hasImageAsset(post.coverImage) && (
          <Image
            src={urlForImage(post.coverImage).width(600).height(375).fit("crop").url()}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 30vw, 90vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-5">
        {post.categories?.[0] && (
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-medical-blue">
            {post.categories[0].title}
          </span>
        )}
        <h3 className="mb-2 text-base font-semibold text-dark-navy line-clamp-2">{post.title}</h3>
        <p className="mb-4 text-sm text-dark-gray line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center gap-2 text-xs text-dark-gray">
          <span>{formatDate(post.publishedAt)}</span>
          <span aria-hidden="true">&middot;</span>
          <span>{estimateReadingTime(post.body)}</span>
        </div>
      </div>
    </Link>
  );
}

export function BlogListingClient({
  posts,
  categories,
}: {
  posts: BlogPostSummary[];
  categories: { title: string; slug: { current: string } }[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p._id !== featured?._id);

  const filtered = useMemo(() => {
    return rest.filter((p) => {
      const matchesSearch = search.trim()
        ? p.title.toLowerCase().includes(search.trim().toLowerCase()) ||
          p.excerpt.toLowerCase().includes(search.trim().toLowerCase())
        : true;
      const matchesCategory = category ? p.categories?.some((c) => c.slug.current === category) : true;
      return matchesSearch && matchesCategory;
    });
  }, [rest, search, category]);

  return (
    <div>
      {featured && (
        <Link
          href={`/blog/${featured.slug.current}`}
          className="card-base card-shadow mb-12 grid grid-cols-1 overflow-hidden p-0 lg:grid-cols-2"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-light-teal lg:aspect-auto">
            {hasImageAsset(featured.coverImage) && (
              <Image
                src={urlForImage(featured.coverImage).width(900).height(600).fit("crop").url()}
                alt={featured.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-medical-blue">Featured</span>
            <h2 className="mb-3">{featured.title}</h2>
            <p className="mb-4 text-dark-gray leading-relaxed">{featured.excerpt}</p>
            <div className="flex items-center gap-2 text-sm text-dark-gray">
              <span>{formatDate(featured.publishedAt)}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{estimateReadingTime(featured.body)}</span>
            </div>
          </div>
        </Link>
      )}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-gray" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            aria-label="Search articles"
            className="h-10 w-full rounded-full border border-light-grey bg-white pl-9 pr-4 text-sm text-charcoal placeholder:text-dark-gray/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue"
          />
        </div>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium",
                category === null ? "border-dark-navy bg-dark-navy text-white" : "border-light-grey text-charcoal hover:border-medical-blue"
              )}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.slug.current}
                type="button"
                onClick={() => setCategory(c.slug.current)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium",
                  category === c.slug.current
                    ? "border-dark-navy bg-dark-navy text-white"
                    : "border-light-grey text-charcoal hover:border-medical-blue"
                )}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-dark-gray">No articles match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
