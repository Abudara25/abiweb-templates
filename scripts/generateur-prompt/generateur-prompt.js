#!/usr/bin/env node
/**
 * Générateur de prompt Claude Code - AbiWeb
 *
 * Usage : node generateur-prompt.js brief_client.json
 *
 * Lit un brief client (JSON) et génère automatiquement un prompt
 * complet pour Claude Code, en combinant :
 *  - les règles générales AbiWeb
 *  - un template spécifique au secteur du client
 *  - les infos propres au client (nom, couleurs, formule, sections)
 *
 * Le résultat est écrit dans prompt_final.md, prêt à être collé
 * ou lu directement par Claude Code.
 */

const fs = require('fs');
const path = require('path');

// ---- 1. Templates par secteur ------------------------------------------
// Sections vérifiées le 2026-07-06 contre le repo Abudara25/abiweb-templates
// (ancres <section id="..."> et navigation des index.html), y compris le
// template artisan créé ce jour-là.
// Rappel : les formules valides sont "essentiel" | "standard" | "premium"
// (minuscules, cf. window.FORMULE dans site-content.js).

const TEMPLATES = {
  association: {
    // Template : association/abiweb-template-association
    // Variante disponible : abiweb-template-association-caritative
    // (missions, bureau, actualités, don, contact)
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
  // deux templates distincts — voir shared/CHECKLIST.md et la logique déjà appliquée à
  // "Club sportif", qui réutilise tel quel le template association.
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

// ---- 2. Règles générales AbiWeb ----

const REGLES_GENERALES = `
Stack : HTML/CSS/JS vanilla, sans build ni framework (moteur partagé site-engine.js, contenu dans site-content.js), déploiement Vercel, DNS/domaine via Infomaniak, emailing via Brevo.
Respecte la structure de dossiers habituelle du repo Abudara25/abiweb-templates.
Utilise le système de tiers window.FORMULE pour activer/désactiver les modules selon la formule choisie.
Code propre, composants réutilisables, pas de dépendances inutiles.
Aucune IA ou fonctionnalité liée à l'IA ne doit être intégrée au site livré au client : l'IA est un outil de production interne uniquement.
`.trim();

// ---- 3. Génération du prompt --------------------------------------------

function genererPrompt(brief) {
  const template = TEMPLATES[brief.secteur];
  if (!template) {
    throw new Error(
      `Secteur inconnu : "${brief.secteur}". Secteurs disponibles : ${Object.keys(TEMPLATES).join(', ')}`
    );
  }

  const sections = brief.sections_personnalisees && brief.sections_personnalisees.length
    ? brief.sections_personnalisees
    : template.sections;

  return `
# Prompt généré automatiquement - AbiWeb

## Contexte général
${REGLES_GENERALES}

## Client
- Nom : ${brief.nom_client}
- Secteur : ${brief.secteur}
- Formule : ${brief.formule}
- Couleurs principales : ${brief.couleurs || 'à définir avec le client'}
- Ton souhaité : ${template.ton}

## Sections du site
${sections.map(s => `- ${s}`).join('\n')}

## Spécificités du secteur
${template.specifique}

## Consignes complémentaires du client
${brief.consignes_specifiques || 'Aucune consigne particulière.'}

## Tâche
Crée le site pour ce client en respectant strictement la structure et les conventions du template "${brief.secteur}" du repo abiweb-templates. Active uniquement les modules correspondant à la formule "${brief.formule}".
`.trim();
}

// ---- 4. Exécution en ligne de commande -----------------------------------

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
