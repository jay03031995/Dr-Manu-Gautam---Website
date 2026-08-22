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
    defineField({ name: "appointmentAt", title: "Appointment date & time", type: "datetime" }),
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
          { title: "Call Click", value: "call_click" },
        ],
      },
      readOnly: true,
    }),
    defineField({ name: "callTargetPhone", title: "Call target phone", type: "string", readOnly: true }),
    defineField({ name: "ctaLocation", title: "CTA location", type: "string", readOnly: true }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Scheduled", value: "scheduled" },
          { title: "Visited", value: "visited" },
          { title: "No-show", value: "no-show" },
          { title: "Closed", value: "closed" },
        ],
      },
      initialValue: "new",
    }),
    defineField({ name: "visited", title: "Patient visited", type: "boolean", initialValue: false }),
    defineField({
      name: "outcome",
      title: "Outcome",
      type: "string",
      options: { list: [{ title: "Won", value: "won" }, { title: "Lost", value: "lost" }, { title: "Pending", value: "pending" }] },
      initialValue: "pending",
    }),
    defineField({ name: "revenue", title: "Revenue (INR)", type: "number", validation: (Rule) => Rule.min(0) }),
    defineField({ name: "lastFollowUpAt", title: "Last follow-up", type: "datetime" }),
    defineField({ name: "internalNotes", title: "Internal notes", type: "text", rows: 4 }),
    defineField({ name: "submittedAt", title: "Submitted at", type: "datetime", validation: (Rule) => Rule.required() }),
  ],
  orderings: [
    { title: "Newest first", name: "submittedDesc", by: [{ field: "submittedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "phone", city: "city", source: "source", action: "submissionAction", status: "status" },
    prepare: ({ title, subtitle, city, source, action, status }) => ({
      title,
      subtitle: [subtitle, city, source, action, status].filter(Boolean).join(" · "),
    }),
  },
});
