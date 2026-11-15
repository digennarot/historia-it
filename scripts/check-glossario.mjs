#!/usr/bin/env node
// Controlla i pack italiani contro glossario.json.
// Uso: node scripts/check-glossario.mjs [--pack ventures-it] [--solo-errori]
// Esce con codice 1 se trova almeno un errore.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const PACKS = path.join(ROOT, 'src', 'packs');
const args = process.argv.slice(2);
const soloPack = args.includes('--pack') ? args[args.indexOf('--pack') + 1] : null;
const soloErrori = args.includes('--solo-errori');

// Pack italiano → pack inglese corrispondente (stesso nome file).
const COPPIE = {
  'ventures-it': 'ventures',
  'factions-it': 'historia-factions',
  'factions-and-careers-it': 'factions-and-careers',
  'species-it': 'species',
  'species-features-it': 'species-features',
  'professions-it': 'professions',
  'profession-features-it': 'profession-features',
  'spells-it': 'spells-historia',
  'items-it': 'items-historia',
};

const glossario = JSON.parse(fs.readFileSync(path.join(ROOT, 'glossario.json'), 'utf8'));
const regole = [];
for (const [sezione, voci] of Object.entries(glossario)) {
  if (sezione.startsWith('_')) continue;
  for (const v of voci) {
    for (const re of v.vietati ?? []) {
      regole.push({
        re: new RegExp(re, v.cs ? 'g' : 'gi'),
        livello: v.livello ?? 'errore',
        etichetta: v.descrizione ?? `${v.en} → ${v.it}`,
        it: v.it,
        // Pack interi («actors-it») o singoli file («rules-it/X.json») a cui la regola non si applica.
        esclusi: v.esclusi ?? [],
      });
    }
  }
}
const nomiObbligati = Object.values(glossario)
  .filter(Array.isArray)
  .flat()
  .filter((v) => v.nomi)
  .map((v) => [v.en.toLowerCase(), v.it]);

// Testo visibile: via i tag HTML e i bersagli dei link, restano le {etichette}.
function visibile(s) {
  return String(s ?? '')
    .replace(/@\w+\[[^\]]*\]/g, '')
    .replace(/&Reference\[[^\]]*\]/g, '')
    .replace(/\[\[[^\]]*\]\]/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ');
}

function campi(doc) {
  const out = [];
  const add = (dove, v) => v && out.push([dove, v]);
  add('name', doc.name);
  add('description', doc.system?.description?.value);
  add('description.chat', doc.system?.description?.chat);
  for (const p of doc.pages ?? []) {
    add(`page:${p.name}`, p.name);
    add(`page:${p.name}`, p.text?.content);
  }
  for (const e of doc.effects ?? []) {
    add(`effect:${e.name}`, e.name);
    add(`effect:${e.name}`, e.description);
  }
  for (const a of doc.system?.advancement ?? []) add('advancement', a.title);
  for (const i of doc.items ?? []) {
    for (const [d, v] of campi(i)) out.push([`item:${i.name}/${d}`, v]);
  }
  return out;
}

function leggi(f) {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; }
}

const risultati = [];
const packs = fs.readdirSync(PACKS).filter((d) => d.endsWith('-it') && (!soloPack || d === soloPack));
for (const pack of packs) {
  const dir = path.join(PACKS, pack, '_source');
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const doc = leggi(path.join(dir, file));
    if (!doc) continue;
    for (const [dove, testo] of campi(doc)) {
      const t = visibile(testo);
      for (const r of regole) {
        if (r.esclusi.includes(pack) || r.esclusi.includes(`${pack}/${file}`)) continue;
        r.re.lastIndex = 0;
        let m;
        while ((m = r.re.exec(t))) {
          const ctx = t.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30).replace(/\s+/g, ' ').trim();
          risultati.push({ livello: r.livello, pack, file, dove, trovato: m[0], atteso: r.it, regola: r.etichetta, ctx });
        }
      }
    }
    // Nomi obbligati: confronto col nome del documento inglese gemello.
    const en = COPPIE[pack] && leggi(path.join(PACKS, COPPIE[pack], '_source', file));
    const obbligato = en && nomiObbligati.find(([n]) => n === String(en.name).toLowerCase());
    if (obbligato && doc.name !== obbligato[1]) {
      risultati.push({ livello: 'errore', pack, file, dove: 'name', trovato: doc.name, atteso: obbligato[1], regola: `nome di «${en.name}»`, ctx: '' });
    }
  }
}

const mostrati = soloErrori ? risultati.filter((r) => r.livello === 'errore') : risultati;
const perRegola = {};
for (const r of mostrati) (perRegola[`[${r.livello}] ${r.regola}`] ??= []).push(r);
for (const [regola, rs] of Object.entries(perRegola)) {
  console.log(`\n${regola} (${rs.length})`);
  for (const r of rs.slice(0, 15)) {
    console.log(`  ${r.pack}/${r.file} ${r.dove}: «${r.trovato}» → ${r.atteso ?? ''}${r.ctx ? `  …${r.ctx}…` : ''}`);
  }
  if (rs.length > 15) console.log(`  … e altri ${rs.length - 15}`);
}
const errori = risultati.filter((r) => r.livello === 'errore').length;
const avvisi = risultati.length - errori;
console.log(`\nTotale: ${errori} errori, ${avvisi} avvisi${soloPack ? ` (solo ${soloPack})` : ''}.`);
process.exit(errori ? 1 : 0);
