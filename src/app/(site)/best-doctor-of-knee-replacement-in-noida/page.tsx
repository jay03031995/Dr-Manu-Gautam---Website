import type { Metadata } from "next";
import { KneeReplacementLanding } from "@/components/sections/KneeReplacementLanding";
import { buildPageMetadata, buildWebPageSchema, buildPhysicianSchema, buildLocalBusinessSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";
import { getDoctorBySlug, getFaqs, getLocations } from "@/sanity/lib/fetch";

export const metadata: Metadata = buildPageMetadata({
  title: "Best Doctor for Knee Replacement in Noida | Dr. Manu Gautam",
  description: "Consult Dr. Manu Gautam for advanced knee replacement surgery, robotic knee replacement, knee pain treatment, and joint replacement care in Noida & Delhi NCR.",
  path: "/best-doctor-of-knee-replacement-in-noida/",
});

export default async function BestDoctorOfKneeReplacementPage() {
  const [doctor, locations, faqs] = await Promise.all([getDoctorBySlug("dr-manu-gautam"), getLocations(), getFaqs()]);
  const schemas = [
    buildWebPageSchema({
      name: "Best Doctor for Knee Replacement in Noida",
      description: "Conversion-focused landing page for knee replacement surgery and knee pain treatment.",
      url: "/best-doctor-of-knee-replacement-in-noida/",
    }),
    buildPhysicianSchema(doctor?.name ?? siteConfig.shortName, undefined, {
      credentials: doctor?.credentials,
      education: doctor?.education,
      memberships: doctor?.memberships,
      url: "/best-doctor-of-knee-replacement-in-noida/",
    }),
    buildLocalBusinessSchema(),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      <KneeReplacementLanding doctor={doctor} locations={locations} faqs={faqs} />
    </>
  );
}
