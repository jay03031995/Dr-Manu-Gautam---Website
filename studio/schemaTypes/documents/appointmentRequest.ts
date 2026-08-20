import { defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export default defineType({
  name: "appointmentRequest",
  title: "Appointment Request",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "phone", title: "Phone", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "city", title: "City", type: "string" }),
    defineField({
      name: "preferredLocation",
      title: "Preferred location",
      type: "reference",
      to: [{ type: "location" }],
    }),
    defineField({
      name: "service",
      title: "Treatment interested in",
      type: "reference",
      to: [{ type: "service" }],
    }),
    defineField({ name: "message", title: "Message", type: "text", rows: 4 }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Appointment Page", value: "appointment" },
          { title: "Contact Page", value: "contact" },
          { title: "Popup", value: "popup" },
          { title: "Landing Page", value: "landing-page" },
        ],
      },
      readOnly: true,
    }),
    defineField({
      name: "submissionAction",
      title: "Submission action",
      type: "string",
      options: {
        list: [
          { title: "Callback Request", value: "callback_request" },
          { title: "WhatsApp Redirect", value: "whatsapp_redirect" },
          { title: "Thank You Redirect", value: "thank_you_redirect" },
        ],
      },
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Scheduled", value: "scheduled" },
          { title: "Closed", value: "closed" },
        ],
      },
      initialValue: "new",
    }),
    defineField({ name: "submittedAt", title: "Submitted at", type: "datetime", validation: (Rule) => Rule.required() }),
  ],
  orderings: [
    { title: "Newest first", name: "submittedDesc", by: [{ field: "submittedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "phone", city: "city", source: "source", status: "status" },
    prepare: ({ title, subtitle, city, source, status }) => ({
      title,
      subtitle: [subtitle, city, source, status].filter(Boolean).join(" · "),
    }),
  },
});
