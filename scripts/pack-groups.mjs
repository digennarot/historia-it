// Gruppi di pack nella barra dei compendi IT (packFolders), nell'ordine dei passi di creazione
// del personaggio: Specie → Mestiere → Ventura → Fazione/Carriera. Specie e Mestiere sono seguiti
// dal pack dei privilegi che concedono. I nomi sono senza suffisso "-it" (risolto da buildPackLayout).
// Unica fonte condivisa da build_it.mjs e da tests/creation-structure.test.mjs.
export const PACK_GROUPS = [
    { name: "Regole", color: "#8d6e63", packs: ["rules"] },
    { name: "Personaggio", color: "#2e7d32", packs: ["species", "species-features", "professions", "profession-features", "ventures", "factions-and-careers"] },
    { name: "Mondo", color: "#1565c0", packs: ["factions", "characters", "actors"] },
    { name: "Equipaggiamento e Magia", color: "#6a1b9a", packs: ["items", "spells"] }
];

// Dai pack compilati ({ name, ... }) ricava l'ordine di manifest.packs e i packFolders.
// I pack non elencati in PACK_GROUPS vengono accodati a packs, fuori da ogni gruppo.
export function buildPackLayout(packs, groups = PACK_GROUPS) {
    const PACK_NAME = n => packs.find(p => p.name === n || p.name === `${n}-it`)?.name;
    const ordered = groups.flatMap(g => g.packs.map(PACK_NAME)).filter(Boolean).map(n => packs.find(p => p.name === n));
    for (const p of packs) if (!ordered.includes(p)) ordered.push(p);
    const packFolders = [{
        name: "Historia",
        sorting: "m",
        color: "#d4af37",
        packs: [],
        folders: groups.map(g => ({ name: g.name, sorting: "m", color: g.color, packs: g.packs.map(PACK_NAME).filter(Boolean), folders: [] }))
    }];
    return { packs: ordered, packFolders };
}

// Una voce di _source è una cartella se ha type "Folder", oppure sorting senza system né pages
// (le cartelle di Item e Actor hanno type "Item"/"Actor"). Unica regola per build_it.mjs e test.
export const isFolderDoc = d => d.type === "Folder" || (d.sorting !== undefined && !d.system && !d.pages);

// Tipi di documento di un pack Item/Actor (flags.dnd5e.types), cartelle escluse.
// Il browser dei compendi di dnd5e salta i pack che non possono contenere la categoria attiva.
export function packTypes(docs) {
    const types = new Set();
    for (const d of docs) if (d.type && !isFolderDoc(d)) types.add(d.type);
    return [...types].sort();
}
