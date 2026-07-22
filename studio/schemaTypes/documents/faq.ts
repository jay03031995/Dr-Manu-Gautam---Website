import { defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "General", value: "general" },
          { title: "Appointments", value: "appointments" },
          { title: "Insurance", value: "insurance" },
          { title: "Treatments", value: "treatments" },
        ],
      },
      initialValue: "general",
    }),
  ],
  preview: {
    select: { title: "question", subtitle: "category" },
  },
});
