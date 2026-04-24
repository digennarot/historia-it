# Changelog

Tutte le modifiche significative a questo modulo sono documentate in questo file.

Il formato segue [Keep a Changelog](https://keepachangelog.com/it/1.1.0/)
e il progetto aderisce al [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
