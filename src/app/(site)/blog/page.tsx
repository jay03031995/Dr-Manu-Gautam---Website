import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { BlogListingClient } from "@/components/sections/BlogListingClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { client } from "@/sanity/lib/client";
import { getBlogPosts } from "@/sanity/lib/fetch";
import { buildPageMetadata, buildBreadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Orthopedic Health Journal",
  description:
    "Patient education articles on joint health, arthritis, sports injuries and orthopedic treatments from Dr. Manu Gautam's practice.",
  path: "/blog",
});

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getBlogPosts(),
    client.fetch<{ title: string; slug: { current: string } }[]>(
      `*[_type == "blogCategory"] | order(title asc){title, slug}`
    ),
  ]);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <Container className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-dark-gray">
            <li>
              <Link href="/" className="hover:text-medical-blue">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-charcoal">Blog</li>
          </ol>
        </nav>
      </Container>

      <Section background="white" className="pt-6 md:pt-8">
        <Reveal mode="onMount" className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="mb-4">Orthopedic Health Journal</h1>
          <p className="text-lg text-dark-gray leading-relaxed">
            Patient education articles on joint health, arthritis, sports injuries and orthopedic care from{" "}
            {siteConfig.shortName}&rsquo;s practice.
          </p>
        </Reveal>

        {posts.length > 0 ? (
          <BlogListingClient posts={posts} categories={categories} />
        ) : (
          <p className="py-16 text-center text-dark-gray">New articles are on the way — check back soon.</p>
        )}
      </Section>
    </>
  );
}
