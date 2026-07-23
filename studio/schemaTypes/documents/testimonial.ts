import { defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({ name: "author", title: "Patient name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: { list: ["Google Review", "Direct"], layout: "radio" },
      initialValue: "Google Review",
      description:
        "Google Review = copied verbatim from the clinic's Google Business Profile with the patient's permission to feature it. Only used as a fallback on the homepage when the live Google Places API isn't configured.",
    }),
    defineField({
      name: "relativeTime",
      title: "Relative time (as shown on Google)",
      type: "string",
      description: "e.g. '5 days ago', '3 weeks ago' — copy exactly as it appeared on Google at the time of adding.",
    }),
    defineField({ name: "role", title: "Role / condition", type: "string", description: "e.g. 'Knee Replacement Patient' — used for Direct testimonials, not Google Reviews." }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5),
      initialValue: 5,
    }),
    defineField({ name: "quote", title: "Quote", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
    defineField({
      name: "relatedService",
      title: "Related treatment",
      type: "reference",
      to: [{ type: "service" }],
    }),
    defineField({ name: "featured", title: "Show on homepage", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Display order", type: "number" }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "author", subtitle: "role", media: "photo" },
  },
});
