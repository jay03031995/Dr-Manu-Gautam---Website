// Seeds real videos pulled from Dr. Manu Gautam's YouTube channel
// (@DrManuGautam) so the homepage video carousel shows genuine content.
// Run with: node --env-file=.env.local scripts/seed-videos.mjs
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_READ_TOKEN in the environment.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);

const raw = [
  { id: "4za22WpRxco", duration: "1:09", title: "5 Minute Quick Exercises for Neck & Shoulder Pain | Corporate & IT Professionals", category: "shoulder-neck" },
  { id: "o_h2AKcjbYs", duration: "0:39", title: "3 Neck Isometric Exercises for Neck Pain Relief | Doctor Recommended", category: "shoulder-neck" },
  { id: "fvGBltwmfYU", duration: "1:40", title: "Knee Pain? 7 Exercises You Should Try", category: "knee" },
  { id: "kOj1cGkm7BI", duration: "1:56", title: "Shoulder Pain: 8 Easy Exercises to Reduce Pain and Improve Movement", category: "shoulder-neck" },
  { id: "bLVrvia7Mg0", duration: "3:07", title: "Back Pain Relief Exercises at Home | 5-Minute Lower Back Pain Routine", category: "back" },
  { id: "ihxFs0SCHyo", duration: "2:57", title: "What are Knock Knees?", category: "knee" },
  { id: "ClSEL8u2J78", duration: "3:50", title: "What is AVN of the Hip and How Is It Treated?", category: "osteoarthritis" },
  { id: "USYxVgnx-pw", duration: "2:44", title: "Patient Review After Growth Factor Concentrate (GFC) Treatment", category: "gfc" },
  { id: "ByHlkM7RfO4", duration: "2:10", title: "How Growth Factor Concentrate (GFC) Treats Joint Pain Without Surgery", category: "gfc" },
  { id: "a-nIdCO1Uwk", duration: "1:02", title: "What Is Growth Factor Concentrate (GFC) and How Is It Made?", category: "gfc" },
  { id: "s6Y1ifplzjg", duration: "1:29", title: "Osteoarthritis, Part 3", category: "osteoarthritis" },
  { id: "hEFPzQMm848", duration: "1:11", title: "How Does Osteoarthritis Start?", category: "osteoarthritis" },
  { id: "IrFMF5g8A6Y", duration: "1:23", title: "Causes of Osteoarthritis", category: "osteoarthritis" },
  { id: "AqTd51i1oGM", duration: "1:02", title: "Who Gets Osteoarthritis More: Male or Female? Part 2", category: "osteoarthritis" },
  { id: "FIo0EahBthc", duration: "1:24", title: "What Is Osteoarthritis? Part 1", category: "osteoarthritis" },
].map((v, i) => ({
  _id: `video-${v.id}`,
  _type: "video",
  title: v.title,
  slug: { current: slugify(v.title) || v.id },
  youtubeUrl: `https://www.youtube.com/watch?v=${v.id}`,
  externalThumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
  duration: v.duration,
  category: v.category,
  videoType: "education",
  order: i + 1,
}));

async function seed() {
  const tx = client.transaction();
  for (const doc of raw) tx.createOrReplace(doc);
  await tx.commit();
  console.log(`Seeded ${raw.length} videos from the YouTube channel.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
