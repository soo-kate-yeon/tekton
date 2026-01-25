import { describe, it, expect } from 'vitest';
import { TokenGenerator, generateComponentPresets, oklchToRgb, hexToOklch, } from '../src';
describe('Integration Tests - TASK-021', () => {
    describe('End-to-end token generation', () => {
        it('should generate complete design system from base colors', () => {
            const generator = new TokenGenerator();
            const palette = {
                primary: { l: 0.5, c: 0.15, h: 220 },
                secondary: { l: 0.6, c: 0.12, h: 180 },
                accent: { l: 0.55, c: 0.14, h: 340 },
            };
            const tokens = generator.generateTokens(palette);
            expect(tokens).toHaveLength(3);
            tokens.forEach((token) => {
                expect(token.id).toBeDefined();
                expect(token.name).toBeDefined();
                expect(token.value).toBeDefined();
                expect(token.scale).toBeDefined();
                expect(Object.keys(token.scale)).toHaveLength(11);
            });
        });
        it('should export tokens to all formats', () => {
            const generator = new TokenGenerator();
            const palette = { primary: { l: 0.5, c: 0.15, h: 220 } };
            const css = generator.exportTokens(palette, 'css');
            const json = generator.exportTokens(palette, 'json');
            const js = generator.exportTokens(palette, 'js');
            const ts = generator.exportTokens(palette, 'ts');
            expect(css).toContain(':root');
            expect(() => JSON.parse(json)).not.toThrow();
            expect(js).toContain('export');
            expect(ts).toContain('as const');
        });
        it('should generate component presets with WCAG compliance', () => {
            const baseColor = { l: 0.5, c: 0.15, h: 220 };
            const presets = generateComponentPresets(baseColor);
            expect(presets).toHaveLength(8);
            presets.forEach((preset) => {
                expect(preset.name).toBeDefined();
                expect(preset.states).toBeDefined();
                expect(Object.keys(preset.states).length).toBeGreaterThan(0);
            });
        });
        it('should maintain color integrity through conversions', () => {
            const original = { l: 0.6, c: 0.12, h: 180 };
            const rgb = oklchToRgb(original);
            expect(rgb.r).toBeGreaterThanOrEqual(0);
            expect(rgb.r).toBeLessThanOrEqual(255);
            expect(rgb.g).toBeGreaterThanOrEqual(0);
            expect(rgb.g).toBeLessThanOrEqual(255);
            expect(rgb.b).toBeGreaterThanOrEqual(0);
            expect(rgb.b).toBeLessThanOrEqual(255);
        });
        it('should handle hex color inputs', () => {
            const hex = '#3B82F6'; // Blue
            const oklch = hexToOklch(hex);
            expect(oklch.l).toBeGreaterThan(0);
            expect(oklch.l).toBeLessThan(1);
            expect(oklch.c).toBeGreaterThanOrEqual(0);
            expect(oklch.h).toBeGreaterThanOrEqual(0);
            expect(oklch.h).toBeLessThan(360);
        });
    });
    describe('Dark mode integration', () => {
        it('should generate dark mode variants', () => {
            const generator = new TokenGenerator({ generateDarkMode: true });
            const tokens = generator.generateTokens({
                primary: { l: 0.5, c: 0.15, h: 220 },
            });
            expect(tokens.length).toBeGreaterThanOrEqual(2);
            const darkToken = tokens.find((t) => t.name.includes('dark'));
            expect(darkToken).toBeDefined();
        });
    });
    describe('Caching integration', () => {
        it('should use cache for repeated generations', () => {
            const generator = new TokenGenerator();
            const palette = { primary: { l: 0.5, c: 0.15, h: 220 } };
            const tokens1 = generator.generateTokens(palette);
            const tokens2 = generator.generateTokens(palette);
            expect(tokens1[0].id).toBe(tokens2[0].id);
        });
        it('should clear cache when requested', () => {
            const generator = new TokenGenerator();
            const palette = { primary: { l: 0.5, c: 0.15, h: 220 } };
            generator.generateTokens(palette);
            generator.clearCache();
            const tokens = generator.generateTokens(palette);
            expect(tokens).toHaveLength(1);
        });
    });
    describe('Error handling integration', () => {
        it('should handle invalid OKLCH values gracefully', () => {
            const generator = new TokenGenerator();
            expect(() => {
                generator.generateTokens({
                    invalid: { l: 2, c: 0.15, h: 220 },
                });
            }).toThrow();
        });
        it('should handle empty palette', () => {
            const generator = new TokenGenerator();
            const tokens = generator.generateTokens({});
            expect(tokens).toHaveLength(0);
        });
    });
    describe('Full workflow integration', () => {
        it('should complete full design system generation workflow', () => {
            // Step 1: Create generator
            const generator = new TokenGenerator({
                generateDarkMode: true,
                validateWCAG: true,
                wcagLevel: 'AA',
            });
            // Step 2: Define palette
            const palette = {
                primary: { l: 0.5, c: 0.15, h: 220 },
                secondary: { l: 0.6, c: 0.12, h: 180 },
            };
            // Step 3: Generate tokens
            const tokens = generator.generateTokens(palette);
            expect(tokens.length).toBeGreaterThan(0);
            // Step 4: Export to CSS
            const css = generator.exportTokens(palette, 'css');
            expect(css).toContain('--primary');
            expect(css).toContain('--secondary');
            // Step 5: Generate component presets
            const presets = generateComponentPresets(palette.primary);
            expect(presets).toHaveLength(8);
            // Step 6: Verify WCAG compliance
            presets.forEach((preset) => {
                if (preset.accessibility) {
                    preset.accessibility.forEach((check) => {
                        expect(check.wcagLevel).toBe('AA');
                    });
                }
            });
        });
    });
});
//# sourceMappingURL=integration.test.js.map