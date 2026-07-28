import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
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
import { ContactForm } from "@/components/forms/ContactForm";
import { GoogleReviewsSection } from "@/components/sections/GoogleReviewsSection";
import { GoogleReviewsSkeleton } from "@/components/sections/GoogleReviewsSkeleton";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceIcon } from "@/lib/serviceIcons";
import { getLocations, getLocationBySlug, getFeaturedServices, getFaqs } from "@/sanity/lib/fetch";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";
import { buildPageMetadata, buildBreadcrumbSchema, buildMedicalClinicSchema, buildFaqSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";
import { treatmentPath, locationPath } from "@/lib/utils";

export const revalidate = 60;

interface PageProps {
  params: { location: string };
}

export async function generateStaticParams() {
  const locations = await getLocations();
  return locations.map((loc) => ({ location: loc.slug.current }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const location = await getLocationBySlug(params.location);
  if (!location) return {};

  return buildPageMetadata({
    title: `Orthopaedic Surgeon in ${location.city}`,
    description: `Consult ${siteConfig.shortName} in ${location.city} for personalised diagnosis and treatment of joint, bone, sports injury and musculoskeletal conditions.`,
    path: locationPath(params.location),
  });
}

export default async function LocationPage({ params }: PageProps) {
  const [location, treatments, allFaqs] = await Promise.all([
    getLocationBySlug(params.location),
    getFeaturedServices(),
    getFaqs(),
  ]);
  if (!location) notFound();

  const faqs = allFaqs.filter((f) => f.category === "appointments" || f.category === "general");
  const nearbyAreas = siteConfig.serviceAreas.filter(
    (area) => area.toLowerCase() !== location.city.toLowerCase()
  );

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Locations", url: "/locations" },
    { name: location.city, url: locationPath(params.location) },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);
  const clinicSchema = buildMedicalClinicSchema({
    name: location.name,
    url: `${siteConfig.url}${locationPath(params.location)}`,
    telephone: location.phone && !/x/i.test(location.phone) ? location.phone : undefined,
    streetAddress: location.addressLine,
    addressLocality: location.city,
    postalCode: location.postalCode,
    openingHours: location.hours,
  });
  const faqSchema = faqs.length ? buildFaqSchema(faqs) : null;

  return (
    <>
      <JsonLd data={faqSchema ? [breadcrumbSchema, clinicSchema, faqSchema] : [breadcrumbSchema, clinicSchema]} />

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
            {location.city}
          </span>
          <h1 className="mb-4">Orthopaedic Surgeon in {location.city}</h1>
          <p className="mb-6 text-lg text-dark-gray leading-relaxed">
            Consult {siteConfig.shortName} in {location.city} for personalised diagnosis and treatment of joint,
            bone, sports injury and musculoskeletal conditions. Every consultation begins with a detailed
            evaluation to understand your symptoms and the treatment options available to you.
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

      {/* Consultation location */}
      <Section background="light">
        <Reveal className="mb-10 text-center">
          <h2>Consultation Location in {location.city}</h2>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto max-w-lg">
          <LocationCard
            location={location}
            description={`${siteConfig.shortName} provides in-person orthopaedic consultations at this clinic in ${location.city}.`}
          />
        </Reveal>
        {nearbyAreas.length > 0 && (
          <Reveal delay={0.15} className="mx-auto mt-8 max-w-2xl text-center text-sm text-dark-gray">
            Also serving patients from {nearbyAreas.join(", ")}.
          </Reveal>
        )}
      </Section>

      {/* Treatments available */}
      <Section background="white">
        <Reveal className="mb-10 text-center">
          <h2>Treatments Available in {location.city}</h2>
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
                  ? urlForImage(t.heroImage).width(600).height(375).fit("crop").url()
                  : undefined
              }
            />
          ))}
        </RevealGrid>
      </Section>

      {/* Reviews */}
      <Suspense fallback={<GoogleReviewsSkeleton />}>
        <GoogleReviewsSection />
      </Suspense>

      {/* Appointment form */}
      <Section background="white">
        <Reveal className="mx-auto max-w-xl card-base card-shadow p-6 sm:p-8">
          <h2 className="mb-2 text-xl">Book a Consultation in {location.city}</h2>
          <p className="mb-6 text-sm text-dark-gray">
            Share your concern and the team will contact you to schedule a consultation.
          </p>
          <ContactForm />
        </Reveal>
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
