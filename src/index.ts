// Main entry point for Tekton design token generator

// Schemas and types
export * from './schemas';

// Color conversion utilities
export {
  oklchToRgb,
  rgbToOklch,
  oklchToHex,
  hexToOklch,
} from './color-conversion';

// Scale generation
export {
  generateLightnessScale,
  generateColorScales,
} from './scale-generator';

// WCAG validation
export {
  calculateContrastRatio,
  checkWCAGCompliance,
  validateColorPair,
} from './wcag-validator';

// Token generation
export {
  generateToken,
  generateTokenId,
  TokenGenerator,
  type TokenGeneratorConfig,
} from './token-generator';

// Component presets
export {
  buttonPreset,
  inputPreset,
  cardPreset,
  badgePreset,
  alertPreset,
  linkPreset,
  checkboxPreset,
  radioPreset,
  generateComponentPresets,
  COMPONENT_PRESETS,
} from './component-presets';

// Neutral palette generation
export {
  generateNeutralPalette,
  type NeutralPaletteConfig,
} from './generator/neutral-palette';

// Semantic token mapping
export {
  mapSemanticTokens,
  type SemanticTokenConfig,
  type SemanticTokens,
} from './generator/semantic-mapper';

// Output format exporters
export {
  exportToCSS,
  exportToDTCG,
  exportToTailwind,
  type ExportConfig,
} from './generator/output';

// Questionnaire schema
export {
  QuestionnaireSchema,
  DEFAULT_QUESTIONNAIRE,
  type Questionnaire,
} from './generator/questionnaire';

// Version
export const VERSION = '0.1.0';
