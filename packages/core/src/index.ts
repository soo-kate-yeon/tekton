/**
 * @tekton/core
 * Minimal design system pipeline: Theme -> Blueprint -> Screen
 *
 * 80% LOC reduction from original codebase
 * No external dependencies (Babel, Prettier removed)
 */

// Types
export type {
  Theme,
  ThemeMeta,
  OKLCHColor,
  Blueprint,
  ComponentNode,
  LayoutType,
  RenderResult,
  RenderOptions,
  // Token Types (SPEC-COMPONENT-001-A)
  AtomicTokens,
  SemanticTokens,
  ComponentTokens,
  ThemeWithTokens,
} from './types.js';

// Theme
export {
  loadTheme,
  listThemes,
  isBuiltinTheme,
  oklchToCSS,
  generateCSSVariables,
  BUILTIN_THEMES,
  type BuiltinThemeId,
} from './theme.js';

// Blueprint
export {
  createBlueprint,
  validateBlueprint,
  isValidComponent,
  getLayoutSlots,
  LAYOUTS,
  COMPONENT_CATALOG,
  type LayoutSlot,
  type ValidationResult,
  type CreateBlueprintInput,
} from './blueprint.js';

// Render
export { render, renderWithTheme, renderSingleComponent, renderComponents } from './render.js';

// Token System (SPEC-COMPONENT-001-A)
export { resolveToken, resolveWithFallback, type TokenReference } from './token-resolver.js';
export {
  validateTheme,
  ThemeWithTokensSchema,
  type ValidationResult as TokenValidationResult,
} from './token-validation.js';
export { generateThemeCSS } from './css-generator.js';
