// Adds FAQs specific to the Contact page, alongside the existing
// faq-appointment and faq-insurance documents.
// Run with: node --env-file=.env.local scripts/seed-contact-faqs.mjs
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_READ_TOKEN in the environment.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const faqs = [
  {
    _id: "faq-walk-in",
    question: "Can I visit without a prior appointment?",
    answer:
      "Booking an appointment in advance is recommended so the team can allocate sufficient consultation time and avoid waiting. If you have an urgent concern, please call the clinic directly to check same-day availability.",
    category: "appointments",
  },
  {
    _id: "faq-online-consultation",
    question: "Do you offer online consultations?",
    answer:
      "Online consultations may be available depending on your condition and consultation requirements. You can indicate your preference for an online or in-clinic consultation when booking an appointment, and the team will confirm what is suitable.",
    category: "appointments",
  },
];

async function seed() {
  const tx = client.transaction();
  for (const f of faqs) tx.createOrReplace({ _type: "faq", ...f });
  await tx.commit();
  console.log(`Seeded ${faqs.length} contact FAQs.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
