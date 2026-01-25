import { z } from 'zod';
import { ThemeSchema } from './types';
import type { Theme } from './types';
import nextTailwindShadcnTheme from './defaults/next-tailwind-shadcn.json' with { type: 'json' };

/**
 * Theme validation error
 * Thrown when a theme fails validation with detailed field-level error information
 *
 * @example
 * ```typescript
 * try {
 *   loadTheme(invalidData);
 * } catch (error) {
 *   if (error instanceof ThemeValidationError) {
 *     console.error(error.message);
 *     error.issues.forEach(issue => {
 *       console.log(`Field: ${issue.path.join('.')}, Error: ${issue.message}`);
 *     });
 *   }
 * }
 * ```
 */
export class ThemeValidationError extends Error {
  /**
   * Validation issues from Zod schema validation
   */
  public readonly issues: z.ZodIssue[];

  /**
   * Creates a new ThemeValidationError
   *
   * @param message - Error message summarizing validation failures
   * @param issues - Array of Zod validation issues with field-level details
   */
  constructor(message: string, issues: z.ZodIssue[]) {
    super(message);
    this.name = 'ThemeValidationError';
    this.issues = issues;
  }
}

/**
 * Load and validate a theme from unknown data
 * Validates the theme data against the ThemeSchema (EDR-001)
 *
 * @param themeData - Unknown data to validate as a theme
 * @returns Validated Theme object
 * @throws {ThemeValidationError} When theme data fails validation with field-level error details
 *
 * @example
 * ```typescript
 * import { loadTheme } from 'tekton/themes';
 *
 * const themeData = JSON.parse(fs.readFileSync('custom-theme.json', 'utf-8'));
 * const theme = loadTheme(themeData);
 * console.log(theme.name); // Type-safe access to theme properties
 * ```
 */
export function loadTheme(themeData: unknown): Theme {
  const result = ThemeSchema.safeParse(themeData);

  if (!result.success) {
    const errorMessages = result.error.issues
      .map(issue => {
        const path = issue.path.join('.');
        return `${path}: ${issue.message}`;
      })
      .join(', ');

    throw new ThemeValidationError(
      `Theme validation failed: ${errorMessages}`,
      result.error.issues
    );
  }

  return result.data;
}

/**
 * Supported default theme IDs
 */
export type DefaultThemeId = 'next-tailwind-shadcn';

/**
 * Load a default theme by ID
 * Loads one of the built-in theme configurations
 *
 * @param themeId - ID of the default theme to load
 * @returns Validated Theme object
 * @throws {Error} When theme ID is not recognized
 * @throws {ThemeValidationError} When theme file contains invalid data
 *
 * @example
 * ```typescript
 * import { loadDefaultTheme } from 'tekton/themes';
 *
 * const theme = loadDefaultTheme('next-tailwind-shadcn');
 * console.log(theme.name); // "Next.js + Tailwind CSS + shadcn/ui"
 * ```
 */
export function loadDefaultTheme(themeId: DefaultThemeId): Theme {
  // Map theme IDs to imported JSON data
  const themeMap: Record<DefaultThemeId, unknown> = {
    'next-tailwind-shadcn': nextTailwindShadcnTheme,
  };

  const themeData = themeMap[themeId];
  if (!themeData) {
    throw new Error(`Unknown theme ID: ${themeId}`);
  }

  return loadTheme(themeData);
}
