"use client"

import { useState } from "react"

interface NouveauChienFormProps {
  onCreated: () => void
}

export function NouveauChienForm({ onCreated }: NouveauChienFormProps) {
  const [formData, setFormData] = useState({
    nom: "",
    race: "",
    age: "",
    proprietaireNom: "",
    proprietaireContact: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/chiens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom,
          race: formData.race,
          age: formData.age || null,
          statut: "actif",
          notes: formData.proprietaireContact
            ? `Contact propriétaire : ${formData.proprietaireContact}`
            : undefined,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Impossible d'enregistrer la fiche")
      }

      setSuccess("Fiche chien créée avec succès")
      setFormData({ nom: "", race: "", age: "", proprietaireNom: "", proprietaireContact: "" })
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="fr-mb-4w">
        <h1 className="fr-h2">
          <span className="fr-icon-add-line fr-mr-2w" aria-hidden="true"></span>
          Nouvelle fiche chien
        </h1>
        <p className="fr-text--lead">Enregistrez rapidement un nouveau pensionnaire.</p>
      </div>

      {error && (
        <div className="fr-alert fr-alert--error fr-mb-3w">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="fr-alert fr-alert--success fr-mb-3w">
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12 fr-col-md-6">
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="chien-nom">
              Nom du chien
              <span className="fr-hint-text">Obligatoire</span>
            </label>
            <input
              className="fr-input"
              id="chien-nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="fr-col-12 fr-col-md-6">
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="chien-race">
              Race
              <span className="fr-hint-text">Obligatoire</span>
            </label>
            <input
              className="fr-input"
              id="chien-race"
              value={formData.race}
              onChange={(e) => setFormData({ ...formData, race: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="fr-col-12 fr-col-md-4">
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="chien-age">
              Age
              <span className="fr-hint-text">(ex: 2 ans)</span>
            </label>
            <input
              className="fr-input"
              id="chien-age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
        </div>

        <div className="fr-col-12 fr-col-md-4">
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="chien-proprietaire">
              Proprietaire (nom)
            </label>
            <input
              className="fr-input"
              id="chien-proprietaire"
              value={formData.proprietaireNom}
              onChange={(e) => setFormData({ ...formData, proprietaireNom: e.target.value })}
            />
          </div>
        </div>

        <div className="fr-col-12 fr-col-md-4">
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="chien-contact">
              Contact proprietaire
              <span className="fr-hint-text">Telephone ou email</span>
            </label>
            <input
              className="fr-input"
              id="chien-contact"
              value={formData.proprietaireContact}
              onChange={(e) => setFormData({ ...formData, proprietaireContact: e.target.value })}
            />
          </div>
        </div>

        <div className="fr-col-12 fr-mt-3w">
          <div className="fr-btns-group fr-btns-group--inline">
            <button className="fr-btn" type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Créer la fiche"}
            </button>
            <button className="fr-btn fr-btn--secondary" type="button" onClick={onCreated} disabled={loading}>
              Retour à la liste
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
