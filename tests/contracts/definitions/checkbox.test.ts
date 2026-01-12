import { describe, it, expect } from 'vitest';
import { CheckboxContract } from '../../../src/contracts/definitions/checkbox';
import { type ComponentContract } from '../../../src/contracts/types';

describe('Checkbox Contract', () => {
  describe('Contract Structure', () => {
    it('should have valid contract metadata', () => {
      expect(CheckboxContract.id).toBe('checkbox');
      expect(CheckboxContract.version).toBe('1.0.0');
      expect(CheckboxContract.description).toContain('checkbox');
    });

    it('should have 8 constraints', () => {
      expect(CheckboxContract.constraints).toHaveLength(8);
    });
  });

  describe('Accessibility Constraints', () => {
    it('should require label association (CHK-A01)', () => {
      const constraint = CheckboxContract.constraints.find(c => c.id === 'CHK-A01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('accessibility');
      expect(constraint?.severity).toBe('error');
    });

    it('should require aria-checked (CHK-A02)', () => {
      const constraint = CheckboxContract.constraints.find(c => c.id === 'CHK-A02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('accessibility');
      expect(constraint?.rule.requirement).toContain('aria-checked');
    });

    it('should support indeterminate state (CHK-A03)', () => {
      const constraint = CheckboxContract.constraints.find(c => c.id === 'CHK-A03');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('accessibility');
    });
  });

  describe('State Constraints', () => {
    it('should validate checked state (CHK-S01)', () => {
      const constraint = CheckboxContract.constraints.find(c => c.id === 'CHK-S01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('state');
      expect(constraint?.rule.stateName).toBe('checked');
    });

    it('should validate indeterminate state (CHK-S02)', () => {
      const constraint = CheckboxContract.constraints.find(c => c.id === 'CHK-S02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('state');
    });
  });

  describe('Prop Combination Constraints', () => {
    it('should validate required checkbox (CHK-P01)', () => {
      const constraint = CheckboxContract.constraints.find(c => c.id === 'CHK-P01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('prop-combination');
    });

    it('should validate disabled checkbox (CHK-P02)', () => {
      const constraint = CheckboxContract.constraints.find(c => c.id === 'CHK-P02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('prop-combination');
    });
  });

  describe('Children Constraints', () => {
    it('should forbid children in checkbox input (CHK-CH01)', () => {
      const constraint = CheckboxContract.constraints.find(c => c.id === 'CHK-CH01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('children');
      expect(constraint?.rule.forbidden).toBe(true);
    });
  });

  describe('Type Safety', () => {
    it('should conform to ComponentContract type', () => {
      const contract: ComponentContract = CheckboxContract;
      expect(contract.id).toBe('checkbox');
      expect(contract.constraints).toBeInstanceOf(Array);
    });
  });
});
