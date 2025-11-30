import Link from "next/link"
import { Header } from "@/components/dsfr/header"
import { Footer } from "@/components/dsfr/footer"
import { FollowUs } from "@/components/dsfr/follow-us"

const articles: Record<
  string,
  {
    title: string
    metaDescription: string
    lead: string
    sections: Array<{
      title: string
      content: string
      type?: "callout" | "alert" | "highlight" | "cards"
      calloutTitle?: string
      alertType?: "info" | "warning" | "success"
      cards?: Array<{ title: string; items: string[] }>
    }>
    relatedLinks: Array<{ href: string; label: string }>
    calloutTitle: string
    calloutText: string
  }
> = {
  "education-positive": {
    title: "Education Positive",
    metaDescription:
      "L'education positive : methodes basees sur le renforcement positif et le respect du bien-etre animal pour des resultats durables.",
    lead: "L'education positive repose sur le renforcement des bons comportements plutot que sur la punition des mauvais. Cette approche scientifiquement validee garantit des resultats durables dans le respect du bien-etre animal.",
    sections: [
      {
        title: "Qu'est-ce que l'education positive ?",
        content:
          "L'education positive, egalement appelee education bienveillante, est une methode d'apprentissage qui s'appuie sur les principes scientifiques du conditionnement operant et du renforcement positif. Elle consiste a recompenser les comportements souhaites plutot qu'a punir les comportements indesirables.",
      },
      {
        title: "Pourquoi l'education positive ?",
        type: "callout",
        calloutTitle: "Pourquoi l'education positive ?",
        content:
          "Les etudes scientifiques demontrent que les methodes positives generent moins de stress chez l'animal, renforcent le lien avec le proprietaire et produisent des resultats plus stables dans le temps.",
      },
      {
        title: "Les principes fondamentaux",
        content:
          "Le renforcement positif consiste a recompenser immediatement le chien lorsqu'il adopte un comportement souhaite. La recompense peut etre une friandise, des caresses, des felicitations verbales ou un jeu. Chaque chien apprend a son rythme. L'education positive respecte ce temps d'apprentissage individuel et progresse par paliers, sans forcer ni brusquer l'animal.",
      },
      {
        title: "Ce que l'education positive n'est pas",
        type: "alert",
        alertType: "warning",
        content:
          "L'education positive n'est pas du laxisme. Elle fixe des regles claires et coherentes, mais les enseigne de maniere bienveillante. Elle exclut les colliers etrangleurs, les colliers electriques, les techniques de dominance et les punitions physiques.",
      },
      {
        title: "Les benefices de l'education positive",
        type: "cards",
        content: "",
        cards: [
          {
            title: "Pour le chien",
            items: [
              "Moins de stress et d'anxiete",
              "Meilleure confiance en soi",
              "Apprentissage plus rapide",
              "Comportements plus stables",
              "Bien-etre psychologique",
            ],
          },
          {
            title: "Pour le proprietaire",
            items: [
              "Relation de confiance renforcee",
              "Communication amelioree",
              "Plaisir partage",
              "Resultats durables",
              "Satisfaction personnelle",
            ],
          },
        ],
      },
      {
        title: "Validations scientifiques",
        type: "highlight",
        content:
          "Les etudes publiees dans le Journal of Veterinary Behavior demontrent que les methodes basees sur la recompense sont plus efficaces que les methodes coercitives pour l'apprentissage et le bien-etre du chien.",
      },
    ],
    relatedLinks: [
      { href: "/blog/approche-personnalisee", label: "Approche personnalisee" },
      { href: "/blog/accompagnement-continu", label: "Accompagnement continu" },
    ],
    calloutTitle: "Besoin de conseils ?",
    calloutText:
      "Contactez-moi pour echanger sur les besoins de votre chien et decouvrir comment l'education positive peut transformer votre quotidien.",
  },
  "approche-personnalisee": {
    title: "Approche Personnalisee",
    metaDescription: "Une approche sur mesure adaptee a chaque chien et a chaque famille pour des resultats optimaux.",
    lead: "Chaque chien est unique, avec son propre caractere, son histoire et ses besoins specifiques. C'est pourquoi je developpe une approche entierement personnalisee pour chaque situation.",
    sections: [
      {
        title: "Pourquoi une approche personnalisee ?",
        content:
          "Les methodes standardisees ne fonctionnent pas pour tous les chiens. Ce qui convient a un Berger Allemand ne sera pas forcement adapte a un Chihuahua. L'age, le temperament, l'environnement familial et les experiences passees influencent considerablement les besoins de chaque animal.",
      },
      {
        title: "Pourquoi a domicile ?",
        type: "callout",
        calloutTitle: "Pourquoi a domicile ?",
        content:
          "Observer le chien dans son environnement quotidien permet de comprendre comment les interactions familiales, l'amenagement de l'espace et les routines influencent son comportement. C'est egalement dans ce cadre familier que les conseils sont les plus faciles a mettre en pratique.",
      },
      {
        title: "Un plan d'action sur mesure",
        type: "cards",
        content: "",
        cards: [
          {
            title: "Facteurs lies au chien",
            items: [
              "Age et stade de developpement",
              "Race et predispositions",
              "Temperament et personnalite",
              "Niveau d'energie",
              "Capacites d'apprentissage",
            ],
          },
          {
            title: "Facteurs lies a vous",
            items: [
              "Votre disponibilite",
              "Votre experience avec les chiens",
              "Vos objectifs et attentes",
              "Votre style de vie",
              "La composition de votre foyer",
            ],
          },
        ],
      },
      {
        title: "Adaptation des methodes",
        content:
          "Je n'applique pas de recette toute faite. Les exercices, le rythme des seances et les outils utilises sont choisis en fonction de votre situation specifique. Cette flexibilite permet d'obtenir des resultats plus rapides et plus durables.",
      },
    ],
    relatedLinks: [
      { href: "/blog/education-positive", label: "Education positive" },
      { href: "/blog/accompagnement-continu", label: "Accompagnement continu" },
    ],
    calloutTitle: "Chaque chien merite une solution sur mesure",
    calloutText: "Contactez-moi pour discuter des besoins specifiques de votre compagnon.",
  },
  "accompagnement-continu": {
    title: "Accompagnement Continu",
    metaDescription: "Un suivi regulier et une disponibilite entre les seances pour garantir des resultats durables.",
    lead: "L'education d'un chien n'est pas un evenement ponctuel mais un processus continu. C'est pourquoi je vous accompagne tout au long de votre parcours, avec un suivi regulier et une disponibilite entre les seances pour garantir votre reussite.",
    sections: [
      {
        title: "Pourquoi un accompagnement dans la duree ?",
        content:
          "Les changements de comportement demandent du temps, de la patience et de la constance. Un accompagnement ponctuel, meme de qualite, ne suffit generalement pas pour obtenir des resultats durables. Le suivi regulier permet de consolider les apprentissages progressivement, detecter et corriger rapidement les erreurs, et adapter le programme selon les evolutions.",
      },
      {
        title: "La cle du succes",
        type: "callout",
        calloutTitle: "La cle du succes",
        content:
          "Les proprietaires qui beneficient d'un suivi regulier obtiennent des resultats significativement meilleurs et plus stables que ceux qui optent pour des consultations isolees.",
      },
      {
        title: "Seances de suivi a domicile",
        content:
          "Apres la consultation initiale, les seances de suivi permettent d'evaluer les progres realises, d'ajuster les exercices en fonction des resultats, d'introduire de nouveaux apprentissages progressivement et de repondre a vos questions.",
      },
      {
        title: "Frequence des seances",
        type: "alert",
        alertType: "info",
        content:
          "La frequence des seances est determinee ensemble en fonction de la problematique et de vos contraintes. En general, un rythme d'une seance toutes les 2 a 4 semaines permet d'obtenir de bons resultats.",
      },
      {
        title: "Les benefices d'un suivi regulier",
        type: "cards",
        content: "",
        cards: [
          {
            title: "Pour le chien",
            items: [
              "Apprentissage progressif sans stress",
              "Generalisation des comportements",
              "Renforcement continu",
              "Prevention des rechutes",
              "Bien-etre psychologique stable",
            ],
          },
          {
            title: "Pour vous",
            items: [
              "Soutien moral tout au long du processus",
              "Corrections rapides en cas d'erreur",
              "Progression visible et mesurable",
              "Acquisition de competences durables",
              "Confiance croissante",
            ],
          },
        ],
      },
    ],
    relatedLinks: [
      { href: "/blog/education-positive", label: "Education positive" },
      { href: "/blog/approche-personnalisee", label: "Approche personnalisee" },
    ],
    calloutTitle: "Un suivi personnalise",
    calloutText:
      "Contactez-moi pour echanger sur vos besoins et construire ensemble le programme d'accompagnement le plus adapte.",
  },
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articles[slug]

  if (!article) {
    return (
      <>
        <Header />
        <main role="main" id="content">
          <div className="fr-container fr-py-6w">
            <h1>Article non trouve</h1>
            <Link href="/" className="fr-btn">
              Retour a l'accueil
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main role="main" id="content">
        <div className="fr-container fr-mt-2w">
          <nav role="navigation" className="fr-breadcrumb" aria-label="vous etes ici :">
            <button className="fr-breadcrumb__button" aria-expanded="false" aria-controls="breadcrumb-1">
              Voir le fil d'Ariane
            </button>
            <div className="fr-collapse" id="breadcrumb-1">
              <ol className="fr-breadcrumb__list">
                <li>
                  <Link className="fr-breadcrumb__link" href="/">
                    Accueil
                  </Link>
                </li>
                <li>
                  <a className="fr-breadcrumb__link" aria-current="page">
                    {article.title}
                  </a>
                </li>
              </ol>
            </div>
          </nav>
        </div>

        <div className="fr-container fr-py-6w">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-8">
              <h1>{article.title}</h1>
              <p className="fr-text--lead">{article.lead}</p>

              {article.sections.map((section, index) => (
                <div key={index} className="fr-mt-4w">
                  {section.type === "callout" ? (
                    <div className="fr-callout fr-callout--green-emeraude fr-my-4w">
                      <h3 className="fr-callout__title">{section.calloutTitle}</h3>
                      <p className="fr-callout__text">{section.content}</p>
                    </div>
                  ) : section.type === "alert" ? (
                    <div className={`fr-alert fr-alert--${section.alertType} fr-my-3w`}>
                      <h3 className="fr-alert__title">{section.title}</h3>
                      <p>{section.content}</p>
                    </div>
                  ) : section.type === "highlight" ? (
                    <div className="fr-highlight fr-my-4w">
                      <p>
                        <strong>Source scientifique :</strong> {section.content}
                      </p>
                    </div>
                  ) : section.type === "cards" ? (
                    <>
                      <h2>{section.title}</h2>
                      <div className="fr-grid-row fr-grid-row--gutters fr-my-4w">
                        {section.cards?.map((card, cardIndex) => (
                          <div key={cardIndex} className="fr-col-12 fr-col-md-6">
                            <div className="fr-card fr-card--grey fr-card--no-border">
                              <div className="fr-card__body">
                                <div className="fr-card__content">
                                  <h3 className="fr-card__title">{card.title}</h3>
                                  <ul className="fr-raw-list">
                                    {card.items.map((item, itemIndex) => (
                                      <li key={itemIndex} className="fr-mb-1v">
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <h2>{section.title}</h2>
                      <p>{section.content}</p>
                    </>
                  )}
                </div>
              ))}

              <div className="fr-btns-group fr-btns-group--inline fr-mt-6w">
                <Link className="fr-btn" href="/">
                  Prendre rendez-vous
                </Link>
                <Link className="fr-btn fr-btn--secondary" href="/">
                  Retour a l'accueil
                </Link>
              </div>
            </div>

            <div className="fr-col-12 fr-col-md-4">
              <div className="fr-callout">
                <h2 className="fr-callout__title">{article.calloutTitle}</h2>
                <p className="fr-callout__text">{article.calloutText}</p>
                <a className="fr-btn fr-btn--sm" href="tel:0123456789">
                  Appeler maintenant
                </a>
              </div>

              <div className="fr-mt-4w">
                <h3 className="fr-h5">Aussi sur cette thematique</h3>
                <ul className="fr-raw-list">
                  {article.relatedLinks.map((link) => (
                    <li key={link.href} className="fr-mb-1v">
                      <Link className="fr-link" href={link.href}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li className="fr-mb-1v">
                    <Link className="fr-link" href="/">
                      Mes services
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FollowUs />
      <Footer />
    </>
  )
}
