import { describe, it, expect } from 'vitest';
import {
  PropCombinationRule,
  propCombinationRuleSchema,
} from '../../../src/contracts/rules/prop-combination';

describe('PropCombination Rule', () => {
  describe('PropCombinationRule schema', () => {
    it('should validate rule with forbidden combinations', () => {
      const rule: PropCombinationRule = {
        type: 'prop-combination',
        forbidden: [
          {
            props: ['disabled', 'loading'],
            reason: 'Cannot have both disabled and loading states',
          },
        ],
      };

      const result = propCombinationRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.forbidden).toHaveLength(1);
        expect(result.data.forbidden?.[0].props).toEqual(['disabled', 'loading']);
      }
    });

    it('should validate rule with required combinations', () => {
      const rule: PropCombinationRule = {
        type: 'prop-combination',
        required: [
          {
            props: ['id', 'aria-labelledby'],
            reason: 'Input must have both id and aria-labelledby for label association',
          },
        ],
      };

      const result = propCombinationRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.required).toHaveLength(1);
        expect(result.data.required?.[0].props).toHaveLength(2);
      }
    });

    it('should validate rule with mutually exclusive props', () => {
      const rule: PropCombinationRule = {
        type: 'prop-combination',
        mutuallyExclusive: [
          {
            props: ['href', 'onClick'],
            reason: 'Use Link for href, Button for onClick',
          },
        ],
      };

      const result = propCombinationRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.mutuallyExclusive).toHaveLength(1);
      }
    });

    it('should validate rule with conditional requirements', () => {
      const rule: PropCombinationRule = {
        type: 'prop-combination',
        conditional: [
          {
            if: 'asChild',
            then: ['children'],
            reason: 'asChild requires exactly one child element',
          },
        ],
      };

      const result = propCombinationRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.conditional).toHaveLength(1);
        expect(result.data.conditional?.[0].if).toBe('asChild');
        expect(result.data.conditional?.[0].then).toEqual(['children']);
      }
    });

    it('should validate comprehensive prop combination rule', () => {
      const rule: PropCombinationRule = {
        type: 'prop-combination',
        forbidden: [
          {
            props: ['disabled', 'loading'],
            reason: 'Cannot be disabled and loading',
          },
        ],
        required: [
          {
            props: ['id', 'name'],
            reason: 'Form fields need id and name',
          },
        ],
        mutuallyExclusive: [
          {
            props: ['variant', 'customStyle'],
            reason: 'Use either variant or customStyle',
          },
        ],
        conditional: [
          {
            if: 'type',
            then: ['value'],
            reason: 'Type requires value',
          },
        ],
      };

      const result = propCombinationRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.forbidden).toHaveLength(1);
        expect(result.data.required).toHaveLength(1);
        expect(result.data.mutuallyExclusive).toHaveLength(1);
        expect(result.data.conditional).toHaveLength(1);
      }
    });

    it('should allow minimal prop combination rule', () => {
      const rule: PropCombinationRule = {
        type: 'prop-combination',
      };

      const result = propCombinationRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should validate multiple forbidden combinations', () => {
      const rule: PropCombinationRule = {
        type: 'prop-combination',
        forbidden: [
          {
            props: ['disabled', 'loading'],
            reason: 'Reason 1',
          },
          {
            props: ['href', 'disabled'],
            reason: 'Reason 2',
          },
        ],
      };

      const result = propCombinationRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.forbidden).toHaveLength(2);
      }
    });

    it('should validate conditional with else clause', () => {
      const rule: PropCombinationRule = {
        type: 'prop-combination',
        conditional: [
          {
            if: 'variant',
            then: ['color'],
            else: ['customColor'],
            reason: 'Variant requires color, otherwise use customColor',
          },
        ],
      };

      const result = propCombinationRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.conditional?.[0].else).toEqual(['customColor']);
      }
    });

    it('should reject rule without type', () => {
      const rule = {
        forbidden: [],
      };

      const result = propCombinationRuleSchema.safeParse(rule);
      expect(result.success).toBe(false);
    });

    it('should reject rule with wrong type', () => {
      const rule = {
        type: 'accessibility',
        forbidden: [],
      };

      const result = propCombinationRuleSchema.safeParse(rule);
      expect(result.success).toBe(false);
    });
  });
});
