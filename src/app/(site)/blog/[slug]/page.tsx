import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BookAppointmentButton } from "@/components/forms/BookAppointmentButton";
import { ServiceCard } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGrid } from "@/components/motion/RevealGrid";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceIcon } from "@/lib/serviceIcons";
import { estimateReadingTime, extractToc } from "@/lib/blog";
import { getBlogPosts, getBlogPostBySlug } from "@/sanity/lib/fetch";
import { client } from "@/sanity/lib/client";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";
import { buildPageMetadata, buildBreadcrumbSchema, buildArticleSchema, buildFaqSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";
import { telHref, treatmentPath } from "@/lib/utils";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(`*[_type == "blogPost" && defined(slug.current)].slug.current`);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};

  return buildPageMetadata({
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    path: `/blog/${params.slug}`,
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = await getBlogPosts();
  const relatedPosts = allPosts
    .filter(
      (p) =>
        p._id !== post._id &&
        p.categories?.some((c) => post.categories?.some((pc) => pc.slug.current === c.slug.current))
    )
    .slice(0, 3);

  const toc = extractToc(post.body);
  const pageUrl = `${siteConfig.url}/blog/${params.slug}`;
  const coverUrl = hasImageAsset(post.coverImage) ? urlForImage(post.coverImage).width(1200).url() : undefined;

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${params.slug}` },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);
  const articleSchema = buildArticleSchema({
    headline: post.title,
    description: post.excerpt,
    url: pageUrl,
    image: coverUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    authorName: post.author?.name,
  });
  const faqSchema = post.faqs?.length ? buildFaqSchema(post.faqs) : null;

  return (
    <>
      <JsonLd data={faqSchema ? [breadcrumbSchema, articleSchema, faqSchema] : [breadcrumbSchema, articleSchema]} />

      <Container className="pt-6">
        <nav aria-label="Breadcrumb" className="overflow-x-auto">
          <ol className="flex items-center gap-2 whitespace-nowrap text-sm text-dark-gray">
            {breadcrumbItems.map((item, i) => (
              <li key={item.url} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i === breadcrumbItems.length - 1 ? (
                  <span className="line-clamp-1 text-charcoal">{item.name}</span>
                ) : (
                  <Link href={item.url} className="hover:text-medical-blue">
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </Container>

      {/* Article header */}
      <Section background="white" className="pt-6 md:pt-8">
        <Reveal mode="onMount" className="mx-auto max-w-3xl">
          {post.categories?.[0] && (
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-medical-blue">
              {post.categories[0].title}
            </span>
          )}
          <h1 className="mb-4">{post.title}</h1>
          <p className="mb-6 text-lg text-dark-gray leading-relaxed">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-light-grey py-4 text-sm text-dark-gray">
            {post.author?.name && (
              <div className="flex items-center gap-2">
                {hasImageAsset(post.author.photo) && (
                  <span className="relative h-8 w-8 overflow-hidden rounded-full">
                    <Image src={urlForImage(post.author.photo).width(64).height(64).fit("crop").url()} alt={post.author.name} fill sizes="32px" className="object-cover" />
                  </span>
                )}
                <span>
                  By <span className="font-medium text-charcoal">{post.author.name}</span>
                </span>
              </div>
            )}
            <span>Published {formatDate(post.publishedAt)}</span>
            {post.updatedAt && <span>Updated {formatDate(post.updatedAt)}</span>}
            <span>{estimateReadingTime(post.body)}</span>
          </div>

          {post.medicalReviewer && (
            <p className="mt-3 text-sm text-dark-gray">
              Medically reviewed by{" "}
              <span className="font-medium text-charcoal">
                {post.medicalReviewer.name}
                {post.medicalReviewer.credentials ? `, ${post.medicalReviewer.credentials}` : ""}
              </span>
            </p>
          )}
        </Reveal>

        {coverUrl && (
          <Reveal delay={0.05} className="relative mx-auto mt-8 aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-hero">
            <Image src={coverUrl} alt={post.title} fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" priority />
          </Reveal>
        )}
      </Section>

      {/* Body + TOC */}
      <Section background="white" className="pt-0">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 lg:mx-0 lg:max-w-none lg:grid-cols-[1fr_240px]">
          <Reveal className="mx-auto w-full max-w-3xl lg:mx-0">
            <PortableTextRenderer value={post.body} />

            {post.faqs && post.faqs.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4">Frequently Asked Questions</h2>
                <Accordion items={post.faqs} />
              </div>
            )}

            {post.references && post.references.length > 0 && (
              <div className="mt-10 border-t border-light-grey pt-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-dark-gray">References</h3>
                <ul className="space-y-1 text-sm text-dark-gray">
                  {post.references.map((ref) => (
                    <li key={ref.url}>
                      {ref.url ? (
                        <a href={ref.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-medical-blue">
                          {ref.label || ref.url}
                        </a>
                      ) : (
                        ref.label
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 rounded-lg bg-dark-navy p-6 text-center text-white sm:p-8">
              <h3 className="mb-2 text-white">Have a Question About Your Condition?</h3>
              <p className="mb-5 text-sm text-white/80">
                Book a consultation with {siteConfig.shortName} to discuss your symptoms and treatment options.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <BookAppointmentButton>Book an Appointment</BookAppointmentButton>
                <Button href={telHref(siteConfig.phone)} variant="secondary" className="border-white/40 bg-transparent text-white hover:bg-white/10">
                  Call {siteConfig.phone}
                </Button>
              </div>
            </div>
          </Reveal>

          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-lg border border-light-grey p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-dark-gray">On This Page</p>
                <ul className="space-y-2 text-sm">
                  {toc.map((item) => (
                    <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
                      <a href={`#${item.id}`} className="text-charcoal hover:text-medical-blue">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </Section>

      {/* Related treatments */}
      {post.relatedTreatments && post.relatedTreatments.length > 0 && (
        <Section background="light">
          <Reveal className="mb-10 text-center">
            <h2>Related Treatments</h2>
          </Reveal>
          <RevealGrid className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {post.relatedTreatments.map((t) => (
              <ServiceCard
                key={t.slug.current}
                icon={<ServiceIcon name={t.icon} className="h-6 w-6" />}
                title={t.title}
                description={t.shortDescription}
                href={treatmentPath(t.slug.current)}
              />
            ))}
          </RevealGrid>
        </Section>
      )}

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <Section background="white">
          <Reveal className="mb-10 text-center">
            <h2>Related Articles</h2>
          </Reveal>
          <RevealGrid className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((p) => (
              <Link key={p._id} href={`/blog/${p.slug.current}`} className="card-base card-shadow block overflow-hidden p-0">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-light-teal">
                  {hasImageAsset(p.coverImage) && (
                    <Image src={urlForImage(p.coverImage).width(600).height(375).fit("crop").url()} alt={p.title} fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="mb-2 text-base font-semibold text-dark-navy line-clamp-2">{p.title}</h3>
                  <p className="text-sm text-dark-gray line-clamp-2">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </RevealGrid>
        </Section>
      )}
    </>
  );
}
