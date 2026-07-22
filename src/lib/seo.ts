import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";

interface PageMetaOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

/** Builds a Next.js Metadata object with sensible OG/Twitter defaults for a page. */
export function buildPageMetadata({ title, description, path = "", image }: PageMetaOptions): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ?? siteConfig.ogImage;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.shortName,
      images: [ogImage],
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** schema.org MedicalOrganization + LocalBusiness markup for Noida/Ghaziabad local SEO. */
export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalOrganization", "LocalBusiness"],
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.line1,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    areaServed: siteConfig.serviceAreas.map((name) => ({ "@type": "City", name })),
    medicalSpecialty: "Orthopedic",
    sameAs: Object.values(siteConfig.social),
  };
}

interface PhysicianSchemaOptions {
  credentials?: string;
  url?: string;
  education?: string[];
  memberships?: string[];
}

export function buildPhysicianSchema(name: string, image?: string, options?: PhysicianSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name,
    image,
    url: options?.url,
    honorificSuffix: options?.credentials,
    medicalSpecialty: "Orthopedic",
    worksFor: {
      "@type": "MedicalOrganization",
      name: siteConfig.name,
    },
    alumniOf: options?.education?.map((school) => ({ "@type": "EducationalOrganization", name: school })),
    memberOf: options?.memberships?.map((org) => ({ "@type": "Organization", name: org })),
  };
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

interface MedicalProcedureOptions {
  name: string;
  description: string;
  url: string;
  bodyLocation?: string[];
  howPerformed?: string;
  preparation?: string;
  followup?: string;
}

export function buildMedicalProcedureSchema(options: MedicalProcedureOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: options.name,
    description: options.description,
    url: options.url,
    procedureType: "https://schema.org/SurgicalProcedure",
    ...(options.bodyLocation?.length ? { bodyLocation: options.bodyLocation } : {}),
    relevantSpecialty: {
      "@type": "MedicalSpecialty",
      name: "Orthopedic",
    },
    ...(options.howPerformed ? { howPerformed: options.howPerformed } : {}),
    ...(options.preparation ? { preparation: options.preparation } : {}),
    ...(options.followup ? { followup: options.followup } : {}),
    status: "https://schema.org/EventScheduled",
  };
}

interface MedicalClinicOptions {
  name: string;
  url: string;
  telephone?: string;
  streetAddress?: string;
  addressLocality?: string;
  postalCode?: string;
  openingHours?: { days: string; time: string }[];
}

export function buildMedicalClinicSchema(options: MedicalClinicOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: options.name,
    url: options.url,
    ...(options.telephone ? { telephone: options.telephone } : {}),
    address: {
      "@type": "PostalAddress",
      ...(options.streetAddress ? { streetAddress: options.streetAddress } : {}),
      ...(options.addressLocality ? { addressLocality: options.addressLocality } : {}),
      ...(options.postalCode ? { postalCode: options.postalCode } : {}),
      addressCountry: siteConfig.address.country,
    },
    ...(options.openingHours?.length
      ? {
          openingHoursSpecification: options.openingHours.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days,
            description: h.time,
          })),
        }
      : {}),
    medicalSpecialty: "Orthopedic",
  };
}

export function buildWebPageSchema(options: { name: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: options.name,
    description: options.description,
    url: options.url,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

interface ArticleOptions {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}

export function buildArticleSchema(options: ArticleOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: options.headline,
    description: options.description,
    url: options.url,
    ...(options.image ? { image: options.image } : {}),
    datePublished: options.datePublished,
    dateModified: options.dateModified ?? options.datePublished,
    author: {
      "@type": "Person",
      name: options.authorName ?? siteConfig.shortName,
    },
    publisher: {
      "@type": "MedicalOrganization",
      name: siteConfig.name,
    },
  };
}

export function buildFaqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
