import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons/User";

export default defineType({
  name: "doctor",
  title: "Doctor",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "credentials", title: "Credentials", type: "string", description: "e.g. MBBS, MS Ortho" }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "specialties", title: "Specialties", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "yearsExperience", title: "Years of experience", type: "number" }),
    defineField({ name: "bio", title: "Biography", type: "blockContent" }),
    defineField({ name: "education", title: "Education", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "memberships", title: "Professional memberships", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "locations",
      title: "Practices at",
      type: "array",
      of: [{ type: "reference", to: [{ type: "location" }] }],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "name", subtitle: "credentials", media: "photo" },
  },
});
