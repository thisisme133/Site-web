"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/dsfr/header"
import { Footer } from "@/components/dsfr/footer"
import { FollowUs } from "@/components/dsfr/follow-us"

// Mock data for demo - in production this would come from a database
const mockReservations: Record<
  string,
  {
    code: string
    type: "garde" | "comportementaliste"
    nom: string
    email: string
    animalNom: string
    createdAt: string
    status: "pending" | "confirmed" | "cancelled"
    messages: Array<{
      id: string
      content: string
      sender: "client" | "admin"
      createdAt: string
    }>
  }
> = {
  "ABCD1234-MAX": {
    code: "ABCD1234",
    type: "garde",
    nom: "Jean Dupont",
    email: "jean@example.com",
    animalNom: "Max",
    createdAt: "2025-11-28T10:00:00Z",
    status: "confirmed",
    messages: [
      {
        id: "1",
        content: "Bonjour, votre demande de garde pour Max a bien ete recue.",
        sender: "admin",
        createdAt: "2025-11-28T10:30:00Z",
      },
      {
        id: "2",
        content: "Merci ! Est-ce que je peux amener Max le samedi matin ?",
        sender: "client",
        createdAt: "2025-11-28T14:00:00Z",
      },
      {
        id: "3",
        content: "Oui bien sur, le samedi matin a partir de 9h convient parfaitement.",
        sender: "admin",
        createdAt: "2025-11-28T15:00:00Z",
      },
    ],
  },
}

