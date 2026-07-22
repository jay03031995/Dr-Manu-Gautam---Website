// Seeds the homePage singleton with the current hero/Why Choose/Final CTA copy
// so it's editable in Studio. Image fields are left empty on purpose — upload
// real photos directly in Studio; the frontend falls back to placeholders
// until then.
// Run with: node --env-file=.env.local scripts/seed-homepage.mjs
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_READ_TOKEN in the environment.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const doc = {
  _id: "homePage",
  _type: "homePage",

  heroBadge: "Advanced Orthopedic Care · Noida",
  heroHeadingLine1: "Where Expertise Restores",
  heroHeadingLine2: "Movement & Confidence.",
  heroSubtext:
    "Specialized care for joint pain, sports injuries, fractures and spine conditions, focused on helping you move better and live without limitations.",

  whyChooseHeading: "Why Choose Dr. Manu Gautam",
  whyChooseDescription:
    "Expertise. Innovation. Compassion. Dr. Manu Gautam is committed to providing world-class orthopaedic care with advanced technology and a patient-first approach.",
  whyChooseFeatures: [
    {
      _type: "feature",
      _key: "dedicated-surgeon",
      icon: "Stethoscope",
      title: "Dedicated Orthopaedic Surgeon",
      description: "Specialized care focused on restoring mobility and improving lives with compassion and expertise.",
    },
    {
      _type: "feature",
      _key: "regenerative-medicine",
      icon: "HandHeart",
      title: "Latest Technique for Regenerative Medicine",
      description: "Advanced regenerative therapies for tissue repair and regeneration using the latest innovations.",
    },
    {
      _type: "feature",
      _key: "robotic-knee",
      icon: "Bone",
      title: "Special Interest in Robotic Knee Replacement",
      description: "Precision-focused robotic solutions for better outcomes and faster, smoother recoveries.",
    },
    {
      _type: "feature",
      _key: "cuvis-robot",
      icon: "Wrench",
      title: "Fully Automated CUVIS Robot for Knee Replacement",
      description: "State-of-the-art CUVIS robot delivers unmatched precision and personalized surgical excellence.",
    },
  ],
  practiceStats: [
    { _type: "stat", _key: "years", number: "15+", label: "Years of Experience", icon: "Award" },
    { _type: "stat", _key: "surgeries", number: "2,500+", label: "Successful Surgeries", icon: "ShieldCheck" },
    { _type: "stat", _key: "patients", number: "12,000+", label: "Satisfied Patients", icon: "Users" },
    { _type: "stat", _key: "satisfaction", number: "100%", label: "Satisfaction", icon: "HeartPulse" },
  ],

  finalCtaHeading: "Ready to Start Your Recovery Journey?",
  finalCtaSubtext: "Schedule a consultation with our orthopedic specialists in Noida & Ghaziabad today.",
};

async function seed() {
  await client.createOrReplace(doc);
  console.log("Seeded homePage singleton.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
