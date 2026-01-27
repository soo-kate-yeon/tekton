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
  // TODO: SPEC-COMPONENT-001-A - Token System Implementation Required
  // AtomicTokens,
  // SemanticTokens,
  // ComponentTokens,
  // ThemeWithTokens,
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

// Token System (SPEC-COMPONENT-001-A) - Enabled for SPEC-COMPONENT-001-D
export { resolveToken, resolveWithFallback, type TokenReference } from './token-resolver.js';
export {
  validateTheme,
  ThemeWithTokensSchema,
  type ValidationResult as TokenValidationResult,
} from './token-validation.js';
export { generateThemeCSS } from './css-generator.js';
export type { AtomicTokens, SemanticTokens, ComponentTokens, ThemeWithTokens } from './tokens.js';

// Component Schemas (SPEC-COMPONENT-001-B)
export type {
  PropDefinition,
  ComponentSchema,
  A11yRequirements,
  TokenBindings,
} from './component-schemas.js';
export {
  PRIMITIVE_COMPONENTS,
  COMPOSED_COMPONENTS,
  ALL_COMPONENTS,
  getComponentSchema,
} from './component-schemas.js';
export {
  validateComponentSchema,
  validateAllSchemas,
  validateProp,
  validateA11y,
  validateTokenBindings,
  getValidationSummary,
  assertValidSchema,
  assertAllSchemasValid,
  PropDefinitionSchema,
  A11yRequirementsSchema,
  TokenBindingsSchema,
  ComponentSchemaZod,
  type ValidationResult as SchemaValidationResult,
} from './schema-validation.js';

// Layout Tokens (SPEC-LAYOUT-001)
// Note: TokenReference is already exported from token-resolver.ts
export type {
  ResponsiveToken,
  ResponsiveConfig,
  ShellRegion,
  ShellRegionPosition,
  ShellConfig,
  ShellToken,
  SectionSlot,
  PagePurpose,
  PageConfig,
  PageLayoutToken,
  SectionCSS,
  SectionType,
  SectionPatternToken,
} from './layout-tokens/types.js';

// Shell Token Definitions (SPEC-LAYOUT-001 - PHASE-3)
export {
  SHELL_WEB_APP,
  SHELL_WEB_MARKETING,
  SHELL_WEB_AUTH,
  SHELL_WEB_DASHBOARD,
  SHELL_WEB_ADMIN,
  SHELL_WEB_MINIMAL,
  getShellToken,
  getAllShellTokens,
  getShellsByPlatform,
} from './layout-tokens/shells.js';

// Page Layout Token Definitions (SPEC-LAYOUT-001 - PHASE-4)
export {
  PAGE_JOB,
  PAGE_RESOURCE,
  PAGE_DASHBOARD,
  PAGE_SETTINGS,
  PAGE_DETAIL,
  PAGE_EMPTY,
  PAGE_WIZARD,
  PAGE_ONBOARDING,
  getPageLayoutToken,
  getAllPageLayoutTokens,
  getPagesByPurpose,
  getPageSections,
} from './layout-tokens/pages.js';

// Section Pattern Token Definitions (SPEC-LAYOUT-001 - PHASE-5)
export {
  SECTION_GRID_2,
  SECTION_GRID_3,
  SECTION_GRID_4,
  SECTION_GRID_AUTO,
  SECTION_SPLIT_30_70,
  SECTION_SPLIT_50_50,
  SECTION_SPLIT_70_30,
  SECTION_STACK_START,
  SECTION_STACK_CENTER,
  SECTION_STACK_END,
  SECTION_SIDEBAR_LEFT,
  SECTION_SIDEBAR_RIGHT,
  SECTION_CONTAINER,
  getSectionPatternToken,
  getAllSectionPatternTokens,
  getSectionsByType,
  getSectionCSS,
} from './layout-tokens/sections.js';

// Responsive Token Definitions (SPEC-LAYOUT-001 - PHASE-6)
export {
  BREAKPOINT_SM,
  BREAKPOINT_MD,
  BREAKPOINT_LG,
  BREAKPOINT_XL,
  BREAKPOINT_2XL,
  BREAKPOINT_VALUES,
  getResponsiveToken,
  getAllResponsiveTokens,
  getBreakpointValue,
  getBreakpointMediaQuery,
  sortBreakpointsBySize,
} from './layout-tokens/responsive.js';

// Layout Token Validation (SPEC-LAYOUT-001 - PHASE-2)
export {
  validateShellToken,
  validatePageLayoutToken,
  validateSectionPatternToken,
  validateTokenReference,
  validateLLMShellInput,
  validateLLMPageInput,
  validateLLMSectionInput,
  detectCircularRefs,
  validateLayoutHierarchy,
  safeValidate,
  ShellTokenSchema,
  PageLayoutTokenSchema,
  SectionPatternTokenSchema,
  TokenReferenceSchema,
  ShellRegionSchema,
  ShellRegionPositionSchema,
  ShellConfigSchema,
  PagePurposeSchema,
  SectionSlotSchema,
  PageConfigSchema,
  SectionTypeSchema,
  SectionCSSSchema,
  ResponsiveTokenSchema,
  LLMShellInputSchema,
  LLMPageInputSchema,
  LLMSectionInputSchema,
  type ValidationResult as LayoutValidationResult,
  type LayoutTokenCollection,
} from './layout-validation.js';

// Layout Resolver (SPEC-LAYOUT-001 - PHASE-7)
export {
  resolveLayout,
  clearLayoutCache,
  mergeResponsiveConfig,
  type ResolvedLayout,
} from './layout-resolver.js';

// Layout CSS Generator (SPEC-LAYOUT-001 - PHASE-8)
export {
  generateLayoutCSS,
  generateAllLayoutCSS,
  generateCSSVariables as generateLayoutCSSVariables,
  generateShellClasses,
  generatePageClasses,
  generateSectionClasses,
  generateMediaQueries,
  formatCSS,
  validateCSS,
  type LayoutToken,
  type CSSGenerationOptions,
} from './layout-css-generator.js';
