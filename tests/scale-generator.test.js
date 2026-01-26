import { describe, it, expect } from 'vitest';
import { generateLightnessScale, generateColorScales } from '../src/scale-generator';
describe('Lightness Scale Generator - TASK-007', () => {
    it('should generate 11-step scale from base color', () => {
        const base = { l: 0.5, c: 0.15, h: 220 };
        const scale = generateLightnessScale(base);
        expect(Object.keys(scale)).toHaveLength(11);
        expect(scale['50']).toBeDefined();
        expect(scale['100']).toBeDefined();
        expect(scale['500']).toBeDefined();
        expect(scale['900']).toBeDefined();
        expect(scale['950']).toBeDefined();
    });
    it('should have 500 match the base color', () => {
        const base = { l: 0.5, c: 0.15, h: 220 };
        const scale = generateLightnessScale(base);
        expect(scale['500']?.l).toBeCloseTo(base.l, 2);
        expect(scale['500']?.c).toBeCloseTo(base.c, 2);
        expect(scale['500']?.h).toBeCloseTo(base.h, 2);
    });
    it('should generate lighter tints (50-400)', () => {
        const base = { l: 0.5, c: 0.15, h: 220 };
        const scale = generateLightnessScale(base);
        expect(scale['50']?.l).toBeGreaterThan(scale['100']?.l ?? 0);
        expect(scale['100']?.l).toBeGreaterThan(scale['200']?.l ?? 0);
        expect(scale['200']?.l).toBeGreaterThan(scale['300']?.l ?? 0);
        expect(scale['300']?.l).toBeGreaterThan(scale['400']?.l ?? 0);
        expect(scale['400']?.l).toBeGreaterThan(scale['500']?.l ?? 0);
    });
    it('should generate darker shades (600-950)', () => {
        const base = { l: 0.5, c: 0.15, h: 220 };
        const scale = generateLightnessScale(base);
        expect(scale['500']?.l).toBeGreaterThan(scale['600']?.l ?? 0);
        expect(scale['600']?.l).toBeGreaterThan(scale['700']?.l ?? 0);
        expect(scale['700']?.l).toBeGreaterThan(scale['800']?.l ?? 0);
        expect(scale['800']?.l).toBeGreaterThan(scale['900']?.l ?? 0);
        expect(scale['900']?.l).toBeGreaterThan(scale['950']?.l ?? 0);
    });
    it('should preserve hue across scale', () => {
        const base = { l: 0.5, c: 0.15, h: 220 };
        const scale = generateLightnessScale(base);
        Object.values(scale).forEach(color => {
            expect(color.h).toBeCloseTo(base.h, 1);
        });
    });
    it('should maintain reasonable chroma values', () => {
        const base = { l: 0.5, c: 0.15, h: 220 };
        const scale = generateLightnessScale(base);
        Object.values(scale).forEach(color => {
            expect(color.c).toBeGreaterThanOrEqual(0);
            expect(color.c).toBeLessThanOrEqual(0.5);
        });
    });
    it('should handle low chroma colors', () => {
        const gray = { l: 0.5, c: 0.01, h: 0 };
        const scale = generateLightnessScale(gray);
        expect(Object.keys(scale)).toHaveLength(11);
        Object.values(scale).forEach(color => {
            expect(color.c).toBeLessThan(0.05);
        });
    });
    it('should handle very light base colors', () => {
        const light = { l: 0.9, c: 0.1, h: 180 };
        const scale = generateLightnessScale(light);
        expect(scale['50']?.l).toBeLessThanOrEqual(1);
        expect(scale['950']?.l).toBeGreaterThanOrEqual(0);
    });
    it('should handle very dark base colors', () => {
        const dark = { l: 0.2, c: 0.1, h: 180 };
        const scale = generateLightnessScale(dark);
        expect(scale['50']?.l).toBeLessThanOrEqual(1);
        expect(scale['950']?.l).toBeGreaterThanOrEqual(0);
    });
    it('should reduce chroma at extreme lightness values', () => {
        const base = { l: 0.5, c: 0.2, h: 220 };
        const scale = generateLightnessScale(base);
        // Very light (>0.9) should have reduced chroma
        expect(scale['50']?.c).toBeLessThan(base.c);
        // Very dark (<0.2) should have reduced chroma
        expect(scale['950']?.c).toBeLessThan(base.c);
    });
});
describe('Color Scales Generator - Multiple Palettes', () => {
    it('should generate scales for multiple colors', () => {
        const palette = {
            primary: { l: 0.5, c: 0.15, h: 220 },
            secondary: { l: 0.6, c: 0.12, h: 180 },
            accent: { l: 0.55, c: 0.18, h: 280 },
        };
        const scales = generateColorScales(palette);
        expect(Object.keys(scales)).toHaveLength(3);
        expect(scales.primary).toBeDefined();
        expect(scales.secondary).toBeDefined();
        expect(scales.accent).toBeDefined();
    });
    it('should generate 11 steps for each color', () => {
        const palette = {
            primary: { l: 0.5, c: 0.15, h: 220 },
            secondary: { l: 0.6, c: 0.12, h: 180 },
        };
        const scales = generateColorScales(palette);
        expect(Object.keys(scales.primary)).toHaveLength(11);
        expect(Object.keys(scales.secondary)).toHaveLength(11);
    });
    it('should preserve individual color characteristics', () => {
        const palette = {
            blue: { l: 0.5, c: 0.15, h: 220 },
            green: { l: 0.5, c: 0.15, h: 140 },
        };
        const scales = generateColorScales(palette);
        expect(scales.blue['500']?.h).toBe(220);
        expect(scales.green['500']?.h).toBe(140);
    });
});
//# sourceMappingURL=scale-generator.test.js.map