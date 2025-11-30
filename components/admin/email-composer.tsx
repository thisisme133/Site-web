// components/admin/email-composer.tsx
"use client"

import { useState } from "react"

interface EmailTemplate {
  id: string
  nom: string
  sujet: string
  contenu: string
}

const templatesInitiaux: EmailTemplate[] = [
  {
    id: "1",
    nom: "Confirmation de garde",
    sujet: "Confirmation de votre reservation de garde - Les Petits Bergers",
    contenu: `Bonjour [NOM_CLIENT],

Nous avons le plaisir de vous confirmer la reservation de garde pour [NOM_CHIEN].

Details de la garde :
- Date de debut : [DATE_DEBUT]
- Date de fin : [DATE_FIN]
- Duree : [DUREE] jours

Merci de nous contacter si vous avez des questions.

Cordialement,
Les Petits Bergers`
  },
  {
    id: "2",
    nom: "Rappel de rendez-vous",
    sujet: "Rappel : votre rendez-vous comportementaliste approche",
    contenu: `Bonjour [NOM_CLIENT],

Nous vous rappelons votre rendez-vous de consultation comportementaliste prevu le [DATE_RDV] a [HEURE_RDV].

Adresse : [ADRESSE]

A bientot,
Les Petits Bergers`
  },
  {
    id: "3",
    nom: "Facture",
    sujet: "Votre facture - Les Petits Bergers",
    contenu: `Bonjour [NOM_CLIENT],

Veuillez trouver ci-joint la facture n°[NUMERO_FACTURE] d'un montant de [MONTANT] EUR.

Date d'echeance : [DATE_ECHEANCE]

Merci pour votre confiance.

Cordialement,
Les Petits Bergers`
  }
]

export function EmailComposer() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(templatesInitiaux)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [destinataire, setDestinataire] = useState("")
  const [sujet, setSujet] = useState("")
  const [contenu, setContenu] = useState("")
  const [editingTemplate, setEditingTemplate] = useState(false)
  const [messageSent, setMessageSent] = useState(false)

  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(template)
      setSujet(template.sujet)
      setContenu(template.contenu)
    }
  }

  const handleSaveTemplate = () => {
    if (selectedTemplate) {
      setTemplates(prev => prev.map(t => 
        t.id === selectedTemplate.id 
          ? { ...t, sujet, contenu }
          : t
      ))
      setEditingTemplate(false)
    }
  }

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulation d'envoi
    setMessageSent(true)
    setTimeout(() => setMessageSent(false), 5000)
  }

  return (
    <div>
      <div className="fr-mb-4w">
        <h1 className="fr-h2">
          <span className="fr-icon-send-plane-line fr-mr-2w" aria-hidden="true"></span>
          Envoyer un email
        </h1>
        <p className="fr-text--lead">
          Utilisez les modeles pre-enregistres ou personnalisez votre message
        </p>
      </div>

      {messageSent && (
        <div className="fr-alert fr-alert--success fr-mb-4w">
          <h3 className="fr-alert__title">Email envoye</h3>
          <p>Votre message a ete envoye avec succes a {destinataire}.</p>
        </div>
      )}

      <div className="fr-grid-row fr-grid-row--gutters">
        {/* Liste des templates */}
        <div className="fr-col-12 fr-col-md-4">
          <div className="fr-card fr-card--no-border">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <h3 className="fr-card__title">
                  <span className="fr-icon-file-text-line fr-mr-1w" aria-hidden="true"></span>
                  Modeles
                </h3>
                <ul className="fr-raw-list">
                  {templates.map((template) => (
                    <li key={template.id} className="fr-mb-2w">
                      <button
                        className={`fr-btn fr-btn--tertiary ${selectedTemplate?.id === template.id ? "fr-btn--icon-left fr-icon-check-line" : ""}`}
                        onClick={() => handleSelectTemplate(template.id)}
                      >
                        {template.nom}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  className="fr-btn fr-btn--secondary fr-btn--sm fr-icon-add-line fr-btn--icon-left fr-mt-2w"
                >
                  Nouveau modele
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Editeur d'email */}
        <div className="fr-col-12 fr-col-md-8">
          <form onSubmit={handleSendEmail}>
            <fieldset className="fr-fieldset fr-mb-4w">
              <legend className="fr-fieldset__legend">
                <h2 className="fr-h5">Composer l'email</h2>
              </legend>
              <div className="fr-fieldset__content">
                <div className="fr-input-group fr-mb-3w">
                  <label className="fr-label" htmlFor="destinataire">
                    Destinataire
                    <span className="fr-hint-text">Adresse email du client</span>
                  </label>
                  <div className="fr-input-wrap fr-icon-mail-line">
                    <input
                      className="fr-input"
                      type="email"
                      id="destinataire"
                      value={destinataire}
                      onChange={(e) => setDestinataire(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="fr-input-group fr-mb-3w">
                  <label className="fr-label" htmlFor="sujet">
                    Sujet
                  </label>
                  <input
                    className="fr-input"
                    type="text"
                    id="sujet"
                    value={sujet}
                    onChange={(e) => setSujet(e.target.value)}
                    required
                  />
                </div>

                <div className="fr-input-group fr-mb-3w">
                  <label className="fr-label" htmlFor="contenu">
                    Message
                    <span className="fr-hint-text">
                      Variables disponibles : [NOM_CLIENT], [NOM_CHIEN], [DATE_DEBUT], [DATE_FIN], etc.
                    </span>
                  </label>
                  <textarea
                    className="fr-input"
                    id="contenu"
                    rows={12}
                    value={contenu}
                    onChange={(e) => setContenu(e.target.value)}
                    required
                  />
                </div>

                {selectedTemplate && (
                  <div className="fr-btns-group fr-btns-group--inline fr-mb-3w">
                    {editingTemplate ? (
                      <>
                        <button
                          type="button"
                          className="fr-btn fr-btn--sm fr-btn--secondary fr-icon-save-line fr-btn--icon-left"
                          onClick={handleSaveTemplate}
                        >
                          Enregistrer le modele
                        </button>
                        <button
                          type="button"
                          className="fr-btn fr-btn--sm fr-btn--tertiary"
                          onClick={() => {
                            setSujet(selectedTemplate.sujet)
                            setContenu(selectedTemplate.contenu)
                            setEditingTemplate(false)
                          }}
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="fr-btn fr-btn--sm fr-btn--tertiary fr-icon-edit-line fr-btn--icon-left"
                        onClick={() => setEditingTemplate(true)}
                      >
                        Modifier le modele
                      </button>
                    )}
                  </div>
                )}
              </div>
            </fieldset>

            <div className="fr-btns-group fr-btns-group--inline">
              <button
                type="submit"
                className="fr-btn fr-icon-send-plane-line fr-btn--icon-left"
              >
                Envoyer
              </button>
              <button
                type="button"
                className="fr-btn fr-btn--secondary fr-icon-eye-line fr-btn--icon-left"
              >
                Apercu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}