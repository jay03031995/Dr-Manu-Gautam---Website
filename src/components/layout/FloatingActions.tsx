"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { usePathname } from "next/navigation";

const whatsappNumber = siteConfig.phone.replace(/[^\d]/g, "");

/** Sticky WhatsApp shortcut — the Contact tab in the bottom nav already covers calling. */
export function FloatingActions() {
  const pathname = usePathname();
  const isKneeLanding = Boolean(pathname && (pathname.includes("knee") && pathname.includes("replacement"))) || pathname === "/best-doctor-of-knee-replacement-in-noida";

  return (
    <div className={`fixed bottom-28 right-5 z-50 flex flex-col gap-3 ${isKneeLanding ? "" : "md:hidden"}`}>
      <motion.a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onClick={() => trackEvent("whatsapp_click", { location: "floating_pill" })}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elevation-3"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </motion.a>
    </div>
  );
}
