import type { SchemaTypeDefinition } from "sanity";

import seo from "./objects/seo";
import blockContent from "./objects/blockContent";

import doctor from "./documents/doctor";
import service from "./documents/service";
import treatmentCategory from "./documents/treatmentCategory";
import condition from "./documents/condition";
import concern from "./documents/concern";
import video from "./documents/video";
import blogPost from "./documents/blogPost";
import blogCategory from "./documents/blogCategory";
import testimonial from "./documents/testimonial";
import location from "./documents/location";
import faq from "./documents/faq";
import teamMember from "./documents/teamMember";
import siteSettings from "./documents/siteSettings";
import appointmentRequest from "./documents/appointmentRequest";
import announcement from "./documents/announcement";
import page from "./documents/page";
import homePage from "./documents/homePage";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  seo,
  blockContent,
  // Documents
  doctor,
  service,
  treatmentCategory,
  condition,
  concern,
  video,
  blogPost,
  blogCategory,
  testimonial,
  location,
  faq,
  teamMember,
  siteSettings,
  homePage,
  appointmentRequest,
  announcement,
  page,
];
