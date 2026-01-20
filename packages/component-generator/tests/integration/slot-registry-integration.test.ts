import { describe, it, expect, beforeEach } from 'vitest';
import { GlobalSlotRegistry } from '../../src/registry/global-slot-registry';
import { LocalSlotRegistry } from '../../src/registry/local-slot-registry';
import { SlotValidator } from '../../src/validators/slot-validator';
import { SlotResolver } from '../../src/resolvers/slot-resolver';

/**
 * Integration tests for the complete slot registry system
 * Tests the interaction between all components
 */
describe('Slot Registry Integration Tests', () => {
  let globalRegistry: GlobalSlotRegistry;
  let localRegistry: LocalSlotRegistry;
  let validator: SlotValidator;
  let resolver: SlotResolver;

  beforeEach(() => {
    globalRegistry = new GlobalSlotRegistry();
    localRegistry = new LocalSlotRegistry();
    validator = new SlotValidator(globalRegistry, localRegistry);
    resolver = new SlotResolver(globalRegistry, localRegistry);
  });

  describe('SPEC Scenario 1.1: Global Slots Return Correct Roles and Constraints', () => {
    it('should return header slot with layout role and constraints', () => {
      const slot = resolver.resolveSlot('header');

      expect(slot.name).toBe('header');
      expect(slot.scope).toBe('global');
      expect(slot.role).toBe('layout');
      expect(slot.constraints?.maxChildren).toBe(3);
      expect(slot.constraints?.excludedComponents).toContain('DataTable');
    });

    it('should return sidebar slot with layout role and constraints', () => {
      const slot = resolver.resolveSlot('sidebar');

      expect(slot.name).toBe('sidebar');
      expect(slot.scope).toBe('global');
      expect(slot.role).toBe('layout');
      expect(slot.constraints?.maxChildren).toBe(10);
    });

    it('should return main slot with content role and unlimited children', () => {
      const slot = resolver.resolveSlot('main');

      expect(slot.name).toBe('main');
      expect(slot.scope).toBe('global');
      expect(slot.role).toBe('content');
      expect(slot.constraints?.maxChildren).toBeUndefined();
    });

    it('should return footer slot with layout role and constraints', () => {
      const slot = resolver.resolveSlot('footer');

      expect(slot.name).toBe('footer');
      expect(slot.scope).toBe('global');
      expect(slot.role).toBe('layout');
      expect(slot.constraints?.maxChildren).toBe(5);
    });
  });

  describe('SPEC Scenario 1.2: Local Slots Associated with Parent Components', () => {
    it('should return card_actions associated with Card', () => {
      const slot = resolver.resolveSlot('card_actions');

      expect(slot.name).toBe('card_actions');
      expect(slot.scope).toBe('local');
      expect(slot.role).toBe('action');
      expect(slot.parentComponent).toBe('Card');
    });

    it('should return table_toolbar associated with DataTable', () => {
      const slot = resolver.resolveSlot('table_toolbar');

      expect(slot.name).toBe('table_toolbar');
      expect(slot.scope).toBe('local');
      expect(slot.role).toBe('action');
      expect(slot.parentComponent).toBe('DataTable');
    });

    it('should retrieve slots by parent component', () => {
      const cardSlots = resolver.resolveSlotsByParent('Card');

      expect(cardSlots).toHaveLength(1);
      expect(cardSlots[0].name).toBe('card_actions');
    });
  });

  describe('SPEC Scenario 1.3: Constraint Violations Rejected with LAYER3-E003', () => {
    it('should reject maxChildren violation with LAYER3-E003', () => {
      const result = validator.validateMaxChildren('header', 5);

      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe('LAYER3-E003');
    });

    it('should reject excluded component violation with LAYER3-E003', () => {
      const result = validator.validateExcludedComponents('header', ['DataTable']);

      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe('LAYER3-E003');
    });

    it('should reject disallowed component violation with LAYER3-E003', () => {
      const result = validator.validateAllowedComponents('card_actions', ['DataTable']);

      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe('LAYER3-E003');
    });
  });

  describe('SPEC Scenario 3.3: ExcludedSlots Enforcement', () => {
    it('should enforce DataTable exclusion from header', () => {
      const result = validator.validateSlot('header', {
        childrenCount: 2,
        componentTypes: ['Button', 'DataTable'],
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('DataTable'))).toBe(true);
    });

    it('should enforce DataTable exclusion from sidebar', () => {
      const result = validator.validateSlot('sidebar', {
        componentTypes: ['NavigationMenu', 'DataTable'],
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('excluded'))).toBe(true);
    });

    it('should enforce DataTable exclusion from footer', () => {
      const result = validator.validateSlot('footer', {
        componentTypes: ['Copyright', 'DataTable'],
      });

      expect(result.isValid).toBe(false);
    });

    it('should allow DataTable in main slot', () => {
      const result = validator.validateSlot('main', {
        componentTypes: ['DataTable', 'Chart'],
      });

      expect(result.isValid).toBe(true);
    });
  });

  describe('End-to-End Workflow: Slot Resolution and Validation', () => {
    it('should resolve and validate a valid slot configuration', () => {
      // Resolve slot
      const slot = resolver.resolveSlot('card_actions');

      // Validate against constraints
      const result = validator.validateSlot('card_actions', {
        childrenCount: 3,
        componentTypes: ['Button', 'Icon', 'Link'],
      });

      expect(slot).toBeDefined();
      expect(result.isValid).toBe(true);
    });

    it('should detect and report invalid slot configuration', () => {
      // Resolve slot
      const slot = resolver.resolveSlot('header');

      // Validate with violations
      const result = validator.validateSlot('header', {
        childrenCount: 10,
        componentTypes: ['Button', 'DataTable'],
      });

      expect(slot).toBeDefined();
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Cross-Registry Operations', () => {
    it('should resolve slots across both registries', () => {
      const allSlots = resolver.getAllSlots();

      expect(allSlots).toHaveLength(7); // 4 global + 3 local
    });

    it('should filter slots by scope', () => {
      const globalSlots = resolver.resolveSlotsByScope('global');
      const localSlots = resolver.resolveSlotsByScope('local');

      expect(globalSlots).toHaveLength(4);
      expect(localSlots).toHaveLength(3);
    });

    it('should filter slots by role', () => {
      const layoutSlots = resolver.resolveSlotsByRole('layout');
      const actionSlots = resolver.resolveSlotsByRole('action');
      const contentSlots = resolver.resolveSlotsByRole('content');

      expect(layoutSlots.length).toBeGreaterThan(0);
      expect(actionSlots.length).toBeGreaterThan(0);
      expect(contentSlots.length).toBeGreaterThan(0);
    });

    it('should validate constraints from both registries', () => {
      // Global slot validation
      const globalResult = validator.validateSlot('header', {
        childrenCount: 2,
        componentTypes: ['Button'],
      });

      // Local slot validation
      const localResult = validator.validateSlot('card_actions', {
        childrenCount: 3,
        componentTypes: ['Button', 'Icon'],
      });

      expect(globalResult.isValid).toBe(true);
      expect(localResult.isValid).toBe(true);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle unknown slot resolution gracefully', () => {
      expect(() => resolver.resolveSlot('unknown_slot' as any)).toThrow();
    });

    it('should handle empty component lists', () => {
      const result = validator.validateSlot('header', {
        childrenCount: 0,
        componentTypes: [],
      });

      expect(result.isValid).toBe(true);
    });

    it('should handle slots with no constraints', () => {
      const result = validator.validateSlot('main', {
        childrenCount: 1000,
        componentTypes: ['AnyComponent'],
      });

      expect(result.isValid).toBe(true);
    });
  });
});
