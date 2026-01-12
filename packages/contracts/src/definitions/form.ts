import { type ComponentContract } from '../types';

/**
 * Form Component Contract
 *
 * Defines design constraints for accessible form components.
 * Ensures proper field grouping, validation, and state management.
 */
export const FormContract: ComponentContract = {
  id: 'form',
  version: '1.0.0',
  description: 'Design contract for accessible form components',
  constraints: [
    // Accessibility Constraints
    {
      id: 'FRM-A01',
      rule: {
        type: 'accessibility',
        requirement: 'Related form fields must be grouped with fieldset and legend',
        wcagCriteria: ['1.3.1', '3.3.2'],
      },
      rationale: 'Grouped fields provide context for screen reader users',
      severity: 'warning',
    },
    {
      id: 'FRM-A02',
      rule: {
        type: 'accessibility',
        requirement: 'Required fields must have aria-required="true" attribute',
        wcagCriteria: ['3.3.2', '4.1.2'],
      },
      description: 'Required form fields should have aria-required attribute',
      message: 'When a field has required={true}, it should also include aria-required="true" for screen reader accessibility',
      rationale: 'Screen readers must announce required field status',
      severity: 'warning',
      autoFixable: true,
      fixSuggestion: 'Add aria-required="true" to required form fields',
    },
    {
      id: 'FRM-A03',
      rule: {
        type: 'accessibility',
        requirement: 'Validation messages must be in aria-live region',
        wcagCriteria: ['3.3.1', '4.1.3'],
      },
      rationale: 'Validation feedback must be announced to screen readers',
      severity: 'error',
    },

    // State Constraints
    {
      id: 'FRM-S01',
      rule: {
        type: 'state',
        stateName: 'submitting',
        requiredProps: ['isSubmitting'],
        requiredAttributes: ['aria-busy'],
      },
      rationale: 'Submitting state must be communicated to assistive technologies',
      severity: 'error',
    },
    {
      id: 'FRM-S02',
      rule: {
        type: 'state',
        stateName: 'error',
        requiredProps: ['errors', 'errorMessage'],
        allowedTransitions: ['idle', 'submitting'],
      },
      rationale: 'Error state requires visible and accessible error messages',
      severity: 'error',
    },
    {
      id: 'FRM-S03',
      rule: {
        type: 'state',
        stateName: 'success',
        requiredProps: ['successMessage'],
        allowedTransitions: ['idle'],
      },
      rationale: 'Success feedback must be provided to all users',
      severity: 'warning',
    },

    // Composition Constraints
    {
      id: 'FRM-CO01',
      rule: {
        type: 'composition',
        allowedComponents: ['FormField', 'Input', 'Select', 'Checkbox', 'Textarea'],
        relationships: [
          {
            component: 'FormField',
            relationship: 'contains',
            cardinality: '1..*',
          },
        ],
      },
      rationale: 'Form should contain form field components',
      severity: 'warning',
    },
    {
      id: 'FRM-CO02',
      rule: {
        type: 'composition',
        allowedComponents: ['FormButton', 'Button'],
        relationships: [
          {
            component: 'FormButton',
            relationship: 'contains',
            cardinality: '0..*',
          },
        ],
      },
      rationale: 'Form should have submit and action buttons',
      severity: 'info',
    },
    {
      id: 'FRM-CO03',
      rule: {
        type: 'composition',
        optionalComponents: ['FormError', 'FormSuccess', 'FormMessage'],
        relationships: [
          {
            component: 'FormError',
            relationship: 'displays',
            cardinality: '0..1',
          },
        ],
      },
      rationale: 'Form should display validation feedback',
      severity: 'warning',
    },

    // Children Constraints
    {
      id: 'FRM-CH01',
      rule: {
        type: 'children',
        minChildren: 1,
        allowedComponents: ['FormField', 'Input', 'Button'],
      },
      rationale: 'Form must contain at least one form field or input',
      severity: 'error',
    },

    // Context Constraints
    {
      id: 'FRM-C01',
      rule: {
        type: 'context',
        providedContexts: ['FormContext', 'FormState'],
      },
      rationale: 'Form should provide context for nested form components',
      severity: 'warning',
    },

    // Prop Combination Constraints
    {
      id: 'FRM-P01',
      rule: {
        type: 'prop-combination',
        requiredProps: ['onSubmit'],
      },
      rationale: 'Form must handle submit event',
      severity: 'error',
    },
  ],
};
