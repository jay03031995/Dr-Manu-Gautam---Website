// Seeds the Rehabilitation treatment page.
//
// NOTE ON STRUCTURE: unlike the other treatment pages, Rehabilitation is not a
// surgical service, so several fields that exist on the shared schema (surgical
// procedure, "non-surgical alternative", risks-of-surgery) are deliberately left
// empty here rather than forced to fit — the template already hides sections
// with no content, so this degrades gracefully.
// See seed-joint-replacement.mjs for the compliance note on the doctor bio data
// conflict — same caution applies.
// Run with: node --env-file=.env.local scripts/seed-rehabilitation.mjs
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
  block("Rehabilitation and Physiotherapy for Recovery", "h2"),
  block(
    "Rehabilitation plays an important role in recovery from orthopedic surgery, injury, or conditions that affect movement and strength. A structured physiotherapy programme can help restore function, improve mobility and support a safe return to daily activities."
  ),
  block(
    "Rehabilitation needs vary widely, from recovery after joint replacement or fracture surgery, to management of sports injuries or chronic joint and back pain. A personalised rehabilitation plan is developed based on your specific condition, treatment history and functional goals."
  ),
  block(
    "At this practice, rehabilitation guidance is provided as part of a broader orthopedic treatment plan, working alongside surgical and non-surgical care to support your overall recovery."
  ),
  block(
    "Rehabilitation is generally recommended as part of recovery from orthopedic surgery, injury or conditions affecting movement, and the specific programme is tailored to your individual needs and recovery goals.",
    "blockquote"
  ),
  block("What Does Rehabilitation Involve?", "h2"),
  block(
    "Rehabilitation typically begins with an assessment of your current strength, movement, balance and functional ability. This assessment helps identify specific areas that need attention and forms the basis of a personalised treatment plan."
  ),
  block(
    "A rehabilitation programme may include guided exercises to improve strength and flexibility, balance and movement training, manual therapy techniques, and gradual progression toward specific functional goals, such as returning to work, sport or daily activities. Programmes are typically adjusted over time based on your progress."
  ),
  block(
    "The overall aim of rehabilitation is to support safe, structured recovery and help you regain as much function and independence as possible, based on your individual condition and recovery goals."
  ),
];

const whenToConsult = [
  block(
    "If you are recovering from surgery or an injury, or experiencing ongoing joint or back pain that affects your movement and daily activities, a rehabilitation assessment can help identify a structured plan to support your recovery."
  ),
];

const diagnosis = [
  block(
    "Rehabilitation begins with an assessment of your strength, movement, balance and functional ability, along with a review of your medical and treatment history. This assessment helps identify the specific goals and structure of your personalised rehabilitation programme."
  ),
];

const candidacy = [
  block(
    "Rehabilitation may benefit patients recovering from orthopedic surgery, injury, or those managing chronic joint or back conditions that affect movement and strength. Suitability and programme design depend on your specific condition, treatment history, current functional level and recovery goals. Your rehabilitation plan is developed following an assessment by your treating team."
  ),
];

const technologyUsed = [
  block(
    "Rehabilitation programmes may incorporate a range of therapeutic exercises, manual therapy techniques, and supportive equipment such as resistance bands, balance aids or gym-based equipment, depending on your specific needs and recovery stage. Your physiotherapist will select the techniques most appropriate for your individual programme."
  ),
];

const preparation = [
  block("A few general points can help you get the most out of your rehabilitation sessions:"),
  bullet("Wear comfortable clothing suited to movement and exercise"),
  bullet("Bring any previous medical reports, imaging or surgical notes"),
  bullet("Inform your physiotherapist about your current pain levels and limitations"),
  bullet("Follow the home exercise plan provided between sessions"),
  bullet("Communicate openly about your progress and any discomfort"),
  bullet("Attend sessions consistently to support steady progress"),
];

