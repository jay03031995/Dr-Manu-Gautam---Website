#!/usr/bin/env node
/**
 * SEO topic-cluster content for drmanugautam.com — writes Sanity DRAFTS only.
 *
 * What it does (nothing goes live until the drafts are published in Studio):
 *   1. Links every blog post to its treatment page (relatedTreatments), so each
 *      post shows "Related Treatments" and each treatment page lists its guides.
 *   2. Aligns treatment-page SEO titles/descriptions with the keyword clusters.
 *   3. Creates two new treatment pages — Hip Replacement and Shoulder
 *      Replacement — written from the site's own published hip/shoulder guides.
 *   4. Points the "Hip/Shoulder Replacement Surgery" cards on the Joint
 *      Replacement page at those new pages.
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=... node scripts/seo-cluster-content.mjs           # dry run
 *   SANITY_API_WRITE_TOKEN=... node scripts/seo-cluster-content.mjs --apply   # write drafts
 *
 * Safe to re-run: existing drafts are patched, never overwritten wholesale.
 */
import { createClient } from "@sanity/client";

const APPLY = process.argv.includes("--apply");
const token = process.env.SANITY_API_WRITE_TOKEN;
if (APPLY && !token) {
  console.error("Set SANITY_API_WRITE_TOKEN (Editor token for project 3hwu79jd) to apply.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "3hwu79jd",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// --- helpers ---------------------------------------------------------------
let keySeq = 0;
const key = (p = "k") => `${p}${Date.now().toString(36)}${(keySeq++).toString(36)}`;
const ref = (id) => ({ _type: "reference", _ref: id, _key: key("r") });
const docRef = (id) => ({ _type: "reference", _ref: id });
const block = (text, style = "normal") => ({
  _type: "block",
  _key: key("b"),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key("s"), text, marks: [] }],
});
const bullets = (items) =>
  items.map((text) => ({ ...block(text), listItem: "bullet", level: 1 }));

const SERVICE = {
  gfc: "be9d82e4-4e44-4af7-9719-dd2900ae579f",
  joint: "service-joint-replacement",
  robotic: "service-robotic-knee-replacement",
  rehab: "service-rehabilitation",
  sports: "service-sports-injuries",
  trauma: "service-trauma-care",
  spine: "service-spine-care",
  hip: "service-hip-replacement",
  shoulder: "service-shoulder-replacement",
};

// --- 1. blog post → treatment page links ------------------------------------
const POST_LINKS = {
  "blogPost-gfc-cost-delhi-questions": ["gfc"],
  "blogPost-gfc-injection-knee-pain-delhi": ["gfc"],
  "blogPost-gfc-knee-injection-recovery": ["gfc", "rehab"],
  "blogPost-gfc-knee-osteoarthritis-candidate": ["gfc"],
  "blogPost-gfc-knee-pain-delhi-ncr-faq": ["gfc"],
  "blogPost-gfc-procedure-knee-injection": ["gfc"],
  "blogPost-gfc-results-how-long-knee": ["gfc"],
  "blogPost-gfc-side-effects-safety-knee": ["gfc"],
  "blogPost-gfc-vs-hyaluronic-acid-knee": ["gfc"],
  "blogPost-gfc-vs-prp-knee-pain": ["gfc"],
  "blogPost-robotic-knee-replacement-noida-cost-benefits-recovery": ["robotic", "joint", "rehab"],
  "blogPost-knee-replacement-surgery-noida-when-needed": ["robotic", "joint", "gfc"],
  "blogPost-partial-vs-total-knee-replacement-noida": ["robotic", "joint"],
  "blogPost-best-hip-replacement-doctor-noida": ["hip", "joint"],
  "blogPost-minimally-invasive-hip-surgery-noida": ["hip", "joint", "rehab"],
  "blogPost-shoulder-replacement-surgery-noida": ["shoulder", "joint", "sports"],
  "blogPost-sports-injury-specialist-noida": ["sports", "rehab"],
  "blogPost-orthopaedic-trauma-surgeon-noida": ["trauma", "rehab"],
  "blogPost-best-orthopedic-doctor-noida": ["joint", "sports", "trauma"],
  "blogPost-bone-joint-clinic-noida": ["joint", "sports", "trauma"],
};

