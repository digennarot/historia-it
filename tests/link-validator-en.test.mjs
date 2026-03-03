import { describe, it, expect } from 'vitest';
import { LinkValidator } from '../src/lib/link-validator.mjs';

describe('LinkValidator (English)', () => {
    const mockPackIndex = {
        'species-features': new Set(['CsKP3pQcELPkECkY', 'QUIFEZIbaMlweTHY']),
        'spells': new Set(['9OyrjyzPzlVTwBNl'])
    };

    it('should identify valid English compendium links in text', () => {
        const validator = new LinkValidator({ packIndex: mockPackIndex });
        const text = 'Check out @Compendium[historia-en.species-features.CsKP3pQcELPkECkY]{Nose}';
        const results = validator.validateText(text);

        expect(results.valid).toContain('historia-en.species-features.CsKP3pQcELPkECkY');
        expect(results.broken).toHaveLength(0);
    });

    it('should identify broken English compendium links', () => {
        const validator = new LinkValidator({ packIndex: mockPackIndex });
        const text = 'Broken: @Compendium[historia-en.spells.NONEXISTENT]{Fail}';
        const results = validator.validateText(text);

        expect(results.broken).toContain('historia-en.spells.NONEXISTENT');
    });

    it('should identify valid English uuid links in advancements', () => {
        const validator = new LinkValidator({ packIndex: mockPackIndex });
        const item = {
            system: {
                advancement: [
                    {
                        configuration: {
                            items: [{ uuid: 'Compendium.historia-en.species-features.Item.QUIFEZIbaMlweTHY' }]
                        }
                    }
                ]
            }
        };
        const results = validator.validateItem(item);
        expect(results.valid).toContain('Compendium.historia-en.species-features.Item.QUIFEZIbaMlweTHY');
        expect(results.broken).toHaveLength(0);
    });

    it('should identify broken English uuid links in advancements', () => {
        const validator = new LinkValidator({ packIndex: mockPackIndex });
        const item = {
            system: {
                advancement: [
                    {
                        configuration: {
                            items: [{ uuid: 'Compendium.historia-en.spells.Item.BROKEN' }]
                        }
                    }
                ]
            }
        };
        const results = validator.validateItem(item);
        expect(results.broken).toContain('Compendium.historia-en.spells.Item.BROKEN');
    });
});
