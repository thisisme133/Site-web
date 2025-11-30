// components/admin/admin-header.tsx
"use client"

import Link from "next/link"

interface AdminHeaderProps {
  userEmail?: string
  onLogout?: () => void
}

export function AdminHeader({ userEmail, onLogout }: AdminHeaderProps) {
  return (
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top">
                <div className="fr-header__logo">
                  <p className="fr-logo">
                    Les Petits
                    <br />Bergers
                  </p>
                </div>
              </div>
              <div className="fr-header__service">
                <Link href="/admin" title="Administration">
                  <p className="fr-header__service-title">Administration</p>
                </Link>
                <p className="fr-header__service-tagline">Gestion des gardes et comportementalisme</p>
              </div>
            </div>
            <div className="fr-header__tools">
              <div className="fr-header__tools-links">
                <ul className="fr-btns-group">
                  <li>
                    <Link href="/" className="fr-btn fr-icon-home-4-line">
                      Retour au site
                    </Link>
                  </li>
                  {userEmail && (
                    <li>
                      <span className="fr-btn fr-btn--secondary fr-icon-user-line fr-btn--icon-left">
                        {userEmail}
                      </span>
                    </li>
                  )}
                  <li>
                    <button className="fr-btn fr-icon-logout-box-r-line" onClick={onLogout}>
                      Deconnexion
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}