"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BookAppointmentButton } from "@/components/forms/BookAppointmentButton";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SpecialtiesMegaMenu } from "@/components/layout/SpecialtiesMegaMenu";
import { ClinicsMegaMenu } from "@/components/layout/ClinicsMegaMenu";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { mainNavLinks, siteConfig } from "@/lib/constants";
import { cn, telHref } from "@/lib/utils";
import type { Service, Location } from "@/sanity/lib/types";

interface SiteHeaderProps {
  logoUrl?: string;
  treatments: Pick<Service, "_id" | "title" | "slug" | "icon" | "shortDescription" | "conditionsTreated">[];
  locations: Pick<Location, "_id" | "name" | "slug" | "city" | "addressLine" | "postalCode" | "phone" | "hours">[];
}

export function SiteHeader({ logoUrl, treatments, locations }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);
  });

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur transition-shadow duration-200",
        scrolled ? "border-gray-100 shadow-elevation-2" : "border-transparent"
      )}
    >
      <Container className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 md:h-[4.5rem]">
        {/* Left: logo */}
        <Link href="/" aria-label="Go to homepage" className="flex shrink-0 items-center font-heading text-lg font-bold text-dark-navy md:mr-4 md:text-xl">
          {logoUrl ? (
            <span className="relative block h-9 w-32 md:h-10 md:w-36">
              <Image
                src={logoUrl}
                alt={siteConfig.shortName}
                fill
                sizes="160px"
                className="object-contain object-left"
                priority
              />
            </span>
          ) : (
            siteConfig.shortName
          )}
        </Link>

        {/* Centre: primary navigation */}
        <nav aria-label="Primary" className="hidden justify-self-center md:block">
          <ul className="flex items-center gap-8">
            {mainNavLinks.map((link) => (
              <li key={link.href}>
                {link.href === "/treatments" ? (
                  <SpecialtiesMegaMenu treatments={treatments} />
                ) : link.href === "/locations" ? (
                  <ClinicsMegaMenu locations={locations} />
                ) : (
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "rounded-sm text-sm font-medium hover:text-medical-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue focus-visible:ring-offset-2",
                      isActive(link.href) ? "text-medical-blue" : "text-charcoal"
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: socials, phone, CTA */}
        <div className="hidden items-center gap-5 justify-self-end md:flex">
          <div className="hidden items-center gap-3 text-dark-gray lg:flex">
            <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-medical-blue">
              <FacebookIcon className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-medical-blue">
              <InstagramIcon className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-medical-blue">
              <YoutubeIcon className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <a
            href={telHref(siteConfig.phone)}
            className="flex items-center gap-1.5 text-sm font-medium text-dark-navy hover:text-medical-blue"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span className="whitespace-nowrap">{siteConfig.phone}</span>
          </a>
          <BookAppointmentButton size="regular" className="whitespace-nowrap px-5">
            Book an Appointment
          </BookAppointmentButton>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 justify-self-end md:hidden">
          <div className="flex items-center gap-2.5 text-dark-gray">
            <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-medical-blue">
              <FacebookIcon className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-medical-blue">
              <InstagramIcon className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-sm text-dark-navy"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <span className="relative block h-4 w-6">
              <span
                className={`absolute left-0 top-0 h-0.5 w-6 bg-current transition-transform ${
                  mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 bg-current transition-opacity ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-6 bg-current transition-transform ${
                  mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </Container>

      <MobileMenu
        id="mobile-menu"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        treatments={treatments}
        locations={locations}
      />
    </motion.header>
  );
}
