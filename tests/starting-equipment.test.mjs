// Equipaggiamento iniziale (CAP-2): EQUIPAGGIAMENTO dei mestieri e Dotazione delle venture.
// Due livelli: `system.startingEquipment` (albero fedele al manuale, solo descrittivo in dnd5e)
// e avanzamenti ItemGrant/ItemChoice che mettono gli oggetti sulla scheda al drop.
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = pack => path.join(ROOT, 'src/packs', pack, '_source');
const readJson = f => { let t = fs.readFileSync(f, 'utf8'); if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1); return JSON.parse(t); };
const doc = (pack, id) => readJson(path.join(SRC(pack), `${id}.json`));
const ITEMS = fs.readdirSync(SRC('items-it')).filter(f => f.endsWith('.json') && !f.startsWith('folder-'))
    .map(f => readJson(path.join(SRC('items-it'), f)));
const FOLDERS = fs.readdirSync(SRC('items-it')).filter(f => f.startsWith('folder-')).map(f => readJson(path.join(SRC('items-it'), f)));
const BY_ID = new Map(ITEMS.map(d => [d._id, d]));
const PREFIX = 'Compendium.historia-it.items-it.Item.';
const idOf = uuid => uuid.startsWith(PREFIX) ? uuid.slice(PREFIX.length) : null;
const sorted = a => [...a].sort();

// ---------- oggetti nuovi (per nome) ----------
const NEW_ITEMS = ['Dotazione da Avventuriero', 'Dotazione da Diplomatico', 'Dotazione da Intrattenitore', 'Dotazione da Sacerdote',
    'Dotazione da Studioso', 'Cilicio', 'Carico di Merci', 'Spezie', 'Cammeo', 'Simbolo del Retaggio', 'Oggetto della Missione'];
const byName = n => { const m = ITEMS.filter(d => d.name === n); return m.length === 1 ? m[0]._id : undefined; };

// ---------- id degli oggetti ----------
const I = {
    Spadino: 'qXGilOaaQFl4p4Un', BastoneFerrato: 'BGFmikdI18JGPU3K', Bastone: 'erHvzoIDWZ0nJELU', Pugnale: '5Nd4TF3NkbOTZ187', Coltellaccio: 'ePg416CsyzGtklIE',
    Mazza: 'Y2sqybZIH6bKUa8R', Accetta: 'XtOtRhTFzd8JAi9o', Arco: '4qVrJVdKFk8tcCHw', ArcoRicurvo: 'yooaw66ZKbhtyH1P', Balestra: 'lU3ip25Fp5doQcx2',
    Sciabola: 'j96W2SsPO9komQvn', Spada: 'SBpfCF0rmolNIkWu', SpadaLato: 'u17arUI2ftKgvJ83', Mazzafrusto: 'FUQyIknhYyWW9Em0', Martello: 'lj1y5iSTcUAtHfgW',
    Pistola: 'UkAElWbCiijzPmhZ', Archibugio: 'WGyfmtR0RsnbHDfn', Moschetto: 'Si18v5nixF55S6bW',
    Bacchetta: 'Biiv2bVQnaWRMez9', Verga: 'bEMp7uHNDuLZA1lc', Cristallo: 'ADualyRziGqWuieQ', Sfera: 'B0GCaObIFRsxEGkr',
    Frecce: 'E7yQ2F7FNSjqfuZe', Quadrelli: 'BuAAPZBBsMTbPn1t', Faretra: 'aMOSLGkgGAauVgq4', Munizioni: 'kBi1Wp0Rzhe9fMOD', Polvere: 'g9nzKOkTZEVTbDFv',
    BorsaComp: 'ffbkLTFIyVvcyuoY', Carro: 'xzoCTmsgH8gUJAvT',
    Giaco: 'axFkbuLN7TsKwFLS', Gambesone: 'B49PpUp5xXgAJgP3', Maglia: 'Y0dNKamVzDsBqzhM', Tabarda: 'xLROg166m151SszM', Cotta: 'CottaDArmeHist01', Scudo: 'e9QypmRvUHRTL7Ek',
    Amuleto: '8A30L14zh2S7WUiy', Emblema: 'ewMnqSgmr2nahh6S', Reliquiario: 'MU4wZNJ0RWflxNGh',
    FocusAlch: 'oZVJ2Xk6qNoDVWDt', TomoAlch: 'Nu5fvTH0FP4zU2Eg', LibroBianco: '4IiDAqVeZfUbySFJ', Tomo: 'P9WYeAzZU2udtob9',
    DotEspl: '5oH06F3e7IrqPcnQ', DotScass: '7fn2LUl479d4ITzZ', Pipa: 'lALKDjKc82KepeSB', Erbe: 'fHmIxO75bXDSJ41m', PrimaOpera: '8gKD5ddOZP9iMM0b',
    Ninnolo: 'a3HKvluCwMRP08jA', Diario: '6EZtf6ZA7prUZCl4', Breviario: 'Wgg9yqzNMZgoWPFZ', Bussola: '4dPtop48YY2TMJKy', Libro: 'IUIFo6gSvZx9dYGC',
    Mappe: 'oSbX3p2l4b1vMoQ8', Anello: 'g8gk6I6zutQtdeEh',
    AbitiComuni: 'f1CvExza5HBk3vsW', AbitiPregiati: '763NeIs7sDEnu9ls', Costume: '9g3PuuSGmS0o5Xyh',
    Scasso: '5DzlmRQWpaCcQOuA', BorsaErb: '5X2Mhhp1uK8Ja52R', Fabbro: 'RWWtIIwtXbpJ77Fw', Inventore: '2FJs1h80EYdzB6wV', Calligrafo: '0DDWQqo0VJPH89dA',
    Pittore: '1OuHNlJivOa5tbCQ', Cartografo: '5QS5bHJubNNKMJVK', Camuffamento: 'BgcRwEm63FvEfApD',
    DotAvv: byName('Dotazione da Avventuriero'), DotDipl: byName('Dotazione da Diplomatico'), DotIntr: byName('Dotazione da Intrattenitore'),
    DotSac: byName('Dotazione da Sacerdote'), DotStud: byName('Dotazione da Studioso'), Cilicio: byName('Cilicio'), Carico: byName('Carico di Merci'),
    Spezie: byName('Spezie'), Cammeo: byName('Cammeo'), SimbRet: byName('Simbolo del Retaggio'), OggMiss: byName('Oggetto della Missione'),
};

