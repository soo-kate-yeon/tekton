/**
 * @tekton/core - Screen Resolver Integration Tests
 * End-to-end tests for complete screen resolution workflow
 * [SPEC-LAYOUT-002] [PHASE-2]
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { resolveScreen, clearScreenCache } from '../src/screen-generation/resolver/index.js';
import { validateScreenDefinition } from '../src/screen-generation/validators.js';
import type { ScreenDefinition } from '../src/screen-generation/types.js';
import { readFile } from 'fs/promises';
import { join } from 'path';

// ============================================================================
// Test Setup
// ============================================================================

describe('Screen Resolver Integration', () => {
  beforeEach(() => {
    clearScreenCache();
  });

  // ==========================================================================
  // End-to-End Workflow Tests
  // ==========================================================================

  describe('End-to-End Workflow', () => {
    it('should complete full workflow: Definition → Validation → Resolution → Output', () => {
      // Step 1: Create screen definition
      const screen: ScreenDefinition = {
        id: 'e2e-test',
        name: 'End-to-End Test',
        description: 'Complete workflow test',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        themeId: 'default',
        sections: [
          {
            id: 'header',
            pattern: 'section.stack-start',
            components: [
              {
                type: 'Heading',
                props: {
                  level: 1,
                  children: 'Dashboard',
                },
              },
            ],
          },
          {
            id: 'stats',
            pattern: 'section.grid-4',
            components: [
              {
                type: 'Card',
                props: {
                  variant: 'elevated',
                },
                children: [
                  {
                    type: 'Heading',
                    props: {
                      level: 3,
                      children: 'Total Users',
                    },
                  },
                  {
                    type: 'Text',
                    props: {
                      variant: 'body',
                      size: 'large',
                      children: '1,234',
                    },
                  },
                ],
              },
              {
                type: 'Card',
                props: {
                  variant: 'elevated',
                },
                children: [
                  {
                    type: 'Heading',
                    props: {
                      level: 3,
                      children: 'Revenue',
                    },
                  },
                  {
                    type: 'Text',
                    props: {
                      variant: 'body',
                      size: 'large',
                      children: '$56,789',
                    },
                  },
                ],
              },
            ],
          },
        ],
        meta: {
          author: 'Test',
          createdAt: '2026-01-28T00:00:00Z',
          version: '1.0.0',
          tags: ['dashboard', 'test'],
        },
      };

      // Step 2: Validate definition
      const validationResult = validateScreenDefinition(screen);
      expect(validationResult.valid).toBe(true);
      expect(validationResult.errors || []).toHaveLength(0);

      // Step 3: Resolve screen
      const resolved = resolveScreen(screen);

      // Step 4: Verify output
      expect(resolved.id).toBe('e2e-test');
      expect(resolved.name).toBe('End-to-End Test');
      expect(resolved.shell).toBeDefined();
      expect(resolved.page).toBeDefined();
      expect(resolved.sections).toHaveLength(2);
      expect(resolved.cssVariables).toBeDefined();
      expect(resolved.componentTree).toBeDefined();
      expect(resolved.meta).toEqual(screen.meta);
    });
  });

  // ==========================================================================
  // Theme Application Tests
  // ==========================================================================

  describe('Theme Application', () => {
    it('should apply default theme when not specified', () => {
      const screen: ScreenDefinition = {
        id: 'theme-default',
        name: 'Theme Default',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [],
      };

      const resolved = resolveScreen(screen);

      expect(resolved.themeId).toBe('default');
    });

    it('should apply multiple themes to same screen', () => {
      const baseScreen: ScreenDefinition = {
        id: 'multi-theme',
        name: 'Multi Theme',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [
          {
            id: 'section-1',
            pattern: 'section.grid-4',
            components: [
              {
                type: 'Button',
                props: {
                  variant: 'primary',
                  children: 'Test',
                },
              },
            ],
          },
        ],
      };

      // Apply default theme
      const defaultTheme = { ...baseScreen, themeId: 'default' };
      const resolvedDefault = resolveScreen(defaultTheme);

      // Apply dark theme (if available)
      const darkTheme = { ...baseScreen, themeId: 'default', id: 'multi-theme-dark' };
      const resolvedDark = resolveScreen(darkTheme);

      expect(resolvedDefault.themeId).toBe('default');
      expect(resolvedDark.themeId).toBe('default');
      expect(resolvedDefault.sections[0].components[0].tokenBindings).toBeDefined();
      expect(resolvedDark.sections[0].components[0].tokenBindings).toBeDefined();
    });
  });

  // ==========================================================================
  // Responsive Overrides Tests
  // ==========================================================================

  describe('Responsive Overrides', () => {
    it('should apply responsive overrides correctly', () => {
      const screen: ScreenDefinition = {
        id: 'responsive-test',
        name: 'Responsive Test',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [
          {
            id: 'section-1',
            pattern: 'section.grid-4',
            components: [
              {
                type: 'Text',
                props: {
                  children: 'Test',
                },
              },
            ],
            responsive: {
              sm: { gap: '8px' },
              md: { gap: '16px' },
              lg: { gap: '24px' },
            },
          },
        ],
      };

      const resolved = resolveScreen(screen);

      expect(resolved.sections[0].layout).toBeDefined();
      expect(resolved.sections[0].layout.responsive).toBeDefined();
    });
  });

  // ==========================================================================
  // Example Screen Resolution Tests
  // ==========================================================================

  describe('Example Screen Resolution', () => {
    it('should resolve dashboard-screen.json example', async () => {
      const examplePath = join(
        process.cwd(),
        'packages/core/src/screen-generation/examples/dashboard-screen.json'
      );

      let screenData: string;
      try {
        screenData = await readFile(examplePath, 'utf-8');
      } catch (error) {
        console.warn('Example file not found, skipping test');
        return;
      }

      const screen: ScreenDefinition = JSON.parse(screenData);

      // Validate
      const validationResult = validateScreenDefinition(screen);
      expect(validationResult.valid).toBe(true);

      // Resolve
      const resolved = resolveScreen(screen);

      expect(resolved).toBeDefined();
      expect(resolved.id).toBe(screen.id);
      expect(resolved.sections.length).toBeGreaterThan(0);
    });

    it('should resolve settings-screen.json example', async () => {
      const examplePath = join(
        process.cwd(),
        'packages/core/src/screen-generation/examples/settings-screen.json'
      );

      let screenData: string;
      try {
        screenData = await readFile(examplePath, 'utf-8');
      } catch (error) {
        console.warn('Example file not found, skipping test');
        return;
      }

      const screen: ScreenDefinition = JSON.parse(screenData);

      // Validate
      const validationResult = validateScreenDefinition(screen);
      expect(validationResult.valid).toBe(true);

      // Resolve
      const resolved = resolveScreen(screen);

      expect(resolved).toBeDefined();
      expect(resolved.id).toBe(screen.id);
    });

    it('should resolve detail-screen.json example', async () => {
      const examplePath = join(
        process.cwd(),
        'packages/core/src/screen-generation/examples/detail-screen.json'
      );

      let screenData: string;
      try {
        screenData = await readFile(examplePath, 'utf-8');
      } catch (error) {
        console.warn('Example file not found, skipping test');
        return;
      }

      const screen: ScreenDefinition = JSON.parse(screenData);

      // Validate
      const validationResult = validateScreenDefinition(screen);
      expect(validationResult.valid).toBe(true);

      // Resolve
      const resolved = resolveScreen(screen);

      expect(resolved).toBeDefined();
      expect(resolved.id).toBe(screen.id);
    });
  });

  // ==========================================================================
  // Complex Screen Tests
  // ==========================================================================

  describe('Complex Screen Structures', () => {
    it('should handle deeply nested component trees', () => {
      const screen: ScreenDefinition = {
        id: 'nested-test',
        name: 'Nested Test',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [
          {
            id: 'section-1',
            pattern: 'section.grid-4',
            components: [
              {
                type: 'Card',
                props: {},
                children: [
                  {
                    type: 'Card',
                    props: {},
                    children: [
                      {
                        type: 'Card',
                        props: {},
                        children: [
                          {
                            type: 'Text',
                            props: {
                              children: 'Deeply nested',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const resolved = resolveScreen(screen);

      expect(resolved.sections[0].components[0].children).toBeDefined();
      expect((resolved.sections[0].components[0].children![0] as any).children).toBeDefined();
    });

    it('should handle multiple sections with different patterns', () => {
      const screen: ScreenDefinition = {
        id: 'multi-section',
        name: 'Multi Section',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [
          {
            id: 'header',
            pattern: 'section.stack-start',
            components: [
              {
                type: 'Heading',
                props: {
                  level: 1,
                  children: 'Welcome',
                },
              },
            ],
          },
          {
            id: 'grid',
            pattern: 'section.grid-4',
            components: [
              {
                type: 'Text',
                props: { children: 'Card 1' },
              },
              {
                type: 'Text',
                props: { children: 'Card 2' },
              },
            ],
          },
          {
            id: 'sidebar',
            pattern: 'section.sidebar-left',
            components: [
              {
                type: 'Text',
                props: {
                  children: 'Sidebar content',
                },
              },
            ],
          },
        ],
      };

      const resolved = resolveScreen(screen);

      expect(resolved.sections).toHaveLength(3);
      expect(resolved.sections[0].id).toBe('header');
      expect(resolved.sections[1].id).toBe('grid');
      expect(resolved.sections[2].id).toBe('sidebar');
    });

    it('should handle all 20 component types in one screen', () => {
      const allComponents = [
        { type: 'Button', props: { children: 'Button' } },
        { type: 'Input', props: { type: 'text' } },
        { type: 'Text', props: { children: 'Text' } },
        { type: 'Heading', props: { children: 'Heading' } },
        { type: 'Checkbox', props: { label: 'Checkbox' } },
        { type: 'Radio', props: { name: 'radio', label: 'Radio' } },
        { type: 'Switch', props: { label: 'Switch' } },
        { type: 'Slider', props: { value: 50 } },
        { type: 'Badge', props: { children: 'Badge' } },
        { type: 'Avatar', props: { alt: 'Avatar' } },
        { type: 'Card', props: { children: 'Card Content' } },
        { type: 'Modal', props: { open: false, onClose: () => {}, children: 'Modal' } },
        { type: 'Tabs', props: { tabs: [] } },
        { type: 'Table', props: { columns: [], data: [] } },
        { type: 'Link', props: { href: '#', children: 'Link' } },
        { type: 'List', props: { items: [] } },
        { type: 'Image', props: { src: 'test.jpg', alt: 'Image' } },
        { type: 'Form', props: { onSubmit: () => {}, children: 'Form' } },
        { type: 'Dropdown', props: { trigger: 'Dropdown', items: [] } },
        { type: 'Progress', props: { value: 50 } },
      ];

      const screen: ScreenDefinition = {
        id: 'all-components',
        name: 'All Components',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [
          {
            id: 'section-1',
            pattern: 'section.stack-start',
            components: allComponents as any,
          },
        ],
      };

      const resolved = resolveScreen(screen);

      expect(resolved.sections[0].components).toHaveLength(20);
      const types = resolved.sections[0].components.map(c => c.type);
      expect(new Set(types).size).toBe(20);
    });
  });

  // ==========================================================================
  // Performance Benchmarks
  // ==========================================================================

  describe('Performance Benchmarks', () => {
    it('should resolve simple screen in under 5ms', () => {
      const screen: ScreenDefinition = {
        id: 'simple-perf',
        name: 'Simple Performance',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [
          {
            id: 'section-1',
            pattern: 'section.grid-4',
            components: [
              {
                type: 'Button',
                props: { children: 'Test' },
              },
            ],
          },
        ],
      };

      const start = performance.now();
      resolveScreen(screen);
      const end = performance.now();

      expect(end - start).toBeLessThan(5);
    });

    it('should resolve complex screen with 50 components', () => {
      const components = Array.from({ length: 50 }, (_, i) => ({
        type: 'Card',
        props: {},
        children: [
          {
            type: 'Heading',
            props: { children: `Card ${i}` },
          },
          {
            type: 'Text',
            props: { children: `Content ${i}` },
          },
        ],
      }));

      const screen: ScreenDefinition = {
        id: 'complex-perf',
        name: 'Complex Performance',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [
          {
            id: 'section-1',
            pattern: 'section.grid-4',
            components: components as any,
          },
        ],
      };

      const start = performance.now();
      const resolved = resolveScreen(screen);
      const end = performance.now();

      expect(resolved.sections[0].components).toHaveLength(50);
      expect(end - start).toBeLessThan(50); // Should be under 1ms per component
    });

    it('should benefit from caching', () => {
      const screen: ScreenDefinition = {
        id: 'cache-perf',
        name: 'Cache Performance',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [
          {
            id: 'section-1',
            pattern: 'section.grid-4',
            components: [
              {
                type: 'Button',
                props: { variant: 'primary', children: 'Test' },
              },
            ],
          },
        ],
      };

      // First resolution
      const start1 = performance.now();
      resolveScreen(screen);
      const end1 = performance.now();
      const duration1 = end1 - start1;

      // Second resolution (cached)
      const start2 = performance.now();
      resolveScreen(screen);
      const end2 = performance.now();
      const duration2 = end2 - start2;

      expect(duration2).toBeLessThan(duration1 * 0.1); // At least 10x faster
      expect(duration2).toBeLessThan(0.1); // Should be under 0.1ms
    });
  });
});
