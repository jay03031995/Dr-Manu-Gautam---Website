// Seeds real 5-star reviews copied from the clinic's Google Business Profile
// (https://maps.app.goo.gl/pAApdhFc9P1gd5oY6), used as the homepage fallback
// when the live Google Places API isn't configured. Verbatim reviewer names
// and review text — do not alter or invent content here.
// Run with: node --env-file=.env.local scripts/seed-google-reviews.mjs
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_READ_TOKEN in the environment.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const reviews = [
  {
    key: "rahul-chauhan",
    author: "Rahul Chauhan",
    relativeTime: "5 days ago",
    quote:
      "Dr manu gautam is best orthopedic surgeons doctor ,very good doctor I have a lot of problem in my knee, now I have taken medicine and done exercise and now I am very happy, thank you Dr Manu Gautam you are the best orthopedist doctor",
  },
  {
    key: "gopal-gupta",
    author: "Gopal Gupta",
    relativeTime: "3 weeks ago",
    quote:
      "Dr. Manu Gautam is the best orthopedic surgeon. He did my surgery. I used to have a lot of pain, now I am completely fine, he is a very good orthopedic surgeon. My surgery went very well. I had a lot of knee pain, now I can walk.",
  },
  {
    key: "varun-yadav",
    author: "Varun Yadav",
    relativeTime: "3 weeks ago",
    quote:
      "Dr manu gautam is best orthopedic doctor . dr manu gautam explained me very clearly about my disease and now I am fully satisfied with his guidance the behaviour of Dr manu gautam with the patient is very polite and he is very knowledgeable doctor manu Gautam",
  },
  {
    key: "mohd-rashid",
    author: "Mohd Rashid",
    relativeTime: "2 months ago",
    quote:
      "I'm very thankful to Dr manu I had a very severe accident got my cervical fracture it's rare to find such dr all I can say I'm alive just because of him I'm truly thankful and would highly recommend Dr manu Gautam to anyone seeking expert orthopedic care.",
  },
  {
    key: "mjs-puri",
    author: "mjs puri",
    relativeTime: "3 months ago",
    quote:
      "Dr Manu Gautam Senior Consultant- Orthopedic & Joint Replacement at Dharmashila Narayana Hospital Delhi. Consulted him for my wife for the knee stiffness after 7 years of post knee replacement surgery. Dr Gautam treated me very nicely and effectively. May God blessed Dr Manu Gautam. \u{1F64F}\u{1F64F}",
  },
].map((r, i) => ({
  _id: `testimonial-google-${r.key}`,
  _type: "testimonial",
  author: r.author,
  source: "Google Review",
  relativeTime: r.relativeTime,
  rating: 5,
  quote: r.quote,
  featured: true,
  order: i + 1,
}));

async function seed() {
  const tx = client.transaction();
  for (const doc of reviews) tx.createOrReplace(doc);
  await tx.commit();
  console.log(`Seeded ${reviews.length} Google review testimonials.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
