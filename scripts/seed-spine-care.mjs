// Seeds the Spine Care treatment page. See seed-joint-replacement.mjs for the
// compliance note on the doctor bio data conflict — the same caution applies.
// Run with: node --env-file=.env.local scripts/seed-spine-care.mjs
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
  block("Spine Care for Back and Neck Pain", "h2"),
  block(
    "Back and neck pain can significantly affect daily life, work and sleep. Pain in the spine can arise from a range of causes, including disc problems, nerve compression, degenerative changes, injuries or postural strain. In many cases, spinal symptoms improve with non-surgical treatment such as physiotherapy, medicines and lifestyle changes."
  ),
  block(
    "Spine care covers a broad range of evaluation and treatment options for conditions affecting the neck (cervical spine) and lower back (lumbar spine). Treatment recommendations depend on a detailed clinical assessment that considers your symptoms, examination findings and, where required, diagnostic imaging."
  ),
  block(
    "As a spine care specialist, Dr. Manu Gautam focuses on understanding the underlying cause of your back or neck pain before recommending a treatment approach, whether non-surgical or surgical."
  ),
  block(
    "Spine surgery is generally considered when persistent back or neck pain, nerve-related symptoms or spinal instability continue despite appropriate non-surgical treatment.",
    "blockquote"
  ),
  block("What Does Spine Care Involve?", "h2"),
  block(
    "The spine is made up of a series of bones (vertebrae) separated by discs that act as cushions, along with nerves that run through and branch out from the spinal column. Damage or changes to any of these structures, such as a bulging disc, nerve compression or degenerative changes, can cause pain, stiffness or nerve-related symptoms such as numbness or weakness."
  ),
  block(
    "Spine care begins with identifying the cause of your symptoms through clinical examination and, where necessary, imaging. Many spinal conditions are initially managed through non-surgical treatment, and surgery is considered only when appropriate non-surgical options have not provided sufficient relief or when specific findings indicate a need for surgical evaluation."
  ),
  block(
    "The overall aim of spine care is to reduce pain, protect nerve function and help improve your ability to carry out daily activities. Your orthopedic surgeon will recommend a treatment approach based on a thorough evaluation of your individual condition."
  ),
];

const whenToConsult = [
  block(
    "Early orthopedic evaluation can help determine the cause of your back or neck symptoms and the treatment options available to you. If pain, stiffness or nerve-related symptoms are affecting your daily life, consulting a spine specialist can help clarify whether non-surgical treatment or further evaluation may be appropriate."
  ),
];

const diagnosis = [
  block(
    "Diagnosis typically begins with a physical and neurological examination to assess movement, reflexes, strength and sensation. Depending on your symptoms, imaging such as X-rays, MRI or CT scans may be recommended to evaluate the spine's structures and identify the cause of your symptoms."
  ),
];

const candidacy = [
  block(
    "Suitability for spine surgery is assessed individually and depends on factors including the specific condition, the severity and duration of your symptoms, and how much your daily activities are affected. Your surgeon will also consider your response to non-surgical treatment, your general medical condition and imaging findings."
  ),
  block(
    "Not everyone with a spinal condition requires surgery, and treatment suitability depends on individual evaluation rather than a fixed set of criteria. A detailed consultation helps determine whether spine surgery, continued non-surgical treatment, or further investigation is the most appropriate next step for you."
  ),
];

const nonSurgicalOptions = [
  block(
    "Many patients with back or neck pain are initially treated through non-surgical methods, depending on the cause and severity of their condition. Common approaches include pain-relief medicines, physiotherapy, targeted exercises to strengthen supporting muscles, and posture or activity modification."
  ),
  block(
    "Additional options may include spinal injections in appropriate cases, along with lifestyle changes such as ergonomic adjustments at work or home. Regular monitoring allows your treatment plan to be adjusted based on how your symptoms respond."
  ),
  block(
    "Recovery differs from patient to patient, and non-surgical treatment does not work the same way for everyone. Your orthopedic surgeon will discuss which combination of these options may be suitable for your specific condition."
  ),
];

const whenSurgeryConsidered = [
  block(
    "Spine surgery may be discussed when persistent pain, nerve-related symptoms or spinal instability continue despite appropriate non-surgical treatment, particularly when imaging findings correlate with your symptoms. Treatment suitability depends on individual evaluation, and your orthopedic surgeon will recommend surgery only after a detailed examination and discussion of the available options."
  ),
];

