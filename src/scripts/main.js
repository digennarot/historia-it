/**
 * Historia Module Settings
 * Handles the visibility of English and Italian compendium packs and login background.
 */

const MODULE_ID = "historia-it";

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
        name: "Apply Historia Login Background / Applica Sfondo Login Historia",
        hint: "Automatically set the Historia illustration as the login page background. / Imposta automaticamente l'illustrazione di Historia come sfondo della pagina di login.",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: (value) => {
            if (value && game.user.isGM) {
                game.settings.set("core", "loginBackground", `modules/${MODULE_ID}/src/media/Background/historia%20login%20page.webp`);
            }
        }
    });
});

Hooks.once("ready", () => {
    if (!game.user.isGM) return;

    const applyBackground = game.settings.get(MODULE_ID, "applyLoginBackground");
    if (applyBackground) {
        const currentBackground = game.settings.get("core", "loginBackground");
        const targetBackground = `modules/${MODULE_ID}/src/media/Background/historia%20login%20page.webp`;

        if (currentBackground !== targetBackground) {
            game.settings.set("core", "loginBackground", targetBackground);
            console.log(`${MODULE_ID} | Applied Historia login background.`);
        }
    }
});

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
