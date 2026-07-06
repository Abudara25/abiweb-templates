# Générateur de prompt Claude Code - AbiWeb

Génère un prompt complet pour Claude Code à partir du **JSON brut soumis via le formulaire
/devis d'abiweb.fr** (même forme que l'objet `data` construit par `abiweb/api/send-brief.js`),
en combinant les règles générales AbiWeb, le template du secteur détecté automatiquement, et
toutes les réponses du client (contact, tarification, contenu, design).

## Utilisation

Depuis la racine du repo :

```
node scripts/generateur-prompt/generateur-prompt.js chemin/vers/brief_client.json
```

Le prompt est écrit dans `prompt_final.md`, dans le même dossier que le brief. Un exemple de
brief est fourni : `scripts/generateur-prompt/exemple-brief-client.json`.

## D'où vient le JSON du brief ?

Quand un client soumet `/devis`, `abiweb/api/send-brief.js` envoie un email à
`contact@abiweb.fr` avec le brief en pièce jointe JSON (même champs que ci-dessous). Il suffit de
télécharger cette pièce jointe et de la passer telle quelle à ce script — aucune retranscription
manuelle n'est nécessaire.

## Format du brief

Champs du formulaire /devis (mêmes noms que `LIMITS` dans `abiweb/api/send-brief.js`) :

| Champ | Description |
|---|---|
| `nom` | Nom de la structure / entreprise |
| `type` | Type de structure choisi dans le formulaire — sert à détecter le secteur (voir ci-dessous) |
| `contact`, `email`, `tel`, `ville` | Coordonnées du client |
| `activite` | Description libre de l'activité |
| `siteExistant`, `siteUrl` | Refonte ou premier site |
| `formule` | `Essentiel` / `Standard` / `Premium` — utilisé pour `window.FORMULE` si `tarifMode` = `formule` |
| `tarifMode`, `modulesChoisis`, `totalEstime` | Si `tarifMode` = `alacarte`, pas de formule fixe : voir le garde-fou générique dans le prompt |
| `maintenance`, `domaine`, `domaineNom` | Contrat de maintenance et nom de domaine |
| `sections` | Sections cochées par le client (sinon les sections par défaut du template) |
| `photos`, `photosNb`, `videos`, `logo`, `textes` | Disponibilité du contenu |
| `fbLink`, `igLink`, `ytLink`, `autreLink` | Réseaux sociaux |
| `style`, `couleur1`, `couleur2`, `couleursTexte`, `refs`, `refNon` | Préférences de design |
| `infos` | Consignes libres du client |

### Détection du secteur (`type` → template)

| Valeur de `type` | Template utilisé |
|---|---|
| `Association` | `association-caritative` |
| `Club sportif` | `association` (réutilisé tel quel, conçu à l'origine pour un club sportif) |
| `Commerce / Boutique` | `commerce` |
| `Artisan / Prestataire de services` | `artisan` |
| `Auto-entrepreneur / Freelance` | `entreprise` |
| `TPE / PME` | `entreprise` (même template que Auto-entrepreneur/Freelance) |
| `Autre` | Non mappé — le script s'arrête avec une erreur plutôt que de deviner un mauvais template |

## Notes

- Les sections `association`, `association-caritative`, `restaurant`, `artisan`, `commerce` et
  `entreprise` ont été vérifiées le 2026-07-06 contre les templates réels de ce repo (ancres et
  navigation des index.html).
- Le prompt généré liste explicitement ce qui manque encore (adresse complète, horaires précis,
  tarifs détaillés, textes définitifs, SIRET...) : le formulaire /devis ne les collecte pas, ils
  restent à demander au client avant livraison — voir `CHECKLIST.md`.
- `prompt_final.md` est un fichier généré, ignoré par git : il est réécrit à chaque exécution.
