import { cva, type VariantProps } from "class-variance-authority";
import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        service: "bg-sky-blue text-medical-blue",
        verified: "bg-green-100 text-green-700",
        experience: "bg-amber-100 text-amber-700",
      },
    },
    defaultVariants: {
      variant: "service",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ variant, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {variant === "verified" && <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function ServiceBadge(props: Omit<BadgeProps, "variant">) {
  return <Badge variant="service" {...props} />;
}

export function VerifiedBadge(props: Omit<BadgeProps, "variant">) {
  return <Badge variant="verified" {...props} />;
}

export function ExperienceBadge(props: Omit<BadgeProps, "variant">) {
  return <Badge variant="experience" {...props} />;
}
