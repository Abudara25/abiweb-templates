(function () {
  "use strict";

  // Couleurs pilotées par variables CSS du projet client (avec valeur de repli
  // si elles n'existent pas) : redéfinir --accent / --text-main / --text-muted
  // dans le CSS du site, ou éditer les valeurs de repli ci-dessous.
  var COLOR_TEXT_MAIN = "var(--text-main, #1A2735)";
  var COLOR_TEXT_MUTED = "var(--text-muted, #647182)";
  var COLOR_ACCENT = "var(--accent, #215E42)";

  // Reconnaît youtube.com/watch?v=, youtu.be/, youtube.com/embed/ et /shorts/,
  // avec ou sans www., http ou https, paramètres supplémentaires (&t=, &list=...).
  function extractYouTubeId(url) {
    if (!url) return null;
    const patterns = [
      /youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const re of patterns) {
      const match = url.match(re);
      if (match) return match[1];
    }
    return null;
  }

  function buildYoutubeEmbed(id) {
    return (
      '<div style="position:relative; width:100%; aspect-ratio:16/9; border-radius:9px; overflow:hidden; background:#000">' +
      '<iframe src="https://www.youtube.com/embed/' + id + '" title="Vidéo YouTube" loading="lazy" ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen ' +
      'style="position:absolute; top:0; left:0; width:100%; height:100%; border:0"></iframe>' +
      "</div>"
    );
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  // Rendu Markdown volontairement minimal (paragraphes, gras, italique, liens) :
  // pas de dépendance externe sur un site statique sans build front. Un
  // paragraphe contenant uniquement un lien YouTube brut est automatiquement
  // converti en iframe, sans que le client ait à utiliser le champ dédié.
  function renderMarkdownLite(markdown) {
    if (!markdown) return "";
    const blocks = markdown.split(/\n\s*\n/);

    return blocks
      .map((rawBlock) => {
        const block = rawBlock.trim();
        if (!block) return "";

        if (/^https?:\/\/\S+$/.test(block)) {
          const id = extractYouTubeId(block);
          if (id) return buildYoutubeEmbed(id);
        }

        let html = escapeHtml(block);
        html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
        html = html.replace(
          /\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener">$1</a>'
        );
        html = html.replace(/\n/g, "<br>");
        return '<p style="margin:0 0 14px; font-size:0.95rem; line-height:1.7; color:' + COLOR_TEXT_MUTED + '">' + html + "</p>";
      })
      .join("");
  }

  function formatDateFr(iso) {
    try {
      return new Date(iso).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return "";
    }
  }

  // Ne garde que le premier paragraphe du texte par défaut, pour éviter des
  // cartes à rallonge quand l'actualité contient plusieurs paragraphes et/ou
  // une vidéo collée dans le texte. Le reste se déplie via "Lire la suite".
  function splitBodyPreview(markdown) {
    const blocks = (markdown || "").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
    return {
      preview: blocks.slice(0, 1).join("\n\n"),
      rest: blocks.slice(1).join("\n\n"),
      hasMore: blocks.length > 1,
    };
  }

  function renderActuCard(actu, index) {
    // Le champ dédié "Lien YouTube" est toujours converti en iframe responsive
    // et prime sur l'image d'illustration.
    const dedicatedVideoId = extractYouTubeId(actu.youtube);
    const media = dedicatedVideoId
      ? buildYoutubeEmbed(dedicatedVideoId)
      : actu.image
      ? '<img src="' + actu.image + '" alt="' + escapeHtml(actu.titre || "") +
        '" style="width:100%; aspect-ratio:16/9; object-fit:cover; border-radius:9px; display:block">'
      : "";

    const { preview, rest, hasMore } = splitBodyPreview(actu.body);

    const toggle = hasMore
      ? '<button type="button" class="actu-toggle" data-index="' + index + '" ' +
        'style="align-self:flex-start; margin:0; background:none; border:none; padding:0; color:' + COLOR_ACCENT + '; ' +
        'font-size:13px; font-weight:600; cursor:pointer; text-decoration:underline">Lire la suite</button>'
      : "";

    // class="actu-card" : à styler dans le CSS du projet (ou aliaser sur la
    // classe de carte déjà utilisée par le design du client, ex. ".bento-card").
    return (
      '<div class="actu-card">' +
      media +
      '<div style="font-size:12px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:' + COLOR_TEXT_MUTED + '">' +
      formatDateFr(actu.date) +
      "</div>" +
      '<h3 style="font-size:19px; font-weight:600; color:' + COLOR_TEXT_MAIN + '; margin:0">' +
      escapeHtml(actu.titre || "") +
      "</h3>" +
      "<div>" + renderMarkdownLite(preview) + "</div>" +
      (hasMore
        ? '<div class="actu-rest" data-index="' + index + '" style="display:none">' + renderMarkdownLite(rest) + "</div>"
        : "") +
      toggle +
      "</div>"
    );
  }

  async function initActualites() {
    const grid = document.getElementById("actualites-grid");
    const empty = document.getElementById("actualites-empty");
    if (!grid) return;

    try {
      const res = await fetch("actualites.json", { cache: "no-store" });
      if (!res.ok) throw new Error("actualites.json indisponible");
      const actualites = await res.json();

      if (!Array.isArray(actualites) || actualites.length === 0) return;

      grid.innerHTML = actualites.map((actu, i) => renderActuCard(actu, i)).join("");
      grid.style.display = "grid";
      if (empty) empty.style.display = "none";

      grid.addEventListener("click", (e) => {
        const btn = e.target.closest(".actu-toggle");
        if (!btn) return;
        const rest = grid.querySelector('.actu-rest[data-index="' + btn.dataset.index + '"]');
        if (!rest) return;
        const expanded = rest.style.display !== "none";
        rest.style.display = expanded ? "none" : "block";
        btn.textContent = expanded ? "Lire la suite" : "Réduire";
      });
    } catch (err) {
      console.warn("Actualités indisponibles :", err);
    }
  }

  document.addEventListener("DOMContentLoaded", initActualites);
})();
