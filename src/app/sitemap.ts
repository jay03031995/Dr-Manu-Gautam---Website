import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { siteConfig } from "@/lib/constants";
import { treatmentPath, locationPath, DOCTOR_PROFILE_PATH } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceSlugs, locationSlugs, blogSlugs] = await Promise.all([
    client.fetch<string[]>(`*[_type == "service" && defined(slug.current)].slug.current`),
    client.fetch<string[]>(`*[_type == "location" && defined(slug.current)].slug.current`),
    client.fetch<string[]>(`*[_type == "blogPost" && defined(slug.current)].slug.current`),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/about/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}${DOCTOR_PROFILE_PATH}`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/treatments/`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/locations/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/contact/`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/appointment/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/blog/`, changeFrequency: "weekly", priority: 0.7 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${siteConfig.url}/blog/${slug}/`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const treatmentRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${siteConfig.url}${treatmentPath(slug)}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const locationRoutes: MetadataRoute.Sitemap = locationSlugs.map((slug) => ({
    url: `${siteConfig.url}${locationPath(slug)}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...treatmentRoutes, ...locationRoutes, ...blogRoutes];
}
