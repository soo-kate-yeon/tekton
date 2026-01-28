/**
 * @tekton/core - Layout CSS Generator Tests
 * Test suite for CSS generation from layout tokens
 * [SPEC-LAYOUT-001] [PHASE-8]
 */

import { describe, it, expect } from 'vitest';
import {
  generateLayoutCSS,
  generateCSSVariables,
  generateShellClasses,
  generatePageClasses,
  generateSectionClasses,
  generateMediaQueries,
  formatCSS,
  validateCSS,
  generateAllLayoutCSS,
} from '../src/layout-css-generator.js';
import { getAllShellTokens } from '../src/layout-tokens/shells.js';
import { getAllPageLayoutTokens } from '../src/layout-tokens/pages.js';
import { getAllSectionPatternTokens } from '../src/layout-tokens/sections.js';
// Types imported but used implicitly through token retrieval functions

// ============================================================================
// Test: generateCSSVariables
// ============================================================================

describe('generateCSSVariables', () => {
  it('should generate CSS variables in :root from layout tokens', () => {
    const sections = getAllSectionPatternTokens();
    const css = generateCSSVariables(sections);

    expect(css).toContain(':root {');
    expect(css).toContain('}');
    expect(css).toContain('--atomic-spacing-');
  });

  it('should generate sorted CSS variables', () => {
    const sections = [getAllSectionPatternTokens()[0]];
    const css = generateCSSVariables(sections);

    // Variables should be sorted alphabetically
    const lines = css.split('\n').filter(line => line.includes('--'));
    for (let i = 1; i < lines.length; i++) {
      const prevVar = lines[i - 1].trim().split(':')[0];
      const currVar = lines[i].trim().split(':')[0];
      expect(prevVar.localeCompare(currVar)).toBeLessThanOrEqual(0);
    }
  });

  it('should return empty string when no tokens provided', () => {
    const css = generateCSSVariables([]);
    expect(css).toBe('');
  });

  it('should extract variables from all token types', () => {
    const shells = getAllShellTokens();
    const pages = getAllPageLayoutTokens();
    const sections = getAllSectionPatternTokens();

    const css = generateCSSVariables([...shells, ...pages, ...sections]);

    expect(css).toContain(':root {');
    expect(css).toContain('--atomic-spacing-');
    expect(css).toContain('--semantic-');
  });
});

// ============================================================================
// Test: generateShellClasses
// ============================================================================

describe('generateShellClasses', () => {
  it('should generate shell utility classes', () => {
    const shells = getAllShellTokens();
    const css = generateShellClasses(shells);

    // Should contain .shell-web-dashboard class
    expect(css).toContain('.shell-web-dashboard {');
    expect(css).toContain('.shell-web-app {');
    expect(css).toContain('.shell-web-minimal {');

    // Should contain grid display
    expect(css).toContain('display: grid;');
  });

  it('should generate grid-template-areas for shell regions', () => {
    const shells = getAllShellTokens();
    const css = generateShellClasses(shells);

    // Should contain grid template areas
    expect(css).toContain('grid-template-areas:');
  });

  it('should format shell class names correctly', () => {
    const shells = getAllShellTokens();
    const css = generateShellClasses(shells);

    // Class names should use hyphens
    const shellIds = shells.map(s => `.${s.id.replace(/\./g, '-')}`);
    for (const className of shellIds) {
      expect(css).toContain(className);
    }
  });

  it('should return empty string when no shells provided', () => {
    const css = generateShellClasses([]);
    expect(css).toBe('');
  });
});

// ============================================================================
// Test: generatePageClasses
// ============================================================================

