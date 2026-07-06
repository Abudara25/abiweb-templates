# Pièges responsive rencontrés (et leurs correctifs)

Notes issues du projet `voix-des-voyageurs` (juin 2026) — à relire avant de coder le responsive
d'un nouveau site, pour éviter de refaire les mêmes erreurs.

## 1. Préférer les grilles `auto-fit`/`minmax` aux breakpoints `@media` pour les formulaires/cartes

**Symptôme rencontré** : un formulaire de contact en 2 colonnes fixes (`grid-template-columns:
1fr 1fr`) reste cassé sur mobile malgré un `@media (max-width: 1024px) { grid-template-columns:
1fr }` — y compris après avoir vérifié que le CSS déployé était bon. Sur l'appareil du client,
`window.innerWidth` rapportait 521px alors que `screen.width` / `document.documentElement.clientWidth`
valaient ~376px (probablement lié aux réglages d'affichage/accessibilité Android). Un breakpoint
basé sur le viewport peut donc se déclencher différemment de ce qu'on attend, sur certains
appareils réels.

**Correctif robuste** : remplacer les colonnes fixes par une grille qui se base sur la largeur
réellement disponible du conteneur, pas sur le viewport :
```css
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; }
.form-group.full { grid-column: 1 / -1; } /* plutôt que "span 2", robuste si le nb de colonnes change */
```
Ajuster le `minmax(180px, …)` selon la largeur minimale acceptable d'un champ. Plus aucun
breakpoint dédié à cette grille n'est nécessaire : elle s'adapte seule, y compris sur les
appareils dont le viewport se rapporte de façon incohérente.

Ne marche pas pour tout : les grilles avec des cellules à `grid-column: span 2` selon le
contenu (bento grids, etc.) ont encore besoin de vrais breakpoints, car `auto-fit` ne sait pas
décider *quelle* cellule doit s'étaler.

## 2. Contrôler précisément où un texte non-coupable se coupe

**Symptôme rencontré** : une adresse email longue (`overflow-wrap: anywhere`) déborde de sa
boîte sur mobile, ou se coupe à un endroit moche (ex. juste avant les 5 derniers caractères du
domaine, laissant "l.com" tout seul sur une ligne).

**Correctif** : ne pas laisser le navigateur couper n'importe où. Lui indiquer un point de
coupure précis avec `<wbr>`, et garder `overflow-wrap: anywhere` uniquement comme filet de
sécurité :
```html
<a href="mailto:contact@exemple.fr">contact@<wbr>exemple.fr</a>
```
Pour empêcher au contraire qu'un groupe de mots avec tirets (ex. un nom de ville composé) ne se
coupe au milieu, utiliser `white-space: nowrap` sur ce groupe précis plutôt que sur tout le
bloc — le reste du texte peut continuer à s'enrouler normalement autour :
```html
<span>Association loi 1901 · <span style="white-space:nowrap">Éragny-sur-Oise (95)</span></span>
```
Sans `<br>` forcé, ce motif reste sur une seule ligne quand la place est suffisante (desktop) et
ne s'enroule que si nécessaire (mobile), sans jamais fragmenter "Éragny-sur-Oise".

## 3. Éviter `justify-content: space-between` dans une grille de cartes à hauteur égale

**Symptôme rencontré** : des cartes "équipe" (avatar + bio + citation) dans une grille avec
hauteur de ligne égalisée (comportement par défaut de CSS Grid) affichaient un grand espace
blanc entre la bio et la citation — variable d'une carte à l'autre, à cause de
`.team-card { display:flex; flex-direction:column; justify-content:space-between }` qui pousse
le dernier élément en bas de la carte la plus haute de la rangée.

**Correctif** : retirer `justify-content: space-between` (juste `display:flex; flex-direction:
column` suffit) pour que le contenu s'empile naturellement de haut en bas, sans espace
arbitraire. Si un alignement en bas de carte est vraiment voulu pour un élément précis (ex. un
bouton), utiliser `margin-top: auto` uniquement sur cet élément plutôt que `space-between` sur
tout le conteneur.

## Réflexe général

Quand un bug responsive résiste à plusieurs tentatives de breakpoints `@media`, se demander si
le bon outil n'est pas plutôt une technique basée sur le contenu/conteneur (`auto-fit`,
`minmax`, `clamp()`, container queries) qui s'affranchit complètement de la fiabilité du
viewport — surtout après avoir confirmé que le CSS déployé est correct mais que le bug persiste
quand même sur l'appareil du client.
