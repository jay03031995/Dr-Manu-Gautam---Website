import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGrid } from "@/components/motion/RevealGrid";
import { LocationCard } from "@/components/sections/LocationCard";
import { getLocations } from "@/sanity/lib/fetch";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";
import { locationPath } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: `Consultation Locations | ${siteConfig.shortName}`,
  description: `Find ${siteConfig.shortName}'s orthopaedic consultation locations across Noida & Ghaziabad, with addresses, timings and directions.`,
  path: "/locations",
});

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <>
      <Container className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-dark-gray">
            <li>
              <Link href="/" className="hover:text-medical-blue">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-charcoal">Locations</li>
          </ol>
        </nav>
      </Container>

      <Section background="white" className="pt-6 md:pt-8">
        <Reveal mode="onMount" className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4">Consultation Locations</h1>
          <p className="text-lg text-dark-gray leading-relaxed">
            {siteConfig.shortName} consults at the following locations. Select a clinic for local timings,
            directions and a dedicated location page.
          </p>
        </Reveal>
      </Section>

      <Section background="light">
        <RevealGrid className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {locations.map((loc) => (
            <div key={loc._id}>
              <LocationCard location={loc} />
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
    </>
  );
}
