"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { useAppointmentModal } from "@/components/forms/AppointmentModalContext";
import type { Service, Location } from "@/sanity/lib/types";

interface AppointmentModalProps {
  services: Pick<Service, "_id" | "title" | "slug">[];
  locations: Pick<Location, "_id" | "name" | "slug" | "city">[];
}

export function AppointmentModal({ services, locations }: AppointmentModalProps) {
  const { isOpen, closeModal } = useAppointmentModal();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center overflow-y-auto bg-charcoal/40 p-0 sm:items-center sm:p-4"
          onClick={closeModal}
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-modal-heading"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-light-grey bg-white p-6 shadow-elevation-4 sm:my-8 sm:rounded-2xl sm:p-8"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="appointment-modal-heading" className="text-xl font-semibold text-dark-navy">
                  Book an Appointment
                </h2>
                <p className="mt-1.5 text-sm text-dark-gray">
                  Tell us a bit about yourself and your concern — we&rsquo;ll confirm a consultation time.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-dark-gray hover:bg-light-blue hover:text-dark-navy"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <AppointmentForm services={services} locations={locations} source="appointment" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
