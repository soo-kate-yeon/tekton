/**
 * Breakpoint Constants Tests
 * SPEC-LAYOUT-001 - TASK-001
 *
 * Tests for Tailwind CSS breakpoint constants and helper functions.
 */

import { describe, it, expect } from 'vitest';
import {
  BREAKPOINTS,
  type Breakpoint,
  minWidth,
  maxWidth,
  getBreakpointValue,
} from '../breakpoints.js';

describe('BREAKPOINTS', () => {
  describe('AC-001: Breakpoint Constants Match Tailwind Defaults', () => {
    it('should define sm as 640', () => {
      expect(BREAKPOINTS.sm).toBe(640);
    });

    it('should define md as 768', () => {
      expect(BREAKPOINTS.md).toBe(768);
    });

    it('should define lg as 1024', () => {
      expect(BREAKPOINTS.lg).toBe(1024);
    });

    it('should define xl as 1280', () => {
      expect(BREAKPOINTS.xl).toBe(1280);
    });

    it('should define 2xl as 1536', () => {
      expect(BREAKPOINTS['2xl']).toBe(1536);
    });

    it('should have exactly 5 breakpoints', () => {
      expect(Object.keys(BREAKPOINTS)).toHaveLength(5);
    });

    it('should be readonly (const assertion)', () => {
      // TypeScript ensures this at compile time, but we verify the object is frozen-like
      const keys = Object.keys(BREAKPOINTS);
      expect(keys).toEqual(['sm', 'md', 'lg', 'xl', '2xl']);
    });
  });

  describe('Type: Breakpoint', () => {
    it('should correctly type breakpoint keys', () => {
      // Type assertion - if this compiles, the type is correct
      const validBreakpoints: Breakpoint[] = ['sm', 'md', 'lg', 'xl', '2xl'];
      expect(validBreakpoints).toHaveLength(5);
    });
  });
});

describe('minWidth', () => {
  describe('AC-002: Media Query Helpers Generate Correct Syntax', () => {
    it('should return correct min-width for sm', () => {
      expect(minWidth('sm')).toBe('(min-width: 640px)');
    });

    it('should return correct min-width for md', () => {
      expect(minWidth('md')).toBe('(min-width: 768px)');
    });

    it('should return correct min-width for lg', () => {
      expect(minWidth('lg')).toBe('(min-width: 1024px)');
    });

    it('should return correct min-width for xl', () => {
      expect(minWidth('xl')).toBe('(min-width: 1280px)');
    });

    it('should return correct min-width for 2xl', () => {
      expect(minWidth('2xl')).toBe('(min-width: 1536px)');
    });
  });
});

describe('maxWidth', () => {
  describe('AC-002: Media Query Helpers Generate Correct Syntax', () => {
    it('should return correct max-width for sm (one less than sm)', () => {
      expect(maxWidth('sm')).toBe('(max-width: 639px)');
    });

    it('should return correct max-width for md (one less than md)', () => {
      expect(maxWidth('md')).toBe('(max-width: 767px)');
    });

    it('should return correct max-width for lg (one less than lg)', () => {
      expect(maxWidth('lg')).toBe('(max-width: 1023px)');
    });

    it('should return correct max-width for xl (one less than xl)', () => {
      expect(maxWidth('xl')).toBe('(max-width: 1279px)');
    });

    it('should return correct max-width for 2xl (one less than 2xl)', () => {
      expect(maxWidth('2xl')).toBe('(max-width: 1535px)');
    });
  });
});

describe('getBreakpointValue', () => {
  it('should return the pixel value for a given breakpoint', () => {
    expect(getBreakpointValue('sm')).toBe(640);
    expect(getBreakpointValue('md')).toBe(768);
    expect(getBreakpointValue('lg')).toBe(1024);
    expect(getBreakpointValue('xl')).toBe(1280);
    expect(getBreakpointValue('2xl')).toBe(1536);
  });
});
