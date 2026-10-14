// Liste degli incantesimi per mestiere (CAP-8): lettura delle pagine "spells" di rules-it e
// cartella di spells-it che ne deriva. Usato da organize_folders.mjs e dai test.

export const SPELL_LIST_JOURNAL = "IncantesimiLst01";
export const SPELLS_IT_PREFIX = "Compendium.historia-it.spells-it.Item.";
export const MULTI = "Più mestieri";
export const OTHER = "Altre liste";
export const SPELL_COL = ["#9e9e9e", "#4caf50", "#009688", "#03a9f4", "#3f51b5", "#9c27b0", "#e91e63", "#f44336", "#ff9800", "#ffc107"];
export const levelName = l => l === 0 ? "Trucchetti" : `${l}° livello`;

// _id di spells-it -> nomi delle pagine (mestieri) che lo elencano, nell'ordine delle pagine.
export function mestieriBySpell(journal) {
  const out = new Map();
  for (const page of [...journal.pages].filter(p => p.type === "spells").sort((a, b) => a.sort - b.sort)) {
    for (const uuid of page.system.spells) {
      if (!uuid.startsWith(SPELLS_IT_PREFIX)) continue;
      const id = uuid.slice(SPELLS_IT_PREFIX.length);
      if (!out.has(id)) out.set(id, []);
      out.get(id).push(page.name);
    }
  }
  return out;
}

// Nome della cartella di primo livello: il mestiere, "Più mestieri" o "Altre liste".
export const topFolderName = (mestieri = []) => mestieri.length === 0 ? OTHER : mestieri.length === 1 ? mestieri[0] : MULTI;
