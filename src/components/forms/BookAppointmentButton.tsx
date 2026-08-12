"use client";

import { Button, type ButtonProps } from "@/components/ui/Button";
import { useAppointmentModal } from "@/components/forms/AppointmentModalContext";

/** Renders a crawlable appointment link while opening the booking modal for regular clicks. */
export function BookAppointmentButton({ children, onClick, ...props }: Omit<ButtonProps, "href">) {
  const { openModal } = useAppointmentModal();

  return (
    <Button
      {...props}
      href="/appointment/"
      onClick={(e) => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        openModal();
        onClick?.(e as React.MouseEvent<HTMLButtonElement>);
      }}
    >
      {children}
    </Button>
  );
}