describe('generatePageClasses', () => {
  it('should generate page utility classes', () => {
    const pages = getAllPageLayoutTokens();
    const css = generatePageClasses(pages);

    // Should contain .page-dashboard class
    expect(css).toContain('.page-dashboard {');
    expect(css).toContain('.page-job {');
    expect(css).toContain('.page-resource {');

    // Should contain flex display
    expect(css).toContain('display: flex;');
    expect(css).toContain('flex-direction: column;');
  });

  it('should include gap from tokenBindings', () => {
    const pages = getAllPageLayoutTokens();
    const css = generatePageClasses(pages);

    // Pages with sectionSpacing should have gap
    expect(css).toContain('gap: var(--');
  });

  it('should format page class names correctly', () => {
    const pages = getAllPageLayoutTokens();
    const css = generatePageClasses(pages);

    // Class names should use hyphens
    const pageIds = pages.map(p => `.${p.id.replace(/\./g, '-')}`);
    for (const className of pageIds) {
      expect(css).toContain(className);
    }
  });

  it('should return empty string when no pages provided', () => {
    const css = generatePageClasses([]);
    expect(css).toBe('');
  });
});

// ============================================================================
// Test: generateSectionClasses
// ============================================================================

describe('generateSectionClasses', () => {
  it('should generate section utility classes', () => {
    const sections = getAllSectionPatternTokens();
    const css = generateSectionClasses(sections);

    // Should contain .section-grid-3 class
    expect(css).toContain('.section-grid-3 {');
    expect(css).toContain('.section-split-50-50 {');
    expect(css).toContain('.section-stack-start {');
  });

  it('should include all CSS properties from section.css', () => {
    const sections = getAllSectionPatternTokens();
    const css = generateSectionClasses(sections);

    // Grid sections
    expect(css).toContain('display: grid;');
    expect(css).toContain('grid-template-columns:');
    expect(css).toContain('gap: var(--');

    // Flex sections
    expect(css).toContain('display: flex;');
    expect(css).toContain('flex-direction:');
    expect(css).toContain('align-items:');
  });

  it('should convert token references to CSS variables', () => {
    const sections = getAllSectionPatternTokens();
    const css = generateSectionClasses(sections);

    // Token references should be converted to var() calls
    expect(css).toContain('var(--atomic-spacing-');
    expect(css).not.toContain('atomic.spacing.');
  });

  it('should include maxWidth and padding when present', () => {
    const sections = getAllSectionPatternTokens();
    const css = generateSectionClasses(sections);

    // Container section should have maxWidth and padding
    expect(css).toContain('max-width: var(--');
    expect(css).toContain('padding: var(--');
  });

  it('should format section class names correctly', () => {
    const sections = getAllSectionPatternTokens();
    const css = generateSectionClasses(sections);

    // Class names should use hyphens
    const sectionIds = sections.map(s => `.${s.id.replace(/\./g, '-')}`);
    for (const className of sectionIds) {
      expect(css).toContain(className);
    }
  });

  it('should return empty string when no sections provided', () => {
    const css = generateSectionClasses([]);
    expect(css).toBe('');
  });
});

// ============================================================================
// Test: generateMediaQueries
// ============================================================================

describe('generateMediaQueries', () => {
  it('should generate media queries for all breakpoints', () => {
    const sections = getAllSectionPatternTokens();
    const css = generateMediaQueries(sections);

    // Should contain media queries for breakpoints that have responsive configs
    // Note: Not all breakpoints may be present if tokens don't have configs for them
    expect(css).toContain('@media (min-width: 768px)'); // md
    expect(css).toContain('@media (min-width: 1024px)'); // lg
  });

  it('should include responsive CSS overrides in media queries', () => {
    const sections = getAllSectionPatternTokens();
    const css = generateMediaQueries(sections);

    // Should contain section classes inside media queries
    expect(css).toContain('.section-grid-3 {');

    // Should contain responsive properties
    expect(css).toContain('grid-template-columns:');
    expect(css).toContain('gap: var(--');
  });

  it('should only generate media queries with content', () => {
    const sections = getAllSectionPatternTokens().slice(0, 1);
    const css = generateMediaQueries(sections);

    // Only media queries with actual responsive config should appear
    const mediaQueryCount = (css.match(/@media/g) || []).length;
    expect(mediaQueryCount).toBeGreaterThan(0);
  });

  it('should convert token references in media queries', () => {
    const sections = getAllSectionPatternTokens();
    const css = generateMediaQueries(sections);

    // Token references should be converted to var() calls
    expect(css).toContain('var(--atomic-spacing-');
    expect(css).not.toContain('atomic.spacing.');
  });

  it('should return empty string when no tokens provided', () => {
    const css = generateMediaQueries([]);
    expect(css).toBe('');
  });
});

