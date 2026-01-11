import { describe, it, expect } from 'vitest';
import { CardContract } from '../../../src/contracts/definitions/card';
import { type ComponentContract } from '../../../src/contracts/types';

describe('Card Contract', () => {
  describe('Contract Structure', () => {
    it('should have valid contract metadata', () => {
      expect(CardContract.id).toBe('card');
      expect(CardContract.version).toBe('1.0.0');
      expect(CardContract.description).toContain('card');
    });

    it('should have 8 constraints', () => {
      expect(CardContract.constraints).toHaveLength(8);
    });
  });

  describe('Accessibility Constraints', () => {
    it('should use semantic article or section (CRD-A01)', () => {
      const constraint = CardContract.constraints.find(c => c.id === 'CRD-A01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('accessibility');
      expect(constraint?.rule.requirement).toContain('article');
    });

    it('should have accessible heading (CRD-A02)', () => {
      const constraint = CardContract.constraints.find(c => c.id === 'CRD-A02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('accessibility');
    });
  });

  describe('Composition Constraints', () => {
    it('should allow CardHeader (CRD-CO01)', () => {
      const constraint = CardContract.constraints.find(c => c.id === 'CRD-CO01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('composition');
      expect(constraint?.rule.optionalComponents).toContain('CardHeader');
    });

    it('should allow CardContent (CRD-CO02)', () => {
      const constraint = CardContract.constraints.find(c => c.id === 'CRD-CO02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('composition');
    });

    it('should allow CardFooter (CRD-CO03)', () => {
      const constraint = CardContract.constraints.find(c => c.id === 'CRD-CO03');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('composition');
    });
  });

  describe('State Constraints', () => {
    it('should validate interactive state (CRD-S01)', () => {
      const constraint = CardContract.constraints.find(c => c.id === 'CRD-S01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('state');
      expect(constraint?.rule.stateName).toBe('interactive');
    });
  });

  describe('Children Constraints', () => {
    it('should allow structured children (CRD-CH01)', () => {
      const constraint = CardContract.constraints.find(c => c.id === 'CRD-CH01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('children');
    });
  });

  describe('Prop Combination Constraints', () => {
    it('should validate clickable card requirements (CRD-P01)', () => {
      const constraint = CardContract.constraints.find(c => c.id === 'CRD-P01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('prop-combination');
    });
  });

  describe('Type Safety', () => {
    it('should conform to ComponentContract type', () => {
      const contract: ComponentContract = CardContract;
      expect(contract.id).toBe('card');
      expect(contract.constraints).toBeInstanceOf(Array);
    });
  });
});
