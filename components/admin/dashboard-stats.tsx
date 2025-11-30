// components/admin/dashboard-stats.tsx
"use client"

import { useState, useEffect } from "react"
import Script from "next/script"

type Periode = "mensuel" | "trimestre" | "semestre" | "annuel"

interface StatsData {
  statsGlobales: {
    totalGardes: number
    totalActes: number
    totalChiens: number
    caAnnuel: number
  }
  gardesData: {
    mensuel: { labels: string[]; values: number[] }
    trimestre: { labels: string[]; values: number[] }
    semestre: { labels: string[]; values: number[] }
    annuel: { labels: string[]; values: number[] }
  }
  chiensFrequents: Array<{
    nom: string
    race: string
    visites: number
  }>
}

export function DashboardStats() {
  const [periode, setPeriode] = useState<Periode>("mensuel")
  const [chartsLoaded, setChartsLoaded] = useState(false)
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les statistiques depuis l'API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des statistiques')
        }
        const data = await response.json()
        setStats(data)
        setError(null)
      } catch (err) {
        console.error('Erreur:', err)
        setError('Impossible de charger les statistiques')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const currentData = stats?.gardesData[periode] || { labels: [], values: [] }
  const statsGlobales = stats?.statsGlobales || { totalGardes: 0, totalActes: 0, totalChiens: 0, caAnnuel: 0 }
  const chiensFrequents = stats?.chiensFrequents || []

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

      {/* Message d'erreur */}
      {error && (
        <div className="fr-alert fr-alert--error fr-mb-4w">
          <p>{error}</p>
        </div>
      )}

      {/* Indicateur de chargement */}
      {loading && (
        <div className="fr-mb-4w" style={{ textAlign: 'center' }}>
          <p>Chargement des statistiques...</p>
        </div>
      )}

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
                <p className="fr-card__desc fr-text--bold fr-text--lg">{statsGlobales.totalGardes}</p>
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
                <p className="fr-card__desc fr-text--bold fr-text--lg">{statsGlobales.totalActes}</p>
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
                <p className="fr-card__desc fr-text--bold fr-text--lg">{statsGlobales.totalChiens}</p>
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
                <p className="fr-card__desc fr-text--bold fr-text--lg">{statsGlobales.caAnnuel.toFixed(2)} EUR</p>
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
            {chartsLoaded && !loading && currentData.labels.length > 0 && (
              <bar-chart
                x={`[${JSON.stringify(currentData.labels)}]`}
                y={`[${JSON.stringify(currentData.values)}]`}
                name='["Nombre de gardes"]'
                selected-palette="categorical"
                unit-tooltip="gardes"
              ></bar-chart>
            )}
            {!loading && currentData.labels.length === 0 && (
              <p className="fr-text--sm">Aucune donnée disponible pour cette période</p>
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
                    {currentData.labels.length > 0 ? (
                      currentData.labels.map((label, index) => (
                        <tr key={label}>
                          <td>{label}</td>
                          <td>{currentData.values[index]}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2}>Aucune donnée disponible</td>
                      </tr>
                    )}
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
                  {chiensFrequents.length > 0 ? (
                    chiensFrequents.map((chien, index) => (
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>Aucun chien enregistré</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {chartsLoaded && !loading && chiensFrequents.length > 0 && (
              <div className="fr-mt-4w">
                <pie-chart
                  x={`[${JSON.stringify(chiensFrequents.map(c => c.nom))}]`}
                  y={`[${JSON.stringify(chiensFrequents.map(c => c.visites))}]`}
                  name={`${JSON.stringify(chiensFrequents.map(c => c.nom))}`}
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