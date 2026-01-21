/**
 * SPEC-LAYER3-001 Section 5.2: Global Slot Semantic Registry Tests
 *
 * Tests that global slots conform to SPEC requirements:
 * - 4 required global slots: header, sidebar, main, footer
 * - Each slot has: name, role, constraintTags, required, maxChildren (optional)
 * - Specific roles and constraint tags per SPEC
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { GlobalSlotRegistry } from '../src/registry/global-slot-registry';

describe('SPEC-LAYER3-001: Global Slot Semantic Registry', () => {
  let registry: GlobalSlotRegistry;

  beforeEach(() => {
    registry = new GlobalSlotRegistry();
  });

  describe('Required Global Slots', () => {
    it('should define exactly 4 global slots', () => {
      const slots = registry.getAllSlots();
      expect(slots).toHaveLength(4);
    });

    it('should define header, sidebar, main, and footer slots', () => {
      const slotNames = registry.getAllSlots().map(s => s.name);
      expect(slotNames).toContain('header');
      expect(slotNames).toContain('sidebar');
      expect(slotNames).toContain('main');
      expect(slotNames).toContain('footer');
    });
  });

  describe('Header Slot (SPEC 5.2)', () => {
    it('should have role "navigation"', () => {
      const slot = registry.getSlot('header');
      expect(slot.role).toBe('navigation');
    });

    it('should have constraintTags ["navigation", "action", "display"]', () => {
      const slot = registry.getSlot('header');
      expect(slot.constraintTags).toEqual(['navigation', 'action', 'display']);
    });

    it('should have required=false', () => {
      const slot = registry.getSlot('header');
      expect(slot.required).toBe(false);
    });

    it('should have maxChildren defined', () => {
      const slot = registry.getSlot('header');
      expect(slot.maxChildren).toBeDefined();
      expect(typeof slot.maxChildren).toBe('number');
    });
  });

  describe('Sidebar Slot (SPEC 5.2)', () => {
    it('should have role "secondary-navigation"', () => {
      const slot = registry.getSlot('sidebar');
      expect(slot.role).toBe('secondary-navigation');
    });

    it('should have constraintTags ["navigation", "input", "action"]', () => {
      const slot = registry.getSlot('sidebar');
      expect(slot.constraintTags).toEqual(['navigation', 'input', 'action']);
    });

    it('should have required=false', () => {
      const slot = registry.getSlot('sidebar');
      expect(slot.required).toBe(false);
    });
  });

  describe('Main Slot (SPEC 5.2)', () => {
    it('should have role "primary-content"', () => {
      const slot = registry.getSlot('main');
      expect(slot.role).toBe('primary-content');
    });

    it('should have constraintTags ["display", "input", "container", "action"]', () => {
      const slot = registry.getSlot('main');
      expect(slot.constraintTags).toEqual(['display', 'input', 'container', 'action']);
    });

    it('should have required=true', () => {
      const slot = registry.getSlot('main');
      expect(slot.required).toBe(true);
    });

    it('should have no maxChildren limit (undefined)', () => {
      const slot = registry.getSlot('main');
      expect(slot.maxChildren).toBeUndefined();
    });
  });

  describe('Footer Slot (SPEC 5.2)', () => {
    it('should have role "auxiliary"', () => {
      const slot = registry.getSlot('footer');
      expect(slot.role).toBe('auxiliary');
    });

    it('should have constraintTags ["navigation", "action", "display"]', () => {
      const slot = registry.getSlot('footer');
      expect(slot.constraintTags).toEqual(['navigation', 'action', 'display']);
    });

    it('should have required=false', () => {
      const slot = registry.getSlot('footer');
      expect(slot.required).toBe(false);
    });
  });

  describe('GlobalSlot Interface Compliance', () => {
    it('all slots should have name field', () => {
      const slots = registry.getAllSlots();
      slots.forEach(slot => {
        expect(slot.name).toBeDefined();
        expect(typeof slot.name).toBe('string');
      });
    });

    it('all slots should have role field', () => {
      const slots = registry.getAllSlots();
      slots.forEach(slot => {
        expect(slot.role).toBeDefined();
        expect(typeof slot.role).toBe('string');
      });
    });

    it('all slots should have constraintTags field as array', () => {
      const slots = registry.getAllSlots();
      slots.forEach(slot => {
        expect(slot.constraintTags).toBeDefined();
        expect(Array.isArray(slot.constraintTags)).toBe(true);
      });
    });

    it('all slots should have required field as boolean', () => {
      const slots = registry.getAllSlots();
      slots.forEach(slot => {
        expect(slot.required).toBeDefined();
        expect(typeof slot.required).toBe('boolean');
      });
    });
  });

  describe('Slot Lookup', () => {
    it('should return slot by name', () => {
      const slot = registry.getSlot('header');
      expect(slot).toBeDefined();
      expect(slot.name).toBe('header');
    });

    it('should throw error for non-existent slot', () => {
      expect(() => registry.getSlot('nonexistent' as any)).toThrow();
    });

    it('should check slot existence', () => {
      expect(registry.hasSlot('header')).toBe(true);
      expect(registry.hasSlot('nonexistent' as any)).toBe(false);
    });
  });

  describe('Required Slot Identification', () => {
    it('should identify required slots', () => {
      const requiredSlots = registry.getRequiredSlots();
      expect(requiredSlots).toHaveLength(1);
      expect(requiredSlots[0].name).toBe('main');
    });

    it('should identify optional slots', () => {
      const optionalSlots = registry.getOptionalSlots();
      expect(optionalSlots).toHaveLength(3);
      expect(optionalSlots.map(s => s.name)).toContain('header');
      expect(optionalSlots.map(s => s.name)).toContain('sidebar');
      expect(optionalSlots.map(s => s.name)).toContain('footer');
    });
  });

  describe('Slot Filtering by Role', () => {
    it('should filter slots by navigation role', () => {
      const slots = registry.getSlotsByRole('navigation');
      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe('header');
    });

    it('should filter slots by secondary-navigation role', () => {
      const slots = registry.getSlotsByRole('secondary-navigation');
      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe('sidebar');
    });

    it('should filter slots by primary-content role', () => {
      const slots = registry.getSlotsByRole('primary-content');
      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe('main');
    });

    it('should filter slots by auxiliary role', () => {
      const slots = registry.getSlotsByRole('auxiliary');
      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe('footer');
    });
  });

  describe('Constraint Tag Filtering', () => {
    it('should filter slots that accept navigation components', () => {
      const slots = registry.getSlotsByConstraintTag('navigation');
      expect(slots.length).toBeGreaterThan(0);
      expect(slots.every(s => s.constraintTags.includes('navigation'))).toBe(true);
    });

    it('should filter slots that accept action components', () => {
      const slots = registry.getSlotsByConstraintTag('action');
      expect(slots.length).toBe(4); // All slots accept action
      expect(slots.every(s => s.constraintTags.includes('action'))).toBe(true);
    });

    it('should filter slots that accept container components', () => {
      const slots = registry.getSlotsByConstraintTag('container');
      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe('main');
    });

    it('should filter slots that accept input components', () => {
      const slots = registry.getSlotsByConstraintTag('input');
      expect(slots.length).toBe(2); // sidebar and main
    });
  });
});
