"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { LEADS_API_PATH } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { Service, Location } from "@/sanity/lib/types";

interface AppointmentFormProps {
  services: Pick<Service, "_id" | "title" | "slug">[];
  locations: Pick<Location, "_id" | "name" | "slug" | "city">[];
  source?: "appointment" | "popup";
  onSuccess?: () => void;
  className?: string;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  serviceSlug: string;
  locationSlug: string;
  consultationType: "in-clinic" | "online" | "";
  preferredDate: string;
  message: string;
  company: string; // honeypot
}

const INITIAL_STATE: FormState = {
  name: "",
  phone: "",
  email: "",
  serviceSlug: "",
  locationSlug: "",
  consultationType: "",
  preferredDate: "",
  message: "",
  company: "",
};

const STEPS = ["Patient Details", "Consultation Details", "Confirm"] as const;

function isValidPhone(phone: string) {
  return /^[+\d][\d\s-]{6,}$/.test(phone.trim());
}
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function AppointmentForm({ services, locations, source = "appointment", onSuccess, className }: AppointmentFormProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validateStep(current: number): boolean {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (current === 0) {
      if (data.name.trim().length < 2) nextErrors.name = "Please enter your full name.";
      if (!isValidPhone(data.phone)) nextErrors.phone = "Please enter a valid mobile number.";
      if (data.email && !isValidEmail(data.email)) nextErrors.email = "Please enter a valid email address.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    trackEvent("appointment_form_step", { step: step + 1, step_name: STEPS[step] });
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    if (data.company) {
      // Honeypot tripped — silently no-op as if it succeeded.
      setStatus("success");
      return;
    }
    if (!validateStep(0)) {
      setStep(0);
      return;
    }

    setStatus("submitting");
    setSubmitError(null);
    try {
      const res = await fetch(LEADS_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          phone: data.phone.trim(),
          email: data.email.trim() || undefined,
          message: data.message.trim() || undefined,
          serviceSlug: data.serviceSlug || undefined,
          locationSlug: data.locationSlug || undefined,
          consultationType: data.consultationType || undefined,
          preferredDate: data.preferredDate || undefined,
          company: data.company,
          source,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setSubmitError(json.error ?? "Something went wrong. Please try again or call us directly.");
        setStatus("error");
        return;
      }
      trackEvent("appointment_form_submit", { source });
      setStatus("success");
      onSuccess?.();
    } catch {
      setSubmitError("Something went wrong. Please try again or call us directly.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={`rounded-lg border border-medical-blue/30 bg-light-teal p-8 text-center ${className ?? ""}`}>
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-medical-blue" aria-hidden="true" />
        <p className="text-lg font-semibold text-dark-navy">Your appointment request has been received.</p>
        <p className="mt-1 text-sm text-dark-gray">
          Our team will call you shortly to confirm a time that works for you.
        </p>
      </div>
    );
  }

  const serviceOptions = services.map((s) => ({ label: s.title, value: s.slug.current }));
  const locationOptions = locations.map((l) => ({ label: `${l.name} — ${l.city}`, value: l.slug.current }));
  const selectedService = services.find((s) => s.slug.current === data.serviceSlug);
  const selectedLocation = locations.find((l) => l.slug.current === data.locationSlug);

  return (
    <div className={className}>
      {/* Progress indicator */}
      <ol className="mb-8 flex items-center gap-2 sm:gap-4">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  i < step
                    ? "bg-medical-blue text-white"
                    : i === step
                      ? "bg-dark-navy text-white"
                      : "bg-light-grey text-dark-gray"
                }`}
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : i + 1}
              </span>
              <span className={`hidden text-xs font-medium sm:block ${i === step ? "text-dark-navy" : "text-dark-gray"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <span className="h-0.5 flex-1 bg-light-grey" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      {/* Step 1: Patient Details */}
      {step === 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <TextInput
              label="Full Name"
              required
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              error={errors.name}
              autoComplete="name"
            />
          </div>
          <TextInput
            label="Mobile Number"
            type="tel"
            required
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            error={errors.phone}
            autoComplete="tel"
          />
          <TextInput
            label="Email Address"
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            error={errors.email}
            autoComplete="email"
            helperText="Optional — for appointment confirmation."
          />
          {/* Honeypot */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="af-company">Company</label>
            <input
              id="af-company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={data.company}
              onChange={(e) => update("company", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Step 2: Consultation Requirements */}
      {step === 1 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {serviceOptions.length > 0 && (
            <Select
              label="Treatment / Concern"
              options={serviceOptions}
              placeholder="Select a treatment (optional)"
              value={data.serviceSlug}
              onChange={(e) => update("serviceSlug", e.target.value)}
            />
          )}
          {locationOptions.length > 0 && (
            <Select
              label="Preferred Location"
              options={locationOptions}
              placeholder="Select a location (optional)"
              value={data.locationSlug}
              onChange={(e) => update("locationSlug", e.target.value)}
            />
          )}
          <Select
            label="Consultation Type"
            options={[
              { label: "In-Clinic Visit", value: "in-clinic" },
              { label: "Online Consultation", value: "online" },
            ]}
            placeholder="Select consultation type (optional)"
            value={data.consultationType}
            onChange={(e) => update("consultationType", e.target.value as FormState["consultationType"])}
          />
          <TextInput
            label="Preferred Date"
            type="date"
            value={data.preferredDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => update("preferredDate", e.target.value)}
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Tell us about your concern"
              rows={4}
              value={data.message}
              onChange={(e) => update("message", e.target.value)}
              helperText="Briefly describe your symptoms or what you'd like to discuss."
            />
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="rounded-lg border border-light-grey bg-off-white p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-dark-gray">Review Your Request</h3>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-dark-gray">Name</dt>
                <dd className="text-sm font-medium text-charcoal">{data.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-dark-gray">Mobile Number</dt>
                <dd className="text-sm font-medium text-charcoal">{data.phone}</dd>
              </div>
              {data.email && (
                <div>
                  <dt className="text-xs text-dark-gray">Email</dt>
                  <dd className="text-sm font-medium text-charcoal">{data.email}</dd>
                </div>
              )}
              {selectedService && (
                <div>
                  <dt className="text-xs text-dark-gray">Treatment / Concern</dt>
                  <dd className="text-sm font-medium text-charcoal">{selectedService.title}</dd>
                </div>
              )}
              {selectedLocation && (
                <div>
                  <dt className="text-xs text-dark-gray">Preferred Location</dt>
                  <dd className="text-sm font-medium text-charcoal">
                    {selectedLocation.name} — {selectedLocation.city}
                  </dd>
                </div>
              )}
              {data.consultationType && (
                <div>
                  <dt className="text-xs text-dark-gray">Consultation Type</dt>
                  <dd className="text-sm font-medium text-charcoal">
                    {data.consultationType === "online" ? "Online Consultation" : "In-Clinic Visit"}
                  </dd>
                </div>
              )}
              {data.preferredDate && (
                <div>
                  <dt className="text-xs text-dark-gray">Preferred Date</dt>
                  <dd className="text-sm font-medium text-charcoal">{data.preferredDate}</dd>
                </div>
              )}
              {data.message && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-dark-gray">Your Concern</dt>
                  <dd className="text-sm font-medium text-charcoal">{data.message}</dd>
                </div>
              )}
            </dl>
          </div>
          {submitError && (
            <p role="alert" className="text-sm text-error">
              {submitError}
            </p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {step > 0 ? (
          <Button type="button" variant="secondary" onClick={goBack} disabled={status === "submitting"}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>
        ) : (
          <span />
        )}

        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={goNext}>
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={status === "submitting"}>
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Submitting...
              </>
            ) : (
              "Confirm Appointment Request"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
