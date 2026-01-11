import { z } from 'zod';
import { OKLCHColorSchema } from '../schemas';

/**
 * Brand tone options
 */
export const BrandToneSchema = z.enum(['professional', 'playful', 'elegant', 'bold', 'minimal']);

/**
 * Contrast level options
 */
export const ContrastSchema = z.enum(['low', 'medium', 'high', 'maximum']);

/**
 * UI density options
 */
export const DensitySchema = z.enum(['compact', 'comfortable', 'spacious']);

/**
 * Border radius options
 */
export const BorderRadiusSchema = z.enum(['none', 'small', 'medium', 'large', 'full']);

/**
 * Neutral tone options
 */
export const NeutralToneSchema = z.enum(['pure', 'warm', 'cool']);

/**
 * Font scale options
 */
export const FontScaleSchema = z.enum(['small', 'medium', 'large']);

/**
 * Complete questionnaire schema
 * TASK-008: Q&A Schema Implementation (EDR-002)
 */
export const QuestionnaireSchema = z.object({
  brandTone: BrandToneSchema,
  contrast: ContrastSchema,
  density: DensitySchema,
  borderRadius: BorderRadiusSchema,
  primaryColor: OKLCHColorSchema,
  neutralTone: NeutralToneSchema,
  fontScale: FontScaleSchema,
});

/**
 * Questionnaire type
 */
export type Questionnaire = z.infer<typeof QuestionnaireSchema>;

/**
 * Default questionnaire configuration
 */
export const DEFAULT_QUESTIONNAIRE: Questionnaire = {
  brandTone: 'professional',
  contrast: 'high',
  density: 'comfortable',
  borderRadius: 'medium',
  primaryColor: {
    l: 0.5,
    c: 0.15,
    h: 220,
  },
  neutralTone: 'pure',
  fontScale: 'medium',
};
