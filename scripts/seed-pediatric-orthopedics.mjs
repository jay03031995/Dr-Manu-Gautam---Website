// Seeds the Pediatric Orthopedics treatment page.
// Also clears the previously-set heroImage, which was mistakenly pointing at
// the doctor's own headshot photo (confusing on a page about children's care) —
// the page now gracefully shows no hero image until a real one is uploaded.
// See seed-joint-replacement.mjs for the compliance note on the doctor bio data
// conflict — same caution applies.
// Run with: node --env-file=.env.local scripts/seed-pediatric-orthopedics.mjs
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
  block("Pediatric Orthopedic Care for Growing Children", "h2"),
  block(
    "Children's bones, joints and growth plates are different from those of adults, and orthopedic conditions in childhood often require an approach that considers ongoing growth and development. Pediatric orthopedic conditions can be present from birth, develop during growth, or result from injury."
  ),
  block(
    "Common reasons for pediatric orthopedic evaluation include concerns about a child's walking pattern, limb alignment, joint development, or injuries such as fractures. Many conditions in children improve with growth and observation alone, while others may benefit from bracing, physiotherapy or, in some cases, surgical treatment."
  ),
  block(
    "As with all orthopedic care at this practice, treatment recommendations for children are based on a detailed evaluation of the specific condition, the child's age and stage of growth, and, where appropriate, discussion with the family about the available options."
  ),
  block(
    "Many pediatric orthopedic concerns are monitored through growth and may not require surgical treatment, while others benefit from early evaluation to guide appropriate management.",
    "blockquote"
  ),
  block("What Does Pediatric Orthopedic Care Involve?", "h2"),
  block(
    "Pediatric orthopedic care covers the evaluation and treatment of bone, joint and muscle conditions in children, including congenital conditions present from birth, developmental conditions that emerge during growth, and injuries such as fractures."
  ),
  block(
    "Because children are still growing, treatment approaches often differ from those used in adults. Growth plates, which are areas of developing tissue near the ends of long bones, require particular care during evaluation and treatment, as they play an important role in a child's future bone growth."
  ),
  block(
    "The overall aim of pediatric orthopedic care is to support healthy growth and development, address conditions that may affect movement or alignment, and involve families in understanding their child's condition and the treatment approach being considered."
  ),
];

const whenToConsult = [
  block(
    "Consider a pediatric orthopedic evaluation if you notice an unusual walking pattern, limb alignment differences, persistent pain, a spinal curve, or if your child experiences a fracture or significant injury."
  ),
];

const diagnosis = [
  block(
    "Diagnosis typically begins with a physical examination, including assessment of your child's walking pattern, limb alignment and joint movement. Depending on the findings, X-rays or other imaging may be recommended to further evaluate the condition."
  ),
];

const candidacy = [
  block(
    "A pediatric orthopedic evaluation may be helpful when parents or caregivers notice changes in a child's walking pattern, limb alignment, or movement, or following an injury such as a fracture. Many conditions identified in childhood are monitored through growth, while others may benefit from early evaluation to guide appropriate treatment. A detailed assessment helps determine whether observation, non-surgical treatment, or further evaluation is appropriate for your child."
  ),
];

const nonSurgicalOptions = [
  block(
    "Many pediatric orthopedic conditions are initially managed through observation and monitoring, particularly when related to normal growth patterns that are expected to improve over time. Where treatment is needed, options may include bracing, casting or physiotherapy, depending on the specific condition."
  ),
  block(
    "Regular follow-up allows your child's growth and development to be monitored, with treatment plans adjusted as needed based on how the condition progresses. Family involvement and understanding of the condition are an important part of pediatric orthopedic care."
  ),
  block(
    "Recovery and improvement differ from child to child, and non-surgical treatment does not work the same way for every condition. Your child's orthopedic surgeon will discuss which approach may be suitable based on a detailed evaluation."
  ),
];

const whenSurgeryConsidered = [
  block(
    "Surgical treatment may be considered for pediatric orthopedic conditions that do not improve with growth or non-surgical treatment, involve significant deformity, or affect a child's function and development. Treatment suitability depends on individual evaluation, and any recommendation for surgery is made only after a detailed assessment and discussion with the family."
  ),
];

