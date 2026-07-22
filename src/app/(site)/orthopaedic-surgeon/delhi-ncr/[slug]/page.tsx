import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  AlertTriangle,
  Phone,
  MapPin,
  ArrowRight,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BookAppointmentButton } from "@/components/forms/BookAppointmentButton";
import { Badge } from "@/components/ui/Badge";
import { ServiceCard, TestimonialCard } from "@/components/ui/Card";
import { LocationCard } from "@/components/sections/LocationCard";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGrid } from "@/components/motion/RevealGrid";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceIcon } from "@/lib/serviceIcons";
import { getServiceBySlug } from "@/sanity/lib/fetch";
import { client } from "@/sanity/lib/client";
import { urlForImage, hasImageAsset } from "@/sanity/lib/image";
import {
  buildPageMetadata,
  buildFaqSchema,
  buildBreadcrumbSchema,
  buildPhysicianSchema,
  buildMedicalProcedureSchema,
  buildMedicalClinicSchema,
  buildWebPageSchema,
} from "@/lib/seo";
import { siteConfig } from "@/lib/constants";
import { telHref, treatmentPath, locationPath, DOCTOR_PROFILE_PATH } from "@/lib/utils";
import type { PortableTextBlock } from "@portabletext/react";
import type { TreatmentType, ConditionEntry, RecoveryStage } from "@/sanity/lib/types";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(`*[_type == "service" && defined(slug.current)].slug.current`);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return {};

  return buildPageMetadata({
    title: service.seo?.metaTitle || service.title,
    description: service.seo?.metaDescription || service.shortDescription,
    path: treatmentPath(params.slug),
  });
}

function ContentSection({ title, content }: { title?: string; content?: PortableTextBlock[] }) {
  if (!content?.length) return null;
  return (
    <div>
      {title ? <h2 className="mb-4">{title}</h2> : null}
      <PortableTextRenderer value={content} />
    </div>
  );
}

