/**
 * Constraint Validator Tests
 * TAG: SPEC-LAYER3-001 Section 5.5.3
 *
 * Tests for excluded slot enforcement
 */

import { describe, it, expect } from 'vitest';
import { ConstraintValidator } from '../../src/safety/constraint-validator';

describe('ConstraintValidator', () => {
  const validator = new ConstraintValidator();

  describe('checkExcludedSlot', () => {
    it('should allow component in non-excluded slot', () => {
      const result = validator.checkExcludedSlot('Button', 'main');

      expect(result.isAllowed).toBe(true);
      expect(result.componentName).toBe('Button');
      expect(result.targetSlot).toBe('main');
      expect(result.score).toBeGreaterThan(0);
      expect(result.reason).toBeUndefined();
    });

    it('should allow Card in main slot', () => {
      const result = validator.checkExcludedSlot('Card', 'main');

      expect(result.isAllowed).toBe(true);
      expect(result.score).toBeGreaterThan(0);
    });

    it('should block Modal from main slot (excluded)', () => {
      const result = validator.checkExcludedSlot('Modal', 'main');

      expect(result.isAllowed).toBe(false);
      expect(result.componentName).toBe('Modal');
      expect(result.targetSlot).toBe('main');
      expect(result.score).toBe(0.0);
      expect(result.reason).toBeDefined();
      expect(result.reason).toContain('excluded');
    });

    it('should block Modal from sidebar slot (excluded)', () => {
      const result = validator.checkExcludedSlot('Modal', 'sidebar');

      expect(result.isAllowed).toBe(false);
      expect(result.score).toBe(0.0);
      expect(result.reason).toContain('Modal');
      expect(result.reason).toContain('sidebar');
    });

    it('should block Modal from header slot (excluded)', () => {
      const result = validator.checkExcludedSlot('Modal', 'header');

      expect(result.isAllowed).toBe(false);
      expect(result.score).toBe(0.0);
    });

    it('should block Modal from footer slot (excluded)', () => {
      const result = validator.checkExcludedSlot('Modal', 'footer');

      expect(result.isAllowed).toBe(false);
      expect(result.score).toBe(0.0);
    });

    it('should allow Modal in overlay slot (not excluded)', () => {
      const result = validator.checkExcludedSlot('Modal', 'overlay');

      expect(result.isAllowed).toBe(true);
      expect(result.score).toBeGreaterThan(0);
    });

    it('should block Toast from main slot (excluded)', () => {
      const result = validator.checkExcludedSlot('Toast', 'main');

      expect(result.isAllowed).toBe(false);
      expect(result.score).toBe(0.0);
    });

    it('should block Toast from sidebar slot (excluded)', () => {
      const result = validator.checkExcludedSlot('Toast', 'sidebar');

      expect(result.isAllowed).toBe(false);
      expect(result.score).toBe(0.0);
    });

    it('should block Toast from header slot (excluded)', () => {
      const result = validator.checkExcludedSlot('Toast', 'header');

      expect(result.isAllowed).toBe(false);
      expect(result.score).toBe(0.0);
    });

    it('should block Toast from footer slot (excluded)', () => {
      const result = validator.checkExcludedSlot('Toast', 'footer');

      expect(result.isAllowed).toBe(false);
      expect(result.score).toBe(0.0);
    });

    it('should allow Toast in overlay slot (not excluded)', () => {
      const result = validator.checkExcludedSlot('Toast', 'overlay');

      expect(result.isAllowed).toBe(true);
      expect(result.score).toBeGreaterThan(0);
    });

    it('should handle component with no excluded slots', () => {
      const result = validator.checkExcludedSlot('Button', 'header');

      expect(result.isAllowed).toBe(true);
      expect(result.score).toBeGreaterThan(0);
    });

    it('should return original score when allowed', () => {
      const result = validator.checkExcludedSlot('Button', 'main', 0.85);

      expect(result.isAllowed).toBe(true);
      expect(result.score).toBe(0.85);
    });

    it('should force score to 0.0 when excluded regardless of input score', () => {
      const result = validator.checkExcludedSlot('Modal', 'main', 0.95);

      expect(result.isAllowed).toBe(false);
      expect(result.score).toBe(0.0);
    });

    it('should provide clear reason for exclusion', () => {
      const result = validator.checkExcludedSlot('Modal', 'header');

      expect(result.reason).toContain('Modal');
      expect(result.reason).toContain('header');
      expect(result.reason?.toLowerCase()).toContain('excluded');
    });

    it('should handle unknown component gracefully', () => {
      const result = validator.checkExcludedSlot('UnknownComponent', 'main');

      // Should allow unknown components (hallucination check handles this)
      expect(result.isAllowed).toBe(true);
    });

    it('should handle unknown slot gracefully', () => {
      const result = validator.checkExcludedSlot('Button', 'unknown-slot');

      // Should allow if slot is unknown (no exclusion defined)
      expect(result.isAllowed).toBe(true);
    });
  });

  describe('isComponentAllowedInSlot', () => {
    it('should return true for allowed placements', () => {
      expect(validator.isComponentAllowedInSlot('Button', 'main')).toBe(true);
      expect(validator.isComponentAllowedInSlot('Card', 'sidebar')).toBe(true);
      expect(validator.isComponentAllowedInSlot('Modal', 'overlay')).toBe(true);
    });

    it('should return false for excluded placements', () => {
      expect(validator.isComponentAllowedInSlot('Modal', 'main')).toBe(false);
      expect(validator.isComponentAllowedInSlot('Modal', 'sidebar')).toBe(false);
      expect(validator.isComponentAllowedInSlot('Toast', 'header')).toBe(false);
    });
  });

  describe('getExcludedSlots', () => {
    it('should return excluded slots for Modal', () => {
      const excluded = validator.getExcludedSlots('Modal');

      expect(excluded).toContain('main');
      expect(excluded).toContain('sidebar');
      expect(excluded).toContain('header');
      expect(excluded).toContain('footer');
      expect(excluded.length).toBe(4);
    });

    it('should return excluded slots for Toast', () => {
      const excluded = validator.getExcludedSlots('Toast');

      expect(excluded).toContain('main');
      expect(excluded).toContain('sidebar');
      expect(excluded).toContain('header');
      expect(excluded).toContain('footer');
      expect(excluded.length).toBe(4);
    });

    it('should return empty array for component with no exclusions', () => {
      const excluded = validator.getExcludedSlots('Button');

      expect(excluded).toEqual([]);
    });

    it('should return empty array for unknown component', () => {
      const excluded = validator.getExcludedSlots('UnknownComponent');

      expect(excluded).toEqual([]);
    });
  });
});
