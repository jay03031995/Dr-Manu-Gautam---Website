/**
 * schema.org JSON-LD for drmanugautam.com.
 *
 * Structure
 * ---------
 * Every page carries two connected @graph blocks:
 *   1. The site entity graph (rendered once in the (site) layout): WebSite,
 *      MedicalOrganization, Physician, Person, MedicalClinic (Noida), Hospital
 *      (Dharamshila Narayana) and their ImageObjects. Each has a stable @id so
 *      every page describes the same real-world entities.
 *   2. The page graph (rendered by each page): its WebPage (or a subtype),
 *      BreadcrumbList, and page-specific nodes (FAQPage, BlogPosting,
 *      MedicalProcedure, Service, ItemList). Page nodes point at the site
 *      entities by @id instead of repeating them.
 *
 * Rules kept here on purpose
 * --------------------------
 * - Only facts present on the site / CMS / Google Business Profile. No ratings
 *   or reviews: the reviews shown on the site come from Google, and Google's
 *   review-snippet policy disallows marking up reviews aggregated from another
 *   site (and ignores self-serving LocalBusiness ratings anyway).
 * - Enumerations use schema.org URLs (MedicalSpecialty, DayOfWeek,
 *   MedicalProcedureType) — plain strings like "Orthopedic" or "Monday" are
 *   flagged as errors by the Schema Markup Validator.
 * - Person-only properties (alumniOf, worksFor, honorificSuffix…) live on the
 *   Person node; Physician is an organization type in schema.org.
 */
import { clinicLocations, siteConfig } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";
import { DOCTOR_PROFILE_PATH, locationPath, treatmentPath } from "@/lib/utils";

type Node = Record<string, unknown>;

const SITE = siteConfig.url;
const ORTHOPAEDIC_SPECIALTY = "https://schema.org/Musculoskeletal";

export const schemaIds = {
  website: `${SITE}/#website`,
  organization: `${SITE}/#organization`,
  logo: `${SITE}/#logo`,
  physician: `${SITE}/#physician`,
  person: `${SITE}/#dr-manu-gautam`,
  personImage: `${SITE}/#dr-manu-gautam-photo`,
  clinic: `${SITE}/#clinic-noida`,
  hospital: `${SITE}/#hospital-dharamshila`,
} as const;

const ref = (id: string) => ({ "@id": id });

/** Strips undefined / empty-array values so the output stays clean. */
function compact<T extends Node>(node: T): T {
  const out: Node = {};
  for (const [k, v] of Object.entries(node)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out as T;
}

/** Wraps nodes in a single JSON-LD document. */
export function schemaGraph(nodes: (Node | null | undefined | false)[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean) as Node[],
  };
}

export function pageUrl(path: string) {
  return absoluteUrl(path);
}

// ---------------------------------------------------------------------------
// Shared value builders
// ---------------------------------------------------------------------------

const DAY_URL: Record<string, string> = {
  Monday: "https://schema.org/Monday",
  Tuesday: "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday: "https://schema.org/Thursday",
  Friday: "https://schema.org/Friday",
  Saturday: "https://schema.org/Saturday",
  Sunday: "https://schema.org/Sunday",
};

/** Groups siteConfig.openingHours into one spec per distinct time window. */
function clinicOpeningHours() {
  const groups = new Map<string, { opens: string; closes: string; days: string[] }>();
  for (const h of siteConfig.openingHours) {
    const key = `${h.opens}-${h.closes}`;
    const g = groups.get(key) ?? { opens: h.opens, closes: h.closes, days: [] };
    g.days.push(DAY_URL[h.days]);
    groups.set(key, g);
  }
  return Array.from(groups.values()).map((g) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: g.days,
    opens: g.opens,
    closes: g.closes,
  }));
}

function clinicAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.line1,
    addressLocality: siteConfig.address.locality,
    addressRegion: siteConfig.address.region,
    postalCode: siteConfig.address.postalCode,
    addressCountry: siteConfig.address.country,
  };
}

function clinicGeo() {
  return {
    "@type": "GeoCoordinates",
    latitude: siteConfig.geo.latitude,
    longitude: siteConfig.geo.longitude,
  };
}

