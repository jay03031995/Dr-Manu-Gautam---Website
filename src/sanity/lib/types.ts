import type { PortableTextBlock } from "@portabletext/react";
import type { SanityImageSource as Image } from "@sanity/image-url";

export interface Slug {
  current: string;
}

export interface Seo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: Image;
  noIndex?: boolean;
}

export interface Concern {
  _id: string;
  label: string;
  description: string;
  icon?: string;
  image?: Image;
  href: string;
}


export interface HomePageFeature {
  icon?: string;
  title: string;
  description: string;
}

export interface HomePageStat {
  number: string;
  label: string;
  icon?: string;
}

export interface HomePage {
  heroBadge?: string;
  heroHeadingLine1?: string;
  heroHeadingLine2?: string;
  heroSubtext?: string;
  whyChooseHeading?: string;
  whyChooseDescription?: string;
  whyChooseImage?: Image;
  whyChooseFeatures?: HomePageFeature[];
  practiceStats?: HomePageStat[];
  finalCtaHeading?: string;
  finalCtaSubtext?: string;
  finalCtaImage?: Image;
}

export interface SiteSettings {
  siteName: string;
  tagline?: string;
  logo?: Image;
  phone?: string;
  email?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  heroVideoUrl?: string;
  heroPosterImage?: Image;
  googleAnalyticsId?: string;
}

export interface Announcement {
  _id: string;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface ReferenceLink {
  label?: string;
  url?: string;
}

export interface TreatmentType {
  title: string;
  description?: string;
  ctaLabel?: string;
  linkedService?: { title: string; slug: Slug };
  manualHref?: string;
}

export interface ConditionEntry {
  title: string;
  description?: string;
}

export interface RecoveryStage {
  stage?: string;
  title: string;
  description?: string;
}

export interface Service {
  _id: string;
  title: string;
  slug: Slug;
  icon?: string;
  shortDescription: string;
  introduction?: string;
  category?: { title: string; slug: Slug };
  heroImage?: Image;
  heroTrustPoints?: string[];
  body?: PortableTextBlock[];
  treatmentTypes?: TreatmentType[];
  conditionsTreated?: string[];
  conditionsGrid?: ConditionEntry[];
  symptoms?: string[];
  whenToConsult?: PortableTextBlock[];
  diagnosis?: PortableTextBlock[];
  nonSurgicalOptions?: PortableTextBlock[];
  whenSurgeryConsidered?: PortableTextBlock[];
  candidacy?: PortableTextBlock[];
  candidacyChecklist?: string[];
  surgicalProcedure?: PortableTextBlock[];
  technologyUsed?: PortableTextBlock[];
  benefits?: string[];
  risks?: string[];
  preparation?: PortableTextBlock[];
  recovery?: PortableTextBlock[];
  recoveryStages?: RecoveryStage[];
  rehabilitation?: PortableTextBlock[];
  urgentCare?: PortableTextBlock[];
  whyThisDoctor?: PortableTextBlock[];
  references?: ReferenceLink[];
  locations?: Location[];
  doctor?: Doctor;
  testimonials?: { author: string; role?: string; rating: number; quote: string }[];
  videos?: { title: string; slug: Slug; youtubeUrl: string; thumbnail?: Image; duration?: string }[];
  relatedTreatments?: { title: string; slug: Slug; shortDescription: string; icon?: string; heroImage?: Image }[];
  relatedConditions?: { title: string; slug: Slug; shortDescription: string }[];
  faqs?: { question: string; answer: string }[];
  medicalReviewer?: { name: string; credentials?: string };
  reviewDate?: string;
  seo?: Seo;
}

export interface Video {
  _id: string;
  title: string;
  slug: Slug;
  youtubeUrl: string;
  thumbnail?: Image;
  externalThumbnailUrl?: string;
  duration?: string;
  category?: string;
}

export interface Testimonial {
  _id: string;
  author: string;
  source?: "Google Review" | "Direct";
  relativeTime?: string;
  role?: string;
  photo?: Image;
  rating: number;
  quote: string;
}

export interface Location {
  _id: string;
  name: string;
  slug: Slug;
  city: string;
  addressLine?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  hours?: { days: string; time: string }[];
  coordinates?: { lat: number; lng: number };
  image?: Image;
}

export interface Doctor {
  _id: string;
  name: string;
  credentials?: string;
  photo?: Image;
  specialties?: string[];
  yearsExperience?: number;
  bio?: PortableTextBlock[];
  education?: string[];
  memberships?: string[];
  locations?: Location[];
  seo?: Seo;
}

export interface BlogPostSummary {
  _id: string;
  title: string;
  slug: Slug;
  excerpt: string;
  coverImage?: Image;
  publishedAt: string;
  updatedAt?: string;
  featured?: boolean;
  body?: PortableTextBlock[];
  author?: { name: string; type: string };
  categories?: { title: string; slug: Slug }[];
}

export interface BlogPost extends BlogPostSummary {
  body: PortableTextBlock[];
  author?: { name: string; type: string; photo?: Image; credentials?: string };
  medicalReviewer?: { name: string; credentials?: string };
  faqs?: { question: string; answer: string }[];
  references?: ReferenceLink[];
  relatedTreatments?: { title: string; slug: Slug; shortDescription: string; icon?: string; heroImage?: Image }[];
  seo?: Seo;
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  category: string;
}
