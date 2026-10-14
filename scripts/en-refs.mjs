// Riferimenti dei sorgenti EN: Compendium.world.<dir>.* e @Compendium[world.<dir>.* verso i pack del
// modulo historia-en. Unica fonte condivisa da build_en.mjs e da tests/en-groundwork.test.mjs.

// Nome del pack EN per una cartella sorgente: spells-historia -> spells, historia-factions -> factions.
export const enPackName = dir => dir.replace("-historia", "").replace("historia-", "");

// Risolve una cartella sorgente nel nome del pack EN, null se non è un pack EN tra packDirs.
export const makeEnPackFor = packDirs => dir =>
    dir.endsWith("-it") || !packDirs.includes(dir) ? null : enPackName(dir);

// Riscrive i riferimenti world.* che puntano a un pack EN; gli altri restano invariati.
export function rewriteWorldRefs(val, enPackFor) {
    return val
        .replace(/Compendium\.world\.([a-z0-9-]+)\./g, (match, dir) => {
            const enPack = enPackFor(dir);
            return enPack ? `Compendium.historia-en.${enPack}.` : match;
        })
        .replace(/@Compendium\[world\.([a-z0-9-]+)\./g, (match, dir) => {
            const enPack = enPackFor(dir);
            return enPack ? `@Compendium[historia-en.${enPack}.` : match;
        });
}

// Riferimenti world.* rimasti in una stringa (dopo la riscrittura sono quelli irrisolti).
export const findWorldRefs = val => [...val.matchAll(/(?:@Compendium\[|Compendium\.)world\.[a-z0-9-]+/g)].map(m => m[0]);
