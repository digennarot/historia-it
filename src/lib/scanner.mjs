export class Scanner {
    constructor(options = {}) {
        this.expectedSystemKeys = new Set(options.expectedSystemKeys || []);
        this.expectedActivityKeys = new Set(options.expectedActivityKeys || []);
    }

    analyzeItem(item) {
        const results = {
            unrecognizedSystemKeys: [],
            unrecognizedActivityKeys: []
        };

        const system = item.system || {};

        // System keys
        Object.keys(system).forEach(k => {
            if (!this.expectedSystemKeys.has(k)) {
                results.unrecognizedSystemKeys.push(k);
            }
        });

        // Activity keys
        if (system.activities && typeof system.activities === 'object') {
            Object.values(system.activities).forEach(act => {
                Object.keys(act).forEach(k => {
                    if (!this.expectedActivityKeys.has(k)) {
                        results.unrecognizedActivityKeys.push(k);
                    }
                });
            });
        }

        return results;
    }
}