// ---------- pool di categoria ----------
const KINDS = readJson(path.join(ROOT, 'tests/fixtures/items-it-tool-kinds.json'));
const weapons = (...t) => ITEMS.filter(d => d.type === 'weapon' && t.includes(d.system.type?.value)).map(d => d._id);
const tools = (...k) => Object.entries(KINDS).filter(([, v]) => k.includes(v)).map(([id]) => id);
const POOL = {
    sim: weapons('simpleM', 'simpleR'), simM: weapons('simpleM'), mar: weapons('martialM', 'martialR'),
    art: tools('art'), music: tools('music'), game: tools('game'), anyTool: Object.keys(KINDS),
};
// voce di pool: nome di oggetto oppure `@categoria`
const pool = (...xs) => sorted(new Set(xs.flatMap(x => x.startsWith('@') ? POOL[x.slice(1)] : [I[x]])));

// ---------- notazione delle righe ----------
// albero (startingEquipment): L(oggetto, count?, req?) | OR(...) | AND(...) | W(chiave, count?) | T(chiave?) | F(chiave)
const L = (k, count, req) => ({ type: 'linked', key: k, count, req });
const OR = (...c) => ({ type: 'OR', c });
const AND = (...c) => ({ type: 'AND', c });
const W = (key, count) => ({ type: 'weapon', key, count });
const T = key => ({ type: 'tool', key });
const F = key => ({ type: 'focus', key });
// avanzamenti: G concessione fissa (unita per scheda), C scelta, O concessione opzionale
const G = (...items) => ({ kind: 'G', items });
const C = (p, count = 1) => ({ kind: 'C', pool: p, count });
const O = (...items) => ({ kind: 'O', items });

