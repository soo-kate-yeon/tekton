import { describe, it, expect, beforeEach } from 'vitest';
import { SlotResolver } from '../src/resolvers/slot-resolver';
import { GlobalSlotRegistry } from '../src/registry/global-slot-registry';
import { LocalSlotRegistry } from '../src/registry/local-slot-registry';

describe('SlotResolver', () => {
  let resolver: SlotResolver;

  beforeEach(() => {
    const globalRegistry = new GlobalSlotRegistry();
    const localRegistry = new LocalSlotRegistry();
    resolver = new SlotResolver(globalRegistry, localRegistry);
  });

  describe('resolveSlot', () => {
    it('should resolve global slot by name', () => {
      const slot = resolver.resolveSlot('header');

      expect(slot).toBeDefined();
      expect(slot.name).toBe('header');
      expect(slot.scope).toBe('global');
    });

    it('should resolve local slot by name', () => {
      const slot = resolver.resolveSlot('card_actions');

      expect(slot).toBeDefined();
      expect(slot.name).toBe('card_actions');
      expect(slot.scope).toBe('local');
    });

    it('should throw error for unknown slot', () => {
      expect(() => resolver.resolveSlot('unknown_slot' as any)).toThrow();
    });
  });

  describe('resolveSlotsByScope', () => {
    it('should resolve all global slots', () => {
      const slots = resolver.resolveSlotsByScope('global');

      expect(slots).toHaveLength(4);
      expect(slots.every(s => s.scope === 'global')).toBe(true);
    });

    it('should resolve all local slots', () => {
      const slots = resolver.resolveSlotsByScope('local');

      expect(slots).toHaveLength(3);
      expect(slots.every(s => s.scope === 'local')).toBe(true);
    });
  });

  describe('resolveSlotsByRole', () => {
    it('should resolve slots by layout role', () => {
      const slots = resolver.resolveSlotsByRole('layout');

      expect(slots.length).toBeGreaterThan(0);
      expect(slots.every(s => s.role === 'layout')).toBe(true);
    });

    it('should resolve slots by action role', () => {
      const slots = resolver.resolveSlotsByRole('action');

      expect(slots.length).toBeGreaterThan(0);
      expect(slots.every(s => s.role === 'action')).toBe(true);
    });

    it('should resolve slots by content role', () => {
      const slots = resolver.resolveSlotsByRole('content');

      expect(slots.length).toBeGreaterThan(0);
      expect(slots.every(s => s.role === 'content')).toBe(true);
    });
  });

  describe('resolveSlotsByParent', () => {
    it('should resolve slots for Card component', () => {
      const slots = resolver.resolveSlotsByParent('Card');

      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe('card_actions');
    });

    it('should resolve slots for DataTable component', () => {
      const slots = resolver.resolveSlotsByParent('DataTable');

      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe('table_toolbar');
    });

    it('should return empty array for component without slots', () => {
      const slots = resolver.resolveSlotsByParent('Button');

      expect(slots).toHaveLength(0);
    });
  });

  describe('getAllSlots', () => {
    it('should return all slots (global + local)', () => {
      const slots = resolver.getAllSlots();

      expect(slots).toHaveLength(7); // 4 global + 3 local
    });

    it('should include both global and local slots', () => {
      const slots = resolver.getAllSlots();

      const hasGlobal = slots.some(s => s.scope === 'global');
      const hasLocal = slots.some(s => s.scope === 'local');

      expect(hasGlobal).toBe(true);
      expect(hasLocal).toBe(true);
    });
  });

  describe('isSlotValid', () => {
    it('should return true for valid slot name', () => {
      expect(resolver.isSlotValid('header')).toBe(true);
      expect(resolver.isSlotValid('card_actions')).toBe(true);
    });

    it('should return false for invalid slot name', () => {
      expect(resolver.isSlotValid('invalid_slot' as any)).toBe(false);
    });
  });

  describe('getSlotType', () => {
    it('should return global for global slots', () => {
      expect(resolver.getSlotType('header')).toBe('global');
      expect(resolver.getSlotType('sidebar')).toBe('global');
    });

    it('should return local for local slots', () => {
      expect(resolver.getSlotType('card_actions')).toBe('local');
      expect(resolver.getSlotType('table_toolbar')).toBe('local');
    });

    it('should return undefined for unknown slot', () => {
      expect(resolver.getSlotType('unknown' as any)).toBeUndefined();
    });
  });
});
