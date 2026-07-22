"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bone, User, Phone, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", href: "/", icon: Home },
  { label: "Specialties", href: "/treatments", icon: Bone },
  { label: "About", href: "/about", icon: User },
  { label: "Contact", href: "/contact", icon: Phone },
];

const bookTab = { label: "Book", href: "/appointment", icon: Calendar };

/** App-style bottom tab bar — the primary way mobile visitors get around and book. */
export function MobileTabBar() {
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav
      aria-label="Primary (mobile)"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-light-grey bg-white/95 px-1 pb-[calc(env(safe-area-inset-bottom)+6px)] pt-2 backdrop-blur md:hidden"
    >
      {tabs.map((tab) => {
        const active = isActive(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-1 text-[11px] font-medium",
              active ? "text-medical-blue" : "text-dark-gray"
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={active ? 2.25 : 2} />
            {tab.label}
          </Link>
        );
      })}
      <Link href={bookTab.href} className="flex flex-1 flex-col items-center gap-1 py-1 text-[11px] font-medium">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
            isActive(bookTab.href) ? "bg-cta-orange text-white" : "bg-cta-orange/90 text-white"
          )}
        >
          <bookTab.icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-cta-orange">{bookTab.label}</span>
      </Link>
    </nav>
  );
}
