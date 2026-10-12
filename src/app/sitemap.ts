import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { siteConfig } from "@/lib/constants";
import { treatmentPath, locationPath, DOCTOR_PROFILE_PATH } from "@/lib/utils";

// Regenerate hourly. Without this the sitemap is built once at deploy time and
// served from the CDN cache, so posts published in Sanity afterwards never
// reach Google (10 September posts were missing from the live sitemap).
export const revalidate = 3600;

interface SitemapDoc {
  slug: string;
  updatedAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, locations, posts] = await Promise.all([
    client.fetch<SitemapDoc[]>(
      `*[_type == "service" && defined(slug.current) && seo.noIndex != true]{"slug": slug.current, "updatedAt": _updatedAt}`,
    ),
    client.fetch<SitemapDoc[]>(
      `*[_type == "location" && defined(slug.current)]{"slug": slug.current, "updatedAt": _updatedAt}`,
    ),
    client.fetch<SitemapDoc[]>(
      `*[_type == "blogPost" && defined(slug.current) && seo.noIndex != true]{"slug": slug.current, "updatedAt": coalesce(updatedAt, _updatedAt, publishedAt)}`,
    ),
  ]);

  // Static pages carry no lastmod: stamping every URL with the build time
  // tells Google nothing and teaches it to ignore lastmod for the whole site.
  // CMS-driven URLs below use their real last-edit timestamp.
  const lastModified = undefined;
  const latest = (docs: SitemapDoc[]) =>
    docs.reduce<string | undefined>((max, d) => (d.updatedAt && (!max || d.updatedAt > max) ? d.updatedAt : max), undefined);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}/`,
      lastModified: latest([...posts, ...services]),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/about/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}${DOCTOR_PROFILE_PATH}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/treatments/`,
      lastModified: latest(services),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/locations/`,
      lastModified: latest(locations),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/contact/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/appointment/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/blog/`,
      lastModified: latest(posts),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/best-doctor-of-knee-replacement-in-noida/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteConfig.url}/acl-tear-treatment-noida/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/orthopaedic-surgeon/ghaziabad/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/orthopaedic-surgeon/sector-20-noida/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/orthopaedic-surgeon/sector-104-noida/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map(({ slug, updatedAt }) => ({
    url: `${siteConfig.url}/blog/${slug}/`,
    lastModified: updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const treatmentRoutes: MetadataRoute.Sitemap = services.map(({ slug, updatedAt }) => ({
    url: `${siteConfig.url}${treatmentPath(slug)}`,
    lastModified: updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const locationRoutes: MetadataRoute.Sitemap = locations.map(({ slug, updatedAt }) => ({
    url: `${siteConfig.url}${locationPath(slug)}`,
    lastModified: updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...treatmentRoutes,
    ...locationRoutes,
    ...blogRoutes,
  ];
}
