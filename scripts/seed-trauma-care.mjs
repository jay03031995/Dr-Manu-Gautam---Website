// Seeds the Trauma Care treatment page. See seed-joint-replacement.mjs for the
// compliance note on the doctor bio data conflict — same caution applies.
// Run with: node --env-file=.env.local scripts/seed-trauma-care.mjs
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
  block("Trauma Care for Fractures and Complex Injuries", "h2"),
  block(
    "Fractures and dislocations can occur due to falls, accidents or sports-related trauma, and can range from simple, stable breaks to complex injuries involving multiple bones or joint surfaces. Timely evaluation is important to assess the extent of the injury and determine the most appropriate treatment approach."
  ),
  block(
    "Trauma care covers a range of treatment options, from non-surgical management such as casting, splinting or bracing, to surgical fixation for fractures that require realignment and stabilisation. Treatment decisions are based on the type, location and severity of the injury, along with your overall health."
  ),
  block(
    "As an orthopedic surgeon experienced in trauma care, Dr. Manu Gautam focuses on assessing the full extent of your injury before recommending a treatment approach, whether non-surgical or surgical."
  ),
  block(
    "Trauma care treatment decisions are based on the type, location and severity of the fracture or injury, along with your overall health and functional needs.",
    "blockquote"
  ),
  block("What Does Trauma Care Involve?", "h2"),
  block(
    "A fracture is a break in a bone, which can range from a small crack to a complete break, sometimes involving multiple fragments. Dislocations occur when the bones forming a joint are forced out of their normal position. Both types of injury can cause pain, swelling, deformity and difficulty moving the affected area."
  ),
  block(
    "Treatment for fractures and dislocations depends on factors such as the location and pattern of the injury, whether the bone is displaced, and whether nearby joints, nerves or blood vessels are affected. Some fractures can be treated with casting or splinting to allow the bone to heal in proper alignment, while others require surgical fixation using plates, screws or rods to stabilise the bone."
  ),
  block(
    "The overall aim of trauma care is to restore proper alignment, support healing, and help you regain function of the injured area. Your orthopedic surgeon will recommend treatment based on a thorough evaluation of your specific injury, including examination and imaging."
  ),
];

const whenToConsult = [
  block(
    "Seek prompt orthopedic evaluation for any suspected fracture or dislocation, particularly if you notice visible deformity, are unable to bear weight or move the affected area, or if pain and swelling are severe. Early assessment helps guide the most appropriate treatment."
  ),
];

const diagnosis = [
  block(
    "Diagnosis begins with a physical examination to assess pain, deformity, swelling and movement of the affected area. X-rays are typically used to evaluate the fracture or dislocation, with additional imaging such as CT scans recommended in more complex cases."
  ),
];

const candidacy = [
  block(
    "Suitability for surgical treatment of a fracture or dislocation depends on factors such as the degree of displacement, whether a joint surface is involved, the stability of the injury, and whether nearby nerves, blood vessels or soft tissue are affected. Your surgeon will assess these factors through examination and imaging."
  ),
];

const nonSurgicalOptions = [
  block(
    "Many fractures and dislocations can be treated without surgery, particularly when the bone or joint is in proper alignment or can be realigned without surgical intervention. Common non-surgical approaches include casting, splinting or bracing to support the injury while it heals."
  ),
  block(
    "Pain management, activity modification and monitoring through follow-up imaging are also important parts of non-surgical fracture care. Physiotherapy may be introduced once initial healing has progressed, to help restore movement and strength."
  ),
  block(
    "Recovery differs from patient to patient, and the suitability of non-surgical treatment depends on the specific fracture or dislocation. Your orthopedic surgeon will assess whether non-surgical treatment is appropriate for your injury."
  ),
];

const whenSurgeryConsidered = [
  block(
    "Surgical treatment may be considered when a fracture is significantly displaced, involves a joint surface, is unstable, or has not healed properly with non-surgical treatment. Dislocations involving associated injury to surrounding structures may also require surgical evaluation. Your orthopedic surgeon will recommend surgery only after a detailed examination and discussion of the available options."
  ),
];

