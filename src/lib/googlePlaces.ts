import "server-only";
import { siteConfig } from "@/lib/constants";

export interface GoogleReview {
  authorName: string;
  authorPhotoUrl: string;
  authorUrl?: string;
  rating: number;
  relativeTime: string;
  text: string;
  time: number;
}

export interface GooglePlaceData {
  rating: number;
  totalReviews: number;
  mapsUrl: string;
  reviews: GoogleReview[];
}

interface FindPlaceResponse {
  status: string;
  candidates?: { place_id: string }[];
}

interface PlaceDetailsResponse {
  status: string;
  result?: {
    rating?: number;
    user_ratings_total?: number;
    url?: string;
    reviews?: {
      author_name: string;
      profile_photo_url: string;
      author_url?: string;
      rating: number;
      relative_time_description: string;
      text: string;
      time: number;
    }[];
  };
}

const FIND_PLACE_URL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
const PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";

async function resolvePlaceId(apiKey: string): Promise<string | null> {
  if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID;

  const url = new URL(FIND_PLACE_URL);
  url.searchParams.set("input", siteConfig.googlePlaceSearch.query);
  url.searchParams.set("inputtype", "textquery");
  url.searchParams.set("locationbias", siteConfig.googlePlaceSearch.locationBias);
  url.searchParams.set("fields", "place_id");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) return null;
  const data: FindPlaceResponse = await res.json();
  if (data.status !== "OK") return null;
  return data.candidates?.[0]?.place_id ?? null;
}

/** Fetches live rating + reviews for the practice's Google Business Profile.
 *  Returns null on any failure (missing key, no match, API error) so the UI
 *  can fall back to a "view on Google" state instead of breaking the page. */
export async function getGooglePlaceReviews(): Promise<GooglePlaceData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const placeId = await resolvePlaceId(apiKey);
    if (!placeId) return null;

    const url = new URL(PLACE_DETAILS_URL);
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "rating,user_ratings_total,url,reviews");
    url.searchParams.set("reviews_no_translations", "true");
    url.searchParams.set("key", apiKey);

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data: PlaceDetailsResponse = await res.json();
    if (data.status !== "OK" || !data.result) return null;

    const { result } = data;
    return {
      rating: result.rating ?? 0,
      totalReviews: result.user_ratings_total ?? 0,
      mapsUrl: result.url ?? siteConfig.googleMapsUrl,
      reviews: (result.reviews ?? []).map((r) => ({
        authorName: r.author_name,
        authorPhotoUrl: r.profile_photo_url,
        authorUrl: r.author_url,
        rating: r.rating,
        relativeTime: r.relative_time_description,
        text: r.text,
        time: r.time,
      })),
    };
  } catch {
    return null;
  }
}
