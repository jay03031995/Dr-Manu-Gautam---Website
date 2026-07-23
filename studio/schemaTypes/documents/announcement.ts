import { defineField, defineType } from "sanity";
import { BellIcon } from "@sanity/icons";

export default defineType({
  name: "announcement",
  title: "Announcement Bar",
  type: "document",
  icon: BellIcon,
  description: "The thin bar above the main header. Only one should be active at a time.",
  fields: [
    defineField({ name: "message", title: "Message", type: "string", validation: (Rule) => Rule.required().max(120) }),
    defineField({ name: "ctaLabel", title: "CTA label", type: "string" }),
    defineField({ name: "ctaHref", title: "CTA link", type: "string" }),
    defineField({ name: "startDate", title: "Start date", type: "date" }),
    defineField({ name: "endDate", title: "End date", type: "date" }),
    defineField({ name: "active", title: "Active", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "message", active: "active" },
    prepare: ({ title, active }) => ({ title, subtitle: active ? "Active" : "Inactive" }),
  },
});
