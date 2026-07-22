import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getActiveAnnouncement } from "@/sanity/lib/fetch";

export async function AnnouncementBar() {
  const announcement = await getActiveAnnouncement();
  if (!announcement) return null;

  return (
    <div className="w-full bg-dark-navy px-4 py-2.5 text-center text-white">
      <p className="text-xs font-medium tracking-wide text-white sm:text-sm">
        {announcement.message}
        {announcement.ctaLabel && announcement.ctaHref && (
          <Link
            href={announcement.ctaHref}
            className="ml-2 inline-flex items-center gap-1 underline underline-offset-2 hover:no-underline"
          >
            {announcement.ctaLabel}
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        )}
      </p>
    </div>
  );
}