// --- 2. treatment-page SEO aligned with keyword clusters ---------------------
const SERVICE_SEO = {
  [SERVICE.gfc]: {
    metaTitle: "GFC Injection for Knee in Noida: Cost, Side Effects & PRP vs GFC",
    metaDescription:
      "GFC (Growth Factor Concentrate) knee injection in Noida: what the cost includes, side effects, GFC vs PRP, who is a candidate and recovery. Dr. Manu Gautam.",
    focusKeyword: "gfc injection for knee",
  },
  [SERVICE.robotic]: {
    metaTitle: "Robotic Knee Replacement in Noida | Knee Replacement Surgeon",
    metaDescription:
      "Robotic and total knee replacement surgery in Noida with Dr. Manu Gautam: who needs it, partial vs total knee replacement, CUVIS robotic planning and recovery.",
    focusKeyword: "robotic knee replacement noida",
  },
  [SERVICE.joint]: {
    metaTitle: "Joint Replacement Surgeon in Noida: Knee, Hip & Shoulder",
    metaDescription:
      "Knee, hip and shoulder replacement surgery in Noida with Dr. Manu Gautam: when replacement is needed, robotic options, risks and a structured recovery plan.",
    focusKeyword: "joint replacement surgeon noida",
  },
  [SERVICE.sports]: {
    metaTitle: "Sports Injury Specialist in Noida | ACL & Arthroscopy Surgeon",
    metaDescription:
      "Sports injury treatment in Noida: ACL and knee ligament injuries, meniscus tears, shoulder injuries and arthroscopy with Dr. Manu Gautam, plus rehab planning.",
    focusKeyword: "sports injury specialist noida",
  },
  [SERVICE.trauma]: {
    metaTitle: "Orthopaedic Trauma & Fracture Surgeon in Noida",
    metaDescription:
      "Fracture and orthopaedic trauma care in Noida: complex fractures, dislocations and joint injuries treated by Dr. Manu Gautam, with emergency care at Dharamshila Narayana.",
    focusKeyword: "orthopaedic trauma surgeon noida",
  },
  [SERVICE.rehab]: {
    metaTitle: "Orthopaedic Rehabilitation in Noida | Post-Surgery Rehab",
    metaDescription:
      "Rehabilitation after knee, hip and shoulder replacement, sports injuries and fractures in Noida: structured, surgeon-guided recovery with Dr. Manu Gautam.",
    focusKeyword: "orthopedic rehabilitation noida",
  },
};

// --- 3. new treatment pages ---------------------------------------------------
const COMMON = {
  _type: "service",
  category: docRef("treatmentCategory-joint-replacement"),
  icon: "Bone",
  doctor: docRef("doctor-manu-gautam"),
  // location-ghaziabad holds the Noida clinic; location-noida holds the
  // Dharamshila Narayana hospital (doc ids predate the slugs).
  locations: [ref("location-ghaziabad"), ref("location-noida")],
  featured: false,
};

