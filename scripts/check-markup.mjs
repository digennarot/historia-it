#!/usr/bin/env node
// Verifica che la revisione dei testi non abbia toccato il codice dentro i documenti.
// Confronta ogni JSON modificato in src/packs/*-it con la versione in git (default: HEAD).
// Devono restare identici: ID e campi non testuali, bersagli dei link (@UUID[…], @Compendium[…]),
// tiri [[…]], &Reference[…] e la sequenza dei tag HTML. Le {etichette} e il testo possono cambiare.
// Uso: node scripts/check-markup.mjs [--base <rev>]
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'HEAD';
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 1 << 28 });

const cambiati = git('diff', '--name-only', base, '--', 'src/packs')
  .split('\n')
  .filter((f) => /src\/packs\/[^/]+-it\/_source\/.+\.json$/.test(f));

// Campi testuali che la revisione può cambiare (come nella decisione 11).
const TESTUALI = new Set(['name', 'value', 'chat', 'content', 'description', 'title']);

function codice(html) {
  const s = String(html ?? '');
  return {
    link: [...s.matchAll(/@\w+\[[^\]]*\]/g)].map((m) => m[0]),
    tiri: [...s.matchAll(/\[\[[^\]]*\]\]/g)].map((m) => m[0]),
    ref: [...s.matchAll(/&Reference\[[^\]]*\]/g)].map((m) => m[0]),
    tag: [...s.matchAll(/<\/?([a-z0-9]+)(\s[^>]*)?>/gi)].map((m) => m[0].replace(/\s+/g, ' ')),
  };
}

// Appiattisce il documento: per i campi testuali tiene solo il codice, per gli altri il valore.
function impronta(o, p = '', out = {}) {
  if (Array.isArray(o)) o.forEach((v, i) => impronta(v, `${p}[${i}]`, out));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) impronta(v, p ? `${p}.${k}` : k, out);
  else {
    const chiave = p.split('.').pop().replace(/\[\d+\]$/, '');
    out[p] = TESTUALI.has(chiave) && typeof o === 'string' ? JSON.stringify(codice(o)) : JSON.stringify(o);
  }
  return out;
}

let problemi = 0;
for (const f of cambiati) {
  let prima, dopo;
  try { prima = JSON.parse(git('show', `${base}:${f}`)); } catch { continue; } // file nuovo
  try { dopo = JSON.parse(readFileSync(f, 'utf8')); } catch { dopo = null; }
  if (!dopo) { console.log(`✗ ${f}: JSON non valido`); problemi++; continue; }
  const a = impronta(prima), b = impronta(dopo);
  const diff = [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => a[k] !== b[k]);
  if (diff.length) {
    problemi++;
    console.log(`✗ ${f}`);
    for (const k of diff.slice(0, 8)) console.log(`    ${k}\n      prima: ${a[k]?.slice(0, 200)}\n      dopo:  ${b[k]?.slice(0, 200)}`);
  }
}

console.log(`\n${cambiati.length} file controllati, ${problemi} con codice alterato.`);
process.exit(problemi ? 1 : 0);
