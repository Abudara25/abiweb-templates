#!/usr/bin/env node
/**
 * Générateur de prompt Claude Code - AbiWeb
 *
 * Usage : node generateur-prompt.js brief_client.json
 *
 * Lit le JSON brut soumis via le formulaire /devis d'abiweb.fr (même forme
 * que l'objet `data` construit par abiweb/api/send-brief.js — voir
 * scripts/generateur-prompt/exemple-brief-client.json pour un exemple) et
 * génère automatiquement un prompt complet pour Claude Code, en combinant :
 *  - les règles générales AbiWeb
 *  - le template du secteur détecté à partir de "type"
 *  - toutes les réponses du client (contact, tarification, contenu, design)
 *
 * Le résultat est écrit dans prompt_final.md, prêt à être collé
 * ou lu directement par Claude Code.
 */

const fs = require('fs');
const path = require('path');

// ---- 1. Templates par secteur ------------------------------------------
// Sections vérifiées le 2026-07-06 contre le repo Abudara25/abiweb-templates
// (ancres <section id="..."> et navigation des index.html).
// Rappel : les formules valides sont "essentiel" | "standard" | "premium"
// (minuscules, cf. window.FORMULE dans site-content.js).

const TEMPLATES = {
  association: {
    // Template : association/abiweb-template-association (variante sportive,
    // réutilisée telle quelle pour "Club sportif")
    sections: [
      'Accueil (hero)',
      'Activités (#activites)',
      'Agenda (#agenda, Standard et Premium)',
      'Tarifs (#tarifs)',
      'Contact (#contact)',
      'Galerie (#galerie, Premium uniquement)',
      'Documents (#documents, Premium uniquement)'
    ],
    ton: "chaleureux, orienté communauté et engagement",
    specifique: "Tout le contenu vit dans site-content.js (clés : club, contact, stats, sections, agenda, tarifs, lienAdhesion, galerie, documents, palmares, seo, mentionsLegales), jamais en dur dans index.html. Prévoir le lien d'adhésion (lienAdhesion) et un agenda facile à mettre à jour."
  },
  "association-caritative": {
    // Template : association/abiweb-template-association-caritative
    sections: [
      'Accueil (hero)',
      'Nos missions (#missions)',
      'Le bureau (#bureau)',
      'Actualités (#actualites)',
      'Faire un don (#don)',
      'Contact (#contact)'
    ],
    ton: "engagé, humain, orienté cause et transparence",
    specifique: "Tout le contenu vit dans site-content.js (clés : association, contact, presentation, missions, bureau, helloAsso, actualites, seo, mentionsLegales), jamais en dur dans index.html. Le don passe par helloAsso (widget ou lien simple) et les actualités par un Google Sheet publié en CSV (voir ACTUALITES-SETUP.md)."
  },
  restaurant: {
    // Template : restaurant/abiweb-template-restaurant
    sections: [
      'Accueil (hero)',
      'La carte (#carte)',
      'Menus (#menus)',
      'Réservation (#reservation, Standard et Premium)',
      'Infos pratiques / Contact (#contact)',
      'Galerie (#galerie, Premium uniquement)',
      'Documents (#documents, Premium uniquement)'
    ],
    ton: "appétissant, convivial, mise en avant visuelle des plats",
    specifique: "Tout le contenu vit dans site-content.js (clés : restaurant, contact, stats, categories, menus, lienReservation, galerie, documents, seo, mentionsLegales), jamais en dur dans index.html. La carte est modifiable via categories/menus et la réservation passe par lienReservation (téléphone, LaFourchette, Calendly...)."
  },
  artisan: {
    // Template : artisan/abiweb-template-artisan
    sections: [
      'Accueil (hero + bandeau garanties)',
      'Prestations (#prestations)',
      'Tarifs (#tarifs)',
      'Devis en ligne (#devis-cta, Standard et Premium)',
      'Contact (#contact, avec zone d\'intervention)',
      'Galerie réalisations (#galerie, Premium uniquement)',
      'Documents (#documents, Premium uniquement — assurance décennale, certifications)'
    ],
    ton: "professionnel, rassurant, orienté confiance et savoir-faire",
    specifique: "Tout le contenu vit dans site-content.js (clés : artisan, contact, stats, garanties, prestations, tarifs, tarifNote, lienDevis, galerie, documents, seo, mentionsLegales), jamais en dur dans index.html. `garanties` (devis gratuit, assurance décennale, délai d'intervention...) est un bandeau de réassurance toujours affiché, même en formule Essentiel. La prise de devis en ligne passe par lienDevis (formulaire, Calendly, Doctolib...)."
  },
  commerce: {
    // Template : commerce/abiweb-template-commerce
    sections: [
      'Accueil (hero + bandeau moyens de paiement)',
      'Rayons (#rayons)',
      'Coups de cœur / sélection produits (#coups-de-coeur)',
      'Commande en ligne / click & collect (#commande-cta, Standard et Premium)',
      'Infos pratiques / Contact (#contact, avec horaires et jour de fermeture)',
      'Galerie (#galerie, Premium uniquement)',
      'Documents (#documents, Premium uniquement — catalogue, carte de fidélité)'
    ],
    ton: "chaleureux et engageant, met en avant la sélection et la proximité plutôt qu'un catalogue exhaustif",
    specifique: "Tout le contenu vit dans site-content.js (clés : commerce, contact, stats, moyensPaiement, rayons, coupsDeCoeur, coupsDeCoeurNote, lienCommande, galerie, documents, seo, mentionsLegales), jamais en dur dans index.html. `moyensPaiement` est un bandeau toujours affiché, même en formule Essentiel. `coupsDeCoeur` est une sélection illustrative (pas un catalogue exhaustif et daté) — le préciser via coupsDeCoeurNote. La commande en ligne / click & collect passe par lienCommande."
  },
  // Couvre à la fois "Auto-entrepreneur / Freelance" et "TPE / PME" du formulaire /devis :
  // ces deux options se recouvrent trop (présentation pro, services, contact) pour justifier
  // deux templates distincts — voir la logique déjà appliquée à "Club sportif", qui réutilise
  // tel quel le template association.
  entreprise: {
    // Template : entreprise/abiweb-template-entreprise
    sections: [
      'Accueil (hero + bandeau garanties)',
      'Services (#services)',
      'Témoignages (#temoignages)',
      'Tarifs (#tarifs)',
      'Prise de rendez-vous (#rdv-cta, Standard et Premium)',
      'Contact (#contact, avec zone d\'intervention)',
      'Galerie réalisations (#galerie, Premium uniquement)',
      'Documents (#documents, Premium uniquement)'
    ],
    ton: "professionnel, direct, orienté résultats et crédibilité (SIRET, avis clients, réalisations concrètes)",
    specifique: "Tout le contenu vit dans site-content.js (clés : entreprise, contact, stats, garanties, services, temoignages, tarifs, tarifNote, lienRdv, lienLinkedin, galerie, documents, seo, mentionsLegales), jamais en dur dans index.html. `garanties` est un bandeau de réassurance toujours affiché, même en formule Essentiel. La prise de rendez-vous passe par lienRdv (Calendly, Doctolib, formulaire...)."
  }
};

