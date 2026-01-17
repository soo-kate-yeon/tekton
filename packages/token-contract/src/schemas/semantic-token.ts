import { z } from 'zod';
import { ColorScaleSchema } from './color-token.js';

/**
 * Semantic Token Schema
 * Defines semantic color scales for design system consistency
 *
 * Required tokens: primary, neutral, success, warning, error
 * Optional tokens: secondary, accent, info
 *
 * Each semantic token is a full color scale with 10 steps
 */
export const SemanticTokenSchema = z.object({
  primary: ColorScaleSchema,
  secondary: ColorScaleSchema.optional(),
  accent: ColorScaleSchema.optional(),
  neutral: ColorScaleSchema,
  success: ColorScaleSchema,
  warning: ColorScaleSchema,
  error: ColorScaleSchema,
  info: ColorScaleSchema.optional(),
});

export type SemanticToken = z.infer<typeof SemanticTokenSchema>;
