// components/admin/fiche-chien.tsx
"use client"

import { useState } from "react"

interface HistoriqueVisite {
  id: string
  date: string
  type: "garde" | "comportementaliste"
  duree: string
  notes: string
  montant: number
}

interface ChienDetails {
  id: string
  nom: string
  race: string
  dateNaissance: string
  sexe: string
  sterilise: boolean
  poids: number
  couleur: string
  puce: string
  
  proprietaire: {
    nom: string
    email: string
    telephone: string
    adresse: string
  }
  
  veterinaire: {
    nom: string
    telephone: string
    adresse: string
  }
  
  sante: {
    vaccins: string
    allergies: string
    traitements: string
    antecedents: string
  }
  
  comportement: {
    caractere: string
    sociabilite: string
    peurs: string
    alimentation: string
    besoinsSpecifiques: string
  }
  
  historique: HistoriqueVisite[]
  
  notes: string
}

const mockChienDetails: ChienDetails = {
  id: "1",
  nom: "Max",
  race: "Berger Allemand",
  dateNaissance: "2021-03-15",
  sexe: "Male",
  sterilise: true,
  poids: 32,
  couleur: "Noir et feu",
  puce: "250269812345678",
  
  proprietaire: {
    nom: "Jean Dupont",
    email: "jean.dupont@email.com",
    telephone: "06 12 34 56 78",
    adresse: "123 rue de la Paix, 51000 Chalons-en-Champagne"
  },
  
  veterinaire: {
    nom: "Dr. Marie Leroy",
    telephone: "03 26 12 34 56",
    adresse: "45 avenue du General de Gaulle, 51000 Chalons-en-Champagne"
  },
  
  sante: {
    vaccins: "Rage, CHPPIL - Dernier rappel : 15/09/2025",
    allergies: "Aucune connue",
    traitements: "Antiparasitaire mensuel (Nexgard)",
    antecedents: "Dysplasie legere hanche gauche diagnostiquee en 2023"
  },
  
  comportement: {
    caractere: "Joueur, affectueux, protecteur. Aime les longues promenades.",
    sociabilite: "Tres sociable avec les humains. Selectif avec les autres chiens males.",
    peurs: "Orages, feux d'artifice",
    alimentation: "Croquettes Royal Canin German Shepherd - 400g/jour en 2 repas",
    besoinsSpecifiques: "Necessite minimum 2h d'exercice par jour. Eviter les sauts importants (dysplasie)."
  },
  
  historique: [
    { id: "1", date: "2025-11-28", type: "garde", duree: "5 jours", notes: "Sejour sans probleme. Tres bon avec les autres pensionnaires.", montant: 175 },
    { id: "2", date: "2025-10-15", type: "comportementaliste", duree: "1h30", notes: "Consultation pour reactivite envers les males. Exercices de desensibilisation.", montant: 60 },
    { id: "3", date: "2025-09-20", type: "garde", duree: "3 jours", notes: "Leger stress le premier jour, puis adaptation rapide.", montant: 105 },
    { id: "4", date: "2025-08-10", type: "garde", duree: "7 jours", notes: "Vacances des proprietaires. Excellent comportement.", montant: 245 },
  ],
  
  notes: "Client fidele depuis 2022. Max est un chien equilibre qui s'adapte bien a l'environnement de garde. Prefere les jeux de balle aux jeux d'eau."
}

interface FicheChienProps {
  chienId: string
  onBack: () => void
}

