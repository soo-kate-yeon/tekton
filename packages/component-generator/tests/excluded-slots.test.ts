import { describe, it, expect, beforeEach } from 'vitest';
import { SlotValidator } from '../src/validators/slot-validator';
import { GlobalSlotRegistry } from '../src/registry/global-slot-registry';
import { LocalSlotRegistry } from '../src/registry/local-slot-registry';

describe('Excluded Slot Enforcement (SPEC Scenario 3.3)', () => {
  let validator: SlotValidator;

  beforeEach(() => {
    const globalRegistry = new GlobalSlotRegistry();
    const localRegistry = new LocalSlotRegistry();
    validator = new SlotValidator(globalRegistry, localRegistry);
  });

  describe('DataTable exclusion from global slots', () => {
    it('should reject DataTable in header slot', () => {
      const result = validator.validateExcludedComponents('header', [
        'Button',
        'DataTable',
      ]);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('LAYER3-E003');
      expect(result.errors[0].message).toContain('DataTable');
      expect(result.errors[0].message).toContain('excluded');
    });

    it('should reject DataTable in sidebar slot', () => {
      const result = validator.validateExcludedComponents('sidebar', [
        'NavigationMenu',
        'DataTable',
      ]);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('LAYER3-E003');
      expect(result.errors[0].message).toContain('DataTable');
    });

    it('should reject DataTable in footer slot', () => {
      const result = validator.validateExcludedComponents('footer', [
        'Copyright',
        'DataTable',
      ]);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('LAYER3-E003');
      expect(result.errors[0].message).toContain('DataTable');
    });

    it('should allow DataTable in main slot', () => {
      const result = validator.validateExcludedComponents('main', [
        'DataTable',
        'Chart',
      ]);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Multiple excluded components', () => {
    it('should reject multiple excluded components', () => {
      const result = validator.validateExcludedComponents('header', [
        'Button',
        'DataTable',
        'DataTable',
      ]);

      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toContain('DataTable');
    });

    it('should allow when no excluded components present', () => {
      const result = validator.validateExcludedComponents('header', [
        'Button',
        'Logo',
        'SearchBar',
      ]);

      expect(result.isValid).toBe(true);
    });
  });

  describe('Comprehensive slot validation with exclusions', () => {
    it('should validate all constraints including exclusions', () => {
      const result = validator.validateSlot('header', {
        childrenCount: 2,
        componentTypes: ['Button', 'DataTable'],
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('excluded'))).toBe(true);
    });

    it('should pass validation when all constraints met', () => {
      const result = validator.validateSlot('header', {
        childrenCount: 2,
        componentTypes: ['Button', 'Logo'],
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Error message quality', () => {
    it('should provide clear error messages for excluded components', () => {
      const result = validator.validateExcludedComponents('sidebar', ['DataTable']);

      expect(result.errors[0].message).toMatch(/Slot 'sidebar'/);
      expect(result.errors[0].message).toMatch(/excluded/);
      expect(result.errors[0].message).toMatch(/DataTable/);
    });

    it('should include context in validation errors', () => {
      const result = validator.validateExcludedComponents('footer', ['DataTable']);

      expect(result.errors[0].context).toBeDefined();
      expect(result.errors[0].context?.slotName).toBe('footer');
      expect(result.errors[0].context?.excludedComponents).toContain('DataTable');
    });
  });
});
