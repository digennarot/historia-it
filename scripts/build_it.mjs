import fs from "fs/promises";
import path from "path";
import { compilePack } from "@foundryvtt/foundryvtt-cli/lib/package.mjs";

const MODULE_ID = "historia-it";
const MODULE_TITLE = "Historia (Italiano)";
const labelSuffix = " (IT)";

// Helper to copy a file and create directories as needed
async function copyFileAndDirs(src, dest) {
    const rootDir = path.dirname(path.dirname(new URL(import.meta.url).pathname));
    const fullSrc = path.isAbsolute(src) ? src : path.join(rootDir, src);
    const fullDest = path.isAbsolute(dest) ? dest : path.join(rootDir, dest);
    await fs.mkdir(path.dirname(fullDest), { recursive: true });
    await fs.copyFile(fullSrc, fullDest);
}

const LABEL_TRANSLATIONS = {
    "factions-and-careers": "Fazioni e Carriere",
    "ventures": "Imprese",
    "factions": "Fazioni",
    "items": "Oggetti",
    "species": "Specie",
    "profession-features": "Privilegi di Professione",
    "professions": "Professioni",
    "species-features": "Privilegi di Specie",
    "spells": "Incantesimi",
    "historia-factions": "Fazioni (Historia)",
    "items-historia": "Oggetti (Historia)",
    "spells-historia": "Incantesimi (Historia)"
};

const COMPENDIUM_MAP = {
    "world.historia-factions": "historia-it.factions-it",
    "world.historia-items": "historia-it.items-it",
    "world.historia-spells": "historia-it.spells-it",
    "world.historia-ventures": "historia-it.ventures-it",
    "world.historia-factions-and-careers": "historia-it.factions-and-careers-it",
    "world.historia-species": "historia-it.species-it",
    "world.historia-professions": "historia-it.professions-it",
    "world.historia-profession-features": "historia-it.profession-features-it",
    "world.historia-species-features": "historia-it.species-features-it"
};

