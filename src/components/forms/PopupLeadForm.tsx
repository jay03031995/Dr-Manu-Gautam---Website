"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import { LEADS_API_PATH } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { markLeadSubmitted, hasSubmittedLead, hasPopupShownThisSession, markPopupShown } from "@/lib/leadStorage";
import type { Service } from "@/sanity/lib/types";

const SHOW_DELAY_MS = 10_000;

interface PopupLeadFormProps {
  treatments: Pick<Service, "_id" | "title" | "slug">[];
}

function isValidPhone(phone: string) {
  return /^[+\d][\d\s-]{6,}$/.test(phone.trim());
}

export function PopupLeadForm({ treatments }: PopupLeadFormProps) {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceSlug, setServiceSlug] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (hasSubmittedLead() || hasPopupShownThisSession()) return;
    const timer = setTimeout(() => {
      markPopupShown();
      setVisible(true);
      trackEvent("popup_lead_form_shown");
    }, SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function close() {
    setVisible(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (company) {
      setStatus("success");
      return;
    }

    const nextErrors: { name?: string; phone?: string } = {};
    if (name.trim().length < 2) nextErrors.name = "Please enter your full name.";
    if (!isValidPhone(phone)) nextErrors.phone = "Please enter a valid mobile number.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    setSubmitError(null);
    try {
      const res = await fetch(LEADS_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          serviceSlug: serviceSlug || undefined,
          company,
          source: "popup",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setSubmitError(json.error ?? "Something went wrong. Please try again or call us directly.");
        setStatus("error");
        return;
      }
      trackEvent("popup_lead_form_submit");
      markLeadSubmitted();
      setStatus("success");
    } catch {
      setSubmitError("Something went wrong. Please try again or call us directly.");
      setStatus("error");
    }
  }

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-end justify-center bg-charcoal/40 p-0 sm:items-center sm:p-4"
        onClick={close}
        role="presentation"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-lead-heading"
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-t-2xl border border-light-grey bg-white p-6 shadow-elevation-4 sm:rounded-2xl sm:p-8"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            {status !== "success" && (
              <div>
                <h2 id="popup-lead-heading" className="text-xl font-semibold text-dark-navy">
                  Consult an Orthopaedic Specialist
                </h2>
                <p className="mt-1.5 text-sm text-dark-gray">
                  Share your concern and the team will contact you to schedule a consultation with Dr. Manu Gautam.
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-dark-gray hover:bg-light-blue hover:text-dark-navy"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {status === "success" ? (
            <div className="py-2 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-medical-blue" aria-hidden="true" />
              <p className="text-lg font-semibold text-dark-navy">Thank you — we&rsquo;ve received your request.</p>
              <p className="mt-1 text-sm text-dark-gray">Our team will call you shortly to schedule your consultation.</p>
              <Button type="button" onClick={close} className="mt-5">
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <TextInput
                label="Full Name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                error={errors.name}
                autoComplete="name"
              />
              <TextInput
                label="Mobile Number"
                type="tel"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                error={errors.phone}
                autoComplete="tel"
              />
              {treatments.length > 0 && (
                <Select
                  label="Treatment / Concern"
                  options={treatments.map((t) => ({ label: t.title, value: t.slug.current }))}
                  placeholder="Select a treatment (optional)"
                  value={serviceSlug}
                  onChange={(e) => setServiceSlug(e.target.value)}
                />
              )}

              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="plf-company">Company</label>
                <input
                  id="plf-company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              {submitError && (
                <p role="alert" className="text-sm text-error">
                  {submitError}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={status === "submitting"}>
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  "Request a Callback"
                )}
              </Button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
