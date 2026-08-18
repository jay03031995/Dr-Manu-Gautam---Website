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
    return;
  }
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}
