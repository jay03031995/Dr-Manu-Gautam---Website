import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ServiceCard } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGrid } from "@/components/motion/RevealGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceIcon } from "@/lib/serviceIcons";
import { getFeaturedServices } from "@/sanity/lib/fetch";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";
import { buildPageMetadata, buildBreadcrumbSchema } from "@/lib/seo";
import { treatmentPath } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Treatments & Services",
  description:
    "Comprehensive orthopedic treatments including joint replacement, spine care, sports injury management, trauma care, rehabilitation, and pediatric orthopedics in Noida & Delhi NCR.",
  path: "/treatments",
});

export default async function TreatmentsPage() {
  const services = await getFeaturedServices();

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Treatments", url: "/treatments" },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

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

      <Section background="light" className="pt-6 md:pt-10">
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
