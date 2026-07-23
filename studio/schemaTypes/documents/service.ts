import { defineField, defineType } from "sanity";
import { HeartIcon } from "@sanity/icons";

export default defineType({
  name: "service",
  title: "Treatment",
  type: "document",
  icon: HeartIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "clinical", title: "Clinical Detail" },
    { name: "relations", title: "Related Content" },
    { name: "review", title: "Medical Review" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Treatment category",
      type: "reference",
      group: "content",
      to: [{ type: "treatmentCategory" }],
    }),
    defineField({
      name: "icon",
      title: "Icon name",
      type: "string",
      group: "content",
      description: "lucide-react icon name, e.g. 'Bone', 'Activity'",
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 3,
      group: "content",
      description: "Used on cards and listing pages",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "introduction",
      title: "Patient-friendly introduction",
      type: "text",
      rows: 4,
      group: "content",
      description: "Opens the treatment page below the H1 — plain-language framing before the clinical detail.",
    }),
    defineField({ name: "heroImage", title: "Hero image", type: "image", group: "content", options: { hotspot: true } }),
    defineField({
      name: "heroTrustPoints",
      title: "Hero trust points",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      description: "2–3 short reassurance points shown under the hero CTAs, e.g. 'Detailed orthopedic evaluation'",
      validation: (Rule) => Rule.max(4),
    }),
    defineField({ name: "body", title: "Overview", type: "blockContent", group: "content" }),

    defineField({
      name: "treatmentTypes",
      title: "Treatment types",
      type: "array",
      group: "clinical",
      description: "For multi-modality treatments (e.g. Joint Replacement covering knee/hip/shoulder). Leave empty if not applicable.",
      of: [
        {
          type: "object",
          name: "treatmentType",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "description", type: "text", rows: 3, title: "Description" },
            { name: "ctaLabel", type: "string", title: "CTA label" },
            {
              name: "linkedService",
              type: "reference",
              title: "Links to treatment",
              to: [{ type: "service" }],
              description: "Preferred over a manual link.",
            },
            { name: "manualHref", type: "string", title: "Manual link (fallback)" },
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
    }),

    // Clinical detail — the bulk of the 29-section template
    defineField({ name: "conditionsTreated", title: "Conditions treated (quick list)", type: "array", group: "clinical", of: [{ type: "string" }] }),
    defineField({
      name: "conditionsGrid",
      title: "Conditions that may require this treatment (detailed grid)",
      type: "array",
      group: "clinical",
      of: [
        {
          type: "object",
          name: "conditionEntry",
          fields: [
            { name: "title", type: "string", title: "Condition" },
            { name: "description", type: "text", rows: 2, title: "One–two sentence explanation" },
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
    }),
    defineField({ name: "symptoms", title: "Symptoms that may require evaluation", type: "array", group: "clinical", of: [{ type: "string" }] }),
    defineField({ name: "whenToConsult", title: "When to consult an orthopaedic surgeon", type: "blockContent", group: "clinical" }),
    defineField({ name: "diagnosis", title: "Diagnosis and investigations", type: "blockContent", group: "clinical" }),
    defineField({ name: "nonSurgicalOptions", title: "Non-surgical treatment options", type: "blockContent", group: "clinical" }),
    defineField({ name: "whenSurgeryConsidered", title: "When surgery may be considered", type: "blockContent", group: "clinical" }),
    defineField({
      name: "candidacy",
      title: "Who may be a candidate (intro text)",
      type: "blockContent",
      group: "clinical",
      description: "General framing before the candidacy checklist below.",
    }),
    defineField({
      name: "candidacyChecklist",
      title: "\"You may be evaluated for this treatment when…\" checklist",
      type: "array",
      group: "clinical",
      of: [{ type: "string" }],
    }),
    defineField({ name: "surgicalProcedure", title: "Surgical procedure", type: "blockContent", group: "clinical" }),
    defineField({ name: "technologyUsed", title: "Technology or techniques used", type: "blockContent", group: "clinical" }),
    defineField({ name: "benefits", title: "Potential benefits", type: "array", group: "clinical", of: [{ type: "string" }] }),
    defineField({ name: "risks", title: "Risks and limitations", type: "array", group: "clinical", of: [{ type: "string" }] }),
    defineField({ name: "preparation", title: "Preparation before treatment", type: "blockContent", group: "clinical" }),
    defineField({ name: "recovery", title: "Recovery timeline (narrative)", type: "blockContent", group: "clinical" }),
    defineField({
      name: "recoveryStages",
      title: "Recovery timeline (visual stages)",
      type: "array",
      group: "clinical",
      description: "Preferred over the narrative field above when set — renders as a visual timeline.",
      of: [
        {
          type: "object",
          name: "recoveryStage",
          fields: [
            { name: "stage", type: "string", title: "Stage label", description: "e.g. 'Stage 1'" },
            { name: "title", type: "string", title: "Title", description: "e.g. 'Before Surgery'" },
            { name: "description", type: "text", rows: 2, title: "Description" },
          ],
          preview: { select: { title: "title", subtitle: "stage" } },
        },
      ],
    }),
    defineField({ name: "rehabilitation", title: "Rehabilitation guidance", type: "blockContent", group: "clinical" }),
    defineField({ name: "urgentCare", title: "When to seek urgent medical help", type: "blockContent", group: "clinical" }),
    defineField({ name: "whyThisDoctor", title: "Why consult this practice", type: "blockContent", group: "clinical" }),
    defineField({
      name: "references",
      title: "References",
      type: "array",
      group: "clinical",
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

    // Related content
    defineField({ name: "locations", title: "Locations offering this treatment", type: "array", group: "relations", of: [{ type: "reference", to: [{ type: "location" }] }] }),
    defineField({ name: "doctor", title: "Doctor", type: "reference", group: "relations", to: [{ type: "doctor" }] }),
    defineField({ name: "testimonials", title: "Patient stories", type: "array", group: "relations", of: [{ type: "reference", to: [{ type: "testimonial" }] }] }),
    defineField({ name: "videos", title: "Related videos", type: "array", group: "relations", of: [{ type: "reference", to: [{ type: "video" }] }] }),
    defineField({ name: "relatedTreatments", title: "Related treatments", type: "array", group: "relations", of: [{ type: "reference", to: [{ type: "service" }] }] }),
    defineField({ name: "relatedConditions", title: "Related conditions", type: "array", group: "relations", of: [{ type: "reference", to: [{ type: "condition" }] }] }),
    defineField({ name: "faqs", title: "FAQs", type: "array", group: "relations", of: [{ type: "reference", to: [{ type: "faq" }] }] }),

    // Medical review
    defineField({ name: "medicalReviewer", title: "Medical reviewer", type: "reference", group: "review", to: [{ type: "doctor" }] }),
    defineField({ name: "reviewDate", title: "Last reviewed", type: "date", group: "review" }),

    defineField({ name: "featured", title: "Show on homepage", type: "boolean", group: "content", initialValue: false }),
    defineField({ name: "order", title: "Display order", type: "number", group: "content" }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "shortDescription", media: "heroImage" },
  },
});
