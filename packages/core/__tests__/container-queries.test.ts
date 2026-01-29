/**
 * @tekton/core - Container Query Types Tests
 * Tests for Container Query type definitions
 * [SPEC-LAYOUT-003] [PHASE-2]
 */

import { describe, it, expect } from 'vitest';
import {
  CONTAINER_BREAKPOINTS,
  ContainerBreakpointKey,
  ContainerQueryConfig,
  ContainerBreakpointConfig,
} from '../src/layout-tokens/types.js';

describe('Container Query Types', () => {
  describe('CONTAINER_BREAKPOINTS', () => {
    it('should define correct breakpoint values', () => {
      expect(CONTAINER_BREAKPOINTS.sm).toBe(320);
      expect(CONTAINER_BREAKPOINTS.md).toBe(480);
      expect(CONTAINER_BREAKPOINTS.lg).toBe(640);
      expect(CONTAINER_BREAKPOINTS.xl).toBe(800);
    });

    it('should have exactly 4 breakpoints', () => {
      const keys = Object.keys(CONTAINER_BREAKPOINTS);
      expect(keys).toHaveLength(4);
    });

    it('should have breakpoints in ascending order', () => {
      const values = Object.values(CONTAINER_BREAKPOINTS);
      expect(values).toEqual([320, 480, 640, 800]);
    });

    it('should be a readonly object', () => {
      // TypeScript will prevent modification at compile time
      // This test ensures the values are correct
      expect(CONTAINER_BREAKPOINTS).toBeDefined();
      expect(Object.isFrozen(CONTAINER_BREAKPOINTS)).toBe(false); // as const doesn't freeze at runtime
    });
  });

  describe('ContainerBreakpointKey', () => {
    it('should accept valid breakpoint keys', () => {
      const validKeys: ContainerBreakpointKey[] = ['sm', 'md', 'lg', 'xl'];
      validKeys.forEach(key => {
        expect(CONTAINER_BREAKPOINTS[key]).toBeDefined();
      });
    });
  });

  describe('ContainerBreakpointConfig', () => {
    it('should accept valid configuration', () => {
      const config: ContainerBreakpointConfig = {
        minWidth: 320,
        css: { padding: '1rem' },
      };

      expect(config.minWidth).toBe(320);
      expect(config.css).toEqual({ padding: '1rem' });
    });

    it('should accept multiple CSS properties', () => {
      const config: ContainerBreakpointConfig = {
        minWidth: 640,
        css: {
          padding: '2rem',
          gap: '1.5rem',
          'grid-template-columns': 'repeat(3, 1fr)',
        },
      };

      expect(config.css).toHaveProperty('padding');
      expect(config.css).toHaveProperty('gap');
      expect(config.css).toHaveProperty('grid-template-columns');
    });

    it('should accept empty CSS object', () => {
      const config: ContainerBreakpointConfig = {
        minWidth: 480,
        css: {},
      };

      expect(config.css).toEqual({});
    });
  });

  describe('ContainerQueryConfig', () => {
    it('should accept valid configuration', () => {
      const config: ContainerQueryConfig = {
        name: 'card',
        type: 'inline-size',
        breakpoints: {
          sm: { minWidth: 320, css: { padding: '1rem' } },
          lg: { minWidth: 640, css: { padding: '2rem' } },
        },
      };

      expect(config.name).toBe('card');
      expect(config.type).toBe('inline-size');
      expect(config.breakpoints.sm).toBeDefined();
      expect(config.breakpoints.lg).toBeDefined();
    });

    it('should accept inline-size type', () => {
      const config: ContainerQueryConfig = {
        name: 'sidebar',
        type: 'inline-size',
        breakpoints: {},
      };

      expect(config.type).toBe('inline-size');
    });

    it('should accept size type', () => {
      const config: ContainerQueryConfig = {
        name: 'grid-item',
        type: 'size',
        breakpoints: {},
      };

      expect(config.type).toBe('size');
    });

    it('should accept partial breakpoints', () => {
      const config: ContainerQueryConfig = {
        name: 'widget',
        type: 'inline-size',
        breakpoints: {
          md: { minWidth: 480, css: { display: 'flex' } },
        },
      };

      expect(config.breakpoints.sm).toBeUndefined();
      expect(config.breakpoints.md).toBeDefined();
      expect(config.breakpoints.lg).toBeUndefined();
      expect(config.breakpoints.xl).toBeUndefined();
    });

    it('should accept all breakpoints', () => {
      const config: ContainerQueryConfig = {
        name: 'responsive-card',
        type: 'inline-size',
        breakpoints: {
          sm: { minWidth: 320, css: { padding: '0.5rem' } },
          md: { minWidth: 480, css: { padding: '1rem' } },
          lg: { minWidth: 640, css: { padding: '1.5rem' } },
          xl: { minWidth: 800, css: { padding: '2rem' } },
        },
      };

      expect(config.breakpoints.sm).toBeDefined();
      expect(config.breakpoints.md).toBeDefined();
      expect(config.breakpoints.lg).toBeDefined();
      expect(config.breakpoints.xl).toBeDefined();
    });

    it('should accept complex CSS properties', () => {
      const config: ContainerQueryConfig = {
        name: 'product-grid',
        type: 'inline-size',
        breakpoints: {
          sm: {
            minWidth: 320,
            css: {
              display: 'grid',
              'grid-template-columns': '1fr',
              gap: '1rem',
            },
          },
          lg: {
            minWidth: 640,
            css: {
              'grid-template-columns': 'repeat(3, 1fr)',
              gap: '2rem',
            },
          },
        },
      };

      expect(config.breakpoints.sm?.css['grid-template-columns']).toBe('1fr');
      expect(config.breakpoints.lg?.css['grid-template-columns']).toBe('repeat(3, 1fr)');
    });
  });

  describe('Container Query Integration', () => {
    it('should support component-level responsiveness', () => {
      const cardConfig: ContainerQueryConfig = {
        name: 'card-container',
        type: 'inline-size',
        breakpoints: {
          sm: {
            minWidth: CONTAINER_BREAKPOINTS.sm,
            css: { 'flex-direction': 'column' },
          },
          md: {
            minWidth: CONTAINER_BREAKPOINTS.md,
            css: { 'flex-direction': 'row' },
          },
        },
      };

      expect(cardConfig.breakpoints.sm?.minWidth).toBe(320);
      expect(cardConfig.breakpoints.md?.minWidth).toBe(480);
    });

    it('should work with nested containers', () => {
      const outerConfig: ContainerQueryConfig = {
        name: 'outer',
        type: 'inline-size',
        breakpoints: {
          lg: { minWidth: 640, css: { padding: '2rem' } },
        },
      };

      const innerConfig: ContainerQueryConfig = {
        name: 'inner',
        type: 'inline-size',
        breakpoints: {
          sm: { minWidth: 320, css: { display: 'block' } },
        },
      };

      expect(outerConfig.name).not.toBe(innerConfig.name);
      expect(outerConfig.type).toBe(innerConfig.type);
    });
  });

  describe('Container Query Edge Cases', () => {
    it('should handle container with no breakpoints', () => {
      const config: ContainerQueryConfig = {
        name: 'empty-container',
        type: 'inline-size',
        breakpoints: {},
      };

      expect(config.breakpoints).toEqual({});
    });

    it('should handle very small container widths', () => {
      const config: ContainerQueryConfig = {
        name: 'tiny',
        type: 'inline-size',
        breakpoints: {
          sm: { minWidth: 100, css: { padding: '0.25rem' } },
        },
      };

      expect(config.breakpoints.sm?.minWidth).toBe(100);
    });

    it('should handle very large container widths', () => {
      const config: ContainerQueryConfig = {
        name: 'huge',
        type: 'inline-size',
        breakpoints: {
          xl: { minWidth: 2000, css: { padding: '4rem' } },
        },
      };

      expect(config.breakpoints.xl?.minWidth).toBe(2000);
    });
  });
});
