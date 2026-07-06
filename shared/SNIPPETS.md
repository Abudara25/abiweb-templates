# Snippets prêts à copier

## Carte Google Maps sans clé API

Fonctionne sans compte Google Cloud ni clé API — suffisant pour afficher l'adresse d'un client
sur la page contact :
```html
<iframe
  src="https://www.google.com/maps?q=ADRESSE+ENCODÉE&output=embed"
  loading="lazy" referrerpolicy="no-referrer-when-downgrade"
  title="Localisation de [NOM CLIENT]"
  style="border:0; border-radius:12px; width:100%; height:220px; display:block">
</iframe>
```
Encoder l'adresse (espaces → `+`, accents → `%XX`). Vérifier que ça charge avec
`curl -sL "URL" -A "Mozilla/5.0"` — un simple `curl -I` sans user-agent renvoie souvent un
301/404 trompeur à cause des redirections internes de Google.

## Formulaire de contact sans backend (formsubmit.co)

```html
<form action="https://formsubmit.co/EMAIL_DESTINATAIRE" method="POST">
  <input type="hidden" name="_subject" value="Nouveau message — [NOM CLIENT]">
  <input type="hidden" name="_captcha" value="false">
  <input type="hidden" name="_template" value="table">
  <!-- champs du formulaire -->
</form>
```
**Étape obligatoire et facile à oublier** : la première soumission envoie un email de
confirmation ("Activate Form") à `EMAIL_DESTINATAIRE`. Tant que le client n'a pas cliqué sur ce
lien, aucun message n'arrive — à tester et confirmer explicitement avant la livraison (voir
CHECKLIST.md, point "Formulaire de contact testé").

## Bandeau cookies RGPD minimal (hors site-engine.js)

À utiliser sur un site qui ne passe pas par le moteur partagé `site-engine.js`/`init()` (ex. un
site entièrement custom comme `voix-des-voyageurs`). Tant que `GA_MEASUREMENT_ID` est vide,
aucun script de mesure n'est chargé, accepté ou non :
```js
(function () {
  "use strict";
  var GA_MEASUREMENT_ID = ""; // renseigner ex. "G-XXXXXXXXXX" pour activer après consentement

  function loadAnalytics() {
    if (!GA_MEASUREMENT_ID) return;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);
  }

  function init() {
    var banner = document.getElementById("cookie-banner");
    if (!banner) return;
    var consent = localStorage.getItem("cookie-consent");
    if (consent === "accepted") { loadAnalytics(); return; }
    if (consent === "refused") return;
    banner.style.display = "flex";
    document.getElementById("cookie-accept").addEventListener("click", function () {
      localStorage.setItem("cookie-consent", "accepted");
      banner.style.display = "none";
      loadAnalytics();
    });
    document.getElementById("cookie-refuse").addEventListener("click", function () {
      localStorage.setItem("cookie-consent", "refused");
      banner.style.display = "none";
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
```
Si le site utilise déjà `site-engine.js`, préférer son `initCookieConsent()` existant plutôt que
ce snippet, pour ne pas dupliquer la logique.

## Vérifier des dimensions d'image sans l'ouvrir

Pour confirmer qu'une image fournie par le client (logo, photo) a une résolution suffisante pour
servir d'`og:image` (idéalement ≥ 1200×630, ou carrée ≥ 600×600) sans dépendance externe :
```js
const fs = require("fs");
const buf = fs.readFileSync("chemin/vers/image.jpg");
// chercher le marqueur SOF0 (0xFFC0) dans un JPEG pour lire hauteur/largeur,
// ou utiliser `file chemin/vers/image.jpg` en ligne de commande (plus simple).
```
En pratique, `file image.jpg` ou `identify image.jpg` (ImageMagick, si installé) suffit presque
toujours — n'écrire un parseur maison qu'en dernier recours.

## Contenu fourni par un outil IA (brief client, texte généré) : toujours vétoter avant intégration

Quand un client (ou un outil IA) fournit un texte tout fait pour le site, vérifier avant
d'intégrer :
- Numéros de téléphone, adresses, horaires : sont-ils réels et confirmés par le client ?
- Chiffres ou pourcentages (ex. "réduction d'impôt de 66%") : vérifiables ou à reformuler en
  termes génériques ("don déductible selon la réglementation en vigueur") ?
- Affirmations sur la sécurité/écologie/conformité ("hébergement écologique", "aucun cookie") :
  vérifiées techniquement, ou à supprimer si non confirmées ?
Mieux vaut une page plus courte et exacte qu'une page complète mais inventée — l'association ou
l'entreprise reste seule responsable du contenu publié en son nom.
