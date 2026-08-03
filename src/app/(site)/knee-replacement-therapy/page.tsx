import type { Metadata } from "next";
import { KneeReplacementLanding } from "@/components/sections/KneeReplacementLanding";
import { buildPageMetadata, buildWebPageSchema, buildPhysicianSchema, buildLocalBusinessSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";
import { getDoctorBySlug, getFaqs, getLocations } from "@/sanity/lib/fetch";

export const metadata: Metadata = buildPageMetadata({
  title: "Knee Replacement Surgery & Knee Pain Treatment | Dr. Manu Gautam",
  description: "Consult Dr. Manu Gautam for advanced knee replacement surgery, robotic knee replacement, knee pain treatment, and joint replacement care in Noida & Delhi NCR.",
  path: "/knee-replacement-therapy/",
});

export default async function KneeReplacementTherapyPage() {
  const [doctor, locations, faqs] = await Promise.all([getDoctorBySlug("dr-manu-gautam"), getLocations(), getFaqs()]);
  const schemas = [
    buildWebPageSchema({
      name: "Knee Replacement Surgery Landing Page",
      description: "Conversion-focused landing page for knee replacement surgery and knee pain treatment.",
      url: "/knee-replacement-therapy/",
    }),
    buildPhysicianSchema(doctor?.name ?? siteConfig.shortName, undefined, {
      credentials: doctor?.credentials,
      education: doctor?.education,
      memberships: doctor?.memberships,
      url: "/knee-replacement-therapy/",
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
