import { z } from 'zod';
import { OKLCHColorSchema } from './schemas.js';

/**
 * Brand Token Schema
 * Defines brand colors with 4 levels: base, light, dark, contrast
 */
export const BrandLevelSchema = z.object({
  base: OKLCHColorSchema,
  light: OKLCHColorSchema,
  dark: OKLCHColorSchema,
  contrast: OKLCHColorSchema,
});

export type BrandLevel = z.infer<typeof BrandLevelSchema>;

export const BrandTokenSchema = z.record(z.string(), BrandLevelSchema);

export type BrandToken = z.infer<typeof BrandTokenSchema>;

/**
 * Semantic Token Schema
 * Defines semantic colors: success, warning, error, info
 * Supports optional extended variants (e.g., successLight, errorDark)
 */
export const SemanticTokenSchema = z.object({
  success: OKLCHColorSchema,
  warning: OKLCHColorSchema,
  error: OKLCHColorSchema,
  info: OKLCHColorSchema,
}).catchall(OKLCHColorSchema); // Allow additional semantic colors

export type SemanticToken = z.infer<typeof SemanticTokenSchema>;

/**
 * Data Visualization Token Schema
 * Supports categorical, sequential, and diverging palettes
 * Each palette must have at least 2 colors
 */
export const DataVizTokenSchema = z.object({
  categorical: z.array(OKLCHColorSchema).min(2).optional(),
  sequential: z.array(OKLCHColorSchema).min(2).optional(),
  diverging: z.array(OKLCHColorSchema).min(2).optional(),
}).catchall(z.array(OKLCHColorSchema).min(2)); // Allow custom palette types

export type DataVizToken = z.infer<typeof DataVizTokenSchema>;

/**
 * Neutral Token Schema
 * Defines 10 levels of neutral colors (50, 100, 200, ..., 900)
 * Enforces monochromatic constraint (low chroma values)
 */
export const NeutralTokenSchema = z.object({
  50: OKLCHColorSchema.refine((color) => color.c <= 0.05, {
    message: 'Neutral colors must have low chroma (≤ 0.05)',
  }),
  100: OKLCHColorSchema.refine((color) => color.c <= 0.05, {
    message: 'Neutral colors must have low chroma (≤ 0.05)',
  }),
  200: OKLCHColorSchema.refine((color) => color.c <= 0.05, {
    message: 'Neutral colors must have low chroma (≤ 0.05)',
  }),
  300: OKLCHColorSchema.refine((color) => color.c <= 0.05, {
    message: 'Neutral colors must have low chroma (≤ 0.05)',
  }),
  400: OKLCHColorSchema.refine((color) => color.c <= 0.05, {
    message: 'Neutral colors must have low chroma (≤ 0.05)',
  }),
  500: OKLCHColorSchema.refine((color) => color.c <= 0.05, {
    message: 'Neutral colors must have low chroma (≤ 0.05)',
  }),
  600: OKLCHColorSchema.refine((color) => color.c <= 0.05, {
    message: 'Neutral colors must have low chroma (≤ 0.05)',
  }),
  700: OKLCHColorSchema.refine((color) => color.c <= 0.05, {
    message: 'Neutral colors must have low chroma (≤ 0.05)',
  }),
  800: OKLCHColorSchema.refine((color) => color.c <= 0.05, {
    message: 'Neutral colors must have low chroma (≤ 0.05)',
  }),
  900: OKLCHColorSchema.refine((color) => color.c <= 0.05, {
    message: 'Neutral colors must have low chroma (≤ 0.05)',
  }),
});

export type NeutralToken = z.infer<typeof NeutralTokenSchema>;

/**
 * Extended Token Preset Schema
 * Complete token preset with brand, semantic, dataViz, and neutral categories
 */
export const ExtendedTokenPresetSchema = z.object({
  brand: BrandTokenSchema,
  semantic: SemanticTokenSchema,
  dataViz: DataVizTokenSchema,
  neutral: NeutralTokenSchema,
});

export type ExtendedTokenPreset = z.infer<typeof ExtendedTokenPresetSchema>;

/**
 * Token Generation Options
 */
export interface TokenGenerationOptions {
  preset: ExtendedTokenPreset;
  wcagLevel?: 'AA' | 'AAA';
  validateContrast?: boolean;
}

/**
 * Token Generation Result
 */
export interface TokenGenerationResult {
  success: boolean;
  tokens?: ExtendedTokenPreset;
  wcagValidation?: {
    passed: boolean;
    issues: string[];
  };
  error?: string;
}
