const fs = require('fs');
const path = require('path');

const packsDir = path.join(__dirname, 'src', 'packs');

function getPacks() {
    return fs.readdirSync(packsDir).filter(f => f.endsWith('-it') && fs.statSync(path.join(packsDir, f)).isDirectory());
}

const itemCache = {};

// Function to get the item name from its pack and id
function getItemName(packName, itemId) {
    // If the pack name doesn't end with '-it', we should check the Italian pack instead!
    const targetPackName = packName.endsWith('-it') ? packName : `${packName}-it`;
    
    const key = `${targetPackName}.${itemId}`;
    if (itemCache[key]) return itemCache[key];

    const sourceDir = path.join(packsDir, targetPackName, '_source');
    if (fs.existsSync(sourceDir)) {
        const filePath = path.join(sourceDir, `${itemId}.json`);
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            itemCache[key] = data.name;
            return data.name;
        }
    }
    
    // Fallback: If not found in the translated pack, try the original packName if it's different.
    if (targetPackName !== packName) {
        const altSourceDir = path.join(packsDir, packName, '_source');
        if (fs.existsSync(altSourceDir)) {
            const altFilePath = path.join(altSourceDir, `${itemId}.json`);
            if (fs.existsSync(altFilePath)) {
                const data = JSON.parse(fs.readFileSync(altFilePath, 'utf8'));
                itemCache[key] = data.name; // cache the original name though
                return data.name;
            }
        }
    }
    
    return null;
}

function processPacks() {
    const itPacks = getPacks();
    let totalFixes = 0;

    for (const pack of itPacks) {
        const sourceDir = path.join(packsDir, pack, '_source');
        if (!fs.existsSync(sourceDir)) continue;

        const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.json'));
        
        for (const file of files) {
            const filePath = path.join(sourceDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;

            // Updated regex to catch @Compendium and @UUID formats just in case, but target specifically normal references
            const regex = /@(Compendium|UUID)\[(Compendium\.)?historia-it\.([a-zA-Z0-9_-]+)\.(Item\.)?([a-zA-Z0-9]+)\]\{([^}]+)\}/g;
            
            content = content.replace(regex, (match, prefix, optionalCompendium, targetPack, optionalItem, targetId, oldLabel) => {
                const targetName = getItemName(targetPack, targetId);
                // Also ignore names like "#12" or "foo" which sometimes could just be wrong references.
                if (targetName && targetName !== oldLabel) {
                    console.log(`Fixing [${file}]: '${oldLabel}' -> '${targetName}'`);
                    totalFixes++;
                    modified = true;
                    // Keep the same format layout but replace the label
                    return `@${prefix}[${optionalCompendium || ''}historia-it.${targetPack}.${optionalItem || ''}${targetId}]{${targetName}}`;
                }
                return match;
            });

            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
            }
        }
    }

    console.log(`Fixed ${totalFixes} compendium links.`);
}

processPacks();
