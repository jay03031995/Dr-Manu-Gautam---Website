"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  /** Items visible at once on wide screens; mobile always shows one. */
  desktopVisible?: 1 | 2 | 3;
}

export function Carousel({ children, className, desktopVisible = 2 }: CarouselProps) {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(children.length / desktopVisible);
  const mobileCount = children.length;

  const goTo = (index: number) => setPage((index + pageCount) % pageCount);

  return (
    <div className={cn(className)}>
      {/* Mobile: one card at a time, swipeable */}
      <div className="relative md:hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) goTo(Math.min(page + 1, mobileCount - 1));
              else if (info.offset.x > 60) goTo(Math.max(page - 1, 0));
            }}
          >
            {children[Math.min(page, mobileCount - 1)]}
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 flex items-center justify-center gap-2">
          {children.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setPage(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === page ? "w-6 bg-medical-blue" : "w-2 bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop: grid of N with prev/next paging */}
      <div className="hidden md:block">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "grid gap-8",
              desktopVisible === 1 && "grid-cols-1",
              desktopVisible === 2 && "grid-cols-2",
              desktopVisible === 3 && "grid-cols-3"
            )}
          >
            {children.slice(page * desktopVisible, page * desktopVisible + desktopVisible)}
          </motion.div>
        </AnimatePresence>
        {pageCount > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => goTo(page - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-dark-navy hover:bg-sky-blue"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => goTo(page + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-dark-navy hover:bg-sky-blue"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
