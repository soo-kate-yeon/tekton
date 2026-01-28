/**
 * @tekton/core - Responsive Token Tests
 * Tests for concrete Responsive Token definitions
 * [SPEC-LAYOUT-001] [PHASE-6]
 */

import { describe, it, expect } from 'vitest';
import {
  BREAKPOINT_SM,
  BREAKPOINT_MD,
  BREAKPOINT_LG,
  BREAKPOINT_XL,
  BREAKPOINT_2XL,
  BREAKPOINT_VALUES,
  getResponsiveToken,
  getAllResponsiveTokens,
  getBreakpointValue,
  getBreakpointMediaQuery,
  sortBreakpointsBySize,
} from '../src/layout-tokens/responsive.js';
import { ResponsiveTokenSchema } from '../src/layout-validation.js';

// ============================================================================
// Individual Breakpoint Token Validation Tests
// ============================================================================

describe('Responsive Token Definitions', () => {
  describe('BREAKPOINT_SM', () => {
    it('should have correct id and minWidth', () => {
      expect(BREAKPOINT_SM.id).toBe('breakpoint.sm');
      expect(BREAKPOINT_SM.minWidth).toBe(640);
    });

    it('should have description', () => {
      expect(BREAKPOINT_SM.description).toBeDefined();
      expect(BREAKPOINT_SM.description).toContain('640px');
    });

    it('should pass ResponsiveTokenSchema validation', () => {
      const result = ResponsiveTokenSchema.safeParse(BREAKPOINT_SM);
      expect(result.success).toBe(true);
    });
  });

  describe('BREAKPOINT_MD', () => {
    it('should have correct id and minWidth', () => {
      expect(BREAKPOINT_MD.id).toBe('breakpoint.md');
      expect(BREAKPOINT_MD.minWidth).toBe(768);
    });

    it('should have description', () => {
      expect(BREAKPOINT_MD.description).toBeDefined();
      expect(BREAKPOINT_MD.description).toContain('768px');
    });

    it('should pass ResponsiveTokenSchema validation', () => {
      const result = ResponsiveTokenSchema.safeParse(BREAKPOINT_MD);
      expect(result.success).toBe(true);
    });
  });

  describe('BREAKPOINT_LG', () => {
    it('should have correct id and minWidth', () => {
      expect(BREAKPOINT_LG.id).toBe('breakpoint.lg');
      expect(BREAKPOINT_LG.minWidth).toBe(1024);
    });

    it('should have description', () => {
      expect(BREAKPOINT_LG.description).toBeDefined();
      expect(BREAKPOINT_LG.description).toContain('1024px');
    });

    it('should pass ResponsiveTokenSchema validation', () => {
      const result = ResponsiveTokenSchema.safeParse(BREAKPOINT_LG);
      expect(result.success).toBe(true);
    });
  });

  describe('BREAKPOINT_XL', () => {
    it('should have correct id and minWidth', () => {
      expect(BREAKPOINT_XL.id).toBe('breakpoint.xl');
      expect(BREAKPOINT_XL.minWidth).toBe(1280);
    });

    it('should have description', () => {
      expect(BREAKPOINT_XL.description).toBeDefined();
      expect(BREAKPOINT_XL.description).toContain('1280px');
    });

    it('should pass ResponsiveTokenSchema validation', () => {
      const result = ResponsiveTokenSchema.safeParse(BREAKPOINT_XL);
      expect(result.success).toBe(true);
    });
  });

  describe('BREAKPOINT_2XL', () => {
    it('should have correct id and minWidth', () => {
      expect(BREAKPOINT_2XL.id).toBe('breakpoint.2xl');
      expect(BREAKPOINT_2XL.minWidth).toBe(1536);
    });

    it('should have description', () => {
      expect(BREAKPOINT_2XL.description).toBeDefined();
      expect(BREAKPOINT_2XL.description).toContain('1536px');
    });

    it('should pass ResponsiveTokenSchema validation', () => {
      const result = ResponsiveTokenSchema.safeParse(BREAKPOINT_2XL);
      expect(result.success).toBe(true);
    });
  });
});

// ============================================================================
// All Breakpoints Validation Tests
// ============================================================================

