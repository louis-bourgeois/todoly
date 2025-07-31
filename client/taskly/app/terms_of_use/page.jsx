// /app/terms/page.jsx
"use client";

import { useState } from 'react';
import Navbar from '../ui/landing_page/Navbar';
// Optionnel: Métadonnées pour le SEO (fonctionne aussi dans les Client Components)
// Next.js lira ceci sur le serveur avant de rendre la page côté client.

// Objet contenant les textes pour les deux langues
const translations = {
  fr: {
    title: "Conditions Générales d'Utilisation",
    lastUpdated: "Dernière mise à jour : 26 juillet 2025",
    welcome: "Bienvenue sur Todoly. Les présentes Conditions Générales d'Utilisation (le \"Contrat\") constituent un accord juridiquement contraignant entre vous et le créateur de Todoly (\"nous\", \"notre\"), concernant votre utilisation de l'application web Todoly. En accédant au Service, vous reconnaissez avoir lu et accepté l'intégralité de ce Contrat. Si vous n'acceptez pas, veuillez cesser immédiatement d'utiliser le Service.",
    sections: [
      {
        title: "1. Description du Service",
        content: "Todoly est une application web expérimentale développée à des fins éducatives et de productivité personnelle. Le Service est fourni tel quel et peut évoluer sans préavis. Il ne garantit aucune performance spécifique.",
      },
      {
        title: "2. Propriété Intellectuelle",
        content: "Le Service et son contenu (code, textes, graphismes, etc.) sont protégés par les lois sur le droit d'auteur. Toute reproduction non autorisée est interdite. Aucune licence implicite ne vous est accordée.",
      },
      {
        title: "3. Engagements de l'Utilisateur",
        list: [
          "Les informations fournies à l'inscription doivent être exactes et à jour.",
          "Vous êtes responsable de la confidentialité de votre mot de passe.",
          "Vous vous engagez à utiliser le Service de manière légale et respectueuse.",
        ],
      },
      {
        title: "4. Contenu Généré par l'Utilisateur",
        content: "Vous restez propriétaire de votre contenu. Une licence limitée nous est accordée pour l'hébergement et l’exploitation technique du Service.",
        list: [
          "Nous ne revendiquons aucun droit de propriété sur vos contenus.",
          "Vous garantissez que vos contenus respectent la loi.",
          "Nous pouvons supprimer tout contenu illicite ou contraire à ce Contrat.",
        ],
      },
      {
        title: "5. Politique de Confidentialité (RGPD)",
        subSections: [
          {
            title: "5.1 Données Collectées",
            list: [
              "Données d'identité : photo de profil, nom, prénom, email (et téléphone facultatif).",
              "Données d’authentification : mots de passe hachés.",
              "Contenus créés : tâches, sections, workspaces.",
              "Préférences d’utilisation et photo de profil.",
              "Informations de paiement si abonnement (traité par prestataire externe).",
            ],
          },
          {
            title: "5.2 Finalités et Base Légale",
            list: [
              "Exécution du contrat (accès au Service).",
              "Sécurisation et amélioration continue.",
              "Communication avec l'utilisateur.",
            ],
            outro: "Vos données ne sont ni revendues, ni cédées à des tiers à des fins commerciales.",
          },
          {
            title: "5.3 Vos Droits",
            list: [
              "Accès, rectification, effacement (« droit à l’oubli »), portabilité.",
            ],
            outro: "Pour exercer vos droits, contactez-nous à l’adresse : contact@todoly.app",
          },
          {
            title: "5.4 Durée de Conservation",
            content: "Vos données sont conservées aussi longtemps que votre compte est actif. Elles sont supprimées de manière définitive dans un délai raisonnable après suppression du compte.",
          },
        ],
      },
      {
        title: "6. Exclusion de Garantie",
        content: "Le Service est fourni « tel quel ». Aucune garantie expresse ou implicite n’est donnée, notamment quant à la disponibilité, la fiabilité ou la sécurité.",
      },
      {
        title: "7. Limitation de Responsabilité",
        content: "En cas de dommage, notre responsabilité est strictement limitée au montant payé sur les 6 derniers mois, ou à 1 € symbolique si vous n’avez rien payé. Cela ne s’applique pas en cas de faute lourde, intentionnelle, ou de dommage corporel.",
      },
      {
        title: "8. Résiliation",
        content: "Vous pouvez supprimer votre compte à tout moment. Nous pouvons suspendre l’accès en cas de violation manifeste de ce Contrat, avec justification.",
      },
      {
        title: "9. Modification du Contrat",
        content: "Nous pouvons modifier ces conditions. En cas de modification substantielle, vous serez informé 15 jours à l’avance par email ou via l’application.",
      },
      {
        title: "10. Droit Applicable et Juridiction",
        content: "Ce Contrat est régi par le droit français. Tout litige sera soumis aux juridictions de Paris, sauf si vous avez la qualité de consommateur, auquel cas les règles de compétence légale s’appliqueront.",
      },
      {
        title: "11. Divisibilité",
        content: "Si une clause est invalide, le reste du Contrat reste applicable.",
      },
      {
        title: "12. Intégralité de l'Accord",
        content: "Ce Contrat constitue l’intégralité de l’accord entre vous et nous concernant l’utilisation du Service.",
      },
      {
        title: "13. Survie des Clauses",
        content: "Les clauses sur la propriété, les garanties, la responsabilité et la confidentialité survivent à la résiliation du présent Contrat.",
      },
      {
        title: "14. Nous Contacter",
        content: "Pour toute demande juridique ou relative aux données personnelles, écrivez à : contact@todoly.app",
      },
    ],
  },

  en: {
    title: "Terms of Use",
    lastUpdated: "Last Updated: July 26, 2025",
    welcome: "Welcome to Todoly. These Terms of Use (the “Agreement”) constitute a legally binding agreement between you and the creator of Todoly (“we”, “our”), regarding your use of the Todoly web application. By using the Service, you confirm that you have read and accepted all provisions. If you disagree, you must immediately stop using the Service.",
    sections: [
      {
        title: "1. Description of the Service",
        content: "Todoly is a web app created for educational and personal productivity experimentation purposes. The Service is provided as-is and may change without prior notice. No specific functionality is guaranteed.",
      },
      {
        title: "2. Intellectual Property",
        content: "All content (source code, texts, graphics, etc.) is protected under intellectual property laws. You may not reuse or reproduce any part of the Service without permission.",
      },
      {
        title: "3. User Obligations",
        list: [
          "You must provide accurate and up-to-date information.",
          "You are responsible for keeping your password confidential.",
          "You agree to use the Service lawfully and respectfully.",
        ],
      },
      {
        title: "4. User Content",
        content: "You retain ownership of your content. We are granted a limited license to host and technically operate the Service.",
        list: [
          "We do not claim ownership over your data.",
          "You ensure that your content is lawful.",
          "We may remove content that violates these Terms.",
        ],
      },
      {
        title: "5. Privacy Policy (GDPR)",
        subSections: [
          {
            title: "5.1 Data Collected",
            list: [
              "Identity Data: profile picture, name, email, optional phone.",
              "Authentication Data: hashed passwords.",
              "User-created content: tasks, sections, projects.",
              "Usage and profile preferences.",
              "Payment data (processed by third-party provider).",
            ],
          },
          {
            title: "5.2 Legal Basis and Purpose",
            list: [
              "Service execution and delivery.",
              "Security and service improvement.",
              "User communication.",
            ],
            outro: "We do not sell, rent, or transfer your personal data to third parties for commercial purposes.",
          },
          {
            title: "5.3 Your Rights",
            list: [
              "Access, rectification, erasure (“right to be forgotten”), data portability.",
            ],
            outro: "To exercise your rights, contact us at: contact@todoly.app",
          },
          {
            title: "5.4 Data Retention",
            content: "We retain your personal data as long as your account is active. Upon deletion, your data will be permanently erased within a reasonable technical delay.",
          },
        ],
      },
      {
        title: "6. Disclaimer of Warranty",
        content: "The Service is provided “as is”. We make no warranty, express or implied, regarding the Service’s availability, reliability, or security.",
      },
      {
        title: "7. Limitation of Liability",
        content: "We shall not be held liable for any damages exceeding (a) the amount paid by you in the past six months or (b) one Euro (€1), whichever is higher. This does not apply in cases of gross negligence, intent, or bodily harm.",
      },
      {
        title: "8. Termination",
        content: "You may delete your account at any time. We may suspend access in the event of a significant violation of this Agreement, with justification.",
      },
      {
        title: "9. Modification of Terms",
        content: "We may revise these Terms. You will be notified of any substantial changes at least 15 days in advance via email or through the app.",
      },
      {
        title: "10. Governing Law and Jurisdiction",
        content: "These Terms are governed by French law. Disputes shall be subject to the jurisdiction of the courts of Paris, unless otherwise required by consumer law.",
      },
      {
        title: "11. Severability",
        content: "If any part of this Agreement is deemed invalid, the remainder shall remain in full force.",
      },
      {
        title: "12. Entire Agreement",
        content: "This Agreement constitutes the entire agreement between you and us regarding the use of the Service.",
      },
      {
        title: "13. Survival",
        content: "Provisions on ownership, warranty, liability, and privacy will survive termination.",
      },
      {
        title: "14. Contact",
        content: "For legal or privacy inquiries, contact: contact@todoly.app",
      },
    ],
  },
}

const IconSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="27"
    viewBox="0 0 34 27"
    fill="none"
    aria-hidden="true"
    className="text-text"
  >
    <path
      d="M9.04526 19.0036C9.64703 18.2363 10.2278 17.4863 10.8186 16.7442C14.8099 11.7317 19.2529 7.19591 24.6715 3.70099C27.1281 2.11656 29.7333 0.842855 32.5727 0.0914798C33.3715 -0.119914 33.9377 0.258188 33.9079 0.954946C33.8933 1.29734 33.6741 1.50643 33.4256 1.68852C29.464 4.59179 25.8339 7.86958 22.4099 11.385C19.7341 14.1321 17.2709 17.0604 14.9025 20.0714C13.3348 22.0644 11.7804 24.068 10.2133 26.0616C9.89937 26.461 9.4561 26.6624 9.03491 26.6303"
      fill="currentColor"
    />
    <path
      d="M9.03496 26.6303C8.96903 26.6253 8.87729 26.6127 8.77345 26.5787C8.77345 26.5787 8.51811 26.5013 8.30517 26.2849C4.98711 22.9121 2.22103 19.1693 0.642912 14.6498C0.341467 13.7865 0.17667 12.891 0.0983648 11.9796C0.0628985 11.5669 0.144617 11.1957 0.512318 10.9586C0.868192 10.7291 1.23148 10.7975 1.58089 10.9998C3.11081 11.8853 4.34798 13.1074 5.50673 14.4184C6.85116 15.9396 7.93167 17.5045 8.91931 18.8337C9.00017 18.9426 9.0406 18.997 9.04531 19.0036C9.95251 20.2748 10.3902 22.5025 9.03496 26.6303Z"
      fill="#007AFF"
    />
  </svg>
);

