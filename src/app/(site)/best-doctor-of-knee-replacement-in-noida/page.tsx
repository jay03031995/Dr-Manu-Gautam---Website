import type { Metadata } from "next";
import Script from "next/script";
import { KneeReplacementLanding } from "@/components/sections/KneeReplacementLanding";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildMedicalProcedureSchema,
  buildPageMetadata,
  buildPhysicianSchema,
  buildWebPageSchema,
} from "@/lib/seo";
import { siteConfig } from "@/lib/constants";
import { getDoctorBySlug, getFaqs, getLocations } from "@/sanity/lib/fetch";

export const metadata: Metadata = buildPageMetadata({
  title: "Best Doctor for Knee Replacement in Noida | Dr. Manu Gautam",
  description: "Consult Dr. Manu Gautam for advanced knee replacement surgery, robotic knee replacement, knee pain treatment, and joint replacement care in Noida & Delhi NCR.",
  path: "/best-doctor-of-knee-replacement-in-noida/",
});

export default async function BestDoctorOfKneeReplacementPage() {
  const [doctor, locations, faqs] = await Promise.all([getDoctorBySlug("dr-manu-gautam"), getLocations(), getFaqs()]);
  const pageFaqs = faqs.slice(0, 8);
  const schemas = [
    buildBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Best Doctor for Knee Replacement in Noida", url: "/best-doctor-of-knee-replacement-in-noida/" },
    ]),
    buildWebPageSchema({
      name: "Best Doctor for Knee Replacement in Noida",
      description: metadata.description as string,
      url: "/best-doctor-of-knee-replacement-in-noida/",
    }),
    buildMedicalProcedureSchema({
      name: "Knee Replacement Surgery in Noida",
      description:
        "Advanced knee replacement and robotic knee replacement consultation for patients with knee pain, stiffness, arthritis, and mobility limitations in Noida and Delhi NCR.",
      url: "/best-doctor-of-knee-replacement-in-noida/",
      bodyLocation: ["Knee", "Joint"],
      howPerformed:
        "Dr. Manu Gautam evaluates knee pain, imaging, mobility, and patient goals before recommending non-surgical care, robotic knee replacement, or joint replacement surgery when appropriate.",
      preparation: "Consultation, diagnosis, imaging review, surgical planning, and pre-operative assessment when surgery is advised.",
      followup: "Post-operative review, physiotherapy guidance, rehabilitation support, and mobility follow-up.",
    }),
    buildPhysicianSchema(doctor?.name ?? siteConfig.shortName, undefined, {
      credentials: doctor?.credentials,
      education: doctor?.education,
      memberships: doctor?.memberships,
      url: "/best-doctor-of-knee-replacement-in-noida/",
    }),
    buildLocalBusinessSchema(),
    ...(pageFaqs.length ? [buildFaqSchema(pageFaqs)] : []),
  ];

  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-16665276342" strategy="afterInteractive" />
      <Script id="google-ads-tag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-16665276342');
        `}
      </Script>
      <JsonLd data={schemas} />
      <KneeReplacementLanding doctor={doctor} locations={locations} faqs={faqs} />
    </>
  );
}
