"use client"

import { useMemo } from "react"

const evenements = [
  { date: "2025-12-01", type: "Balade" },
  { date: "2025-12-03", type: "Cours" },
  { date: "2025-12-05", type: "Atelier" },
]

const joursAbrev = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"]

export function Agenda() {
  const semaine = useMemo(() => {
    const aujourdhui = new Date()
    aujourdhui.setHours(0, 0, 0, 0)

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(aujourdhui)
      date.setDate(aujourdhui.getDate() + i)

      const dateStr = date.toISOString().split("T")[0]
      const jourAbrev = joursAbrev[date.getDay()]
      const jourNum = date.getDate().toString().padStart(2, "0")

      const evenement = evenements.find((e) => e.date === dateStr)

      return { date, dateStr, jourAbrev, jourNum, evenement }
    })
  }, [])

  return (
    <section id="agenda" className="fr-container fr-py-6w">
      <h2 className="fr-h3 fr-mb-4w">
        <span className="fr-icon-calendar-line fr-icon--lg fr-mr-1w" aria-hidden="true"></span>
        Agenda de la semaine
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: "0.5rem",
          overflowX: "auto",
          paddingBottom: "0.5rem",
        }}
      >
        {semaine.map((jour) => (
          <div
            key={jour.dateStr}
            style={{
              flex: "1 0 auto",
              minWidth: "80px",
              maxWidth: "120px",
            }}
          >
            <div
              className={`fr-tile fr-tile--no-icon ${jour.evenement ? "" : "fr-tile--grey"}`}
              style={{
                aspectRatio: "1/1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="fr-tile__body"
                style={{
                  textAlign: "center",
                  padding: 0,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <div
                  className="fr-tile__content"
                  style={{
                    padding: "0.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {jour.evenement && (
                    <p className="fr-badge fr-badge--info fr-badge--no-icon fr-badge--sm fr-mb-1v">
                      {jour.evenement.type}
                    </p>
                  )}
                  <p className="fr-tile__title fr-text--bold" style={{ fontSize: "0.875rem", margin: 0 }}>
                    {jour.jourAbrev}
                  </p>
                  <p className="fr-text--lg fr-text--bold" style={{ margin: 0 }}>
                    {jour.jourNum}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
