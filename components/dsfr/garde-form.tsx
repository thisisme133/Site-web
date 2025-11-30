"use client"

import type React from "react"

import { useState } from "react"
import { CityAutocomplete } from "./city-autocomplete"
import { generateReservationCode } from "@/lib/reservation"

interface GardeFormProps {
  onBack: () => void
}

export function GardeForm({ onBack }: GardeFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    ville: "",
    animalNom: "",
    animalType: "",
    animalPoids: 10,
    animalAge: 2,
    dateDebut: "",
    dateFin: "",
    message: "",
    rgpd: false,
    preVisiteFaite: false,
    animalVaccine: false,
    carnetSante: false,
    datePreVisite: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [modeRdv, setModeRdv] = useState(false)
  const [reservationCode, setReservationCode] = useState("")
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const stepTitles = ["Pre-visite et vaccination", "Vos informations", "Informations sur l'animal", "Votre message"]

  const getAgeLabel = (age: number) => {
    if (age < 1) return "Chiot/Chaton"
    if (age === 1) return "1 an"
    if (age <= 3) return `${age} ans (Jeune adulte)`
    if (age <= 8) return `${age} ans (Adulte)`
    return `${age} ans (Senior)`
  }

  const validateStep1 = () => {
    if (!formData.preVisiteFaite) {
      setModeRdv(true)
      return false
    }
    setErrors({})
    return true
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.nom) newErrors.nom = "Le nom est obligatoire"
    if (!formData.email) newErrors.email = "L'email est obligatoire"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Format email invalide"
    if (!formData.telephone) newErrors.telephone = "Le telephone est obligatoire"
    if (!formData.ville) newErrors.ville = "La ville est obligatoire"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.animalNom) newErrors.animalNom = "Le nom de l'animal est obligatoire"
    if (!formData.animalType) newErrors.animalType = "Le type d'animal est obligatoire"
    if (!formData.dateDebut) newErrors.dateDebut = "La date de debut est obligatoire"
    if (!formData.dateFin) newErrors.dateFin = "La date de fin est obligatoire"
    if (formData.dateDebut && formData.dateFin && formData.dateFin <= formData.dateDebut) {
      newErrors.dateFin = "La date de fin doit etre posterieure a la date de debut"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.message || formData.message.length < 10)
      newErrors.message = "Le message doit contenir au moins 10 caracteres"
    if (!formData.rgpd) newErrors.rgpd = "Vous devez accepter la politique de confidentialite"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateRdv = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.nom) newErrors.nom = "Le nom est obligatoire"
    if (!formData.email) newErrors.email = "L'email est obligatoire"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Format email invalide"
    if (!formData.telephone) newErrors.telephone = "Le telephone est obligatoire"
    if (!formData.animalNom) newErrors.animalNom = "Le nom de l'animal est obligatoire"
    if (!formData.animalVaccine) newErrors.animalVaccine = "Vous devez confirmer que votre animal est vaccine"
    if (!formData.carnetSante) newErrors.carnetSante = "Vous devez confirmer que vous apporterez le carnet de sante"
    if (!formData.message || formData.message.length < 10)
      newErrors.message = "Le message doit contenir au moins 10 caracteres"
    if (!formData.rgpd) newErrors.rgpd = "Vous devez accepter la politique de confidentialite"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
    else if (step === 3 && validateStep3()) setStep(4)
  }

  const prevStep = () => {
    setStep(step - 1)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep4()) return

    setLoading(true)
    setApiError(null)

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "garde",
          client_nom: formData.nom,
          client_email: formData.email,
          client_telephone: formData.telephone,
          client_ville: formData.ville,
          animal_nom: formData.animalNom,
          animal_race: formData.animalType,
          animal_age: `${formData.animalAge} ans`,
          animal_poids: `${formData.animalPoids} kg`,
          date_debut: formData.dateDebut,
          date_fin: formData.dateFin,
          visite_prealable: formData.preVisiteFaite,
          form_data: formData,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Impossible d'enregistrer votre demande")
      }

      setReservationCode(data.code || generateReservationCode())
      setSubmitted(true)
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const handleRdvSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateRdv()) return

    setLoading(true)
    setApiError(null)

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "garde",
          client_nom: formData.nom,
          client_email: formData.email,
          client_telephone: formData.telephone,
          client_ville: formData.ville,
          animal_nom: formData.animalNom,
          animal_race: formData.animalType,
          visite_prealable: true,
          form_data: formData,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Impossible d'enregistrer votre demande")
      }

      setReservationCode(data.code || generateReservationCode())
      setSubmitted(true)
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const handleCityChange = (value: string) => {
    setFormData({ ...formData, ville: value })
  }

  if (submitted) {
    return (
      <div className="fr-container fr-py-12w">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-lg-8">
            <div className="fr-alert fr-alert--success">
              <h3 className="fr-alert__title">
                {modeRdv ? "Demande de rendez-vous envoyee" : "Demande envoyee avec succes"}
              </h3>
              <p>
                {modeRdv
                  ? "Votre demande de pre-visite a bien ete enregistree. Nous vous contacterons pour confirmer le rendez-vous. N'oubliez pas d'apporter le carnet de sante de votre animal."
                  : "Votre demande de garde a bien ete enregistree. Nous vous contacterons rapidement."}
              </p>
            </div>

            <div className="fr-callout fr-callout--green-emeraude fr-mt-4w">
              <h3 className="fr-callout__title">Votre code de reservation</h3>
              <p
                className="fr-callout__text"
                style={{ fontSize: "1.5rem", fontFamily: "monospace", letterSpacing: "0.2em" }}
              >
                {reservationCode}
              </p>
              <p className="fr-text--sm fr-mt-2w">
                Conservez ce code precieusement. Pour suivre votre reservation et echanger avec nous, rendez-vous sur la
                page "Suivre ma reservation" avec ce code et les 3 premieres lettres du nom de votre animal (
                {formData.animalNom.substring(0, 3).toUpperCase()}).
              </p>
            </div>

            <button className="fr-btn fr-mt-4w" onClick={onBack}>
              {"Retour a l'accueil"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (modeRdv) {
    return (
      <div className="fr-container fr-py-12w">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-lg-8">
            <button
              className="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-left-line fr-btn--icon-left fr-mb-4w"
              onClick={() => setModeRdv(false)}
            >
              Retour
            </button>

            <div className="fr-alert fr-alert--warning fr-mb-4w">
              <h3 className="fr-alert__title">Pre-visite obligatoire</h3>
              <p>
                Une pre-visite est necessaire avant toute garde. Veuillez prendre rendez-vous en remplissant le
                formulaire ci-dessous.
              </p>
              <p className="fr-text--bold fr-mt-2w">
                Important : Vous devrez vous presenter avec le carnet de sante de votre animal. Sans carnet de sante, le
                rendez-vous sera refuse.
              </p>
            </div>

            <h1>Demande de rendez-vous pre-visite</h1>

            <div className="fr-callout fr-callout--blue-ecume fr-my-4w">
              <p className="fr-callout__text">
                Vous pouvez proposer une date souhaitee pour la pre-visite. Cette date n'est pas garantie et sera
                validee par nos soins. Nous vous recontacterons pour confirmer le rendez-vous.
              </p>
            </div>

            <form onSubmit={handleRdvSubmit} className="fr-mt-4w">
              <fieldset className="fr-fieldset">
                <legend className="fr-fieldset__legend">
                  <h3 className="fr-h5">Vos informations</h3>
                </legend>

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.nom ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="rdv-nom">
                      Nom et prenom
                      <span className="fr-hint-text">Champ obligatoire</span>
                    </label>
                    <input
                      className="fr-input"
                      type="text"
                      id="rdv-nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    />
                    {errors.nom && <p className="fr-error-text">{errors.nom}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.email ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="rdv-email">
                      Adresse electronique
                      <span className="fr-hint-text">Champ obligatoire</span>
                    </label>
                    <input
                      className="fr-input"
                      type="email"
                      id="rdv-email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {errors.email && <p className="fr-error-text">{errors.email}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.telephone ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="rdv-telephone">
                      Telephone
                      <span className="fr-hint-text">Champ obligatoire</span>
                    </label>
                    <input
                      className="fr-input"
                      type="tel"
                      id="rdv-telephone"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    />
                    {errors.telephone && <p className="fr-error-text">{errors.telephone}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.animalNom ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="rdv-animal-nom">
                      Nom de votre animal
                      <span className="fr-hint-text">Champ obligatoire - Servira pour le suivi</span>
                    </label>
                    <input
                      className="fr-input"
                      type="text"
                      id="rdv-animal-nom"
                      value={formData.animalNom}
                      onChange={(e) => setFormData({ ...formData, animalNom: e.target.value })}
                    />
                    {errors.animalNom && <p className="fr-error-text">{errors.animalNom}</p>}
                  </div>
                </div>
              </fieldset>

              <fieldset className="fr-fieldset fr-mt-4w">
                <legend className="fr-fieldset__legend">
                  <h3 className="fr-h5">Date souhaitee (optionnel)</h3>
                </legend>

                <div className="fr-fieldset__element">
                  <div className="fr-input-group">
                    <label className="fr-label" htmlFor="rdv-date">
                      Date souhaitee pour la pre-visite
                      <span className="fr-hint-text">Optionnel - Cette date devra etre validee par nos soins</span>
                    </label>
                    <input
                      className="fr-input"
                      type="date"
                      id="rdv-date"
                      value={formData.datePreVisite}
                      onChange={(e) => setFormData({ ...formData, datePreVisite: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="fr-fieldset fr-mt-4w">
                <legend className="fr-fieldset__legend">
                  <h3 className="fr-h5">Confirmations obligatoires</h3>
                </legend>

                <div className="fr-fieldset__element">
                  <div className={`fr-checkbox-group ${errors.animalVaccine ? "fr-checkbox-group--error" : ""}`}>
                    <input
                      type="checkbox"
                      id="rdv-vaccine"
                      checked={formData.animalVaccine}
                      onChange={(e) => setFormData({ ...formData, animalVaccine: e.target.checked })}
                    />
                    <label className="fr-label" htmlFor="rdv-vaccine">
                      Je confirme que mon animal est bien vaccine
                    </label>
                    {errors.animalVaccine && <p className="fr-error-text">{errors.animalVaccine}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <div className={`fr-checkbox-group ${errors.carnetSante ? "fr-checkbox-group--error" : ""}`}>
                    <input
                      type="checkbox"
                      id="rdv-carnet"
                      checked={formData.carnetSante}
                      onChange={(e) => setFormData({ ...formData, carnetSante: e.target.checked })}
                    />
                    <label className="fr-label" htmlFor="rdv-carnet">
                      Je viendrai avec le carnet de sante de mon animal (obligatoire, sinon refus de rendez-vous)
                    </label>
                    {errors.carnetSante && <p className="fr-error-text">{errors.carnetSante}</p>}
                  </div>
                </div>
              </fieldset>

              <fieldset className="fr-fieldset fr-mt-4w">
                <legend className="fr-fieldset__legend">
                  <h3 className="fr-h5">Votre message</h3>
                </legend>

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.message ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="rdv-message">
                      Decrivez votre animal et vos besoins
                      <span className="fr-hint-text">Champ obligatoire - minimum 10 caracteres</span>
                    </label>
                    <textarea
                      className="fr-input"
                      id="rdv-message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                    {errors.message && <p className="fr-error-text">{errors.message}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <div className={`fr-checkbox-group ${errors.rgpd ? "fr-checkbox-group--error" : ""}`}>
                    <input
                      type="checkbox"
                      id="rdv-rgpd"
                      checked={formData.rgpd}
                      onChange={(e) => setFormData({ ...formData, rgpd: e.target.checked })}
                    />
                    <label className="fr-label" htmlFor="rdv-rgpd">
                      {"J'accepte que mes donnees soient traitees conformement a la politique de confidentialite"}
                    </label>
                    {errors.rgpd && <p className="fr-error-text">{errors.rgpd}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <button type="submit" className="fr-btn">
                    Demander un rendez-vous
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fr-container fr-py-12w">
      <div className="fr-grid-row fr-grid-row--center">
        <div className="fr-col-12 fr-col-lg-8">
          <button
            className="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-left-line fr-btn--icon-left fr-mb-4w"
            onClick={onBack}
          >
            {"Retour a l'accueil"}
          </button>

          <h1>{"Demande de garde d'animaux"}</h1>
          <p className="fr-text--lead">Remplissez le formulaire ci-dessous pour une demande de garde</p>

          <div className="fr-mt-4w fr-mb-4w">
            <p className="fr-text--bold">
              Etape {step} sur 4 : {stepTitles[step - 1]}
            </p>
            <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="fr-col-3">
                  <div
                    style={{
                      height: "4px",
                      backgroundColor: s <= step ? "var(--blue-france-sun-113-625)" : "var(--grey-925-125)",
                      borderRadius: "2px",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {apiError && (
            <div className="fr-alert fr-alert--error fr-mb-3w">
              <p>{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="fr-mt-4w">
            {step === 1 && (
              <fieldset className="fr-fieldset">
                <legend className="fr-fieldset__legend">
                  <h3 className="fr-h5">Pre-visite et vaccination</h3>
                </legend>

                <div className="fr-alert fr-alert--info fr-mb-4w">
                  <p>
                    Une pre-visite est obligatoire avant toute premiere garde afin de nous assurer du bien-etre de votre
                    animal.
                  </p>
                </div>

                <div className="fr-fieldset__element">
                  <div className="fr-checkbox-group">
                    <input
                      type="checkbox"
                      id="preVisite"
                      checked={formData.preVisiteFaite}
                      onChange={(e) => setFormData({ ...formData, preVisiteFaite: e.target.checked })}
                    />
                    <label className="fr-label" htmlFor="preVisite">
                      {"J'ai deja effectue une pre-visite chez Les Petits Bergers"}
                    </label>
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--right">
                    <li>
                      <button type="button" className="fr-btn" onClick={nextStep}>
                        Etape suivante
                      </button>
                    </li>
                  </ul>
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset className="fr-fieldset">
                <legend className="fr-fieldset__legend">
                  <h3 className="fr-h5">Vos informations</h3>
                </legend>

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.nom ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="garde-nom">
                      Nom et prenom
                      <span className="fr-hint-text">Champ obligatoire</span>
                    </label>
                    <input
                      className="fr-input"
                      type="text"
                      id="garde-nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    />
                    {errors.nom && <p className="fr-error-text">{errors.nom}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.email ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="garde-email">
                      Adresse electronique
                      <span className="fr-hint-text">Champ obligatoire - Format attendu : nom@domaine.fr</span>
                    </label>
                    <input
                      className="fr-input"
                      type="email"
                      id="garde-email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {errors.email && <p className="fr-error-text">{errors.email}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.telephone ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="garde-telephone">
                      Telephone
                      <span className="fr-hint-text">Champ obligatoire - Format attendu : 0612345678</span>
                    </label>
                    <input
                      className="fr-input"
                      type="tel"
                      id="garde-telephone"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    />
                    {errors.telephone && <p className="fr-error-text">{errors.telephone}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element" style={{ position: "relative" }}>
                  <CityAutocomplete
                    id="garde-ville"
                    value={formData.ville}
                    onChange={handleCityChange}
                    error={errors.ville}
                  />
                </div>

                <div className="fr-fieldset__element">
                  <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--right">
                    <li>
                      <button type="button" className="fr-btn fr-btn--secondary" onClick={prevStep}>
                        Etape precedente
                      </button>
                    </li>
                    <li>
                      <button type="button" className="fr-btn" onClick={nextStep}>
                        Etape suivante
                      </button>
                    </li>
                  </ul>
                </div>
              </fieldset>
            )}

            {step === 3 && (
              <fieldset className="fr-fieldset">
                <legend className="fr-fieldset__legend">
                  <h3 className="fr-h5">Informations sur l'animal</h3>
                </legend>

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.animalNom ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="garde-animal-nom">
                      Nom de l'animal
                      <span className="fr-hint-text">Champ obligatoire</span>
                    </label>
                    <input
                      className="fr-input"
                      type="text"
                      id="garde-animal-nom"
                      value={formData.animalNom}
                      onChange={(e) => setFormData({ ...formData, animalNom: e.target.value })}
                    />
                    {errors.animalNom && <p className="fr-error-text">{errors.animalNom}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <fieldset className={`fr-fieldset ${errors.animalType ? "fr-fieldset--error" : ""}`}>
                    <legend className="fr-fieldset__legend">
                      Type d'animal
                      <span className="fr-hint-text">Champ obligatoire</span>
                    </legend>
                    <div className="fr-fieldset__element fr-fieldset__element--inline">
                      <div className="fr-radio-group">
                        <input
                          type="radio"
                          id="animal-chien"
                          name="animalType"
                          value="Chien"
                          checked={formData.animalType === "Chien"}
                          onChange={(e) => setFormData({ ...formData, animalType: e.target.value })}
                        />
                        <label className="fr-label" htmlFor="animal-chien">
                          Chien
                        </label>
                      </div>
                    </div>
                    <div className="fr-fieldset__element fr-fieldset__element--inline">
                      <div className="fr-radio-group">
                        <input
                          type="radio"
                          id="animal-chat"
                          name="animalType"
                          value="Chat"
                          checked={formData.animalType === "Chat"}
                          onChange={(e) => setFormData({ ...formData, animalType: e.target.value })}
                        />
                        <label className="fr-label" htmlFor="animal-chat">
                          Chat
                        </label>
                      </div>
                    </div>
                    <div className="fr-fieldset__element fr-fieldset__element--inline">
                      <div className="fr-radio-group">
                        <input
                          type="radio"
                          id="animal-nac"
                          name="animalType"
                          value="NAC"
                          checked={formData.animalType === "NAC"}
                          onChange={(e) => setFormData({ ...formData, animalType: e.target.value })}
                        />
                        <label className="fr-label" htmlFor="animal-nac">
                          NAC
                        </label>
                      </div>
                    </div>
                    {errors.animalType && <p className="fr-error-text">{errors.animalType}</p>}
                  </fieldset>
                </div>

                <div className="fr-fieldset__element">
                  <div className="fr-range-group">
                    <label className="fr-label" htmlFor="garde-animal-poids">
                      Poids de l'animal : {formData.animalPoids} kg
                      <span className="fr-hint-text">
                        {formData.animalPoids < 5
                          ? "Tres petit"
                          : formData.animalPoids < 15
                            ? "Petit"
                            : formData.animalPoids < 30
                              ? "Moyen"
                              : formData.animalPoids < 50
                                ? "Grand"
                                : "Tres grand"}
                      </span>
                    </label>
                    <input
                      className="fr-range"
                      type="range"
                      id="garde-animal-poids"
                      min="1"
                      max="80"
                      value={formData.animalPoids}
                      onChange={(e) => setFormData({ ...formData, animalPoids: Number(e.target.value) })}
                    />
                    <div className="fr-range__output">{formData.animalPoids} kg</div>
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <div className="fr-range-group">
                    <label className="fr-label" htmlFor="garde-animal-age">
                      Age de l'animal : {getAgeLabel(formData.animalAge)}
                    </label>
                    <input
                      className="fr-range"
                      type="range"
                      id="garde-animal-age"
                      min="0"
                      max="20"
                      value={formData.animalAge}
                      onChange={(e) => setFormData({ ...formData, animalAge: Number(e.target.value) })}
                    />
                    <div className="fr-range__output">{formData.animalAge} ans</div>
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.dateDebut ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="garde-date-debut">
                      Date de debut de garde
                      <span className="fr-hint-text">Champ obligatoire</span>
                    </label>
                    <input
                      className="fr-input"
                      type="date"
                      id="garde-date-debut"
                      value={formData.dateDebut}
                      onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {errors.dateDebut && <p className="fr-error-text">{errors.dateDebut}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.dateFin ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="garde-date-fin">
                      Date de fin de garde
                      <span className="fr-hint-text">Champ obligatoire</span>
                    </label>
                    <input
                      className="fr-input"
                      type="date"
                      id="garde-date-fin"
                      value={formData.dateFin}
                      onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                      min={formData.dateDebut || new Date().toISOString().split("T")[0]}
                    />
                    {errors.dateFin && <p className="fr-error-text">{errors.dateFin}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--right">
                    <li>
                      <button type="button" className="fr-btn fr-btn--secondary" onClick={prevStep}>
                        Etape precedente
                      </button>
                    </li>
                    <li>
                      <button type="button" className="fr-btn" onClick={nextStep}>
                        Etape suivante
                      </button>
                    </li>
                  </ul>
                </div>
              </fieldset>
            )}

            {step === 4 && (
              <fieldset className="fr-fieldset">
                <legend className="fr-fieldset__legend">
                  <h3 className="fr-h5">Votre message</h3>
                </legend>

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.message ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="garde-message">
                      Message complementaire
                      <span className="fr-hint-text">
                        Champ obligatoire - {formData.message.length}/1000 caracteres minimum 10
                      </span>
                    </label>
                    <textarea
                      className="fr-input"
                      id="garde-message"
                      rows={5}
                      maxLength={1000}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Decrivez les habitudes de votre animal, ses besoins specifiques, etc."
                    />
                    {errors.message && <p className="fr-error-text">{errors.message}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <div className={`fr-checkbox-group ${errors.rgpd ? "fr-checkbox-group--error" : ""}`}>
                    <input
                      type="checkbox"
                      id="garde-rgpd"
                      checked={formData.rgpd}
                      onChange={(e) => setFormData({ ...formData, rgpd: e.target.checked })}
                    />
                    <label className="fr-label" htmlFor="garde-rgpd">
                      {"J'accepte que mes donnees soient traitees conformement a la politique de confidentialite"}
                    </label>
                    {errors.rgpd && <p className="fr-error-text">{errors.rgpd}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--right">
                    <li>
                      <button type="button" className="fr-btn fr-btn--secondary" onClick={prevStep}>
                        Etape precedente
                      </button>
                    </li>
                    <li>
                      <button type="submit" className="fr-btn" disabled={loading}>
                        {loading ? "Envoi en cours..." : "Envoyer la demande"}
                      </button>
                    </li>
                  </ul>
                </div>
              </fieldset>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