export function FicheChien({ chienId, onBack }: FicheChienProps) {
  const [activeTab, setActiveTab] = useState<"infos" | "sante" | "comportement" | "historique">("infos")
  const [isEditing, setIsEditing] = useState(false)
  const [chien] = useState<ChienDetails>(mockChienDetails)

  const calculateAge = (dateNaissance: string) => {
    const birth = new Date(dateNaissance)
    const now = new Date()
    const years = now.getFullYear() - birth.getFullYear()
    const months = now.getMonth() - birth.getMonth()
    if (months < 0) {
      return `${years - 1} ans et ${12 + months} mois`
    }
    return `${years} ans et ${months} mois`
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
                {chien.nom}
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
              {chien.race} - {calculateAge(chien.dateNaissance)}
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
                      <dd>{new Date(chien.dateNaissance).toLocaleDateString("fr-FR")}</dd>
                      <dt className="fr-text--bold fr-mt-2w">Sexe</dt>
                      <dd>{chien.sexe} {chien.sterilise ? "(sterilise)" : "(non sterilise)"}</dd>
                      <dt className="fr-text--bold fr-mt-2w">Poids</dt>
                      <dd>{chien.poids} kg</dd>
                      <dt className="fr-text--bold fr-mt-2w">Couleur</dt>
                      <dd>{chien.couleur}</dd>
                      <dt className="fr-text--bold fr-mt-2w">N° puce</dt>
                      <dd>{chien.puce}</dd>
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
                      <dd>{chien.proprietaire.nom}</dd>
                      <dt className="fr-text--bold fr-mt-2w">Email</dt>
                      <dd><a href={`mailto:${chien.proprietaire.email}`}>{chien.proprietaire.email}</a></dd>
                      <dt className="fr-text--bold fr-mt-2w">Telephone</dt>
                      <dd><a href={`tel:${chien.proprietaire.telephone.replace(/\s/g, "")}`}>{chien.proprietaire.telephone}</a></dd>
                      <dt className="fr-text--bold fr-mt-2w">Adresse</dt>
                      <dd>{chien.proprietaire.adresse}</dd>
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
                      <dd>{chien.veterinaire.nom}</dd>
                      <dt className="fr-text--bold fr-mt-2w">Telephone</dt>
                      <dd><a href={`tel:${chien.veterinaire.telephone.replace(/\s/g, "")}`}>{chien.veterinaire.telephone}</a></dd>
                      <dt className="fr-text--bold fr-mt-2w">Adresse</dt>
                      <dd>{chien.veterinaire.adresse}</dd>
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
                <p>{chien.sante.vaccins}</p>
              </div>
            </div>
            <div className="fr-col-12 fr-col-md-6">
              <div className="fr-callout fr-callout--orange-terre-battue">
                <h3 className="fr-callout__title">
                  <span className="fr-icon-alert-line fr-mr-1w" aria-hidden="true"></span>
                  Allergies
                </h3>
                <p>{chien.sante.allergies}</p>
</div>
</div>
<div className="fr-col-12 fr-col-md-6">
<div className="fr-callout">
<h3 className="fr-callout__title">
<span className="fr-icon-medicine-bottle-line fr-mr-1w" aria-hidden="true"></span>
Traitements en cours
</h3>
<p>{chien.sante.traitements}</p>
</div>
</div>
<div className="fr-col-12 fr-col-md-6">
<div className="fr-callout fr-callout--purple-glycine">
<h3 className="fr-callout__title">
<span className="fr-icon-file-text-line fr-mr-1w" aria-hidden="true"></span>
Antecedents medicaux
</h3>
<p>{chien.sante.antecedents}</p>
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
          <p>{chien.comportement.caractere}</p>
        </div>
        <div className="fr-col-12 fr-col-md-6">
          <h3 className="fr-h5">
            <span className="fr-icon-team-line fr-mr-1w" aria-hidden="true"></span>
            Sociabilite
          </h3>
          <p>{chien.comportement.sociabilite}</p>
        </div>
        <div className="fr-col-12 fr-col-md-6">
          <div className="fr-alert fr-alert--warning fr-mb-3w">
            <h3 className="fr-alert__title">Peurs / Sensibilites</h3>
            <p>{chien.comportement.peurs}</p>
          </div>
        </div>
        <div className="fr-col-12 fr-col-md-6">
          <h3 className="fr-h5">
            <span className="fr-icon-restaurant-line fr-mr-1w" aria-hidden="true"></span>
            Alimentation
          </h3>
          <p>{chien.comportement.alimentation}</p>
        </div>
        <div className="fr-col-12">
          <div className="fr-alert fr-alert--info">
            <h3 className="fr-alert__title">Besoins specifiques</h3>
            <p>{chien.comportement.besoinsSpecifiques}</p>
          </div>
        </div>
      </div>

      <div className="fr-mt-4w">
        <h3 className="fr-h5">
          <span className="fr-icon-edit-line fr-mr-1w" aria-hidden="true"></span>
          Notes personnelles
        </h3>
        <div className="fr-highlight">
          <p>{chien.notes}</p>
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
            {chien.historique.map((visite) => (
              <tr key={visite.id}>
                <td>{new Date(visite.date).toLocaleDateString("fr-FR")}</td>
                <td>
                  <span className={`fr-badge fr-badge--sm ${visite.type === "garde" ? "fr-badge--green-emeraude" : "fr-badge--purple-glycine"} fr-badge--no-icon`}>
                    {visite.type === "garde" ? "Garde" : "Comportementaliste"}
                  </span>
                </td>
                <td>{visite.duree}</td>
                <td>{visite.notes}</td>
                <td>{visite.montant} EUR</td>
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
                {chien.historique.reduce((acc, v) => acc + v.montant, 0)} EUR
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
