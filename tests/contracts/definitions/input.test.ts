import { describe, it, expect } from 'vitest';
import { InputContract } from '../../../src/contracts/definitions/input';
import { type ComponentContract } from '../../../src/contracts/types';

describe('Input Contract', () => {
  describe('Contract Structure', () => {
    it('should have valid contract metadata', () => {
      expect(InputContract.id).toBe('input');
      expect(InputContract.version).toBe('1.0.0');
      expect(InputContract.description).toContain('form input');
    });

    it('should have 12 constraints', () => {
      expect(InputContract.constraints).toHaveLength(12);
    });
  });

  describe('Accessibility Constraints', () => {
    it('should require label association (INP-A01)', () => {
      const constraint = InputContract.constraints.find(c => c.id === 'INP-A01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('accessibility');
      expect(constraint?.severity).toBe('error');
    });

    it('should require aria-invalid on validation errors (INP-A02)', () => {
      const constraint = InputContract.constraints.find(c => c.id === 'INP-A02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('accessibility');
      expect(constraint?.rule.requirement).toContain('aria-invalid');
    });

    it('should require aria-describedby for error messages (INP-A03)', () => {
      const constraint = InputContract.constraints.find(c => c.id === 'INP-A03');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('accessibility');
    });
  });

  describe('Prop Combination Constraints', () => {
    it('should validate required + aria-required combination (INP-P01)', () => {
      const constraint = InputContract.constraints.find(c => c.id === 'INP-P01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('prop-combination');
      expect(constraint?.rule.requiredProps).toContain('required');
      expect(constraint?.rule.requiredProps).toContain('aria-required');
    });

    it('should validate disabled + aria-disabled combination (INP-P02)', () => {
      const constraint = InputContract.constraints.find(c => c.id === 'INP-P02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('prop-combination');
    });

    it('should prevent readOnly + disabled combination (INP-P03)', () => {
      const constraint = InputContract.constraints.find(c => c.id === 'INP-P03');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('prop-combination');
      expect(constraint?.rule.forbiddenCombinations).toBeDefined();
    });
  });

  describe('State Constraints', () => {
    it('should validate error state requires errorMessage (INP-S01)', () => {
      const constraint = InputContract.constraints.find(c => c.id === 'INP-S01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('state');
      expect(constraint?.rule.stateName).toBe('error');
    });

    it('should validate focus state management (INP-S02)', () => {
      const constraint = InputContract.constraints.find(c => c.id === 'INP-S02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('state');
    });
  });

  describe('Context Constraints', () => {
    it('should require Form context for validation (INP-C01)', () => {
      const constraint = InputContract.constraints.find(c => c.id === 'INP-C01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('context');
      expect(constraint?.rule.allowedContexts).toContain('Form');
    });
  });

  describe('Children Constraints', () => {
    it('should forbid children in input elements (INP-CH01)', () => {
      const constraint = InputContract.constraints.find(c => c.id === 'INP-CH01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('children');
      expect(constraint?.rule.forbidden).toBe(true);
    });
  });

  describe('Composition Constraints', () => {
    it('should validate InputLabel composition (INP-CO01)', () => {
      const constraint = InputContract.constraints.find(c => c.id === 'INP-CO01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('composition');
      expect(constraint?.rule.optionalComponents).toContain('InputLabel');
    });

    it('should validate InputError composition (INP-CO02)', () => {
      const constraint = InputContract.constraints.find(c => c.id === 'INP-CO02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('composition');
      expect(constraint?.rule.optionalComponents).toContain('InputError');
    });
  });

  describe('Type Safety', () => {
    it('should conform to ComponentContract type', () => {
      const contract: ComponentContract = InputContract;
      expect(contract.id).toBe('input');
      expect(contract.constraints).toBeInstanceOf(Array);
    });
  });
});
