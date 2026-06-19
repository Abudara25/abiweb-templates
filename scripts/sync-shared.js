// ============================================================
// sync-shared.js — Propage shared/ vers chaque template
//
// Usage : node scripts/sync-shared.js
//
// Cherche tous les dossiers contenant un site-content.js (= un
// template client) et y copie la dernière version de
// shared/site-engine.js, shared/site-engine.css et shared/CHECKLIST.md.
//
// À lancer après toute modification dans shared/.
// ============================================================

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SHARED_DIR = path.join(ROOT, "shared");
const IGNORE_DIRS = new Set(["node_modules", ".git", "shared", "scripts", ".vscode"]);

const FILES_TO_SYNC = ["site-engine.js", "site-engine.css", "CHECKLIST.md"];

function findTemplateDirs(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (fs.existsSync(path.join(full, "site-content.js"))) {
      found.push(full);
    } else {
      findTemplateDirs(full, found);
    }
  }
  return found;
}

function main() {
  const templateDirs = findTemplateDirs(ROOT);

  if (templateDirs.length === 0) {
    console.log("Aucun template trouvé (aucun dossier avec site-content.js).");
    return;
  }

  for (const dir of templateDirs) {
    for (const file of FILES_TO_SYNC) {
      const src = path.join(SHARED_DIR, file);
      if (!fs.existsSync(src)) continue;
      fs.copyFileSync(src, path.join(dir, file));
    }
    console.log(`✓ Synchronisé : ${path.relative(ROOT, dir)}`);
  }

  console.log(`\n${templateDirs.length} template(s) à jour.`);
}

main();
