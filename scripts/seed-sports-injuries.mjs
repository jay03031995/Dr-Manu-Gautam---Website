// Seeds the Sports Injuries treatment page. See seed-joint-replacement.mjs for
// the compliance note on the doctor bio data conflict — same caution applies.
// Run with: node --env-file=.env.local scripts/seed-sports-injuries.mjs
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
  block("Sports Injury Treatment for Active Recovery", "h2"),
  block(
    "Sports injuries can affect ligaments, tendons, cartilage and bones, often resulting from sudden trauma, repetitive strain or overuse during physical activity. Common sports injuries include ligament tears, meniscus injuries, rotator cuff problems and sprains, which can cause pain, swelling, instability or reduced movement in the affected joint."
  ),
  block(
    "Treatment for sports injuries depends on the type and severity of the injury, and may involve non-surgical rehabilitation, arthroscopic surgery or a combination of both. A detailed clinical assessment, including examination and imaging where required, helps determine the most suitable approach for your specific injury."
  ),
  block(
    "As a sports injury specialist, Dr. Manu Gautam focuses on understanding the nature of your injury and your activity goals, so that any recommendation for arthroscopic surgery or sports injury treatment is based on your individual condition."
  ),
  block(
    "Sports injury treatment is generally considered based on the type and severity of the injury, your symptoms, and how much your activity levels and daily function are affected.",
    "blockquote"
  ),
  block("What Does Sports Injury Treatment Involve?", "h2"),
  block(
    "Sports injuries range from mild sprains and strains to more significant ligament or cartilage tears that may affect joint stability and function. Many sports injuries can be managed through non-surgical treatment, including rest, physiotherapy and structured rehabilitation programmes."
  ),
  block(
    "In cases involving significant ligament tears, cartilage damage or structural joint problems, arthroscopic surgery may be considered. This is a minimally invasive surgical technique that uses a small camera and instruments to examine and treat joint problems through small incisions, aiming to address the underlying injury while supporting recovery."
  ),
  block(
    "The overall goal of sports injury treatment is to reduce pain, restore joint function and support a safe return to physical activity where appropriate. Your orthopedic surgeon will recommend treatment only after a thorough examination and review of your diagnostic assessment, considering the specific injury, your activity level and your recovery goals."
  ),
];

const whenToConsult = [
  block(
    "You should consider consulting an orthopedic surgeon if pain, swelling or instability continues beyond the initial days after an injury, if you are unable to bear weight or move the joint normally, or if symptoms are not improving with rest and home care."
  ),
];

const diagnosis = [
  block(
    "Diagnosis typically begins with a physical examination to assess joint stability, movement and areas of tenderness. Depending on your symptoms, imaging such as X-rays or MRI may be recommended to evaluate ligaments, cartilage and other soft tissue structures."
  ),
];

const candidacy = [
  block(
    "Suitability for surgical treatment of a sports injury is assessed individually and depends on the type and severity of the injury, your symptoms and joint stability, your response to non-surgical treatment, and your activity goals. Your surgeon will also review your imaging findings as part of this assessment."
  ),
  block(
    "Not every sports injury requires surgery, and treatment suitability depends on individual evaluation rather than a fixed set of criteria. A detailed consultation helps determine whether surgical treatment, continued non-surgical management, or further investigation is the most appropriate next step for you."
  ),
];

const nonSurgicalOptions = [
  block(
    "Many sports injuries are initially managed through non-surgical treatment, particularly in the early stages following an injury. Common approaches include rest, activity modification, physiotherapy and structured strengthening exercises to support the affected joint."
  ),
  block(
    "Additional measures may include bracing or supportive taping, anti-inflammatory medicines where appropriate, and a gradual, guided return to activity. Regular monitoring allows your treatment plan to be adjusted based on your recovery and response to treatment."
  ),
  block(
    "Recovery differs from patient to patient, and non-surgical treatment does not work the same way for every injury. Your orthopedic surgeon will discuss which combination of these options may be suitable for your specific injury and activity goals."
  ),
];

const whenSurgeryConsidered = [
  block(
    "Arthroscopic or other surgical treatment may be discussed when significant ligament, cartilage or tendon damage is present, when joint instability continues despite non-surgical treatment, or when your activity goals require a level of joint function that non-surgical treatment has not restored. Treatment suitability depends on individual evaluation."
  ),
];

