import React from "react";
"use client"

import { useTheme } from "../../context/ThemeContext"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme = "light" } = useTheme()

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-5 shrink-0 stroke-[2.5px] text-white" />
        ),
        info: (
          <InfoIcon className="size-5 shrink-0 stroke-[2.5px]" />
        ),
        warning: (
          <TriangleAlertIcon className="size-5 shrink-0 stroke-[2.5px]" />
        ),
        error: (
          <OctagonXIcon className="size-5 shrink-0 stroke-[2.5px] text-white" />
        ),
        loading: (
          <Loader2Icon className="size-5 shrink-0 animate-spin" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: "font-sans shadow-xl rounded-2xl border px-4 py-3.5 flex items-center gap-3 backdrop-blur-md transition-all select-none",
          success: "!bg-emerald-600 !text-white !border-emerald-700 dark:!bg-emerald-600 dark:!text-white dark:!border-emerald-500 shadow-xl shadow-emerald-950/25 [&_svg]:!text-white [&_[data-title]]:!text-white [&_[data-description]]:!text-emerald-100",
          error: "!bg-rose-600 !text-white !border-rose-700 dark:!bg-rose-600 dark:!text-white dark:!border-rose-500 shadow-xl shadow-rose-950/25 [&_svg]:!text-white [&_[data-title]]:!text-white [&_[data-description]]:!text-rose-100",
          title: "font-bold text-sm leading-snug tracking-tight text-white",
          description: "text-xs font-normal text-emerald-100 leading-relaxed mt-0.5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
