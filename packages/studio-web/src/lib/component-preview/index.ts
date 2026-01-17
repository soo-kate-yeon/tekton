/**
 * Component Preview Utilities
 */

export {
  AVAILABLE_HOOKS,
  HOOK_METADATA,
  SAMPLE_VARIANTS,
  SAMPLE_ACCESSIBILITY,
  getHookMeta,
  getHooksByCategory,
  getVariantOptions,
  getAccessibilitySpec,
  type HookName,
  type HookMeta,
} from './archetype-client';

export {
  generateStylesFromVariants,
  styleObjectToCSS,
  styleObjectToReactStyle,
  generateCSSClass,
  generateBaseStyles,
  type ComponentState,
} from './style-generator';

export {
  generateHTMLCode,
  generateJSXCode,
  generateCSSCode,
  type CodeGeneratorOptions,
} from './code-generator';
