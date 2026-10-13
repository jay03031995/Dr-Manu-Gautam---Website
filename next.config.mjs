import { legacySearchRedirects } from "./legacy-search-redirects.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required so /orthopaedic-surgeon/delhi-ncr/{slug}/ URLs are served with
  // their trailing slash as canonical, rather than Next's default of
  // redirecting trailing-slash requests away from it.
  trailingSlash: true,
  async redirects() {
    return [
      // Retired WordPress sitemap endpoints: point crawlers to the canonical
      // current XML sitemap. Remove these older submissions from GSC as well.
      { source: "/page-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      {
        // Old treatment detail URLs -> new /orthopaedic-surgeon/delhi-ncr/ structure.
        // The /treatments listing page itself (no slug) is untouched. Matches the
        // trailing-slash form because trailingSlash:true normalizes incoming
        // requests before redirects() is evaluated — this keeps it a single hop.
        source: "/treatments/:slug/",
        destination: "/orthopaedic-surgeon/delhi-ncr/:slug/",
        permanent: true,
      },
      {
        // Doctor profile moved under /orthopaedic-surgeon/delhi-ncr/ for SEO consistency with treatments.
        source: "/doctor/",
        destination: "/orthopaedic-surgeon/delhi-ncr/dr-manu-gautam/",
        permanent: true,
      },
      {
        source: "/about-dr-manu-gautam/",
        destination: "/about/",
        permanent: true,
      },
      {
        source: "/contact-us/",
        destination: "/contact/",
        permanent: true,
      },
      {
        source: "/gallery/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/knee-replacement/",
        destination: "/best-doctor-of-knee-replacement-in-noida/",
        permanent: true,
      },
      {
        source: "/knee-replacement-therapy/",
        destination: "/best-doctor-of-knee-replacement-in-noida/",
        permanent: true,
      },
      // Legacy WordPress URLs still held in search/AI indexes (found Oct 2026);
      // previously 404. Each goes to the closest current page.
      {
        source: "/top-orthopedic-doctor-in-ghaziabad-comprehensive-care-for-your-bones-and-joints/",
        destination: "/orthopaedic-surgeon/ghaziabad/",
        permanent: true,
      },
      {
        source: "/expert-orthopedic-surgeon-in-ghaziabad/",
        destination: "/orthopaedic-surgeon/ghaziabad/",
        permanent: true,
      },
      {
        source: "/orthopedic-surgeon-near-ghaziabad/",
        destination: "/orthopaedic-surgeon/ghaziabad/",
        permanent: true,
      },
      {
        source: "/orthopedic-surgeon-in-ghaziabad-comprehensive-care-for-your-musculoskeletal-health/",
        destination: "/orthopaedic-surgeon/ghaziabad/",
        permanent: true,
      },
      {
        source: "/best-orthopedic-doctor-in-ghaziabad/",
        destination: "/orthopaedic-surgeon/ghaziabad/",
        permanent: true,
      },
      {
        source: "/best-ortho-surgeon-in-ghaziabad/",
        destination: "/orthopaedic-surgeon/ghaziabad/",
        permanent: true,
      },
      {
        source: "/shoulder-replacement-surgery-in-ghaziabad/",
        destination: "/orthopaedic-surgeon/delhi-ncr/shoulder-replacement/",
        permanent: true,
      },
      {
        source: "/robotic-knee-replacement-specialist-in-indirapuram/",
        destination: "/orthopaedic-surgeon/delhi-ncr/robotic-knee-replacement/",
        permanent: true,
      },
      {
        source: "/robotic-knee-replacement-specialist-in-indirapuram-2/",
        destination: "/orthopaedic-surgeon/delhi-ncr/robotic-knee-replacement/",
        permanent: true,
      },
      {
        source: "/best-orthopedic-surgery-center-in-noida/",
        destination: "/orthopaedic-surgeon/noida/",
        permanent: true,
      },
      {
        source: "/best-center-for-hip-and-knee-replacement-in-noida/",
        destination: "/orthopaedic-surgeon/delhi-ncr/joint-replacement/",
        permanent: true,
      },
      {
        source: "/replacement-surgeon-in-ghaziabad/",
        destination: "/orthopaedic-surgeon/delhi-ncr/joint-replacement/",
        permanent: true,
      },
      {
        source: "/knee-replacement-in-ghaziabad/",
        destination: "/best-doctor-of-knee-replacement-in-noida/",
        permanent: true,
      },
      {
        source: "/knee-replacement-surgery-in-ghaziabad/",
        destination: "/best-doctor-of-knee-replacement-in-noida/",
        permanent: true,
      },
      {
        source: "/knee-replacement-surgery-in-noida/",
        destination: "/best-doctor-of-knee-replacement-in-noida/",
        permanent: true,
      },
      {
        source: "/knee-replacement-surgery-in-indirapuram/",
        destination: "/best-doctor-of-knee-replacement-in-noida/",
        permanent: true,
      },
      {
        source: "/knee-replacement-surgery-in-vasundhara/",
        destination: "/best-doctor-of-knee-replacement-in-noida/",
        permanent: true,
      },
      {
        source: "/joint-replacement/",
        destination: "/orthopaedic-surgeon/delhi-ncr/joint-replacement/",
        permanent: true,
      },
      {
        source: "/joint-replacement-surgeon-in-ghaziabad/",
        destination: "/orthopaedic-surgeon/delhi-ncr/joint-replacement/",
        permanent: true,
      },
      {
        source: "/joint-replacement-surgeon-in-noida/",
        destination: "/orthopaedic-surgeon/delhi-ncr/joint-replacement/",
        permanent: true,
      },
      {
        source: "/hip-replacement/",
        destination: "/orthopaedic-surgeon/delhi-ncr/hip-replacement/",
        permanent: true,
      },
      {
        source: "/hip-replacement-surgery-in-ghaziabad/",
        destination: "/orthopaedic-surgeon/delhi-ncr/hip-replacement/",
        permanent: true,
      },
      {
        source: "/hip-replacement-surgery-in-noida/",
        destination: "/orthopaedic-surgeon/delhi-ncr/hip-replacement/",
        permanent: true,
      },
      {
        source: "/knee-arthroscopy/",
        destination: "/orthopaedic-surgeon/delhi-ncr/sports-injuries/",
        permanent: true,
      },
      {
        source: "/knee-arthroscopy-treatment-in-ghaziabad/",
        destination: "/orthopaedic-surgeon/delhi-ncr/sports-injuries/",
        permanent: true,
      },
      {
        source: "/ankle-arthroscopy/",
        destination: "/orthopaedic-surgeon/delhi-ncr/sports-injuries/",
        permanent: true,
      },
      {
        source: "/shoulder-replacement/",
        destination: "/orthopaedic-surgeon/delhi-ncr/shoulder-replacement/",
        permanent: true,
      },
      {
        source: "/elbow-replacement/",
        destination: "/treatments/",
        permanent: true,
      },
      ...legacySearchRedirects,
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
