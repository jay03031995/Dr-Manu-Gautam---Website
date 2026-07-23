import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export default defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  icon: DocumentTextIcon,
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
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "doctor" }, { type: "teamMember" }],
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "blogCategory" }] }],
    }),
    defineField({ name: "coverImage", title: "Cover image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({ name: "body", title: "Body", type: "blockContent", validation: (Rule) => Rule.required() }),
    defineField({ name: "publishedAt", title: "Published at", type: "datetime", validation: (Rule) => Rule.required() }),
    defineField({ name: "updatedAt", title: "Last updated at", type: "datetime" }),
    defineField({
      name: "medicalReviewer",
      title: "Medically reviewed by",
      type: "reference",
      to: [{ type: "doctor" }],
      description: "Optional — set when the article's medical content has been reviewed by the doctor.",
    }),
    defineField({ name: "faqs", title: "FAQs", type: "array", of: [{ type: "reference", to: [{ type: "faq" }] }] }),
    defineField({
      name: "references",
      title: "References / sources",
      type: "array",
      of: [
        {
          type: "object",
          name: "referenceLink",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "url", type: "url", title: "URL" },
          ],
        },
      ],
    }),
    defineField({
      name: "relatedTreatments",
      title: "Related treatments",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    defineField({ name: "featured", title: "Show in featured articles", type: "boolean", initialValue: false }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [
    { title: "Newest first", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "coverImage" },
  },
});
