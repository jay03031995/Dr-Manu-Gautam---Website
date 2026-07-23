import { defineField, defineType } from "sanity";
import { ActivityIcon } from "@sanity/icons";

export default defineType({
  name: "condition",
  title: "Condition",
  type: "document",
  icon: ActivityIcon,
  description: "Patient-facing condition page (e.g. Knee Arthritis, ACL Injury) used for cross-linking from treatments.",
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
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({ name: "heroImage", title: "Hero image", type: "image", options: { hotspot: true } }),
    defineField({ name: "symptoms", title: "Common symptoms", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "causes", title: "Possible causes", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "body", title: "Full description", type: "blockContent" }),
    defineField({
      name: "relatedTreatments",
      title: "Related treatments",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    defineField({ name: "faqs", title: "FAQs", type: "array", of: [{ type: "reference", to: [{ type: "faq" }] }] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "shortDescription", media: "heroImage" },
  },
});
