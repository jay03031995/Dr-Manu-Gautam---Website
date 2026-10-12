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
import { buildPageMetadata } from "@/lib/seo";
import { schemaGraph, buildWebPageNode, buildBreadcrumbNode, buildItemListNode, schemaIds } from "@/lib/schema";
import { treatmentPath } from "@/lib/utils";
import { siteConfig } from "@/lib/constants";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Treatments & Services",
  description:
    "Orthopaedic treatments in Noida: knee, hip & shoulder replacement, robotic knee surgery, GFC injection, sports injuries, spine, trauma care and rehab.",
  path: "/treatments",
});

export default async function TreatmentsPage() {
  const services = await getFeaturedServices();

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Treatments", url: "/treatments" },
  ];
  const schemas = schemaGraph([
    buildWebPageNode({
      type: "CollectionPage",
      path: "/treatments",
      name: "Orthopaedic Treatments & Services in Noida",
      description: metadata.description as string,
      about: schemaIds.physician,
      mainEntity: `${siteConfig.url}/treatments/#itemlist`,
    }),
    buildBreadcrumbNode("/treatments", breadcrumbItems),
    buildItemListNode(
      "/treatments",
      "Orthopaedic treatments",
      services.map((s) => ({ name: s.title, url: treatmentPath(s.slug.current) })),
    ),
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

      <Section background="light" className="pt-6 md:pt-10">
        <Reveal mode="onMount" className="mx-auto max-w-2xl text-center">
          <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
            Our Treatments
          </p>
          <h1 className="mb-4">Comprehensive Orthopedic Solutions</h1>
          <p className="text-dark-gray leading-relaxed">
            From joint replacement to sports injury recovery, our specialists
            offer evidence-based, minimally invasive care tailored to your
            needs.
          </p>
        </Reveal>
      </Section>

      <Section background="white">
        {services.length === 0 ? (
          <p className="text-center text-dark-gray">
            Treatments are being updated — check back shortly.
          </p>
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
                    ? urlForImage(service.heroImage)
                        .width(600)
                        .height(375)
                        .fit("crop")
                        .url()
                    : undefined
                }
              />
            ))}
          </RevealGrid>
        )}
      </Section>
      <Section background="light">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-3">Knee ligament and ACL care</h2>
          <p className="mb-5 text-dark-gray">
            Learn how ACL tears are assessed and when rehabilitation or surgical
            consultation may be appropriate.
          </p>
          <Link
            href="/acl-tear-treatment-noida/"
            className="font-semibold text-medical-blue hover:underline"
          >
            Explore ACL tear treatment in Noida →
          </Link>
        </div>
      </Section>
    </>
  );
}
