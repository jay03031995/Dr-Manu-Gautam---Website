import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons";

export default defineType({
  name: "video",
  title: "Video",
  type: "document",
  icon: PlayIcon,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({ name: "thumbnail", title: "Thumbnail (upload, optional)", type: "image", options: { hotspot: true } }),
    defineField({
      name: "externalThumbnailUrl",
      title: "Thumbnail URL (from YouTube)",
      type: "url",
      description: "Used automatically when no thumbnail is uploaded above.",
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "transcript", title: "Transcript", type: "blockContent" }),
    defineField({ name: "duration", title: "Duration", type: "string", description: "e.g. '4:32'" }),
    defineField({ name: "uploadDate", title: "Upload date", type: "date" }),
    defineField({
      name: "videoType",
      title: "Video type",
      type: "string",
      options: {
        list: [
          { title: "Patient education", value: "education" },
          { title: "Patient testimonial", value: "testimonial" },
          { title: "Procedure explainer", value: "procedure" },
        ],
      },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Powers the filter pills above the video carousel.",
      options: {
        list: [
          { title: "Knee", value: "knee" },
          { title: "Shoulder & Neck", value: "shoulder-neck" },
          { title: "Back Pain", value: "back" },
          { title: "Osteoarthritis", value: "osteoarthritis" },
          { title: "GFC / Regenerative", value: "gfc" },
        ],
      },
    }),
    defineField({ name: "order", title: "Display order", type: "number" }),
    defineField({ name: "treatment", title: "Related treatment", type: "reference", to: [{ type: "service" }] }),
    defineField({ name: "condition", title: "Related condition", type: "reference", to: [{ type: "condition" }] }),
    defineField({ name: "location", title: "Related location", type: "reference", to: [{ type: "location" }] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "videoType", media: "thumbnail" },
  },
});
