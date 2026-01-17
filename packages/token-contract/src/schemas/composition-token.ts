import { z } from 'zod';
import { ColorTokenSchema } from './color-token.js';

/**
 * Composition Token Schema
 * Defines complex design tokens composed of multiple properties
 *
 * Includes: border, shadow, spacing, typography
 */

/**
 * Border Token Schema
 * Validates border properties with CSS units
 */
const BorderTokenSchema = z.object({
  width: z.string().regex(/^\d+(\.\d+)?(px|rem|em)$/, 'Invalid border width format'),
  style: z.enum(['solid', 'dashed', 'dotted', 'none']),
  color: ColorTokenSchema,
  radius: z.string().regex(/^\d+(\.\d+)?(px|rem|em|%)$/, 'Invalid border radius format'),
});

/**
 * Shadow Token Schema
 * Validates box-shadow properties
 */
const ShadowTokenSchema = z.object({
  x: z.string(),
  y: z.string(),
  blur: z.string(),
  spread: z.string().optional(),
  color: ColorTokenSchema,
});

/**
 * Spacing Token Schema
 * Validates spacing properties with CSS units
 */
const SpacingTokenSchema = z.object({
  padding: z.string().regex(/^\d+(\.\d+)?(px|rem|em)$/, 'Invalid padding format'),
  margin: z.string().regex(/^\d+(\.\d+)?(px|rem|em)$/, 'Invalid margin format'),
  gap: z.string().regex(/^\d+(\.\d+)?(px|rem|em)$/, 'Invalid gap format'),
});

/**
 * Typography Token Schema
 * Validates typography properties
 */
const TypographyTokenSchema = z.object({
  fontSize: z.string().regex(/^\d+(\.\d+)?(px|rem|em)$/, 'Invalid font size format'),
  fontWeight: z.number().min(100).max(900).multipleOf(100),
  lineHeight: z
    .string()
    .regex(/^\d+(\.\d+)?(px|rem|em)?$/, 'Invalid line height format'),
  letterSpacing: z
    .string()
    .regex(/^-?\d+(\.\d+)?(px|rem|em)$/, 'Invalid letter spacing format'),
});

/**
 * Complete Composition Token Schema
 * Combines all composition token types
 */
export const CompositionTokenSchema = z.object({
  border: BorderTokenSchema,
  shadow: ShadowTokenSchema,
  spacing: SpacingTokenSchema,
  typography: TypographyTokenSchema,
});

export type CompositionToken = z.infer<typeof CompositionTokenSchema>;
export type BorderToken = z.infer<typeof BorderTokenSchema>;
export type ShadowToken = z.infer<typeof ShadowTokenSchema>;
export type SpacingToken = z.infer<typeof SpacingTokenSchema>;
export type TypographyToken = z.infer<typeof TypographyTokenSchema>;
