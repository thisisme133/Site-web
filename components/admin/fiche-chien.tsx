// components/admin/fiche-chien.tsx
"use client"

import { useEffect, useMemo, useState } from "react"

interface Proprietaire {
  id: string
  nom: string | null
  prenom: string | null
  email: string | null
  telephone: string | null
  adresse: string | null
  ville: string | null
  code_postal: string | null
}

interface Sociabilite {
  chiens?: boolean
  chats?: boolean
  enfants?: boolean
}

interface Visite {
  id: string
  type: "garde" | "comportementaliste" | "visite_preventive" | "urgence"
  date_debut: string
  date_fin?: string | null
  duree?: string | null
  notes?: string | null
  montant?: number | null
  statut?: string | null
}

interface ChienDetails {
  id: string
  nom: string
  race: string
  date_naissance?: string | null
  age?: string | null
  sexe?: string | null
  poids?: number | null
  couleur?: string | null
  numero_puce?: string | null
  numero_tatouage?: string | null
  veterinaire_nom?: string | null
  veterinaire_telephone?: string | null
  veterinaire_adresse?: string | null
  vaccins?: { nom?: string; date?: string; expiration?: string }[] | null
  allergies?: string[] | null
  traitements_en_cours?: string[] | null
  antecedents_medicaux?: string | null
  caractere?: string[] | null
  sociabilite?: Sociabilite | null
  peurs?: string[] | null
  regime_alimentaire?: string | null
  besoins_specifiques?: string | null
  notes?: string | null
  proprietaire?: Proprietaire | null
  visites?: Visite[] | null
}

interface FicheChienProps {
  chienId: string
  onBack: () => void
}

