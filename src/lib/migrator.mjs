export class Migrator {
    constructor(options = {}) {
        this.mappings = options.mappings || {};
    }

    migrate(data) {
        if (!data || typeof data !== 'object') return data;

        const result = JSON.parse(JSON.stringify(data)); // Deep copy

        if (result.system) {
            result.system = this.deepReplace(result.system);

            // Special fix for Preparato
            if (result.system.Preparato !== undefined) {
                const val = result.system.Preparato;
                let mode = 'prepared';
                let isPrepared = false;
                if (val === 2) { mode = 'always'; isPrepared = true; }
                if (val === 1) { mode = 'prepared'; isPrepared = true; }

                result.system.preparation = { mode, prepared: isPrepared };
                delete result.system.Preparato;
            }
        }

        return result;
    }

    deepReplace(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => {
                if (typeof item === 'string' && this.mappings[item]) {
                    return this.mappings[item];
                }
                return this.deepReplace(item);
            });
        } else if (obj !== null && typeof obj === 'object') {
            const newObj = {};
            for (const [key, value] of Object.entries(obj)) {
                const newKey = this.mappings[key] || key;
                newObj[newKey] = this.deepReplace(value);
            }
            return newObj;
        }
        return obj;
    }
}
