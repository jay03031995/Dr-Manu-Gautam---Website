"use client";

import { Children, isValidElement } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

interface RevealGridProps {
  children: React.ReactNode;
  className?: string;
}

/** Wraps a grid of cards so they fade/slide in one-by-one as the grid scrolls into view. */
export function RevealGrid({ children, className }: RevealGridProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
    >
      {Children.map(children, (child) =>
        isValidElement(child) ? (
          <motion.div variants={item} className="h-full">
            {child}
          </motion.div>
        ) : (
          child
        )
      )}
    </motion.div>
  );
}