const TermsOfUsePage = () => {
  const [lang, setLang] = useState('fr');
  const content = translations[lang];
  const contactEmail = "louis.bourgeois.todoly@gmail.com";

  return (
    <>
    <Navbar logo={IconSvg}/>
    <div className="bg-black text-neutral-300 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-24">

        {/* --- Language Switcher --- */}
        <div className="flex justify-end mb-8">
          <div className="flex border border-neutral-700 rounded-full p-1 text-sm">
            <button
              onClick={() => setLang('fr')}
              className={`px-4 py-1 rounded-full transition-colors duration-300 ${lang === 'fr' ? 'bg-neutral-200 text-black' : 'hover:bg-neutral-800'}`}
            >
              Français
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-1 rounded-full transition-colors duration-300 ${lang === 'en' ? 'bg-neutral-200 text-black' : 'hover:bg-neutral-800'}`}
            >
              English
            </button>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-white">
          {content.title}
        </h1>
        <p className="text-sm text-neutral-500 mb-12">
          {content.lastUpdated}
        </p>

        <p className="mb-12 text-neutral-300 leading-relaxed">
          {content.welcome}
        </p>

        <div className="space-y-12">
          {content.sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white border-b border-neutral-800 pb-2">
                {section.title}
              </h2>
              
              {/* Renders simple content */}
              {typeof section.content === 'string' && <p className="leading-relaxed">{section.content}{' '}
                {(section.title.includes("Contacter") || section.title.includes("Contact Us")) &&
                  <a href={`mailto:${contactEmail}`} className="text-blue-400 hover:text-blue-300 underline">{contactEmail}</a>
                }
              </p>}
              
              {/* Renders an array of paragraphs */}
              {Array.isArray(section.content) && (
                <div className="space-y-4">
                  {section.content.map((p, pIndex) => <p key={pIndex} className="leading-relaxed">{p}</p>)}
                </div>
              )}

              {/* Renders a bullet list */}
              {section.list && (
                <ul className="list-disc list-outside ml-5 space-y-3">
                  {section.list.map((item, itemIndex) => <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }} />)}
                </ul>
              )}

              {/* Renders complex GDPR section */}
              {section.subSections && section.subSections.map((sub, subIndex) => (
                <div key={subIndex} className="mt-6">
                  <h3 className="text-lg font-medium mb-3 text-neutral-200">{sub.title}</h3>
                  {sub.intro && <p className="mb-3 leading-relaxed">{sub.intro}</p>}
                  {sub.list && (
                    <ul className="list-disc list-outside ml-5 space-y-3 text-neutral-400">
                      {sub.list.map((item, itemIndex) => <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }} />)}
                    </ul>
                  )}
                  {sub.outro && <p className="mt-3 leading-relaxed">{sub.outro}{' '}
                    {(sub.title.includes("Vos droits") || sub.title.includes("Your Rights")) &&
                      <a href={`mailto:${contactEmail}`} className="text-blue-400 hover:text-blue-300 underline">{contactEmail}</a>
                    }
                  </p>}
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default TermsOfUsePage;