export const siteConfig = {
  name: "Dr. Manu Gautam - Orthopedic Surgery",
  shortName: "Dr. Manu Gautam",
  description:
    "Expert orthopedic care in Noida & Ghaziabad. Advanced treatments, compassionate care, and personalized solutions for joint replacement, spine care, sports injuries, and rehabilitation.",
  url: "https://www.drmanugautam.com",
  ogImage: "/images/og-image.jpg",
  locale: "en_IN",
  phone: "+91 9769761602",
  emergencyPhone: "+91 9999770850",
  email: "info.drmanugautam@gmail.com",
  address: {
    line1: "D-8, Sector 20",
    locality: "Noida",
    region: "Uttar Pradesh",
    postalCode: "201301",
    country: "IN",
  },
  serviceAreas: ["Noida", "Ghaziabad", "Greater Noida", "Delhi NCR"],
  social: {
    facebook: "https://facebook.com/people/DrManu-Gautam/100084198227670/",
    instagram: "https://www.instagram.com/drmanugautam/",
    youtube: "https://www.youtube.com/@DrManuGautam/videos",
  },
  youtubeChannelId: "UCK-nHyg1cxQMziniY81YbJA",
  googleMapsUrl: "https://maps.app.goo.gl/pAApdhFc9P1gd5oY6",
  googlePlaceSearch: {
    // Used server-side as a Find Place fallback query if GOOGLE_PLACE_ID isn't set.
    query: "Dr Manu Gautam Noida",
    locationBias: "point:28.5812465,77.3327391",
  },
  // Manually-checked snapshot of the Google Business Profile totals, used only
  // as a fallback header when the live Places API isn't configured (the
  // featured review cards below it are a curated sample, not all 370).
  // Update this periodically to keep it roughly current.
  googleReviewsSnapshot: {
    rating: 5.0,
    totalReviews: 370,
  },
} as const;

export const mainNavLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Treatments", href: "/treatments" },
  { label: "Locations", href: "/locations" },
  { label: "Blog", href: "/blog" },
] as const;

export const footerLinks = {
  treatments: [
    { label: "Joint Replacement", href: "/orthopaedic-surgeon/delhi-ncr/joint-replacement/" },
    { label: "Robotic Knee Replacement", href: "/orthopaedic-surgeon/delhi-ncr/robotic-knee-replacement/" },
    { label: "Spine Care", href: "/orthopaedic-surgeon/delhi-ncr/spine-care/" },
    { label: "Sports Injuries", href: "/orthopaedic-surgeon/delhi-ncr/sports-injuries/" },
    { label: "Trauma Care", href: "/orthopaedic-surgeon/delhi-ncr/trauma-care/" },
    { label: "Rehabilitation", href: "/orthopaedic-surgeon/delhi-ncr/rehabilitation/" },
    { label: "Pediatric Orthopedics", href: "/orthopaedic-surgeon/delhi-ncr/pediatric-orthopedics/" },
  ],
  practice: [
    { label: "About Dr. Manu Gautam", href: "/about" },
    { label: "Locations", href: "/locations" },
    { label: "Patient Stories", href: "/testimonials" },
    { label: "Blog", href: "/blog" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Book an Appointment", href: "/appointment" },
    { label: "Insurance", href: "/insurance" },
    { label: "FAQs", href: "/faq" },
  ],
} as const;
