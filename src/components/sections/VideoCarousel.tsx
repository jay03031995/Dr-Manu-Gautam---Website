"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, Search, UserRound } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";
import { siteConfig } from "@/lib/constants";
import type { Video } from "@/sanity/lib/types";

const CATEGORY_LABEL: Record<string, string> = {
  knee: "Knee Care",
  "shoulder-neck": "Shoulder & Neck Care",
  back: "Back Pain Relief",
  osteoarthritis: "Osteoarthritis",
  gfc: "Growth Factor Concentrate",
};

// Real titles often carry a natural "headline | detail" split (from the source
// channel); fall back to the category as a subtitle when there's no separator.
function splitTitle(video: Video) {
  const [head, ...rest] = video.title.split("|");
  const tail = rest.join("|").trim();
  return {
    heading: head.trim(),
    subtitle: tail || CATEGORY_LABEL[video.category ?? ""] || "Patient Education",
  };
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: "All Videos", value: "all" },
  { label: "Knee", value: "knee" },
  { label: "Shoulder & Neck", value: "shoulder-neck" },
  { label: "Back Pain", value: "back" },
  { label: "Osteoarthritis", value: "osteoarthritis" },
  { label: "GFC", value: "gfc" },
];

function thumbnailUrl(video: Video) {
  if (hasImageAsset(video.thumbnail)) {
    return urlForImage(video.thumbnail).width(700).height(700).fit("crop").url();
  }
  return video.externalThumbnailUrl ?? "";
}

function youtubeId(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
  return match?.[1];
}

export function VideoCarousel({ videos }: { videos: Video[] }) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(0);

  const filtered = useMemo(() => {
    let list = category === "all" ? videos : videos.filter((v) => v.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((v) => v.title.toLowerCase().includes(q));
    }
    return list;
  }, [videos, category, search]);

  const active = Math.min(index, Math.max(filtered.length - 1, 0));

  function selectCategory(value: string) {
    setCategory(value);
    setIndex(0);
  }

  function go(delta: number) {
    setIndex((i) => (i + delta + filtered.length) % filtered.length);
  }

  return (
    <div>
      {/* Search */}
      <div className="mx-auto mb-6 max-w-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-gray" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIndex(0);
            }}
            placeholder="Search videos..."
            aria-label="Search videos"
            className="h-10 w-full rounded-full border border-light-grey bg-white pl-9 pr-4 text-sm text-charcoal placeholder:text-dark-gray/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue focus-visible:ring-offset-2"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => selectCategory(c.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              category === c.value
                ? "border-dark-navy bg-dark-navy text-white"
                : "border-light-grey bg-white text-charcoal hover:border-medical-blue hover:text-medical-blue"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-dark-gray">No videos match your search.</p>
      ) : (
        <>
          {/* Coverflow track */}
          <div className="relative flex h-60 items-center justify-center overflow-hidden sm:h-64 lg:h-72">
            {filtered.map((video, i) => {
              const offset = i - active;
              if (Math.abs(offset) > 2) return null;
              const isActive = offset === 0;
              const vid = youtubeId(video.youtubeUrl);
              const { heading, subtitle } = splitTitle(video);

              return (
                <motion.a
                  key={video._id}
                  href={isActive && vid ? `https://www.youtube.com/watch?v=${vid}` : undefined}
                  target={isActive ? "_blank" : undefined}
                  rel={isActive ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (!isActive) {
                      e.preventDefault();
                      setIndex(i);
                    }
                  }}
                  className="absolute top-1/2 flex h-60 w-80 cursor-pointer overflow-hidden rounded-xl bg-white shadow-elevation-3 sm:h-64 sm:w-[26rem] lg:h-72 lg:w-[30rem]"
                  animate={{
                    x: offset * 300,
                    y: "-50%",
                    scale: isActive ? 1 : 0.8,
                    opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.55,
                    zIndex: 10 - Math.abs(offset),
                  }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Content panel */}
                  <div className="flex w-3/5 flex-col justify-between p-4 sm:w-[55%] sm:p-6">
                    <div>
                      <p className="mb-1.5 line-clamp-2 font-heading text-base font-bold leading-snug text-dark-navy sm:text-xl">
                        {heading}
                      </p>
                      <p className="line-clamp-1 text-xs font-medium text-medical-blue sm:text-sm">
                        {subtitle}
                      </p>
                    </div>
                    <div>
                      <span className="mb-3 block h-0.5 w-8 bg-medical-blue" aria-hidden="true" />
                      <span className="inline-flex items-center gap-2 rounded-full bg-light-teal py-1.5 pl-1.5 pr-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-medical-blue">
                          <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[11px] font-semibold leading-tight text-dark-navy sm:text-xs">
                            {siteConfig.shortName}
                          </span>
                          <span className="block truncate text-[10px] leading-tight text-dark-gray">
                            Orthopaedic Surgeon
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Image panel */}
                  <div className="relative w-2/5 shrink-0 sm:w-[45%]">
                    {thumbnailUrl(video) && (
                      <Image
                        src={thumbnailUrl(video)}
                        alt={video.title}
                        fill
                        sizes="240px"
                        className="object-cover"
                      />
                    )}
                    {video.duration && (
                      <span className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        {video.duration}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-medical-blue sm:h-14 sm:w-14">
                          <Play className="ml-0.5 h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" aria-hidden="true" />
                        </span>
                      </span>
                    )}
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* Prev / next */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous video"
              onClick={() => go(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-light-grey text-dark-navy transition-colors hover:border-medical-blue hover:text-medical-blue"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next video"
              onClick={() => go(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-light-grey text-dark-navy transition-colors hover:border-medical-blue hover:text-medical-blue"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
