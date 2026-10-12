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
  getLocations,
  getFeaturedServices,
  getFaqs,
} from "@/sanity/lib/fetch";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";
import {
  buildPageMetadata,
  buildBreadcrumbSchema,
  buildWebPageSchema,
  buildFaqSchema,
  buildLocalBusinessSchema,
} from "@/lib/seo";
import { siteConfig } from "@/lib/constants";
import { treatmentPath, locationPath } from "@/lib/utils";

export const revalidate = 60;

const PATH = "/orthopaedic-surgeon/sector-104-noida/";

export const metadata: Metadata = buildPageMetadata({
  title: "Orthopedic Surgeon Near Sector 104, Noida",
  description:
    "Dr. Manu Gautam consults patients from Sector 104 and the Noida Expressway sectors at his Sector 20 clinic and Dharamshila Narayana Hospital, Delhi. Joint, knee, sports injury and bone care.",
  path: PATH,
  keywords: [
    "orthopedic surgeon Sector 104 Noida",
    "orthopedic doctor near Sector 104",
    "best orthopedic surgeon in Noida",
    "orthopedic near me",
    "orthopedist near me",
    "knee specialist Sector 104 Noida",
    "bone doctor Noida Expressway",
  ],
});

export default async function Sector104ServiceAreaPage() {
  const [locations, treatments, allFaqs] = await Promise.all([
    getLocations(),
    getFeaturedServices(),
    getFaqs(),
  ]);

  const faqs = allFaqs.filter(
    (f) => f.category === "appointments" || f.category === "general",
  );

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Locations", url: "/locations" },
    { name: "Sector 104, Noida", url: PATH },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);
  const webPageSchema = buildWebPageSchema({
    name: "Orthopedic Surgeon Near Sector 104, Noida",
    description: metadata.description as string,
    url: PATH,
  });
  const localBusinessSchema = buildLocalBusinessSchema();
  const faqSchema = faqs.length ? buildFaqSchema(faqs) : null;

  return (
    <>
      <JsonLd
        data={
          faqSchema
            ? [breadcrumbSchema, webPageSchema, localBusinessSchema, faqSchema]
            : [breadcrumbSchema, webPageSchema, localBusinessSchema]
        }
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
            Sector 104, Noida
          </span>
          <h1 className="mb-4">Orthopedic Surgeon Near Sector 104, Noida</h1>
          <p className="mb-6 text-lg text-dark-gray leading-relaxed">
            {siteConfig.shortName} regularly consults patients from Sector
            104 and the neighbouring Noida Expressway sectors for joint pain,
            sports injuries, fractures and spine conditions. The main clinic
            is at Sector 20, Noida, with a second consultation location at
            Dharamshila Narayana Hospital, East Delhi.
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

      {/* Nearest consultation locations */}
      <Section background="light">
        <Reveal className="mb-10 text-center">
          <h2>Nearest Consultation Locations to Sector 104</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-dark-gray">
            Both clinics are reachable from Sector 104, Sector 93-137, and the
            Noida Expressway residential belt. Choose whichever is more
            convenient for you.
          </p>
        </Reveal>
        <RevealGrid className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {locations.map((loc) => (
            <div key={loc._id}>
              <LocationCard
                location={loc}
                description={`${siteConfig.shortName} consults at this clinic in ${loc.city}, a convenient option for patients travelling from Sector 104.`}
              />
              <Link
                href={locationPath(loc.slug.current)}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-medical-blue hover:underline"
              >
                View {loc.city} location page
              </Link>
            </div>
          ))}
        </RevealGrid>
      </Section>

      {/* Treatments available */}
      <Section background="white">
        <Reveal className="mb-10 text-center">
          <h2>Treatments Available for Sector 104 Patients</h2>
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
