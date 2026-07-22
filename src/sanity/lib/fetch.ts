import { client } from "@/sanity/lib/client";
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
  locationBySlugQuery,
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
  return client.fetch<Service | null>(serviceBySlugQuery, { slug }, { next: { revalidate: REVALIDATE_SECONDS } });
}

export function getFeaturedTestimonials() {
  return client.fetch<Testimonial[]>(featuredTestimonialsQuery, {}, { next: { revalidate: REVALIDATE_SECONDS } });
}

export function getVideos() {
  return client.fetch<Video[]>(videosQuery, {}, { next: { revalidate: REVALIDATE_SECONDS } });
}

export function getLocations() {
  return client.fetch<Location[]>(locationsQuery, {}, { next: { revalidate: REVALIDATE_SECONDS } });
}

export function getLocationBySlug(slug: string) {
  return client.fetch<Location | null>(locationBySlugQuery, { slug }, { next: { revalidate: REVALIDATE_SECONDS } });
}

export function getDoctorBySlug(slug: string) {
  return client.fetch<Doctor | null>(doctorBySlugQuery, { slug }, { next: { revalidate: REVALIDATE_SECONDS } });
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
