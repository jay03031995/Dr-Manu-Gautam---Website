import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { InstagramIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { VideoCarousel } from "@/components/sections/VideoCarousel";
import { siteConfig } from "@/lib/constants";
import { getVideos } from "@/sanity/lib/fetch";

export async function ConnectSection() {
  const videos = await getVideos();

  return (
    <Section background="light">
      <Reveal className="mb-10 text-center">
        <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
          Stay Connected
        </p>
        <h2>Patient Education on Video</h2>
      </Reveal>

      {videos.length > 0 ? (
        <Reveal>
          <VideoCarousel videos={videos} />
        </Reveal>
      ) : (
        <div className="overflow-hidden rounded-hero border border-light-grey bg-black shadow-elevation-2">
          <div className="relative aspect-video">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/videoseries?list=UU${siteConfig.youtubeChannelId.slice(2)}`}
              title={`${siteConfig.shortName} — YouTube videos`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <Reveal delay={0.1} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
        <a
          href={siteConfig.social.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="card-base card-shadow flex flex-1 items-center gap-3 p-3"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <YoutubeIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-dark-navy">Watch on YouTube</p>
            <p className="truncate text-xs text-dark-gray">Patient education videos</p>
          </div>
          <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-dark-gray" aria-hidden="true" />
        </a>

        <a
          href={siteConfig.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="card-base card-shadow flex flex-1 items-center gap-3 p-3"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-light-olive text-olive">
            <InstagramIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-dark-navy">Follow on Instagram</p>
            <p className="truncate text-xs text-dark-gray">@drmanugautam</p>
          </div>
          <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-dark-gray" aria-hidden="true" />
        </a>
      </Reveal>
    </Section>
  );
}
