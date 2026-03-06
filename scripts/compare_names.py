import os
import json

def get_json_files(directory):
    files = []
    for root, _, filenames in os.walk(directory):
        for f in filenames:
            if f.endswith('.json'):
                files.append(os.path.join(root, f))
    return files

def main():
    base_dir = "./src/packs"
    
    # dizionari: _id -> name
    en_names = {}
    it_names = {}
    
    for root, dirs, filenames in os.walk(base_dir):
        is_it = "-it" in root or "_it" in root
        for f in filenames:
            if f.endswith('.json'):
                path = os.path.join(root, f)
                try:
                    with open(path, 'r', encoding='utf-8') as file:
                        data = json.load(file)
                        item_id = data.get('_id')
                        name = data.get('name')
                        if item_id and name:
                            if is_it:
                                it_names[item_id] = name
                            else:
                                en_names[item_id] = name
                except Exception as e:
                    pass

    # Compare
    for item_id, en_name in en_names.items():
        if item_id in it_names:
            it_name = it_names[item_id]
            print(f"{en_name} ===> {it_name}")

if __name__ == "__main__":
    main()
