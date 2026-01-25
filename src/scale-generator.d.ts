import type { OKLCHColor, ColorScale } from './schemas';
/**
 * Generate a complete lightness scale from a base color
 * Creates 11 steps: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
 */
export declare function generateLightnessScale(baseColor: OKLCHColor): ColorScale;
/**
 * Generate multiple color scales from a color palette
 */
export declare function generateColorScales(palette: Record<string, OKLCHColor>): Record<string, ColorScale>;
//# sourceMappingURL=scale-generator.d.ts.map