const surgicalProcedure = [
  block("Surgical Preparation", "h3"),
  block(
    "Before surgery, preoperative checks are carried out, including relevant blood tests and an anaesthesia assessment, alongside a review of your imaging and surgical plan."
  ),
  block("Accessing the Affected Spinal Level", "h3"),
  block(
    "The surgical approach is planned based on the specific spinal level and condition being treated, using techniques suited to your individual case."
  ),
  block("Addressing the Underlying Condition", "h3"),
  block(
    "Depending on your condition, the procedure may involve relieving pressure on affected nerves, stabilising the spine, or addressing damaged disc material."
  ),
  block("Stability and Alignment Assessment", "h3"),
  block(
    "Spinal alignment and stability are assessed during the procedure to help confirm that the intended surgical outcome has been achieved."
  ),
  block("Postoperative Monitoring", "h3"),
  block(
    "After surgery, you are closely observed as part of your recovery, with attention to pain management and guidance for initial, supervised mobilisation."
  ),
];

const technologyUsed = [
  block(
    "Depending on your specific spinal condition, imaging-guided planning and surgical techniques suited to the affected spinal level may be used to support precision during treatment. Your surgeon will explain the approach most appropriate for your condition during your consultation."
  ),
];

const preparation = [
  block(
    "Preparing well for spine surgery can support a smoother experience. This general guidance should be followed alongside your doctor's individual instructions:"
  ),
  bullet("Share your complete medical history with your surgeon"),
  bullet("Inform the doctor about current medicines you are taking"),
  bullet("Complete the recommended medical tests and imaging before surgery"),
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
    "Physiotherapy plays an important role in recovery after spine treatment, whether surgical or non-surgical. Your rehabilitation plan may include guided exercises to improve strength, flexibility and posture, along with gradual progression toward your usual daily activities."
  ),
];

const urgentCare = [
  block(
    "Seek urgent medical attention if you experience sudden loss of bladder or bowel control, progressive weakness or numbness, or severe pain following an injury. These symptoms may indicate a serious spinal condition requiring immediate evaluation."
  ),
];

const whyThisDoctor = [
  block(
    "Dr. Manu Gautam is an orthopedic surgeon with a specialisation in spine care, alongside joint replacement and sports injuries. Consultations focus on a detailed clinical evaluation, a clear explanation of the treatment options available to you, and individualised planning that considers your specific condition and goals."
  ),
];

const heroTrustPoints = ["Detailed spine evaluation", "Personalised treatment planning", "Recovery and rehabilitation guidance"];

const treatmentTypes = [
  {
    _key: key(),
    _type: "treatmentType",
    title: "Cervical Spine Care",
    description:
      "Cervical spine care addresses conditions affecting the neck, including disc problems, nerve compression and degenerative changes that can cause neck pain, stiffness or symptoms radiating into the arms. Treatment may range from physiotherapy and medicines to surgical options in appropriate cases, depending on the severity of symptoms and examination findings.",
  },
  {
    _key: key(),
    _type: "treatmentType",
    title: "Lumbar Spine Care",
    description:
      "Lumbar spine care focuses on conditions affecting the lower back, such as disc problems, spinal stenosis and degenerative changes that can cause back pain or symptoms radiating into the legs. Non-surgical treatment is typically considered first, with surgical options discussed when appropriate non-surgical treatment does not provide sufficient relief.",
  },
  {
    _key: key(),
    _type: "treatmentType",
    title: "Minimally Invasive Spine Treatment",
    description:
      "In appropriate cases, minimally invasive techniques may be considered for certain spinal conditions, aiming to address the underlying problem with a more limited surgical approach. Suitability depends on the specific condition, its severity and your overall clinical evaluation.",
  },
];

const conditionsGrid = [
  { _key: key(), _type: "conditionEntry", title: "Disc Herniation", description: "A condition where the soft inner material of a spinal disc pushes through its outer layer, which can press on nearby nerves and cause pain." },
  { _key: key(), _type: "conditionEntry", title: "Degenerative Disc Disease", description: "Gradual wear of the spinal discs over time, which can lead to reduced cushioning between vertebrae and contribute to back or neck pain." },
  { _key: key(), _type: "conditionEntry", title: "Spinal Stenosis", description: "Narrowing of the spinal canal that can put pressure on the spinal cord or nerves, sometimes causing pain, numbness or weakness." },
  { _key: key(), _type: "conditionEntry", title: "Sciatica", description: "Pain that radiates along the path of the sciatic nerve, often caused by nerve compression in the lower spine." },
  { _key: key(), _type: "conditionEntry", title: "Cervical Spondylosis", description: "Age-related wear affecting the discs and joints of the neck, which can cause stiffness, pain or nerve-related symptoms." },
  { _key: key(), _type: "conditionEntry", title: "Spondylolisthesis", description: "A condition where one vertebra slips forward over the one below it, which may cause pain or nerve-related symptoms." },
  { _key: key(), _type: "conditionEntry", title: "Spinal Deformity", description: "Changes in the normal curvature or alignment of the spine, such as scoliosis, which may affect posture and movement." },
  { _key: key(), _type: "conditionEntry", title: "Spinal Fractures", description: "Fractures involving the bones of the spine, often related to injury or, in some cases, weakened bone density." },
  { _key: key(), _type: "conditionEntry", title: "Failed Previous Spine Surgery", description: "Continued or recurring symptoms following a previous spine surgery, which may require further evaluation." },
];

