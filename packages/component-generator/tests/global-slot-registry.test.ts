import { describe, it, expect, beforeEach } from 'vitest';
import { GlobalSlotRegistry } from '../src/registry/global-slot-registry';
import type { GlobalSlotType } from '../src/types/slot-types';

describe('GlobalSlotRegistry', () => {
  let registry: GlobalSlotRegistry;

  beforeEach(() => {
    registry = new GlobalSlotRegistry();
  });

  describe('getSlot', () => {
    it('should return header slot definition', () => {
      const slot = registry.getSlot('header');

      expect(slot).toBeDefined();
      expect(slot.name).toBe('header');
      expect(slot.scope).toBe('global');
      expect(slot.role).toBe('layout');
    });

    it('should return sidebar slot definition', () => {
      const slot = registry.getSlot('sidebar');

      expect(slot).toBeDefined();
      expect(slot.name).toBe('sidebar');
      expect(slot.scope).toBe('global');
      expect(slot.role).toBe('layout');
    });

    it('should return main slot definition', () => {
      const slot = registry.getSlot('main');

      expect(slot).toBeDefined();
      expect(slot.name).toBe('main');
      expect(slot.scope).toBe('global');
      expect(slot.role).toBe('content');
    });

    it('should return footer slot definition', () => {
      const slot = registry.getSlot('footer');

      expect(slot).toBeDefined();
      expect(slot.name).toBe('footer');
      expect(slot.scope).toBe('global');
      expect(slot.role).toBe('layout');
    });
  });

  describe('getAllSlots', () => {
    it('should return all global slot definitions', () => {
      const slots = registry.getAllSlots();

      expect(slots).toHaveLength(4);
      expect(slots.map(s => s.name)).toEqual(['header', 'sidebar', 'main', 'footer']);
    });

    it('should return slots with correct scope', () => {
      const slots = registry.getAllSlots();

      slots.forEach(slot => {
        expect(slot.scope).toBe('global');
      });
    });
  });

  describe('hasSlot', () => {
    it('should return true for existing slot', () => {
      expect(registry.hasSlot('header')).toBe(true);
      expect(registry.hasSlot('sidebar')).toBe(true);
      expect(registry.hasSlot('main')).toBe(true);
      expect(registry.hasSlot('footer')).toBe(true);
    });

    it('should return false for non-existent slot', () => {
      expect(registry.hasSlot('invalid' as GlobalSlotType)).toBe(false);
    });
  });

  describe('getSlotRole', () => {
    it('should return correct role for header', () => {
      expect(registry.getSlotRole('header')).toBe('layout');
    });

    it('should return correct role for main', () => {
      expect(registry.getSlotRole('main')).toBe('content');
    });
  });

  describe('getSlotConstraints', () => {
    it('should return constraints for header slot', () => {
      const constraints = registry.getSlotConstraints('header');

      expect(constraints).toBeDefined();
      expect(constraints?.maxChildren).toBeGreaterThan(0);
    });

    it('should return constraints for main slot', () => {
      const constraints = registry.getSlotConstraints('main');

      expect(constraints).toBeDefined();
    });
  });
});
