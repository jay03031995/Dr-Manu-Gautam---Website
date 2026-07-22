"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { TreatmentsMegaMenu } from "@/components/layout/TreatmentsMegaMenu";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { mainNavLinks, siteConfig } from "@/lib/constants";
import { cn, telHref } from "@/lib/utils";
import type { Service } from "@/sanity/lib/types";

interface SiteHeaderProps {
  logoUrl?: string;
  treatments: Pick<Service, "_id" | "title" | "slug" | "icon" | "shortDescription">[];
}

export function SiteHeader({ logoUrl, treatments }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);
  });

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur transition-shadow duration-300",
        scrolled ? "border-gray-100 shadow-elevation-2" : "border-transparent"
      )}
    >
      <Container
        className={cn(
          "flex items-center justify-between transition-[height] duration-300",
          scrolled ? "h-14 md:h-16" : "h-16 md:h-20"
        )}
      >
        <Link href="/" className="flex items-center font-heading text-lg font-bold text-dark-navy md:text-xl">
          {logoUrl ? (
            <span className="relative block h-9 w-32 md:h-11 md:w-40">
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

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {mainNavLinks.map((link) => (
              <li key={link.href}>
                {link.href === "/treatments" ? (
                  <TreatmentsMegaMenu treatments={treatments} />
                ) : (
                  <Link href={link.href} className="text-sm font-medium text-charcoal hover:text-medical-blue">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <div className="hidden items-center gap-3 border-r border-light-grey pr-4 text-dark-gray lg:flex">
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
            className="flex items-center gap-2 text-sm font-medium text-dark-navy hover:text-medical-blue"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {siteConfig.phone}
          </a>
          <Button href="/appointment" size="regular">
            Book an Appointment
          </Button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <div className="flex items-center gap-2.5 text-dark-gray">
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

      <MobileMenu id="mobile-menu" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </motion.header>
  );
}
