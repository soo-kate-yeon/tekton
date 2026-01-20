import { describe, it, expect, beforeEach } from 'vitest';
import { SlotValidator } from '../src/validators/slot-validator';
import { GlobalSlotRegistry } from '../src/registry/global-slot-registry';
import { LocalSlotRegistry } from '../src/registry/local-slot-registry';

describe('Max Children Constraint Enforcement', () => {
  let validator: SlotValidator;

  beforeEach(() => {
    const globalRegistry = new GlobalSlotRegistry();
    const localRegistry = new LocalSlotRegistry();
    validator = new SlotValidator(globalRegistry, localRegistry);
  });

  describe('Global slot max children', () => {
    it('should enforce header maxChildren=3', () => {
      // Pass with exactly 3
      expect(validator.validateMaxChildren('header', 3).isValid).toBe(true);

      // Pass with less than 3
      expect(validator.validateMaxChildren('header', 2).isValid).toBe(true);

      // Fail with more than 3
      expect(validator.validateMaxChildren('header', 4).isValid).toBe(false);
    });

    it('should enforce sidebar maxChildren=10', () => {
      expect(validator.validateMaxChildren('sidebar', 10).isValid).toBe(true);
      expect(validator.validateMaxChildren('sidebar', 5).isValid).toBe(true);
      expect(validator.validateMaxChildren('sidebar', 11).isValid).toBe(false);
    });

    it('should allow unlimited children in main slot', () => {
      expect(validator.validateMaxChildren('main', 100).isValid).toBe(true);
      expect(validator.validateMaxChildren('main', 1000).isValid).toBe(true);
      expect(validator.validateMaxChildren('main', 10000).isValid).toBe(true);
    });

    it('should enforce footer maxChildren=5', () => {
      expect(validator.validateMaxChildren('footer', 5).isValid).toBe(true);
      expect(validator.validateMaxChildren('footer', 3).isValid).toBe(true);
      expect(validator.validateMaxChildren('footer', 6).isValid).toBe(false);
    });
  });

  describe('Local slot max children', () => {
    it('should enforce card_actions maxChildren=5', () => {
      expect(validator.validateMaxChildren('card_actions', 5).isValid).toBe(true);
      expect(validator.validateMaxChildren('card_actions', 3).isValid).toBe(true);
      expect(validator.validateMaxChildren('card_actions', 6).isValid).toBe(false);
    });

    it('should enforce table_toolbar maxChildren=8', () => {
      expect(validator.validateMaxChildren('table_toolbar', 8).isValid).toBe(true);
      expect(validator.validateMaxChildren('table_toolbar', 4).isValid).toBe(true);
      expect(validator.validateMaxChildren('table_toolbar', 9).isValid).toBe(false);
    });

    it('should enforce modal_footer maxChildren=4', () => {
      expect(validator.validateMaxChildren('modal_footer', 4).isValid).toBe(true);
      expect(validator.validateMaxChildren('modal_footer', 2).isValid).toBe(true);
      expect(validator.validateMaxChildren('modal_footer', 5).isValid).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero children', () => {
      expect(validator.validateMaxChildren('header', 0).isValid).toBe(true);
    });

    it('should handle exactly at limit', () => {
      expect(validator.validateMaxChildren('header', 3).isValid).toBe(true);
      expect(validator.validateMaxChildren('card_actions', 5).isValid).toBe(true);
    });

    it('should handle one over limit', () => {
      const result = validator.validateMaxChildren('header', 4);

      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe('LAYER3-E003');
      expect(result.errors[0].message).toContain('exceeds maxChildren');
    });

    it('should provide detailed error context', () => {
      const result = validator.validateMaxChildren('header', 10);

      expect(result.errors[0].context).toMatchObject({
        slotName: 'header',
        childrenCount: 10,
        maxChildren: 3,
      });
    });
  });

  describe('Comprehensive validation with max children', () => {
    it('should combine max children with other constraints', () => {
      // Violates maxChildren
      const result1 = validator.validateSlot('header', {
        childrenCount: 5,
        componentTypes: ['Button'],
      });
      expect(result1.isValid).toBe(false);

      // Violates excludedComponents
      const result2 = validator.validateSlot('header', {
        childrenCount: 2,
        componentTypes: ['DataTable'],
      });
      expect(result2.isValid).toBe(false);

      // Passes all constraints
      const result3 = validator.validateSlot('header', {
        childrenCount: 2,
        componentTypes: ['Button', 'Logo'],
      });
      expect(result3.isValid).toBe(true);
    });

    it('should collect all constraint violations', () => {
      const result = validator.validateSlot('header', {
        childrenCount: 10,
        componentTypes: ['Button', 'DataTable'],
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });
});
