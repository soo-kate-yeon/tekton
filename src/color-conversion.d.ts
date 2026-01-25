import type { OKLCHColor, RGBColor } from './schemas';
/**
 * Convert OKLCH to RGB
 */
export declare function oklchToRgb(oklch: OKLCHColor): RGBColor;
/**
 * Convert RGB to OKLCH
 */
export declare function rgbToOklch(rgb: RGBColor): OKLCHColor;
/**
 * Convert OKLCH to hex color string
 */
export declare function oklchToHex(oklch: OKLCHColor): string;
/**
 * Convert hex color string to OKLCH
 */
export declare function hexToOklch(hex: string): OKLCHColor;
//# sourceMappingURL=color-conversion.d.ts.map