/**
 * Grid Defaults Tests
 * SPEC-LAYOUT-001 - TASK-002
 *
 * Tests for grid system default configurations per breakpoint.
 */

import { describe, it, expect } from 'vitest';
import {
  GRID_DEFAULTS,
  ENVIRONMENT_GRID_PRESETS,
  getGridConfig,
  type GridConfigKey,
} from '../grid-defaults.js';
import { BREAKPOINTS } from '../breakpoints.js';

describe('GRID_DEFAULTS', () => {
  describe('AC-003: Grid Defaults Contain Valid Values Per Breakpoint', () => {
    it('should define default breakpoint with columns=4, gutter=16, margin=16', () => {
      expect(GRID_DEFAULTS.default.columns).toBe(4);
      expect(GRID_DEFAULTS.default.gutter).toBe(16);
      expect(GRID_DEFAULTS.default.margin).toBe(16);
    });

    it('should define sm breakpoint with columns=4, gutter=16, margin=24', () => {
      expect(GRID_DEFAULTS.sm.columns).toBe(4);
      expect(GRID_DEFAULTS.sm.gutter).toBe(16);
      expect(GRID_DEFAULTS.sm.margin).toBe(24);
    });

    it('should define md breakpoint with columns=8, gutter=24, margin=32', () => {
      expect(GRID_DEFAULTS.md.columns).toBe(8);
      expect(GRID_DEFAULTS.md.gutter).toBe(24);
      expect(GRID_DEFAULTS.md.margin).toBe(32);
    });

    it('should define lg breakpoint with columns=12, gutter=24, margin=48', () => {
      expect(GRID_DEFAULTS.lg.columns).toBe(12);
      expect(GRID_DEFAULTS.lg.gutter).toBe(24);
      expect(GRID_DEFAULTS.lg.margin).toBe(48);
    });

    it('should define xl breakpoint with columns=12, gutter=32, margin=64', () => {
      expect(GRID_DEFAULTS.xl.columns).toBe(12);
      expect(GRID_DEFAULTS.xl.gutter).toBe(32);
      expect(GRID_DEFAULTS.xl.margin).toBe(64);
    });

    it('should define 2xl breakpoint with columns=12, gutter=32, margin=80', () => {
      expect(GRID_DEFAULTS['2xl'].columns).toBe(12);
      expect(GRID_DEFAULTS['2xl'].gutter).toBe(32);
      expect(GRID_DEFAULTS['2xl'].margin).toBe(80);
    });

    it('should have exactly 6 breakpoints (default + 5 Tailwind)', () => {
      expect(Object.keys(GRID_DEFAULTS)).toHaveLength(6);
    });
  });

  describe('Breakpoint ranges', () => {
    it('should define default breakpoint range from 0 to sm-1', () => {
      expect(GRID_DEFAULTS.default.breakpoint.min).toBe(0);
      expect(GRID_DEFAULTS.default.breakpoint.max).toBe(BREAKPOINTS.sm - 1);
    });

    it('should define sm breakpoint range from 640 to md-1', () => {
      expect(GRID_DEFAULTS.sm.breakpoint.min).toBe(BREAKPOINTS.sm);
      expect(GRID_DEFAULTS.sm.breakpoint.max).toBe(BREAKPOINTS.md - 1);
    });

    it('should define md breakpoint range from 768 to lg-1', () => {
      expect(GRID_DEFAULTS.md.breakpoint.min).toBe(BREAKPOINTS.md);
      expect(GRID_DEFAULTS.md.breakpoint.max).toBe(BREAKPOINTS.lg - 1);
    });

    it('should define lg breakpoint range from 1024 to xl-1', () => {
      expect(GRID_DEFAULTS.lg.breakpoint.min).toBe(BREAKPOINTS.lg);
      expect(GRID_DEFAULTS.lg.breakpoint.max).toBe(BREAKPOINTS.xl - 1);
    });

    it('should define xl breakpoint range from 1280 to 2xl-1', () => {
      expect(GRID_DEFAULTS.xl.breakpoint.min).toBe(BREAKPOINTS.xl);
      expect(GRID_DEFAULTS.xl.breakpoint.max).toBe(BREAKPOINTS['2xl'] - 1);
    });

    it('should define 2xl breakpoint range from 1536 to Infinity', () => {
      expect(GRID_DEFAULTS['2xl'].breakpoint.min).toBe(BREAKPOINTS['2xl']);
      expect(GRID_DEFAULTS['2xl'].breakpoint.max).toBe(Infinity);
    });
  });

  describe('GridSystem interface compliance', () => {
    it('should have all required GridSystem fields for each breakpoint', () => {
      const keys: GridConfigKey[] = ['default', 'sm', 'md', 'lg', 'xl', '2xl'];

      for (const key of keys) {
        const grid = GRID_DEFAULTS[key];
        expect(grid).toHaveProperty('columns');
        expect(grid).toHaveProperty('gutter');
        expect(grid).toHaveProperty('margin');
        expect(grid).toHaveProperty('breakpoint');
        expect(grid.breakpoint).toHaveProperty('min');
        expect(grid.breakpoint).toHaveProperty('max');
      }
    });

    it('should have positive column counts', () => {
      const keys: GridConfigKey[] = ['default', 'sm', 'md', 'lg', 'xl', '2xl'];

      for (const key of keys) {
        expect(GRID_DEFAULTS[key].columns).toBeGreaterThan(0);
        expect(GRID_DEFAULTS[key].columns).toBeLessThanOrEqual(12);
      }
    });

    it('should have non-negative gutter and margin values', () => {
      const keys: GridConfigKey[] = ['default', 'sm', 'md', 'lg', 'xl', '2xl'];

      for (const key of keys) {
        expect(GRID_DEFAULTS[key].gutter).toBeGreaterThanOrEqual(0);
        expect(GRID_DEFAULTS[key].margin).toBeGreaterThanOrEqual(0);
      }
    });
  });
});

