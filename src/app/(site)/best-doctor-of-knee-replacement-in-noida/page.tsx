import type { Metadata } from "next";
import { KneeReplacementLanding } from "@/components/sections/KneeReplacementLanding";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo";
import {
  schemaGraph,
  buildWebPageNode,
  buildBreadcrumbNode,
  buildFaqNode,
  buildTreatmentNodes,
} from "@/lib/schema";
import { getDoctorBySlug, getFaqs, getLocations } from "@/sanity/lib/fetch";

const PATH = "/best-doctor-of-knee-replacement-in-noida/";

export const metadata: Metadata = buildPageMetadata({
  title: "Best Doctor for Knee Replacement in Noida",
  description:
    "Consult Dr. Manu Gautam for advanced knee replacement surgery, robotic knee replacement, knee pain treatment, and joint replacement care in Noida & Delhi NCR.",
  path: "/best-doctor-of-knee-replacement-in-noida/",
  keywords: [
    "knee replacement",
    "knee replacement surgery",
    "knee replacement surgery cost",
    "knee replacement operation",
    "total knee replacement surgery",
    "full knee replacement surgery",
    "total knee replacement",
    "tkr knee replacement",
    "knee surgery",
    "best knee replacement surgeon in Greater Noida",
    "best knee replacement surgeon in India",
    "top knee replacement surgeon in Delhi NCR",
    "best knee replacement surgeon in Noida",
    "best knee replacement surgeon in Meerut",
  ],
});

export default async function BestDoctorOfKneeReplacementPage() {
  const [doctor, locations, faqs] = await Promise.all([
    getDoctorBySlug("dr-manu-gautam"),
    getLocations(),
    getFaqs(),
  ]);
  const pageFaqs = faqs.slice(0, 8);
  const treatmentNodes = buildTreatmentNodes({
    slug: "knee-replacement",
    path: PATH,
    name: "Knee Replacement Surgery in Noida",
    description:
      "Knee replacement and robotic knee replacement consultation for patients with knee pain, stiffness, arthritis and mobility limitations in Noida and Delhi NCR.",
    model: {
      procedureType: "SurgicalProcedure",
      bodyLocation: ["Knee"],
      serviceType: "Knee replacement surgery",
    },
  });
  const schemas = schemaGraph([
    buildWebPageNode({
      type: "MedicalWebPage",
      path: PATH,
      name: "Best Doctor for Knee Replacement in Noida",
      description: metadata.description as string,
      about: treatmentNodes[0]["@id"] as string,
    }),
    buildBreadcrumbNode(PATH, [
      { name: "Home", url: "/" },
      { name: "Best Doctor for Knee Replacement in Noida", url: PATH },
    ]),
    ...treatmentNodes,
    buildFaqNode(PATH, pageFaqs),
  ]);

  return (
    <>
      <JsonLd data={schemas} />
      <KneeReplacementLanding
        doctor={doctor}
        locations={locations}
        faqs={faqs}
      />
    </>
  );
}
