# Changelog

Tutte le modifiche significative a questo modulo sono documentate in questo file.

Il formato segue [Keep a Changelog](https://keepachangelog.com/it/1.1.0/)
e il progetto aderisce al [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.18] - 2026-04-24

### Fixed
- Incluso correttamente `scripts/main.js` nello ZIP di release: l'errore
  della copia non è più silenzioso e il workflow verifica esplicitamente
  la presenza dei file chiave prima di pubblicare gli artefatti.
- Risolto l'errore di installazione in Foundry VTT:
  `The file "scripts/main.js" included by module historia-it does not exist`.

### Changed
- Aggiornate le GitHub Actions a versioni compatibili con Node.js 24
  (`actions/checkout@v4.2.0`, `mozilla-sops-action@v1.8.0`).

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
