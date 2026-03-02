import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def index_test():
    asset_dirs = [
        "factions-it", "professions-it", "species-it", "items-it",
        "factions-and-careers", "items-historia", "profession-features",
        "professions", "species-features", "species", "spells-historia",
        "ventures", "historia-factions"
    ]
    packs_root = os.path.join(ROOT_DIR, "historia-it", "packs")
    for d in asset_dirs:
        dir_path = os.path.join(packs_root, d)
        print(f"Checking {d}...")
        sys.stdout.flush()
        if os.path.exists(dir_path):
            files = os.listdir(dir_path)
            print(f"  Found {len(files)} items.")
            sys.stdout.flush()
        else:
            print(f"  {d} NOT FOUND.")
            sys.stdout.flush()

if __name__ == "__main__":
    index_test()
