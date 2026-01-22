/**
 * JSX Generator with Layout Integration Tests
 * SPEC-LAYOUT-001 - TASK-009
 *
 * Tests for JSXGenerator with layout-aware code generation.
 */

import { describe, it, expect } from 'vitest';
import { JSXGenerator } from '../src/generator/jsx-generator.js';
import type { BlueprintResultV2 } from '../src/types/knowledge-schema.js';

describe('JSXGenerator with Layout', () => {
  const generator = new JSXGenerator();

  describe('AC-011: renderScreen Applies Layout to Generated Code', () => {
    it('should include layout classes in generated code', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'test-001',
        recipeName: 'TestPage',
        analysis: { intent: 'test', tone: 'professional' },
        layout: {
          container: 'fixed',
          maxWidth: 'xl',
          grid: { default: 1, md: 2, lg: 3 },
        },
        structure: {
          componentName: 'div',
          props: {},
          slots: {
            content: [{ componentName: 'Card', props: {} }],
          },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      expect(result.code).toContain('container');
      expect(result.code).toContain('mx-auto');
      expect(result.code).toContain('max-w-xl');
      expect(result.code).toContain('grid-cols-1');
      expect(result.code).toContain('md:grid-cols-2');
      expect(result.code).toContain('lg:grid-cols-3');
    });

    it('should include gap classes when gap is configured', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'test-002',
        recipeName: 'GapTest',
        analysis: { intent: 'test', tone: 'casual' },
        layout: {
          gap: { x: 4, y: 8 },
        },
        structure: {
          componentName: 'div',
          props: {},
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      expect(result.code).toContain('gap-x-4');
      expect(result.code).toContain('gap-y-8');
    });
  });

  describe('AC-012: renderScreen Uses Environment Defaults When No Layout', () => {
    it('should use mobile-appropriate grid defaults', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'test-003',
        recipeName: 'MobilePage',
        analysis: { intent: 'test', tone: 'casual' },
        environment: 'mobile',
        structure: {
          componentName: 'div',
          props: {},
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      // Mobile should use 4 columns max (default and sm)
      expect(result.code).toContain('grid-cols-4');
      // Should NOT include lg:grid-cols-12 for mobile
      expect(result.code).not.toContain('lg:grid-cols-12');
    });

    it('should use responsive defaults when environment is explicitly responsive', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'test-004',
        recipeName: 'ResponsivePage',
        analysis: { intent: 'test', tone: 'professional' },
        environment: 'responsive', // Explicitly set to get responsive defaults
        structure: {
          componentName: 'div',
          props: {},
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      // Responsive should include all breakpoints
      expect(result.code).toContain('grid-cols-');
      expect(result.code).toContain('md:grid-cols-');
      expect(result.code).toContain('lg:grid-cols-');
    });
  });

  describe('AC-016: No Hardcoded Pixel Values', () => {
    it('should not contain hardcoded pixel values', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'test-005',
        recipeName: 'NoPixels',
        analysis: { intent: 'test', tone: 'professional' },
        layout: {
          container: 'fixed',
          maxWidth: '2xl',
          padding: 6,
          grid: { default: 1, lg: 3 },
          gap: 4,
        },
        structure: {
          componentName: 'div',
          props: {},
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      // Should not have raw pixel values
      expect(result.code).not.toMatch(/\d+px/);
    });

    it('should not contain inline styles', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'test-006',
        recipeName: 'NoStyles',
        analysis: { intent: 'test', tone: 'professional' },
        layout: {
          container: 'fixed',
          maxWidth: 'xl',
        },
        structure: {
          componentName: 'div',
          props: {},
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      // Should not have style={{ ... }}
      expect(result.code).not.toMatch(/style=\{\{/);
    });
  });

  describe('Backward compatibility', () => {
    it('should work without layout configuration', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'test-007',
        recipeName: 'NoLayout',
        analysis: { intent: 'test', tone: 'casual' },
        structure: {
          componentName: 'Card',
          props: { title: 'Hello' },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      expect(result.code).toContain('Card');
    });
  });

  describe('Layout wrapper behavior', () => {
    it('should apply layout classes to root element', async () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'test-008',
        recipeName: 'LayoutWrapper',
        analysis: { intent: 'test', tone: 'professional' },
        layout: {
          container: 'fixed',
          maxWidth: 'lg',
        },
        structure: {
          componentName: 'main',
          props: {},
          slots: {
            content: [{ componentName: 'Card', props: {} }],
          },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      // Should have layout classes
      expect(result.code).toContain('container');
      expect(result.code).toContain('max-w-lg');
    });
  });
});
