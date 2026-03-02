/**
 * Historia Module Language Settings
 * Handles the visibility of English and Italian compendium packs.
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
});

Hooks.on("renderCompendiumDirectory", (app, html, data) => {
    const preference = game.settings.get(MODULE_ID, "languagePreference");

    // Select all pack items in the sidebar
    const packs = html.find(".directory-item.pack");

    packs.each((index, element) => {
        const packId = element.dataset.pack;
        if (!packId || !packId.startsWith(MODULE_ID)) return;

        const isItPack = packId.endsWith("-it") || packId.includes(".factions-it");

        if (preference === "it" && !isItPack) {
            element.style.display = "none";
        } else if (preference === "en" && isItPack) {
            element.style.display = "none";
        }
    });
});
