/**
 * Token Contract Presets
 * Curated design system presets with WCAG compliance
 */

export {
  loadTheme,
  getAvailablePresets,
  validatePreset,
} from './theme-loader.js';

export {
  validateWCAGCompliance,
  type WCAGCheck,
  type WCAGComplianceResult,
} from './wcag-compliance.js';

export {
  type Preset,
  type PresetName,
  type PresetInfo,
  PresetNameSchema,
  ThemeSchema,
} from './types.js';

// Re-export preset definitions for direct access if needed
export { professionalPreset } from './definitions/professional.js';
export { creativePreset } from './definitions/creative.js';
export { minimalPreset } from './definitions/minimal.js';
export { boldPreset } from './definitions/bold.js';
export { warmPreset } from './definitions/warm.js';
export { coolPreset } from './definitions/cool.js';
export { highContrastPreset } from './definitions/high-contrast.js';
