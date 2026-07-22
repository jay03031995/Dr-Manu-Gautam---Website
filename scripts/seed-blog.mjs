// Seeds blog categories and a small set of genuinely written patient-education
// articles (not filler/thin content). Same compliance rules as the treatment
// pages — no fabricated statistics, "may help" phrasing, no specific claims
// about the doctor's exact experience/education (see seed-joint-replacement.mjs
// for the underlying data-conflict note).
// Run with: node --env-file=.env.local scripts/seed-blog.mjs
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

const categories = [
  { _id: "blogCategory-joint-health", title: "Joint Health", slug: "joint-health", description: "Understanding arthritis, joint pain and joint replacement." },
  { _id: "blogCategory-sports-injuries", title: "Sports Injuries", slug: "sports-injuries", description: "Prevention, diagnosis and treatment of activity-related injuries." },
  { _id: "blogCategory-patient-recovery", title: "Patient Recovery", slug: "patient-recovery", description: "What to expect during recovery and rehabilitation." },
];

const posts = [
  {
    _id: "blogPost-signs-you-may-need-orthopedic-evaluation",
    title: "5 Signs You May Need an Orthopedic Evaluation for Knee Pain",
    slug: "signs-you-may-need-orthopedic-evaluation-knee-pain",
    excerpt:
      "Knee pain is common, but certain signs suggest it's time to see an orthopedic surgeon rather than waiting it out. Here's what to look for.",
    category: "blogCategory-joint-health",
    relatedTreatment: "service-joint-replacement",
    publishedAt: "2026-06-02T09:00:00.000Z",
    faqs: [
      {
        q: "Is knee pain always a sign of arthritis?",
        a: "No. Knee pain can result from many causes, including ligament or meniscus injuries, tendinitis, and mechanical issues, in addition to arthritis. A clinical evaluation helps identify the specific cause.",
      },
      {
        q: "Should I try physiotherapy before seeing a surgeon?",
        a: "Many causes of knee pain respond well to physiotherapy and non-surgical treatment. An orthopedic evaluation can help determine whether physiotherapy alone is appropriate or whether further investigation is needed first.",
      },
    ],
    body: [
      block(
        "Knee pain is one of the most common reasons people consult an orthopedic surgeon, and it affects people of every age, from athletes recovering from an injury to older adults managing arthritis. Occasional, mild knee discomfort after unusually strenuous activity is normal and often settles with rest. But certain patterns of knee pain are worth a proper clinical evaluation rather than being managed with rest and painkillers indefinitely."
      ),
      block(
        "Here are five signs that suggest it may be time to see an orthopedic surgeon about your knee."
      ),
      block("1. Pain That Persists Beyond a Few Weeks", "h2"),
      block(
        "Minor strains and overuse pain typically improve within one to two weeks with rest and reduced activity. If knee pain continues beyond this, or keeps returning whenever you resume normal activity, it's worth having the joint assessed rather than continuing to self-manage indefinitely."
      ),
      block("2. Swelling That Doesn't Settle", "h2"),
      block(
        "Some swelling after activity or a minor injury is common, but swelling that persists, recurs, or is accompanied by warmth and redness can indicate inflammation, effusion, or an underlying joint problem that benefits from examination and, if needed, imaging."
      ),
      block("3. A Catching, Locking or Giving-Way Sensation", "h2"),
      block(
        "A knee that feels like it catches, locks, or suddenly gives way during movement may point to a mechanical issue inside the joint, such as meniscus or cartilage damage. These sensations are not something to push through, particularly if they affect your balance or confidence while walking."
      ),
      block("4. Difficulty With Stairs or Getting Up From a Chair", "h2"),
      block(
        "Progressive difficulty with everyday movements — climbing stairs, kneeling, or standing up after sitting — can be an early sign of joint degeneration such as osteoarthritis. Because this often develops gradually, it's easy to adapt around it rather than seek evaluation, but early assessment gives you more treatment options."
      ),
      block("5. Limited Improvement With Rest, Ice or Over-the-Counter Medicine", "h2"),
      block(
        "If you've tried the standard first steps — rest, ice, over-the-counter anti-inflammatory medicine and activity modification — for a reasonable period without meaningful improvement, this is a clear signal to have the knee properly assessed rather than continuing to try the same measures."
      ),
      block("What to Expect at an Evaluation", "h2"),
      block(
        "A knee evaluation typically starts with a discussion of your symptoms and history, followed by a physical examination of movement, stability and areas of tenderness. Depending on the findings, your surgeon may recommend X-rays or further imaging. Most knee pain does not require surgery, and treatment often begins with non-surgical options such as physiotherapy, activity modification or medicines. Joint replacement or other surgical treatment is only considered when non-surgical approaches haven't provided sufficient relief."
      ),
      block(
        "If your knee pain matches any of the patterns above, a timely evaluation can help identify the cause and the most appropriate treatment path for you.",
        "blockquote"
      ),
    ],
  },
  {
    _id: "blogPost-understanding-osteoarthritis",
    title: "Understanding Osteoarthritis: Causes, Symptoms and Treatment Options",
    slug: "understanding-osteoarthritis-causes-symptoms-treatment",
    excerpt:
      "Osteoarthritis is the most common form of arthritis. Here's a plain-language guide to what causes it, how it presents, and how it's typically managed.",
    category: "blogCategory-joint-health",
    relatedTreatment: "service-joint-replacement",
    publishedAt: "2026-06-16T09:00:00.000Z",
    faqs: [
      {
        q: "Can osteoarthritis be cured?",
        a: "There is currently no cure that reverses the joint changes of osteoarthritis. Treatment instead focuses on managing pain, maintaining function and, for advanced cases affecting quality of life, considering surgical options such as joint replacement.",
      },
      {
        q: "Does osteoarthritis only affect older adults?",
        a: "Osteoarthritis becomes more common with age, but it can also develop earlier in life, particularly following a joint injury or in joints subjected to repeated stress.",
      },
    ],
    body: [
      block(
        "Osteoarthritis is the most common form of arthritis, and one of the leading reasons people consult an orthopedic surgeon about joint pain. Despite how common it is, there's a lot of confusion about what it actually is and what treatment involves. This article covers the basics in plain language."
      ),
      block("What Is Osteoarthritis?", "h2"),
      block(
        "Osteoarthritis develops when the cartilage that cushions the ends of bones within a joint gradually wears down over time. As this cushioning thins, bones can move less smoothly against each other, which leads to pain, stiffness and, in some cases, changes in the shape of the joint. It most commonly affects weight-bearing joints such as the knee and hip, as well as the hands and spine."
      ),
      block("What Causes It?", "h2"),
      block(
        "Osteoarthritis is generally the result of cumulative wear on a joint over time, and several factors can contribute to this, including age, previous joint injuries, repetitive joint stress, joint alignment, and family history. It's rarely caused by a single factor alone."
      ),
      block("Common Symptoms", "h2"),
      bullet("Joint pain that worsens with activity and improves with rest"),
      bullet("Stiffness, particularly after periods of inactivity or first thing in the morning"),
      bullet("Reduced range of movement in the affected joint"),
      bullet("A grating or crackling sensation during movement"),
      bullet("Swelling around the joint in some cases"),
      block("How Is It Diagnosed?", "h2"),
      block(
        "Diagnosis typically involves a physical examination of the joint's movement, stability and areas of tenderness, along with X-rays to assess the extent of cartilage loss and any changes to the bone. Your symptoms and how they affect your daily activities are just as important to this assessment as the imaging findings."
      ),
      block("Treatment Options", "h2"),
      block(
        "Most cases of osteoarthritis are initially managed without surgery. Common approaches include pain-relief medicines, physiotherapy and targeted strengthening exercises, weight management where relevant, activity modification, and in some cases joint injections. These measures aim to reduce pain and maintain function, and many people manage their symptoms this way for a long time."
      ),
      block(
        "When osteoarthritis is advanced and non-surgical treatment is no longer providing meaningful relief, joint replacement surgery may be discussed. This involves replacing the damaged joint surfaces with an implant designed to reduce pain and help restore smoother movement. As with any surgical decision, this is only recommended after a detailed evaluation of your specific joint and circumstances."
      ),
      block(
        "Osteoarthritis is a gradual, individual condition, and treatment is not one-size-fits-all. If joint pain is affecting your daily life, an orthopedic evaluation can help clarify what stage your joint is at and which treatment options are appropriate for you.",
        "blockquote"
      ),
    ],
  },
  {
    _id: "blogPost-recovering-after-joint-replacement",
    title: "Recovering After Joint Replacement Surgery: What to Expect at Each Stage",
    slug: "recovering-after-joint-replacement-surgery",
    excerpt:
      "Recovery after joint replacement happens in stages, from the hospital to long-term rehabilitation. Here's what that journey generally looks like.",
    category: "blogCategory-patient-recovery",
    relatedTreatment: "service-joint-replacement",
    publishedAt: "2026-07-01T09:00:00.000Z",
    faqs: [
      {
        q: "How soon after surgery will I start physiotherapy?",
        a: "Many patients begin gentle, supervised movement soon after surgery, guided by their surgical and physiotherapy team. The exact timing depends on the joint treated and your individual recovery.",
      },
      {
        q: "Is it normal for recovery to feel slow at first?",
        a: "Yes. Early recovery often feels gradual, with more noticeable progress typically emerging over the following weeks as strength and confidence build. Recovery differs from patient to patient.",
      },
    ],
    body: [
      block(
        "Joint replacement surgery can meaningfully change how a damaged joint functions, but the outcome depends heavily on what happens after the operation itself. Recovery is a process, not a single event, and understanding the general stages can help set realistic expectations — even though the exact pace differs from person to person."
      ),
      block("Before Surgery: Preparation", "h2"),
      block(
        "Recovery effectively begins before the operation. This stage involves your medical assessment, any required investigations, and guidance from your surgical team on how to prepare — including managing existing health conditions, understanding what to expect, and sometimes starting pre-surgical exercises to support strength going into the procedure."
      ),
      block("In the Hospital", "h2"),
      block(
        "Immediately after surgery, the focus is on pain management, monitoring and early, supervised movement. Many patients are encouraged to begin gentle mobilisation soon after the procedure, with support from the nursing and physiotherapy team, as early movement is generally an important part of recovery."
      ),
      block("The First Few Weeks at Home", "h2"),
      block(
        "Once home, recovery centres on wound care, continuing prescribed exercises, gradually increasing walking distance, and attending follow-up appointments so your surgeon can track healing. This stage often still involves some swelling, discomfort and fatigue, which is a normal part of the process rather than a sign that something is wrong."
      ),
      block("Progressive Rehabilitation", "h2"),
      block(
        "As healing progresses, physiotherapy typically shifts toward building strength, improving balance and expanding range of motion, with a gradual return toward everyday activities. This stage is where consistency with prescribed exercises tends to matter most for the overall outcome."
      ),
      block("Long-Term Recovery", "h2"),
      block(
        "Full recovery continues over the following months, with many patients gradually returning to suitable activities under the guidance of their surgeon and physiotherapist. Recovery timelines vary depending on the joint replaced, the surgical approach, your age, general health, and how consistently you engage with rehabilitation."
      ),
      block(
        "If you're preparing for joint replacement surgery, ask your surgical team what recovery is likely to look like for your specific procedure — general timelines are a helpful guide, but your own recovery plan should be personalised to you.",
        "blockquote"
      ),
    ],
  },
  {
    _id: "blogPost-acl-injuries-athletes",
    title: "ACL Injuries in Athletes: Prevention, Diagnosis and Treatment",
    slug: "acl-injuries-in-athletes-prevention-diagnosis-treatment",
    excerpt:
      "ACL tears are among the most common serious knee injuries in sport. Here's what causes them, how they're diagnosed, and what treatment typically involves.",
    category: "blogCategory-sports-injuries",
    relatedTreatment: "service-sports-injuries",
    publishedAt: "2026-07-14T09:00:00.000Z",
    faqs: [
      {
        q: "Can an ACL tear heal without surgery?",
        a: "The ACL itself has limited capacity to heal on its own. Some patients manage well with non-surgical treatment and activity modification, particularly if they are not returning to pivoting sports, while others benefit from surgical reconstruction. This depends on individual factors and activity goals.",
      },
      {
        q: "How long does it take to return to sport after ACL reconstruction?",
        a: "Return-to-sport timelines vary widely based on the individual, the surgical approach and rehabilitation progress. Your surgeon and physiotherapist will guide a structured, gradual return based on your specific recovery.",
      },
    ],
    body: [
      block(
        "The anterior cruciate ligament, or ACL, is one of the key ligaments that stabilises the knee joint, and it's among the most commonly injured structures in sports involving sudden direction changes, jumping or pivoting — such as football, basketball and skiing."
      ),
      block("How ACL Injuries Happen", "h2"),
      block(
        "ACL tears often occur without any contact from another player, typically during a sudden change of direction, an awkward landing, or a rapid deceleration. Direct contact injuries, such as a tackle, can also cause a tear. Many athletes describe hearing or feeling a pop in the knee at the moment of injury, followed by swelling and a sense of instability."
      ),
      block("Recognising the Signs", "h2"),
      bullet("A popping sensation at the time of injury"),
      bullet("Rapid swelling within hours of the injury"),
      bullet("A feeling that the knee is unstable or giving way"),
      bullet("Pain and reduced range of movement"),
      bullet("Difficulty continuing the activity you were doing"),
      block("Diagnosis", "h2"),
      block(
        "Diagnosis begins with a physical examination that assesses knee stability and specific ligament tests, along with a review of how the injury occurred. MRI is commonly used to confirm the extent of the injury and check for associated damage, such as meniscus or cartilage injuries, which often accompany ACL tears."
      ),
      block("Treatment Approaches", "h2"),
      block(
        "Not every ACL injury requires surgery. Treatment depends on factors including the severity of the tear, associated injuries, your activity level and goals, and knee stability. Non-surgical management, involving structured physiotherapy and bracing, may be appropriate for some patients, particularly those not returning to high-demand pivoting sports."
      ),
      block(
        "For athletes aiming to return to sports involving cutting and pivoting, or where the knee remains unstable, ACL reconstruction is often considered. This is typically performed using arthroscopic, minimally invasive techniques, reconstructing the ligament using a graft. As with all orthopedic surgery, this decision is made following a detailed evaluation of your specific injury and goals."
      ),
      block("Rehabilitation and Return to Sport", "h2"),
      block(
        "Rehabilitation is a central part of recovery, whether or not surgery is performed. A structured programme progressively rebuilds strength, balance and control around the knee, with a gradual, supervised return to sport-specific movement. Returning to competitive sport too early, before the knee has regained sufficient strength and control, increases the risk of re-injury — which is why return-to-sport decisions are typically guided closely by your surgeon and physiotherapist rather than a fixed calendar date."
      ),
      block(
        "If you've experienced a suspected ACL injury, a prompt orthopedic evaluation helps clarify the extent of the injury and the treatment path most suited to your goals.",
        "blockquote"
      ),
    ],
  },
];

