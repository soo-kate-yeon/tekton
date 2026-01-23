/**
 * Validator exports
 */

// Export ValidationResult type from hook-prop-validator as the canonical source
export type { ValidationResult } from './hook-prop-validator.js';

// Export validator functions (not types to avoid duplicates)
export { validateHookPropRule } from './hook-prop-validator.js';
export { validateStateStyleMapping } from './state-mapping-validator.js';
export { VariantValidator } from './variant-validator.js';

// Export structure validator (uses different result type)
export * from './structure-validator.js';
