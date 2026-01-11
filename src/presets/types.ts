import { z } from 'zod';
import { QuestionnaireSchema } from '../generator/questionnaire';

/**
 * Supported frontend frameworks for presets
 */
export const SUPPORTED_FRAMEWORKS = ['nextjs', 'vite', 'remix'] as const;

/**
 * Stack configuration schema
 * Defines the technology stack for the preset
 *
 * @property framework - Frontend framework (Next.js, Vite, or Remix)
 * @property styling - Styling solution (currently only Tailwind CSS)
 * @property components - Component library (currently only shadcn/ui)
 */
export const StackSchema = z.object({
  framework: z.enum(SUPPORTED_FRAMEWORKS),
  styling: z.literal('tailwindcss'),
  components: z.literal('shadcn-ui'),
});

/**
 * Preset metadata schema
 * Optional metadata for preset discoverability and attribution
 *
 * @property tags - Optional array of tags for categorization
 * @property author - Optional author name or organization
 * @property homepage - Optional URL to preset documentation or homepage
 */
export const PresetMetadataSchema = z.object({
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  homepage: z.string().url().optional(),
});

/**
 * Complete preset schema
 * Validates preset configuration files against SPEC EDR-001 requirements
 *
 * @property id - Unique preset identifier (kebab-case recommended)
 * @property version - Semantic version (e.g., "1.0.0")
 * @property name - Human-readable preset name
 * @property description - Preset description and use case
 * @property stack - Technology stack configuration
 * @property questionnaire - Design system questionnaire configuration
 * @property metadata - Optional metadata for discoverability
 *
 * @example
 * ```typescript
 * const preset = {
 *   id: 'next-tailwind-shadcn',
 *   version: '0.1.0',
 *   name: 'Next.js + Tailwind CSS + shadcn/ui',
 *   description: 'Default preset for Next.js applications',
 *   stack: {
 *     framework: 'nextjs',
 *     styling: 'tailwindcss',
 *     components: 'shadcn-ui',
 *   },
 *   questionnaire: {
 *     brandTone: 'professional',
 *     contrast: 'high',
 *     // ... other questionnaire fields
 *   },
 * };
 * ```
 */
export const PresetSchema = z.object({
  id: z.string().min(1, 'Preset id is required'),
  version: z.string().min(1, 'Preset version is required'),
  name: z.string().min(1, 'Preset name is required'),
  description: z.string(),
  stack: StackSchema,
  questionnaire: QuestionnaireSchema,
  metadata: PresetMetadataSchema.optional(),
});

/**
 * Preset type
 * Represents a complete design system preset configuration
 *
 * This type is inferred from PresetSchema and provides full type safety
 * for preset objects throughout the application.
 */
export type Preset = z.infer<typeof PresetSchema>;

/**
 * Stack type
 * Represents the technology stack configuration for a preset
 */
export type Stack = z.infer<typeof StackSchema>;

/**
 * Preset metadata type
 * Represents optional metadata for preset discoverability
 */
export type PresetMetadata = z.infer<typeof PresetMetadataSchema>;