const surgicalProcedure = [
  block("Surgical Preparation", "h3"),
  block("Before surgery, preoperative checks are carried out, including an anaesthesia assessment, to help confirm that you are prepared for the procedure."),
  block("Arthroscopic Assessment", "h3"),
  block("A small camera is used to examine the affected joint from the inside, allowing the surgical team to assess the extent of the injury directly."),
  block("Repair or Reconstruction of Damaged Tissue", "h3"),
  block("Depending on the injury, the procedure may involve repairing or reconstructing damaged ligaments, cartilage or tendons using techniques suited to the specific injury."),
  block("Joint Function Assessment", "h3"),
  block("Joint stability and movement are assessed during the procedure to help confirm that the intended surgical outcome has been achieved."),
  block("Postoperative Monitoring", "h3"),
  block("After surgery, you are closely observed as part of your recovery, with attention to pain management and guidance for initial, supervised movement."),
];

const technologyUsed = [
  block(
    "Arthroscopic techniques, using small incisions and camera-guided instruments, may be used to assess and treat sports injuries with a minimally invasive approach. Your surgeon will explain the specific technique most appropriate for your injury during your consultation."
  ),
];

const preparation = [
  block(
    "Preparing well for sports injury surgery can support a smoother experience. This general guidance should be followed alongside your doctor's individual instructions:"
  ),
  bullet("Share your complete medical history with your surgeon"),
  bullet("Inform the doctor about current medicines you are taking"),
  bullet("Complete the recommended medical tests and imaging before surgery"),
  bullet("Follow instructions regarding blood-thinning medicines"),
  bullet("Arrange family or caregiver support for your recovery period"),
  bullet("Follow preoperative fasting instructions given by your care team"),
  bullet("Understand physiotherapy and rehabilitation requirements in advance"),
  bullet("Discuss your activity and sporting goals with your surgeon"),
];

const rehabilitation = [
  block(
    "Physiotherapy and structured rehabilitation are central to recovery from sports injuries. Your rehabilitation plan may include guided exercises to restore strength, flexibility, balance and joint control, along with a gradual, supervised return to sport or physical activity based on your individual recovery."
  ),
];

const urgentCare = [
  block(
    "Seek prompt medical attention if you experience a sudden increase in pain or swelling, inability to bear weight, visible deformity, or numbness or loss of sensation following an injury. These symptoms may require urgent evaluation."
  ),
];

const whyThisDoctor = [
  block(
    "Dr. Manu Gautam is an orthopedic surgeon with a specialisation in sports injuries, alongside joint replacement and spine care. Consultations focus on a detailed clinical evaluation, a clear explanation of the treatment options available to you, and individualised planning that considers your specific injury and activity goals."
  ),
];

const heroTrustPoints = ["Detailed sports injury evaluation", "Personalised treatment planning", "Return-to-activity guidance"];

const treatmentTypes = [
  {
    _key: key(),
    _type: "treatmentType",
    title: "Ligament Injury Treatment",
    description:
      "Ligament injuries, such as ACL or other knee ligament tears, can cause pain, swelling and joint instability. Treatment may range from structured physiotherapy and bracing to arthroscopic ligament reconstruction, depending on the severity of the injury and your activity requirements.",
  },
  {
    _key: key(),
    _type: "treatmentType",
    title: "Meniscus and Cartilage Injury Treatment",
    description:
      "Meniscus tears and cartilage injuries in the knee can cause pain, swelling, and a sensation of catching or locking in the joint. Depending on the location and extent of the tear, treatment may involve non-surgical management or arthroscopic surgery to repair or address the damaged tissue.",
  },
  {
    _key: key(),
    _type: "treatmentType",
    title: "Shoulder Injury Treatment",
    description:
      "Sports-related shoulder injuries, including rotator cuff tears and shoulder instability, can cause pain and restricted arm movement. Treatment options range from physiotherapy and activity modification to arthroscopic shoulder surgery in appropriate cases, based on a detailed evaluation.",
  },
];

const conditionsGrid = [
  { _key: key(), _type: "conditionEntry", title: "ACL Tear", description: "A tear of the anterior cruciate ligament in the knee, often caused by sudden changes in direction or landing awkwardly during sport." },
  { _key: key(), _type: "conditionEntry", title: "Meniscus Tear", description: "Damage to the cartilage that cushions the knee joint, which can cause pain, swelling and a catching sensation during movement." },
  { _key: key(), _type: "conditionEntry", title: "Rotator Cuff Injury", description: "Damage to the group of muscles and tendons that stabilise the shoulder, which can cause pain and restricted arm movement." },
  { _key: key(), _type: "conditionEntry", title: "Shoulder Dislocation", description: "A condition where the upper arm bone comes out of the shoulder socket, which can cause pain and joint instability." },
  { _key: key(), _type: "conditionEntry", title: "Ankle Sprain", description: "Stretching or tearing of the ligaments around the ankle, commonly caused by twisting or rolling the ankle during activity." },
  { _key: key(), _type: "conditionEntry", title: "Tendinitis", description: "Inflammation of a tendon, often caused by repetitive strain or overuse during sports or physical activity." },
  { _key: key(), _type: "conditionEntry", title: "Cartilage Damage", description: "Wear or injury to the cartilage that cushions a joint, which can affect movement and joint function over time." },
  { _key: key(), _type: "conditionEntry", title: "Muscle Strains", description: "Stretching or tearing of muscle fibres, often occurring during sudden or repetitive physical exertion." },
  { _key: key(), _type: "conditionEntry", title: "Stress Fractures", description: "Small cracks in a bone caused by repetitive stress or overuse, common in athletes and physically active individuals." },
];

