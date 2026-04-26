# Changelog

Tutte le modifiche significative a questo modulo sono documentate in questo file.

Il formato segue [Keep a Changelog](https://keepachangelog.com/it/1.1.0/)
e il progetto aderisce al [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.22] - 2026-04-26

### Fixed
- **Termini inglesi residui nelle traduzioni italiane**:
  - Specie/Tratti: `Rapax Peck` → `Beccata Rapax`,
    `Stealth innato` → `Furtività innata`, `Acute Hearing` → `Udito Acuto`,
    `udito acuto` → `Udito Acuto`, `Avians` → `Aviani` nelle descrizioni
    di Coyote, Galli, Allocchi.
  - Oggetti aviani: `Peckax` → `Beccoscure`, `Pecker.` → `Becco`;
    descrizioni ripulite (`Avians non può gestire` → `Gli Aviani non
    possono maneggiare`).
  - Tratto Beccata Rapax: `uno sciopero disarmato` → `un attacco
    senza armi`, `Rinforzo modificatore` → `modificatore di Forza`,
    `becco agganciato` → `becco uncinato`.
  - Effetto Armatura: `CA is 17, unaffected by Dex bonus` →
    `CA è 17, non influenzata dal bonus di Destrezza`.
  - Professione Ladro: `glitters` → `luccica`, `treasuries` →
    `tesorerie`, `tenuta di mano` → `destrezza di mano`.
  - Professione Smuggler: nome e occorrenze tradotti in
    `Contrabbandiere`/`Contrabbandieri`.
  - Fazioni: `Grow Like Bones` → `Crescere come le Ossa`,
    `duri quanto Bones` → `duri quanto le Ossa`,
    `l'Eresia del Pug` → `l'Eresia del Carlino`.
- **Riferimenti @Compendio rotti**: 8 occorrenze corrette in
  `@Compendium[...]` (rendendo cliccabili i link interni del
  compendio nelle pagine di specie e fazioni); etichetta link
  `Pug Heresy` → `Eresia del Carlino`. Risolto anche un `}` di
  chiusura mancante nel link "Pelle spessa" della specie Cinghiali.
- **Requisiti professione (`requirements`)**: tradotti i nomi di
  professione e i livelli per tutte le profession-features italiane
  (es. `Alchemist Level 7, Vitalist` → `Alchimista Livello 7,
  Vitalista`; `Magus Level 13, Secret of the Air` → `Mago Livello
  13, Segreto dell'Aria`; `Tycoon` → `Magnate`; `Collector of
  Rarities` → `Raccoglitore di Rarità`).
- **Ricette alchemiche**: nei nomi dei risultati `(Nigredo, 1 act)`
  → `(Nigredo, 1 atto)` e equivalenti per Albedo/Citrinitas/Rubedo;
  attendant `Alchemist` → `Alchimista`.

## [1.0.21] - 2026-04-24

### Fixed
- **Traduzioni italiane**: tradotti 41 nomi di incantesimi, talenti e
  oggetti che contenevano ancora termini inglesi:
  - `Tackle di pesca` → `Attrezzatura da Pesca`
  - `Blade Ward` → `Protezione dalle Lame`
  - `Booming Blade` → `Lama Tonante`
  - `Thunder Step` → `Passo del Tuono`
  - `Smite` varianti → `Castigo` varianti
  - `Metamagic: *Spell` → `Metamagia: Incantesimo *`
  - `Spellcasting` → `Incantare`
  - `Cloud of Daggers` → `Nube di Pugnali`
  - `Hail of Thorns` → `Grandine di Spine`
  - `Ray of Sickness` → `Raggio di Malattia`
  - `Toll The Dead` → `Rintocco della Morte`
  - `Zephyr Strike` → `Colpo dello Zefiro`
  - e altri.
- Descrizioni: tradotti punteggi di caratteristica in inglese
  (`Charisma`, `Dexterity`, `Intelligence`, ecc.) e termini tecnici
  (`bludgeoning`, `piercing`, `slashing`) dove comparivano nel testo,
  lasciando intatti gli enum tecnici del sistema D&D 5e (`"types":
  ["piercing"]`).

## [1.0.20] - 2026-04-24

### Fixed
- **Workflow di release corretto**: in v1.0.18 avevo referenziato versioni
  inesistenti delle GitHub Actions (`actions/checkout@v4.2.0`,
  `mozilla-sops-action@v1.8.0`). Il workflow falliva con
  `Unable to resolve action ... unable to find version`. Aggiornate alle
  versioni realmente disponibili:
  - `actions/checkout@v5` (nativamente Node.js 24)
  - `mdgreenwald/mozilla-sops-action@v1.6.0` (ultima disponibile)
- Rimosso l'env var `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` che non è più
  necessario con `checkout@v5`.

> Nota: la v1.0.19 è stata taggata ma il workflow è fallito prima di
> pubblicare gli artefatti. Questa release re-include tutti i fix.

## [1.0.19] - 2026-04-24

### Fixed
- **Causa radice degli ZIP incompleti**: alcuni file JSON sorgente nei pack
  italiani hanno un BOM UTF-8 iniziale che faceva fallire `JSON.parse`.
  Il build si interrompeva silenziosamente, lasciando ZIP privi di
  `scripts/main.js`, `media/` e `icons/`. Aggiunta una helper `readJson()`
  tollerante al BOM in `build_it.mjs` e `build_en.mjs`.
- Risolto definitivamente l'errore di installazione in Foundry VTT:
  `The file "scripts/main.js" included by module historia-it does not exist`.

## [1.0.18] - 2026-04-24

### Fixed
- Rimosso il `try/catch` che inghiottiva silenziosamente gli errori
  di copia di `scripts/main.js`.
- Aggiunto uno step `Verify build output` nel workflow di release che
  aborta la pubblicazione se i file chiave mancano dopo il build.

### Changed
- Aggiornate le GitHub Actions a versioni compatibili con Node.js 24
  (`actions/checkout@v4.2.0`, `mozilla-sops-action@v1.8.0`).

> Nota: la release v1.0.18 non è stata pubblicata come tag separato — i
> suoi fix sono inclusi direttamente in v1.0.19.

## [1.0.17] - 2026-04-23

### Fixed
- Correzioni grammaticali e di chiarezza diffuse nei pack italiani:
  - Sostituito il refuso `liro salvezza` con `tiro salvezza` (39 occorrenze).
  - Normalizzato `tiro/lancio salvifico` in `tiro salvezza` (termine standard D&D 5e).
  - Corretta la spaziatura degli ordinali (`5 °` → `5°`, 375 occorrenze).
  - Rimossi caratteri zero-width spuri da vari file.
- Riscritti passaggi incomprensibili in imprese, tratti di specie,
  incantesimi di evocazione di demoni e privilegi di professione.

## [1.0.16] - 2026-04-18

### Fixed
- Correzione massiva di grammatica e traslitterazione dei link di compendio.

## [1.0.15] - precedente

- Aggiornamento riferimenti al manuale.

## [1.0.14] - precedente

- Allineamento terminologia D&D italiana.

## [1.0.13] - precedente

- Release manutenzione.

## [1.0.12] - precedente

- Correzione download manifest EN.

## [1.0.11] - precedente

- Passaggio di traduzione sulle regole PR.

## [1.0.7] - precedente

- Introduzione della versione Inglese e aggiornamento del workflow di release.
