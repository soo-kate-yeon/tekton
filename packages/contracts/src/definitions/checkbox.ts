import { type ComponentContract } from '../types.js';

/**
 * Checkbox Component Contract
 *
 * Defines design constraints for accessible checkbox components.
 * Ensures proper labeling, state management, and ARIA attributes.
 */
export const CheckboxContract: ComponentContract = {
  id: 'checkbox',
  version: '1.0.0',
  description: 'Design contract for accessible checkbox components',
  constraints: [
    // Accessibility Constraints
    {
      id: 'CHK-A01',
      rule: {
        type: 'accessibility',
        requirement: 'Checkbox must have associated label via htmlFor or aria-label',
        wcagCriteria: ['1.3.1', '4.1.2'],
      },
      rationale: 'Screen reader users need to understand checkbox purpose',
      severity: 'error',
    },
    {
      id: 'CHK-A02',
      rule: {
        type: 'accessibility',
        requirement: 'Checkbox must have aria-checked attribute reflecting current state',
        wcagCriteria: ['4.1.2'],
      },
      rationale: 'Screen readers must announce checkbox state (checked/unchecked/mixed)',
      severity: 'error',
    },
    {
      id: 'CHK-A03',
      rule: {
        type: 'accessibility',
        requirement: 'Indeterminate checkbox must have aria-checked="mixed"',
        wcagCriteria: ['4.1.2'],
      },
      rationale: 'Indeterminate state must be programmatically determinable',
      severity: 'error',
    },

    // State Constraints
    {
      id: 'CHK-S01',
      rule: {
        type: 'state',
        stateName: 'checked',
        requiredProps: ['checked', 'onCheckedChange'],
        requiredAttributes: ['aria-checked'],
      },
      rationale: 'Checked state must be controllable and synchronized',
      severity: 'error',
    },
    {
      id: 'CHK-S02',
      rule: {
        type: 'state',
        stateName: 'indeterminate',
        requiredProps: ['indeterminate'],
        requiredAttributes: ['aria-checked'],
      },
      rationale: 'Indeterminate state must be explicitly managed',
      severity: 'warning',
    },

    // Prop Combination Constraints
    {
      id: 'CHK-P01',
      rule: {
        type: 'prop-combination',
        requiredProps: ['required', 'aria-required'],
        condition: 'required is true',
      },
      rationale: 'Required checkboxes need both HTML and ARIA attributes',
      severity: 'error',
    },
    {
      id: 'CHK-P02',
      rule: {
        type: 'prop-combination',
        requiredProps: ['disabled', 'aria-disabled'],
        condition: 'disabled is true',
      },
      rationale: 'Disabled state must be exposed to assistive technologies',
      severity: 'warning',
    },

    // Children Constraints
    {
      id: 'CHK-CH01',
      rule: {
        type: 'children',
        forbidden: true,
      },
      rationale: 'Checkbox input elements are void elements and cannot contain children',
      severity: 'error',
    },
  ],
};
