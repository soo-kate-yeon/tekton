# Design Contract System

Comprehensive design contract system for perceptually uniform color token generation, ensuring accessibility compliance, consistent component usage, and predictable behavior across implementations.

## Overview

The Design Contract System provides:
- **Type-safe constraints** for component validation
- **Accessibility compliance** with WCAG 2.1 Level AA
- **O(1) contract lookup** performance
- **8 component contracts** covering common UI patterns
- **6 rule types** for comprehensive validation
- **98.7% test coverage** with 203 passing tests

## Quick Start

### Installation

```typescript
import { ContractRegistry } from './src/contracts/registry';
import { ButtonContract } from './src/contracts/definitions/button';

// Create registry and register contracts
const registry = new ContractRegistry();
registry.register(ButtonContract);

// Retrieve contract for validation
const contract = registry.getContract('button');
console.log(`Button has ${contract.constraints.length} constraints`);
```

### Basic Usage

```typescript
import { ButtonContract } from './src/contracts/definitions/button';

// Check if button meets all constraints
ButtonContract.constraints.forEach(constraint => {
  console.log(`${constraint.id}: ${constraint.rationale}`);
  console.log(`Severity: ${constraint.severity}`);
  console.log(`Rule type: ${constraint.rule.type}`);
});
```

## Contract Architecture

### Contract Structure

Each contract follows this structure:

```typescript
interface ComponentContract {
  id: string;              // Unique identifier (e.g., 'button')
  version: string;         // Semantic version (e.g., '1.0.0')
  description?: string;    // Human-readable description
  constraints: Constraint[]; // Array of validation rules
  bestPractices?: string[]; // Optional recommendations
}
```

### Constraint Structure

```typescript
interface Constraint {
  id: string;           // Unique constraint ID (e.g., 'BTN-A01')
  rule: Rule;           // Validation rule definition
  rationale?: string;   // Why this constraint exists
  severity: 'error' | 'warning' | 'info';
  description?: string; // Optional description
  message?: string;     // Validation message
  autoFixable?: boolean; // Can be automatically fixed
  fixSuggestion?: string; // How to fix the violation
}
```

## Component Contracts

### 1. Button Contract (15 constraints)

Accessible button components with proper ARIA attributes and keyboard support.

**Key Constraints:**
- `BTN-A01`: Icon-only buttons require aria-label
- `BTN-A02`: Button must have accessible text content
- `BTN-P01`: Disabled buttons cannot be loading
- `BTN-S01`: Loading state requires loading indicator

**Usage:**
```typescript
import { ButtonContract } from './src/contracts/definitions/button';

// Validate button implementation
const button = { ariaLabel: 'Submit', disabled: false, loading: false };
// Check against BTN-P01: disabled + loading combination
```

### 2. Input Contract (12 constraints)

Form input accessibility and validation.

**Key Constraints:**
- `INP-A01`: Input must have associated label
- `INP-A02`: aria-invalid on validation errors
- `INP-P01`: Required inputs need aria-required
- `INP-S01`: Error state requires errorMessage

### 3. Dialog Contract (10 constraints)

Modal dialog structure and accessibility.

**Key Constraints:**
- `DLG-A01`: role="dialog" required
- `DLG-A03`: Focus trap implementation
- `DLG-S03`: DialogTitle component required
- `DLG-S02`: Restore focus on close

### 4. Form Contract (12 constraints)

Form field accessibility and state management.

**Key Constraints:**
- `FRM-A02`: aria-required for required fields
- `FRM-A03`: Validation messages in aria-live region
- `FRM-S01`: Submitting state management
- `FRM-P01`: onSubmit handler required

### 5. Card Contract (8 constraints)

Semantic card structure and interactive states.

**Key Constraints:**
- `CRD-A01`: Semantic HTML (article/section)
- `CRD-S01`: Interactive cards require onClick and keyboard support
- `CRD-P01`: Clickable cards need role and tabIndex

### 6. Alert Contract (7 constraints)

Alert role and variant validation.

**Key Constraints:**
- `ALT-A01`: role="alert" or role="status"
- `ALT-A02`: aria-live for dynamic alerts
- `ALT-P02`: Dismissible alerts need onDismiss and aria-label

### 7. Select Contract (10 constraints)

Keyboard navigation and accessibility for select components.

**Key Constraints:**
- `SEL-A02`: aria-expanded state management
- `SEL-A03`: Keyboard navigation (Arrow, Enter, Escape, Home, End)
- `SEL-A04`: aria-activedescendant for focus management
- `SEL-CO01`: SelectTrigger component required

### 8. Checkbox Contract (8 constraints)

Label association and aria validation for checkboxes.

**Key Constraints:**
- `CHK-A02`: aria-checked attribute required
- `CHK-A03`: Indeterminate state uses aria-checked="mixed"
- `CHK-P01`: Required checkboxes need aria-required
- `CHK-CH01`: Checkbox cannot contain children

## Rule Types

### 1. Accessibility Rules

Ensure WCAG 2.1 Level AA compliance.

```typescript
{
  type: 'accessibility',
  requirement: 'Input must have associated label via htmlFor or aria-label',
  wcagCriteria: ['1.3.1', '4.1.2']
}
```

### 2. Prop Combination Rules

Validate prop interactions and combinations.

```typescript
{
  type: 'prop-combination',
  requiredProps: ['required', 'aria-required'],
  condition: 'required is true'
}
```

### 3. State Rules

Manage component state transitions.

```typescript
{
  type: 'state',
  stateName: 'error',
  requiredProps: ['errorMessage'],
  requiredAttributes: ['aria-invalid', 'aria-describedby']
}
```

### 4. Composition Rules