const symptoms = [
  "Persistent joint or muscle pain",
  "Swelling after activity",
  "Joint instability or a feeling of giving way",
  "Reduced range of movement",
  "Pain during specific movements or activities",
  "A catching or locking sensation in the joint",
  "Weakness in the affected area",
  "Difficulty returning to sport or physical activity",
  "Pain that persists despite rest",
  "Bruising or visible swelling after injury",
  "Limited improvement with initial rest or home care",
  "Recurring injury in the same area",
];

const candidacyChecklist = [
  "Pain or instability continues despite rest and initial treatment",
  "Imaging confirms a significant ligament, cartilage or tendon injury",
  "Joint instability is affecting daily or sporting activities",
  "Non-surgical treatment has not provided sufficient improvement",
  "You wish to return to a specific level of physical activity",
];

const benefits = [
  "Reduced joint pain",
  "Improved joint stability",
  "Restored range of movement",
  "Support for a structured return to activity",
  "Reduced risk of further joint damage",
  "Improved overall joint function",
];

const risks = [
  "Infection",
  "Blood clots",
  "Bleeding",
  "Joint stiffness",
  "Incomplete healing of repaired tissue",
  "Nerve or blood vessel injury",
  "Anaesthesia-related complications",
  "Recurrence of injury",
  "Need for further surgery",
];

const recoveryStages = [
  { _key: key(), _type: "recoveryStage", stage: "Stage 1", title: "Before Surgery", description: "Assessment, imaging, preparation and rehabilitation guidance are completed ahead of your procedure." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 2", title: "Early Recovery", description: "Pain management, swelling control and protected movement begin under the guidance of your care team." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 3", title: "First Few Weeks", description: "Wound care, guided exercises and follow-up appointments continue as you begin recovery." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 4", title: "Progressive Rehabilitation", description: "Structured physiotherapy supports strengthening, balance and gradual reintroduction of movement." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 5", title: "Return to Activity", description: "A gradual, guided return to sport or physical activity continues based on the advice of your surgeon and physiotherapist." },
];

