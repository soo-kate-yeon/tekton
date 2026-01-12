import { describe, it, expect } from 'vitest';
import { AlertContract } from '../../../src/contracts/definitions/alert';
import { type ComponentContract } from '../../../src/contracts/types';

describe('Alert Contract', () => {
  describe('Contract Structure', () => {
    it('should have valid contract metadata', () => {
      expect(AlertContract.id).toBe('alert');
      expect(AlertContract.version).toBe('1.0.0');
      expect(AlertContract.description).toContain('alert');
    });

    it('should have 7 constraints', () => {
      expect(AlertContract.constraints).toHaveLength(7);
    });
  });

  describe('Accessibility Constraints', () => {
    it('should require role="alert" or role="status" (ALT-A01)', () => {
      const constraint = AlertContract.constraints.find(c => c.id === 'ALT-A01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('accessibility');
      expect(constraint?.rule.requirement).toContain('role');
      expect(constraint?.severity).toBe('error');
    });

    it('should have aria-live for dynamic alerts (ALT-A02)', () => {
      const constraint = AlertContract.constraints.find(c => c.id === 'ALT-A02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('accessibility');
      expect(constraint?.rule.requirement).toContain('aria-live');
    });
  });

  describe('Prop Combination Constraints', () => {
    it('should validate variant prop (ALT-P01)', () => {
      const constraint = AlertContract.constraints.find(c => c.id === 'ALT-P01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('prop-combination');
    });

    it('should validate dismissible alerts (ALT-P02)', () => {
      const constraint = AlertContract.constraints.find(c => c.id === 'ALT-P02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('prop-combination');
    });
  });

  describe('Composition Constraints', () => {
    it('should allow AlertTitle (ALT-CO01)', () => {
      const constraint = AlertContract.constraints.find(c => c.id === 'ALT-CO01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('composition');
      expect(constraint?.rule.optionalComponents).toContain('AlertTitle');
    });

    it('should allow AlertDescription (ALT-CO02)', () => {
      const constraint = AlertContract.constraints.find(c => c.id === 'ALT-CO02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('composition');
    });
  });

  describe('State Constraints', () => {
    it('should validate dismissed state (ALT-S01)', () => {
      const constraint = AlertContract.constraints.find(c => c.id === 'ALT-S01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('state');
      expect(constraint?.rule.stateName).toBe('dismissed');
    });
  });

  describe('Type Safety', () => {
    it('should conform to ComponentContract type', () => {
      const contract: ComponentContract = AlertContract;
      expect(contract.id).toBe('alert');
      expect(contract.constraints).toBeInstanceOf(Array);
    });
  });
});
