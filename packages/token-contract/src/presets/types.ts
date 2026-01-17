import { z } from 'zod';
import {
  SemanticTokenSchema,
  CompositionTokenSchema,
} from '../schemas/index.js';

/**
 * Preset Name Schema
 * Valid preset identifiers
 */
export const PresetNameSchema = z.enum([
  'professional',
  'creative',
  'minimal',
  'bold',
  'warm',
  'cool',
  'high-contrast',
]);

export type PresetName = z.infer<typeof PresetNameSchema>;

/**
 * Complete Preset Schema
 * Defines a full design system preset with tokens and composition
 */
export const PresetSchema = z.object({
  name: PresetNameSchema,
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

export type Preset = z.infer<typeof PresetSchema>;

/**
 * Preset Metadata
 * Information about available presets
 */
export interface PresetInfo {
  name: PresetName;
  description: string;
  targetUseCase: string;
  characteristics: string[];
}
