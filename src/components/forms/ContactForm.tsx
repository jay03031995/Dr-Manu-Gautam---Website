"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LEADS_API_PATH } from "@/lib/utils";

interface ContactFormProps {
  className?: string;
  source?: "contact" | "popup";
}

export function ContactForm({ className, source = "contact" }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    if (name.length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^[+\d][\d\s-]{6,}$/.test(phone)) {
      setError("Please enter a valid mobile number.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(LEADS_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: String(data.get("email") ?? "").trim() || undefined,
          message: String(data.get("message") ?? "").trim() || undefined,
          company: String(data.get("company") ?? ""),
          source,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Something went wrong. Please try again or call us directly.");
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setError("Something went wrong. Please try again or call us directly.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={`rounded-lg border border-medical-blue/30 bg-light-teal p-6 text-center ${className ?? ""}`}>
        <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-medical-blue" aria-hidden="true" />
        <p className="font-semibold text-dark-navy">Thank you — your message has been sent.</p>
        <p className="mt-1 text-sm text-dark-gray">Our team will contact you shortly to schedule your consultation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="cf-name" className="mb-1.5 block text-sm font-medium text-charcoal">
            Full Name <span className="text-error">*</span>
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="h-11 w-full rounded-md border border-light-grey px-3 text-sm text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue"
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className="mb-1.5 block text-sm font-medium text-charcoal">
            Mobile Number <span className="text-error">*</span>
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className="h-11 w-full rounded-md border border-light-grey px-3 text-sm text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue"
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-sm font-medium text-charcoal">
            Email Address
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            className="h-11 w-full rounded-md border border-light-grey px-3 text-sm text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-message" className="mb-1.5 block text-sm font-medium text-charcoal">
            Your Concern
          </label>
          <textarea
            id="cf-message"
            name="message"
            rows={4}
            className="w-full rounded-md border border-light-grey px-3 py-2 text-sm text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue"
          />
        </div>

        {/* Honeypot — hidden from real users, left blank by them. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="cf-company">Company</label>
          <input id="cf-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-error">
          {error}
        </p>
      )}

      <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
