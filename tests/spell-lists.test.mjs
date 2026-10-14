// Liste degli incantesimi per mestiere (CAP-8): pagine "spells" di rules-it confrontate con le liste
// dnd5e 2014 committate, gemelli IT, Sangue Brillante, cartelle di spells-it e registrazione nel manifest.
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SPELL_LIST_JOURNAL, SPELLS_IT_PREFIX, MULTI, OTHER, levelName, mestieriBySpell, topFolderName } from '../scripts/spell-lists.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = pack => path.join(ROOT, 'src/packs', pack, '_source');
const readJson = f => { let t = fs.readFileSync(f, 'utf8'); if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1); return JSON.parse(t); };
const docs = pack => fs.readdirSync(SRC(pack)).filter(f => f.endsWith('.json')).map(f => readJson(path.join(SRC(pack), f)));

const CORE = readJson(path.join(ROOT, 'scripts/data/dnd5e-spell-lists.json')).lists;
const JOURNAL = readJson(path.join(SRC('rules-it'), `${SPELL_LIST_JOURNAL}.json`));
const SPELLS = docs('spells-it').filter(d => d.system);
const FOLDERS = new Map(docs('spells-it').filter(d => !d.system).map(d => [d._id, d]));
const CLASSES = docs('professions-it').filter(d => d.type === 'class');
const SANGUE = '1ncqhmmA7Elc38Xj';
const PAGE_UUID = id => `Compendium.historia-it.rules-it.JournalEntry.${SPELL_LIST_JOURNAL}.JournalEntryPage.${id}`;

const LISTS = [
    { name: 'Magus', identifier: 'magus', classId: 'WM5h9vo7vDKsm0Ls', core: ['druid', 'wizard'] },
    { name: 'Mortificato', identifier: 'flagellant', classId: '1HXgLO5vCof0DI8B', core: ['paladin', 'warlock'], extra: [SANGUE] },
    { name: 'Sacerdote', identifier: 'priest', classId: 'QiAoN9B4fZFtCBr1', core: ['cleric', 'ranger'] },
];
const IT_BY_IDENT = new Map(SPELLS.map(s => [s.system.identifier, s]));
// Insieme atteso: unione delle liste core, con l'UUID di spells-it al posto di quello core se l'identifier coincide.
const expected = l => new Set([
    ...l.core.flatMap(c => CORE[c]).map(s => IT_BY_IDENT.has(s.identifier) ? SPELLS_IT_PREFIX + IT_BY_IDENT.get(s.identifier)._id : s.uuid),
    ...(l.extra || []).map(id => SPELLS_IT_PREFIX + id),
]);
const page = name => JOURNAL.pages.find(p => p.name === name);
const folderPath = s => { const out = []; for (let f = FOLDERS.get(s.folder); f; f = FOLDERS.get(f.folder)) out.unshift(f.name); return out; };

describe('liste dnd5e 2014 committate', () => {
    const COUNTS = { druid: 105, wizard: 204, paladin: 31, warlock: 64, cleric: 105, ranger: 37 };
    for (const [c, n] of Object.entries(COUNTS)) it(`${c}: ${n} incantesimi di dnd5e.spells`, () => {
        expect(CORE[c]).toHaveLength(n);
        for (const s of CORE[c]) {
            expect(s.uuid, c).toMatch(/^Compendium\.dnd5e\.spells\.Item\.[A-Za-z0-9]{16}$/);
            expect(s.identifier, s.uuid).toBeTruthy();
            expect(Number.isInteger(s.level), s.uuid).toBe(true);
        }
    });
});

