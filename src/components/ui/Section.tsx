import { Bone, Activity } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

const sectionVariants = cva("relative w-full overflow-hidden py-section-y-xs md:py-section-y-sm lg:py-section-y", {
  variants: {
    background: {
      white: "bg-white",
      light: "bg-light-blue",
      navy: "bg-dark-navy text-white",
    },
  },
  defaultVariants: {
    background: "white",
  },
});

interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: "section" | "div";
  containerClassName?: string;
}

export function Section({
  as: Tag = "section",
  background,
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  const showWatermark = background === "light";

  return (
    <Tag className={cn(sectionVariants({ background }), className)} {...props}>
      {showWatermark && (
        <>
          <Bone
            className="pointer-events-none absolute -right-8 -top-10 z-0 h-48 w-48 rotate-[15deg] text-medical-blue/[0.07] md:-right-12 md:-top-14 md:h-64 md:w-64"
            strokeWidth={1}
            aria-hidden="true"
          />
          <Activity
            className="pointer-events-none absolute -bottom-10 -left-10 z-0 h-40 w-40 -rotate-6 text-dark-navy/[0.05] md:-bottom-14 md:-left-14 md:h-56 md:w-56"
            strokeWidth={1}
            aria-hidden="true"
          />
        </>
      )}
      <Container className={cn("relative z-10", containerClassName)}>{children}</Container>
    </Tag>
  );
}
