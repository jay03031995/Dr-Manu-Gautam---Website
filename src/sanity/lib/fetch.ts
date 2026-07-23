import { client } from "@/sanity/lib/client";
import { clinicLocations } from "@/lib/constants";
import {
  siteSettingsQuery,
  homePageQuery,
  activeAnnouncementQuery,
  concernsQuery,
  featuredServicesQuery,
  serviceBySlugQuery,
  featuredTestimonialsQuery,
  videosQuery,
  locationsQuery,
  doctorBySlugQuery,
  blogPostsQuery,
  blogPostBySlugQuery,
  faqsQuery,
} from "@/sanity/lib/queries";
import type {
  Announcement,
  Concern,
  Doctor,
  Faq,
  HomePage,
  Location,
  Service,
  SiteSettings,
  Testimonial,
  Video,
} from "@/sanity/lib/types";
import type { BlogPost, BlogPostSummary } from "@/sanity/lib/types";

// revalidate: content changes in Sanity show up within a minute without a full redeploy.
const REVALIDATE_SECONDS = 60;

const canonicalLocations = clinicLocations.map((location) => ({
  ...location,
  slug: { ...location.slug },
  hours: location.hours.map((hours) => ({ ...hours })),
}));

function normalizeLocation(location: Location): Location {
  const key = location.slug.current === "ghaziabad" ? "delhi" : location.slug.current;
  const canonical = canonicalLocations.find((item) => item.slug.current === key || item._id === location._id);

  if (!canonical) return location;

  return {
    ...location,
    ...canonical,
    slug: { ...canonical.slug },
    hours: canonical.hours.map((hours) => ({ ...hours })),
    coordinates: location.coordinates,
    image: location.image,
  };
}

function normalizeLocations(locations?: Location[]) {
  const normalized = (locations ?? []).map(normalizeLocation);
  const seen = new Set(normalized.map((location) => location.slug.current));

  for (const canonical of canonicalLocations) {
    if (!seen.has(canonical.slug.current)) {
      normalized.push({
        ...canonical,
        slug: { ...canonical.slug },
        hours: canonical.hours.map((hours) => ({ ...hours })),
      });
    }
  }

  return normalized.sort((a, b) => {
    const aIndex = canonicalLocations.findIndex((location) => location.slug.current === a.slug.current);
    const bIndex = canonicalLocations.findIndex((location) => location.slug.current === b.slug.current);

    return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex);
  });
}

export function getSiteSettings() {
  return client.fetch<SiteSettings | null>(siteSettingsQuery, {}, { next: { revalidate: REVALIDATE_SECONDS } });
}

export function getHomePage() {
  return client.fetch<HomePage | null>(homePageQuery, {}, { next: { revalidate: REVALIDATE_SECONDS } });
}

export function getActiveAnnouncement() {
  return client.fetch<Announcement | null>(activeAnnouncementQuery, {}, { next: { revalidate: REVALIDATE_SECONDS } });
}

export function getConcerns() {
  return client.fetch<Concern[]>(concernsQuery, {}, { next: { revalidate: REVALIDATE_SECONDS } });
}

export function getFeaturedServices() {
  return client.fetch<Service[]>(featuredServicesQuery, {}, { next: { revalidate: REVALIDATE_SECONDS } });
}

export function getServiceBySlug(slug: string) {
  return client.fetch<Service | null>(serviceBySlugQuery, { slug }, { next: { revalidate: REVALIDATE_SECONDS } }).then((service) => {
    if (!service) return service;

    return {
      ...service,
      locations: service.locations ? normalizeLocations(service.locations) : service.locations,
    };
  });
}

export function getFeaturedTestimonials() {
  return client.fetch<Testimonial[]>(featuredTestimonialsQuery, {}, { next: { revalidate: REVALIDATE_SECONDS } });
}

export function getVideos() {
  return client.fetch<Video[]>(videosQuery, {}, { next: { revalidate: REVALIDATE_SECONDS } });
}

export function getLocations() {
  return client
    .fetch<Location[]>(locationsQuery, {}, { next: { revalidate: REVALIDATE_SECONDS } })
    .then((locations) => normalizeLocations(locations));
}

export function getLocationBySlug(slug: string) {
  return getLocations().then((locations) => locations.find((location) => location.slug.current === slug) ?? null);
}

export function getDoctorBySlug(slug: string) {
  return client.fetch<Doctor | null>(doctorBySlugQuery, { slug }, { next: { revalidate: REVALIDATE_SECONDS } }).then((doctor) => {
    if (!doctor) return doctor;

    return {
      ...doctor,
      locations: doctor.locations ? normalizeLocations(doctor.locations) : doctor.locations,
    };
  });
}

export function getBlogPosts() {
  return client.fetch<BlogPostSummary[]>(blogPostsQuery, {}, { next: { revalidate: REVALIDATE_SECONDS } });
}

export function getBlogPostBySlug(slug: string) {
  return client.fetch<BlogPost | null>(blogPostBySlugQuery, { slug }, { next: { revalidate: REVALIDATE_SECONDS } });
}

export function getFaqs() {
  return client.fetch<Faq[]>(faqsQuery, {}, { next: { revalidate: REVALIDATE_SECONDS } });
}
