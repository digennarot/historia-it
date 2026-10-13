// Scelte di creazione come prompt di avanzamento (CAP-3): specie con competenza doppia,
// COMPETENZE dei mestieri, Competenza delle venture, scelte singole (ItemChoice) e
// validità delle chiavi Trait rispetto a dnd5e (fixture snapshottata).
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = pack => path.join(ROOT, 'src/packs', pack, '_source');
const readJson = f => { let t = fs.readFileSync(f, 'utf8'); if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1); return JSON.parse(t); };
const doc = (pack, id) => readJson(path.join(SRC(pack), `${id}.json`));
const traits = (d, level) => d.system.advancement.filter(a => a.type === 'Trait' && (level === undefined || a.level === level));
const FIXTURE = readJson(path.join(ROOT, 'tests/fixtures/dnd5e-trait-keys.json'));
const sorted = a => [...a].sort();
const norm = cs => cs.map(c => ({ count: c.count, pool: sorted(c.pool) }));

describe('specie: strumento con competenza doppia', () => {
    const CASES = [
        ['wSpj5trF0RAUJaHW', 'Procioni', 'tool:art:*'],
        ['PIA7Xot9WQDiFGbd', 'Scoiattoli', 'tool:art:*'],
        ['LhWKFJP3m8sVIGAn', 'Orsi Neri', 'tool:game:*'],
        ['ABsbgyQie8Yr12yc', 'Lontre', 'tool:*'],
    ];
    for (const [id, name, pool] of CASES) it(`${name}: Trait livello 0 forcedExpertise su ${pool}`, () => {
        const d = doc('species-it', id);
        expect(d.name, id).toBe(name);
        const exp = traits(d, 0).filter(a => a.configuration.mode === 'forcedExpertise');
        expect(exp, `${name}: una Trait forcedExpertise`).toHaveLength(1);
        expect(exp[0].configuration.grants, name).toEqual([]);
        expect(norm(exp[0].configuration.choices), name).toEqual([{ count: 1, pool: [pool] }]);
        // lo strumento raddoppiato non deve restare anche come scelta semplice (salvo Scoiattoli: Cultura da Artigiani)
        const plain = traits(d).filter(a => a.configuration.mode === 'default')
            .flatMap(a => a.configuration.choices).filter(c => c.pool.some(k => k.startsWith('tool:')));
        expect(plain.length, `${name}: scelte di strumento senza competenza doppia`).toBe(name === 'Scoiattoli' ? 1 : 0);
    });
});

describe('mestieri: COMPETENZE al livello 1', () => {
    const C = (count, ...pool) => ({ count, pool });
    const TABLE = {
        QNHCsuCkl0JiF1TZ: ['Alchimista', ['weapon:sim'], [C(2, 'tool:art:*'), C(1, 'tool:game:*')]],
        MgZx6XibW3AjaLbj: ['Armigero', ['armor:lgt', 'armor:med', 'armor:hvy', 'armor:shl', 'weapon:sim', 'weapon:mar'], []],
        AYVSHvYIYiKCU0Qw: ['Erudito', ['weapon:sim'], [C(2, 'tool:*')]],
        IDi0BwqJ0IY1rcMi: ['Furfante', ['armor:lgt', 'weapon:sim', 'tool:thief', 'languages:exotic:cant'], []],
        p8MX2Yh3gq7fMc4v: ['Geniere', ['armor:lgt', 'armor:med', 'armor:shl', 'weapon:sim', 'weapon:mar', 'tool:art:smith', 'tool:art:tinker'], []],
        WM5h9vo7vDKsm0Ls: ['Magus', [], [C(2, 'tool:art:*')]],
        RzZhZKlOJyMnuOll: ['Mercante', ['armor:lgt', 'weapon:sim'], [C(2, 'tool:art:*'), C(1, 'tool:game:*')]],
        '1HXgLO5vCof0DI8B': ['Mortificato', ['armor:lgt', 'weapon:sim'], []],
        QiAoN9B4fZFtCBr1: ['Sacerdote', ['armor:lgt', 'armor:med', 'weapon:sim'], []],
        KeYPiTNGYeoYv23c: ['Venturiero', ['armor:lgt', 'weapon:sim'], [C(2, 'tool:art:*'), C(1, 'tool:game:*')]],
    };
    for (const [id, [name, grants, choices]] of Object.entries(TABLE)) it(name, () => {
        const d = doc('professions-it', id);
        expect(d.name, id).toBe(name);
        const lv1 = traits(d, 1);
        expect(lv1, `${name}: tiri salvezza, abilità, competenze`).toHaveLength(3);
        const saves = lv1.filter(a => a.configuration.grants.some(k => k.startsWith('saves:')));
        const skills = lv1.filter(a => a.configuration.choices.some(c => c.pool.some(k => k.startsWith('skills:'))));
        expect(saves, `${name}: Trait dei tiri salvezza`).toHaveLength(1);
        expect(skills, `${name}: Trait delle abilità`).toHaveLength(1);
        const comp = lv1.find(a => a !== saves[0] && a !== skills[0]);
        expect(comp.configuration.mode, name).toBe('default');
        expect(sorted(comp.configuration.grants), `${name}: grants`).toEqual(sorted(grants));
        expect(norm(comp.configuration.choices), `${name}: choices`).toEqual(norm(choices));
    });
});