const urgentCare = [
  block(
    "Contact your physiotherapist or surgeon promptly if you experience a sudden increase in pain, new swelling, or symptoms that differ from your expected recovery pattern during your rehabilitation programme."
  ),
];

const whyThisDoctor = [
  block(
    "Rehabilitation guidance at this practice is provided as part of a broader orthopedic treatment approach led by Dr. Manu Gautam, alongside joint replacement, sports injuries, spine care and trauma care. Programmes are built around a detailed assessment, clear goal-setting, and coordination between your surgeon and physiotherapy team where relevant."
  ),
];

const heroTrustPoints = ["Detailed functional assessment", "Personalised rehabilitation programme", "Structured, goal-based recovery guidance"];

const treatmentTypes = [
  {
    _key: key(),
    _type: "treatmentType",
    title: "Post-Surgical Rehabilitation",
    description:
      "Post-surgical rehabilitation supports recovery following procedures such as joint replacement, fracture fixation or arthroscopic surgery. A structured programme helps restore strength, movement and function in a gradual, guided manner following your surgeon's treatment plan.",
    ctaLabel: "Learn About Joint Replacement",
    manualHref: "/orthopaedic-surgeon/delhi-ncr/joint-replacement/",
  },
  {
    _key: key(),
    _type: "treatmentType",
    title: "Sports Injury Rehabilitation",
    description:
      "Sports injury rehabilitation focuses on restoring strength, stability and movement following ligament, tendon or muscle injuries. Programmes are typically structured to support a safe, progressive return to physical activity or sport based on your individual recovery.",
    ctaLabel: "Learn About Sports Injuries",
    manualHref: "/orthopaedic-surgeon/delhi-ncr/sports-injuries/",
  },
  {
    _key: key(),
    _type: "treatmentType",
    title: "Chronic Pain and Mobility Rehabilitation",
    description:
      "For patients with ongoing joint or back pain, or reduced mobility due to long-term conditions, rehabilitation can help improve strength, movement and function through a structured, guided exercise programme tailored to your specific needs.",
  },
];

const conditionsGrid = [
  { _key: key(), _type: "conditionEntry", title: "Post-Surgical Recovery", description: "Rehabilitation following orthopedic surgery, such as joint replacement or fracture fixation, to support safe and structured recovery." },
  { _key: key(), _type: "conditionEntry", title: "Post-Fracture Recovery", description: "Rehabilitation after a fracture has healed, to help restore strength, movement and function in the affected area." },
  { _key: key(), _type: "conditionEntry", title: "Sports Injury Recovery", description: "Structured rehabilitation following ligament, tendon or muscle injuries to support a safe return to physical activity." },
  { _key: key(), _type: "conditionEntry", title: "Chronic Joint or Back Pain", description: "Ongoing pain affecting the joints or spine that may benefit from a structured strengthening and movement programme." },
  { _key: key(), _type: "conditionEntry", title: "Age-Related Mobility Decline", description: "Gradual reduction in strength, balance or movement associated with ageing, which may be supported through guided rehabilitation." },
  { _key: key(), _type: "conditionEntry", title: "Post-Injury Muscle Weakness", description: "Reduced muscle strength following an injury or period of reduced activity, which can affect movement and function." },
  { _key: key(), _type: "conditionEntry", title: "Balance and Gait Difficulties", description: "Difficulty with balance or walking pattern that may benefit from targeted rehabilitation exercises." },
  { _key: key(), _type: "conditionEntry", title: "Pre-Surgical Conditioning", description: "Structured exercise and preparation before a planned surgery, aimed at supporting your overall readiness for the procedure." },
  { _key: key(), _type: "conditionEntry", title: "Postural Issues", description: "Movement or postural patterns that may contribute to discomfort or strain, which can be addressed through guided exercise and correction." },
];

