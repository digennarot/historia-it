import { describe, it, expect } from 'vitest';
import { Scanner } from '../src/lib/scanner.mjs';

describe('Scanner', () => {
    it('should identify unrecognized system keys', () => {
        const scanner = new Scanner({
            expectedSystemKeys: ['description', 'rarity'],
            expectedActivityKeys: []
        });

        const mockData = {
            system: {
                description: 'A sharp sword',
                rarity: 'common',
                unrecognizedKey: 'some value'
            }
        };

        const results = scanner.analyzeItem(mockData);
        expect(results.unrecognizedSystemKeys).toContain('unrecognizedKey');
        expect(results.unrecognizedSystemKeys).not.toContain('description');
    });

    it('should identify unrecognized activity keys', () => {
        const scanner = new Scanner({
            expectedSystemKeys: [],
            expectedActivityKeys: ['_id', 'type']
        });

        const mockData = {
            system: {
                activities: {
                    'act1': {
                        _id: 'act1',
                        type: 'attack',
                        weirdKey: 'value'
                    }
                }
            }
        };

        const results = scanner.analyzeItem(mockData);
        expect(results.unrecognizedActivityKeys).toContain('weirdKey');
        expect(results.unrecognizedActivityKeys).not.toContain('type');
    });
});
