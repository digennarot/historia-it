# Historia - Modulo per Foundry VTT

Questo repository contiene sia la versione italiana che quella inglese dei contenuti per l'ambientazione **Historia** (sistema D&D 5e). Include i testi e tutti i media necessari (immagini e icone) in formato standalone.

---

## 🇮🇹 Historia (Italiano)

Questo modulo offre la **traduzione in italiano** dei compendi e dei contenuti.

### 📦 Installazione

Puoi installare facilmente questo modulo direttamente da Foundry VTT:

1. Apri Foundry VTT e seleziona il tab **Moduli Add-on**.
2. Clicca sul pulsante **Installa Modulo** in basso.
3. Incolla il seguente link nel campo **URL Manifesto**:
   ```
   https://raw.githubusercontent.com/digennarot/historia-it-dist/main/module.json
   ```
4. Clicca su **Installa**.

### Installazione manuale

1. Vai alla pagina dei [rilasci](https://github.com/digennarot/historia-it-dist/releases) e scarica il file `historia-it.zip` dell'ultima versione.
2. Estrai il contenuto nella cartella `Data/modules/historia-it` all'interno del percorso dei dati utente di Foundry VTT.

---

## 🇬🇧 Historia (English)

This module provides the **original English content** with all the bundled media.

### 📦 Installation

You can install the English version using the following Manifest URL:

1. Open Foundry VTT and select the **Add-on Modules** tab.
2. Click the **Install Module** button at the bottom.
3. Paste the following link into the **Manifest URL** field:
   ```
   https://github.com/digennarot/historia-it/releases/latest/download/module-en.json
   ```
   *(Make sure the URL points to the correct repository for the English version)*

### Manual Installation

1. Download the `historia-en.zip` file from the releases page.
2. Extract the contents into the `Data/modules/historia-en` folder.

---

## 🛠️ Build e sviluppo

Se desideri compilare il modulo dai sorgenti, installa prima le dipendenze con `npm install`, poi usa uno dei seguenti comandi:

- Build della versione italiana: `npm run build:it`
- Build della versione inglese: `npm run build:en`
- Build di entrambe: `npm run build:all`

Il build produce le directory `historia-it/` e `historia-en/` (entrambe ignorate da git) con i pack compilati, il manifesto `module.json` e gli asset necessari.

## 🚀 Processo di release

Le release sono gestite dal workflow GitHub Actions `.github/workflows/release.yml`, che si attiva automaticamente al push di un tag con prefisso `v*`.

Per rilasciare una nuova versione:

1. Aggiorna la versione in `module-it.json`, `module-en.json`, `historia-it/module.json` e `package.json`.
2. Committa e apri una PR verso `main`; dopo il merge, crea e pusha il tag corrispondente:
   ```bash
   git tag v<versione>
   git push origin v<versione>
   ```
3. Il workflow compila i pack, crea gli archivi ZIP, pubblica la release su GitHub e sincronizza il repository di distribuzione `historia-it-dist`.

## 🐛 Segnalazione bug e contatti

Se trovi refusi, errori o problemi tecnici, apri una [Issue](https://github.com/digennarot/historia-it/issues) su questo repository.

## 📝 Changelog

Le modifiche di ogni versione sono documentate in [CHANGELOG.md](CHANGELOG.md).

## ⚖️ Licenza e riconoscimenti

*   **Autore della conversione:** Tiziano Di Gennaro
*   Compatibile con **Foundry VTT versione 11+** (verificato per **v13**).

