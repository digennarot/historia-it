import json
import os
import glob

def verify_icons(src_dir):
    search_pattern = os.path.join(src_dir, "packs", "**", "_source", "*.json")
    json_files = glob.glob(search_pattern, recursive=True)
    
    errors = []
    successes = 0
    
    for filepath in json_files:
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            img_path = data.get("img", "")
            if not img_path:
                continue
                
            if img_path.startswith("icons/"):
                if any(x in img_path for x in ["da mischia", "da tiro", "di utilità"]):
                     errors.append(f"Localized icon path: {img_path} in {filepath}")
                else:
                    successes += 1
                continue
            
            if img_path.startswith("assets/"):
                local_rel_path = img_path
                full_path = os.path.join(src_dir, local_rel_path)
                if not os.path.exists(full_path):
                    # Try removing src/ prefix if it exists in img_path for some reason
                    errors.append(f"Missing local asset: {img_path} in {filepath} (Expected: {full_path})")
                else:
                    successes += 1
                continue
                
            if img_path.startswith("modules/") or img_path.startswith("Wynther"):
                successes += 1
                continue
                
            errors.append(f"Invalid icon path prefix: {img_path} in {filepath}")
            
        except Exception as e:
            errors.append(f"Error reading {filepath}: {e}")
            
    return successes, errors

if __name__ == "__main__":
    base_dir = "/home/tiziano_di_gennaro/Scaricati/historia"
    src_folder = os.path.join(base_dir, "src")
    ok, errs = verify_icons(src_folder)
    print(f"Verification complete.")
    print(f"Valid icons: {ok}")
    print(f"Issues found: {len(errs)}")
    # Limit output to first 20 errors to avoid spam
    for e in errs[:20]:
        print(f"  - {e}")
    if len(errs) > 20:
        print(f"  - ... and {len(errs) - 20} more.")
