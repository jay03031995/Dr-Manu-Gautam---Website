import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Secondary — Fresh Teal
        "medical-blue": {
          DEFAULT: "#18A7A0",
          50: "#E6F5F4",
          100: "#C7E8E6",
          600: "#18A7A0",
          700: "#148E88",
        },
        // Primary — Deep Medical Blue
        "dark-navy": "#123B5D",
        teal: "#18A7A0",
        "light-teal": "#E6F5F4",
        // CTA Accent — Energetic Orange (buttons/CTAs only, not general UI)
        "cta-orange": {
          DEFAULT: "#F28C28",
          600: "#F28C28",
          700: "#D57B23",
        },
        olive: "#8B9A5C",
        "light-olive": "#F0F2E6",
        // Section Background — Pale Blue
        "light-blue": "#EAF4F8",
        "sky-blue": "#EAF4F8",
        // Neutrals
        "off-white": "#F8FAFC",
        "light-grey": "#DDE5EA",
        charcoal: "#1F2933",
        "dark-gray": "#667085",
        "near-black": "#101828",
        // Status
        success: "#15803D",
        warning: "#D97706",
        error: "#B42318",
        info: "#2563EB",
      },
      fontFamily: {
        heading: ["var(--font-manrope)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        hero: "32px",
      },
      boxShadow: {
        "elevation-1": "0 1px 2px 0 rgba(26, 47, 90, 0.05)",
        "elevation-2": "0 4px 6px -1px rgba(26, 47, 90, 0.08), 0 2px 4px -2px rgba(26, 47, 90, 0.06)",
        "elevation-3": "0 10px 15px -3px rgba(26, 47, 90, 0.1), 0 4px 6px -4px rgba(26, 47, 90, 0.08)",
        "elevation-4": "0 20px 25px -5px rgba(26, 47, 90, 0.12), 0 8px 10px -6px rgba(26, 47, 90, 0.08)",
      },
      // Semantic 8px-base tokens layered on top of Tailwind's default scale
      // (kept separate from the numeric keys so p-4/gap-2/etc. stay standard).
      // Section rhythm follows the spec: mobile 56–72px, tablet 72–88px, desktop 96–120px.
      spacing: {
        "section-y-xs": "64px",
        "section-y-sm": "80px",
        "section-y": "112px",
        "section-y-lg": "120px",
        gutter: "24px",
        "content-narrow": "720px",
        "content-wide": "820px",
        form: "640px",
      },
      maxWidth: {
        container: "1240px",
        page: "1440px",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
      },
    },
  },
  plugins: [typography],
};
export default config;
