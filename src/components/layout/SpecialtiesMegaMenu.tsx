"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { ServiceIcon } from "@/lib/serviceIcons";
import { treatmentPath, cn } from "@/lib/utils";
import type { Service } from "@/sanity/lib/types";

type NavService = Pick<Service, "_id" | "title" | "slug" | "icon" | "shortDescription" | "conditionsTreated">;

interface SpecialtiesMegaMenuProps {
  treatments: NavService[];
}

// Groups the real service catalogue into browsable categories for the mega
// menu. Sanity's `treatmentCategory` reference is only populated for 2 of the
// 7 services today, so this presentation-level grouping is defined by slug
// here rather than fabricating category pages that don't exist.
const CATEGORY_GROUPS: { title: string; slugs: string[] }[] = [
  { title: "Joint Replacement", slugs: ["joint-replacement", "robotic-knee-replacement"] },
  { title: "Sports Injuries & Arthroscopy", slugs: ["sports-injuries"] },
  { title: "Spine & Trauma Care", slugs: ["spine-care", "trauma-care"] },
  { title: "Rehabilitation & Pediatric Care", slugs: ["rehabilitation", "pediatric-orthopedics"] },
];

/** Desktop "Specialties" nav item — opens a categorized mega menu on hover, click, or focus. */
export function SpecialtiesMegaMenu({ treatments }: SpecialtiesMegaMenuProps) {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>();
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const active = pathname.startsWith("/orthopaedic-surgeon/delhi-ncr") || pathname.startsWith("/treatments");

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

  if (!treatments.length) {
    return (
      <Link href="/treatments" className="text-sm font-medium text-charcoal hover:text-medical-blue">
        Specialties
      </Link>
    );
  }

  const byslug = new Map(treatments.map((t) => [t.slug.current, t]));
  const groups = CATEGORY_GROUPS.map((g) => ({
    title: g.title,
    services: g.slugs.map((s) => byslug.get(s)).filter((s): s is NavService => Boolean(s)),
  })).filter((g) => g.services.length > 0);

  return (
    <div ref={rootRef} className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon} onFocus={openNow}>
      <button
        type="button"
        className={cn(
          "flex items-center gap-1 text-sm font-medium hover:text-medical-blue",
          active ? "text-medical-blue" : "text-charcoal"
        )}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Specialties
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      {/* Invisible bridge so the pointer never fully exits the wrapper between the label and the panel. */}
      {open && <div className="absolute left-1/2 top-full h-3 w-[min(880px,90vw)] -translate-x-1/2" aria-hidden="true" />}

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 top-full z-50 mt-3 w-[min(880px,90vw)] -translate-x-1/2 rounded-lg border border-light-grey bg-white p-5 shadow-elevation-4"
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4">
              {groups.map((group) => (
                <div key={group.title}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-medical-blue">
                    {group.title}
                  </p>
                  <ul className="space-y-3">
                    {group.services.map((service) => (
                      <li key={service._id}>
                        <Link
                          href={treatmentPath(service.slug.current)}
                          role="menuitem"
                          onClick={() => setOpen(false)}
                          className="group flex items-start gap-2.5"
                        >
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-light-teal text-medical-blue">
                            <ServiceIcon name={service.icon} className="h-3.5 w-3.5" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-dark-navy group-hover:text-medical-blue">
                              {service.title}
                            </span>
                            {service.conditionsTreated && service.conditionsTreated.length > 0 && (
                              <span className="mt-0.5 block text-xs text-dark-gray">
                                {service.conditionsTreated.slice(0, 2).join(" · ")}
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-light-grey pt-3">
              <Link
                href="/treatments"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1 rounded-md py-2 text-sm font-medium text-medical-blue hover:bg-light-blue"
              >
                View All Specialties
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
