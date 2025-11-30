// components/admin/facture-form.tsx
"use client"

import { useState } from "react"

interface LigneFacture {
  id: string
  description: string
  quantite: number
  prixUnitaire: number
}

interface FactureData {
  type: "garde" | "comportementaliste"
  numeroFacture: string
  dateEmission: string
  dateEcheance: string
  clientNom: string
  clientAdresse: string
  clientEmail: string
  clientSiret: string
  lignes: LigneFacture[]
  statut: "payee" | "a_regler"
  moyenPaiement: string
  notes: string
}

const initialFacture: FactureData = {
  type: "garde",
  numeroFacture: "",
  dateEmission: new Date().toISOString().split("T")[0],
  dateEcheance: "",
  clientNom: "",
  clientAdresse: "",
  clientEmail: "",
  clientSiret: "",
  lignes: [{ id: "1", description: "", quantite: 1, prixUnitaire: 0 }],
  statut: "a_regler",
  moyenPaiement: "",
  notes: "",
}

export function FactureForm() {
  const [facture, setFacture] = useState<FactureData>(initialFacture)
  const [showPreview, setShowPreview] = useState(false)

  const handleChange = (field: keyof FactureData, value: string) => {
    setFacture(prev => ({ ...prev, [field]: value }))
  }

  const handleLigneChange = (id: string, field: keyof LigneFacture, value: string | number) => {
    setFacture(prev => ({
      ...prev,
      lignes: prev.lignes.map(l => 
        l.id === id ? { ...l, [field]: value } : l
      )
    }))
  }

  const ajouterLigne = () => {
    const newId = (facture.lignes.length + 1).toString()
    setFacture(prev => ({
      ...prev,
      lignes: [...prev.lignes, { id: newId, description: "", quantite: 1, prixUnitaire: 0 }]
    }))
  }

  const supprimerLigne = (id: string) => {
    if (facture.lignes.length > 1) {
      setFacture(prev => ({
        ...prev,
        lignes: prev.lignes.filter(l => l.id !== id)
      }))
    }
  }

  const totalHT = facture.lignes.reduce((acc, l) => acc + (l.quantite * l.prixUnitaire), 0)
  const totalTTC = totalHT // Pas de TVA pour auto-entrepreneur

  const genererNumeroFacture = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0")
    const prefix = facture.type === "garde" ? "G" : "C"
    handleChange("numeroFacture", `${prefix}${year}-${random}`)
  }

  return (
    <div>
      <div className="fr-mb-4w">
        <h1 className="fr-h2">
          <span className="fr-icon-file-text-line fr-mr-2w" aria-hidden="true"></span>
          Creation de facture
        </h1>
        <p className="fr-text--lead">
          Facture conforme a la legislation francaise pour auto-entrepreneur
        </p>
      </div>

      <form>
        {/* Type de prestation */}
        <fieldset className="fr-fieldset fr-mb-4w">
          <legend className="fr-fieldset__legend">
            <h2 className="fr-h5">Type de prestation</h2>
          </legend>
          <div className="fr-fieldset__content">
            <div className="fr-radio-group">
              <input 
                type="radio" 
                id="type-garde" 
                name="type"
                checked={facture.type === "garde"}
                onChange={() => handleChange("type", "garde")}
              />
              <label className="fr-label" htmlFor="type-garde">
                Garde d'animaux
              </label>
            </div>
            <div className="fr-radio-group">
              <input 
                type="radio" 
                id="type-comportementaliste" 
                name="type"
                checked={facture.type === "comportementaliste"}
                onChange={() => handleChange("type", "comportementaliste")}
              />
              <label className="fr-label" htmlFor="type-comportementaliste">
                Acte comportementaliste
              </label>
            </div>
          </div>
        </fieldset>

        {/* Informations facture */}
        <fieldset className="fr-fieldset fr-mb-4w">
          <legend className="fr-fieldset__legend">
            <h2 className="fr-h5">Informations de la facture</h2>
          </legend>
          <div className="fr-fieldset__content">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-4">
                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="numero-facture">
                    Numero de facture
                    <span className="fr-hint-text">Obligatoire selon la loi</span>
                  </label>
                  <div className="fr-input-wrap fr-icon-file-text-line">
                    <input
                      className="fr-input"
                      type="text"
                      id="numero-facture"
                      value={facture.numeroFacture}
                      onChange={(e) => handleChange("numeroFacture", e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    type="button"
                    className="fr-btn fr-btn--secondary fr-btn--sm fr-mt-1w fr-icon-refresh-line fr-btn--icon-left"
                    onClick={genererNumeroFacture}
                  >
                    Generer automatiquement
                  </button>
                </div>
              </div>
              <div className="fr-col-12 fr-col-md-4">
                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="date-emission">
                    Date d'emission
                  </label>
                  <input
                    className="fr-input"
                    type="date"
                    id="date-emission"
                    value={facture.dateEmission}
                    onChange={(e) => handleChange("dateEmission", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="fr-col-12 fr-col-md-4">
                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="date-echeance">
                    Date d'echeance
                    <span className="fr-hint-text">Delai de paiement</span>
                  </label>
                  <input
                    className="fr-input"
                    type="date"
                    id="date-echeance"
                    value={facture.dateEcheance}
                    onChange={(e) => handleChange("dateEcheance", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Client */}
        <fieldset className="fr-fieldset fr-mb-4w">
          <legend className="fr-fieldset__legend">
            <h2 className="fr-h5">Informations client</h2>
          </legend>
          <div className="fr-fieldset__content">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-6">
                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="client-nom">
                    Nom complet ou raison sociale
                  </label>
                  <input
                    className="fr-input"
                    type="text"
                    id="client-nom"
                    value={facture.clientNom}
                    onChange={(e) => handleChange("clientNom", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="fr-col-12 fr-col-md-6">
                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="client-email">
                    Adresse email
                  </label>
                  <input
                    className="fr-input"
                    type="email"
                    id="client-email"
                    value={facture.clientEmail}
                    onChange={(e) => handleChange("clientEmail", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="fr-col-12">
                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="client-adresse">
                    Adresse complete
                  </label>
                  <textarea
                    className="fr-input"
                    id="client-adresse"
                    rows={2}
                    value={facture.clientAdresse}
                    onChange={(e) => handleChange("clientAdresse", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="fr-col-12 fr-col-md-6">
                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="client-siret">
                    SIRET (si professionnel)
                    <span className="fr-hint-text">Facultatif pour les particuliers</span>
                  </label>
                  <input
                    className="fr-input"
                    type="text"
                    id="client-siret"
                    value={facture.clientSiret}
                    onChange={(e) => handleChange("clientSiret", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Lignes de facture */}
        <fieldset className="fr-fieldset fr-mb-4w">
          <legend className="fr-fieldset__legend">
            <h2 className="fr-h5">Prestations</h2>
          </legend>
          <div className="fr-fieldset__content">
            <div className="fr-table">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Description</th>
                    <th scope="col">Quantite</th>
                    <th scope="col">Prix unitaire (EUR)</th>
                    <th scope="col">Total</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {facture.lignes.map((ligne) => (
                    <tr key={ligne.id}>
                      <td>
                        <input
                          className="fr-input"
                          type="text"
                          value={ligne.description}
                          onChange={(e) => handleLigneChange(ligne.id, "description", e.target.value)}
                          placeholder="Description de la prestation"
                        />
                      </td>
                      <td>
                        <input
                          className="fr-input"
                          type="number"
                          min="1"
                          value={ligne.quantite}
                          onChange={(e) => handleLigneChange(ligne.id, "quantite", parseInt(e.target.value) || 1)}
                        />
                      </td>
                      <td>
                        <input
                          className="fr-input"
                          type="number"
                          min="0"
                          step="0.01"
                          value={ligne.prixUnitaire}
                          onChange={(e) => handleLigneChange(ligne.id, "prixUnitaire", parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td>{(ligne.quantite * ligne.prixUnitaire).toFixed(2)} EUR</td>
                      <td>
                        <button
                          type="button"
                          className="fr-btn fr-btn--tertiary-no-outline fr-icon-delete-line"
                          title="Supprimer cette ligne"
                          onClick={() => supprimerLigne(ligne.id)}
                          disabled={facture.lignes.length === 1}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="fr-text--right fr-text--bold">Total HT</td>
                    <td colSpan={2} className="fr-text--bold">{totalHT.toFixed(2)} EUR</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="fr-text--right">TVA non applicable (art. 293B du CGI)</td>
                    <td colSpan={2}>0,00 EUR</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="fr-text--right fr-text--bold">Total TTC</td>
                    <td colSpan={2} className="fr-text--bold">{totalTTC.toFixed(2)} EUR</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <button
              type="button"
              className="fr-btn fr-btn--secondary fr-icon-add-line fr-btn--icon-left fr-mt-2w"
              onClick={ajouterLigne}
            >
              Ajouter une ligne
            </button>
          </div>
        </fieldset>

        {/* Statut et paiement */}
        <fieldset className="fr-fieldset fr-mb-4w">
          <legend className="fr-fieldset__legend">
            <h2 className="fr-h5">Statut et paiement</h2>
          </legend>
          <div className="fr-fieldset__content">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-6">
                <div className="fr-select-group">
                  <label className="fr-label" htmlFor="statut">
                    Statut de la facture
                  </label>
                  <select
                    className="fr-select"
                    id="statut"
                    value={facture.statut}
                    onChange={(e) => handleChange("statut", e.target.value)}
                  >
                    <option value="a_regler">A regler</option>
                    <option value="payee">Payee</option>
                  </select>
                </div>
              </div>
              <div className="fr-col-12 fr-col-md-6">
                <div className="fr-select-group">
                  <label className="fr-label" htmlFor="moyen-paiement">
                    Moyen de paiement accepte
                  </label>
                  <select
                    className="fr-select"
                    id="moyen-paiement"
                    value={facture.moyenPaiement}
                    onChange={(e) => handleChange("moyenPaiement", e.target.value)}
                  >
                    <option value="">Selectionner</option>
                    <option value="virement">Virement bancaire</option>
                    <option value="cheque">Cheque</option>
                    <option value="especes">Especes</option>
                    <option value="cb">Carte bancaire</option>
                  </select>
                </div>
              </div>
              <div className="fr-col-12">
                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="notes">
                    Notes ou conditions particulieres
                  </label>
                  <textarea
                    className="fr-input"
                    id="notes"
                    rows={3}
                    value={facture.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Conditions de paiement, informations supplementaires..."
                  />
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Mention legale auto-entrepreneur */}
        <div className="fr-alert fr-alert--info fr-mb-4w">
          <h3 className="fr-alert__title">Mentions legales obligatoires</h3>
          <p>La facture generee inclura automatiquement :</p>
          <ul className="fr-mt-2w">
            <li>Vos coordonnees completes (nom, adresse, SIRET)</li>
            <li>La mention "TVA non applicable, art. 293B du CGI"</li>
            <li>Le numero de facture unique et chronologique</li>
            <li>Les conditions de paiement et penalites de retard</li>
          </ul>
        </div>

        <div className="fr-btns-group fr-btns-group--inline">
          <button 
            type="button" 
            className="fr-btn fr-icon-eye-line fr-btn--icon-left"
            onClick={() => setShowPreview(true)}
          >
            Apercu
          </button>
          <button 
            type="submit" 
            className="fr-btn fr-icon-save-line fr-btn--icon-left"
          >
            Enregistrer
          </button>
          <button 
            type="button" 
            className="fr-btn fr-btn--secondary fr-icon-download-line fr-btn--icon-left"
          >
            Telecharger PDF
          </button>
          <button 
            type="button" 
            className="fr-btn fr-btn--secondary fr-icon-mail-line fr-btn--icon-left"
          >
            Envoyer par email
          </button>
        </div>
      </form>
    </div>
  )
}