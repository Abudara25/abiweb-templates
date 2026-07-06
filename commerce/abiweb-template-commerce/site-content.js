// ============================================================
// site-content.js — SOURCE DE VÉRITÉ DU SITE CLIENT
// Template Commerce / Boutique v1 — AbiWeb
// ============================================================

// "essentiel" | "standard" | "premium"
window.FORMULE = "standard";

window.SITE_CONTENT_DEFAULTS = {

  commerce: {
    nom:             "[NOM DE LA BOUTIQUE]",
    type:            "[Type de commerce · Ex: Épicerie fine]",
    slogan:          "[Accroche · Ex: Des produits sélectionnés avec soin]",
    ville:           "[VILLE]",
    annee:           "[ANNÉE D'OUVERTURE]",
    couleurPrimaire: "#7c3aed",   // violet par défaut — à changer selon l'identité visuelle
  },

  contact: {
    email:      "[EMAIL]",
    telephone:  "[TEL]",
    adresse:    "[ADRESSE COMPLÈTE]",
    horaires:   "[Ex: Mar–Sam · 9h30–19h]",
    fermeture:  "[Ex: Fermé dimanche et lundi]",
  },

  stats: [
    { valeur: "[XX]",  label: "Ans d'existence"    },
    { valeur: "[XX]",  label: "Références en stock" },
    { valeur: "[XX]",  label: "Clients fidèles"     },
    { valeur: "[XX]",  label: "Avis 5 étoiles"      },
  ],

  // Bandeau de réassurance sous le hero — gratuit et toujours affiché (Essentiel inclus).
  moyensPaiement: ["[CB]", "[Espèces]", "[Chèque]", "[Paiement en ligne]"],

  rayons: [
    { titre: "[Rayon 1]", description: "[Description du rayon]", tag: "[Catégorie]" },
    { titre: "[Rayon 2]", description: "[Description du rayon]", tag: "[Catégorie]" },
    { titre: "[Rayon 3]", description: "[Description du rayon]", tag: "[Catégorie]" },
  ],

  coupsDeCoeur: [
    { nom: "[Produit 1]", prix: "[XX]", vedette: false, avantages: ["[Caractéristique 1]", "[Caractéristique 2]", "[Caractéristique 3]"] },
    { nom: "[Produit 2]", prix: "[XX]", vedette: true,  avantages: ["[Caractéristique 1]", "[Caractéristique 2]", "[Caractéristique 3]"] },
    { nom: "[Produit 3]", prix: "[XX]", vedette: false, avantages: ["[Caractéristique 1]", "[Caractéristique 2]", "[Caractéristique 3]"] },
  ],
  coupsDeCoeurNote: "[Sélection non exhaustive — stock variable selon disponibilité, nous consulter.]",

  // Standard + Premium
  lienCommande:  "",   // Click & collect, boutique en ligne, WhatsApp commande...
  lienFacebook:  "",
  lienInstagram: "",

  // Premium
  galerie:   [],   // photos boutique / produits
  documents: [],   // { titre: "Catalogue complet", fichier: "docs/catalogue.pdf" }

  seo: {
    titre:       "[NOM CLIENT] — [TYPE DE COMMERCE] à [VILLE]",
    description: "[Description 150 caractères max — Ex: Épicerie fine à Saint-Gratien. Produits locaux sélectionnés, ouvert du mardi au samedi.]",
    motsCles:    "[type de commerce, boutique, ville, commerce local]",
    googleAnalyticsId: "",   // Ex: "G-XXXXXXXXXX"
    googleSearchConsole: "", // Ex: "xxxxxxxxxxxxxxxxxxxxx" (meta tag verification)
  },

  mentionsLegales: {
    editeur:   "[NOM DE LA BOUTIQUE]",
    adresse:   "[ADRESSE COMPLÈTE]",
    hebergeur: "[Ex: Vercel Inc. / Cloudflare, Inc.]",
    siret:     "", // SIRET de l'établissement
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