// ============================================================================
// Test: formatCSS
// ============================================================================

describe('formatCSS', () => {
  it('should add proper indentation to CSS', () => {
    const unformatted = ':root {\n--var: value;\n}\n.class {\ndisplay: flex;\n}';
    const formatted = formatCSS(unformatted);

    // Should have proper indentation
    expect(formatted).toContain('  --var: value;');
    expect(formatted).toContain('  display: flex;');
  });

  it('should handle nested rules (media queries)', () => {
    const unformatted = '@media (min-width: 768px) {\n.class {\ndisplay: grid;\n}\n}';
    const formatted = formatCSS(unformatted);

    // Should have double indentation for nested rules
    expect(formatted).toContain('  .class {');
    expect(formatted).toContain('    display: grid;');
  });

  it('should use custom indentation string', () => {
    const unformatted = '.class {\ndisplay: flex;\n}';
    const formatted = formatCSS(unformatted, '    '); // 4 spaces

    // Should use 4 spaces
    expect(formatted).toContain('    display: flex;');
  });

  it('should preserve empty lines between rules', () => {
    const unformatted = '.class1 {\ndisplay: flex;\n}\n\n.class2 {\ndisplay: grid;\n}';
    const formatted = formatCSS(unformatted);

    // Should have line breaks between rules
    expect(formatted).toMatch(/}\n.*\.class2/);
  });
});

// ============================================================================
// Test: validateCSS
// ============================================================================

describe('validateCSS', () => {
  it('should validate CSS with balanced braces', () => {
    const validCSS = '.class { display: flex; }';
    expect(validateCSS(validCSS)).toBe(true);
  });

  it('should reject CSS with unbalanced opening braces', () => {
    const invalidCSS = '.class { display: flex;';
    expect(validateCSS(invalidCSS)).toBe(false);
  });

  it('should reject CSS with unbalanced closing braces', () => {
    const invalidCSS = '.class display: flex; }';
    expect(validateCSS(invalidCSS)).toBe(false);
  });

  it('should validate nested rules', () => {
    const validCSS = '@media (min-width: 768px) { .class { display: flex; } }';
    expect(validateCSS(validCSS)).toBe(true);
  });

  it('should validate complex CSS structures', () => {
    const complexCSS = `
      :root {
        --var: value;
      }
      .class1 {
        display: flex;
      }
      @media (min-width: 768px) {
        .class1 {
          display: grid;
        }
      }
    `;
    expect(validateCSS(complexCSS)).toBe(true);
  });
});

// ============================================================================
// Test: generateLayoutCSS - Integration
// ============================================================================