const HIP = {
  ...COMMON,
  _id: SERVICE.hip,
  title: "Hip Replacement Surgery",
  slug: { _type: "slug", current: "hip-replacement" },
  order: 9,
  shortDescription:
    "Total hip replacement for advanced hip arthritis that limits walking, sleep and daily life despite appropriate non-surgical care, planned around your anatomy, health and goals.",
  introduction:
    "Total hip replacement is one of the most effective operations for advanced, symptomatic hip arthritis, but it is not decided on an X-ray alone. Dr. Manu Gautam first confirms that the hip is the source of pain, reviews imaging and non-surgical options, and recommends replacement only when the expected benefit clearly outweighs the risk.",
  heroTrustPoints: [
    "Decision based on symptoms, imaging and goals, not X-ray alone",
    "Surgical approach chosen for your anatomy",
    "Consultation in Sector 20, Noida and East Delhi",
  ],
  body: [
    block(
      "In a total hip replacement the damaged ball and socket of the hip joint are replaced with implants. It is usually considered for advanced osteoarthritis and other conditions that destroy the joint surface, when pain and stiffness keep limiting daily life.",
    ),
    block(
      "Evidence-based indications combine four things: advanced structural disease on imaging, substantial pain or loss of function, failure of well-conducted non-operative treatment, and a surgical risk that is acceptable for the patient. Waiting until a patient is severely deconditioned is not always an advantage, but surgery should not be done simply because an X-ray looks severe while symptoms remain manageable.",
    ),
  ],
  symptoms: [
    "Groin or deep hip pain that persists despite treatment",
    "Difficulty putting on shoes and socks",
    "Trouble getting in or out of a car or chair",
    "Reduced walking distance or a limp",
    "Hip pain that disturbs sleep",
    "Progressive loss of independence in daily activities",
  ],
  whenToConsult: [
    block(
      "Consult an orthopaedic surgeon when hip pain lasts for weeks, limits walking or sleep, or keeps returning despite rest, medicines and physiotherapy. An evaluation confirms whether the pain is coming from the hip joint itself or from the spine, tendons or another source.",
    ),
  ],
  candidacy: [
    block(
      "A suitable candidate usually has confirmed advanced hip arthritis, pain and functional limitation that matter to them, and has tried appropriate non-operative care. Age alone is not a reason to have or to avoid hip replacement; general health, bone quality, goals and surgical risk are weighed together.",
    ),
  ],
  candidacyChecklist: [
    "Advanced hip arthritis confirmed by examination and imaging",
    "Pain or stiffness that limits walking, sleep or daily tasks",
    "Non-surgical treatment tried without enough relief",
    "Medical conditions reviewed and optimised before surgery",
  ],
  surgicalProcedure: [
    block("Surgical approaches", "h3"),
    block(
      "Hip replacement can be performed through anterior, posterior or lateral approaches. Randomised-trial meta-analysis suggests the direct anterior approach may give some early functional advantage and a slightly shorter hospital stay, while long-term function is generally similar between approaches. The choice should reflect your anatomy, the surgeon's experience and your risk profile.",
    ),
    block("What 'minimally invasive' really means", "h3"),
    block(
      "Minimally invasive surgery aims to limit unnecessary soft-tissue disruption while still allowing accurate implant positioning. A smaller incision alone is not the goal; accuracy, careful tissue handling and complication prevention matter more.",
    ),
  ],
  preparation: [
    block(
      "Preparation looks beyond the hip. Active infection, anaemia, smoking, poorly controlled diabetes and other medical conditions can raise complication risk, so they are identified and optimised where practical. Blood-thinning medicines, dental or skin infections, home support and rehabilitation needs are reviewed before the operation.",
    ),
  ],
  benefits: [
    "Substantial pain relief in appropriately selected patients",
    "Better walking ability and day-to-day function",
    "Improved sleep and independence",
  ],
  risks: [
    "Infection",
    "Dislocation",
    "Fracture around the implant",
    "Blood clots (thrombosis)",
    "Leg-length difference",
    "Implant wear and the possibility of future revision surgery",
  ],
  recovery: [
    block("First days", "h3"),
    block(
      "Early mobilisation, pain control, wound care and safe transfers are the priorities. Walking aids are used as needed and discharge timing varies by patient.",
    ),
    block("First 6 weeks", "h3"),
    block(
      "Work focuses on walking quality, hip strength, balance and independence with daily activities. Exact precautions depend on the surgical approach and the surgeon's protocol.",
    ),
    block("3 to 6 months", "h3"),
    block(
      "Strength, endurance and confidence usually keep improving. Return to driving, work and exercise is individualised around the approach, the side operated, strength and job demands.",
    ),
  ],
  rehabilitation: [
    block(
      "A structured rehabilitation plan supports safe walking, hip strength and balance after discharge. Patients should follow the programme designed for their operation rather than copying exercises meant for another procedure.",
    ),
  ],
  whyThisDoctor: [
    block(
      "Dr. Manu Gautam (MBBS, D-Ortho, DNB Orthopaedics) practises joint replacement at his clinic in Sector 20, Noida and at Dharamshila Narayana Superspeciality Hospital, Delhi. Consultations focus on confirming the diagnosis, explaining non-surgical options and agreeing on specific goals before any surgery is planned.",
    ),
  ],
  relatedTreatments: [ref(SERVICE.joint), ref(SERVICE.rehab), ref(SERVICE.robotic)],
  faqs: [
    ref("faq-hip-doctor-1"),
    ref("faq-hip-doctor-2"),
    ref("faq-hip-doctor-3"),
    ref("faq-min-hip-1"),
    ref("faq-min-hip-2"),
    ref("faq-min-hip-3"),
  ],
  seo: {
    _type: "seo",
    metaTitle: "Hip Replacement Surgeon in Noida | Total Hip Replacement",
    metaDescription:
      "Total hip replacement surgery in Noida with Dr. Manu Gautam: when it is needed, minimally invasive and anterior approaches, risks and recovery timeline.",
    focusKeyword: "hip replacement surgeon in noida",
    focusKeywords: [
      "best hip replacement doctor noida",
      "minimally invasive hip surgery noida",
      "total hip replacement noida",
      "hip replacement surgery noida",
    ],
    noIndex: false,
  },
};

