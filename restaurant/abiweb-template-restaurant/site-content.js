// ============================================================
// site-content.js — SOURCE DE VÉRITÉ DU SITE CLIENT
// Template Restaurant v2 — AbiWeb
// ============================================================

// "essentiel" | "standard" | "premium"
window.FORMULE = "standard";

window.SITE_CONTENT_DEFAULTS = {

  restaurant: {
    nom:             "[NOM DU RESTAURANT]",
    type:            "[Type de cuisine · Ex: Cuisine française]",
    slogan:          "[Accroche · Ex: Fait maison, chaque jour]",
    ville:           "[VILLE]",
    annee:           "[ANNÉE D'OUVERTURE]",
    couleurPrimaire: "#16a34a",   // vert par défaut (frais, appétissant) — à changer
  },

  contact: {
    email:      "[EMAIL]",
    telephone:  "[TEL]",
    adresse:    "[ADRESSE COMPLÈTE]",
    horaires:   "[Ex: Mar–Sam · 12h–14h30 et 19h–22h30]",
    fermeture:  "[Ex: Fermé dimanche et lundi]",
  },

  stats: [
    { valeur: "[XX]",  label: "Places assises"   },
    { valeur: "[XX]",  label: "Ans d'expérience" },
    { valeur: "[XX]€", label: "Menu du jour"     },
    { valeur: "[XX]",  label: "Avis 5 étoiles"   },
  ],

  categories: [
    {
      nom: "Entrées",
      plats: [
        { nom: "[Plat 1]", description: "[Description]", prix: "[X.00]" },
        { nom: "[Plat 2]", description: "[Description]", prix: "[X.00]" },
        { nom: "[Plat 3]", description: "[Description]", prix: "[X.00]" },
      ],
    },
    {
      nom: "Plats",
      plats: [
        { nom: "[Plat 1]", description: "[Description]", prix: "[X.00]" },
        { nom: "[Plat 2]", description: "[Description]", prix: "[X.00]" },
        { nom: "[Plat 3]", description: "[Description]", prix: "[X.00]" },
      ],
    },
    {
      nom: "Desserts",
      plats: [
        { nom: "[Dessert 1]", description: "[Description]", prix: "[X.00]" },
        { nom: "[Dessert 2]", description: "[Description]", prix: "[X.00]" },
      ],
    },
  ],

  menus: [
    { nom: "Menu du Midi",     prix: "[XX]", vedette: false, contenu: ["Entrée + Plat", "Plat + Dessert", "Café offert", "Du mardi au vendredi"] },
    { nom: "Menu Découverte",  prix: "[XX]", vedette: true,  contenu: ["Entrée + Plat + Dessert", "1 verre de vin inclus", "Tous les soirs", "Sur réservation"] },
    { nom: "Menu Groupe",      prix: "[XX]", vedette: false, contenu: ["À partir de 10 personnes", "Apéritif offert", "Plat au choix", "Sur réservation"] },
  ],

  // Standard + Premium
  lienReservation: "",   // LaFourchette, Calendly, Résa.io...
  lienFacebook:    "",
  lienInstagram:   "",

  // Premium
  galerie:   [],
  documents: [],   // { titre: "Carte complète", fichier: "docs/carte.pdf" }
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
      console.warn("Contenu distant indisponible.", e);
    }
  }
  return window.SITE_CONTENT_DEFAULTS;
};
