# Mise en place des actualités (photos / vidéos) via Google Sheet

Le client publie lui-même ses actualités en remplissant un Google Sheet — aucun accès au code,
aucune base de données à gérer côté AbiWeb, et aucun champ de commentaire public n'existe sur le
site (lecture seule).

## 1. Créer le Google Sheet

Une seule feuille, avec cette ligne d'en-tête exacte en première ligne :

```
date | titre | description | type | lien
```

- `date` : texte libre, ex. `12 mars 2026`
- `titre` : titre court de l'actu
- `description` : 1-2 phrases (facultatif)
- `type` : `photo` ou `video`
- `lien` :
  - pour une **photo** : lien direct vers l'image (Google Drive en partage public, Imgur, etc.)
  - pour une **vidéo** : un lien YouTube classique (`youtube.com/watch?v=...` ou `youtu.be/...`)

Chaque nouvelle ligne ajoutée en bas du tableau = une nouvelle actu publiée. Le site affiche
toujours la plus récente en premier.

## 2. Publier la feuille en CSV

Dans Google Sheets : `Fichier > Partager > Publier sur le Web` → sélectionner la feuille →
format **Valeurs séparées par des virgules (.csv)** → Publier.

Copier l'URL générée (elle se termine par `output=csv`).

## 3. Brancher l'URL sur le site

Coller l'URL dans `site-content.js` :

```js
actualites: {
  sheetUrl: "https://docs.google.com/spreadsheets/d/e/XXXXX/pub?output=csv",
},
```

## Limites à connaître

- La feuille doit rester "publiée sur le web" pour que le site puisse la lire en direct.
- Pas d'upload de fichier intégré : pour une photo, le client doit héberger l'image ailleurs
  (Drive, téléphone → Google Photos, etc.) et coller le lien dans la colonne `lien`.
- Pas de modération/validation avant publication — la ligne apparaît dès qu'elle est ajoutée.