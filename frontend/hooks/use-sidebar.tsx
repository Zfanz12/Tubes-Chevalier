"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  // Load saved sidebar state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem("harvesta_sidebar_open");
      if (savedState !== null) {
        setIsOpen(JSON.parse(savedState));
      }
    } catch {
      // Fallback if localStorage access fails
    }
  }, []);

  const setOpen = (open: boolean) => {
    setIsOpen(open);
    try {
      localStorage.setItem("harvesta_sidebar_open", JSON.stringify(open));
    } catch {
      // Ignore write error
    }
  };

  const toggle = () => {
    setIsOpen((prev) => {
      const nextState = !prev;
      try {
        localStorage.setItem("harvesta_sidebar_open", JSON.stringify(nextState));
      } catch {
        // Ignore write error
      }
      return nextState;
    });
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
