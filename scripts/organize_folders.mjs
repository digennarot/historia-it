// Organizza le schede dei pack IT in cartelle colorate (documenti Folder in _source).
// Idempotente: gli ID delle cartelle sono derivati dal percorso, quindi rilanciarlo non crea duplicati.
// Uso: node scripts/organize_folders.mjs [--dry]
import fs from "fs";
import path from "path";
import crypto from "crypto";

const ROOT = path.dirname(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")));
const DRY = process.argv.includes("--dry");
const SRC = p => path.join(ROOT, "src/packs", p, "_source");

const readJson = f => { let t = fs.readFileSync(f, "utf8"); if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1); return JSON.parse(t); };
// Stesso formato dei sorgenti: 2 spazi, CRLF; newline finale solo se il file l'aveva già.
const writeJson = (f, j) => {
  const old = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null;
  let out = JSON.stringify(j, null, 2).replace(/\n/g, "\r\n");
  if (old === null || /\r?\n$/.test(old)) out += "\r\n";
  if (old !== out && !DRY) fs.writeFileSync(f, out);
  return old !== out;
};
const folderId = key => crypto.createHash("sha1").update("historia-it/" + key).digest("base64").replace(/[^A-Za-z0-9]/g, "").slice(0, 16);

// Colori condivisi
const COL = {
  Alchimista: "#2e7d32", Armigero: "#b71c1c", Erudito: "#1565c0", Furfante: "#37474f", Geniere: "#e65100",
  Magus: "#6a1b9a", Mercante: "#c79100", Mortificato: "#880e4f", Sacerdote: "#00838f", Venturiero: "#558b2f",
  comuni: "#757575",
};

function organize(pack, plan, type = "Item") {
  const dir = SRC(pack);
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
  const docs = [], oldFolders = [];
  for (const f of files) { const j = readJson(path.join(dir, f)); (j.sorting && !j.system && !j.pages ? oldFolders : docs).push([f, j]); }
  const folders = new Map(); // key -> {name,color,parent,sort,sorting}
  const ensure = (segs) => {
    let parent = null, key = "";
    for (const s of segs) {
      key = key ? key + "/" + s.name : pack + ":" + s.name;
      if (!folders.has(key)) folders.set(key, { id: folderId(key), name: s.name, color: s.color ?? null, parent, sort: s.sort ?? 0, sorting: s.sorting ?? "a" });
      parent = folders.get(key).id;
    }
    return parent;
  };
  let changed = 0;
  for (const [f, j] of docs) {
    const r = plan(j); // { path: [{name,color,sort,sorting}], sort }
    const fid = r ? ensure(r.path) : null;
    j.folder = fid; if (r && r.sort !== undefined) j.sort = r.sort;
    if (writeJson(path.join(dir, f), j)) changed++;
  }
  // rimuove cartelle non più usate e scrive quelle nuove
  const keep = new Set([...folders.values()].map(x => x.id));
  for (const [f, j] of oldFolders) if (!keep.has(j._id)) { if (!DRY) fs.unlinkSync(path.join(dir, f)); changed++; }
  for (const fo of folders.values()) {
    const doc = { name: fo.name, type, folder: fo.parent, sorting: fo.sorting, sort: fo.sort, color: fo.color, description: "", flags: {}, _id: fo.id };
    if (writeJson(path.join(dir, `folder-${fo.id}.json`), doc)) changed++;
  }
  console.log(`${pack}: ${docs.length} schede, ${folders.size} cartelle, ${changed} file modificati`);
}

// ---------- Mestieri ----------
const SUBCLASSES = {};
for (const f of fs.readdirSync(SRC("professions-it"))) { const j = readJson(path.join(SRC("professions-it"), f)); if (j.type === "subclass") (SUBCLASSES[j.system.classIdentifier] ||= []).push(j.name); }
const CLASS_BY_ID = {}; const CLASS_NAMES = {};
for (const f of fs.readdirSync(SRC("professions-it"))) { const j = readJson(path.join(SRC("professions-it"), f)); if (j.type === "class") { CLASS_BY_ID[j.system.identifier] = j.name; CLASS_NAMES[j.name] = j.system.identifier; } }
const M = (name, sort) => ({ name, color: COL[name], sorting: "m", sort });
const classOrder = Object.keys(CLASS_NAMES).sort();

organize("professions-it", j => {
  const cls = j.type === "class" ? j.name : CLASS_BY_ID[j.system.classIdentifier];
  return { path: [{ name: cls, color: COL[cls], sorting: "m", sort: classOrder.indexOf(cls) }], sort: j.type === "class" ? 0 : 100 + (SUBCLASSES[j.system.classIdentifier] || []).sort().indexOf(j.name) };
});

