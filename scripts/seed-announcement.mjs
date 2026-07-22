// Seeds a demo announcement bar entry.
// Run with: node --env-file=.env.local scripts/seed-announcement.mjs
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_READ_TOKEN in the environment.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const announcement = {
  _id: "announcement-default",
  _type: "announcement",
  message: "New patients welcome — consultations available this week.",
  ctaLabel: "Book an appointment",
  ctaHref: "/appointment",
  active: true,
};

client
  .createOrReplace(announcement)
  .then(() => console.log("Seeded default announcement."))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
