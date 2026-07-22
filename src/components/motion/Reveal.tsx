"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
  /** "onView" (default) animates in on scroll; "onMount" for above-the-fold content. */
  mode?: "onView" | "onMount";
}

/** Fades + slides content up, either on scroll-into-view or immediately on mount. */
export function Reveal({ children, className, delay = 0, as = "div", mode = "onView" }: RevealProps) {
  const MotionTag = as === "section" ? motion.section : motion.div;
  const animateProps =
    mode === "onMount"
      ? { animate: { opacity: 1, y: 0 } }
      : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" } };

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay }}
      {...animateProps}
    >
      {children}
    </MotionTag>
  );
}
