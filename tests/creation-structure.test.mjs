// Struttura di creazione del personaggio (CAP-1): ordine dei gruppi di pack nella barra
// dei compendi IT e regola delle cartelle per i pack d'ingresso (src/packs/*-it/_source).
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PACK_GROUPS, buildPackLayout } from '../scripts/pack-groups.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = pack => path.join(ROOT, 'src/packs', pack, '_source');

const readJson = f => { let t = fs.readFileSync(f, 'utf8'); if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1); return JSON.parse(t); };
const isFolder = j => j.sorting !== undefined && !j.system && !j.pages;

// Pack d'ingresso e criterio per riconoscere le schede d'ingresso.
const ENTRY_TYPES = new Set(['race', 'class', 'subclass', 'background']);
const isFactionCareer = j => j.type === 'feat' && /^(Fazione|Carriera): /.test(j.name);
const ENTRY_PACKS = {
    'species-it': j => ENTRY_TYPES.has(j.type),
    'professions-it': j => ENTRY_TYPES.has(j.type),
    'ventures-it': j => ENTRY_TYPES.has(j.type),
    'factions-and-careers-it': j => ENTRY_TYPES.has(j.type) || isFactionCareer(j),
};

function loadPack(pack) {
    const folders = new Map(), docs = [];
    for (const f of fs.readdirSync(SRC(pack)).filter(f => f.endsWith('.json'))) {
        const j = readJson(path.join(SRC(pack), f));
        if (isFolder(j)) folders.set(j._id, j); else docs.push(j);
    }
    return { folders, docs };
}

// Numero di cartelle dalla radice del pack alla scheda (0 se non archiviata).
function folderDepth(folders, id) {
    let depth = 0;
    const seen = new Set();
    while (id) {
        if (seen.has(id)) throw new Error(`ciclo di cartelle su ${id}`);
        seen.add(id);
        const fo = folders.get(id);
        if (!fo) throw new Error(`cartella mancante ${id}`);
        depth++;
        id = fo.folder ?? null;
    }
    return depth;
}

describe('ordine dei gruppi di pack (barra dei compendi IT)', () => {
    it('segue i passi di creazione: Specie → Mestiere → Ventura → Fazione/Carriera', () => {
        expect(PACK_GROUPS.map(g => [g.name, g.packs])).toEqual([
            ['Regole', ['rules']],
            ['Personaggio', ['species', 'species-features', 'professions', 'profession-features', 'ventures', 'factions-and-careers']],
            ['Mondo', ['factions', 'characters', 'actors']],
            ['Equipaggiamento e Magia', ['items', 'spells']],
        ]);
    });

    it('ogni pack IT in src/packs (con _source) appartiene a un gruppo', () => {
        const listed = new Set(PACK_GROUPS.flatMap(g => g.packs.map(n => `${n}-it`)));
        const itPacks = fs.readdirSync(path.join(ROOT, 'src/packs'))
            .filter(d => d.endsWith('-it') && fs.existsSync(SRC(d)));
        expect(itPacks.filter(d => !listed.has(d))).toEqual([]);
    });

    it('buildPackLayout produce packs e packFolders nell\'ordine dei passi', () => {
        const names = ['actors-it', 'items-it', 'spells-it', 'rules-it', 'ventures-it', 'factions-and-careers-it', 'factions-it',
            'characters-it', 'professions-it', 'profession-features-it', 'species-it', 'species-features-it', 'extra-it'];
        const stub = names.map(name => ({ name, label: name, path: `packs/${name}`, type: 'Item', system: 'dnd5e' }));
        const { packs, packFolders } = buildPackLayout(stub);
        const groups = [
            ['Regole', ['rules-it']],
            ['Personaggio', ['species-it', 'species-features-it', 'professions-it', 'profession-features-it', 'ventures-it', 'factions-and-careers-it']],
            ['Mondo', ['factions-it', 'characters-it', 'actors-it']],
            ['Equipaggiamento e Magia', ['items-it', 'spells-it']],
        ];
        // i pack restano gli stessi oggetti; quelli non elencati sono accodati in fondo
        expect(packs.every(p => stub.includes(p))).toBe(true);
        expect(packs.map(p => p.name)).toEqual([...groups.flatMap(([, ps]) => ps), 'extra-it']);
        expect(packFolders).toHaveLength(1);
        expect(packFolders[0]).toMatchObject({ name: 'Historia', packs: [] });
        expect(packFolders[0].folders.map(f => [f.name, f.packs])).toEqual(groups);
        expect(packFolders[0].folders.every(f => f.folders.length === 0)).toBe(true);
    });

    it('ogni pack elencato esiste come pack IT', () => {
        for (const n of PACK_GROUPS.flatMap(g => g.packs)) {
            expect(fs.existsSync(SRC(`${n}-it`)), `${n}-it`).toBe(true);
        }
    });
});

describe('cartelle dei pack d\'ingresso (CAP-1)', () => {
    for (const [pack, isEntry] of Object.entries(ENTRY_PACKS)) {
        describe(pack, () => {
            const { folders, docs } = loadPack(pack);
            const entries = docs.filter(isEntry);

            it('contiene schede d\'ingresso', () => {
                expect(entries.length).toBeGreaterThan(0);
            });

            it('ogni scheda d\'ingresso è archiviata in una cartella, a profondità 1–2', () => {
                const bad = entries
                    .map(j => ({ j, d: j.folder ? folderDepth(folders, j.folder) : 0 }))
                    .filter(({ d }) => d < 1 || d > 2)
                    .map(({ j, d }) => `${j.name} (${j._id}): ${d === 0 ? 'non archiviata' : `profondità ${d}`}`);
                expect(bad).toEqual([]);
            });

            it('nessuna cartella contiene sia schede d\'ingresso sia altre schede', () => {
                const byFolder = new Map();
                for (const j of docs) {
                    if (!j.folder) continue;
                    const k = byFolder.get(j.folder) || { entry: 0, other: 0 };
                    isEntry(j) ? k.entry++ : k.other++;
                    byFolder.set(j.folder, k);
                }
                const mixed = [...byFolder]
                    .filter(([, k]) => k.entry && k.other)
                    .map(([id, k]) => `${folders.get(id)?.name ?? '?'} (${id}): ${k.entry} d'ingresso, ${k.other} altre`);
                expect(mixed).toEqual([]);
            });
        });
    }
});
