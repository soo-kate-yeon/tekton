import { describe, it, expect } from 'vitest';
import {
  ComponentContract,
  Constraint,
  componentContractSchema,
  constraintSchema,
  type Severity,
} from '../../src/contracts/types';

describe('Contract Types', () => {
  describe('Severity Type', () => {
    it('should accept valid severity levels', () => {
      const validSeverities: Severity[] = ['error', 'warning', 'info'];

      validSeverities.forEach((severity) => {
        expect(['error', 'warning', 'info']).toContain(severity);
      });
    });
  });

  describe('Constraint Schema', () => {
    it('should validate a complete constraint', () => {
      const validConstraint = {
        id: 'BTN-A01',
        severity: 'error' as const,
        description: 'Icon-only buttons must have aria-label',
        rule: {
          type: 'accessibility',
          requiredProps: ['aria-label'],
        },
        message: 'Icon-only buttons require aria-label for screen readers',
        autoFixable: true,
        fixSuggestion: 'Add aria-label="descriptive text" to the button',
      };

      const result = constraintSchema.safeParse(validConstraint);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validConstraint);
      }
    });

    it('should reject constraint with invalid severity', () => {
      const invalidConstraint = {
        id: 'BTN-A01',
        severity: 'critical', // invalid
        description: 'Test',
        rule: { type: 'accessibility' },
        message: 'Test message',
        autoFixable: false,
      };

      const result = constraintSchema.safeParse(invalidConstraint);
      expect(result.success).toBe(false);
    });

    it('should reject constraint without required id', () => {
      const invalidConstraint = {
        severity: 'error',
        description: 'Test',
        rule: { type: 'accessibility' },
        message: 'Test message',
        autoFixable: false,
      };

      const result = constraintSchema.safeParse(invalidConstraint);
      expect(result.success).toBe(false);
    });

    it('should allow constraint without fixSuggestion', () => {
      const validConstraint = {
        id: 'BTN-A01',
        severity: 'warning' as const,
        description: 'Test',
        rule: { type: 'accessibility' },
        message: 'Test message',
        autoFixable: false,
      };

      const result = constraintSchema.safeParse(validConstraint);
      expect(result.success).toBe(true);
    });
  });

  describe('ComponentContract Schema', () => {
    it('should validate a complete component contract', () => {
      const validContract: ComponentContract = {
        id: 'button',
        version: '1.0.0',
        description: 'Button component contract',
        constraints: [
          {
            id: 'BTN-A01',
            severity: 'error',
            rule: {
              type: 'accessibility',
              requiredProps: ['aria-label'],
            },
            rationale: 'Icon-only buttons need accessible labels',
          },
        ],
        bestPractices: [
          'Use semantic HTML button element',
          'Provide clear button text or aria-label',
        ],
      };

      const result = componentContractSchema.safeParse(validContract);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe('button');
        expect(result.data.constraints).toHaveLength(1);
        expect(result.data.bestPractices).toHaveLength(2);
      }
    });

    it('should reject contract without id', () => {
      const invalidContract = {
        version: '1.0.0',
        constraints: [],
      };

      const result = componentContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });

    it('should allow contract without category', () => {
      const validContract = {
        id: 'button',
        version: '1.0.0',
        constraints: [],
      };

      const result = componentContractSchema.safeParse(validContract);
      expect(result.success).toBe(true);
    });

    it('should allow contract without bestPractices', () => {
      const validContract = {
        id: 'button',
        version: '1.0.0',
        constraints: [],
      };

      const result = componentContractSchema.safeParse(validContract);
      expect(result.success).toBe(true);
    });

    it('should validate constraints array', () => {
      const validContract = {
        id: 'button',
        version: '1.0.0',
        constraints: [
          {
            id: 'BTN-A01',
            severity: 'error' as const,
            rule: { type: 'accessibility' },
          },
          {
            id: 'BTN-A02',
            severity: 'warning' as const,
            rule: { type: 'accessibility' },
            rationale: 'Test rationale',
          },
        ],
      };

      const result = componentContractSchema.safeParse(validContract);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.constraints).toHaveLength(2);
      }
    });
  });

  describe('Type Inference', () => {
    it('should correctly infer ComponentContract type', () => {
      const contract: ComponentContract = {
        component: 'Button',
        version: '1.0.0',
        category: 'form',
        constraints: [],
      };

      // TypeScript type checking - this should compile
      expect(contract.component).toBe('Button');
      expect(contract.version).toBe('1.0.0');
      expect(contract.category).toBe('form');
      expect(contract.constraints).toEqual([]);
    });

    it('should correctly infer Constraint type', () => {
      const constraint: Constraint = {
        id: 'TEST-01',
        severity: 'info',
        description: 'Test constraint',
        rule: { type: 'test' },
        message: 'Test message',
        autoFixable: false,
      };

      // TypeScript type checking - this should compile
      expect(constraint.id).toBe('TEST-01');
      expect(constraint.severity).toBe('info');
      expect(constraint.autoFixable).toBe(false);
    });
  });
});
