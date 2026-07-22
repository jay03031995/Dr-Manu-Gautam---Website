import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFeaturedServices, getLocations } from "@/sanity/lib/fetch";
import { buildPageMetadata, buildBreadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";
import { telHref } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Book an Appointment",
  description:
    "Request an appointment with Dr. Manu Gautam in three simple steps. Share your details and consultation needs, and our team will confirm a time that works for you.",
  path: "/appointment",
});

export default async function AppointmentPage() {
  const [services, locations] = await Promise.all([getFeaturedServices(), getLocations()]);

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Book an Appointment", url: "/appointment" },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <Container className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-dark-gray">
            {breadcrumbItems.map((item, i) => (
              <li key={item.url} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i === breadcrumbItems.length - 1 ? (
                  <span className="text-charcoal">{item.name}</span>
                ) : (
                  <Link href={item.url} className="hover:text-medical-blue">
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </Container>

      <Section background="white" className="pt-6 md:pt-8">
        <Reveal mode="onMount" className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4">Book an Appointment</h1>
          <p className="text-lg text-dark-gray leading-relaxed">
            Share a few details about yourself and your concern, and Dr. Manu Gautam&rsquo;s team will call you to
            confirm a consultation time.
          </p>
        </Reveal>
      </Section>

      <Container>
        <Reveal className="mb-4 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4 text-sm text-charcoal">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
          <p>
            This form is for scheduling consultations, not medical emergencies. For urgent orthopaedic emergencies,
            call{" "}
            <a href={telHref(siteConfig.emergencyPhone)} className="font-semibold text-dark-navy hover:underline">
              {siteConfig.emergencyPhone}
            </a>{" "}
            or visit your nearest emergency room immediately.
          </p>
        </Reveal>
      </Container>

      <Section background="light">
        <Reveal className="mx-auto max-w-3xl card-base card-shadow p-6 sm:p-10">
          <AppointmentForm services={services} locations={locations} />
        </Reveal>
      </Section>
    </>
  );
}
