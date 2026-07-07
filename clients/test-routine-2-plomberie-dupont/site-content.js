// ============================================================
// site-content.js — SOURCE DE VÉRITÉ DU SITE CLIENT
// Template Artisan / Prestataire de services v1 — AbiWeb
// ============================================================

// "essentiel" | "standard" | "premium"
window.FORMULE = "essentiel";

window.SITE_CONTENT_DEFAULTS = {

  artisan: {
    nom:             "TEST ROUTINE 2 - Plomberie Dupont",
    metier:          "Plombier-chauffagiste",
    slogan:          "Plomberie-chauffage à Argenteuil : dépannage et installation sanitaire",
    ville:           "Argenteuil",
    annee:           "[ANNÉE DE CRÉATION]",
    couleurPrimaire: "#1d4ed8",
  },

  contact: {
    email:            "test-routine2@abiweb.fr",
    telephone:        "0698765432",
    adresse:          "[ADRESSE / SECTEUR]",
    horairesInfo:     "[Ex: Lun–Ven · 8h–19h, urgences 7j/7]",
    zoneIntervention: "[Ex: Rayon de 30 km autour de VILLE]",
  },

  stats: [
    { valeur: "[XX]",    label: "Ans d'expérience"     },
    { valeur: "[XX]",    label: "Chantiers réalisés"   },
    { valeur: "[XX]",    label: "Clients satisfaits"   },
    { valeur: "[XX] km", label: "Zone d'intervention"  },
  ],

  // Bandeau de réassurance sous le hero — gratuit et toujours affiché (Essentiel inclus).
  garanties: ["[Devis gratuit]", "[Assurance décennale]", "[Intervention sous 48h]"],

  prestations: [
    { titre: "[Prestation 1]", description: "[Description de la prestation]", tag: "[Dépannage]"   },
    { titre: "[Prestation 2]", description: "[Description de la prestation]", tag: "[Installation]" },
    { titre: "[Prestation 3]", description: "[Description de la prestation]", tag: "[Entretien]"    },
  ],

  tarifs: [
    { nom: "[Diagnostic]",             prix: "[XX]", vedette: false, avantages: ["[Déplacement inclus]", "[Devis détaillé]", "[Sans engagement]"] },
    { nom: "[Intervention standard]",  prix: "[XX]", vedette: true,  avantages: ["[Tout Diagnostic]", "[Main d'œuvre + matériel]", "[Garantie travaux]"] },
    { nom: "[Contrat d'entretien]",    prix: "[XX]", vedette: false, avantages: ["[Visite annuelle]", "[Tarif préférentiel]", "[Priorité d'intervention]"] },
  ],
  tarifNote: "[Tarifs indicatifs — devis gratuit et sans engagement, établi sur place ou à distance.]",

  // Standard + Premium
  lienDevis:     "",   // Formulaire de devis en ligne, Calendly, Doctolib...
  lienFacebook:  "",
  lienInstagram: "",

  // Premium
  galerie:   [],   // photos de chantiers / réalisations avant-après
  documents: [],   // { titre: "Attestation d'assurance décennale", fichier: "docs/assurance.pdf" }

  seo: {
    titre:       "TEST ROUTINE 2 - Plomberie Dupont — Plombier-chauffagiste à Argenteuil",
    description: "Plombier-chauffagiste à Argenteuil : dépannage et installation sanitaire.",
    motsCles:    "[métier, artisan, ville, devis gratuit, dépannage]",
    googleAnalyticsId: "",   // Ex: "G-XXXXXXXXXX"
    googleSearchConsole: "", // Ex: "xxxxxxxxxxxxxxxxxxxxx" (meta tag verification)
  },

  mentionsLegales: {
    editeur:   "TEST ROUTINE 2 - Plomberie Dupont",
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
