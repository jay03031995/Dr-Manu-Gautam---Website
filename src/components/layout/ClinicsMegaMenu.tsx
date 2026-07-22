"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ArrowRight, MapPin, Clock } from "lucide-react";
import { locationPath, cn } from "@/lib/utils";
import type { Location } from "@/sanity/lib/types";

type NavLocation = Pick<Location, "_id" | "name" | "slug" | "city" | "hours">;

interface ClinicsMegaMenuProps {
  locations: NavLocation[];
}

/** Desktop "Clinics" nav item — dropdown of consultation locations. */
export function ClinicsMegaMenu({ locations }: ClinicsMegaMenuProps) {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>();
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const active = pathname.startsWith("/orthopaedic-surgeon") && !pathname.startsWith("/orthopaedic-surgeon/delhi-ncr");
  const activeLocations = active || pathname.startsWith("/locations");

  const openNow = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), 250);
  };

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  if (!locations.length) {
    return (
      <Link href="/locations" className="text-sm font-medium text-charcoal hover:text-medical-blue">
        Clinics
      </Link>
    );
  }

  return (
    <div ref={rootRef} className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon} onFocus={openNow}>
      <button
        type="button"
        className={cn(
          "flex items-center gap-1 text-sm font-medium hover:text-medical-blue",
          activeLocations ? "text-medical-blue" : "text-charcoal"
        )}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Clinics
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      {open && <div className="absolute left-1/2 top-full h-3 w-[340px] -translate-x-1/2" aria-hidden="true" />}

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 top-full z-50 mt-3 w-[340px] -translate-x-1/2 rounded-lg border border-light-grey bg-white p-3 shadow-elevation-4"
          >
            <ul className="space-y-1">
              {locations.map((loc) => (
                <li key={loc._id}>
                  <Link
                    href={locationPath(loc.slug.current)}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="block rounded-md p-3 hover:bg-light-blue"
                  >
                    <span className="flex items-start gap-2.5">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-medical-blue" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-dark-navy">{loc.name}</span>
                        <span className="block text-xs text-dark-gray">{loc.city}</span>
                        {loc.hours?.[0] && (
                          <span className="mt-1 flex items-center gap-1 text-xs text-dark-gray">
                            <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                            {loc.hours[0].days}: {loc.hours[0].time}
                          </span>
                        )}
                        <span className="mt-1.5 inline-block text-xs font-medium text-medical-blue">
                          View location &rarr;
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-1 border-t border-light-grey pt-2">
              <Link
                href="/locations"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1 rounded-md py-2 text-sm font-medium text-medical-blue hover:bg-light-blue"
              >
                View All Clinics
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
