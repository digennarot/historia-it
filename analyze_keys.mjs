import fs from 'fs';
import path from 'path';

const EXPECTED_SYSTEM_KEYS = new Set([
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
    "hitPoints", "cover", "creatureType", "stealth", "magicalBonus", "armorClass"
]);

const EXPECTED_ACTIVITY_KEYS = new Set([
    "_id", "type", "activation", "consumption", "description", "duration",
    "effects", "range", "target", "uses", "damage", "save", "check", "heal",
    "attack", "sort", "flags", "visibility", "roll", "enchant", "summon", "transform",
    "macro", "name", "img", "appliedEffects"
]);

const propertiesSet = new Set();
const unrecognizedSystemKeys = new Set();
const unrecognizedActivityKeys = new Set();
const durationKeys = new Set();

const files = fs.readdirSync('.').filter(f => f.startsWith('fvtt-') && f.endsWith('_it.json'));

for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const items = data.items || data.pages || [];

    for (const item of items) {
        const system = item.system || {};

        // Check properties
        if (system.properties) {
            if (Array.isArray(system.properties)) {
                system.properties.forEach(p => propertiesSet.add(p));
            } else if (typeof system.properties === 'object') {
                Object.entries(system.properties).forEach(([k, v]) => {
                    if (v) propertiesSet.add(k);
                });
            }
        }

        // Check system keys
        Object.keys(system).forEach(k => {
            if (!EXPECTED_SYSTEM_KEYS.has(k)) unrecognizedSystemKeys.add(k);
        });

        // Check activity keys
        if (system.activities && typeof system.activities === 'object') {
            Object.values(system.activities).forEach(act => {
                Object.keys(act).forEach(k => {
                    if (!EXPECTED_ACTIVITY_KEYS.has(k)) unrecognizedActivityKeys.add(k);
                });

                if (act.duration && typeof act.duration === 'object') {
                    Object.keys(act.duration).forEach(k => {
                        durationKeys.add(k);
                    });
                }
            });
        }
    }
}

console.log("Properties found:", Array.from(propertiesSet).sort());
console.log("Unrecognized System Keys:", Array.from(unrecognizedSystemKeys).sort());
console.log("Unrecognized Activity Keys:", Array.from(unrecognizedActivityKeys).sort());
console.log("Activity Duration Keys:", Array.from(durationKeys).sort());
