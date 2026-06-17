// ============================================================
// site-content.js — SOURCE DE VÉRITÉ DU SITE CLIENT
// Template Association Sportive v2 — AbiWeb
// ============================================================

// "essentiel" | "standard" | "premium"
window.FORMULE = "standard";

window.SITE_CONTENT_DEFAULTS = {

  club: {
    nom:             "[NOM DU CLUB]",
    sport:           "[SPORT / DISCIPLINE]",
    slogan:          "[Slogan ou devise du club]",
    ville:           "[VILLE]",
    annee:           "[ANNÉE DE CRÉATION]",
    couleurPrimaire: "#2563eb",   // bleu par défaut — à changer selon le club
  },

  contact: {
    email:        "[EMAIL]",
    telephone:    "[TEL]",
    adresse:      "[ADRESSE DE LA SALLE]",
    horairesInfo: "[Ex: Lun, Mer, Sam · 18h–21h]",
  },

  stats: [
    { valeur: "[XX]",  label: "Membres"        },
    { valeur: "[XX]",  label: "Équipes"         },
    { valeur: "[XX]",  label: "Ans d'existence" },
    { valeur: "[XX]",  label: "Entraîneurs"     },
  ],

  sections: [
    { titre: "[Section 1]", description: "[Description de la section ou activité]", tag: "Tous niveaux" },
    { titre: "[Section 2]", description: "[Description de la section ou activité]", tag: "Compétition"  },
    { titre: "[Section 3]", description: "[Description de la section ou activité]", tag: "Loisir"       },
  ],

  // Standard + Premium
  agenda: [
    { jour: "14", mois: "JUL", titre: "[Match / Événement]",    lieu: "[Terrain]", heure: "[15h00]",  type: "match"        },
    { jour: "16", mois: "JUL", titre: "Entraînement collectif", lieu: "[Terrain]", heure: "[19h–21h]", type: "entrainement" },
    { jour: "21", mois: "JUL", titre: "[Tournoi]",              lieu: "[Lieu]",    heure: "Journée",   type: "tournoi"      },
  ],

  tarifs: [
    { nom: "Découverte", prix: "[XX]", vedette: false, avantages: ["Accès aux entraînements", "Licence fédérale", "Tenue fournie"] },
    { nom: "Compétiteur", prix: "[XX]", vedette: true,  avantages: ["Tout Découverte", "Matchs officiels", "Suivi personnalisé"] },
    { nom: "Famille",     prix: "[XX]", vedette: false, avantages: ["2 membres minimum", "Tarif préférentiel", "Tout Compétiteur"] },
  ],

  saison: "[2025/2026]",

  // Standard + Premium
  lienAdhesion: "",
  lienFacebook: "",
  lienInstagram: "",
  lienYoutube: "",

  // Premium
  galerie: [],
  documents: [],
  palmares: [],
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
