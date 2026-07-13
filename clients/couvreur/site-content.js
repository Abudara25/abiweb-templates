// ============================================================
// site-content.js — SOURCE DE VÉRITÉ DU SITE CLIENT
// Template Artisan / Prestataire de services v1 — AbiWeb
// ============================================================

// "essentiel" | "standard" | "premium"
window.FORMULE = "premium";

window.SITE_CONTENT_DEFAULTS = {

  artisan: {
    nom:             "Couvreur",
    metier:          "Couverture & rénovation toiture",
    slogan:          "Nettoyage, rénovation et entretien de toiture par un couvreur de confiance à Éragny",
    ville:           "Éragny",
    annee:           "[ANNÉE DE CRÉATION]",
    couleurPrimaire: "#3b5bdb",
  },

  contact: {
    email:            "ybcouverture95@gmail.com",
    telephone:        "06 15 89 51 19",
    adresse:          "57 rue de la Haute Borne, Éragny-sur-Oise",
    horairesInfo:     "7h30 – 19h",
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
  lienFacebook:  "https://www.facebook.com/share/191jDigZ3T/?mibextid=wwXIfr",
  lienInstagram: "https://www.instagram.com/yb_couverture_eragny?igsh=N3RvMDcxdzZjZ29q&utm_source=qr",

  // Premium
  galerie:   [],   // photos de chantiers / réalisations avant-après
  documents: [],   // { titre: "Attestation d'assurance décennale", fichier: "docs/assurance.pdf" }

  seo: {
    titre:       "Couvreur — Couverture & rénovation toiture à Éragny",
    description: "Couvreur à Éragny : nettoyage de toiture, installation de gouttières, rénovation, réfection de faîtage et diagnostic toiture.",
    motsCles:    "couvreur, toiture, gouttière, rénovation toiture, faîtage, Éragny",
    googleAnalyticsId: "",   // Ex: "G-XXXXXXXXXX"
    googleSearchConsole: "", // Ex: "xxxxxxxxxxxxxxxxxxxxx" (meta tag verification)
  },

  mentionsLegales: {
    editeur:   "Couvreur",
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