// ---- 2. Détection du secteur à partir du champ "type" (#type-structure) --
// Valeurs possibles du formulaire /devis, dans l'ordre de son <select> :
// "Association", "Auto-entrepreneur / Freelance", "Commerce / Boutique",
// "Artisan / Prestataire de services", "TPE / PME", "Club sportif", "Autre".

const SECTEUR_PAR_TYPE = {
  "Association":                          "association-caritative",
  "Club sportif":                         "association",
  "Commerce / Boutique":                  "commerce",
  "Artisan / Prestataire de services":    "artisan",
  "Auto-entrepreneur / Freelance":        "entreprise",
  "TPE / PME":                            "entreprise",
};
// "Autre" (et toute valeur non listée ci-dessus, ex. si le formulaire évolue)
// n'a volontairement pas de secteur par défaut : mieux vaut arrêter le
// script et demander une décision humaine que de deviner un mauvais template.

// ---- 3. Règles générales AbiWeb ----

const REGLES_GENERALES = `
Stack : HTML/CSS/JS vanilla, sans build ni framework (moteur partagé site-engine.js, contenu dans site-content.js), déploiement Vercel, DNS/domaine via Infomaniak, emailing via Brevo.
Respecte la structure de dossiers habituelle du repo Abudara25/abiweb-templates.
Utilise le système de tiers window.FORMULE pour activer/désactiver les modules selon la formule choisie.
Code propre, composants réutilisables, pas de dépendances inutiles.
Aucune IA ou fonctionnalité liée à l'IA ne doit être intégrée au site livré au client : l'IA est un outil de production interne uniquement.
`.trim();

// ---- 4. Génération du prompt --------------------------------------------

function ligne(label, valeur) {
  return `- ${label} : ${valeur && String(valeur).trim() ? valeur : 'Non renseigné'}`;
}

