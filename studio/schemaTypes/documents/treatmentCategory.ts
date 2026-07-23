import { defineField, defineType } from "sanity";
import { FolderIcon } from "@sanity/icons";

export default defineType({
  name: "treatmentCategory",
  title: "Treatment Category",
  type: "document",
  icon: FolderIcon,
  description: "e.g. Joint Replacement, Arthroscopy, Sports Injury, Trauma, Paediatric Orthopaedics, Non-Surgical Care",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({
      name: "icon",
      title: "Icon name",
      type: "string",
      description: "lucide-react icon name",
    }),
    defineField({ name: "order", title: "Display order", type: "number" }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
