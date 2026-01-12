import { describe, it, expect } from 'vitest';
import {
  AccessibilityRule,
  accessibilityRuleSchema,
  WCAGLevel,
  wcagLevelSchema,
} from '../../../src/contracts/rules/accessibility';

describe('Accessibility Rule', () => {
  describe('WCAGLevel enum', () => {
    it('should accept valid WCAG levels', () => {
      const validLevels: WCAGLevel[] = ['A', 'AA', 'AAA'];

      validLevels.forEach((level) => {
        const result = wcagLevelSchema.safeParse(level);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid WCAG levels', () => {
      const result = wcagLevelSchema.safeParse('B');
      expect(result.success).toBe(false);
    });
  });

  describe('AccessibilityRule schema', () => {
    it('should validate rule with required props', () => {
      const rule: AccessibilityRule = {
        type: 'accessibility',
        requiredProps: ['aria-label'],
        wcagLevel: 'AA',
        wcagCriteria: ['4.1.2'],
      };

      const result = accessibilityRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.requiredProps).toEqual(['aria-label']);
        expect(result.data.wcagLevel).toBe('AA');
      }
    });

    it('should validate rule with forbidden props', () => {
      const rule: AccessibilityRule = {
        type: 'accessibility',
        forbiddenProps: ['title'],
        wcagLevel: 'A',
      };

      const result = accessibilityRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should validate rule with role requirements', () => {
      const rule: AccessibilityRule = {
        type: 'accessibility',
        requiredRole: 'button',
        wcagLevel: 'AA',
      };

      const result = accessibilityRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.requiredRole).toBe('button');
      }
    });

    it('should validate rule with aria states', () => {
      const rule: AccessibilityRule = {
        type: 'accessibility',
        requiredAriaStates: ['aria-expanded', 'aria-controls'],
        wcagLevel: 'AA',
      };

      const result = accessibilityRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.requiredAriaStates).toHaveLength(2);
      }
    });

    it('should validate rule with keyboard navigation', () => {
      const rule: AccessibilityRule = {
        type: 'accessibility',
        keyboardNavigation: true,
        wcagLevel: 'A',
      };

      const result = accessibilityRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should validate rule with focus management', () => {
      const rule: AccessibilityRule = {
        type: 'accessibility',
        focusManagement: {
          trapFocus: true,
          restoreFocus: true,
          initialFocus: 'first-element',
        },
        wcagLevel: 'AA',
      };

      const result = accessibilityRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.focusManagement?.trapFocus).toBe(true);
        expect(result.data.focusManagement?.restoreFocus).toBe(true);
      }
    });

    it('should validate rule with color contrast requirements', () => {
      const rule: AccessibilityRule = {
        type: 'accessibility',
        colorContrast: {
          minimumRatio: 4.5,
          largeText: false,
        },
        wcagLevel: 'AA',
      };

      const result = accessibilityRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.colorContrast?.minimumRatio).toBe(4.5);
      }
    });

    it('should validate comprehensive accessibility rule', () => {
      const rule: AccessibilityRule = {
        type: 'accessibility',
        requiredProps: ['aria-label', 'role'],
        forbiddenProps: ['title'],
        requiredRole: 'button',
        requiredAriaStates: ['aria-pressed'],
        keyboardNavigation: true,
        focusManagement: {
          trapFocus: false,
          restoreFocus: false,
        },
        wcagLevel: 'AAA',
        wcagCriteria: ['2.1.1', '4.1.2'],
      };

      const result = accessibilityRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe('accessibility');
        expect(result.data.requiredProps).toHaveLength(2);
        expect(result.data.wcagCriteria).toHaveLength(2);
      }
    });

    it('should allow minimal accessibility rule', () => {
      const rule: AccessibilityRule = {
        type: 'accessibility',
        wcagLevel: 'A',
      };

      const result = accessibilityRuleSchema.safeParse(rule);
      expect(result.success).toBe(true);
    });

    it('should reject rule without type', () => {
      const rule = {
        wcagLevel: 'AA',
      };

      const result = accessibilityRuleSchema.safeParse(rule);
      expect(result.success).toBe(false);
    });

    it('should reject rule with wrong type', () => {
      const rule = {
        type: 'prop-combination',
        wcagLevel: 'AA',
      };

      const result = accessibilityRuleSchema.safeParse(rule);
      expect(result.success).toBe(false);
    });
  });
});
