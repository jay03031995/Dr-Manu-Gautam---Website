import { Star, ExternalLink } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Carousel } from "@/components/ui/Carousel";
import { GoogleReviewCard } from "@/components/sections/GoogleReviewCard";
import { siteConfig } from "@/lib/constants";
import { getGooglePlaceReviews } from "@/lib/googlePlaces";

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
  // Only display a numerical rating and review total received from the
  // Google Places API. Do not substitute an old snapshot or sample reviews.
  const isLive = !!live && live.reviews.length > 0;
  const hasReviews = isLive;
  const reviews = isLive
    ? live.reviews.map((r) => ({
        key: `${r.authorName}-${r.time}`,
        authorName: r.authorName,
        authorPhotoUrl: r.authorPhotoUrl,
        rating: r.rating,
        relativeTime: r.relativeTime,
        text: r.text,
      }))
    : [];
  const avgRating = isLive ? live.rating : 0;
  const reviewCount = isLive ? live.totalReviews : 0;
  const mapsUrl = (isLive && live.mapsUrl) || siteConfig.googleBusinessProfileUrl;

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
            href={siteConfig.googleBusinessProfileUrl}
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
