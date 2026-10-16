// Fondamenta EN (story 8a): nessun Compendium.world.* residuo nei sorgenti EN, ogni UUID EN risolve nel pack EN,
// le classi EN hanno le stesse advancement di Tratto/Incremento/Sottoclasse della controparte IT.
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { enPackName, findWorldRefs, makeEnPackFor, rewriteWorldRefs } from '../scripts/en-refs.mjs';

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
const EN_PACK_TO_DIR = Object.fromEntries(EN_DIRS.map(d => [enPackName(d), d]));
const hasDoc = (dir, id) => !!dir && docs(dir).some(doc => doc._id === id);

// Forma tipizzata (pack.Item.id) e forma legacy senza tipo (pack.id): l'id è sempre di 16 caratteri.
const UUID = /Compendium\.historia-en\.([a-z0-9-]+)\.(?:([A-Za-z]+)\.)?([A-Za-z0-9]{16})/g;

describe('riferimenti EN', () => {
    it('nessun Compendium.world.* nei sorgenti EN, salvo flags.core.sourceId (provenienza, non link)', () => {
        const offenders = EN_DIRS.flatMap(d => rawText(d).split('\n')
            .filter(line => /Compendium\.world\./.test(line) && !/"sourceId"/.test(line))
            .map(line => `${d}: ${line.trim().slice(0, 120)}`));
        expect(offenders).toEqual([]);
    });

    it('ogni UUID EN (con o senza tipo) punta a un documento esistente nel pack EN indicato', () => {
        const refs = EN_DIRS.flatMap(d => [...rawText(d).matchAll(UUID)].map(m => ({ pack: m[1], id: m[3], raw: m[0] })));
        expect(refs.length).toBeGreaterThan(1000);
        expect(refs.filter(l => !hasDoc(EN_PACK_TO_DIR[l.pack], l.id)).map(l => l.raw)).toEqual([]);
    });

    it('ogni link testuale @Compendium[world.<dir>.<id>] punta a una cartella EN e a un documento esistente', () => {
        // Il build riscrive la cartella nel pack EN (scripts/en-refs.mjs); qui si risolve sulla cartella sorgente.
        const TEXT = /@Compendium\[world\.([a-z0-9-]+)\.([A-Za-z0-9]{16})/g;
        const links = EN_DIRS.flatMap(d => [...rawText(d).matchAll(TEXT)].map(m => ({ dir: m[1], id: m[2] })));
        expect(links.length).toBeGreaterThan(1000);
        const broken = links.filter(l => !EN_DIRS.includes(l.dir) || !hasDoc(l.dir, l.id)).map(l => `${l.dir}.${l.id}`);
        expect(broken).toEqual([]);
    });

    it('nessun riferimento al modulo IT (Compendium.historia-it.*) nei sorgenti EN', () => {
        expect(EN_DIRS.filter(d => /Compendium\.historia-it\./.test(rawText(d)))).toEqual([]);
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
        const enIds = new Set(enRaces.map(d => d._id));
        expect(enRaces.filter(d => !itRaces.has(d._id)).map(d => `EN senza IT: ${d.name}`)).toEqual([]);
        expect([...itRaces.values()].filter(d => !enIds.has(d._id)).map(d => `IT senza EN: ${d.name}`)).toEqual([]);
    });

    it('identifier unico per ogni race EN', () => {
        const seen = {};
        enRaces.forEach(d => (seen[d.system.identifier] ??= []).push(d.name));
        expect(Object.entries(seen).filter(([, names]) => names.length > 1)).toEqual([]);
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
        // Allineamento al Manuale solo nel pack IT: il pack EN resta fuori da questa correzione.
        const IT_ONLY = new Set([
            'k7PangolinAC17xD', // Corazzato dei pangolini: CA 17 + Destrezza
            'mNPreciseHands01', // Mani Precise
            'tLMinatriceNata1', // Minatrice Nata, strumenti da minatore
            'vCVoceStrumento1', // Voce come Strumento
            'gRDanzaStrumento', // Danza come Strumento
        ]);
        const missing = docs('species-features-it').filter(d => d.system && !en.has(d._id) && !IT_ONLY.has(d._id)).map(d => `${d._id} ${d.name}`);
        expect(missing).toEqual([]);
    });
});

describe('advancement di classe EN', () => {
    const itClasses = new Map(docs('professions-it').filter(d => d.type === 'class' || d.type === 'subclass').map(d => [d._id, d]));
    const enClasses = docs('professions').filter(d => d.type === 'class' || d.type === 'subclass');
    const PARITY = ['Trait', 'AbilityScoreImprovement', 'Subclass', 'ItemChoice'];
    // Dotazioni il cui pool contiene solo oggetti esistenti solo in IT (items-it senza controparte EN):
    // restano fuori finché quegli oggetti non hanno una versione EN (deferred-work.md).
    const IT_ONLY_POOLS = new Set(['vYn1UO0DvlOi4qh6', 'TyPMOzl2R0kuIiyC', 'gNCq60sszRBI5jXk', 'vN83YjpRutSIVrAX']);

    const pairs = () => enClasses.filter(e => itClasses.has(e._id)).map(e => [e, itClasses.get(e._id)]);
    const itemId = i => (i.uuid ?? i).split('.').pop();
    // Oggetti/privilegi che esistono anche in EN (stessi _id): gli altri sono solo IT e mancano di proposito.
    const EN_TARGETS = new Set([...docs('items-historia'), ...docs('profession-features'), ...docs('spells-historia')].map(d => d._id));

    it('mestieri e sottoclassi EN hanno esattamente le advancement IT (stessi _id, in entrambe le direzioni)', () => {
        const diff = pairs().flatMap(([e, it]) => [
            ...it.system.advancement.filter(a => !IT_ONLY_POOLS.has(a._id) && !e.system.advancement.some(x => x._id === a._id))
                .map(a => `${e.name}: manca ${a.type} ${a._id} ${a.title ?? ''}`),
            ...e.system.advancement.filter(a => !it.system.advancement.some(x => x._id === a._id))
                .map(a => `${e.name}: solo EN ${a.type} ${a._id} ${a.title ?? ''}`),
        ]);
        expect(diff).toEqual([]);
    });

    it('stesso livello e stessa configurazione della controparte IT (salvo pool/oggetti e formato spell)', () => {
        const strip = c => { const x = structuredClone(c ?? {}); delete x.pool; delete x.items; delete x.spell; return x; };
        const diff = pairs().flatMap(([e, it]) => e.system.advancement.flatMap(a => {
            const t = it.system.advancement.find(x => x._id === a._id);
            if (!t) return [];
            const out = [];
            if (a.level !== t.level) out.push(`${e.name} ${a.type} ${a._id}: livello ${a.level} invece di ${t.level}`);
            // ScaleValue: solo il formato dei dadi differisce (modifiers), non i valori.
            if (a.type !== 'ScaleValue' && JSON.stringify(strip(a.configuration)) !== JSON.stringify(strip(t.configuration)))
                out.push(`${e.name} ${a.type} ${a._id}: configurazione diversa`);
            return out;
        }));
        expect(diff).toEqual([]);
    });

    it('pool e oggetti concessi = quelli IT, tolti solo gli oggetti che esistono solo in IT', () => {
        const diff = pairs().flatMap(([e, it]) => e.system.advancement.flatMap(a => {
            const t = it.system.advancement.find(x => x._id === a._id);
            const list = c => (c?.pool ?? c?.items ?? []).map(itemId);
            if (!t || !['ItemChoice', 'ItemGrant'].includes(a.type)) return [];
            const expected = list(t.configuration).filter(id => EN_TARGETS.has(id));
            const actual = list(a.configuration);
            return JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort())
                ? [] :[`${e.name} ${a.type} ${a._id} ${a.title ?? ''}: ${actual.length} invece di ${expected.length}`];
        }));
        expect(diff).toEqual([]);
    });

    it('le advancement copiate da IT hanno titolo e hint in inglese (diversi dal testo IT)', () => {
        const italian = enClasses.filter(e => itClasses.has(e._id)).flatMap(e => {
            const itAdv = new Map(itClasses.get(e._id).system.advancement.map(a => [a._id, a]));
            return e.system.advancement.filter(a => itAdv.has(a._id) && [...PARITY, 'ItemGrant'].includes(a.type)).flatMap(a => {
                const it = itAdv.get(a._id);
                return [
                    a.title && a.title === it.title ? `${e.name} title: ${a.title}` : null,
                    a.hint && a.hint === it.hint ? `${e.name} hint: ${a.hint}` : null,
                ].filter(Boolean);
            });
        });
        expect(italian).toEqual([]);
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

describe('riscrittura world.* del build EN (scripts/en-refs.mjs)', () => {
    const enPackFor = makeEnPackFor(['profession-features', 'spells-historia', 'historia-factions', 'species-it']);

    it('UUID e link testuali verso il nome del pack EN', () => {
        expect(rewriteWorldRefs('Compendium.world.profession-features.Item.abcdefghijklmnop', enPackFor))
            .toBe('Compendium.historia-en.profession-features.Item.abcdefghijklmnop');
        expect(rewriteWorldRefs('@Compendium[world.spells-historia.abcdefghijklmnop]{Hex}', enPackFor))
            .toBe('@Compendium[historia-en.spells.abcdefghijklmnop]{Hex}');
        expect(rewriteWorldRefs('@Compendium[world.historia-factions.abcdefghijklmnop]{X}', enPackFor))
            .toBe('@Compendium[historia-en.factions.abcdefghijklmnop]{X}');
    });

    it('cartelle IT o sconosciute restano invariate e risultano irrisolte', () => {
        const val = rewriteWorldRefs('Compendium.world.species-it.Item.x @Compendium[world.feats.y]{T}', enPackFor);
        expect(val).toBe('Compendium.world.species-it.Item.x @Compendium[world.feats.y]{T}');
        expect(findWorldRefs(val)).toEqual(['Compendium.world.species-it', '@Compendium[world.feats']);
    });

    it('dopo la riscrittura nessun riferimento world.* resta nei sorgenti EN, salvo sourceId', () => {
        const enPackForAll = makeEnPackFor(ALL);
        const left = EN_DIRS.flatMap(d => rawText(d).split('\n')
            .filter(line => !/"sourceId"/.test(line))
            .flatMap(line => findWorldRefs(rewriteWorldRefs(line, enPackForAll)).map(r => `${d}: ${r}`)));
        expect(left).toEqual([]);
    });
});
