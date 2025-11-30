// components/admin/messagerie-panel.tsx
"use client"

import { useState } from "react"

interface Message {
  id: string
  contenu: string
  expediteur: "admin" | "client"
  date: string
  lu: boolean
}

interface Conversation {
  id: string
  clientNom: string
  clientEmail: string
  chienNom: string
  sujet: string
  dernierMessage: string
  dateLastMessage: string
  nonLus: number
  messages: Message[]
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    clientNom: "Jean Dupont",
    clientEmail: "jean.dupont@email.com",
    chienNom: "Max",
    sujet: "Garde du 15 au 20 decembre",
    dernierMessage: "Merci pour les informations !",
    dateLastMessage: "2025-11-30T10:30:00Z",
    nonLus: 2,
    messages: [
      { id: "1", contenu: "Bonjour, je souhaite reserver une garde pour Max du 15 au 20 decembre. Est-ce possible ?", expediteur: "client", date: "2025-11-28T09:00:00Z", lu: true },
      { id: "2", contenu: "Bonjour Jean, oui c'est tout a fait possible. Max est-il a jour de ses vaccins ?", expediteur: "admin", date: "2025-11-28T10:30:00Z", lu: true },
      { id: "3", contenu: "Oui, il a eu son rappel le mois dernier. Je vous envoie le carnet par mail.", expediteur: "client", date: "2025-11-29T14:00:00Z", lu: true },
      { id: "4", contenu: "Parfait, j'ai bien recu le carnet. La reservation est confirmee.", expediteur: "admin", date: "2025-11-29T16:00:00Z", lu: true },
      { id: "5", contenu: "Merci pour les informations !", expediteur: "client", date: "2025-11-30T10:30:00Z", lu: false },
    ]
  },
  {
    id: "2",
    clientNom: "Marie Martin",
    clientEmail: "marie.martin@email.com",
    chienNom: "Luna",
    sujet: "Question sur la consultation",
    dernierMessage: "A quelle heure puis-je venir ?",
    dateLastMessage: "2025-11-29T15:00:00Z",
    nonLus: 1,
    messages: [
      { id: "1", contenu: "Bonjour, j'ai reserve une consultation pour Luna. A quelle heure puis-je venir ?", expediteur: "client", date: "2025-11-29T15:00:00Z", lu: false },
    ]
  },
  {
    id: "3",
    clientNom: "Pierre Bernard",
    clientEmail: "pierre.bernard@email.com",
    chienNom: "Rocky",
    sujet: "Retour positif",
    dernierMessage: "Rocky se porte tres bien depuis la consultation !",
    dateLastMessage: "2025-11-27T11:00:00Z",
    nonLus: 0,
    messages: [
      { id: "1", contenu: "Rocky se porte tres bien depuis la consultation !", expediteur: "client", date: "2025-11-27T11:00:00Z", lu: true },
      { id: "2", contenu: "Je suis ravie que les conseils aient ete utiles ! N'hesitez pas si vous avez d'autres questions.", expediteur: "admin", date: "2025-11-27T14:00:00Z", lu: true },
    ]
  }
]

export function MessageriePanel() {
  const [conversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return
    // Simulation d'envoi
    setNewMessage("")
  }

  return (
    <div>
      <div className="fr-mb-4w">
        <h1 className="fr-h2">
          <span className="fr-icon-mail-line fr-mr-2w" aria-hidden="true"></span>
          Messagerie
        </h1>
        <p className="fr-text--lead">
          Gerez vos echanges avec les clients
        </p>
      </div>

      <div className="fr-grid-row fr-grid-row--gutters">
        {/* Liste des conversations */}
        <div className="fr-col-12 fr-col-md-4">
          <div className="fr-card fr-card--no-border">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <h3 className="fr-card__title">
                  <span className="fr-icon-chat-3-line fr-mr-1w" aria-hidden="true"></span>
                  Conversations
                </h3>
                <ul className="fr-raw-list">
                  {conversations.map((conv) => (
                    <li key={conv.id} className="fr-mb-2w">
                      <button
                        className={`fr-tile fr-tile--horizontal fr-enlarge-link ${selectedConversation?.id === conv.id ? "fr-tile--grey" : ""}`}
                        onClick={() => setSelectedConversation(conv)}
                      >
                        <div className="fr-tile__body">
                          <div className="fr-tile__content">
                            <h4 className="fr-tile__title">
                              {conv.clientNom}
                              {conv.nonLus > 0 && (
                                <span className="fr-badge fr-badge--info fr-badge--sm fr-ml-1w">
                                  {conv.nonLus}
                                </span>
                              )}
                            </h4>
                            <p className="fr-tile__detail">
                              <span className="fr-icon-user-heart-line fr-icon--sm fr-mr-1v" aria-hidden="true"></span>
                              {conv.chienNom}
                            </p>
                            <p className="fr-tile__desc fr-text--sm">
                              {conv.dernierMessage.substring(0, 40)}...
                            </p>
                            <p className="fr-tile__detail fr-text--xs">
                              {formatDate(conv.dateLastMessage)}
                            </p>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
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
                      {selectedConversation.clientNom} - {selectedConversation.clientEmail}
                    </p>
                  </div>

                  <hr className="fr-hr" />

                  {/* Messages */}
                  <div className="fr-mb-3w" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {selectedConversation.messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`fr-mb-2w fr-p-2w ${message.expediteur === "admin" ? "fr-background-alt--blue-france" : "fr-background-alt--grey"}`}
                        style={{ 
                          borderRadius: "8px",
                          marginLeft: message.expediteur === "admin" ? "20%" : "0",
                          marginRight: message.expediteur === "client" ? "20%" : "0"
                        }}
                      >
                        <p className="fr-text--bold fr-text--sm fr-mb-1v">
                          {message.expediteur === "admin" ? "Vous" : selectedConversation.clientNom}
                        </p>
                        <p className="fr-mb-1v">{message.contenu}</p>
                        <p className="fr-text--xs fr-text--mention-grey">
                          {formatDate(message.date)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Zone de reponse */}
                  <form onSubmit={handleSendMessage}>
                    <div className="fr-input-group">
                      <label className="fr-label" htmlFor="new-message">
                        Votre reponse
                      </label>
                      <textarea
                        className="fr-input"
                        id="new-message"
                        rows={3}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Tapez votre message..."
                      />
                    </div>
                    <div className="fr-btns-group fr-btns-group--inline fr-mt-2w">
                      <button
                        type="submit"
                        className="fr-btn fr-icon-send-plane-line fr-btn--icon-left"
                        disabled={!newMessage.trim()}
                      >
                        Envoyer
                      </button>
                      <button
                        type="button"
                        className="fr-btn fr-btn--tertiary fr-icon-attachment-line fr-btn--icon-left"
                      >
                        Joindre un fichier
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="fr-callout">
              <h3 className="fr-callout__title">
                <span className="fr-icon-chat-3-line fr-mr-1w" aria-hidden="true"></span>
                Selectionnez une conversation
              </h3>
              <p>Cliquez sur une conversation dans la liste pour afficher les messages.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}