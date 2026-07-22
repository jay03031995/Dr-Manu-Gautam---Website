// Seeds the Robotic Knee Replacement treatment page.
// Deliberately kept narrower than joint-replacement.mjs and cross-links to it,
// to avoid duplicate content between the two closely related pages.
// See seed-joint-replacement.mjs for the compliance note on the doctor bio
// data conflict — the same caution applies here.
// Run with: node --env-file=.env.local scripts/seed-robotic-knee-replacement.mjs
import { createClient } from "@sanity/client";
import { key, block, bullet } from "./lib/portableText.mjs";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_READ_TOKEN in the environment.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const body = [
  block("Robotic-Assisted Knee Replacement for Precision Care", "h2"),
  block(
    "Knee replacement surgery involves replacing the damaged surfaces of the knee joint with an implant to help reduce pain and improve movement. Robotic-assisted technology is a tool that can support this process by using detailed imaging and computer planning to help guide implant positioning based on your individual knee anatomy."
  ),
  block(
    "This approach does not change the fundamental goal of knee replacement surgery, which remains to address damaged joint surfaces caused by arthritis or injury. Instead, it is intended to support the surgical team during planning and execution, based on the specific alignment and structure of your knee."
  ),
  block(
    "Not every patient is automatically suitable for robotic-assisted knee replacement. Suitability depends on individual evaluation, including the extent of joint damage, your knee anatomy and your surgeon's clinical assessment during consultation."
  ),
  block(
    "Robotic-assisted knee replacement may be considered for eligible patients as part of a broader knee replacement treatment plan, based on individual evaluation and surgical suitability.",
    "blockquote"
  ),
  block("What Is Robotic-Assisted Knee Replacement?", "h2"),
  block(
    "Robotic-assisted knee replacement refers to the use of computer-guided technology and instrumentation alongside standard knee replacement surgery. Before surgery, imaging of your knee helps create a plan tailored to your joint's individual dimensions and alignment."
  ),
  block(
    "During the procedure, the robotic system assists the surgical team by providing real-time information that can support more precise preparation of the joint surfaces and positioning of the implant components. The surgeon remains in control of the procedure throughout, with the technology serving as a planning and guidance tool rather than performing the surgery independently."
  ),
  block(
    "The overall aim is to support accurate implant alignment based on your knee's specific anatomy, which is intended to help improve joint mechanics after surgery. As with conventional knee replacement, outcomes vary from patient to patient, and your orthopedic surgeon will discuss whether this approach may be suitable for your condition after a detailed examination."
  ),
];

const whenToConsult = [
  block(
    "Early evaluation can help determine whether robotic-assisted knee replacement may be a suitable option for your knee condition, or whether continued non-surgical treatment or conventional knee replacement is more appropriate at this stage."
  ),
];

const diagnosis = [
  block(
    "Diagnosis begins with a physical examination and X-rays of the knee. Additional imaging may be used specifically for robotic-assisted surgical planning, helping to map the individual dimensions and alignment of your knee joint ahead of any surgical decision."
  ),
];

const candidacy = [
  block(
    "Suitability for robotic-assisted knee replacement depends on factors similar to conventional knee replacement, along with additional consideration of your knee's specific anatomy and alignment as seen on imaging. Your surgeon will assess whether this approach is appropriate for your individual case, or whether conventional knee replacement techniques may be more suitable."
  ),
];

const nonSurgicalOptions = [
  block(
    "As with other forms of knee joint damage, non-surgical treatment is often considered first. This may include pain-relief medicines, physiotherapy and knee-strengthening exercises, weight management, activity modification and the use of walking aids where appropriate. Joint injections may also be considered in some cases."
  ),
  block(
    "Robotic-assisted knee replacement may be discussed only when non-surgical treatment no longer provides meaningful relief for persistent knee symptoms and a detailed evaluation supports surgical planning."
  ),
];

const whenSurgeryConsidered = [
  block(
    "Robotic-assisted knee replacement may be considered when persistent knee pain and reduced mobility continue despite appropriate non-surgical treatment, and when your surgeon determines that this technology may support your specific surgical plan based on your knee anatomy and imaging findings."
  ),
];

const surgicalProcedure = [
  block("Preoperative Imaging and Planning", "h3"),
  block(
    "Imaging of your knee is used to build an individualised surgical plan ahead of the procedure, mapping your knee's specific dimensions and alignment."
  ),
  block("Surgical Preparation", "h3"),
  block("As with conventional knee replacement, preoperative checks and an anaesthesia assessment are carried out before surgery."),
  block("Robotic-Assisted Bone Preparation", "h3"),
  block(
    "The robotic system provides guidance during preparation of the knee joint surfaces, based on your individual surgical plan, while your surgeon performs the procedure."
  ),
  block("Implant Positioning", "h3"),
  block(
    "Knee implant components are positioned with the support of real-time information from the robotic system, aiming for alignment suited to your knee anatomy."
  ),
  block("Postoperative Monitoring", "h3"),
  block(
    "Following surgery, you are monitored as part of your recovery, with attention to pain management and guidance for initial, supervised mobilisation."
  ),
];

