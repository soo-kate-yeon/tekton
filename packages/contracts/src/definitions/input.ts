import { type ComponentContract } from '../types.js';

/**
 * Input Component Contract
 *
 * Defines design constraints for accessible form input components.
 * Ensures proper labeling, validation, and keyboard interaction.
 */
export const InputContract: ComponentContract = {
  id: 'input',
  version: '1.0.0',
  description: 'Design contract for accessible form input components',
  constraints: [
    // Accessibility Constraints
    {
      id: 'INP-A01',
      rule: {
        type: 'accessibility',
        requirement: 'Input must have associated label via htmlFor or aria-label',
        wcagCriteria: ['1.3.1', '4.1.2'],
      },
      rationale: 'Screen reader users need to understand input purpose',
      severity: 'error',
    },
    {
      id: 'INP-A02',
      rule: {
        type: 'accessibility',
        requirement: 'Input must have aria-invalid="true" when validation fails',
        wcagCriteria: ['4.1.2'],
      },
      rationale: 'Screen readers must announce validation errors',
      severity: 'error',
    },
    {
      id: 'INP-A03',
      rule: {
        type: 'accessibility',
        requirement: 'Input must have aria-describedby linking to error message',
        wcagCriteria: ['3.3.1', '4.1.2'],
      },
      rationale: 'Error messages must be programmatically associated',
      severity: 'error',
    },

    // Prop Combination Constraints
    {
      id: 'INP-P01',
      rule: {
        type: 'prop-combination',
        requiredProps: ['required', 'aria-required'],
        condition: 'required is true',
      },
      rationale: 'Required inputs need both HTML and ARIA attributes',
      severity: 'error',
    },
    {
      id: 'INP-P02',
      rule: {
        type: 'prop-combination',
        requiredProps: ['disabled', 'aria-disabled'],
        condition: 'disabled is true',
      },
      rationale: 'Disabled state must be exposed to assistive technologies',
      severity: 'warning',
    },
    {
      id: 'INP-P03',
      rule: {
        type: 'prop-combination',
        forbiddenCombinations: [['readOnly', 'disabled']],
      },
      rationale: 'readOnly and disabled have different semantics and should not coexist',
      severity: 'warning',
    },

    // State Constraints
    {
      id: 'INP-S01',
      rule: {
        type: 'state',
        stateName: 'error',
        requiredProps: ['errorMessage'],
        requiredAttributes: ['aria-invalid', 'aria-describedby'],
      },
      rationale: 'Error state requires visible and accessible error message',
      severity: 'error',
    },
    {
      id: 'INP-S02',
      rule: {
        type: 'state',
        stateName: 'focus',
        allowedTransitions: ['blur', 'submit'],
      },
      rationale: 'Focus state must be managed properly for keyboard navigation',
      severity: 'warning',
    },

    // Context Constraints
    {
      id: 'INP-C01',
      rule: {
        type: 'context',
        allowedContexts: ['Form', 'FieldGroup'],
      },
      rationale: 'Inputs should be within form context for proper validation',
      severity: 'warning',
    },

    // Children Constraints
    {
      id: 'INP-CH01',
      rule: {
        type: 'children',
        forbidden: true,
      },
      rationale: 'Input elements are void elements and cannot contain children',
      severity: 'error',
    },

    // Composition Constraints
    {
      id: 'INP-CO01',
      rule: {
        type: 'composition',
        optionalComponents: ['InputLabel', 'Label'],
        relationships: [
          {
            component: 'InputLabel',
            relationship: 'associated-with',
            cardinality: '0..1',
          },
        ],
      },
      rationale: 'Input should have associated label component',
      severity: 'warning',
    },
    {
      id: 'INP-CO02',
      rule: {
        type: 'composition',
        optionalComponents: ['InputError', 'ErrorMessage'],
        relationships: [
          {
            component: 'InputError',
            relationship: 'described-by',
            cardinality: '0..1',
          },
        ],
      },
      rationale: 'Input should have associated error message component when in error state',
      severity: 'warning',
    },
  ],
};
