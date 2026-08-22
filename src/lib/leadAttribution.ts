export interface LeadAttribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  landingPage?: string;
  referrer?: string;
}

const STORAGE_KEY = "dmg_first_touch_attribution";

function clean(value: string | null) {
  return value?.trim().slice(0, 240) || undefined;
}

function safePath(value: string) {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return undefined;
  }
}

/** Captures first-touch campaign data and reuses it through the visitor's session. */
export function getLeadAttribution(): LeadAttribution {
  if (typeof window === "undefined") return {};

  let stored: LeadAttribution = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}") as LeadAttribution;
  } catch {
    stored = {};
  }

  const params = new URLSearchParams(window.location.search);
  const currentCandidates: LeadAttribution = {
    utmSource: clean(params.get("utm_source")),
    utmMedium: clean(params.get("utm_medium")),
    utmCampaign: clean(params.get("utm_campaign")),
    utmTerm: clean(params.get("utm_term")),
    utmContent: clean(params.get("utm_content")),
    gclid: clean(params.get("gclid")),
  };
  const current = Object.fromEntries(
    Object.entries(currentCandidates).filter(([, value]) => Boolean(value)),
  ) as LeadAttribution;
  const hasStoredCampaign = Object.values(stored).some(Boolean);
  const attribution = hasStoredCampaign ? stored : current;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution is helpful, but it must never prevent a lead submission.
  }

  return {
    ...attribution,
    landingPage: window.location.pathname.slice(0, 500),
    referrer: document.referrer ? safePath(document.referrer) : undefined,
  };
}
