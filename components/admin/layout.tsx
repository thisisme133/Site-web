// app/admin/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Administration - Les Petits Bergers",
  description: "Panel d'administration pour la gestion des gardes et consultations comportementalistes",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/@gouvfr/dsfr@1.14.2/dist/dsfr.min.css" />
      <link rel="stylesheet" href="https://unpkg.com/@gouvfr/dsfr@1.14.2/dist/utility/utility.min.css" />
      <link rel="stylesheet" href="https://unpkg.com/@gouvfr/dsfr-chart@1.0.0/dist/DSFRChart.css" />
      {children}
      <Script src="https://unpkg.com/@gouvfr/dsfr@1.14.2/dist/dsfr.module.min.js" strategy="afterInteractive" />
    </>
  )
}