"use client";

import { Button, type ButtonProps } from "@/components/ui/Button";
import { useAppointmentModal } from "@/components/forms/AppointmentModalContext";
import { trackCtaClick } from "@/lib/analytics";

/** Renders a crawlable appointment link while opening the booking modal for regular clicks. */
export function BookAppointmentButton({
  children,
  onClick,
  trackingLocation,
  ...props
}: Omit<ButtonProps, "href"> & { trackingLocation?: string }) {
  const { openModal } = useAppointmentModal();

  return (
    <Button
      {...props}
      href="/appointment/"
      onClick={(e) => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        openModal();
        if (trackingLocation) trackCtaClick("book_appointment", trackingLocation);
        onClick?.(e as React.MouseEvent<HTMLButtonElement>);
      }}
    >
      {children}
    </Button>
  );
}