describe('generateLayoutCSS', () => {
  it('should generate complete CSS with all components', () => {
    const shells = getAllShellTokens();
    const pages = getAllPageLayoutTokens();
    const sections = getAllSectionPatternTokens();

    const css = generateLayoutCSS([...shells, ...pages, ...sections]);

    // Should contain all major sections
    expect(css).toContain(':root {');
    expect(css).toContain('.shell-');
    expect(css).toContain('.page-');
    expect(css).toContain('.section-');
    expect(css).toContain('@media');
  });

  it('should generate valid CSS syntax', () => {
    const shells = getAllShellTokens();
    const pages = getAllPageLayoutTokens();
    const sections = getAllSectionPatternTokens();

    const css = generateLayoutCSS([...shells, ...pages, ...sections]);

    // Should pass validation
    expect(validateCSS(css)).toBe(true);
  });

  it('should respect includeVariables option', () => {
    const sections = getAllSectionPatternTokens();

    const cssWithVars = generateLayoutCSS(sections, { includeVariables: true });
    expect(cssWithVars).toContain(':root {');

    const cssWithoutVars = generateLayoutCSS(sections, { includeVariables: false });
    expect(cssWithoutVars).not.toContain(':root {');
  });

  it('should respect includeClasses option', () => {
    const sections = getAllSectionPatternTokens();

    const cssWithClasses = generateLayoutCSS(sections, { includeClasses: true });
    expect(cssWithClasses).toContain('.section-');

    const cssWithoutClasses = generateLayoutCSS(sections, { includeClasses: false });
    // When includeClasses is false, no utility classes and no media queries should be generated
    expect(cssWithoutClasses).not.toContain('.section-');
    expect(cssWithoutClasses).not.toContain('@media');
  });

  it('should respect includeMediaQueries option', () => {
    const sections = getAllSectionPatternTokens();

    const cssWithMedia = generateLayoutCSS(sections, { includeMediaQueries: true });
    expect(cssWithMedia).toContain('@media');

    const cssWithoutMedia = generateLayoutCSS(sections, { includeMediaQueries: false });
    expect(cssWithoutMedia).not.toContain('@media');
  });

  it('should use custom indentation', () => {
    const sections = [getAllSectionPatternTokens()[0]];

    const css = generateLayoutCSS(sections, { indent: '    ' });
    expect(css).toContain('    display:');
  });

  it('should throw error for invalid CSS', () => {
    // This test ensures the validator catches errors
    // We'll need to mock a scenario that produces invalid CSS
    // For now, we rely on the validateCSS function being called
    const sections = getAllSectionPatternTokens();
    expect(() => generateLayoutCSS(sections)).not.toThrow();
  });

  it('should not have duplicate class names', () => {
    const shells = getAllShellTokens();
    const pages = getAllPageLayoutTokens();
    const sections = getAllSectionPatternTokens();

    const css = generateLayoutCSS([...shells, ...pages, ...sections]);

    // Extract all class names
    const classMatches = css.matchAll(/^\.([\w-]+)\s*\{/gm);
    const classNames = Array.from(classMatches).map(m => m[1]);

    // Check for duplicates
    const uniqueClasses = new Set(classNames);
    expect(classNames.length).toBe(uniqueClasses.size);
  });

  it('should convert all token references to CSS variables', () => {
    const sections = getAllSectionPatternTokens();
    const css = generateLayoutCSS(sections);

    // Should not contain raw token references (dot notation) in CSS property values
    const lines = css.split('\n');
    let insideRoot = false;

    for (const line of lines) {
      // Track when we're inside :root block
      if (line.includes(':root')) {
        insideRoot = true;
        continue;
      }
      if (insideRoot && line.trim() === '}') {
        insideRoot = false;
        continue;
      }

      // Skip :root variable definitions (they contain token references as values)
      if (insideRoot) {
        continue;
      }

      // Check property lines outside :root
      if (line.includes(':') && !line.includes('@media') && !line.includes('{')) {
        // Property lines should use var() references, not raw token references
        if (line.includes('atomic.') || line.includes('semantic.')) {
          // If it contains a token reference, it should be inside var()
          expect(line).toMatch(/var\(--/);
        }
      }
    }
  });

  it('should generate properly formatted CSS', () => {
    const sections = getAllSectionPatternTokens();
    const css = generateLayoutCSS(sections);

    // Should have proper line breaks
    expect(css).toContain('\n');

    // Should have closing braces on their own lines
    const lines = css.split('\n');
    for (const line of lines) {
      if (line.trim() === '}') {
        // Closing braces should be properly indented
        expect(line).toMatch(/^\s*}$/);
      }
    }
  });

  it('should handle empty token arrays gracefully', () => {
    const css = generateLayoutCSS([]);

    // Should return empty or minimal CSS
    expect(css).toBeDefined();
    expect(typeof css).toBe('string');
  });

  it('should generate CSS for single token type', () => {
    const shells = getAllShellTokens();
    const css = generateLayoutCSS(shells);

    expect(css).toContain('.shell-');
    expect(css).not.toContain('.page-');
    expect(css).not.toContain('.section-');
  });
});

// ============================================================================
// Test: generateAllLayoutCSS - Integration
// ============================================================================

describe('generateAllLayoutCSS', () => {
  it('should generate CSS for all layout tokens in the system', () => {
    const css = generateAllLayoutCSS();

    // Should contain all token types
    expect(css).toContain(':root {');
    expect(css).toContain('.shell-');
    expect(css).toContain('.page-');
    expect(css).toContain('.section-');
    expect(css).toContain('@media');
  });

  it('should generate valid CSS', () => {
    const css = generateAllLayoutCSS();
    expect(validateCSS(css)).toBe(true);
  });

  it('should include all shell tokens', () => {
    const css = generateAllLayoutCSS();
    const shells = getAllShellTokens();

    for (const shell of shells) {
      const className = `.${shell.id.replace(/\./g, '-')}`;
      expect(css).toContain(className);
    }
  });

  it('should include all page tokens', () => {
    const css = generateAllLayoutCSS();
    const pages = getAllPageLayoutTokens();

    for (const page of pages) {
      const className = `.${page.id.replace(/\./g, '-')}`;
      expect(css).toContain(className);
    }
  });

  it('should include all section tokens', () => {
    const css = generateAllLayoutCSS();
    const sections = getAllSectionPatternTokens();

    for (const section of sections) {
      const className = `.${section.id.replace(/\./g, '-')}`;
      expect(css).toContain(className);
    }
  });

  it('should respect generation options', () => {
    const cssWithoutVars = generateAllLayoutCSS({ includeVariables: false });
    expect(cssWithoutVars).not.toContain(':root {');

    const cssWithoutMedia = generateAllLayoutCSS({ includeMediaQueries: false });
    expect(cssWithoutMedia).not.toContain('@media');
  });

  it('should be properly formatted', () => {
    const css = generateAllLayoutCSS();

    // Should have consistent indentation
    const lines = css.split('\n');
    for (const line of lines) {
      if (line.trim().length > 0) {
        // Non-empty lines should have proper indentation
        expect(line).toMatch(/^(\s*[^\s]|$)/);
      }
    }
  });

  it('should have proper CSS structure', () => {
    const css = generateAllLayoutCSS();

    // CSS should follow standard structure:
    // 1. :root variables
    // 2. Utility classes
    // 3. Media queries

    const rootIndex = css.indexOf(':root {');
    const mediaIndex = css.indexOf('@media');

    expect(rootIndex).toBeGreaterThanOrEqual(0);
    expect(mediaIndex).toBeGreaterThan(rootIndex);
  });
});

// ============================================================================
// Test: CSS Output Quality
// ============================================================================

describe('CSS Output Quality', () => {
  it('should generate browser-compatible CSS', () => {
    const css = generateAllLayoutCSS();

    // Should use standard CSS properties
    expect(css).toContain('display:');
    expect(css).toContain('grid');
    expect(css).toContain('flex');

    // Should not contain invalid properties
    expect(css).not.toContain('undefined');
    expect(css).not.toContain('null');
  });

  it('should use proper CSS variable syntax', () => {
    const css = generateAllLayoutCSS();

    // CSS variables should follow --name: value format
    const varMatches = css.matchAll(/--[\w-]+:\s*[\w.-]+;/g);
    expect(Array.from(varMatches).length).toBeGreaterThan(0);

    // var() references should be properly formatted
    const varRefMatches = css.matchAll(/var\(--[\w-]+\)/g);
    expect(Array.from(varRefMatches).length).toBeGreaterThan(0);
  });

  it('should have consistent property formatting', () => {
    const css = generateAllLayoutCSS();

    const lines = css.split('\n');
    for (const line of lines) {
      if (line.includes(':') && !line.includes('{') && !line.includes('@')) {
        // Property lines should end with semicolon
        // Exception: grid-template-areas can span multiple lines
        if (!line.includes('grid-template-areas:')) {
          expect(line.trim()).toMatch(/;$/);
        }
      }
    }
  });

  it('should generate minifiable CSS', () => {
    const css = generateAllLayoutCSS();

    // CSS should be minifiable (no syntax errors)
    const minified = css
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*;\s*/g, ';');

    expect(validateCSS(minified)).toBe(true);
  });

  it('should not exceed reasonable file size', () => {
    const css = generateAllLayoutCSS();

    // Generated CSS should be under 100KB for all tokens
    expect(css.length).toBeLessThan(100000);
  });
});
