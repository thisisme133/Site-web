// components/admin/liste-chiens.tsx
"use client"

import { useState } from "react"

interface Chien {
  id: string
  nom: string
  race: string
  age: string
  proprietaire: string
  derniereVisite: string
  nombreVisites: number
  statut: "actif" | "inactif"
}

const mockChiens: Chien[] = [
  { id: "1", nom: "Max", race: "Berger Allemand", age: "4 ans", proprietaire: "Jean Dupont", derniereVisite: "2025-11-28", nombreVisites: 24, statut: "actif" },
  { id: "2", nom: "Luna", race: "Golden Retriever", age: "2 ans", proprietaire: "Marie Martin", derniereVisite: "2025-11-25", nombreVisites: 18, statut: "actif" },
  { id: "3", nom: "Rex", race: "Labrador", age: "6 ans", proprietaire: "Pierre Bernard", derniereVisite: "2025-11-20", nombreVisites: 15, statut: "actif" },
  { id: "4", nom: "Bella", race: "Beagle", age: "3 ans", proprietaire: "Sophie Petit", derniereVisite: "2025-10-15", nombreVisites: 12, statut: "actif" },
  { id: "5", nom: "Rocky", race: "Boxer", age: "5 ans", proprietaire: "Thomas Moreau", derniereVisite: "2025-09-10", nombreVisites: 10, statut: "inactif" },
]

interface ListeChiensProps {
  onSelectChien: (id: string) => void
}

export function ListeChiens({ onSelectChien }: ListeChiensProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatut, setFilterStatut] = useState<"tous" | "actif" | "inactif">("tous")

  const filteredChiens = mockChiens.filter(chien => {
    const matchSearch = 
      chien.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chien.race.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chien.proprietaire.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchStatut = filterStatut === "tous" || chien.statut === filterStatut

    return matchSearch && matchStatut
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

      {/* Filtres */}
      <div className="fr-grid-row fr-grid-row--gutters fr-mb-4w">
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
              onChange={(e) => setFilterStatut(e.target.value as typeof filterStatut)}
            >
              <option value="tous">Tous les chiens</option>
              <option value="actif">Clients actifs</option>
              <option value="inactif">Clients inactifs</option>
            </select>
          </div>
        </div>
        <div className="fr-col-12 fr-col-md-2">
          <button className="fr-btn fr-icon-add-line fr-btn--icon-left fr-mt-4w">
            Nouveau
          </button>
        </div>
      </div>

      {/* Liste */}
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
                    {chien.race} - {chien.age}
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
                          {chien.nombreVisites} visites
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="fr-card__end">
                    <p className="fr-card__detail">
                      <span className="fr-icon-user-line fr-icon--sm fr-mr-1v" aria-hidden="true"></span>
                      {chien.proprietaire}
                    </p>
                    <p className="fr-card__detail">
                      <span className="fr-icon-calendar-line fr-icon--sm fr-mr-1v" aria-hidden="true"></span>
                      Derniere visite : {new Date(chien.derniereVisite).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredChiens.length === 0 && (
        <div className="fr-callout">
          <h3 className="fr-callout__title">Aucun resultat</h3>
          <p>Aucun chien ne correspond a vos criteres de recherche.</p>
        </div>
      )}
    </div>
  )
}