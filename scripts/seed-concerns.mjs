// Seeds the "What Are You Experiencing?" homepage concern cards.
// Run with: node --env-file=.env.local scripts/seed-concerns.mjs
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_READ_TOKEN in the environment.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const concerns = [
  { key: "knee-pain", label: "Knee Pain", description: "Arthritis, injury, or wear", icon: "Bone", treatment: "service-joint-replacement", order: 1 },
  { key: "hip-pain", label: "Hip Pain", description: "Stiffness or limited motion", icon: "Activity", treatment: "service-joint-replacement", order: 2 },
  { key: "shoulder-pain", label: "Shoulder Pain", description: "Rotator cuff or joint strain", icon: "HandHeart", treatment: null, order: 3 },
  { key: "sports-injury", label: "Sports Injury", description: "Sprains, tears, overuse", icon: "Zap", treatment: "service-sports-injuries", order: 4 },
  { key: "joint-stiffness", label: "Joint Stiffness", description: "Reduced range of motion", icon: "Lock", treatment: "service-joint-replacement", order: 5 },
  { key: "ligament-injury", label: "Ligament Injury", description: "ACL, PCL, or meniscus", icon: "Link2", treatment: "service-sports-injuries", order: 6 },
  { key: "fracture", label: "Fracture", description: "Recent break or old injury", icon: "AlertTriangle", treatment: "service-trauma-care", order: 7 },
  { key: "difficulty-walking", label: "Difficulty Walking", description: "Pain or instability on foot", icon: "Footprints", treatment: "service-joint-replacement", order: 8 },
].map((c) => ({
  _id: `concern-${c.key}`,
  _type: "concern",
  label: c.label,
  description: c.description,
  icon: c.icon,
  order: c.order,
  ...(c.treatment
    ? { linkedTreatment: { _type: "reference", _ref: c.treatment } }
    : { manualHref: "/treatments" }),
}));

async function seed() {
  const tx = client.transaction();
  for (const doc of concerns) tx.createOrReplace(doc);
  await tx.commit();
  console.log(`Seeded ${concerns.length} concern documents.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
