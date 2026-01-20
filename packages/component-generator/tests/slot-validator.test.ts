import { describe, it, expect, beforeEach } from 'vitest';
import { SlotValidator } from '../src/validators/slot-validator';
import { GlobalSlotRegistry } from '../src/registry/global-slot-registry';
import { LocalSlotRegistry } from '../src/registry/local-slot-registry';

describe('SlotValidator', () => {
  let validator: SlotValidator;
  let globalRegistry: GlobalSlotRegistry;
  let localRegistry: LocalSlotRegistry;

  beforeEach(() => {
    globalRegistry = new GlobalSlotRegistry();
    localRegistry = new LocalSlotRegistry();
    validator = new SlotValidator(globalRegistry, localRegistry);
  });

  describe('validateMaxChildren', () => {
    it('should pass when children count is within limit', () => {
      const result = validator.validateMaxChildren('header', 2);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when children count exceeds limit', () => {
      const result = validator.validateMaxChildren('header', 5);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('LAYER3-E003');
      expect(result.errors[0].message).toContain('maxChildren');
    });

    it('should pass when slot has unlimited children', () => {
      const result = validator.validateMaxChildren('main', 1000);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle local slots', () => {
      const result = validator.validateMaxChildren('card_actions', 3);

      expect(result.isValid).toBe(true);
    });

    it('should fail for local slots exceeding limit', () => {
      const result = validator.validateMaxChildren('card_actions', 10);

      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe('LAYER3-E003');
    });
  });

  describe('validateAllowedComponents', () => {
    it('should pass when all components are allowed', () => {
      const result = validator.validateAllowedComponents(
        'card_actions',
        ['Button', 'Link']
      );

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when component is not allowed', () => {
      const result = validator.validateAllowedComponents(
        'card_actions',
        ['Button', 'DataTable']
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('LAYER3-E003');
      expect(result.errors[0].message).toContain('DataTable');
    });

    it('should pass when no allowedComponents constraint exists', () => {
      const result = validator.validateAllowedComponents(
        'main',
        ['AnyComponent']
      );

      expect(result.isValid).toBe(true);
    });

    it('should handle empty component list', () => {
      const result = validator.validateAllowedComponents('card_actions', []);

      expect(result.isValid).toBe(true);
    });
  });

  describe('validateExcludedComponents', () => {
    it('should pass when no excluded components are present', () => {
      const result = validator.validateExcludedComponents(
        'header',
        ['Button', 'Link']
      );

      expect(result.isValid).toBe(true);
    });

    it('should fail when excluded component is present', () => {
      const result = validator.validateExcludedComponents(
        'header',
        ['Button', 'DataTable']
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('LAYER3-E003');
      expect(result.errors[0].message).toContain('DataTable');
    });

    it('should pass when no excludedComponents constraint exists', () => {
      const result = validator.validateExcludedComponents(
        'main',
        ['DataTable']
      );

      expect(result.isValid).toBe(true);
    });
  });

  describe('validateSlot', () => {
    it('should perform comprehensive validation', () => {
      const result = validator.validateSlot('header', {
        childrenCount: 2,
        componentTypes: ['Button', 'Link'],
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should collect multiple validation errors', () => {
      const result = validator.validateSlot('header', {
        childrenCount: 10,
        componentTypes: ['DataTable', 'Button'],
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate local slots', () => {
      const result = validator.validateSlot('card_actions', {
        childrenCount: 3,
        componentTypes: ['Button', 'Icon'],
      });

      expect(result.isValid).toBe(true);
    });
  });
});