const symptoms = [
  "Reduced strength after injury or surgery",
  "Difficulty walking or maintaining balance",
  "Limited range of motion",
  "Ongoing stiffness after treatment",
  "Muscle weakness",
  "Reduced confidence in movement",
  "Difficulty returning to daily activities",
  "Pain that limits participation in exercise",
  "Poor posture or movement patterns",
  "Slow progress after surgery or injury",
  "Hesitance to move following an injury",
  "Difficulty with routine physical tasks",
];

const candidacyChecklist = [
  "You have recently undergone orthopedic surgery",
  "You are recovering from a fracture or sports injury",
  "You experience ongoing joint or back pain affecting movement",
  "You have noticed reduced strength, balance or mobility",
  "Your surgeon or physiotherapist has recommended a structured programme",
];

const benefits = [
  "Improved strength and flexibility",
  "Better balance and movement control",
  "Support for a safe return to daily activities",
  "Structured, goal-based recovery progress",
  "Reduced stiffness after surgery or injury",
  "Improved overall functional independence",
];

const recoveryStages = [
  { _key: key(), _type: "recoveryStage", stage: "Stage 1", title: "Initial Assessment", description: "Your strength, movement, balance and functional ability are assessed to build a personalised programme." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 2", title: "Early Rehabilitation", description: "Gentle, guided exercises begin to support pain management and initial movement." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 3", title: "Progressive Strengthening", description: "Exercises progress to build strength, flexibility and stability around the affected area." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 4", title: "Functional Training", description: "Training shifts toward specific daily, work or sporting activities relevant to your goals." },
  { _key: key(), _type: "recoveryStage", stage: "Stage 5", title: "Long-Term Maintenance", description: "Guidance continues on maintaining strength and movement to support your longer-term function." },
];

const faqs = [
  { id: "faq-rh-01", q: "What is orthopedic rehabilitation?", a: "Orthopedic rehabilitation is a structured physiotherapy programme designed to help restore strength, movement and function following surgery, injury, or conditions affecting the joints, muscles or spine. Programmes are tailored to your individual condition and recovery goals." },
  { id: "faq-rh-02", q: "Do I need rehabilitation after orthopedic surgery?", a: "Rehabilitation is often recommended following orthopedic surgery to support safe, structured recovery of strength and movement. Whether rehabilitation is needed, and the specific programme required, depends on your procedure and individual recovery, as advised by your surgeon and physiotherapist." },
  { id: "faq-rh-03", q: "How long does a rehabilitation programme last?", a: "The duration of a rehabilitation programme varies depending on your condition, treatment history and recovery goals. Some programmes may last a few weeks, while others continue for a longer period. Your physiotherapist will provide guidance specific to your situation." },
  { id: "faq-rh-04", q: "What happens during a rehabilitation assessment?", a: "A rehabilitation assessment typically involves evaluating your strength, movement, balance and functional ability, along with a review of your medical and treatment history. This helps identify a personalised rehabilitation plan suited to your needs." },
  { id: "faq-rh-05", q: "Is rehabilitation only for post-surgical patients?", a: "No, rehabilitation can also benefit patients recovering from sports injuries, managing chronic joint or back pain, or experiencing age-related mobility decline. Suitability depends on your individual condition and functional goals." },
  { id: "faq-rh-06", q: "How often will I need rehabilitation sessions?", a: "The frequency of rehabilitation sessions depends on your individual condition, recovery stage and programme goals. Your physiotherapist will recommend a schedule suited to your specific needs and adjust it as your recovery progresses." },
  { id: "faq-rh-07", q: "Can rehabilitation help with chronic joint pain?", a: "Rehabilitation may help manage chronic joint pain by improving strength, movement and function around the affected joint. Suitability and expected benefit depend on individual evaluation, and your physiotherapist can discuss whether this approach may be helpful for your condition." },
  { id: "faq-rh-08", q: "What should I wear for a rehabilitation session?", a: "Comfortable clothing that allows freedom of movement is generally recommended for rehabilitation sessions, along with suitable footwear if the session involves walking or standing exercises." },
  { id: "faq-rh-09", q: "Will rehabilitation be painful?", a: "Rehabilitation exercises are generally guided to work within a comfortable range for your condition, though some mild discomfort during exercise can be a normal part of the process. Your physiotherapist will adjust your programme based on your feedback and progress." },
  { id: "faq-rh-10", q: "Can rehabilitation help prevent future injuries?", a: "A structured rehabilitation programme that improves strength, balance and movement patterns may help reduce the risk of certain future injuries, though this depends on individual factors and cannot be guaranteed. Your physiotherapist can discuss relevant strategies as part of your programme." },
  { id: "faq-rh-11", q: "Do I need a doctor's referral for rehabilitation?", a: "A referral is not always required, though rehabilitation is often recommended as part of a broader orthopedic treatment plan. If you are recovering from surgery or an injury, discussing rehabilitation with your surgeon or physiotherapist can help determine the most appropriate approach." },
  { id: "faq-rh-12", q: "What is the difference between rehabilitation and physiotherapy?", a: "Physiotherapy is a form of treatment that uses exercises and manual techniques to improve movement and function, and it is a core component of rehabilitation. Rehabilitation refers more broadly to the overall structured recovery process, which may include physiotherapy along with other supportive measures." },
  { id: "faq-rh-13", q: "How is my progress tracked during rehabilitation?", a: "Your physiotherapist will regularly reassess your strength, movement and functional ability throughout your rehabilitation programme, adjusting your plan based on your progress toward your individual recovery goals." },
  { id: "faq-rh-14", q: "How can I book a rehabilitation consultation with Dr. Manu Gautam's team?", a: "You can book a consultation by calling +91 9769761602 or using the appointment booking option on this website. Our team will help schedule an assessment to discuss your condition and rehabilitation needs." },
];

const serviceDoc = {
  _id: "service-rehabilitation",
  _type: "service",
  title: "Rehabilitation",
  slug: { current: "rehabilitation" },
  icon: "HandHeart",
  shortDescription: "Personalized physiotherapy programs to recover your movement.",
  introduction:
    "Dr. Manu Gautam's team provides structured rehabilitation and physiotherapy guidance to support recovery after orthopedic surgery, injury, or ongoing joint and back conditions. Programmes are personalised based on a detailed functional assessment and your individual recovery goals, working alongside your broader orthopedic treatment plan.",
  heroTrustPoints,
  body,
  treatmentTypes,
  conditionsTreated: conditionsGrid.map((c) => c.title),
  conditionsGrid,
  symptoms,
  whenToConsult,
  diagnosis,
  candidacy,
  candidacyChecklist,
  technologyUsed,
  benefits,
  preparation,
  recovery: [],
  recoveryStages,
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
    { _key: key(), _type: "reference", _ref: "service-trauma-care" },
  ],
  relatedConditions: [],
  faqs: faqs.map((f) => ({ _key: key(), _type: "reference", _ref: f.id })),
  medicalReviewer: { _type: "reference", _ref: "doctor-manu-gautam" },
  reviewDate: "2026-07-21",
  featured: false,
  order: 6,
  seo: {
    metaTitle: "Orthopedic Rehabilitation in Noida | Dr. Manu Gautam",
    metaDescription:
      "Personalised physiotherapy and rehabilitation programmes with Dr. Manu Gautam's team in Noida, supporting recovery of movement, strength and function.",
  },
};

async function seed() {
  await client.delete("drafts.service-rehabilitation").catch(() => {});
  const tx = client.transaction();
  for (const f of faqs) {
    tx.createOrReplace({ _id: f.id, _type: "faq", question: f.q, answer: f.a, category: "treatments" });
  }
  tx.createOrReplace(serviceDoc);
  await tx.commit();
  console.log(`Seeded rehabilitation service document and ${faqs.length} FAQs.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
