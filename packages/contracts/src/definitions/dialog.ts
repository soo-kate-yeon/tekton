import { type ComponentContract } from '../types.js';

/**
 * Dialog Component Contract
 *
 * Defines design constraints for accessible modal dialog components.
 * Ensures proper ARIA roles, focus management, and composition.
 */
export const DialogContract: ComponentContract = {
  id: 'dialog',
  version: '1.0.0',
  description: 'Design contract for accessible modal dialog components',
  constraints: [
    // Accessibility Constraints
    {
      id: 'DLG-A01',
      rule: {
        type: 'accessibility',
        requirement: 'Dialog must have role="dialog" or role="alertdialog"',
        wcagCriteria: ['4.1.2'],
      },
      rationale: 'Screen readers need to identify dialog as a modal interaction',
      severity: 'error',
    },
    {
      id: 'DLG-A02',
      rule: {
        type: 'accessibility',
        requirement: 'Dialog must have aria-labelledby or aria-label',
        wcagCriteria: ['4.1.2'],
      },
      rationale: 'Dialog purpose must be programmatically determinable',
      severity: 'error',
    },
    {
      id: 'DLG-A03',
      rule: {
        type: 'accessibility',
        requirement: 'Dialog must implement focus trap to prevent focus escape',
        wcagCriteria: ['2.1.2', '2.4.3'],
      },
      rationale: 'Keyboard users must not accidentally leave dialog context',
      severity: 'error',
    },

    // Composition Constraints
    {
      id: 'DLG-S03',
      rule: {
        type: 'composition',
        requiredComponents: ['DialogTitle'],
        relationships: [
          {
            component: 'DialogTitle',
            relationship: 'labels',
            cardinality: '1',
          },
        ],
      },
      description: 'Dialog requires DialogTitle component for WCAG compliance',
      message: 'Dialogs must include a DialogTitle for screen reader accessibility and WCAG 2.4.2 compliance',
      rationale: 'Dialog must have a title component for accessibility',
      severity: 'error',
    },
    {
      id: 'DLG-CO01',
      rule: {
        type: 'composition',
        optionalComponents: ['DialogDescription', 'DialogHeader'],
        relationships: [
          {
            component: 'DialogDescription',
            relationship: 'describes',
            cardinality: '0..1',
          },
        ],
      },
      rationale: 'Dialog should provide description for better accessibility',
      severity: 'warning',
    },
    {
      id: 'DLG-CO02',
      rule: {
        type: 'composition',
        optionalComponents: ['DialogFooter', 'DialogActions'],
        relationships: [
          {
            component: 'DialogFooter',
            relationship: 'contains',
            cardinality: '0..1',
          },
        ],
      },
      rationale: 'Dialog actions should be grouped in footer for consistency',
      severity: 'info',
    },

    // State Constraints
    {
      id: 'DLG-S01',
      rule: {
        type: 'state',
        stateName: 'open',
        requiredProps: ['isOpen', 'onClose'],
        allowedTransitions: ['closed'],
      },
      rationale: 'Dialog open state must be controllable and closeable',
      severity: 'error',
    },
    {
      id: 'DLG-S02',
      rule: {
        type: 'state',
        stateName: 'closed',
        requiredProps: ['previousFocusElement'],
        allowedTransitions: ['open'],
      },
      rationale: 'Dialog must restore focus to trigger element on close',
      severity: 'error',
    },

    // Context Constraints
    {
      id: 'DLG-C01',
      rule: {
        type: 'context',
        requiredContexts: ['Portal', 'Body'],
      },
      rationale: 'Dialog must render in portal to avoid z-index and clipping issues',
      severity: 'warning',
    },

    // Children Constraints
    {
      id: 'DLG-CH01',
      rule: {
        type: 'children',
        allowedComponents: [
          'DialogTitle',
          'DialogDescription',
          'DialogHeader',
          'DialogContent',
          'DialogFooter',
        ],
      },
      rationale: 'Dialog should contain structured components for consistent layout',
      severity: 'warning',
    },
  ],
};