function BulletList({ title, items, icon }: { title: string; items?: string[]; icon?: React.ReactNode }) {
  if (!items?.length) return null;
  return (
    <div>
      <h2 className="mb-4">{title}</h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-charcoal">
            {icon ?? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-medical-blue" aria-hidden="true" />}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Numbered step used by both the consultation process and the patient care journey. */
function NumberedStep({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dark-navy text-sm font-bold text-white">
        {number}
      </span>
      <div>
        <h3 className="mb-1 text-base font-semibold text-dark-navy">{title}</h3>
        <p className="text-sm text-dark-gray leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function TreatmentTypeCards({ title, types }: { title: string; types?: TreatmentType[] }) {
  if (!types?.length) return null;
  return (
    <Section background="light">
      <Reveal className="mb-10 text-center">
        <h2>Types of {title}</h2>
      </Reveal>
      <RevealGrid className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {types.map((t) => {
          const href = t.linkedService ? treatmentPath(t.linkedService.slug.current) : t.manualHref;
          return (
            <div key={t.title} className="card-base card-shadow flex flex-col p-6">
              <h3 className="mb-2 text-lg font-semibold text-dark-navy">{t.title}</h3>
              {t.description && <p className="mb-4 flex-1 text-sm text-dark-gray leading-relaxed">{t.description}</p>}
              {href && t.ctaLabel && (
                <Link
                  href={href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-medical-blue hover:underline"
                >
                  {t.ctaLabel}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>
          );
        })}
      </RevealGrid>
    </Section>
  );
}

function ConditionsGrid({ title, conditions }: { title: string; conditions?: ConditionEntry[] }) {
  if (!conditions?.length) return null;
  return (
    <Section background="white">
      <Reveal className="mb-10 text-center">
        <h2>Conditions That May Require {title}</h2>
      </Reveal>
      <RevealGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {conditions.map((c) => (
          <div key={c.title} className="card-base p-6">
            <h3 className="mb-2 text-base font-semibold text-dark-navy">{c.title}</h3>
            {c.description && <p className="text-sm text-dark-gray leading-relaxed">{c.description}</p>}
          </div>
        ))}
      </RevealGrid>
      <Reveal delay={0.1} className="mx-auto mt-8 max-w-3xl rounded-lg border border-light-grey bg-light-blue p-5 text-center text-sm text-dark-gray">
        Having one of these conditions does not automatically mean that surgery is required. Treatment
        recommendations depend on symptoms, examination findings, imaging and overall health.
      </Reveal>
    </Section>
  );
}

function CandidacyBox({ title, candidacy, checklist }: { title: string; candidacy?: PortableTextBlock[]; checklist?: string[] }) {
  if (!candidacy?.length && !checklist?.length) return null;
  return (
    <div>
      <h2 className="mb-4">Who May Be a Candidate for {title}?</h2>
      {candidacy?.length ? <PortableTextRenderer value={candidacy} /> : null}
      {checklist?.length ? (
        <div className="mt-6 rounded-lg border border-medical-blue/20 bg-light-teal p-6">
          <p className="mb-3 font-semibold text-dark-navy">You may be evaluated for {title.toLowerCase()} when:</p>
          <ul className="space-y-2">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-charcoal">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-medical-blue" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <p className="mt-4 text-sm text-dark-gray leading-relaxed">
        The final decision is made after a detailed consultation, physical examination and review of the required
        investigations.
      </p>
    </div>
  );
}

function BenefitsGrid({ benefits }: { benefits?: string[] }) {
  if (!benefits?.length) return null;
  return (
    <div>
      <h2 className="mb-4">Potential Benefits</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {benefits.map((b) => (
          <div key={b} className="flex items-start gap-3 rounded-lg border border-light-grey p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dark-navy text-white">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="text-sm text-charcoal leading-relaxed">{b}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-dark-gray leading-relaxed">
        Treatment outcomes vary according to the condition of the joint, overall health, surgical findings,
        physiotherapy participation and individual recovery.
      </p>
    </div>
  );
}

function RecoveryTimeline({ stages, narrative }: { stages?: RecoveryStage[]; narrative?: PortableTextBlock[] }) {
  if (!stages?.length) return <ContentSection title="Recovery Timeline" content={narrative} />;
  return (
    <div>
      <h2 className="mb-6">Recovery Timeline</h2>
      <div className="space-y-6 border-l-2 border-light-grey pl-6">
        {stages.map((s, i) => (
          <div key={`${s.stage}-${s.title}`} className="relative">
            <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-medical-blue text-[11px] font-bold text-white">
              {i + 1}
            </span>
            {s.stage && (
              <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-medical-blue">{s.stage}</p>
            )}
            <h3 className="mb-1 text-base font-semibold text-dark-navy">{s.title}</h3>
            {s.description && <p className="text-sm text-dark-gray leading-relaxed">{s.description}</p>}
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-dark-gray leading-relaxed">
        Recovery timelines vary depending on the treated joint, surgical procedure, age, medical condition, muscle
        strength and participation in rehabilitation.
      </p>
    </div>
  );
}

const careJourneySteps = [
  { title: "Appointment Booking", description: "Schedule a consultation online or by phone at a time that works for you." },
  { title: "Orthopedic Consultation", description: "Discuss your symptoms, medical history and previous treatments with your surgeon." },
  { title: "Examination and Imaging", description: "A physical examination and, where required, diagnostic imaging help assess the joint." },
  { title: "Discussion of Treatment Options", description: "Non-surgical and surgical options are explained so you can make an informed decision." },
  { title: "Preoperative Preparation", description: "If surgery is planned, required tests and preparation guidance are provided in advance." },
  { title: "Surgery, When Recommended", description: "The procedure is carried out according to your personalised treatment plan." },
  { title: "Physiotherapy and Rehabilitation", description: "Structured rehabilitation supports safe, gradual recovery of movement and strength." },
  { title: "Follow-Up and Mobility Guidance", description: "Ongoing follow-up tracks your progress and guides return to daily activities." },
];

const consultationApproachPoints = [
  "Detailed clinical evaluation",
  "Clear explanation of treatment options",
  "Individualised surgical planning",
  "Focus on functional recovery",
  "Guidance from diagnosis through rehabilitation",
];

export default async function ServiceDetailPage({ params }: PageProps) {
  const service = await getServiceBySlug(params.slug);
  if (!service) notFound();

  const doctorName = service.doctor?.name ?? siteConfig.shortName;
  const pageUrl = `${siteConfig.url}${treatmentPath(params.slug)}`;
  const whatsappNumber = siteConfig.phone.replace(/[^\d]/g, "");

  const faqSchema = service.faqs?.length ? buildFaqSchema(service.faqs) : null;
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Treatments", url: "/treatments" },
    { name: service.title, url: treatmentPath(params.slug) },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);
  const webPageSchema = buildWebPageSchema({
    name: service.seo?.metaTitle || service.title,
    description: service.seo?.metaDescription || service.shortDescription,
    url: pageUrl,
  });
  // bodyLocation should list anatomical sites, not conditions — derive from the
  // treatment-type titles (e.g. "Knee Replacement Surgery" -> "Knee") when present.
  const bodyLocations = service.treatmentTypes?.length
    ? service.treatmentTypes.map((t) => t.title.split(" ")[0])
    : undefined;
  const procedureSchema = buildMedicalProcedureSchema({
    name: service.title,
    description: service.shortDescription,
    url: pageUrl,
    bodyLocation: bodyLocations,
  });
  const physicianSchema = service.doctor
    ? buildPhysicianSchema(service.doctor.name, hasImageAsset(service.doctor.photo) ? urlForImage(service.doctor.photo).url() : undefined)
    : null;
  // Don't publish obviously-placeholder phone numbers (e.g. "+91-XXXXXXXXXX") in
  // public structured data.
  const isRealPhone = (phone?: string) => !!phone && !/x/i.test(phone);
  const clinicSchemas = (service.locations ?? []).map((loc) =>
    buildMedicalClinicSchema({
      name: loc.name,
      url: pageUrl,
      telephone: isRealPhone(loc.phone) ? loc.phone : undefined,
      streetAddress: loc.addressLine,
      addressLocality: loc.city,
      postalCode: loc.postalCode,
      openingHours: loc.hours,
    })
  );

  const schemas = [
    breadcrumbSchema,
    webPageSchema,
    procedureSchema,
    ...(physicianSchema ? [physicianSchema] : []),
    ...clinicSchemas,
    ...(faqSchema ? [faqSchema] : []),
  ];

  return (
    <>
      <JsonLd data={schemas} />

      {/* Breadcrumbs */}
      <Container className="pt-6">
        <nav aria-label="Breadcrumb" className="overflow-x-auto">
          <ol className="flex items-center gap-2 whitespace-nowrap text-sm text-dark-gray">
            {breadcrumbItems.map((item, i) => (
              <li key={item.url} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i === breadcrumbItems.length - 1 ? (
                  <span className="text-charcoal">{item.name}</span>
                ) : (
                  <Link href={item.url} className="hover:text-medical-blue">
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </Container>

      {/* Hero + intro */}
      <Section background="white" className="pt-6 md:pt-8">
        <Reveal mode="onMount" className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            {service.category && (
              <Badge variant="service" className="mb-4">
                {service.category.title}
              </Badge>
            )}
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-medical-blue text-white">
              <ServiceIcon name={service.icon} className="h-7 w-7" />
            </span>
            <h1 className="mb-4">{service.title}</h1>
            <p className="mb-6 text-lg text-dark-gray leading-relaxed">
              {service.introduction || service.shortDescription}
            </p>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <BookAppointmentButton size="large">
                Book a Consultation
              </BookAppointmentButton>
              <Button href={telHref(siteConfig.phone)} variant="secondary" size="large" iconLeft={<Phone className="h-4 w-4" aria-hidden="true" />}>
                Call {siteConfig.phone}
              </Button>
            </div>
            {service.heroTrustPoints?.length ? (
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {service.heroTrustPoints.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-sm font-medium text-charcoal">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-medical-blue" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {hasImageAsset(service.heroImage) ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-hero">
              <Image
                src={urlForImage(service.heroImage).width(900).height(675).fit("crop").url()}
                alt={`Orthopedic consultation for ${service.title.toLowerCase()}`}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </Reveal>
      </Section>

      {/* Main clinical content + sticky appointment panel */}
      <Section background="white" className="pt-0">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
          <Reveal className="space-y-10">
            {!service.body?.length && !service.introduction ? (
              <p className="text-dark-gray leading-relaxed">{service.shortDescription}</p>
            ) : null}
            <ContentSection title="" content={service.body} />
            <BulletList title="Conditions Treated" items={service.conditionsTreated} />
            <BulletList title="Symptoms That May Require Evaluation" items={service.symptoms} />

            {service.symptoms?.length ? (
              <div className="rounded-lg bg-dark-navy p-6 text-center text-white sm:p-8">
                <h3 className="mb-2 text-white">Are These Symptoms Affecting Your Daily Life?</h3>
                <p className="mb-5 text-sm text-white/80">
                  Schedule an orthopedic evaluation to understand the cause of your symptoms and discuss suitable
                  treatment options.
                </p>
                <BookAppointmentButton>Book an Appointment</BookAppointmentButton>
              </div>
            ) : null}

            <ContentSection title="When to Consult an Orthopaedic Surgeon" content={service.whenToConsult} />
            <CandidacyBox title={service.title} candidacy={service.candidacy} checklist={service.candidacyChecklist} />

            <div>
              <h2 className="mb-6">How {service.title} Treatment Is Planned</h2>
              <div className="space-y-6">
                <NumberedStep number={1} title="Medical Consultation">
                  Your surgeon discusses your symptoms, medical history, previous injuries, current medicines and
                  earlier treatments.
                </NumberedStep>
                <NumberedStep number={2} title="Physical Examination">
                  Movement, stability, alignment, muscle strength and areas of tenderness are evaluated.
                </NumberedStep>
                <NumberedStep number={3} title="Diagnostic Investigations">
                  X-rays and, when medically required, additional investigations help confirm the diagnosis.
                </NumberedStep>
                <NumberedStep number={4} title="Personalised Treatment Plan">
                  Non-surgical treatment, surgical options, expected rehabilitation, possible risks and follow-up are
                  discussed together with you.
                </NumberedStep>
              </div>
              <BookAppointmentButton className="mt-6">
                Schedule Your Orthopedic Consultation
              </BookAppointmentButton>
            </div>

            <ContentSection title="Diagnosis and Investigations" content={service.diagnosis} />

            <div>
              <ContentSection title="Non-Surgical Treatment Options" content={service.nonSurgicalOptions} />
              {service.nonSurgicalOptions?.length ? (
                <p className="mt-4 rounded-lg border-l-4 border-medical-blue bg-light-teal p-4 text-sm text-dark-navy">
                  Joint replacement may be discussed when appropriate non-surgical treatment no longer provides
                  meaningful relief or the joint damage significantly limits daily function.
                </p>
              ) : null}
            </div>

            <ContentSection title="When Surgery May Be Considered" content={service.whenSurgeryConsidered} />
            <ContentSection title="Surgical Procedure" content={service.surgicalProcedure} />
            <ContentSection title="Technology and Techniques Used" content={service.technologyUsed} />
            <BenefitsGrid benefits={service.benefits} />

            <div>
              <BulletList
                title="Risks and Limitations"
                items={service.risks}
                icon={<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />}
              />
              {service.risks?.length ? (
                <p className="mt-4 text-sm text-dark-gray leading-relaxed">
                  Your individual risks, expected benefits and available alternatives will be discussed before
                  making a treatment decision.
                </p>
              ) : null}
            </div>

            <ContentSection title="Preparation Before Treatment" content={service.preparation} />
            <RecoveryTimeline stages={service.recoveryStages} narrative={service.recovery} />
            <ContentSection title="Rehabilitation Guidance" content={service.rehabilitation} />
            {service.urgentCare?.length ? (
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" />
                  <h2 className="mb-0">When to Seek Urgent Medical Help</h2>
                </div>
                <PortableTextRenderer value={service.urgentCare} />
              </div>
            ) : null}

            {/* Why consult this doctor */}
            <div>
              <h2 className="mb-6">Why Consult {doctorName}?</h2>
              <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-center">
                {hasImageAsset(service.doctor?.photo) && (
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={urlForImage(service.doctor!.photo!).width(256).height(256).fit("crop").url()}
                      alt={doctorName}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-dark-navy">{doctorName}</p>
                  {service.doctor?.credentials && <p className="text-sm text-dark-gray">{service.doctor.credentials}</p>}
                  {service.doctor?.specialties?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {service.doctor.specialties.map((s) => (
                        <Badge key={s} variant="service">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              <ContentSection title="" content={service.whyThisDoctor} />
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {consultationApproachPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-charcoal">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-medical-blue" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <BookAppointmentButton>Book an Appointment</BookAppointmentButton>
                {service.doctor && (
                  <Button href={DOCTOR_PROFILE_PATH} variant="secondary">
                    View Doctor Profile
                  </Button>
                )}
              </div>
            </div>
          </Reveal>

          {/* Sticky appointment panel */}
          <Reveal delay={0.1}>
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="card-base card-shadow p-6">
                <h3 className="mb-2 text-lg">Book a Consultation</h3>
                <p className="mb-4 text-sm text-dark-gray leading-relaxed">
                  Speak with our team to discuss whether this treatment may be suitable for you.
                </p>
                <div className="flex flex-col gap-3">
                  <BookAppointmentButton className="w-full">
                    Book Appointment
                  </BookAppointmentButton>
                  <a
                    href={telHref(siteConfig.phone)}
                    className="flex items-center justify-center gap-2 text-sm font-medium text-dark-navy hover:text-medical-blue"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              {service.locations && service.locations.length > 0 && (
                <div className="card-base p-6">
                  <h3 className="mb-3 text-base">Available At</h3>
                  <ul className="space-y-3">
                    {service.locations.map((loc) => (
                      <li key={loc.slug.current} className="flex items-start gap-2 text-sm text-charcoal">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-medical-blue" aria-hidden="true" />
                        <div>
                          <Link href={locationPath(loc.slug.current)} className="font-medium hover:text-medical-blue">
                            {loc.name}
                          </Link>
                          {loc.addressLine && <p className="text-dark-gray">{loc.addressLine}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.medicalReviewer && (
                <div className="rounded-lg border border-light-grey p-6 text-sm text-dark-gray">
                  <p className="mb-1 font-medium text-charcoal">Medically reviewed by</p>
                  <p>
                    {service.medicalReviewer.name}
                    {service.medicalReviewer.credentials ? `, ${service.medicalReviewer.credentials}` : ""}
                  </p>
                  {service.reviewDate && (
                    <p className="mt-1">
                      Last reviewed{" "}
                      {new Date(service.reviewDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Types of treatment */}
      <TreatmentTypeCards title={service.title} types={service.treatmentTypes} />

      {/* Conditions grid */}
      <ConditionsGrid title={service.title} conditions={service.conditionsGrid} />

      {/* Patient care journey */}
      <Section background="light">
        <Reveal className="mb-10 text-center">
          <h2>Your {service.title} Care Journey</h2>
        </Reveal>
        <RevealGrid className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {careJourneySteps.map((step, i) => (
            <NumberedStep key={step.title} number={i + 1} title={step.title}>
              {step.description}
            </NumberedStep>
          ))}
        </RevealGrid>
      </Section>

      {/* Consultation locations */}
      {service.locations && service.locations.length > 0 && (
        <Section background="white">
          <Reveal className="mb-10 text-center">
            <h2>Consult {doctorName} for {service.title}</h2>
          </Reveal>
          <RevealGrid className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {service.locations.map((loc) => (
              <LocationCard
                key={loc._id}
                location={loc}
                description={`Patients looking for a ${service.title.toLowerCase()} surgeon in ${loc.city} can schedule a consultation with ${doctorName} at ${loc.name}.`}
              />
            ))}
          </RevealGrid>
        </Section>
      )}

      {/* Patient stories */}
      {service.testimonials && service.testimonials.length > 0 && (
        <Section background="light">
          <Reveal className="mb-10 text-center">
            <h2>Patient Stories</h2>
          </Reveal>
          <RevealGrid className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {service.testimonials.map((t) => (
              <TestimonialCard key={t.author} {...t} />
            ))}
          </RevealGrid>
        </Section>
      )}

      {/* Related videos */}
      {service.videos && service.videos.length > 0 && (
        <Section background="white">
          <Reveal className="mb-10 text-center">
            <h2>Related Videos</h2>
          </Reveal>
          <RevealGrid className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {service.videos.map((video) => (
              <a
                key={video.slug.current}
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-base card-shadow block overflow-hidden p-0"
              >
                {hasImageAsset(video.thumbnail) && (
                  <div className="relative aspect-video">
                    <Image
                      src={urlForImage(video.thumbnail).width(600).height(338).fit("crop").url()}
                      alt={video.title}
                      fill
                      sizes="(min-width: 1024px) 30vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <p className="mb-1 flex items-center gap-1 text-sm font-medium text-dark-navy">
                    {video.title}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-dark-gray" aria-hidden="true" />
                  </p>
                  {video.duration && <p className="text-xs text-dark-gray">{video.duration}</p>}
                </div>
              </a>
            ))}
          </RevealGrid>
        </Section>
      )}

      {/* FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <Section background="light">
          <Reveal className="mb-10 text-center">
            <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue">
              Common Questions
            </p>
            <h2>Frequently Asked Questions About {service.title}</h2>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto max-w-3xl">
            <Accordion items={service.faqs} />
          </Reveal>
        </Section>
      )}

      {/* Related treatments */}
      {service.relatedTreatments && service.relatedTreatments.length > 0 && (
        <Section background="white">
          <Reveal className="mb-10 text-center">
            <h2>Related Orthopedic Treatments</h2>
          </Reveal>
          <RevealGrid className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {service.relatedTreatments.map((t) => (
              <ServiceCard
                key={t.slug.current}
                icon={<ServiceIcon name={t.icon} className="h-6 w-6" />}
                title={t.title}
                description={t.shortDescription}
                href={treatmentPath(t.slug.current)}
              />
            ))}
          </RevealGrid>
        </Section>
      )}

      {/* Related conditions */}
      {service.relatedConditions && service.relatedConditions.length > 0 && (
        <Section background="light">
          <Reveal className="mb-10 text-center">
            <h2>Related Conditions</h2>
          </Reveal>
          <RevealGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {service.relatedConditions.map((c) => (
              <Link
                key={c.slug.current}
                href={`/conditions/${c.slug.current}`}
                className="card-base card-shadow flex items-center justify-between gap-2 p-5"
              >
                <div>
                  <p className="font-medium text-dark-navy">{c.title}</p>
                  <p className="text-sm text-dark-gray">{c.shortDescription}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-medical-blue" aria-hidden="true" />
              </Link>
            ))}
          </RevealGrid>
        </Section>
      )}

      {/* References */}
      {service.references && service.references.length > 0 && (
        <Container className="py-8">
          <Reveal>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-dark-gray">References</h3>
            <ul className="space-y-1 text-sm text-dark-gray">
              {service.references.map((ref) => (
                <li key={ref.url}>
                  {ref.url ? (
                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="hover:text-medical-blue underline">
                      {ref.label || ref.url}
                    </a>
                  ) : (
                    ref.label
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      )}

      {/* Final CTA */}
      <Section background="navy">
        <Reveal className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-white">Take the First Step Towards Better Mobility</h2>
          <p className="max-w-xl text-white/80">
            Consult {doctorName} for a detailed evaluation of persistent joint pain, stiffness and movement
            limitations. Understand your condition and discuss suitable non-surgical and surgical treatment options.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <BookAppointmentButton size="large">
              Book a Consultation
            </BookAppointmentButton>
            <Button href={telHref(siteConfig.phone)} variant="secondary" size="large">
              Call {siteConfig.phone}
            </Button>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base border border-white/40 bg-transparent px-6 text-lg text-white hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
