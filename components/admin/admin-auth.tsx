"use client"

import { useState } from "react"

interface AdminAuthProps {
  onAuthenticated: (user: AdminUser) => void
}

export interface AdminUser {
  id: string
  email: string
  role: "admin" | "client"
  nom?: string | null
  prenom?: string | null
}

export function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"request" | "verify">("request")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Impossible d'envoyer le code")
      }

      setMessage("Code envoyé ! Consultez votre boite mail pour récupérer le code de connexion.")
      setStep("verify")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Code invalide")
      }

      if (data.user.role !== "admin") {
        throw new Error("Vous n'avez pas accès à l'administration")
      }

      const user: AdminUser = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        nom: data.user.nom,
        prenom: data.user.prenom,
      }

      onAuthenticated(user)
      setMessage("Connexion réussie !")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fr-container fr-py-6w">
      <div className="fr-grid-row fr-grid-row--center">
        <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
          <div className="fr-card fr-card--no-border fr-card--shadow">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <h1 className="fr-card__title">Connexion administrateur</h1>
                <p className="fr-card__desc">
                  Connectez-vous avec votre email professionnel pour recevoir un code à usage unique.
                </p>

                {error && (
                  <div className="fr-alert fr-alert--error fr-mb-3w">
                    <p>{error}</p>
                  </div>
                )}

                {message && (
                  <div className="fr-alert fr-alert--success fr-mb-3w">
                    <p>{message}</p>
                  </div>
                )}

                {step === "request" && (
                  <form onSubmit={handleRequestCode} className="fr-mt-3w">
                    <div className="fr-input-group">
                      <label className="fr-label" htmlFor="admin-email">
                        Email professionnel
                      </label>
                      <input
                        className="fr-input"
                        id="admin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>

                    <button className="fr-btn fr-mt-3w" type="submit" disabled={loading}>
                      {loading ? "Envoi en cours..." : "Recevoir un code"}
                    </button>
                  </form>
                )}

                {step === "verify" && (
                  <form onSubmit={handleVerifyCode} className="fr-mt-3w">
                    <div className="fr-input-group">
                      <label className="fr-label" htmlFor="admin-code">
                        Code de connexion (6 chiffres)
                        <span className="fr-hint-text">Vérifiez vos emails pour récupérer le code.</span>
                      </label>
                      <input
                        className="fr-input"
                        id="admin-code"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        pattern="[0-9]{6}"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                      />
                    </div>

                    <div className="fr-btns-group fr-btns-group--inline-md fr-mt-3w">
                      <button className="fr-btn" type="submit" disabled={loading}>
                        {loading ? "Vérification..." : "Se connecter"}
                      </button>
                      <button
                        className="fr-btn fr-btn--secondary"
                        type="button"
                        onClick={() => setStep("request")}
                        disabled={loading}
                      >
                        Renvoyer le code
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