const surgicalProcedure = [
  block("Surgical Preparation", "h3"),
  block("Before surgery, preoperative checks are carried out, including an anaesthesia assessment appropriate for your child, along with a review of the surgical plan with the family."),
  block("Assessment of the Affected Area", "h3"),
  block("The affected bone, joint or limb is carefully assessed during the procedure, taking into account the child's specific condition and stage of growth."),
  block("Surgical Correction", "h3"),
  block("Depending on the condition, the procedure may involve correcting alignment, stabilising a fracture, or addressing other structural concerns using techniques suited to pediatric patients."),
  block("Assessment of Alignment and Movement", "h3"),
  block("Alignment and movement are assessed during the procedure to help confirm that the intended surgical outcome has been achieved."),
  block("Postoperative Monitoring", "h3"),
  block("After surgery, your child is closely monitored as part of recovery, with attention to comfort, healing and guidance for the family on subsequent care."),
];

const technologyUsed = [
  block(
    "Pediatric orthopedic care takes into account the specific considerations of growing bones and joints, using imaging and techniques suited to children. Your child's surgeon will explain the approach most appropriate for the specific condition during your consultation."
  ),
];

const preparation = [
  block(
    "Preparing for your child's orthopedic evaluation or treatment can help the visit go smoothly. This general guidance should be followed alongside your doctor's individual instructions:"
  ),
  bullet("Bring any previous medical records, X-rays or reports related to your child's condition"),
  bullet("Note when you first noticed the symptoms or changes"),
  bullet("Inform the doctor about your child's birth history and developmental milestones, if relevant"),
  bullet("Share your child's current medicines or allergies"),
  bullet("Prepare your child for the visit in an age-appropriate, reassuring way"),
  bullet("Bring comfortable clothing that allows easy examination of the affected area"),
];

const rehabilitation = [
  block(
    "Physiotherapy may be recommended as part of your child's treatment, particularly following surgery or for certain developmental conditions. Rehabilitation programmes for children are adapted to be age-appropriate, supporting movement, strength and function as your child recovers."
  ),
];

const urgentCare = [
  block(
    "Seek prompt medical attention if your child has a suspected fracture, is unable to bear weight, has visible deformity following an injury, or develops sudden severe pain or swelling. These symptoms may require urgent evaluation."
  ),
];

const whyThisDoctor = [
  block(
    "Dr. Manu Gautam provides orthopedic evaluation and treatment for children alongside adult orthopedic care, including joint and trauma-related conditions. Consultations involve a detailed clinical evaluation, clear explanation of findings to the family, and treatment planning that considers your child's growth and development."
  ),
];

const heroTrustPoints = ["Child-focused orthopedic evaluation", "Family-centred treatment planning", "Growth and development monitoring"];

const treatmentTypes = [
  {
    _key: key(),
    _type: "treatmentType",
    title: "Congenital Condition Management",
    description:
      "Congenital orthopedic conditions, such as clubfoot or developmental hip dysplasia, are present from birth and often benefit from early evaluation. Treatment may include bracing, casting or, in some cases, surgical correction, depending on the specific condition and its severity.",
  },
  {
    _key: key(),
    _type: "treatmentType",
    title: "Growth-Related Condition Management",
    description:
      "Some orthopedic conditions in children relate to growth, including differences in limb alignment or length, or growth plate concerns. Many of these conditions are monitored through growth and may resolve naturally, while others may benefit from bracing or further evaluation.",
  },
  {
    _key: key(),
    _type: "treatmentType",
    title: "Pediatric Fracture Care",
    description:
      "Children's fractures often involve growth plates and may require a different treatment approach compared to adult fractures. Prompt evaluation helps guide appropriate treatment, whether through casting, splinting or, in some cases, surgical fixation.",
    ctaLabel: "Learn About Trauma Care",
    manualHref: "/orthopaedic-surgeon/delhi-ncr/trauma-care/",
  },
];

