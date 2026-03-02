import { describe, it, expect } from 'vitest';
import { Migrator } from '../src/lib/migrator.mjs';

describe('Migrator', () => {
    it('should replace keys based on mapping', () => {
        const migrator = new Migrator({
            mappings: { 'oldKey': 'newKey' }
        });

        const data = { system: { oldKey: 'value' } };
        const result = migrator.migrate(data);

        expect(result.system.newKey).toBe('value');
        expect(result.system.oldKey).toBeUndefined();
    });

    it('should fix "Preparato" to "preparation" object', () => {
        const migrator = new Migrator({});
        const data = { system: { Preparato: 1 } };
        const result = migrator.migrate(data);

        expect(result.system.preparation.mode).toBe('prepared');
        expect(result.system.preparation.prepared).toBe(true);
        expect(result.system.Preparato).toBeUndefined();
    });

    it('should fix "Preparato" value 2 to "always"', () => {
        const migrator = new Migrator({});
        const data = { system: { Preparato: 2 } };
        const result = migrator.migrate(data);

        expect(result.system.preparation.mode).toBe('always');
        expect(result.system.preparation.prepared).toBe(true);
    });
});
