import json
import os
import glob
import subprocess

MODULE_ID = "historia-it"
MODULE_TITLE = "Historia (Italiano)"
MODULE_VERSION = "1.0.0"
COMPATIBILITY = {
    "minimum": 11,
    "verified": 13
}

print("Installing foundryvtt-cli locally if missing...")
import shutil
fvtt_path = os.path.join("node_modules", ".bin", "fvtt")

if not os.path.exists(fvtt_path) and not shutil.which("fvtt"):
    subprocess.run(["npm", "install", "--no-save", "@foundryvtt/foundryvtt-cli"], check=True)
    print("Configuring fvtt-cli datapath...")
    subprocess.run(["npx", "--no-install", "fvtt", "configure", "set", "dataPath", "./"], check=True)
else:
    print("foundryvtt-cli already installed.")

os.makedirs("src/packs", exist_ok=True)
os.makedirs("packs", exist_ok=True)

packs = []

files = glob.glob("*_it.json")

for filepath in files:
    if not filepath.startswith("fvtt-"):
        continue
        
    print(f"Processing {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            print(f"Error reading JSON from {filepath}")
            continue
    
    meta = data.get("metadata", {})
    orig_name = meta.get("name", "unknown")
    if orig_name == "unknown":
        # Try to extract from filename, e.g., fvtt-Item-pack-dnd5e-spells_it.json
        parts = filepath.replace("fvtt-", "").replace("_it.json", "").split("-pack-dnd5e-")
        if len(parts) > 1:
            orig_name = parts[1]
        else:
            orig_name = "unknown-pack"
            
    if orig_name.endswith("-it") or orig_name.endswith("_it"):
        pack_name = orig_name.replace("_", "-")
    else:
        pack_name = f"{orig_name}-it"
        
    pack_label = meta.get("label", orig_name.replace('-', ' ').title())
    if "IT" not in pack_label and "it" not in pack_label.lower():
        pack_label = f"{pack_label} IT"
        
    pack_type = meta.get("type", data.get("type", "Item"))
    
    src_dir = os.path.join("src", "packs", pack_name)
    os.makedirs(src_dir, exist_ok=True)
    
    items = data.get("items", [])
    
    missing_id_count = 0
    for item in items:
        item_id = item.get("_id")
        if not item_id:
            item_id = f"unknown_id_{missing_id_count}"
            missing_id_count += 1  # type: ignore
            
        out_path = os.path.join(src_dir, f"{item_id}.json")
        with open(out_path, 'w', encoding='utf-8') as out_f:
            json.dump(item, out_f, indent=2, ensure_ascii=False)
            
    print(f"Extracted {len(items)} items to {src_dir}")
    
    out_dir = os.path.join("packs", pack_name)
    packs.append({
        "name": pack_name,
        "label": pack_label,
        "path": out_dir.replace("\\", "/"),
        "type": pack_type,
        "system": "dnd5e"
    })

# Write module.json before packing, because fvtt-cli uses it to detect package type
module_json = {
    "id": MODULE_ID,
    "title": MODULE_TITLE,
    "version": MODULE_VERSION,
    "compatibility": COMPATIBILITY,
    "authors": [{"name": "Tiziano Di Gennaro"}],
    "description": "Italian translation packs for Historia.",
    "packs": packs
}

with open("module.json", "w", encoding='utf-8') as f:
    json.dump(module_json, f, indent=2, ensure_ascii=False)

print("Generated module.json")

# Now pack using the fvtt cli
for pack in packs:
    src_dir = os.path.join("src", "packs", pack["name"])
    out_dir = pack["path"]
    print(f"Packing {src_dir} to {out_dir}")
    # Specify --type Module if possible, but fvtt should detect module.json
    subprocess.run(["npx", "--no-install", "fvtt", "package", "pack", src_dir, out_dir, "--id", "historia-it", "--type", "Module"], check=True)