describe('ENVIRONMENT_GRID_PRESETS', () => {
  describe('AC-004: Environment Presets Map Correctly', () => {
    it('should map mobile to default and sm breakpoints', () => {
      expect(ENVIRONMENT_GRID_PRESETS.mobile).toEqual(['default', 'sm']);
    });

    it('should map tablet to default, sm, and md breakpoints', () => {
      expect(ENVIRONMENT_GRID_PRESETS.tablet).toEqual(['default', 'sm', 'md']);
    });

    it('should map web to all breakpoints', () => {
      expect(ENVIRONMENT_GRID_PRESETS.web).toEqual([
        'default',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
      ]);
    });

    it('should map responsive to all breakpoints', () => {
      expect(ENVIRONMENT_GRID_PRESETS.responsive).toEqual([
        'default',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
      ]);
    });

    it('should map tv to lg, xl, 2xl breakpoints', () => {
      expect(ENVIRONMENT_GRID_PRESETS.tv).toEqual(['lg', 'xl', '2xl']);
    });

    it('should map kiosk to lg, xl breakpoints', () => {
      expect(ENVIRONMENT_GRID_PRESETS.kiosk).toEqual(['lg', 'xl']);
    });

    it('responsive preset should contain 2xl', () => {
      expect(ENVIRONMENT_GRID_PRESETS.responsive).toContain('2xl');
    });

    it('mobile preset should not contain lg, xl, 2xl', () => {
      expect(ENVIRONMENT_GRID_PRESETS.mobile).not.toContain('lg');
      expect(ENVIRONMENT_GRID_PRESETS.mobile).not.toContain('xl');
      expect(ENVIRONMENT_GRID_PRESETS.mobile).not.toContain('2xl');
    });
  });
});

describe('getGridConfig', () => {
  it('should return the grid configuration for a given breakpoint key', () => {
    const lgConfig = getGridConfig('lg');
    expect(lgConfig.columns).toBe(12);
    expect(lgConfig.gutter).toBe(24);
    expect(lgConfig.margin).toBe(48);
  });

  it('should return the default grid configuration', () => {
    const defaultConfig = getGridConfig('default');
    expect(defaultConfig.columns).toBe(4);
    expect(defaultConfig.gutter).toBe(16);
    expect(defaultConfig.margin).toBe(16);
  });
});