async function main() {
    console.log("Starting build process...");
    const rootManifest = JSON.parse(await fs.readFile("module-it.json", "utf-8"));
    const MODULE_VERSION = rootManifest.version;
    console.log(`Version: ${MODULE_VERSION}`);

    await fs.mkdir("historia-it/packs", { recursive: true });
    let packs = [];
    let imagesToCopy = new Map(); // sourcePath -> modulePath
    const sourcePacksDir = "src/packs";
    const packDirs = await fs.readdir(sourcePacksDir);

    const resolveImagePath = async (val) => {
        if (!val || typeof val !== 'string' || val.trim() === '') return null;
        let decodedVal = val;
        try { decodedVal = decodeURIComponent(val); } catch (e) { }

        const potentialMedia = [
            decodedVal,
            decodedVal.replace(/^\/?media\//, ""),
            decodedVal.replace(/^\/?assets\//, ""),
            decodedVal.replace(/^\/?icons\//, ""),
            decodedVal.replace(/^\/?modules\/historia\//, ""),
            decodedVal.replace(/^\/?modules\/historia-it\//, ""),
            decodedVal.replace("Wynther's Files/Historia/", "Wynther's Files/"),
            decodedVal.replace("Wynther's Files/Historia/", ""),
            decodedVal.replace("Wynther's Files/", ""),
            decodedVal.replace("Historia/", ""),
            decodedVal.replace("assets/", ""),
        ].filter(p => p && p.trim() !== '' && p !== '/' && p !== '.');


        for (const p of potentialMedia) {
            const srcMediaPath = path.join("media", p);
            try {
                const stats = await fs.stat(srcMediaPath);
                if (stats.isFile()) {
                    const modulePath = path.join("media", p);
                    imagesToCopy.set(srcMediaPath, modulePath);
                    return `modules/${MODULE_ID}/${modulePath.replace(/\\/g, '/')}`;
                }
            } catch (e) { }

            const assetsIconPath = path.join("src/assets/icons", p);
            try {
                const stats = await fs.stat(assetsIconPath);
                if (stats.isFile()) {
                    const modulePath = path.join("icons", p);
                    imagesToCopy.set(assetsIconPath, modulePath);
                    return `modules/${MODULE_ID}/${modulePath.replace(/\\/g, '/')}`;
                }
            } catch (e) { }

            const assetsHistoriaPath = path.join("src/assets/historia", p);
            try {
                const stats = await fs.stat(assetsHistoriaPath);
                if (stats.isFile()) {
                    const modulePath = path.join("assets/historia", p);
                    imagesToCopy.set(assetsHistoriaPath, modulePath);
                    return `modules/${MODULE_ID}/${modulePath.replace(/\\/g, '/')}`;
                }
            } catch (e) { }
        }
        return null;
    };

    const processData = async (obj) => {
        if (!obj) return;
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                let val = obj[key];
                let changed = false;

                const newPath = await resolveImagePath(val);
                if (newPath) {
                    val = newPath;
                    changed = true;
                } else if (val.includes('src="')) {
                    const regex = /src="([^"]+)"/g;
                    let match;
                    let newVal = val;
                    while ((match = regex.exec(val)) !== null) {
                        const originalPath = match[1];
                        const resolved = await resolveImagePath(originalPath);
                        if (resolved) {
                            newVal = newVal.replace(originalPath, resolved);
                            changed = true;
                        }
                    }
                    if (changed) val = newVal;
                }

                const newVal = val.replace(/@Compendio\[(world\.historia-[a-z0-9-]+)\.([^\]]+)\]/g, (match, p1, p2) => {
                    const mapped = COMPENDIUM_MAP[p1];
                    return mapped ? `@Compendio[${mapped}.${p2}]` : match;
                });

                if (newVal !== val) {
                    val = newVal;
                    changed = true;
                }
                if (changed) obj[key] = val;
            } else if (typeof obj[key] === 'object') {
                await processData(obj[key]);
            }
        }
    };

    const TYPE_TO_COLLECTION = {
        "Item": "items",
        "JournalEntry": "journal",
        "Actor": "actors",
        "Scene": "scenes",
        "Macro": "macros",
        "RollTable": "tables",
        "Playlist": "playlists"
    };

    const HIERARCHY = {
        actors: { items: [], effects: [] },
        cards: { cards: [] },
        combats: { combatants: [], groups: [] },
        delta: { items: [], effects: [] },
        effects: {},
        items: { effects: [] },
        journal: { pages: [], categories: [] },
        playlists: { sounds: [] },
        regions: { behaviors: [] },
        tables: { results: [] },
        tokens: { delta: {} },
        scenes: {
            drawings: [], tokens: [], levels: [], lights: [], notes: [],
            regions: [], sounds: [], templates: [], tiles: [], walls: []
        }
    };

    const injectKeys = (doc, collName, sublevelPrefix = "", idPrefix = "") => {
        const sublevel = [sublevelPrefix, collName].filter(x => x).join(".");
        const id = [idPrefix, doc._id].filter(x => x).join(".");
        doc._key = `!${sublevel}!${id}`;

        for (const [embeddedColl, type] of Object.entries(HIERARCHY[collName] || {})) {
            const embeddedValue = doc[embeddedColl];
            if (Array.isArray(type) && Array.isArray(embeddedValue)) {
                for (const embeddedDoc of embeddedValue) {
                    if (embeddedDoc && embeddedDoc._id) {
                        injectKeys(embeddedDoc, embeddedColl, sublevel, id);
                    }
                }
            } else if (embeddedValue && embeddedValue._id) {
                injectKeys(embeddedValue, embeddedColl, sublevel, id);
            }
        }
    };

    for (const packDirName of packDirs) {
        const packPath = path.join(sourcePacksDir, packDirName);
        const stats = await fs.stat(packPath);
        if (!stats.isDirectory()) continue;

        const sourceDir = path.join(packPath, "_source");
        if (!(await fs.access(sourceDir).then(() => true).catch(() => false))) continue;

        const isItalian = packDirName.endsWith("-it");
        if (!isItalian) continue; // Only process Italian packs for this module

        console.log(`Processing pack directory ${packDirName}...`);

        const base_name = packDirName.replace(/-it$/, "");
        const pack_name = packDirName;
        let pack_label = LABEL_TRANSLATIONS[base_name] || base_name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        if (!pack_label.includes(labelSuffix)) pack_label += labelSuffix;

        const entryFiles = (await fs.readdir(sourceDir)).filter(f => f.endsWith(".json"));
        if (entryFiles.length === 0) continue;

        // Peek at first file to determine type
        const firstEntry = JSON.parse(await fs.readFile(path.join(sourceDir, entryFiles[0]), "utf-8"));
        const pack_type = firstEntry.pages ? "JournalEntry" : "Item"; // Simple detection based on content
        const collection = TYPE_TO_COLLECTION[pack_type] || "items";

        const tempSrcDir = path.join("temp_packs", pack_name);
        const outDir = path.join("historia-it", "packs", pack_name);
        await fs.mkdir(tempSrcDir, { recursive: true });

        let itemCount = 0;
        let folderCount = 0;

        for (const file of entryFiles) {
            const filePath = path.join(sourceDir, file);
            const entryData = JSON.parse(await fs.readFile(filePath, "utf-8"));

            await processData(entryData);

            if (entryData.type === "Folder") {
                const folderId = entryData._id;
                entryData._key = `!folders!${folderId}`;
                folderCount++;
            } else {
                const itemId = entryData._id;
                injectKeys(entryData, collection);
                itemCount++;
            }

            await fs.writeFile(path.join(tempSrcDir, file), JSON.stringify(entryData, null, 2));
        }

        if (itemCount > 0 || folderCount > 0) {
            console.log(`Extracted ${itemCount} items and ${folderCount} folders to ${tempSrcDir}. Compiling pack...`);
            await fs.mkdir(outDir, { recursive: true });
            try {
                await compilePack(tempSrcDir, outDir, { yaml: false, nedb: false, recursive: false });
                console.log(`Successfully compiled ${pack_name}`);
            } catch (err) {
                console.error(`Failed to compile ${pack_name}:`, err);
                throw err;
            }
            packs.push({
                name: pack_name,
                label: pack_label,
                path: `packs/${pack_name}`,
                type: pack_type,
                system: "dnd5e"
            });
        }
    }

    rootManifest.packs = packs;
    const folderConfig = rootManifest.folders?.find(f => f.name === "Historia");
    if (folderConfig) {
        folderConfig.packs = packs.map(p => p.name);
    } else {
        rootManifest.folders = [
            ...(rootManifest.folders || []),
            {
                name: "Historia",
                sorting: "a",
                color: "#d4af37",
                packs: packs.map(p => p.name)
            }
        ];
    }

    await fs.writeFile("historia-it/module.json", JSON.stringify(rootManifest, null, 2));
    console.log("Generated historia-it/module.json");

    // Copy runtime scripts
    try {
        await copyFileAndDirs("src/scripts/main.js", "historia-it/scripts/main.js");
        console.log("Copied runtime scripts.");
    } catch (e) {
        console.error("Failed to copy runtime scripts:", e);
    }

    console.log(`Need to copy ${imagesToCopy.size} image files...`);
    let copiedCount = 0;
    let missingCount = 0;

    const copyTasks = Array.from(imagesToCopy.entries());
    const chunkArray = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
    const chunks = chunkArray(copyTasks, 50);

    for (const chunk of chunks) {
        await Promise.all(chunk.map(async ([srcPath, moduleRelPath]) => {
            const destPath = path.join("historia-it", moduleRelPath);
            try {
                await copyFileAndDirs(srcPath, destPath);
                copiedCount++;
            } catch (e) {
                if (e.code === 'ENOENT') {
                    missingCount++;
                } else {
                    console.error(`Failed to copy ${srcPath}:`, e);
                    throw e;
                }
            }
        }));
    }

    console.log(`Module standalone generation complete! Copied ${copiedCount} images. (${missingCount} not found locally)`);
    await fs.rm("temp_packs", { recursive: true, force: true });
}

main().catch(console.error);
