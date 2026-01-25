import type { RGBColor, AccessibilityCheck } from './schemas';
/**
 * Calculate contrast ratio between two RGB colors
 * Returns a value between 1 and 21
 * Formula: (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter color
 */
export declare function calculateContrastRatio(color1: RGBColor, color2: RGBColor): number;
/**
 * Check if a contrast ratio meets WCAG compliance level
 * WCAG AA: minimum 4.5:1 for normal text, 3:1 for large text
 * WCAG AAA: minimum 7:1 for normal text, 4.5:1 for large text
 */
export declare function checkWCAGCompliance(contrastRatio: number, level: 'AA' | 'AAA', isLargeText?: boolean): AccessibilityCheck;
/**
 * Validate a color pair for WCAG compliance
 * Returns full accessibility check result with both colors
 */
export declare function validateColorPair(foreground: RGBColor, background: RGBColor, level?: 'AA' | 'AAA', isLargeText?: boolean): AccessibilityCheck;
/**
 * Find the minimum lightness adjustment needed for WCAG compliance
 * Returns suggested lightness value, or null if already compliant
 */
export declare function suggestLightnessAdjustment(foreground: RGBColor, background: RGBColor, targetLevel?: 'AA' | 'AAA'): number | null;
//# sourceMappingURL=wcag-validator.d.ts.map