const SHOULDER = {
  ...COMMON,
  _id: SERVICE.shoulder,
  title: "Shoulder Replacement Surgery",
  slug: { _type: "slug", current: "shoulder-replacement" },
  order: 10,
  shortDescription:
    "Anatomic and reverse shoulder replacement for severe shoulder arthritis and cuff-deficient shoulders that stay painful and stiff despite appropriate non-surgical care.",
  introduction:
    "Shoulder replacement is considered when severe arthritis or another destructive condition causes persistent pain and loss of movement despite appropriate non-surgical treatment. Anatomic and reverse replacements are not interchangeable: the choice depends on rotator-cuff function, bone anatomy, diagnosis and your goals.",
  heroTrustPoints: [
    "Anatomic or reverse design chosen for your rotator cuff and bone",
    "Examination and imaging before any decision",
    "Consultation in Sector 20, Noida and East Delhi",
  ],
  body: [
    block(
      "Anatomic total shoulder replacement recreates the natural ball-and-socket relationship and generally depends on a working rotator cuff. Reverse shoulder replacement switches the geometry so the deltoid muscle can lift the arm when the rotator cuff is deficient.",
    ),
    block(
      "Professional guidance supports shoulder replacement in appropriately selected patients after diagnosis and non-operative care have been considered. Because many comparisons between designs are observational, claims that one design is universally better should be avoided.",
    ),
  ],
  symptoms: [
    "Deep shoulder pain that persists despite treatment",
    "Night pain that disrupts sleep",
    "Loss of overhead movement or rotation",
    "Difficulty dressing, reaching or lifting",
    "Grinding (crepitus) and stiffness from advanced arthritis",
    "Pain and weakness from a long-standing rotator-cuff tear",
  ],
  whenToConsult: [
    block(
      "See an orthopaedic surgeon when shoulder pain, stiffness or weakness persists for weeks, wakes you at night or stops you reaching and lifting. Examination of strength and movement plus imaging of the joint and rotator cuff are needed before replacement is discussed.",
    ),
  ],
  surgicalProcedure: [
    block("Anatomic shoulder replacement", "h3"),
    block(
      "Used mainly for glenohumeral osteoarthritis with an intact rotator cuff and suitable bone anatomy. It may preserve more external rotation in some patients.",
    ),
    block("Reverse shoulder replacement", "h3"),
    block(
      "Established for cuff-tear arthropathy and used in selected fractures, revisions and severe deformity. Its use in shoulders with an intact cuff is increasing, but comparative evidence is still evolving.",
    ),
    block("How the design is chosen", "h3"),
    ...bullets([
      "Rotator-cuff integrity and muscle quality",
      "Glenoid bone loss and deformity",
      "Age and activity demands",
      "Previous surgery, fracture history or instability",
      "Expected implant mechanics and future revision options",
    ]),
  ],
  risks: [
    "Infection",
    "Dislocation or instability",
    "Fracture",
    "Nerve injury",
    "Stiffness",
    "Implant loosening or wear",
    "Rotator-cuff failure after anatomic replacement",
    "Acromial or scapular stress fracture after reverse replacement in some patients",
    "Need for revision surgery",
  ],
  recovery: [
    block(
      "Recovery usually progresses over months. Early rehabilitation protects the implant and repair while restoring safe movement; strengthening is introduced gradually according to the operation and tissue quality.",
    ),
    block(
      "A reverse replacement may follow a different rehabilitation emphasis from an anatomic replacement, so patients should not copy exercise programmes from another shoulder operation without confirmation from their treating team.",
    ),
  ],
  whyThisDoctor: [
    block(
      "Dr. Manu Gautam's practice includes shoulder surgery and joint replacement at his clinic in Sector 20, Noida and at Dharamshila Narayana Superspeciality Hospital, Delhi. Each decision is based on examination, imaging of the joint and rotator cuff, and the patient's own goals.",
    ),
  ],
  relatedTreatments: [ref(SERVICE.joint), ref(SERVICE.sports), ref(SERVICE.rehab)],
  faqs: [ref("faq-shoulder-1"), ref("faq-shoulder-2"), ref("faq-shoulder-3")],
  seo: {
    _type: "seo",
    metaTitle: "Shoulder Replacement Surgery in Noida | Reverse & Anatomic",
    metaDescription:
      "Shoulder replacement surgery in Noida with Dr. Manu Gautam: anatomic vs reverse shoulder replacement, who needs it, risks and the recovery timeline.",
    focusKeyword: "shoulder replacement surgery noida",
    focusKeywords: [
      "shoulder replacement surgeon noida",
      "reverse shoulder replacement noida",
      "shoulder surgery noida",
    ],
    noIndex: false,
  },
};

