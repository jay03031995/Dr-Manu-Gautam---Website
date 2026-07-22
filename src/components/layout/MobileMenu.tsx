"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ChevronDown, MapPin, Clock } from "lucide-react";
import { BookAppointmentButton } from "@/components/forms/BookAppointmentButton";
import { ServiceIcon } from "@/lib/serviceIcons";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { mainNavLinks, siteConfig } from "@/lib/constants";
import { cn, telHref, treatmentPath, locationPath } from "@/lib/utils";
import type { Service, Location } from "@/sanity/lib/types";

interface MobileMenuProps {
  id: string;
  open: boolean;
  onClose: () => void;
  treatments: Pick<Service, "_id" | "title" | "slug" | "icon">[];
  locations: Pick<Location, "_id" | "name" | "slug" | "city" | "hours">[];
}

type AccordionKey = "specialties" | "clinics" | null;

export function MobileMenu({ id, open, onClose, treatments, locations }: MobileMenuProps) {
  const [openAccordion, setOpenAccordion] = useState<AccordionKey>(null);
  const pathname = usePathname();

  // Prevent background scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Reset accordion state whenever the menu closes.
  useEffect(() => {
    if (!open) setOpenAccordion(null);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const toggle = (key: AccordionKey) => setOpenAccordion((current) => (current === key ? null : key));

  return (
    <nav
      id={id}
      aria-label="Mobile"
      className={cn(
        "overflow-y-auto border-t border-gray-100 bg-white transition-[max-height] duration-300 md:hidden",
        open ? "max-h-[calc(100vh-4rem)]" : "max-h-0 border-t-0"
      )}
    >
      <ul className="flex flex-col gap-1 px-4 py-4">
        {mainNavLinks.map((link) => {
          const isSpecialties = link.href === "/treatments";
          const isClinics = link.href === "/locations";

          if (isSpecialties || isClinics) {
            const key: AccordionKey = isSpecialties ? "specialties" : "clinics";
            const isOpen = openAccordion === key;
            return (
              <li key={link.href}>
                <div className="flex items-center justify-between rounded-sm">
                  <Link
                    href={link.href}
                    onClick={onClose}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "flex-1 px-3 py-3.5 text-base font-medium hover:text-medical-blue",
                      isActive(link.href) ? "text-medical-blue" : "text-charcoal"
                    )}
                  >
                    {link.label}
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    aria-expanded={isOpen}
                    aria-label={`Toggle ${link.label} submenu`}
                    className="flex h-11 w-11 items-center justify-center text-charcoal"
                  >
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="block"
                    >
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </motion.span>
                  </button>
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-4"
                    >
                      {isSpecialties &&
                        treatments.map((t) => (
                          <li key={t._id}>
                            <Link
                              href={treatmentPath(t.slug.current)}
                              onClick={onClose}
                              className="flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm text-dark-gray hover:bg-light-blue hover:text-medical-blue"
                            >
                              <ServiceIcon name={t.icon} className="h-4 w-4 shrink-0" />
                              {t.title}
                            </Link>
                          </li>
                        ))}
                      {isSpecialties && (
                        <li>
                          <Link
                            href="/treatments"
                            onClick={onClose}
                            className="block rounded-sm px-3 py-2.5 text-sm font-medium text-medical-blue hover:bg-light-blue"
                          >
                            View All Specialties &rarr;
                          </Link>
                        </li>
                      )}
                      {isClinics &&
                        locations.map((loc) => (
                          <li key={loc._id}>
                            <Link
                              href={locationPath(loc.slug.current)}
                              onClick={onClose}
                              className="block rounded-sm px-3 py-2.5 text-sm text-dark-gray hover:bg-light-blue hover:text-medical-blue"
                            >
                              <span className="flex items-start gap-2.5">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-medical-blue" aria-hidden="true" />
                                <span>
                                  <span className="block font-medium text-charcoal">{loc.name}</span>
                                  <span className="block text-xs text-dark-gray">{loc.city}</span>
                                  {loc.hours?.[0] && (
                                    <span className="mt-0.5 flex items-center gap-1 text-xs text-dark-gray">
                                      <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                                      {loc.hours[0].days}: {loc.hours[0].time}
                                    </span>
                                  )}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      {isClinics && (
                        <li>
                          <Link
                            href="/locations"
                            onClick={onClose}
                            className="block rounded-sm px-3 py-2.5 text-sm font-medium text-medical-blue hover:bg-light-blue"
                          >
                            View All Clinics &rarr;
                          </Link>
                        </li>
                      )}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          }

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "block rounded-sm px-3 py-3.5 text-base font-medium hover:bg-light-blue hover:text-medical-blue",
                  isActive(link.href) ? "text-medical-blue" : "text-charcoal"
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-0 flex flex-col gap-3 border-t border-gray-100 bg-white px-4 py-4">
        <BookAppointmentButton onClick={onClose} className="w-full">
          Book an Appointment
        </BookAppointmentButton>
        <div className="flex items-center justify-between">
          <a href={telHref(siteConfig.phone)} className="flex items-center gap-2 text-sm font-medium text-dark-navy">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {siteConfig.phone}
          </a>
          <div className="flex items-center gap-4 text-dark-gray">
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
      </div>
    </nav>
  );
}
