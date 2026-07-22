// One-off content seed for local development / demoing the CMS wiring.
// Run with: node --env-file=.env.local scripts/seed.mjs
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_READ_TOKEN in the environment.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const locations = [
  {
    _id: "location-noida",
    _type: "location",
    name: "Dr. Manu Gautam - Orthopaedic Clinic",
    slug: { current: "noida" },
    city: "Noida",
    addressLine: "D-8, Sector 20",
    postalCode: "201301",
    phone: "+91 9769761602",
    email: "info.drmanugautam@gmail.com",
    hours: [{ _key: "h1", days: "Mon - Sat", time: "10:00 AM - 7:00 PM" }],
  },
  {
    _id: "location-ghaziabad",
    _type: "location",
    name: "OrthoCare Ghaziabad",
    slug: { current: "ghaziabad" },
    city: "Ghaziabad",
    addressLine: "Raj Nagar Extension, Ghaziabad",
    postalCode: "201017",
    phone: "+91-XXXXXXXXXX",
    email: "ghaziabad@drmanugautam.com",
    hours: [{ _key: "h1", days: "Mon - Sat", time: "10:00 AM - 6:00 PM" }],
  },
];

const doctor = {
  _id: "doctor-manu-gautam",
  _type: "doctor",
  name: "Dr. Manu Gautam",
  slug: { current: "dr-manu-gautam" },
  credentials: "MBBS, MS (Orthopedics)",
  specialties: ["Joint Replacement", "Sports Injuries", "Spine Care"],
  yearsExperience: 15,
  education: ["MBBS - Delhi University", "MS Orthopedics - AIIMS"],
  memberships: ["Indian Orthopedic Association"],
  locations: [
    { _type: "reference", _ref: "location-noida", _key: "loc1" },
    { _type: "reference", _ref: "location-ghaziabad", _key: "loc2" },
  ],
};

const services = [
  { key: "joint-replacement", title: "Joint Replacement", icon: "Bone", order: 1, shortDescription: "Hip, knee, and shoulder replacement to relieve pain and restore mobility." },
  { key: "spine-care", title: "Spine Care", icon: "Activity", order: 2, shortDescription: "Advanced treatments for back and neck pain, disc problems, and spinal disorders." },
  { key: "sports-injuries", title: "Sports Injuries", icon: "Sparkles", order: 3, shortDescription: "Arthroscopic surgery and rehabilitation for athletes and active individuals." },
  { key: "trauma-care", title: "Trauma Care", icon: "ShieldCheck", order: 4, shortDescription: "Expert care for fractures, dislocations, and complex trauma injuries." },
  { key: "rehabilitation", title: "Rehabilitation", icon: "HandHeart", order: 5, shortDescription: "Personalized physiotherapy programs to recover your movement." },
  { key: "pediatric-orthopedics", title: "Pediatric Orthopedics", icon: "Baby", order: 6, shortDescription: "Specialized care for children's bone and joint conditions." },
].map((s) => ({
  _id: `service-${s.key}`,
  _type: "service",
  title: s.title,
  slug: { current: s.key },
  icon: s.icon,
  shortDescription: s.shortDescription,
  order: s.order,
  featured: true,
}));

const testimonials = [
  {
    _id: "testimonial-linda-m",
    _type: "testimonial",
    author: "Linda M.",
    role: "Knee Replacement Patient",
    rating: 5,
    quote:
      "After my knee replacement at OrthoCare, I can walk and live pain-free again. The care and support I received were exceptional.",
    featured: true,
  },
  {
    _id: "testimonial-david-r",
    _type: "testimonial",
    author: "David R.",
    role: "Sports Injury Patient",
    rating: 5,
    quote:
      "The team helped me recover from a sports injury faster than expected, highly professional and encouraging throughout the journey.",
    featured: true,
  },
];

const faqs = [
  {
    _id: "faq-insurance",
    _type: "faq",
    question: "Do you accept health insurance?",
    answer: "Yes, we work with most major insurance providers and can help you verify coverage before your visit.",
    category: "insurance",
  },
  {
    _id: "faq-appointment",
    _type: "faq",
    question: "How do I book an appointment?",
    answer: "You can book online through our appointment page or call either clinic directly.",
    category: "appointments",
  },
];

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  siteName: "Dr. Manu Gautam - Orthopedic Surgery",
  tagline: "Advanced Orthopaedic Care for Better Movement and Faster Recovery",
  phone: "+91 9769761602",
  email: "info.drmanugautam@gmail.com",
  social: {
    facebook: "https://facebook.com/people/DrManu-Gautam/100084198227670/",
    instagram: "https://www.instagram.com/drmanugautam/",
    youtube: "https://www.youtube.com/@DrManuGautam/videos",
  },
};

async function seed() {
  const docs = [...locations, doctor, ...services, ...testimonials, ...faqs, siteSettings];
  const tx = client.transaction();
  for (const doc of docs) {
    tx.createOrReplace(doc);
  }
  await tx.commit();
  console.log(`Seeded ${docs.length} documents into dataset "${dataset}".`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
