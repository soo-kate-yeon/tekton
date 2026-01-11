import { describe, it, expect } from 'vitest';
import { ButtonContract } from '../../../src/contracts/definitions/button';

describe('Button Contract', () => {
  it('should have correct component metadata', () => {
    expect(ButtonContract.id).toBe('button');
    expect(ButtonContract.version).toBe('1.0.0');
    expect(ButtonContract.description).toContain('button');
  });

  it('should have 15 constraints', () => {
    expect(ButtonContract.constraints).toHaveLength(15);
  });

  it('should have best practices', () => {
    expect(ButtonContract.bestPractices).toBeDefined();
    expect(ButtonContract.bestPractices!.length).toBeGreaterThan(0);
  });

  describe('BTN-A01: Icon-only buttons require aria-label', () => {
    it('should be defined as error severity', () => {
      const constraint = ButtonContract.constraints.find((c) => c.id === 'BTN-A01');
      expect(constraint).toBeDefined();
      expect(constraint?.severity).toBe('error');
    });

    it('should be auto-fixable', () => {
      const constraint = ButtonContract.constraints.find((c) => c.id === 'BTN-A01');
      expect(constraint?.autoFixable).toBe(true);
      expect(constraint?.fixSuggestion).toBeDefined();
    });

    it('should have accessibility rule', () => {
      const constraint = ButtonContract.constraints.find((c) => c.id === 'BTN-A01');
      expect(constraint?.rule.type).toBe('accessibility');
    });
  });

  describe('BTN-A02: Disabled buttons need aria-disabled', () => {
    it('should be defined as warning severity', () => {
      const constraint = ButtonContract.constraints.find((c) => c.id === 'BTN-A02');
      expect(constraint).toBeDefined();
      expect(constraint?.severity).toBe('warning');
    });
  });

  describe('BTN-A03: Loading state accessibility', () => {
    it('should be defined', () => {
      const constraint = ButtonContract.constraints.find((c) => c.id === 'BTN-A03');
      expect(constraint).toBeDefined();
      expect(constraint?.severity).toBe('error');
    });
  });

  describe('BTN-P01: Forbidden prop combinations', () => {
    it('should prevent disabled and loading together', () => {
      const constraint = ButtonContract.constraints.find((c) => c.id === 'BTN-P01');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('prop-combination');
    });
  });

  describe('BTN-P02: asChild with href', () => {
    it('should be mutually exclusive', () => {
      const constraint = ButtonContract.constraints.find((c) => c.id === 'BTN-P02');
      expect(constraint).toBeDefined();
      expect(constraint?.rule.type).toBe('prop-combination');
    });
  });

  describe('BTN-S01: Valid variant values', () => {
    it('should restrict variant prop', () => {
      const constraint = ButtonContract.constraints.find((c) => c.id === 'BTN-S01');
      expect(constraint).toBeDefined();
    });
  });

  describe('BTN-S02: Valid size values', () => {
    it('should restrict size prop', () => {
      const constraint = ButtonContract.constraints.find((c) => c.id === 'BTN-S02');
      expect(constraint).toBeDefined();
    });
  });

  describe('All constraint IDs should be unique', () => {
    it('should have unique constraint IDs', () => {
      const ids = ButtonContract.constraints.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe('All constraints should have required fields', () => {
    it('should have id, severity, description, rule, message, autoFixable', () => {
      ButtonContract.constraints.forEach((constraint) => {
        expect(constraint.id).toBeDefined();
        expect(constraint.id).toMatch(/^BTN-[APS]\d{2}$/);
        expect(constraint.severity).toBeDefined();
        expect(['error', 'warning', 'info']).toContain(constraint.severity);
        expect(constraint.description).toBeDefined();
        expect(constraint.description.length).toBeGreaterThan(0);
        expect(constraint.rule).toBeDefined();
        expect(constraint.message).toBeDefined();
        expect(constraint.message.length).toBeGreaterThan(0);
        expect(typeof constraint.autoFixable).toBe('boolean');
      });
    });
  });

  describe('Accessibility constraints', () => {
    it('should have at least 3 accessibility constraints', () => {
      const accessibilityConstraints = ButtonContract.constraints.filter(
        (c) => c.id.startsWith('BTN-A')
      );
      expect(accessibilityConstraints.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Prop combination constraints', () => {
    it('should have at least 2 prop combination constraints', () => {
      const propConstraints = ButtonContract.constraints.filter(
        (c) => c.id.startsWith('BTN-P')
      );
      expect(propConstraints.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Structure constraints', () => {
    it('should have at least 2 structure constraints', () => {
      const structureConstraints = ButtonContract.constraints.filter(
        (c) => c.id.startsWith('BTN-S')
      );
      expect(structureConstraints.length).toBeGreaterThanOrEqual(2);
    });
  });
});
