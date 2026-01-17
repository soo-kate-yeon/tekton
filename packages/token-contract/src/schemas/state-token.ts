import { z } from 'zod';
import { ColorTokenSchema } from './color-token.js';

/**
 * State Token Schema
 * Defines color tokens for interactive component states
 *
 * Required states: default, hover, active, focus, disabled
 * Optional states: error
 *
 * Each state is a single OKLCH color token
 */
export const StateTokenSchema = z.object({
  default: ColorTokenSchema,
  hover: ColorTokenSchema,
  active: ColorTokenSchema,
  focus: ColorTokenSchema,
  disabled: ColorTokenSchema,
  error: ColorTokenSchema.optional(),
});

export type StateToken = z.infer<typeof StateTokenSchema>;
