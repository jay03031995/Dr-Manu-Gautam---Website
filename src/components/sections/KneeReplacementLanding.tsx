"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Clock3, MapPin, MessageCircle, ShieldCheck, Sparkles, Star, Stethoscope, Users, X } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BookAppointmentButton } from "@/components/forms/BookAppointmentButton";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGrid } from "@/components/motion/RevealGrid";
import { TextInput } from "@/components/ui/TextInput";
import { Textarea } from "@/components/ui/Textarea";
import { ServiceCard } from "@/components/ui/Card";
import { siteConfig } from "@/lib/constants";
import { LEADS_API_PATH, cn, telHref } from "@/lib/utils";
import { hasImageAsset, urlForImage } from "@/sanity/lib/image";
import { trackEvent } from "@/lib/analytics";
import { ServiceIcon } from "@/lib/serviceIcons";
import type { Doctor, Faq, Location } from "@/sanity/lib/types";

interface KneeReplacementLandingProps {
  doctor: Doctor | null;
  locations: Location[];
  faqs: Faq[];
}

interface FormState {
  name: string;
  phone: string;
  city: string;
  message: string;
  company: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  phone: "",
  city: "",
  message: "",
  company: "",
};

const experienceCards = [
  {
    title: "Knee pain while walking",
    description: "Persistent pain can make everyday movement feel exhausting, even on short walks or around the home.",
    icon: "HeartPulse",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Difficulty climbing stairs",
    description: "Pain and instability can make stairs feel difficult and increase your fear of falling.",
    icon: "Bone",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Morning stiffness",
    description: "Stiffness after rest can make getting moving feel slow and uncomfortable each day.",
    icon: "Activity",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Swelling and inflammation",
    description: "Joint swelling can limit comfort, movement, and your ability to stay active throughout the day.",
    icon: "Footprints",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
  },
];

const benefits = [
  { title: "Personalized treatment plans", description: "Every plan is tailored to your age, mobility, lifestyle, and surgical needs." },
  { title: "Advanced surgical techniques", description: "Precision-based orthopedic care designed for better joint function and comfort." },
  { title: "Robotic knee replacement", description: "Advanced robotics support can improve alignment and support faster recovery." },
  { title: "Faster recovery protocols", description: "Structured rehabilitation and post-op guidance to help you regain mobility sooner." },
  { title: "Comprehensive rehabilitation support", description: "From surgery planning to recovery, you receive coordinated care every step of the way." },
  { title: "Patient-first approach", description: "Clear communication, honest guidance, and compassionate support from consultation to recovery." },
];

const timeline = [
  "Consultation",
  "Diagnosis",
  "Treatment Planning",
  "Surgery",
  "Rehabilitation",
  "Recovery",
];

const testimonialReels = [
  { id: "DYUmAwtR5Tv", title: "Patient testimonial" },
  { id: "DScte2Dj8ui", title: "Patient testimonial" },
  { id: "DL5Ee_5TD9M", title: "Patient testimonial" },
  { id: "DBG453Rxjlp", title: "Patient testimonial" },
  { id: "C_x7mTeRBkp", title: "Patient testimonial" },
  { id: "C9FfYO2yB-t", title: "Patient testimonial" },
  { id: "DBbl06IxIxT", title: "Patient testimonial" },
];

const reviewSamples = [
  {
    name: "Ritu S.",
    location: "Noida",
    rating: 5,
    quote: "The care from consultation to rehabilitation was exceptional. I regained confidence walking again.",
  },
  {
    name: "Amit K.",
    location: "Delhi NCR",
    rating: 5,
    quote: "Dr. Gautam explained every step clearly and made the entire joint replacement journey comfortable.",
  },
  {
    name: "Neha M.",
    location: "Greater Noida",
    rating: 5,
    quote: "Professional, kind, and highly experienced. I would recommend him for knee care without hesitation.",
  },
  {
    name: "Vikram P.",
    location: "Noida",
    rating: 5,
    quote: "The recovery roadmap was realistic and supportive. I was back to daily walking much sooner than expected.",
  },
  {
    name: "Pooja D.",
    location: "Delhi",
    rating: 5,
    quote: "The surgical guidance and aftercare were outstanding. I felt informed and reassured throughout.",
  },
  {
    name: "Sanjay G.",
    location: "Noida",
    rating: 5,
    quote: "From the first consultation to the final follow-up, the experience was smooth and reassuring.",
  },
];

