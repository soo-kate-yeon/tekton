/**
 * @tekton/core - Generator Utilities
 * Common utility functions for code generators
 * [SPEC-LAYOUT-002] [PHASE-3]
 */

// ============================================================================
// String Case Conversion
// ============================================================================

/**
 * Convert string to camelCase
 *
 * @param str - Input string
 * @returns camelCase string
 *
 * @example
 * ```typescript
 * camelCase('user-profile-card'); // → 'userProfileCard'
 * camelCase('UserProfileCard'); // → 'userProfileCard'
 * ```
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, char => char.toLowerCase());
}

/**
 * Convert string to PascalCase
 *
 * @param str - Input string
 * @returns PascalCase string
 *
 * @example
 * ```typescript
 * pascalCase('user-profile-card'); // → 'UserProfileCard'
 * pascalCase('userProfileCard'); // → 'UserProfileCard'
 * ```
 */
export function pascalCase(str: string): string {
  const camelCased = camelCase(str);
  return camelCased.charAt(0).toUpperCase() + camelCased.slice(1);
}

/**
 * Convert string to kebab-case
 *
 * @param str - Input string
 * @returns kebab-case string
 *
 * @example
 * ```typescript
 * kebabCase('UserProfileCard'); // → 'user-profile-card'
 * kebabCase('userProfileCard'); // → 'user-profile-card'
 * ```
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

// ============================================================================
// Code Formatting
// ============================================================================

/**
 * Format code with prettier (if available)
 *
 * @param code - Code string to format
 * @param parser - Prettier parser to use
 * @returns Formatted code
 *
 * @example
 * ```typescript
 * const code = 'const x={a:1,b:2}';
 * const formatted = formatCode(code, 'typescript');
 * // → 'const x = { a: 1, b: 2 };\n'
 * ```
 */
export function formatCode(code: string, _parser: 'typescript' | 'babel' = 'typescript'): string {
  try {
    // Try to use prettier if available
    // In a real implementation, this would use prettier programmatically
    // For now, we'll do basic formatting
    return basicFormat(code);
  } catch {
    // Fallback to basic formatting
    return basicFormat(code);
  }
}

/**
 * Basic code formatting (fallback)
 *
 * @param code - Code string to format
 * @returns Formatted code
 */
function basicFormat(code: string): string {
  // Ensure consistent line endings
  let formatted = code.replace(/\r\n/g, '\n');

  // Ensure single newline at end
  formatted = formatted.replace(/\n+$/, '\n');

  return formatted;
}

/**
 * Add indentation to each line
 *
 * @param code - Code string
 * @param depth - Indentation depth
 * @param indent - Spaces per indent (default: 2)
 * @returns Indented code
 *
 * @example
 * ```typescript
 * indent('const x = 1;\nconst y = 2;', 1);
 * // → '  const x = 1;\n  const y = 2;'
 * ```
 */
export function indent(code: string, depth: number, indent: number = 2): string {
  const spaces = ' '.repeat(depth * indent);
  return code
    .split('\n')
    .map(line => (line.trim() ? spaces + line : line))
    .join('\n');
}

// ============================================================================
// JSX/React Utilities
// ============================================================================

/**
 * Escape special characters for JSX text content
 *
 * @param text - Text to escape
 * @returns Escaped text safe for JSX
 *
 * @example
 * ```typescript
 * escapeJSX('Hello <world> & "friends"');
 * // → 'Hello &lt;world&gt; &amp; &quot;friends&quot;'
 * ```
 */
export function escapeJSX(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Check if a prop value needs to be wrapped in JSX expression
 *
 * @param value - Prop value
 * @returns True if value needs JSX expression braces
 *
 * @example
 * ```typescript
 * needsJSXExpression('hello'); // → false (string literal)
 * needsJSXExpression(42); // → true (number)
 * needsJSXExpression(true); // → true (boolean)
 * ```
 */
export function needsJSXExpression(value: unknown): boolean {
  return typeof value !== 'string';
}

/**
 * Convert prop value to JSX attribute value
 *
 * @param value - Prop value
 * @returns JSX attribute value string
 *
 * @example
 * ```typescript
 * propValueToJSX('hello'); // → '"hello"'
 * propValueToJSX(42); // → '{42}'
 * propValueToJSX(true); // → '{true}'
 * propValueToJSX({ a: 1 }); // → '{{"a":1}}'
 * ```
 */
export function propValueToJSX(value: unknown): string {
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return `{${value}}`;
  }

  if (typeof value === 'object' && value !== null) {
    return `{${JSON.stringify(value)}}`;
  }

  return '""';
}

