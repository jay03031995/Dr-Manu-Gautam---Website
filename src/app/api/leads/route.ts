import { NextResponse } from "next/server";
import { getWriteClient } from "@/sanity/lib/client";
import { siteConfig } from "@/lib/constants";

interface LeadPayload {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  message?: string;
  locationSlug?: string;
  serviceSlug?: string;
  consultationType?: "online" | "in-clinic";
  preferredDate?: string;
  source?: "contact" | "appointment" | "popup" | "landing-page";
  submissionAction?: "callback_request" | "whatsapp_redirect" | "thank_you_redirect" | "call_click";
  callTargetPhone?: string;
  ctaLocation?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  landingPage?: string;
  referrer?: string;
  // Honeypot — real users never fill this in; bots usually do.
  company?: string;
}

function isValidPhone(phone: string) {
  return /^[+\d][\d\s-]{6,}$/.test(phone.trim());
}

function cleanAttribution(value?: string, maxLength = 240) {
  return value?.trim().slice(0, maxLength) || undefined;
}

export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot tripped — pretend success so the bot doesn't learn anything, but
  // do not actually create a document or send an email.
  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim();
  const phone = body.phone?.trim();
  const isCallClick = body.source === "landing-page" && body.submissionAction === "call_click";

  if (!isCallClick && (!name || name.length < 2)) {
    return NextResponse.json({ ok: false, error: "Please enter your full name." }, { status: 400 });
  }
  if (!isCallClick && (!phone || !isValidPhone(phone))) {
    return NextResponse.json({ ok: false, error: "Please enter a valid mobile number." }, { status: 400 });
  }
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const writeClient = getWriteClient();

    const doc: { _type: "appointmentRequest"; [key: string]: unknown } = {
      _type: "appointmentRequest",
      name: isCallClick ? "Phone call click" : name,
      phone: isCallClick ? (body.callTargetPhone?.trim() || siteConfig.phone) : phone,
      submittedAt: new Date().toISOString(),
      status: "new",
      leadOrigin: body.source === "landing-page" ? "landing-page" : "main-website",
    };
    if (body.email) doc.email = body.email.trim();
    if (body.city) doc.city = body.city.trim();
    if (body.source) doc.source = body.source;
    if (body.submissionAction) doc.submissionAction = body.submissionAction;
    if (body.callTargetPhone) doc.callTargetPhone = body.callTargetPhone.trim();
    if (body.ctaLocation) doc.ctaLocation = body.ctaLocation.trim();
    for (const field of ["utmSource", "utmMedium", "utmCampaign", "utmTerm", "utmContent", "gclid"] as const) {
      const value = cleanAttribution(body[field]);
      if (value) doc[field] = value;
    }
    const landingPage = cleanAttribution(body.landingPage, 500);
    const referrer = cleanAttribution(body.referrer, 500);
    if (landingPage) doc.landingPage = landingPage;
    if (referrer) doc.referrer = referrer;

    const messageParts = [body.message?.trim()].filter(Boolean);
    if (body.consultationType) messageParts.push(`Consultation type: ${body.consultationType}`);
    if (body.preferredDate) messageParts.push(`Preferred date: ${body.preferredDate}`);
    if (body.city) messageParts.push(`City: ${body.city.trim()}`);
    if (body.source) messageParts.push(`Source: ${body.source}`);
    if (body.submissionAction) messageParts.push(`Submission action: ${body.submissionAction}`);
    if (body.callTargetPhone) messageParts.push(`Call target phone: ${body.callTargetPhone.trim()}`);
    if (body.ctaLocation) messageParts.push(`CTA location: ${body.ctaLocation.trim()}`);
    if (isCallClick) messageParts.push("Caller details were not captured because this lead came from a phone link click.");
    if (messageParts.length) doc.message = messageParts.join("\n");

    if (body.locationSlug) {
      const location = await writeClient.fetch<{ _id: string } | null>(
        `*[_type == "location" && slug.current == $slug][0]{_id}`,
        { slug: body.locationSlug }
      );
      if (location) doc.preferredLocation = { _type: "reference", _ref: location._id };
    }

    if (body.serviceSlug) {
      const service = await writeClient.fetch<{ _id: string } | null>(
        `*[_type == "service" && slug.current == $slug][0]{_id}`,
        { slug: body.serviceSlug }
      );
      if (service) doc.service = { _type: "reference", _ref: service._id };
    }

    const createdLead = await writeClient.create(doc);

    await sendNotificationEmailWithTimeout({
      name: doc.name as string,
      phone: doc.phone as string,
      email: body.email,
      message: doc.message as string | undefined,
    });

    return NextResponse.json({ ok: true, leadId: createdLead._id });
  } catch (err) {
    console.error("Lead submission failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong while submitting your request. Please call us instead." },
      { status: 500 }
    );
  }
}

async function sendNotificationEmailWithTimeout(lead: { name: string; phone: string; email?: string; message?: string }) {
  const timeout = new Promise<void>((resolve) => {
    setTimeout(() => {
      console.warn("Lead notification email timed out — continuing because the lead is saved in Sanity.");
      resolve();
    }, 3000);
  });

  await Promise.race([sendNotificationEmail(lead), timeout]);
}

async function sendNotificationEmail(lead: { name: string; phone: string; email?: string; message?: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_FORM_TO_EMAIL;
  if (!apiKey || !to) {
    console.warn("RESEND_API_KEY or CONTACT_FORM_TO_EMAIL not set — skipping email notification for new lead.");
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: `${siteConfig.shortName} Website <onboarding@resend.dev>`,
      to,
      replyTo: lead.email,
      subject: `New enquiry from ${lead.name}`,
      text: [
        `Name: ${lead.name}`,
        `Phone: ${lead.phone}`,
        lead.email ? `Email: ${lead.email}` : null,
        lead.message ? `\n${lead.message}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (err) {
    // Don't fail the whole request just because the email failed — the lead
    // is already saved in Sanity.
    console.error("Failed to send lead notification email:", err);
  }
}
