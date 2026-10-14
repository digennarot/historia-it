/**
 * Historia Module Settings
 * Handles the visibility of English and Italian compendium packs and login background.
 */

const MODULE_ID = "historia-it";
const BACKGROUND_PATH = `modules/${MODULE_ID}/media/Background/historia%20login%20page.webp`;

Hooks.once("init", () => {
    // Register the language preference setting
    game.settings.register(MODULE_ID, "languagePreference", {
        name: "Language Preference / Preferenza Lingua",
        hint: "Choose which compendium packs should be visible (English or Italian). / Scegli quali pacchetti del compendio devono essere visibili (Inglese o Italiano).",
        scope: "client",
        config: true,
        type: String,
        choices: {
            "en": "English",
            "it": "Italiano"
        },
        default: "it",
        onChange: () => {
            // Reload the browser for the changes to take effect if necessary,
            // or simply re-render the compendium directory.
            ui.sidebar.render(true);
        }
    });

    // Register the login background setting
    game.settings.register(MODULE_ID, "applyLoginBackground", {
        name: "Apply Historia World Cover / Applica Copertina Mondo",
        hint: "Automatically set the Historia illustration as the world background (join page and world card). / Imposta automaticamente l'illustrazione di Historia come sfondo del mondo (pagina di accesso e scheda del mondo).",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: (value) => {
            if (value && game.user.isGM) applyWorldBackground();
        }
    });
});

Hooks.once("ready", () => {
    if (game.user.isGM && game.settings.get(MODULE_ID, "applyLoginBackground")) applyWorldBackground();
});

// Foundry non ha impostazioni "core" per lo sfondo: la pagina di accesso e la scheda del mondo usano
// world.background, che un GM modifica come fa la finestra "Configura mondo" (POST editWorld a /setup).
async function applyWorldBackground() {
    if (game.world.background === BACKGROUND_PATH) return;
    try {
        const response = await foundry.utils.fetchJsonWithTimeout(foundry.utils.getRoute("setup"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "editWorld", id: game.world.id, background: BACKGROUND_PATH })
        });
        if (response.error) throw new Error(response.error);
        game.world.updateSource({ background: BACKGROUND_PATH });
        console.log(`${MODULE_ID} | Applied Historia world background.`);
    } catch (err) {
        console.warn(`${MODULE_ID} | Could not apply Historia world background.`, err);
    }
}

function applyCompendiumVisibility(html) {
    const preference = game.settings.get(MODULE_ID, "languagePreference");

    // v13+ ApplicationV2 passes a native HTMLElement; older versions pass jQuery.
    const root = html instanceof HTMLElement ? html : html?.[0];
    if (!root) return;

    const packs = root.querySelectorAll(".directory-item.pack, .directory-item.compendium");

    packs.forEach((element) => {
        const packId = element.dataset.pack ?? element.dataset.entryId;
        if (!packId || !packId.startsWith(MODULE_ID)) return;

        const isItPack = packId.endsWith("-it") || packId.includes(".factions-it");

        if (preference === "it" && !isItPack) {
            element.style.display = "none";
        } else if (preference === "en" && isItPack) {
            element.style.display = "none";
        } else {
            element.style.display = "";
        }
    });
}

Hooks.on("renderCompendiumDirectory", (app, html) => applyCompendiumVisibility(html));
