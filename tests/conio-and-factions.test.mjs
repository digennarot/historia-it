// Conio sulla scheda (CAP-7) e grado d'ingresso di fazioni e carriere (CAP-2).
// Il Conio vive nella risorsa dnd5e `system.resources.primary`: ogni ventura, fazione e
// privilegio a Conio fisso ha un effetto trasferito "Conio" che imposta l'etichetta (OVERRIDE)
// e somma il proprio valore al massimo (ADD). Le carriere danno le competenze del GRADO 0
// come avanzamenti Trait di livello 0.
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = pack => path.join(ROOT, 'src/packs', pack, '_source');
const readJson = f => { let t = fs.readFileSync(f, 'utf8'); if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1); return JSON.parse(t); };
const doc = (pack, id) => readJson(path.join(SRC(pack), `${id}.json`));
const docs = pack => fs.readdirSync(SRC(pack)).filter(f => f.endsWith('.json') && !f.startsWith('folder-')).map(f => readJson(path.join(SRC(pack), f)));
const FIXTURE = readJson(path.join(ROOT, 'tests/fixtures/dnd5e-trait-keys.json'));
const sorted = a => [...a].sort();
const norm = cs => cs.map(c => ({ count: c.count, pool: sorted(c.pool) }));
const MAX = 'system.resources.primary.max';
const LABEL = 'system.resources.primary.label';
const conioEffects = d => (d.effects ?? []).filter(e => e.changes?.some(c => c.key.startsWith('system.resources.primary')));

function expectConio(d, delta) {
    const eff = conioEffects(d);
    expect(eff, `${d.name}: un effetto Conio`).toHaveLength(1);
    const e = eff[0];
    expect(e.name, d.name).toBe('Conio');
    expect(e.transfer, `${d.name}: transfer`).toBe(true);
    expect(e.disabled, d.name).toBe(false);
    expect(e._id, d.name).toMatch(/^[A-Za-z0-9]{16}$/);
    const label = e.changes.filter(c => c.key === LABEL);
    const max = e.changes.filter(c => c.key === MAX);
    expect(e.changes, `${d.name}: solo etichetta e massimo`).toHaveLength(2);
    expect(label, d.name).toEqual([{ key: LABEL, mode: 5, value: 'Conio', priority: 10 }]);
    expect(max, d.name).toEqual([{ key: MAX, mode: 2, value: String(delta), priority: 20 }]);
    // nessun effetto sul valore corrente (decisione 1)
    expect(e.changes.some(c => c.key === 'system.resources.primary.value'), d.name).toBe(false);
}

describe('venture: Conio come effetto', () => {
    const V = {
        '2RudL9XHJdfwKFQy': ['Arte', 10], '6m4XdtLGSJONCGyH': ['Destino', 10], EQVKo8c2oZT7dTms: ['Devozione', 10],
        RlpOs7TE8nVTRmcF: ['Illuminazione', 5], xDGINo1zymssbDM2: ['Retaggio', 15], mgEw2ifZzcbkeY8C: ['Rivalsa', 10],
        A50Zlc4VpAQqzr4D: ['Rivoluzione', 10], ItcXx7JoCVf9KpMI: ['Scoperta', 15], pdfMzj0k69yPZtuM: ['Vuoto', 5],
    };
    for (const [id, [name, v]] of Object.entries(V)) it(`${name}: +${v}`, () => {
        const d = doc('ventures-it', id);
        expect(d.name, id).toBe(`Ventura: ${name}`);
        expectConio(d, v);
        // il Conio nel testo della ventura coincide con l'effetto
        expect(d.system.description.value, name).toMatch(new RegExp(`Conio:?\\s*(</?[^>]+>\\s*)*${v}\\b`));
    });
    it('tutte le venture sono coperte', () => {
        const all = docs('ventures-it').filter(d => d.type === 'background').map(d => d._id);
        expect(sorted(all)).toEqual(sorted(Object.keys(V)));
    });
});

describe('fazioni: GRADO 0 dà Conio +10', () => {
    const F = {
        '0pLN2gwPO95Kkjm4': 'Circolo dei Sussurri', '1B2epGNowYUtOfkg': 'Eresia del Carlino', Hx18bwHTQdWVat0N: 'Esercito del Popolo',
        T7l2BFZvgCBh3VVk: 'Confraternita dei Mortificati', UobVIg6Tr5USCMxl: 'Ordo Artis Occulta', WVwPM073oCy8GrkA: 'Compagnia del Compasso',
        gEzlGxNnZXAajfda: 'Chiesa delle Ossa', gZrfLfDiFDF6mzp9: 'Fratellanza dei Vermi', ghm4RNFP67FFzRqy: 'Emissari del Khan',
    };
    for (const [id, name] of Object.entries(F)) it(name, () => {
        const d = doc('factions-and-careers-it', id);
        expect(d.name, id).toBe(`Fazione: ${name}`);
        expectConio(d, 10);
        expect(d.system.advancement ?? [], `${name}: nessun avanzamento`).toEqual([]);
    });
    it('tutte le fazioni sono coperte', () => {
        const all = docs('factions-and-careers-it').filter(d => d.name.startsWith('Fazione:')).map(d => d._id);
        expect(sorted(all)).toEqual(sorted(Object.keys(F)));
    });
});

