import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/**
 * Server-only client for previewing draft content. Requires
 * SANITY_API_READ_TOKEN — never import this from client components.
 */
export function getPreviewClient() {
  return client.withConfig({
    useCdn: false,
    perspective: "previewDrafts",
    token: process.env.SANITY_API_READ_TOKEN,
  });
}

/**
 * Server-only client with write access, for API routes that create documents
 * (e.g. appointment/contact form submissions). Despite the env var's name,
 * SANITY_API_READ_TOKEN carries write scope in this project. Never import
 * this from client components.
 */
export function getWriteClient() {
  return client.withConfig({
    useCdn: false,
    token: process.env.SANITY_API_READ_TOKEN,
  });
}
