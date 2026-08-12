import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Home } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: `The requested page could not be found on ${siteConfig.shortName}.`,
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function NotFound() {
  return (
    <Section background="light" className="min-h-[60vh]">
      <Container className="flex flex-col items-center text-center">
        <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-warning/10 text-warning">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">404</p>
        <h1 className="mb-4 max-w-2xl">Page Not Found</h1>
        <p className="mb-8 max-w-xl text-lg leading-relaxed text-dark-gray">
          This page may have moved, or the address may be incorrect. You can return home or book an appointment with
          the clinic team.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/" variant="secondary" iconLeft={<Home className="h-4 w-4" aria-hidden="true" />}>
            Go Home
          </Button>
          <Button href="/appointment/" iconRight={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
            Book an Appointment
          </Button>
        </div>
        <Link href="/contact/" className="mt-6 text-sm font-semibold text-medical-blue hover:underline">
          Contact the clinic
        </Link>
      </Container>
    </Section>
  );
}
