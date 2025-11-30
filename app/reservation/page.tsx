"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/dsfr/header"
import { Footer } from "@/components/dsfr/footer"
import { FollowUs } from "@/components/dsfr/follow-us"

interface Reservation {
  id: string
  code: string
  type: "garde" | "comportementaliste"
  client_nom: string
  client_email: string
  animal_nom: string
  created_at: string
  statut: string
}

interface Message {
  id: string
  contenu: string
  expediteur_type: "client" | "admin"
  created_at: string
  expediteur_nom: string
}

export default function ReservationPage() {
  const [code, setCode] = useState("")
  const [animalPrefix, setAnimalPrefix] = useState("")
  const [error, setError] = useState("")
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [messageSent, setMessageSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessageSent(false)
    setReservation(null)
    setMessages([])

    if (!code || code.length < 4) {
      setError("Veuillez entrer un code de reservation valide")
      return
    }

    if (!animalPrefix || animalPrefix.length < 3) {
      setError("Veuillez entrer les 3 premieres lettres du nom de votre animal")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/reservations?code=${code.toUpperCase()}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Aucune reservation trouvee")
      }

      if (!data?.animal_nom || !data.animal_nom.toUpperCase().startsWith(animalPrefix.toUpperCase())) {
        throw new Error("Aucune reservation trouvee avec ces informations. Verifiez votre code et le nom de votre animal.")
      }

      setReservation(data)
      await fetchMessages(data.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue")
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (reservationId: string) => {
    try {
      const resp = await fetch(`/api/messages?reservation_id=${reservationId}`)
      if (!resp.ok) return
      const data = await resp.json()
      setMessages(data)
    } catch (err) {
      console.error("Erreur lors du chargement des messages", err)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !reservation) return

    setSending(true)
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: `reservation-${reservation.id}`,
          reservation_id: reservation.id,
          expediteur_type: "client",
          expediteur_nom: reservation.client_nom,
          contenu: newMessage.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Impossible d'envoyer votre message")
      }

      setNewMessage("")
      setMessageSent(true)
      await fetchMessages(reservation.id)
      setTimeout(() => setMessageSent(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi du message")
    } finally {
      setSending(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmee":
        return <span className="fr-badge fr-badge--success fr-badge--no-icon">Confirmee</span>
      case "en_attente":
        return <span className="fr-badge fr-badge--info fr-badge--no-icon">En attente</span>
      case "annulee":
        return <span className="fr-badge fr-badge--error fr-badge--no-icon">Annulee</span>
      default:
        return <span className="fr-badge fr-badge--new fr-badge--no-icon">En cours</span>
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

                  <button type="submit" className="fr-btn fr-mt-4w" disabled={loading}>
                    {loading ? "Recherche..." : "Acceder a ma reservation"}
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
                            <strong>Animal :</strong> {reservation.animal_nom}
                          </p>
                          <p className="fr-mb-1w">
                            <strong>Date :</strong> {formatDate(reservation.created_at)}
                          </p>
                          <p className="fr-mb-2w">
                            <strong>Statut :</strong> {getStatusBadge(reservation.statut)}
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
                    {messages.length === 0 ? (
                      <p className="fr-text--sm" style={{ color: "var(--text-mention-grey)" }}>
                        Aucun message pour le moment.
                      </p>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          style={{
                            marginBottom: "1rem",
                            padding: "0.75rem",
                            borderRadius: "0.5rem",
                            backgroundColor:
                              msg.expediteur_type === "admin"
                                ? "var(--background-contrast-info)"
                                : "var(--background-alt-grey)",
                            marginLeft: msg.expediteur_type === "client" ? "2rem" : "0",
                            marginRight: msg.expediteur_type === "admin" ? "2rem" : "0",
                          }}
                        >
                          <p className="fr-text--xs fr-mb-1v" style={{ color: "var(--text-mention-grey)" }}>
                            {msg.expediteur_type === "admin" ? "Les Petits Bergers" : "Vous"} - {formatDate(msg.created_at)}
                          </p>
                          <p className="fr-text--sm" style={{ margin: 0 }}>
                            {msg.contenu}
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
                    <button type="submit" className="fr-btn fr-mt-2w" disabled={sending}>
                      {sending ? "Envoi en cours..." : "Envoyer"}
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
