import { groq } from "next-sanity";

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  siteName,
  tagline,
  logo,
  phone,
  email,
  social,
  "heroVideoUrl": heroVideo.asset->url,
  heroPosterImage,
  googleAnalyticsId
}`;

export const homePageQuery = groq`*[_type == "homePage"][0]{
  heroBadge,
  heroHeadingLine1,
  heroHeadingLine2,
  heroSubtext,
  whyChooseHeading,
  whyChooseDescription,
  whyChooseImage,
  whyChooseFeatures[]{ icon, title, description },
  practiceStats[]{ number, label, icon },
  finalCtaHeading,
  finalCtaSubtext,
  finalCtaImage
}`;

export const activeAnnouncementQuery = groq`*[_type == "announcement" && active == true
  && (!defined(startDate) || startDate <= now())
  && (!defined(endDate) || endDate >= now())
][0]{
  _id,
  message,
  ctaLabel,
  ctaHref
}`;

export const featuredServicesQuery = groq`*[_type == "service"] | order(order asc){
  _id,
  title,
  slug,
  icon,
  shortDescription,
  heroImage,
  conditionsTreated
}`;

export const serviceBySlugQuery = groq`*[_type == "service" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  icon,
  shortDescription,
  introduction,
  "category": category->{title, slug},
  heroImage,
  heroTrustPoints,
  body,
  "treatmentTypes": treatmentTypes[]{
    title,
    description,
    ctaLabel,
    "linkedService": linkedService->{title, slug},
    manualHref
  },
  conditionsTreated,
  conditionsGrid,
  symptoms,
  whenToConsult,
  diagnosis,
  nonSurgicalOptions,
  whenSurgeryConsidered,
  candidacy,
  candidacyChecklist,
  surgicalProcedure,
  technologyUsed,
  benefits,
  risks,
  preparation,
  recovery,
  recoveryStages,
  rehabilitation,
  urgentCare,
  whyThisDoctor,
  references,
  "locations": locations[]->{_id, name, slug, city, addressLine, postalCode, phone, email, hours, coordinates, image},
  "doctor": doctor->{_id, name, slug, credentials, photo, specialties, yearsExperience, education, memberships},
  "testimonials": testimonials[]->{author, role, rating, quote},
  "videos": videos[]->{title, slug, youtubeUrl, thumbnail, duration},
  "relatedTreatments": relatedTreatments[]->{title, slug, shortDescription, icon},
  "relatedConditions": relatedConditions[]->{title, slug, shortDescription},
  "faqs": faqs[]->{question, answer},
  "medicalReviewer": medicalReviewer->{name, credentials},
  reviewDate,
  seo
}`;

export const concernsQuery = groq`*[_type == "concern"] | order(order asc){
  _id,
  label,
  description,
  icon,
  image,
  "href": select(
    defined(linkedTreatment) => "/orthopaedic-surgeon/delhi-ncr/" + linkedTreatment->slug.current + "/",
    defined(manualHref) => manualHref,
    "/treatments"
  )
}`;

export const featuredTestimonialsQuery = groq`*[_type == "testimonial" && featured == true] | order(order asc){
  _id,
  author,
  source,
  relativeTime,
  role,
  photo,
  rating,
  quote
}`;

export const videosQuery = groq`*[_type == "video"] | order(order asc){
  _id,
  title,
  slug,
  youtubeUrl,
  thumbnail,
  externalThumbnailUrl,
  duration,
  category
}`;

export const locationsQuery = groq`*[_type == "location"] | order(city asc){
  _id,
  name,
  slug,
  city,
  addressLine,
  postalCode,
  phone,
  email,
  hours,
  coordinates,
  image
}`;

export const locationBySlugQuery = groq`*[_type == "location" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  city,
  addressLine,
  postalCode,
  phone,
  email,
  hours,
  coordinates,
  image
}`;

export const doctorBySlugQuery = groq`*[_type == "doctor" && slug.current == $slug][0]{
  _id,
  name,
  credentials,
  photo,
  specialties,
  yearsExperience,
  bio,
  education,
  memberships,
  "locations": locations[]->{name, city, slug},
  seo
}`;

export const blogPostsQuery = groq`*[_type == "blogPost"] | order(publishedAt desc){
  _id,
  title,
  slug,
  excerpt,
  coverImage,
  publishedAt,
  updatedAt,
  featured,
  body,
  "author": author->{name, "type": _type},
  "categories": categories[]->{title, slug}
}`;

export const blogPostBySlugQuery = groq`*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  excerpt,
  coverImage,
  body,
  publishedAt,
  updatedAt,
  "author": author->{name, "type": _type, photo, credentials},
  "medicalReviewer": medicalReviewer->{name, credentials},
  "categories": categories[]->{title, slug},
  "faqs": faqs[]->{question, answer},
  references,
  "relatedTreatments": relatedTreatments[]->{title, slug, shortDescription, icon},
  seo
}`;

export const faqsQuery = groq`*[_type == "faq"] | order(category asc){
  _id,
  question,
  answer,
  category
}`;
