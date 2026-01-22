/**
 * Integration Tests for Layout with renderScreen Flow
 * SPEC-LAYOUT-001 - TASK-012
 *
 * End-to-end tests verifying the complete flow from blueprint
 * with layout configuration to generated code output.
 */

import { describe, it, expect } from 'vitest';
import { JSXGenerator } from '../src/generator/jsx-generator.js';
import type { BlueprintResultV2 } from '../src/types/knowledge-schema.js';

describe('Integration: Layout with renderScreen Flow', () => {
  const generator = new JSXGenerator();

  describe('AC-011: Complete Layout Configuration Flow', () => {
    it('should generate code with all layout classes from full configuration', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'integration-001',
        recipeName: 'FullLayoutPage',
        analysis: { intent: 'dashboard', tone: 'professional' },
        layout: {
          container: 'fixed',
          maxWidth: '2xl',
          padding: 6,
          grid: {
            default: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 4,
          },
          gap: { x: 4, y: 6 },
        },
        structure: {
          componentName: 'main',
          props: {},
          slots: {
            content: [
              { componentName: 'Card', props: { title: 'Widget 1' } },
              { componentName: 'Card', props: { title: 'Widget 2' } },
              { componentName: 'Card', props: { title: 'Widget 3' } },
            ],
          },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);

      // Container classes
      expect(result.code).toContain('container');
      expect(result.code).toContain('mx-auto');

      // Max width
      expect(result.code).toContain('max-w-2xl');

      // Padding
      expect(result.code).toContain('px-6');

      // Grid display
      expect(result.code).toContain('grid');

      // Responsive grid columns
      expect(result.code).toContain('grid-cols-1');
      expect(result.code).toContain('sm:grid-cols-2');
      expect(result.code).toContain('md:grid-cols-2');
      expect(result.code).toContain('lg:grid-cols-3');
      expect(result.code).toContain('xl:grid-cols-4');

      // Gap classes
      expect(result.code).toContain('gap-x-4');
      expect(result.code).toContain('gap-y-6');

      // Structure preserved
      expect(result.code).toContain('Card');
      expect(result.code).toContain('Widget 1');
    });
  });

  describe('AC-012: Environment Default Flow', () => {
    it('should use mobile defaults when environment is mobile', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'integration-002',
        recipeName: 'MobileApp',
        analysis: { intent: 'mobile-app', tone: 'casual' },
        environment: 'mobile',
        structure: {
          componentName: 'div',
          props: {},
          slots: {
            content: [
              { componentName: 'Card', props: {} },
            ],
          },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);

      // Mobile uses only default and sm breakpoints
      expect(result.code).toContain('grid-cols-4');
      expect(result.code).toContain('sm:grid-cols-4');

      // Should NOT have lg, xl, 2xl breakpoints
      expect(result.code).not.toContain('lg:grid-cols-12');
      expect(result.code).not.toContain('xl:grid-cols-12');
      expect(result.code).not.toContain('2xl:grid-cols-12');
    });

    it('should use responsive defaults for web environment', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'integration-003',
        recipeName: 'WebApp',
        analysis: { intent: 'web-app', tone: 'professional' },
        environment: 'responsive',
        structure: {
          componentName: 'section',
          props: {},
          slots: {
            content: [
              { componentName: 'Card', props: {} },
            ],
          },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);

      // Responsive uses all breakpoints
      expect(result.code).toContain('grid-cols-');
      expect(result.code).toContain('md:grid-cols-');
      expect(result.code).toContain('lg:grid-cols-');
    });
  });

  describe('AC-016: No Hardcoded Pixel Values', () => {
    it('should never output hardcoded pixel values in any scenario', async () => {
      const scenarios: BlueprintResultV2[] = [
        {
          blueprintId: 'pixel-test-1',
          recipeName: 'PixelTest1',
          analysis: { intent: 'test', tone: 'casual' },
          layout: { container: 'fixed', maxWidth: 'xl', padding: 8 },
          structure: { componentName: 'div', props: {} },
        },
        {
          blueprintId: 'pixel-test-2',
          recipeName: 'PixelTest2',
          analysis: { intent: 'test', tone: 'casual' },
          environment: 'mobile',
          structure: { componentName: 'div', props: {} },
        },
        {
          blueprintId: 'pixel-test-3',
          recipeName: 'PixelTest3',
          analysis: { intent: 'test', tone: 'casual' },
          layout: { grid: { default: 1, lg: 4 }, gap: 6 },
          structure: { componentName: 'main', props: {} },
        },
      ];

      for (const blueprint of scenarios) {
        const result = await generator.generate(blueprint);

        expect(result.success).toBe(true);
        // No pixel values like "16px", "24px", etc.
        expect(result.code).not.toMatch(/\d+px/);
        // No inline styles
        expect(result.code).not.toMatch(/style=\{\{/);
      }
    });
  });

  describe('Backward Compatibility', () => {
    it('should work with V1 blueprint (no layout, no environment)', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'compat-001',
        recipeName: 'LegacyPage',
        analysis: { intent: 'legacy', tone: 'neutral' },
        structure: {
          componentName: 'Card',
          props: { title: 'Legacy Card' },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      expect(result.code).toContain('Card');
      expect(result.code).toContain('Legacy Card');
      // Should not have layout wrapper classes when no layout/environment
      expect(result.code).not.toContain('container');
    });

    it('should merge layout classes with existing className in props', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'merge-001',
        recipeName: 'MergePage',
        analysis: { intent: 'test', tone: 'neutral' },
        layout: { container: 'fixed', maxWidth: 'lg' },
        structure: {
          componentName: 'div',
          props: { className: 'bg-white rounded-lg shadow' },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      // Layout classes should be present
      expect(result.code).toContain('container');
      expect(result.code).toContain('max-w-lg');
      // Original className should be preserved
      expect(result.code).toContain('bg-white');
      expect(result.code).toContain('rounded-lg');
      expect(result.code).toContain('shadow');
    });
  });

  describe('Complex Nested Structure', () => {
    it('should apply layout only to root element, not children', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'nested-001',
        recipeName: 'NestedPage',
        analysis: { intent: 'dashboard', tone: 'professional' },
        layout: {
          container: 'fixed',
          maxWidth: 'xl',
          grid: { default: 1, md: 2, lg: 3 },
        },
        structure: {
          componentName: 'main',
          props: {},
          slots: {
            content: [
              {
                componentName: 'Card',
                props: { className: 'p-4' },
                slots: {
                  content: [
                    { componentName: 'Button', props: { variant: 'primary' } },
                  ],
                },
              },
              {
                componentName: 'Card',
                props: {},
                slots: {
                  content: [
                    { componentName: 'Input', props: { type: 'text' } },
                  ],
                },
              },
            ],
          },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);

      // Root element should have layout classes
      expect(result.code).toContain('container');
      expect(result.code).toContain('max-w-xl');

      // Children Card should have their own className preserved
      expect(result.code).toContain('p-4');

      // Nested components should be present
      expect(result.code).toContain('Button');
      expect(result.code).toContain('Input');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty grid configuration with environment defaults', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'edge-001',
        recipeName: 'EmptyGrid',
        analysis: { intent: 'test', tone: 'casual' },
        layout: {
          container: 'fixed',
          // No grid specified - environment defaults should apply
        },
        environment: 'responsive',
        structure: { componentName: 'div', props: {} },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      expect(result.code).toContain('container');
      // Should use environment defaults for grid when not specified
      expect(result.code).toContain('grid-cols-');
    });

    it('should handle container: none', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'edge-002',
        recipeName: 'NoContainer',
        analysis: { intent: 'test', tone: 'casual' },
        layout: {
          container: 'none',
          grid: { default: 2, lg: 4 },
        },
        structure: { componentName: 'div', props: {} },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      // Should NOT have container or mx-auto
      expect(result.code).not.toContain('container');
      expect(result.code).not.toContain('mx-auto');
      // But should have grid classes
      expect(result.code).toContain('grid-cols-2');
      expect(result.code).toContain('lg:grid-cols-4');
    });

    it('should handle uniform gap number', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'edge-003',
        recipeName: 'UniformGap',
        analysis: { intent: 'test', tone: 'casual' },
        layout: { gap: 8 },
        structure: { componentName: 'div', props: {} },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      expect(result.code).toContain('gap-8');
    });
  });
});