const STATE_FOR_AREA: Record<string, string> = {
  Noida: "Uttar Pradesh",
  "Greater Noida": "Uttar Pradesh",
  Ghaziabad: "Uttar Pradesh",
  Delhi: "Delhi",
  "New Delhi": "Delhi",
};

/** Cities the practice serves, plus the clinic's own neighbourhood pages. */
function areaServed() {
  const cities = siteConfig.serviceAreas
    .filter((area) => area !== "Delhi NCR" && area !== "New Delhi")
    .map((name) =>
      compact({
        "@type": "City",
        name,
        containedInPlace: STATE_FOR_AREA[name]
          ? { "@type": "State", name: STATE_FOR_AREA[name] }
          : undefined,
      }),
    );
  return [
    ...cities,
    { "@type": "Place", name: "Sector 20, Noida" },
    { "@type": "Place", name: "Sector 104, Noida" },
    { "@type": "AdministrativeArea", name: "Delhi NCR" },
  ];
}

function socialProfiles() {
  return Object.values(siteConfig.social);
}

// ---------------------------------------------------------------------------
// Site entity graph (layout)
// ---------------------------------------------------------------------------

export interface SiteGraphDoctor {
  name: string;
  credentials?: string;
  specialties?: string[];
  education?: string[];
  memberships?: string[];
  photo?: { url: string; width?: number; height?: number };
}

export interface SiteGraphService {
  title: string;
  slug: string;
}

/** Splits CMS education lines ("MBBS - Government Medical College, Bellary"). */
function parseEducation(line: string) {
  const [credential, ...rest] = line.split(" - ");
  const institution = rest.join(" - ").trim();
  return { credential: credential.trim(), institution: institution || undefined };
}

