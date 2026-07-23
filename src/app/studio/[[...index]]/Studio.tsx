"use client";

import { NextStudio } from "next-sanity/studio";

import config from "@/sanity/studioConfig";

export default function Studio() {
  return <NextStudio config={config} />;
}
