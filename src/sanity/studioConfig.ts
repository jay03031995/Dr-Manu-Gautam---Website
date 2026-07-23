import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "../../studio/schemaTypes";
import { structure } from "../../studio/structure";

export default defineConfig({
  name: "default",
  title: "Dr. Manu Gautam - Orthopedic Surgery",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
});
