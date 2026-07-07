// ============================================================
// site-engine.js — Moteur partagé AbiWeb (SEO, RGPD, Google Analytics)
// SOURCE CANONIQUE — ne pas éditer la copie dans un dossier client.
// Pour propager un changement : éditer ce fichier puis lancer
// `node scripts/sync-shared.js`.
// ============================================================

window.AbiWebEngine = (function () {

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  function applySeo(seo) {
    if (!seo) return;
    document.title = seo.titre || document.title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = seo.description || '';

    document.querySelector('meta[name="keywords"]')?.setAttribute('content', seo.motsCles || '');
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', seo.titre || '');
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', seo.description || '');

    if (seo.googleSearchConsole) {
      document.querySelector('meta[name="google-site-verification"]')?.setAttribute('content', seo.googleSearchConsole);
    }
  }

  function loadGoogleAnalytics(gaId) {
    if (!gaId || window.__abiwebGaLoaded) return;
    window.__abiwebGaLoaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    gtag('js', new Date());
    gtag('config', gaId);
  }

  function applyLegalMentions(mentions) {
    const el = document.getElementById('mentions-content');
    if (!el) return;
    const m = mentions || {};

    el.innerHTML = `
      <p><strong>Éditeur du site :</strong> ${m.editeur || '[NOM CLIENT]'} — ${m.adresse || '[ADRESSE]'}</p>
      <p><strong>Hébergement :</strong> ${m.hebergeur || '[HÉBERGEUR]'}</p>
      ${m.siret ? `<p><strong>SIRET :</strong> ${m.siret}</p>` : ''}
      <p><strong>Suivi d'audience :</strong> Ce site utilise Google Analytics pour mesurer l'audience de manière globale. Les données et adresses IP sont anonymisées par défaut par l'outil. Vous pouvez gérer votre consentement via le bandeau cookies, ou en activant l'option « Ne pas suivre » (Do Not Track) de votre navigateur.</p>
    `;
  }

  function initLegalModal() {
    const modal = document.getElementById('modal-mentions');
    if (!modal) return;

    document.getElementById('footer-mentions-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
    });
    document.getElementById('modal-mentions-close')?.addEventListener('click', () => {
      modal.classList.remove('active');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  function initCookieConsent(gaId) {
    const banner = document.getElementById('cookie-banner');

    if (!gaId) return; // pas de tracker configuré, rien à demander

    const consent = localStorage.getItem('abiweb_consent_ga');
    if (consent === 'granted') { loadGoogleAnalytics(gaId); return; }
    if (consent === 'denied') return;

    if (!banner) { loadGoogleAnalytics(gaId); return; } // pas de bandeau dans ce template

    banner.classList.add('active');

    document.getElementById('cookie-accept')?.addEventListener('click', () => {
      localStorage.setItem('abiweb_consent_ga', 'granted');
      banner.classList.remove('active');
      loadGoogleAnalytics(gaId);
    });
    document.getElementById('cookie-refuse')?.addEventListener('click', () => {
      localStorage.setItem('abiweb_consent_ga', 'denied');
      banner.classList.remove('active');
    });
  }

  function init(c) {
    applySeo(c.seo);
    applyLegalMentions(c.mentionsLegales);
    initLegalModal();
    initCookieConsent(c.seo && c.seo.googleAnalyticsId);
  }

  return { init };
})();
