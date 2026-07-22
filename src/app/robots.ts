import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

// A bare "Allow: /" for "*" already permits every crawler, AI included — the
// named rules below are for clarity, not because they change access: this is
// a medical practice site that wants to be found, cited and summarised by
// AI search/answer engines, so nothing here should ever disallow them.
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
