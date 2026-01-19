/**
 * Style Generator
 * Generate CSS from archetype layer configurations
 */

import type { VariantConfigurationOption } from '@tekton/component-system';

export interface ComponentState {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Evaluate a condition string against component state
 */
function evaluateCondition(condition: string, state: ComponentState): boolean {
  // Parse simple conditions like "variant === 'primary'" or "disabled === true"
  const match = condition.match(/(\w+)\s*(===|!==|==|!=)\s*['"]?(\w+)['"]?/);
  if (!match) {
    return false;
  }

  const [, key, operator, value] = match;
  const stateValue = state[key];

  // Convert value to appropriate type
  let compareValue: string | number | boolean = value;
  if (value === 'true') {
    compareValue = true;
  } else if (value === 'false') {
    compareValue = false;
  } else if (!isNaN(Number(value))) {
    compareValue = Number(value);
  }

  switch (operator) {
    case '===':
    case '==':
      return stateValue === compareValue;
    case '!==':
    case '!=':
      return stateValue !== compareValue;
    default:
      return false;
  }
}

/**
 * Generate styles from variant options and current state
 */
export function generateStylesFromVariants(
  options: VariantConfigurationOption[],
  state: ComponentState
): Record<string, string> {
  const styles: Record<string, string> = {};

  for (const option of options) {
    for (const rule of option.styleRules) {
      if (evaluateCondition(rule.condition, state)) {
        Object.assign(styles, rule.cssProperties);
      }
    }
  }

  return styles;
}

/**
 * Convert style object to inline CSS string
 */
export function styleObjectToCSS(styles: Record<string, string>): string {
  return Object.entries(styles)
    .map(([key, value]) => `${camelToKebab(key)}: ${value};`)
    .join(' ');
}

/**
 * Convert style object to React style prop
 */
export function styleObjectToReactStyle(
  styles: Record<string, string>
): React.CSSProperties {
  const reactStyle: Record<string, string> = {};

  for (const [key, value] of Object.entries(styles)) {
    // Keep camelCase for React
    reactStyle[key] = value;
  }

  return reactStyle as React.CSSProperties;
}

/**
 * Convert camelCase to kebab-case
 */
function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Generate CSS class content for preview
 */
export function generateCSSClass(
  className: string,
  styles: Record<string, string>
): string {
  const cssProperties = Object.entries(styles)
    .map(([key, value]) => `  ${camelToKebab(key)}: ${value};`)
    .join('\n');

  return `.${className} {\n${cssProperties}\n}`;
}

/**
 * Generate base styles for a component
 */
export function generateBaseStyles(htmlElement: string): Record<string, string> {
  const baseStyles: Record<string, string> = {
    fontFamily: 'inherit',
    fontSize: '1rem',
    lineHeight: '1.5',
  };

  switch (htmlElement) {
    case 'button':
      return {
        ...baseStyles,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--tekton-border-radius, 0.375rem)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 150ms ease',
      };
    case 'input':
      return {
        ...baseStyles,
        display: 'block',
        width: '100%',
        borderRadius: 'var(--tekton-border-radius, 0.375rem)',
        border: '1px solid var(--tekton-neutral-300)',
        backgroundColor: 'var(--tekton-neutral-50)',
      };
    case 'div':
      return {
        ...baseStyles,
        display: 'block',
      };
    case 'span':
      return {
        ...baseStyles,
        display: 'inline-flex',
        alignItems: 'center',
      };
    default:
      return baseStyles;
  }
}
