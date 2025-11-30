"use client"

import Link from "next/link"

const articles = [
  {
    slug: "education-positive",
    title: "Education Positive",
    description:
      "L'education positive repose sur le renforcement des bons comportements plutot que sur la punition des mauvais. Cette approche scientifiquement validee garantit des resultats durables dans le respect du bien-etre animal.",
    badge: "Methode",
  },
  {
    slug: "approche-personnalisee",
    title: "Approche Personnalisee",
    description:
      "Chaque chien est unique. Une approche personnalisee permet d'adapter les methodes d'education et d'accompagnement aux besoins specifiques de votre compagnon et a votre mode de vie.",
    badge: "Accompagnement",
  },
  {
    slug: "accompagnement-continu",
    title: "Accompagnement Continu",
    description:
      "L'education d'un chien n'est pas un evenement ponctuel mais un processus continu. Un suivi regulier et une disponibilite entre les seances garantissent votre reussite.",
    badge: "Suivi",
  },
]

export function BlogSection() {
  return (
    <section id="blog" className="fr-container fr-py-6w">
      <h2 className="fr-h3 fr-mb-4w">
        <span className="fr-icon-article-line fr-icon--lg fr-mr-1w" aria-hidden="true"></span>
        Ma methode
      </h2>

      <div className="fr-grid-row fr-grid-row--gutters">
        {articles.map((article) => (
          <div key={article.slug} className="fr-col-12 fr-col-md-4">
            <div className="fr-card fr-enlarge-link fr-card--horizontal-tier">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <h3 className="fr-card__title">
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p className="fr-card__desc">{article.description}</p>
                  <div className="fr-card__start">
                    <p className="fr-badge fr-badge--sm fr-badge--green-emeraude">{article.badge}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
