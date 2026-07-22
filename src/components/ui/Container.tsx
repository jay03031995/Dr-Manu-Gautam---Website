import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "header" | "footer" | "main" | "article";
}

export function Container({ as: Tag = "div", className, children, ...props }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </Tag>
  );
}