describe('pagine delle liste per mestiere', () => {
    it('il journal ha esattamente le 3 pagine spells', () => {
        expect(JOURNAL.pages.map(p => [p.type, p.name])).toEqual(LISTS.map(l => ['spells', l.name]));
        for (const p of JOURNAL.pages) expect(p._id, p.name).toMatch(/^[A-Za-z0-9]{16}$/);
        expect(JOURNAL._id).toMatch(/^[A-Za-z0-9]{16}$/);
    });
    for (const l of LISTS) it(`${l.name}: ${l.core.join(' + ')}`, () => {
        const cls = CLASSES.find(c => c._id === l.classId);
        expect(cls.name).toBe(l.name);
        expect(cls.system.identifier).toBe(l.identifier);
        const p = page(l.name);
        expect(p.system).toMatchObject({ type: 'class', identifier: l.identifier, grouping: 'level', unlinkedSpells: [] });
        expect(p.system.description.value).toContain(`La lista di incantesimi da ${l.name.toLowerCase()} comprende le liste di`);
        expect(new Set(p.system.spells).size, 'senza duplicati').toBe(p.system.spells.length);
        expect(new Set(p.system.spells)).toEqual(expected(l));
        // ogni UUID locale punta a un incantesimo esistente
        for (const u of p.system.spells.filter(u => u.startsWith(SPELLS_IT_PREFIX))) expect(SPELLS.some(s => SPELLS_IT_PREFIX + s._id === u), u).toBe(true);
    });
    it('gemello IT: Cerchio di Teletrasporto sostituisce teleportation-circle core', () => {
        const twin = SPELLS.find(s => s._id === '3yJW0riFacJrCMJc');
        expect(twin.system.identifier).toBe('teleportation-circle');
        const coreUuid = CORE.wizard.find(s => s.identifier === 'teleportation-circle').uuid;
        const magus = page('Magus').system.spells;
        expect(magus).toContain(SPELLS_IT_PREFIX + twin._id);
        expect(magus).not.toContain(coreUuid);
        expect(folderPath(twin)).toEqual(['Magus', levelName(5)]);
    });
    it('Sangue Brillante del Martire: solo sulla lista del Mortificato, in Mortificato › Trucchetti', () => {
        const s = SPELLS.find(x => x._id === SANGUE);
        expect(s.system.level).toBe(0);
        expect(page('Mortificato').system.spells).toContain(SPELLS_IT_PREFIX + SANGUE);
        expect(page('Magus').system.spells).not.toContain(SPELLS_IT_PREFIX + SANGUE);
        expect(page('Sacerdote').system.spells).not.toContain(SPELLS_IT_PREFIX + SANGUE);
        expect(folderPath(s)).toEqual(['Mortificato', 'Trucchetti']);
    });
});

describe('cartelle di spells-it', () => {
    const BY_SPELL = mestieriBySpell(JOURNAL);
    it('topFolderName: mestiere, Più mestieri, Altre liste', () => {
        expect(topFolderName(['Magus'])).toBe('Magus');
        expect(topFolderName(['Magus', 'Sacerdote'])).toBe(MULTI);
        expect(topFolderName([])).toBe(OTHER);
        expect(topFolderName(undefined)).toBe(OTHER);
    });
    it('mestieriBySpell: uno spell in 2 pagine va in Più mestieri', () => {
        const j = { pages: [
            { type: 'spells', name: 'Magus', sort: 0, system: { spells: [SPELLS_IT_PREFIX + 'aaaaaaaaaaaaaaaa', 'Compendium.dnd5e.spells.Item.bbbbbbbbbbbbbbbb'] } },
            { type: 'spells', name: 'Sacerdote', sort: 1, system: { spells: [SPELLS_IT_PREFIX + 'aaaaaaaaaaaaaaaa'] } },
        ] };
        const m = mestieriBySpell(j);
        expect([...m.keys()]).toEqual(['aaaaaaaaaaaaaaaa']);
        expect(topFolderName(m.get('aaaaaaaaaaaaaaaa'))).toBe(MULTI);
    });
    it('ogni incantesimo è in <cartella derivata dalle pagine> › <livello>', () => {
        for (const s of SPELLS) expect(folderPath(s), s.name).toEqual([topFolderName(BY_SPELL.get(s._id)), levelName(s.system.level ?? 0)]);
    });
    it('conteggi: 1 Magus, 1 Mortificato, 0 Più mestieri, il resto in Altre liste', () => {
        const top = s => folderPath(s)[0];
        const count = n => SPELLS.filter(s => top(s) === n).length;
        expect(SPELLS).toHaveLength(224);
        expect(count('Magus')).toBe(1);
        expect(count('Mortificato')).toBe(1);
        expect(count('Sacerdote')).toBe(0);
        expect(count(MULTI)).toBe(0);
        expect(count(OTHER)).toBe(222);
        // solo identifier core o Sangue Brillante raggiungono una lista
        const coreIds = new Set(Object.values(CORE).flat().map(s => s.identifier));
        for (const s of SPELLS) if (BY_SPELL.has(s._id)) expect(s._id === SANGUE || coreIds.has(s.system.identifier), s.name).toBe(true);
    });
});

describe('registrazione flags.dnd5e.spellLists', () => {
    const UUIDS = LISTS.map(l => PAGE_UUID(page(l.name)._id));
    const check = manifest => {
        expect(manifest.flags.dnd5e.spellLists).toEqual(UUIDS);
        for (const u of manifest.flags.dnd5e.spellLists) {
            const pageId = u.split('.').pop();
            const p = JOURNAL.pages.find(x => x._id === pageId);
            expect(p?.type, u).toBe('spells');
            expect(LISTS.find(l => l.name === p.name).identifier, u).toBe(p.system.identifier);
        }
    };
    it('module-it.json', () => check(readJson(path.join(ROOT, 'module-it.json'))));
    const BUILT = path.join(ROOT, 'historia-it/module.json');
    it.skipIf(!fs.existsSync(BUILT))('historia-it/module.json (build)', () => {
        const m = readJson(BUILT);
        check(m);
        expect(m.packs.some(p => p.name === 'rules-it' && p.type === 'JournalEntry')).toBe(true);
    });
});