const conditionsGrid = [
  { _key: key(), _type: "conditionEntry", title: "Clubfoot", description: "A congenital condition where a baby's foot is turned inward and downward, often treated with early bracing or casting." },
  { _key: key(), _type: "conditionEntry", title: "Developmental Dysplasia of the Hip", description: "A condition where the hip joint has not developed normally, which may be identified in infancy or early childhood." },
  { _key: key(), _type: "conditionEntry", title: "Flat Feet", description: "A common finding in young children where the arch of the foot is reduced, which often improves naturally with growth." },
  { _key: key(), _type: "conditionEntry", title: "In-Toeing and Out-Toeing", description: "Variations in a child's walking pattern where the feet point inward or outward, which are often related to normal growth." },
  { _key: key(), _type: "conditionEntry", title: "Bow Legs and Knock Knees", description: "Variations in leg alignment that are common at different stages of childhood growth and often improve naturally." },
  { _key: key(), _type: "conditionEntry", title: "Limb Length Discrepancy", description: "A difference in the length of a child's limbs, which may be monitored or, in some cases, require treatment depending on the degree of difference." },
  { _key: key(), _type: "conditionEntry", title: "Scoliosis", description: "A sideways curvature of the spine that can develop during childhood or adolescence, sometimes requiring monitoring or bracing." },
  { _key: key(), _type: "conditionEntry", title: "Growth Plate Injuries", description: "Injuries affecting the areas of developing tissue near the ends of a child's bones, which require careful evaluation due to their role in future growth." },
  { _key: key(), _type: "conditionEntry", title: "Pediatric Fractures", description: "Bone fractures in children, which may heal differently from adult fractures and sometimes involve growth plates." },
];

const symptoms = [
  "Unusual walking pattern or limping",
  "Visible difference in limb alignment",
  "Pain during or after physical activity",
  "Reluctance to bear weight on a limb",
  "Visible curve in the spine",
  "Difference in limb length",
  "Joint stiffness or reduced movement",
  "Swelling or pain following an injury",
  "Delayed motor developmental milestones",
  "Foot or ankle deformity",
  "Persistent complaints of pain in a growing child",
  "Asymmetry in shoulder or hip height",
];

const candidacyChecklist = [
  "Your child has an unusual walking pattern or limp",
  "You have noticed a difference in limb alignment or length",
  "Your child has persistent joint or limb pain",
  "A curve in the spine has been noticed",
  "Your child has experienced a fracture or significant injury",
];

const benefits = [
  "Support for healthy growth and development",
  "Improved limb alignment where applicable",
  "Reduced pain and improved comfort",
  "Improved walking pattern and movement",
  "Early identification of conditions requiring monitoring",
  "Family involvement in understanding the treatment plan",
];

const risks = [
  "Infection",
  "Bleeding",
  "Anaesthesia-related complications",
  "Effects on future growth in specific cases",
  "Recurrence of the original condition",
  "Need for further treatment as the child grows",
];

const recoveryStages = [
  { _key: key(), _type: "recoveryStage", stage: "Stage 1", title: "Initial Evaluation", description: "Assessment, examination and any required imaging are completed to understand your child's condition." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 2", title: "Treatment or Monitoring Begins", description: "Bracing, casting, physiotherapy or surgical treatment begins, or a monitoring plan is put in place, based on the condition." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 3", title: "Early Follow-Up", description: "Your child's progress is reviewed in the early stages of treatment, with adjustments made as needed." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 4", title: "Growth Monitoring", description: "Regular follow-up continues to monitor your child's growth and the condition's progress over time." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 5", title: "Long-Term Follow-Up", description: "Ongoing review continues as needed, with treatment guidance adjusted to support your child's development." },
];

