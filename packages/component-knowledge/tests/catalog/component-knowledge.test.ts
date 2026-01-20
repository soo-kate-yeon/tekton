import { describe, it, expect } from 'vitest';
import { ComponentKnowledge, validateComponentKnowledge } from '../../src/catalog/component-knowledge';
import { validateSlotAffinity, validateConstraints } from '../../src/catalog/constraint-validator';

describe('ComponentKnowledge Interface', () => {
  it('should accept valid ComponentKnowledge with all required fields', () => {
    const validKnowledge: ComponentKnowledge = {
      name: 'Button',
      type: 'atom',
      category: 'action',
      slotAffinity: {
        main: 0.6,
        sidebar: 0.8,
        header: 0.7,
        footer: 0.9,
      },
      semanticDescription: {
        purpose: 'Primary interactive element for user actions',
        visualImpact: 'prominent',
        complexity: 'low',
      },
      constraints: {
        requires: [],
        conflictsWith: [],
        excludedSlots: [],
      },
      tokenBindings: {
        states: {
          default: { backgroundColor: 'color-primary', color: 'color-text-on-primary' },
          hover: { backgroundColor: 'color-primary-hover' },
          focus: { borderColor: 'color-focus-ring' },
          active: { backgroundColor: 'color-primary-active' },
          disabled: { opacity: 'opacity-disabled' },
        },
      },
    };

    const result = validateComponentKnowledge(validKnowledge);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject ComponentKnowledge with invalid slotAffinity values', () => {
    const invalidKnowledge: ComponentKnowledge = {
      name: 'Button',
      type: 'atom',
      category: 'action',
      slotAffinity: {
        main: 1.5, // Invalid: > 1.0
        sidebar: -0.1, // Invalid: < 0.0
      },
      semanticDescription: {
        purpose: 'Test',
        visualImpact: 'neutral',
        complexity: 'low',
      },
      constraints: {},
      tokenBindings: {
        states: {
          default: {},
          hover: {},
          focus: {},
          active: {},
          disabled: {},
        },
      },
    };

    const result = validateComponentKnowledge(invalidKnowledge);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some(e => e.includes('slotAffinity'))).toBe(true);
  });

  it('should reject ComponentKnowledge with missing required states', () => {
    const incompleteKnowledge: ComponentKnowledge = {
      name: 'Button',
      type: 'atom',
      category: 'action',
      slotAffinity: { main: 0.8 },
      semanticDescription: {
        purpose: 'Test',
        visualImpact: 'neutral',
        complexity: 'low',
      },
      constraints: {},
      tokenBindings: {
        states: {
          default: {},
          hover: {},
          // Missing: focus, active, disabled
        } as any,
      },
    };

    const result = validateComponentKnowledge(incompleteKnowledge);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('state'))).toBe(true);
  });
});

describe('SlotAffinity Validator', () => {
  it('should validate slotAffinity values are in 0.0-1.0 range', () => {
    const validAffinity = { main: 0.5, sidebar: 1.0, header: 0.0 };
    const result = validateSlotAffinity(validAffinity);
    expect(result.valid).toBe(true);
  });

  it('should reject slotAffinity values outside 0.0-1.0 range', () => {
    const invalidAffinity = { main: 1.5, sidebar: -0.2 };
    const result = validateSlotAffinity(invalidAffinity);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should warn if any slot affinity exceeds 0.95', () => {
    const highAffinity = { main: 0.98 };
    const result = validateSlotAffinity(highAffinity);
    expect(result.warnings.some(w => w.includes('0.95'))).toBe(true);
  });

  it('should warn if total affinity sum is very low', () => {
    const lowAffinity = { main: 0.1, sidebar: 0.05 };
    const result = validateSlotAffinity(lowAffinity);
    expect(result.warnings.some(w => w.includes('sum'))).toBe(true);
  });
});

describe('Constraints Validator', () => {
  it('should validate excludedSlots match zero affinity', () => {
    const slotAffinity = { main: 0.8, header: 0.0, footer: 0.0 };
    const constraints = { excludedSlots: ['header', 'footer'] };
    const result = validateConstraints(slotAffinity, constraints);
    expect(result.valid).toBe(true);
  });

  it('should reject excludedSlots with non-zero affinity', () => {
    const slotAffinity = { main: 0.8, header: 0.5 };
    const constraints = { excludedSlots: ['header'] };
    const result = validateConstraints(slotAffinity, constraints);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('excludedSlots'))).toBe(true);
  });

  it('should reject self-referential conflicts', () => {
    const constraints = { conflictsWith: ['Button'] };
    const componentName = 'Button';
    const result = validateConstraints({}, constraints, componentName);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('self'))).toBe(true);
  });

  it('should validate requires references exist in catalog', () => {
    const constraints = { requires: ['TableRow', 'TableCell'] };
    const catalog = ['Button', 'TableRow', 'TableCell'];
    const result = validateConstraints({}, constraints, 'DataTable', catalog);
    expect(result.valid).toBe(true);
  });

  it('should reject requires references for non-existent components', () => {
    const constraints = { requires: ['NonExistent'] };
    const catalog = ['Button', 'Input'];
    const result = validateConstraints({}, constraints, 'DataTable', catalog);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('NonExistent'))).toBe(true);
  });
});
