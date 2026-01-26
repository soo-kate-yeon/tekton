import { z } from 'zod';
/**
 * OKLCH Color Schema
 * L: Lightness (0-1)
 * C: Chroma (0-0.4 typical range)
 * H: Hue (0-360 degrees)
 */
export const OKLCHColorSchema = z.object({
    l: z.number().min(0).max(1),
    c: z.number().min(0).max(0.5),
    h: z.number().min(0).max(360),
});
/**
 * RGB Color Schema
 * R, G, B: 0-255
 */
export const RGBColorSchema = z.object({
    r: z.number().int().min(0).max(255),
    g: z.number().int().min(0).max(255),
    b: z.number().int().min(0).max(255),
});
/**
 * Color Scale Schema
 * Valid scale values: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
 */
const scaleKeys = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    '950',
];
export const ColorScaleSchema = z.record(z.enum(scaleKeys), OKLCHColorSchema);
/**
 * Token Definition Schema
 * Represents a design token with its base value and scale
 */
export const TokenDefinitionSchema = z.object({
    id: z.string(),
    name: z.string(),
    value: OKLCHColorSchema,
    scale: ColorScaleSchema.optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});
/**
 * Accessibility Check Result Schema
 * WCAG contrast compliance validation result
 */
export const AccessibilityCheckSchema = z.object({
    contrastRatio: z.number().min(1).max(21),
    wcagLevel: z.enum(['AA', 'AAA']),
    passed: z.boolean(),
    foreground: RGBColorSchema.optional(),
    background: RGBColorSchema.optional(),
});
/**
 * Component Theme Schema
 * Defines color tokens for component states
 */
export const ComponentThemeSchema = z.object({
    name: z.string(),
    states: z.record(z.string(), OKLCHColorSchema),
    accessibility: z.array(AccessibilityCheckSchema).optional(),
});
/**
 * Backward compatibility alias for ComponentThemeSchema
 * @deprecated Use ComponentThemeSchema instead
 */
export const ComponentPresetSchema = ComponentThemeSchema;
/**
 * Token Output Format Schema
 * Defines supported output formats
 */
export const TokenOutputFormatSchema = z.enum(['css', 'json', 'js', 'ts']);
/**
 * Theme Mode Schema
 */
export const ThemeModeSchema = z.enum(['light', 'dark']);
//# sourceMappingURL=schemas.js.map