import type { Metadata } from "next";
import Image from "next/image";
import { Award, GraduationCap, Stethoscope } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDoctorBySlug } from "@/sanity/lib/fetch";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";
import { buildPageMetadata, buildPhysicianSchema } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "About Dr. Manu Gautam",
  description:
    "Meet Dr. Manu Gautam — orthopedic surgeon serving Noida & Ghaziabad, specializing in joint replacement, spine care, and sports injury management.",
  path: "/about",
});

export default async function AboutPage() {
  const doctor = await getDoctorBySlug("dr-manu-gautam");

  return (
    <>
      {doctor && <JsonLd data={buildPhysicianSchema(doctor.name)} />}

      <Section background="light" className="pt-10 md:pt-16">
        <Reveal mode="onMount" className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
              About Us
            </p>
            <h1 className="mb-3">{doctor?.name ?? "Dr. Manu Gautam"}</h1>
            {doctor?.credentials && <p className="mb-4 text-lg text-dark-gray">{doctor.credentials}</p>}

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
              <Button href="/appointment" size="large">
                Book a Consultation
              </Button>
              <Button href="/doctor" variant="secondary" size="large">
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

      <Section background="white">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
          <Reveal>
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
            {doctor?.yearsExperience && (
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-blue text-medical-blue">
                  <Award className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-heading text-lg font-bold text-dark-navy">{doctor.yearsExperience}+ Years</p>
                  <p className="text-sm text-dark-gray">of clinical experience</p>
                </div>
              </div>
            )}

            {doctor?.education && doctor.education.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-medical-blue" aria-hidden="true" />
                  <h3 className="text-lg">Education</h3>
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
                  <h3 className="text-lg">Memberships</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-charcoal">
                  {doctor.memberships.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {doctor?.locations && doctor.locations.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg">Practices At</h3>
                <ul className="space-y-1.5 text-sm text-charcoal">
                  {doctor.locations.map((loc) => (
                    <li key={loc.slug.current}>{loc.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        </div>
      </Section>
    </>
  );
}
