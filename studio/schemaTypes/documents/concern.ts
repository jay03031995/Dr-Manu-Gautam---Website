import { defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons";

export default defineType({
  name: "concern",
  title: "Patient Concern",
  type: "document",
  icon: HelpCircleIcon,
  description: "Powers the homepage \"What Are You Experiencing?\" symptom-entry cards.",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "description",
      title: "Short description",
      type: "string",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "icon",
      title: "Icon name",
      type: "string",
      description: "lucide-react icon name, e.g. 'Bone', 'Footprints'. Used when no card image is set below.",
    }),
    defineField({
      name: "image",
      title: "Card image",
      type: "image",
      options: { hotspot: true },
      description: "Optional photo for the card. Falls back to the icon above when not set.",
    }),
    defineField({
      name: "linkedTreatment",
      title: "Links to treatment",
      type: "reference",
      to: [{ type: "service" }],
      description: "Preferred over a manual link — keeps the card pointed at real content.",
    }),
    defineField({
      name: "manualHref",
      title: "Manual link (fallback)",
      type: "string",
      description: "Used only if no treatment is linked above, e.g. '/treatments'.",
    }),
    defineField({ name: "order", title: "Display order", type: "number" }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "label", subtitle: "description", media: "image" },
  },
});
