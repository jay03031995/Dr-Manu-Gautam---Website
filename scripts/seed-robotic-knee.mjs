// Seeds a fully-populated "Robotic Knee Replacement" treatment so the new
// 29-section template can be demonstrated end-to-end.
// Run with: node --env-file=.env.local scripts/seed-robotic-knee.mjs
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_READ_TOKEN in the environment.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const block = (text, style = "normal") => ({
  _type: "block",
  _key: Math.random().toString(36).slice(2),
  style,
  children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text }],
});

const category = {
  _id: "treatmentCategory-joint-replacement",
  _type: "treatmentCategory",
  title: "Joint Replacement",
  slug: { current: "joint-replacement" },
  description: "Surgical replacement of a damaged or worn joint with an artificial implant.",
  icon: "Bone",
  order: 1,
};

const faqRoboticKnee1 = {
  _id: "faq-robotic-knee-candidate",
  _type: "faq",
  question: "Am I a candidate for robotic-assisted knee replacement?",
  answer:
    "Candidacy depends on factors such as the extent of joint damage, overall health, and treatment goals. Your surgeon will review your history, examination findings, and imaging before advising whether this approach is suitable for you.",
  category: "treatments",
};

const faqRoboticKnee2 = {
  _id: "faq-robotic-knee-vs-conventional",
  _type: "faq",
  question: "How is robotic-assisted surgery different from conventional knee replacement?",
  answer:
    "Both approaches use the same implant designs. Robotic assistance adds a computer-guided planning and execution layer that can help the surgical team position the implant according to a pre-operative plan built from your own imaging. It is a tool that supports the surgeon's judgment, not a replacement for it.",
  category: "treatments",
};

