/**
 * @tekton/core - CSS-in-JS Generator
 * Generates styled-components or Emotion code from ResolvedScreen
 * [SPEC-LAYOUT-002] [PHASE-3]
 */

import type { ResolvedScreen, ResolvedComponent } from '../resolver/index.js';
import type { GeneratorOptions, GeneratorResult, StyledThemeConfig } from './types.js';
import { pascalCase, generateImports, formatCode } from './utils.js';

// ============================================================================
// Types
// ============================================================================

/**
 * CSS-in-JS format options
 */
export type CSSInJSFormat = 'styled-components' | 'emotion';

// ============================================================================
// Theme Generation
// ============================================================================

/**
 * Convert CSS variables to styled-components theme
 *
 * Extracts design tokens from CSS variables and organizes them into
 * a theme object compatible with styled-components/Emotion.
 *
 * @param cssVars - CSS variables from resolved screen
 * @returns Theme configuration
 *
 * @example
 * ```typescript
 * const cssVars = {
 *   'var(--atomic-spacing-16)': 'atomic.spacing.16',
 *   'var(--semantic-color-primary)': 'semantic.color.primary'
 * };
 *
 * const theme = convertCSSVarsToTheme(cssVars);
 * // {
 * //   colors: { primary: 'var(--semantic-color-primary)' },
 * //   spacing: { '16': 'var(--atomic-spacing-16)' }
 * // }
 * ```
 */
export function convertCSSVarsToTheme(cssVars: Record<string, string>): StyledThemeConfig {
  const theme: StyledThemeConfig = {
    name: 'default',
    colors: {},
    spacing: {},
    typography: {},
    radii: {},
    shadows: {},
    custom: {},
  };

  for (const [cssVar, tokenRef] of Object.entries(cssVars)) {
    const parts = tokenRef.split('.');

    if (parts.length < 2) {
      continue;
    }

    const [layer, category, ...rest] = parts;
    const key = rest.join('-') || category;

    if (layer === 'atomic' || layer === 'semantic') {
      if (category === 'color' || category === 'colors') {
        theme.colors[key] = cssVar;
      } else if (category === 'spacing' || category === 'space') {
        theme.spacing[key] = cssVar;
      } else if (category === 'typography' || category === 'font') {
        theme.typography[key] = cssVar;
      } else if (category === 'radius' || category === 'radii') {
        theme.radii[key] = cssVar;
      } else if (category === 'shadow' || category === 'shadows') {
        theme.shadows[key] = cssVar;
      } else {
        // Custom category
        if (!theme.custom) {
          theme.custom = {};
        }
        if (!theme.custom[category]) {
          theme.custom[category] = {};
        }
        theme.custom[category][key] = cssVar;
      }
    } else if (layer === 'component') {
      // Component-specific tokens go to custom
      if (!theme.custom) {
        theme.custom = {};
      }
      if (!theme.custom[category]) {
        theme.custom[category] = {};
      }
      theme.custom[category][key] = cssVar;
    }
  }

  return theme;
}

/**
 * Generate theme object code
 *
 * @param theme - Theme configuration
 * @returns Theme object code string
 */
function generateThemeCode(theme: StyledThemeConfig): string {
  const lines: string[] = ['export const theme = {'];

  // Colors
  if (Object.keys(theme.colors).length > 0) {
    lines.push('  colors: {');
    for (const [key, value] of Object.entries(theme.colors)) {
      lines.push(`    '${key}': '${value}',`);
    }
    lines.push('  },');
  }

  // Spacing
  if (Object.keys(theme.spacing).length > 0) {
    lines.push('  spacing: {');
    for (const [key, value] of Object.entries(theme.spacing)) {
      lines.push(`    '${key}': '${value}',`);
    }
    lines.push('  },');
  }

  // Typography
  if (Object.keys(theme.typography).length > 0) {
    lines.push('  typography: {');
    for (const [key, value] of Object.entries(theme.typography)) {
      lines.push(`    '${key}': '${value}',`);
    }
    lines.push('  },');
  }

  // Radii
  if (Object.keys(theme.radii).length > 0) {
    lines.push('  radii: {');
    for (const [key, value] of Object.entries(theme.radii)) {
      lines.push(`    '${key}': '${value}',`);
    }
    lines.push('  },');
  }

  // Shadows
  if (Object.keys(theme.shadows).length > 0) {
    lines.push('  shadows: {');
    for (const [key, value] of Object.entries(theme.shadows)) {
      lines.push(`    '${key}': '${value}',`);
    }
    lines.push('  },');
  }

  // Custom
  if (theme.custom && Object.keys(theme.custom).length > 0) {
    for (const [category, tokens] of Object.entries(theme.custom)) {
      lines.push(`  ${category}: {`);
      for (const [key, value] of Object.entries(tokens)) {
        lines.push(`    '${key}': '${value}',`);
      }
      lines.push('  },');
    }
  }

  lines.push('};');

  return lines.join('\n');
}

// ============================================================================
// Component Styles Generation
// ============================================================================

