const SUBMITTED_KEY = "dmg_lead_submitted";
const POPUP_SHOWN_KEY = "dmg_popup_shown_session";

/** Call after any lead form (contact, appointment, popup) submits successfully. */
export function markLeadSubmitted() {
  try {
    localStorage.setItem(SUBMITTED_KEY, "1");
  } catch {
    // Storage unavailable (private browsing, disabled) — fail silently.
  }
}

export function hasSubmittedLead() {
  try {
    return localStorage.getItem(SUBMITTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markPopupShown() {
  try {
    sessionStorage.setItem(POPUP_SHOWN_KEY, "1");
  } catch {
    // ignore
  }
}

export function hasPopupShownThisSession() {
  try {
    return sessionStorage.getItem(POPUP_SHOWN_KEY) === "1";
  } catch {
    return false;
  }
}
