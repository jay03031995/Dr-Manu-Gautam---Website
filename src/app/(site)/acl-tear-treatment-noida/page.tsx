import type { Metadata } from "next";
import Link from "next/link";
import { Activity, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BookAppointmentButton } from "@/components/forms/BookAppointmentButton";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildBreadcrumbSchema,
  buildMedicalProcedureSchema,
  buildPageMetadata,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "ACL Tear Treatment in Noida | Orthopedic Surgeon",
  description:
    "Assessment and treatment for ACL tears and knee ligament injuries in Noida, including rehabilitation and ACL surgery guidance when clinically appropriate.",
  path: "/acl-tear-treatment-noida/",
  keywords: [
    "acl",
    "acl tear",
    "ACL treatment Noida",
    "ACL surgery Noida",
    "knee ligament injury",
  ],
});

const steps = [
  [
    "Clinical assessment",
    "A detailed history and knee examination help assess instability, swelling and movement.",
  ],
  [
    "Imaging review",
    "MRI or other imaging may be reviewed when needed to confirm the ACL tear and associated injury.",
  ],
  [
    "Personalised plan",
    "Treatment may include activity modification, physiotherapy, bracing or ACL reconstruction surgery.",
  ],
  [
    "Return-to-activity rehabilitation",
    "Progressive rehabilitation supports strength, balance and a safe return to sport or daily activity.",
  ],
];

export default function AclTearTreatmentPage() {
  const schemas = [
    buildBreadcrumbSchema([
      { name: "Home", url: "/" },
      {
        name: "ACL Tear Treatment in Noida",
        url: "/acl-tear-treatment-noida/",
      },
    ]),
    buildMedicalProcedureSchema({
      name: "ACL Tear Treatment",
      description:
        "Diagnosis, rehabilitation and surgical consultation for anterior cruciate ligament injuries in Noida.",
      url: "/acl-tear-treatment-noida/",
      bodyLocation: ["Knee", "Anterior cruciate ligament"],
      howPerformed:
        "Treatment is selected after clinical examination and imaging review, and may include rehabilitation or ACL reconstruction when indicated.",
      preparation: "Clinical consultation, examination and imaging review.",
      followup:
        "Progressive physiotherapy, strength assessment and return-to-activity guidance.",
    }),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <Container className="pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-dark-gray">
          <Link href="/" className="hover:text-medical-blue">
            Home
          </Link>{" "}
          / ACL Tear Treatment
        </nav>
      </Container>
      <Section background="light" className="pt-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-flex rounded-full bg-light-teal p-3 text-medical-blue">
            <Activity className="h-6 w-6" />
          </span>
          <h1 className="mb-4">ACL Tear Treatment in Noida</h1>
          <p className="mx-auto mb-7 max-w-2xl text-lg leading-relaxed text-dark-gray">
            An ACL tear can cause knee instability, swelling and difficulty
            returning to sport. Dr. Manu Gautam provides assessment-led ACL
            treatment in Noida, from structured rehabilitation to ACL surgery
            consultation when needed.
          </p>
          <BookAppointmentButton size="large">
            Book an ACL Consultation
          </BookAppointmentButton>
        </div>
      </Section>
      <Section background="white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3">How an ACL injury is evaluated and treated</h2>
            <p className="text-dark-gray">
              Not every ACL tear requires the same treatment. Age, activity
              goals, instability and associated meniscus or cartilage injury all
              matter.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {steps.map(([heading, copy]) => (
              <article
                key={heading}
                className="rounded-2xl border border-light-grey p-6"
              >
                <CheckCircle2 className="mb-3 h-5 w-5 text-medical-blue" />
                <h3 className="mb-2 text-lg font-semibold text-dark-navy">
                  {heading}
                </h3>
                <p className="text-sm leading-relaxed text-dark-gray">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>
      <Section background="light">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4">ACL tear symptoms that need assessment</h2>
          <p className="mb-4 text-dark-gray">
            Common signs include a popping sensation during injury, rapid
            swelling, the knee giving way, reduced movement and difficulty
            changing direction. Early orthopedic assessment can clarify the
            diagnosis and protect the knee from repeated instability.
          </p>
          <p className="text-dark-gray">
            For a suspected ACL injury or persistent knee instability, arrange
            an orthopedic consultation in Noida for examination and a
            personalised recovery plan.
          </p>
        </div>
      </Section>
    </>
  );
}
