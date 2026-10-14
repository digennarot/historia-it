// Fondamenta EN (story 8a): nessun Compendium.world.* residuo nei sorgenti EN, ogni UUID EN risolve nel pack EN,
// le classi EN hanno le stesse advancement di Tratto/Incremento/Sottoclasse della controparte IT.
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = pack => path.join(ROOT, 'src/packs', pack, '_source');
const readJson = f => { let t = fs.readFileSync(f, 'utf8'); if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1); return JSON.parse(t); };
const cache = new Map();
const docs = pack => {
    if (!cache.has(pack)) cache.set(pack, fs.readdirSync(SRC(pack)).filter(f => f.endsWith('.json')).map(f => readJson(path.join(SRC(pack), f))));
    return cache.get(pack);
};
const rawText = pack => fs.readdirSync(SRC(pack)).filter(f => f.endsWith('.json')).map(f => fs.readFileSync(path.join(SRC(pack), f), 'utf8')).join('\n');

const ALL = fs.readdirSync(path.join(ROOT, 'src/packs'));
const EN_DIRS = ALL.filter(d => !d.endsWith('-it') && fs.existsSync(SRC(d)));
const IT_DIRS = ALL.filter(d => d.endsWith('-it') && fs.existsSync(SRC(d)));
// Stesso nome di pack usato da build_en.mjs: spells-historia -> spells, historia-factions -> factions.
const enPack = d => d.replace('-historia', '').replace('historia-', '');
const EN_PACK_TO_DIR = Object.fromEntries(EN_DIRS.map(d => [enPack(d), d]));

const UUID = /Compendium\.historia-en\.([a-z-]+)\.([A-Za-z]+)\.([A-Za-z0-9]+)/g;

describe('riferimenti EN', () => {
    it('nessun Compendium.world.* nei sorgenti EN, salvo flags.core.sourceId (provenienza, non link)', () => {
        const offenders = EN_DIRS.flatMap(d => rawText(d).split('\n')
            .filter(line => /Compendium\.world\./.test(line) && !/"sourceId"/.test(line))
            .map(line => `${d}: ${line.trim().slice(0, 120)}`));
        expect(offenders).toEqual([]);
    });

    it('ogni UUID EN punta a un documento esistente nel pack EN indicato', () => {
        const broken = EN_DIRS.flatMap(d => [...rawText(d).matchAll(UUID)].map(m => ({ d, pack: m[1], id: m[3], raw: m[0] })))
            .filter(l => {
                const dir = EN_PACK_TO_DIR[l.pack];
                return !dir || !docs(dir).some(doc => doc._id === l.id);
            })
            .map(l => l.raw);
        expect(broken).toEqual([]);
    });

    it('ogni link testuale @Compendium[world.<pack>.<id>] verso un pack EN punta a un documento esistente', () => {
        // Il build riscrive il pack (build_en.mjs); qui si controlla che l'id esista nel pack di destinazione.
        const TEXT = /@Compendium\[world\.([a-z-]+)\.([A-Za-z0-9]+)/g;
        const broken = EN_DIRS.flatMap(d => [...rawText(d).matchAll(TEXT)].map(m => ({ pack: m[1], id: m[2] })))
            .filter(l => EN_PACK_TO_DIR[l.pack] && !docs(EN_PACK_TO_DIR[l.pack]).some(doc => doc._id === l.id))
            .map(l => `${l.pack}.${l.id}`);
        expect(broken).toEqual([]);
    });

    it('nessun creature link morto (Compendium.world.creatures) in IT o EN', () => {
        const offenders = [...IT_DIRS, ...EN_DIRS].filter(d => /Compendium\.world\.creatures/.test(rawText(d)));
        expect(offenders).toEqual([]);
    });
});

describe('specie EN (story 8b)', () => {
    const itRaces = new Map(docs('species-it').filter(d => d.type === 'race').map(d => [d._id, d]));
    const enRaces = docs('species');

    it('66 documenti race, con gli stessi _id di species-it', () => {
        expect(enRaces.every(d => d.type === 'race')).toBe(true);
        expect(enRaces).toHaveLength(66);
        expect(enRaces.map(d => d._id).sort()).toEqual([...itRaces.keys()].sort());
    });

    it('stessa sequenza di advancement della controparte IT', () => {
        const differ = enRaces.filter(e => {
            const it = itRaces.get(e._id);
            return !it || e.system.advancement.map(a => `${a.type}:${a._id}`).join() !== it.system.advancement.map(a => `${a.type}:${a._id}`).join();
        }).map(e => e.name);
        expect(differ).toEqual([]);
    });

    it('source.book "Historia", distanze in piedi', () => {
        const offenders = enRaces.filter(d => d.system.source?.book !== 'Historia'
            || d.system.movement?.units === 'm' || d.system.senses?.units === 'm').map(d => d.name);
        expect(offenders).toEqual([]);
    });

    it('ogni feature di specie IT (incluso Istinti) ha la controparte EN con lo stesso _id', () => {
        const en = new Set(docs('species-features').map(d => d._id));
        const missing = docs('species-features-it').filter(d => d.system && !en.has(d._id)).map(d => `${d._id} ${d.name}`);
        expect(missing).toEqual([]);
    });
});

describe('advancement di classe EN', () => {
    const itClasses = new Map(docs('professions-it').filter(d => d.type === 'class' || d.type === 'subclass').map(d => [d._id, d]));
    const enClasses = docs('professions').filter(d => d.type === 'class' || d.type === 'subclass');
    const PARITY = ['Trait', 'AbilityScoreImprovement', 'Subclass'];

    it('ogni classe EN con controparte IT ha le stesse advancement Tratto, Incremento e Sottoclasse', () => {
        const missing = enClasses.filter(e => itClasses.has(e._id)).flatMap(e => {
            const it = itClasses.get(e._id);
            return it.system.advancement
                .filter(a => PARITY.includes(a.type))
                .filter(a => !e.system.advancement.some(x => x._id === a._id))
                .map(a => `${e.name}: ${a.type} ${a._id}`);
        });
        expect(missing).toEqual([]);
    });

    it('ogni pool di ItemChoice EN risolve nel pack EN degli oggetti', () => {
        const broken = enClasses.flatMap(e => e.system.advancement
            .filter(a => a.type === 'ItemChoice')
            .flatMap(a => (a.configuration.pool || []).map(p => p.uuid)))
            .filter(uuid => {
                const m = /^Compendium\.historia-en\.([^.]+)\.Item\.(.+)$/.exec(uuid || '');
                const dir = m && EN_PACK_TO_DIR[m[1]];
                return !dir || !docs(dir).some(doc => doc._id === m[2]);
            });
        expect(broken).toEqual([]);
    });
});
