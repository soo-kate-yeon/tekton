/**
 * @tekton/core - Screen Resolver Tests
 * Unit tests for screen resolution pipeline
 * [SPEC-LAYOUT-002] [PHASE-2]
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  resolveScreen,
  clearScreenCache,
  getScreenStats,
} from '../src/screen-generation/resolver/index.js';
import type { ScreenDefinition, ComponentType } from '../src/screen-generation/types.js';

// ============================================================================
// Test Setup
// ============================================================================

describe('Screen Resolver', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearScreenCache();
  });

  // ==========================================================================
  // Basic Resolution Tests
  // ==========================================================================

  describe('Basic Resolution', () => {
    it('should resolve a simple screen definition', () => {
      const screen: ScreenDefinition = {
        id: 'test-screen',
        name: 'Test Screen',
        description: 'A test screen',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        themeId: 'default',
        sections: [
          {
            id: 'section-1',
            pattern: 'section.grid-4',
            components: [
              {
                type: 'Button',
                props: {
                  variant: 'primary',
                  size: 'medium',
                  children: 'Click me',
                },
              },
            ],
          },
        ],
      };

      const resolved = resolveScreen(screen);

      expect(resolved).toBeDefined();
      expect(resolved.id).toBe('test-screen');
      expect(resolved.name).toBe('Test Screen');
      expect(resolved.themeId).toBe('default');
    });

    it('should resolve shell layout correctly', () => {
      const screen: ScreenDefinition = {
        id: 'shell-test',
        name: 'Shell Test',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [],
      };

      const resolved = resolveScreen(screen);

      expect(resolved.shell).toBeDefined();
      expect(resolved.shell.shell).toBeDefined();
      expect(resolved.shell.shell?.id).toBe('shell.web.dashboard');
    });

    it('should resolve page layout correctly', () => {
      const screen: ScreenDefinition = {
        id: 'page-test',
        name: 'Page Test',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [],
      };

      const resolved = resolveScreen(screen);

      expect(resolved.page).toBeDefined();
      expect(resolved.page.page).toBeDefined();
      expect(resolved.page.page?.id).toBe('page.dashboard');
    });

    it('should attach component schemas', () => {
      const screen: ScreenDefinition = {
        id: 'schema-test',
        name: 'Schema Test',
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

      const resolved = resolveScreen(screen);

      expect(resolved.sections[0].components[0].schema).toBeDefined();
      expect(resolved.sections[0].components[0].schema.type).toBe('Button');
      expect(resolved.sections[0].components[0].schema.category).toBe('primitive');
    });
  });

  // ==========================================================================
  // Component Resolution Tests
  // ==========================================================================

  describe('Component Resolution', () => {
    it('should validate component types against 20 schemas', () => {
      const componentConfigs: Record<string, any> = {
        Button: { children: 'Test' },
        Input: { type: 'text' },
        Text: { children: 'Test' },
        Heading: { children: 'Test' },
        Checkbox: { label: 'Test' },
        Radio: { name: 'radio-group', label: 'Test' },
        Switch: { label: 'Test' },
        Slider: { value: 50 },
        Badge: { children: 'Test' },
        Avatar: { alt: 'Test' },
        Card: { children: 'Test' },
        Modal: { open: false, onClose: () => {}, children: 'Test' },
        Tabs: { tabs: [] },
        Table: { columns: [], data: [] },
        Link: { href: '#', children: 'Test' },
        List: { items: [] },
        Image: { src: 'test.jpg', alt: 'Test' },
        Form: { onSubmit: () => {}, children: 'Test' },
        Dropdown: { trigger: 'Test', items: [] },
        Progress: { value: 50 },
      };

      for (const [type, props] of Object.entries(componentConfigs)) {
        const screen: ScreenDefinition = {
          id: `test-${type.toLowerCase()}`,
          name: `Test ${type}`,
          shell: 'shell.web.dashboard',
          page: 'page.dashboard',
          sections: [
            {
              id: 'section-1',
              pattern: 'section.grid-4',
              components: [
                {
                  type: type as ComponentType,
                  props,
                },
              ],
            },
          ],
        };

        const resolved = resolveScreen(screen);
        expect(resolved.sections[0].components[0].type).toBe(type);
      }
    });

    it('should throw error for unknown component type', () => {
      const screen: ScreenDefinition = {
        id: 'invalid-component',
        name: 'Invalid Component',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [
          {
            id: 'section-1',
            pattern: 'section.grid-4',
            components: [
              {
                type: 'UnknownComponent' as ComponentType, // Intentionally invalid for error testing
                props: {},
              },
            ],
          },
        ],
      };

      expect(() => resolveScreen(screen)).toThrow(/Unknown component type/);
    });

    it('should resolve token bindings to CSS variables', () => {
      const screen: ScreenDefinition = {
        id: 'token-test',
        name: 'Token Test',
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
                  size: 'medium',
                  children: 'Test',
                },
              },
            ],
          },
        ],
      };

      const resolved = resolveScreen(screen);
      const component = resolved.sections[0].components[0];

      expect(component.tokenBindings.background).toBe('var(--component-button-primary-background)');
      expect(component.tokenBindings.foreground).toBe('var(--component-button-primary-foreground)');
      expect(component.tokenBindings.paddingX).toBe('var(--atomic-spacing-medium)');
    });

    it('should merge props with defaults', () => {
      const screen: ScreenDefinition = {
        id: 'props-test',
        name: 'Props Test',
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
                  children: 'Test',
                  // variant and size will use defaults
                },
              },
            ],
          },
        ],
      };

      const resolved = resolveScreen(screen);
      const component = resolved.sections[0].components[0];

      expect(component.resolvedProps.variant).toBe('primary');
      expect(component.resolvedProps.size).toBe('medium');
      expect(component.resolvedProps.children).toBe('Test');
    });
  });

  // ==========================================================================
  // Tree Building Tests
  // ==========================================================================

  describe('Tree Building', () => {
    it('should build component tree with nested components', () => {
      const screen: ScreenDefinition = {
        id: 'tree-test',
        name: 'Tree Test',
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
                    type: 'Heading',
                    props: {
                      level: 2,
                      children: 'Title',
                    },
                  },
                  {
                    type: 'Text',
                    props: {
                      children: 'Content',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const resolved = resolveScreen(screen);

      expect(resolved.componentTree).toBeDefined();
      expect(resolved.componentTree.sections).toHaveLength(1);
      expect(resolved.componentTree.sections[0].components).toHaveLength(1);

      const cardNode = resolved.componentTree.sections[0].components[0];
      expect(cardNode.type).toBe('Card');
      expect(cardNode.children).toHaveLength(2);
      expect(cardNode.children![0].type).toBe('Heading');
      expect(cardNode.children![1].type).toBe('Text');
    });

    it('should preserve children order', () => {
      const screen: ScreenDefinition = {
        id: 'order-test',
        name: 'Order Test',
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
                    type: 'Heading',
                    props: { children: 'First' },
                  },
                  {
                    type: 'Text',
                    props: { children: 'Second' },
                  },
                  {
                    type: 'Button',
                    props: { children: 'Third' },
                  },
                ],
              },
            ],
          },
        ],
      };

      const resolved = resolveScreen(screen);
      const cardChildren = resolved.sections[0].components[0].children!;

      expect((cardChildren[0] as any).type).toBe('Heading');
      expect((cardChildren[1] as any).type).toBe('Text');
      expect((cardChildren[2] as any).type).toBe('Button');
    });

    it('should validate slot assignments', () => {
      const screen: ScreenDefinition = {
        id: 'slot-test',
        name: 'Slot Test',
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
                slot: 'slot-1',
              },
            ],
          },
        ],
      };

      const resolved = resolveScreen(screen);
      const component = resolved.sections[0].components[0];

      expect(component.slot).toBe('slot-1');
    });
  });

  // ==========================================================================
  // CSS Variables Tests
  // ==========================================================================

  describe('CSS Variables', () => {
    it('should generate CSS variables from layout tokens', () => {
      const screen: ScreenDefinition = {
        id: 'css-test',
        name: 'CSS Test',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [
          {
            id: 'section-1',
            pattern: 'section.grid-4',
            components: [],
          },
        ],
      };

      const resolved = resolveScreen(screen);

      expect(resolved.cssVariables).toBeDefined();
      expect(Object.keys(resolved.cssVariables).length).toBeGreaterThan(0);
    });

    it('should apply theme-specific values', () => {
      const screen: ScreenDefinition = {
        id: 'theme-test',
        name: 'Theme Test',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        themeId: 'default',
        sections: [],
      };

      const resolved = resolveScreen(screen);

      expect(resolved.themeId).toBe('default');
    });

    it('should not have circular references', () => {
      const screen: ScreenDefinition = {
        id: 'circular-test',
        name: 'Circular Test',
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

      const resolved = resolveScreen(screen);

      // Should not throw circular reference error
      expect(resolved).toBeDefined();
      expect(Object.keys(resolved.cssVariables).length).toBeGreaterThan(0);
    });
  });

  // ==========================================================================
  // Error Handling Tests
  // ==========================================================================

  describe('Error Handling', () => {
    it('should throw helpful error for invalid layout token', () => {
      const screen: ScreenDefinition = {
        id: 'invalid-layout',
        name: 'Invalid Layout',
        shell: 'shell.invalid.nonexistent',
        page: 'page.dashboard',
        sections: [],
      };

      expect(() => resolveScreen(screen)).toThrow(/shell/i);
    });

    it('should throw helpful error for unknown component type', () => {
      const screen: ScreenDefinition = {
        id: 'invalid-component',
        name: 'Invalid Component',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [
          {
            id: 'section-1',
            pattern: 'section.grid-4',
            components: [
              {
                type: 'NonExistentComponent' as ComponentType, // Intentionally invalid for error testing
                props: {},
              },
            ],
          },
        ],
      };

      expect(() => resolveScreen(screen)).toThrow(/Unknown component type/);
    });

    it('should throw helpful error for missing token', () => {
      const screen: ScreenDefinition = {
        id: 'missing-token',
        name: 'Missing Token',
        shell: 'shell.web.dashboard',
        page: 'page.nonexistent',
        sections: [],
      };

      expect(() => resolveScreen(screen)).toThrow(/page/i);
    });
  });

  // ==========================================================================
  // Performance Tests
  // ==========================================================================

  describe('Performance', () => {
    it('should resolve typical screen in under 5ms', () => {
      const screen: ScreenDefinition = {
        id: 'perf-test',
        name: 'Performance Test',
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

      const start = performance.now();
      resolveScreen(screen);
      const end = performance.now();
      const duration = end - start;

      expect(duration).toBeLessThan(5);
    });

    it('should use caching for subsequent resolutions', () => {
      const screen: ScreenDefinition = {
        id: 'cache-test',
        name: 'Cache Test',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [],
      };

      // First resolution
      const resolved1 = resolveScreen(screen);

      // Second resolution (should be cached)
      const resolved2 = resolveScreen(screen);

      // Should return same object reference (cached)
      expect(resolved2).toBe(resolved1);
    });
  });

  // ==========================================================================
  // Statistics Tests
  // ==========================================================================

  describe('Statistics', () => {
    it('should provide accurate screen statistics', () => {
      const screen: ScreenDefinition = {
        id: 'stats-test',
        name: 'Stats Test',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [
          {
            id: 'section-1',
            pattern: 'section.grid-4',
            components: [
              {
                type: 'Button',
                props: { children: 'Button' },
              },
              {
                type: 'Input',
                props: { type: 'text' },
              },
            ],
          },
          {
            id: 'section-2',
            pattern: 'section.grid-4',
            components: [
              {
                type: 'Text',
                props: { children: 'Simple text' },
              },
            ],
          },
        ],
      };

      const resolved = resolveScreen(screen);
      const stats = getScreenStats(resolved);

      expect(stats.componentCount).toBe(3); // Button, Input, Text
      expect(stats.componentTypes).toContain('Button');
      expect(stats.componentTypes).toContain('Input');
      expect(stats.componentTypes).toContain('Text');
      expect(stats.sectionCount).toBe(2);
      expect(stats.cssVariableCount).toBeGreaterThan(0);
    });
  });
});
