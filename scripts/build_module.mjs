import fs from "fs/promises";
import path from "path";
import { compilePack } from "@foundryvtt/foundryvtt-cli/lib/package.mjs";

const MODULE_ID = "historia-it";
const MODULE_TITLE = "Historia";

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
    "spells": "Incantesimi"
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
    await fs.mkdir("historia-it/packs", { recursive: true });
    let packs = [];
    let imagesToCopy = new Map(); // sourcePath -> modulePath
    const processedFiles = new Set();
    const sourceDirs = ["src/data"];

    for (const dir of sourceDirs) {
        const filenames = (await fs.readdir(dir)).filter(f => f.startsWith("fvtt-") && f.endsWith(".json"));

        for (const file of filenames) {
            const isItalian = file.endsWith("_it.json");
            const lang = isItalian ? "it" : "en";
            const labelSuffix = isItalian ? " (IT)" : " (EN)";

            if (processedFiles.has(file)) continue;
            processedFiles.add(file);

            const filePath = path.join(dir, file);
            console.log(`Processing ${filePath} (${lang})...`);
            const data = JSON.parse(await fs.readFile(filePath, "utf-8"));

            const meta = data.metadata || {};
            let base_name = meta.name || "unknown";
            if (base_name === "unknown") {
                const parts = file.replace(/^fvtt-/, "").replace(/_it\.json$/, "").replace(/\.json$/, "").split("-pack-dnd5e-");
                base_name = parts.length > 1 ? parts[1] : parts[0];
            }

            const pack_name = isItalian ? `${base_name.replace(/-it$/, "")}-it` : base_name.replace(/-it$/, "");
            let pack_label = LABEL_TRANSLATIONS[base_name.replace(/-it$/, "")]
                ? `${LABEL_TRANSLATIONS[base_name.replace(/-it$/, "")]}${labelSuffix}`
                : (meta.label || `${base_name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}${labelSuffix}`);

            if (!pack_label.includes(labelSuffix)) pack_label += labelSuffix;
            let pack_type = meta.type || data.type || "Item";

            const tempSrcDir = path.join("temp_packs", pack_name);
            const outDir = path.join("historia-it", "packs", pack_name);

            await fs.mkdir(tempSrcDir, { recursive: true });

            const resolveImagePath = async (val) => {
                if (!val || typeof val !== 'string' || val.trim() === '') return null;
                let decodedVal = val;
                try { decodedVal = decodeURIComponent(val); } catch (e) { }

                const potentialMedia = [
                    decodedVal,
                    decodedVal.replace("Wynther's Files/Historia/", "Wynther's Files/"),
                    decodedVal.replace("Wynther's Files/", ""),
                    decodedVal.replace("assets/", ""),
                ].filter(p => p && p.trim() !== '' && p !== '/' && p !== '.');

                for (const p of potentialMedia) {
                    const srcMediaPath = path.join("src/media", p);
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
            const collection = TYPE_TO_COLLECTION[pack_type] || "items";

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

            let processedAny = false;
            let itemCount = 0;
            let folderCount = 0;
            let unknownCount = 0;

            if (data.folders && data.folders.length > 0) {
                for (const folder of data.folders) {
                    const folderId = folder._id || `folder_${unknownCount++}`;
                    folder._id = folderId;
                    folder._key = `!folders!${folderId}`;
                    await processData(folder);
                    await fs.writeFile(path.join(tempSrcDir, `folder_${folderId}.json`), JSON.stringify({
                        ...folder,
                        type: "Folder"
                    }, null, 2));
                    folderCount++;
                }
            }

            const content = data.items || data.pages || [];
            if (content.length > 0) {
                for (const item of content) {
                    await processData(item);
                    const itemId = item._id || `unknown_id_${unknownCount++}`;
                    item._id = itemId;
                    injectKeys(item, collection);
                    await fs.writeFile(path.join(tempSrcDir, `${itemId}.json`), JSON.stringify(item, null, 2));
                    itemCount++;
                }
                processedAny = true;
            }

            if (processedAny) {
                console.log(`Extracted ${itemCount} items and ${folderCount} folders to ${tempSrcDir}. Compiling pack...`);
                await fs.mkdir(outDir, { recursive: true });
                await compilePack(tempSrcDir, outDir, { yaml: false, nedb: false, recursive: false });
                packs.push({
                    name: pack_name,
                    label: pack_label,
                    path: `packs/${pack_name}`,
                    type: pack_type,
                    system: "dnd5e"
                });
            }
        }
    }

    const packNames = packs.map(p => p.name);
    const module_json = {
        id: MODULE_ID,
        title: MODULE_TITLE,
        version: "1.0.2",
        compatibility: {
            minimum: 11,
            verified: 13
        },
        authors: [{ name: "Tiziano Di Gennaro" }],
        description: "English and Italian packs for Historia.",
        manifest: "https://raw.githubusercontent.com/digennarot/historia-it-dist/main/module.json",
        download: "https://github.com/digennarot/historia-it-dist/releases/latest/download/historia-it.zip",
        esmodules: ["scripts/main.js"],
        packs: packs,
        packFolders: [
            {
                name: "Historia",
                sorting: "a",
                packs: packNames
            }
        ]
    };

    await fs.writeFile(path.join("historia-it", "module.json"), JSON.stringify(module_json, null, 2));
    console.log("Generated module.json");

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
