import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BookAppointmentButton } from "@/components/forms/BookAppointmentButton";
import { Badge } from "@/components/ui/Badge";
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

  const badge = homePage?.heroBadge || "Advanced Orthopedic Care · Noida";
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
        <Reveal mode="onMount" className="max-w-2xl">
          <Badge variant="service" className="mb-4 bg-white/10 text-white">
            {badge}
          </Badge>
          <h1 className="mb-4 font-serif text-white">
            <span className="block font-bold not-italic">{headingLine1}</span>
            <span className="mt-1 block font-medium italic">{headingLine2}</span>
          </h1>
          <p className="mb-6 max-w-xl text-lg text-white/85 leading-relaxed">{subtext}</p>
          <div className="mb-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
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
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
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
