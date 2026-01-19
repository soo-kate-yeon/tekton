import { ThemeSchema, type Preset, type PresetName, type PresetInfo } from './types.js';
import { professionalPreset } from './definitions/professional.js';
import { creativePreset } from './definitions/creative.js';
import { minimalPreset } from './definitions/minimal.js';
import { boldPreset } from './definitions/bold.js';
import { warmPreset } from './definitions/warm.js';
import { coolPreset } from './definitions/cool.js';
import { highContrastPreset } from './definitions/high-contrast.js';

/**
 * Preset Registry
 * Maps preset names to their definitions
 */
const presetRegistry: Record<PresetName, Preset> = {
  professional: professionalPreset,
  creative: creativePreset,
  minimal: minimalPreset,
  bold: boldPreset,
  warm: warmPreset,
  cool: coolPreset,
  'high-contrast': highContrastPreset,
};

/**
 * Load a preset by name
 * @param name - Preset identifier
 * @returns Validated preset configuration
 * @throws Error if preset not found or invalid
 */
export function loadTheme(name: PresetName): Preset {
  const preset = presetRegistry[name];

  if (!preset) {
    throw new Error(`Preset '${name}' not found`);
  }

  // Validate preset structure
  const result = ThemeSchema.safeParse(preset);
  if (!result.success) {
    throw new Error(
      `Preset '${name}' validation failed: ${result.error.message}`
    );
  }

  return result.data;
}

/**
 * Get list of available presets with metadata
 * @returns Array of preset information
 */
export function getAvailablePresets(): PresetInfo[] {
  return Object.values(presetRegistry).map(preset => ({
    name: preset.name,
    description: preset.description,
    targetUseCase: preset.metadata?.targetUseCase ?? '',
    characteristics: preset.metadata?.characteristics ?? [],
  }));
}

/**
 * Validate a preset configuration
 * @param preset - Preset to validate
 * @returns Validation result with success flag
 */
export function validatePreset(preset: unknown): {
  success: boolean;
  error?: string;
} {
  const result = ThemeSchema.safeParse(preset);

  if (!result.success) {
    return {
      success: false,
      error: result.error.message,
    };
  }

  return { success: true };
}
