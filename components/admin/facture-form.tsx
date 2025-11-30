// components/admin/facture-form.tsx
"use client"

import { FormEvent, useEffect, useState } from "react"

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

interface FactureListItem {
  id: string
  numero_facture: string
  client_nom: string
  date_emission: string
  montant_total: number
  statut: string
  pdf_url?: string | null
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
  const [factures, setFactures] = useState<FactureListItem[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const totalHT = facture.lignes.reduce(
    (acc, l) => acc + l.quantite * l.prixUnitaire,
    0
  )
  const totalTTC = totalHT

  const handleChange = (field: keyof FactureData, value: string) => {
    setFacture(prev => ({ ...prev, [field]: value }))
  }

  const handleLigneChange = (
    id: string,
    field: keyof LigneFacture,
    value: string | number
  ) => {
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

  const genererNumeroFacture = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0")
    const prefix = facture.type === "garde" ? "G" : "C"
    handleChange("numeroFacture", `${prefix}${year}-${random}`)
  }

  const loadFactures = async (term?: string) => {
    try {
      setLoadingList(true)
      const params = term ? `?q=${encodeURIComponent(term)}` : ""
      const response = await fetch(`/api/factures${params}`)
      if (!response.ok) {
        throw new Error("Impossible de charger les factures")
      }
      const data = await response.json()
      setFactures(data)
    } catch (err) {
      console.error(err)
      setError("Impossible de charger la liste des factures")
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    loadFactures()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => loadFactures(search.trim()), 400)
    return () => clearTimeout(timeout)
  }, [search])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    setError(null)

    try {
      const payload = {
        type: facture.type,
        numeroFacture: facture.numeroFacture || undefined,
        dateEmission: facture.dateEmission,
        dateEcheance: facture.dateEcheance || facture.dateEmission,
        clientNom: facture.clientNom,
        clientAdresse: facture.clientAdresse,
        clientEmail: facture.clientEmail,
        clientSiret: facture.clientSiret,
        lignes: facture.lignes.map(l => ({
          description: l.description,
          quantite: l.quantite,
          prix_unitaire: l.prixUnitaire,
        })),
        statut: facture.statut,
        moyenPaiement: facture.moyenPaiement,
        notes: facture.notes,
      }

      const response = await fetch("/api/factures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement de la facture")
      }

