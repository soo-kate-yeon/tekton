import { describe, it, expect } from 'vitest';
import {
  StateRule,
  stateRuleSchema,
} from '../../../src/contracts/rules/state';

describe('State Rule', () => {
  describe('StateRule schema', () => {
    it('should validate rule with valid states', () => {
      const rule: StateRule = {
        type: 'state',
        validStates: ['idle', 'loading', 'success', 'error'],
      };

      const result = stateRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.validStates).toEqual(['idle', 'loading', 'success', 'error']);
      }
    });

    it('should validate rule with initial state', () => {
      const rule: StateRule = {
        type: 'state',
        validStates: ['open', 'closed'],
        initialState: 'closed',
      };

      const result = stateRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.initialState).toBe('closed');
      }
    });

    it('should validate rule with transitions', () => {
      const rule: StateRule = {
        type: 'state',
        validStates: ['idle', 'loading', 'success'],
        transitions: [
          {
            from: 'idle',
            to: 'loading',
            trigger: 'submit',
          },
          {
            from: 'loading',
            to: 'success',
            trigger: 'resolve',
          },
        ],
      };

      const result = stateRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.transitions).toHaveLength(2);
      }
    });

    it('should validate rule with mutually exclusive states', () => {
      const rule: StateRule = {
        type: 'state',
        validStates: ['disabled', 'loading', 'active'],
        mutuallyExclusive: [['disabled', 'loading']],
      };

      const result = stateRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.mutuallyExclusive).toHaveLength(1);
        expect(result.data.mutuallyExclusive?.[0]).toEqual(['disabled', 'loading']);
      }
    });

    it('should validate comprehensive state rule', () => {
      const rule: StateRule = {
        type: 'state',
        validStates: ['idle', 'loading', 'success', 'error'],
        initialState: 'idle',
        transitions: [
          {
            from: 'idle',
            to: 'loading',
            trigger: 'submit',
          },
        ],
        mutuallyExclusive: [['loading', 'success'], ['loading', 'error']],
      };

      const result = stateRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should allow minimal state rule', () => {
      const rule: StateRule = {
        type: 'state',
        validStates: ['open', 'closed'],
      };

      const result = stateRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should reject rule without valid states', () => {
      const rule = {
        type: 'state',
      };

      const result = stateRuleSchema.safeParse(rule);
      expect(result.success).toBe(false);
    });

    it('should reject rule without type', () => {
      const rule = {
        validStates: ['open', 'closed'],
      };

      const result = stateRuleSchema.safeParse(rule);
      expect(result.success).toBe(false);
    });
  });
});