function genererPrompt(brief) {
  const secteur = SECTEUR_PAR_TYPE[brief.type];
  if (!secteur) {
    throw new Error(
      `Type de structure non reconnu ou non mappé : "${brief.type}". ` +
      `Valeurs gérées : ${Object.keys(SECTEUR_PAR_TYPE).join(', ')}. ` +
      `Si le formulaire /devis a changé, mettre à jour SECTEUR_PAR_TYPE dans generateur-prompt.js.`
    );
  }
  const template = TEMPLATES[secteur];

  const sections = Array.isArray(brief.sections) && brief.sections.length
    ? brief.sections
    : template.sections;

  const tarifBloc = brief.tarifMode === 'alacarte'
    ? [
        `- Mode : sur mesure à la carte (total estimé ${brief.totalEstime || '?'}€)`,
        `- Modules choisis : ${(brief.modulesChoisis || []).length ? brief.modulesChoisis.join(', ') : 'base seule'}`,
        `- ⚠️ Pas de correspondance directe avec le système de tiers essentiel/standard/premium : choisir la formule la plus proche des modules ci-dessus, ou activer/désactiver des sections dans site-content.js indépendamment de window.FORMULE.`,
      ].join('\n')
    : `- Formule : ${brief.formule || 'Non précisée'}`;

  const formuleWindow = brief.tarifMode === 'alacarte'
    ? '' // pas de formule fixe, à trancher à la lecture du bloc Tarification ci-dessus
    : (brief.formule || 'standard').toLowerCase();

  const reseaux = [
    brief.fbLink    ? `Facebook : ${brief.fbLink}` : null,
    brief.igLink    ? `Instagram : ${brief.igLink}` : null,
    brief.ytLink    ? `YouTube : ${brief.ytLink}` : null,
    brief.autreLink ? `Autre : ${brief.autreLink}` : null,
  ].filter(Boolean);

  return `
# Prompt généré automatiquement - AbiWeb

## Contexte général
${REGLES_GENERALES}

## Secteur détecté
"${brief.type}" → template **${secteur}** (${template.ton})

## Client
${ligne('Nom / structure', brief.nom)}
${ligne('Contact', brief.contact)}
${ligne('Email', brief.email)}
${ligne('Téléphone', brief.tel)}
${ligne('Ville', brief.ville)}
${ligne('Activité', brief.activite)}
${ligne('Site existant', brief.siteExistant === 'oui' ? `Oui — refonte${brief.siteUrl ? ` (${brief.siteUrl})` : ''}` : 'Non — 1er site')}

## Tarification
${tarifBloc}
${ligne('Maintenance', brief.maintenance)}
${ligne('Domaine', brief.domaine === 'non' ? 'À acheter' : brief.domaine === 'oui' ? `Déjà acheté${brief.domaineNom ? ` (${brief.domaineNom})` : ''}` : 'Adresse gratuite (vercel.app)')}

## Sections du site
${sections.map(s => `- ${s}`).join('\n')}

## Contenu disponible
${ligne('Photos', `${brief.photos || 'Non précisé'}${brief.photosNb ? ` — ${brief.photosNb}` : ''}`)}
${ligne('Vidéos', brief.videos)}
${ligne('Logo', brief.logo)}
${ligne('Textes déjà rédigés', brief.textes)}
${reseaux.length ? reseaux.map(r => `- ${r}`).join('\n') : '- Aucun réseau social communiqué'}

## Design
${ligne('Style souhaité', brief.style)}
${ligne('Couleur principale', brief.couleur1)}
${ligne('Couleur secondaire', brief.couleur2)}
${ligne('Précisions couleurs', brief.couleursTexte)}
${ligne('Références appréciées', brief.refs)}
${ligne('À éviter', brief.refNon)}

## Spécificités du secteur
${template.specifique}

## Infos complémentaires du client
${brief.infos && brief.infos.trim() ? brief.infos : 'Aucune.'}

## Tâche
1. Vérifier avant tout que les numéros, adresses, horaires et chiffres ci-dessus sont bien ceux fournis par le client (rien à inventer) — voir shared/SNIPPETS.md, dernière section.
2. Scaffolder le projet : \`node scripts/new-client.js ${secteur} "${brief.nom || ''}" "${brief.ville || ''}" "${brief.activite || ''}"\`
   ⚠️ Le 4ᵉ argument attend normalement un intitulé court (ex: "Épicerie fine", "Plombier-chauffagiste") mais "Activité" ci-dessus est le texte libre du client, potentiellement long — après scaffolding, relire les endroits où il apparaît (hero, title, meta description) et le raccourcir si besoin plutôt que de l'utiliser tel quel partout.
3. Remplir site-content.js dans clients/<slug>/ avec les informations ci-dessus (contact, réseaux, design). ${formuleWindow ? `Régler window.FORMULE sur "${formuleWindow}".` : 'Choisir window.FORMULE selon le bloc Tarification ci-dessus.'}
4. Ce qui manque encore (adresse complète, horaires précis, tarifs détaillés, textes définitifs, SIRET...) reste à demander explicitement au client — ne pas inventer, voir CHECKLIST.md du dossier généré avant livraison.
`.trim();
}

// ---- 5. Exécution en ligne de commande -----------------------------------

const briefPath = process.argv[2];
if (!briefPath) {
  console.error('Usage : node generateur-prompt.js brief_client.json');
  process.exit(1);
}

const brief = JSON.parse(fs.readFileSync(path.resolve(briefPath), 'utf8'));
const prompt = genererPrompt(brief);

const outputPath = path.join(path.dirname(path.resolve(briefPath)), 'prompt_final.md');
fs.writeFileSync(outputPath, prompt, 'utf8');

console.log(`Prompt généré : ${outputPath}`);