const symptoms = [
  "Persistent back or neck pain",
  "Pain that radiates into the arms or legs",
  "Numbness or tingling",
  "Muscle weakness",
  "Stiffness after rest",
  "Reduced range of movement",
  "Pain that affects sleep",
  "Difficulty standing or walking for long periods",
  "Pain that worsens with certain movements",
  "Loss of bladder or bowel control (requires urgent evaluation)",
  "Limited improvement with physiotherapy or medicines",
  "Increasing dependence on pain medication",
];

const candidacyChecklist = [
  "Pain continues despite appropriate non-surgical treatment",
  "Imaging shows nerve compression or structural spinal changes",
  "Nerve-related symptoms such as numbness or weakness are present",
  "Pain significantly affects work, sleep or daily activities",
  "Symptoms are progressively worsening",
];

const benefits = [
  "Reduced back or neck pain",
  "Relief from nerve-related symptoms",
  "Improved spinal stability",
  "Improved performance of daily activities",
  "Protection of nerve function",
  "Improved overall mobility",
];

const risks = [
  "Infection",
  "Blood clots",
  "Bleeding",
  "Nerve injury",
  "Persistent or recurring pain",
  "Anaesthesia-related complications",
  "Spinal instability",
  "Need for further surgery",
];

const recoveryStages = [
  { _key: key(), _type: "recoveryStage", stage: "Stage 1", title: "Before Surgery", description: "Assessment, imaging, preparation and rehabilitation guidance are completed ahead of your procedure." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 2", title: "Hospital Recovery", description: "Pain management, monitoring and assisted movement begin under the care of your surgical team." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 3", title: "First Few Weeks", description: "Wound care, activity guidance and follow-up appointments continue as you begin recovery at home." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 4", title: "Progressive Rehabilitation", description: "Structured physiotherapy supports strengthening, posture and gradual return to daily activities." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 5", title: "Long-Term Recovery", description: "A gradual return to suitable activities continues based on the advice of your surgeon and physiotherapist." },
];

