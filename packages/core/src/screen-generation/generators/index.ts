/**
 * @tekton/core - Output Generators Module
 * Barrel export for code generation from resolved screens
 * [SPEC-LAYOUT-002] [PHASE-3]
 */

// ============================================================================
// Types
// ============================================================================

export type {
  CSSFramework,
  OutputFormat,
  ComponentStyle,
  GeneratorOptions,
  GeneratorResult,
  GeneratedFile,
  CSSVariableMap,
  TailwindClassMap,
  StyledThemeConfig,
  ComponentGenerationContext,
} from './types.js';

export { defaultGeneratorOptions } from './types.js';

// ============================================================================
// Utilities
// ============================================================================

export {
  // String case conversion
  camelCase,
  pascalCase,
  kebabCase,

  // Code formatting
  formatCode,
  indent,

  // JSX/React utilities
  escapeJSX,
  needsJSXExpression,
  propValueToJSX,

  // Import generation
  generateImports,

  // CSS utilities
  cssVarToToken,
  extractPropertyFromCSSVar,

  // Validation
  isValidIdentifier,
  sanitizeIdentifier,
} from './utils.js';

// ============================================================================
// CSS-in-JS Generator
// ============================================================================

export type { CSSInJSFormat } from './css-in-js-generator.js';

export {
  convertCSSVarsToTheme,
  generateComponentStyles,
  generateStyledComponents,
} from './css-in-js-generator.js';

// ============================================================================
// Tailwind Generator
// ============================================================================

export {
  tokenToTailwindClass,
  generateComponentClasses,
  generateTailwindConfig,
  generateTailwindClasses,
} from './tailwind-generator.js';

// ============================================================================
// React Generator
// ============================================================================

export {
  generateComponentInterface,
  generateComponentJSX,
  generateComponentTree,
  generateReactComponent,
} from './react-generator.js';
