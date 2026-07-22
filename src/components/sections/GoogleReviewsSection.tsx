import { Star, ExternalLink } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Carousel } from "@/components/ui/Carousel";
import { GoogleReviewCard } from "@/components/sections/GoogleReviewCard";
import { siteConfig } from "@/lib/constants";
import { getGooglePlaceReviews } from "@/lib/googlePlaces";
import { getFeaturedTestimonials } from "@/sanity/lib/fetch";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";

function GoogleWordmark() {
  return (
    <span className="font-heading text-lg font-bold">
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </span>
  );
}

export async function GoogleReviewsSection() {
  const live = await getGooglePlaceReviews();
  const isLive = !!live && live.reviews.length > 0;

  // Live Google Places data is preferred. When it isn't configured, fall back
  // to reviews the clinic has manually copied from Google into Sanity (source:
  // "Google Review") rather than showing nothing or inventing content.
  const curated = isLive ? [] : await getFeaturedTestimonials();
  const hasCurated = curated.length > 0;
  const hasReviews = isLive || hasCurated;

  const reviews = isLive
    ? live.reviews.map((r) => ({
        key: `${r.authorName}-${r.time}`,
        authorName: r.authorName,
        authorPhotoUrl: r.authorPhotoUrl,
        rating: r.rating,
        relativeTime: r.relativeTime,
        text: r.text,
      }))
    : curated.map((t) => ({
        key: t._id,
        authorName: t.author,
        authorPhotoUrl: hasImageAsset(t.photo) ? urlForImage(t.photo).width(80).height(80).fit("crop").url() : undefined,
        rating: t.rating,
        relativeTime: t.relativeTime ?? "",
        text: t.quote,
      }));

  const avgRating = isLive
    ? live.rating
    : hasCurated
      ? siteConfig.googleReviewsSnapshot.rating
      : 0;
  const reviewCount = isLive ? live.totalReviews : siteConfig.googleReviewsSnapshot.totalReviews;
  const mapsUrl = (isLive && live.mapsUrl) || siteConfig.googleMapsUrl;

  return (
    <Section background="light">
      <Reveal className="mb-10 text-center">
        <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
          Patient Feedback
        </p>
        <h2>
          <GoogleWordmark /> <span className="text-dark-navy">Reviews</span>
        </h2>
      </Reveal>

      {hasReviews ? (
        <>
          <Reveal
            delay={0.05}
            className="mb-10 flex flex-col items-center justify-between gap-6 rounded-hero border border-light-grey bg-white p-6 shadow-elevation-1 sm:flex-row sm:p-8"
          >
            <div className="flex flex-col items-center gap-1 sm:items-start">
              <div className="flex items-center gap-3">
                <span className="font-heading text-2xl font-bold text-dark-navy">{avgRating.toFixed(1)}</span>
                <span className="flex gap-0.5" role="img" aria-label={`${avgRating.toFixed(1)} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < Math.round(avgRating)
                          ? "h-5 w-5 fill-cta-orange text-cta-orange"
                          : "h-5 w-5 text-light-grey"
                      }
                      aria-hidden="true"
                    />
                  ))}
                </span>
                <span className="text-sm text-dark-gray">({reviewCount})</span>
              </div>
              {!isLive && (
                <p className="text-xs text-dark-gray">on Google &middot; showing a few featured reviews below</p>
              )}
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base bg-medical-blue px-5 py-2.5 text-sm text-white shadow-elevation-1 hover:bg-medical-blue-700"
            >
              Write a Review
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <Carousel desktopVisible={3}>
              {reviews.map(({ key, ...review }) => (
                <GoogleReviewCard key={key} {...review} />
              ))}
            </Carousel>
          </Reveal>
        </>
      ) : (
        <Reveal className="mx-auto max-w-md rounded-hero border border-light-grey bg-white p-8 text-center shadow-elevation-1">
          <p className="mb-4 text-sm text-dark-gray leading-relaxed">
            We couldn&rsquo;t load live reviews right now. You can still read and write reviews directly on Google.
          </p>
          <a
            href={siteConfig.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-base bg-medical-blue px-5 py-2.5 text-sm text-white shadow-elevation-1 hover:bg-medical-blue-700"
          >
            View on Google
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </Reveal>
      )}
    </Section>
  );
}