const treatment = {
  _id: "service-robotic-knee-replacement",
  _type: "service",
  title: "Robotic Knee Replacement",
  slug: { current: "robotic-knee-replacement" },
  category: { _type: "reference", _ref: "treatmentCategory-joint-replacement" },
  icon: "Bone",
  shortDescription:
    "Computer-assisted planning and precision tooling to support knee replacement surgery, tailored to your own joint anatomy.",
  introduction:
    "If knee pain from arthritis or joint damage is limiting your daily life, robotic-assisted knee replacement is one of the options your surgeon may discuss with you. This page explains what the procedure involves, who may be suitable, and what to expect at each stage.",
  featured: true,
  order: 1,

  body: [
    block(
      "Robotic-assisted knee replacement combines standard knee replacement surgery with a computer-guided planning and positioning system. Before surgery, imaging of your knee is used to build a 3D model of your joint, which helps the surgical team plan implant size, position, and alignment specific to your anatomy."
    ),
    block(
      "During surgery, the robotic system provides real-time guidance within the boundaries set by the surgeon's plan. The surgeon remains in control of the procedure throughout — the system is a planning and precision aid, not an autonomous device."
    ),
  ],

  conditionsTreated: [
    "Advanced knee osteoarthritis",
    "Post-traumatic knee arthritis",
    "Significant joint deformity affecting alignment",
  ],

  symptoms: [
    "Persistent knee pain that limits walking or daily activities",
    "Stiffness that does not improve with rest",
    "Reduced range of motion",
    "Knee pain that has not responded to non-surgical treatment",
  ],

  whenToConsult: [
    block(
      "Consider an orthopaedic consultation if knee pain is persistent, worsening, or affecting your ability to walk, climb stairs, or sleep, particularly if non-surgical measures such as physiotherapy, weight management, or medication have not provided lasting relief."
    ),
  ],

  diagnosis: [
    block(
      "Diagnosis typically involves a clinical examination of the knee, a review of your symptom history, and imaging such as X-rays to assess the extent of joint damage. Additional imaging, such as an MRI or CT scan, may be requested if more detailed anatomical information is needed for surgical planning."
    ),
  ],

  nonSurgicalOptions: [
    block(
      "Non-surgical management is usually considered first and may include physiotherapy, activity modification, weight management, walking aids, anti-inflammatory medication, or joint injections. Surgery is generally discussed once these options no longer provide adequate relief."
    ),
  ],

  whenSurgeryConsidered: [
    block(
      "Surgery may be considered when knee damage is advanced, pain significantly affects quality of life, and non-surgical treatment has not been effective. The decision is made jointly between you and your surgeon based on your individual circumstances."
    ),
  ],

  surgicalProcedure: [
    block(
      "The procedure begins with imaging-based surgical planning. During surgery, damaged cartilage and bone are removed with the assistance of robotic guidance operating within the pre-planned boundaries, and the knee implant is fitted and aligned according to the surgical plan. The surgeon directs every step of the procedure."
    ),
  ],

  technologyUsed: [
    block(
      "The practice uses robotic-assisted surgical planning technology for eligible knee replacement cases. Your surgeon will confirm which technology and implant systems are appropriate for your specific case during consultation."
    ),
  ],

  benefits: [
    "Surgical plan built from your own joint anatomy",
    "Guided precision in implant positioning within the planned boundaries",
    "Structured, data-informed approach to alignment",
  ],

  risks: [
    "As with any joint replacement surgery, risks can include infection, blood clots, stiffness, implant wear over time, or the need for further surgery",
    "Individual risk depends on your health, anatomy, and other factors your surgeon will discuss with you",
    "Robotic assistance does not eliminate the general risks associated with knee replacement surgery",
  ],

  preparation: [
    block(
      "Preparation typically includes pre-operative imaging, a general health assessment, and guidance on medications, fasting, and arranging support for your recovery period. Your care team will provide a detailed checklist ahead of your surgery date."
    ),
  ],

  recovery: [
    block(
      "Most patients begin standing and walking with support within a day of surgery, with hospital stay length depending on individual recovery. Structured physiotherapy typically continues for several weeks to months. Exact recovery timelines vary by individual and should be discussed with your surgical team."
    ),
  ],

  rehabilitation: [
    block(
      "A structured rehabilitation programme, usually guided by a physiotherapist, supports regaining strength, motion, and confidence in the joint. Your care team will set milestones and adjust the programme based on your progress."
    ),
  ],

  urgentCare: [
    block(
      "Contact your surgical team promptly if you experience signs such as increasing redness, warmth, swelling, fever, wound discharge, or sudden severe pain following surgery."
    ),
  ],

  whyThisDoctor: [
    block(
      "Treatment plans are built around your individual imaging, symptoms, and goals, with clear explanation of both surgical and non-surgical options at every stage of your care."
    ),
  ],

  references: [
    { label: "American Academy of Orthopaedic Surgeons — Knee Replacement", url: "https://orthoinfo.aaos.org/en/treatment/total-knee-replacement/" },
  ],

  relatedTreatments: [{ _type: "reference", _ref: "service-joint-replacement", _key: "rt1" }],
  faqs: [
    { _type: "reference", _ref: "faq-robotic-knee-candidate", _key: "f1" },
    { _type: "reference", _ref: "faq-robotic-knee-vs-conventional", _key: "f2" },
  ],
  locations: [
    { _type: "reference", _ref: "location-noida", _key: "l1" },
    { _type: "reference", _ref: "location-ghaziabad", _key: "l2" },
  ],
  doctor: { _type: "reference", _ref: "doctor-manu-gautam" },
  medicalReviewer: { _type: "reference", _ref: "doctor-manu-gautam" },
  reviewDate: new Date().toISOString().slice(0, 10),

  seo: {
    metaTitle: "Robotic Knee Replacement in Noida & Ghaziabad",
    metaDescription:
      "Learn about robotic-assisted knee replacement: how it works, who may be suitable, and what to expect from consultation through recovery.",
  },
};

async function seed() {
  const docs = [category, faqRoboticKnee1, faqRoboticKnee2, treatment];
  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(doc);
  await tx.commit();
  console.log(`Seeded ${docs.length} documents for the Robotic Knee Replacement demo.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
