// app/admin/page.tsx
"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { FactureForm } from "@/components/admin/facture-form"
import { RgpdSuppressionForm } from "@/components/admin/rgpd-suppression-form"
import { EmailComposer } from "@/components/admin/email-composer"
import { MessageriePanel } from "@/components/admin/messagerie-panel"
import { FicheChien } from "@/components/admin/fiche-chien"
import { ListeChiens } from "@/components/admin/liste-chiens"

type ActiveSection = 
  | "dashboard" 
  | "factures" 
  | "rgpd" 
  | "emails" 
  | "messagerie" 
  | "chiens"
  | "fiche-chien"

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("dashboard")
  const [selectedChienId, setSelectedChienId] = useState<string | null>(null)

  const handleSelectChien = (id: string) => {
    setSelectedChienId(id)
    setActiveSection("fiche-chien")
  }

  const handleBackToList = () => {
    setSelectedChienId(null)
    setActiveSection("chiens")
  }

  return (
    <>
      <AdminHeader />
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
              <ListeChiens onSelectChien={handleSelectChien} />
            )}
            {activeSection === "fiche-chien" && selectedChienId && (
              <FicheChien chienId={selectedChienId} onBack={handleBackToList} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}