const faqs = [
  { id: "faq-si-01", q: "What is a sports injury?", a: "A sports injury refers to damage to muscles, ligaments, tendons, cartilage or bones that occurs during physical activity or sport. Common examples include ligament tears, meniscus injuries, sprains and strains. Treatment depends on the type and severity of the injury, as determined through clinical evaluation." },
  { id: "faq-si-02", q: "When should I see a doctor for a sports injury?", a: "You should consider consulting an orthopedic surgeon if pain, swelling or instability continues beyond the initial days after an injury, if you are unable to bear weight or move the joint normally, or if symptoms are not improving with rest and home care." },
  { id: "faq-si-03", q: "What is arthroscopic surgery?", a: "Arthroscopic surgery is a minimally invasive surgical technique that uses a small camera and instruments inserted through small incisions to examine and treat joint problems. It is commonly used for certain ligament, cartilage and tendon injuries." },
  { id: "faq-si-04", q: "Is surgery always required for a sports injury?", a: "No, many sports injuries can be managed through non-surgical treatment such as physiotherapy, activity modification and structured rehabilitation. Surgery is generally considered when non-surgical treatment does not provide sufficient improvement or when the injury significantly affects joint stability or function." },
  { id: "faq-si-05", q: "How long does arthroscopic surgery take?", a: "The duration of arthroscopic surgery varies depending on the specific injury being treated and the complexity of the procedure. Your surgeon can provide a more specific estimate based on your individual treatment plan during your consultation." },
  { id: "faq-si-06", q: "What tests are required before sports injury treatment?", a: "Common evaluations include a physical examination to assess joint stability and movement, along with imaging such as X-rays or MRI depending on your symptoms. Additional tests may be recommended based on your specific injury." },
  { id: "faq-si-07", q: "How long will I need to stay in the hospital after arthroscopic surgery?", a: "Many arthroscopic procedures involve a short hospital stay, though this can vary depending on the specific injury, the extent of the procedure and your overall health. Your surgical team will guide you on discharge planning based on your individual case." },
  { id: "faq-si-08", q: "When can I return to sport after an injury?", a: "The timeline for returning to sport varies depending on the type and severity of the injury, the treatment provided and your individual recovery. Your surgeon and physiotherapist will guide you through a structured return-to-activity plan based on your progress." },
  { id: "faq-si-09", q: "Is physiotherapy required after a sports injury?", a: "Yes, physiotherapy is generally an important part of recovery from sports injuries, whether treated surgically or non-surgically. It helps restore strength, flexibility, balance and joint control as part of a structured recovery programme." },
  { id: "faq-si-10", q: "What are the risks of arthroscopic surgery?", a: "As with any surgical procedure, arthroscopic surgery carries potential risks, including infection, bleeding, joint stiffness and the possibility of incomplete healing, among others. Your individual risks and expected benefits will be discussed during your consultation." },
  { id: "faq-si-11", q: "Can a torn ligament heal without surgery?", a: "Some ligament injuries may improve with non-surgical treatment such as physiotherapy and bracing, depending on the specific ligament involved and the severity of the tear. Others may require surgical reconstruction to restore joint stability. Your surgeon will assess your specific injury to determine the most suitable approach." },
  { id: "faq-si-12", q: "What is a meniscus tear?", a: "A meniscus tear involves damage to the cartilage that cushions the knee joint, often caused by twisting movements during sport. Symptoms can include pain, swelling and a catching or locking sensation in the knee. Treatment depends on the location and extent of the tear." },
  { id: "faq-si-13", q: "How long does recovery take after a sports injury?", a: "Recovery timelines after a sports injury vary depending on the type and severity of the injury, the treatment provided, and individual factors such as age and participation in rehabilitation. Recovery differs from patient to patient, and your care team will guide you through each stage." },
  { id: "faq-si-14", q: "Can sports injuries recur?", a: "Yes, sports injuries can recur, particularly if the affected joint has not fully regained strength and stability before returning to activity. A structured, guided rehabilitation programme can help support a safer return to sport and reduce this risk." },
  { id: "faq-si-15", q: "What activities can I do after recovering from a sports injury?", a: "Many patients are able to gradually resume physical activities following recovery, guided by their surgeon and physiotherapist. The specific activities considered appropriate depend on the injury treated, your overall recovery and individual factors." },
  { id: "faq-si-16", q: "How can I book an appointment with Dr. Manu Gautam for a sports injury?", a: "You can book an appointment with Dr. Manu Gautam by calling +91 9769761602 or using the appointment booking option on this website. Our team will help schedule a consultation to discuss your injury, symptoms and the evaluation process." },
];

const serviceDoc = {
  _id: "service-sports-injuries",
  _type: "service",
  title: "Sports Injuries",
  slug: { current: "sports-injuries" },
  icon: "Sparkles",
  shortDescription: "Arthroscopic surgery and rehabilitation for athletes and active individuals.",
  introduction:
    "Dr. Manu Gautam provides evaluation and treatment planning for sports injuries affecting the knee, shoulder and other joints. Treatment may range from non-surgical rehabilitation to arthroscopic surgery, depending on the nature and severity of the injury. Every treatment plan begins with a detailed orthopedic assessment to understand the cause of your symptoms and the options available to you.",
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
    { _key: key(), _type: "reference", _ref: "location-ghaziabad" },
  ],
  doctor: { _type: "reference", _ref: "doctor-manu-gautam" },
  testimonials: [],
  videos: [],
  relatedTreatments: [
    { _key: key(), _type: "reference", _ref: "service-joint-replacement" },
    { _key: key(), _type: "reference", _ref: "service-rehabilitation" },
    { _key: key(), _type: "reference", _ref: "service-trauma-care" },
  ],
  relatedConditions: [],
  faqs: faqs.map((f) => ({ _key: key(), _type: "reference", _ref: f.id })),
  medicalReviewer: { _type: "reference", _ref: "doctor-manu-gautam" },
  reviewDate: "2026-07-21",
  featured: false,
  order: 4,
  seo: {
    metaTitle: "Sports Injury Specialist in Noida | Dr. Manu Gautam",
    metaDescription:
      "Consult Dr. Manu Gautam in Noida for sports injury evaluation, arthroscopic treatment planning and structured return-to-activity guidance.",
  },
};

async function seed() {
  await client.delete("drafts.service-sports-injuries").catch(() => {});
  const tx = client.transaction();
  for (const f of faqs) {
    tx.createOrReplace({ _id: f.id, _type: "faq", question: f.q, answer: f.a, category: "treatments" });
  }
  tx.createOrReplace(serviceDoc);
  await tx.commit();
  console.log(`Seeded sports-injuries service document and ${faqs.length} FAQs.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
