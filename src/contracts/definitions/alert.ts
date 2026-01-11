import { type ComponentContract } from '../types';

/**
 * Alert Component Contract
 *
 * Defines design constraints for accessible alert/notification components.
 * Ensures proper ARIA roles, variants, and dismissibility.
 */
export const AlertContract: ComponentContract = {
  id: 'alert',
  version: '1.0.0',
  description: 'Design contract for accessible alert and notification components',
  constraints: [
    // Accessibility Constraints
    {
      id: 'ALT-A01',
      rule: {
        type: 'accessibility',
        requirement: 'Alert must have role="alert" for important messages or role="status" for advisory messages',
        wcagCriteria: ['4.1.3'],
      },
      rationale: 'Screen readers need to announce alert messages appropriately based on urgency',
      severity: 'error',
    },
    {
      id: 'ALT-A02',
      rule: {
        type: 'accessibility',
        requirement: 'Dynamic alerts must have aria-live="polite" or aria-live="assertive"',
        wcagCriteria: ['4.1.3'],
      },
      rationale: 'Dynamic content changes must be announced to screen readers',
      severity: 'error',
    },

    // Prop Combination Constraints
    {
      id: 'ALT-P01',
      rule: {
        type: 'prop-combination',
        requiredProps: ['variant'],
        allowedValues: {
          variant: ['info', 'success', 'warning', 'error', 'default'],
        },
      },
      rationale: 'Alert variant must be one of the standard types for consistent styling',
      severity: 'warning',
    },
    {
      id: 'ALT-P02',
      rule: {
        type: 'prop-combination',
        requiredProps: ['onDismiss', 'aria-label'],
        condition: 'dismissible is true',
      },
      rationale: 'Dismissible alerts must have close handler and accessible label',
      severity: 'error',
    },

    // Composition Constraints
    {
      id: 'ALT-CO01',
      rule: {
        type: 'composition',
        optionalComponents: ['AlertTitle', 'AlertHeading'],
        relationships: [
          {
            component: 'AlertTitle',
            relationship: 'contains',
            cardinality: '0..1',
          },
        ],
      },
      rationale: 'Alert title provides quick context for alert content',
      severity: 'info',
    },
    {
      id: 'ALT-CO02',
      rule: {
        type: 'composition',
        optionalComponents: ['AlertDescription', 'AlertMessage'],
        relationships: [
          {
            component: 'AlertDescription',
            relationship: 'contains',
            cardinality: '0..1',
          },
        ],
      },
      rationale: 'Alert description provides detailed information',
      severity: 'info',
    },

    // State Constraints
    {
      id: 'ALT-S01',
      rule: {
        type: 'state',
        stateName: 'dismissed',
        requiredProps: ['isDismissed'],
        allowedTransitions: ['visible'],
      },
      rationale: 'Dismissed state must be tracked for proper UI updates',
      severity: 'warning',
    },
  ],
};
