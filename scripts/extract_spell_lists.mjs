// Estrattore una tantum delle liste degli incantesimi dnd5e 2014 (CAP-8).
// Legge le pagine "spells" del JournalEntry QvPDSUsAiEn3hD8s nel pack dnd5e.rules e gli incantesimi di
// dnd5e.spells, e scrive scripts/data/dnd5e-spell-lists.json (uuid, identifier, level per classe).
// Test e build usano solo il JSON committato: Foundry non serve.
// Uso: node scripts/extract_spell_lists.mjs [cartella packs di dnd5e]
//   default: %LOCALAPPDATA%/FoundryVTT/Data/systems/dnd5e/packs
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { ClassicLevel } from "classic-level";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PACKS = process.argv[2] || path.join(process.env.LOCALAPPDATA || "", "FoundryVTT/Data/systems/dnd5e/packs");
const OUT = path.join(ROOT, "scripts/data/dnd5e-spell-lists.json");
const JOURNAL = "QvPDSUsAiEn3hD8s";
const PAGES = {
  druid: "MWiN7ILEO0Vd3zAZ", wizard: "k7Rs5EyXeA0SFTXD",
  paladin: "FhucONA0yRZQjMmb", warlock: "mx4TsSbBIAaAkhQ7",
  cleric: "cuG9d7J9fQH9InYT", ranger: "sANq9JMycfSq3A5d",
};

// Copia il pack (senza LOCK) in una cartella temporanea, così Foundry può restare aperto.
async function openCopy(name) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `dnd5e-${name}-`));
  for (const f of fs.readdirSync(path.join(PACKS, name))) if (f !== "LOCK") fs.copyFileSync(path.join(PACKS, name, f), path.join(tmp, f));
  const db = new ClassicLevel(tmp, { valueEncoding: "json" });
  await db.open();
  return { db, tmp };
}

const rules = await openCopy("rules");
const spells = await openCopy("spells");
try {
  const lists = {};
  for (const [cls, pageId] of Object.entries(PAGES)) {
    const page = await rules.db.get(`!journal.pages!${JOURNAL}.${pageId}`);
    if (page.type !== "spells" || page.system.identifier !== cls) throw new Error(`${pageId}: atteso spells/${cls}, trovato ${page.type}/${page.system.identifier}`);
    const out = [];
    for (const uuid of page.system.spells) {
      const m = uuid.match(/^Compendium\.dnd5e\.spells\.Item\.([A-Za-z0-9]{16})$/);
      if (!m) throw new Error(`${cls}: uuid inatteso ${uuid}`);
      const s = await spells.db.get(`!items!${m[1]}`);
      out.push({ uuid, identifier: s.system.identifier, level: s.system.level ?? 0 });
    }
    out.sort((a, b) => a.level - b.level || a.identifier.localeCompare(b.identifier));
    lists[cls] = out;
    console.log(`${cls}: ${out.length} incantesimi`);
  }
  const data = { source: `dnd5e.rules JournalEntry ${JOURNAL} (2014)`, lists };
  fs.writeFileSync(OUT, JSON.stringify(data, null, 2).replace(/\n/g, "\r\n") + "\r\n");
  console.log(`Scritto ${path.relative(ROOT, OUT)}`);
} finally {
  for (const p of [rules, spells]) { await p.db.close(); fs.rmSync(p.tmp, { recursive: true, force: true }); }
}