describe('venture: Competenza al livello 0', () => {
    const C = (count, ...pool) => ({ count, pool });
    const TABLE = {
        '2RudL9XHJdfwKFQy': ['Arte', [], [C(1, 'tool:music:*', 'tool:art:*')]],
        '6m4XdtLGSJONCGyH': ['Destino', [], [C(1, 'tool:art:*')]],
        EQVKo8c2oZT7dTms: ['Devozione', [], [C(1, 'tool:art:calligrapher', 'tool:art:painter', 'tool:music:*')]],
        RlpOs7TE8nVTRmcF: ['Illuminazione', [], [C(1, 'tool:herb', 'tool:art:*')]],
        xDGINo1zymssbDM2: ['Retaggio', [], [C(1, 'tool:*', 'weapon:sim:*', 'weapon:mar:*'), C(1, 'tool:vehicle:water', 'tool:vehicle:land', 'tool:art:calligrapher')]],
        mgEw2ifZzcbkeY8C: ['Rivalsa', ['tool:disg'], []],
        A50Zlc4VpAQqzr4D: ['Rivoluzione', [], [C(1, 'tool:art:*')]],
        ItcXx7JoCVf9KpMI: ['Scoperta', [], [C(1, 'tool:art:cartographer', 'tool:art:calligrapher')]],
        pdfMzj0k69yPZtuM: ['Vuoto', [], [C(1, 'tool:art:*', 'tool:game:*')]],
    };
    for (const [id, [name, grants, choices]] of Object.entries(TABLE)) it(name, () => {
        const d = doc('ventures-it', id);
        expect(d.name, id).toBe(`Ventura: ${name}`);
        const t = traits(d);
        expect(t, `${name}: una sola Trait`).toHaveLength(1);
        expect(t[0].level, name).toBe(0);
        expect(t[0].configuration.mode, name).toBe('default');
        expect(sorted(t[0].configuration.grants), `${name}: grants`).toEqual(sorted(grants));
        expect(norm(t[0].configuration.choices), `${name}: choices`).toEqual(norm(choices));
    });
});

