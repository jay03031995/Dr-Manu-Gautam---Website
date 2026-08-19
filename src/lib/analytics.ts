declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function normalizeEmailForAnalytics(email: string) {
  return email.trim().toLowerCase();
}

export function normalizePhoneForAnalytics(phone: string) {
  const trimmedPhone = phone.trim();
  const digits = trimmedPhone.replace(/\D/g, "");

  if (trimmedPhone.startsWith("+") && digits) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;

  return trimmedPhone;
}

/** No-ops until a real analytics tag (GA4, etc.) is wired up. */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...params });
  }
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

/** Records an interaction with a lead CTA without inflating lead conversions. */
export function trackCtaClick(ctaName: string, location: string) {
  trackEvent("cta_click", {
    cta_name: ctaName,
    cta_location: location,
    page_path: window.location.pathname,
  });
}

/** Fires the configured Google Ads lead conversion after a genuine lead submission. */
export function trackGoogleAdsLeadConversion() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {
    send_to: "AW-16665276342/Qny7CMj6leIcELbfz4o-",
  });
}
