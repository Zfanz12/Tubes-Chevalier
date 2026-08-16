"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-center"
      toastOptions={{
        style: {
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          padding: "14px 18px",
          color: "#111827",
          fontSize: "14px",
          fontWeight: "500",
          gap: "10px",
          minWidth: "280px",
          maxWidth: "420px",
        },
        classNames: {
          icon: "text-xl leading-none flex items-center",
          title: "font-semibold text-[15px] text-gray-900 leading-snug",
          description: "text-sm text-gray-500 mt-0.5",
        },
      }}
      // Hilangkan semua icon default (success, error, info, warning)
      icons={{
        success: null,
        error: null,
        info: null,
        warning: null,
        loading: null,
      }}
      {...props}
    />
  )
}

export { Toaster }
