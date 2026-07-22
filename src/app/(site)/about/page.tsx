import type { Metadata } from "next";
import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BookAppointmentButton } from "@/components/forms/BookAppointmentButton";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGrid } from "@/components/motion/RevealGrid";
import { Badge } from "@/components/ui/Badge";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceIcon } from "@/lib/serviceIcons";
import { getDoctorBySlug, getHomePage, getFeaturedTestimonials } from "@/sanity/lib/fetch";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";
import { buildPageMetadata, buildPhysicianSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";
import { DOCTOR_PROFILE_PATH } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "About Us | Dr. Manu Gautam, Orthopaedic Surgeon",
  description:
    "How Dr. Manu Gautam and the team in Noida & Ghaziabad approach orthopaedic care — combining advanced technology with patient-first attention at every stage of treatment and recovery.",
  path: "/about",
});

const FALLBACK_VALUES = [
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

export default async function AboutPage() {
  const [doctor, homePage, testimonials] = await Promise.all([
    getDoctorBySlug("dr-manu-gautam"),
    getHomePage(),
    getFeaturedTestimonials(),
  ]);

  const values = homePage?.whyChooseFeatures?.length ? homePage.whyChooseFeatures : FALLBACK_VALUES;

  return (
    <>
      {doctor && <JsonLd data={buildPhysicianSchema(doctor.name)} />}

      {/* Hero */}
      <Section background="light" className="pt-10 md:pt-16">
        <Reveal mode="onMount" className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
              About Us
            </p>
            <h1 className="mb-3">Care Built Around You</h1>
            {doctor?.credentials && (
              <p className="mb-4 text-lg text-dark-gray">
                {doctor.name}, {doctor.credentials}
              </p>
            )}

            {doctor?.specialties && doctor.specialties.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {doctor.specialties.map((specialty) => (
                  <Badge key={specialty} variant="service" className="bg-white shadow-sm">
                    {specialty}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <BookAppointmentButton size="large">
                Book a Consultation
              </BookAppointmentButton>
              <Button href={DOCTOR_PROFILE_PATH} variant="secondary" size="large">
                View Full Doctor Profile
              </Button>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
            {hasImageAsset(doctor?.photo) ? (
              <Image
                src={urlForImage(doctor.photo).width(800).height(1000).fit("crop").url()}
                alt={doctor.name}
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            ) : (
              <Image
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=75&auto=format&fit=crop"
                alt="Surgical team preparing for an orthopedic procedure"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            )}
          </div>
        </Reveal>
      </Section>

      {/* Philosophy of care — narrative */}
      <Section background="white">
        <Reveal className="mx-auto max-w-3xl">
          <p className="mb-2 text-center font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
            Our Approach
          </p>
          <h2 className="mb-8 text-center">How We Think About Orthopaedic Care</h2>
          <div className="space-y-5 text-lg leading-relaxed text-charcoal">
            <p>
              Every patient who walks through our doors is dealing with pain, uncertainty, or a limitation that&rsquo;s
              holding them back from the life they want to live. Our approach starts there — not with a procedure,
              but with a conversation. {doctor?.name ?? "Dr. Manu Gautam"} and the team take the time to understand
              each patient&rsquo;s concerns, explain every treatment option in plain language, and build a plan
              tailored to their specific condition and goals.
            </p>
            <p>
              We believe world-class orthopaedic care means combining advanced technology — including
              robotic-assisted knee replacement with the CUVIS system — with the kind of attention patients
              remember: a clear answer to a follow-up question, guidance through every stage of recovery, and a
              team that treats every case with the same seriousness, whether it&rsquo;s a minor sprain or a complex
              joint replacement.
            </p>
            <p className="font-medium text-dark-navy">
              This is what excellence means to us — not just skilled hands in the operating room, but a full
              commitment to helping every patient move, live, and recover better.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* What guides our care */}
      <Section background="light">
        <Reveal className="mb-10 text-center">
          <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
            What Guides Us
          </p>
          <h2>The Standards Behind Every Consultation</h2>
        </Reveal>
        <RevealGrid className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {values.map((item) => (
            <div key={item.title} className="card-base p-6">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-dark-navy text-white">
                <ServiceIcon name={item.icon} className="h-5 w-5" />
              </span>
              <h3 className="mb-1.5 text-base font-semibold text-dark-navy">{item.title}</h3>
              <p className="text-sm text-dark-gray leading-relaxed">{item.description}</p>
            </div>
          ))}
        </RevealGrid>
      </Section>

      {/* Professional background (condensed) */}
      {doctor?.bio?.length ? (
        <Section background="white">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2 className="mb-6 text-center">Professional Background</h2>
              <PortableTextRenderer value={doctor.bio} />
              <div className="mt-6 text-center">
                <Button href={DOCTOR_PROFILE_PATH} variant="tertiary">
                  Read Full Doctor Profile &rarr;
                </Button>
              </div>
            </Reveal>
          </div>
        </Section>
      ) : null}

      {/* Patient stories */}
      {testimonials.length > 0 && (
        <Section background="light">
          <Reveal className="mb-10 text-center">
            <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
              In Patients&rsquo; Words
            </p>
            <h2>What Excellence Looks Like in Practice</h2>
          </Reveal>
          <RevealGrid className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <div key={t._id} className="card-base card-shadow flex flex-col p-6">
                <Quote className="mb-3 h-6 w-6 text-medical-blue/40" aria-hidden="true" />
                <p className="mb-4 flex-1 text-sm text-charcoal leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-dark-navy">{t.author}</span>
                  <span className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                    ))}
                  </span>
                </div>
              </div>
            ))}
          </RevealGrid>
        </Section>
      )}

      {/* CTA */}
      <section className="bg-dark-navy py-8 md:py-section-y-sm lg:py-section-y">
        <div className="mx-auto flex w-full max-w-container flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-white">Ready to Start Your Recovery?</h2>
          <p className="max-w-xl text-white/80">
            Schedule a consultation at our {siteConfig.serviceAreas.slice(0, 2).join(" or ")} clinic and experience
            the difference patient-first orthopaedic care makes.
          </p>
          <BookAppointmentButton size="large">
            Book an Appointment
          </BookAppointmentButton>
        </div>
      </section>
    </>
  );
}
