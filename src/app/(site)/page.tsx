import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BookAppointmentButton } from "@/components/forms/BookAppointmentButton";
import { ServiceCard } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGrid } from "@/components/motion/RevealGrid";
import { HomeHero } from "@/components/sections/HomeHero";
import { ConnectSection } from "@/components/sections/ConnectSection";
import { GoogleReviewsSection } from "@/components/sections/GoogleReviewsSection";
import { FeaturedBlogSection } from "@/components/sections/FeaturedBlogSection";
import { GoogleReviewsSkeleton } from "@/components/sections/GoogleReviewsSkeleton";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata, buildLocalBusinessSchema, buildFaqSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";
import { ServiceIcon } from "@/lib/serviceIcons";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";
import { treatmentPath } from "@/lib/utils";
import { getFaqs, getFeaturedServices, getConcerns, getHomePage, getDoctorBySlug } from "@/sanity/lib/fetch";

export const metadata: Metadata = buildPageMetadata({
  title: "Expert Orthopedic Care in Noida & Ghaziabad",
  description: siteConfig.description,
  path: "/",
});

const FALLBACK_WHY_CHOOSE_FEATURES = [
  {
    icon: "Stethoscope",
    title: "Dedicated Orthopaedic Surgeon",
    description: "Specialized care focused on restoring mobility and improving lives with compassion and expertise.",
  },
  {
    icon: "HandHeart",
    title: "Latest Technique for Regenerative Medicine",
    description: "Advanced regenerative therapies for tissue repair and regeneration using the latest innovations.",
  },
  {
    icon: "Bone",
    title: "Special Interest in Robotic Knee Replacement",
    description: "Precision-focused robotic solutions for better outcomes and faster, smoother recoveries.",
  },
  {
    icon: "Wrench",
    title: "Fully Automated CUVIS Robot for Knee Replacement",
    description: "State-of-the-art CUVIS robot delivers unmatched precision and personalized surgical excellence.",
  },
];

const FALLBACK_PRACTICE_STATS = [
  { number: "15+", label: "Years of Experience", icon: "Award" },
  { number: "2,500+", label: "Successful Surgeries", icon: "ShieldCheck" },
  { number: "12,000+", label: "Satisfied Patients", icon: "Users" },
  { number: "100%", label: "Satisfaction", icon: "HeartPulse" },
];

const FALLBACK_WHY_CHOOSE_IMAGE =
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=75&auto=format&fit=crop";
const FALLBACK_FINAL_CTA_IMAGE =
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=70&auto=format&fit=crop";

