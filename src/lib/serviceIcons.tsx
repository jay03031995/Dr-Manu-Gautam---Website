import {
  Activity,
  AlertTriangle,
  Award,
  Baby,
  Bone,
  Footprints,
  HandHeart,
  HeartPulse,
  Link2,
  Lock,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/** Maps the icon name stored in Sanity's `icon` field (services, concerns, home page) to a lucide-react component. */
const iconMap: Record<string, LucideIcon> = {
  Bone,
  Activity,
  Sparkles,
  ShieldCheck,
  HandHeart,
  Baby,
  Stethoscope,
  AlertTriangle,
  Footprints,
  Link2,
  Lock,
  Zap,
  Award,
  HeartPulse,
  Users,
  Wrench,
};

export function ServiceIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = (name && iconMap[name]) || Stethoscope;
  return <Icon className={className} aria-hidden="true" />;
}
