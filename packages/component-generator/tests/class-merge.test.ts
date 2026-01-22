/**
 * Class Merge Utility Tests
 * SPEC-LAYOUT-001 - TASK-010
 *
 * Tests for tailwind-merge integration to resolve class conflicts.
 */

import { describe, it, expect } from 'vitest';
import { mergeClasses, mergeLayoutClasses } from '../src/utils/class-merge.js';

describe('mergeClasses', () => {
  describe('AC-010: Conflict Resolution', () => {
    it('should resolve padding conflicts (later wins)', () => {
      const result = mergeClasses('px-4', 'px-6');
      expect(result).toBe('px-6');
    });

    it('should resolve grid column conflicts', () => {
      const result = mergeClasses('grid-cols-4', 'grid-cols-6');
      expect(result).toBe('grid-cols-6');
    });

    it('should resolve gap conflicts', () => {
      const result = mergeClasses('gap-4', 'gap-8');
      expect(result).toBe('gap-8');
    });

    it('should resolve max-width conflicts', () => {
      const result = mergeClasses('max-w-xl', 'max-w-2xl');
      expect(result).toBe('max-w-2xl');
    });

    it('should preserve non-conflicting classes', () => {
      const result = mergeClasses('container mx-auto', 'px-4 py-2');
      expect(result).toContain('container');
      expect(result).toContain('mx-auto');
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
    });
  });

  describe('Responsive prefix handling', () => {
    it('should handle responsive prefixes correctly', () => {
      const result = mergeClasses('md:px-4', 'md:px-8');
      expect(result).toBe('md:px-8');
    });

    it('should not conflict different breakpoints', () => {
      const result = mergeClasses('sm:px-4', 'md:px-6', 'lg:px-8');
      expect(result).toContain('sm:px-4');
      expect(result).toContain('md:px-6');
      expect(result).toContain('lg:px-8');
    });

    it('should resolve same breakpoint conflicts', () => {
      const result = mergeClasses('lg:grid-cols-3', 'lg:grid-cols-4');
      expect(result).toBe('lg:grid-cols-4');
    });
  });

  describe('Multiple class handling', () => {
    it('should accept multiple string arguments', () => {
      const result = mergeClasses('class1', 'class2', 'class3');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).toContain('class3');
    });

    it('should handle undefined and empty strings', () => {
      const result = mergeClasses('container', undefined, '', 'mx-auto');
      expect(result).toBe('container mx-auto');
    });

    it('should handle array of classes', () => {
      const result = mergeClasses(['container', 'mx-auto'], 'px-4');
      expect(result).toContain('container');
      expect(result).toContain('mx-auto');
      expect(result).toContain('px-4');
    });
  });
});

describe('mergeLayoutClasses', () => {
  describe('Layout-specific merging', () => {
    it('should merge layout classes with component classes', () => {
      const layoutClasses = 'container mx-auto grid grid-cols-4';
      const componentClasses = 'bg-white rounded-lg';

      const result = mergeLayoutClasses(layoutClasses, componentClasses);

      expect(result).toContain('container');
      expect(result).toContain('mx-auto');
      expect(result).toContain('grid');
      expect(result).toContain('grid-cols-4');
      expect(result).toContain('bg-white');
      expect(result).toContain('rounded-lg');
    });

    it('should resolve layout override by component', () => {
      const layoutClasses = 'px-4 py-2';
      const componentClasses = 'px-8'; // Component overrides layout padding

      const result = mergeLayoutClasses(layoutClasses, componentClasses);

      expect(result).toBe('py-2 px-8');
    });

    it('should handle empty layout classes', () => {
      const result = mergeLayoutClasses('', 'bg-white');
      expect(result).toBe('bg-white');
    });

    it('should handle empty component classes', () => {
      const result = mergeLayoutClasses('container mx-auto', '');
      expect(result).toBe('container mx-auto');
    });

    it('should return empty string when both are empty', () => {
      const result = mergeLayoutClasses('', '');
      expect(result).toBe('');
    });
  });

  describe('Complex conflict resolution', () => {
    it('should resolve complex grid conflicts', () => {
      const layoutClasses = 'grid grid-cols-4 gap-4 sm:grid-cols-4 md:grid-cols-8';
      const componentClasses = 'grid-cols-6 md:grid-cols-6';

      const result = mergeLayoutClasses(layoutClasses, componentClasses);
      const classes = result.split(' ');

      // grid-cols-4 (unprefixed) should be overridden by grid-cols-6
      expect(classes).toContain('grid-cols-6');
      expect(classes).not.toContain('grid-cols-4');
      // md:grid-cols-8 should be overridden by md:grid-cols-6
      expect(classes).toContain('md:grid-cols-6');
      expect(classes).not.toContain('md:grid-cols-8');
      // sm:grid-cols-4 should remain (no conflict)
      expect(classes).toContain('sm:grid-cols-4');
      // gap-4 should remain
      expect(classes).toContain('gap-4');
    });
  });
});