const surgicalProcedure = [
  block("Surgical Preparation", "h3"),
  block("Before surgery, preoperative checks are carried out, including relevant blood tests and an anaesthesia assessment, alongside a review of your imaging and surgical plan."),
  block("Fracture Realignment", "h3"),
  block("The fractured bone is carefully realigned to restore its normal position, using techniques suited to the specific fracture pattern."),
  block("Fixation of the Fracture", "h3"),
  block("Plates, screws, rods or other fixation devices may be used to stabilise the bone in its corrected position while it heals."),
  block("Alignment and Stability Assessment", "h3"),
  block("The alignment and stability of the fixed bone are assessed during the procedure to help confirm that the intended surgical outcome has been achieved."),
  block("Postoperative Monitoring", "h3"),
  block("After surgery, you are closely observed as part of your recovery, with attention to pain management and guidance for initial, supervised movement."),
];

const technologyUsed = [
  block(
    "Depending on the fracture or injury, imaging-guided techniques and fixation devices suited to the specific bone and fracture pattern may be used to support precision during treatment. Your surgeon will explain the approach most appropriate for your injury during your consultation."
  ),
];

const preparation = [
  block("For planned trauma surgery, the following general guidance can help you prepare, alongside your doctor's individual instructions:"),
  bullet("Share your complete medical history with your surgeon"),
  bullet("Inform the doctor about current medicines you are taking"),
  bullet("Complete the recommended medical tests and imaging before surgery"),
  bullet("Follow instructions regarding blood-thinning medicines"),
  bullet("Arrange family or caregiver support for your recovery period"),
  bullet("Follow preoperative fasting instructions given by your care team"),
  bullet("Understand physiotherapy and rehabilitation requirements in advance"),
];

const rehabilitation = [
  block(
    "Physiotherapy plays an important role in recovery after a fracture or dislocation, once initial healing has progressed sufficiently. Your rehabilitation plan may include guided exercises to restore strength, movement and function in the affected area, tailored to your individual recovery."
  ),
];

const urgentCare = [
  block(
    "Seek immediate medical attention for a suspected fracture or dislocation, particularly if there is visible deformity, an open wound, loss of sensation, or inability to move the affected area. Prompt evaluation helps guide appropriate and timely treatment."
  ),
];

const whyThisDoctor = [
  block(
    "Dr. Manu Gautam is an orthopedic surgeon experienced in the management of fractures, dislocations and complex trauma injuries, alongside joint replacement and sports injuries. Consultations focus on prompt clinical evaluation, a clear explanation of the treatment options available to you, and individualised planning based on your specific injury."
  ),
];

const heroTrustPoints = ["Prompt orthopedic evaluation", "Personalised fracture treatment planning", "Recovery and rehabilitation guidance"];

const treatmentTypes = [
  {
    _key: key(),
    _type: "treatmentType",
    title: "Fracture Fixation",
    description:
      "Fracture fixation involves stabilising a broken bone in proper alignment to support healing. Depending on the fracture pattern and location, this may involve casting or splinting for stable fractures, or surgical fixation using plates, screws or rods for fractures that are displaced or unstable.",
  },
  {
    _key: key(),
    _type: "treatmentType",
    title: "Dislocation Management",
    description:
      "Dislocations occur when a joint is forced out of its normal position and require prompt evaluation to restore proper alignment. Treatment may involve manual repositioning of the joint, followed by a period of immobilisation and rehabilitation, or surgical treatment in cases involving associated injury.",
  },
  {
    _key: key(),
    _type: "treatmentType",
    title: "Complex Trauma Reconstruction",
    description:
      "Complex trauma injuries, such as multiple fractures or fractures involving joint surfaces, may require more extensive surgical reconstruction to restore alignment and function. Treatment planning for complex trauma considers the full extent of the injury and your overall recovery goals.",
  },
];

const conditionsGrid = [
  { _key: key(), _type: "conditionEntry", title: "Simple Fractures", description: "A break in a bone that has not significantly displaced from its normal position, which may often be treated without surgery." },
  { _key: key(), _type: "conditionEntry", title: "Displaced Fractures", description: "A fracture where the bone fragments have shifted out of alignment, often requiring realignment to support proper healing." },
  { _key: key(), _type: "conditionEntry", title: "Compound Fractures", description: "A fracture in which the broken bone has pierced through the skin, requiring prompt medical attention." },
  { _key: key(), _type: "conditionEntry", title: "Joint Fractures", description: "Fractures that involve the surface of a joint, which can affect long-term joint function if not properly treated." },
  { _key: key(), _type: "conditionEntry", title: "Dislocations", description: "An injury where the bones forming a joint are forced out of their normal position, commonly affecting the shoulder, hip or fingers." },
  { _key: key(), _type: "conditionEntry", title: "Stress Fractures", description: "Small cracks in a bone caused by repetitive stress or overuse, rather than a single traumatic injury." },
  { _key: key(), _type: "conditionEntry", title: "Non-Union Fractures", description: "A fracture that has not healed properly over the expected time frame and may require further evaluation or treatment." },
  { _key: key(), _type: "conditionEntry", title: "Multiple Trauma Injuries", description: "Injuries involving more than one bone or joint, often resulting from significant accidents or falls." },
  { _key: key(), _type: "conditionEntry", title: "Soft Tissue Injuries Associated with Fractures", description: "Damage to surrounding muscles, ligaments or tendons that can occur alongside a fracture and may affect the treatment approach." },
];