describe('scelte singole al livello 1 (ItemChoice)', () => {
    const CASES = [
        ['MgZx6XibW3AjaLbj', 'Armigero', 'Stile di Combattimento', ['lPeCtPEnKlFMUdxu', 'eKT2LGykiE08n8FK', 'wGrx92D3YkhQ1sWZ', 'EeqiOqCOat1XQjGA', 'pvUjKQwwzcmCfbP1', '5r39IBzG3envJDxa', 'VIjDxkdNmL85tbjA']],
        ['WM5h9vo7vDKsm0Ls', 'Magus', 'primo Segreto', ['P0gKbjFhNLMjueyH', 'KHIOGDuCr7S3pHoR', 'fvhrNl3dDlra678e', 'fxZbW4CYP7W81IxY', 'tynFJ3V1sX7dIni0', 'b2ypf16KALF7jMbB', 'xNCGXMonq0Q1uo82', 'm5vhSbBcGFuBsWKn']],
    ];
    const uuid = id => `Compendium.historia-it.profession-features-it.Item.${id}`;
    for (const [id, name, title, pool] of CASES) it(`${name}: ${title}`, () => {
        const A = doc('professions-it', id).system.advancement;
        // esclude le scelte di equipaggiamento iniziale (pool in items-it, vedi starting-equipment.test.mjs)
        const ch = A.filter(a => a.type === 'ItemChoice' && a.configuration.choices?.['1'] && !a.configuration.pool.every(p => p.uuid.includes('.items-it.')));
        expect(ch, `${name}: un ItemChoice al livello 1`).toHaveLength(1);
        const c = ch[0].configuration;
        expect(ch[0].level, name).toBe(1);
        expect(c.allowDrops, name).toBe(false);
        expect(c.type, name).toBe('feat');
        expect(c.choices, name).toEqual({ '1': { count: 1, replacement: false } });
        expect(sorted(c.pool.map(p => p.uuid)), name).toEqual(sorted(pool.map(uuid)));
        for (const f of pool) expect(fs.existsSync(path.join(SRC('profession-features-it'), `${f}.json`)), f).toBe(true);
        // nessun ItemGrant opzionale di livello 1 offre ancora lo stesso pool
        const stale = A.filter(a => a.type === 'ItemGrant' && a.level === 1 &&
            (a.configuration.optional || a.configuration.items?.some(i => i.optional)) &&
            a.configuration.items?.some(i => pool.map(uuid).includes(i.uuid)));
        expect(stale.map(a => a._id), `${name}: ItemGrant opzionale residuo`).toEqual([]);
    });
});

describe('chiavi Trait valide per dnd5e', () => {
    const VALID = new Set(FIXTURE.keys);
    const MODES = new Set(FIXTURE.traitModes);
    for (const pack of ['species-it', 'professions-it', 'ventures-it']) it(pack, () => {
        const bad = [], badModes = [];
        for (const f of fs.readdirSync(SRC(pack)).filter(f => f.endsWith('.json'))) {
            const d = readJson(path.join(SRC(pack), f));
            for (const a of d.system?.advancement ?? []) {
                if (a.type !== 'Trait') continue;
                if (!MODES.has(a.configuration.mode)) badModes.push(`${d.name}: ${a.configuration.mode}`);
                const keys = [...(a.configuration.grants ?? []), ...(a.configuration.choices ?? []).flatMap(c => c.pool)];
                for (const k of keys) if (!VALID.has(k)) bad.push(`${d.name}: ${k}`);
            }
        }
        expect(bad, 'chiavi sconosciute').toEqual([]);
        expect(badModes, 'mode sconosciuti').toEqual([]);
    });

    it('gli _id degli avanzamenti sono unici per scheda e di 16 caratteri', () => {
        const bad = [];
        for (const pack of ['species-it', 'professions-it', 'ventures-it']) {
            for (const f of fs.readdirSync(SRC(pack)).filter(f => f.endsWith('.json'))) {
                const d = readJson(path.join(SRC(pack), f));
                const ids = (d.system?.advancement ?? []).map(a => a._id);
                if (new Set(ids).size !== ids.length) bad.push(`${d.name}: _id duplicati`);
                for (const i of ids) if (!/^[A-Za-z0-9]{16}$/.test(i)) bad.push(`${d.name}: ${i}`);
            }
        }
        expect(bad).toEqual([]);
    });
});