function isValidPhone(phone: string) {
  return /^[+\d][\d\s-]{6,}$/.test(phone.trim());
}

function Counter({ value, label }: { value: number; label: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame: number;
    const duration = 1200;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) {
        frame = window.requestAnimationFrame(step);
      }
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-sm">
      <p className="font-heading text-2xl font-bold text-white">{display}{value >= 1000 ? "+" : ""}</p>
      <p className="mt-1 text-sm text-white/80">{label}</p>
    </div>
  );
}

function LeadForm({ compact = false, buttonLabel = "Book Consultation", submitMode = "api" }: { compact?: boolean; buttonLabel?: string; submitMode?: "api" | "whatsapp" }) {
  const [data, setData] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!data.name.trim()) nextErrors.name = "Please enter your name.";
    if (!isValidPhone(data.phone)) nextErrors.phone = "Please enter a valid phone number.";
    if (!data.city.trim()) nextErrors.city = "Please share your city.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (submitMode === "whatsapp") {
      const whatsappPhone = siteConfig.phone.replace(/\D/g, "");
      const whatsappMessage = [
        `Name: ${data.name.trim()}`,
        `Phone: ${data.phone.trim()}`,
        `City: ${data.city.trim()}`,
        data.message.trim() ? `Message: ${data.message.trim()}` : undefined,
      ]
        .filter(Boolean)
        .join("\n");
      window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`, "_blank", "noopener,noreferrer");
      setStatus("success");
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
          city: data.city.trim(),
          message: data.message.trim() || undefined,
          company: data.company,
          source: "appointment",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setSubmitError(json.error ?? "Sorry, we could not submit your request. Please call us directly.");
        setStatus("error");
        return;
      }
      trackEvent("knee_landing_form_submit");
      setStatus("success");
    } catch {
      setSubmitError("Sorry, we could not submit your request. Please call us directly.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("rounded-2xl border border-medical-blue/20 bg-light-teal p-6 text-center", compact && "p-5")}> 
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-medical-blue" />
        <h3 className="text-xl font-semibold text-dark-navy">Thank you — we&apos;ll contact you soon.</h3>
        <p className="mt-2 text-sm text-dark-gray">One of our team members will call you about your knee consultation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("space-y-3", compact ? "space-y-2" : "space-y-4")}> 
      <TextInput label="Full Name" required value={data.name} onChange={(e) => update("name", e.target.value)} error={errors.name} />
      <TextInput label="Phone Number" type="tel" required value={data.phone} onChange={(e) => update("phone", e.target.value)} error={errors.phone} />
      <TextInput label="City" required value={data.city} onChange={(e) => update("city", e.target.value)} error={errors.city} />
      <Textarea label="Tell us about your knee pain" rows={3} value={data.message} onChange={(e) => update("message", e.target.value)} placeholder="Mention pain, stiffness, swelling, or walking difficulty." />
      <div className="hidden" aria-hidden="true">
        <label htmlFor="landing-company">Company</label>
        <input id="landing-company" value={data.company} onChange={(e) => update("company", e.target.value)} />
      </div>
      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      <Button type="submit" className="w-full" variant="primary" size={compact ? "regular" : "large"}>
        {buttonLabel}
      </Button>
    </form>
  );
}

export function KneeReplacementLanding({ doctor, faqs }: KneeReplacementLandingProps) {
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  useEffect(() => {
    if (hasAutoOpened) return;
    const handleScroll = () => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      if (maxScroll > 0 && window.scrollY >= maxScroll * 0.5) {
        setHasAutoOpened(true);
        setIsFloatingOpen(true);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasAutoOpened]);

  useEffect(() => {
    document.body.style.overflow = isFloatingOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFloatingOpen]);

  const doctorImage = useMemo(() => {
    if (doctor && hasImageAsset(doctor.photo)) {
      return { url: urlForImage(doctor.photo).width(900).height(1100).fit("crop").url(), alt: doctor.name };
    }
    return {
      url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=80&auto=format&fit=crop",
      alt: "Orthopedic surgeon consulting a patient",
    };
  }, [doctor]);

  const primaryPhone = siteConfig.phone;
  const whatsappUrl = `https://wa.me/${primaryPhone.replace(/\D/g, "")}`;
  const doctorCredentials = doctor?.credentials ?? "MBBS, MS (Orthopaedics)";
  const faqItems = useMemo(() => {
    const baseFaqs = [
      { question: "How long does knee replacement recovery take?", answer: "Most patients begin walking with support within a day or two after surgery and continue progressive rehabilitation over several weeks. Full functional recovery varies by patient and procedure." },
      { question: "Is robotic knee replacement better?", answer: "Robotic-assisted knee replacement can improve precision during surgery, support better implant alignment, and help many patients recover with more predictability." },
      { question: "When should I consider surgery?", answer: "Surgery is often considered when pain, stiffness, and loss of mobility persist despite medication, physiotherapy, and other conservative treatments." },
      { question: "What is the cost of knee replacement?", answer: "The total cost depends on the implant, hospital, and the complexity of the case. A consultation helps provide a realistic estimate and treatment plan." },
      { question: "Is the procedure painful?", answer: "Pain is well managed with modern anesthesia and post-operative care protocols. Most patients report pain reducing steadily in the days and weeks after surgery." },
      { question: "How long does the implant last?", answer: "Modern knee implants are designed to last many years, with durability depending on activity level, weight, and surgical technique." },
      { question: "Can elderly patients undergo surgery?", answer: "Many older patients are suitable candidates, especially when they have significant pain, reduced mobility, and are medically evaluated for surgery." },
      { question: "What are the risks and benefits?", answer: "Benefits include reduced pain and improved mobility. Risks are discussed in detail during consultation to help you make an informed decision." },
    ];

    if (faqs.length) {
      const mapped = faqs.map((item) => ({ question: item.question, answer: item.answer }));
      return mapped.slice(0, 8);
    }

    return baseFaqs;
  }, [faqs]);

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-light-grey bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="font-heading text-sm font-semibold text-medical-blue">Knee Replacement Specialist</p>
            <p className="text-sm text-dark-gray">Consult Dr. Manu Gautam</p>
          </div>
          <div className="flex flex-wrap items-start justify-end gap-2 sm:items-center">
            <Button href={telHref(primaryPhone)} variant="primary" size="small" className="bg-medical-blue hover:bg-medical-blue/90">
              Call Now
            </Button>
            <BookAppointmentButton size="small" variant="secondary">Book Appointment</BookAppointmentButton>
            <Button href={whatsappUrl} target="_blank" rel="noreferrer" variant="secondary" size="small">
              WhatsApp
            </Button>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-br from-slate-50 via-white to-light-blue">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
          <Reveal mode="onMount" className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-medical-blue/20 bg-medical-blue/10 px-3 py-1 text-sm font-medium text-medical-blue">
              <Sparkles className="h-4 w-4" />
              Advanced Knee Care for Pain-Free Movement
            </div>
            <h1 className="max-w-3xl text-balance text-[30px] leading-[1.08] sm:text-[40px] lg:text-[48px]">
              Walk Pain-Free Again with Advanced Knee Replacement Surgery
            </h1>
            <p className="mt-4 max-w-2xl text-base text-dark-gray sm:text-lg">
              Consult Dr. Manu Gautam for advanced robotic and minimally invasive knee replacement solutions that are designed to reduce pain, restore mobility, and improve quality of life.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <BookAppointmentButton size="large" className="bg-cta-orange hover:bg-cta-orange/90">
                Book Consultation
              </BookAppointmentButton>
              <Button href="#lead-form" variant="secondary" size="large">
                Request Callback
              </Button>
            </div>
            <div className="mt-8 grid gap-4 rounded-3xl border border-light-grey bg-white p-5 shadow-elevation-2 sm:grid-cols-3">
              <div>
                <p className="font-heading text-2xl font-bold text-dark-navy">15+ yrs</p>
                <p className="text-sm text-dark-gray">Experience</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-dark-navy">2,500+</p>
                <p className="text-sm text-dark-gray">Procedures</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-dark-navy">370+</p>
                <p className="text-sm text-dark-gray">Google Reviews</p>
              </div>
            </div>
          </Reveal>

          <Reveal mode="onMount" delay={0.08} className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-[32px] border border-light-grey bg-white p-3 shadow-elevation-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[24px]">
                <Image src={doctorImage.url} alt={doctorImage.alt} fill sizes="(min-width: 1024px) 480px, 90vw" className="object-cover" />
              </div>
            </div>
            <div className="rounded-[24px] border border-light-grey bg-white p-5 shadow-elevation-2">
              <div className="flex items-center gap-2 text-medical-blue">
                <ShieldCheck className="h-5 w-5" />
                <span className="font-semibold">Trusted by patients across Noida & Delhi NCR</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-dark-gray">
                <span className="rounded-full bg-light-blue px-3 py-1">{doctorCredentials}</span>
                <span className="rounded-full bg-light-blue px-3 py-1">Robotic Knee Replacement</span>
                <span className="rounded-full bg-light-blue px-3 py-1">Joint Replacement Care</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    <Section background="light">
        <Reveal className="mb-8 text-center">
          <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">Recovery Stories</p>
          <h2>Before & after recovery support</h2>
          <p className="mx-auto mt-3 max-w-2xl text-dark-gray">Patients often report improved walking, reduced pain, and greater independence after a structured joint replacement journey.</p>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-light-grey bg-white p-8 shadow-elevation-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-full bg-medical-blue/10 p-3 text-medical-blue">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark-navy">Recovery milestones</h3>
                <p className="text-sm text-dark-gray">Focused on safe movement, reducing stiffness, and rebuilding confidence.</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                "Walking with support early after surgery",
                "Gradual return to stairs and daily movement",
                "Physical therapy and joint-strengthening guidance",
                "Long-term care for pain-free routine mobility",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-light-blue px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 text-medical-blue" />
                  <span className="text-sm text-dark-gray">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-light-grey bg-dark-navy p-8 text-white shadow-elevation-2">
            <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-medical-blue">Outcome Metrics</p>
            <h3 className="mt-3 text-2xl font-semibold">Improved mobility and confidence after focused treatment</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Counter value={2500} label="Successful Procedures" />
              <Counter value={98} label="Happy Patients" />
              <Counter value={15} label="Years Experience" />
              <Counter value={370} label="Positive Reviews" />
            </div>
          </div>
        </div>
    </Section>

    <Section background="white">
        <Reveal className="mb-8 text-center">
          <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">Real Patient Experiences</p>
          <h2>Premium video testimonials from patients who chose knee care</h2>
          <p className="mx-auto mt-3 max-w-2xl text-dark-gray">Hear directly from patients who regained comfort, mobility, and confidence through expert orthopedic treatment.</p>
        </Reveal>
        <div className="flex gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-3">
          {testimonialReels.map((reel) => (
            <div key={reel.id} className="min-w-[85vw] snap-center overflow-hidden rounded-3xl border border-light-grey bg-white p-3 shadow-elevation-1 md:min-w-0">
              <iframe
                src={`https://www.instagram.com/reel/${reel.id}/embed`}
                title={reel.title}
                loading="lazy"
                className="h-[420px] w-full rounded-[20px] border-0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            </div>
          ))}
        </div>
    </Section>

      <Section background="light">
        <Reveal className="mb-8 text-center">
          <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">Follow Dr. Manu Gautam</p>
          <h2>Instagram reels and updates from the practice</h2>
        </Reveal>
        <div className="rounded-[32px] border border-light-grey bg-white p-4 shadow-elevation-2 sm:p-6">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-semibold text-dark-navy">@maanuugautam</h3>
              <p className="text-sm text-dark-gray">Patient education, treatment insights, and recovery guidance.</p>
            </div>
            <Button href={siteConfig.social.instagram} target="_blank" rel="noreferrer" variant="secondary">
              Follow on Instagram
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-3">
            {testimonialReels.slice(0, 3).map((reel) => (
              <div key={`profile-${reel.id}`} className="min-w-[80vw] snap-center overflow-hidden rounded-3xl border border-light-grey bg-light-blue p-3 md:min-w-0">
                <iframe
                  src={`https://www.instagram.com/reel/${reel.id}/embed`}
                  title={`Instagram reel ${reel.id}`}
                  loading="lazy"
                  className="h-[320px] w-full rounded-[20px] border-0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              </div>
            ))}
          </div>
        </div>
      </Section>


      <Section background="light">
        <Reveal className="mb-10 text-center">
          <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">Start Here</p>
          <h2 className="mb-3">What Are You Experiencing?</h2>
          <p className="mx-auto max-w-xl text-dark-gray leading-relaxed">
            You don&rsquo;t need the medical term for it — tell us what you&rsquo;re feeling and we&rsquo;ll point you to the right care.
          </p>
        </Reveal>
        <RevealGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {experienceCards.map((card) => (
            <ServiceCard
              key={card.title}
              icon={<ServiceIcon name={card.icon} className="h-6 w-6" />}
              title={card.title}
              description={card.description}
              href="#lead-form"
              imageUrl={card.imageUrl}
              showExplore={false}
            />
          ))}
        </RevealGrid>
      </Section>


      <Section background="light">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal className="rounded-[32px] border border-light-grey bg-white p-6 shadow-elevation-2 sm:p-8">
            <p className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">Doctor Profile</p>
            <h2>Specialist in joint replacement, robotic knee care, and rehabilitation</h2>
            <p className="mt-4 text-dark-gray">Dr. Manu Gautam brings extensive experience in orthopaedics, surgical planning, and compassionate recovery-oriented care.</p>
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 rounded-2xl border border-light-grey bg-light-blue p-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-medical-blue" />
                <div>
                  <h3 className="text-base font-semibold text-dark-navy">Clinical Focus</h3>
                  <p className="text-sm text-dark-gray">Knee replacement surgery, joint replacement care, robotic knee replacement, and post-op rehabilitation.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-light-grey bg-light-blue p-4">
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-medical-blue" />
                <div>
                  <h3 className="text-base font-semibold text-dark-navy">Experience</h3>
                  <p className="text-sm text-dark-gray">Over {doctor?.yearsExperience ?? 15} years of orthopedic experience across Noida and Delhi NCR.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-light-grey bg-light-blue p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-medical-blue" />
                <div>
                  <h3 className="text-base font-semibold text-dark-navy">Qualifications</h3>
                  <p className="text-sm text-dark-gray">{doctorCredentials}</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.04} className="rounded-[32px] border border-light-grey bg-white p-4 shadow-elevation-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px]">
              <Image src={doctorImage.url} alt={doctorImage.alt} fill sizes="(min-width: 1024px) 520px, 90vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </Section>



      <section className="bg-dark-navy py-8 text-white md:py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="mb-3 font-heading text-sm font-semibold uppercase tracking-[0.2em] text-medical-blue">Still Living with Knee Pain?</p>
            <h2 className="max-w-2xl text-[28px] leading-tight sm:text-[34px] lg:text-[40px]">
              Speak with Dr. Manu Gautam today and understand your treatment options.
            </h2>
            <p className="mt-4 max-w-xl text-white/80">A consultation can help clarify whether your symptoms point to arthritis, joint degeneration, or the need for joint replacement care.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={telHref(primaryPhone)} variant="primary" size="large" className="bg-cta-orange hover:bg-cta-orange/90">
                Call Now
              </Button>
              <Button href={whatsappUrl} target="_blank" rel="noreferrer" variant="secondary" size="large" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                WhatsApp Consultation
              </Button>
            </div>
          </div>
          <div id="lead-form" className="rounded-[28px] border border-white/10 bg-white/10 p-5 shadow-elevation-3 backdrop-blur-sm">
            <LeadForm compact buttonLabel="Request Callback" />
          </div>
        </div>
      </section>

      <Section background="light">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">Why Patients Choose Dr. Manu Gautam</p>
            <h2>Premium orthopedic care built around comfort, clarity, and recovery</h2>
            <p className="mt-4 text-dark-gray">From diagnosis to post-op rehabilitation, the focus remains on reducing pain, restoring confidence, and supporting a smooth recovery.</p>
            <div className="mt-6 space-y-3">
              {benefits.slice(0, 3).map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-light-grey bg-white p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-medical-blue" />
                  <div>
                    <h3 className="text-base font-semibold text-dark-navy">{item.title}</h3>
                    <p className="text-sm text-dark-gray">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.04} className="grid gap-4 md:grid-cols-2">
            {benefits.slice(3).map((item) => (
              <div key={item.title} className="rounded-2xl border border-light-grey bg-white p-5 shadow-elevation-1">
                <div className="mb-3 inline-flex rounded-full bg-light-blue p-2 text-medical-blue">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-semibold text-dark-navy">{item.title}</h3>
                <p className="mt-2 text-sm text-dark-gray">{item.description}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </Section>

      <Section background="white">
        <Reveal className="mb-8 text-center">
          <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">Treatment Journey</p>
          <h2>Your path from pain to recovery</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {timeline.map((step, index) => (
            <div key={step} className="rounded-2xl border border-light-grey bg-light-blue p-5 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-medical-blue text-sm font-semibold text-white">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold text-dark-navy">{step}</h3>
            </div>
          ))}
        </div>
      </Section>

      <Section background="white">
        <Reveal className="mb-8 text-center">
          <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">Patient Reviews</p>
          <h2>A premium Google review wall built for trust and conversion</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reviewSamples.map((review, index) => (
            <div key={review.name} className={cn("rounded-3xl border border-light-grey bg-white p-5 shadow-elevation-1", index % 2 === 1 ? "md:translate-y-4" : "") }>
              <div className="mb-3 flex items-center gap-1 text-cta-orange">
                {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm text-dark-gray">“{review.quote}”</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-dark-navy">{review.name}</p>
                  <p className="text-sm text-dark-gray">{review.location}</p>
                </div>
                <div className="rounded-full bg-light-blue px-3 py-1 text-xs font-semibold text-medical-blue">Verified</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section background="white">
        <Reveal className="mb-8 text-center">
          <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">Frequently Asked Questions</p>
          <h2>Clear answers for patients exploring knee replacement</h2>
        </Reveal>
        <div className="mx-auto max-w-4xl rounded-[28px] border border-light-grey bg-white p-4 shadow-elevation-1 sm:p-6">
          <div className="space-y-3">
            {faqItems.map((item) => (
              <details key={item.question} className="rounded-2xl border border-light-grey bg-light-blue px-4 py-3">
                <summary className="cursor-pointer list-none font-semibold text-dark-navy">{item.question}</summary>
                <p className="mt-3 text-sm text-dark-gray">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      <button
        type="button"
        onClick={() => setIsFloatingOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-medical-blue px-4 py-3 text-sm font-semibold text-white shadow-elevation-3 transition hover:bg-medical-blue/90 sm:bottom-6 sm:right-6"
      >
        <MessageCircle className="h-5 w-5" />
        Book a Call
      </button>

      {isFloatingOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-charcoal/60 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="floating-lead-title"
          onClick={() => setIsFloatingOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-t-3xl border border-light-grey bg-white p-5 shadow-elevation-4 sm:rounded-3xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p id="floating-lead-title" className="font-heading text-lg font-semibold text-dark-navy">
                  Speak with Dr. Manu Gautam
                </p>
                <p className="mt-1 text-sm text-dark-gray">
                  Share your details and we’ll connect you on WhatsApp with your knee consultation request.
                </p>
              </div>
              <button type="button" onClick={() => setIsFloatingOpen(false)} className="rounded-full p-2 text-dark-gray hover:bg-light-blue hover:text-dark-navy" aria-label="Close lead form">
                <X className="h-5 w-5" />
              </button>
            </div>
            <LeadForm compact submitMode="whatsapp" buttonLabel="Send to WhatsApp" />
          </div>
        </div>
      )}

    </>
  );
}
