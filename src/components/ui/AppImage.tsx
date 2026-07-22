import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" fill="#F0F5FF" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);

export interface AppImageProps extends Omit<ImageProps, "placeholder"> {
  rounded?: "sm" | "md" | "lg" | "full" | "none";
}

const roundedMap = {
  none: "",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
} as const;

export function AppImage({ className, rounded = "none", width, height, alt, ...props }: AppImageProps) {
  const blurProps =
    typeof width === "number" && typeof height === "number"
      ? { placeholder: "blur" as const, blurDataURL: `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}` }
      : {};

  return (
    <Image
      alt={alt}
      width={width}
      height={height}
      className={cn(roundedMap[rounded], className)}
      {...blurProps}
      {...props}
    />
  );
}