async function seed() {
  const tx = client.transaction();

  for (const c of categories) {
    tx.createOrReplace({ _id: c._id, _type: "blogCategory", title: c.title, slug: { current: c.slug }, description: c.description });
  }

  const faqDocs = [];
  for (const p of posts) {
    const faqIds = (p.faqs ?? []).map((f, i) => {
      const id = `faq-${p._id.replace("blogPost-", "")}-${i + 1}`;
      faqDocs.push({ _id: id, _type: "faq", question: f.q, answer: f.a, category: "treatments" });
      return id;
    });

    tx.createOrReplace({
      _id: p._id,
      _type: "blogPost",
      title: p.title,
      slug: { current: p.slug },
      excerpt: p.excerpt,
      body: p.body,
      publishedAt: p.publishedAt,
      author: { _type: "reference", _ref: "doctor-manu-gautam" },
      medicalReviewer: { _type: "reference", _ref: "doctor-manu-gautam" },
      categories: [{ _key: key(), _type: "reference", _ref: p.category }],
      relatedTreatments: p.relatedTreatment ? [{ _key: key(), _type: "reference", _ref: p.relatedTreatment }] : [],
      faqs: faqIds.map((id) => ({ _key: key(), _type: "reference", _ref: id })),
      featured: p._id === "blogPost-understanding-osteoarthritis",
    });
  }

  for (const f of faqDocs) tx.createOrReplace(f);

  await tx.commit();
  console.log(`Seeded ${categories.length} blog categories, ${posts.length} articles, and ${faqDocs.length} article FAQs.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
