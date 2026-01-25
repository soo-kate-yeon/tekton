import { z } from 'zod';
import { QuestionnaireSchema } from '../generator/questionnaire';

/**
 * Supported frontend frameworks for themes
 */
export const SUPPORTED_FRAMEWORKS = ['nextjs', 'vite', 'remix'] as const;

/**
 * Stack configuration schema
 * Defines the technology stack for the theme
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
 * Theme metadata schema
 * Optional metadata for theme discoverability and attribution
 *
 * @property tags - Optional array of tags for categorization
 * @property author - Optional author name or organization
 * @property homepage - Optional URL to theme documentation or homepage
 */
export const ThemeMetadataSchema = z.object({
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  homepage: z.string().url().optional(),
});

/**
 * Complete theme schema
 * Validates theme configuration files against SPEC EDR-001 requirements
 *
 * @property id - Unique theme identifier (kebab-case recommended)
 * @property version - Semantic version (e.g., "1.0.0")
 * @property name - Human-readable theme name
 * @property description - Theme description and use case
 * @property stack - Technology stack configuration
 * @property questionnaire - Design system questionnaire configuration
 * @property metadata - Optional metadata for discoverability
 *
 * @example
 * ```typescript
 * const theme = {
 *   id: 'next-tailwind-shadcn',
 *   version: '0.1.0',
 *   name: 'Next.js + Tailwind CSS + shadcn/ui',
 *   description: 'Default theme for Next.js applications',
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
export const ThemeSchema = z.object({
  id: z.string().min(1, 'Theme id is required'),
  version: z.string().min(1, 'Theme version is required'),
  name: z.string().min(1, 'Theme name is required'),
  description: z.string(),
  stack: StackSchema,
  questionnaire: QuestionnaireSchema,
  metadata: ThemeMetadataSchema.optional(),
});

/**
 * Theme type
 * Represents a complete design system theme configuration
 *
 * This type is inferred from ThemeSchema and provides full type safety
 * for theme objects throughout the application.
 */
export type Theme = z.infer<typeof ThemeSchema>;

/**
 * Stack type
 * Represents the technology stack configuration for a theme
 */
export type Stack = z.infer<typeof StackSchema>;

/**
 * Theme metadata type
 * Represents optional metadata for theme discoverability
 */
export type ThemeMetadata = z.infer<typeof ThemeMetadataSchema>;
