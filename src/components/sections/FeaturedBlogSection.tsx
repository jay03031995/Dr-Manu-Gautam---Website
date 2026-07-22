import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGrid } from "@/components/motion/RevealGrid";
import { estimateReadingTime } from "@/lib/blog";
import { getBlogPosts } from "@/sanity/lib/fetch";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export async function FeaturedBlogSection() {
  const posts = await getBlogPosts();
  if (!posts.length) return null;

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const supporting = posts.filter((p) => p._id !== featured._id).slice(0, 6);

  return (
    <Section background="light">
      <Reveal className="mb-10 text-center">
        <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
          From the Journal
        </p>
        <h2>Patient Education &amp; Orthopedic Insights</h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Reveal>
          <Link href={`/blog/${featured.slug.current}`} className="card-base card-shadow block h-full overflow-hidden p-0">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-light-teal">
              {hasImageAsset(featured.coverImage) && (
                <Image
                  src={urlForImage(featured.coverImage).width(800).height(450).fit("crop").url()}
                  alt={featured.title}
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-6">
              {featured.categories?.[0] && (
                <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-medical-blue">
                  {featured.categories[0].title}
                </span>
              )}
              <h3 className="mb-2 text-xl font-semibold text-dark-navy">{featured.title}</h3>
              <p className="mb-4 text-sm text-dark-gray leading-relaxed line-clamp-2">{featured.excerpt}</p>
              <div className="flex items-center gap-2 text-xs text-dark-gray">
                <span>{formatDate(featured.publishedAt)}</span>
                <span aria-hidden="true">&middot;</span>
                <span>{estimateReadingTime(featured.body)}</span>
              </div>
            </div>
          </Link>
        </Reveal>

        <RevealGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {supporting.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="card-base card-shadow flex flex-col p-5"
            >
              {post.categories?.[0] && (
                <span className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-medical-blue">
                  {post.categories[0].title}
                </span>
              )}
              <h3 className="mb-2 text-sm font-semibold text-dark-navy line-clamp-2">{post.title}</h3>
              <div className="mt-auto flex items-center gap-2 text-xs text-dark-gray">
                <span>{formatDate(post.publishedAt)}</span>
                <span aria-hidden="true">&middot;</span>
                <span>{estimateReadingTime(post.body)}</span>
              </div>
            </Link>
          ))}
        </RevealGrid>
      </div>

      <Reveal delay={0.1} className="mt-10 text-center">
        <Link href="/blog" className="text-sm font-medium text-medical-blue hover:underline">
          Read More Articles &rarr;
        </Link>
      </Reveal>
    </Section>
  );
}
