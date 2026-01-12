import { describe, it, expect, beforeEach } from 'vitest';
import {
  ContractRegistry,
  getContract,
  registerContract,
  listAllContracts,
  hasContract,
} from '../../src/contracts/registry';
import type { ComponentContract } from '../../src/contracts/types';

describe('Contract Registry', () => {
  const mockButtonContract: ComponentContract = {
    id: 'button',
    version: '1.0.0',
    constraints: [
      {
        id: 'BTN-A01',
        severity: 'error',
        rule: { type: 'accessibility', requiredProps: ['aria-label'] },
        rationale: 'Icon-only buttons need accessible labels',
      },
    ],
  };

  const mockInputContract: ComponentContract = {
    id: 'input',
    version: '1.0.0',
    constraints: [
      {
        id: 'INP-A01',
        severity: 'error',
        rule: { type: 'accessibility', requiredProps: ['id', 'aria-labelledby'] },
        rationale: 'Inputs require label association',
      },
    ],
  };

  describe('ContractRegistry class', () => {
    let registry: ContractRegistry;

    beforeEach(() => {
      registry = new ContractRegistry();
    });

    it('should create an empty registry', () => {
      expect(registry.size()).toBe(0);
    });

    it('should register a contract', () => {
      registry.register(mockButtonContract);
      expect(registry.size()).toBe(1);
    });

    it('should retrieve a registered contract', () => {
      registry.register(mockButtonContract);
      const contract = registry.get('button');

      expect(contract).toBeDefined();
      expect(contract?.id).toBe('button');
      expect(contract?.constraints).toHaveLength(1);
    });

    it('should return undefined for unregistered contract', () => {
      const contract = registry.get('NonExistent');
      expect(contract).toBeUndefined();
    });

    it('should check if contract exists', () => {
      registry.register(mockButtonContract);

      expect(registry.has('button')).toBe(true);
      expect(registry.has('input')).toBe(false);
    });

    it('should list all registered contracts', () => {
      registry.register(mockButtonContract);
      registry.register(mockInputContract);

      const contracts = registry.listAll();

      expect(contracts).toHaveLength(2);
      expect(contracts.map((c) => c.id)).toContain('button');
      expect(contracts.map((c) => c.id)).toContain('input');
    });

    it('should update existing contract when re-registered', () => {
      registry.register(mockButtonContract);

      const updatedContract: ComponentContract = {
        ...mockButtonContract,
        version: '2.0.0',
        constraints: [],
      };

      registry.register(updatedContract);

      const retrieved = registry.get('button');
      expect(retrieved?.version).toBe('2.0.0');
      expect(retrieved?.constraints).toHaveLength(0);
      expect(registry.size()).toBe(1); // Still only one contract
    });

    it('should clear all contracts', () => {
      registry.register(mockButtonContract);
      registry.register(mockInputContract);

      expect(registry.size()).toBe(2);

      registry.clear();

      expect(registry.size()).toBe(0);
      expect(registry.get('button')).toBeUndefined();
    });

    it('should get component names', () => {
      registry.register(mockButtonContract);
      registry.register(mockInputContract);

      const names = registry.getComponentNames();

      expect(names).toHaveLength(2);
      expect(names).toContain('button');
      expect(names).toContain('input');
    });
  });

  describe('Global registry functions', () => {
    beforeEach(() => {
      // Clear global registry before each test
      const registry = new ContractRegistry();
      registry.clear();
    });

    it('should register contract globally', () => {
      registerContract(mockButtonContract);
      const contract = getContract('button');

      expect(contract).toBeDefined();
      expect(contract?.id).toBe('button');
    });

    it('should check if contract exists globally', () => {
      registerContract(mockButtonContract);

      expect(hasContract('button')).toBe(true);
      expect(hasContract('input')).toBe(false);
    });

    it('should list all global contracts', () => {
      registerContract(mockButtonContract);
      registerContract(mockInputContract);

      const contracts = listAllContracts();

      expect(contracts.length).toBeGreaterThanOrEqual(2);
      expect(contracts.map((c) => c.id)).toContain('button');
      expect(contracts.map((c) => c.id)).toContain('input');
    });

    it('should return undefined for non-existent contract', () => {
      const contract = getContract('NonExistent');
      expect(contract).toBeUndefined();
    });
  });

  describe('Performance - O(1) lookup', () => {
    it('should perform lookups in constant time', () => {
      const registry = new ContractRegistry();

      // Register 50 contracts
      for (let i = 0; i < 50; i++) {
        const contract: ComponentContract = {
          component: `Component${i}`,
          version: '1.0.0',
          category: 'form',
          constraints: [],
        };
        registry.register(contract);
      }

      // Measure lookup time for 50 lookups
      const startTime = performance.now();

      for (let i = 0; i < 50; i++) {
        registry.get(`Component${i}`);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Average should be less than 1ms (very generous for O(1))
      expect(totalTime).toBeLessThan(1);

      // Individual lookups should be extremely fast
      const avgTime = totalTime / 50;
      expect(avgTime).toBeLessThan(0.02); // 0.02ms per lookup
    });

    it('should maintain O(1) performance with many contracts', () => {
      const registry = new ContractRegistry();

      // Register 100 contracts
      for (let i = 0; i < 100; i++) {
        const contract: ComponentContract = {
          component: `Component${i}`,
          version: '1.0.0',
          category: 'form',
          constraints: [],
        };
        registry.register(contract);
      }

      // Test single lookup
      const startTime = performance.now();
      registry.get('Component50');
      const endTime = performance.now();

      const lookupTime = endTime - startTime;

      // Single lookup should be extremely fast (< 0.1ms)
      expect(lookupTime).toBeLessThan(0.1);
    });
  });
});
