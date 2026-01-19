import { z } from 'zod';
import { ThemeSchema } from './types';
import type { Preset } from './types';
import nextTailwindShadcnPreset from './defaults/next-tailwind-shadcn.json' with { type: 'json' };

/**
 * Preset validation error
 * Thrown when a preset fails validation with detailed field-level error information
 *
 * @example
 * ```typescript
 * try {
 *   loadTheme(invalidData);
 * } catch (error) {
 *   if (error instanceof PresetValidationError) {
 *     console.error(error.message);
 *     error.issues.forEach(issue => {
 *       console.log(`Field: ${issue.path.join('.')}, Error: ${issue.message}`);
 *     });
 *   }
 * }
 * ```
 */
export class PresetValidationError extends Error {
  /**
   * Validation issues from Zod schema validation
   */
  public readonly issues: z.ZodIssue[];

  /**
   * Creates a new PresetValidationError
   *
   * @param message - Error message summarizing validation failures
   * @param issues - Array of Zod validation issues with field-level details
   */
  constructor(message: string, issues: z.ZodIssue[]) {
    super(message);
    this.name = 'PresetValidationError';
    this.issues = issues;
  }
}

/**
 * Load and validate a preset from unknown data
 * Validates the preset data against the ThemeSchema (EDR-001)
 *
 * @param themeData - Unknown data to validate as a preset
 * @returns Validated Preset object
 * @throws {PresetValidationError} When preset data fails validation with field-level error details
 *
 * @example
 * ```typescript
 * import { loadTheme } from 'tekton/presets';
 *
 * const themeData = JSON.parse(fs.readFileSync('custom-preset.json', 'utf-8'));
 * const preset = loadTheme(themeData);
 * console.log(preset.name); // Type-safe access to preset properties
 * ```
 */
export function loadTheme(themeData: unknown): Preset {
  const result = ThemeSchema.safeParse(themeData);

  if (!result.success) {
    const errorMessages = result.error.issues
      .map((issue) => {
        const path = issue.path.join('.');
        return `${path}: ${issue.message}`;
      })
      .join(', ');

    throw new PresetValidationError(
      `Preset validation failed: ${errorMessages}`,
      result.error.issues
    );
  }

  return result.data;
}

/**
 * Supported default preset IDs
 */
export type DefaultPresetId = 'next-tailwind-shadcn';

/**
 * Load a default preset by ID
 * Loads one of the built-in preset configurations
 *
 * @param themeId - ID of the default preset to load
 * @returns Validated Preset object
 * @throws {Error} When preset ID is not recognized
 * @throws {PresetValidationError} When preset file contains invalid data
 *
 * @example
 * ```typescript
 * import { loadDefaultPreset } from 'tekton/presets';
 *
 * const preset = loadDefaultPreset('next-tailwind-shadcn');
 * console.log(preset.name); // "Next.js + Tailwind CSS + shadcn/ui"
 * ```
 */
export function loadDefaultPreset(themeId: DefaultPresetId): Preset {
  // Map preset IDs to imported JSON data
  const presetMap: Record<DefaultPresetId, unknown> = {
    'next-tailwind-shadcn': nextTailwindShadcnPreset,
  };

  const themeData = presetMap[themeId];
  if (!themeData) {
    throw new Error(`Unknown preset ID: ${themeId}`);
  }

  return loadTheme(themeData);
}
