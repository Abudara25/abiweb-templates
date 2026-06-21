# abiweb-templates

Usine à templates de sites vitrine pour clients freelance (AbiWeb). Pas de build, pas de
package.json, pas de framework : HTML/CSS/JS vanilla servis statiquement.

## Structure

```
shared/                                  ← fichiers communs à TOUS les templates
  site-engine.js / site-engine.css       ← moteur de rendu générique (lit site-content.js, injecte le DOM)
  CHECKLIST.md                           ← checklist de livraison de référence

<secteur>/abiweb-template-<secteur>/     ← un template par secteur (association, restaurant, ...)
  index.html                             ← squelette + CSS spécifique au template (couleurs, polices, layout)
  site-content.js                        ← SOURCE DE VÉRITÉ du contenu : tous les [PLACEHOLDERS] à remplacer
  site-engine.js / site-engine.css       ← copies synchronisées depuis shared/ (ne jamais éditer ici directement)
  CHECKLIST.md                           ← copie synchronisée depuis shared/

scripts/
  new-client.js                          ← scaffold un nouveau client depuis un template
  sync-shared.js                         ← propage shared/ vers tous les templates

clients/<slug>/                          ← générés par new-client.js (un dossier par client livré)
```

## Règles d'édition importantes

- **Ne jamais éditer `site-engine.js` / `site-engine.css` / `CHECKLIST.md` directement dans un
  dossier de template.** Éditer la version dans `shared/`, puis lancer
  `node scripts/sync-shared.js` pour propager. Sinon les templates divergent silencieusement.
- `index.html` contient du CSS spécifique au template (variables `--primary`, polices, layout) —
  c'est la partie qui PEUT diverger entre templates, contrairement au moteur partagé.
- Le contenu (textes, prix, contact, SEO...) vit uniquement dans `site-content.js`, jamais en dur
  dans `index.html`. Les placeholders suivent la convention `[NOM EN MAJUSCULES]`.
- `window.FORMULE` dans `site-content.js` ("essentiel" | "standard" | "premium") contrôle quelles
  sections sont affichées via le script inline en bas de `index.html` (ex: lien réservation =
  standard+, galerie/documents = premium uniquement). Si on ajoute une section premium, il faut
  câbler son `if (f === 'premium')` correspondant dans CHAQUE template, pas seulement dans shared/.

## Workflow nouveau client

```
node scripts/new-client.js                                    # mode interactif
node scripts/new-client.js restaurant "Nom" "Ville" "Cuisine"  # mode direct
```

Crée `clients/<slug>/` à partir du template choisi et remplace automatiquement les placeholders
nom/ville/secteur dans `site-content.js` et `index.html`. Tout le reste (contact, tarifs,
agenda/menus, SEO, GA4, mentions légales, photos) reste à compléter manuellement — voir
`CHECKLIST.md` dans le dossier généré avant toute livraison.

Penser à rappeler ces étapes pour chaque nouveau client : compte GA4, Google Search Console,
mentions légales, et le remplacement complet des placeholders dans `site-content.js`.

À terme chaque client doit avoir son propre repo transférable (pas encore automatisé — process
manuel pour l'instant).

## Pas de tests / pas de CI

Vérification = ouvrir `index.html` dans un navigateur et suivre la CHECKLIST.md (contenu, SEO,
RGPD/cookies, responsive, formulaire de contact, liens).