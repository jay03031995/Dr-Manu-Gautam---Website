import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { siteConfig, footerLinks } from "@/lib/constants";
import { telHref } from "@/lib/utils";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark-navy pb-20 text-white md:pb-0">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-3 font-heading text-lg font-bold text-white">{siteConfig.shortName}</p>
            <p className="mb-4 text-sm text-white/70 leading-relaxed">{siteConfig.description}</p>
            <div className="flex items-center gap-3">
              <a href={siteConfig.social.facebook} aria-label="Facebook" className="text-white/70 hover:text-white">
                <FacebookIcon className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href={siteConfig.social.instagram} aria-label="Instagram" className="text-white/70 hover:text-white">
                <InstagramIcon className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href={siteConfig.social.youtube} aria-label="YouTube" className="text-white/70 hover:text-white">
                <YoutubeIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <p className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-white/50">
              Treatments
            </p>
            <ul className="flex flex-col gap-2">
              {footerLinks.treatments.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/80 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-white/50">
              Practice
            </p>
            <ul className="flex flex-col gap-2">
              {footerLinks.practice.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/80 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-white/50">
              Contact
            </p>
            <ul className="flex flex-col gap-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {siteConfig.address.line1}, {siteConfig.address.locality}, {siteConfig.address.region}{" "}
                  {siteConfig.address.postalCode}
                </span>
              </li>
              <li>
                <a href={telHref(siteConfig.phone)} className="flex items-center gap-2 hover:text-white">
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  For Appointment: {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={telHref(siteConfig.emergencyPhone)}
                  className="flex items-center gap-2 hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  For Emergency: {siteConfig.emergencyPhone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-white">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/60">
          <p className="text-white/60">
            &copy; {year} {siteConfig.shortName}. All rights reserved. Serving {siteConfig.serviceAreas.join(", ")}.
          </p>
        </div>
      </Container>
    </footer>
  );
}
