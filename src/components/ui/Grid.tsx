import { cn } from "@/lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    base?: 1 | 2;
    sm?: 1 | 2 | 3;
    md?: 2 | 3 | 4;
    lg?: 2 | 3 | 4 | 5 | 6;
  };
  gap?: "sm" | "md" | "lg";
}

const colsMap = {
  base: { 1: "grid-cols-1", 2: "grid-cols-2" },
  sm: { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" },
  md: { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" },
  lg: {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
  },
} as const;

const gapMap = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
} as const;

export function Grid({ cols = { base: 1, md: 2, lg: 3 }, gap = "md", className, children, ...props }: GridProps) {
  return (
    <div
      className={cn(
        "grid",
        cols.base && colsMap.base[cols.base],
        cols.sm && colsMap.sm[cols.sm],
        cols.md && colsMap.md[cols.md],
        cols.lg && colsMap.lg[cols.lg],
        gapMap[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
