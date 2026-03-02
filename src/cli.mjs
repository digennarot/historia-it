import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { Scanner } from './lib/scanner.mjs';
import { Migrator } from './lib/migrator.mjs';
import { LinkValidator } from './lib/link-validator.mjs';

const program = new Command();

program
    .name('historia-cli')
    .description('Maintenance CLI for Historia VTT module')
    .version('1.0.0');

const EXPECTED_SYSTEM_KEYS = [
    "description", "source", "quantity", "weight", "price", "attunement",
    "equipped", "rarity", "identified", "ability", "chatFlavor", "proficient",
    "bonus", "unidentified", "type", "container", "attuned", "uses", "properties",
    "activities", "identifier", "activation", "duration", "target", "range",
    "level", "school", "materials", "preparation", "damage", "save", "actionType",
    "critical", "attack", "formula", "capacity", "currency",
    "details", "traits", "skills", "spells", "attributes", "hp",
    "ac", "movement", "senses", "armor", "weapon", "tool", "vehicle", "consumable",
    "equipment", "loot", "class", "subclass", "feat", "background", "race",
    "spell", "feature", "backpack", "advance", "advancement", "hitDice",
    "hitPoints", "cover", "creatureType", "stealth", "magicalBonus", "armorClass",
    "requirements", "crewed", "prerequisites", "enchant", "method", "startingEquipment",
    "ammunition", "crew", "speed", "strength", "classIdentifier", "spellcasting", "levels", "wealth", "hd", "primaryAbility"
];

const EXPECTED_ACTIVITY_KEYS = [
    "_id", "type", "activation", "consumption", "description", "duration",
    "effects", "range", "target", "uses", "damage", "save", "check", "heal",
    "attack", "sort", "flags", "visibility", "roll", "enchant", "summon", "transform",
    "macro", "name", "img", "appliedEffects"
];

const KEY_MAPPINGS = {
    "Verbale": "vocal", "Somatica": "somatic", "Materiale": "material",
    "Concentrazione": "concentration", "Rituale": "ritual",
    "a gittata": "range", "gittata": "range",
    "Accurata": "fin", "Lancio": "thr", "Pesante": "hvy",
    "Leggera": "lgt", "Due mani": "two", "Versatile": "ver",
    "Ricarica": "rel", "Munizioni": "amm"
};

program
    .command('analyze')
    .description('Scan JSON files for unrecognized schema keys')
    .option('-d, --dir <directory>', 'directory to scan', './src/packs')
    .action((options) => {
        const scanner = new Scanner({
            expectedSystemKeys: EXPECTED_SYSTEM_KEYS,
            expectedActivityKeys: EXPECTED_ACTIVITY_KEYS
        });

        const walk = (dir) => {
            if (!fs.existsSync(dir)) return;
            fs.readdirSync(dir).forEach(f => {
                let fullPath = path.join(dir, f);
                if (fs.statSync(fullPath).isDirectory()) {
                    walk(fullPath);
                } else if (f.endsWith('.json')) {
                    const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
                    const results = scanner.analyzeItem(data);
                    if (results.unrecognizedSystemKeys.length > 0 || results.unrecognizedActivityKeys.length > 0) {
                        console.log(`\nFile: ${fullPath}`);
                        if (results.unrecognizedSystemKeys.length > 0) {
                            console.log('  Unrecognized System Keys:', results.unrecognizedSystemKeys);
                        }
                        if (results.unrecognizedActivityKeys.length > 0) {
                            console.log('  Unrecognized Activity Keys:', results.unrecognizedActivityKeys);
                        }
                    }
                }
            });
        };
        walk(options.dir);
    });

program
    .command('migrate')
    .description('Migrate JSON files to fix schema issues')
    .option('-f, --file <file>', 'file to migrate')
    .option('-d, --dir <directory>', 'directory to migrate')
    .action((options) => {
        const migrator = new Migrator({ mappings: KEY_MAPPINGS });

        const processFile = (filePath) => {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const updated = migrator.migrate(data);
            if (JSON.stringify(data) !== JSON.stringify(updated)) {
                fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
                console.log(`Updated: ${filePath}`);
            }
        };

        if (options.file) {
            processFile(options.file);
        } else if (options.dir) {
            const walk = (dir) => {
                if (!fs.existsSync(dir)) return;
                fs.readdirSync(dir).forEach(f => {
                    let fullPath = path.join(dir, f);
                    if (fs.statSync(fullPath).isDirectory()) {
                        walk(fullPath);
                    } else if (f.endsWith('.json')) {
                        processFile(fullPath);
                    }
                });
            };
        }
    });

program
    .command('check-links')
    .description('Check for broken Compendium, UUID, and Image links')
    .option('-d, --dir <directory>', 'directory to scan', './src/packs')
    .action((options) => {
        const packIndex = {};
        const assetPaths = new Set();

        const walk = (dir, callback) => {
            if (!fs.existsSync(dir)) return;
            fs.readdirSync(dir).forEach(f => {
                let fullPath = path.join(dir, f);
                if (fs.statSync(fullPath).isDirectory()) {
                    walk(fullPath, callback);
                } else {
                    callback(fullPath);
                }
            });
        };

        // First pass: Index packs and assets
        console.log('Building index...');

        // Index assets
        const assetDirs = ['./src/assets', './src/media'];
        assetDirs.forEach(dir => {
            if (!fs.existsSync(dir)) return;
            walk(dir, (filePath) => {
                // Map to JSON-friendly paths (assets/..., media/...)
                const relative = path.relative('./src', filePath);
                assetPaths.add(relative);
            });
        });

        // Index packs
        walk(options.dir, (filePath) => {
            if (!filePath.endsWith('.json')) return;
            try {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                const parts = filePath.split(path.sep);
                const sourceIdx = parts.indexOf('_source');
                if (sourceIdx > 0) {
                    const packName = parts[sourceIdx - 1];
                    if (!packIndex[packName]) packIndex[packName] = new Set();
                    if (data._id) packIndex[packName].add(data._id);
                }
            } catch (e) {
                console.error(`Error indexing ${filePath}: ${e.message}`);
            }
        });

        const validator = new LinkValidator({ packIndex, assetPaths });

        // Second pass: Validate links
        console.log(`Validating links (Indexed ${assetPaths.size} assets)...`);
        walk(options.dir, (filePath) => {
            if (!filePath.endsWith('.json')) return;
            try {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                const results = validator.validateItem(data);

                if (results.broken.length > 0) {
                    console.log(`\nBroken links in ${filePath}:`);
                    results.broken.forEach(link => console.log(`  - ${link}`));
                }
            } catch (e) {
                console.error(`Error validating ${filePath}: ${e.message}`);
            }
        });

        console.log('\nValidation complete.');
    });

program.parse();
