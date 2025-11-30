// app/admin/page.tsx
"use client"

import { useState } from "react"
import { useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { FactureForm } from "@/components/admin/facture-form"
import { RgpdSuppressionForm } from "@/components/admin/rgpd-suppression-form"
import { EmailComposer } from "@/components/admin/email-composer"
import { MessageriePanel } from "@/components/admin/messagerie-panel"
import { FicheChien } from "@/components/admin/fiche-chien"
import { ListeChiens } from "@/components/admin/liste-chiens"
import { AdminAuth, AdminUser } from "@/components/admin/admin-auth"
import { NouveauChienForm } from "@/components/admin/nouveau-chien-form"

type ActiveSection =
  | "dashboard"
  | "factures"
  | "rgpd"
  | "emails"
  | "messagerie"
  | "chiens"
  | "fiche-chien"
  | "nouveau-chien"

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("dashboard")
  const [selectedChienId, setSelectedChienId] = useState<string | null>(null)
  const [user, setUser] = useState<AdminUser | null>(null)

  // Hydrate utilisateur depuis le localStorage pour éviter de redemander un code OTP à chaque visite
  useEffect(() => {
    const stored = localStorage.getItem("lpb-admin-user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (err) {
        console.error("Impossible de charger l'utilisateur stocké", err)
      }
    }
  }, [])

  const handleAuthenticated = (authUser: AdminUser) => {
    setUser(authUser)
    localStorage.setItem("lpb-admin-user", JSON.stringify(authUser))
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    setActiveSection("dashboard")
    localStorage.removeItem("lpb-admin-user")
  }

  const handleSelectChien = (id: string) => {
    setSelectedChienId(id)
    setActiveSection("fiche-chien")
  }

  const handleBackToList = () => {
    setSelectedChienId(null)
    setActiveSection("chiens")
  }

  if (!user) {
    return <AdminAuth onAuthenticated={handleAuthenticated} />
  }

  return (
    <>
      <AdminHeader userEmail={user.email} onLogout={handleLogout} />
      <div className="fr-container fr-py-4w">
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-md-3">
            <AdminSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
          <div className="fr-col-12 fr-col-md-9">
            {activeSection === "dashboard" && <DashboardStats />}
            {activeSection === "factures" && <FactureForm />}
            {activeSection === "rgpd" && <RgpdSuppressionForm />}
            {activeSection === "emails" && <EmailComposer />}
            {activeSection === "messagerie" && <MessageriePanel />}
            {activeSection === "chiens" && (
              <ListeChiens
                onSelectChien={handleSelectChien}
                onNouveauChien={() => setActiveSection("nouveau-chien")}
              />
            )}
            {activeSection === "fiche-chien" && selectedChienId && (
              <FicheChien chienId={selectedChienId} onBack={handleBackToList} />
            )}
            {activeSection === "nouveau-chien" && (
              <NouveauChienForm
                onCreated={() => {
                  setActiveSection("chiens")
                  handleBackToList()
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}