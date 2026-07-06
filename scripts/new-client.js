// ============================================================
// new-client.js — Scaffold un nouveau projet client à partir d'un template
//
// Usage interactive : node scripts/new-client.js
// Usage directe      : node scripts/new-client.js <association|restaurant|association-caritative|artisan|commerce> "<nom>" "<ville>" "<sport|cuisine|domaine d'action|métier|type de commerce>"
// ============================================================

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const ROOT = path.join(__dirname, "..");

const TEMPLATES = {
  "1": { label: "Association sportive", secteurLabel: "Sport / discipline", dir: path.join(ROOT, "association", "abiweb-template-association") },
  "2": { label: "Restaurant", secteurLabel: "Type de cuisine", dir: path.join(ROOT, "restaurant", "abiweb-template-restaurant") },
  "3": { label: "Association caritative", secteurLabel: "Domaine d'action", dir: path.join(ROOT, "association", "abiweb-template-association-caritative") },
  "4": { label: "Artisan", secteurLabel: "Métier", dir: path.join(ROOT, "artisan", "abiweb-template-artisan") },
  "5": { label: "Commerce", secteurLabel: "Type de commerce", dir: path.join(ROOT, "commerce", "abiweb-template-commerce") },
};
const TEMPLATE_ALIASES = {
  association: "1",
  "association-sportive": "1",
  restaurant: "2",
  "association-caritative": "3",
  caritative: "3",
  artisan: "4",
  commerce: "5",
  boutique: "5",
};

let rl;
function ask(q) {
  if (!rl) rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(q, resolve));
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, "utf8");
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(filePath, content, "utf8");
}

async function main() {
  const [argTemplate, argNom, argVille, argSecteur] = process.argv.slice(2);
  let template, nom, ville, secteurOuCuisine;

  if (argTemplate) {
    // Mode direct : node scripts/new-client.js association "ASC Test" "Saint-Gratien" "Football"
    template = TEMPLATES[TEMPLATE_ALIASES[argTemplate.toLowerCase()] || argTemplate];
    if (!template) { console.log(`Template inconnu : ${argTemplate} (attendu : association | restaurant | association-caritative)`); return; }
    nom = (argNom || "").trim();
    ville = (argVille || "").trim();
    secteurOuCuisine = (argSecteur || "").trim();
  } else {
    console.log("=== Nouveau projet client AbiWeb ===\n");

    console.log("Quel template ?");
    for (const [key, t] of Object.entries(TEMPLATES)) console.log(`  ${key}. ${t.label}`);
    const choice = (await ask("> ")).trim();
    template = TEMPLATES[choice];
    if (!template) { console.log("Choix invalide."); rl.close(); return; }

    nom = (await ask("Nom du client (club / restaurant / association) : ")).trim();
    ville = (await ask("Ville : ")).trim();
    secteurOuCuisine = (await ask(`${template.secteurLabel} : `)).trim();
  }

  const slug = slugify(nom) || "nouveau-client";
  const destDir = path.join(ROOT, "clients", slug);

  if (fs.existsSync(destDir)) {
    console.log(`\nLe dossier clients/${slug} existe déjà. Arrêt.`);
    if (rl) rl.close();
    return;
  }

  copyDir(template.dir, destDir);

  const contentFile = path.join(destDir, "site-content.js");
  if (template.label === "Association sportive") {
    replaceInFile(contentFile, [
      ["[NOM CLIENT] — [SPORT] à [VILLE]", `${nom} — ${secteurOuCuisine} à ${ville}`],
      ["[NOM DU CLUB]", nom],
      ["[VILLE]", ville],
      ["[SPORT / DISCIPLINE]", secteurOuCuisine],
    ]);
  } else if (template.label === "Association caritative") {
    replaceInFile(contentFile, [
      ["[NOM DE L'ASSOCIATION] — [DOMAINE D'ACTION] à [VILLE]", `${nom} — ${secteurOuCuisine} à ${ville}`],
      ["[NOM DE L'ASSOCIATION]", nom],
      ["[VILLE]", ville],
      ["[DOMAINE D'ACTION]", secteurOuCuisine],
    ]);
  } else if (template.label === "Artisan") {
    replaceInFile(contentFile, [
      ["[NOM CLIENT] — [MÉTIER] à [VILLE]", `${nom} — ${secteurOuCuisine} à ${ville}`],
      ["[NOM DE L'ARTISAN / ENTREPRISE]", nom],
      ["[VILLE]", ville],
      ["[MÉTIER · Ex: Plombier-chauffagiste]", secteurOuCuisine],
    ]);
  } else if (template.label === "Commerce") {
    replaceInFile(contentFile, [
      ["[NOM CLIENT] — [TYPE DE COMMERCE] à [VILLE]", `${nom} — ${secteurOuCuisine} à ${ville}`],
      ["[NOM DE LA BOUTIQUE]", nom],
      ["[VILLE]", ville],
      ["[Type de commerce · Ex: Épicerie fine]", secteurOuCuisine],
    ]);
  } else {
    replaceInFile(contentFile, [
      ["[NOM DU RESTAURANT] — [TYPE DE CUISINE] à [VILLE]", `${nom} — ${secteurOuCuisine} à ${ville}`],
      ["[NOM DU RESTAURANT]", nom],
      ["[VILLE]", ville],
      ["[Type de cuisine · Ex: Cuisine française]", secteurOuCuisine],
    ]);
  }

  const indexFile = path.join(destDir, "index.html");
  replaceInFile(indexFile, [
    ["[NOM DU CLUB]", nom],
    ["[NOM DU RESTAURANT]", nom],
    ["[NOM DE L'ASSOCIATION]", nom],
    ["[NOM DE L'ARTISAN / ENTREPRISE]", nom],
    ["[NOM DE LA BOUTIQUE]", nom],
    ["[VILLE]", ville],
    ["[TYPE DE CUISINE]", secteurOuCuisine],
    ["[DOMAINE D'ACTION]", secteurOuCuisine],
    ["[MÉTIER]", secteurOuCuisine],
    ["[TYPE DE COMMERCE]", secteurOuCuisine],
  ]);

  console.log(`\n✓ Projet créé dans clients/${slug}/`);
  console.log("  Reste à compléter manuellement : contact, tarifs, agenda/menus, SEO, GA, mentions légales.");
  console.log("  Voir CHECKLIST.md dans ce dossier avant livraison.");

  if (rl) rl.close();
}

main();