const faqs = [
  { id: "faq-po-01", q: "What is pediatric orthopedics?", a: "Pediatric orthopedics focuses on the evaluation and treatment of bone, joint and muscle conditions in infants, children and adolescents. This includes congenital conditions, developmental concerns and injuries such as fractures, with treatment approaches that consider a child's ongoing growth." },
  { id: "faq-po-02", q: "When should I take my child to see a pediatric orthopedic doctor?", a: "Consider a pediatric orthopedic evaluation if you notice an unusual walking pattern, limb alignment differences, persistent pain, a spinal curve, or if your child experiences a fracture or significant injury." },
  { id: "faq-po-03", q: "Is flat feet in children normal?", a: "Flat feet are common in young children and often improve naturally as the foot's arch develops with growth. In most cases, no specific treatment is required, though your doctor can assess whether further evaluation is needed." },
  { id: "faq-po-04", q: "What is developmental dysplasia of the hip?", a: "Developmental dysplasia of the hip is a condition where the hip joint has not developed normally, which may be identified during infancy or early childhood. Early evaluation and treatment, where needed, can help support normal hip development." },
  { id: "faq-po-05", q: "Will my child need surgery for their orthopedic condition?", a: "Many pediatric orthopedic conditions are managed through observation, bracing or physiotherapy rather than surgery. Surgical treatment is generally considered only when a condition does not improve with growth or non-surgical treatment, or involves significant deformity." },
  { id: "faq-po-06", q: "Are bow legs and knock knees normal in children?", a: "Bow legs and knock knees are common variations seen at different stages of childhood growth and often improve naturally over time. Your doctor can assess whether your child's alignment falls within the expected range or requires further evaluation." },
  { id: "faq-po-07", q: "What is scoliosis and how is it managed in children?", a: "Scoliosis is a sideways curvature of the spine that can develop during childhood or adolescence. Management depends on the degree of curvature and may include monitoring, bracing or, in more significant cases, further evaluation for surgical treatment." },
  { id: "faq-po-08", q: "How are children's fractures different from adult fractures?", a: "Children's fractures often involve growth plates, areas of developing tissue near the ends of bones, and may heal differently compared to adult fractures. Treatment takes these differences into account to support proper healing and future growth." },
  { id: "faq-po-09", q: "What tests are used to evaluate pediatric orthopedic conditions?", a: "Evaluation typically includes a physical examination of your child's walking pattern, alignment and movement. Depending on the findings, X-rays or other imaging may be recommended to assess the condition further." },
  { id: "faq-po-10", q: "Can growth plate injuries affect a child's future growth?", a: "Growth plate injuries require careful evaluation, as they can potentially affect future bone growth in some cases. Prompt assessment and appropriate treatment help guide the best approach for your child's specific injury." },
  { id: "faq-po-11", q: "How long does treatment take for a pediatric orthopedic condition?", a: "Treatment duration varies widely depending on the specific condition, its severity and your child's individual growth and response to treatment. Your child's doctor can provide guidance specific to their condition." },
  { id: "faq-po-12", q: "Is physiotherapy used for children?", a: "Yes, physiotherapy may be recommended for children as part of treatment for certain conditions or following surgery, using age-appropriate exercises to support movement, strength and function." },
  { id: "faq-po-13", q: "What should I bring to my child's first orthopedic appointment?", a: "It is helpful to bring any previous medical records, X-rays or reports related to your child's condition, along with information about when you first noticed the symptoms and your child's relevant medical history." },
  { id: "faq-po-14", q: "Will my child outgrow their orthopedic condition?", a: "Some pediatric orthopedic conditions do improve naturally with growth, while others require monitoring or treatment. Your child's doctor can explain what is expected for your child's specific condition based on evaluation." },
  { id: "faq-po-15", q: "How can I book an appointment with Dr. Manu Gautam for my child?", a: "You can book an appointment by calling +91 9769761602 or using the appointment booking option on this website. Our team will help schedule a consultation to discuss your child's condition." },
];

const serviceDoc = {
  _id: "service-pediatric-orthopedics",
  _type: "service",
  title: "Pediatric Orthopedics",
  slug: { current: "pediatric-orthopedics" },
  icon: "Baby",
  shortDescription: "Specialized care for children's bone and joint conditions.",
  introduction:
    "Dr. Manu Gautam provides evaluation and treatment planning for bone, joint and movement conditions affecting infants, children and adolescents. Pediatric orthopedic care considers each child's growth and development, with treatment recommended only after a detailed clinical assessment. Non-surgical management is often considered first, with surgical treatment reserved for specific conditions that require it.",
  // heroImage intentionally omitted — previously pointed at the doctor's own
  // headshot, which was a data-entry mistake. Upload a real child-appropriate
  // photo in Studio when available.
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
    { _key: key(), _type: "reference", _ref: "service-trauma-care" },
    { _key: key(), _type: "reference", _ref: "service-rehabilitation" },
  ],
  relatedConditions: [],
  faqs: faqs.map((f) => ({ _key: key(), _type: "reference", _ref: f.id })),
  medicalReviewer: { _type: "reference", _ref: "doctor-manu-gautam" },
  reviewDate: "2026-07-21",
  featured: false,
  order: 7,
  seo: {
    metaTitle: "Pediatric Orthopedic Specialist in Noida | Dr. Manu Gautam",
    metaDescription:
      "Consult Dr. Manu Gautam in Noida for pediatric orthopedic evaluation, growth-focused treatment planning and family-centred care for children.",
  },
};

async function seed() {
  await client.delete("drafts.service-pediatric-orthopedics").catch(() => {});
  const tx = client.transaction();
  for (const f of faqs) {
    tx.createOrReplace({ _id: f.id, _type: "faq", question: f.q, answer: f.a, category: "treatments" });
  }
  tx.createOrReplace(serviceDoc);
  await tx.commit();
  console.log(`Seeded pediatric-orthopedics service document and ${faqs.length} FAQs.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