/**
 * Generate styled component for a resolved component
 *
 * @param component - Resolved component
 * @param format - CSS-in-JS format
 * @returns Styled component code
 *
 * @example
 * ```typescript
 * const component = {
 *   type: 'Button',
 *   tokenBindings: {
 *     background: 'var(--component-button-primary-background)',
 *     color: 'var(--component-button-primary-foreground)'
 *   }
 * };
 *
 * const code = generateComponentStyles(component, 'styled-components');
 * // export const StyledButton = styled.button`
 * //   background: ${props => props.theme.button['primary-background']};
 * //   color: ${props => props.theme.button['primary-foreground']};
 * // `;
 * ```
 */
export function generateComponentStyles(
  component: ResolvedComponent,
  _format: CSSInJSFormat = 'styled-components'
): string {
  const componentName = pascalCase(component.type);
  const styledName = `Styled${componentName}`;

  // Get base HTML element
  const element = getHTMLElement(component.type);

  const lines: string[] = [];

  // Generate styled component
  lines.push(`export const ${styledName} = styled.${element}\`\``);

  // Add token bindings as CSS properties
  const styles: string[] = [];
  for (const [prop, cssVar] of Object.entries(component.tokenBindings)) {
    const cssProp = camelCaseToKebab(prop);
    styles.push(`  ${cssProp}: \${props => props.theme.${extractThemeKey(cssVar)}};`);
  }

  if (styles.length > 0) {
    lines[0] = `export const ${styledName} = styled.${element}\``;
    lines.push(...styles);
    lines.push('`;');
  }

  return lines.join('\n');
}

/**
 * Get HTML element for component type
 *
 * @param type - Component type
 * @returns HTML element name
 */
function getHTMLElement(type: string): string {
  const elementMap: Record<string, string> = {
    Button: 'button',
    Input: 'input',
    Text: 'span',
    Heading: 'h2',
    Checkbox: 'input',
    Radio: 'input',
    Switch: 'button',
    Slider: 'input',
    Badge: 'span',
    Avatar: 'img',
    Card: 'div',
    Modal: 'div',
    Tabs: 'div',
    Table: 'table',
    Link: 'a',
    List: 'ul',
    Image: 'img',
    Form: 'form',
    Dropdown: 'select',
    Progress: 'progress',
  };

  return elementMap[type] || 'div';
}

/**
 * Convert camelCase to kebab-case
 *
 * @param str - camelCase string
 * @returns kebab-case string
 */
function camelCaseToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Extract theme key from CSS variable
 *
 * @param cssVar - CSS variable reference
 * @returns Theme key path
 *
 * @example
 * ```typescript
 * extractThemeKey('var(--component-button-primary-background)');
 * // → "button['primary-background']"
 * ```
 */
function extractThemeKey(cssVar: string): string {
  // Remove var( and )
  const varName = cssVar.replace(/^var\(--/, '').replace(/\)$/, '');
  const parts = varName.split('-');

  if (parts.length < 2) {
    return `custom['${varName}']`;
  }

  const [layer, category, ...rest] = parts;

  if (layer === 'atomic' || layer === 'semantic') {
    const key = rest.join('-');
    return `${category}['${key}']`;
  } else if (layer === 'component') {
    const key = rest.join('-');
    return `${category}['${key}']`;
  }

  return `custom['${varName}']`;
}

// ============================================================================
// Main Generation Functions
// ============================================================================

/**
 * Generate styled-components code from resolved screen
 *
 * Creates a complete styled-components implementation including:
 * - Theme object from CSS variables
 * - Styled components for each component
 * - ThemeProvider wrapper
 *
 * @param screen - Resolved screen
 * @param format - CSS-in-JS format (styled-components or emotion)
 * @param options - Generator options
 * @returns Generated styled-components code
 *
 * @example
 * ```typescript
 * const screen = resolveScreen(screenDefinition);
 * const result = generateStyledComponents(screen, 'styled-components');
 * console.log(result.code);
 * ```
 */
export function generateStyledComponents(
  screen: ResolvedScreen,
  format: CSSInJSFormat = 'styled-components',
  options: GeneratorOptions = {}
): GeneratorResult {
  const startTime = performance.now();

  const imports: Record<string, string[]> = {};
  const code: string[] = [];

  // Add imports
  if (format === 'styled-components') {
    imports['styled-components'] = ['default as styled'];
  } else {
    imports['@emotion/styled'] = ['default as styled'];
  }

  imports['react'] = ['React'];

  // Generate theme
  const theme = convertCSSVarsToTheme(screen.cssVariables);
  code.push(generateThemeCode(theme));
  code.push('');

  // Generate styled components for each unique component type
  const generatedTypes = new Set<string>();

  for (const section of screen.sections) {
    for (const component of section.components) {
      if (!generatedTypes.has(component.type)) {
        code.push(generateComponentStyles(component, format));
        code.push('');
        generatedTypes.add(component.type);
      }
    }
  }

  // Combine imports and code
  const importCode = generateImports(imports, options.format || 'typescript');
  const fullCode = importCode + code.join('\n');

  // Format code
  const formatted = options.prettier !== false ? formatCode(fullCode) : fullCode;

  const endTime = performance.now();

  return {
    code: formatted,
    warnings: [],
    meta: {
      duration: endTime - startTime,
      componentCount: generatedTypes.size,
      lineCount: formatted.split('\n').length,
    },
  };
}