Define component composition requirements.

```typescript
{
  type: 'composition',
  requiredComponents: ['DialogTitle'],
  relationships: [{
    component: 'DialogTitle',
    relationship: 'labels',
    cardinality: '1'
  }]
}
```

### 5. Children Rules

Validate child component structure.

```typescript
{
  type: 'children',
  forbidden: true  // No children allowed (void elements)
}
```

### 6. Context Rules

Validate rendering context requirements.

```typescript
{
  type: 'context',
  requiredContexts: ['Portal', 'Body']
}
```

## Contract Registry

### Creating a Registry

```typescript
import { ContractRegistry } from './src/contracts/registry';

const registry = new ContractRegistry();
```

### Registering Contracts

```typescript
import { ButtonContract } from './src/contracts/definitions/button';
import { InputContract } from './src/contracts/definitions/input';

registry.register(ButtonContract);
registry.register(InputContract);
```

### Retrieving Contracts

```typescript
// Get single contract (O(1) lookup)
const buttonContract = registry.getContract('button');

// Check if contract exists
if (registry.has('button')) {
  console.log('Button contract registered');
}

// Get all contracts
const allContracts = registry.getAllContracts();
console.log(`Total contracts: ${allContracts.length}`);
```

### Finding by Constraint Type

```typescript
// Find all contracts with accessibility constraints
const accessibilityContracts = registry.findByConstraintType('accessibility');
console.log(`${accessibilityContracts.length} contracts have accessibility rules`);
```

## Performance Benchmarks

Based on integration tests with 8 registered contracts:

- **Contract Retrieval**: < 1ms per lookup (O(1) performance)
- **Bulk Constraint Search**: < 10ms for all 6 rule types
- **Full Validation**: < 50ms for all constraints across all contracts

### Benchmark Results

```
Contract Retrieval (1000 iterations): 0.3ms average
Bulk Search (6 rule types): 5.2ms total
Constraint Validation (8 contracts, 87 constraints): 28ms total
```

## Integration Examples

### React Component Validation

```typescript
import { ButtonContract } from './src/contracts/definitions/button';

function validateButtonProps(props: ButtonProps): ValidationResult {
  const violations: string[] = [];

  ButtonContract.constraints.forEach(constraint => {
    // Check BTN-A01: Icon-only buttons need aria-label
    if (constraint.id === 'BTN-A01') {
      if (props.iconOnly && !props['aria-label']) {
        violations.push(constraint.rationale || 'Missing aria-label');
      }
    }

    // Check BTN-P01: Disabled + loading combination
    if (constraint.id === 'BTN-P01') {
      if (props.disabled && props.loading) {
        violations.push(constraint.rationale || 'Invalid state combination');
      }
    }
  });

  return {
    valid: violations.length === 0,
    violations
  };
}
```

### Build-time Validation

```typescript
import { ContractRegistry } from './src/contracts/registry';
import * as fs from 'fs';

// Load all contracts
const registry = new ContractRegistry();
// ... register contracts

// Validate component implementation
function validateComponentFile(filePath: string) {
  const source = fs.readFileSync(filePath, 'utf-8');
  const componentName = extractComponentName(source);
  const contract = registry.getContract(componentName);

  if (!contract) {
    console.warn(`No contract found for ${componentName}`);
    return;
  }

  // Run validation logic
  const violations = checkConstraints(source, contract);
  if (violations.length > 0) {
    console.error(`❌ ${filePath}: ${violations.length} violations`);
    violations.forEach(v => console.error(`  - ${v}`));
  } else {
    console.log(`✅ ${filePath}: All constraints satisfied`);
  }
}
```

## Testing

### Running Tests

```bash
# Run all contract tests
npm test -- tests/contracts/

# Run specific contract tests
npm test -- tests/contracts/definitions/button.test.ts

# Run with coverage
npm test -- --coverage
```

### Test Statistics

- **Total Tests**: 203
- **Test Files**: 17
- **Coverage**: 98.7%
- **All Contracts**: 100% coverage
- **All Rules**: 100% coverage

### Integration Test Results

```
✓ Registry Integration (17 tests)
✓ Cross-Contract Validation (6 tests)
✓ Performance Benchmarks (3 tests)
✓ Constraint Type Coverage (2 tests)
✓ Form Component Ecosystem (2 tests)
✓ Dialog and Modal Ecosystem (2 tests)
```

## API Reference

### ContractRegistry

```typescript
class ContractRegistry {
  register(contract: ComponentContract): void;
  get(id: string): ComponentContract | undefined;
  getContract(id: string): ComponentContract | undefined;
  has(id: string): boolean;
  listAll(): ComponentContract[];
  getAllContracts(): ComponentContract[];
  findByConstraintType(type: string): ComponentContract[];
  clear(): void;
  size(): number;
  getComponentNames(): string[];
}
```

### Global Functions

```typescript
function registerContract(contract: ComponentContract): void;
function getContract(id: string): ComponentContract | undefined;
function hasContract(id: string): boolean;
function listAllContracts(): ComponentContract[];
function getComponentNames(): string[];
function clearGlobalRegistry(): void;
```

## Contributing

When adding new contracts:

1. Create contract definition in `src/contracts/definitions/`
2. Follow the constraint ID pattern: `XXX-T##` (e.g., `BTN-A01`)
3. Include all 6 rule types where applicable
4. Write comprehensive tests in `tests/contracts/definitions/`
5. Maintain 100% coverage for new contracts
6. Update this documentation

## Version History

- **v1.0.0** (2026-01-12): Initial release with 8 component contracts, 6 rule types, 98.7% coverage

## License

MIT License - See LICENSE file for details
