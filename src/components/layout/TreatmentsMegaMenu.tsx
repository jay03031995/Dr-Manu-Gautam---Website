"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { ServiceIcon } from "@/lib/serviceIcons";
import { treatmentPath } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Service } from "@/sanity/lib/types";

interface TreatmentsMegaMenuProps {
  treatments: Pick<Service, "_id" | "title" | "slug" | "icon" | "shortDescription">[];
}

/** Desktop "Treatments" nav item — opens a mega menu on hover or click. */
export function TreatmentsMegaMenu({ treatments }: TreatmentsMegaMenuProps) {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>();
  const rootRef = useRef<HTMLDivElement>(null);

  const openNow = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  };

  const closeSoon = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), 150);
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
        Treatments
      </Link>
    );
  }

  return (
    <div ref={rootRef} className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        className="flex items-center gap-1 text-sm font-medium text-charcoal hover:text-medical-blue"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Treatments
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 top-full z-50 mt-3 w-[640px] -translate-x-1/2 rounded-lg border border-light-grey bg-white p-4 shadow-elevation-4"
          >
            <div className="grid grid-cols-2 gap-1">
              {treatments.map((t) => (
                <Link
                  key={t._id}
                  href={treatmentPath(t.slug.current)}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 rounded-md p-3 hover:bg-light-blue"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-light-teal text-medical-blue">
                    <ServiceIcon name={t.icon} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-dark-navy">{t.title}</span>
                    <span className="line-clamp-1 block text-xs text-dark-gray">{t.shortDescription}</span>
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-2 border-t border-light-grey pt-3">
              <Link
                href="/treatments"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1 rounded-md py-2 text-sm font-medium text-medical-blue hover:bg-light-blue"
              >
                View All Treatments
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
