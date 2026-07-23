import { defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons";

export default defineType({
  name: "location",
  title: "Location",
  type: "document",
  icon: PinIcon,
  fields: [
    defineField({ name: "name", title: "Clinic name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "city", title: "City", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "addressLine", title: "Street address", type: "string" }),
    defineField({ name: "postalCode", title: "Postal code", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "hours",
      title: "Opening hours",
      type: "array",
      of: [
        {
          type: "object",
          name: "hoursEntry",
          fields: [
            { name: "days", title: "Days", type: "string" },
            { name: "time", title: "Time", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "coordinates",
      title: "Map coordinates",
      type: "geopoint",
    }),
    defineField({ name: "mapEmbedUrl", title: "Google Maps embed URL", type: "url" }),
    defineField({ name: "image", title: "Clinic photo", type: "image", options: { hotspot: true } }),
  ],
  preview: {
    select: { title: "name", subtitle: "city" },
  },
});
