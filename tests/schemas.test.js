import { describe, it, expect } from 'vitest';
import { OKLCHColorSchema, RGBColorSchema, ColorScaleSchema, TokenDefinitionSchema, AccessibilityCheckSchema, ComponentPresetSchema, } from '../src/schemas';
describe('Zod Schemas - TASK-003', () => {
    describe('OKLCHColorSchema', () => {
        it('should validate valid OKLCH color', () => {
            const validColor = { l: 0.5, c: 0.1, h: 180 };
            expect(() => OKLCHColorSchema.parse(validColor)).not.toThrow();
        });
        it('should reject invalid lightness values', () => {
            const invalidColor = { l: 1.5, c: 0.1, h: 180 };
            expect(() => OKLCHColorSchema.parse(invalidColor)).toThrow();
        });
        it('should reject invalid chroma values', () => {
            const invalidColor = { l: 0.5, c: -0.1, h: 180 };
            expect(() => OKLCHColorSchema.parse(invalidColor)).toThrow();
        });
        it('should reject invalid hue values', () => {
            const invalidColor = { l: 0.5, c: 0.1, h: 400 };
            expect(() => OKLCHColorSchema.parse(invalidColor)).toThrow();
        });
    });
    describe('RGBColorSchema', () => {
        it('should validate valid RGB color', () => {
            const validColor = { r: 128, g: 64, b: 255 };
            expect(() => RGBColorSchema.parse(validColor)).not.toThrow();
        });
        it('should reject out-of-range RGB values', () => {
            const invalidColor = { r: 256, g: 64, b: 255 };
            expect(() => RGBColorSchema.parse(invalidColor)).toThrow();
        });
    });
    describe('ColorScaleSchema', () => {
        it('should validate valid color scale', () => {
            const validScale = {
                50: { l: 0.95, c: 0.05, h: 180 },
                100: { l: 0.9, c: 0.08, h: 180 },
                500: { l: 0.5, c: 0.15, h: 180 },
                900: { l: 0.1, c: 0.1, h: 180 },
            };
            expect(() => ColorScaleSchema.parse(validScale)).not.toThrow();
        });
        it('should reject invalid scale keys', () => {
            const invalidScale = {
                invalid: { l: 0.95, c: 0.05, h: 180 },
            };
            expect(() => ColorScaleSchema.parse(invalidScale)).toThrow();
        });
    });
    describe('TokenDefinitionSchema', () => {
        it('should validate valid token definition', () => {
            const validToken = {
                id: 'token-123',
                name: 'primary',
                value: { l: 0.5, c: 0.15, h: 220 },
                scale: {
                    500: { l: 0.5, c: 0.15, h: 220 },
                },
            };
            expect(() => TokenDefinitionSchema.parse(validToken)).not.toThrow();
        });
        it('should require id and name fields', () => {
            const invalidToken = {
                value: { l: 0.5, c: 0.15, h: 220 },
            };
            expect(() => TokenDefinitionSchema.parse(invalidToken)).toThrow();
        });
    });
    describe('AccessibilityCheckSchema', () => {
        it('should validate valid accessibility check result', () => {
            const validCheck = {
                contrastRatio: 4.5,
                wcagLevel: 'AA',
                passed: true,
            };
            expect(() => AccessibilityCheckSchema.parse(validCheck)).not.toThrow();
        });
        it('should validate WCAG level enum', () => {
            const validLevels = ['AA', 'AAA'];
            validLevels.forEach((level) => {
                const check = { contrastRatio: 4.5, wcagLevel: level, passed: true };
                expect(() => AccessibilityCheckSchema.parse(check)).not.toThrow();
            });
        });
        it('should reject invalid WCAG levels', () => {
            const invalidCheck = {
                contrastRatio: 4.5,
                wcagLevel: 'A',
                passed: true,
            };
            expect(() => AccessibilityCheckSchema.parse(invalidCheck)).toThrow();
        });
    });
    describe('ComponentPresetSchema', () => {
        it('should validate valid component preset', () => {
            const validPreset = {
                name: 'button',
                states: {
                    default: { l: 0.5, c: 0.15, h: 220 },
                    hover: { l: 0.45, c: 0.15, h: 220 },
                },
            };
            expect(() => ComponentPresetSchema.parse(validPreset)).not.toThrow();
        });
        it('should require name and states fields', () => {
            const invalidPreset = { name: 'button' };
            expect(() => ComponentPresetSchema.parse(invalidPreset)).toThrow();
        });
    });
});
//# sourceMappingURL=schemas.test.js.map