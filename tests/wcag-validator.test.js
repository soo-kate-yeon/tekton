import { describe, it, expect } from 'vitest';
import { calculateContrastRatio, checkWCAGCompliance, validateColorPair, suggestLightnessAdjustment, } from '../src/wcag-validator';
describe('WCAG AA Validator - TASK-008', () => {
    describe('calculateContrastRatio', () => {
        it('should calculate contrast ratio for black and white', () => {
            const black = { r: 0, g: 0, b: 0 };
            const white = { r: 255, g: 255, b: 255 };
            const ratio = calculateContrastRatio(black, white);
            expect(ratio).toBeCloseTo(21, 0);
        });
        it('should calculate contrast ratio for same color (1:1)', () => {
            const gray = { r: 128, g: 128, b: 128 };
            const ratio = calculateContrastRatio(gray, gray);
            expect(ratio).toBeCloseTo(1, 1);
        });
        it('should be symmetric (order independent)', () => {
            const color1 = { r: 100, g: 150, b: 200 };
            const color2 = { r: 50, g: 75, b: 100 };
            const ratio1 = calculateContrastRatio(color1, color2);
            const ratio2 = calculateContrastRatio(color2, color1);
            expect(ratio1).toBeCloseTo(ratio2, 2);
        });
        it('should calculate ratio for blue and white', () => {
            const blue = { r: 0, g: 0, b: 255 };
            const white = { r: 255, g: 255, b: 255 };
            const ratio = calculateContrastRatio(blue, white);
            expect(ratio).toBeGreaterThan(8);
        });
    });
    describe('checkWCAGCompliance', () => {
        it('should pass AA for high contrast (4.5:1+)', () => {
            const result = checkWCAGCompliance(4.5, 'AA');
            expect(result.passed).toBe(true);
            expect(result.wcagLevel).toBe('AA');
            expect(result.contrastRatio).toBe(4.5);
        });
        it('should fail AA for low contrast (<4.5:1)', () => {
            const result = checkWCAGCompliance(3.0, 'AA');
            expect(result.passed).toBe(false);
            expect(result.wcagLevel).toBe('AA');
        });
        it('should pass AAA for very high contrast (7:1+)', () => {
            const result = checkWCAGCompliance(7.0, 'AAA');
            expect(result.passed).toBe(true);
            expect(result.wcagLevel).toBe('AAA');
        });
        it('should fail AAA for medium contrast (<7:1)', () => {
            const result = checkWCAGCompliance(5.0, 'AAA');
            expect(result.passed).toBe(false);
            expect(result.wcagLevel).toBe('AAA');
        });
    });
    describe('validateColorPair', () => {
        it('should validate black text on white background (AA)', () => {
            const foreground = { r: 0, g: 0, b: 0 };
            const background = { r: 255, g: 255, b: 255 };
            const result = validateColorPair(foreground, background, 'AA');
            expect(result.passed).toBe(true);
            expect(result.contrastRatio).toBeGreaterThan(4.5);
        });
        it('should validate white text on black background (AA)', () => {
            const foreground = { r: 255, g: 255, b: 255 };
            const background = { r: 0, g: 0, b: 0 };
            const result = validateColorPair(foreground, background, 'AA');
            expect(result.passed).toBe(true);
        });
        it('should fail for low contrast pairs', () => {
            const foreground = { r: 200, g: 200, b: 200 };
            const background = { r: 220, g: 220, b: 220 };
            const result = validateColorPair(foreground, background, 'AA');
            expect(result.passed).toBe(false);
            expect(result.contrastRatio).toBeLessThan(4.5);
        });
        it('should include foreground and background in result', () => {
            const foreground = { r: 0, g: 0, b: 0 };
            const background = { r: 255, g: 255, b: 255 };
            const result = validateColorPair(foreground, background, 'AA');
            expect(result.foreground).toEqual(foreground);
            expect(result.background).toEqual(background);
        });
        it('should validate blue on white (AA)', () => {
            const foreground = { r: 0, g: 0, b: 139 }; // Dark blue
            const background = { r: 255, g: 255, b: 255 };
            const result = validateColorPair(foreground, background, 'AA');
            expect(result.passed).toBe(true);
        });
    });
    describe('Large Text Compliance', () => {
        it('should pass AA for large text with 3:1 ratio', () => {
            const result = checkWCAGCompliance(3.0, 'AA', true);
            expect(result.passed).toBe(true);
        });
        it('should fail AA for large text with <3:1 ratio', () => {
            const result = checkWCAGCompliance(2.5, 'AA', true);
            expect(result.passed).toBe(false);
        });
        it('should pass AAA for large text with 4.5:1 ratio', () => {
            const result = checkWCAGCompliance(4.5, 'AAA', true);
            expect(result.passed).toBe(true);
        });
        it('should fail AAA for large text with <4.5:1 ratio', () => {
            const result = checkWCAGCompliance(4.0, 'AAA', true);
            expect(result.passed).toBe(false);
        });
        it('should validate large text with validateColorPair', () => {
            const foreground = { r: 100, g: 100, b: 100 };
            const background = { r: 200, g: 200, b: 200 };
            const result = validateColorPair(foreground, background, 'AA', true);
            expect(result).toBeDefined();
        });
    });
    describe('suggestLightnessAdjustment', () => {
        it('should return null for already compliant colors', () => {
            const foreground = { r: 0, g: 0, b: 0 };
            const background = { r: 255, g: 255, b: 255 };
            const suggestion = suggestLightnessAdjustment(foreground, background, 'AA');
            expect(suggestion).toBeNull();
        });
        it('should suggest darkening lighter foreground', () => {
            const foreground = { r: 200, g: 200, b: 200 }; // Light foreground
            const background = { r: 220, g: 220, b: 220 }; // Light background
            const suggestion = suggestLightnessAdjustment(foreground, background, 'AA');
            expect(suggestion).not.toBeNull();
            expect(suggestion).toBeGreaterThanOrEqual(0);
            expect(suggestion).toBeLessThanOrEqual(1);
        });
        it('should suggest lightening darker background', () => {
            const foreground = { r: 50, g: 50, b: 50 }; // Dark foreground
            const background = { r: 60, g: 60, b: 60 }; // Dark background
            const suggestion = suggestLightnessAdjustment(foreground, background, 'AA');
            expect(suggestion).not.toBeNull();
            expect(suggestion).toBeGreaterThanOrEqual(0);
            expect(suggestion).toBeLessThanOrEqual(1);
        });
        it('should work with AAA level', () => {
            const foreground = { r: 100, g: 100, b: 100 };
            const background = { r: 150, g: 150, b: 150 };
            const suggestion = suggestLightnessAdjustment(foreground, background, 'AAA');
            expect(suggestion).not.toBeNull();
        });
    });
    describe('edge cases', () => {
        it('should handle contrast ratio exactly at AA threshold', () => {
            const result = checkWCAGCompliance(4.5, 'AA');
            expect(result.passed).toBe(true);
        });
        it('should handle contrast ratio exactly at AAA threshold', () => {
            const result = checkWCAGCompliance(7.0, 'AAA');
            expect(result.passed).toBe(true);
        });
        it('should handle maximum contrast ratio', () => {
            const result = checkWCAGCompliance(21, 'AAA');
            expect(result.passed).toBe(true);
        });
        it('should handle minimum contrast ratio', () => {
            const result = checkWCAGCompliance(1, 'AA');
            expect(result.passed).toBe(false);
        });
    });
});
//# sourceMappingURL=wcag-validator.test.js.map