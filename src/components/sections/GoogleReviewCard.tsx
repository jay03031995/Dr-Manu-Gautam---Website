"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface GoogleReviewCardProps {
  authorName: string;
  authorPhotoUrl?: string;
  rating: number;
  relativeTime: string;
  text: string;
}

const TRUNCATE_AT = 160;

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function GoogleReviewCard({ authorName, authorPhotoUrl, rating, relativeTime, text }: GoogleReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > TRUNCATE_AT;
  const shown = expanded || !isLong ? text : `${text.slice(0, TRUNCATE_AT).trimEnd()}…`;

  return (
    <Card className="flex h-full flex-col p-6">
      <div className="mb-3 flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={i < rating ? "h-4 w-4 fill-cta-orange text-cta-orange" : "h-4 w-4 text-light-grey"}
            aria-hidden="true"
          />
        ))}
      </div>

      <p className="mb-3 flex-1 text-sm leading-relaxed text-charcoal">
        {shown}
        {isLong && (
          <>
            {" "}
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="font-medium text-medical-blue underline-offset-2 hover:underline"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          </>
        )}
      </p>

      <div className="flex items-center gap-3 border-t border-light-grey pt-4">
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-light-teal text-xs font-semibold text-medical-blue">
          {authorPhotoUrl ? (
            <Image src={authorPhotoUrl} alt="" fill sizes="40px" className="object-cover" referrerPolicy="no-referrer" />
          ) : (
            initialsOf(authorName)
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-dark-navy">{authorName}</p>
          <p className="text-xs text-dark-gray">{relativeTime}</p>
        </div>
      </div>
    </Card>
  );
}
