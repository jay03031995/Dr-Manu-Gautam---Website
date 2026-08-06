/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required so /orthopaedic-surgeon/delhi-ncr/{slug}/ URLs are served with
  // their trailing slash as canonical, rather than Next's default of
  // redirecting trailing-slash requests away from it.
  trailingSlash: true,
  async redirects() {
    return [
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
        destination: "/about",
        permanent: true,
      },
      {
        source: "/contact-us/",
        destination: "/contact",
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
        destination: "/treatments",
        permanent: true,
      },
      {
        source: "/hip-replacement-surgery-in-ghaziabad/",
        destination: "/treatments",
        permanent: true,
      },
      {
        source: "/hip-replacement-surgery-in-noida/",
        destination: "/treatments",
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
        destination: "/treatments",
        permanent: true,
      },
      {
        source: "/elbow-replacement/",
        destination: "/treatments",
        permanent: true,
      },
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
