import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, GraduationCap, Stethoscope, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BookAppointmentButton } from "@/components/forms/BookAppointmentButton";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGrid } from "@/components/motion/RevealGrid";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { LocationCard } from "@/components/sections/LocationCard";
import { GoogleReviewsSection } from "@/components/sections/GoogleReviewsSection";
import { GoogleReviewsSkeleton } from "@/components/sections/GoogleReviewsSkeleton";
import { VideoCarousel } from "@/components/sections/VideoCarousel";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDoctorBySlug, getFeaturedServices, getVideos } from "@/sanity/lib/fetch";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";
import { buildPageMetadata, buildPhysicianSchema, buildBreadcrumbSchema } from "@/lib/seo";
import { treatmentPath, DOCTOR_PROFILE_PATH } from "@/lib/utils";
import { siteConfig } from "@/lib/constants";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Orthopaedic Surgeon in Noida & Delhi NCR - Doctor Profile",
  description:
    "Dr. Manu Gautam is an orthopaedic surgeon with 15+ years of experience in joint replacement, robotic knee surgery, spine care, and sports injury management across Noida and Delhi NCR.",
  path: DOCTOR_PROFILE_PATH,
});

export default async function DoctorProfilePage() {
  const [doctor, services, videos] = await Promise.all([
    getDoctorBySlug("dr-manu-gautam"),
    getFeaturedServices(),
    getVideos(),
  ]);

  const photoUrl = hasImageAsset(doctor?.photo) ? urlForImage(doctor.photo).width(1200).url() : undefined;

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Doctor Profile", url: DOCTOR_PROFILE_PATH },
  ];
  const schemas = [
    buildBreadcrumbSchema(breadcrumbItems),
    ...(doctor
      ? [
          buildPhysicianSchema(doctor.name, photoUrl, {
            credentials: doctor.credentials,
            url: `${siteConfig.url}${DOCTOR_PROFILE_PATH}`,
            education: doctor.education,
            memberships: doctor.memberships,
          }),
        ]
      : []),
  ];

  // Match the doctor's specialties to their real treatment pages by title —
  // only links to pages that actually exist, no fabricated sub-pages.
  const specialtyLinks = (doctor?.specialties ?? []).map((specialty) => {
    const match = services.find((s) => s.title === specialty);
    return { label: specialty, href: match ? treatmentPath(match.slug.current) : undefined };
  });

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
      <Section background="light" className="pt-6 md:pt-10">
        <Reveal mode="onMount" className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="lg:order-1">
            <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
              Doctor Profile
            </p>
            <h1 className="mb-2">{doctor?.name ?? "Dr. Manu Gautam"}</h1>
            {doctor?.credentials && <p className="mb-5 text-lg text-dark-gray">{doctor.credentials}</p>}

            <div className="mb-6 flex flex-wrap gap-3">
              {doctor?.yearsExperience && (
                <div className="flex items-center gap-2 rounded-lg border border-light-grey bg-white px-4 py-2.5">
                  <Award className="h-4 w-4 text-medical-blue" aria-hidden="true" />
                  <span className="text-sm font-medium text-dark-navy">{doctor.yearsExperience}+ Years Experience</span>
                </div>
              )}
              {doctor?.locations && doctor.locations.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-light-grey bg-white px-4 py-2.5">
                  <MapPin className="h-4 w-4 text-medical-blue" aria-hidden="true" />
                  <span className="text-sm font-medium text-dark-navy">
                    Practices in {doctor.locations.map((l) => l.city).join(" & ")}
                  </span>
                </div>
              )}
            </div>

            {specialtyLinks.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {specialtyLinks.map((s) =>
                  s.href ? (
                    <Link key={s.label} href={s.href}>
                      <Badge variant="service" className="bg-white shadow-sm hover:bg-medical-blue hover:text-white">
                        {s.label}
                      </Badge>
                    </Link>
                  ) : (
                    <Badge key={s.label} variant="service" className="bg-white shadow-sm">
                      {s.label}
                    </Badge>
                  )
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <BookAppointmentButton size="large">
                Book a Consultation
              </BookAppointmentButton>
              <Button href="/about" variant="secondary" size="large">
                Meet Dr. Manu
              </Button>
            </div>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-lg lg:order-2 lg:mx-0 lg:ml-auto">
            {doctor && hasImageAsset(doctor.photo) ? (
              <Image
                src={urlForImage(doctor.photo).width(640).height(800).fit("crop").url()}
                alt={doctor.name}
                fill
                sizes="(min-width: 1024px) 320px, 60vw"
                className="object-cover"
                priority
              />
            ) : (
              <Image
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=75&auto=format&fit=crop"
                alt="Orthopedic surgeon"
                fill
                sizes="(min-width: 1024px) 320px, 60vw"
                className="object-cover"
              />
            )}
          </div>
        </Reveal>
      </Section>

      {/* Biography + credentials */}
      <Section background="white">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
          <Reveal>
            <h2 className="mb-4">Professional Background</h2>
            {doctor?.bio?.length ? (
              <PortableTextRenderer value={doctor.bio} />
            ) : (
              <p className="text-dark-gray leading-relaxed">
                Full biography coming soon — check back shortly for more on {doctor?.name ?? "Dr. Manu Gautam"}
                &rsquo;s training, philosophy of care, and areas of focus.
              </p>
            )}
          </Reveal>

          <Reveal delay={0.1} className="space-y-8">
            {doctor?.education && doctor.education.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-medical-blue" aria-hidden="true" />
                  <h3 className="text-lg">Education &amp; Training</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-charcoal">
                  {doctor.education.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {doctor?.memberships && doctor.memberships.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-medical-blue" aria-hidden="true" />
                  <h3 className="text-lg">Professional Memberships</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-charcoal">
                  {doctor.memberships.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        </div>
      </Section>

      {/* Practices at */}
      {doctor?.locations && doctor.locations.length > 0 && (
        <Section background="light">
          <Reveal className="mb-10 text-center">
            <h2>Where Dr. {doctor.name.replace(/^Dr\.?\s*/i, "")} Practices</h2>
          </Reveal>
          <RevealGrid className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {doctor.locations.map((loc) => (
              <LocationCard key={loc.slug.current} location={loc} />
            ))}
          </RevealGrid>
        </Section>
      )}

      {/* Patient education videos */}
      {videos.length > 0 && (
        <Section background="white">
          <Reveal className="mb-10 text-center">
            <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
              Patient Education
            </p>
            <h2>Dr. Manu Gautam Explains</h2>
          </Reveal>
          <Reveal>
            <VideoCarousel videos={videos} />
          </Reveal>
        </Section>
      )}

      {/* Reviews */}
      <Suspense fallback={<GoogleReviewsSkeleton />}>
        <GoogleReviewsSection />
      </Suspense>

      {/* Final CTA */}
      <section className="bg-dark-navy py-8 md:py-section-y-sm lg:py-section-y">
        <Container>
          <Reveal className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-white">Ready to Discuss Your Orthopaedic Concern?</h2>
            <p className="max-w-xl text-white/80">
              Book a consultation with {doctor?.name ?? "Dr. Manu Gautam"} at our Noida or Delhi NCR clinic.
            </p>
            <BookAppointmentButton size="large">
              Book an Appointment
            </BookAppointmentButton>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
