"use client";

import { Button, type ButtonProps } from "@/components/ui/Button";
import { useAppointmentModal } from "@/components/forms/AppointmentModalContext";

/** Drop-in replacement for `<Button href="/appointment">` that opens the booking modal in place instead of navigating. */
export function BookAppointmentButton({ children, onClick, ...props }: Omit<ButtonProps, "href">) {
  const { openModal } = useAppointmentModal();

  return (
    <Button
      {...props}
      onClick={(e) => {
        openModal();
        onClick?.(e as React.MouseEvent<HTMLButtonElement>);
      }}
    >
      {children}
    </Button>
  );
}
