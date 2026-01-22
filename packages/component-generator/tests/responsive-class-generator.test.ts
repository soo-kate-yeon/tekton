/**
 * Responsive Class Generator Tests
 * SPEC-LAYOUT-001 - TASK-011
 *
 * Tests for responsive class generation utilities that create
 * breakpoint-prefixed Tailwind CSS classes.
 */

import { describe, it, expect } from 'vitest';
import {
  generateResponsiveClasses,
  generateResponsiveGridClasses,
  generateResponsivePaddingClasses,
  generateResponsiveGapClasses,
} from '../src/utils/responsive-class-generator.js';

describe('generateResponsiveClasses', () => {
  describe('Basic functionality', () => {
    it('should generate classes for all breakpoints', () => {
      const values = {
        default: 4,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 10,
        '2xl': 12,
      };

      const result = generateResponsiveClasses('p', values);

      expect(result).toContain('p-4');
      expect(result).toContain('sm:p-4');
      expect(result).toContain('md:p-6');
      expect(result).toContain('lg:p-8');
      expect(result).toContain('xl:p-10');
      expect(result).toContain('2xl:p-12');
    });

    it('should skip undefined breakpoints', () => {
      const values = {
        default: 4,
        lg: 8,
      };

      const result = generateResponsiveClasses('p', values);

      expect(result).toContain('p-4');
      expect(result).toContain('lg:p-8');
      expect(result).not.toContain('sm:');
      expect(result).not.toContain('md:');
      expect(result).not.toContain('xl:');
    });

    it('should handle only default value', () => {
      const values = { default: 6 };

      const result = generateResponsiveClasses('gap', values);

      expect(result).toEqual(['gap-6']);
    });

    it('should return empty array for empty values', () => {
      const result = generateResponsiveClasses('p', {});

      expect(result).toEqual([]);
    });
  });

  describe('String value support', () => {
    it('should support string values', () => {
      const values = {
        default: 'auto',
        md: 'full',
      };

      const result = generateResponsiveClasses('w', values);

      expect(result).toContain('w-auto');
      expect(result).toContain('md:w-full');
    });
  });
});

describe('generateResponsiveGridClasses', () => {
  describe('Grid column generation', () => {
    it('should generate grid-cols classes for each breakpoint', () => {
      const config = {
        default: 1,
        sm: 2,
        md: 3,
        lg: 4,
      };

      const result = generateResponsiveGridClasses(config);

      expect(result).toContain('grid-cols-1');
      expect(result).toContain('sm:grid-cols-2');
      expect(result).toContain('md:grid-cols-3');
      expect(result).toContain('lg:grid-cols-4');
    });

    it('should handle mobile-first progression', () => {
      const config = {
        default: 1,
        md: 2,
        lg: 3,
        xl: 4,
      };

      const result = generateResponsiveGridClasses(config);

      expect(result).toContain('grid-cols-1');
      expect(result).not.toContain('sm:grid-cols-');
      expect(result).toContain('md:grid-cols-2');
      expect(result).toContain('lg:grid-cols-3');
      expect(result).toContain('xl:grid-cols-4');
    });

    it('should return empty array for empty config', () => {
      const result = generateResponsiveGridClasses({});

      expect(result).toEqual([]);
    });
  });
});

describe('generateResponsivePaddingClasses', () => {
  describe('Padding generation', () => {
    it('should generate responsive px classes', () => {
      const config = {
        default: 4,
        sm: 6,
        md: 8,
        lg: 12,
      };

      const result = generateResponsivePaddingClasses(config);

      expect(result).toContain('px-4');
      expect(result).toContain('sm:px-6');
      expect(result).toContain('md:px-8');
      expect(result).toContain('lg:px-12');
    });

    it('should handle single value', () => {
      const config = { default: 4 };

      const result = generateResponsivePaddingClasses(config);

      expect(result).toEqual(['px-4']);
    });
  });
});

describe('generateResponsiveGapClasses', () => {
  describe('Gap generation', () => {
    it('should generate responsive gap classes', () => {
      const config = {
        default: 4,
        md: 6,
        lg: 8,
      };

      const result = generateResponsiveGapClasses(config);

      expect(result).toContain('gap-4');
      expect(result).toContain('md:gap-6');
      expect(result).toContain('lg:gap-8');
    });

    it('should handle x and y separately', () => {
      const configX = { default: 4, md: 6 };
      const configY = { default: 2, md: 4 };

      const resultX = generateResponsiveGapClasses(configX, 'x');
      const resultY = generateResponsiveGapClasses(configY, 'y');

      expect(resultX).toContain('gap-x-4');
      expect(resultX).toContain('md:gap-x-6');
      expect(resultY).toContain('gap-y-2');
      expect(resultY).toContain('md:gap-y-4');
    });

    it('should default to uniform gap', () => {
      const config = { default: 4 };

      const result = generateResponsiveGapClasses(config);

      expect(result).toEqual(['gap-4']);
    });
  });
});
