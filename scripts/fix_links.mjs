import fs from 'fs/promises';
import path from 'path';

const ROOT_DIR = process.cwd();
const PACKS_DIR = path.join(ROOT_DIR, 'src', 'packs');
const ASSETS_DIR = path.join(ROOT_DIR, 'src', 'assets');
const MEDIA_DIR = path.join(ROOT_DIR, 'src', 'media');

async function fileExists(p) {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

async function resolvePath(originalPath) {
    if (!originalPath || typeof originalPath !== 'string') return originalPath;

    let cleanPath = originalPath;
    try {
        cleanPath = decodeURIComponent(originalPath);
    } catch (e) { }

    // Strip legacy prefixes
    cleanPath = cleanPath.replace(/^modules\/Historia\//, '');
    cleanPath = cleanPath.replace(/^Wynther's Files\/Historia\//, '');
    cleanPath = cleanPath.replace(/^Wynther's Files\//, '');

    const foldersToTryToPrependMedia = [
        'Species/', 'Factions/', 'Ventures/', 'Weapons/', 'Professions/', 'Profession Features/', 'Species Features/'
    ];

    // 1. Try as-is in src/ (if it already has assets/ or media/)
    if (await fileExists(path.join(ROOT_DIR, 'src', cleanPath))) {
        return cleanPath;
    }

    // 2. Try in src/media/
    if (await fileExists(path.join(MEDIA_DIR, cleanPath))) {
        return path.join('media', cleanPath).replace(/\\/g, '/');
    }

    // 3. Try prepending folder name to src/media/ if it matches one of the known folders
    for (const folder of foldersToTryToPrependMedia) {
        if (cleanPath.startsWith(folder)) {
            // Already starts with folder, but maybe not in media/
            // Handled by step 2
        } else {
            // This might be a naked filename that belongs in a folder? 
            // Difficult to guess without more context, skipping for now.
        }
    }

    // 4. Try in src/assets/icons/
    if (await fileExists(path.join(ASSETS_DIR, 'icons', cleanPath))) {
        return path.join('icons', cleanPath).replace(/\\/g, '/');
    }

    // 5. Try in src/assets/historia/
    if (await fileExists(path.join(ASSETS_DIR, 'historia', cleanPath))) {
        return path.join('assets/historia', cleanPath).replace(/\\/g, '/');
    }

    return originalPath; // Return original if no fix found
}

async function fixItem(item) {
    let changed = false;

    // Fix img
    if (item.img) {
        const newImg = await resolvePath(item.img);
        if (newImg !== item.img) {
            item.img = newImg;
            changed = true;
        }
    }

    // Fix description
    if (item.system?.description?.value) {
        let val = item.system.description.value;
        const imgRegex = /src="([^"]+)"/g;
        let match;
        let newVal = val;
        while ((match = imgRegex.exec(val)) !== null) {
            const originalPath = match[1];
            const resolved = await resolvePath(originalPath);
            if (resolved && resolved !== originalPath) {
                newVal = newVal.replace(originalPath, resolved);
                changed = true;
            }
        }

        // Fix Compendium links
        // dnd5e.spells.Bnn9Nzajixvow9xi -> Compendium.dnd5e.spells.Item.Bnn9Nzajixvow9xi
        const compendiumRegex = /@Compendium\[dnd5e\.(spells|monsters|items|rules|backgrounds|classes|subclasses|feats|races|subraces)\.([a-zA-Z0-9]+)\]/g;
        newVal = newVal.replace(compendiumRegex, (match, p1, p2) => {
            changed = true;
            return `@Compendium[dnd5e.${p1}.Item.${p2}]`;
        });

        if (changed) {
            item.system.description.value = newVal;
        }
    }

    // Fix advancement UUIDs
    if (item.system?.advancement) {
        for (const adv of item.system.advancement) {
            if (adv.configuration?.items) {
                for (const entry of adv.configuration.items) {
                    if (entry.uuid && entry.uuid.startsWith('Compendium.historia-it.')) {
                        // Ensure it has .Item.
                        if (!entry.uuid.includes('.Item.')) {
                            entry.uuid = entry.uuid.replace(/Compendium\.historia-it\.([a-z-]+)\.([a-zA-Z0-9]+)/, 'Compendium.historia-it.$1.Item.$2');
                            changed = true;
                        }
                    }
                }
            }
        }
    }

    return changed;
}

async function walk(dir) {
    const files = await fs.readdir(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = await fs.stat(fullPath);
        if (stats.isDirectory()) {
            await walk(fullPath);
        } else if (file.endsWith('.json')) {
            const content = await fs.readFile(fullPath, 'utf-8');
            try {
                const data = JSON.parse(content);
                let changed = false;

                // Handle monolithic files with items/pages array
                if (data.items || data.pages) {
                    const list = data.items || data.pages || [];
                    for (const item of list) {
                        if (await fixItem(item)) changed = true;
                    }
                } else {
                    // Handle individual item/journal entry files
                    if (await fixItem(data)) changed = true;
                }

                if (changed) {
                    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf-8');
                    console.log(`Fixed: ${fullPath}`);
                }
            } catch (e) {
                console.error(`Error processing ${fullPath}: ${e.message}`);
            }
        }
    }
}

async function main() {
    console.log("Starting link fix process...");
    const TARGET_DIRS = [PACKS_DIR, path.join(ROOT_DIR, 'src', 'data')];
    for (const d of TARGET_DIRS) {
        if (await fileExists(d)) {
            await walk(d);
        }
    }
    console.log("Link fix process complete.");
}

main().catch(console.error);
