import { type ComponentContract } from '../types.js';

/**
 * Select Component Contract
 *
 * Defines design constraints for accessible select/dropdown components.
 * Ensures proper keyboard navigation, ARIA attributes, and composition.
 */
export const SelectContract: ComponentContract = {
  id: 'select',
  version: '1.0.0',
  description: 'Design contract for accessible select and dropdown components',
  constraints: [
    // Accessibility Constraints
    {
      id: 'SEL-A01',
      rule: {
        type: 'accessibility',
        requirement: 'Select must have associated label via htmlFor or aria-label',
        wcagCriteria: ['1.3.1', '4.1.2'],
      },
      rationale: 'Screen reader users need to understand select purpose',
      severity: 'error',
    },
    {
      id: 'SEL-A02',
      rule: {
        type: 'accessibility',
        requirement: 'Select must have aria-expanded to indicate open/closed state',
        wcagCriteria: ['4.1.2'],
      },
      rationale: 'Screen readers must announce dropdown state changes',
      severity: 'error',
    },
    {
      id: 'SEL-A03',
      rule: {
        type: 'accessibility',
        requirement: 'Select must support keyboard navigation (Arrow keys, Enter, Escape, Home, End)',
        wcagCriteria: ['2.1.1', '2.1.2'],
      },
      rationale: 'Keyboard users must be able to navigate and select options',
      severity: 'error',
    },
    {
      id: 'SEL-A04',
      rule: {
        type: 'accessibility',
        requirement: 'Select must use aria-activedescendant for focus management',
        wcagCriteria: ['4.1.2'],
      },
      rationale: 'Screen readers need to track focused option within listbox',
      severity: 'error',
    },

    // State Constraints
    {
      id: 'SEL-S01',
      rule: {
        type: 'state',
        stateName: 'open',
        requiredProps: ['isOpen'],
        requiredAttributes: ['aria-expanded'],
      },
      rationale: 'Open state must be synchronized with ARIA attributes',
      severity: 'error',
    },
    {
      id: 'SEL-S02',
      rule: {
        type: 'state',
        stateName: 'disabled',
        requiredProps: ['disabled'],
        requiredAttributes: ['aria-disabled'],
      },
      rationale: 'Disabled state must be exposed to assistive technologies',
      severity: 'error',
    },

    // Composition Constraints
    {
      id: 'SEL-CO01',
      rule: {
        type: 'composition',
        requiredComponents: ['SelectTrigger', 'SelectButton'],
        relationships: [
          {
            component: 'SelectTrigger',
            relationship: 'triggers',
            cardinality: '1',
          },
        ],
      },
      rationale: 'Select must have trigger button for opening dropdown',
      severity: 'error',
    },
    {
      id: 'SEL-CO02',
      rule: {
        type: 'composition',
        requiredComponents: ['SelectContent', 'SelectOptions'],
        relationships: [
          {
            component: 'SelectContent',
            relationship: 'contains',
            cardinality: '1',
          },
        ],
      },
      rationale: 'Select must have content area containing options',
      severity: 'error',
    },

    // Children Constraints
    {
      id: 'SEL-CH01',
      rule: {
        type: 'children',
        minChildren: 1,
        allowedComponents: ['SelectOption', 'SelectItem'],
      },
      rationale: 'Select must contain at least one selectable option',
      severity: 'error',
    },

    // Prop Combination Constraints
    {
      id: 'SEL-P01',
      rule: {
        type: 'prop-combination',
        requiredProps: ['value', 'onValueChange'],
        condition: 'multiple is true',
      },
      rationale: 'Multiple selection requires array value and change handler',
      severity: 'error',
    },
  ],
};
