"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface CityAutocompleteProps {
  id: string
  value: string
  onChange: (value: string, coordinates?: { lat: number; lon: number }) => void
  error?: string
}

interface Commune {
  nom: string
  code: string
  codeDepartement: string
  codesPostaux: string[]
  centre?: {
    type: string
    coordinates: [number, number] // [lon, lat]
  }
}

export function CityAutocomplete({ id, value, onChange, error }: CityAutocompleteProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<Commune[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchCities = async () => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query)}&boost=population&limit=7&fields=nom,code,codeDepartement,codesPostaux,centre`,
        )
        if (response.ok) {
          const data: Commune[] = await response.json()
          setSuggestions(data)
          setIsOpen(true)
          setHighlightedIndex(-1)
        }
      } catch (error) {
        console.error("Erreur lors de la recherche de communes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchCities, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSelect = (commune: Commune) => {
    const displayValue = `${commune.nom} (${commune.codesPostaux[0] || commune.codeDepartement})`
    setQuery(displayValue)
    if (commune.centre) {
      onChange(displayValue, { lon: commune.centre.coordinates[0], lat: commune.centre.coordinates[1] })
    } else {
      onChange(displayValue)
    }
    setIsOpen(false)
    setSuggestions([])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)
    if (newValue === "") {
      onChange("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0) {
          handleSelect(suggestions[highlightedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        break
    }
  }

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <div className={`fr-input-group ${error ? "fr-input-group--error" : ""}`}>
        <label className="fr-label" htmlFor={id}>
          Ville
          <span className="fr-hint-text">Champ obligatoire - Tapez pour rechercher une commune</span>
        </label>
        <input
          ref={inputRef}
          className="fr-input"
          type="text"
          id={id}
          placeholder="Rechercher une ville..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={`${id}-listbox`}
          aria-activedescendant={highlightedIndex >= 0 ? `${id}-option-${highlightedIndex}` : undefined}
        />
        {error && <p className="fr-error-text">{error}</p>}
        {isLoading && <p className="fr-hint-text fr-mt-1v">Recherche en cours...</p>}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          id={`${id}-listbox`}
          className="fr-menu__list"
          role="listbox"
          style={{
            position: "absolute",
            zIndex: 1000,
            backgroundColor: "var(--background-default-grey)",
            border: "1px solid var(--border-default-grey)",
            borderRadius: "0 0 0.25rem 0.25rem",
            maxHeight: "250px",
            overflowY: "auto",
            width: "100%",
            marginTop: "0",
            listStyle: "none",
            padding: 0,
            boxShadow: "0 8px 16px 0 rgba(0,0,0,.1)",
          }}
        >
          {suggestions.map((commune, index) => (
            <li
              key={commune.code}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={index === highlightedIndex}
            >
              <button
                type="button"
                onClick={() => handleSelect(commune)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  border: "none",
                  background: index === highlightedIndex ? "var(--background-alt-grey)" : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span className="fr-text--bold">{commune.nom}</span>
                <span className="fr-badge fr-badge--sm fr-badge--grey fr-badge--no-icon">
                  {commune.codesPostaux[0] || commune.codeDepartement}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
