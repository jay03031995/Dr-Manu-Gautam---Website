import { cn } from "@/lib/utils";

/**
 * Shared text style recipes so headings/body copy stay consistent
 * across pages without re-typing the same Tailwind stacks everywhere.
 */
export const typography = {
  h1: "font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-dark-navy leading-tight tracking-tight",
  h2: "font-heading text-3xl md:text-4xl font-bold text-dark-navy leading-tight tracking-tight",
  h3: "font-heading text-2xl md:text-3xl font-semibold text-dark-navy leading-snug",
  h4: "font-heading text-xl md:text-2xl font-semibold text-dark-navy leading-snug",
  h5: "font-heading text-lg font-medium text-dark-navy",
  eyebrow: "font-heading text-sm font-semibold uppercase tracking-wider text-medical-blue",
  body: "font-body text-base text-charcoal leading-relaxed",
  bodyLarge: "font-body text-lg text-charcoal leading-relaxed",
  bodySmall: "font-body text-sm text-dark-gray leading-relaxed",
  link: "font-body text-medical-blue underline-offset-4 hover:underline",
} as const;

export type TypographyVariant = keyof typeof typography;

export function textStyle(variant: TypographyVariant, className?: string) {
  return cn(typography[variant], className);
}
