import { z } from 'zod';
import {
  SemanticTokenSchema,
  CompositionTokenSchema,
} from '../schemas/index.js';

/**
 * Theme Name Schema
 * Valid theme identifiers
 */
export const ThemeNameSchema = z.enum([
  'professional',
  'creative',
  'minimal',
  'bold',
  'warm',
  'cool',
  'high-contrast',
]);

export type ThemeName = z.infer<typeof ThemeNameSchema>;

/**
 * Complete Theme Schema
 * Defines a full design system theme with tokens and composition
 */
export const ThemeSchema = z.object({
  name: ThemeNameSchema,
  description: z.string(),
  tokens: SemanticTokenSchema,
  composition: CompositionTokenSchema,
  metadata: z
    .object({
      targetUseCase: z.string(),
      characteristics: z.array(z.string()),
    })
    .optional(),
});

export type Theme = z.infer<typeof ThemeSchema>;

/**
 * Theme Metadata
 * Information about available themes
 */
export interface ThemeInfo {
  name: ThemeName;
  description: string;
  targetUseCase: string;
  characteristics: string[];
}
