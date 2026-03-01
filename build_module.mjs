import fs from "fs/promises";
import path from "path";
import { compilePack } from "@foundryvtt/foundryvtt-cli/lib/package.mjs";

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

async function main() {
    await fs.mkdir("historia-it/packs", { recursive: true });
    let packs = [];
    let imagesToCopy = new Set();

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

        const srcDir = path.join("historia-it", "packs", pack_name, "_source");
        const outDir = path.join("historia-it", "packs", pack_name);

        await fs.mkdir(srcDir, { recursive: true });

        const items = (data.items || []).concat(data.pages || []); // Pages for Journals

        // Deep string replacement function to update icon/image paths
        const processItemPaths = (obj) => {
            if (!obj) return;
            // Iterate over all keys
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    // Check if it's a known path
                    const val = obj[key];
                    if (val.startsWith("Wynther's Files/") || val.startsWith("assets/") || val.startsWith("icons/")) {
                        // Mark for copy
                        const decodedPath = decodeURIComponent(val); // Handle paths with %20
                        imagesToCopy.add(decodedPath);
                        // Update the path to point inside the module
                        obj[key] = `modules/${MODULE_ID}/${val}`;
                    } else if (val.includes('src="Wynther%27s%20Files/')) {
                        // HTML content might contain image tags
                        // e.g., <img src="Wynther%27s%20Files/..." />
                        obj[key] = val.replace(/src="(Wynther(?:%27s|')\s*(?:%20| )Files\/[^"]+)"/g, (match, p1) => {
                            imagesToCopy.add(decodeURIComponent(p1));
                            return `src="modules/${MODULE_ID}/${p1}"`;
                        });
                    }
                } else if (typeof obj[key] === 'object') {
                    processItemPaths(obj[key]);
                }
            }
        };

        let processedAny = false;
        if (data.items) {
            let unknownCount = 0;
            for (const item of data.items) {
                processItemPaths(item);
                const itemId = item._id || `unknown_id_${unknownCount++}`;
                await fs.writeFile(path.join(srcDir, `${itemId}.json`), JSON.stringify(item, null, 2));
            }
            processedAny = true;
        }

        if (processedAny) {
            console.log(`Extracted items to ${srcDir}. Compiling pack...`);
            await compilePack(srcDir, outDir, { yaml: false, nedb: false, recursive: false });
            await fs.rm(srcDir, { recursive: true, force: true });

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
    const module_json = {
        id: MODULE_ID,
        title: MODULE_TITLE,
        version: "1.0.0",
        compatibility: {
            minimum: 11,
            verified: 13
        },
        authors: [{ name: "Tiziano Di Gennaro" }],
        description: "Italian translation packs for Historia (Standalone with media).",
        manifest: "https://raw.githubusercontent.com/digennarot/historia-it/main/module.json",
        download: "https://github.com/digennarot/historia-it/releases/latest/download/historia-it.zip",
        packs: packs
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
}

main().catch(console.error);
