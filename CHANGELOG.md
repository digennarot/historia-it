# Changelog

Tutte le modifiche significative a questo modulo sono documentate in questo file.

Il formato segue [Keep a Changelog](https://keepachangelog.com/it/1.1.0/)
e il progetto aderisce al [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
