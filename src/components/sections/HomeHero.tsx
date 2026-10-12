import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BookAppointmentButton } from "@/components/forms/BookAppointmentButton";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { getSiteSettings, getHomePage } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import { siteConfig } from "@/lib/constants";
import { telHref } from "@/lib/utils";

const trustPoints = ["Experienced Surgeons", "Advanced Technology", "Minimally Invasive", "Patient-Centered Care"];

const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=1600&q=70&auto=format&fit=crop";

export async function HomeHero() {
  const [settings, homePage] = await Promise.all([getSiteSettings(), getHomePage()]);
  const posterUrl = settings?.heroPosterImage
    ? urlForImage(settings.heroPosterImage).width(1600).height(1000).fit("crop").url()
    : FALLBACK_POSTER;

  const headingLine1 = homePage?.heroHeadingLine1 || "Where Expertise Restores";
  const headingLine2 = homePage?.heroHeadingLine2 || "Movement & Confidence.";
  const subtext =
    homePage?.heroSubtext ||
    "Specialized care for joint pain, sports injuries, fractures and spine conditions, focused on helping you move better and live without limitations.";

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-dark-navy">
      {settings?.heroVideoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={posterUrl}
        >
          <source src={settings.heroVideoUrl} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={posterUrl}
          alt="Orthopaedic clinic"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-navy/90 via-dark-navy/70 to-dark-navy/30" />

      <Container className="relative py-20 md:py-28">
        <Reveal mode="onMount" className="mx-auto max-w-2xl text-center sm:mx-0 sm:text-left">
          {/* The H1 carries the page's search intent (who + what + where); the
              slogan below keeps the original look as a styled paragraph. */}
          <h1 className="mb-4 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-sans text-xs font-medium leading-normal tracking-normal text-white sm:text-sm">
            {`${siteConfig.shortName} · Orthopaedic Surgeon in Noida`}
          </h1>
          <p className="mb-4 font-serif text-[34px] leading-[1.1] tracking-tight text-white md:text-[48px] lg:text-[56px]">
            <span className="block font-bold not-italic">{headingLine1}</span>
            <span className="mt-1 block font-medium italic">{headingLine2}</span>
          </p>
          <p className="mx-auto mb-6 max-w-xl text-lg text-white/85 leading-relaxed sm:mx-0">{subtext}</p>
          <div className="mb-4 flex flex-col items-center gap-3 sm:flex-row sm:items-center">
            <BookAppointmentButton size="large" className="w-full sm:w-auto">
              Book an Appointment
            </BookAppointmentButton>
            <Button
              href="/treatments"
              variant="secondary"
              size="large"
              className="hidden border-white/40 bg-transparent text-white hover:bg-white/10 sm:inline-flex"
            >
              Explore Treatments
            </Button>
          </div>
          <Link
            href="/treatments"
            className="mb-6 block text-sm font-medium text-white underline underline-offset-4 hover:text-white/80 sm:hidden"
          >
            Explore Treatments
          </Link>
          <a
            href={telHref(siteConfig.phone)}
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {siteConfig.phone}
          </a>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-start">
            {trustPoints.map((point) => (
              <li key={point} className="text-xs font-medium text-white/80">
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
