/**
 * Zod schemas for validating archetype theme structure
 * Ensures type safety and runtime validation
 *
 * @module parser/schema-validator
 */

import { z } from 'zod';

/**
 * Zod schema for OKLCH color validation
 * Validates lightness (0-1), chroma (≥0), and hue (0-360)
 */
export const ArchetypeColorSchema = z.object({
  l: z.number().min(0, 'Lightness must be >= 0').max(1, 'Lightness must be <= 1'),
  c: z.number().min(0, 'Chroma must be >= 0'),
  h: z.number().min(0, 'Hue must be >= 0').max(360, 'Hue must be <= 360'),
});

/**
 * Zod schema for color palette validation
 * Ensures all four required color roles are present
 */
export const ColorPaletteSchema = z.object({
  primary: ArchetypeColorSchema,
  secondary: ArchetypeColorSchema,
  accent: ArchetypeColorSchema,
  neutral: ArchetypeColorSchema,
});

/**
 * Zod schema for stack information
 * Flexible to support various styling and component libraries
 */
export const StackInfoSchema = z.object({
  framework: z.enum(['nextjs', 'vite', 'remix']),
  styling: z.enum(['tailwindcss', 'styled-components', 'css-modules', 'emotion']),
  components: z.enum(['shadcn-ui', 'radix-ui', 'headless-ui', 'none']).optional(),
});

/**
 * Zod schema for typography configuration
 */
export const TypographySchema = z.object({
  fontFamily: z.string(),
  fontScale: z.enum(['small', 'medium', 'large']),
  headingWeight: z.number(),
  bodyWeight: z.number(),
});

/**
 * Zod schema for component defaults
 */
export const ComponentDefaultsSchema = z.object({
  borderRadius: z.enum(['none', 'small', 'medium', 'large', 'full']),
  density: z.enum(['compact', 'comfortable', 'spacious']),
  contrast: z.enum(['low', 'medium', 'high', 'maximum']),
});

/**
 * Zod schema for AI context
 */
export const AIContextSchema = z.object({
  brandTone: z.string(),
  designPhilosophy: z.string(),
  colorGuidance: z.string(),
  componentGuidance: z.string(),
  accessibilityNotes: z.string(),
});

/**
 * Complete archetype theme schema
 * Validates the entire theme structure from JSON files
 */
export const ArchetypeThemeSchema = z.object({
  id: z.string().min(1, 'Theme id cannot be empty'),
  name: z.string().min(1, 'Theme name cannot be empty'),
  description: z.string(),
  stackInfo: StackInfoSchema,
  brandTone: z.string(),
  colorPalette: ColorPaletteSchema,
  typography: TypographySchema,
  componentDefaults: ComponentDefaultsSchema,
  aiContext: AIContextSchema,
});

/**
 * Type inference from Zod schemas
 */
export type ArchetypeColor = z.infer<typeof ArchetypeColorSchema>;
export type ColorPalette = z.infer<typeof ColorPaletteSchema>;
export type ArchetypeTheme = z.infer<typeof ArchetypeThemeSchema>;
