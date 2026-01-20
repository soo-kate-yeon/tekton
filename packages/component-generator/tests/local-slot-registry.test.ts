import { describe, it, expect, beforeEach } from 'vitest';
import { LocalSlotRegistry } from '../src/registry/local-slot-registry';
import type { LocalSlotType } from '../src/types/slot-types';

describe('LocalSlotRegistry', () => {
  let registry: LocalSlotRegistry;

  beforeEach(() => {
    registry = new LocalSlotRegistry();
  });

  describe('getSlot', () => {
    it('should return card_actions slot definition', () => {
      const slot = registry.getSlot('card_actions');

      expect(slot).toBeDefined();
      expect(slot.name).toBe('card_actions');
      expect(slot.scope).toBe('local');
      expect(slot.role).toBe('action');
      expect(slot.parentComponent).toBe('Card');
    });

    it('should return table_toolbar slot definition', () => {
      const slot = registry.getSlot('table_toolbar');

      expect(slot).toBeDefined();
      expect(slot.name).toBe('table_toolbar');
      expect(slot.scope).toBe('local');
      expect(slot.role).toBe('action');
      expect(slot.parentComponent).toBe('DataTable');
    });

    it('should return modal_footer slot definition', () => {
      const slot = registry.getSlot('modal_footer');

      expect(slot).toBeDefined();
      expect(slot.name).toBe('modal_footer');
      expect(slot.scope).toBe('local');
      expect(slot.role).toBe('action');
      expect(slot.parentComponent).toBe('Modal');
    });
  });

  describe('getAllSlots', () => {
    it('should return all local slot definitions', () => {
      const slots = registry.getAllSlots();

      expect(slots).toHaveLength(3);
      expect(slots.map(s => s.name)).toEqual(['card_actions', 'table_toolbar', 'modal_footer']);
    });

    it('should return slots with correct scope', () => {
      const slots = registry.getAllSlots();

      slots.forEach(slot => {
        expect(slot.scope).toBe('local');
      });
    });

    it('should return slots with parent components', () => {
      const slots = registry.getAllSlots();

      slots.forEach(slot => {
        expect(slot.parentComponent).toBeDefined();
      });
    });
  });

  describe('hasSlot', () => {
    it('should return true for existing slot', () => {
      expect(registry.hasSlot('card_actions')).toBe(true);
      expect(registry.hasSlot('table_toolbar')).toBe(true);
      expect(registry.hasSlot('modal_footer')).toBe(true);
    });

    it('should return false for non-existent slot', () => {
      expect(registry.hasSlot('invalid' as LocalSlotType)).toBe(false);
    });
  });

  describe('getSlotsByParent', () => {
    it('should return slots for Card component', () => {
      const slots = registry.getSlotsByParent('Card');

      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe('card_actions');
    });

    it('should return slots for DataTable component', () => {
      const slots = registry.getSlotsByParent('DataTable');

      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe('table_toolbar');
    });

    it('should return slots for Modal component', () => {
      const slots = registry.getSlotsByParent('Modal');

      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe('modal_footer');
    });

    it('should return empty array for component with no slots', () => {
      const slots = registry.getSlotsByParent('Button');

      expect(slots).toHaveLength(0);
    });
  });

  describe('getSlotRole', () => {
    it('should return correct role for local slots', () => {
      expect(registry.getSlotRole('card_actions')).toBe('action');
      expect(registry.getSlotRole('table_toolbar')).toBe('action');
      expect(registry.getSlotRole('modal_footer')).toBe('action');
    });
  });

  describe('getSlotConstraints', () => {
    it('should return constraints for card_actions slot', () => {
      const constraints = registry.getSlotConstraints('card_actions');

      expect(constraints).toBeDefined();
      expect(constraints?.maxChildren).toBeGreaterThan(0);
    });
  });
});
