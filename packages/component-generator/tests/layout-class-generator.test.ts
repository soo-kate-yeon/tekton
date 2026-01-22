/**
 * Layout Class Generator Tests
 * SPEC-LAYOUT-001 - TASK-008
 *
 * Tests for generateLayoutClasses function that produces Tailwind CSS classes.
 */

import { describe, it, expect } from 'vitest';
import { generateLayoutClasses } from '../src/generator/layout-class-generator.js';
import type { BlueprintLayout } from '../src/index.js';

describe('generateLayoutClasses', () => {
  describe('AC-008: Container Classes', () => {
    it('should include "container" and "mx-auto" for container: fixed', () => {
      const classes = generateLayoutClasses({ container: 'fixed' });
      expect(classes).toContain('container');
      expect(classes).toContain('mx-auto');
    });

    it('should include "container" and "mx-auto" for container: fluid', () => {
      const classes = generateLayoutClasses({ container: 'fluid' });
      expect(classes).toContain('container');
      expect(classes).toContain('mx-auto');
    });

    it('should not include container classes for container: none', () => {
      const classes = generateLayoutClasses({ container: 'none' });
      expect(classes).not.toContain('container');
      expect(classes).not.toContain('mx-auto');
    });

    it('should include container classes by default', () => {
      const classes = generateLayoutClasses({});
      expect(classes).toContain('container');
      expect(classes).toContain('mx-auto');
    });
  });

  describe('MaxWidth classes', () => {
    it('should include max-w-{preset} when maxWidth is specified', () => {
      const classes = generateLayoutClasses({ maxWidth: 'xl' });
      expect(classes).toContain('max-w-xl');
    });

    it('should include max-w-2xl for 2xl preset', () => {
      const classes = generateLayoutClasses({ maxWidth: '2xl' });
      expect(classes).toContain('max-w-2xl');
    });

    it('should include max-w-full for full preset', () => {
      const classes = generateLayoutClasses({ maxWidth: 'full' });
      expect(classes).toContain('max-w-full');
    });

    it('should include max-w-prose for prose preset', () => {
      const classes = generateLayoutClasses({ maxWidth: 'prose' });
      expect(classes).toContain('max-w-prose');
    });

    it('should not include max-w class when maxWidth is not specified', () => {
      const classes = generateLayoutClasses({});
      const hasMaxW = classes.some((c) => c.startsWith('max-w-'));
      expect(hasMaxW).toBe(false);
    });
  });

  describe('Padding classes', () => {
    it('should include px-{n} when padding is specified', () => {
      const classes = generateLayoutClasses({ padding: 6 });
      expect(classes).toContain('px-6');
    });

    it('should include responsive padding when padding is not specified', () => {
      const classes = generateLayoutClasses({}, 'responsive');
      // Should have responsive padding defaults
      expect(classes).toContain('px-4');
      expect(classes).toContain('sm:px-6');
      expect(classes).toContain('md:px-8');
    });
  });

  describe('AC-009: Responsive Grid Classes', () => {
    it('should include grid-cols-{n} for default breakpoint', () => {
      const layout: BlueprintLayout = {
        grid: { default: 1, sm: 2, lg: 4 },
      };
      const classes = generateLayoutClasses(layout);

      expect(classes).toContain('grid-cols-1');
      expect(classes).toContain('sm:grid-cols-2');
      expect(classes).toContain('lg:grid-cols-4');
    });

    it('should generate responsive grid classes for all breakpoints', () => {
      const layout: BlueprintLayout = {
        grid: {
          default: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 6,
          '2xl': 12,
        },
      };
      const classes = generateLayoutClasses(layout);

      expect(classes).toContain('grid-cols-1');
      expect(classes).toContain('sm:grid-cols-2');
      expect(classes).toContain('md:grid-cols-3');
      expect(classes).toContain('lg:grid-cols-4');
      expect(classes).toContain('xl:grid-cols-6');
      expect(classes).toContain('2xl:grid-cols-12');
    });

    it('should generate environment-based default grid when no grid specified', () => {
      const classes = generateLayoutClasses({}, 'responsive');

      expect(classes).toContain('grid-cols-4');
      expect(classes).toContain('sm:grid-cols-4');
      expect(classes).toContain('md:grid-cols-8');
      expect(classes).toContain('lg:grid-cols-12');
    });
  });

  describe('AC-010: Gap Classes', () => {
    it('should include gap-{n} for numeric gap', () => {
      const classes = generateLayoutClasses({ gap: 6 });
      expect(classes).toContain('gap-6');
    });

    it('should include gap-x-{n} and gap-y-{n} for object gap', () => {
      const classes = generateLayoutClasses({ gap: { x: 4, y: 8 } });
      expect(classes).toContain('gap-x-4');
      expect(classes).toContain('gap-y-8');
    });

    it('should include only gap-x-{n} when only x is specified', () => {
      const classes = generateLayoutClasses({ gap: { x: 6 } });
      expect(classes).toContain('gap-x-6');
      expect(classes).not.toContain('gap-y-');
    });

    it('should include only gap-y-{n} when only y is specified', () => {
      const classes = generateLayoutClasses({ gap: { y: 8 } });
      expect(classes).toContain('gap-y-8');
      expect(classes).not.toContain('gap-x-');
    });

    it('should include responsive gap when gap is not specified', () => {
      const classes = generateLayoutClasses({}, 'responsive');
      expect(classes).toContain('gap-4');
      expect(classes).toContain('md:gap-6');
    });
  });

  describe('Grid display class', () => {
    it('should include grid class', () => {
      const classes = generateLayoutClasses({});
      expect(classes).toContain('grid');
    });
  });

  describe('Mobile environment', () => {
    it('should generate mobile-appropriate classes', () => {
      const classes = generateLayoutClasses({}, 'mobile');

      expect(classes).toContain('grid-cols-4');
      expect(classes).toContain('sm:grid-cols-4');
      // Should NOT include lg, xl, 2xl grid classes
      expect(classes).not.toContain('lg:grid-cols-12');
      expect(classes).not.toContain('xl:grid-cols-12');
    });
  });

  describe('Class array format', () => {
    it('should return an array of strings', () => {
      const classes = generateLayoutClasses({});
      expect(Array.isArray(classes)).toBe(true);
      expect(classes.every((c) => typeof c === 'string')).toBe(true);
    });

    it('should not contain empty strings', () => {
      const classes = generateLayoutClasses({});
      expect(classes.every((c) => c.length > 0)).toBe(true);
    });

    it('should not contain duplicate classes', () => {
      const classes = generateLayoutClasses({});
      const unique = new Set(classes);
      expect(unique.size).toBe(classes.length);
    });
  });

  describe('Full configuration', () => {
    it('should handle complete layout configuration', () => {
      const layout: BlueprintLayout = {
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
        gap: { x: 6, y: 8 },
      };

      const classes = generateLayoutClasses(layout);

      expect(classes).toContain('container');
      expect(classes).toContain('mx-auto');
      expect(classes).toContain('max-w-2xl');
      expect(classes).toContain('px-6');
      expect(classes).toContain('grid');
      expect(classes).toContain('grid-cols-1');
      expect(classes).toContain('sm:grid-cols-2');
      expect(classes).toContain('lg:grid-cols-3');
      expect(classes).toContain('gap-x-6');
      expect(classes).toContain('gap-y-8');
    });
  });
});
