import { describe, it, expect } from 'vitest';
import { StateCompletenessChecker } from '../../src/validator/state-completeness';
import type { ComponentKnowledge } from '../../src/types/knowledge.types';

describe('StateCompletenessChecker', () => {
  const checker = new StateCompletenessChecker();

  describe('Required States Validation', () => {
    it('should validate component with all 5 required states', () => {
      const knowledge: ComponentKnowledge = {
        name: 'Button',
        type: 'atom',
        category: 'action',
        slotAffinity: {},
        semanticDescription: {
          purpose: 'Test button component with all states',
          visualImpact: 'neutral',
          complexity: 'low',
        },
        constraints: {},
        tokenBindings: {
          states: {
            default: { backgroundColor: 'color-primary' },
            hover: { backgroundColor: 'color-primary-hover' },
            focus: { borderColor: 'color-focus' },
            active: { backgroundColor: 'color-primary-active' },
            disabled: { opacity: 'opacity-disabled' },
          },
        },
      };

      const result = checker.validate(knowledge);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject component missing hover state', () => {
      const knowledge: ComponentKnowledge = {
        name: 'Button',
        type: 'atom',
        category: 'action',
        slotAffinity: {},
        semanticDescription: {
          purpose: 'Test button component missing hover',
          visualImpact: 'neutral',
          complexity: 'low',
        },
        constraints: {},
        tokenBindings: {
          states: {
            default: { backgroundColor: 'color-primary' },
            // hover: missing
            focus: { borderColor: 'color-focus' },
            active: { backgroundColor: 'color-primary-active' },
            disabled: { opacity: 'opacity-disabled' },
          } as any,
        },
      };

      const result = checker.validate(knowledge);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('hover'))).toBe(true);
    });

    it('should reject component with only default state', () => {
      const knowledge: ComponentKnowledge = {
        name: 'Button',
        type: 'atom',
        category: 'action',
        slotAffinity: {},
        semanticDescription: {
          purpose: 'Test button with only default state',
          visualImpact: 'neutral',
          complexity: 'low',
        },
        constraints: {},
        tokenBindings: {
          states: {
            default: { backgroundColor: 'color-primary' },
          } as any,
        },
      };

      const result = checker.validate(knowledge);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('hover'))).toBe(true);
      expect(result.errors.some(e => e.includes('focus'))).toBe(true);
      expect(result.errors.some(e => e.includes('active'))).toBe(true);
      expect(result.errors.some(e => e.includes('disabled'))).toBe(true);
    });
  });

  describe('State Coverage Analysis', () => {
    it('should calculate complete coverage percentage', () => {
      const knowledge: ComponentKnowledge = {
        name: 'Button',
        type: 'atom',
        category: 'action',
        slotAffinity: {},
        semanticDescription: {
          purpose: 'Test button component for coverage',
          visualImpact: 'neutral',
          complexity: 'low',
        },
        constraints: {},
        tokenBindings: {
          states: {
            default: { backgroundColor: 'color-primary' },
            hover: { backgroundColor: 'color-primary-hover' },
            focus: { borderColor: 'color-focus' },
            active: { backgroundColor: 'color-primary-active' },
            disabled: { opacity: 'opacity-disabled' },
          },
        },
      };

      const coverage = checker.calculateCoverage(knowledge);
      expect(coverage).toBe(100);
    });

    it('should calculate partial coverage for missing states', () => {
      const knowledge: ComponentKnowledge = {
        name: 'Button',
        type: 'atom',
        category: 'action',
        slotAffinity: {},
        semanticDescription: {
          purpose: 'Test button with partial coverage',
          visualImpact: 'neutral',
          complexity: 'low',
        },
        constraints: {},
        tokenBindings: {
          states: {
            default: { backgroundColor: 'color-primary' },
            hover: { backgroundColor: 'color-primary-hover' },
            focus: {},
            active: {},
            disabled: {},
          },
        },
      };

      const coverage = checker.calculateCoverage(knowledge);
      expect(coverage).toBe(40); // 2 out of 5 states
    });
  });

  describe('Empty State Detection', () => {
    it('should warn about empty state definitions', () => {
      const knowledge: ComponentKnowledge = {
        name: 'Button',
        type: 'atom',
        category: 'action',
        slotAffinity: {},
        semanticDescription: {
          purpose: 'Test button with empty states',
          visualImpact: 'neutral',
          complexity: 'low',
        },
        constraints: {},
        tokenBindings: {
          states: {
            default: { backgroundColor: 'color-primary' },
            hover: {}, // empty
            focus: {}, // empty
            active: {},
            disabled: {},
          },
        },
      };

      const result = checker.validate(knowledge);
      expect(result.warnings.some(w => w.includes('empty'))).toBe(true);
    });

    it('should not warn if only non-default states are empty', () => {
      const knowledge: ComponentKnowledge = {
        name: 'Button',
        type: 'atom',
        category: 'action',
        slotAffinity: {},
        semanticDescription: {
          purpose: 'Test button with non-default empty',
          visualImpact: 'neutral',
          complexity: 'low',
        },
        constraints: {},
        tokenBindings: {
          states: {
            default: { backgroundColor: 'color-primary', padding: 'spacing-2' },
            hover: {},
            focus: {},
            active: {},
            disabled: {},
          },
        },
      };

      const result = checker.validate(knowledge);
      // Should pass validation even with empty non-default states
      expect(result.valid).toBe(true);
    });
  });

  describe('Variant State Coverage', () => {
    it('should validate variants have proper state coverage', () => {
      const knowledge: ComponentKnowledge = {
        name: 'Button',
        type: 'atom',
        category: 'action',
        slotAffinity: {},
        semanticDescription: {
          purpose: 'Test button with variants',
          visualImpact: 'neutral',
          complexity: 'low',
        },
        constraints: {},
        tokenBindings: {
          states: {
            default: { backgroundColor: 'color-primary' },
            hover: { backgroundColor: 'color-primary-hover' },
            focus: { borderColor: 'color-focus' },
            active: { backgroundColor: 'color-primary-active' },
            disabled: { opacity: 'opacity-disabled' },
          },
          variants: {
            secondary: {
              default: { backgroundColor: 'color-secondary' },
              hover: { backgroundColor: 'color-secondary-hover' },
            },
          },
        },
      };

      const result = checker.validate(knowledge);
      expect(result.valid).toBe(true);
    });
  });
});
