/**
 * @tekton/core - Screen Resolver Module
 * Barrel export for screen resolution pipeline
 * [SPEC-LAYOUT-002] [PHASE-2]
 */

// ============================================================================
// Token Resolver
// ============================================================================

export {
  // Types
  type TokenBindingContext,
  type ResolvedTokenBindings,

  // Core Functions
  resolveBinding,
  resolveBindings,
  substituteTemplateVariables,
  tokenRefToCSSVar,

  // Validation
  isValidTokenBinding,
  extractTemplateVariables,

  // Cache Management
  clearBindingCache,
} from './token-resolver.js';

// ============================================================================
// Layout Resolver
// ============================================================================

export {
  // Types
  type LayoutContext,

  // Core Functions
  resolveShell,
  resolvePage,
  resolveSection,

  // Validation
  isValidShellToken,
  isValidPageToken,
  isValidSectionToken,
  parseLayoutType,
} from './layout-resolver.js';

// ============================================================================
// Component Resolver
// ============================================================================

export {
  // Types
  type ResolvedComponent,
  type ComponentContext,

  // Core Functions
  resolveComponent,
  resolveChildren,

  // Validation
  isValidComponentDefinition,
  extractComponentTypes,

  // Cache Management
  clearComponentCache,
} from './component-resolver.js';

// ============================================================================
// Screen Resolver (Main)
// ============================================================================

export {
  // Types
  type ResolvedScreen,
  type ResolvedSection,
  type ComponentTree,
  type ComponentTreeNode,

  // Core Functions
  resolveScreen,

  // Validation
  isValidResolvedScreen,

  // Statistics
  getScreenStats,

  // Cache Management
  clearScreenCache,
} from './screen-resolver.js';