// --- runner ------------------------------------------------------------------
async function ensureDraft(id) {
  const [draft, published] = await Promise.all([
    client.getDocument(`drafts.${id}`),
    client.getDocument(id),
  ]);
  if (draft) return draft;
  if (!published) throw new Error(`Document ${id} not found`);
  const { _rev, _updatedAt, _createdAt, ...rest } = published;
  if (APPLY) await client.createIfNotExists({ ...rest, _id: `drafts.${id}` });
  return published;
}

async function run() {
  const log = [];

  // New pages (create draft only if no page exists yet).
  for (const doc of [HIP, SHOULDER]) {
    const existing = await client.fetch(`*[_id in [$id, "drafts." + $id]][0]._id`, { id: doc._id });
    if (existing) {
      log.push(`skip   ${doc._id} (already exists as ${existing})`);
      continue;
    }
    const { _id, ...content } = doc;
    if (APPLY) await client.create({ ...content, _id: `drafts.${_id}` });
    log.push(`create drafts.${_id} -> /orthopaedic-surgeon/delhi-ncr/${doc.slug.current}/`);
  }

  // Blog → treatment links.
  for (const [postId, keys] of Object.entries(POST_LINKS)) {
    await ensureDraft(postId);
    const refs = keys.map((k) => ref(SERVICE[k]));
    if (APPLY) await client.patch(`drafts.${postId}`).set({ relatedTreatments: refs }).commit();
    log.push(`link   ${postId} -> ${keys.join(", ")}`);
  }

  // Treatment SEO.
  for (const [serviceId, seo] of Object.entries(SERVICE_SEO)) {
    await ensureDraft(serviceId);
    if (APPLY) {
      await client
        .patch(`drafts.${serviceId}`)
        .set({
          "seo.metaTitle": seo.metaTitle,
          "seo.metaDescription": seo.metaDescription,
          "seo.focusKeyword": seo.focusKeyword,
        })
        .commit();
    }
    log.push(`seo    ${serviceId}: ${seo.metaTitle}`);
  }

  // Joint Replacement cards → new hip/shoulder pages.
  const joint = await ensureDraft(SERVICE.joint);
  for (const tt of joint.treatmentTypes ?? []) {
    const target = /hip/i.test(tt.title) ? SERVICE.hip : /shoulder/i.test(tt.title) ? SERVICE.shoulder : null;
    if (!target) continue;
    if (APPLY) {
      await client
        .patch(`drafts.${SERVICE.joint}`)
        .set({ [`treatmentTypes[_key=="${tt._key}"].linkedService`]: docRef(target) })
        .commit();
    }
    log.push(`card   "${tt.title}" -> ${target}`);
  }

  console.log(log.join("\n"));
  console.log(
    APPLY
      ? "\nDone. Review and publish the drafts in Sanity Studio (publish the two new treatment pages first)."
      : "\nDry run only. Re-run with --apply to write these drafts.",
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
