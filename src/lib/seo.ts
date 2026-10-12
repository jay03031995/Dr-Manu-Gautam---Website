import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";

interface PageMetaOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  keywords?: string[];
}

export function normalizePath(path = "") {
  if (!path || path === "/") return "/";
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  if (/\.[a-z0-9]{2,5}$/i.test(withLeadingSlash)) return withLeadingSlash;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
}

export function absoluteUrl(pathOrUrl = "") {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${siteConfig.url}${normalizePath(pathOrUrl)}`;
}

/** Builds a Next.js Metadata object with sensible OG/Twitter defaults for a page. */
export function buildPageMetadata({
  title,
  description,
  path = "",
  image,
  imageAlt,
  type = "website",
  noIndex = false,
  keywords = [],
}: PageMetaOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image ?? siteConfig.ogImage);

  // The root layout's title template appends " | Dr. Manu Gautam". Skip it when
  // the title already names the doctor (avoids "… | Dr. Manu Gautam | Dr. Manu
  // Gautam") or when the suffix would push the title past ~65 characters,
  // where Google truncates it.
  const suffix = ` | ${siteConfig.shortName}`;
  const fullTitle =
    title.includes(siteConfig.shortName) || title.length + suffix.length > 65
      ? { absolute: title }
      : title;

  return {
    title: fullTitle,
    description,
    keywords: [
      "orthopedic surgeon in Noida",
      "orthopaedic surgeon in Delhi NCR",
      "Dr Manu Gautam",
      "joint replacement surgeon",
      "robotic knee replacement Noida",
      "sports injury specialist",
      "spine care Noida",
      ...keywords,
    ],
    alternates: { canonical: url },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.shortName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: image ? 675 : 630,
          alt: imageAlt ?? `${siteConfig.shortName} - Orthopedic care in Noida and Delhi NCR`,
        },
      ],
      locale: siteConfig.locale,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    category: "healthcare",
  };
}
