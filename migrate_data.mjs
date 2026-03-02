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
    "gittata": "range",

    // Weapon/item properties array replacements
    "Accurata": "fin",
    "Lancio": "thr",
    "Pesante": "hvy",
    "Leggera": "lgt",
    "Due mani": "two",
    "Versatile": "ver",
    "Ricarica": "rel", // Reload
    "Munizioni": "amm", // Ammunition
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

function processFile(filePath) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let changed = false;

    // Handle monolithic fvtt-*_it.json files
    if (data.items || data.pages) {
        const list = data.items || data.pages || [];
        for (let i = 0; i < list.length; i++) {
            const oldStr = JSON.stringify(list[i].system);
            list[i].system = deepReplaceKeysAndProps(list[i].system);
            if (JSON.stringify(list[i].system) !== oldStr) {
                changed = true;
            }

            // Fix "Preparato"
            if (list[i].system && list[i].system["Preparato"] !== undefined) {
                const prepVal = list[i].system["Preparato"];
                let mode = "prepared";
                let isPrepared = false;
                if (prepVal === 2) { mode = "always"; isPrepared = true; }
                if (prepVal === 1) { mode = "prepared"; isPrepared = true; }
                list[i].system["preparation"] = { "mode": mode, "prepared": isPrepared };
                delete list[i].system["Preparato"];
                changed = true;
            }
        }
    }
    // Handle individual _source/*.json files
    else if (data.system) {
        const oldStr = JSON.stringify(data.system);
        data.system = deepReplaceKeysAndProps(data.system);
        if (JSON.stringify(data.system) !== oldStr) {
            changed = true;
        }

        // Fix "Preparato"
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
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Updated ${filePath}`);
        return true;
    }
    return false;
}

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const targetDirs = ['./src/data', './src/packs'];
let totalUpdated = 0;

targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        walk(dir, (filePath) => {
            if (filePath.endsWith('.json')) {
                if (processFile(filePath)) totalUpdated++;
            }
        });
    }
});

console.log(`Migration complete. Updated ${totalUpdated} files.`);
