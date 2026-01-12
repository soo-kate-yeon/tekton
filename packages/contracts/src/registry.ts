import type { ComponentContract } from './types';

/**
 * Contract Registry
 *
 * Provides O(1) lookup time for component contracts using a Map data structure.
 * The registry stores contracts by component name for efficient retrieval.
 *
 * @module contracts/registry
 */

/**
 * Registry for storing and retrieving component contracts
 *
 * Uses a Map for O(1) lookup performance. Contracts are indexed by component name.
 *
 * @example
 * ```typescript
 * const registry = new ContractRegistry();
 * registry.register(buttonContract);
 * const contract = registry.get('Button'); // O(1) lookup
 * ```
 */
export class ContractRegistry {
  private contracts: Map<string, ComponentContract>;

  constructor() {
    this.contracts = new Map();
  }

  /**
   * Register a component contract
   *
   * If a contract with the same component name already exists, it will be replaced.
   *
   * @param contract - The component contract to register
   * @returns void
   *
   * @example
   * ```typescript
   * registry.register({
   *   component: 'Button',
   *   version: '1.0.0',
   *   category: 'form',
   *   constraints: [...]
   * });
   * ```
   */
  register(contract: ComponentContract): void {
    this.contracts.set(contract.id, contract);
  }

  /**
   * Retrieve a contract by component name
   *
   * Time complexity: O(1)
   *
   * @param componentName - Name of the component
   * @returns The contract if found, undefined otherwise
   *
   * @example
   * ```typescript
   * const buttonContract = registry.get('Button');
   * if (buttonContract) {
   *   console.log(buttonContract.constraints);
   * }
   * ```
   */
  get(componentName: string): ComponentContract | undefined {
    return this.contracts.get(componentName);
  }

  /**
   * Check if a contract exists for a component
   *
   * Time complexity: O(1)
   *
   * @param componentName - Name of the component
   * @returns true if contract exists, false otherwise
   *
   * @example
   * ```typescript
   * if (registry.has('Button')) {
   *   // Process button contract
   * }
   * ```
   */
  has(componentName: string): boolean {
    return this.contracts.has(componentName);
  }

  /**
   * List all registered contracts
   *
   * Time complexity: O(n) where n is the number of contracts
   *
   * @returns Array of all registered contracts
   *
   * @example
   * ```typescript
   * const allContracts = registry.listAll();
   * console.log(`Registered ${allContracts.length} contracts`);
   * ```
   */
  listAll(): ComponentContract[] {
    return Array.from(this.contracts.values());
  }

  /**
   * Get the number of registered contracts
   *
   * @returns Number of contracts in the registry
   */
  size(): number {
    return this.contracts.size;
  }

  /**
   * Clear all contracts from the registry
   *
   * @returns void
   */
  clear(): void {
    this.contracts.clear();
  }

  /**
   * Get all component names
   *
   * @returns Array of component names
   *
   * @example
   * ```typescript
   * const names = registry.getComponentNames();
   * // ['Button', 'Input', 'Dialog']
   * ```
   */
  getComponentNames(): string[] {
    return Array.from(this.contracts.keys());
  }

  /**
   * Get all registered contracts
   *
   * Alias for listAll() for consistency
   *
   * @returns Array of all registered contracts
   */
  getAllContracts(): ComponentContract[] {
    return this.listAll();
  }

  /**
   * Get a contract by ID
   *
   * Alias for get() for consistency
   *
   * @param id - Contract ID
   * @returns The contract if found, undefined otherwise
   */
  getContract(id: string): ComponentContract | undefined {
    return this.get(id);
  }

  /**
   * Find contracts by constraint type
   *
   * @param constraintType - Type of constraint to search for
   * @returns Array of contracts that have the specified constraint type
   *
   * @example
   * ```typescript
   * const accessibilityContracts = registry.findByConstraintType('accessibility');
   * ```
   */
  findByConstraintType(constraintType: string): ComponentContract[] {
    return this.listAll().filter(contract =>
      contract.constraints.some(c => c.rule.type === constraintType)
    );
  }
}

// ============================================================================
// Global Registry Instance
// ============================================================================

/**
 * Global contract registry instance
 *
 * A singleton instance for convenient access throughout the application.
 */
const globalRegistry = new ContractRegistry();

/**
 * Register a contract in the global registry
 *
 * @param contract - The component contract to register
 *
 * @example
 * ```typescript
 * registerContract(buttonContract);
 * ```
 */
export function registerContract(contract: ComponentContract): void {
  globalRegistry.register(contract);
}

/**
 * Get a contract from the global registry
 *
 * Time complexity: O(1)
 *
 * @param componentName - Name of the component
 * @returns The contract if found, undefined otherwise
 *
 * @example
 * ```typescript
 * const contract = getContract('Button');
 * ```
 */
export function getContract(componentName: string): ComponentContract | undefined {
  return globalRegistry.get(componentName);
}

/**
 * Check if a contract exists in the global registry
 *
 * Time complexity: O(1)
 *
 * @param componentName - Name of the component
 * @returns true if contract exists, false otherwise
 *
 * @example
 * ```typescript
 * if (hasContract('Button')) {
 *   const contract = getContract('Button');
 * }
 * ```
 */
export function hasContract(componentName: string): boolean {
  return globalRegistry.has(componentName);
}

/**
 * List all contracts from the global registry
 *
 * @returns Array of all registered contracts
 *
 * @example
 * ```typescript
 * const contracts = listAllContracts();
 * contracts.forEach(contract => {
 *   console.log(`${contract.component}: ${contract.constraints.length} constraints`);
 * });
 * ```
 */
export function listAllContracts(): ComponentContract[] {
  return globalRegistry.listAll();
}

/**
 * Get all component names from the global registry
 *
 * @returns Array of component names
 */
export function getComponentNames(): string[] {
  return globalRegistry.getComponentNames();
}

/**
 * Clear all contracts from the global registry
 *
 * Mainly used for testing purposes.
 */
export function clearGlobalRegistry(): void {
  globalRegistry.clear();
}
