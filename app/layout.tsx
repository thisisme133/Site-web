import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Les Petits Bergers - Comportementaliste Canin Coole (51)",
  description:
    "Les Petits Bergers : comportementaliste canin et garde d'animaux à Coole. Méthodes positives, ACACED 2025.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" data-fr-scheme="light">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/@gouvfr/dsfr@1.14.2/dist/dsfr.min.css" />
        <link rel="stylesheet" href="https://unpkg.com/@gouvfr/dsfr@1.14.2/dist/utility/utility.min.css" />
      </head>
      <body>
        {children}
        <Script src="https://unpkg.com/@gouvfr/dsfr@1.14.2/dist/dsfr.module.min.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
