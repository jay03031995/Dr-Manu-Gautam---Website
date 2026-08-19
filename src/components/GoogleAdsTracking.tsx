"use client";

import Script from "next/script";
import { useEffect } from "react";

export const GOOGLE_ADS_ID = "AW-16665276342";

export const GOAL_REGISTRY = {
  leadForm: {
    sendTo: "AW-16665276342/Qny7CMj6leIcELbfz4o-",
    label: "Submit lead form (2)",
    value: 1,
    currency: "USD",
  },
  phoneClick: {
    sendTo: "AW-16665276342/<PASTE_LABEL_HERE>",
    label: "Phone call lead (click-to-call)",
    value: 1,
    currency: "USD",
  },
} as const;

export type GoalKey = keyof typeof GOAL_REGISTRY;

export function trackConversion(goal: GoalKey): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    if (typeof window.gtag !== "function") return resolve();

    const entry = GOAL_REGISTRY[goal];
    if (!entry) {
      console.warn(`[GoogleAdsTracking] Unknown goal "${goal}"`);
      return resolve();
    }
    if (entry.sendTo.includes("<PASTE_LABEL_HERE>")) {
      console.warn(`[GoogleAdsTracking] Goal "${goal}" has no send_to label yet - skipping.`);
      return resolve();
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    const timeout = setTimeout(finish, 1000);

    window.gtag("event", "conversion", {
      send_to: entry.sendTo,
      value: entry.value,
      currency: entry.currency,
      event_callback: () => {
        clearTimeout(timeout);
        finish();
      },
    });
  });
}

function installFormAutoTracking(): () => void {
  const firedForms = new WeakSet<HTMLFormElement>();

  const onSubmit = (event: Event) => {
    const form = event.target as HTMLFormElement | null;
    if (!form || form.tagName !== "FORM") return;
    if (form.dataset.gtagIgnore !== undefined) return;
    if (firedForms.has(form)) return;
    firedForms.add(form);

    const goalKey = (form.dataset.gtagConversion as GoalKey) || "leadForm";
    void trackConversion(goalKey);
  };

  document.addEventListener("submit", onSubmit, true);
  return () => document.removeEventListener("submit", onSubmit, true);
}

function installPhoneClickTracking(): () => void {
  const onClick = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const anchor = target.closest("a[href^='tel:']") as HTMLAnchorElement | null;
    if (!anchor) return;
    void trackConversion("phoneClick");
  };

  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}

function installRouteChangeTracking(): () => void {
  const emit = () => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("config", GOOGLE_ADS_ID, {
      page_path: window.location.pathname + window.location.search,
    });
  };

  const origPush = history.pushState;
  const origReplace = history.replaceState;
  history.pushState = function (...args) {
    const result = origPush.apply(this, args);
    emit();
    return result;
  };
  history.replaceState = function (...args) {
    const result = origReplace.apply(this, args);
    emit();
    return result;
  };
  window.addEventListener("popstate", emit);

  return () => {
    history.pushState = origPush;
    history.replaceState = origReplace;
    window.removeEventListener("popstate", emit);
  };
}

export default function GoogleAdsTracking() {
  useEffect(() => {
    const cleanups = [
      installFormAutoTracking(),
      installPhoneClickTracking(),
      installRouteChangeTracking(),
    ];
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
