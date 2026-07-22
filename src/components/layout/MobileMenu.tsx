"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { mainNavLinks, footerLinks, siteConfig } from "@/lib/constants";
import { cn, telHref } from "@/lib/utils";

interface MobileMenuProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ id, open, onClose }: MobileMenuProps) {
  const [treatmentsOpen, setTreatmentsOpen] = useState(false);

  return (
    <nav
      id={id}
      aria-label="Mobile"
      className={cn(
        "overflow-hidden border-t border-gray-100 bg-white transition-[max-height] duration-300 md:hidden",
        open ? "max-h-screen" : "max-h-0 border-t-0"
      )}
    >
      <ul className="flex flex-col gap-1 px-4 py-4">
        {mainNavLinks.map((link) =>
          link.href === "/treatments" ? (
            <li key={link.href}>
              <div className="flex items-center justify-between rounded-sm hover:bg-light-blue">
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex-1 px-3 py-3 text-base font-medium text-charcoal hover:text-medical-blue"
                >
                  {link.label}
                </Link>
                <button
                  type="button"
                  onClick={() => setTreatmentsOpen((o) => !o)}
                  aria-expanded={treatmentsOpen}
                  aria-label="Toggle treatments submenu"
                  className="px-3 py-3 text-charcoal"
                >
                  <motion.span
                    animate={{ rotate: treatmentsOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </motion.span>
                </button>
              </div>
              <AnimatePresence initial={false}>
                {treatmentsOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pl-4"
                  >
                    {footerLinks.treatments.map((t) => (
                      <li key={t.href}>
                        <Link
                          href={t.href}
                          onClick={onClose}
                          className="block rounded-sm px-3 py-2 text-sm text-dark-gray hover:bg-light-blue hover:text-medical-blue"
                        >
                          {t.label}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ) : (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="block rounded-sm px-3 py-3 text-base font-medium text-charcoal hover:bg-light-blue hover:text-medical-blue"
              >
                {link.label}
              </Link>
            </li>
          )
        )}
      </ul>
      <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4">
        <a
          href={telHref(siteConfig.phone)}
          className="flex items-center gap-2 text-sm font-medium text-dark-navy"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          {siteConfig.phone}
        </a>
        <Button href="/appointment" onClick={onClose} className="w-full">
          Book an Appointment
        </Button>
        <div className="flex items-center gap-4 pt-1 text-dark-gray">
          <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-medical-blue">
            <FacebookIcon className="h-5 w-5" aria-hidden="true" />
          </a>
          <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-medical-blue">
            <InstagramIcon className="h-5 w-5" aria-hidden="true" />
          </a>
          <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-medical-blue">
            <YoutubeIcon className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </nav>
  );
}
