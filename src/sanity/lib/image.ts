import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: SanityImageSource) {
  return imageBuilder.image(source);
}

/**
 * True only if the image has a resolved asset reference. An upload that was
 * interrupted in Studio (tab closed mid-upload, connection dropped) can leave
 * a `heroImage` object with `_upload` progress data but no `asset` — calling
 * urlForImage() on that produces a broken image instead of falling back.
 */
export function hasImageAsset(source: unknown): source is SanityImageSource {
  if (!source || typeof source !== "object") return false;
  const asset = (source as { asset?: unknown }).asset;
  return !!asset && typeof asset === "object";
}