const symptoms = [
  "Severe pain following an injury",
  "Visible deformity of a bone or joint",
  "Swelling and bruising",
  "Inability to move or bear weight on the affected area",
  "A grinding or cracking sensation at the time of injury",
  "Numbness or tingling near the injury",
  "Limited movement of a nearby joint",
  "Pain that worsens with movement",
  "Difficulty performing routine activities",
  "Persistent pain that does not improve with rest",
  "Signs of infection around an open wound",
  "Ongoing instability after a previous fracture or dislocation",
];

const candidacyChecklist = [
  "The fracture or dislocation is significantly displaced",
  "Imaging shows involvement of a joint surface",
  "Non-surgical treatment is not expected to achieve proper alignment",
  "There is associated injury to nerves, blood vessels or soft tissue",
  "Previous non-surgical treatment has not resulted in proper healing",
];

const benefits = [
  "Restoration of bone alignment",
  "Support for proper healing",
  "Reduced pain from an unstable injury",
  "Improved joint function where applicable",
  "Earlier, guided return to movement",
  "Reduced risk of long-term deformity",
];

const risks = [
  "Infection",
  "Blood clots",
  "Bleeding",
  "Delayed or incomplete healing",
  "Nerve or blood vessel injury",
  "Anaesthesia-related complications",
  "Hardware-related problems",
  "Joint stiffness",
  "Need for further surgery",
];

const recoveryStages = [
  { _key: key(), _type: "recoveryStage", stage: "Stage 1", title: "Initial Assessment and Treatment", description: "Emergency or planned evaluation, imaging and initial treatment take place to stabilise and assess the injury." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 2", title: "Hospital Recovery", description: "Pain management, monitoring and initial healing are supported under the care of your treatment team." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 3", title: "Early Healing", description: "Casting, splinting or wound care continues as the bone begins to heal, with regular follow-up imaging." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 4", title: "Progressive Rehabilitation", description: "Physiotherapy supports strengthening, movement and gradual return to daily activities as healing progresses." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 5", title: "Long-Term Recovery", description: "A gradual return to suitable activities continues based on the advice of your surgeon and physiotherapist." },
];

