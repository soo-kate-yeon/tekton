import { describe, it, expect } from 'vitest';
import {
  ChildrenRule,
  childrenRuleSchema,
} from '../../../src/contracts/rules/children';

describe('Children Rule', () => {
  describe('ChildrenRule schema', () => {
    it('should validate rule with required children', () => {
      const rule: ChildrenRule = {
        type: 'children',
        required: ['DialogTitle', 'DialogContent'],
      };

      const result = childrenRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.required).toEqual(['DialogTitle', 'DialogContent']);
      }
    });

    it('should validate rule with forbidden children', () => {
      const rule: ChildrenRule = {
        type: 'children',
        forbidden: ['div', 'span'],
      };

      const result = childrenRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should validate rule with allowed children', () => {
      const rule: ChildrenRule = {
        type: 'children',
        allowed: ['CardHeader', 'CardContent', 'CardFooter'],
      };

      const result = childrenRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should validate rule with minimum children count', () => {
      const rule: ChildrenRule = {
        type: 'children',
        minCount: 1,
      };

      const result = childrenRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.minCount).toBe(1);
      }
    });

    it('should validate rule with maximum children count', () => {
      const rule: ChildrenRule = {
        type: 'children',
        maxCount: 3,
      };

      const result = childrenRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should validate rule with exact count', () => {
      const rule: ChildrenRule = {
        type: 'children',
        exactCount: 1,
      };

      const result = childrenRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should validate rule with ordering requirements', () => {
      const rule: ChildrenRule = {
        type: 'children',
        order: ['CardHeader', 'CardContent', 'CardFooter'],
        strict: true,
      };

      const result = childrenRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.order).toHaveLength(3);
        expect(result.data.strict).toBe(true);
      }
    });

    it('should validate comprehensive children rule', () => {
      const rule: ChildrenRule = {
        type: 'children',
        required: ['DialogTitle'],
        allowed: ['DialogTitle', 'DialogDescription', 'DialogContent'],
        forbidden: ['Form', 'Button'],
        minCount: 1,
        maxCount: 5,
        order: ['DialogTitle', 'DialogDescription', 'DialogContent'],
        strict: false,
      };

      const result = childrenRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should allow minimal children rule', () => {
      const rule: ChildrenRule = {
        type: 'children',
      };

      const result = childrenRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should reject rule without type', () => {
      const rule = {
        required: ['DialogTitle'],
      };

      const result = childrenRuleSchema.safeParse(rule);
      expect(result.success).toBe(false);
    });
  });
});
