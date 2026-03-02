import fs from 'fs';
import path from 'path';

const KEY_MAPPINGS = {
    // Top-level properties array replacements
    "Verbale": "vocal",
    "Somatica": "somatic",
    "Materiale": "material",
    "Concentrazione": "concentration",
    "Rituale": "ritual",

    // Activity object keys replacements
    "a gittata": "range",

    // Weapon/item properties array replacements
    "Accurata": "fin",
    "Lancio": "thr",
    "Pesante": "hvy",
    "Leggera": "lgt",
    "Due mani": "two",
    "Versatile": "ver",
    "Ricarica": "rel", // Reload
    "Munizioni": "amm", // Ammunition
    // standard dnd5e weapon properties: "amm", "fin", "hvy", "lgt", "ld", "rch", "spc", "thr", "two", "ver"
};

function deepReplaceKeysAndProps(obj) {
    if (Array.isArray(obj)) {
        return obj.map(item => {
            if (typeof item === 'string' && KEY_MAPPINGS[item]) {
                return KEY_MAPPINGS[item];
            }
            return deepReplaceKeysAndProps(item);
        });
    } else if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const [key, value] of Object.entries(obj)) {
            const newKey = KEY_MAPPINGS[key] || key;

            // Special fix for duration.Concentrazione
            if (key === 'duration' && value?.['Concentrazione'] !== undefined) {
                value['concentration'] = value['Concentrazione'];
                delete value['Concentrazione'];
            }

            newObj[newKey] = deepReplaceKeysAndProps(value);
        }
        return newObj;
    }
    return obj;
}

const files = fs.readdirSync('.').filter(f => f.startsWith('fvtt-') && f.endsWith('_it.json'));
let updatedFiles = 0;

for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const items = data.items || data.pages || [];
    let changed = false;

    if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            const oldSystemStr = JSON.stringify(items[i].system);
            items[i].system = deepReplaceKeysAndProps(items[i].system);
            if (JSON.stringify(items[i].system) !== oldSystemStr) {
                changed = true;
            }

            // Fix "Preparato" to proper dnd5e `preparation` property format
            if (items[i].system && items[i].system["Preparato"] !== undefined) {
                const prepVal = items[i].system["Preparato"];
                // Usually 2 = always prepared, 1 = prepared, 0 = unprepared.
                let mode = "prepared";
                let isPrepared = false;
                if (prepVal === 2) { mode = "always"; isPrepared = true; }
                if (prepVal === 1) { mode = "prepared"; isPrepared = true; }

                items[i].system["preparation"] = { "mode": mode, "prepared": isPrepared };
                delete items[i].system["Preparato"];
                changed = true;
            }
        }
    }

    // Fallback for files that just contain one root item
    if (!data.items && !data.pages && data.system) {
        const oldSystemStr = JSON.stringify(data.system);
        data.system = deepReplaceKeysAndProps(data.system);
        if (JSON.stringify(data.system) !== oldSystemStr) {
            changed = true;
        }
        if (data.system && data.system["Preparato"] !== undefined) {
            const prepVal = data.system["Preparato"];
            let mode = "prepared";
            let isPrepared = false;
            if (prepVal === 2) { mode = "always"; isPrepared = true; }
            if (prepVal === 1) { mode = "prepared"; isPrepared = true; }

            data.system["preparation"] = { "mode": mode, "prepared": isPrepared };
            delete data.system["Preparato"];
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Updated ${file}`);
        updatedFiles++;
    }
}

console.log(`Migration complete. Updated ${updatedFiles} files.`);