describe('All Responsive Tokens Validation', () => {
  it('all 5 breakpoints are defined', () => {
    const breakpoints = getAllResponsiveTokens();
    expect(breakpoints).toHaveLength(5);
  });

  it('breakpoints are in ascending order', () => {
    const breakpoints = getAllResponsiveTokens();
    const widths = breakpoints.map(b => b.minWidth);
    expect(widths).toEqual([640, 768, 1024, 1280, 1536]);
  });

  it.each([
    ['breakpoint.sm', 640],
    ['breakpoint.md', 768],
    ['breakpoint.lg', 1024],
    ['breakpoint.xl', 1280],
    ['breakpoint.2xl', 1536],
  ])('breakpoint %s has minWidth %i', (id, expectedWidth) => {
    const token = getResponsiveToken(id);
    expect(token).toBeDefined();
    expect(token!.minWidth).toBe(expectedWidth);
  });

  it('each breakpoint has valid schema', () => {
    const breakpoints = getAllResponsiveTokens();
    breakpoints.forEach(bp => {
      const result = ResponsiveTokenSchema.safeParse(bp);
      expect(result.success).toBe(true);
    });
  });

  it('all breakpoints have unique ids', () => {
    const breakpoints = getAllResponsiveTokens();
    const ids = breakpoints.map(b => b.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('all breakpoints have descriptions', () => {
    const breakpoints = getAllResponsiveTokens();
    breakpoints.forEach(bp => {
      expect(bp.description).toBeDefined();
      expect(bp.description.length).toBeGreaterThan(0);
    });
  });

  it('all breakpoints have positive minWidth', () => {
    const breakpoints = getAllResponsiveTokens();
    breakpoints.forEach(bp => {
      expect(bp.minWidth).toBeGreaterThan(0);
    });
  });

  it('breakpoints follow Tailwind CSS standard', () => {
    expect(BREAKPOINT_SM.minWidth).toBe(640);
    expect(BREAKPOINT_MD.minWidth).toBe(768);
    expect(BREAKPOINT_LG.minWidth).toBe(1024);
    expect(BREAKPOINT_XL.minWidth).toBe(1280);
    expect(BREAKPOINT_2XL.minWidth).toBe(1536);
  });
});

// ============================================================================
// BREAKPOINT_VALUES Map Tests
// ============================================================================

describe('BREAKPOINT_VALUES Map', () => {
  it('getBreakpointValue returns correct pixel values', () => {
    expect(getBreakpointValue('sm')).toBe(640);
    expect(getBreakpointValue('md')).toBe(768);
    expect(getBreakpointValue('lg')).toBe(1024);
    expect(getBreakpointValue('xl')).toBe(1280);
    expect(getBreakpointValue('2xl')).toBe(1536);
  });

  it('BREAKPOINT_VALUES map matches token values', () => {
    expect(BREAKPOINT_VALUES.sm).toBe(BREAKPOINT_SM.minWidth);
    expect(BREAKPOINT_VALUES.md).toBe(BREAKPOINT_MD.minWidth);
    expect(BREAKPOINT_VALUES.lg).toBe(BREAKPOINT_LG.minWidth);
    expect(BREAKPOINT_VALUES.xl).toBe(BREAKPOINT_XL.minWidth);
    expect(BREAKPOINT_VALUES['2xl']).toBe(BREAKPOINT_2XL.minWidth);
  });

  it('all breakpoint keys exist in BREAKPOINT_VALUES', () => {
    expect(BREAKPOINT_VALUES).toHaveProperty('sm');
    expect(BREAKPOINT_VALUES).toHaveProperty('md');
    expect(BREAKPOINT_VALUES).toHaveProperty('lg');
    expect(BREAKPOINT_VALUES).toHaveProperty('xl');
    expect(BREAKPOINT_VALUES).toHaveProperty('2xl');
  });

  it('BREAKPOINT_VALUES contains exactly 5 entries', () => {
    const keys = Object.keys(BREAKPOINT_VALUES);
    expect(keys).toHaveLength(5);
  });
});

// ============================================================================
// Utility Functions Tests
// ============================================================================

describe('Responsive Token Utility Functions', () => {
  describe('getResponsiveToken', () => {
    it('should return token for valid id', () => {
      const token = getResponsiveToken('breakpoint.md');
      expect(token).toBeDefined();
      expect(token!.id).toBe('breakpoint.md');
      expect(token!.minWidth).toBe(768);
    });

    it('should return undefined for invalid id', () => {
      const token = getResponsiveToken('breakpoint.invalid');
      expect(token).toBeUndefined();
    });

    it('should return correct token for each id', () => {
      expect(getResponsiveToken('breakpoint.sm')).toBe(BREAKPOINT_SM);
      expect(getResponsiveToken('breakpoint.md')).toBe(BREAKPOINT_MD);
      expect(getResponsiveToken('breakpoint.lg')).toBe(BREAKPOINT_LG);
      expect(getResponsiveToken('breakpoint.xl')).toBe(BREAKPOINT_XL);
      expect(getResponsiveToken('breakpoint.2xl')).toBe(BREAKPOINT_2XL);
    });
  });

  describe('getAllResponsiveTokens', () => {
    it('should return exactly 5 breakpoints', () => {
      const tokens = getAllResponsiveTokens();
      expect(tokens).toHaveLength(5);
    });

    it('should return all defined breakpoints', () => {
      const tokens = getAllResponsiveTokens();
      const ids = tokens.map(t => t.id).sort();
      expect(ids).toEqual([
        'breakpoint.2xl',
        'breakpoint.lg',
        'breakpoint.md',
        'breakpoint.sm',
        'breakpoint.xl',
      ]);
    });

    it('should return valid ResponsiveToken objects', () => {
      const tokens = getAllResponsiveTokens();
      tokens.forEach(token => {
        expect(token.id).toBeDefined();
        expect(token.minWidth).toBeDefined();
        expect(token.description).toBeDefined();
      });
    });
  });

  describe('getBreakpointMediaQuery', () => {
    it('getBreakpointMediaQuery generates correct media query', () => {
      expect(getBreakpointMediaQuery('sm')).toBe('@media (min-width: 640px)');
      expect(getBreakpointMediaQuery('md')).toBe('@media (min-width: 768px)');
      expect(getBreakpointMediaQuery('lg')).toBe('@media (min-width: 1024px)');
      expect(getBreakpointMediaQuery('xl')).toBe('@media (min-width: 1280px)');
      expect(getBreakpointMediaQuery('2xl')).toBe('@media (min-width: 1536px)');
    });

    it('should generate valid CSS media query format', () => {
      const query = getBreakpointMediaQuery('md');
      expect(query).toMatch(/^@media \(min-width: \d+px\)$/);
    });

    it('all breakpoints should generate valid media queries', () => {
      const breakpoints: Array<'sm' | 'md' | 'lg' | 'xl' | '2xl'> = ['sm', 'md', 'lg', 'xl', '2xl'];
      breakpoints.forEach(bp => {
        const query = getBreakpointMediaQuery(bp);
        expect(query).toContain('@media');
        expect(query).toContain('min-width');
        expect(query).toContain('px');
      });
    });
  });

  describe('sortBreakpointsBySize', () => {
    it('sortBreakpointsBySize sorts correctly', () => {
      const unsorted = [BREAKPOINT_XL, BREAKPOINT_SM, BREAKPOINT_2XL, BREAKPOINT_MD, BREAKPOINT_LG];
      const sorted = sortBreakpointsBySize(unsorted);
      expect(sorted[0].minWidth).toBe(640);
      expect(sorted[1].minWidth).toBe(768);
      expect(sorted[2].minWidth).toBe(1024);
      expect(sorted[3].minWidth).toBe(1280);
      expect(sorted[4].minWidth).toBe(1536);
    });

    it('should not mutate original array', () => {
      const original = [BREAKPOINT_XL, BREAKPOINT_SM, BREAKPOINT_MD];
      const originalOrder = [...original];
      sortBreakpointsBySize(original);
      expect(original).toEqual(originalOrder);
    });

    it('should handle already sorted array', () => {
      const sorted = [BREAKPOINT_SM, BREAKPOINT_MD, BREAKPOINT_LG, BREAKPOINT_XL, BREAKPOINT_2XL];
      const result = sortBreakpointsBySize(sorted);
      expect(result[0]).toBe(BREAKPOINT_SM);
      expect(result[4]).toBe(BREAKPOINT_2XL);
    });

    it('should handle single breakpoint', () => {
      const single = [BREAKPOINT_MD];
      const result = sortBreakpointsBySize(single);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(BREAKPOINT_MD);
    });

    it('should handle empty array', () => {
      const empty: (typeof BREAKPOINT_SM)[] = [];
      const result = sortBreakpointsBySize(empty);
      expect(result).toHaveLength(0);
    });
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Responsive Token Integration', () => {
  it('should integrate with ResponsiveTokenSchema from layout-validation', () => {
    const tokens = getAllResponsiveTokens();
    tokens.forEach(token => {
      const result = ResponsiveTokenSchema.safeParse(token);
      expect(result.success).toBe(true);
    });
  });

  it('should provide consistent data structure across all breakpoints', () => {
    const tokens = getAllResponsiveTokens();
    tokens.forEach(token => {
      expect(token).toHaveProperty('id');
      expect(token).toHaveProperty('minWidth');
      expect(token).toHaveProperty('description');
    });
  });

  it('breakpoint IDs should follow naming convention', () => {
    const tokens = getAllResponsiveTokens();
    const idPattern = /^breakpoint\.(sm|md|lg|xl|2xl)$/;
    tokens.forEach(token => {
      expect(token.id).toMatch(idPattern);
    });
  });

  it('should work with responsive config in other tokens', () => {
    // Test that breakpoint names match those used in ResponsiveConfig<T>
    const configBreakpoints = ['sm', 'md', 'lg', 'xl', '2xl'] as const;
    const tokenIds = getAllResponsiveTokens().map(t => t.id.split('.')[1]);

    configBreakpoints.forEach(bp => {
      expect(tokenIds).toContain(bp);
    });
  });
});

// ============================================================================
// Edge Cases and Validation Tests
// ============================================================================

describe('Responsive Token Edge Cases', () => {
  it('breakpoints should be in strictly increasing order', () => {
    const breakpoints = getAllResponsiveTokens();
    const widths = breakpoints.map(b => b.minWidth);

    for (let i = 1; i < widths.length; i++) {
      expect(widths[i]).toBeGreaterThan(widths[i - 1]);
    }
  });

  it('smallest breakpoint should be 640px (Tailwind sm)', () => {
    const breakpoints = getAllResponsiveTokens();
    const minWidth = Math.min(...breakpoints.map(b => b.minWidth));
    expect(minWidth).toBe(640);
  });

  it('largest breakpoint should be 1536px (Tailwind 2xl)', () => {
    const breakpoints = getAllResponsiveTokens();
    const maxWidth = Math.max(...breakpoints.map(b => b.minWidth));
    expect(maxWidth).toBe(1536);
  });

  it('no breakpoint should have maxWidth defined', () => {
    const breakpoints = getAllResponsiveTokens();
    breakpoints.forEach(bp => {
      expect(bp.maxWidth).toBeUndefined();
    });
  });

  it('all breakpoint minWidths should be multiples of 8 (design system convention)', () => {
    const breakpoints = getAllResponsiveTokens();
    breakpoints.forEach(bp => {
      expect(bp.minWidth % 8).toBe(0);
    });
  });
});

// ============================================================================
// Performance Tests
// ============================================================================

describe('Responsive Token Performance', () => {
  it('getResponsiveToken should be O(1) lookup', () => {
    const iterations = 10000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      getResponsiveToken('breakpoint.md');
    }

    const end = performance.now();
    const timePerLookup = (end - start) / iterations;

    // Should be extremely fast (less than 0.01ms per lookup)
    expect(timePerLookup).toBeLessThan(0.01);
  });

  it('getAllResponsiveTokens should be fast', () => {
    const iterations = 1000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      getAllResponsiveTokens();
    }

    const end = performance.now();
    const timePerCall = (end - start) / iterations;

    // Should be fast (less than 0.1ms per call)
    expect(timePerCall).toBeLessThan(0.1);
  });
});
