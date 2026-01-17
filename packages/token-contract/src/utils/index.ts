/**
 * Utility Exports
 * Helper functions for token management
 */

export {
  getTokenWithFallback,
  getFallbackColor,
  logMissingTokenWarning,
} from './fallback.js';

export {
  overridePresetTokens,
  validateOverride,
  mergeTokens,
} from './override.js';

export type { ValidationResult } from './override.js';
