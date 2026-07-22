import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons/Home";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  description: "Editable copy and images for the homepage hero, Why Choose, and Final CTA sections.",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "whyChoose", title: "Why Choose" },
    { name: "finalCta", title: "Final CTA" },
  ],
  fields: [
    // Hero
    defineField({
      name: "heroBadge",
      title: "Eyebrow badge",
      type: "string",
      group: "hero",
      description: "e.g. 'Advanced Orthopedic Care · Noida'",
    }),
    defineField({
      name: "heroHeadingLine1",
      title: "Heading — line 1 (bold serif)",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroHeadingLine2",
      title: "Heading — line 2 (italic serif)",
      type: "string",
      group: "hero",
    }),
    defineField({ name: "heroSubtext", title: "Subtext", type: "text", rows: 3, group: "hero" }),

    // Why Choose
    defineField({ name: "whyChooseHeading", title: "Heading", type: "string", group: "whyChoose" }),
    defineField({
      name: "whyChooseDescription",
      title: "Description",
      type: "text",
      rows: 3,
      group: "whyChoose",
    }),
    defineField({
      name: "whyChooseImage",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      group: "whyChoose",
    }),
    defineField({
      name: "whyChooseFeatures",
      title: "Features",
      type: "array",
      group: "whyChoose",
      of: [
        {
          type: "object",
          name: "feature",
          fields: [
            defineField({
              name: "icon",
              title: "Icon name",
              type: "string",
              description: "lucide-react icon name, e.g. 'Stethoscope', 'Bone'",
            }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
    }),
    defineField({
      name: "practiceStats",
      title: "Practice stats",
      type: "array",
      group: "whyChoose",
      of: [
        {
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "number", title: "Number", type: "string", description: "e.g. '15+', '2,500+'" }),
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "icon", title: "Icon name", type: "string" }),
          ],
          preview: { select: { title: "number", subtitle: "label" } },
        },
      ],
    }),

    // Final CTA
    defineField({ name: "finalCtaHeading", title: "Heading", type: "string", group: "finalCta" }),
    defineField({ name: "finalCtaSubtext", title: "Subtext", type: "text", rows: 2, group: "finalCta" }),
    defineField({
      name: "finalCtaImage",
      title: "Background image",
      type: "image",
      options: { hotspot: true },
      group: "finalCta",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page Content" }),
  },
});
