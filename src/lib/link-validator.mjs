export class LinkValidator {
    constructor(options = {}) {
        this.packIndex = options.packIndex || {};
        this.assetPaths = options.assetPaths || new Set();
        // Regex for @Compendium[module.pack.id]{Label} or @Compendio[...]
        this.compendiumRegex = /@(Compendium|Compendio)\[([^\]]+)\]/g;
        // Regex for Compendium.module.pack.type.id
        this.uuidRegex = /Compendium\.([^.]+\.[^.]+\.[^.]+\.[^.]+)/g;
        // Regex for UUID[...] or UUUID[...]
        this.uuidBlockRegex = /@U?UUID\[([^\]]+)\]/g;
        // Regex for src="path" in HTML
        this.imageSrcRegex = /src=["']([^"']+)["']/g;
    }

    validateText(text) {
        const results = {
            valid: [],
            broken: []
        };

        if (typeof text !== 'string') return results;

        // Compendium links
        let match;
        while ((match = this.compendiumRegex.exec(text)) !== null) {
            const link = match[2];
            if (this.isLinkValid(link)) {
                results.valid.push(link);
            } else {
                results.broken.push(link);
            }
        }
        
        while ((match = this.uuidBlockRegex.exec(text)) !== null) {
            const link = match[1];
            if (link.startsWith('Compendium.')) {
                if (this.isUuidValid(link)) {
                    results.valid.push(link);
                } else {
                    results.broken.push(link);
                }
            }
        }

        // HTML Images
        while ((match = this.imageSrcRegex.exec(text)) !== null) {
            const path = match[1];
            if (this.isAssetValid(path)) {
                results.valid.push(path);
            } else {
                results.broken.push(path);
            }
        }

        return results;
    }

    validateItem(item) {
        const results = {
            valid: [],
            broken: []
        };

        // Check img field
        if (item.img) {
            if (this.isAssetValid(item.img)) {
                results.valid.push(item.img);
            } else {
                results.broken.push(item.img);
            }
        }

        // Check description
        if (item.system?.description?.value) {
            const textResults = this.validateText(item.system.description.value);
            results.valid.push(...textResults.valid);
            results.broken.push(...textResults.broken);
        }

        // Check advancements
        if (item.system?.advancement) {
            item.system.advancement.forEach(adv => {
                if (adv.configuration?.items) {
                    adv.configuration.items.forEach(i => {
                        if (i.uuid) {
                            if (this.isUuidValid(i.uuid)) {
                                results.valid.push(i.uuid);
                            } else {
                                results.broken.push(i.uuid);
                            }
                        }
                    });
                }
            });
        }

        return results;
    }

    isLinkValid(link) {
        const parts = link.split('.');
        if (parts.length < 2) return false;
        
        const moduleOrSystem = parts[0];
        // Ignore external systems or modules
        if (['dnd5e', 'core', 'combat-utility-belt', 'world'].includes(moduleOrSystem)) return true;

        if (parts.length < 3) return false;
        const [module, pack, id] = parts;
        return this.packIndex[pack]?.has(id) || false;
    }

    isUuidValid(uuid) {
        // Compendium.module.pack.type.id or Compendium.module.pack.id
        const parts = uuid.split('.');
        if (parts.length < 4) return false;
        
        const moduleOrSystem = parts[1];
        if (['dnd5e', 'core', 'combat-utility-belt', 'world'].includes(moduleOrSystem)) return true;

        const pack = parts[2];
        const id = parts[parts.length - 1]; // last part is ID
        return this.packIndex[pack]?.has(id) || false;
    }

    isAssetValid(path) {
        if (typeof path !== 'string') return false;
        // Skip web URLs
        if (path.startsWith('http') || path.startsWith('//')) return true;
        // Skip default Foundry icons
        if (path.startsWith('icons/')) return true;
        // Skip internal worlds paths
        if (path.startsWith('worlds/')) return true;
        
        // build_it.mjs maps paths like "modules/historia/" or "Wynther's Files/" to internal paths.
        // Let's emulate that mapping to check if the file exists locally
        const potentialMedia = [
            path,
            path.replace(/^\/?media\//, ""),
            path.replace(/^\/?assets\//, ""),
            path.replace(/^\/?icons\//, ""),
            path.replace(/^\/?modules\/historia\//, ""),
            path.replace(/^\/?modules\/historia-it\//, ""),
            path.replace("Wynther's Files/Historia/", "Wynther's Files/"),
            path.replace("Wynther's Files/Historia/", ""),
            path.replace("Wynther's Files/", ""),
            path.replace("Historia/", ""),
            path.replace("assets/", ""),
        ].filter(p => p && p.trim() !== '' && p !== '/' && p !== '.');
        
        for (const p of potentialMedia) {
            const decoded = decodeURIComponent(p);
            if (this.assetPaths.has(decoded)) return true;
            if (this.assetPaths.has(`media/${decoded}`)) return true;
            if (this.assetPaths.has(`assets/icons/${decoded}`)) return true;
            if (this.assetPaths.has(`assets/historia/${decoded}`)) return true;
            if (this.assetPaths.has(`media/${p}`)) return true;
            if (this.assetPaths.has(`assets/icons/historia/${decoded}`)) return true;
        }

        return false;
    }
}
