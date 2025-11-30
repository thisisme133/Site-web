"use client"

interface ServiceCardsProps {
  onShowForm: (formType: "garde" | "comportementaliste") => void
}

export function ServiceCards({ onShowForm }: ServiceCardsProps) {
  return (
    <div className="fr-container fr-py-12w">
      <div className="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
        <div className="fr-col-12 fr-col-md-6 fr-col-lg-5">
          <div className="fr-card fr-enlarge-link">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <h2 className="fr-card__title">
                  <button onClick={() => onShowForm("garde")}>{"Garde d'animaux"}</button>
                </h2>
                <p className="fr-card__desc">
                  Confiez votre animal a un professionnel ACACED. Garde a domicile dans un environnement securise et
                  adapte.
                </p>
              </div>
            </div>
            <div className="fr-card__header">
              <div className="fr-card__img">
                <img className="fr-responsive-img" src="/dog-and-cat-pet-sitting-home.jpg" alt="Garde d'animaux" />
              </div>
            </div>
          </div>
        </div>
        <div className="fr-col-12 fr-col-md-6 fr-col-lg-5">
          <div className="fr-card fr-enlarge-link">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <h2 className="fr-card__title">
                  <button onClick={() => onShowForm("comportementaliste")}>Comportementaliste canin</button>
                </h2>
                <p className="fr-card__desc">
                  Consultations a domicile pour resoudre les troubles du comportement. Methodes positives et
                  bienveillantes.
                </p>
              </div>
            </div>
            <div className="fr-card__header">
              <div className="fr-card__img">
                <img className="fr-responsive-img" src="/dog-training-behavior-specialist.jpg" alt="Comportementaliste canin" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