const CLASSES = {
    QNHCsuCkl0JiF1TZ: ['Alchimista', [
        [OR(L('Spadino'), L('BastoneFerrato')), C(pool('Spadino', 'BastoneFerrato'))],
        [AND(L('BorsaComp'), L('FocusAlch')), G('BorsaComp', 'FocusAlch')],
        [OR(L('DotDipl'), L('DotStud')), C(pool('DotDipl', 'DotStud'))],
        [AND(T('art'), L('BorsaErb')), C(pool('@art')), G('BorsaErb')],
        [AND(L('TomoAlch'), L('LibroBianco')), G('TomoAlch', 'LibroBianco')],
    ]],
    MgZx6XibW3AjaLbj: ['Armigero', [
        [OR(L('Giaco'), AND(L('Gambesone'), L('ArcoRicurvo'), L('Frecce', 20))), O('Giaco', 'Gambesone', 'ArcoRicurvo', 'Frecce')],
        [OR(AND(W('mar'), L('Scudo')), W('mar', 2)), C(pool('@mar', 'Scudo'), 2)],
        [OR(AND(L('Balestra'), L('Quadrelli', 20)), L('Accetta', 2)), O('Balestra', 'Quadrelli', 'Accetta')],
        [OR(L('DotAvv'), L('DotEspl')), C(pool('DotAvv', 'DotEspl'))],
    ]],
    AYVSHvYIYiKCU0Qw: ['Erudito', [
        [OR(L('Bastone'), L('Pugnale')), C(pool('Bastone', 'Pugnale'))],
        [OR(AND(L('Balestra'), L('Quadrelli', 20)), L('Spadino')), O('Balestra', 'Quadrelli', 'Spadino')],
        [OR(L('DotAvv'), L('DotStud')), C(pool('DotAvv', 'DotStud'))],
        [AND(T(), L('Tomo', 2)), C(pool('@anyTool')), G('Tomo')],
    ]],
    IDi0BwqJ0IY1rcMi: ['Furfante', [
        [OR(L('Sciabola'), L('Spada')), C(pool('Sciabola', 'Spada'))],
        [OR(AND(L('Arco'), L('Faretra'), L('Frecce', 20)), W('sim')), C(pool('@sim')), O('Faretra', 'Frecce')],
        [OR(L('DotScass'), L('DotAvv'), L('DotEspl')), C(pool('DotScass', 'DotAvv', 'DotEspl'))],
        [AND(L('Tabarda'), L('Coltellaccio'), L('Scasso')), G('Tabarda', 'Coltellaccio', 'Scasso')],
    ]],
    p8MX2Yh3gq7fMc4v: ['Geniere', [
        [AND(L('Munizioni'), L('Polvere'), OR(L('Pistola'), L('Archibugio'), L('Moschetto'))), G('Munizioni', 'Polvere'), C(pool('Pistola', 'Archibugio', 'Moschetto'))],
        [AND(W('mar'), OR(L('Scudo'), W('sim'))), C(pool('@mar')), C(pool('Scudo', '@sim'))],
        [OR(L('Gambesone'), L('Maglia')), C(pool('Gambesone', 'Maglia'))],
        [AND(L('DotAvv'), OR(L('Fabbro'), L('Inventore'))), G('DotAvv'), C(pool('Fabbro', 'Inventore'))],
    ]],
    WM5h9vo7vDKsm0Ls: ['Magus', [
        [OR(L('Spadino'), L('Bastone')), C(pool('Spadino', 'Bastone'))],
        [OR(L('BorsaComp'), F('arcane')), C(pool('BorsaComp', 'Bacchetta', 'Verga', 'Cristallo', 'Sfera'))],
        [OR(L('DotStud'), L('DotDipl')), C(pool('DotStud', 'DotDipl'))],
        [T('art'), C(pool('@art'))],
    ]],
    RzZhZKlOJyMnuOll: ['Mercante', [
        [OR(L('SpadaLato'), W('sim')), C(pool('SpadaLato', '@sim'))],
        [OR(L('DotDipl'), L('DotIntr')), C(pool('DotDipl', 'DotIntr'))],
        [AND(L('Carro'), L('Carico')), G('Carro', 'Carico')],
        [AND(L('Tabarda'), L('Pugnale')), G('Tabarda', 'Pugnale')],
    ]],
    '1HXgLO5vCof0DI8B': ['Mortificato', [
        [OR(L('Pugnale', 2), W('sim')), C(pool('@sim'))],
        [OR(L('Mazzafrusto'), W('simpleM')), C(pool('Mazzafrusto', '@simM'))],
        [AND(L('Tabarda'), L('DotEspl'), L('Cilicio')), G('Tabarda', 'DotEspl', 'Cilicio')],
    ]],
    QiAoN9B4fZFtCBr1: ['Sacerdote', [
        [OR(L('Mazza'), L('Martello', undefined, true)), C(pool('Mazza', 'Martello'))],
        [OR(L('Tabarda'), L('Giaco'), L('Cotta', undefined, true)), C(pool('Tabarda', 'Giaco', 'Cotta'))],
        [OR(AND(L('Balestra'), L('Quadrelli', 20)), W('sim')), C(pool('@sim')), O('Quadrelli')],
        [OR(L('DotSac'), L('DotEspl')), C(pool('DotSac', 'DotEspl'))],
        [F('holy'), C(pool('Amuleto', 'Emblema', 'Reliquiario'))],
    ]],
    KeYPiTNGYeoYv23c: ['Venturiero', [
        [OR(L('Sciabola'), L('Spada'), W('sim')), C(pool('Sciabola', 'Spada', '@sim'))],
        [OR(AND(L('Arco'), L('Faretra'), L('Frecce', 20)), W('sim')), C(pool('@sim')), O('Faretra', 'Frecce')],
        [OR(L('DotEspl'), L('DotIntr')), C(pool('DotEspl', 'DotIntr'))],
        [OR(T('art'), T('music')), C(pool('@art', '@music'))],
        [L('Tabarda'), G('Tabarda')],
    ]],
};
const VENTURES = {
    '2RudL9XHJdfwKFQy': ['Arte', [
        [L('PrimaOpera'), G('PrimaOpera')],
        [AND(L('AbitiComuni'), L('Pipa'), L('Erbe'), OR(T('music'), T('art'))), G('AbitiComuni', 'Pipa', 'Erbe'), C(pool('@music', '@art'))],
    ]],
    '6m4XdtLGSJONCGyH': ['Destino', [
        [L('Ninnolo'), G('Ninnolo')],
        [AND(L('AbitiComuni'), L('Diario'), T('art')), G('AbitiComuni', 'Diario'), C(pool('@art'))],
    ]],
    EQVKo8c2oZT7dTms: ['Devozione', [
        [AND(L('AbitiComuni'), L('Breviario'), OR(L('Calligrafo'), L('Pittore'), T('music'))), G('AbitiComuni', 'Breviario'), C(pool('Calligrafo', 'Pittore', '@music'))],
    ]],
    RlpOs7TE8nVTRmcF: ['Illuminazione', [
        [L('OggMiss'), G('OggMiss')],
        [AND(L('AbitiComuni'), L('Bussola'), OR(L('BorsaErb'), T('art'))), G('AbitiComuni', 'Bussola'), C(pool('BorsaErb', '@art'))],
    ]],
    xDGINo1zymssbDM2: ['Retaggio', [
        [L('SimbRet'), G('SimbRet')],
        [AND(L('AbitiPregiati'), L('Libro')), G('AbitiPregiati', 'Libro')],
    ]],
    mgEw2ifZzcbkeY8C: ['Rivalsa', [
        [AND(L('AbitiComuni'), L('Costume'), L('Camuffamento')), G('AbitiComuni', 'Costume', 'Camuffamento')],
    ]],
    A50Zlc4VpAQqzr4D: ['Rivoluzione', [
        [L('Cammeo'), G('Cammeo')],
        [AND(L('AbitiComuni'), T('art')), G('AbitiComuni'), C(pool('@art'))],
    ]],
    ItcXx7JoCVf9KpMI: ['Scoperta', [
        [L('Mappe'), G('Mappe')],
        [AND(L('AbitiComuni'), L('AbitiPregiati'), L('Spezie'), OR(L('Cartografo'), L('Calligrafo'))), G('AbitiComuni', 'AbitiPregiati', 'Spezie'), C(pool('Cartografo', 'Calligrafo'))],
    ]],
    pdfMzj0k69yPZtuM: ['Vuoto', [
        [AND(L('AbitiComuni'), L('Anello'), OR(T('art'), T('game'))), G('AbitiComuni', 'Anello'), C(pool('@art', '@game'))],
    ]],
};

