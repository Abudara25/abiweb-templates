const fs = require("fs");
const path = require("path");

const SOURCE_DIR = path.join(__dirname, "..", "data", "actualites");
const OUTPUT_FILE = path.join(__dirname, "..", "actualites.json");

function build() {
  if (!fs.existsSync(SOURCE_DIR)) {
    fs.writeFileSync(OUTPUT_FILE, "[]\n");
    console.log("Aucun dossier data/actualites — actualites.json vide généré.");
    return;
  }

  const files = fs.readdirSync(SOURCE_DIR).filter((f) => f.endsWith(".json"));

  const actualites = files.map((file) =>
    JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, file), "utf-8"))
  );

  actualites.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(actualites, null, 2) + "\n");
  console.log(`actualites.json généré avec ${actualites.length} actualité(s).`);
}

build();
