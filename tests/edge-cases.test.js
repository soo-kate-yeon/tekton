import { describe, it, expect } from 'vitest';
import { oklchToRgb, rgbToOklch, generateLightnessScale, TokenGenerator, } from '../src';
describe('Edge Cases - TASK-023', () => {
    describe('Gamut boundary values', () => {
        it('should handle maximum lightness (1.0)', () => {
            const color = { l: 1.0, c: 0.0, h: 0 };
            const rgb = oklchToRgb(color);
            expect(rgb.r).toBe(255);
            expect(rgb.g).toBe(255);
            expect(rgb.b).toBe(255);
        });
        it('should handle minimum lightness (0.0)', () => {
            const color = { l: 0.0, c: 0.0, h: 0 };
            const rgb = oklchToRgb(color);
            expect(rgb.r).toBe(0);
            expect(rgb.g).toBe(0);
            expect(rgb.b).toBe(0);
        });
        it('should handle maximum chroma within gamut', () => {
            const color = { l: 0.5, c: 0.3, h: 220 };
            const rgb = oklchToRgb(color);
            expect(rgb.r).toBeGreaterThanOrEqual(0);
            expect(rgb.r).toBeLessThanOrEqual(255);
            expect(rgb.g).toBeGreaterThanOrEqual(0);
            expect(rgb.g).toBeLessThanOrEqual(255);
            expect(rgb.b).toBeGreaterThanOrEqual(0);
            expect(rgb.b).toBeLessThanOrEqual(255);
        });
        it('should handle out-of-gamut colors gracefully', () => {
            const generator = new TokenGenerator();
            // Very high chroma that may be out of gamut
            const outOfGamut = { l: 0.5, c: 0.5, h: 220 };
            expect(() => {
                generator.generateTokens({ test: outOfGamut });
            }).not.toThrow();
        });
        it('should handle hue at boundary (0 degrees)', () => {
            const color = { l: 0.5, c: 0.15, h: 0 };
            const rgb = oklchToRgb(color);
            expect(rgb).toBeDefined();
        });
        it('should handle hue at boundary (360 degrees)', () => {
            const color = { l: 0.5, c: 0.15, h: 360 };
            const rgb = oklchToRgb(color);
            expect(rgb).toBeDefined();
        });
    });
    describe('Extreme color values', () => {
        it('should handle very low chroma (achromatic)', () => {
            const color = { l: 0.5, c: 0.001, h: 180 };
            const scale = generateLightnessScale(color);
            expect(Object.keys(scale)).toHaveLength(11);
            Object.values(scale).forEach((c) => {
                expect(c.c).toBeLessThan(0.1);
            });
        });
        it('should handle very light base color', () => {
            const color = { l: 0.95, c: 0.05, h: 180 };
            const scale = generateLightnessScale(color);
            expect(scale['50']).toBeDefined();
            expect(scale['50']?.l).toBeLessThanOrEqual(1.0);
        });
        it('should handle very dark base color', () => {
            const color = { l: 0.1, c: 0.05, h: 180 };
            const scale = generateLightnessScale(color);
            expect(scale['950']).toBeDefined();
            expect(scale['950']?.l).toBeGreaterThanOrEqual(0.0);
        });
    });
    describe('RGB edge cases', () => {
        it('should handle RGB (0, 0, 0)', () => {
            const rgb = { r: 0, g: 0, b: 0 };
            const oklch = rgbToOklch(rgb);
            expect(oklch.l).toBeCloseTo(0, 1);
            expect(oklch.c).toBeCloseTo(0, 1);
        });
        it('should handle RGB (255, 255, 255)', () => {
            const rgb = { r: 255, g: 255, b: 255 };
            const oklch = rgbToOklch(rgb);
            expect(oklch.l).toBeCloseTo(1, 1);
            expect(oklch.c).toBeCloseTo(0, 1);
        });
        it('should handle pure red', () => {
            const rgb = { r: 255, g: 0, b: 0 };
            const oklch = rgbToOklch(rgb);
            expect(oklch.l).toBeGreaterThan(0);
            expect(oklch.c).toBeGreaterThan(0);
            expect(oklch.h).toBeGreaterThanOrEqual(0);
            expect(oklch.h).toBeLessThan(360);
        });
        it('should handle pure green', () => {
            const rgb = { r: 0, g: 255, b: 0 };
            const oklch = rgbToOklch(rgb);
            expect(oklch.l).toBeGreaterThan(0);
            expect(oklch.c).toBeGreaterThan(0);
        });
        it('should handle pure blue', () => {
            const rgb = { r: 0, g: 0, b: 255 };
            const oklch = rgbToOklch(rgb);
            expect(oklch.l).toBeGreaterThan(0);
            expect(oklch.c).toBeGreaterThan(0);
        });
    });
    describe('Hue wraparound', () => {
        it('should handle hue > 360 (normalize to 0-360)', () => {
            const color = { l: 0.5, c: 0.15, h: 400 };
            expect(() => {
                oklchToRgb(color);
            }).not.toThrow();
        });
        it('should handle negative hue', () => {
            const color = { l: 0.5, c: 0.15, h: -20 };
            expect(() => {
                oklchToRgb(color);
            }).not.toThrow();
        });
    });
    describe('Scale generation edge cases', () => {
        it('should generate valid scale for extreme lightness values', () => {
            const veryLight = { l: 0.99, c: 0.05, h: 180 };
            const scale = generateLightnessScale(veryLight);
            Object.values(scale).forEach((color) => {
                expect(color.l).toBeGreaterThanOrEqual(0);
                expect(color.l).toBeLessThanOrEqual(1);
            });
        });
        it('should generate valid scale for extreme chroma values', () => {
            const highChroma = { l: 0.5, c: 0.4, h: 180 };
            const scale = generateLightnessScale(highChroma);
            Object.values(scale).forEach((color) => {
                expect(color.c).toBeGreaterThanOrEqual(0);
            });
        });
    });
    describe('Token generator edge cases', () => {
        it('should handle empty palette gracefully', () => {
            const generator = new TokenGenerator();
            const tokens = generator.generateTokens({});
            expect(tokens).toEqual([]);
        });
        it('should handle single color palette', () => {
            const generator = new TokenGenerator();
            const tokens = generator.generateTokens({
                single: { l: 0.5, c: 0.15, h: 220 },
            });
            expect(tokens).toHaveLength(1);
        });
        it('should handle palette with duplicate colors', () => {
            const generator = new TokenGenerator();
            const color = { l: 0.5, c: 0.15, h: 220 };
            const tokens = generator.generateTokens({
                color1: color,
                color2: color,
            });
            expect(tokens).toHaveLength(2);
            expect(tokens[0].value).toEqual(tokens[1].value);
        });
    });
    describe('Numerical precision', () => {
        it('should handle floating point precision in lightness', () => {
            const color = { l: 0.123456789, c: 0.15, h: 220 };
            const rgb = oklchToRgb(color);
            expect(rgb.r).toBeGreaterThanOrEqual(0);
            expect(rgb.r).toBeLessThanOrEqual(255);
        });
        it('should handle floating point precision in chroma', () => {
            const color = { l: 0.5, c: 0.123456789, h: 220 };
            const rgb = oklchToRgb(color);
            expect(rgb).toBeDefined();
        });
        it('should handle very small chroma values', () => {
            const color = { l: 0.5, c: 0.0001, h: 220 };
            const rgb = oklchToRgb(color);
            expect(rgb).toBeDefined();
        });
    });
});
//# sourceMappingURL=edge-cases.test.js.map