import { describe, it, expect } from 'vitest';
import {
  CompositionRule,
  compositionRuleSchema,
} from '../../../src/contracts/rules/composition';

describe('Composition Rule', () => {
  describe('CompositionRule schema', () => {
    it('should validate rule with required components', () => {
      const rule: CompositionRule = {
        type: 'composition',
        requiredComponents: ['Label', 'Input'],
      };

      const result = compositionRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.requiredComponents).toEqual(['Label', 'Input']);
      }
    });

    it('should validate rule with optional components', () => {
      const rule: CompositionRule = {
        type: 'composition',
        optionalComponents: ['HelperText', 'ErrorMessage'],
      };

      const result = compositionRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should validate rule with relationships', () => {
      const rule: CompositionRule = {
        type: 'composition',
        relationships: [
          {
            source: 'Label',
            target: 'Input',
            type: 'associates',
            via: 'htmlFor',
          },
        ],
      };

      const result = compositionRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.relationships).toHaveLength(1);
        expect(result.data.relationships?.[0].type).toBe('associates');
      }
    });

    it('should validate rule with multiple relationships', () => {
      const rule: CompositionRule = {
        type: 'composition',
        relationships: [
          {
            source: 'Button',
            target: 'Icon',
            type: 'contains',
          },
          {
            source: 'Form',
            target: 'Input',
            type: 'wraps',
          },
        ],
      };

      const result = compositionRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.relationships).toHaveLength(2);
      }
    });

    it('should validate comprehensive composition rule', () => {
      const rule: CompositionRule = {
        type: 'composition',
        requiredComponents: ['FormLabel', 'FormControl'],
        optionalComponents: ['FormDescription', 'FormMessage'],
        relationships: [
          {
            source: 'FormLabel',
            target: 'FormControl',
            type: 'associates',
            via: 'id',
          },
        ],
      };

      const result = compositionRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should allow minimal composition rule', () => {
      const rule: CompositionRule = {
        type: 'composition',
      };

      const result = compositionRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should reject rule without type', () => {
      const rule = {
        requiredComponents: ['Label'],
      };

      const result = compositionRuleSchema.safeParse(rule);
      expect(result.success).toBe(false);
    });
  });
});
