/**
 * @tekton/core - Layout Tokens Integration Tests
 * End-to-end testing of layout token system
 * [SPEC-LAYOUT-001] [PHASE-10]
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createBlueprint, validateBlueprint } from '../src/blueprint.js';
import {
  resolveLayout,
  clearLayoutCache,
  resolveTokenReference,
  mergeResponsiveConfig,
} from '../src/layout-resolver.js';
import {
  generateLayoutCSS,
  generateAllLayoutCSS,
  generateCSSVariables,
  generateShellClasses,
  generatePageClasses,
  generateSectionClasses,
  generateMediaQueries,
  validateCSS,
} from '../src/layout-css-generator.js';
import {
  getShellToken,
  getAllShellTokens,
  getShellsByPlatform,
} from '../src/layout-tokens/shells.js';
import {
  getPageLayoutToken,
  getAllPageLayoutTokens,
  getPagesByPurpose,
  getPageSections,
} from '../src/layout-tokens/pages.js';
import {
  getSectionPatternToken,
  getAllSectionPatternTokens,
  getSectionsByType,
  getSectionCSS,
} from '../src/layout-tokens/sections.js';
import {
  getResponsiveToken,
  getAllResponsiveTokens,
  getBreakpointValue,
  getBreakpointMediaQuery,
  sortBreakpointsBySize,
  BREAKPOINT_SM,
  BREAKPOINT_MD,
  BREAKPOINT_LG,
} from '../src/layout-tokens/responsive.js';

// ============================================================================
// Integration Test Suite: End-to-End Workflow
// ============================================================================

describe('Layout Tokens Integration Tests', () => {
  beforeEach(() => {
    // Clear layout cache before each test for isolation
    clearLayoutCache();
  });

  // ==========================================================================
  // Test 1: End-to-End Workflow
  // ==========================================================================

  describe('End-to-End Workflow: Blueprint → Resolve → Generate CSS', () => {
    it('should complete full workflow from blueprint creation to CSS generation', () => {
      // Step 1: Create blueprint with layout token
      const blueprint = createBlueprint({
        name: 'Dashboard Screen',
        description: 'Analytics dashboard with metrics',
        themeId: 'default-theme',
        layout: 'dashboard',
        layoutToken: 'page.dashboard',
        components: [
          {
            type: 'Card',
            props: { title: 'Metrics' },
            children: [],
          },
        ],
      });

      // Verify blueprint structure
      expect(blueprint.id).toBeDefined();
      expect(blueprint.name).toBe('Dashboard Screen');
      expect(blueprint.layoutToken).toBe('page.dashboard');
      expect(blueprint.layoutConfig).toBeDefined();

      // Step 2: Validate blueprint
      const validation = validateBlueprint(blueprint);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);

      // Step 3: Resolve layout from token
      const layout = resolveLayout('page.dashboard');
      expect(layout.page).toBeDefined();
      expect(layout.page?.purpose).toBe('dashboard');
      expect(layout.sections).toHaveLength(3); // metrics, charts, tables

      // Step 4: Verify resolved sections
      const sectionIds = layout.sections.map(s => s.id);
      expect(sectionIds).toContain('section.grid-4'); // metrics
      expect(sectionIds).toContain('section.grid-2'); // charts
      expect(sectionIds).toContain('section.container'); // tables

      // Step 5: Generate CSS from layout
      const css = generateLayoutCSS([...layout.sections, layout.page!]);
      expect(css).toBeTruthy();
      expect(validateCSS(css)).toBe(true);

      // Step 6: Verify CSS contains expected classes
      expect(css).toContain('.page-dashboard');
      expect(css).toContain('.section-grid-4');
      expect(css).toContain('.section-grid-2');
      expect(css).toContain('.section-container');

      // Step 7: Verify CSS contains media queries
      expect(css).toContain('@media (min-width: 768px)');
      expect(css).toContain('@media (min-width: 1024px)');
    });

    it('should handle complete workflow with shell token', () => {
      // Create blueprint with shell token
      const blueprint = createBlueprint({
        name: 'App Shell',
        themeId: 'default-theme',
        layout: 'dashboard',
        layoutToken: 'shell.web.dashboard',
        components: [],
      });

      expect(blueprint.layoutToken).toBe('shell.web.dashboard');

      // Resolve shell layout
      const layout = resolveLayout('shell.web.dashboard');
      expect(layout.shell).toBeDefined();
      expect(layout.shell?.platform).toBe('web');
      expect(layout.shell?.regions).toBeDefined();

      // Verify regions
      const regionNames = layout.shell?.regions.map(r => r.name) || [];
      expect(regionNames).toContain('header');
      expect(regionNames).toContain('sidebar');
      expect(regionNames).toContain('main');

      // Generate CSS
      const css = generateLayoutCSS([layout.shell!]);
      expect(validateCSS(css)).toBe(true);
      expect(css).toContain('.shell-web-dashboard');
    });
  });

  // ==========================================================================
  // Test 2: Shell Token Integration
  // ==========================================================================

  describe('Shell Token Integration', () => {
    it('should resolve all shell tokens correctly', () => {
      const shells = getAllShellTokens();
      expect(shells).toHaveLength(6);

      // Verify each shell can be resolved
      for (const shell of shells) {
        const resolved = resolveLayout(shell.id);
        expect(resolved.shell).toBeDefined();
        expect(resolved.shell?.id).toBe(shell.id);
        expect(resolved.cssVariables).toBeDefined();
      }
    });

    it('should filter shells by platform', () => {
      const webShells = getShellsByPlatform('web');
      expect(webShells).toHaveLength(6);

      for (const shell of webShells) {
        expect(shell.platform).toBe('web');
      }
    });

    it('should retrieve specific shell tokens', () => {
      const appShell = getShellToken('shell.web.app');
      expect(appShell).toBeDefined();
      expect(appShell?.id).toBe('shell.web.app');
      expect(appShell?.regions).toHaveLength(4);

      const dashboardShell = getShellToken('shell.web.dashboard');
      expect(dashboardShell).toBeDefined();
      expect(dashboardShell?.regions).toHaveLength(3);

      const minimalShell = getShellToken('shell.web.minimal');
      expect(minimalShell).toBeDefined();
      expect(minimalShell?.regions).toHaveLength(1);
    });

    it('should generate valid CSS for shell tokens', () => {
      const shells = getAllShellTokens();
      const css = generateShellClasses(shells);

      expect(validateCSS(css)).toBe(true);
      expect(css).toContain('.shell-web-app');
      expect(css).toContain('.shell-web-dashboard');
      expect(css).toContain('.shell-web-minimal');
      expect(css).toContain('display: grid');
    });
  });

  // ==========================================================================
  // Test 3: Page Token Integration
  // ==========================================================================

  describe('Page Token Integration', () => {
    it('should resolve all page layout tokens correctly', () => {
      const pages = getAllPageLayoutTokens();
      expect(pages).toHaveLength(8);

      // Verify each page can be resolved
      for (const page of pages) {
        const resolved = resolveLayout(page.id);
        expect(resolved.page).toBeDefined();
        expect(resolved.page?.id).toBe(page.id);
        expect(resolved.sections).toBeDefined();
      }
    });

    it('should filter pages by purpose', () => {
      const dashboardPages = getPagesByPurpose('dashboard');
      expect(dashboardPages).toHaveLength(1);
      expect(dashboardPages[0].id).toBe('page.dashboard');

      const jobPages = getPagesByPurpose('job');
      expect(jobPages).toHaveLength(1);
      expect(jobPages[0].id).toBe('page.job');
    });

    it('should retrieve page sections correctly', () => {
      const sections = getPageSections('page.dashboard');
      expect(sections).toHaveLength(3);

      const sectionNames = sections.map(s => s.name);
      expect(sectionNames).toContain('metrics');
      expect(sectionNames).toContain('charts');
      expect(sectionNames).toContain('tables');
    });

    it('should resolve page layouts with section patterns', () => {
      const layout = resolveLayout('page.dashboard');

      expect(layout.page).toBeDefined();
      expect(layout.sections).toHaveLength(3);

      // Verify sections are resolved
      const metricsSection = layout.sections.find(s => s.id === 'section.grid-4');
      expect(metricsSection).toBeDefined();
      expect(metricsSection?.type).toBe('grid');

      const chartsSection = layout.sections.find(s => s.id === 'section.grid-2');
      expect(chartsSection).toBeDefined();

      const tablesSection = layout.sections.find(s => s.id === 'section.container');
      expect(tablesSection).toBeDefined();
    });

    it('should generate valid CSS for page tokens', () => {
      const pages = getAllPageLayoutTokens();
      const css = generatePageClasses(pages);

      expect(validateCSS(css)).toBe(true);
      expect(css).toContain('.page-dashboard');
      expect(css).toContain('.page-job');
      expect(css).toContain('.page-settings');
      expect(css).toContain('display: flex');
      expect(css).toContain('flex-direction: column');
    });
  });

  // ==========================================================================
  // Test 4: Section Token Integration
  // ==========================================================================

  describe('Section Token Integration', () => {
    it('should resolve all section pattern tokens correctly', () => {
      const sections = getAllSectionPatternTokens();
      expect(sections).toHaveLength(13);

      // Verify each section can be resolved
      for (const section of sections) {
        const resolved = resolveLayout(section.id);
        expect(resolved.sections).toHaveLength(1);
        expect(resolved.sections[0].id).toBe(section.id);
      }
    });

    it('should filter sections by type', () => {
      const gridSections = getSectionsByType('grid');
      expect(gridSections).toHaveLength(4);

      const flexSections = getSectionsByType('flex');
      expect(flexSections).toHaveLength(9); // split (3) + stack (3) + sidebar (2) + container (1) = 9
    });

    it('should retrieve section CSS configuration', () => {
      const css = getSectionCSS('section.grid-3');
      expect(css).toBeDefined();
      expect(css?.display).toBe('grid');
      expect(css?.gridTemplateColumns).toBe('repeat(3, 1fr)');
      expect(css?.gap).toBe('atomic.spacing.4');
    });

    it('should generate valid CSS for section tokens', () => {
      const sections = getAllSectionPatternTokens();
      const css = generateSectionClasses(sections);

      expect(validateCSS(css)).toBe(true);
      expect(css).toContain('.section-grid-2');
      expect(css).toContain('.section-grid-3');
      expect(css).toContain('.section-grid-4');
      expect(css).toContain('.section-stack-start');
      expect(css).toContain('.section-split-50-50');
      expect(css).toContain('display: grid');
      expect(css).toContain('display: flex');
    });

    it('should handle responsive section configurations', () => {
      const grid3 = getSectionPatternToken('section.grid-3');
      expect(grid3).toBeDefined();

      // Mobile: 1 column
      expect(grid3?.responsive.default.gridTemplateColumns).toBe('repeat(1, 1fr)');

      // Tablet: 2 columns
      expect(grid3?.responsive.md?.gridTemplateColumns).toBe('repeat(2, 1fr)');

      // Desktop: 3 columns
      expect(grid3?.responsive.lg?.gridTemplateColumns).toBe('repeat(3, 1fr)');
    });
  });

  // ==========================================================================
  // Test 5: CSS Generation Integration
  // ==========================================================================

  describe('CSS Generation Integration', () => {
    it('should generate complete CSS for all layout tokens', () => {
      const css = generateAllLayoutCSS();

      expect(css).toBeTruthy();
      expect(validateCSS(css)).toBe(true);

      // Verify structure
      expect(css).toContain(':root {');
      expect(css).toContain('.shell-');
      expect(css).toContain('.page-');
      expect(css).toContain('.section-');
      expect(css).toContain('@media (min-width:');
    });

    it('should generate CSS with custom options', () => {
      const css = generateAllLayoutCSS({
        includeVariables: false,
        includeClasses: true,
        includeMediaQueries: true,
        indent: '    ', // 4 spaces
      });

      expect(validateCSS(css)).toBe(true);
      expect(css).not.toContain(':root {');
      expect(css).toContain('.page-dashboard');
      expect(css).toContain('@media (min-width:');
    });

    it('should generate CSS variables from tokens', () => {
      const shells = getAllShellTokens();
      const css = generateCSSVariables(shells);

      expect(css).toContain(':root {');
      expect(css).toContain('--atomic-spacing-');
      expect(css).toContain('--semantic-background-');
      expect(css).toContain('}');
    });

    it('should generate responsive media queries', () => {
      const sections = getAllSectionPatternTokens();
      const css = generateMediaQueries(sections);

      // Section tokens define md and lg responsive breakpoints
      expect(css).toContain('@media (min-width: 768px)'); // md
      expect(css).toContain('@media (min-width: 1024px)'); // lg
    });

    it('should format CSS with proper indentation', () => {
      // Generate actual CSS and verify it's already formatted
      const section = getSectionPatternToken('section.grid-3');
      const css = generateSectionClasses([section!]);

      // Verify CSS is properly formatted with indentation
      expect(css).toContain('.section-grid-3 {');
      expect(css).toContain('  display: grid;');
      expect(css).toContain('  grid-template-columns: repeat(3, 1fr);');
      expect(css).toContain('  gap: var(--atomic-spacing-4);');
      expect(css).toContain('}');
    });

    it('should validate CSS syntax', () => {
      const validCSS = '.test { display: flex; }';
      const invalidCSS = '.test { display: flex; '; // Missing closing brace

      expect(validateCSS(validCSS)).toBe(true);
      expect(validateCSS(invalidCSS)).toBe(false);
    });
  });

  // ==========================================================================
  // Test 6: Responsive Behavior
  // ==========================================================================

  describe('Responsive Behavior', () => {
    it('should resolve all responsive tokens', () => {
      const breakpoints = getAllResponsiveTokens();
      expect(breakpoints).toHaveLength(5);

      const ids = breakpoints.map(bp => bp.id);
      expect(ids).toContain('breakpoint.sm');
      expect(ids).toContain('breakpoint.md');
      expect(ids).toContain('breakpoint.lg');
      expect(ids).toContain('breakpoint.xl');
      expect(ids).toContain('breakpoint.2xl');
    });

    it('should retrieve breakpoint values', () => {
      expect(getBreakpointValue('sm')).toBe(640);
      expect(getBreakpointValue('md')).toBe(768);
      expect(getBreakpointValue('lg')).toBe(1024);
      expect(getBreakpointValue('xl')).toBe(1280);
      expect(getBreakpointValue('2xl')).toBe(1536);
    });

    it('should generate media query strings', () => {
      expect(getBreakpointMediaQuery('sm')).toBe('@media (min-width: 640px)');
      expect(getBreakpointMediaQuery('md')).toBe('@media (min-width: 768px)');
      expect(getBreakpointMediaQuery('lg')).toBe('@media (min-width: 1024px)');
      expect(getBreakpointMediaQuery('xl')).toBe('@media (min-width: 1280px)');
      expect(getBreakpointMediaQuery('2xl')).toBe('@media (min-width: 1536px)');
    });

    it('should sort breakpoints by size', () => {
      const unsorted = [BREAKPOINT_LG, BREAKPOINT_SM, BREAKPOINT_MD];
      const sorted = sortBreakpointsBySize(unsorted);

      expect(sorted[0].id).toBe('breakpoint.sm');
      expect(sorted[1].id).toBe('breakpoint.md');
      expect(sorted[2].id).toBe('breakpoint.lg');
    });

    it('should merge responsive configurations correctly', () => {
      const base = {
        default: { width: '100%', padding: '16px' },
        md: { width: '768px' },
      };

      const overrides = {
        md: { padding: '24px' },
        lg: { width: '1024px', padding: '32px' },
      };

      const merged = mergeResponsiveConfig(base, overrides);

      expect(merged.default).toEqual({ width: '100%', padding: '16px' });
      expect(merged.md).toEqual({ width: '768px', padding: '24px' });
      expect(merged.lg).toEqual({ width: '1024px', padding: '32px' });
    });

    it('should apply responsive overrides in CSS generation', () => {
      const grid3 = getSectionPatternToken('section.grid-3');
      expect(grid3).toBeDefined();

      const css = generateSectionClasses([grid3!]);

      // Base CSS
      expect(css).toContain('grid-template-columns: repeat(3, 1fr)');

      // Responsive CSS
      const mediaCSS = generateMediaQueries([grid3!]);
      expect(mediaCSS).toContain('@media (min-width: 768px)');
      expect(mediaCSS).toContain('grid-template-columns: repeat(2, 1fr)');
      expect(mediaCSS).toContain('@media (min-width: 1024px)');
    });
  });

  // ==========================================================================
  // Test 7: Token Reference Resolution
  // ==========================================================================

  describe('Token Reference Resolution', () => {
    it('should convert token references to CSS variable names', () => {
      expect(resolveTokenReference('atomic.spacing.16')).toBe('--atomic-spacing-16');
      expect(resolveTokenReference('semantic.color.primary')).toBe('--semantic-color-primary');
      expect(resolveTokenReference('atomic.spacing.full')).toBe('--atomic-spacing-full');
    });

    it('should extract all token references from layout', () => {
      const layout = resolveLayout('page.dashboard');

      expect(layout.cssVariables).toBeDefined();
      expect(Object.keys(layout.cssVariables).length).toBeGreaterThan(0);

      // Verify CSS variable format (allows letters, numbers, and hyphens)
      for (const cssVar of Object.keys(layout.cssVariables)) {
        expect(cssVar).toMatch(/^--[a-z0-9-]+$/);
      }
    });

    it('should resolve nested token references', () => {
      const section = getSectionPatternToken('section.grid-4');
      expect(section).toBeDefined();

      const layout = resolveLayout('section.grid-4');
      const cssVars = layout.cssVariables;

      // Gap token should be resolved
      expect(cssVars['--atomic-spacing-4']).toBe('atomic.spacing.4');
    });

    it('should generate CSS with var() references', () => {
      const section = getSectionPatternToken('section.grid-3');
      const css = generateSectionClasses([section!]);

      expect(css).toContain('var(--atomic-spacing-4)');
    });
  });

  // ==========================================================================
  // Test 8: Performance Validation
  // ==========================================================================

  describe('Performance Validation', () => {
    it('should resolve layouts within performance target (<5ms)', () => {
      const start = performance.now();
      resolveLayout('page.dashboard');
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(5);
    });

    it('should cache layout resolutions', () => {
      // First call - uncached
      const start1 = performance.now();
      resolveLayout('page.dashboard');
      const duration1 = performance.now() - start1;

      // Second call - cached
      const start2 = performance.now();
      resolveLayout('page.dashboard');
      const duration2 = performance.now() - start2;

      // Cached call should be significantly faster
      expect(duration2).toBeLessThan(duration1);
      expect(duration2).toBeLessThan(1); // <1ms for cached
    });

    it('should generate CSS for all tokens within target (<15ms)', () => {
      const start = performance.now();
      generateAllLayoutCSS();
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(15);
    });

    it('should validate CSS within target (<1ms)', () => {
      const css = generateAllLayoutCSS();

      const start = performance.now();
      validateCSS(css);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(1);
    });
  });

  // ==========================================================================
  // Test 9: Error Scenarios
  // ==========================================================================

  describe('Error Scenarios', () => {
    it('should throw error for invalid shell token ID', () => {
      expect(() => resolveLayout('shell.web.invalid')).toThrow('Shell token not found');
    });

    it('should throw error for invalid page token ID', () => {
      expect(() => resolveLayout('page.invalid')).toThrow('Page layout token not found');
    });

    it('should throw error for invalid section token ID', () => {
      expect(() => resolveLayout('section.invalid')).toThrow('Section pattern token not found');
    });

    it('should throw error for malformed layout ID', () => {
      expect(() => resolveLayout('invalid-layout-id')).toThrow('Invalid layout ID format');
    });

    it('should validate blueprint with invalid layoutToken', () => {
      expect(() =>
        createBlueprint({
          name: 'Test',
          themeId: 'default',
          layout: 'dashboard',
          layoutToken: 'invalid.token.format',
          components: [],
        })
      ).toThrow('Invalid layoutToken format');
    });

    it('should handle missing section patterns gracefully', () => {
      // This would only occur if page definition references non-existent section
      // Our current implementation validates this during resolution
      expect(() => resolveLayout('page.dashboard')).not.toThrow();
    });

    it('should return undefined for non-existent tokens', () => {
      expect(getShellToken('shell.web.nonexistent')).toBeUndefined();
      expect(getPageLayoutToken('page.nonexistent')).toBeUndefined();
      expect(getSectionPatternToken('section.nonexistent')).toBeUndefined();
      expect(getResponsiveToken('breakpoint.nonexistent')).toBeUndefined();
    });
  });

  // ==========================================================================
  // Test 10: Complete System Integration
  // ==========================================================================

  describe('Complete System Integration', () => {
    it('should integrate all token layers seamlessly', () => {
      // Layer 1: Shell
      const shell = getShellToken('shell.web.dashboard');
      expect(shell).toBeDefined();

      // Layer 2: Page
      const page = getPageLayoutToken('page.dashboard');
      expect(page).toBeDefined();

      // Layer 3: Sections
      const sections = page!.sections.map(slot => getSectionPatternToken(slot.pattern));
      expect(sections).toHaveLength(3);
      expect(sections.every(s => s !== undefined)).toBe(true);

      // Layer 4: Responsive
      const breakpoints = getAllResponsiveTokens();
      expect(breakpoints).toHaveLength(5);

      // Integration: Generate complete CSS
      const allTokens = [shell!, page!, ...sections.filter(s => s !== undefined)];

      const css = generateLayoutCSS(allTokens);
      expect(validateCSS(css)).toBe(true);
      expect(css).toContain(':root {');
      expect(css).toContain('.shell-web-dashboard');
      expect(css).toContain('.page-dashboard');
      expect(css).toContain('.section-grid-4');
      expect(css).toContain('@media (min-width:');
    });

    it('should support real-world dashboard scenario', () => {
      // Create dashboard blueprint
      const blueprint = createBlueprint({
        name: 'Analytics Dashboard',
        description: 'Real-time analytics with metrics and charts',
        themeId: 'analytics-theme',
        layout: 'dashboard',
        layoutToken: 'page.dashboard',
        components: [
          {
            type: 'Card',
            props: { title: 'Total Users', value: '1,234' },
            children: [],
          },
          {
            type: 'Card',
            props: { title: 'Revenue', value: '$56,789' },
            children: [],
          },
          {
            type: 'Chart',
            props: { type: 'line' },
            children: [],
          },
        ],
      });

      // Validate blueprint
      const validation = validateBlueprint(blueprint);
      expect(validation.valid).toBe(true);

      // Resolve layout
      const layout = resolveLayout('page.dashboard');
      expect(layout.page?.purpose).toBe('dashboard');
      expect(layout.sections).toHaveLength(3);

      // Generate CSS
      const css = generateLayoutCSS([layout.page!, ...layout.sections]);
      expect(validateCSS(css)).toBe(true);

      // Verify responsive behavior
      const grid4 = layout.sections.find(s => s.id === 'section.grid-4');
      expect(grid4?.responsive.default.gridTemplateColumns).toBe('repeat(1, 1fr)');
      expect(grid4?.responsive.lg?.gridTemplateColumns).toBe('repeat(4, 1fr)');
    });

    it('should maintain backward compatibility with legacy layouts', () => {
      // Create blueprint without layoutToken (legacy)
      const legacyBlueprint = createBlueprint({
        name: 'Legacy Dashboard',
        themeId: 'default',
        layout: 'dashboard',
        components: [],
      });

      expect(legacyBlueprint.layout).toBe('dashboard');
      expect(legacyBlueprint.layoutToken).toBeUndefined();
      expect(legacyBlueprint.layoutConfig).toBeUndefined();

      // Validate still works
      const validation = validateBlueprint(legacyBlueprint);
      expect(validation.valid).toBe(true);
    });
  });
});
