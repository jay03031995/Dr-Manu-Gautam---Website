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
import {
  getLocations,
  getLocationBySlug,
  getFeaturedServices,
  getFaqs,
  getDoctorBySlug,
} from "@/sanity/lib/fetch";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";
import { buildPageMetadata } from "@/lib/seo";
import {
  schemaGraph,
  buildWebPageNode,
  buildBreadcrumbNode,
  buildFaqNode,
  locationEntityId,
} from "@/lib/schema";
import { siteConfig } from "@/lib/constants";
import { treatmentPath, locationPath, DOCTOR_PROFILE_PATH } from "@/lib/utils";

export const revalidate = 60;

interface PageProps {
  params: { location: string };
}

export async function generateStaticParams() {
  const locations = await getLocations();
  return locations.map((loc) => ({ location: loc.slug.current }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const location = await getLocationBySlug(params.location);
  if (!location) return {};

  // "Delhi" is the exact phrase patients search ("best orthopedic surgeon in
  // Delhi") — used here for title/description only. Postal address, schema
  // and body copy keep the accurate "New Delhi".
  const searchCity = location.city === "New Delhi" ? "Delhi" : location.city;

  return buildPageMetadata({
    title: location.seo?.metaTitle || `Orthopaedic Surgeon in ${searchCity} | Dr. Manu Gautam`,
    description: location.seo?.metaDescription || `Consult Dr. Manu Gautam in ${searchCity} for orthopaedic evaluation, knee and joint care, and sports injuries.`,
    path: locationPath(params.location),
    keywords: [
      "best orthopedic surgeon in Delhi",
      "best orthopedic surgeon in Noida",
      "top orthopedic doctor in Noida",
      "best knee replacement surgeon in Delhi",
      "orthopedic near me",
      "orthopedist near me",
      "orthopedic surgeon near me",
      "orthopedic surgeon",
      "orthopedist",
      "bone doctors",
      "best orthopedic near me",
    ],
  });
}

export default async function LocationPage({ params }: PageProps) {
  const [location, treatments, allFaqs, doctor] = await Promise.all([
    getLocationBySlug(params.location),
    getFeaturedServices(),
    getFaqs(),
    getDoctorBySlug("dr-manu-gautam"),
  ]);
  if (!location) notFound();

  const faqs = allFaqs.filter(
    (f) => f.category === "appointments" || f.category === "general",
  );
  const nearbyAreas = siteConfig.serviceAreas.filter(
    (area) => area.toLowerCase() !== location.city.toLowerCase(),
  );
  // Same title/description mapping as generateMetadata: "Delhi" is the exact
  // phrase searched, "New Delhi" stays in the address/schema.
  const searchCity = location.city === "New Delhi" ? "Delhi" : location.city;

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Locations", url: "/locations" },
    { name: location.city, url: locationPath(params.location) },
  ];
  const path = locationPath(params.location);
  const entityId = locationEntityId(params.location);
  const schemas = schemaGraph([
    buildWebPageNode({
      path,
      name: location.seo?.metaTitle || `Orthopaedic consultation in ${searchCity} - ${location.name}`,
      description: location.seo?.metaDescription || `Consult ${siteConfig.shortName} in ${location.city} for joint, bone, sports injury and musculoskeletal care.`,
      about: entityId,
      mainEntity: entityId,
      contentLocation: location.city,
    }),
    buildBreadcrumbNode(path, breadcrumbItems),
    buildFaqNode(path, faqs),
  ]);

  return (
    <>
      <JsonLd data={schemas} />

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
          <h1 className="mb-4">Best Orthopedic Surgeon in {searchCity}</h1>
          <p className="mb-6 text-lg text-dark-gray leading-relaxed">
            Consult {siteConfig.shortName} in {location.city}
            {location.city === "Noida" ? ", Sector 20," : ""} for personalised
            diagnosis and treatment of joint, bone, sports injury and
            musculoskeletal conditions. Every consultation begins with a
            detailed evaluation to understand your symptoms and the treatment
            options available to you.
          </p>
          <p className="mx-auto mb-6 max-w-2xl text-sm text-dark-gray">
            If you are searching for an orthopedist near you, a bone doctor, or
            an orthopedic surgeon near {searchCity}, the clinic provides
            assessment-led care with clear guidance on non-surgical and surgical
            options.
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
          <Reveal
            delay={0.15}
            className="mx-auto mt-8 max-w-2xl text-center text-sm text-dark-gray"
          >
            Also serving patients from {nearbyAreas.join(", ")}.
          </Reveal>
        )}
      </Section>

      {/* Who the patient will see, and where treatment happens. Facts come
          from the CMS doctor record; the hospital role is as stated on the
          Narayana Health profile. */}
      {doctor && (
        <Section background="white">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-8 text-center">
              <h2>Your Orthopaedic Surgeon in {location.city}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mb-4 text-lg leading-relaxed text-dark-gray">
                Consultations here are with <strong className="text-dark-navy">{doctor.name}</strong>
                {doctor.credentials ? `, ${doctor.credentials}` : ""}, orthopaedic and joint replacement surgeon.
                He is a Senior Consultant in Orthopaedic Surgery at {siteConfig.hospital.name}, New Delhi.
              </p>
              {doctor.education && doctor.education.length > 0 && (
                <>
                  <h3 className="mb-2 mt-6 text-lg">Qualifications</h3>
                  <ul className="mb-4 list-disc space-y-1 pl-5 text-dark-gray">
                    {doctor.education.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                    {doctor.memberships?.map((item) => (
                      <li key={item}>Member, {item}</li>
                    ))}
                  </ul>
                </>
              )}
              <h3 className="mb-2 mt-6 text-lg">Consultation and surgery: where each happens</h3>
              {params.location === "delhi" ? (
                <p className="mb-4 leading-relaxed text-dark-gray">
                  At {siteConfig.hospital.name} you can be assessed in the outpatient department, and this is also
                  where surgery, including robotic-assisted knee replacement, is performed. Patients who prefer a
                  clinic closer to Noida can see him at D-8, Sector 20, Noida for consultations and follow-up.
                </p>
              ) : (
                <p className="mb-4 leading-relaxed text-dark-gray">
                  This Sector 20 clinic is for consultations, diagnosis, non-surgical treatment such as GFC
                  injections, and follow-up after surgery. When surgery is recommended, including robotic-assisted
                  knee replacement, it is performed at {siteConfig.hospital.name}, Vasundhara Enclave, New Delhi,
                  where he operates.
                </p>
              )}
              <Link href={DOCTOR_PROFILE_PATH} className="font-medium text-medical-blue hover:underline">
                Read Dr. Manu Gautam&apos;s full profile
              </Link>
            </Reveal>
          </div>
        </Section>
      )}

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

      {/* Reviews */}
      <Suspense fallback={<GoogleReviewsSkeleton />}>
        <GoogleReviewsSection />
      </Suspense>

      {/* Appointment form */}
      <Section background="white">
        <Reveal className="mx-auto max-w-xl card-base card-shadow p-6 sm:p-8">
          <h2 className="mb-2 text-xl">
            Book a Consultation in {location.city}
          </h2>
          <p className="mb-6 text-sm text-dark-gray">
            Share your concern and the team will contact you to schedule a
            consultation.
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