export function buildSiteGraph({
  doctor,
  services = [],
}: {
  doctor?: SiteGraphDoctor | null;
  services?: SiteGraphService[];
}) {
  const doctorName = doctor?.name ?? siteConfig.shortName;
  const clinic = clinicLocations.find((l) => l.slug.current === "noida") ?? clinicLocations[0];
  const hospital = siteConfig.hospital;
  const education = (doctor?.education ?? []).map(parseEducation);
  const profileUrl = pageUrl(DOCTOR_PROFILE_PATH);
  const allProfiles = [...socialProfiles(), ...siteConfig.directoryProfiles];

  const logo: Node = {
    "@type": "ImageObject",
    "@id": schemaIds.logo,
    url: absoluteUrl(siteConfig.logo),
    contentUrl: absoluteUrl(siteConfig.logo),
    width: 944,
    height: 264,
    caption: siteConfig.name,
    inLanguage: "en-IN",
  };

  const personImage: Node | null = doctor?.photo
    ? compact({
        "@type": "ImageObject",
        "@id": schemaIds.personImage,
        url: doctor.photo.url,
        contentUrl: doctor.photo.url,
        width: doctor.photo.width,
        height: doctor.photo.height,
        caption: `${doctorName}, Orthopaedic Surgeon in Noida`,
        inLanguage: "en-IN",
      })
    : null;
  const doctorImageRef = personImage ? ref(schemaIds.personImage) : ref(schemaIds.logo);

  const website: Node = {
    "@type": "WebSite",
    "@id": schemaIds.website,
    url: `${SITE}/`,
    name: siteConfig.shortName,
    alternateName: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "en-IN",
    publisher: ref(schemaIds.organization),
    about: ref(schemaIds.physician),
  };

  const organization: Node = compact({
    "@type": "MedicalOrganization",
    "@id": schemaIds.organization,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: `${SITE}/`,
    description: siteConfig.description,
    logo: ref(schemaIds.logo),
    image: ref(schemaIds.logo),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: clinicAddress(),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        contactType: "appointments",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
      {
        "@type": "ContactPoint",
        telephone: siteConfig.emergencyPhone,
        contactType: "emergency",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
    medicalSpecialty: ORTHOPAEDIC_SPECIALTY,
    founder: ref(schemaIds.person),
    employee: ref(schemaIds.person),
    location: [ref(schemaIds.clinic), ref(schemaIds.hospital)],
    areaServed: areaServed(),
    sameAs: [...socialProfiles(), siteConfig.googleBusinessProfileUrl],
  });

  const physician: Node = compact({
    "@type": "Physician",
    "@id": schemaIds.physician,
    name: `${doctorName} - Orthopaedic Surgeon`,
    alternateName: doctorName,
    url: profileUrl,
    description: `Orthopaedic and joint replacement surgeon in Sector 20, Noida, also consulting at ${hospital.name}, New Delhi.`,
    image: doctorImageRef,
    logo: ref(schemaIds.logo),
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: clinicAddress(),
    geo: clinicGeo(),
    hasMap: siteConfig.googleBusinessProfileUrl,
    openingHoursSpecification: clinicOpeningHours(),
    priceRange: siteConfig.priceRange,
    currenciesAccepted: "INR",
    medicalSpecialty: ORTHOPAEDIC_SPECIALTY,
    isAcceptingNewPatients: true,
    hospitalAffiliation: ref(schemaIds.hospital),
    employee: ref(schemaIds.person),
    parentOrganization: ref(schemaIds.organization),
    location: [ref(schemaIds.clinic), ref(schemaIds.hospital)],
    areaServed: areaServed(),
    availableService: services.map((s) => ({
      "@type": "MedicalProcedure",
      name: s.title,
      url: pageUrl(treatmentPath(s.slug)),
    })),
    sameAs: [siteConfig.googleBusinessProfileUrl, ...siteConfig.directoryProfiles],
  });

  const person: Node = compact({
    "@type": "Person",
    "@id": schemaIds.person,
    name: doctorName,
    givenName: "Manu",
    familyName: "Gautam",
    honorificPrefix: "Dr.",
    honorificSuffix: doctor?.credentials,
    jobTitle: "Orthopaedic Surgeon",
    description: `${doctorName} is an orthopaedic and joint replacement surgeon practising in Noida and Delhi NCR.`,
    url: profileUrl,
    image: doctorImageRef,
    gender: "https://schema.org/Male",
    hasOccupation: {
      "@type": "Occupation",
      name: "Orthopaedic Surgeon",
      occupationLocation: [
        { "@type": "City", name: "Noida" },
        { "@type": "City", name: "New Delhi" },
      ],
    },
    worksFor: [ref(schemaIds.organization), ref(schemaIds.hospital)],
    affiliation: ref(schemaIds.hospital),
    alumniOf: education
      .filter((e) => e.institution)
      .map((e) => ({ "@type": "EducationalOrganization", name: e.institution })),
    hasCredential: education.map((e) =>
      compact({
        "@type": "EducationalOccupationalCredential",
        name: e.credential,
        credentialCategory: "degree",
        recognizedBy: e.institution
          ? { "@type": "EducationalOrganization", name: e.institution }
          : undefined,
      }),
    ),
    memberOf: (doctor?.memberships ?? []).map((name) => ({ "@type": "Organization", name })),
    knowsAbout: [
      "Orthopaedic surgery",
      ...(doctor?.specialties ?? []),
      "Growth Factor Concentrate (GFC) knee injection",
    ],
    knowsLanguage: ["en", "hi"],
    mainEntityOfPage: profileUrl,
    sameAs: allProfiles,
  });

  const clinicNode: Node = compact({
    "@type": "MedicalClinic",
    "@id": schemaIds.clinic,
    name: clinic.name,
    url: pageUrl(locationPath("noida")),
    image: doctorImageRef,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: clinicAddress(),
    geo: clinicGeo(),
    hasMap: siteConfig.googleBusinessProfileUrl,
    openingHoursSpecification: clinicOpeningHours(),
    priceRange: siteConfig.priceRange,
    currenciesAccepted: "INR",
    medicalSpecialty: ORTHOPAEDIC_SPECIALTY,
    parentOrganization: ref(schemaIds.organization),
    employee: ref(schemaIds.person),
    areaServed: areaServed(),
    sameAs: [siteConfig.googleBusinessProfileUrl],
  });

  const hospitalNode: Node = {
    "@type": "Hospital",
    "@id": schemaIds.hospital,
    name: hospital.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: hospital.streetAddress,
      addressLocality: hospital.locality,
      addressRegion: hospital.region,
      postalCode: hospital.postalCode,
      addressCountry: hospital.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: hospital.geo.latitude,
      longitude: hospital.geo.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: Object.values(DAY_URL),
      opens: "00:00",
      closes: "23:59",
    },
    medicalSpecialty: ORTHOPAEDIC_SPECIALTY,
  };

  return schemaGraph([
    website,
    organization,
    logo,
    physician,
    person,
    personImage,
    clinicNode,
    hospitalNode,
  ]);
}

