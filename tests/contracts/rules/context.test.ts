import { describe, it, expect } from 'vitest';
import {
  ContextRule,
  contextRuleSchema,
} from '../../../src/contracts/rules/context';

describe('Context Rule', () => {
  describe('ContextRule schema', () => {
    it('should validate rule with allowed contexts', () => {
      const rule: ContextRule = {
        type: 'context',
        allowed: ['Form', 'Dialog', 'Card'],
      };

      const result = contextRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.allowed).toEqual(['Form', 'Dialog', 'Card']);
      }
    });

    it('should validate rule with forbidden contexts', () => {
      const rule: ContextRule = {
        type: 'context',
        forbidden: ['Table', 'List'],
      };

      const result = contextRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should validate rule with required contexts', () => {
      const rule: ContextRule = {
        type: 'context',
        required: ['SelectRoot'],
      };

      const result = contextRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should validate comprehensive context rule', () => {
      const rule: ContextRule = {
        type: 'context',
        allowed: ['Dialog', 'Popover'],
        forbidden: ['Form'],
        required: ['DialogRoot'],
      };

      const result = contextRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should allow minimal context rule', () => {
      const rule: ContextRule = {
        type: 'context',
      };

      const result = contextRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should reject rule without type', () => {
      const rule = {
        allowed: ['Form'],
      };

      const result = contextRuleSchema.safeParse(rule);
      expect(result.success).toBe(false);
    });
  });
});
