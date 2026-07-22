import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { PopupLeadForm } from "@/components/forms/PopupLeadForm";
import { AppointmentModalProvider } from "@/components/forms/AppointmentModalContext";
import { AppointmentModal } from "@/components/forms/AppointmentModal";
import { getSiteSettings, getFeaturedServices, getLocations } from "@/sanity/lib/fetch";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, treatments, locations] = await Promise.all([
    getSiteSettings(),
    getFeaturedServices(),
    getLocations(),
  ]);
  const logoUrl = hasImageAsset(settings?.logo)
    ? urlForImage(settings.logo).width(320).height(80).fit("max").url()
    : undefined;

  return (
    <AppointmentModalProvider>
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