// ---------------------------------------------------------------------------
// Page-level nodes
// ---------------------------------------------------------------------------

export type WebPageType =
  | "WebPage"
  | "MedicalWebPage"
  | "AboutPage"
  | "ProfilePage"
  | "ContactPage"
  | "CollectionPage";

export interface WebPageOptions {
  path: string;
  name: string;
  description?: string;
  type?: WebPageType;
  /** @id of the entity the page is about (defaults to the Physician). */
  about?: string;
  /** @id of the page's main entity (e.g. the Person on the profile page). */
  mainEntity?: string;
  image?: string;
  breadcrumb?: boolean;
  datePublished?: string;
  dateModified?: string;
  /** A place the page content describes, e.g. "Ghaziabad". */
  contentLocation?: string;
  /** Used on noindex pages to keep them out of the entity graph's focus. */
  isUtility?: boolean;
}

export function buildWebPageNode(o: WebPageOptions): Node {
  const url = pageUrl(o.path);
  return compact({
    "@type": o.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: o.name,
    description: o.description,
    inLanguage: "en-IN",
    isPartOf: ref(schemaIds.website),
    about: o.isUtility ? undefined : ref(o.about ?? schemaIds.physician),
    mainEntity: o.mainEntity ? ref(o.mainEntity) : undefined,
    primaryImageOfPage: o.image
      ? { "@type": "ImageObject", url: absoluteUrl(o.image) }
      : undefined,
    breadcrumb: o.breadcrumb === false ? undefined : ref(`${url}#breadcrumb`),
    datePublished: o.datePublished,
    dateModified: o.dateModified,
    contentLocation: o.contentLocation ? { "@type": "Place", name: o.contentLocation } : undefined,
    publisher: ref(schemaIds.organization),
  });
}