const technologyUsed = [
  block(
    "Robotic-assisted technology is used alongside standard surgical techniques to support precision during knee replacement. This includes imaging-based planning tools and instrumentation designed to assist accurate implant positioning based on your individual knee anatomy. Your surgeon will explain how this technology may apply to your specific procedure."
  ),
];

const preparation = [
  block("Preparing for robotic-assisted knee replacement follows guidance similar to conventional knee replacement surgery:"),
  bullet("Share your complete medical history with your surgeon"),
  bullet("Inform the doctor about current medicines you are taking"),
  bullet("Complete the recommended medical tests and imaging before surgery"),
  bullet("Manage diabetes and blood pressure as advised"),
  bullet("Arrange family or caregiver support for your recovery period"),
  bullet("Understand physiotherapy and rehabilitation requirements in advance"),
];

const rehabilitation = [
  block(
    "Rehabilitation after robotic-assisted knee replacement follows a similar structured approach to conventional knee replacement, with physiotherapy supporting strength, flexibility and movement as you recover."
  ),
];

const urgentCare = [
  block(
    "Contact your surgical team promptly if you notice increasing redness, warmth or discharge around the surgical site, a sudden increase in pain or swelling, fever, or difficulty moving the knee. These symptoms may require urgent medical assessment."
  ),
];

const whyThisDoctor = [
  block(
    "Dr. Manu Gautam has a specific interest in robotic-assisted knee replacement, alongside broader expertise in joint replacement, sports injuries and spine care. Consultations include a discussion of whether robotic-assisted or conventional knee replacement techniques may be appropriate for your individual condition."
  ),
];

const heroTrustPoints = [
  "Computer-assisted surgical planning",
  "Personalised implant positioning",
  "Structured recovery guidance",
];

const conditionsGrid = [
  { _key: key(), _type: "conditionEntry", title: "Knee Osteoarthritis", description: "Wear of the knee joint cartilage over time, leading to pain, stiffness and reduced movement." },
  { _key: key(), _type: "conditionEntry", title: "Post-Traumatic Knee Arthritis", description: "Knee joint damage that develops following a previous injury, sometimes years later." },
  { _key: key(), _type: "conditionEntry", title: "Advanced Knee Joint Degeneration", description: "Long-term deterioration of the knee joint that can significantly limit movement and daily function." },
];

const symptoms = [
  "Persistent knee pain",
  "Pain while walking or climbing stairs",
  "Knee stiffness after rest",
  "Reduced knee range of motion",
  "Swelling around the knee",
  "Limited improvement with non-surgical treatment",
];

const candidacyChecklist = [
  "Knee pain continues despite non-surgical treatment",
  "Imaging shows significant knee joint damage",
  "Your knee anatomy is suitable for robotic-assisted planning",
  "You have discussed the approach and its suitability with your surgeon",
];

const benefits = [
  "Personalised surgical planning based on your knee anatomy",
  "Support for precise implant positioning",
  "Assessment of knee alignment during surgery",
  "A structured, technology-assisted approach to knee replacement",
  "Continued surgeon-led decision-making throughout the procedure",
  "Recovery guidance consistent with standard knee replacement care",
];

const risks = [
  "Infection",
  "Blood clots",
  "Bleeding",
  "Joint stiffness",
  "Implant-related problems",
  "Nerve or blood vessel injury",
  "Anaesthesia-related complications",
  "Need for revision surgery",
];

const recoveryStages = [
  { _key: key(), _type: "recoveryStage", stage: "Stage 1", title: "Before Surgery", description: "Imaging-based planning, assessment and preparation are completed ahead of your procedure." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 2", title: "Hospital Recovery", description: "Pain management, monitoring and assisted movement begin under the care of your surgical team." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 3", title: "First Few Weeks", description: "Wound care, walking support and follow-up appointments continue as you begin recovery at home." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 4", title: "Progressive Rehabilitation", description: "Structured physiotherapy supports strengthening, balance and gradual return to daily activities." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 5", title: "Long-Term Recovery", description: "Continued improvement is guided by your surgeon and physiotherapist based on your individual progress." },
];

