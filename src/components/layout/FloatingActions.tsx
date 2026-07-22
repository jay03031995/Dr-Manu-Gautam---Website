"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { telHref } from "@/lib/utils";

const whatsappNumber = siteConfig.phone.replace(/[^\d]/g, "");

/** Sticky call/WhatsApp shortcuts — the fastest path to a booked appointment on mobile. */
export function FloatingActions() {
  return (
    <div className="fixed bottom-24 right-5 z-40 flex flex-col gap-3 md:hidden">
      <motion.a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elevation-3"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </motion.a>
      <motion.a
        href={telHref(siteConfig.phone)}
        aria-label="Call the clinic"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-cta-orange text-white shadow-elevation-3"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <Phone className="h-6 w-6" aria-hidden="true" />
      </motion.a>
    </div>
  );
}
