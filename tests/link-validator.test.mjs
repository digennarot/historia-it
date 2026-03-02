import { describe, it, expect } from 'vitest';
import { LinkValidator } from '../src/lib/link-validator.mjs';

describe('LinkValidator', () => {
    const mockPackIndex = {
        'species-features-it': new Set(['CsKP3pQcELPkECkY', 'QUIFEZIbaMlweTHY']),
        'spells-it': new Set(['9OyrjyzPzlVTwBNl'])
    };

    it('should identify valid compendium links in text', () => {
        const validator = new LinkValidator({ packIndex: mockPackIndex });
        const text = 'Check out @Compendium[historia-it.species-features-it.CsKP3pQcELPkECkY]{Nose}';
        const results = validator.validateText(text);

        expect(results.valid).toContain('historia-it.species-features-it.CsKP3pQcELPkECkY');
        expect(results.broken).toHaveLength(0);
    });

    it('should identify broken compendium links', () => {
        const validator = new LinkValidator({ packIndex: mockPackIndex });
        const text = 'Broken: @Compendium[historia-it.spells-it.NONEXISTENT]{Fail}';
        const results = validator.validateText(text);

        expect(results.broken).toContain('historia-it.spells-it.NONEXISTENT');
    });

    it('should identify valid uuid links in advancements', () => {
        const validator = new LinkValidator({ packIndex: mockPackIndex });
        const item = {
            system: {
                advancement: [
                    {
                        configuration: {
                            items: [{ uuid: 'Compendium.historia-it.species-features-it.Item.QUIFEZIbaMlweTHY' }]
                        }
                    }
                ]
            }
        };
        const results = validator.validateItem(item);
        expect(results.valid).toContain('Compendium.historia-it.species-features-it.Item.QUIFEZIbaMlweTHY');
        expect(results.broken).toHaveLength(0);
    });

    it('should identify broken uuid links in advancements', () => {
        const validator = new LinkValidator({ packIndex: mockPackIndex });
        const item = {
            system: {
                advancement: [
                    {
                        configuration: {
                            items: [{ uuid: 'Compendium.historia-it.spells-it.Item.BROKEN' }]
                        }
                    }
                ]
            }
        };
        const results = validator.validateItem(item);
        expect(results.broken).toContain('Compendium.historia-it.spells-it.Item.BROKEN');
    });

    it('should identify valid image paths', () => {
        const validator = new LinkValidator({
            assetPaths: new Set(['assets/icons/test.webp'])
        });
        const item = { img: 'assets/icons/test.webp' };
        const results = validator.validateItem(item);
        expect(results.valid).toContain('assets/icons/test.webp');
        expect(results.broken).toHaveLength(0);
    });

    it('should identify broken image paths', () => {
        const validator = new LinkValidator({
            assetPaths: new Set(['assets/icons/test.webp'])
        });
        const item = { img: 'assets/icons/broken.webp' };
        const results = validator.validateItem(item);
        expect(results.broken).toContain('assets/icons/broken.webp');
    });

    it('should identify image paths in HTML descriptions', () => {
        const validator = new LinkValidator({
            assetPaths: new Set(['assets/historia/img.png'])
        });
        const item = {
            system: {
                description: {
                    value: '<img src="assets/historia/img.png"> <img src="broken.png">'
                }
            }
        };
        const results = validator.validateItem(item);
        expect(results.valid).toContain('assets/historia/img.png');
        expect(results.broken).toContain('broken.png');
    });
});