const CYCLES = new Set(["laCnXIgfmkXBGOqp", "sxHN617i6iO1EOzu", "fOKHMhwzuVoys9C2", "98DAiGj0avdVS6gR", "nAJxQRiq1iXw6lt0", "36RhB9pv7eX7LV5G", "RAcCz5HEPmu9OyHA", "yOI8HS1QMCUvWnHI", "fhDtJQW0lophEqls", "vsfJGG0MpBDQl0cF", "PNb6uNgVbVYYv25s", "xlDo6KayDSkRdLuX", "SFCcsXae19b48frF"]);
const ACT_ORDER = ["Calcinatio", "Putrefatio", "Distillatio", "Sublimatio"], PHASE = ["Nigredo", "Albedo", "Citrinitas", "Rubedo"];
organize("profession-features-it", j => {
  const req = j.system.requirements || "", name = j.name;
  const lvl = +(req.match(/Livello (\d+)/)?.[1] || 0);
  const base = lvl * 1000;
  if (!req) {
    if (/^(Pratica Alchemica: )?(Calcinatio|Putrefatio|Distillatio|Sublimatio) \(/.test(name)) {
      const a = ACT_ORDER.findIndex(x => name.includes(x)), p = PHASE.findIndex(x => name.includes(x));
      return { path: [M("Alchimista", classOrder.indexOf("Alchimista")), { name: "Atti alchemici", color: COL.Alchimista, sorting: "m", sort: 1 }, { name: ACT_ORDER[a], color: COL.Alchimista, sorting: "m", sort: a }], sort: p * 10 + (name.startsWith("Pratica") ? 0 : 1) };
    }
    if (name.startsWith("Ciclo:") || CYCLES.has(j._id)) return { path: [M("Alchimista", classOrder.indexOf("Alchimista")), { name: "Cicli", color: COL.Alchimista, sorting: "a", sort: 2 }] };
    if (name.startsWith("Granata")) return { path: [M("Geniere", classOrder.indexOf("Geniere")), { name: "Granate", color: COL.Geniere, sorting: "a", sort: 1 }] };
    return { path: [{ name: "Privilegi comuni", color: COL.comuni, sorting: "a", sort: 99 }] };
  }
  const cls = req.split(" Livello")[0];
  const top = M(cls, classOrder.indexOf(cls));
  const rest = req.split(",").slice(1).map(s => s.trim());
  if (cls === "Magus") {
    if (name.startsWith("Metamagia:")) return { path: [top, { name: "Metamagia", color: COL.Magus, sorting: "a", sort: 2 }] };
    const seg = name.startsWith("Segreto ") ? name : rest.find(s => s.startsWith("Segreto "));
    if (seg) return { path: [top, { name: "Segreti", color: COL.Magus, sorting: "a", sort: 1 }, { name: seg, color: COL.Magus, sorting: "m", sort: 0 }], sort: name.startsWith("Segreto ") ? 0 : base };
  }
  if (name.startsWith("Stile di Combattimento:")) return { path: [top, { name: "Stili di Combattimento", color: COL[cls], sorting: "a", sort: 1 }] };
  const sub = rest.find(s => (SUBCLASSES[CLASS_NAMES[cls]] || []).includes(s));
  if (sub) return { path: [top, { name: sub, color: COL[cls], sorting: "m", sort: 10 + SUBCLASSES[CLASS_NAMES[cls]].sort().indexOf(sub) }], sort: base };
  return { path: [top], sort: base };
});

// ---------- Specie ----------
const AVIANI = new Set(["Anseri", "Corbei", "Grarconi", "Pici", "Rapax", "Ruspei", "Strigi"]);
const ORD = fam => AVIANI.has(fam) ? { name: "Aviani", color: "#0277bd", sort: 1 } : { name: "Theri", color: "#795548", sort: 0 };
const FAM_OF = {};
organize("species-it", j => {
  const fam = j.system.type?.custom || "Altre"; FAM_OF[j.name] = fam;
  const o = ORD(fam);
  return { path: [o, { name: fam, color: o.color }] };
}, "Item");
organize("species-features-it", j => {
  if (j.system.identifier === "istinti") return { path: [{ name: "Regole generali", color: "#5d4037", sort: -1 }] };
  const req = j.system.requirements || ({ "Beccata del Picchio": "Pici" })[j.name] || "";
  const names = req.split(",").map(s => s.trim()).filter(Boolean);
  if (/aviani/i.test(req)) return { path: [{ name: "Aviani", color: "#0277bd", sort: 1 }, { name: "Regole comuni", color: "#0277bd", sort: -1 }] };
  const FAMS = new Set(Object.values(FAM_OF));
  const fams = [...new Set(names.map(n => FAMS.has(n) ? n : FAM_OF[n] || Object.entries(FAM_OF).find(([s]) => n.startsWith(s) || s.startsWith(n))?.[1]).filter(Boolean))];
  if (fams.length === 1) { const o = ORD(fams[0]); return { path: [o, { name: fams[0], color: o.color }] }; }
  if (fams.length > 1) {
    const ords = new Set(fams.map(f => ORD(f).name));
    if (ords.size === 1) { const o = ORD(fams[0]); return { path: [o, { name: "Tratti condivisi", color: o.color, sort: -1 }] }; }
    return { path: [{ name: "Tratti condivisi tra Theri e Aviani", color: "#757575", sort: 2 }] };
  }
  return { path: [{ name: "Altri tratti", color: "#757575", sort: 3 }] };
});

// ---------- Incantesimi ----------
const SPELL_COL = ["#9e9e9e", "#4caf50", "#009688", "#03a9f4", "#3f51b5", "#9c27b0", "#e91e63", "#f44336", "#ff9800", "#ffc107"];
organize("spells-it", j => { const l = j.system.level ?? 0; return { path: [{ name: l === 0 ? "Trucchetti" : `${l}° livello`, color: SPELL_COL[l], sorting: "a", sort: l }] }; });

// ---------- Equipaggiamento ----------
const W = { simpleM: ["Armi semplici da mischia", 0], simpleR: ["Armi semplici a distanza", 1], martialM: ["Armi da guerra da mischia", 2], martialR: ["Armi da guerra a distanza", 3], natural: ["Armi naturali", 4] };
const A = { light: ["Armature leggere", 0], medium: ["Armature medie", 1], heavy: ["Armature pesanti", 2], shield: ["Scudi", 3] };
const AVIAN = new Set(["uIk9IIFOmQUnAqX1", "H3J3glbNgyXSxNvb", "h7Ze2Aw6JOfCA4G7", "SlBhnq7CtNzW23mD", "DholbIql2Whf4T4G", "vPYbVVF5FyeH2a9Z", "tmeUTSqiYdZGwkh6"]); // Beccazza … Taglioni
const CONS = { ammo: "Munizioni", potion: "Pozioni", food: "Cibo e bevande", trinket: "Varie" };
organize("items-it", j => {
  const t = j.type, s = j.system.type?.value || "";
  if (t === "weapon" && j.system.properties?.includes("fir")) return { path: [{ name: "Armi", color: "#b71c1c", sort: 0 }, { name: "Armi da fuoco", color: "#b71c1c", sort: 5, sorting: "a" }] };
  if (t === "weapon" && AVIAN.has(j._id)) return { path: [{ name: "Armi", color: "#b71c1c", sort: 0 }, { name: "Armi aviane", color: "#b71c1c", sort: 6, sorting: "a" }] };
  if (t === "weapon") { const [n, o] = W[s] || ["Altre armi", 9]; return { path: [{ name: "Armi", color: "#b71c1c", sort: 0 }, { name: n, color: "#b71c1c", sort: o, sorting: "a" }] }; }
  if (t === "equipment" && A[s]) { const [n, o] = A[s]; return { path: [{ name: "Armature e scudi", color: "#455a64", sort: 1 }, { name: n, color: "#455a64", sort: o }] }; }
  if (t === "equipment") return { path: [{ name: "Abiti e accessori", color: "#7b1fa2", sort: 2 }] };
  if (t === "tool") return { path: [{ name: "Strumenti", color: "#6d4c41", sort: 3 }] };
  if (t === "container") return { path: [{ name: "Contenitori e dotazioni", color: "#8d6e63", sort: 4 }] };
  if (t === "consumable") return { path: [{ name: "Consumabili", color: "#2e7d32", sort: 5 }, { name: CONS[s] || "Varie", color: "#2e7d32" }] };
  return { path: [{ name: "Beni e merci", color: "#c79100", sort: 6 }] };
});

// ---------- Fazioni, carriere, imprese ----------
organize("factions-and-careers-it", j => j.name.startsWith("Carriera") ? { path: [{ name: "Carriere", color: "#e65100", sort: 1 }] } : { path: [{ name: "Fazioni", color: "#1565c0", sort: 0 }] });
organize("ventures-it", j => j.type === "background" ? { path: [{ name: "Venture", color: "#6a1b9a", sort: 0 }] } : { path: [{ name: "Risalti", color: "#c79100", sort: 1 }] });
