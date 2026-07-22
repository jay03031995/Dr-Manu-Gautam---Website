import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  // Rendered as a single "settings" entry in the Studio structure, not a list.
  fields: [
    defineField({ name: "siteName", title: "Site name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({ name: "phone", title: "Primary phone", type: "string" }),
    defineField({ name: "email", title: "Primary email", type: "string" }),
    defineField({
      name: "heroVideo",
      title: "Homepage hero background video",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      description: "Full-bleed background video for the homepage hero. Keep it short and under ~8MB — it autoplays muted and loops.",
    }),
    defineField({
      name: "heroPosterImage",
      title: "Homepage hero poster / fallback image",
      type: "image",
      options: { hotspot: true },
      description: "Shown while the video loads, and used instead of video on mobile/slow connections.",
    }),
    defineField({
      name: "social",
      title: "Social links",
      type: "object",
      fields: [
        { name: "facebook", type: "url", title: "Facebook" },
        { name: "instagram", type: "url", title: "Instagram" },
        { name: "youtube", type: "url", title: "YouTube" },
        { name: "linkedin", type: "url", title: "LinkedIn" },
      ],
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
    }),
    defineField({
      name: "googleAnalyticsId",
      title: "Google Analytics measurement ID",
      type: "string",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