const faqs = [
  { id: "faq-sc-01", q: "What is spine care?", a: "Spine care covers the evaluation and treatment of conditions affecting the neck and back, including disc problems, nerve compression and spinal degeneration. Treatment may be non-surgical or surgical depending on your specific condition. Your orthopedic surgeon will recommend an approach based on a detailed clinical evaluation of your symptoms and examination findings." },
  { id: "faq-sc-02", q: "When is spine surgery recommended?", a: "Spine surgery is generally considered when persistent pain, nerve-related symptoms or spinal instability continue despite appropriate non-surgical treatment, particularly when imaging findings correlate with your symptoms. Your surgeon will discuss this option with you after a thorough examination and review of your investigations." },
  { id: "faq-sc-03", q: "What causes back and neck pain?", a: "Back and neck pain can result from various causes, including disc problems, degenerative changes, muscle strain, nerve compression or spinal deformity. Identifying the underlying cause through clinical evaluation helps guide the most appropriate treatment approach for your specific symptoms." },
  { id: "faq-sc-04", q: "Is spine surgery suitable for every patient?", a: "Spine surgery is not automatically suitable for every patient. Suitability depends on factors such as the specific condition, severity of symptoms, response to non-surgical treatment and overall health. A detailed consultation helps determine the most appropriate approach for your situation." },
  { id: "faq-sc-05", q: "What is the difference between cervical and lumbar spine treatment?", a: "Cervical spine treatment addresses conditions affecting the neck, while lumbar spine treatment addresses conditions affecting the lower back. Both involve similar evaluation principles but differ in the specific anatomy, symptoms and surgical techniques involved, depending on the spinal level affected." },
  { id: "faq-sc-06", q: "What tests are required before spine treatment?", a: "Common evaluations include a physical and neurological examination, along with imaging such as X-rays, MRI or CT scans depending on your symptoms. Additional tests may be recommended based on your medical history and examination findings." },
  { id: "faq-sc-07", q: "How long does spine surgery take?", a: "The duration of spine surgery varies depending on the specific condition, spinal level involved and the surgical approach used. Your surgeon can provide a more specific estimate based on your individual treatment plan during your consultation." },
  { id: "faq-sc-08", q: "How long will I need to stay in the hospital after spine surgery?", a: "Hospital stay duration after spine surgery depends on the specific procedure, your overall health and how your recovery progresses in the initial days. Your surgical team will guide you on discharge planning based on your individual progress." },
  { id: "faq-sc-09", q: "Is physiotherapy required after spine treatment?", a: "Yes, physiotherapy is generally an important part of recovery after spine treatment, whether surgical or non-surgical. It helps improve strength, flexibility and posture through guided exercises tailored to your individual condition and recovery." },
  { id: "faq-sc-10", q: "What are the risks of spine surgery?", a: "As with any surgical procedure, spine surgery carries potential risks, including infection, bleeding, nerve injury and the possibility of persistent or recurring symptoms, among others. Your individual risks and expected benefits will be discussed during your consultation." },
  { id: "faq-sc-11", q: "Can back pain be treated without surgery?", a: "Many cases of back pain can be initially managed through non-surgical treatment such as medicines, physiotherapy and activity modification. Surgery is typically considered only when non-surgical treatment does not provide sufficient relief or specific findings indicate a need for surgical evaluation." },
  { id: "faq-sc-12", q: "What is sciatica and how is it treated?", a: "Sciatica refers to pain that radiates along the path of the sciatic nerve, often caused by nerve compression in the lower spine. Treatment typically begins with non-surgical approaches such as physiotherapy and medicines, with surgery considered in cases where symptoms persist or worsen despite these measures." },
  { id: "faq-sc-13", q: "When should I seek urgent care for spine symptoms?", a: "Seek urgent medical attention if you experience sudden loss of bladder or bowel control, progressive weakness or numbness, or severe pain following an injury. These symptoms may indicate a serious spinal condition requiring immediate evaluation." },
  { id: "faq-sc-14", q: "How long does recovery take after spine surgery?", a: "Recovery timelines after spine surgery vary depending on the specific procedure, spinal level treated, your age, medical condition and participation in rehabilitation. Recovery differs from patient to patient, and your care team will guide you through each stage." },
  { id: "faq-sc-15", q: "Can spine surgery help with nerve-related symptoms?", a: "Spine surgery may help relieve pressure on affected nerves in cases where nerve compression is contributing to symptoms such as pain, numbness or weakness. Suitability depends on individual evaluation, and your orthopedic surgeon will discuss whether this option is appropriate for your condition." },
  { id: "faq-sc-16", q: "How can I book an appointment with Dr. Manu Gautam for spine care?", a: "You can book an appointment with Dr. Manu Gautam by calling +91 9769761602 or using the appointment booking option on this website. Our team will help schedule a consultation to discuss your back or neck symptoms and the evaluation process." },
];

const serviceDoc = {
  _id: "service-spine-care",
  _type: "service",
  title: "Spine Care",
  slug: { current: "spine-care" },
  icon: "Activity",
  shortDescription: "Advanced treatments for back and neck pain, disc problems, and spinal disorders.",
  introduction:
    "Dr. Manu Gautam provides evaluation and treatment planning for back and neck pain, disc problems and spinal disorders. Spine surgery may be considered when persistent pain, stiffness or nerve-related symptoms continue despite appropriate non-surgical treatment. Every treatment plan begins with a detailed clinical assessment to understand the cause of your symptoms and the options available to you.",
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
    { _key: key(), _type: "reference", _ref: "service-sports-injuries" },
    { _key: key(), _type: "reference", _ref: "service-rehabilitation" },
    { _key: key(), _type: "reference", _ref: "service-trauma-care" },
  ],
  relatedConditions: [],
  faqs: faqs.map((f) => ({ _key: key(), _type: "reference", _ref: f.id })),
  medicalReviewer: { _type: "reference", _ref: "doctor-manu-gautam" },
  reviewDate: "2026-07-21",
  featured: false,
  order: 3,
  seo: {
    metaTitle: "Spine Care Specialist in Noida | Dr. Manu Gautam",
    metaDescription:
      "Consult Dr. Manu Gautam in Noida for back and neck pain evaluation, personalised spine treatment planning and recovery-focused orthopedic care.",
  },
};

async function seed() {
  await client.delete("drafts.service-spine-care").catch(() => {});
  const tx = client.transaction();
  for (const f of faqs) {
    tx.createOrReplace({ _id: f.id, _type: "faq", question: f.q, answer: f.a, category: "treatments" });
  }
  tx.createOrReplace(serviceDoc);
  await tx.commit();
  console.log(`Seeded spine-care service document and ${faqs.length} FAQs.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
