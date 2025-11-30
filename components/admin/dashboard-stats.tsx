// components/admin/dashboard-stats.tsx
"use client"

import { useState, useEffect } from "react"
import Script from "next/script"

// Mock data - remplacer par des donnees reelles
const mockGardesData = {
  mensuel: { labels: ["S1", "S2", "S3", "S4"], values: [3, 5, 2, 4] },
  trimestre: { labels: ["Mois 1", "Mois 2", "Mois 3"], values: [14, 18, 12] },
  semestre: { labels: ["M1", "M2", "M3", "M4", "M5", "M6"], values: [14, 18, 12, 20, 15, 16] },
  annuel: { labels: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"], values: [12, 15, 14, 18, 20, 22, 25, 23, 19, 16, 14, 13] },
}

const mockChiensFrequents = [
  { nom: "Max", race: "Berger Allemand", visites: 24 },
  { nom: "Luna", race: "Golden Retriever", visites: 18 },
  { nom: "Rex", race: "Labrador", visites: 15 },
  { nom: "Bella", race: "Beagle", visites: 12 },
  { nom: "Rocky", race: "Boxer", visites: 10 },
]

const mockStatsGlobales = {
  totalGardes: 211,
  totalActes: 47,
  totalChiens: 35,
  caAnnuel: 12450,
}

type Periode = "mensuel" | "trimestre" | "semestre" | "annuel"

export function DashboardStats() {
  const [periode, setPeriode] = useState<Periode>("mensuel")
  const [chartsLoaded, setChartsLoaded] = useState(false)

  const currentData = mockGardesData[periode]

  return (
    <>
      <Script 
        src="https://unpkg.com/@gouvfr/dsfr-chart@1.0.0/dist/DSFRChart.umd.cjs"
        onLoad={() => setChartsLoaded(true)}
      />
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/@gouvfr/dsfr-chart@1.0.0/dist/DSFRChart.css" 
      />

      <div className="fr-mb-4w">
        <h1 className="fr-h2">
          <span className="fr-icon-dashboard-3-line fr-mr-2w" aria-hidden="true"></span>
          Tableau de bord
        </h1>
      </div>

      {/* Cartes statistiques */}
      <div className="fr-grid-row fr-grid-row--gutters fr-mb-4w">
        <div className="fr-col-6 fr-col-md-3">
          <div className="fr-card fr-card--no-border">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <h3 className="fr-card__title">
                  <span className="fr-icon-calendar-line fr-mr-1w" aria-hidden="true"></span>
                  Gardes
                </h3>
                <p className="fr-card__desc fr-text--bold fr-text--lg">{mockStatsGlobales.totalGardes}</p>
                <p className="fr-card__detail">Total cette annee</p>
              </div>
            </div>
          </div>
        </div>
        <div className="fr-col-6 fr-col-md-3">
          <div className="fr-card fr-card--no-border">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <h3 className="fr-card__title">
                  <span className="fr-icon-stethoscope-line fr-mr-1w" aria-hidden="true"></span>
                  Actes
                </h3>
                <p className="fr-card__desc fr-text--bold fr-text--lg">{mockStatsGlobales.totalActes}</p>
                <p className="fr-card__detail">Comportementalisme</p>
              </div>
            </div>
          </div>
        </div>
        <div className="fr-col-6 fr-col-md-3">
          <div className="fr-card fr-card--no-border">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <h3 className="fr-card__title">
                  <span className="fr-icon-user-heart-line fr-mr-1w" aria-hidden="true"></span>
                  Chiens
                </h3>
                <p className="fr-card__desc fr-text--bold fr-text--lg">{mockStatsGlobales.totalChiens}</p>
                <p className="fr-card__detail">Clients actifs</p>
              </div>
            </div>
          </div>
        </div>
        <div className="fr-col-6 fr-col-md-3">
          <div className="fr-card fr-card--no-border">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <h3 className="fr-card__title">
                  <span className="fr-icon-money-euro-circle-line fr-mr-1w" aria-hidden="true"></span>
                  CA
                </h3>
                <p className="fr-card__desc fr-text--bold fr-text--lg">{mockStatsGlobales.caAnnuel} EUR</p>
                <p className="fr-card__detail">Chiffre d'affaires</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selecteur de periode */}
      <fieldset className="fr-segmented fr-segmented--no-legend fr-mb-4w">
        <legend className="fr-segmented__legend">Periode</legend>
        <div className="fr-segmented__elements">
          <div className="fr-segmented__element">
            <input 
              type="radio" 
              id="periode-1" 
              name="periode"
              checked={periode === "mensuel"}
              onChange={() => setPeriode("mensuel")}
            />
            <label className="fr-label" htmlFor="periode-1">Mensuel</label>
          </div>
          <div className="fr-segmented__element">
            <input 
              type="radio" 
              id="periode-2" 
              name="periode"
              checked={periode === "trimestre"}
              onChange={() => setPeriode("trimestre")}
            />
            <label className="fr-label" htmlFor="periode-2">3 mois</label>
          </div>
          <div className="fr-segmented__element">
            <input 
              type="radio" 
              id="periode-3" 
              name="periode"
              checked={periode === "semestre"}
              onChange={() => setPeriode("semestre")}
            />
            <label className="fr-label" htmlFor="periode-3">6 mois</label>
          </div>
          <div className="fr-segmented__element">
            <input 
              type="radio" 
              id="periode-4" 
              name="periode"
              checked={periode === "annuel"}
              onChange={() => setPeriode("annuel")}
            />
            <label className="fr-label" htmlFor="periode-4">1 an</label>
          </div>
        </div>
      </fieldset>

      {/* Graphique des gardes */}
      <div className="fr-card fr-card--no-border fr-mb-4w">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <h3 className="fr-card__title">
              <span className="fr-icon-line-chart-line fr-mr-1w" aria-hidden="true"></span>
              Evolution des gardes
            </h3>
            {chartsLoaded && (
              <bar-chart
                x={`[${JSON.stringify(currentData.labels)}]`}
                y={`[${JSON.stringify(currentData.values)}]`}
                name='["Nombre de gardes"]'
                selected-palette="categorical"
                unit-tooltip="gardes"
              ></bar-chart>
            )}
            {/* Alternative textuelle pour accessibilite */}
            <details className="fr-accordion fr-mt-2w">
              <summary className="fr-accordion__btn">Voir les donnees en tableau</summary>
              <div className="fr-collapse">
                <table className="fr-table">
                  <thead>
                    <tr>
                      <th>Periode</th>
                      <th>Nombre de gardes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.labels.map((label, index) => (
                      <tr key={label}>
                        <td>{label}</td>
                        <td>{currentData.values[index]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Chiens les plus frequents */}
      <div className="fr-card fr-card--no-border">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <h3 className="fr-card__title">
              <span className="fr-icon-star-line fr-mr-1w" aria-hidden="true"></span>
              Chiens les plus frequents
            </h3>
            <div className="fr-table">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Rang</th>
                    <th scope="col">Nom</th>
                    <th scope="col">Race</th>
                    <th scope="col">Visites</th>
                  </tr>
                </thead>
                <tbody>
                  {mockChiensFrequents.map((chien, index) => (
                    <tr key={chien.nom}>
                      <td>
                        <span className="fr-badge fr-badge--info fr-badge--no-icon">
                          {index + 1}
                        </span>
                      </td>
                      <td>{chien.nom}</td>
                      <td>{chien.race}</td>
                      <td>
                        <span className="fr-badge fr-badge--success fr-badge--no-icon">
                          {chien.visites}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {chartsLoaded && (
              <div className="fr-mt-4w">
                <pie-chart
                  x={`[${JSON.stringify(mockChiensFrequents.map(c => c.nom))}]`}
                  y={`[${JSON.stringify(mockChiensFrequents.map(c => c.visites))}]`}
                  name={`${JSON.stringify(mockChiensFrequents.map(c => c.nom))}`}
                  unit-tooltip="visites"
                  selected-palette="categorical"
                ></pie-chart>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}