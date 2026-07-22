"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface AppointmentModalContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AppointmentModalContext = createContext<AppointmentModalContextValue | null>(null);

export function AppointmentModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, openModal, closeModal }), [isOpen, openModal, closeModal]);

  return <AppointmentModalContext.Provider value={value}>{children}</AppointmentModalContext.Provider>;
}

export function useAppointmentModal() {
  const ctx = useContext(AppointmentModalContext);
  if (!ctx) throw new Error("useAppointmentModal must be used within an AppointmentModalProvider");
  return ctx;
}
