// Guida "Creazione del Personaggio" (CAP-4): ordine dei passaggi, link risolti nei sorgenti IT,
// copertura di mestieri, avventure, fazioni, carriere, regole e specie, nessun link vietato.
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isFolderDoc } from '../scripts/pack-groups.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = pack => path.join(ROOT, 'src/packs', pack, '_source');
const readJson = f => { let t = fs.readFileSync(f, 'utf8'); if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1); return JSON.parse(t); };
const docs = pack => fs.readdirSync(SRC(pack)).filter(f => f.endsWith('.json')).map(f => readJson(path.join(SRC(pack), f)));
const GUIDE_FILE = path.join(SRC('rules-it'), 'CreazionePerso01.json');
const guide = readJson(GUIDE_FILE);
const PACKS = new Set(fs.readdirSync(path.join(ROOT, 'src/packs')).filter(d => fs.existsSync(SRC(d))));

// Tutti i link @UUID della guida, con pack, tipo, id e eventuale pagina.
const LINK = /@UUID\[Compendium\.historia-it\.([^.\]]+)\.([^.\]]+)\.([^.\]]+)(?:\.([^.\]]+)\.([^.\]]+))?\]/g;
const links = guide.pages.flatMap(p => [...p.text.content.matchAll(LINK)].map(m => ({
    page: p.name, pack: m[1], type: m[2], id: m[3], subType: m[4], subId: m[5], raw: m[0],
})));
const linkedIds = new Set(links.flatMap(l => [l.id, l.subId].filter(Boolean)));
const linkedFrom = name => new Set(guide.pages.filter(p => p.name === name).flatMap(p => [...p.text.content.matchAll(LINK)].map(m => m[3])));

// Documenti per id dentro un pack IT (i journal portano le pagine in pages[]).
const find = (pack, id) => docs(pack).find(d => d._id === id);

describe('ordine dei passaggi', () => {
    it('intro + 6 passaggi in ordine SPEC, sort crescente', () => {
        const sorted = [...guide.pages].sort((a, b) => a.sort - b.sort).map(p => p.name);
        expect(sorted).toEqual(['Creazione del Personaggio', 'Specie', 'Mestiere', 'Ventura', 'Fazione e Carriera', 'Equipaggiamento e Ricchezza', 'Istinti e Descrittori']);
    });
    it('la guida è un JournalEntry in rules-it con id fisso', () => {
        expect(guide._id).toBe('CreazionePerso01');
        expect(guide.folder).toBeNull();
    });
});

describe('link risolti', () => {
    it('ogni @UUID punta a un documento che esiste nel pack IT indicato', () => {
        const broken = links.filter(l => !PACKS.has(l.pack) || !find(l.pack, l.id)).map(l => `${l.page}: ${l.raw}`);
        expect(broken).toEqual([]);
    });
    it('ogni link a pagina di journal (es. Lista incantesimi) trova la pagina dentro il journal', () => {
        const broken = links.filter(l => l.subType === 'JournalEntryPage').filter(l => {
            const j = find(l.pack, l.id);
            return !j || !j.pages?.some(p => p._id === l.subId);
        }).map(l => `${l.page}: ${l.raw}`);
        expect(broken).toEqual([]);
    });
    it('nessun link vietato: world., dnd5e., .Folder., né pack senza id', () => {
        const forbidden = links.filter(l => !l.id || l.pack === 'dnd5e' || l.type === 'Folder' || l.subType === 'Folder').map(l => l.raw);
        const text = guide.pages.map(p => p.text.content).join('\n');
        expect(forbidden).toEqual([]);
        expect(text).not.toMatch(/Compendium\.dnd5e\.|world\.|\.Folder\./);
        expect(text).not.toMatch(/Compendium\.historia-it\.[^.\]]+\]/);
    });
});

describe('copertura', () => {
    const entries = (pack, type, pred = () => true) => docs(pack).filter(d => !isFolderDoc(d) && d.type === type && pred(d));

    it('ogni mestiere (class) è collegato nel passaggio Mestiere', () => {
        const ids = entries('professions-it', 'class').map(d => d._id);
        expect(ids).toHaveLength(10);
        expect(ids.filter(id => !linkedFrom('Mestiere').has(id))).toEqual([]);
    });
    it('ogni ventura (background) è collegata nel passaggio Ventura', () => {
        const ids = entries('ventures-it', 'background').map(d => d._id);
        expect(ids).toHaveLength(9);
        expect(ids.filter(id => !linkedFrom('Ventura').has(id))).toEqual([]);
    });
    it('ogni "Fazione:" e "Carriera:" è collegata nel passaggio Fazione e Carriera', () => {
        const fazioni = entries('factions-and-careers-it', 'feat', d => d.name.startsWith('Fazione:')).map(d => d._id);
        const carriere = entries('factions-and-careers-it', 'feat', d => d.name.startsWith('Carriera:')).map(d => d._id);
        expect(fazioni).toHaveLength(9);
        expect(carriere).toHaveLength(9);
        const missing = [...fazioni, ...carriere].filter(id => !linkedFrom('Fazione e Carriera').has(id));
        expect(missing).toEqual([]);
    });
    it('le regole collegate: Istinti, Ricchezza, Ispirazione, Fazioni e le 3 liste incantesimi', () => {
        const required = ['IstintiRegola01x', 'RicchezzaRegola1', 'IspirazioneReg01', 'FazioniRegola01x', 'IncantesMagus001', 'IncantesMortif01', 'IncantesSacerd01'];
        expect(required.filter(id => !linkedIds.has(id))).toEqual([]);
    });
    it('ogni specie (race in species-it) è collegata nel passaggio Specie', () => {
        const ids = entries('species-it', 'race').map(d => d._id);
        expect(ids).toHaveLength(66);
        expect(ids.filter(id => !linkedFrom('Specie').has(id))).toEqual([]);
    });
    it('i 9 approfondimenti di fazione (journal in factions-it, esclusa la regola) sono collegati', () => {
        const lore = docs('factions-it').filter(d => d._id !== 'FazioniRegola01x').map(d => d._id);
        expect(lore).toHaveLength(9);
        expect(lore.filter(id => !linkedFrom('Fazione e Carriera').has(id))).toEqual([]);
    });
});
