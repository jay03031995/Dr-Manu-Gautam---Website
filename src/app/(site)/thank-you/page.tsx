import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck2, CheckCircle2, Home, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/constants";
import { THANK_YOU_PATH, telHref } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: "Thank You",
  description: "Thank you for contacting Dr. Manu Gautam's clinic. Our team will call you shortly.",
  path: THANK_YOU_PATH,
  noIndex: true,
});

export default function ThankYouPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Thank You", url: THANK_YOU_PATH },
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

      <Section background="light" className="min-h-[65vh]">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-medical-blue text-white shadow-elevation-2">
            <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
          </div>
          <p className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
            Request Received
          </p>
          <h1 className="text-balance">Thank you for contacting Dr. Manu Gautam</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-dark-gray">
            Your details have been submitted successfully. Our clinic team will call you shortly to understand your
            concern and help confirm the next available consultation.
          </p>

          <div className="mt-8 grid gap-4 rounded-2xl border border-light-grey bg-white p-5 text-left shadow-elevation-2 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-light-teal text-medical-blue">
                <CalendarCheck2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-dark-navy">What happens next?</h2>
                <p className="mt-1 text-sm text-dark-gray">Our team will review your request and call you back soon.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-light-teal text-medical-blue">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-dark-navy">Need urgent help?</h2>
                <p className="mt-1 text-sm text-dark-gray">Call the clinic directly at {siteConfig.phone}.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={telHref(siteConfig.phone)} size="large">
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call Clinic
            </Button>
            <Button href="/" variant="secondary" size="large">
              <Home className="h-5 w-5" aria-hidden="true" />
              Back to Home
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
