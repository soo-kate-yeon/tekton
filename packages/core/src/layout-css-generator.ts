/**
 * @tekton/core - Layout CSS Generator
 * Generates CSS from layout tokens (shells, pages, sections)
 * [SPEC-LAYOUT-001] [PHASE-8]
 */

import type {
  ShellToken,
  PageLayoutToken,
  SectionPatternToken,
  SectionCSS,
} from './layout-tokens/types.js';
import { resolveTokenReference } from './layout-resolver.js';
import { getAllShellTokens } from './layout-tokens/shells.js';
import { getAllPageLayoutTokens } from './layout-tokens/pages.js';
import { getAllSectionPatternTokens } from './layout-tokens/sections.js';
import { BREAKPOINT_VALUES } from './layout-tokens/responsive.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Layout token union type - can be shell, page, or section
 */
export type LayoutToken = ShellToken | PageLayoutToken | SectionPatternToken;

/**
 * CSS generation options
 */
export interface CSSGenerationOptions {
  /** Include CSS custom properties in :root */
  includeVariables?: boolean;
  /** Include utility classes (.shell-*, .page-*, .section-*) */
  includeClasses?: boolean;
  /** Include responsive media queries */
  includeMediaQueries?: boolean;
  /** Indentation string for formatting */
  indent?: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Extract CSS variable references from token references in an object
 *
 * @param obj - Object to extract token references from
 * @returns Set of unique CSS variable names
 */
function extractCSSVariables(obj: unknown): Set<string> {
  const vars = new Set<string>();

  function traverse(value: unknown): void {
    if (typeof value === 'string' && /^[a-z]+\.[a-z-]+(\.[a-z0-9-]+)*$/.test(value)) {
      // This is a token reference - convert to CSS variable
      vars.add(resolveTokenReference(value));
    } else if (typeof value === 'object' && value !== null) {
      for (const prop of Object.values(value)) {
        traverse(prop);
      }
    }
  }

  traverse(obj);
  return vars;
}

/**
 * Convert token reference to CSS var() function call
 *
 * @param ref - Token reference (e.g., "atomic.spacing.16")
 * @returns CSS var() function (e.g., "var(--atomic-spacing-16)")
 */
function tokenRefToVar(ref: string): string {
  return `var(${resolveTokenReference(ref)})`;
}

/**
 * Validate CSS syntax (balanced braces)
 *
 * @param css - CSS string to validate
 * @returns true if valid, false otherwise
 */
export function validateCSS(css: string): boolean {
  const openBraces = (css.match(/{/g) || []).length;
  const closeBraces = (css.match(/}/g) || []).length;
  return openBraces === closeBraces;
}

/**
 * Format CSS with proper indentation
 *
 * @param css - CSS string to format
 * @param indent - Indentation string (default: 2 spaces)
 * @returns Formatted CSS
 */
export function formatCSS(css: string, indent = '  '): string {
  let formatted = '';
  let indentLevel = 0;
  let inMediaQuery = false;

  // Split by lines and process each
  const lines = css
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  for (const line of lines) {
    // Decrease indent for closing braces
    if (line === '}') {
      indentLevel--;
      if (inMediaQuery && indentLevel === 0) {
        inMediaQuery = false;
      }
    }

    // Add indented line
    formatted += indent.repeat(indentLevel) + line + '\n';

    // Increase indent for opening braces
    if (line.endsWith('{')) {
      indentLevel++;
      if (line.startsWith('@media')) {
        inMediaQuery = true;
      }
    }
  }

  return formatted;
}

// ============================================================================
// CSS Generation Functions
// ============================================================================

/**
 * Generate CSS custom properties in :root from layout tokens
 *
 * @param tokens - Array of layout tokens
 * @returns CSS :root block with custom properties
 */
export function generateCSSVariables(tokens: LayoutToken[]): string {
  const vars = new Set<string>();

  // Extract all CSS variables from all tokens
  for (const token of tokens) {
    const tokenVars = extractCSSVariables(token);
    tokenVars.forEach(v => vars.add(v));
  }

  if (vars.size === 0) {
    return '';
  }

  // Generate :root block
  let css = ':root {\n';

  // Sort variables for consistent output
  const sortedVars = Array.from(vars).sort();

  for (const cssVar of sortedVars) {
    // Extract original token reference from CSS variable name
    // --atomic-spacing-16 → atomic.spacing.16
    const tokenRef = cssVar.replace(/^--/, '').replace(/-/g, '.');
    css += `  ${cssVar}: ${tokenRef};\n`;
  }

  css += '}\n';

  return css;
}

/**
 * Generate utility classes for shell tokens
 *
 * @param shells - Array of shell tokens
 * @returns CSS classes for shells
 */
export function generateShellClasses(shells: ShellToken[]): string {
  let css = '';

  for (const shell of shells) {
    // Generate class name: .shell-{platform}-{name}
    // shell.web.dashboard → .shell-web-dashboard
    const className = shell.id.replace(/\./g, '-');

    css += `.${className} {\n`;
    css += `  display: grid;\n`;

    // Generate grid template areas based on regions
    const areas: string[] = [];
    const positions = new Map<string, string[]>();

    // Group regions by position
    for (const region of shell.regions) {
      const pos = region.position;
      if (!positions.has(pos)) {
        positions.set(pos, []);
      }
      positions.get(pos)!.push(region.name);
    }

    // Build grid template areas
    // Example: "header header" "sidebar main"
    if (positions.has('top')) {
      const topRegions = positions.get('top')!;
      areas.push(`"${topRegions.join(' ')}"`);
    }

    // Middle row with left, center, right
    const middleRow: string[] = [];
    if (positions.has('left')) {
      middleRow.push(...positions.get('left')!);
    }
    if (positions.has('center')) {
      middleRow.push(...positions.get('center')!);
    }
    if (positions.has('right')) {
      middleRow.push(...positions.get('right')!);
    }
    if (middleRow.length > 0) {
      areas.push(`"${middleRow.join(' ')}"`);
    }

    if (positions.has('bottom')) {
      const bottomRegions = positions.get('bottom')!;
      areas.push(`"${bottomRegions.join(' ')}"`);
    }

    if (areas.length > 0) {
      css += `  grid-template-areas:\n`;
      for (const area of areas) {
        css += `    ${area}\n`;
      }
    }

    css += `}\n\n`;
  }

  return css;
}

/**
 * Generate utility classes for page tokens
 *
 * @param pages - Array of page layout tokens
 * @returns CSS classes for pages
 */
export function generatePageClasses(pages: PageLayoutToken[]): string {
  let css = '';

  for (const page of pages) {
    // Generate class name: .page-{name}
    // page.dashboard → .page-dashboard
    const className = page.id.replace(/\./g, '-');

    css += `.${className} {\n`;
    css += `  display: flex;\n`;
    css += `  flex-direction: column;\n`;

    // Add gap if specified in tokenBindings
    if (page.tokenBindings.sectionSpacing) {
      const gapVar = tokenRefToVar(page.tokenBindings.sectionSpacing as string);
      css += `  gap: ${gapVar};\n`;
    }

    css += `}\n\n`;
  }

  return css;
}

/**
 * Generate utility classes for section pattern tokens
 *
 * @param sections - Array of section pattern tokens
 * @returns CSS classes for sections
 */
export function generateSectionClasses(sections: SectionPatternToken[]): string {
  let css = '';

  for (const section of sections) {
    // Generate class name: .section-{pattern}
    // section.grid-3 → .section-grid-3
    const className = section.id.replace(/\./g, '-');

    css += `.${className} {\n`;

    // Add CSS properties from section.css
    const sectionCSS = section.css;

    if (sectionCSS.display) {
      css += `  display: ${sectionCSS.display};\n`;
    }

    if (sectionCSS.gridTemplateColumns) {
      css += `  grid-template-columns: ${sectionCSS.gridTemplateColumns};\n`;
    }

    if (sectionCSS.gridTemplateRows) {
      css += `  grid-template-rows: ${sectionCSS.gridTemplateRows};\n`;
    }

    if (sectionCSS.gap) {
      const gapValue = tokenRefToVar(sectionCSS.gap);
      css += `  gap: ${gapValue};\n`;
    }

    if (sectionCSS.flexDirection) {
      css += `  flex-direction: ${sectionCSS.flexDirection};\n`;
    }

    if (sectionCSS.alignItems) {
      css += `  align-items: ${sectionCSS.alignItems};\n`;
    }

    if (sectionCSS.justifyContent) {
      css += `  justify-content: ${sectionCSS.justifyContent};\n`;
    }

    if (sectionCSS.maxWidth) {
      const maxWidthValue = tokenRefToVar(sectionCSS.maxWidth);
      css += `  max-width: ${maxWidthValue};\n`;
    }

    if (sectionCSS.padding) {
      const paddingValue = tokenRefToVar(sectionCSS.padding);
      css += `  padding: ${paddingValue};\n`;
    }

    css += `}\n\n`;
  }

  return css;
}

/**
 * Generate responsive media queries for all breakpoints
 *
 * @param tokens - Array of layout tokens
 * @returns CSS media queries
 */
export function generateMediaQueries(tokens: LayoutToken[]): string {
  let css = '';

  // Breakpoint names in order
  const breakpoints: Array<'sm' | 'md' | 'lg' | 'xl' | '2xl'> = ['sm', 'md', 'lg', 'xl', '2xl'];

  for (const bp of breakpoints) {
    const minWidth = BREAKPOINT_VALUES[bp];
    let mediaQueryContent = '';

    // Process each token
    for (const token of tokens) {
      // Get responsive config for this breakpoint
      const responsiveConfig = token.responsive[bp];
      if (!responsiveConfig || Object.keys(responsiveConfig).length === 0) {
        continue;
      }

      // Generate class name based on token type
      let className = '';
      if ('platform' in token) {
        // ShellToken
        className = token.id.replace(/\./g, '-');
      } else if ('purpose' in token) {
        // PageLayoutToken
        className = token.id.replace(/\./g, '-');
      } else if ('type' in token) {
        // SectionPatternToken
        const sectionToken = token as SectionPatternToken;
        className = sectionToken.id.replace(/\./g, '-');

        // Generate section CSS for this breakpoint
        const responsiveCss = responsiveConfig as Partial<SectionCSS>;

        if (Object.keys(responsiveCss).length > 0) {
          mediaQueryContent += `  .${className} {\n`;

          if (responsiveCss.display) {
            mediaQueryContent += `    display: ${responsiveCss.display};\n`;
          }

          if (responsiveCss.gridTemplateColumns) {
            mediaQueryContent += `    grid-template-columns: ${responsiveCss.gridTemplateColumns};\n`;
          }

          if (responsiveCss.gridTemplateRows) {
            mediaQueryContent += `    grid-template-rows: ${responsiveCss.gridTemplateRows};\n`;
          }

          if (responsiveCss.gap) {
            const gapValue = tokenRefToVar(responsiveCss.gap);
            mediaQueryContent += `    gap: ${gapValue};\n`;
          }

          if (responsiveCss.flexDirection) {
            mediaQueryContent += `    flex-direction: ${responsiveCss.flexDirection};\n`;
          }

          if (responsiveCss.alignItems) {
            mediaQueryContent += `    align-items: ${responsiveCss.alignItems};\n`;
          }

          if (responsiveCss.justifyContent) {
            mediaQueryContent += `    justify-content: ${responsiveCss.justifyContent};\n`;
          }

          if (responsiveCss.maxWidth) {
            const maxWidthValue = tokenRefToVar(responsiveCss.maxWidth);
            mediaQueryContent += `    max-width: ${maxWidthValue};\n`;
          }

          if (responsiveCss.padding) {
            const paddingValue = tokenRefToVar(responsiveCss.padding);
            mediaQueryContent += `    padding: ${paddingValue};\n`;
          }

          mediaQueryContent += `  }\n\n`;
        }
      }
    }

    // Only add media query if there's content
    if (mediaQueryContent.trim().length > 0) {
      css += `@media (min-width: ${minWidth}px) {\n`;
      css += mediaQueryContent;
      css += `}\n\n`;
    }
  }

  return css;
}

/**
 * Generate complete CSS from layout tokens
 *
 * @param tokens - Array of layout tokens (shells, pages, sections)
 * @param options - CSS generation options
 * @returns Complete CSS string with variables, utilities, and media queries
 *
 * @example
 * ```typescript
 * import { getAllShellTokens, getAllPageLayoutTokens, getAllSectionPatternTokens } from './layout-tokens/index.js';
 *
 * const shells = getAllShellTokens();
 * const pages = getAllPageLayoutTokens();
 * const sections = getAllSectionPatternTokens();
 *
 * const css = generateLayoutCSS([...shells, ...pages, ...sections]);
 * console.log(css);
 * ```
 */
export function generateLayoutCSS(
  tokens: LayoutToken[],
  options: CSSGenerationOptions = {}
): string {
  const {
    includeVariables = true,
    includeClasses = true,
    includeMediaQueries = true,
    indent = '  ',
  } = options;

  let css = '';

  // Separate tokens by type
  const shells = tokens.filter(t => 'platform' in t) as ShellToken[];
  const pages = tokens.filter(t => 'purpose' in t) as PageLayoutToken[];
  const sections = tokens.filter(t => 'type' in t) as SectionPatternToken[];

  // 1. Generate CSS variables
  if (includeVariables) {
    const variablesCSS = generateCSSVariables(tokens);
    if (variablesCSS) {
      css += variablesCSS + '\n';
    }
  }

  // 2. Generate utility classes
  if (includeClasses) {
    // Shell classes
    if (shells.length > 0) {
      const shellCSS = generateShellClasses(shells);
      if (shellCSS) {
        css += shellCSS;
      }
    }

    // Page classes
    if (pages.length > 0) {
      const pageCSS = generatePageClasses(pages);
      if (pageCSS) {
        css += pageCSS;
      }
    }

    // Section classes
    if (sections.length > 0) {
      const sectionCSS = generateSectionClasses(sections);
      if (sectionCSS) {
        css += sectionCSS;
      }
    }
  }

  // 3. Generate responsive media queries (only if includeClasses is true)
  if (includeMediaQueries && includeClasses) {
    const mediaCSS = generateMediaQueries(tokens);
    if (mediaCSS) {
      css += mediaCSS;
    }
  }

  // 4. Format CSS with proper indentation
  const formatted = formatCSS(css, indent);

  // 5. Validate CSS syntax
  if (!validateCSS(formatted)) {
    throw new Error('Generated CSS has unbalanced braces');
  }

  return formatted;
}

/**
 * Generate CSS for all layout tokens in the system
 *
 * @param options - CSS generation options
 * @returns Complete CSS for all shells, pages, and sections
 *
 * @example
 * ```typescript
 * const css = generateAllLayoutCSS();
 * // Write to file or use in application
 * ```
 */
export function generateAllLayoutCSS(options: CSSGenerationOptions = {}): string {
  const shells = getAllShellTokens();
  const pages = getAllPageLayoutTokens();
  const sections = getAllSectionPatternTokens();

  return generateLayoutCSS([...shells, ...pages, ...sections], options);
}
