#!/usr/bin/env node
// Confronta il testo dei pack italiani con il Manuale Base (reference/manuale.txt).
// Per ogni documento dice quante frasi si ritrovano nel manuale e quali no.
// Le frasi presenti nel manuale vanno copiate alla lettera; quelle assenti sono
// testo nostro (campi solo Foundry, incantesimi non citati…) da tradurre e rivedere.
// L'estrazione dal PDF spezza le frasi (colonne mescolate, sillabazione): il confronto
// usa quindi gruppi di 4 parole e considera «presente» una frase se almeno il 70%
// dei suoi gruppi compare nel manuale.
// Uso: node scripts/check-manuale.mjs [--pack ventures-it] [--dettagli] [--soglia 0.7]
// Solo avvisi: esce sempre con codice 0. Se il manuale manca, salta il controllo.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const PACKS = path.join(ROOT, 'src', 'packs');
const MANUALE = path.join(ROOT, 'reference', 'manuale.txt');
const args = process.argv.slice(2);
const opz = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : null);
const soloPack = opz('--pack');
const soglia = Number(opz('--soglia') ?? 0.7);
const dettagli = args.includes('--dettagli');
const N = 4;

if (!fs.existsSync(MANUALE)) {
  console.log('check-manuale: reference/manuale.txt non trovato, controllo saltato.');
  process.exit(0);
}

const norm = (s) =>
  s
    .replace(/[’‘`]/g, "'")
    .replace(/[“”«»]/g, '"')
    .replace(/(\p{L})-\s*\n\s*/gu, '$1') // sillabazione a fine riga
    .toLowerCase()
    .replace(/[^\p{L}\p{N}']+/gu, ' ')
    .trim();
const parole = (s) => norm(s).split(' ').filter(Boolean);
const gruppi = (w) => {
  const out = [];
  for (let i = 0; i + N <= w.length; i++) out.push(w.slice(i, i + N).join(' '));
  return out;
};

const manuale = new Set(gruppi(parole(fs.readFileSync(MANUALE, 'utf8'))));

function frasi(html) {
  const t = String(html ?? '')
    .replace(/@\w+\[[^\]]*\](\{[^}]*\})?/g, ' ')
    .replace(/&Reference\[[^\]]*\]/g, ' ')
    .replace(/\[\[[^\]]*\]\]/g, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ');
  return t
    .split(/(?<=[.!?;:])\s+|\n+/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => parole(s).length >= N + 2);
}

function testi(doc) {
  const out = [doc.system?.description?.value, doc.system?.description?.chat];
  for (const p of doc.pages ?? []) out.push(p.text?.content);
  for (const e of doc.effects ?? []) out.push(e.description);
  return out.filter(Boolean);
}

const packs = fs.readdirSync(PACKS).filter((d) => d.endsWith('-it') && (!soloPack || d === soloPack));
let tot = 0;
let trovate = 0;
for (const pack of packs) {
  const dir = path.join(PACKS, pack, '_source');
  if (!fs.existsSync(dir)) continue;
  const righe = [];
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
    let doc;
    try { doc = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')); } catch { continue; }
    const fs_ = testi(doc).flatMap(frasi);
    if (!fs_.length) continue;
    const assenti = fs_.filter((f) => {
      const g = gruppi(parole(f));
      return g.filter((x) => manuale.has(x)).length / g.length < soglia;
    });
    tot += fs_.length;
    trovate += fs_.length - assenti.length;
    righe.push({ file, nome: doc.name, n: fs_.length, assenti });
  }
  if (!righe.length) continue;
  const p = righe.reduce((a, r) => a + r.n, 0);
  const a = righe.reduce((a, r) => a + r.assenti.length, 0);
  console.log(`\n${pack}: ${p - a}/${p} frasi nel manuale`);
  for (const r of righe) {
    const etichetta = r.assenti.length === 0 ? 'manuale' : r.assenti.length === r.n ? 'fuori manuale' : 'misto';
    if (!dettagli && etichetta === 'manuale') continue;
    console.log(`  [${etichetta}] ${r.nome} (${r.file}): ${r.n - r.assenti.length}/${r.n}`);
    if (dettagli) for (const f of r.assenti) console.log(`      ✗ ${f.length > 140 ? f.slice(0, 140) + '…' : f}`);
  }
}
console.log(`\nTotale: ${trovate}/${tot} frasi nel manuale${soloPack ? ` (solo ${soloPack})` : ''}.`);
