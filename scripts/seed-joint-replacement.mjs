// Seeds the full Joint Replacement treatment page content.
//
// COMPLIANCE NOTE: Dr. Manu Gautam's `doctor-manu-gautam` document currently has
// self-contradictory data — the structured `education`/`credentials`/`yearsExperience`
// fields (MBBS/MS from Delhi University/AIIMS, 15 years) do not match the free-text
// `bio` field (MBBS from Government Medical College Bellary, Diploma from Santosh
// Medical College, DNB from Max Shalimar Bagh, 10 years). Because these conflict and
// neither can be confirmed as authoritative, this seed deliberately avoids citing
// specific medical colleges or an exact years-of-experience figure anywhere in the
// new joint-replacement content. Resolve the conflict in Studio (doctor-manu-gautam)
// before adding that detail back into page copy.
//
// Also note: the Ghaziabad location's phone number is still the placeholder
// "+91-XXXXXXXXXX" in the CMS — replace it with the real number when available.
//
// Run with: node --env-file=.env.local scripts/seed-joint-replacement.mjs
import { createClient } from "@sanity/client";
import { randomBytes } from "node:crypto";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_READ_TOKEN in the environment.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const key = () => randomBytes(6).toString("hex");

function block(text, style = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

function bullet(text) {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

// ---------------------------------------------------------------------------
// Portable text fields
// ---------------------------------------------------------------------------

const body = [
  block("Joint Replacement Treatment for Improved Mobility", "h2"),
  block(
    "Joint damage can significantly affect how you move, work and carry out everyday activities. When the smooth cartilage that cushions a joint wears down or becomes damaged, the bones underneath can rub against each other, causing pain, stiffness and swelling. This is commonly caused by osteoarthritis, rheumatoid arthritis, injuries, or gradual degeneration of the joint over time."
  ),
  block(
    "Joint replacement surgery involves replacing the damaged surfaces of a joint with carefully selected medical implants designed to help restore smoother movement and reduce pain. It is one of several options within orthopedic care and is recommended only after a detailed clinical assessment that considers your symptoms, examination findings and diagnostic imaging."
  ),
  block(
    "Before surgery is discussed, non-surgical treatments such as medicines, physiotherapy and lifestyle changes are usually considered first. As a joint replacement surgeon, Dr. Manu Gautam focuses on understanding the cause of your joint pain through careful evaluation, so that any recommendation for joint replacement surgery or joint pain treatment is based on your individual condition rather than a standard approach."
  ),
  block(
    "Joint replacement is generally considered when joint pain and restricted movement significantly affect daily activities and appropriate non-surgical treatments are no longer providing sufficient relief.",
    "blockquote"
  ),
  block("What Is Joint Replacement Surgery?", "h2"),
  block(
    "A joint is the point where two or more bones meet, allowing movement. Healthy joints are cushioned by a layer of smooth cartilage that lets bones glide against each other with minimal friction. When this cartilage becomes damaged through arthritis, injury or wear over time, the joint can become painful, stiff and difficult to move."
  ),
  block(
    "During joint replacement surgery, the damaged surfaces of the joint are carefully removed and replaced with implants made from metal, plastic or ceramic materials, depending on the joint involved and the surgical plan. These implants are designed to recreate a smoother, more stable joint surface."
  ),
  block(
    "The overall aim of joint replacement is to reduce pain and help improve movement so that daily activities become more manageable. It does not aim to return the joint to how it was before any damage occurred, and outcomes vary from person to person. Your orthopedic surgeon will recommend treatment only after a thorough examination and review of your diagnostic assessment, taking into account the severity of joint damage, your general health and your specific needs."
  ),
];

const whenToConsult = [
  block(
    "Early orthopedic evaluation can help determine the cause of your symptoms and the treatment options available to you. If joint pain, stiffness or reduced movement is affecting your daily life, consulting a joint replacement surgeon can help clarify whether non-surgical treatment or further evaluation for surgery may be appropriate."
  ),
];

const diagnosis = [
  block(
    "Diagnosis typically begins with a physical examination followed by X-rays to assess the extent of joint damage. Depending on your symptoms and examination findings, additional investigations such as blood tests or advanced imaging may be recommended to build a complete clinical picture before treatment options are discussed."
  ),
];

const candidacy = [
  block(
    "Suitability for joint replacement is assessed individually and depends on several factors, including the severity of joint damage, the duration and intensity of your pain, and how much your daily activities are limited. Your surgeon will also consider your response to non-surgical treatment, your general medical condition, age and activity requirements."
  ),
  block(
    "Muscle strength, joint stability and alignment are evaluated alongside X-ray and other imaging findings to build a complete picture of your joint health. Your own expectations and goals for treatment are an important part of this discussion as well."
  ),
  block(
    "Not everyone with joint damage requires surgery, and treatment suitability depends on individual evaluation rather than a fixed set of criteria. A detailed consultation helps determine whether joint replacement, continued non-surgical treatment, or further investigation is the most appropriate next step for you."
  ),
];

const nonSurgicalOptions = [
  block(
    "Many patients are initially treated through non-surgical methods, depending on the cause and severity of their condition. These approaches aim to reduce pain and improve function without surgery, and may be continued for an extended period depending on your response to treatment."
  ),
  block(
    "Common non-surgical options include pain-relief medicines, physiotherapy and structured strengthening exercises to support the muscles around the joint. Weight management and activity modification can also reduce stress on an affected joint, while joint injections may be considered in appropriate cases to help manage pain and inflammation."
  ),
  block(
    "Walking aids or braces may provide additional support during daily activities, and lifestyle changes such as adjusting exercise routines can help manage symptoms over time. Regular orthopedic monitoring allows your treatment plan to be adjusted as needed based on how your condition responds."
  ),
  block(
    "Recovery differs from patient to patient, and non-surgical treatment does not work the same way for everyone. Your orthopedic surgeon will discuss which combination of these options may be suitable for your specific condition."
  ),
];

const whenSurgeryConsidered = [
  block(
    "Joint replacement may be discussed when persistent pain, stiffness and reduced mobility continue despite appropriate non-surgical treatment, and when joint damage visible on diagnostic imaging significantly affects your daily activities. Treatment suitability depends on individual evaluation, and your orthopedic surgeon will recommend surgery only after a detailed examination and discussion of the available options."
  ),
];

const surgicalProcedure = [
  block("Surgical Preparation", "h3"),
  block(
    "Before surgery, preoperative checks are carried out, including blood tests and an anaesthesia assessment, to help confirm that you are prepared for the procedure. Your surgical team will review your medical history and discuss the plan for anaesthesia and the surgery itself."
  ),
  block("Removal of Damaged Joint Surfaces", "h3"),
  block(
    "The damaged cartilage and bone surfaces of the affected joint are carefully prepared to accommodate the joint replacement implant, using techniques suited to the specific joint involved."
  ),
  block("Placement of Joint Components", "h3"),
  block(
    "Appropriate implant components are positioned based on the affected joint and your individual surgical plan, aiming to recreate a stable and functional joint surface."
  ),
  block("Alignment and Movement Assessment", "h3"),
  block(
    "Once the implant is in place, joint alignment, stability and range of movement are assessed to help confirm that the joint is functioning as intended before the procedure is completed."
  ),
  block("Postoperative Monitoring", "h3"),
  block(
    "After surgery, you are closely observed as part of your recovery, with attention to pain management and guidance for initial, supervised mobilisation under the care of your surgical and physiotherapy team."
  ),
];

const technologyUsed = [
  block(
    "Depending on the joint involved and your treatment plan, various orthopedic technologies and techniques may be used to support precision during joint replacement surgery, including imaging-guided planning and instrumentation suited to the specific procedure. For eligible knee replacement cases, robotic-assisted technology may also be considered. Your surgeon will explain the approach most appropriate for your condition during your consultation."
  ),
];

const preparation = [
  block(
    "Preparing well for joint replacement surgery can support a smoother experience. This general guidance should be followed alongside your doctor's individual instructions:"
  ),
  bullet("Share your complete medical history with your surgeon"),
  bullet("Inform the doctor about current medicines you are taking"),
  bullet("Complete the recommended medical tests before surgery"),
  bullet("Manage diabetes and blood pressure as advised"),
  bullet("Follow instructions regarding blood-thinning medicines"),
  bullet("Stop smoking when medically advised"),
  bullet("Prepare your home for safe movement after surgery"),
  bullet("Arrange family or caregiver support for your recovery period"),
  bullet("Follow preoperative fasting instructions given by your care team"),
  bullet("Understand physiotherapy and rehabilitation requirements in advance"),
];

const rehabilitation = [
  block(
    "Physiotherapy and structured rehabilitation play an important role in recovery after joint replacement surgery. Your rehabilitation plan may include guided exercises to improve strength, flexibility and balance, along with gradual progression toward your usual daily activities. Your physiotherapist and surgeon will work together to guide this process based on your individual recovery."
  ),
];

const urgentCare = [
  block(
    "Contact your surgical team promptly if you notice increasing redness, warmth or discharge around the surgical site, a sudden increase in pain or swelling, fever, or difficulty moving the joint. These symptoms may require urgent medical assessment."
  ),
];

const whyThisDoctor = [
  block(
    "Dr. Manu Gautam is an orthopedic surgeon with a specialisation in joint replacement, alongside sports injuries and spine care. Consultations focus on a detailed clinical evaluation, a clear explanation of the treatment options available to you, and individualised planning that considers your specific condition and goals."
  ),
];

// ---------------------------------------------------------------------------
// Structured list / card fields
// ---------------------------------------------------------------------------

const heroTrustPoints = [
  "Detailed orthopedic evaluation",
  "Personalised treatment planning",
  "Recovery and rehabilitation guidance",
];

const treatmentTypes = [
  {
    _key: key(),
    _type: "treatmentType",
    title: "Knee Replacement Surgery",
    description:
      "Knee replacement may be considered for severe knee arthritis or persistent knee pain that limits everyday movement, including difficulty walking, climbing stairs, or coping with knee stiffness or deformity. Depending on the extent of joint damage, options may include total knee replacement, partial knee replacement, or revision knee replacement where a previous implant is no longer functioning well. Your surgeon will determine the most suitable option after a detailed clinical evaluation and review of your imaging.",
    ctaLabel: "Learn About Knee Replacement",
    manualHref: "/orthopaedic-surgeon/delhi-ncr/robotic-knee-replacement/",
  },
  {
    _key: key(),
    _type: "treatmentType",
    title: "Hip Replacement Surgery",
    description:
      "Hip replacement may be considered for conditions such as hip arthritis, hip fractures or avascular necrosis, where symptoms often include persistent pain in the hip or groin along with difficulty walking or bearing weight. Total hip replacement replaces the damaged ball-and-socket joint with an implant designed to restore smoother movement, while revision hip replacement may be required if a previous implant is no longer functioning as expected. Suitability is assessed through examination, imaging and your overall health.",
  },
  {
    _key: key(),
    _type: "treatmentType",
    title: "Shoulder Replacement Surgery",
    description:
      "Shoulder replacement may be considered for shoulder arthritis, complex shoulder fractures, or restricted arm movement and persistent shoulder pain that has not responded to non-surgical treatment. Total shoulder replacement replaces the damaged joint surfaces with an implant that mimics natural shoulder anatomy, while reverse shoulder replacement may be considered where there is significant rotator cuff damage. As with other joint procedures, suitability depends on individual evaluation.",
  },
];

const conditionsGrid = [
  { _key: key(), _type: "conditionEntry", title: "Osteoarthritis", description: "The most common form of arthritis, caused by gradual wear of joint cartilage over time, leading to pain and stiffness." },
  { _key: key(), _type: "conditionEntry", title: "Rheumatoid Arthritis", description: "An autoimmune condition causing inflammation of the joint lining, which can gradually damage cartilage and underlying bone." },
  { _key: key(), _type: "conditionEntry", title: "Post-Traumatic Arthritis", description: "Joint damage that develops following an injury such as a fracture or ligament tear, sometimes years after the original injury." },
  { _key: key(), _type: "conditionEntry", title: "Avascular Necrosis", description: "A condition where reduced blood supply to part of a bone weakens the bone tissue and can cause the joint surface to collapse." },
  { _key: key(), _type: "conditionEntry", title: "Severe Cartilage Damage", description: "Significant wear or injury to the cartilage that cushions a joint, which can lead to pain, swelling and restricted movement." },
  { _key: key(), _type: "conditionEntry", title: "Joint Deformity", description: "A change in the normal alignment of a joint, which may affect movement, stability and weight distribution." },
  { _key: key(), _type: "conditionEntry", title: "Complex Joint Fractures", description: "Fractures involving the joint surface that may affect long-term joint function if not adequately treated." },
  { _key: key(), _type: "conditionEntry", title: "Failed Previous Joint Replacement", description: "A previous implant that is no longer functioning well due to wear, loosening or infection, sometimes requiring revision surgery." },
  { _key: key(), _type: "conditionEntry", title: "Advanced Joint Degeneration", description: "Long-term deterioration of joint structures that can significantly limit movement and daily function." },
];

const symptoms = [
  "Persistent joint pain",
  "Pain while walking",
  "Difficulty climbing stairs",
  "Joint stiffness after rest",
  "Reduced range of movement",
  "Swelling around the joint",
  "Joint instability",
  "Visible joint deformity",
  "Pain that affects sleep",
  "Difficulty performing routine activities",
  "Increasing dependence on pain medication",
  "Limited improvement with physiotherapy or medicines",
];

const candidacyChecklist = [
  "Pain continues despite appropriate treatment",
  "Joint damage is visible on diagnostic imaging",
  "Movement has become significantly restricted",
  "Pain affects work, sleep or daily activities",
  "Joint deformity or instability is progressing",
];

const benefits = [
  "Reduced joint pain",
  "Improved mobility",
  "Better joint stability",
  "Improved performance of daily activities",
  "Correction of selected joint deformities",
  "Improved overall independence",
];

const risks = [
  "Infection",
  "Blood clots",
  "Bleeding",
  "Joint stiffness",
  "Implant-related problems",
  "Nerve or blood vessel injury",
  "Anaesthesia-related complications",
  "Joint instability",
  "Difference in limb length where relevant",
  "Need for revision surgery",
];

const recoveryStages = [
  { _key: key(), _type: "recoveryStage", stage: "Stage 1", title: "Before Surgery", description: "Assessment, investigations, preparation and rehabilitation guidance are completed ahead of your procedure." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 2", title: "Hospital Recovery", description: "Pain management, monitoring and assisted movement begin under the care of your surgical team." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 3", title: "First Few Weeks", description: "Wound care, walking support, exercises and follow-up appointments continue as you begin your recovery at home." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 4", title: "Progressive Rehabilitation", description: "Strengthening, improved balance, movement training and gradual progression of daily activities take place with physiotherapy guidance." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 5", title: "Long-Term Recovery", description: "A gradual return to suitable activities continues based on the advice of your surgeon and physiotherapist." },
];

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

const faqs = [
  { id: "faq-jr-01", q: "What is joint replacement surgery?", a: "Joint replacement surgery involves replacing the damaged surfaces of a joint, such as the knee, hip or shoulder, with medical implants. The procedure aims to reduce pain and improve movement in joints affected by conditions like arthritis or injury. It is typically considered after non-surgical treatments have not provided sufficient relief. Your orthopedic surgeon will recommend this option only after a detailed clinical evaluation of your specific condition." },
  { id: "faq-jr-02", q: "When is joint replacement recommended?", a: "Joint replacement is generally considered when persistent joint pain, stiffness and reduced mobility continue despite appropriate non-surgical treatment such as medicines, physiotherapy or lifestyle changes. The decision also depends on the extent of joint damage seen on diagnostic imaging and how significantly your symptoms affect daily activities. Your surgeon will discuss this option with you after a thorough examination." },
  { id: "faq-jr-03", q: "Which joints can be replaced?", a: "Joint replacement can be performed on several joints, most commonly the knee, hip and shoulder. Each procedure is tailored to the specific joint and the extent of damage present. Total or partial replacement may be considered depending on which parts of the joint are affected. Your orthopedic surgeon will assess your joint and recommend the option most suitable for your condition." },
  { id: "faq-jr-04", q: "Is joint replacement suitable for every patient?", a: "Joint replacement is not automatically suitable for every patient. Suitability depends on factors such as the severity of joint damage, overall health, age, activity levels and response to previous treatment. Some patients may continue with non-surgical management for longer periods, while others may be evaluated for surgery sooner. A detailed consultation helps determine the most appropriate approach for your situation." },
  { id: "faq-jr-05", q: "What is the difference between total and partial joint replacement?", a: "Total joint replacement involves resurfacing the entire joint, while partial joint replacement addresses damage limited to a specific part of the joint, such as one compartment of the knee. The choice between the two depends on the extent and location of joint damage, as identified through examination and imaging. Your surgeon will explain which option may be appropriate for your condition." },
  { id: "faq-jr-06", q: "How long does joint replacement surgery take?", a: "The duration of joint replacement surgery varies depending on the joint involved, the complexity of the case and the surgical approach used. Your surgeon can provide a more specific estimate based on your individual treatment plan during your consultation, as timings can differ from patient to patient depending on individual factors." },
  { id: "faq-jr-07", q: "How long will I need to stay in the hospital?", a: "Hospital stay duration after joint replacement surgery depends on factors such as the joint treated, your overall health and how your recovery progresses in the initial days after surgery. Your surgical team will monitor your recovery and guide you on discharge planning based on your individual progress and readiness for continued rehabilitation at home." },
  { id: "faq-jr-08", q: "When can I walk after joint replacement surgery?", a: "Many patients begin assisted walking soon after surgery under the guidance of their care team, though the exact timing depends on the joint treated and individual recovery. Early, supervised mobilisation is often encouraged as part of the recovery process, but your surgeon and physiotherapist will determine what is appropriate and safe for your specific situation." },
  { id: "faq-jr-09", q: "Is physiotherapy required after joint replacement?", a: "Yes, physiotherapy is generally an important part of recovery after joint replacement surgery. It helps improve strength, flexibility, balance and joint function through guided exercises. Your rehabilitation plan will be tailored to your individual recovery and adjusted over time based on your progress, as recommended by your surgeon and physiotherapist." },
  { id: "faq-jr-10", q: "How long does a joint replacement implant last?", a: "The lifespan of a joint replacement implant can vary depending on factors such as implant type, activity levels, weight and individual patient factors. While many implants are designed for long-term use, regular follow-up allows your surgeon to monitor the implant over time. Your surgeon can discuss general expectations relevant to your specific procedure." },
  { id: "faq-jr-11", q: "Can both knees be replaced?", a: "In some cases, both knees may require joint replacement, and this can potentially be addressed through staged procedures performed at different times, depending on your overall health and your surgeon's assessment. Whether both knees are treated together or separately depends on individual evaluation, and this will be discussed as part of your treatment planning." },
  { id: "faq-jr-12", q: "What is revision joint replacement?", a: "Revision joint replacement refers to a follow-up surgery performed when a previous joint implant is no longer functioning well, due to reasons such as wear, loosening or infection. It typically involves replacing some or all of the original implant components. Your surgeon will assess whether revision surgery is appropriate based on your symptoms and diagnostic findings." },
  { id: "faq-jr-13", q: "What tests are required before joint replacement?", a: "Common pre-surgical evaluations include a physical examination, X-rays and blood tests to assess your general fitness for surgery. Additional investigations may be recommended depending on your medical history and the findings of your initial assessment. Your surgical team will inform you of the specific tests required for your individual treatment plan." },
  { id: "faq-jr-14", q: "What are the risks of joint replacement surgery?", a: "As with any surgical procedure, joint replacement carries potential risks, including infection, blood clots, bleeding, joint stiffness and implant-related problems, among others. Your individual risk factors will be assessed and discussed during your consultation, along with the expected benefits and available alternatives, so you can make an informed treatment decision." },
  { id: "faq-jr-15", q: "How long does recovery take?", a: "Recovery timelines after joint replacement vary depending on the joint treated, the surgical procedure, your age, medical condition, muscle strength and participation in rehabilitation. While many patients see gradual improvement over the weeks and months following surgery, recovery differs from patient to patient, and your care team will guide you through each stage." },
  { id: "faq-jr-16", q: "Can joint replacement help with arthritis?", a: "Joint replacement may help improve mobility and reduce pain associated with advanced arthritis when non-surgical treatments no longer provide sufficient relief. It replaces the damaged joint surfaces affected by arthritis with implants designed to restore smoother movement. Suitability depends on individual evaluation, and your orthopedic surgeon will discuss whether this option is appropriate for your condition." },
  { id: "faq-jr-17", q: "What activities can be performed after recovery?", a: "Many patients are able to gradually resume a range of daily activities following recovery from joint replacement surgery, guided by their surgeon and physiotherapist. The specific activities considered appropriate depend on the joint treated, your overall recovery and individual health factors. Your care team will advise you on suitable activity levels as your rehabilitation progresses." },
  { id: "faq-jr-18", q: "How can I book an appointment with Dr. Manu Gautam?", a: "You can book an appointment with Dr. Manu Gautam by calling +91 9769761602 or using the appointment booking option on this website. Our team will help schedule a consultation to discuss your joint pain, symptoms and the evaluation process, so you can better understand your treatment options." },
];

// ---------------------------------------------------------------------------
// Document assembly
// ---------------------------------------------------------------------------

const serviceDoc = {
  _id: "service-joint-replacement",
  _type: "service",
  title: "Joint Replacement",
  slug: { current: "joint-replacement" },
  category: { _type: "reference", _ref: "treatmentCategory-joint-replacement" },
  icon: "Bone",
  shortDescription: "Hip, knee, and shoulder replacement to relieve pain and restore mobility.",
  introduction:
    "Dr. Manu Gautam provides evaluation and treatment planning for knee, hip and shoulder joint conditions. Joint replacement may be considered when persistent pain, stiffness and reduced mobility continue despite appropriate non-surgical treatment. Every treatment plan begins with a detailed orthopedic assessment to understand the cause of your symptoms and the options available to you.",
  heroImage: {
    _type: "image",
    asset: { _type: "reference", _ref: "image-b5b2e1ad5e0bd69018d73003e3ef6ab421deb1e0-770x500-jpg" },
  },
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
  recovery: [], // superseded by recoveryStages
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
    { _key: key(), _type: "reference", _ref: "service-robotic-knee-replacement" },
    { _key: key(), _type: "reference", _ref: "service-sports-injuries" },
    { _key: key(), _type: "reference", _ref: "service-rehabilitation" },
    { _key: key(), _type: "reference", _ref: "service-trauma-care" },
  ],
  relatedConditions: [],
  faqs: faqs.map((f) => ({ _key: key(), _type: "reference", _ref: f.id })),
  medicalReviewer: { _type: "reference", _ref: "doctor-manu-gautam" },
  reviewDate: "2026-07-21",
  featured: true,
  order: 1,
  seo: {
    metaTitle: "Joint Replacement Surgeon in Noida | Dr. Manu Gautam",
    metaDescription:
      "Consult Dr. Manu Gautam in Noida for knee, hip and shoulder joint replacement evaluation, personalised treatment planning and recovery-focused care.",
  },
};

async function seed() {
  // Remove the stray unpublished draft so Studio doesn't show conflicting state.
  await client.delete("drafts.service-joint-replacement").catch(() => {});

  const tx = client.transaction();
  for (const f of faqs) {
    tx.createOrReplace({ _id: f.id, _type: "faq", question: f.q, answer: f.a, category: "treatments" });
  }
  tx.createOrReplace(serviceDoc);
  await tx.commit();

  console.log(`Seeded joint-replacement service document and ${faqs.length} FAQs.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
