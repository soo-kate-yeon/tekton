import { describe, it, expect } from 'vitest';
import { exportToCSS, exportToDTCG, exportToTailwind, } from '../src/generator/output';
describe('Output Format Exporters - TASK-005 to TASK-007', () => {
    const mockTokens = {
        background: { l: 0.98, c: 0.002, h: 0 },
        foreground: { l: 0.15, c: 0.002, h: 0 },
        primary: { l: 0.5, c: 0.15, h: 220 },
        secondary: { l: 0.5, c: 0.05, h: 220 },
        muted: { l: 0.95, c: 0.002, h: 0 },
        accent: { l: 0.65, c: 0.15, h: 220 },
        destructive: { l: 0.5, c: 0.18, h: 25 },
        border: { l: 0.88, c: 0.002, h: 0 },
        input: { l: 0.88, c: 0.002, h: 0 },
        ring: { l: 0.5, c: 0.15, h: 220 },
        card: { l: 0.98, c: 0.002, h: 0 },
        popover: { l: 0.98, c: 0.002, h: 0 },
    };
    const mockColorScales = {
        primary: {
            '50': { l: 0.98, c: 0.15, h: 220 },
            '500': { l: 0.5, c: 0.15, h: 220 },
            '900': { l: 0.15, c: 0.15, h: 220 },
        },
        neutral: {
            '50': { l: 0.98, c: 0.002, h: 0 },
            '500': { l: 0.5, c: 0.002, h: 0 },
            '900': { l: 0.15, c: 0.002, h: 0 },
        },
    };
    describe('CSS Variables Export - TASK-005 (EDR-002)', () => {
        it('should export semantic tokens as CSS variables', () => {
            const css = exportToCSS({
                semanticTokens: mockTokens,
                colorScales: {},
            });
            expect(css).toContain(':root {');
            expect(css).toContain('--background:');
            expect(css).toContain('--foreground:');
            expect(css).toContain('--primary:');
            expect(css).toContain('}');
        });
        it('should use oklch() format for CSS variables', () => {
            const css = exportToCSS({
                semanticTokens: mockTokens,
                colorScales: {},
            });
            expect(css).toMatch(/oklch\([^)]+\)/);
        });
        it('should include dark mode with .dark selector', () => {
            const darkTokens = {
                ...mockTokens,
                background: { l: 0.10, c: 0.002, h: 0 },
                foreground: { l: 0.98, c: 0.002, h: 0 },
            };
            const css = exportToCSS({
                semanticTokens: mockTokens,
                darkTokens,
                colorScales: {},
            });
            expect(css).toContain('.dark {');
            expect(css).toContain('--background:');
        });
        it('should export color scales when provided', () => {
            const css = exportToCSS({
                semanticTokens: mockTokens,
                colorScales: mockColorScales,
            });
            expect(css).toContain('--primary-50:');
            expect(css).toContain('--primary-500:');
            expect(css).toContain('--neutral-900:');
        });
        it('should validate generated CSS is parseable', () => {
            const css = exportToCSS({
                semanticTokens: mockTokens,
                colorScales: mockColorScales,
            });
            // Basic validation: should have balanced braces
            const openBraces = (css.match(/{/g) || []).length;
            const closeBraces = (css.match(/}/g) || []).length;
            expect(openBraces).toBe(closeBraces);
        });
        it('should format with proper indentation', () => {
            const css = exportToCSS({
                semanticTokens: mockTokens,
                colorScales: {},
            });
            // Should have indented properties
            expect(css).toMatch(/\n {2}--/);
        });
    });
    describe('DTCG JSON Export - TASK-006 (EDR-002)', () => {
        it('should export in Design Token Community Group format', () => {
            const json = exportToDTCG({
                semanticTokens: mockTokens,
                colorScales: {},
            });
            const parsed = JSON.parse(json);
            expect(parsed).toHaveProperty('background');
            expect(parsed.background).toHaveProperty('$type', 'color');
            expect(parsed.background).toHaveProperty('$value');
        });
        it('should include $type property for all tokens', () => {
            const json = exportToDTCG({
                semanticTokens: mockTokens,
                colorScales: {},
            });
            const parsed = JSON.parse(json);
            Object.keys(mockTokens).forEach((key) => {
                expect(parsed[key].$type).toBe('color');
            });
        });
        it('should use OKLCH format in $value', () => {
            const json = exportToDTCG({
                semanticTokens: mockTokens,
                colorScales: {},
            });
            const parsed = JSON.parse(json);
            expect(parsed.primary.$value).toMatch(/oklch\(/);
        });
        it('should include color scales as nested objects', () => {
            const json = exportToDTCG({
                semanticTokens: mockTokens,
                colorScales: mockColorScales,
            });
            const parsed = JSON.parse(json);
            expect(parsed.primary).toHaveProperty('50');
            expect(parsed.primary['50']).toHaveProperty('$type', 'color');
            expect(parsed.primary['50']).toHaveProperty('$value');
        });
        it('should support dark mode tokens', () => {
            const darkTokens = {
                ...mockTokens,
                background: { l: 0.10, c: 0.002, h: 0 },
            };
            const json = exportToDTCG({
                semanticTokens: mockTokens,
                darkTokens,
                colorScales: {},
            });
            const parsed = JSON.parse(json);
            expect(parsed.dark).toBeDefined();
            expect(parsed.dark.background).toHaveProperty('$type', 'color');
        });
        it('should validate JSON is properly formatted', () => {
            const json = exportToDTCG({
                semanticTokens: mockTokens,
                colorScales: mockColorScales,
            });
            expect(() => JSON.parse(json)).not.toThrow();
            const parsed = JSON.parse(json);
            expect(parsed).toBeInstanceOf(Object);
        });
    });
    describe('Tailwind Config Export - TASK-007 (EDR-002)', () => {
        it('should export as valid JavaScript object', () => {
            const config = exportToTailwind({
                semanticTokens: mockTokens,
                colorScales: mockColorScales,
            });
            expect(config).toContain('module.exports');
            expect(config).toContain('theme:');
            expect(config).toContain('extend:');
        });
        it('should include colors in theme.extend.colors', () => {
            const config = exportToTailwind({
                semanticTokens: mockTokens,
                colorScales: mockColorScales,
            });
            expect(config).toContain('colors:');
            expect(config).toContain('primary:');
            expect(config).toContain('neutral:');
        });
        it('should map color scales to Tailwind scale format', () => {
            const config = exportToTailwind({
                semanticTokens: mockTokens,
                colorScales: mockColorScales,
            });
            expect(config).toContain("'50':");
            expect(config).toContain("'500':");
            expect(config).toContain("'900':");
        });
        it('should use hex format for color values', () => {
            const config = exportToTailwind({
                semanticTokens: mockTokens,
                colorScales: mockColorScales,
            });
            // Should contain hex colors (#rrggbb)
            expect(config).toMatch(/#[0-9a-f]{6}/i);
        });
        it('should include semantic token mappings', () => {
            const config = exportToTailwind({
                semanticTokens: mockTokens,
                colorScales: {},
            });
            expect(config).toContain('background:');
            expect(config).toContain('foreground:');
        });
        it('should be valid JavaScript syntax', () => {
            const config = exportToTailwind({
                semanticTokens: mockTokens,
                colorScales: mockColorScales,
            });
            // Basic validation: balanced braces
            const openBraces = (config.match(/{/g) || []).length;
            const closeBraces = (config.match(/}/g) || []).length;
            expect(openBraces).toBe(closeBraces);
            // Should have commas
            expect(config).toContain(',');
        });
        it('should support TypeScript config format', () => {
            const config = exportToTailwind({
                semanticTokens: mockTokens,
                colorScales: mockColorScales,
                format: 'ts',
            });
            expect(config).toContain('import type { Config }');
            expect(config).toContain('export default');
            expect(config).toContain('satisfies Config');
        });
    });
    describe('Export Configuration', () => {
        it('should support minified output', () => {
            const normal = exportToCSS({
                semanticTokens: mockTokens,
                colorScales: {},
            });
            const minified = exportToCSS({
                semanticTokens: mockTokens,
                colorScales: {},
                minify: true,
            });
            expect(minified.length).toBeLessThan(normal.length);
            expect(minified).not.toContain('\n  ');
        });
        it('should support custom variable prefix', () => {
            const css = exportToCSS({
                semanticTokens: mockTokens,
                colorScales: {},
                prefix: 'app',
            });
            expect(css).toContain('--app-background:');
            expect(css).toContain('--app-primary:');
        });
    });
});
//# sourceMappingURL=output-formats.test.js.map