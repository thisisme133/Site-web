export function Footer() {
  return (
    <footer className="fr-footer" role="contentinfo" id="footer">
      <div className="fr-container">
        <div className="fr-footer__body">
          <div className="fr-footer__brand fr-enlarge-link">
            <a href="#top" title="Retour à l'accueil">
              <p className="fr-logo">
                LES PETITS
                <br />
                BERGERS
              </p>
            </a>
          </div>
          <div className="fr-footer__content">
            <p className="fr-footer__content-desc">
              Les Petits Bergers - Comportementaliste canin et garde d'animaux de compagnie à Coole. Interventions à
              domicile dans la Marne (51), Haute-Marne (52) et les Ardennes (08). ACACED 2025.
            </p>
            <ul className="fr-footer__content-list">
              <li className="fr-footer__content-item">
                <a className="fr-footer__content-link" href="tel:0123456789">
                  Téléphone : 01 23 45 67 89
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a className="fr-footer__content-link" href="mailto:contact@lespetitsbergers.fr">
                  Email : contact@lespetitsbergers.fr
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="fr-footer__bottom">
          <ul className="fr-footer__bottom-list">
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="#">
                Mentions légales
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="#">
                Données personnelles
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="#">
                Accessibilité : non conforme
              </a>
            </li>
          </ul>
          <div className="fr-footer__bottom-copy">
            <p>2025 Les Petits Bergers - Tous droits réservés</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
