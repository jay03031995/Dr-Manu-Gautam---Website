import { Section } from "@/components/ui/Section";

export function GoogleReviewsSkeleton() {
  return (
    <Section background="light">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-3 h-4 w-32 animate-pulse rounded bg-light-grey" />
        <div className="mx-auto h-9 w-56 animate-pulse rounded bg-light-grey" />
      </div>
      <div className="mb-10 h-24 animate-pulse rounded-hero border border-light-grey bg-white shadow-elevation-1" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-56 animate-pulse rounded-lg border border-light-grey bg-white p-6 shadow-elevation-1" />
        ))}
      </div>
    </Section>
  );
}
