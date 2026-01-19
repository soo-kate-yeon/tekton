/**
 * Validator exports
 */

// Export ValidationResult type from hook-prop-validator as the canonical source
export type { ValidationResult } from './hook-prop-validator';

// Export validator functions (not types to avoid duplicates)
export { validateHookPropRule } from './hook-prop-validator';
export { validateStateStyleMapping } from './state-mapping-validator';
export { VariantValidator } from './variant-validator';

// Export structure validator (uses different result type)
export * from './structure-validator';
