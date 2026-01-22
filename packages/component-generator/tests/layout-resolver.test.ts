/**
 * Layout Resolver Tests
 * SPEC-LAYOUT-001 - TASK-007
 *
 * Tests for resolveLayout function that merges blueprint layout with environment defaults.
 */

import { describe, it, expect } from 'vitest';
import {
  resolveLayout,
  type ResolvedLayout,
} from '../src/generator/layout-resolver.js';
import type { BlueprintLayout, Environment } from '../src/index.js';

describe('resolveLayout', () => {
  describe('with explicit layout configuration', () => {
    it('should use explicit layout values when provided', () => {
      const layout: BlueprintLayout = {
        container: 'fixed',
        maxWidth: 'xl',
        padding: 8,
        grid: { default: 2, lg: 4 },
        gap: 6,
      };

      const result = resolveLayout(layout, 'web');

      expect(result.container).toBe('fixed');
      expect(result.maxWidth).toBe('xl');
      expect(result.padding).toBe(8);
      expect(result.grid.default).toBe(2);
      expect(result.grid.lg).toBe(4);
      expect(result.gap).toBe(6);
    });

    it('should use partial layout and fill with defaults', () => {
      const layout: BlueprintLayout = {
        maxWidth: '2xl',
      };

      const result = resolveLayout(layout, 'web');

      expect(result.maxWidth).toBe('2xl');
      // Should have default container behavior
      expect(result.container).toBeDefined();
    });
  });

  describe('with environment defaults', () => {
    it('should return mobile defaults when environment is mobile', () => {
      const result = resolveLayout(undefined, 'mobile');

      expect(result.grid.default).toBe(4);
      expect(result.grid.sm).toBe(4);
      // Mobile should NOT have lg, xl, 2xl columns defined in active presets
      expect(result.activeBreakpoints).toEqual(['default', 'sm']);
    });

    it('should return tablet defaults when environment is tablet', () => {
      const result = resolveLayout(undefined, 'tablet');

      expect(result.grid.default).toBe(4);
      expect(result.grid.sm).toBe(4);
      expect(result.grid.md).toBe(8);
      expect(result.activeBreakpoints).toEqual(['default', 'sm', 'md']);
    });

    it('should return web defaults when environment is web', () => {
      const result = resolveLayout(undefined, 'web');

      expect(result.grid.default).toBe(4);
      expect(result.grid.sm).toBe(4);
      expect(result.grid.md).toBe(8);
      expect(result.grid.lg).toBe(12);
      expect(result.grid.xl).toBe(12);
      expect(result.grid['2xl']).toBe(12);
      expect(result.activeBreakpoints).toEqual([
        'default',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
      ]);
    });

    it('should return responsive defaults (same as web)', () => {
      const result = resolveLayout(undefined, 'responsive');

      expect(result.activeBreakpoints).toEqual([
        'default',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
      ]);
    });

    it('should return tv defaults', () => {
      const result = resolveLayout(undefined, 'tv');

      expect(result.activeBreakpoints).toEqual(['lg', 'xl', '2xl']);
    });

    it('should return kiosk defaults', () => {
      const result = resolveLayout(undefined, 'kiosk');

      expect(result.activeBreakpoints).toEqual(['lg', 'xl']);
    });
  });

  describe('default environment', () => {
    it('should use responsive as default environment when not specified', () => {
      const result = resolveLayout(undefined, undefined);

      expect(result.activeBreakpoints).toEqual([
        'default',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
      ]);
    });
  });

  describe('gap handling', () => {
    it('should handle numeric gap', () => {
      const layout: BlueprintLayout = { gap: 4 };
      const result = resolveLayout(layout, 'web');

      expect(result.gap).toBe(4);
    });

    it('should handle object gap with x and y', () => {
      const layout: BlueprintLayout = { gap: { x: 4, y: 8 } };
      const result = resolveLayout(layout, 'web');

      expect(result.gap).toEqual({ x: 4, y: 8 });
    });

    it('should handle object gap with only x', () => {
      const layout: BlueprintLayout = { gap: { x: 6 } };
      const result = resolveLayout(layout, 'web');

      expect(result.gap).toEqual({ x: 6 });
    });
  });

  describe('grid override merging', () => {
    it('should merge explicit grid with environment defaults', () => {
      const layout: BlueprintLayout = {
        grid: { lg: 6 }, // Override only lg
      };

      const result = resolveLayout(layout, 'web');

      // Environment default for lg is 12, but we override to 6
      expect(result.grid.lg).toBe(6);
      // Other breakpoints should use environment defaults
      expect(result.grid.default).toBe(4);
      expect(result.grid.md).toBe(8);
    });
  });

  describe('ResolvedLayout structure', () => {
    it('should include all required fields', () => {
      const result = resolveLayout(undefined, 'web');

      expect(result).toHaveProperty('container');
      expect(result).toHaveProperty('maxWidth');
      expect(result).toHaveProperty('padding');
      expect(result).toHaveProperty('grid');
      expect(result).toHaveProperty('gap');
      expect(result).toHaveProperty('activeBreakpoints');
      expect(result).toHaveProperty('environment');
    });

    it('should store the resolved environment', () => {
      const result = resolveLayout(undefined, 'tablet');

      expect(result.environment).toBe('tablet');
    });
  });
});
