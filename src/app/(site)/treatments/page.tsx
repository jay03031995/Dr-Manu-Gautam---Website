import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ServiceCard } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGrid } from "@/components/motion/RevealGrid";
import { ServiceIcon } from "@/lib/serviceIcons";
import { getFeaturedServices } from "@/sanity/lib/fetch";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";
import { buildPageMetadata } from "@/lib/seo";
import { treatmentPath } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Treatments & Services",
  description:
    "Comprehensive orthopedic treatments including joint replacement, spine care, sports injury management, trauma care, rehabilitation, and pediatric orthopedics in Noida & Ghaziabad.",
  path: "/treatments",
});

export default async function TreatmentsPage() {
  const services = await getFeaturedServices();

  return (
    <>
      <Section background="light" className="pt-10 md:pt-16">
        <Reveal mode="onMount" className="mx-auto max-w-2xl text-center">
          <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
            Our Treatments
          </p>
          <h1 className="mb-4">Comprehensive Orthopedic Solutions</h1>
          <p className="text-dark-gray leading-relaxed">
            From joint replacement to sports injury recovery, our specialists offer evidence-based, minimally
            invasive care tailored to your needs.
          </p>
        </Reveal>
      </Section>

      <Section background="white">
        {services.length === 0 ? (
          <p className="text-center text-dark-gray">Treatments are being updated — check back shortly.</p>
        ) : (
          <RevealGrid className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
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
        )}
      </Section>
    </>
  );
}