export default async function Home() {
  const [faqs, featuredServices, concerns, homePage, doctor] = await Promise.all([
    getFaqs(),
    getFeaturedServices(),
    getConcerns(),
    getHomePage(),
    getDoctorBySlug("dr-manu-gautam"),
  ]);
  // getFaqs() returns every FAQ in the CMS, including the ~113 treatment-specific
  // ones meant for their own treatment pages — the homepage should only show a
  // short, general teaser, not every FAQ on the site.
  const homeFaqs = faqs.filter((f) => f.category !== "treatments").slice(0, 6);
  const schemas = homeFaqs.length
    ? [buildLocalBusinessSchema(), buildFaqSchema(homeFaqs)]
    : buildLocalBusinessSchema();

  const whyChooseHeading = homePage?.whyChooseHeading || `Why Choose ${siteConfig.shortName}`;
  const whyChooseDescription =
    homePage?.whyChooseDescription ||
    `Expertise. Innovation. Compassion. ${siteConfig.shortName} is committed to providing world-class orthopaedic care with advanced technology and a patient-first approach.`;
  const whyChooseImage = hasImageAsset(homePage?.whyChooseImage)
    ? { url: urlForImage(homePage.whyChooseImage).width(800).height(1000).fit("crop").url(), alt: whyChooseHeading }
    : hasImageAsset(doctor?.photo)
      ? { url: urlForImage(doctor.photo).width(800).height(1000).fit("crop").url(), alt: doctor.name }
      : { url: FALLBACK_WHY_CHOOSE_IMAGE, alt: "Surgical team performing an orthopedic procedure" };
  const whyChooseFeatures = homePage?.whyChooseFeatures?.length
    ? homePage.whyChooseFeatures
    : FALLBACK_WHY_CHOOSE_FEATURES;
  const practiceStats = homePage?.practiceStats?.length ? homePage.practiceStats : FALLBACK_PRACTICE_STATS;

  const finalCtaHeading = homePage?.finalCtaHeading || "Ready to Start Your Recovery Journey?";
  const finalCtaSubtext =
    homePage?.finalCtaSubtext || "Schedule a consultation with our orthopedic specialists in Noida & Ghaziabad today.";
  const finalCtaImageUrl = hasImageAsset(homePage?.finalCtaImage)
    ? urlForImage(homePage.finalCtaImage).width(1600).height(900).fit("crop").url()
    : FALLBACK_FINAL_CTA_IMAGE;

  return (
    <>
      <JsonLd data={schemas} />

      <HomeHero />

      {/* Search by Concern */}
      <Section background="light">
        <Reveal className="mb-10 text-center">
          <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
            Start Here
          </p>
          <h2 className="mb-3">What Are You Experiencing?</h2>
          <p className="mx-auto max-w-xl text-dark-gray leading-relaxed">
            You don&rsquo;t need the medical term for it — tell us what you&rsquo;re feeling and we&rsquo;ll point
            you to the right care.
          </p>
        </Reveal>
        <RevealGrid className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {concerns.map((concern) => (
            <ServiceCard
              key={concern._id}
              icon={<ServiceIcon name={concern.icon} className="h-6 w-6" />}
              title={concern.label}
              description={concern.description}
              href={concern.href}
              imageUrl={
                hasImageAsset(concern.image)
                  ? urlForImage(concern.image).width(600).height(750).fit("crop").url()
                  : undefined
              }
            />
          ))}
        </RevealGrid>
      </Section>

      {/* Why Choose Dr. Manu Gautam */}
      <Section background="white">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <span className="mb-4 block h-0.5 w-8 bg-dark-navy" aria-hidden="true" />
            <h2 className="mb-4">{whyChooseHeading}</h2>
            <p className="mb-8 max-w-md text-dark-gray leading-relaxed">{whyChooseDescription}</p>
            <Button href="/about" className="bg-dark-navy hover:bg-dark-navy/90">
              Know More About {siteConfig.shortName}
            </Button>
          </Reveal>
          <Reveal
            delay={0.1}
            className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-lg lg:mx-0 lg:ml-auto"
          >
            <Image
              src={whyChooseImage.url}
              alt={whyChooseImage.alt}
              fill
              sizes="(min-width: 1024px) 320px, 60vw"
              className="object-cover"
            />
          </Reveal>
        </div>

        <RevealGrid className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {whyChooseFeatures.map((item) => (
            <div key={item.title} className="card-base p-6">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-dark-navy text-white">
                <ServiceIcon name={item.icon} className="h-5 w-5" />
              </span>
              <h3 className="text-base font-semibold text-dark-navy">{item.title}</h3>
            </div>
          ))}
        </RevealGrid>

        <Reveal delay={0.15} className="mt-8 rounded-hero bg-dark-navy px-6 py-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {practiceStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 text-white">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <ServiceIcon name={stat.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-heading text-xl font-bold text-white">{stat.number}</p>
                  <p className="text-xs text-white/70">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Treatments */}
      <Section background="light">
        <Reveal className="mb-10 text-center">
          <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
            Our Treatments
          </p>
          <h2>Comprehensive Orthopedic Solutions</h2>
        </Reveal>
        <RevealGrid className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-3">
          {featuredServices.map((service) => (
            <ServiceCard
              key={service._id}
              icon={<ServiceIcon name={service.icon} className="h-6 w-6" />}
              title={service.title}
              description={service.shortDescription}
              href={treatmentPath(service.slug.current)}
              imageUrl={
                hasImageAsset(service.heroImage)
                  ? urlForImage(service.heroImage).width(600).height(375).fit("crop").url()
                  : undefined
              }
            />
          ))}
        </RevealGrid>
      </Section>

      <ConnectSection />

      {/* Google Reviews */}
      <Suspense fallback={<GoogleReviewsSkeleton />}>
        <GoogleReviewsSection />
      </Suspense>

      {/* Featured Blogs */}
      <FeaturedBlogSection />

      {/* FAQ */}
      {homeFaqs.length > 0 && (
        <Section background="white">
          <Reveal className="mb-10 text-center">
            <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
              Common Questions
            </p>
            <h2>Frequently Asked Questions</h2>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto max-w-3xl">
            <Accordion items={homeFaqs} />
          </Reveal>
        </Section>
      )}

      {/* Final CTA */}
      <section className="relative overflow-hidden py-8 md:py-section-y-sm lg:py-section-y">
        <Image src={finalCtaImageUrl} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-dark-navy/90" />
        <div className="relative mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-white">{finalCtaHeading}</h2>
            <p className="max-w-xl text-white/80">{finalCtaSubtext}</p>
            <BookAppointmentButton size="large">
              Book an Appointment
            </BookAppointmentButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
