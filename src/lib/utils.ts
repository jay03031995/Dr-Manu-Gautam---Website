import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Strips spaces from a display-formatted phone number for use in tel: links. */
export function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

/** Canonical URL for a treatment detail page. Centralised so the URL structure
 *  only needs to change in one place. */
export function treatmentPath(slug: string) {
  return `/orthopaedic-surgeon/delhi-ncr/${slug}/`;
}

/** Canonical URL for a location page. */
export function locationPath(slug: string) {
  return `/orthopaedic-surgeon/${slug}/`;
}

/** The site runs with trailingSlash:true, which also redirects API routes —
 *  fetch calls must hit this exact (slash-terminated) path to avoid an extra
 *  redirect hop. Reuse this constant rather than typing the URL by hand. */
export const LEADS_API_PATH = "/api/leads/";
