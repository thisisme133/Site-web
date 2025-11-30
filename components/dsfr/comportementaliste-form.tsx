"use client"

import type React from "react"

import { useState } from "react"
import { CityAutocomplete } from "./city-autocomplete"
import { COOLE_COORDINATES, calculateDistance, calculateTravelCost, generateReservationCode } from "@/lib/reservation"

interface ComportementalisteFormProps {
  onBack: () => void
}

const services = [
  { id: "consultation-comportement", label: "Consultation comportement", prix: 60 },
  { id: "education-chiot", label: "Education chiot", prix: 50 },
  { id: "education-chien", label: "Education chien adulte", prix: 55 },
  { id: "forfait-3", label: "Forfait 3 seances", prix: 150 },
  { id: "forfait-5", label: "Forfait 5 seances", prix: 240 },
]

export function ComportementalisteForm({ onBack }: ComportementalisteFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    ville: "",
    villeCoordinates: null as { lat: number; lon: number } | null,
    service: "",
    animalNom: "",
    message: "",
    rgpd: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [reservationCode, setReservationCode] = useState("")

  const stepTitles = ["Vos informations", "Type de consultation", "Votre message"]

  const selectedService = services.find((s) => s.id === formData.service)

  const distanceKm = formData.villeCoordinates
    ? calculateDistance(
        COOLE_COORDINATES.lat,
        COOLE_COORDINATES.lon,
        formData.villeCoordinates.lat,
        formData.villeCoordinates.lon,
      )
    : 0
  const travelCost = calculateTravelCost(distanceKm)
  const totalPrice = selectedService ? selectedService.prix + travelCost : 0

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.nom) newErrors.nom = "Le nom est obligatoire"
    if (!formData.email) newErrors.email = "L'email est obligatoire"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Format email invalide"
    if (!formData.telephone) newErrors.telephone = "Le telephone est obligatoire"
    if (!formData.ville) newErrors.ville = "La ville est obligatoire"
    if (!formData.animalNom) newErrors.animalNom = "Le nom de l'animal est obligatoire"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.service) newErrors.service = "Veuillez choisir un service"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.message || formData.message.length < 10)
      newErrors.message = "Le message doit contenir au moins 10 caracteres"
    if (!formData.rgpd) newErrors.rgpd = "Vous devez accepter la politique de confidentialite"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
  }

  const prevStep = () => {
    setStep(step - 1)
    setErrors({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep3()) {
      const code = generateReservationCode()
      setReservationCode(code)
      setSubmitted(true)
    }
  }

  const handleCityChange = (value: string, coordinates?: { lat: number; lon: number }) => {
    setFormData({
      ...formData,
      ville: value,
      villeCoordinates: coordinates || null,
    })
  }

  if (submitted) {
    return (
      <div className="fr-container fr-py-12w">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-lg-8">
            <div className="fr-alert fr-alert--success">
              <h3 className="fr-alert__title">Demande envoyee avec succes</h3>
              <p>Votre demande de rendez-vous a bien ete enregistree. Nous vous contacterons rapidement.</p>
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

          <h1>Rendez-vous comportementaliste</h1>
          <p className="fr-text--lead">Remplissez le formulaire ci-dessous pour prendre rendez-vous</p>

          <div className="fr-mt-4w fr-mb-4w">
            <p className="fr-text--bold">
              Etape {step} sur 3 : {stepTitles[step - 1]}
            </p>
            <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
              {[1, 2, 3].map((s) => (
                <div key={s} className="fr-col-4">
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

          <form onSubmit={handleSubmit} className="fr-mt-4w">
            {step === 1 && (
              <fieldset className="fr-fieldset">
                <legend className="fr-fieldset__legend">
                  <h3 className="fr-h5">Vos informations</h3>
                </legend>

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.nom ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="comport-nom">
                      Nom et prenom
                      <span className="fr-hint-text">Champ obligatoire</span>
                    </label>
                    <input
                      className="fr-input"
                      type="text"
                      id="comport-nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    />
                    {errors.nom && <p className="fr-error-text">{errors.nom}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.email ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="comport-email">
                      Adresse electronique
                      <span className="fr-hint-text">Champ obligatoire - Format attendu : nom@domaine.fr</span>
                    </label>
                    <input
                      className="fr-input"
                      type="email"
                      id="comport-email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {errors.email && <p className="fr-error-text">{errors.email}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.telephone ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="comport-telephone">
                      Telephone
                      <span className="fr-hint-text">Champ obligatoire - Format attendu : 0612345678</span>
                    </label>
                    <input
                      className="fr-input"
                      type="tel"
                      id="comport-telephone"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    />
                    {errors.telephone && <p className="fr-error-text">{errors.telephone}</p>}
                  </div>
                </div>

                <div className="fr-fieldset__element" style={{ position: "relative" }}>
                  <CityAutocomplete
                    id="comport-ville"
                    value={formData.ville}
                    onChange={handleCityChange}
                    error={errors.ville}
                  />
                </div>

                {formData.villeCoordinates && distanceKm > 0 && (
                  <div className="fr-fieldset__element">
                    <div className={`fr-alert ${distanceKm > 20 ? "fr-alert--info" : "fr-alert--success"}`}>
                      <p>
                        Distance depuis Coole (51320) : <strong>{distanceKm} km</strong>
                        {distanceKm > 20 && (
                          <>
                            <br />
                            Frais de deplacement : <strong>{travelCost.toFixed(2)} EUR</strong> (0,50 EUR/km au-dela de
                            20 km)
                          </>
                        )}
                        {distanceKm <= 20 && (
                          <>
                            <br />
                            Pas de frais de deplacement (moins de 20 km)
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.animalNom ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="comport-animal">
                      Nom de votre animal
                      <span className="fr-hint-text">Champ obligatoire - Servira pour le suivi de reservation</span>
                    </label>
                    <input
                      className="fr-input"
                      type="text"
                      id="comport-animal"
                      value={formData.animalNom}
                      onChange={(e) => setFormData({ ...formData, animalNom: e.target.value })}
                    />
                    {errors.animalNom && <p className="fr-error-text">{errors.animalNom}</p>}
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
                  <h3 className="fr-h5">Type de consultation</h3>
                </legend>

                <div className="fr-fieldset__element">
                  <fieldset className="fr-fieldset">
                    <legend className="fr-fieldset__legend">
                      Choisissez un service
                      <span className="fr-hint-text">Champ obligatoire</span>
                    </legend>

                    {services.map((service) => (
                      <div key={service.id} className="fr-fieldset__element">
                        <div className="fr-radio-group">
                          <input
                            type="radio"
                            id={service.id}
                            name="service"
                            value={service.id}
                            checked={formData.service === service.id}
                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          />
                          <label className="fr-label" htmlFor={service.id}>
                            {service.label} - {service.prix} EUR
                          </label>
                        </div>
                      </div>
                    ))}
                    {errors.service && <p className="fr-error-text">{errors.service}</p>}
                  </fieldset>
                </div>

                {selectedService && (
                  <div className="fr-fieldset__element">
                    <div className="fr-callout">
                      <h3 className="fr-callout__title">Estimation tarifaire</h3>
                      <p className="fr-callout__text">
                        {selectedService.label} : {selectedService.prix} EUR
                        {travelCost > 0 && (
                          <>
                            <br />
                            Frais de deplacement ({distanceKm} km) : {travelCost.toFixed(2)} EUR
                          </>
                        )}
                        <br />
                        <strong>Total : {totalPrice.toFixed(2)} EUR</strong>
                      </p>
                    </div>
                  </div>
                )}

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
                  <h3 className="fr-h5">Votre message</h3>
                </legend>

                <div className="fr-fieldset__element">
                  <div className={`fr-input-group ${errors.message ? "fr-input-group--error" : ""}`}>
                    <label className="fr-label" htmlFor="comport-message">
                      Decrivez la situation
                      <span className="fr-hint-text">
                        Champ obligatoire - {formData.message.length}/1000 caracteres minimum 10
                      </span>
                    </label>
                    <textarea
                      className="fr-input"
                      id="comport-message"
                      rows={5}
                      maxLength={1000}
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
                      id="comport-rgpd"
                      checked={formData.rgpd}
                      onChange={(e) => setFormData({ ...formData, rgpd: e.target.checked })}
                    />
                    <label className="fr-label" htmlFor="comport-rgpd">
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
                      <button type="submit" className="fr-btn">
                        Envoyer la demande
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
