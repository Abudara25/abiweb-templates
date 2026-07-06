# Générateur de prompt Claude Code - AbiWeb

Génère un prompt complet pour Claude Code à partir d'un brief client (JSON), en combinant les règles générales AbiWeb, le template du secteur et les infos du client.

## Utilisation

Depuis la racine du repo :

```
node scripts/generateur-prompt/generateur-prompt.js chemin/vers/brief_client.json
```

Le prompt est écrit dans `prompt_final.md`, dans le même dossier que le brief. Un exemple de brief est fourni : `scripts/generateur-prompt/exemple-brief-client.json`.

## Format du brief

| Champ | Description |
|---|---|
| `nom_client` | Nom du client |
| `secteur` | `association`, `restaurant`, `artisan`, `commerce` ou `entreprise` (couvre Auto-entrepreneur/Freelance et TPE/PME) |
| `formule` | Formule vendue. Pour `window.FORMULE`, les valeurs valides sont `essentiel`, `standard`, `premium` (en minuscules) |
| `couleurs` | Couleurs principales (optionnel) |
| `sections_personnalisees` | Liste de sections pour remplacer celles du template (laisser `[]` pour les sections par défaut) |
| `consignes_specifiques` | Consignes libres du client (optionnel) |

## Notes

- Les sections `association`, `restaurant`, `artisan`, `commerce` et `entreprise` ont été vérifiées le 2026-07-06 contre les templates réels de ce repo (ancres et navigation des index.html).
- Club sportif (option du formulaire /devis) n'a pas de template dédié : il réutilise `association/abiweb-template-association`, conçu à l'origine pour un club sportif générique.
- `prompt_final.md` est un fichier généré, ignoré par git : il est réécrit à chaque exécution.
