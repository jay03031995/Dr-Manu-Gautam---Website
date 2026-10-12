import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { PopupLeadForm } from "@/components/forms/PopupLeadForm";
import { AppointmentModalProvider } from "@/components/forms/AppointmentModalContext";
import { AppointmentModal } from "@/components/forms/AppointmentModal";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteSettings, getFeaturedServices, getLocations, getDoctorBySlug } from "@/sanity/lib/fetch";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";
import { buildSiteGraph } from "@/lib/schema";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, treatments, locations, doctor] = await Promise.all([
    getSiteSettings(),
    getFeaturedServices(),
    getLocations(),
    getDoctorBySlug("dr-manu-gautam"),
  ]);
  const logoUrl = hasImageAsset(settings?.logo)
    ? urlForImage(settings.logo).width(320).height(80).fit("max").url()
    : undefined;

  // Site-wide entity graph (Organization, Physician, Person, Clinic, Hospital,
  // WebSite, images). Pages add their own WebPage graph that links to these.
  const doctorPhoto = hasImageAsset(doctor?.photo)
    ? {
        url: urlForImage(doctor.photo).width(637).url(),
        ...imageDimensions(doctor.photo),
      }
    : undefined;
  const siteGraph = buildSiteGraph({
    doctor: doctor
      ? {
          name: doctor.name,
          credentials: doctor.credentials,
          specialties: doctor.specialties,
          education: doctor.education,
          memberships: doctor.memberships,
          photo: doctorPhoto,
        }
      : null,
    services: treatments.map((t) => ({ title: t.title, slug: t.slug.current })),
  });

  return (
    <AppointmentModalProvider>
      <JsonLd data={siteGraph} />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <AnnouncementBar />
      <SiteHeader logoUrl={logoUrl} treatments={treatments} locations={locations} />
      <main id="main-content" className="pb-20 md:pb-0">
        {children}
      </main>
      <SiteFooter logoUrl={logoUrl} />
      <FloatingActions />
      <MobileTabBar />
      <PopupLeadForm treatments={treatments} />
      <AppointmentModal services={treatments} locations={locations} />
    </AppointmentModalProvider>
  );
}

/** Reads width/height from a Sanity image asset id ("image-<hash>-637x694-webp"). */
function imageDimensions(image: unknown) {
  const assetRef = (image as { asset?: { _ref?: string } } | undefined)?.asset?._ref;
  const match = assetRef?.match(/-(\d+)x(\d+)-[a-z]+$/);
  return match ? { width: Number(match[1]), height: Number(match[2]) } : {};
}