const newFaqs = [
  { id: "faq-rkr-01", q: "What is robotic-assisted knee replacement?", a: "Robotic-assisted knee replacement uses computer-guided technology and imaging-based planning alongside standard knee replacement surgery. It is intended to support precise implant positioning based on your individual knee anatomy, while your surgeon continues to lead and perform the procedure throughout." },
  { id: "faq-rkr-02", q: "Does robotic-assisted surgery use different implants?", a: "No, robotic-assisted knee replacement generally uses the same types of implants used in conventional knee replacement surgery. The main difference lies in the planning and guidance used during the procedure, not the implant itself. Your surgeon can explain the specific implant considerations relevant to your treatment plan." },
  { id: "faq-rkr-03", q: "Is robotic-assisted knee replacement more painful than conventional surgery?", a: "Robotic-assisted knee replacement does not necessarily involve a different pain experience compared to conventional surgery, as pain depends on multiple individual factors. Your surgical and care team will provide pain management support throughout your recovery, regardless of the surgical technique used." },
  { id: "faq-rkr-04", q: "How long does robotic-assisted knee replacement surgery take?", a: "The duration of robotic-assisted knee replacement surgery can vary depending on the complexity of your case and the additional planning steps involved. Your surgeon can provide a more specific estimate based on your individual treatment plan during your consultation." },
  { id: "faq-rkr-05", q: "Is recovery faster with robotic-assisted knee replacement?", a: "Recovery timelines vary from patient to patient and depend on multiple factors, including overall health, muscle strength and participation in rehabilitation. Robotic assistance is a surgical planning and precision tool, and it does not guarantee a specific recovery timeline. Your surgeon can discuss general expectations relevant to your condition." },
  { id: "faq-rkr-06", q: "What imaging is required before robotic-assisted knee replacement?", a: "Imaging such as X-rays, and in some cases additional scans, may be required before robotic-assisted knee replacement to help build an individualised surgical plan based on your knee's dimensions and alignment. Your surgical team will inform you of the specific imaging required for your case." },
  { id: "faq-rkr-07", q: "Does insurance cover robotic-assisted knee replacement?", a: "Coverage for robotic-assisted knee replacement can vary depending on your individual insurance policy and provider. We recommend checking directly with your insurance provider regarding coverage for this specific technique, and our team can assist with related documentation where needed." },
  { id: "faq-rkr-08", q: "How can I find out if robotic-assisted knee replacement is right for me?", a: "The best way to find out if robotic-assisted knee replacement may be suitable for you is to schedule a consultation with Dr. Manu Gautam. This will include a clinical evaluation, examination and review of your imaging to help determine the most appropriate treatment approach for your condition." },
];

const existingFaqIds = ["faq-robotic-knee-candidate", "faq-robotic-knee-vs-conventional"];

const serviceDoc = {
  _id: "service-robotic-knee-replacement",
  _type: "service",
  title: "Robotic Knee Replacement",
  slug: { current: "robotic-knee-replacement" },
  category: { _type: "reference", _ref: "treatmentCategory-joint-replacement" },
  icon: "Bone",
  shortDescription:
    "Computer-assisted planning and precision tooling to support knee replacement surgery, tailored to your own joint anatomy.",
  introduction:
    "Dr. Manu Gautam offers robotic-assisted planning and instrumentation as part of knee replacement surgery for eligible patients. This technology is used to support precision during implant positioning based on your individual knee anatomy. Robotic assistance is one part of the overall treatment plan, which continues to depend on a detailed orthopedic evaluation and your specific clinical needs.",
  heroTrustPoints,
  body,
  conditionsTreated: conditionsGrid.map((c) => c.title),
  conditionsGrid,
  symptoms,
  whenToConsult,
  diagnosis,
  nonSurgicalOptions,
  whenSurgeryConsidered,
  candidacy,
  candidacyChecklist,
  surgicalProcedure,
  technologyUsed,
  benefits,
  risks,
  preparation,
  recovery: [],
  recoveryStages,
  rehabilitation,
  urgentCare,
  whyThisDoctor,
  references: [],
  locations: [
    { _key: key(), _type: "reference", _ref: "location-noida" },
    { _key: key(), _type: "reference", _ref: "location-ghaziabad" },
  ],
  doctor: { _type: "reference", _ref: "doctor-manu-gautam" },
  testimonials: [],
  videos: [],
  relatedTreatments: [
    { _key: key(), _type: "reference", _ref: "service-joint-replacement" },
    { _key: key(), _type: "reference", _ref: "service-sports-injuries" },
    { _key: key(), _type: "reference", _ref: "service-rehabilitation" },
  ],
  relatedConditions: [],
  faqs: [
    ...existingFaqIds.map((id) => ({ _key: key(), _type: "reference", _ref: id })),
    ...newFaqs.map((f) => ({ _key: key(), _type: "reference", _ref: f.id })),
  ],
  medicalReviewer: { _type: "reference", _ref: "doctor-manu-gautam" },
  reviewDate: "2026-07-21",
  featured: false,
  order: 2,
  seo: {
    metaTitle: "Robotic Knee Replacement in Noida | Dr. Manu Gautam",
    metaDescription:
      "Consult Dr. Manu Gautam in Noida for robotic-assisted knee replacement evaluation, personalised surgical planning and recovery-focused care.",
  },
};

async function seed() {
  await client.delete("drafts.service-robotic-knee-replacement").catch(() => {});
  const tx = client.transaction();
  for (const f of newFaqs) {
    tx.createOrReplace({ _id: f.id, _type: "faq", question: f.q, answer: f.a, category: "treatments" });
  }
  tx.createOrReplace(serviceDoc);
  await tx.commit();
  console.log(`Seeded robotic-knee-replacement service document and ${newFaqs.length} new FAQs.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
