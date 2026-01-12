import { describe, it, expect } from 'vitest';
import { DialogContract } from '../../../src/contracts/definitions/dialog';
import { type ComponentContract } from '../../../src/contracts/types';

describe('Dialog Contract', () => {
  describe('Contract Structure', () => {
    it('should have valid contract metadata', () => {
      expect(DialogContract.id).toBe('dialog');
      expect(DialogContract.version).toBe('1.0.0');
      expect(DialogContract.description).toContain('dialog');
    });

    it('should have 10 constraints', () => {
      expect(DialogContract.constraints).toHaveLength(10);
    });
  });

  describe('Accessibility Constraints', () => {
    it('should require role="dialog" (DLG-A01)', () => {
      const constraint = DialogContract.constraints.find(c => c.id === 'DLG-A01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('accessibility');
      expect(constraint?.rule.requirement).toContain('role="dialog"');
      expect(constraint?.severity).toBe('error');
    });

    it('should require aria-labelledby or aria-label (DLG-A02)', () => {
      const constraint = DialogContract.constraints.find(c => c.id === 'DLG-A02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('accessibility');
      expect(constraint?.rule.requirement).toContain('aria-labelledby');
    });

    it('should require focus trap (DLG-A03)', () => {
      const constraint = DialogContract.constraints.find(c => c.id === 'DLG-A03');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('accessibility');
      expect(constraint?.rule.requirement).toContain('focus trap');
    });
  });

  describe('Composition Constraints', () => {
    it('should require DialogTitle component (DLG-S03)', () => {
      const constraint = DialogContract.constraints.find(c => c.id === 'DLG-S03');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('composition');
      expect(constraint?.rule.requiredComponents).toContain('DialogTitle');
      expect(constraint?.severity).toBe('error');
    });

    it('should allow optional DialogDescription (DLG-CO01)', () => {
      const constraint = DialogContract.constraints.find(c => c.id === 'DLG-CO01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('composition');
      expect(constraint?.rule.optionalComponents).toContain('DialogDescription');
    });

    it('should allow optional DialogFooter (DLG-CO02)', () => {
      const constraint = DialogContract.constraints.find(c => c.id === 'DLG-CO02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('composition');
      expect(constraint?.rule.optionalComponents).toContain('DialogFooter');
    });
  });

  describe('State Constraints', () => {
    it('should validate open state management (DLG-S01)', () => {
      const constraint = DialogContract.constraints.find(c => c.id === 'DLG-S01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('state');
      expect(constraint?.rule.stateName).toBe('open');
    });

    it('should restore focus on close (DLG-S02)', () => {
      const constraint = DialogContract.constraints.find(c => c.id === 'DLG-S02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('state');
      expect(constraint?.rationale).toContain('focus');
    });
  });

  describe('Context Constraints', () => {
    it('should validate portal rendering (DLG-C01)', () => {
      const constraint = DialogContract.constraints.find(c => c.id === 'DLG-C01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('context');
      expect(constraint?.rule.requiredContexts).toContain('Portal');
    });
  });

  describe('Children Constraints', () => {
    it('should validate children structure (DLG-CH01)', () => {
      const constraint = DialogContract.constraints.find(c => c.id === 'DLG-CH01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('children');
      expect(constraint?.rule.allowedComponents).toContain('DialogTitle');
    });
  });

  describe('Type Safety', () => {
    it('should conform to ComponentContract type', () => {
      const contract: ComponentContract = DialogContract;
      expect(contract.id).toBe('dialog');
      expect(contract.constraints).toBeInstanceOf(Array);
    });
  });
});
