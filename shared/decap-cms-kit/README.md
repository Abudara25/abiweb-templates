# Kit Decap CMS — Actualités en self-service pour le client

Module optionnel, indépendant du moteur `site-engine.js`. À utiliser quand un client veut
publier lui-même des actualités (texte / photo / vidéo YouTube) sans toucher au code et sans
base de données. Construit et validé sur le projet `voix-des-voyageurs` (juin 2026).

## Pourquoi ce module

Decap CMS (ex-Netlify CMS) avec un backend `github` permet au client de publier via une
interface web sur `/admin`, chaque publication créant un commit JSON directement sur le repo.
Pas de serveur à maintenir côté AbiWeb — sauf un petit relais OAuth (GitHub n'autorise pas
l'authentification d'un site purement statique sans lui).

## Contenu du kit

- `admin/index.html`, `admin/config.yml` — l'interface d'administration.
- `scripts/build-actualites.js` — agrège `data/actualites/*.json` en un seul `actualites.json`
  à la racine, exécuté au build (`npm run build`, voir `vercel.json` plus bas).
- `actualites.js` — affiche les actualités sur le site public, avec conversion automatique des
  liens YouTube en vidéo intégrée (champ dédié *ou* lien brut détecté dans le texte).

## Installation dans un nouveau projet client

1. Copier ce dossier dans le repo du client : `admin/`, `scripts/build-actualites.js`,
   `actualites.js` à la racine, et créer `data/actualites/.gitkeep` + `assets/uploads/.gitkeep`.
2. Dans `index.html` du client, juste avant `</body>` :
   ```html
   <script src="actualites.js" defer></script>
   ```
   et prévoir dans le HTML une zone d'accueil :
   ```html
   <div id="actualites-grid" class="actu-grid" style="display:none"></div>
   <div id="actualites-empty">Les actualités arrivent bientôt.</div>
   ```
3. Dans `package.json` du client :
   ```json
   { "scripts": { "build": "node scripts/build-actualites.js" } }
   ```
4. Dans `vercel.json` du client :
   ```json
   { "buildCommand": "npm run build", "outputDirectory": ".", "trailingSlash": true }
   ```
   `outputDirectory: "."` est nécessaire dès qu'un `buildCommand` custom est défini (Vercel
   cherche un dossier `public/` par défaut sinon). `trailingSlash: true` corrige un 404 sur
   `config.yml` quand l'URL `/admin` n'a pas de `/` final (résolution relative du chemin).
5. Adapter `admin/config.yml` : remplacer `[REPO_GITHUB]` (ex. `Abudara25/nom-du-client`) et
   `[URL_PROJET_OAUTH]` (voir étape suivante).
6. Ajouter `.gitignore` : `actualites.json` (fichier généré au build, ne doit pas être commité).

## Mise en place de l'authentification OAuth (une fois par client, ou réutiliser le même projet OAuth pour tous)

GitHub ne fait pas confiance à un site purement statique : il faut un petit relais OAuth.

**Solution retenue et vérifiée (`npm audit` → 0 vulnérabilité) : [`ublabs/netlify-cms-oauth`](https://github.com/ublabs/netlify-cms-oauth).**

⚠️ Ne pas utiliser `bericp1/netlify-cms-oauth-provider-node` (pourtant listé dans la doc
officielle Decap CMS à l'époque où ce kit a été écrit) : sa dépendance `convict` a une faille
de prototype-pollution critique non patchée. Toujours lancer `npm audit` avant d'adopter une
nouvelle dépendance OAuth, ne jamais se fier uniquement à une recommandation trouvée en ligne.

1. Déployer `ublabs/netlify-cms-oauth` comme projet Vercel séparé (bouton "Deploy" de son
   README, ou [lien direct](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fublabs%2Fnetlify-cms-oauth)).
   → ex. `https://<client>-cms-oauth.vercel.app`.
2. Variables d'environnement Vercel à définir : `OAUTH_GITHUB_CLIENT_ID`,
   `OAUTH_GITHUB_CLIENT_SECRET` (valeurs de l'étape 3). `OAUTH_GITLAB_CLIENT_ID` /
   `OAUTH_GITLAB_CLIENT_SECRET` non utilisées ici, mettre une valeur quelconque (ex. `unused`).
3. Créer une GitHub OAuth App (`https://github.com/settings/developers` → "New OAuth App") :
   - Homepage URL : URL du site principal du client.
   - Authorization callback URL : `<url-du-projet-oauth>/callback`.
   - Noter Client ID + générer un Client Secret → reporter dans les variables d'environnement
     de l'étape 2, puis redéployer.
4. Dans `admin/config.yml` du client, `base_url` = l'URL du projet OAuth de l'étape 1.

## Transfert au client en fin de mission

Trois éléments séparés à transférer (GitHub ne transfère pas une OAuth App) :
1. Repo GitHub du site → Transfer ownership.
2. Projet Vercel du site → Transfer Project.
3. Projet Vercel OAuth → Transfer Project (peut être partagé entre plusieurs clients si on
   préfère ne pas en redéployer un par client — dans ce cas, ne pas le transférer, juste donner
   au client GitHub l'accès en écriture au repo).
4. L'OAuth App GitHub ne se transfère pas : le client (ou AbiWeb, si le projet OAuth reste
   mutualisé) doit en recréer une depuis son propre compte si le repo change de compte.

## Limites volontaires

- `actualites.js` contient un rendu Markdown minimal fait main (paragraphes, gras, italique,
  liens) — pas de librairie externe sur un site statique sans build front. Suffisant pour des
  actualités simples ; si le client a besoin de listes/titres dans son contenu, remplacer par
  une vraie lib Markdown (ex. `marked`) côté build.
- Pas de pagination : convient à un flux d'actualités occasionnel, pas à un blog à fort volume.
