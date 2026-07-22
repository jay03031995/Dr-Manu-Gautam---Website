import type { StructureResolver } from "sanity/structure";

/** siteSettings and homePage are singletons; every other type lists normally. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Home Page")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !["siteSettings", "homePage"].includes(item.getId() ?? "")),
    ]);
