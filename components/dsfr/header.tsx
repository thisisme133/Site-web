"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface HeaderProps {
  onShowForm?: (formType: "garde" | "comportementaliste") => void
}

export function Header({ onShowForm }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const htmlEl = document.documentElement
    const currentScheme = htmlEl.getAttribute("data-fr-scheme") as "light" | "dark" | null
    if (currentScheme) {
      setTheme(currentScheme)
    }

    // Check localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      htmlEl.setAttribute("data-fr-scheme", savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.setAttribute("data-fr-scheme", newTheme)
  }

  return (
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top">
                <div className="fr-header__logo">
                  <p className="fr-logo">
                    LES PETITS
                    <br />
                    BERGERS
                  </p>
                </div>
                <div className="fr-header__navbar">
                  <button
                    className="fr-btn--menu fr-btn"
                    data-fr-opened={menuOpen ? "true" : "false"}
                    aria-controls="modal-menu"
                    aria-haspopup="menu"
                    title="Menu"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    Menu
                  </button>
                </div>
              </div>
              <div className="fr-header__service">
                <Link href="/" title="Accueil - Les Petits Bergers">
                  <p className="fr-header__service-title">Les Petits Bergers</p>
                </Link>
                <p className="fr-header__service-tagline">Education - Comportement - Garde</p>
              </div>
            </div>
            <div className="fr-header__tools">
              <div className="fr-header__tools-links">
                <ul className="fr-btns-group">
                  <li>
                    <button
                      className={`fr-btn fr-btn--tertiary ${theme === "light" ? "fr-icon-moon-line" : "fr-icon-sun-line"}`}
                      onClick={toggleTheme}
                      title={theme === "light" ? "Passer en mode sombre" : "Passer en mode clair"}
                      aria-label={theme === "light" ? "Passer en mode sombre" : "Passer en mode clair"}
                    >
                      {theme === "light" ? "Sombre" : "Clair"}
                    </button>
                  </li>
                  <li>
                    <a className="fr-btn fr-icon-phone-line" href="tel:0123456789">
                      Appeler
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`fr-header__menu fr-modal ${menuOpen ? "fr-modal--opened" : ""}`} id="modal-menu">
        <div className="fr-container">
          <button
            className="fr-btn--close fr-btn"
            aria-controls="modal-menu"
            title="Fermer"
            onClick={() => setMenuOpen(false)}
          >
            Fermer
          </button>
          <nav className="fr-nav" role="navigation" aria-label="Menu principal">
            <ul className="fr-nav__list">
              <li className="fr-nav__item">
                <Link className="fr-nav__link" href="/" onClick={() => setMenuOpen(false)}>
                  Accueil
                </Link>
              </li>
              <li className="fr-nav__item">
                <Link className="fr-nav__link" href="/#agenda" onClick={() => setMenuOpen(false)}>
                  Agenda
                </Link>
              </li>
              {onShowForm && (
                <>
                  <li className="fr-nav__item">
                    <button
                      className="fr-nav__link"
                      onClick={() => {
                        onShowForm("garde")
                        setMenuOpen(false)
                      }}
                    >
                      Demande de garde
                    </button>
                  </li>
                  <li className="fr-nav__item">
                    <button
                      className="fr-nav__link"
                      onClick={() => {
                        onShowForm("comportementaliste")
                        setMenuOpen(false)
                      }}
                    >
                      Demande comportementaliste
                    </button>
                  </li>
                </>
              )}
              <li className="fr-nav__item">
                <Link className="fr-nav__link" href="/reservation" onClick={() => setMenuOpen(false)}>
                  Suivre ma reservation
                </Link>
              </li>
              <li className="fr-nav__item">
                <Link className="fr-nav__link" href="/admin" onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
