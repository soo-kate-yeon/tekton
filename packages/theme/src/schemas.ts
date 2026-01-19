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

export type OKLCHColor = z.infer<typeof OKLCHColorSchema>;

/**
 * RGB Color Schema
 * R, G, B: 0-255
 */
export const RGBColorSchema = z.object({
  r: z.number().int().min(0).max(255),
  g: z.number().int().min(0).max(255),
  b: z.number().int().min(0).max(255),
});

export type RGBColor = z.infer<typeof RGBColorSchema>;

/**
 * Color Scale Schema
 * Valid scale values: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
 */
const scaleKeys = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

export const ColorScaleSchema = z.record(
  z.enum(scaleKeys),
  OKLCHColorSchema
);

export type ColorScale = z.infer<typeof ColorScaleSchema>;

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

export type TokenDefinition = z.infer<typeof TokenDefinitionSchema>;

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

export type AccessibilityCheck = z.infer<typeof AccessibilityCheckSchema>;

/**
 * Component Preset Schema
 * Defines color tokens for component states
 */
export const ComponentPresetSchema = z.object({
  name: z.string(),
  states: z.record(z.string(), OKLCHColorSchema),
  accessibility: z.array(AccessibilityCheckSchema).optional(),
});

export type ComponentPreset = z.infer<typeof ComponentPresetSchema>;

/**
 * Token Output Format Schema
 * Defines supported output formats
 */
export const TokenOutputFormatSchema = z.enum(['css', 'json', 'js', 'ts']);

export type TokenOutputFormat = z.infer<typeof TokenOutputFormatSchema>;

/**
 * Theme Mode Schema
 */
export const ThemeModeSchema = z.enum(['light', 'dark']);

export type ThemeMode = z.infer<typeof ThemeModeSchema>;
