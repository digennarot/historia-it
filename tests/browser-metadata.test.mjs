// Metadati del Compendium Browser (CAP-5): una sola source book "Historia" per il modulo, libri
// normalizzati nelle fonti IT e tipi di documento dei pack Item/Actor (flags.dnd5e.types).
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isFolderDoc, packTypes } from '../scripts/pack-groups.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = pack => path.join(ROOT, 'src/packs', pack, '_source');
const readJson = f => { let t = fs.readFileSync(f, 'utf8'); if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1); return JSON.parse(t); };
const docs = pack => fs.readdirSync(SRC(pack)).filter(f => f.endsWith('.json')).map(f => readJson(path.join(SRC(pack), f)));
const IT_PACKS = fs.readdirSync(path.join(ROOT, 'src/packs')).filter(d => d.endsWith('-it') && fs.existsSync(SRC(d)));
const ENTRY_TYPES = ['race', 'class', 'subclass', 'background'];
// Libri di ogni documento non-cartella dei pack IT, compresi gli oggetti incorporati negli attori.
const BOOKS = IT_PACKS.flatMap(p => docs(p).filter(d => !isFolderDoc(d)).flatMap(d => [
    { where: `${p}/${d.name}`, book: d.system?.source?.book },
    ...(d.items ?? []).map(i => ({ where: `${p}/${d.name} → ${i.name}`, book: i.system?.source?.book })),
]));

const MODULE = readJson(path.join(ROOT, 'module-it.json'));

describe('sourceBooks del modulo', () => {
    it('una sola chiave, "Historia", così dnd5e la usa come libro di default', () => {
        expect(MODULE.flags.dnd5e.sourceBooks).toEqual({ Historia: 'Historia – Manuale Base' });
    });
});

describe('libro delle fonti IT', () => {
    it('ogni documento di tipo race, class, subclass o background ha book "Historia"', () => {
        const offenders = IT_PACKS.flatMap(p => docs(p).filter(d => !isFolderDoc(d) && ENTRY_TYPES.includes(d.type) && d.system?.source?.book !== 'Historia')
            .map(d => `${p}/${d.name} (${d.system?.source?.book})`));
        expect(offenders).toEqual([]);
    });

    it('nessuna variante di Historia resta nei pack IT, oggetti incorporati compresi', () => {
        const offenders = BOOKS.filter(b => /Historia/.test(b.book ?? '') && b.book !== 'Historia').map(b => `${b.where} (${b.book})`);
        expect(offenders).toEqual([]);
    });

    it('ogni book è "Historia" o vuoto/assente (PHB, XGE, TCE ereditano il default del modulo)', () => {
        const offenders = BOOKS.filter(b => b.book && b.book !== 'Historia').map(b => `${b.where} (${b.book})`);
        expect(offenders).toEqual([]);
        expect(BOOKS.some(b => !b.book)).toBe(true);
    });
});

describe('cartelle (isFolderDoc)', () => {
    it('riconosce le cartelle di Item e Actor dei sorgenti', () => {
        const folders = ['items-it', 'actors-it'].flatMap(p => docs(p)).filter(isFolderDoc);
        expect(folders.length).toBeGreaterThan(0);
        expect(folders.every(f => !f.system)).toBe(true);
    });
    it('type "Folder" è sempre una cartella', () => expect(isFolderDoc({ type: 'Folder' })).toBe(true));
    it('un documento con system non è una cartella', () => expect(isFolderDoc({ type: 'race', sorting: 'a', system: {} })).toBe(false));
    it('una pagina di JournalEntry non è una cartella', () => expect(isFolderDoc({ sorting: 'a', pages: [] })).toBe(false));
});

describe('tipi dei pack (packTypes)', () => {
    it('species-it → race', () => expect(packTypes(docs('species-it'))).toEqual(['race']));
    it('professions-it → class, subclass', () => expect(packTypes(docs('professions-it'))).toEqual(['class', 'subclass']));
    it('ventures-it → background, feat', () => expect(packTypes(docs('ventures-it'))).toEqual(['background', 'feat']));
    it('actors-it → npc', () => expect(packTypes(docs('actors-it'))).toEqual(['npc']));
    // In build_it.mjs le cartelle hanno già type riscritto a "Item"/"Actor": devono restare escluse.
    it('esclude le cartelle anche con type già riscritto', () => {
        expect(packTypes([{ type: 'Item', sorting: 'a' }, { type: 'race', system: {} }])).toEqual(['race']);
    });
    it('nessun documento → nessun tipo', () => expect(packTypes([])).toEqual([]));
});
