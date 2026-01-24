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