const faqs = [
  { id: "faq-tc-01", q: "What is trauma care in orthopedics?", a: "Orthopedic trauma care involves the evaluation and treatment of fractures, dislocations and other injuries affecting the bones and joints, often resulting from falls, accidents or sports-related incidents. Treatment may be non-surgical or surgical depending on the type and severity of the injury." },
  { id: "faq-tc-02", q: "How do I know if a bone is fractured?", a: "Signs of a possible fracture include severe pain, swelling, visible deformity, and difficulty moving or bearing weight on the affected area. A physical examination and X-rays are typically used to confirm a fracture and assess its severity." },
  { id: "faq-tc-03", q: "Do all fractures require surgery?", a: "No, many fractures can be treated without surgery using casting, splinting or bracing, particularly when the bone is in proper alignment. Surgery is generally considered for fractures that are significantly displaced, unstable, or involve a joint surface." },
  { id: "faq-tc-04", q: "What is the difference between a fracture and a dislocation?", a: "A fracture is a break in a bone, while a dislocation occurs when the bones forming a joint are forced out of their normal position. Both can occur together in some injuries, and treatment depends on the specific structures affected." },
  { id: "faq-tc-05", q: "How long does it take for a fracture to heal?", a: "Fracture healing times vary depending on the bone involved, the severity of the fracture, your age and overall health. Your orthopedic surgeon can provide a more specific estimate based on your individual injury and treatment plan." },
  { id: "faq-tc-06", q: "What tests are required to diagnose a fracture?", a: "X-rays are typically used to diagnose and assess a fracture. In more complex cases, additional imaging such as a CT scan may be recommended to evaluate the injury in greater detail." },
  { id: "faq-tc-07", q: "How long does fracture surgery take?", a: "The duration of fracture surgery varies depending on the complexity of the fracture and the type of fixation required. Your surgeon can provide a more specific estimate based on your individual treatment plan." },
  { id: "faq-tc-08", q: "How long will I need to stay in the hospital after fracture surgery?", a: "Hospital stay duration after fracture surgery depends on the severity of the injury, the surgical approach used and your overall health. Your surgical team will guide you on discharge planning based on your individual recovery." },
  { id: "faq-tc-09", q: "Is physiotherapy required after a fracture?", a: "Yes, physiotherapy is often an important part of recovery after a fracture, particularly once initial healing has progressed. It helps restore strength, movement and function in the affected area." },
  { id: "faq-tc-10", q: "What are the risks of fracture surgery?", a: "As with any surgical procedure, fracture surgery carries potential risks, including infection, delayed healing, and hardware-related problems, among others. Your individual risks and expected benefits will be discussed during your consultation." },
  { id: "faq-tc-11", q: "Can a dislocated joint heal without surgery?", a: "Many dislocations can be treated without surgery through manual repositioning of the joint, followed by a period of immobilisation and rehabilitation. Surgery may be considered when there is associated injury to surrounding structures or recurring instability." },
  { id: "faq-tc-12", q: "What is a compound fracture?", a: "A compound fracture, also known as an open fracture, occurs when the broken bone pierces through the skin. This type of injury requires prompt medical attention due to the increased risk of infection." },
  { id: "faq-tc-13", q: "When should I seek emergency care for an injury?", a: "Seek immediate medical attention for a suspected fracture or dislocation, particularly if there is visible deformity, an open wound, loss of sensation, or inability to move the affected area." },
  { id: "faq-tc-14", q: "How long does recovery take after a fracture?", a: "Recovery timelines after a fracture vary depending on the bone involved, the treatment provided, your age and participation in rehabilitation. Recovery differs from patient to patient, and your care team will guide you through each stage." },
  { id: "faq-tc-15", q: "Can hardware used in fracture surgery be removed later?", a: "In some cases, hardware such as plates or screws used to stabilise a fracture may be removed once healing is complete, though this is not always necessary. Your surgeon can discuss whether this may be relevant to your specific treatment." },
  { id: "faq-tc-16", q: "How can I book an appointment with Dr. Manu Gautam for trauma care?", a: "You can book an appointment with Dr. Manu Gautam by calling +91 9769761602 or using the appointment booking option on this website. For urgent injuries, please seek immediate medical attention at the nearest emergency facility." },
];

const serviceDoc = {
  _id: "service-trauma-care",
  _type: "service",
  title: "Trauma Care",
  slug: { current: "trauma-care" },
  icon: "ShieldCheck",
  shortDescription: "Expert care for fractures, dislocations, and complex trauma injuries.",
  introduction:
    "Dr. Manu Gautam provides evaluation and treatment for fractures, dislocations and complex trauma injuries affecting the bones and joints. Treatment may range from non-surgical management, such as casting or bracing, to surgical fixation, depending on the nature and severity of the injury. Every treatment plan begins with a prompt orthopedic assessment to understand the extent of the injury and the options available to you.",
  heroTrustPoints,
  body,
  treatmentTypes,
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
    { _key: key(), _type: "reference", _ref: "location-delhi" },
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
  faqs: faqs.map((f) => ({ _key: key(), _type: "reference", _ref: f.id })),
  medicalReviewer: { _type: "reference", _ref: "doctor-manu-gautam" },
  reviewDate: "2026-07-21",
  featured: false,
  order: 5,
  seo: {
    metaTitle: "Orthopedic Trauma Care in Noida | Dr. Manu Gautam",
    metaDescription:
      "Consult Dr. Manu Gautam in Noida for fracture and trauma evaluation, personalised treatment planning and recovery-focused orthopedic care.",
  },
};

async function seed() {
  await client.delete("drafts.service-trauma-care").catch(() => {});
  const tx = client.transaction();
  for (const f of faqs) {
    tx.createOrReplace({ _id: f.id, _type: "faq", question: f.q, answer: f.a, category: "treatments" });
  }
  tx.createOrReplace(serviceDoc);
  await tx.commit();
  console.log(`Seeded trauma-care service document and ${faqs.length} FAQs.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
