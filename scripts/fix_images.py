import json
import os
import re
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMPENDIUM_DIR = os.path.join(ROOT_DIR, "src", "data")

# Index of all project webp files: slug -> path
LOCAL_ASSET_MAP = {}

def slugify(text):
    if not text: return ""
    return re.sub(r'[^a-z0-9]', '', text.lower())

def index_project_assets():
    # Primary asset locations
    # We prioritize subfolders that aren't 'modules' or 'src'
    asset_dirs = [
        "src/media", "src/assets", "src/assets/icons",
        "Factions", "Professions", "Profession Features", 
        "Species", "Species Features", "Ventures", "Weapons", "icons", "assets"
    ]
    # Also check inside modules/Historia/
    if os.path.exists(os.path.join(ROOT_DIR, "modules/Historia")):
        asset_dirs.append("modules/Historia")

    for d in asset_dirs:
        dir_path = os.path.join(ROOT_DIR, d)
        if not os.path.exists(dir_path): continue
        print(f"Indexing {d}...")
        sys.stdout.flush()
        for root, _, files in os.walk(dir_path):
            if ".git" in root: continue
            for f in files:
                if f.lower().endswith((".webp", ".png", ".jpg", ".jpeg")):
                    name = os.path.splitext(f)[0]
                    s = slugify(name)
                    rel_to_root = os.path.relpath(os.path.join(root, f), ROOT_DIR)
                    foundry_path = rel_to_root.replace("\\", "/").replace(" ", "%20")
                    
                    # Store with and without modules/Historia prefix if needed
                    # but the JSON wants modules/Historia/... usually
                    if s not in LOCAL_ASSET_MAP:
                        LOCAL_ASSET_MAP[s] = foundry_path

def find_english_file(it_fname):
    base = it_fname.replace("_it.json", "").replace("fvtt-Item-pack-dnd5e-", "").replace("fvtt-JournalEntry-pack-dnd5e-", "").replace("-it", "")
    for f in os.listdir(COMPENDIUM_DIR):
        if f.endswith("_it.json"): continue
        if not f.endswith(".json"): continue
        if base in f:
            return os.path.join(COMPENDIUM_DIR, f)
    return None

def fix_images():
    index_project_assets()
    print(f"Indexed {len(LOCAL_ASSET_MAP)} project assets.")
    sys.stdout.flush()
    
    if not os.path.exists(COMPENDIUM_DIR):
        print(f"Compendium directory not found: {COMPENDIUM_DIR}")
        return

    it_files = [f for f in os.listdir(COMPENDIUM_DIR) if f.endswith("_it.json") and "JournalEntry" not in f]
    
    for it_fname in it_files:
        en_path = find_english_file(it_fname)
        it_path = os.path.join(COMPENDIUM_DIR, it_fname)
        
        print(f"Processing {it_fname} (Ref: {os.path.basename(en_path) if en_path else 'None'})...")
        sys.stdout.flush()
        
        id_to_img = {}
        name_to_img = {}
        if en_path:
            try:
                with open(en_path, 'r', encoding='utf-8') as f:
                    en_data = json.load(f)
                    for item in en_data.get("items", []):
                        img = item.get("img", "")
                        # Store specific assets
                        if "modules/Historia" in img or "icons/" not in img:
                            ident = item.get("system", {}).get("identifier")
                            if ident: id_to_img[ident] = img
                            name_to_img[slugify(item["name"])] = img
            except Exception as e:
                print(f"  Warning: could not process English file: {e}")

        try:
            with open(it_path, 'r', encoding='utf-8') as f:
                it_data = json.load(f)
        except Exception as e:
            print(f"  Error loading {it_fname}: {e}")
            continue
        
        updated = 0
        for item in it_data.get("items", []):
            current_img = item.get("img", "")
            is_generic = "icons/" in current_img
            is_broken_translated = "da mischia" in current_img or "mestieri" in current_img
            
            if is_generic or is_broken_translated or not current_img:
                ident = item.get("system", {}).get("identifier")
                new_img = None
                
                if ident and ident in id_to_img:
                    new_img = id_to_img[ident]
                
                if not new_img and ident:
                    s_ident = slugify(ident)
                    prefixes = ["career", "faction", "species", "feat", "item"]
                    keys_to_try = [s_ident]
                    for p in prefixes:
                        if s_ident.startswith(p): keys_to_try.append(s_ident[len(p):])
                        if s_ident.endswith(p): keys_to_try.append(s_ident[:-len(p)])
                    for k in keys_to_try:
                        if k in LOCAL_ASSET_MAP:
                            new_img = LOCAL_ASSET_MAP[k]
                            break
                
                if not new_img:
                    clean_name = re.sub(r'^(career|carriera|faction|fazione|species|specie|feat|caratteristica|background|venture|spells|incantesimi|item):\s*', '', item["name"], flags=re.I)
                    s_name = slugify(clean_name)
                    if s_name in LOCAL_ASSET_MAP:
                        new_img = LOCAL_ASSET_MAP[s_name]
                    elif slugify(item["name"]) in name_to_img:
                        new_img = name_to_img[slugify(item["name"])]

                if new_img and new_img != current_img:
                    item["img"] = new_img
                    updated += 1
        
        if updated > 0:
            with open(it_path, 'w', encoding='utf-8') as f:
                json.dump(it_data, f, indent=2, ensure_ascii=False)
            print(f"  Updated {updated} items.")
            sys.stdout.flush()

if __name__ == "__main__":
    fix_images()