export default function ReservationPage() {
  const [code, setCode] = useState("")
  const [animalPrefix, setAnimalPrefix] = useState("")
  const [error, setError] = useState("")
  const [reservation, setReservation] = useState<(typeof mockReservations)[string] | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [messageSent, setMessageSent] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessageSent(false)

    if (!code || code.length < 4) {
      setError("Veuillez entrer un code de reservation valide")
      return
    }

    if (!animalPrefix || animalPrefix.length < 3) {
      setError("Veuillez entrer les 3 premieres lettres du nom de votre animal")
      return
    }

    // Look for reservation
    const key = `${code.toUpperCase()}-${animalPrefix.toUpperCase()}`
    const found = mockReservations[key]

    if (found) {
      setReservation(found)
    } else {
      setError("Aucune reservation trouvee avec ces informations. Verifiez votre code et le nom de votre animal.")
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    // In production, this would send to an API
    if (reservation) {
      reservation.messages.push({
        id: Date.now().toString(),
        content: newMessage,
        sender: "client",
        createdAt: new Date().toISOString(),
      })
      setNewMessage("")
      setMessageSent(true)
      setTimeout(() => setMessageSent(false), 3000)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="fr-badge fr-badge--success fr-badge--no-icon">Confirmee</span>
      case "pending":
        return <span className="fr-badge fr-badge--info fr-badge--no-icon">En attente</span>
      case "cancelled":
        return <span className="fr-badge fr-badge--error fr-badge--no-icon">Annulee</span>
      default:
        return null
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <Header />

      <main role="main" id="content">
        <div className="fr-container fr-py-6w">
          <h1>Suivre ma reservation</h1>
          <p className="fr-text--lead">
            Entrez votre code de reservation et les 3 premieres lettres du nom de votre animal pour acceder a votre
            espace.
          </p>

          {!reservation ? (
            <div className="fr-grid-row fr-grid-row--center fr-mt-4w">
              <div className="fr-col-12 fr-col-md-6">
                <form onSubmit={handleSearch}>
                  <div className="fr-input-group">
                    <label className="fr-label" htmlFor="code">
                      Code de reservation
                      <span className="fr-hint-text">8 caracteres, recu par email</span>
                    </label>
                    <input
                      className="fr-input"
                      type="text"
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      maxLength={8}
                      style={{ fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}
                    />
                  </div>

                  <div className="fr-input-group fr-mt-3w">
                    <label className="fr-label" htmlFor="animal">
                      3 premieres lettres du nom de votre animal
                      <span className="fr-hint-text">Ex: MAX pour Maxou</span>
                    </label>
                    <input
                      className="fr-input"
                      type="text"
                      id="animal"
                      value={animalPrefix}
                      onChange={(e) => setAnimalPrefix(e.target.value.toUpperCase())}
                      maxLength={3}
                      style={{ fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}
                    />
                  </div>

                  {error && (
                    <div className="fr-alert fr-alert--error fr-mt-3w">
                      <p>{error}</p>
                    </div>
                  )}

                  <button type="submit" className="fr-btn fr-mt-4w">
                    Acceder a ma reservation
                  </button>
                </form>

                <div className="fr-callout fr-mt-6w">
                  <h3 className="fr-callout__title">Vous avez perdu votre code ?</h3>
                  <p className="fr-callout__text">
                    Contactez-nous par telephone au 01 23 45 67 89 ou par email a contact@lespetitsbergers.fr
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="fr-mt-4w">
              <button
                className="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-left-line fr-btn--icon-left fr-mb-4w"
                onClick={() => setReservation(null)}
              >
                Retour
              </button>

              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-4">
                  <div className="fr-card fr-card--grey">
                    <div className="fr-card__body">
                      <div className="fr-card__content">
                        <h2 className="fr-card__title">Reservation {reservation.code}</h2>
                        <div className="fr-card__desc">
                          <p className="fr-mb-1w">
                            <strong>Type :</strong> {reservation.type === "garde" ? "Garde" : "Comportementaliste"}
                          </p>
                          <p className="fr-mb-1w">
                            <strong>Animal :</strong> {reservation.animalNom}
                          </p>
                          <p className="fr-mb-1w">
                            <strong>Date :</strong> {formatDate(reservation.createdAt)}
                          </p>
                          <p className="fr-mb-2w">
                            <strong>Statut :</strong> {getStatusBadge(reservation.status)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="fr-col-12 fr-col-md-8">
                  <h2 className="fr-h4">Messages</h2>

                  <div
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      border: "1px solid var(--border-default-grey)",
                      borderRadius: "0.25rem",
                      padding: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {reservation.messages.length === 0 ? (
                      <p className="fr-text--sm" style={{ color: "var(--text-mention-grey)" }}>
                        Aucun message pour le moment.
                      </p>
                    ) : (
                      reservation.messages.map((msg) => (
                        <div
                          key={msg.id}
                          style={{
                            marginBottom: "1rem",
                            padding: "0.75rem",
                            borderRadius: "0.5rem",
                            backgroundColor:
                              msg.sender === "admin" ? "var(--background-contrast-info)" : "var(--background-alt-grey)",
                            marginLeft: msg.sender === "client" ? "2rem" : "0",
                            marginRight: msg.sender === "admin" ? "2rem" : "0",
                          }}
                        >
                          <p className="fr-text--xs fr-mb-1v" style={{ color: "var(--text-mention-grey)" }}>
                            {msg.sender === "admin" ? "Les Petits Bergers" : "Vous"} - {formatDate(msg.createdAt)}
                          </p>
                          <p className="fr-text--sm" style={{ margin: 0 }}>
                            {msg.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {messageSent && (
                    <div className="fr-alert fr-alert--success fr-mb-3w">
                      <p>Message envoye avec succes</p>
                    </div>
                  )}

                  <form onSubmit={handleSendMessage}>
                    <div className="fr-input-group">
                      <label className="fr-label" htmlFor="message">
                        Envoyer un message
                      </label>
                      <textarea
                        className="fr-input"
                        id="message"
                        rows={3}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ecrivez votre message..."
                      />
                    </div>
                    <button type="submit" className="fr-btn fr-mt-2w">
                      Envoyer
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <FollowUs />
      <Footer />
    </>
  )
}
