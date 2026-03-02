import json
import glob
import os

properties_set = set()
unrecognized_keys_system = set()
unrecognized_keys_activity = set()

EXPECTED_SYSTEM_KEYS = {
    "description", "source", "quantity", "weight", "price", "attunement",
    "equipped", "rarity", "identified", "ability", "chatFlavor", "proficient",
    "bonus", "unidentified", "type", "container", "attuned", "uses", "properties",
    "activities", "identifier", "activation", "duration", "target", "range",
    "level", "school", "materials", "preparation", "damage", "save", "actionType",
    "chatFlavor", "critical", "attack", "formula", "capacity", "currency",
    "details", "traits", "skills", "spells", "attributes", "attributes", "hp",
    "ac", "movement", "senses", "armor", "weapon", "tool", "vehicle", "consumable",
    "equipment", "loot", "class", "subclass", "feat", "background", "race",
    "spell", "feature", "backpack", "advance", "advancement", "hitDice",
    "hitPoints", "cover", "creatureType", "stealth", "magicalBonus", "armorClass"
}

EXPECTED_ACTIVITY_KEYS = {
    "_id", "type", "activation", "consumption", "description", "duration",
    "effects", "range", "target", "uses", "damage", "save", "check", "heal",
    "attack", "sort", "flags", "visibility", "roll", "enchant", "summon", "transform",
    "macro", "name", "img", "appliedEffects"
}

for filepath in glob.glob("fvtt-*_it.json"):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    items = data.get("items", data.get("pages", []))
    for item in items:
        system = item.get("system", {})
        
        # Check system properties
        if "properties" in system:
            props = system["properties"]
            if isinstance(props, list):
                for p in props:
                    properties_set.add(p)
            elif isinstance(props, dict):
                for k, v in props.items():
                    if v:
                        properties_set.add(k)
                        
        # Check system keys
        for k in system.keys():
            if k not in EXPECTED_SYSTEM_KEYS:
                unrecognized_keys_system.add(k)
                
        # Check activity keys
        activities = system.get("activities", {})
        if isinstance(activities, dict):
            for act_id, act in activities.items():
                for k in act.keys():
                    if k not in EXPECTED_ACTIVITY_KEYS:
                        unrecognized_keys_activity.add(k)
                # Check duration inside activity
                dur = act.get("duration", {})
                if isinstance(dur, dict):
                    for k in dur.keys():
                        if k not in {"value", "units", "special", "concentration", "override"}:
                            unrecognized_keys_activity.add(f"duration.{k}")

print("Properties found:", sorted(list(properties_set)))
print("Unrecognized System Keys:", sorted(list(unrecognized_keys_system)))
print("Unrecognized Activity Keys:", sorted(list(unrecognized_keys_activity)))
