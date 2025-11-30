// components/admin/rgpd-suppression-form.tsx
"use client"

import { useState } from "react"

interface SearchResult {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  chiens: string[]
  derniereVisite: string
  nombreVisites: number
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@email.com",
    telephone: "06 12 34 56 78",
    chiens: ["Max", "Bella"],
    derniereVisite: "2025-11-15",
    nombreVisites: 12
  },
  {
    id: "2",
    nom: "Martin",
    prenom: "Marie",
    email: "marie.martin@email.com",
    telephone: "06 98 76 54 32",
    chiens: ["Rex"],
    derniereVisite: "2025-10-20",
    nombreVisites: 5
  }
]

export function RgpdSuppressionForm() {
  const [searchType, setSearchType] = useState<"nom" | "email" | "chien">("nom")
  const [searchValue, setSearchValue] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [deletionComplete, setDeletionComplete] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulation de recherche
    if (searchValue.length >= 2) {
      setResults(mockResults.filter(r => 
        r.nom.toLowerCase().includes(searchValue.toLowerCase()) ||
        r.prenom.toLowerCase().includes(searchValue.toLowerCase()) ||
        r.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        r.chiens.some(c => c.toLowerCase().includes(searchValue.toLowerCase()))
      ))
    }
  }

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const handleDelete = () => {
    // Simulation de suppression
    setDeletionComplete(true)
    setShowConfirmation(false)
    setResults([])
    setSelectedIds([])
    setSearchValue("")
  }

  return (
    <div>
      <div className="fr-mb-4w">
        <h1 className="fr-h2">
          <span className="fr-icon-delete-line fr-mr-2w" aria-hidden="true"></span>
          Suppression RGPD
        </h1>
        <p className="fr-text--lead">
          Conformite au Reglement General sur la Protection des Donnees
        </p>
      </div>

      <div className="fr-alert fr-alert--warning fr-mb-4w">
        <h3 className="fr-alert__title">Attention</h3>
        <p>
          La suppression des donnees est irreversible. Conformement au RGPD, 
          vous devez supprimer toutes les donnees personnelles d'un client sur sa demande.
          Cette action supprimera toutes les informations associees : coordonnees, 
          historique des gardes, fiches des animaux et factures.
        </p>
      </div>

      {deletionComplete && (
        <div className="fr-alert fr-alert--success fr-mb-4w">
          <h3 className="fr-alert__title">Suppression effectuee</h3>
          <p>Les donnees ont ete definitivement supprimees conformement au RGPD.</p>
        </div>
      )}

      <form onSubmit={handleSearch}>
        <fieldset className="fr-fieldset fr-mb-4w">
          <legend className="fr-fieldset__legend">
            <h2 className="fr-h5">Rechercher un client</h2>
          </legend>
          <div className="fr-fieldset__content">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-4">
                <div className="fr-select-group">
                  <label className="fr-label" htmlFor="search-type">
                    Critere de recherche
                  </label>
                  <select
                    className="fr-select"
                    id="search-type"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as typeof searchType)}
                  >
                    <option value="nom">Nom / Prenom</option>
                    <option value="email">Adresse email</option>
                    <option value="chien">Nom du chien</option>
                  </select>
                </div>
              </div>
              <div className="fr-col-12 fr-col-md-6">
                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="search-value">
                    Valeur recherchee
                  </label>
                  <div className="fr-input-wrap fr-icon-search-line">
                    <input
                      className="fr-input"
                      type="text"
                      id="search-value"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Entrez votre recherche..."
                    />
                  </div>
                </div>
              </div>
              <div className="fr-col-12 fr-col-md-2">
                <button 
                  type="submit" 
                  className="fr-btn fr-icon-search-line fr-btn--icon-left fr-mt-4w"
                >
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </fieldset>
      </form>

      {results.length > 0 && (
        <div className="fr-mb-4w">
          <h3 className="fr-h5">
            <span className="fr-icon-user-line fr-mr-1w" aria-hidden="true"></span>
            Resultats ({results.length})
          </h3>
          <div className="fr-table">
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    <div className="fr-checkbox-group">
                      <input 
                        type="checkbox" 
                        id="select-all"
                        checked={selectedIds.length === results.length}
                        onChange={() => {
                          if (selectedIds.length === results.length) {
                            setSelectedIds([])
                          } else {
                            setSelectedIds(results.map(r => r.id))
                          }
                        }}
                      />
                      <label className="fr-label" htmlFor="select-all">
                        Tout
                      </label>
                    </div>
                  </th>
                  <th scope="col">Nom</th>
                  <th scope="col">Email</th>
                  <th scope="col">Telephone</th>
                  <th scope="col">Chiens</th>
                  <th scope="col">Derniere visite</th>
                  <th scope="col">Visites</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td>
                      <div className="fr-checkbox-group">
                        <input 
                          type="checkbox" 
                          id={`select-${result.id}`}
                          checked={selectedIds.includes(result.id)}
                          onChange={() => toggleSelection(result.id)}
                        />
                        <label className="fr-label" htmlFor={`select-${result.id}`}>
                          {" "}
                        </label>
                      </div>
                    </td>
                    <td>{result.prenom} {result.nom}</td>
                    <td>{result.email}</td>
                    <td>{result.telephone}</td>
                    <td>
                      {result.chiens.map(c => (
                        <span key={c} className="fr-tag fr-tag--sm fr-mr-1w">{c}</span>
                      ))}
                    </td>
                    <td>{result.derniereVisite}</td>
                    <td>
                      <span className="fr-badge fr-badge--info fr-badge--no-icon">
                        {result.nombreVisites}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedIds.length > 0 && (
            <div className="fr-mt-4w">
              <button
                type="button"
                className="fr-btn fr-btn--secondary fr-icon-delete-line fr-btn--icon-left"
                onClick={() => setShowConfirmation(true)}
              >
                Supprimer les {selectedIds.length} enregistrement(s) selectionne(s)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmation */}
      {showConfirmation && (
        <dialog className="fr-modal" id="modal-delete" open>
          <div className="fr-container fr-container--fluid fr-container-md">
            <div className="fr-grid-row fr-grid-row--center">
              <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
                <div className="fr-modal__body">
                  <div className="fr-modal__header">
                    <button 
                      className="fr-btn--close fr-btn" 
                      title="Fermer"
                      onClick={() => setShowConfirmation(false)}
                    >
                      Fermer
                    </button>
                  </div>
                  <div className="fr-modal__content">
                    <h1 className="fr-modal__title">
                      <span className="fr-icon-warning-line fr-mr-1w" aria-hidden="true"></span>
                      Confirmer la suppression
                    </h1>
                    <p>
                      Vous etes sur le point de supprimer definitivement {selectedIds.length} enregistrement(s).
                      Cette action est irreversible et supprimera :
                    </p>
                    <ul>
                      <li>Les coordonnees du client</li>
                      <li>L'historique des gardes</li>
                      <li>Les fiches des animaux</li>
                      <li>Les factures associees</li>
                      <li>L'historique des messages</li>
                    </ul>
                  </div>
                  <div className="fr-modal__footer">
                    <ul className="fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-lg">
                      <li>
                        <button 
                          className="fr-btn"
                          onClick={handleDelete}
                        >
                          Confirmer la suppression
                        </button>
                      </li>
                      <li>
                        <button 
                          className="fr-btn fr-btn--secondary"
                          onClick={() => setShowConfirmation(false)}
                        >
                          Annuler
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}