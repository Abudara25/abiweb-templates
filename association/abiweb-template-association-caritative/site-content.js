// ============================================================
// site-content.js — SOURCE DE VÉRITÉ DU SITE CLIENT
// Template Association Caritative / Aide & Plaidoyer v1 — AbiWeb
// ============================================================

window.SITE_CONTENT_DEFAULTS = {

  association: {
    nom:             "[NOM DE L'ASSOCIATION]",
    sigle:           "[SIGLE]",
    domaine:         "[DOMAINE D'ACTION]",
    accroche:        "[Accroche / devise de l'association]",
    ville:           "[VILLE]",
    annee:           "[ANNÉE DE CRÉATION]",
    couleurPrimaire: "#b91c1c",   // rouge par défaut — à changer selon l'identité visuelle
    logo:            "",          // ex: "assets/logo.png" — laisser vide pour un logo texte
  },

  contact: {
    email:     "[EMAIL]",
    telephone: "[TEL]",
    adresse:   "[ADRESSE DU SIÈGE]",
  },

  presentation: {
    texte: "[Texte de présentation de l'association — son objet, sa mission, qui elle sert.]",
  },

  // Cartes "Nos missions" / domaines d'action.
  // "couleur" est facultatif (ex: "#2563eb") — sinon retombe sur --primary-md.
  // "description" = résumé court affiché en Accueil. "detail" = paragraphe affiché dans Nos missions (sinon retombe sur description).
  missions: [
    { icone: "📄", couleur: "", titre: "[Mission 1]", description: "[Description courte]", detail: "" },
    { icone: "⚖️", couleur: "", titre: "[Mission 2]", description: "[Description courte]", detail: "" },
    { icone: "🤝", couleur: "", titre: "[Mission 3]", description: "[Description courte]", detail: "" },
  ],

  // Le bureau / les personnes qui gèrent l'association
  bureau: [
    { nom: "[Nom Prénom]", role: "[Rôle]", bio: "[Présentation / citation]", photo: "" },
  ],

  // Faire un don — widget HelloAsso (https://www.helloasso.com/.../widget) ou lien simple en repli.
  helloAsso: {
    widgetUrl: "",
    lien: "",
  },
  lienFacebook:  "",
  lienInstagram: "",

  // Actualités (photos / vidéos) alimentées par un Google Sheet publié en CSV.
  // Voir ACTUALITES-SETUP.md pour la mise en place côté client.
  actualites: {
    sheetUrl: "",
  },

  seo: {
    titre:       "[NOM DE L'ASSOCIATION] — [DOMAINE D'ACTION] à [VILLE]",
    description: "[Description 150 caractères max]",
    motsCles:    "[association, domaine d'action, ville]",
    googleAnalyticsId: "",   // Ex: "G-XXXXXXXXXX"
    googleSearchConsole: "", // Ex: "xxxxxxxxxxxxxxxxxxxxx" (meta tag verification)
  },

  mentionsLegales: {
    editeur:   "[NOM DE L'ASSOCIATION]",
    adresse:   "[ADRESSE DU SIÈGE]",
    hebergeur: "[Ex: Vercel Inc. / Cloudflare, Inc.]",
    siret:     "", // numéro RNA ou SIRET si applicable, sinon laisser vide
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