// ---------- normalizzazione ----------
const normExpected = n => {
    const o = { type: n.type };
    if (n.type === 'linked') o.key = PREFIX + I[n.key];
    else if (n.key) o.key = n.key;
    o.count = n.count > 1 ? n.count : 1;
    o.req = !!n.req;
    if (n.c) o.c = n.c.map(normExpected);
    return o;
};
const normActual = (entries, group = null) => entries.filter(e => (e.group ?? null) === group)
    .sort((a, b) => a.sort - b.sort)
    .map(e => {
        const o = { type: e.type };
        if (e.key) o.key = e.key;
        o.count = e.count > 1 ? e.count : 1;
        o.req = !!e.requiresProficiency;
        if (e.type === 'OR' || e.type === 'AND') o.c = normActual(entries, e._id);
        return o;
    });
const depth = (entries, e) => { let d = 1; while (e.group) { e = entries.find(x => x._id === e.group); d++; } return d; };

// avanzamenti di equipaggiamento: quelli che puntano a items-it
const gearAdv = d => d.system.advancement.filter(a => (a.type === 'ItemGrant' || a.type === 'ItemChoice') &&
    [...(a.configuration.items ?? []), ...(a.configuration.pool ?? [])].some(i => idOf(i.uuid)));
const canonActual = a => {
    if (a.type === 'ItemChoice') {
        const ch = Object.values(a.configuration.choices);
        return `C${ch[0]?.count}:${sorted(a.configuration.pool.map(p => idOf(p.uuid))).join(',')}`;
    }
    const opt = a.configuration.items.map(i => !!i.optional);
    const kind = opt.every(x => x) ? 'O' : opt.every(x => !x) && !a.configuration.optional ? 'G' : '?';
    return `${kind}:${sorted(a.configuration.items.map(i => idOf(i.uuid))).join(',')}`;
};
const canonExpected = lines => {
    const out = [], gs = [];
    for (const [, ...as] of lines) for (const a of as) {
        if (a.kind === 'G') gs.push(...a.items.map(x => I[x]));
        else if (a.kind === 'O') out.push(`O:${sorted(a.items.map(x => I[x])).join(',')}`);
        else out.push(`C${a.count}:${a.pool.join(',')}`);
    }
    if (gs.length) out.push(`G:${sorted(gs).join(',')}`);
    return sorted(out);
};