describe('righe già corrette restano invariate', () => {
    // Trait in modalità default (escluse le sole lingue) e punti liberi dell'ASI.
    const OK = {
        fU5F0zFnZNdkc3LY: { name: 'Doghi', traits: [{ grants: ['skills:ath'], choices: [{ count: 1, pool: ['skills:ins', 'skills:inv'] }] }], asiPoints: 1 },
        ioo74kudjSGI9CTS: { name: 'Bracchi', traits: [{ grants: ['skills:sur'], choices: [{ count: 1, pool: ['skills:ins', 'skills:inv'] }] }], asiPoints: 1 },
        T3rkr05nJyh4MBJ3: { name: 'Levri', traits: [{ grants: ['skills:prf'], choices: [{ count: 1, pool: ['skills:ins', 'skills:inv'] }] }], asiPoints: 1 },
        tsCZqrBbbyYPlAyy: { name: 'Primoi', traits: [{ grants: ['skills:sur'], choices: [{ count: 1, pool: ['skills:ins', 'skills:inv'] }] }], asiPoints: 1 },
        wsjCvoCFINc2QWJN: { name: 'Domesti', traits: [{ grants: ['skills:his'], choices: [{ count: 1, pool: ['skills:ins', 'skills:inv'] }, { count: 1, pool: ['tool:art:*'] }] }], asiPoints: 1 },
        h5KQTzoscVy8d9u3: { name: 'Ricci', traits: [{ grants: [], choices: [{ count: 1, pool: ['skills:nat', 'skills:sur'] }] }], asiPoints: 0 },
        hsqsSDVGorJGejO5: { name: 'Topi', traits: [{ grants: [], choices: [{ count: 1, pool: ['tool:art:*'] }] }], asiPoints: 0 },
        Mzqp3uc2ta0ehP7o: { name: 'Istrici', traits: [{ grants: ['skills:itm'], choices: [{ count: 1, pool: ['tool:art:*'] }] }], asiPoints: 0 },
        zu7ayXEwh7XK7UZd: { name: 'Castori', traits: [{ grants: ['tool:art:mason', 'tool:art:carpenter'], choices: [{ count: 1, pool: ['tool:art:*'] }] }], asiPoints: 0 },
        and5ISQJfR4CVA1A: { name: 'Leporidi', traits: [{ grants: [], choices: [{ count: 1, pool: ['skills:sur', 'skills:per'] }, { count: 1, pool: ['tool:art:*'] }] }], asiPoints: 0 },
        oCmUVqaQiPCQIRvf: { name: 'Caprini', traits: [{ grants: ['skills:prc'], choices: [{ count: 1, pool: ['skills:nat', 'skills:sur'] }] }], asiPoints: 0 },
        XikYSYEc63F2IyqW: { name: 'Orsi Bruni', traits: [{ grants: ['skills:sur', 'skills:prc'], choices: [{ count: 1, pool: ['skills:acr', 'skills:ath'] }] }], asiPoints: 0 },
        LhWKFJP3m8sVIGAn: { name: 'Orsi Neri', traits: [{ grants: ['skills:sur'], choices: [{ count: 1, pool: ['skills:acr', 'skills:ath'] }] }], asiPoints: 0 },
        x1rBnjmGB1hB5shP: { name: 'Anatre', traits: [{ grants: [], choices: [{ count: 1, pool: ['skills:*'] }] }], asiPoints: 0 },
        GQfw4CfHGvDBqWWO: { name: 'Gazze', traits: [{ grants: ['skills:dec'], choices: [{ count: 1, pool: ['skills:slt', 'skills:ste'] }] }], asiPoints: 0 },
        uHx4w8xOlyIOWI0S: { name: 'Ibis', traits: [{ grants: ['tool:art:calligrapher'], choices: [{ count: 1, pool: ['skills:arc', 'skills:nat', 'skills:his'] }] }], asiPoints: 0 },
        wSpj5trF0RAUJaHW: { name: 'Procioni', traits: [{ grants: ['skills:sur'], choices: [] }], asiPoints: 0 },
        PIA7Xot9WQDiFGbd: { name: 'Scoiattoli', traits: [{ grants: ['skills:sur', 'skills:acr'], choices: [{ count: 1, pool: ['tool:art:*'] }] }], asiPoints: 0 },
        ABsbgyQie8Yr12yc: { name: 'Lontre', traits: [{ grants: ['skills:sur'], choices: [] }], asiPoints: 0 },
        Yi2TQfmdafkYRRgR: { name: 'Gufi', traits: [{ grants: ['skills:sur'], choices: [{ count: 1, pool: ['skills:nat', 'skills:his'] }] }], asiPoints: 0 },
    };
    for (const [id, exp] of Object.entries(OK)) it(exp.name, () => {
        const d = doc('species-it', id);
        expect(d.name).toBe(exp.name);
        const t = traits(d).filter(a => a.configuration.mode === 'default' &&
            (a.configuration.choices.length || a.configuration.grants.some(g => !g.startsWith('languages'))))
            .map(a => ({ grants: a.configuration.grants, choices: a.configuration.choices }));
        expect(t).toEqual(exp.traits);
        expect(d.system.advancement.find(a => a.type === 'AbilityScoreImprovement').configuration.points).toBe(exp.asiPoints);
    });
});
