import type { StructureResolver } from "sanity/structure";
import { AppointmentDashboard } from "./leadDashboardTool";

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
      S.listItem()
        .title("Appointment Dashboard")
        .id("appointmentDashboard")
        .child(S.component(AppointmentDashboard).title("Appointment Dashboard")),
      S.listItem()
        .title("All Appointment Requests")
        .id("appointmentRequests")
        .schemaType("appointmentRequest")
        .child(
          S.documentTypeList("appointmentRequest")
            .title("All Appointment Requests")
            .filter('_type == "appointmentRequest"')
            .defaultOrdering([{ field: "submittedAt", direction: "desc" }])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !["siteSettings", "homePage", "appointmentRequest"].includes(item.getId() ?? "")),
    ]);
