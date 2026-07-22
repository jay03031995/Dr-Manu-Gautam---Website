"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-heading font-medium rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-cta-orange text-white shadow-elevation-1 hover:bg-cta-orange-700 active:bg-cta-orange-700",
        secondary: "bg-white text-medical-blue border border-medical-blue hover:bg-sky-blue",
        tertiary: "bg-transparent text-medical-blue hover:bg-sky-blue",
      },
      size: {
        small: "h-9 px-4 text-sm",
        regular: "h-11 px-6 text-base",
        large: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "regular",
    },
  }
);

const MotionLink = motion.create(Link);

// framer-motion redefines drag/animation event handlers with its own signatures,
// so the native HTML ones for those specific props need to be dropped here.
type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;

export interface ButtonProps extends NativeButtonProps, VariantProps<typeof buttonVariants> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  href?: string;
}

const tapHover = { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 } };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, iconLeft, iconRight, href, children, ...props }, ref) => {
    const content = (
      <>
        {iconLeft}
        {children}
        {iconRight}
      </>
    );

    if (href) {
      return (
        <MotionLink
          href={href}
          onClick={props.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
          className={cn(buttonVariants({ variant, size }), className)}
          {...tapHover}
        >
          {content}
        </MotionLink>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...tapHover}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
