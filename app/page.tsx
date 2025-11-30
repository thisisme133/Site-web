"use client"

import { useState } from "react"
import { Header } from "@/components/dsfr/header"
import { Footer } from "@/components/dsfr/footer"
import { ServiceCards } from "@/components/dsfr/service-cards"
import { Agenda } from "@/components/dsfr/agenda"
import { GardeForm } from "@/components/dsfr/garde-form"
import { ComportementalisteForm } from "@/components/dsfr/comportementaliste-form"
import { FollowUs } from "@/components/dsfr/follow-us"
import { BlogSection } from "@/components/dsfr/blog-section"

export default function Home() {
  const [activeForm, setActiveForm] = useState<"garde" | "comportementaliste" | null>(null)

  const showForm = (formType: "garde" | "comportementaliste") => {
    setActiveForm(formType)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const hideForm = () => {
    setActiveForm(null)
  }

  return (
    <>
      <Header onShowForm={showForm} />

      <main role="main" id="content">
        {activeForm === null && (
          <>
            <ServiceCards onShowForm={showForm} />
            <Agenda />
            <BlogSection />
          </>
        )}

        {activeForm === "garde" && <GardeForm onBack={hideForm} />}

        {activeForm === "comportementaliste" && <ComportementalisteForm onBack={hideForm} />}
      </main>

      <FollowUs />
      <Footer />
    </>
  )
}
