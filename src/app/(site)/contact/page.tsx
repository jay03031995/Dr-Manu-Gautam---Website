import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGrid } from "@/components/motion/RevealGrid";
import { LocationCard } from "@/components/sections/LocationCard";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLocations, getFaqs } from "@/sanity/lib/fetch";
import { buildPageMetadata, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";
import { telHref } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us - Noida & Delhi NCR Clinics",
  description:
    "Contact Dr. Manu Gautam's clinics in Noida and Delhi NCR. Find addresses, consultation timings, phone numbers and book an appointment online.",
  path: "/contact",
});

export default async function ContactPage() {
  const [locations, allFaqs] = await Promise.all([getLocations(), getFaqs()]);
  const faqs = allFaqs.filter((f) => f.category === "appointments" || f.category === "insurance");

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Contact", url: "/contact" },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);
  const faqSchema = faqs.length ? buildFaqSchema(faqs) : null;

  return (
    <>
      <JsonLd data={faqSchema ? [breadcrumbSchema, faqSchema] : breadcrumbSchema} />

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
          <h1 className="mb-4">Contact {siteConfig.shortName}</h1>
          <p className="text-lg text-dark-gray leading-relaxed">
            Get in touch to schedule a consultation, ask a question about a treatment, or find directions to a
            clinic near you.
          </p>
        </Reveal>
      </Section>

      {/* Emergency disclaimer */}
      <Container>
        <Reveal className="mb-4 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4 text-sm text-charcoal">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
          <p>
            This form and contact page are for general enquiries and appointment requests, not medical emergencies.
            For urgent orthopaedic emergencies, call{" "}
            <a href={telHref(siteConfig.emergencyPhone)} className="font-semibold text-dark-navy hover:underline">
              {siteConfig.emergencyPhone}
            </a>{" "}
            or visit your nearest emergency room immediately.
          </p>
        </Reveal>
      </Container>

      {/* Locations */}
      <Section background="light">
        <Reveal className="mb-10 text-center">
          <h2>Our Locations</h2>
        </Reveal>
        <RevealGrid className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {locations.map((loc) => (
            <LocationCard key={loc._id} location={loc} />
          ))}
        </RevealGrid>
      </Section>

      {/* Contact form + quick contacts */}
      <Section background="white">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr]">
          <Reveal className="card-base card-shadow p-6 sm:p-8">
            <h2 className="mb-2 text-xl">Send a Message</h2>
            <p className="mb-6 text-sm text-dark-gray">
              Share your concern and the team will contact you to schedule a consultation.
            </p>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1} className="space-y-4">
            <a
              href={telHref(siteConfig.phone)}
              className="card-base card-shadow flex items-center gap-3 p-5 hover:border-medical-blue"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-light-teal text-medical-blue">
                <Phone className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-dark-navy">{siteConfig.phone}</p>
                <p className="text-xs text-dark-gray">Call for appointments</p>
              </div>
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="card-base card-shadow flex items-center gap-3 p-5 hover:border-medical-blue"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-light-teal text-medical-blue">
                <Mail className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="break-all text-sm font-semibold text-dark-navy">{siteConfig.email}</p>
                <p className="text-xs text-dark-gray">Email us anytime</p>
              </div>
            </a>
          </Reveal>
        </div>
      </Section>

      {/* FAQs */}
      {faqs.length > 0 && (
        <Section background="light">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-center">Frequently Asked Questions</h2>
            <Accordion items={faqs} />
          </Reveal>
        </Section>
      )}
    </>
  );
}