      await response.json()
      setMessage("Facture enregistrée, PDF généré et prêt à être envoyé.")
      setFacture({ ...initialFacture, dateEmission: new Date().toISOString().split("T")[0] })
      loadFactures(search.trim())
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Une erreur est survenue")
    } finally {
      setSaving(false)
    }
  }

  const envoyerParEmail = async (factureId: string) => {
    try {
      setSendingId(factureId)
      setMessage(null)
      setError(null)
      const response = await fetch("/api/factures/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ factureId }),
      })

      if (!response.ok) {
        throw new Error("Envoi impossible. Vérifiez la configuration email.")
      }

      setMessage("Facture envoyée par email avec le design DSFR.")
      loadFactures(search.trim())
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Impossible d'envoyer la facture")
    } finally {
      setSendingId(null)
    }
  }

  const telechargerPdf = (pdfUrl?: string | null) => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank")
    } else {
      setError("Aucun PDF disponible pour cette facture")
    }
  }

  return (
    <div>
      <div className="fr-mb-3w">
        <h1 className="fr-h2">
          <span className="fr-icon-file-text-line fr-mr-2w" aria-hidden="true"></span>
          Création et suivi des factures
        </h1>
        <p className="fr-text--lead">
          Facture conforme à la législation française pour auto-entrepreneur, avec PDF et envoi email DSFR.
        </p>
      </div>

      {message && (
        <div className="fr-alert fr-alert--success fr-mb-3w">
          <p>{message}</p>
        </div>
      )}
      {error && (
        <div className="fr-alert fr-alert--error fr-mb-3w">
          <p>{error}</p>
        </div>
      )}

      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12 fr-col-lg-7">
          <form onSubmit={handleSubmit}>
            {/* Type de prestation */}
            <fieldset className="fr-fieldset fr-mb-3w">
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
            <fieldset className="fr-fieldset fr-mb-3w">
              <legend className="fr-fieldset__legend">
                <h2 className="fr-h5">Informations de la facture</h2>
              </legend>
              <div className="fr-fieldset__content">
                <div className="fr-grid-row fr-grid-row--gutters">
                  <div className="fr-col-12 fr-col-md-4">
                    <div className="fr-input-group">
                      <label className="fr-label" htmlFor="numero-facture">
                        Numéro de facture
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
                        Générer automatiquement
                      </button>
                    </div>
                  </div>
                  <div className="fr-col-12 fr-col-md-4">
                    <div className="fr-input-group">
                      <label className="fr-label" htmlFor="date-emission">
                        Date d'émission
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
                        Date d'échéance
                        <span className="fr-hint-text">Délai de paiement</span>
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
            <fieldset className="fr-fieldset fr-mb-3w">
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
                        Adresse complète
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
            <fieldset className="fr-fieldset fr-mb-3w">
              <legend className="fr-fieldset__legend">
                <h2 className="fr-h5">Prestations</h2>
              </legend>
              <div className="fr-fieldset__content">
                <div className="fr-table">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Description</th>
                        <th scope="col">Quantité</th>
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
                              placeholder="Description de la prestation (nom du chien, service, etc.)"
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
            <fieldset className="fr-fieldset fr-mb-3w">
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
                        <option value="a_regler">À régler</option>
                        <option value="payee">Payée</option>
                      </select>
                    </div>
                  </div>
                  <div className="fr-col-12 fr-col-md-6">
                    <div className="fr-select-group">
                      <label className="fr-label" htmlFor="moyen-paiement">
                        Moyen de paiement accepté
                      </label>
                      <select
                        className="fr-select"
                        id="moyen-paiement"
                        value={facture.moyenPaiement}
                        onChange={(e) => handleChange("moyenPaiement", e.target.value)}
                      >
                        <option value="">Sélectionner</option>
                        <option value="virement">Virement bancaire</option>
                        <option value="cheque">Chèque</option>
                        <option value="especes">Espèces</option>
                        <option value="cb">Carte bancaire</option>
                      </select>
                    </div>
                  </div>
                  <div className="fr-col-12">
                    <div className="fr-input-group">
                      <label className="fr-label" htmlFor="notes">
                        Notes ou conditions particulières
                      </label>
                      <textarea
                        className="fr-input"
                        id="notes"
                        rows={3}
                        value={facture.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                        placeholder="Conditions de paiement, informations supplémentaires, nom du chien, etc."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Mention légale auto-entrepreneur */}
            <div className="fr-alert fr-alert--info fr-mb-3w">
              <h3 className="fr-alert__title">Mentions légales obligatoires</h3>
              <p>La facture générée inclura automatiquement :</p>
              <ul className="fr-mt-2w">
                <li>Vos coordonnées complètes (nom, adresse, SIRET)</li>
                <li>La mention "TVA non applicable, art. 293B du CGI"</li>
                <li>Le numéro de facture unique et chronologique</li>
                <li>Les conditions de paiement et pénalités de retard</li>
              </ul>
            </div>

            <div className="fr-btns-group fr-btns-group--inline">
              <button
                type="submit"
                className="fr-btn fr-icon-save-line fr-btn--icon-left"
                disabled={saving}
              >
                {saving ? "Enregistrement..." : "Enregistrer et générer le PDF"}
              </button>
            </div>
          </form>
        </div>

        <div className="fr-col-12 fr-col-lg-5">
          <div className="fr-card fr-card--no-border">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="search-factures">Rechercher une facture</label>
                  <input
                    id="search-factures"
                    className="fr-input"
                    type="text"
                    placeholder="Nom du client, du chien ou numéro de facture"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <p className="fr-hint-text">La recherche se fait dans le nom, le numéro et les lignes (noms de chiens).</p>
                </div>

                <div className="fr-table fr-mt-2w">
                  <table>
                    <thead>
                      <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th>Date</th>
                        <th>Montant</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingList ? (
                        <tr>
                          <td colSpan={5}>Chargement...</td>
                        </tr>
                      ) : factures.length === 0 ? (
                        <tr>
                          <td colSpan={5}>Aucune facture enregistrée</td>
                        </tr>
                      ) : (
                        factures.map((f) => (
                          <tr key={f.id}>
                            <td className="fr-text--bold">{f.numero_facture}</td>
                            <td>{f.client_nom}</td>
                            <td>{new Date(f.date_emission).toLocaleDateString("fr-FR")}</td>
                            <td>{Number(f.montant_total).toFixed(2)} €</td>
                            <td>
                              <div className="fr-btns-group fr-btns-group--inline fr-btns-group--sm">
                                <button
                                  type="button"
                                  className="fr-btn fr-btn--tertiary fr-icon-download-line fr-btn--icon-left"
                                  onClick={() => telechargerPdf(f.pdf_url)}
                                >
                                  PDF
                                </button>
                                <button
                                  type="button"
                                  className="fr-btn fr-btn--secondary fr-icon-mail-line fr-btn--icon-left"
                                  onClick={() => envoyerParEmail(f.id)}
                                  disabled={sendingId === f.id}
                                >
                                  {sendingId === f.id ? "Envoi..." : "Envoyer"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
