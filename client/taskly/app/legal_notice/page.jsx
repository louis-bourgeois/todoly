// /app/terms/page.jsx
"use client";

import { useState } from 'react';
import Navbar from '@/ui/landing_page/Navbar';
// Optionnel: Métadonnées pour le SEO (fonctionne aussi dans les Client Components)
// Next.js lira ceci sur le serveur avant de rendre la page côté client.

// Objet contenant les textes pour les deux langues
const translations = {
  legal: {
    fr: {
      title: "Mentions légales",
      sections: [
        {
          title: "1. Éditeur du site",
          content: `Ce site est édité par Louis Bourgeois, développeur indépendant.  
Adresse : [adresse personnelle transmise à l’hébergeur conformément à l’article 6-III-2 de la LCEN].  
Contact : louis.bourgeois.todoly@gmail.com  
Nom de l’application : Todoly  
Statut : projet personnel, éducatif et non commercial.`,
        },
        {
          title: "2. Hébergeur",
          content: `Nom : Hostinger, UAB  
Adresse : Jonavos g. 60C, 44192 Kaunas, Lituanie  
Site web : https://www.hostinger.fr  
Contact : support@hostinger.com`,
        },
        {
          title: "3. Propriété intellectuelle",
          content: `Tous les éléments accessibles sur l’application Todoly (textes, images, codes sources, logos, etc.) sont protégés par des droits de propriété intellectuelle.  
Sauf indication contraire, ils sont la propriété exclusive de Louis Bourgeois. Toute reproduction non autorisée est interdite.`,
        },
        {
          title: "4. Données personnelles",
          list: [
            "Responsable du traitement : Louis Bourgeois",
            "Données collectées : prénom, nom, email, mot de passe haché, contenu utilisateur (projets, tâches), préférences, date de création de compte.",
            "Finalité : fonctionnement du service, sécurité, personnalisation.",
            "Base légale : exécution du contrat (article 6.1.b RGPD)",
            "Durée : tant que le compte est actif, puis suppression irréversible dans un délai raisonnable.",
            "Droits RGPD : accès, rectification, suppression, portabilité.",
            "Exercice des droits : louis.bourgeois.todoly@gmail.com",
            "Aucune donnée n’est vendue ou transférée à des tiers."
          ]
        },
        {
          title: "5. Cookies",
          content: `Todoly utilise uniquement des cookies techniques essentiels à son fonctionnement.  
Aucun cookie publicitaire ou d’analyse tiers n’est utilisé sans consentement.`,
        },
        {
          title: "6. Limitation de responsabilité",
          content: `Todoly est fourni “en l’état”, sans garantie.  
Louis Bourgeois ne saurait être tenu responsable de bugs, pertes de données ou indisponibilité.  
L’utilisateur est seul responsable de son usage du service.`,
        },
        {
          title: "7. Droit applicable",
          content: `Les présentes mentions légales sont régies par le droit français.  
Tout litige sera soumis à la juridiction exclusive des tribunaux compétents de Paris.`,
        },
      ]
    },
    en: {
      title: "Legal Notice",
      sections: [
        {
          title: "1. Publisher",
          content: `This site is published by Louis Bourgeois, independent developer.  
Address: [personal address provided to the hosting provider in accordance with article 6-III-2 of the French LCEN law].  
Contact: louis.bourgeois.todoly@gmail.com
Application name: Todoly  
Status: personal, educational and non-commercial project.`,
        },
        {
          title: "2. Hosting Provider",
          content: `Name: Hostinger, UAB  
Address: Jonavos g. 60C, 44192 Kaunas, Lithuania  
Website: https://www.hostinger.com  
Contact: support@hostinger.com`,
        },
        {
          title: "3. Intellectual Property",
          content: `All content accessible through Todoly (texts, images, source code, logos, etc.) is protected by intellectual property laws.  
Unless otherwise stated, all elements are the exclusive property of Louis Bourgeois. Unauthorized reproduction is prohibited.`,
        },
        {
          title: "4. Personal Data",
          list: [
            "Data controller: Louis Bourgeois",
            "Collected data: first name, last name, email, hashed password, user content (projects, tasks), preferences, account creation date.",
            "Purpose: service operation, security, personalization.",
            "Legal basis: contract performance (Art. 6.1.b GDPR)",
            "Retention: as long as the account is active, then irreversibly deleted within a reasonable timeframe.",
            "GDPR rights: access, rectification, erasure, portability.",
            "To exercise your rights: louis.bourgeois.todoly@gmail.com",
            "Your data will never be sold or shared with third parties."
          ]
        },

        {
          title: "5. Cookies",
          content: `Todoly only uses essential technical cookies.  
No advertising or third-party analytics cookies are used without explicit consent.`,
        },
        {
          title: "6. Limitation of Liability",
          content: `Todoly is provided “as is”, without warranty.  
Louis Bourgeois shall not be held liable for bugs, data loss or service unavailability.  
Users are solely responsible for their use of the service.`,
        },
        {
          title: "7. Governing Law",
          content: `These legal notices are governed by French law.  
Any dispute shall be submitted to the exclusive jurisdiction of the competent courts of Paris, France.`,
        },
      ]
    }
  }
};


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
  const content = translations.legal[lang];
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