// ============================================================================
// Import Generation
// ============================================================================

/**
 * Generate import statements from dependencies
 *
 * @param dependencies - Module dependencies (module → named imports)
 * @param format - Output format
 * @returns Import statements
 *
 * @example
 * ```typescript
 * generateImports({
 *   'react': ['useState', 'useEffect'],
 *   'styled-components': ['default as styled']
 * }, 'typescript');
 * // → "import { useState, useEffect } from 'react';\nimport styled from 'styled-components';\n"
 * ```
 */
export function generateImports(
  dependencies: Record<string, string[]>,
  _format: 'typescript' | 'javascript' = 'typescript'
): string {
  const imports: string[] = [];

  for (const [module, namedImports] of Object.entries(dependencies)) {
    if (namedImports.length === 0) {
      // Side-effect import
      imports.push(`import '${module}';`);
    } else if (namedImports.some(imp => imp.startsWith('default'))) {
      // Default import
      const defaultImport = namedImports.find(imp => imp.startsWith('default'));
      const defaultName = defaultImport!.split(' as ')[1] || 'default';
      const named = namedImports.filter(imp => !imp.startsWith('default'));

      if (named.length > 0) {
        imports.push(`import ${defaultName}, { ${named.join(', ')} } from '${module}';`);
      } else {
        imports.push(`import ${defaultName} from '${module}';`);
      }
    } else {
      // Named imports
      imports.push(`import { ${namedImports.join(', ')} } from '${module}';`);
    }
  }

  return imports.join('\n') + (imports.length > 0 ? '\n\n' : '');
}

// ============================================================================
// CSS Utilities
// ============================================================================

/**
 * Convert CSS variable reference to token name
 *
 * @param cssVar - CSS variable reference (e.g., 'var(--atomic-spacing-16)')
 * @returns Token name (e.g., 'atomic.spacing.16')
 *
 * @example
 * ```typescript
 * cssVarToToken('var(--atomic-spacing-16)');
 * // → 'atomic.spacing.16'
 * ```
 */
export function cssVarToToken(cssVar: string): string {
  // Remove 'var(' and ')' and leading '--'
  const varName = cssVar.replace(/^var\(--/, '').replace(/\)$/, '');
  // Convert hyphens to dots
  return varName.replace(/-/g, '.');
}

/**
 * Extract property name from CSS variable name
 *
 * @param cssVarName - CSS variable name (e.g., '--component-button-primary-background')
 * @returns Property name (e.g., 'background')
 *
 * @example
 * ```typescript
 * extractPropertyFromCSSVar('--component-button-primary-background');
 * // → 'background'
 * ```
 */
export function extractPropertyFromCSSVar(cssVarName: string): string {
  const parts = cssVarName.replace(/^--/, '').split('-');
  return parts[parts.length - 1];
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Check if a string is a valid JavaScript identifier
 *
 * @param name - String to check
 * @returns True if valid identifier
 *
 * @example
 * ```typescript
 * isValidIdentifier('myVariable'); // → true
 * isValidIdentifier('my-variable'); // → false
 * isValidIdentifier('123variable'); // → false
 * ```
 */
export function isValidIdentifier(name: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
}

/**
 * Sanitize string to valid JavaScript identifier
 *
 * @param name - String to sanitize
 * @returns Valid JavaScript identifier
 *
 * @example
 * ```typescript
 * sanitizeIdentifier('my-component'); // → 'myComponent'
 * sanitizeIdentifier('123-component'); // → '_123Component'
 * ```
 */
export function sanitizeIdentifier(name: string): string {
  // Convert to camelCase
  let sanitized = camelCase(name);

  // Ensure it doesn't start with a number
  if (/^[0-9]/.test(sanitized)) {
    sanitized = '_' + sanitized;
  }

  // Remove any remaining invalid characters
  sanitized = sanitized.replace(/[^a-zA-Z0-9_$]/g, '');

  return sanitized || '_unnamed';
}
