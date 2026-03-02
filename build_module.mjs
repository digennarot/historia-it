import fs from "fs/promises";
import path from "path";
import { compilePack } from "./node_modules/@foundryvtt/foundryvtt-cli/lib/package.mjs";

const MODULE_ID = "historia-it";
const MODULE_TITLE = "Historia (Italiano)";

// Helper to copy a file and create directories as needed
async function copyFileAndDirs(src, dest) {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(src, dest);
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
    let imagesToCopy = new Set();
    const IMAGE_DIRS = ["Wynther's Files", "assets", "icons"];

    // 1. Process all JSON files and extract items
    const files = await fs.readdir(".");
    for (const file of files) {
        if (!file.startsWith("fvtt-") || !file.endsWith("_it.json")) continue;

        console.log(`Processing ${file}...`);
        const data = JSON.parse(await fs.readFile(file, "utf-8"));

        const meta = data.metadata || {};
        let orig_name = meta.name || "unknown";
        if (orig_name === "unknown") {
            const parts = file.replace("fvtt-", "").replace("_it.json", "").split("-pack-dnd5e-");
            if (parts.length > 1) orig_name = parts[1];
        }

        let pack_name = (orig_name.endsWith("-it") || orig_name.endsWith("_it")) ? orig_name.replace("_", "-") : `${orig_name}-it`;

        // Translation logic
        let base_name = orig_name.replace("_it", "").replace("-it", "");
        let pack_label = LABEL_TRANSLATIONS[base_name]
            ? `${LABEL_TRANSLATIONS[base_name]} (IT)`
            : (meta.label || `${base_name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} (IT)`);

        if (!pack_label.includes("(IT)")) pack_label += " (IT)";

        let pack_type = meta.type || data.type || "Item";

        const tempSrcDir = path.join("temp_packs", pack_name);
        const outDir = path.join("historia-it", "packs", pack_name);

        await fs.mkdir(tempSrcDir, { recursive: true });

        // Deep processing function for paths and links
        const processData = async (obj) => {
            if (!obj) return;
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    let val = obj[key];
                    let changed = false;

                    // 1. Update Image Paths
                    // Decode URL encoding (e.g., %20 -> space, %27 -> ')
                    let decodedVal = val;
                    try {
                        decodedVal = decodeURIComponent(val);
                    } catch (e) {
                        // Skip decoding if malformed
                    }

                    // Define potential roots and mappings
                    const potentialPaths = [decodedVal];
                    if (decodedVal.startsWith("Wynther's Files/Historia/")) {
                        potentialPaths.push(decodedVal.replace("Wynther's Files/Historia/", "modules/Historia/"));
                    } else if (decodedVal.startsWith("Wynther's Files/")) {
                        potentialPaths.push(decodedVal.replace("Wynther's Files/", "modules/Historia/"));
                    }
                    if (decodedVal.startsWith("assets/")) {
                        potentialPaths.push(path.join("modules/Historia", decodedVal));
                    }

                    let foundPath = null;
                    for (const p of potentialPaths) {
                        try {
                            await fs.stat(p);
                            foundPath = p;
                            break;
                        } catch (e) { }
                    }

                    if (foundPath) {
                        imagesToCopy.add(foundPath);
                        val = `modules/${MODULE_ID}/${foundPath}`;
                        changed = true;
                    } else if (val.includes('src="')) {
                        // Handle images in HTML descriptions
                        const regex = /src="([^"]+)"/g;
                        let match;
                        let newVal = val;
                        while ((match = regex.exec(val)) !== null) {
                            const originalPath = match[1];
                            let dPath = originalPath;
                            try {
                                dPath = decodeURIComponent(originalPath);
                            } catch (e) { }

                            const innerPaths = [dPath];
                            if (dPath.startsWith("Wynther's Files/Historia/")) {
                                innerPaths.push(dPath.replace("Wynther's Files/Historia/", "modules/Historia/"));
                            } else if (dPath.startsWith("Wynther's Files/")) {
                                innerPaths.push(dPath.replace("Wynther's Files/", "modules/Historia/"));
                            }

                            let iFound = null;
                            for (const ip of innerPaths) {
                                try {
                                    await fs.stat(ip);
                                    iFound = ip;
                                    break;
                                } catch (e) { }
                            }

                            if (iFound) {
                                imagesToCopy.add(iFound);
                                newVal = newVal.replace(originalPath, `modules/${MODULE_ID}/${iFound}`);
                                changed = true;
                            }
                        }
                        if (changed) val = newVal;
                    }

                    // 2. Update Compendium Links
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

        // Process Folders
        if (data.folders && data.folders.length > 0) {
            for (const folder of data.folders) {
                const folderId = folder._id || `folder_${unknownCount++}`;
                folder._id = folderId; // Ensure _id is set
                folder._key = `!folders!${folderId}`;
                await processData(folder);
                await fs.writeFile(path.join(tempSrcDir, `folder_${folderId}.json`), JSON.stringify({
                    ...folder,
                    type: "Folder"
                }, null, 2));
                folderCount++;
            }
        }

        // Process Items (Primary Documents)
        const content = data.items || data.pages || [];
        if (content.length > 0) {
            l
            for (const item of content) {
                await processData(item);
                const itemId = item._id || `unknown_id_${unknownCount++}`;
                item._id = itemId; // Ensure _id is set
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

            // Log output size
            const outFiles = await fs.readdir(outDir);
            let totalSize = 0;
            for (const f of outFiles) {
                const stat = await fs.stat(path.join(outDir, f));
                totalSize += stat.size;
            }
            console.log(`Compiled ${pack_name}. Total size: ${totalSize} bytes across ${outFiles.length} files.`);

            packs.push({
                name: pack_name,
                label: pack_label,
                path: `packs/${pack_name}`,
                type: pack_type,
                system: "dnd5e"
            });
        }
    }

    // 2. Write module.json
    const packNames = packs.map(p => p.name);
    const module_json = {
        id: MODULE_ID,
        title: MODULE_TITLE,
        version: "1.0.1",
        compatibility: {
            minimum: 11,
            verified: 13
        },
        authors: [{ name: "Tiziano Di Gennaro" }],
        description: "Italian translation packs for Historia (Standalone with media).",
        manifest: "https://raw.githubusercontent.com/digennarot/historia-it-dist/main/module.json",
        download: "https://github.com/digennarot/historia-it-dist/releases/latest/download/historia-it.zip",
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

    // 3. Copy Images
    console.log(`Need to copy ${imagesToCopy.size} image files...`);
    let copiedCount = 0;
    let missingCount = 0;

    const imagePaths = Array.from(imagesToCopy);
    const chunkArray = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
    const chunks = chunkArray(imagePaths, 50);

    for (const chunk of chunks) {
        await Promise.all(chunk.map(async (rawPath) => {
            const destPath = path.normalize(path.join("historia-it", rawPath));

            // Prevent path traversal
            if (!destPath.startsWith("historia-it" + path.sep) && destPath !== "historia-it") {
                console.warn(`Skipping invalid/unsafe path: ${rawPath}`);
                return;
            }

            try {
                await copyFileAndDirs(rawPath, destPath);
                copiedCount++;
            } catch (e) {
                if (e.code === 'ENOENT') {
                    missingCount++;
                } else {
                    console.error(`Failed to copy ${rawPath}:`, e);
                    throw e; // Raise on structural FS errors
                }
            }
        }));
    }

    console.log(`Module standalone generation complete! Copied ${copiedCount} images. (${missingCount} not found locally)`);

    // Cleanup
    await fs.rm("temp_packs", { recursive: true, force: true });
}

main().catch(console.error);
