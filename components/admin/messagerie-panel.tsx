// components/admin/messagerie-panel.tsx
"use client"

import React, { useState, useEffect, useRef } from "react"

interface Message {
  id: string
  contenu: string
  expediteur_type: "admin" | "client"
  expediteur_nom: string
  created_at: string
  lu: boolean
  pieces_jointes?: any[]
}

interface Conversation {
  id: string
  conversationId: string
  reservationId: string
  clientNom: string
  clientPrenom: string | null
  animalNom: string
  sujet: string
  dernierMessage: string
  derniereActivite: string
  messagesNonLus: number
  statut: string
}

export function MessageriePanel() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [filtreStatut, setFiltreStatut] = useState<string>('tous')
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState("")
  const [actionAttachments, setActionAttachments] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const actionFileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Charger les conversations
  useEffect(() => {
    fetchConversations()
  }, [])

  // Scroller vers le bas quand les messages changent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Charger les messages quand une conversation est sélectionnée
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.reservationId)
      markAsRead(selectedConversation.conversationId)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/messages/conversations')
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des conversations')
      }
      const data = await response.json()
      setConversations(data)
      setError(null)
    } catch (err) {
      console.error('Erreur:', err)
      setError('Impossible de charger les conversations')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/messages?reservation_id=${reservationId}`)
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des messages')
      }
      const data = await response.json()
      setMessages(data)
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const handleReservationAction = async (action: 'accepter' | 'refuser' | 'demander_infos') => {
    if (!selectedConversation) return

    try {
      setUpdatingStatus(true)
      setActionError(null)
      const response = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedConversation.reservationId,
          action,
          message: actionMessage || undefined,
          piecesJointes: actionAttachments,
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Impossible de mettre à jour la réservation')
      }

      setActionSuccess('Réservation mise à jour')
      setSelectedConversation(prev => prev ? { ...prev, statut: data.statut } : prev)
      setActionMessage("")
      setActionAttachments([])
      await fetchMessages(selectedConversation.reservationId)
      await fetchConversations()
      setTimeout(() => setActionSuccess(null), 3000)
    } catch (err) {
      console.error('Erreur:', err)
      setActionError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const markAsRead = async (conversationId: string) => {
    try {
      await fetch('/api/messages/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId })
      })
      // Rafraîchir les conversations pour mettre à jour les compteurs
      fetchConversations()
    } catch (err) {
      console.error('Erreur marquer comme lu:', err)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      setSendingMessage(true)
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: selectedConversation.conversationId,
          reservation_id: selectedConversation.reservationId,
          expediteur_type: 'admin',
          expediteur_nom: 'Admin',
          contenu: newMessage,
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message')
      }

      setNewMessage("")
      // Recharger les messages
      await fetchMessages(selectedConversation.reservationId)
      await fetchConversations()
    } catch (err) {
      console.error('Erreur:', err)
      alert('Impossible d\'envoyer le message')
    } finally {
      setSendingMessage(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingFile(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/messages/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload du fichier')
      }

      const data = await response.json()

      // Ajouter le fichier comme message
      if (selectedConversation) {
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversation_id: selectedConversation.conversationId,
            reservation_id: selectedConversation.reservationId,
            expediteur_type: 'admin',
            expediteur_nom: 'Admin',
            contenu: `📎 Fichier joint: ${data.nom}`,
            pieces_jointes: [data]
          })
        })

        await fetchMessages(selectedConversation.reservationId)
      }
    } catch (err) {
      console.error('Erreur:', err)
      alert('Impossible de téléverser le fichier')
    } finally {
      setUploadingFile(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleActionFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingFile(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/messages/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload du fichier')
      }

      const data = await response.json()
      setActionAttachments((prev) => [...prev, data])
    } catch (err) {
      console.error('Erreur:', err)
      setActionError('Impossible d\'ajouter la pièce jointe')
    } finally {
      setUploadingFile(false)
      if (actionFileInputRef.current) {
        actionFileInputRef.current.value = ''
      }
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return `Aujourd'hui ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffDays === 1) {
      return `Hier ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
    } else {
      return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    }
  }

  const renderStatutBadge = (statut: string) => {
    switch (statut) {
      case 'confirmee':
        return <span className="fr-badge fr-badge--success fr-badge--no-icon">Confirmée</span>
      case 'annulee':
        return <span className="fr-badge fr-badge--error fr-badge--no-icon">Refusée</span>
      case 'en_attente':
      default:
        return <span className="fr-badge fr-badge--info fr-badge--no-icon">En attente</span>
    }
  }

  const conversationsFiltrees = conversations.filter((conv) =>
    filtreStatut === 'tous' ? true : conv.statut === filtreStatut
  )

  return (
    <div>
      <div className="fr-mb-4w">
        <h1 className="fr-h2">
          <span className="fr-icon-mail-line fr-mr-2w" aria-hidden="true"></span>
          Messagerie
        </h1>
        <p className="fr-text--lead">
          Gérez vos échanges avec les clients et gardez la trace des décisions sur les réservations.
        </p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="fr-alert fr-alert--error fr-mb-4w">
          <p>{error}</p>
          <button className="fr-btn fr-btn--sm" onClick={fetchConversations}>
            Réessayer
          </button>
        </div>
      )}

      {/* Indicateur de chargement */}
      {loading && (
        <div className="fr-mb-4w" style={{ textAlign: 'center' }}>
          <p>Chargement des conversations...</p>
        </div>
      )}

      {!loading && (
        <div className="fr-grid-row fr-grid-row--gutters">
          {/* Liste des conversations */}
          <div className="fr-col-12 fr-col-md-4">
            <div className="fr-card fr-card--no-border">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <div className="fr-grid-row fr-grid-row--middle fr-grid-row--gutters fr-mb-2w">
                    <div className="fr-col">
                      <h3 className="fr-card__title fr-mb-0">
                        <span className="fr-icon-chat-3-line fr-mr-1w" aria-hidden="true"></span>
                        Conversations ({conversationsFiltrees.length}/{conversations.length})
                      </h3>
                    </div>
                    <div className="fr-col-auto">
                      <label className="fr-label" htmlFor="filtre-statut">Statut</label>
                      <select
                        id="filtre-statut"
                        className="fr-select"
                        value={filtreStatut}
                        onChange={(e) => setFiltreStatut(e.target.value)}
                      >
                        <option value="tous">Tous</option>
                        <option value="en_attente">En attente</option>
                        <option value="confirmee">Confirmée</option>
                        <option value="annulee">Refusée</option>
                      </select>
                    </div>
                  </div>

                  {conversationsFiltrees.length === 0 ? (
                    <p className="fr-text--sm">Aucune conversation dans ce statut</p>
                  ) : (
                    <ul className="fr-raw-list fr-p-0" style={{ maxHeight: '520px', overflowY: 'auto' }}>
                      {conversationsFiltrees.map((conv) => (
                        <li key={conv.id} className="fr-mb-2w">
                          <button
                            className={`fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-btn--sm fr-btn--full ${selectedConversation?.id === conv.id ? 'fr-btn--secondary' : ''}`}
                            style={{ justifyContent: 'flex-start', textAlign: 'left', whiteSpace: 'normal' }}
                            onClick={() => setSelectedConversation(conv)}
                          >
                            <span className="fr-icon-user-heart-line" aria-hidden="true"></span>
                            <span className="fr-ml-1w">
                              <span className="fr-text--bold">{conv.clientNom}</span>
                              <span className="fr-text--sm fr-text-mention--grey"> · {conv.animalNom}</span>
                              <div className="fr-text--xs fr-mt-1v">
                                {renderStatutBadge(conv.statut)}
                                <span className="fr-ml-1w">{formatDate(conv.derniereActivite)}</span>
                                {conv.messagesNonLus > 0 && (
                                  <span className="fr-badge fr-badge--info fr-badge--sm fr-ml-1w">{conv.messagesNonLus}</span>
                                )}
                              </div>
                              <div className="fr-text--sm fr-mt-1v" style={{ color: '#3a3a3a' }}>
                                {conv.dernierMessage.length > 60
                                  ? `${conv.dernierMessage.substring(0, 60)}...`
                                  : conv.dernierMessage || 'Pas encore de message'}
                              </div>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Zone de conversation */}
          <div className="fr-col-12 fr-col-md-8">
            {selectedConversation ? (
              <div className="fr-card fr-card--no-border">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    {/* En-tete */}
                    <div className="fr-mb-3w">
                      <h3 className="fr-h5 fr-mb-1v">{selectedConversation.sujet}</h3>
                      <p className="fr-text--sm">
                        <span className="fr-icon-user-line fr-icon--sm fr-mr-1v" aria-hidden="true"></span>
                        {selectedConversation.clientNom} {selectedConversation.clientPrenom || ''} - {selectedConversation.animalNom}
                      </p>
                    </div>

                    <hr className="fr-hr" />

                    <div className="fr-grid-row fr-grid-row--gutters fr-mb-3w">
                      <div className="fr-col-12 fr-col-md-4">
                        <p className="fr-text--sm fr-mb-1v">Statut</p>
                        {renderStatutBadge(selectedConversation.statut)}
                      </div>
                      <div className="fr-col-12 fr-col-md-8">
                        <div className="fr-btns-group fr-btns-group--inline fr-btns-group--right">
                          <button
                            type="button"
                            className="fr-btn fr-icon-check-line fr-btn--icon-left"
                            onClick={() => handleReservationAction('accepter')}
                            disabled={updatingStatus}
                          >
                            Accepter
                          </button>
                          <button
                            type="button"
                            className="fr-btn fr-btn--secondary fr-icon-close-line fr-btn--icon-left"
                            onClick={() => handleReservationAction('refuser')}
                            disabled={updatingStatus}
                          >
                            Refuser
                          </button>
                          <button
                            type="button"
                            className="fr-btn fr-btn--tertiary-no-outline fr-icon-mail-line fr-btn--icon-left"
                            onClick={() => handleReservationAction('demander_infos')}
                            disabled={updatingStatus}
                          >
                            Infos complémentaires
                          </button>
                        </div>
                      </div>
                    </div>

                    {actionError && (
                      <div className="fr-alert fr-alert--error fr-mb-3w">
                        <p>{actionError}</p>
                      </div>
                    )}

                    {actionSuccess && (
                      <div className="fr-alert fr-alert--success fr-mb-3w">
                        <p>{actionSuccess}</p>
                      </div>
                    )}

                    <div className="fr-grid-row fr-grid-row--gutters fr-mb-3w">
                      <div className="fr-col-12 fr-col-md-8">
                        <div className="fr-input-group">
                          <label className="fr-label" htmlFor="action-message">
                            Message au client (optionnel)
                          </label>
                          <textarea
                            className="fr-input"
                            id="action-message"
                            rows={3}
                            placeholder="Précisez les conditions ou les informations demandées"
                            value={actionMessage}
                            onChange={(e) => setActionMessage(e.target.value)}
                            disabled={updatingStatus}
                          />
                        </div>
                        {actionAttachments.length > 0 && (
                          <ul className="fr-raw-list fr-text--sm fr-mb-2w">
                            {actionAttachments.map((piece, idx) => (
                              <li key={idx}>
                                <span className="fr-icon-attachment-line fr-mr-1v" aria-hidden="true"></span>
                                {piece.nom || piece.name || `Fichier ${idx + 1}`}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="fr-upload-group">
                          <label className="fr-label" htmlFor="action-piece-jointe">
                            Ajouter une pièce jointe (optionnel)
                          </label>
                          <input
                            className="fr-upload"
                            type="file"
                            id="action-piece-jointe"
                            ref={actionFileInputRef}
                            onChange={handleActionFileUpload}
                            disabled={updatingStatus || uploadingFile}
                          />
                          <p className="fr-hint-text">Utilisez cette option pour joindre un document lors d'une demande d'informations.</p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="fr-mb-3w" style={{ maxHeight: "400px", overflowY: "auto" }}>
                      {messages.length === 0 ? (
                        <p className="fr-text--sm">Aucun message</p>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`fr-mb-2w fr-p-2w ${message.expediteur_type === "admin" ? "fr-background-alt--blue-france" : "fr-background-alt--grey"}`}
                            style={{
                              borderRadius: "8px",
                              marginLeft: message.expediteur_type === "admin" ? "20%" : "0",
                              marginRight: message.expediteur_type === "client" ? "20%" : "0"
                            }}
                          >
                            <p className="fr-text--bold fr-text--sm fr-mb-1v">
                              {message.expediteur_type === "admin" ? "Vous" : message.expediteur_nom}
                            </p>
                            <p className="fr-mb-1v">{message.contenu}</p>
                            <p className="fr-text--xs fr-text--mention-grey">
                              {formatDate(message.created_at)}
                            </p>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Zone de reponse */}
                    <form onSubmit={handleSendMessage}>
                      <div className="fr-input-group">
                        <label className="fr-label" htmlFor="new-message">
                          Votre réponse
                        </label>
                        <textarea
                          className="fr-input"
                          id="new-message"
                          rows={3}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Tapez votre message..."
                          disabled={sendingMessage}
                        />
                      </div>
                      <div className="fr-btns-group fr-btns-group--inline fr-mt-2w">
                        <button
                          type="submit"
                          className="fr-btn fr-icon-send-plane-line fr-btn--icon-left"
                          disabled={!newMessage.trim() || sendingMessage}
                        >
                          {sendingMessage ? 'Envoi...' : 'Envoyer'}
                        </button>
                        <button
                          type="button"
                          className="fr-btn fr-btn--tertiary fr-icon-attachment-line fr-btn--icon-left"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingFile}
                        >
                          {uploadingFile ? 'Téléversement...' : 'Joindre un fichier'}
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          style={{ display: 'none' }}
                          onChange={handleFileUpload}
                          accept="image/*,.pdf,.doc,.docx"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <div className="fr-callout">
                <h3 className="fr-callout__title">
                  <span className="fr-icon-chat-3-line fr-mr-1w" aria-hidden="true"></span>
                  Sélectionnez une conversation
                </h3>
                <p>Cliquez sur une conversation dans la liste pour afficher les messages.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
