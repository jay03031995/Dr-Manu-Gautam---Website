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
 * (e.g. appointment/contact form submissions). Never import this from client
 * components.
 */
export function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_READ_TOKEN;

  if (!token) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN or SANITY_API_READ_TOKEN.");
  }

  return client.withConfig({
    useCdn: false,
    token,
  });
}
