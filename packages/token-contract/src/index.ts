/**
 * @tekton/token-contract
 * Token Contract & CSS Variable System
 *
 * A comprehensive design token system with Zod validation, curated presets,
 * CSS variable generation, and React theme provider.
 */

// ========================================
// Schemas
// ========================================
export {
  ColorTokenSchema,
  ColorScaleSchema,
  SemanticTokenSchema,
  StateTokenSchema,
  CompositionTokenSchema,
} from './schemas/index.js';

export type {
  ColorToken,
  ColorScale,
  SemanticToken,
  StateToken,
  CompositionToken,
  BorderToken,
  ShadowToken,
  SpacingToken,
  TypographyToken,
} from './schemas/index.js';

// ========================================
// Presets
// ========================================
export {
  loadPreset,
  getAvailablePresets,
  validatePreset,
} from './presets/preset-loader.js';

export {
  validateWCAGCompliance,
} from './presets/wcag-compliance.js';

export type {
  WCAGCheck,
  WCAGComplianceResult,
} from './presets/wcag-compliance.js';

export {
  PresetNameSchema,
  PresetSchema,
} from './presets/types.js';

export type {
  PresetName,
  Preset,
  PresetInfo,
} from './presets/types.js';

// ========================================
// CSS Generator
// ========================================
export {
  generateVariableName,
  validateVariableName,
  isValidCSSVariableName,
  generateCSSVariables,
  generateCSSFromTokens,
  formatCSSRule,
  generateDarkModeCSS,
  generateDarkModeOverrides,
  mergeLightAndDarkCSS,
} from './css-generator/index.js';

// ========================================
// Theme Provider (React)
// ========================================
export {
  ThemeProvider,
  ThemeContext,
  useTheme,
  applyCSSVariables,
  applyDarkModeCSSVariables,
  removeCSSVariables,
} from './theme-provider/index.js';

export type {
  ThemeProviderProps,
  ThemeContextValue,
} from './theme-provider/index.js';

// ========================================
// Utils
// ========================================
export {
  getTokenWithFallback,
  getFallbackColor,
  logMissingTokenWarning,
  overridePresetTokens,
  validateOverride,
  mergeTokens,
} from './utils/index.js';

export type {
  ValidationResult,
} from './utils/index.js';
