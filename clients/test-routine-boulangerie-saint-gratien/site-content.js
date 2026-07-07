// ============================================================
// site-content.js — SOURCE DE VÉRITÉ DU SITE CLIENT
// Template Commerce / Boutique v1 — AbiWeb
// ============================================================

// "essentiel" | "standard" | "premium"
window.FORMULE = "standard";

window.SITE_CONTENT_DEFAULTS = {

  commerce: {
    nom:             "TEST ROUTINE - Boulangerie Saint-Gratien",
    type:            "Boulangerie-pâtisserie artisanale",
    slogan:          "Pain et pâtisserie artisanale, faits maison chaque jour",
    ville:           "Saint-Gratien",
    annee:           "[ANNÉE D'OUVERTURE]",
    couleurPrimaire: "#b45309",
  },

  contact: {
    email:      "test-routine@abiweb.fr",
    telephone:  "0612345678",
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
  lienFacebook:  "https://facebook.com/boulangeriesaintgratien",
  lienInstagram: "https://instagram.com/boulangerie_sg",

  // Premium
  galerie:   [],   // photos boutique / produits
  documents: [],   // { titre: "Catalogue complet", fichier: "docs/catalogue.pdf" }

  seo: {
    titre:       "TEST ROUTINE - Boulangerie Saint-Gratien — Boulangerie-pâtisserie artisanale à Saint-Gratien",
    description: "Boulangerie-pâtisserie artisanale à Saint-Gratien. Pain et viennoiseries faits maison chaque jour.",
    motsCles:    "boulangerie, pâtisserie artisanale, Saint-Gratien, pain frais, viennoiserie",
    googleAnalyticsId: "",   // Ex: "G-XXXXXXXXXX"
    googleSearchConsole: "", // Ex: "xxxxxxxxxxxxxxxxxxxxx" (meta tag verification)
  },

  mentionsLegales: {
    editeur:   "TEST ROUTINE - Boulangerie Saint-Gratien",
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
