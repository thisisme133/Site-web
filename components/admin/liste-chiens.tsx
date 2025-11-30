// components/admin/liste-chiens.tsx
"use client"

import { useState, useEffect } from "react"

interface Chien {
  id: string
  nom: string
  race: string
  age: string | null
  proprietaireNom: string
  derniereVisite: string | null
  nbVisites: number
  statut: "actif" | "inactif"
}

interface ListeChiensProps {
  onSelectChien: (id: string) => void
  onNouveauChien?: () => void
}

export function ListeChiens({ onSelectChien, onNouveauChien }: ListeChiensProps) {
  const [chiens, setChiens] = useState<Chien[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatut, setFilterStatut] = useState<"tous" | "actif" | "inactif">("tous")

  // Charger les chiens depuis l'API
  useEffect(() => {
    fetchChiens()
  }, [])

  const fetchChiens = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatut !== "tous") {
        params.append("statut", filterStatut)
      }

      const response = await fetch(`/api/chiens?${params}`)
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des chiens')
      }

      const data = await response.json()
      setChiens(data)
      setError(null)
    } catch (err) {
      console.error('Erreur:', err)
      setError('Impossible de charger la liste des chiens')
    } finally {
      setLoading(false)
    }
  }

  const filteredChiens = chiens.filter(chien => {
    const matchSearch =
      chien.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chien.race.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chien.proprietaireNom.toLowerCase().includes(searchTerm.toLowerCase())

    return matchSearch
  })

  return (
    <div>
      <div className="fr-mb-4w">
        <h1 className="fr-h2">
          <span className="fr-icon-user-heart-line fr-mr-2w" aria-hidden="true"></span>
          Fiches chiens
        </h1>
        <p className="fr-text--lead">
          Consultez et gerez les fiches de suivi de vos pensionnaires
        </p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="fr-alert fr-alert--error fr-mb-4w">
          <p>{error}</p>
          <button className="fr-btn fr-btn--sm" onClick={fetchChiens}>
            Réessayer
          </button>
        </div>
      )}

      {/* Filtres */}
      <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-mb-4w">
        <div className="fr-col-12 fr-col-md-6">
          <div className="fr-search-bar">
            <label className="fr-label" htmlFor="search-chien">
              Rechercher
            </label>
            <input
              className="fr-input"
              type="search"
              id="search-chien"
              placeholder="Nom, race ou proprietaire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="fr-btn" title="Rechercher">
              Rechercher
            </button>
          </div>
        </div>
        <div className="fr-col-12 fr-col-md-4">
          <div className="fr-select-group">
            <label className="fr-label" htmlFor="filter-statut">
              Statut
            </label>
            <select
              className="fr-select"
              id="filter-statut"
              value={filterStatut}
              onChange={(e) => {
                setFilterStatut(e.target.value as typeof filterStatut)
                fetchChiens()
              }}
            >
              <option value="tous">Tous les chiens</option>
              <option value="actif">Clients actifs</option>
              <option value="inactif">Clients inactifs</option>
            </select>
          </div>
        </div>
        <div className="fr-col-12 fr-col-md-2">
          <div className="fr-btns-group fr-btns-group--icon-left fr-btns-group--inline fr-btns-group--center">
            <button className="fr-btn fr-icon-add-line" onClick={onNouveauChien} disabled={loading}>
              Nouveau
            </button>
          </div>
        </div>
      </div>

      {/* Indicateur de chargement */}
      {loading && (
        <div className="fr-mb-4w" style={{ textAlign: 'center' }}>
          <p>Chargement de la liste des chiens...</p>
        </div>
      )}

      {/* Liste */}
      {!loading && (
        <div className="fr-grid-row fr-grid-row--gutters">
          {filteredChiens.map((chien) => (
            <div key={chien.id} className="fr-col-12 fr-col-md-6 fr-col-lg-4">
              <div className="fr-card fr-enlarge-link">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    <h3 className="fr-card__title">
                      <button onClick={() => onSelectChien(chien.id)}>
                        {chien.nom}
                      </button>
                    </h3>
                    <p className="fr-card__desc">
                      {chien.race} {chien.age ? `- ${chien.age}` : ''}
                    </p>
                    <div className="fr-card__start">
                      <ul className="fr-tags-group">
                        <li>
                          <p className={`fr-tag fr-tag--sm ${chien.statut === "actif" ? "fr-tag--green-emeraude" : ""}`}>
                            {chien.statut === "actif" ? "Actif" : "Inactif"}
                          </p>
                        </li>
                        <li>
                          <p className="fr-tag fr-tag--sm">
                            {chien.nbVisites} visites
                          </p>
                        </li>
                      </ul>
                    </div>
                    <div className="fr-card__end">
                      <p className="fr-card__detail">
                        <span className="fr-icon-user-line fr-icon--sm fr-mr-1v" aria-hidden="true"></span>
                        {chien.proprietaireNom}
                      </p>
                      {chien.derniereVisite && (
                        <p className="fr-card__detail">
                          <span className="fr-icon-calendar-line fr-icon--sm fr-mr-1v" aria-hidden="true"></span>
                          Derniere visite : {new Date(chien.derniereVisite).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredChiens.length === 0 && !error && (
        <div className="fr-callout">
          <h3 className="fr-callout__title">Aucun resultat</h3>
          <p>
            {chiens.length === 0
              ? "Aucun chien enregistré. Cliquez sur 'Nouveau' pour ajouter une fiche."
              : "Aucun chien ne correspond a vos criteres de recherche."}
          </p>
        </div>
      )}
    </div>
  )
}