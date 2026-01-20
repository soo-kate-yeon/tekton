import { describe, it, expect } from 'vitest';
import { SlotType, SlotScope, SlotRole, SlotConstraints } from '../src/types/slot-types';

describe('Slot Type Definitions', () => {
  describe('SlotType', () => {
    it('should define global slot type', () => {
      const slot: SlotType = 'header';
      expect(slot).toBe('header');
    });

    it('should define local slot type', () => {
      const slot: SlotType = 'card_actions';
      expect(slot).toBe('card_actions');
    });
  });

  describe('SlotScope', () => {
    it('should define global scope', () => {
      const scope: SlotScope = 'global';
      expect(scope).toBe('global');
    });

    it('should define local scope', () => {
      const scope: SlotScope = 'local';
      expect(scope).toBe('local');
    });
  });

  describe('SlotRole', () => {
    it('should define layout role', () => {
      const role: SlotRole = 'layout';
      expect(role).toBe('layout');
    });

    it('should define action role', () => {
      const role: SlotRole = 'action';
      expect(role).toBe('action');
    });

    it('should define content role', () => {
      const role: SlotRole = 'content';
      expect(role).toBe('content');
    });
  });

  describe('SlotConstraints', () => {
    it('should define slot constraints with maxChildren', () => {
      const constraints: SlotConstraints = {
        maxChildren: 5,
        allowedComponents: ['Button', 'Link'],
        excludedComponents: ['DataTable'],
      };

      expect(constraints.maxChildren).toBe(5);
      expect(constraints.allowedComponents).toContain('Button');
      expect(constraints.excludedComponents).toContain('DataTable');
    });

    it('should define slot constraints with unlimited children', () => {
      const constraints: SlotConstraints = {
        maxChildren: undefined,
        allowedComponents: [],
        excludedComponents: [],
      };

      expect(constraints.maxChildren).toBeUndefined();
    });

    it('should support optional constraint fields', () => {
      const constraints: SlotConstraints = {
        maxChildren: 10,
      };

      expect(constraints.maxChildren).toBe(10);
      expect(constraints.allowedComponents).toBeUndefined();
    });
  });
});