export function buildBreadcrumbNode(path: string, items: { name: string; url: string }[]): Node {
  const url = pageUrl(path);
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

function plainText(text: string) {
  return text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function buildFaqNode(path: string, items: { question: string; answer: string }[]): Node | null {
  const clean = items.filter((i) => i.question?.trim() && i.answer?.trim());
  if (!clean.length) return null;
  const url = pageUrl(path);
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    inLanguage: "en-IN",
    isPartOf: ref(`${url}#webpage`),
    mainEntity: clean.map((item) => ({
      "@type": "Question",
      name: plainText(item.question),
      acceptedAnswer: { "@type": "Answer", text: plainText(item.answer) },
    })),
  };
}

export interface BlogPostingOptions {
  path: string;
  headline: string;
  description: string;
  image?: { url: string; width: number; height: number };
  datePublished: string;
  dateModified?: string;
  sections?: string[];
}

export function buildBlogPostingNode(o: BlogPostingOptions): Node {
  const url = pageUrl(o.path);
  return compact({
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    // Google truncates headlines past 110 characters.
    headline: o.headline.length > 110 ? `${o.headline.slice(0, 107)}...` : o.headline,
    description: o.description,
    image: o.image
      ? { "@type": "ImageObject", url: o.image.url, width: o.image.width, height: o.image.height }
      : ref(schemaIds.logo),
    datePublished: o.datePublished,
    dateModified: o.dateModified ?? o.datePublished,
    author: {
      "@type": "Person",
      "@id": schemaIds.person,
      name: siteConfig.shortName,
      url: pageUrl(DOCTOR_PROFILE_PATH),
    },
    publisher: ref(schemaIds.organization),
    isPartOf: ref(`${url}#webpage`),
    mainEntityOfPage: ref(`${url}#webpage`),
    articleSection: o.sections,
    inLanguage: "en-IN",
  });
}

/**
 * How each treatment page is modelled. Specific procedures are
 * MedicalProcedure subtypes; broad service lines (spine care, trauma care…)
 * are a Service, because calling "Spine Care" a single procedure is inaccurate.
 */
interface TreatmentModel {
  procedureType?: "SurgicalProcedure" | "MedicalProcedure" | "PhysicalTherapy";
  procedureKind?: "https://schema.org/PercutaneousProcedure" | "https://schema.org/NoninvasiveProcedure";
  bodyLocation?: string[];
  serviceType: string;
}

const TREATMENT_MODELS: Record<string, TreatmentModel> = {
  "joint-replacement": {
    procedureType: "SurgicalProcedure",
    bodyLocation: ["Knee", "Hip", "Shoulder"],
    serviceType: "Joint replacement surgery",
  },
  "robotic-knee-replacement": {
    procedureType: "SurgicalProcedure",
    bodyLocation: ["Knee"],
    serviceType: "Robotic knee replacement surgery",
  },
  "gfc-injection": {
    procedureType: "MedicalProcedure",
    procedureKind: "https://schema.org/PercutaneousProcedure",
    bodyLocation: ["Knee"],
    serviceType: "Growth Factor Concentrate (GFC) knee injection",
  },
  "hip-replacement": {
    procedureType: "SurgicalProcedure",
    bodyLocation: ["Hip"],
    serviceType: "Hip replacement surgery",
  },
  "shoulder-replacement": {
    procedureType: "SurgicalProcedure",
    bodyLocation: ["Shoulder"],
    serviceType: "Shoulder replacement surgery",
  },
  rehabilitation: {
    procedureType: "PhysicalTherapy",
    serviceType: "Orthopaedic rehabilitation",
  },
  "spine-care": { serviceType: "Spine care" },
  "sports-injuries": { serviceType: "Sports injury treatment" },
  "trauma-care": { serviceType: "Fracture and orthopaedic trauma care" },
  "pediatric-orthopedics": { serviceType: "Paediatric orthopaedics" },
};

export interface TreatmentOptions {
  slug: string;
  path: string;
  name: string;
  description: string;
  /** Overrides the slug-based model (used by standalone landing pages). */
  model?: TreatmentModel;
}

/** MedicalProcedure (when the page is one procedure) + Service offered locally. */
export function buildTreatmentNodes(o: TreatmentOptions): Node[] {
  const url = pageUrl(o.path);
  const model = o.model ?? TREATMENT_MODELS[o.slug] ?? { serviceType: o.name };
  const nodes: Node[] = [];

  if (model.procedureType) {
    nodes.push(
      compact({
        "@type": model.procedureType,
        "@id": `${url}#procedure`,
        name: o.name,
        description: o.description,
        url,
        procedureType: model.procedureKind,
        bodyLocation: model.bodyLocation,
        relevantSpecialty: ORTHOPAEDIC_SPECIALTY,
        mainEntityOfPage: ref(`${url}#webpage`),
      }),
    );
  }

  nodes.push(
    compact({
      "@type": "Service",
      "@id": `${url}#service`,
      name: o.name,
      serviceType: model.serviceType,
      description: o.description,
      url,
      provider: ref(schemaIds.physician),
      areaServed: areaServed(),
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: pageUrl("/appointment"),
        servicePhone: { "@type": "ContactPoint", telephone: siteConfig.phone, contactType: "appointments" },
        serviceLocation: [ref(schemaIds.clinic), ref(schemaIds.hospital)],
      },
      category: "Orthopaedic surgery",
      mainEntityOfPage: ref(`${url}#webpage`),
    }),
  );

  return nodes;
}

export function buildItemListNode(path: string, name: string, items: { name: string; url: string }[]): Node | null {
  if (!items.length) return null;
  const url = pageUrl(path);
  return {
    "@type": "ItemList",
    "@id": `${url}#itemlist`,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.url),
    })),
  };
}

/** Maps a /orthopaedic-surgeon/{slug}/ location page to its entity @id. */
export function locationEntityId(slug: string) {
  return slug === "delhi" ? schemaIds.hospital : schemaIds.clinic;
}
