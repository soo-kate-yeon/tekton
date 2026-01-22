/**
 * SPEC-LAYER3-001 Section 5.2: Local Slot Semantic Registry Tests
 *
 * Tests that local slots conform to SPEC requirements:
 * - 3 initial local slots: card_actions, table_toolbar, modal_footer
 * - Each slot has: name, parentComponent, role, constraintTags
 * - Specific parent components and constraint tags per SPEC
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { LocalSlotRegistry } from '../src/registry/local-slot-registry';

describe('SPEC-LAYER3-001: Local Slot Semantic Registry', () => {
  let registry: LocalSlotRegistry;

  beforeEach(() => {
    registry = new LocalSlotRegistry();
  });

  describe('Required Local Slots', () => {
    it('should define exactly 3 local slots', () => {
      const slots = registry.getAllSlots();
      expect(slots).toHaveLength(3);
    });

    it('should define card_actions, table_toolbar, and modal_footer slots', () => {
      const slotNames = registry.getAllSlots().map(s => s.name);
      expect(slotNames).toContain('card_actions');
      expect(slotNames).toContain('table_toolbar');
      expect(slotNames).toContain('modal_footer');
    });
  });

  describe('card_actions Slot (SPEC 5.2)', () => {
    it('should have parentComponent "Card"', () => {
      const slot = registry.getSlot('card_actions');
      expect(slot.parentComponent).toBe('Card');
    });

    it('should have role "actions"', () => {
      const slot = registry.getSlot('card_actions');
      expect(slot.role).toBe('actions');
    });

    it('should have constraintTags ["action"]', () => {
      const slot = registry.getSlot('card_actions');
      expect(slot.constraintTags).toEqual(['action']);
    });
  });

  describe('table_toolbar Slot (SPEC 5.2)', () => {
    it('should have parentComponent "DataTable"', () => {
      const slot = registry.getSlot('table_toolbar');
      expect(slot.parentComponent).toBe('DataTable');
    });

    it('should have role "toolbar"', () => {
      const slot = registry.getSlot('table_toolbar');
      expect(slot.role).toBe('toolbar');
    });

    it('should have constraintTags ["action", "input"]', () => {
      const slot = registry.getSlot('table_toolbar');
      expect(slot.constraintTags).toEqual(['action', 'input']);
    });
  });

  describe('modal_footer Slot (SPEC 5.2)', () => {
    it('should have parentComponent "Modal"', () => {
      const slot = registry.getSlot('modal_footer');
      expect(slot.parentComponent).toBe('Modal');
    });

    it('should have role "actions"', () => {
      const slot = registry.getSlot('modal_footer');
      expect(slot.role).toBe('actions');
    });

    it('should have constraintTags ["action"]', () => {
      const slot = registry.getSlot('modal_footer');
      expect(slot.constraintTags).toEqual(['action']);
    });
  });

  describe('LocalSlot Interface Compliance', () => {
    it('all slots should have name field', () => {
      const slots = registry.getAllSlots();
      slots.forEach(slot => {
        expect(slot.name).toBeDefined();
        expect(typeof slot.name).toBe('string');
      });
    });

    it('all slots should have parentComponent field', () => {
      const slots = registry.getAllSlots();
      slots.forEach(slot => {
        expect(slot.parentComponent).toBeDefined();
        expect(typeof slot.parentComponent).toBe('string');
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
  });

  describe('Slot Lookup', () => {
    it('should return slot by name', () => {
      const slot = registry.getSlot('card_actions');
      expect(slot).toBeDefined();
      expect(slot.name).toBe('card_actions');
    });

    it('should throw error for non-existent slot', () => {
      expect(() => registry.getSlot('nonexistent' as any)).toThrow();
    });

    it('should check slot existence', () => {
      expect(registry.hasSlot('card_actions')).toBe(true);
      expect(registry.hasSlot('nonexistent' as any)).toBe(false);
    });
  });

  describe('Parent Component Filtering', () => {
    it('should get slots for Card component', () => {
      const slots = registry.getSlotsByParent('Card');
      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe('card_actions');
    });

    it('should get slots for DataTable component', () => {
      const slots = registry.getSlotsByParent('DataTable');
      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe('table_toolbar');
    });

    it('should get slots for Modal component', () => {
      const slots = registry.getSlotsByParent('Modal');
      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe('modal_footer');
    });

    it('should return empty array for component without slots', () => {
      const slots = registry.getSlotsByParent('Button');
      expect(slots).toHaveLength(0);
    });
  });

  describe('Role Filtering', () => {
    it('should filter slots by actions role', () => {
      const slots = registry.getSlotsByRole('actions');
      expect(slots).toHaveLength(2);
      expect(slots.map(s => s.name)).toContain('card_actions');
      expect(slots.map(s => s.name)).toContain('modal_footer');
    });

    it('should filter slots by toolbar role', () => {
      const slots = registry.getSlotsByRole('toolbar');
      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe('table_toolbar');
    });
  });

  describe('Constraint Tag Filtering', () => {
    it('should filter slots that accept action components', () => {
      const slots = registry.getSlotsByConstraintTag('action');
      expect(slots.length).toBe(3); // All local slots accept action
      expect(slots.every(s => s.constraintTags.includes('action'))).toBe(true);
    });

    it('should filter slots that accept input components', () => {
      const slots = registry.getSlotsByConstraintTag('input');
      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe('table_toolbar');
    });
  });
});