// ---------- test ----------
describe('nuovi oggetti in items-it', () => {
    const beni = FOLDERS.find(f => f.name === 'Beni e merci');
    for (const n of NEW_ITEMS) it(n, () => {
        const id = byName(n);
        expect(id, `${n}: un solo oggetto con questo nome`).toBeDefined();
        const d = BY_ID.get(id);
        expect(d.type, n).toBe('loot');
        expect(d._id, n).toMatch(/^[A-Za-z0-9]{16}$/);
        expect(d.system.description.value.length, `${n}: descrizione`).toBeGreaterThan(10);
        expect(d.folder, `${n}: cartella assegnata da organize`).toBe(beni._id);
    });
    it('il carico di merci vale 200 mo', () => {
        const d = BY_ID.get(byName('Carico di Merci'));
        expect(d.system.price).toEqual({ value: 200, denomination: 'gp' });
    });
    it('gli identificatori dei nuovi oggetti non collidono', () => {
        const mine = new Set(NEW_ITEMS.map(n => BY_ID.get(byName(n))?.system.identifier));
        const clash = ITEMS.filter(d => !NEW_ITEMS.includes(d.name) && mine.has(d.system.identifier)).map(d => d.name);
        expect(mine.size).toBe(NEW_ITEMS.length);
        expect(clash).toEqual([]);
    });
});

describe('fixture dei tipi di strumento', () => {
    it('copre esattamente gli strumenti di items-it', () => {
        expect(sorted(Object.keys(KINDS))).toEqual(sorted(ITEMS.filter(d => d.type === 'tool').map(d => d._id)));
        for (const v of Object.values(KINDS)) expect(['art', 'music', 'game', 'other']).toContain(v);
    });
});