export function FicheChien({ chienId, onBack }: FicheChienProps) {
  const [activeTab, setActiveTab] = useState<"infos" | "sante" | "comportement" | "historique">("infos")
  const [isEditing, setIsEditing] = useState(false)
  const [chien, setChien] = useState<ChienDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChien = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/chiens/${chienId}`)
        if (!response.ok) {
          throw new Error("Impossible de charger la fiche du chien")
        }
        const data = await response.json()
        setChien(data)
        setError(null)
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }

    fetchChien()
  }, [chienId])

  const proprietaireLabel = useMemo(() => {
    if (!chien?.proprietaire) return null
    const { prenom, nom } = chien.proprietaire
    if (!prenom && !nom) return null
    return `${prenom || ""} ${nom || ""}`.trim()
  }, [chien])

  const calculAge = (dateNaissance?: string | null, age?: string | null) => {
    if (age) return age
    if (!dateNaissance) return "Age non renseigne"
    const birth = new Date(dateNaissance)
    const now = new Date()
    const years = now.getFullYear() - birth.getFullYear()
    const months = now.getMonth() - birth.getMonth()
    if (months < 0) {
      return `${years - 1} ans et ${12 + months} mois`
    }
    return `${years} ans et ${months} mois`
  }

  if (loading) {
    return (
      <div className="fr-container fr-py-4w">
        <p>Chargement de la fiche...</p>
      </div>
    )
  }

  if (error || !chien) {
    return (
      <div className="fr-container fr-py-4w">
        <div className="fr-alert fr-alert--error fr-mb-3w">
          <p>{error || "Impossible de charger la fiche"}</p>
        </div>
        <button className="fr-btn" onClick={onBack}>
          Retour
        </button>
      </div>
    )
  }

  return (
    <div>
      <nav role="navigation" className="fr-breadcrumb" aria-label="Fil d'Ariane">
        <button className="fr-breadcrumb__button" aria-expanded="false" aria-controls="breadcrumb-1">
          Voir le fil d'Ariane
        </button>
        <div className="fr-collapse" id="breadcrumb-1">
          <ol className="fr-breadcrumb__list">
            <li>
              <button className="fr-breadcrumb__link" onClick={onBack}>
                Fiches chiens
              </button>
            </li>
            <li>
              <span className="fr-breadcrumb__link" aria-current="page">
                {chien.nom || "Fiche chien"}
              </span>
            </li>
          </ol>
        </div>
      </nav>

      <div className="fr-mb-4w">
        <div className="fr-grid-row fr-grid-row--middle">
          <div className="fr-col">
            <h1 className="fr-h2">
              <span className="fr-icon-user-heart-line fr-mr-2w" aria-hidden="true"></span>
              {chien.nom}
            </h1>
            <p className="fr-text--lead">
              {chien.race} - {calculAge(chien.date_naissance, chien.age)}
            </p>
          </div>
          <div className="fr-col-auto">
            <div className="fr-btns-group">
              <button
                className={`fr-btn ${isEditing ? "fr-icon-save-line" : "fr-icon-edit-line"} fr-btn--icon-left`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Enregistrer" : "Modifier"}
              </button>
              <button className="fr-btn fr-btn--secondary fr-icon-printer-line fr-btn--icon-left">
                Imprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="fr-tabs">
        <ul className="fr-tabs__list" role="tablist">
          <li role="presentation">
            <button 
              className="fr-tabs__tab fr-icon-information-line fr-tabs__tab--icon-left"
              role="tab"
              aria-selected={activeTab === "infos"}
              aria-controls="panel-infos"
              onClick={() => setActiveTab("infos")}
            >
              Informations
            </button>
          </li>
          <li role="presentation">
            <button 
              className="fr-tabs__tab fr-icon-heart-pulse-line fr-tabs__tab--icon-left"
              role="tab"
              aria-selected={activeTab === "sante"}
              aria-controls="panel-sante"
              onClick={() => setActiveTab("sante")}
            >
              Sante
            </button>
          </li>
          <li role="presentation">
            <button 
              className="fr-tabs__tab fr-icon-mental-health-line fr-tabs__tab--icon-left"
              role="tab"
              aria-selected={activeTab === "comportement"}
              aria-controls="panel-comportement"
              onClick={() => setActiveTab("comportement")}
            >
              Comportement
            </button>
          </li>
          <li role="presentation">
            <button 
              className="fr-tabs__tab fr-icon-calendar-line fr-tabs__tab--icon-left"
              role="tab"
              aria-selected={activeTab === "historique"}
              aria-controls="panel-historique"
              onClick={() => setActiveTab("historique")}
            >
              Historique
            </button>
          </li>
        </ul>

        {/* Panel Informations */}
        <div 
          id="panel-infos" 
          className={`fr-tabs__panel ${activeTab === "infos" ? "fr-tabs__panel--selected" : ""}`}
          role="tabpanel"
        >
          <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-md-6">
              <div className="fr-card fr-card--no-border">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    <h3 className="fr-card__title">
                      <span className="fr-icon-user-heart-line fr-mr-1w" aria-hidden="true"></span>
                      Identite
                    </h3>
                    <dl className="fr-my-0">
                      <dt className="fr-text--bold fr-mt-2w">Nom</dt>
                      <dd>{chien.nom}</dd>
                      <dt className="fr-text--bold fr-mt-2w">Race</dt>
                      <dd>{chien.race}</dd>
                      <dt className="fr-text--bold fr-mt-2w">Date de naissance</dt>
                      <dd>
                        {chien.date_naissance
                          ? new Date(chien.date_naissance).toLocaleDateString("fr-FR")
                          : "Non renseignee"}
                      </dd>
                      <dt className="fr-text--bold fr-mt-2w">Sexe</dt>
                      <dd>{chien.sexe || "Non renseigne"}</dd>
                      <dt className="fr-text--bold fr-mt-2w">Poids</dt>
                      <dd>{chien.poids ? `${chien.poids} kg` : "Non renseigne"}</dd>
                      <dt className="fr-text--bold fr-mt-2w">Couleur</dt>
                      <dd>{chien.couleur || "Non renseignee"}</dd>
                      <dt className="fr-text--bold fr-mt-2w">N° puce</dt>
                      <dd>{chien.numero_puce || "Non renseigne"}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="fr-col-12 fr-col-md-6">
              <div className="fr-card fr-card--no-border fr-mb-3w">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    <h3 className="fr-card__title">
                      <span className="fr-icon-user-line fr-mr-1w" aria-hidden="true"></span>
                      Proprietaire
                    </h3>
                    <dl className="fr-my-0">
                      <dt className="fr-text--bold fr-mt-2w">Nom</dt>
                      <dd>{proprietaireLabel || "Non renseigne"}</dd>
                      <dt className="fr-text--bold fr-mt-2w">Email</dt>
                      <dd>
                        {chien.proprietaire?.email ? (
                          <a href={`mailto:${chien.proprietaire.email}`}>{chien.proprietaire.email}</a>
                        ) : (
                          "Non renseigne"
                        )}
                      </dd>
                      <dt className="fr-text--bold fr-mt-2w">Telephone</dt>
                      <dd>
                        {chien.proprietaire?.telephone ? (
                          <a href={`tel:${chien.proprietaire.telephone.replace(/\s/g, "")}`}>
                            {chien.proprietaire.telephone}
                          </a>
                        ) : (
                          "Non renseigne"
                        )}
                      </dd>
                      <dt className="fr-text--bold fr-mt-2w">Adresse</dt>
                      <dd>{chien.proprietaire?.adresse || "Non renseignee"}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="fr-card fr-card--no-border">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    <h3 className="fr-card__title">
                      <span className="fr-icon-stethoscope-line fr-mr-1w" aria-hidden="true"></span>
                      Veterinaire
                    </h3>
                    <dl className="fr-my-0">
                      <dt className="fr-text--bold fr-mt-2w">Nom</dt>
                      <dd>{chien.veterinaire_nom || "Non renseigne"}</dd>
                      <dt className="fr-text--bold fr-mt-2w">Telephone</dt>
                      <dd>
                        {chien.veterinaire_telephone ? (
                          <a href={`tel:${chien.veterinaire_telephone.replace(/\s/g, "")}`}>
                            {chien.veterinaire_telephone}
                          </a>
                        ) : (
                          "Non renseigne"
                        )}
                      </dd>
                      <dt className="fr-text--bold fr-mt-2w">Adresse</dt>
                      <dd>{chien.veterinaire_adresse || "Non renseignee"}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Sante */}
        <div 
          id="panel-sante" 
          className={`fr-tabs__panel ${activeTab === "sante" ? "fr-tabs__panel--selected" : ""}`}
          role="tabpanel"
        >
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-6">
              <div className="fr-callout">
                <h3 className="fr-callout__title">
                  <span className="fr-icon-syringe-line fr-mr-1w" aria-hidden="true"></span>
                  Vaccinations
                </h3>
                {chien.vaccins && chien.vaccins.length > 0 ? (
                  <ul className="fr-raw-list fr-mb-0">
                    {chien.vaccins.map((vaccin, idx) => (
                      <li key={idx}>
                        {vaccin.nom || "Vaccin"}
                        {vaccin.date && ` - ${new Date(vaccin.date).toLocaleDateString("fr-FR")}`}
                        {vaccin.expiration && ` (validite ${new Date(vaccin.expiration).toLocaleDateString("fr-FR")})`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Non renseignes</p>
                )}
              </div>
            </div>
            <div className="fr-col-12 fr-col-md-6">
              <div className="fr-callout fr-callout--orange-terre-battue">
                <h3 className="fr-callout__title">
                  <span className="fr-icon-alert-line fr-mr-1w" aria-hidden="true"></span>
                  Allergies
                </h3>
                {chien.allergies && chien.allergies.length > 0 ? (
                  <ul className="fr-raw-list fr-mb-0">
                    {chien.allergies.map((allergie, idx) => (
                      <li key={idx}>{allergie}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucune allergie renseignee</p>
                )}
              </div>
            </div>
            <div className="fr-col-12 fr-col-md-6">
              <div className="fr-callout">
                <h3 className="fr-callout__title">
                  <span className="fr-icon-medicine-bottle-line fr-mr-1w" aria-hidden="true"></span>
                  Traitements en cours
                </h3>
                {chien.traitements_en_cours && chien.traitements_en_cours.length > 0 ? (
                  <ul className="fr-raw-list fr-mb-0">
                    {chien.traitements_en_cours.map((traitement, idx) => (
                      <li key={idx}>{traitement}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucun traitement renseigne</p>
                )}
              </div>
            </div>
            <div className="fr-col-12 fr-col-md-6">
              <div className="fr-callout fr-callout--purple-glycine">
                <h3 className="fr-callout__title">
                  <span className="fr-icon-file-text-line fr-mr-1w" aria-hidden="true"></span>
                  Antecedents medicaux
                </h3>
                <p>{chien.antecedents_medicaux || "Non renseignes"}</p>
              </div>
            </div>
          </div>
        </div>
    {/* Panel Comportement */}
    <div 
      id="panel-comportement" 
      className={`fr-tabs__panel ${activeTab === "comportement" ? "fr-tabs__panel--selected" : ""}`}
      role="tabpanel"
    >
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12 fr-col-md-6">
          <h3 className="fr-h5">
            <span className="fr-icon-emotion-line fr-mr-1w" aria-hidden="true"></span>
            Caractere
          </h3>
          {chien.caractere && chien.caractere.length > 0 ? (
            <ul className="fr-raw-list fr-mb-0">
              {chien.caractere.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          ) : (
            <p>Non renseigne</p>
          )}
        </div>
        <div className="fr-col-12 fr-col-md-6">
          <h3 className="fr-h5">
            <span className="fr-icon-team-line fr-mr-1w" aria-hidden="true"></span>
            Sociabilite
          </h3>
          {chien.sociabilite ? (
            <ul className="fr-raw-list fr-mb-0">
              <li>Chiens : {chien.sociabilite.chiens ? "Oui" : "A verifier"}</li>
              <li>Chats : {chien.sociabilite.chats ? "Oui" : "A verifier"}</li>
              <li>Enfants : {chien.sociabilite.enfants ? "Oui" : "A verifier"}</li>
            </ul>
          ) : (
            <p>Non renseigne</p>
          )}
        </div>
        <div className="fr-col-12 fr-col-md-6">
          <div className="fr-alert fr-alert--warning fr-mb-3w">
            <h3 className="fr-alert__title">Peurs / Sensibilites</h3>
            {chien.peurs && chien.peurs.length > 0 ? (
              <ul className="fr-raw-list fr-mb-0">
                {chien.peurs.map((peur, idx) => (
                  <li key={idx}>{peur}</li>
                ))}
              </ul>
            ) : (
              <p>Non renseigne</p>
            )}
          </div>
        </div>
        <div className="fr-col-12 fr-col-md-6">
          <h3 className="fr-h5">
            <span className="fr-icon-restaurant-line fr-mr-1w" aria-hidden="true"></span>
            Alimentation
          </h3>
          <p>{chien.regime_alimentaire || "Non renseigne"}</p>
        </div>
        <div className="fr-col-12">
          <div className="fr-alert fr-alert--info">
            <h3 className="fr-alert__title">Besoins specifiques</h3>
            <p>{chien.besoins_specifiques || "Non renseignes"}</p>
          </div>
        </div>
      </div>

      <div className="fr-mt-4w">
        <h3 className="fr-h5">
          <span className="fr-icon-edit-line fr-mr-1w" aria-hidden="true"></span>
          Notes personnelles
        </h3>
        <div className="fr-highlight">
          <p>{chien.notes || "Aucune note pour le moment"}</p>
        </div>
      </div>
    </div>

    {/* Panel Historique */}
    <div 
      id="panel-historique" 
      className={`fr-tabs__panel ${activeTab === "historique" ? "fr-tabs__panel--selected" : ""}`}
      role="tabpanel"
    >
      <div className="fr-table">
        <table>
          <caption>Historique des visites</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Type</th>
              <th scope="col">Duree</th>
              <th scope="col">Notes</th>
              <th scope="col">Montant</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(chien.visites || []).map((visite) => (
              <tr key={visite.id}>
                <td>{new Date(visite.date_debut).toLocaleDateString("fr-FR")}</td>
                <td>
                  <span
                    className={`fr-badge fr-badge--sm ${visite.type === "garde" ? "fr-badge--green-emeraude" : "fr-badge--purple-glycine"} fr-badge--no-icon`}
                  >
                    {visite.type === "garde" ? "Garde" : "Comportementaliste"}
                  </span>
                </td>
                <td>{visite.duree || "-"}</td>
                <td>{visite.notes || "-"}</td>
                <td>{visite.montant ? `${visite.montant} EUR` : "-"}</td>
                <td>
                  <button className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-icon-eye-line" title="Voir les details">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="fr-text--right fr-text--bold">Total</td>
              <td className="fr-text--bold">
                {(chien.visites || []).reduce((acc, v) => acc + (v.montant || 0), 0)} EUR
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="fr-mt-4w">
        <button className="fr-btn fr-btn--secondary fr-icon-add-line fr-btn--icon-left">
          Ajouter une visite
        </button>
      </div>
    </div>
  </div>
</div>
)
}
