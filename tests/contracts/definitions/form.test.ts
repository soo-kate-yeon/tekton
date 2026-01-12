import { describe, it, expect } from 'vitest';
import { FormContract } from '../../../src/contracts/definitions/form';
import { type ComponentContract } from '../../../src/contracts/types';

describe('Form Contract', () => {
  describe('Contract Structure', () => {
    it('should have valid contract metadata', () => {
      expect(FormContract.id).toBe('form');
      expect(FormContract.version).toBe('1.0.0');
      expect(FormContract.description).toContain('form');
    });

    it('should have 12 constraints', () => {
      expect(FormContract.constraints).toHaveLength(12);
    });
  });

  describe('Accessibility Constraints', () => {
    it('should require fieldset for grouped fields (FRM-A01)', () => {
      const constraint = FormContract.constraints.find(c => c.id === 'FRM-A01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('accessibility');
      expect(constraint?.rule.requirement).toContain('fieldset');
    });

    it('should require aria-required for required fields (FRM-A02)', () => {
      const constraint = FormContract.constraints.find(c => c.id === 'FRM-A02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('accessibility');
      expect(constraint?.rule.requirement).toContain('aria-required');
      expect(constraint?.severity).toBe('warning');
      expect(constraint?.autoFixable).toBe(true);
    });

    it('should require aria-live for validation messages (FRM-A03)', () => {
      const constraint = FormContract.constraints.find(c => c.id === 'FRM-A03');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('accessibility');
      expect(constraint?.rule.requirement).toContain('aria-live');
    });
  });

  describe('State Constraints', () => {
    it('should validate submitting state (FRM-S01)', () => {
      const constraint = FormContract.constraints.find(c => c.id === 'FRM-S01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('state');
      expect(constraint?.rule.stateName).toBe('submitting');
    });

    it('should validate error state (FRM-S02)', () => {
      const constraint = FormContract.constraints.find(c => c.id === 'FRM-S02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('state');
      expect(constraint?.rule.stateName).toBe('error');
    });

    it('should validate success state (FRM-S03)', () => {
      const constraint = FormContract.constraints.find(c => c.id === 'FRM-S03');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('state');
      expect(constraint?.rule.stateName).toBe('success');
    });
  });

  describe('Composition Constraints', () => {
    it('should allow FormField composition (FRM-CO01)', () => {
      const constraint = FormContract.constraints.find(c => c.id === 'FRM-CO01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('composition');
      expect(constraint?.rule.allowedComponents).toContain('FormField');
    });

    it('should allow FormButton composition (FRM-CO02)', () => {
      const constraint = FormContract.constraints.find(c => c.id === 'FRM-CO02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('composition');
      expect(constraint?.rule.allowedComponents).toContain('FormButton');
    });

    it('should allow FormError composition (FRM-CO03)', () => {
      const constraint = FormContract.constraints.find(c => c.id === 'FRM-CO03');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('composition');
    });
  });

  describe('Children Constraints', () => {
    it('should require at least one form field (FRM-CH01)', () => {
      const constraint = FormContract.constraints.find(c => c.id === 'FRM-CH01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('children');
      expect(constraint?.rule.minChildren).toBeGreaterThan(0);
    });
  });

  describe('Context Constraints', () => {
    it('should provide FormContext (FRM-C01)', () => {
      const constraint = FormContract.constraints.find(c => c.id === 'FRM-C01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('context');
      expect(constraint?.rule.providedContexts).toContain('FormContext');
    });
  });

  describe('Prop Combination Constraints', () => {
    it('should validate onSubmit handler requirement (FRM-P01)', () => {
      const constraint = FormContract.constraints.find(c => c.id === 'FRM-P01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('prop-combination');
      expect(constraint?.rule.requiredProps).toContain('onSubmit');
    });
  });

  describe('Type Safety', () => {
    it('should conform to ComponentContract type', () => {
      const contract: ComponentContract = FormContract;
      expect(contract.id).toBe('form');
      expect(contract.constraints).toBeInstanceOf(Array);
    });
  });
});