for (const [pack, table, level] of [['professions-it', CLASSES, 1], ['ventures-it', VENTURES, 0]]) {
    describe(`${pack}: equipaggiamento iniziale`, () => {
        for (const [id, [name, lines]] of Object.entries(table)) {
            const d = doc(pack, id);
            it(`${name}: startingEquipment fedele al manuale`, () => {
                expect(d.name, id).toBe(pack === 'ventures-it' ? `Ventura: ${name}` : name);
                const se = d.system.startingEquipment;
                expect(new Set(se.map(e => e._id)).size, `${name}: _id unici`).toBe(se.length);
                for (const e of se) {
                    expect(e._id, name).toMatch(/^[A-Za-z0-9]{16}$/);
                    if (e.group) expect(se.some(x => x._id === e.group), `${name}: gruppo ${e.group}`).toBe(true);
                    expect(depth(se, e), `${name}: profondità`).toBeLessThanOrEqual(4);
                }
                const actual = normActual(se);
                lines.forEach(([tree], i) => expect(actual[i], `${name}, riga ${i + 1}`).toEqual(normExpected(tree)));
                expect(actual.length, `${name}: numero di righe`).toBe(lines.length);
            });
            it(`${name}: avanzamenti che mettono gli oggetti sulla scheda`, () => {
                const adv = gearAdv(d);
                expect(sorted(adv.map(canonActual)), name).toEqual(canonExpected(lines));
                for (const a of adv) {
                    expect(a.level, `${name}: ${a.title}`).toBe(level);
                    expect(a.title, `${name}: titolo`).toBeTruthy();
                    if (level === 1) expect(a.classRestriction, `${name}: ${a.title}`).toBe('primary');
                    if (a.type === 'ItemChoice') {
                        expect(Object.keys(a.configuration.choices), `${name}: ${a.title}`).toEqual([String(level)]);
                        expect(a.configuration.type, `${name}: ${a.title}`).toBeNull();
                        expect(a.configuration.allowDrops, `${name}: ${a.title}`).toBe(false);
                    }
                    if (a.type === 'ItemGrant' && a.configuration.items.every(i => i.optional)) {
                        expect(a.configuration.optional, `${name}: ${a.title}`).toBe(true);
                        // la concessione non impone quale opzione prendere: lo spiega l'hint
                        expect(a.hint?.trim(), `${name}: hint della concessione opzionale "${a.title}"`).toBeTruthy();
                    }
                }
                expect(adv.filter(a => a.type === 'ItemGrant' && !a.configuration.optional).length, `${name}: una sola concessione fissa`).toBeLessThanOrEqual(1);
            });
        }
    });
}

describe('collegamenti verso items-it', () => {
    it('ogni chiave linked e ogni uuid di avanzamento esiste', () => {
        const dangling = [];
        for (const [pack, table] of [['professions-it', CLASSES], ['ventures-it', VENTURES]]) {
            for (const id of Object.keys(table)) {
                const d = doc(pack, id);
                for (const e of d.system.startingEquipment) if (e.type === 'linked' && !BY_ID.has(idOf(e.key) ?? '')) dangling.push(`${d.name}: ${e.key}`);
                for (const a of gearAdv(d)) for (const i of [...(a.configuration.items ?? []), ...(a.configuration.pool ?? [])]) {
                    if (!BY_ID.has(idOf(i.uuid) ?? '')) dangling.push(`${d.name}: ${i.uuid}`);
                }
            }
        }
        expect(dangling).toEqual([]);
    });
    it('le regole che gli avanzamenti non impongono sono negli hint', () => {
        const has = (a, id) => [...(a.configuration.items ?? []), ...(a.configuration.pool ?? [])].some(i => idOf(i.uuid) === id);
        const sim = sorted(POOL.sim).join(',');
        const CASES = [
            ['MgZx6XibW3AjaLbj', 'Armigero: due accette (×2)', a => a.type === 'ItemGrant' && has(a, I.Accetta), /×2/],
            ['AYVSHvYIYiKCU0Qw', 'Erudito: due tomi (×2)', a => a.type === 'ItemGrant' && has(a, I.Tomo), /×2/],
            ['1HXgLO5vCof0DI8B', 'Mortificato: coppia di pugnali (×2)', a => a.type === 'ItemChoice' && sorted(a.configuration.pool.map(p => idOf(p.uuid))).join(',') === sim, /×2/],
            ['QiAoN9B4fZFtCBr1', 'Sacerdote: martello d\'armi se competente', a => a.type === 'ItemChoice' && has(a, I.Martello), /competente/],
            ['QiAoN9B4fZFtCBr1', 'Sacerdote: cotta d\'arme se competente', a => a.type === 'ItemChoice' && has(a, I.Cotta), /competente/],
        ];
        for (const [id, label, pick, re] of CASES) {
            const found = gearAdv(doc('professions-it', id)).filter(pick);
            expect(found, label).toHaveLength(1);
            expect(found[0].hint ?? '', label).toMatch(re);
        }
    });
    it('Sacerdote: martello d\'armi e cotta d\'arme solo con competenza', () => {
        const se = doc('professions-it', 'QiAoN9B4fZFtCBr1').system.startingEquipment;
        const req = se.filter(e => e.requiresProficiency).map(e => idOf(e.key));
        expect(sorted(req)).toEqual(sorted([I.Martello, I.Cotta]));
    });
});
