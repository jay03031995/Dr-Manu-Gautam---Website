import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BookAppointmentButton } from "@/components/forms/BookAppointmentButton";
import { ServiceCard } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGrid } from "@/components/motion/RevealGrid";
import { LocationCard } from "@/components/sections/LocationCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceIcon } from "@/lib/serviceIcons";
import {
  getLocationBySlug,
  getFeaturedServices,
  getFaqs,
} from "@/sanity/lib/fetch";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildWebPageSchema,
  buildFaqSchema,
  buildMedicalClinicSchema,
} from "@/lib/seo";
import { siteConfig } from "@/lib/constants";
import { treatmentPath, locationPath } from "@/lib/utils";

export const revalidate = 60;

const PATH = "/orthopaedic-surgeon/sector-20-noida/";

export const metadata: Metadata = buildPageMetadata({
  title: "Orthopedic Surgeon in Sector 20, Noida",
  description:
    "Dr. Manu Gautam's orthopaedic clinic is located at D-8, D Block, Sector 20, Noida — serving Sector 18, 15, 16, 22, 27 and surrounding areas for joint, bone, knee and sports injury care.",
  path: PATH,
  keywords: [
    "orthopedic surgeon Sector 20 Noida",
    "orthopedic doctor Sector 20",
    "best orthopedic surgeon in Noida",
    "orthopedic near me",
    "orthopedist near me",
    "knee specialist Sector 20 Noida",
  ],
});

export default async function Sector20Page() {
  const [location, treatments, allFaqs] = await Promise.all([
    getLocationBySlug("noida"),
    getFeaturedServices(),
    getFaqs(),
  ]);

  const faqs = allFaqs.filter(
    (f) => f.category === "appointments" || f.category === "general",
  );

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Locations", url: "/locations" },
    { name: "Sector 20, Noida", url: PATH },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);
  const webPageSchema = buildWebPageSchema({
    name: "Orthopedic Surgeon in Sector 20, Noida",
    description: metadata.description as string,
    url: PATH,
  });
  const clinicSchema = location
    ? buildMedicalClinicSchema({
        name: location.name,
        url: `${siteConfig.url}${PATH}`,
        telephone:
          location.phone && !/x/i.test(location.phone)
            ? location.phone
            : undefined,
        streetAddress: location.addressLine,
        addressLocality: location.city,
        postalCode: location.postalCode,
        openingHours: location.hours,
      })
    : null;
  const faqSchema = faqs.length ? buildFaqSchema(faqs) : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema,
          webPageSchema,
          ...(clinicSchema ? [clinicSchema] : []),
          ...(faqSchema ? [faqSchema] : []),
        ]}
      />

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

      {/* Hero */}
      <Section background="white" className="pt-6 md:pt-8">
        <Reveal mode="onMount" className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center gap-1 rounded-full bg-light-teal px-3 py-1 text-xs font-medium text-medical-blue">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Sector 20, Noida
          </span>
          <h1 className="mb-4">Orthopedic Surgeon in Sector 20, Noida</h1>
          <p className="mb-6 text-lg text-dark-gray leading-relaxed">
            {siteConfig.shortName}&rsquo;s clinic is located at D-8, D Block,
            Sector 20, Noida — a few minutes from Sector 18, 15, 16, 22 and
            27, and easily reached from across central Noida for joint, bone,
            knee and sports injury care.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <BookAppointmentButton size="large">
              Book a Consultation
            </BookAppointmentButton>
            <Button href="/about" variant="secondary" size="large">
              About {siteConfig.shortName}
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* Clinic details */}
      {location && (
        <Section background="light">
          <Reveal className="mb-10 text-center">
            <h2>The Sector 20 Clinic</h2>
          </Reveal>
          <div className="mx-auto max-w-md">
            <LocationCard location={location} />
            <Link
              href={locationPath("noida")}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-medical-blue hover:underline"
            >
              View full Noida clinic details
            </Link>
          </div>
        </Section>
      )}

      {/* Treatments available */}
      <Section background="white">
        <Reveal className="mb-10 text-center">
          <h2>Treatments at the Sector 20 Clinic</h2>
        </Reveal>
        <RevealGrid className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-3">
          {treatments.map((t) => (
            <ServiceCard
              key={t._id}
              icon={<ServiceIcon name={t.icon} className="h-6 w-6" />}
              title={t.title}
              description={t.shortDescription}
              href={treatmentPath(t.slug.current)}
              imageUrl={
                hasImageAsset(t.heroImage)
                  ? urlForImage(t.heroImage)
                      .width(600)
                      .height(375)
                      .fit("crop")
                      .url()
                  : undefined
              }
            />
          ))}
        </RevealGrid>
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
