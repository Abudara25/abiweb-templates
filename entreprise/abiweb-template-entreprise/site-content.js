// ============================================================
// site-content.js — SOURCE DE VÉRITÉ DU SITE CLIENT
// Template Entreprise / Auto-entrepreneur / TPE-PME v1 — AbiWeb
// ============================================================

// "essentiel" | "standard" | "premium"
window.FORMULE = "standard";

window.SITE_CONTENT_DEFAULTS = {

  entreprise: {
    nom:             "[NOM DE L'ENTREPRISE / DU FREELANCE]",
    activite:        "[ACTIVITÉ · Ex: Développeur web freelance]",
    slogan:          "[Accroche · Ex: Des sites sur mesure, livrés dans les temps]",
    ville:           "[VILLE]",
    annee:           "[ANNÉE DE CRÉATION]",
    couleurPrimaire: "#0d9488",   // teal par défaut — à changer selon l'identité visuelle
  },

  contact: {
    email:            "[EMAIL]",
    telephone:        "[TEL]",
    adresse:          "[ADRESSE OU 'À distance / sur toute la France']",
    horairesInfo:     "[Ex: Lun–Ven · 9h–18h]",
    zoneIntervention: "[Ex: Sur place à VILLE ou à distance]",
  },

  stats: [
    { valeur: "[XX]",  label: "Ans d'expérience"    },
    { valeur: "[XX]",  label: "Projets réalisés"    },
    { valeur: "[XX]",  label: "Clients accompagnés" },
    { valeur: "[XX]%", label: "Clients satisfaits"  },
  ],

  // Bandeau de réassurance sous le hero — gratuit et toujours affiché (Essentiel inclus).
  garanties: ["[SIRET vérifié]", "[Devis gratuit]", "[Réponse sous 24h]"],

  services: [
    { titre: "[Service 1]", description: "[Description du service]", tag: "[Catégorie]" },
    { titre: "[Service 2]", description: "[Description du service]", tag: "[Catégorie]" },
    { titre: "[Service 3]", description: "[Description du service]", tag: "[Catégorie]" },
  ],

  temoignages: [
    { auteur: "[Prénom Nom]", role: "[Entreprise / fonction]", texte: "[Témoignage client]" },
    { auteur: "[Prénom Nom]", role: "[Entreprise / fonction]", texte: "[Témoignage client]" },
  ],

  tarifs: [
    { nom: "[Pack Starter]",  prix: "[XX]", vedette: false, avantages: ["[Périmètre 1]", "[Périmètre 2]", "[Délai indicatif]"] },
    { nom: "[Pack Business]", prix: "[XX]", vedette: true,  avantages: ["[Tout Starter]", "[Périmètre étendu]", "[Suivi personnalisé]"] },
    { nom: "[Sur mesure]",    prix: "[XX]", vedette: false, avantages: ["[Cahier des charges dédié]", "[Accompagnement complet]", "[Devis personnalisé]"] },
  ],
  tarifNote: "[Tarifs indicatifs — devis gratuit et personnalisé selon votre projet.]",

  // Standard + Premium
  lienRdv:       "",   // Calendly, Doctolib, formulaire de prise de rendez-vous...
  lienLinkedin:  "",
  lienFacebook:  "",
  lienInstagram: "",

  // Premium
  galerie:   [],   // captures de projets / réalisations
  documents: [],   // { titre: "Plaquette commerciale", fichier: "docs/plaquette.pdf" }

  seo: {
    titre:       "[NOM CLIENT] — [ACTIVITÉ] à [VILLE]",
    description: "[Description 150 caractères max — Ex: Développeur web freelance à Saint-Gratien. Devis gratuit, intervention à distance ou sur place.]",
    motsCles:    "[activité, freelance, ville, devis gratuit]",
    googleAnalyticsId: "",   // Ex: "G-XXXXXXXXXX"
    googleSearchConsole: "", // Ex: "xxxxxxxxxxxxxxxxxxxxx" (meta tag verification)
  },

  mentionsLegales: {
    editeur:   "[NOM DE L'ENTREPRISE / DU FREELANCE]",
    adresse:   "[ADRESSE DU SIÈGE]",
    hebergeur: "[Ex: Vercel Inc. / Cloudflare, Inc.]",
    siret:     "", // SIRET de l'entreprise
  },
};

window.SITE_CONTENT_URL = "";

window.loadSiteContent = async function () {
  if (window.SITE_CONTENT_URL) {
    try {
      const res = await fetch(window.SITE_CONTENT_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("blob indisponible");
      const data = await res.json();
      return { ...window.SITE_CONTENT_DEFAULTS, ...data };
    } catch (e) {
      console.warn("Contenu distant indisponible, valeurs par défaut.", e);
    }
  }
  return window.SITE_CONTENT_DEFAULTS;
};
