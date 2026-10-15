# Changelog

Tutte le modifiche significative a questo modulo sono documentate in questo file.

Il formato segue [Keep a Changelog](https://keepachangelog.com/it/1.1.0/)
e il progetto aderisce al [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.39] - 2026-10-15

### Fixed
- Specie (IT): il paragrafo descrittivo di tutte le 66 specie ora riporta il
  testo del manuale al posto della traduzione dall'inglese. Corretti anche
  Gazze, Cornacchie e Corvi (che ripetevano l'introduzione della familia
  Corbea) e Falchi (che conteneva "Falcons" non tradotto).
- Mestieri (IT): anche l'introduzione dei 10 mestieri e dei 27 percorsi ora
  riporta il testo del manuale al posto della traduzione dall'inglese
  (il Gladiatore aveva solo un riassunto).
- Privilegi dei mestieri (IT): i testi di 337 privilegi ora riportano il
  testo del manuale, in terza persona come nel libro, al posto della
  traduzione dall'inglese. Restano invariati link, liste di incantesimi,
  tabelle e i 4 privilegi comuni generici.
- Segreti del Magus (IT): trucchetti e incantesimi allineati alle tabelle del
  manuale. Cambiano Aria (Guida, Interdizione alle Lame, Passo Veloce al
  posto di Folata, Protezione dalle Lame, Nube di Nebbia), Luce (Dardo
  Incantato, Blocca Mostri al posto di Spruzzo Colorato, Alba), Ombra (Colpo
  Accurato al posto di Rintocco della Morte), Acqua (Nube di Nebbia,
  Immagine Speculare al posto di Dita di Gelo, Gelo di Icingdeath) e Terra
  (Onda Tonante, Pelle Coriacea al posto di Tremore della Terra, Vincolo
  Terrestre); nomi come nel manuale (Amicizia, Rapidità, Alterare Sé Stesso).
  Stesse liste anche nei Segreti del modulo inglese.
- Magna Ars (IT ed EN): tolti dalla lista generale degli incantesimi del
  Magus i 9 incantesimi che ora appartengono a un Segreto (Guida, Colpo
  Accurato, Dardo Incantato, Onda Tonante, Passo Veloce, Pelle Coriacea,
  Immagine Speculare, Localizza Creatura, Blocca Mostri).
- Privilegi dei mestieri (IT): riparati 550 link con spazi spuri (es.
  `dnd5e.spells. Item. …`) che in Foundry non si aprivano, quasi tutti verso
  incantesimi.
- Magus (IT): al 20° livello si recuperano 31 punti incanto con un riposo
  breve, non 30, come nel manuale.
- Sangue Brillante del Martire (IT): descrizione con il testo del manuale.

### Added
- **Venture** (IT): nuovo diario nel compendio Regole con l'introduzione
  del capitolo 5 (risalto, dotazione, descrittori, vigliacchi ed eroi,
  rivali e alleati), collegato dalla guida alla creazione del personaggio.
- Mestieri del modulo inglese, ora allineati all'italiano:
  - equipaggiamento iniziale e opzioni di armi e armature a livello 1,
    comprese faretra e frecce per l'arco e i quadrelli per la balestra;
  - tolte le concessioni "ASI or FEAT", doppie rispetto all'incremento dei
    punteggi;
  - titoli delle scelte di dotazione e armatura corretti secondo le opzioni
    davvero disponibili;
  - Gladiatore e Spia ricevono i privilegi al livello del manuale (3 e 13).

## [1.0.38] - 2026-10-14

### Added
- **Guida alla creazione del personaggio** (IT): nuovo diario *Creazione del
  Personaggio* nel compendio Regole, con i passaggi Specie → Mestiere →
  Ventura → Fazione e Carriera → Equipaggiamento e Ricchezza → Istinti e
  Descrittori e i link a tutte le specie, i mestieri, le venture e le fazioni.
- **Modulo inglese allineato all'italiano**:
  - le 66 specie EN sono ora *razze* (race) con taglia, tratti, punteggi e
    privilegi assegnati automaticamente, come in IT; distanze in piedi;
  - nuove voci EN: *Instincts* e 11 privilegi di specie che mancavano;
  - i mestieri EN chiedono competenze, incrementi dei punteggi, sottoclasse e
    scelte di equipaggiamento come in IT (Armigero: stile di combattimento,
    Magus: primo Segreto, ora come scelta unica).

### Fixed
- Modulo inglese: i link a privilegi, mestieri, incantesimi, venture e fazioni
  puntavano a compendi del mondo dell'autore e risultavano rotti; ora puntano
  ai compendi del modulo. Il build si ferma se resta un link non risolto.
- Rimosso il link rotto al blocco statistiche dello *Spirito Guerriero*
  (incantesimo, IT e EN).

## [1.0.37] - 2026-10-14

### Added
- **Liste degli incantesimi per mestiere**: nuovo diario *Liste degli
  incantesimi* nel compendio Regole, con le liste di **Magus**, **Mortificato**
  e **Sacerdote** registrate in dnd5e. Il compendio Incantesimi è ora diviso
  per mestiere e livello.
- **Fonte "Historia" nel browser dei compendi**: tutto il contenuto del modulo
  compare sotto la fonte *Historia – Manuale Base*, quindi specie, mestieri,
  sottoclassi e venture si possono filtrare per fonte. Il browser salta anche i
  compendi che non contengono la categoria aperta.

### Fixed
- Lo sfondo della pagina di accesso e del mondo non veniva applicato con
  Foundry 14 (errore a ogni avvio del GM): ora si imposta correttamente.

## [1.0.36] - 2026-10-13

### Added
- Ritratti di **Adelaide da Rossariva** e **Agata Galerici** nel diario e
  nell'attore (immagine e token): ora tutti i 46 personaggi hanno il ritratto.

### Fixed
- Icone sbagliate (quadrato scuro con il nome scritto) su 15 voci, tra cui
  **Carriera: Artigiano**: il modulo conteneva 24 icone segnaposto con lo
  stesso percorso delle icone di Foundry, che le sostituivano. Rimosse: ora
  si vedono le icone originali di Foundry.

## [1.0.35] - 2026-10-13

### Added
- **Ritratti dei Personaggi di Historia**: 44 personaggi del cap. 10 hanno
  ora il ritratto del manuale come prima pagina del diario (Paddath e
  Ni-Shung condividono l'illustrazione doppia). Adelaide da Rossariva e
  Agata Galerici restano senza ritratto.
- **Nuovo compendio "Attori di Historia"** (gruppo Mondo): i 46 personaggi
  del cap. 10 (21 Eroi + 25 PNG) come attori PNG dnd5e pronti all'uso, con
  caratteristiche, CA, PF, velocità, sensi, tiri salvezza, abilità e Sfida
  del manuale; tratti, azioni, azioni bonus e reazioni come oggetti (attacchi
  con tiro per colpire e danni del manuale, usi giornalieri e ricariche);
  incantatori con caratteristica, livello, CD e incantesimi delle liste del
  manuale (dal compendio dnd5e con nomi e testi italiani, più "Sangue
  Brillante del Martire" di Historia). Ritratto come immagine e token;
  biografia con Legame/Ideale/Difetto/Rango e collegamento al diario, e ogni
  diario rimanda al proprio attore.

### Fixed
- Diario di Sigfrido: ripristinato l'a capo prima degli incantesimi di
  5° livello.

## [1.0.34] - 2026-10-13

### Added
- **Nuovo compendio "Regole"** con le regole generali del Manuale Base:
  *Ricchezza & Influenza* (cap. 6: Conio, tabella stili di vita, Fama,
  fama negativa, investire, perdere e guadagnare Fama), *Ispirazione*,
  *Ferite, Combattimento e Morte* (tabella d20 delle Ferite, tiri salvezza
  contro morte, traumi, riposo), *Avventure e Sequenze* (ranghi, sequenze,
  avversità, ricompense, alzare la posta), *Avversari* (profili base,
  rango, bande, qualità speciali) e *Battaglie Campali* (cap. 9: Momentum,
  fasi, azioni, conseguenze, eserciti).
- **Nuovo compendio "Personaggi di Historia"** (cap. 10 del Manuale Base):
  21 Eroi e 25 Personaggi Non Giocanti in due cartelle, ciascuno con
  biografia, legame/ideale/difetto, rango e scheda completa (caratteristiche,
  privilegi, incantesimi, azioni, azioni bonus e reazioni), più la pagina
  introduttiva del capitolo.
- **Scheda "Istinti"** nei Tratti di Specie (cartella *Regole generali*):
  regola completa del manuale (istinti generali Predatore/Preda/Onnivoro,
  di familia e di specie, linea guida per usarli come ideale, legame o
  difetto); ogni specie ora rimanda a questa scheda sotto i suoi istinti.
- **Scheda "Fazioni"** nel compendio Fazioni: regole generali del manuale
  (gradi, schema comune, contatti, rivali, seguaci, risorse, lasciare e
  creare una fazione) con collegamenti a tutte le fazioni.

- **Cotta d'Arme** (armatura pesante, CA 14, 40 mo) presente nel manuale
  ma assente dal compendio.

### Changed
- **Equipaggiamento allineato al Manuale Base (cap. 7)**: armi, armature e
  scudi con i nomi del manuale (es. Cinquedea, Manosinistra, Spezzalama,
  Striscia, Azza, Brandistocco, Falcione, Mazzapicco, Zweihänder, Frombola,
  Cerbottana, Spadino, Giaco di Maglia, Maglia di Ferro, Corazzina,
  Usbergo Rinforzato, Brocchiero, Tavolaccio, Palvese, Alascudo, armi
  aviane Beccazza/Becchetto/Pennalama/Pennaspada/Piumalama/Rapaci/Taglioni);
  costi, danni, CA e proprietà corretti secondo le tabelle (es. Gambesone
  CA 12, Falconetto 4d8, Trilama perforante, Impaccio come svantaggio a
  Furtività); gittate corta/media/lunga del manuale (6/18, 24/96,
  45/180 m, artiglieria con gittata lunga triplicata); descrizioni con le
  proprietà del manuale (Aristocratica, Asta, Coppia, Occultabile, armi da
  fuoco, armature rodeliane, arma flambata). Nuove cartelle *Armi da
  fuoco* e *Armi aviane*.
- **Oggetti comuni e strumenti** con i nomi ufficiali italiani di D&D 5e
  (es. Arnesi da Scasso, Scorte da Calligrafo, Borsa da Erborista) e
  descrizioni ritradotte; eliminati i nomi da traduzione automatica
  ("Prenota", "Parcheggi", "Censimento", "Pugno"...).
- **Fazioni allineate al Manuale Base (cap. 6)**: storia e informazioni
  generali e gradi riportati al testo del manuale; rinominate *Compagnia del
  Compasso* (era Compagnia della Bussola), *Fratellanza dei Vermi* (era
  Fratelli dei Vermi) ed *Esercito del Popolo*; "Rango" diventa *Grado* con
  i nomi del manuale (es. Iniziato, Spillato, Graduato, Costolario, Occipite
  Semplice); ogni grado riporta Fama, requisiti e benefici dello schema
  comune; numeri di pagina corretti (208-224).
- **Venture e Risalti allineati al Manuale Base (cap. 5)**: "Impresa" e
  "Prominenza" diventano *Ventura* e *Risalto*; testi, dotazioni e
  descrittori riportati al manuale; risalti rinominati (L'occhio di chi
  guarda, Contro ogni previsione, Fiuto per il risentimento, Forestiero
  del mondo); requisiti dei risalti in italiano; cartelle e nome del
  compendio aggiornati.
- **Specie, mestieri e carriere ricontrollati sul Manuale Base**: tratti di
  specie rinominati e corretti (11 nuovi tratti specifici di specie),
  avanzamenti nativi di Aumento dei Punteggi di Caratteristica e
  Sottoclasse nei mestieri.

## [1.0.33] - 2026-10-13

### Changed
- **Immagini di Imprese e Prominenze**: sostituite con icone coerenti col
  tema di ciascuna scheda (set di icone di Foundry), applicate ai pack
  italiano e inglese.

## [1.0.32] - 2026-10-13

### Changed
- **Compendi organizzati in cartelle colorate**: mestieri e privilegi per
  mestiere e sottoclasse, specie e tratti per ordine e familia,
  incantesimi per livello, equipaggiamento per categoria; fazioni e
  carriere, imprese e prominenze separate.
- **Barra dei compendi**: pack raggruppati in Personaggio, Mondo ed
  Equipaggiamento e Magia (packFolders), con etichette coi termini del
  manuale (Mestieri, Privilegi dei Mestieri, Tratti di Specie,
  Equipaggiamento, Imprese e Prominenze, Guida alle Fazioni).

## [1.0.31] - 2026-10-12

### Fixed
- **Mestieri italiani allineati al Manuale Base**: tutti i privilegi, le
  classi e le sottoclassi ritradotti, con i nomi del manuale (Mortificato,
  Furfante, Venturiero, Magus; Medico, Politico, Collezionista di Rarità,
  Asceta, Santone, Battitore, Guastatore), intestazioni di classe, tabelle
  di avanzamento e titoli degli avanzamenti in italiano.
- **Livelli e meccaniche** corretti dove la versione inglese divergeva dal
  manuale (Segreti del magus, Rete di Alleanze, Migliorie del geniere,
  Distillatio Rubedo, Strumenti dell'Inquisizione, Sublimatio).
- **Liste incantesimi** di magus, sacerdote e mortificato con i nomi
  ufficiali italiani degli incantesimi.
- **Carriere**: nomi del manuale (Milite, Maestro, Funzionario), gradi con
  Fama e Benefici.

## [1.0.30] - 2026-10-12

### Fixed
- **Specie italiane allineate al Manuale Base**: incrementi di
  caratteristica, taglia, velocità in metri, scurovisione, competenze,
  tratti concessi e istinti. Coyote e Toporagni contenevano i dati di
  Polli e Moffette. Nomi del manuale: Bracchi, Domesti, Moffette, Polli;
  familia Grarconi.
- **Tratti di specie**: nomi del manuale, testi in seconda persona con la
  terminologia ufficiale di dnd5e, unità metriche; corretti i tiri
  salvezza di Stridio e Spruzzo Nauseante e la ricarica di Canto Soave.
- **Fonte uniforme** "Historia – Manuale Base" con numero di pagina per
  specie e tratti.
- **Sfondo del login** ora incluso nel modulo; le impostazioni funzionano
  anche in `historia-en`.

### Changed
- Il workflow di release verifica la coerenza tra tag e versione, esegue
  i test e si ferma se la build fallisce; zip più leggeri.

## [1.0.29] - 2026-10-12

### Changed
- **Sistema metrico nei pack italiani**, come nella traduzione ufficiale di
  dnd5e (`dnd5e-it-translation`): distanze in metri (piedi × 0,3: 1,5 m,
  9 m, 18 m…), pollici in centimetri, miglia in chilometri, volumi in metri
  cubi, aree come "area quadrata di X metri di lato". Convertiti anche i
  dati: gittata, area, velocità e sensi passano da `ft` a `m` (e `mi` a
  `km`), così scheda e descrizione coincidono. Le libbre restano invariate.
  Corrette le altezze delle specie rovinate dalla traduzione automatica.

## [1.0.28] - 2026-10-12

### Fixed
- **Terminologia allineata alla traduzione ufficiale di dnd5e**
  (`dnd5e-it-translation`) in `spells-it`: *modificatore di caratteristica
  da incantatore* (non "di abilità"), *CD del tiro salvezza
  dell'incantesimo*, *tiro salvezza su Destrezza* (e simili), *per ogni
  slot di livello superiore al …*, *Ai Livelli Superiori*, *danni
  radiosi*, *copertura parziale*, *indebolimento*, *senso del tremore*,
  *visione del vero*, *Intimidire*, *velocità base* / *di volare*,
  *attacco con un'arma*, *Coltre Oscura*, *Reame Remoto*, *Mazzo delle
  Meraviglie*. Nomi ufficiali degli incantesimi presenti nel modulo
  (`Hex`→`Sortilegio`, `Chromatic Orb`→`Globo Cromatico`, `Mind Spike`→
  `Aculeo Mentale`, `Ice Knife`→`Coltello di Ghiaccio`, `Searing Smite`→
  `Punizione Incandescente`…) e *Punizione* per tutti gli *Smite*.
  Riallineate 177 etichette di link agli incantesimi negli altri pack IT.
- **Descrizioni di tutti i 224 incantesimi IT riscritte** (`spells-it`),
  ritradotte dal testo inglese in registro "tu": rimossi bracket rotti
  (`[[[/r …]]`), `@condizione` e residui di traduzione automatica; le
  condizioni sono `&Reference[…]{…}` con i termini ufficiali; tiri, link
  e riferimenti identici all'EN. Corretti i nomi ancora in inglese o
  sgrammaticati (es. `Illuminazione Lure`→`Richiamo Fulmineo`,
  `Il sangue brillante di Martyr`→`Sangue Brillante di Martyr`,
  `Viaggio Telecinetico`→`Sgambetto Telecinetico`, `Ombra di Moil`).
- *Illuminazione Lure* usa il tiro salvezza di Forza, come nell'inglese.
- **Build su Windows**: `scripts/build_it.mjs` e `build_en.mjs` generavano
  il percorso `C:C:…` e la copia di `main.js` e delle immagini falliva;
  ora usano `fileURLToPath`.
- **117 nomi ancora in inglese, misti o mal tradotti corretti** nei pack italiani,
  seguendo la nomenclatura del D&D 5e italiano dove esiste:
  - Oggetti: `Crowbar`→`Piede di porco`, `Halberd`→`Alabarda`,
    `Bullseye Lantern`→`Lanterna a lente sporgente`, `Dulcimer`→`Salterio`,
    `Shawm`→`Ciaramella`, `Pole`→`Pertica`, `Ranseur`→`Corsesca`,
    `Set di giochi di dadi`→`Set di dadi`,
    `Custodia per bullone a balestra`→`Custodia per quadrelli`, ecc.
  - Incantesimi: `Hex`→`Sortilegio`, `Thunderclap`→`Rombo di Tuono`,
    `Psionic Blast`→`Esplosione Psionica`, `Gust`→`Folata`, ecc.
  - Privilegi: `Grenade`→`Granata`, `Butler`→`Maggiordomo`,
    `Chemistry Essay (…)`→`Saggio di Chimica (…)`,
    `Trattasi su Geometria`→`Trattato di Geometria`,
    `Big Time Strategy: …`→`Grande Strategia: …`,
    `Strategia di caccia: Horde Raveger`→`Strategia di Caccia:
    Devastatore di Orde`, `Consigli per il futuro`→`Saggio Consiglio`
    (*Wise Advice*), ecc.
  - Cicli: `Occult Replica`→`Replica Occulta`, `Forza gabbia`→
    `Gabbia di Forza`, `Vapori Restorativi`→`Vapori Ristoratori`,
    `Tenda delle Fiamme`→`Cortina di Fiamme`, `rinfrescare l'anima`→
    `Ristoro dell'Anima`, `Rifinizione del corpo/dei materiali`→
    `Raffinazione del Corpo/dei Materiali`, ecc.
  - Fazioni: `Fratelli di vermi`→`Fratelli dei Vermi`, `Circolo dei
    sussurri`→`Circolo dei Sussurri`, `Eresia del carlino`→`Eresia del
    Carlino`; professione `spia`→`Spia`; tratto `Vista acuta`→`Vista
    Acuta` (come `Udito Acuto`).
- **Etichette dei link** (143) allineate esattamente al nome del
  bersaglio, maiuscole comprese (le forme brevi senza prefisso `AP:` /
  `Ciclo:` negli elenchi restano volutamente brevi), comprese
  quelle rimaste in inglese o tradotte male (`{Toll The Dead}`→
  `{Rintocco della Morte}`, `{Bullone di fissaggio}`→`{Dardo della
  Strega}`, `{Metamagia: Subtle Spell}`→`{Metamagia: Incantesimo
  Sottile}`, `{Calcinaro …}`→`{Calcinatio …}`…); corretti 9 link
  con uno spazio tra `]` e `{etichetta}` che Foundry non riconosceva
  (`{Hex}`→`{Sortilegio}`, `{Wise Advice}`→`{Saggio Consiglio}`,
  `{Sermon}`→`{Sermone}`, `{Uno con l'ambiente}`).
- **Termini rinominati anche nel testo**: `Creare Homunculus`→`Creare
  Omuncolo`, sottotitoli di `Trasmutare Roccia`, tabella `Effetti di
  Frattura della Realtà`, `Unmasking`→`Smascheramento` nella
  descrizione, titoli di advancement (`Choose a Big Time Strategy`→
  `Scegli una Grande Strategia`, `Uncommon Essay (Pick one)`→`Scegli
  un Saggio Non comune`, `Wise Advice (1HD)`→`Saggio Consiglio (1 DV)`,
  `Learn a Two-Act Cycle`→`Impara un Ciclo in Due Atti`, `Fighting Style
  (Pick one)`→`Stile di Combattimento (scegline uno)`, `Lethality X2`→
  `Letalità ×2`, `Major Arcana`→`Arcani Maggiori`, `Divinità del
  canale`→`Incanalare Divinità`, `ASI o Talento`→`Aumento
  Caratteristiche o Talento`, ecc.); nomi degli effetti (`Fighting
  Style: Dueling`→`Stile di Combattimento: Duello`, `Damge Bonus`→
  `Bonus ai Danni`, `Adds +1 to CA`→`+1 alla CA`…).
- **Grammatica delle condizioni**: accordo di genere (`Mentre affascinata…,
  una creatura`) e `l'effetto trattenuto`/`la condizione trattenuta`→
  `la condizione di trattenuto` in 4 incantesimi.
- **48 immagini che non esistevano** corrette (IT ed EN): percorsi
  delle icone di Foundry tradotti per errore (`daggers/pugnale-…`,
  `skills/a distanza/`, `flagello-…`, `sword-taglienti-…`) riportati agli
  originali; `broach-…`→`brooch-…`; icone degli incantesimi in
  `src/assets/icons/historia` ora referenziate in modo che il build le
  trovi (in EN puntavano a `worlds/dnd/adventures/…`); immagini di
  *Compagnia della Bussola* e *Barbagianni* collegate ai file esistenti;
  icone degli effetti (`armor-proficiency-light`, `lightning-reflexes`)
  mancanti sostituite. Copiati in `media/` `ac-deflection.webp`,
  `Ducks.webp` e `Herons.webp`, che esistevano solo in `src/media`.
- **Link rotti**: `combat-utility-belt` (modulo non dipendente) →
  `&Reference[blinded]` in *Sbuffo di Fumo*; *Construct Spirit* (assente
  in dnd5e) e *Warrior Spirit* (`Compendium.world`) resi testo;
  etichette italiane per 4 link a dnd5e che mostravano il nome inglese.
- **106 riferimenti `@condizione[...]` non validi** in 47 incantesimi
  convertiti nell'enricher nativo dnd5e `&Reference[<condizione>]{…}`,
  ora cliccabili. Gli ID sono presi dall'originale inglese (molti
  valori erano corrotti: `obbligato`, `citata`, `innescato`,
  `visibili`, `restribuita`…); le etichette usano i termini ufficiali
  (accecato, affascinato, trattenuto, prono, stordito,
  indebolimento…) accordati al soggetto. Lo stesso per i **106
  `@condition[...]`** del pack inglese `spells-historia`.
- **Tutti gli altri tag 5etools** (IT ed EN), che dnd5e non interpreta e
  comparivano come testo grezzo: `@skill[…]`→`&Reference[skill=…]`
  (Indagare, Percezione, Atletica…), `@sense[…]`/`@action[…]`→
  `&Reference[rule=…]` (scurovisione, Schivata, Scatto…), `@spell[…]`→
  link al compendio incantesimi di dnd5e, `@creature[…]`/`@item[…]`→
  testo (zombi, Spirito Fatato, piede di porco, fiasche d'olio…).
- **21 effetti del pack inglese** con le chiavi v10 `label`/`icon`
  convertiti in `name`/`img`: Foundry v14 non le migra più, e l'effetto
  risultava senza nome (non valido) e senza icona.

### Changed
- **Compatibilità minima: Foundry VTT v12 e dnd5e 4.0.** I pack usano
  le *activities* di dnd5e 4.x (e ora l'enricher `&Reference`), che
  non esistono su v11 / dnd5e 2.x. Aggiunta la dipendenza dal sistema
  `dnd5e` in `relationships` di `module-it.json` e `module-en.json`.
- **Compatibilità dnd5e 6.x**: `relationships.systems[dnd5e].compatibility.verified`
  impostato a `6.0.5`. Verificato che nessun effetto dei pack usi le chiavi
  `system.attributes.ac.calc`/`ac.formula` (cambiate in 6.0) e che gli
  script non usino `CONFIG.DND5E.senses` né `Activity#applicableEffects`.

## [1.0.27] - 2026-06-04

### Changed
- **Compatibilità Foundry VTT v14**: aggiornato
  `compatibility.verified` a `14` in `module-it.json` e `module-en.json`,
  e adeguato l'hook `renderCompendiumDirectory` alla firma
  ApplicationV2 (HTMLElement nativo) introdotta in v13+, mantenendo
  comunque la retrocompatibilità con jQuery per v11/v12.

## [1.0.26] - 2026-04-26

### Fixed
- **Refusi enricher `@UUUID` → `@UUID`** (18+ file in
  `profession-features-it`/`spells-it`): il prefisso `@UUUID` è
  invalido, i link non si risolvevano in Foundry. Bulk fix.
- **Etichette in inglese nei link `@UUID/@Compendium`**: sostituite
  con i nomi italiani delle professioni e degli incantesimi
  (Thief→Ladro, Spy→Spia, Fanatic→Fanatico, Philosopher→Filosofo,
  Gladiator→Gladiatore, Inventor→Inventore, Smuggler→Contrabbandiere,
  Warlord→Condottiero, Ascetic→Mortificato, Holy Guide→Guida Sacra,
  Doctor→Dottore, ecc.).
- **14 nomi di incantesimo MT-corrotti** in `spells-it`:
  `Witch Bolt`→`Dardo della Strega`,
  `Crusader's Mantle`→`Manto del Crociato`,
  `Fist of Iron`→`Pugno di Ferro`,
  `Grasping Vine`→`Vite Afferrante`,
  `Ensnaring Strike`→`Colpo Avvinghiante`,
  `Blood Tide`→`Marea di Sangue`,
  `Psychic Crush`→`Schiacciamento Psichico`,
  `Sudden Awakening`→`Risveglio Improvviso`,
  `Swift Quiver`→`Faretra Veloce`,
  `Hand of Radiance`→`Mano Radiante`,
  `Telekinetic trip`→`Viaggio Telecinetico`,
  `Charm Monster`→`Ammalia Mostro`,
  `Feign Death`→`Finzione di Morte`,
  `Douse Light`→`Soffoca Luce`.
- **Etichette nei link aggiornate** per riflettere i nuovi nomi
  italiani in tutti i file profession-features che vi facevano
  riferimento.
- **Etichette mancanti aggiunte** ai link `@Compendium[...]`
  orfani: `{Perché la paura}`, `{Santa arma}`, `{Inquisitore}`,
  `{Profeta}`, `{Fiamma Sacra}`, `{Fondersi nella Pietra}`,
  `{Ego Whip}`, `{Prigione mentale}`.
- **Nomi MT-corrotti in `XMpClF8MhUMdZ4jN`** (Mago):
  `Mente Sliver`→`Scheggia Mentale`,
  `Mente Spike`→`Picco Mentale`,
  `Mente Whip`→`Frusta Mentale`,
  `Radianza di pollo`→`Radianza Nauseante`,
  `Aberrazione di sumo`→`Evocare Aberrazione`,
  `Elemento sumonale`→`Evocare Elementale`,
  `Banale elementare`→`Maledizione Elementale`,
  `Tempo Ravage`→`Devastazione del Tempo`,
  `Mage Armatura`→`Armatura del Mago`,
  `Condividi su Google`→`Evocare Spirito Ombroso`,
  `Charm mostro`→`Ammalia Mostro`,
  `Diavolo di Polvere`→`Diavolo della Polvere`,
  `Strano`/`Ciclo: Strano`→`Visione Inquietante`/
  `Ciclo: Visione Inquietante`.
- **Testo italiano in `XMpClF8MhUMdZ4jN`**:
  `di del Mago`→`del Mago`,
  `POLITICA DI RICERCA (PE)`→`PUNTI INCANTESIMO`,
  `SCIPLEMENTARI`→`INCANTESIMI SUPPLEMENTARI` (10 file),
  `tuoi Mago Spells`→`tuoi incantesimi da Mago`,
  `Aria condizionata`→`Aria` (9 occorrenze),
  `Feeeblemind`→`Feeblemind`.
- **Link strutturali**: aggiunto segmento `.Item.` mancante a
  `Animal Messenger` e `Find Familiar`; rimosso link rotto a
  `world.feats.xQKE6nD2IzSp6N35]{Telepathic}`; rimossi spazi
  spuri prima/dentro `{...}` etichette (`Tower`→`Torre`,
  `{ Lingue complete}`→`{Comprendere Lingue}`,
  `{ Gravity inversa}`→`{Inversione di Gravità}`); rimosso
  spazio spurio in `@UUID[Compendium.world.creatures. Oa5...]`.
- **Grammatica italiana** (12 file): `sui prove`→`sulle prove` (9),
  `dei prove`→`delle prove` (3); concordanza femminile plurale
  per `prove` (sostantivo femminile).
- **`bX6x2Un82XhGq7xh`**: `sui controlli di resistenza per
  spostare o immobilizzazione creatura` →
  `alle prove di Forza di resistenza per spostare o immobilizzare
  una creatura` (verbo invece di sostantivo, articolo).
- **Refuso `Persuasionee` → `Persuasione`** in 4 file
  (`species-it` + `profession-features-it`).
- **`ZLi1iMohq7hDP6mK`**: corpo testo `Sicario, Spy o Thief Tutti`
  → `Sicario, Spia o Ladro. Tutti`.
- **`KeYPiTNGYeoYv23c`** (Cantastorie): elenco competenze
  `Performance` → `Esibizione`; aggiunto spazio dopo `Furtività,`
  prima del tag `<span>Indagine`; titolo advancement
  `P0A31ffxh4uGuXox`: `Improvisation Pool = prof + WIS bon/2 (min 1)`
  → `Riserva Punti di Improvvisazione = competenza + bonus SAG/2
  (min 1)`.
- **`EEZ1I2ong44GGPow`**: heading `ELENCO DI SPELLAZIONE` →
  `Elenco degli incantesimi`.

## [1.0.25] - 2026-04-26

### Fixed
- **Nomi di professione usati come sostantivi nel testo**: tradotti
  ovunque appaiono nelle descrizioni come parole inglesi: `bard` →
  `bardo`, `scoundrel` → `canaglia`, `magus` → `mago`, `vitalist`
  → `vitalista`, `tycoon` → `magnate`, `storyteller` → `cantastorie`,
  `healer` → `guaritore`, `rifleman` → `fuciliere`, `armiger` →
  `armigero`, `paladin` → `paladino`, `explorer` → `esploratore`,
  `trapper` → `trappolatore`, `grenadier` → `granatiere`,
  `technician` → `tecnico`, `hitman` → `sicario`. Sostituite con
  smart-replace che protegge `identifier`, `classIdentifier`,
  `@Compendium[...]`, `@UUID[...]`, `@item[...]`, `@spell[...]`,
  `@skill[...]`, `@condizione[...]`, `@creature[...]` e attributi
  di sistema (img, baseItem, ecc.).
- **classIdentifier**: ripristinati a inglese i valori che il sweep
  precedente aveva tradotto in italiano (es. `canaglia` →
  `scoundrel`, `armigero` → `armiger`) — questo campo dnd5e DEVE
  combaciare con `identifier` della classe parent per far funzionare
  i link sottoclasse → classe.
- **Nomi delle abilità D&D 5e**: tradotti in tutto il pack:
  Stealth → Furtività, Insight → Intuizione, Performance →
  Esibizione, Acrobatics → Acrobazia, Perception → Percezione,
  Survival → Sopravvivenza, Deception → Inganno, Investigation →
  Indagare, Persuasion → Persuasione, Intimidation → Intimidire,
  History → Storia, Nature → Natura, Arcana → Arcano, Medicine →
  Medicina, Religion → Religione, Athletics → Atletica, Animal
  Handling → Addestrare Animali, Sleight of Hand → Rapidità di Mano.
  Costrutti come `controlli di Destrezza (Stealth)` →
  `prove di Destrezza (Furtività)` ecc.
- **Caratteristiche standard D&D 5e**:
  - `Action Surge` → `Azione Impetuosa`
  - `Sneak Attack` → `Attacco Furtivo` (e residuo `Attacco Sneak` →
    `Attacco Furtivo`)
  - `Extra Attack` → `Attacco Extra`
  - `Action Dice` → `Dadi Azione`
  - `Channel Divinity` → `Divinità del canale`
  - `Master of Explosives` → `Maestro degli Esplosivi`
  - `Weapon Improvement (The Artist's Touch)` →
    `Miglioramento dell'Arma (Il Tocco dell'Artista)`
  - `War Archetype Feature` → `Caratteristica Archetipo da Guerra`
  - `MAGUS SPELL LIST` → `LISTA INCANTESIMI DEL MAGO`,
    `TRUCCHETTI (0 LEVEL)` → `TRUCCHETTI (LIVELLO 0)`,
    `Modificatore di attacco Spell` → `Modificatore di attacco
    dell'incantesimo`.
  - `+1 Damage Bonus` → `Bonus +1 ai Danni`; `Damage Bonus` →
    `Bonus al Danno`; `Increase CA by +1` → `Aumenta CA di +1`;
    `Damage aumenta` → `Il danno aumenta`; `NPC Ally` →
    `Alleato PNG`; `Increase to Rank N of NPC Ally` → `Aumenta al
    Grado N di Alleato PNG`.
  - `Grant/Grand Ability` (e typo `Grant Abilty`) → `Concedere
    Abilità`.
- **Titoli di advancement del Mago**:
  - `Major Arcana: Choose a/an Nth Level spell` → `Arcani Maggiori:
    Scegli un incantesimo di N° livello`.
  - `Spell: Nth Secret Mth Level Spells` → `Incantesimo: Incantesimi
    di M° livello del N° Segreto` (tutte le combinazioni 1°-4°
    Segreto, 1°-5° livello).
  - `Spell: Nth Secret TRUCCHETTI` → `Incantesimo: Trucchetti del
    N° Segreto`.
  - `Spell: Take a Nth level Spell` (e typo `3th`) → `Incantesimo:
    Scegli un incantesimo di N° livello`.
- **Riferimenti `@action[...]` e azioni**:
  - `@action[Dodge]` → `@action[Schivata]`.
  - `to grapple creatura` → `a immobilizzare la creatura`;
    `grapple/Grapple` → `immobilizzazione/Immobilizzazione`;
    `grappling o grappled da voi` → `afferra o è afferrata da voi`.
  - `un focus incantesimo` → `un focus per incantesimi`;
    `Incantare Focus.` → `Focus per Incantare.`
- **Mistraduzioni MT residue**:
  - `ortografico/ortografica` (mistraduzione MT di "spell") →
    `incantesimo/magico`; `ortografia arcana` → `magia arcana`;
    `aiutare con l'ortografia` → `aiutare con la magia`.
  - `controllare contro il` → `prova contro il` (in spell saves).
  - `Increase Improvisation Pool by CHA bon.` → `Aumenta la
    Riserva di Improvvisazione del bonus di Carisma`.
  - `Saggezza (Insight o Medicina)` → `Saggezza (Intuizione o
    Medicina)`; `controlli Stealth` → `prove di Furtività`;
    `nell'abilità di X` (skill nomi) → `nell'abilità Y` italianizzata.
  - `The gruppo` → `Il gruppo`.
  - `un controllo di Saggezza` → `una prova di Saggezza`.

## [1.0.24] - 2026-04-26

### Fixed
- **Componenti materiali degli incantesimi (`materials.value`)**: tradotti
  101 spell components dalle versioni inglesi originali alle equivalenti
  italiane (es. `a coin` → `una moneta`, `a vial of blood from a humanoid
  killed within the past 24 hours` → `una fiala di sangue di un umanoide
  ucciso nelle ultime 24 ore`, e così via per tutte le 68 stringhe uniche
  trovate nel pack `spells-it`).
- **Etichette di advancement (`title`)**: tradotti i testi inglesi dei
  titoli degli avanzamenti di livello (visualizzati in level-up):
  - `Hit Dice` → `Dadi Vita` (nelle descrizioni di ogni professione).
  - `Channel Divinity` → `Divinità del canale`; `Subclass` →
    `Sottoclasse`; `ASI or FEAT` → `ASI o Talento`; `Grant/Grand
    Ability` → `Concedere Abilità`.
  - `Choose/Pick X 1st-Level Flagellant Spell` → `Scegli X
    incantesimi da Flagellante di 1° livello` (con varianti
    1°/2°/3°/4°/5°).
  - `Choose 2 Priest TRUCCHETTI` → `Scegli 2 trucchetti da Sacerdote`;
    `Pick a new Priest Crucchetto` → `Scegli un nuovo trucchetto da
    Sacerdote`; `Choose a new 1st-Level Priest Spell` → `Scegli un
    nuovo incantesimo da Sacerdote di 1° livello`; `Option: Replace
    with a new Spell of the same level.` → `Opzione: sostituisci con
    un nuovo incantesimo dello stesso livello.`
  - `Choose your First Secret`/`2nd Secret not opposite of previous
    choice`/etc. → `Scegli il tuo Primo Segreto`/`Scegli il 2°
    Segreto non opposto alla scelta precedente`.
  - `Learn a Founding/Greater/Major/Universal Mystery from your
    Secret(s).` → `Impara un Mistero Fondante/Maggiore/Universale dal
    tuo Segreto/dai tuoi Segreti.`
  - `Magus Incantare` → `Incantare del Mago`; `Enchantment Points` →
    `Punti di Incanto`.
- **Testo descrizione**:
  - `casting` (sostantivo isolato come "tempo di casting") → `lancio`
    nelle frasi `tempo di casting` → `tempo di lancio`, `Alla fine
    del casting` → `Alla fine del lancio`, `nel casting/utilizzata
    nel casting` → `nel lancio/utilizzata nel lancio`.
  - `ortografico/ortografica` (errore MT per "spell") → `incantesimo`.
  - `Cantirp/Crucchetto/Canticoltura` (errori ortografici) →
    `Trucchetto`/`Trucchetti`.
  - `Fellowship of the Compass` (residuo nel testo) → `Compagnia
    della Bussola`; `Apopi of Whispers` → `Apopi dei Sussurri`; `The
    Pug Heresy` → `L'Eresia del Carlino`; `Elisir of Eternal Life` →
    `Elisir di Vita Eterna`.
  - `Instinct of Species, Pack` → `Istinto di specie, Branco`;
    `Sleight of hand skill` → `abilità Rapidità di mano`; `Sleight
    of Hand` → `Rapidità di mano`; `un fast shuffle delle carte` →
    `un rapido mescolamento delle carte`.
  - `Spell Slots/SPELL SLOT` → `Slot Incantesimo`; `Spells conosciuti`
    → `Incantesimi conosciuti`; `Levels Max Spell` → `Livello Max
    Incantesimo`; `venturer` → `avventuriero`.
  - `hard-to-penetrate` (residuo) → `difficile da penetrare`;
    `ta rgeted` (typo) → `bersagliato`; `targeted solo una volta da
    ogni casting` → `bersagliato una sola volta da ogni lancio`.
  - `tabella Magus`/`Magus mostra quanti`/`del Magus stesso` (uso del
    nome di classe come sostantivo nel corpo) → `tabella del Mago`/
    `Mago mostra quanti`/`del Mago stesso`.
  - `Learn a new Metamagia from your Secrets.` → `Impara una nuova
    Metamagia dai tuoi Segreti.`; `Secret Crucchetto and 1 other
    trucchetto` → `Trucchetto del Segreto e 1 altro trucchetto`;
    `Option: Change a spell with another of the same level.` →
    `Opzione: sostituisci un incantesimo con un altro dello stesso
    livello.`
  - `2/short`, `1/short`, `3/short` → `2/riposo breve` ecc.;
    `both of which the spell consumes` → `entrambi consumati
    dall'incantesimo`; `which the spell consumes` → `che
    l'incantesimo consuma`.
- **Riferimenti `@item[...]`**: tradotte le label inglesi nei link agli
  item del Player's Handbook (es. `Oil (flask)` → `Olio (fiala)`,
  `Ball Bearings (Bag of 1,000)` → `Cuscinetti a Sfera (Sacchetto da
  1.000)`, `backpack|phb` → `zaino|phb`).

## [1.0.23] - 2026-04-26

### Fixed
- **Nomi documento ancora in inglese tradotti** (25 elementi):
  - Incantesimi: `Frostbite` → `Morso del Gelo`, `Summon Grande Demone`
    → `Evocare Grande Demone`, `Summon Fey/Fiend/Celestial/Lesser Demos/
    non morto/Spirito Draconico` → `Evocare Fatato/Immondo/Celestiale/
    Demoni Minori/Non Morto/Spirito Draconico`, `Costruzioni di Summon`
    → `Evocare Costrutti`, `Dust Devil` → `Diavolo di Polvere`.
  - Oggetti: `Spyglass` → `Cannocchiale`, `Mess Kit` → `Kit da Mensa`,
    `Kit Healer` → `Kit del Guaritore`, `Kit forgery` → `Kit da
    Falsificazione`, `Plumesword` → `Spada di Piume`, `Plumeblade` →
    `Lama di Piume`, `Parola di piume` → `Spada di Piume`.
  - Profession-features: `Arch-Thief` → `Arciladro`, `Viaggio del
    Venturer` → `Viaggio dell'Avventuriero`, `Aumento dei Punteggi di
    Caratteristica (Merchant/Scholar/Armiger)` → `(Mercante/Erudito/
    Armigero)`, `Attacco Extra (Armiger)` → `(Armigero)`,
    `Divinità del canale: Foresight/Summon Mystical Energies` →
    `Preveggenza/Evocare Energie Mistiche`, `Devil in/nei dettagli` →
    `Diavolo nei dettagli`, `Mistero universale: Adamantine Soul` →
    `Anima Adamantina`, `Strategia difensiva: Iron Will` →
    `Volontà di Ferro`.
- **Frasi mistraduzioni e grammatica**:
  - `rotoli` (rolls/dadi) → `tiri` ovunque (`rotoli di danno` → `tiri
    di danno`, `rotoli per colpire/iniziativa/danno incantesimo` →
    `tiri per …`); `rullo` → `tiro` / `tiro del dado`.
  - `assegni` (checks) → `prove` (`assegni di Stealth` → `prove di
    Furtività`); `controlli di abilità` → `prove di abilità`.
  - `Hindrance` → `Impedimento`; blocco "encumbers assegni su stealth
    e acrobatici" → "impone svantaggio alle prove di Furtività e
    Acrobazia"; `getti di salvataggio` → `tiri salvezza`.
  - `modificatore di resistenza` → `modificatore di Costituzione` (4
    file di species-features).
  - `modifier <Caratteristica>` (es. `modifier Intelligenza`) →
    `modificatore di <Caratteristica>`.
  - `Gli avi` → `Gli Aviani`; `Avians` rimasto → `Aviani`/`Un Aviano`.
  - `parola di piume` / `parola d'ordine` / `idraulica` (mistraduzioni
    di plumesword/feathersword/plumeblade) → `spada/lama di piume`.
  - `gauntlet[s] di artigli` → `guanti d'arme con artigli`; `spiedini`
    → `artigli`; `ali e gambe libere` → `ali e zampe libere`.
  - `Refining the Work` → `Rifinire l'Opera`; `del Magus`/`il Magus`/
    `un Magus` (sostantivo) → `del Mago`/`il Mago`/`un Mago`.
  - `ranged` → `a distanza`; `Barn Owl` → `Barbagianni`;
    `un naturale 20` → `un 20 naturale`.
  - `Pug Heresy` (rimasto in fazione) → `Eresia del Carlino`;
    `Eretici Occiputsi` → `Eretici Occiputi`.
  - `Selvaggio spirito` → `Spirito selvaggio`; `corna infliggere` →
    `corna infliggono`; `DC ` → `CD ` (Classe Difficoltà).
- **Effetti con nomi ancora in inglese**: `Bonus Intelligenza modifier
  to Initiative` → `Bonus Intelligenza all'Iniziativa`,
  `Curtain of the Flames` → `Cortina di Fiamme`,
  `Network of Contacts` → `Rete di Contatti`,
  `Refresh the Soul` → `Ristoro dell'Anima`,
  `Focus the Pain` → `Concentrare il Dolore`,
  `Add proficiency bonus to initiative` → `Aggiunge bonus di
  competenza all'iniziativa`, `Bonus +4 CA against the same creature
  attacking you` → `Bonus +4 CA contro la stessa creatura che ti
  attacca`, e simili.
- **Etichette dei link `@Compendium[...]`**: aggiornate per i 30
  documenti rinominati così che le label visibili nei riferimenti
  combacino col nuovo nome italiano.
- **HTML img**: `larghezza/altezza` → `width/height` (attributi non
  valevoli in italiano, browser li ignorava).

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
