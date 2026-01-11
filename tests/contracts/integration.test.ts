import { describe, it, expect, beforeAll } from 'vitest';
import { ContractRegistry } from '../../src/contracts/registry';
import { ButtonContract } from '../../src/contracts/definitions/button';
import { InputContract } from '../../src/contracts/definitions/input';
import { DialogContract } from '../../src/contracts/definitions/dialog';
import { FormContract } from '../../src/contracts/definitions/form';
import { CardContract } from '../../src/contracts/definitions/card';
import { AlertContract } from '../../src/contracts/definitions/alert';
import { SelectContract } from '../../src/contracts/definitions/select';
import { CheckboxContract } from '../../src/contracts/definitions/checkbox';

describe('Contract System Integration', () => {
  let registry: ContractRegistry;

  beforeAll(() => {
    registry = new ContractRegistry();

    // Register all contracts
    registry.register(ButtonContract);
    registry.register(InputContract);
    registry.register(DialogContract);
    registry.register(FormContract);
    registry.register(CardContract);
    registry.register(AlertContract);
    registry.register(SelectContract);
    registry.register(CheckboxContract);
  });

  describe('Registry Integration', () => {
    it('should have all 8 component contracts registered', () => {
      expect(registry.getAllContracts()).toHaveLength(8);
    });

    it('should retrieve contracts by ID', () => {
      expect(registry.getContract('button')).toBe(ButtonContract);
      expect(registry.getContract('input')).toBe(InputContract);
      expect(registry.getContract('dialog')).toBe(DialogContract);
      expect(registry.getContract('form')).toBe(FormContract);
      expect(registry.getContract('card')).toBe(CardContract);
      expect(registry.getContract('alert')).toBe(AlertContract);
      expect(registry.getContract('select')).toBe(SelectContract);
      expect(registry.getContract('checkbox')).toBe(CheckboxContract);
    });

    it('should find contracts by constraint type', () => {
      const accessibilityContracts = registry.findByConstraintType('accessibility');
      expect(accessibilityContracts.length).toBeGreaterThan(0);
      expect(accessibilityContracts).toContain(ButtonContract);
      expect(accessibilityContracts).toContain(InputContract);
      expect(accessibilityContracts).toContain(DialogContract);
    });

    it('should validate contract IDs are unique', () => {
      const allContracts = registry.getAllContracts();
      const ids = allContracts.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Cross-Contract Validation', () => {
    it('should have consistent accessibility constraint structure', () => {
      const allContracts = registry.getAllContracts();

      allContracts.forEach(contract => {
        const accessibilityConstraints = contract.constraints.filter(
          c => c.rule.type === 'accessibility'
        );

        accessibilityConstraints.forEach(constraint => {
          expect(constraint.rule).toBeDefined();
          expect(constraint.rule.type).toBe('accessibility');
          expect(constraint.severity).toMatch(/^(error|warning|info)$/);
        });
      });
    });

    it('should have consistent version format', () => {
      const allContracts = registry.getAllContracts();
      const versionRegex = /^\d+\.\d+\.\d+$/;

      allContracts.forEach(contract => {
        expect(contract.version).toMatch(versionRegex);
      });
    });

    it('should have unique constraint IDs within each contract', () => {
      const allContracts = registry.getAllContracts();

      allContracts.forEach(contract => {
        const constraintIds = contract.constraints.map(c => c.id);
        const uniqueIds = new Set(constraintIds);
        expect(uniqueIds.size).toBe(constraintIds.length);
      });
    });

    it('should have consistent constraint ID prefixes', () => {
      const allContracts = registry.getAllContracts();

      allContracts.forEach(contract => {
        const expectedPrefix = contract.id.substring(0, 3).toUpperCase();

        contract.constraints.forEach(constraint => {
          expect(constraint.id).toMatch(new RegExp(`^${expectedPrefix}|^[A-Z]{3}-`));
        });
      });
    });
  });

  describe('Performance Benchmarks', () => {
    it('should retrieve contract in < 1ms (O(1) lookup)', () => {
      const iterations = 1000;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        registry.getContract('button');
        registry.getContract('input');
        registry.getContract('dialog');
      }

      const end = performance.now();
      const avgTime = (end - start) / iterations;

      expect(avgTime).toBeLessThan(1);
    });

    it('should handle bulk constraint searches efficiently', () => {
      const start = performance.now();

      registry.findByConstraintType('accessibility');
      registry.findByConstraintType('prop-combination');
      registry.findByConstraintType('state');
      registry.findByConstraintType('composition');
      registry.findByConstraintType('children');
      registry.findByConstraintType('context');

      const end = performance.now();
      const totalTime = end - start;

      expect(totalTime).toBeLessThan(10);
    });

    it('should handle contract validation at scale', () => {
      const start = performance.now();
      const allContracts = registry.getAllContracts();

      // Simulate validation by accessing all constraints
      let totalConstraints = 0;
      allContracts.forEach(contract => {
        contract.constraints.forEach(constraint => {
          totalConstraints++;
          // Access all constraint properties
          expect(constraint.id).toBeDefined();
          expect(constraint.rule).toBeDefined();
          expect(constraint.severity).toBeDefined();
        });
      });

      const end = performance.now();

      expect(totalConstraints).toBeGreaterThan(60);
      expect(end - start).toBeLessThan(50);
    });
  });

  describe('Constraint Type Coverage', () => {
    it('should have all 6 rule types represented', () => {
      const ruleTypes = new Set<string>();
      const allContracts = registry.getAllContracts();

      allContracts.forEach(contract => {
        contract.constraints.forEach(constraint => {
          ruleTypes.add(constraint.rule.type);
        });
      });

      expect(ruleTypes).toContain('accessibility');
      expect(ruleTypes).toContain('prop-combination');
      expect(ruleTypes).toContain('state');
      expect(ruleTypes).toContain('composition');
      expect(ruleTypes).toContain('children');
      expect(ruleTypes).toContain('context');
    });

    it('should have consistent severity usage', () => {
      const allContracts = registry.getAllContracts();
      const severities = new Set<string>();

      allContracts.forEach(contract => {
        contract.constraints.forEach(constraint => {
          severities.add(constraint.severity);
        });
      });

      expect(severities.size).toBeGreaterThan(0);
      expect(severities.size).toBeLessThanOrEqual(3); // error, warning, info
    });
  });

  describe('Form Component Ecosystem', () => {
    it('should have related form component contracts', () => {
      const formContract = registry.getContract('form');
      const inputContract = registry.getContract('input');
      const selectContract = registry.getContract('select');
      const checkboxContract = registry.getContract('checkbox');

      expect(formContract).toBeDefined();
      expect(inputContract).toBeDefined();
      expect(selectContract).toBeDefined();
      expect(checkboxContract).toBeDefined();
    });

    it('should have consistent accessibility requirements across form components', () => {
      const formComponents = ['input', 'select', 'checkbox'];

      formComponents.forEach(componentId => {
        const contract = registry.getContract(componentId);
        const hasLabelConstraint = contract?.constraints.some(
          c => c.rule.type === 'accessibility' &&
               c.rule.requirement?.toLowerCase().includes('label')
        );

        expect(hasLabelConstraint).toBe(true);
      });
    });
  });

  describe('Dialog and Modal Ecosystem', () => {
    it('should have dialog contract with composition requirements', () => {
      const dialogContract = registry.getContract('dialog');
      const compositionConstraints = dialogContract?.constraints.filter(
        c => c.rule.type === 'composition'
      );

      expect(compositionConstraints?.length).toBeGreaterThan(0);
    });

    it('should require DialogTitle component', () => {
      const dialogContract = registry.getContract('dialog');
      const titleRequirement = dialogContract?.constraints.find(
        c => c.id === 'DLG-S03'
      );

      expect(titleRequirement).toBeDefined();
      expect(titleRequirement?.rule.type).toBe('composition');
      expect(titleRequirement?.rule.requiredComponents).toContain('DialogTitle');
    });
  });
});
