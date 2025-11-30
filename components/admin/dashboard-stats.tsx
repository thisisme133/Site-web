// components/admin/dashboard-stats.tsx
"use client"

import { useState, useEffect } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

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
  reservationsParSexe: {
    labels: string[]
    male: number[]
    femelle: number[]
  }
  reservationsParType: {
    labels: string[]
    garde: number[]
    comportementaliste: number[]
  }
}

export function DashboardStats() {
  const [periode, setPeriode] = useState<Periode>("mensuel")
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
  const dataGardes = currentData.labels.map((label, index) => ({ label, gardes: currentData.values[index] }))
  const dataSexe = stats?.reservationsParSexe?.labels.map((label, index) => ({
    label,
    males: stats?.reservationsParSexe?.male[index] || 0,
    femelles: stats?.reservationsParSexe?.femelle[index] || 0,
  })) || []
  const dataType = stats?.reservationsParType?.labels.map((label, index) => ({
    label,
    garde: stats?.reservationsParType?.garde[index] || 0,
    comportementaliste: stats?.reservationsParType?.comportementaliste[index] || 0,
  })) || []

  return (
    <>
      <div className="fr-mb-3w">
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
      <div className="fr-grid-row fr-grid-row--gutters fr-mb-2w">
        <div className="fr-col-6 fr-col-md-3">
          <div className="fr-card fr-card--no-border">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <h3 className="fr-card__title">
                  <span className="fr-icon-calendar-line fr-mr-1w" aria-hidden="true"></span>
                  Gardes
                </h3>
                <p className="fr-card__desc fr-text--bold fr-text--lg">{statsGlobales.totalGardes}</p>
                <p className="fr-card__detail">Total cette année</p>
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

      {/* Sélecteur de période */}
      <fieldset className="fr-segmented fr-segmented--no-legend fr-mb-3w">
        <legend className="fr-segmented__legend">Période</legend>
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
      <div className="fr-card fr-card--no-border fr-mb-3w">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <h3 className="fr-card__title">
              <span className="fr-icon-line-chart-line fr-mr-1w" aria-hidden="true"></span>
              Évolution des gardes
            </h3>
            {!loading && currentData.labels.length > 0 && (
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={dataGardes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value: number) => `${value} gardes`} />
                    <Legend />
                    <Bar dataKey="gardes" name="Nombre de gardes" fill="#000091" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {!loading && currentData.labels.length === 0 && (
              <p className="fr-text--sm">Aucune donnée disponible pour cette période</p>
            )}
          </div>
        </div>
      </div>

      {/* Courbe des réservations par sexe */}
      <div className="fr-card fr-card--no-border fr-mb-3w">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <h3 className="fr-card__title">
              <span className="fr-icon-line-chart-line fr-mr-1w" aria-hidden="true"></span>
              Courbe des réservations par sexe du chien
            </h3>
            {!loading && dataSexe.length > 0 ? (
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <LineChart data={dataSexe}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value: number) => `${value} réservations`} />
                    <Legend />
                    <Line type="monotone" dataKey="males" name="Mâles" stroke="#000091" strokeWidth={2} />
                    <Line type="monotone" dataKey="femelles" name="Femelles" stroke="#6a6af4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              !loading && <p className="fr-text--sm">Aucune réservation enregistrée cette année</p>
            )}
          </div>
        </div>
      </div>

      {/* Courbe des réservations par type */}
      <div className="fr-card fr-card--no-border fr-mb-3w">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <h3 className="fr-card__title">
              <span className="fr-icon-line-chart-line fr-mr-1w" aria-hidden="true"></span>
              Courbe des gardes et séances comportementalistes
            </h3>
            {!loading && dataType.length > 0 ? (
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <LineChart data={dataType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value: number) => `${value} demandes`} />
                    <Legend />
                    <Line type="monotone" dataKey="garde" name="Gardes" stroke="#008941" strokeWidth={2} />
                    <Line type="monotone" dataKey="comportementaliste" name="Comportementaliste" stroke="#de3831" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              !loading && <p className="fr-text--sm">Aucune donnée à afficher pour l'instant</p>
            )}
          </div>
        </div>
      </div>

      {/* Chiens les plus fréquents */}
      <div className="fr-card fr-card--no-border">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <h3 className="fr-card__title">
              <span className="fr-icon-star-line fr-mr-1w" aria-hidden="true"></span>
              Chiens les plus fréquents
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

            </div>
          </div>
        </div>
    </>
  )
}