describe('privilegi a Conio fisso', () => {
    const P = [['jNqgM6DCh2HHYNfS', 'Fuori dalla Norma', -1], ['xKWEOhlSlY2L6Slo', 'Piombo in Oro', 10], ['WPD9Wjxw99U78YW1', 'Pietra Filosofale', 15]];
    for (const [id, name, v] of P) it(`${name}: ${v > 0 ? '+' : ''}${v}`, () => {
        const d = doc('profession-features-it', id);
        expect(d.name, id).toBe(name);
        expectConio(d, v);
    });
    it('privilegi a Conio per livello restano solo testo (decisione 2)', () => {
        const PER_LEVEL = ["Il Mattino ha l'Oro in Bocca", 'Tagliaborse', 'Estetica Innanzitutto', 'Trovare i Fondi', 'Fare la Felicità'];
        const all = docs('profession-features-it');
        for (const n of PER_LEVEL) {
            const m = all.filter(d => d.name === n);
            expect(m, n).toHaveLength(1);
            expect(conioEffects(m[0]), `${n}: nessun effetto Conio`).toEqual([]);
        }
    });
    it('nessun altro privilegio tocca la risorsa Conio', () => {
        const ids = new Set(P.map(p => p[0]));
        const extra = docs('profession-features-it').filter(d => !ids.has(d._id) && conioEffects(d).length).map(d => d.name);
        expect(extra).toEqual([]);
    });
});

describe('carriere: competenze del GRADO 0', () => {
    const C = (count, ...pool) => ({ count, pool });
    const K = {
        Uc3sofemoI3Iy4F5: ['Artigiano', 'Apprendista', [], [C(1, 'tool:art:*')]],
        Qd22eQIjER4UW5eV: ['Artista', 'Esordiente', [], [C(1, 'tool:music:*', 'tool:art:*')]],
        VJw8vaow7BxDB5eL: ['Cartografo', 'Dilettante', ['tool:art:cartographer'], []],
        GVMUYZVSRtauWfgZ: ['Fuorilegge', 'Feccia', ['tool:disg'], []],
        OYungWLHXMiPQIje: ['Funzionario', 'Galoppino', [], [C(1, 'skills:per', 'skills:dec')]],
        JO2tz4wkniDghX1k: ['Maestro', 'Studioso', [], [C(1, 'skills:arc', 'skills:inv', 'skills:nat', 'skills:rel', 'skills:his'), C(1, 'tool:art:*')]],
        Rt0D9uk8X6VVXi2P: ['Marinaio', 'Mozzo', [], [C(1, 'tool:game:*')]],
        GMLTL48imFYVpAoC: ['Milite', 'Cadetto', ['skills:sur'], [C(1, 'tool:art:*')]],
        r2eavWp6IhetJkBV: ['Storico', 'Cronista', ['tool:art:calligrapher'], []],
    };
    for (const [id, [name, rank, grants, choices]] of Object.entries(K)) it(name, () => {
        const d = doc('factions-and-careers-it', id);
        expect(d.name, id).toBe(`Carriera: ${name}`);
        const A = d.system.advancement;
        expect(A, `${name}: un solo avanzamento`).toHaveLength(1);
        const t = A[0];
        expect(t.type, name).toBe('Trait');
        expect(t.level, name).toBe(0);
        expect(t.title, name).toBe(`Grado 0 – ${rank}`);
        expect(t.configuration.mode, name).toBe('default');
        expect(sorted(t.configuration.grants), `${name}: grants`).toEqual(sorted(grants));
        expect(norm(t.configuration.choices), `${name}: choices`).toEqual(norm(choices));
        // la carriera non tocca il Conio al GRADO 0
        expect(conioEffects(d), name).toEqual([]);
        // il rango compare nel testo del GRADO 0
        expect(d.system.description.value.toUpperCase(), name).toContain(`GRADO 0 – ${rank.toUpperCase()}`);
    });
    it('tutte le carriere sono coperte', () => {
        const all = docs('factions-and-careers-it').filter(d => d.name.startsWith('Carriera:')).map(d => d._id);
        expect(sorted(all)).toEqual(sorted(Object.keys(K)));
    });
    it('chiavi Trait valide per dnd5e', () => {
        const VALID = new Set(FIXTURE.keys), MODES = new Set(FIXTURE.traitModes);
        const bad = [];
        for (const d of docs('factions-and-careers-it')) for (const a of d.system?.advancement ?? []) {
            if (a.type !== 'Trait') continue;
            if (!MODES.has(a.configuration.mode)) bad.push(`${d.name}: mode ${a.configuration.mode}`);
            for (const k of [...a.configuration.grants, ...a.configuration.choices.flatMap(c => c.pool)]) if (!VALID.has(k)) bad.push(`${d.name}: ${k}`);
        }
        expect(bad, 'chiavi sconosciute').toEqual([]);
    });
});

describe('_id unici', () => {
    it('effetti e avanzamenti hanno _id di 16 caratteri, unici per scheda', () => {
        const bad = [];
        for (const pack of ['ventures-it', 'factions-and-careers-it', 'profession-features-it']) for (const d of docs(pack)) {
            const ids = [...(d.effects ?? []).map(e => e._id), ...(d.system?.advancement ?? []).map(a => a._id)];
            if (new Set(ids).size !== ids.length) bad.push(`${d.name}: _id duplicati`);
            for (const i of ids) if (!/^[A-Za-z0-9]{16}$/.test(i)) bad.push(`${d.name}: ${i}`);
        }
        expect(bad).toEqual([]);
    });
    it('gli _id degli effetti Conio sono unici fra tutti i pack', () => {
        const ids = ['ventures-it', 'factions-and-careers-it', 'profession-features-it']
            .flatMap(p => docs(p).flatMap(d => conioEffects(d).map(e => e._id)));
        expect(ids).toHaveLength(21);
        expect(new Set(ids).size).toBe(ids.length);
    });
});
