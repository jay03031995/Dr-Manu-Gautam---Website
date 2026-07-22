"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type CardProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <motion.div
      className={cn("card-base card-shadow", className)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  /** Optional photo URL — once set in Sanity, the card switches from the icon
   *  placeholder to a photo automatically. */
  imageUrl?: string;
  className?: string;
}

const MotionLink = motion.create(Link);

export function ServiceCard({ icon, title, description, href, imageUrl, className }: ServiceCardProps) {
  return (
    <MotionLink
      href={href}
      className={cn("card-base card-shadow group block overflow-hidden p-0", className)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, 45vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-light-teal">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-medical-blue text-white">
              {icon}
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-navy/70 via-dark-navy/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1 text-base font-semibold text-dark-navy">{title}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-dark-gray leading-relaxed">{description}</p>
        <div className="mt-auto flex items-center justify-end border-t border-light-grey pt-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-light-teal px-3 py-1.5 text-xs font-medium text-medical-blue transition-colors group-hover:bg-medical-blue group-hover:text-white">
            Explore
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </MotionLink>
  );
}

interface TestimonialCardProps {
  rating: number;
  quote: string;
  author: string;
  role?: string;
  className?: string;
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TestimonialCard({ rating, quote, author, role, className }: TestimonialCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="mb-3 flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn("h-4 w-4", i < rating ? "fill-medical-blue text-medical-blue" : "text-gray-200")}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="mb-4 text-sm text-charcoal leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-blue text-sm font-semibold text-medical-blue"
          aria-hidden="true"
        >
          {initialsOf(author)}
        </div>
        <div>
          <p className="text-sm font-semibold text-dark-navy">{author}</p>
          {role && <p className="text-xs text-dark-gray">{role}</p>}
        </div>
      </div>
    </Card>
  );
}

interface StatsCardProps {
  number: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({ number, label, icon, className }: StatsCardProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-blue text-medical-blue">
          {icon}
        </div>
      )}
      <div>
        <p className="font-heading text-2xl font-bold text-dark-navy">{number}</p>
        <p className="text-sm text-dark-gray">{label}</p>
      </div>
    </div>
  );
}
