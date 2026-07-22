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
