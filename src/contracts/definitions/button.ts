import type { ComponentContract } from '../types';

/**
 * Button Component Contract
 *
 * Defines validation rules and best practices for the shadcn/ui Button component.
 * The Button component is a fundamental interactive element used for user actions.
 *
 * @module contracts/definitions/button
 */

/**
 * Button component contract with 15 constraints covering:
 * - Accessibility (BTN-A01 to BTN-A05)
 * - Prop combinations (BTN-P01 to BTN-P05)
 * - Structure and usage (BTN-S01 to BTN-S05)
 */
export const ButtonContract: ComponentContract = {
  id: 'button',
  version: '1.0.0',
  description: 'Design contract for accessible button components',

  constraints: [
    // ========================================================================
    // Accessibility Constraints (BTN-A*)
    // ========================================================================

    {
      id: 'BTN-A01',
      severity: 'error',
      description: 'Icon-only buttons must have aria-label for screen readers',
      rule: {
        type: 'accessibility',
        requiredProps: ['aria-label'],
        wcagLevel: 'A',
        wcagCriteria: ['4.1.2'],
      },
      message:
        'Icon-only buttons require aria-label to provide accessible text for screen readers',
      autoFixable: true,
      fixSuggestion: 'Add aria-label="descriptive action text" to the Button component',
    },

    {
      id: 'BTN-A02',
      severity: 'warning',
      description: 'Disabled buttons should have aria-disabled attribute',
      rule: {
        type: 'accessibility',
        requiredAriaStates: ['aria-disabled'],
        wcagLevel: 'AA',
        wcagCriteria: ['4.1.2'],
      },
      message: 'When disabled=true, consider adding aria-disabled="true" for better accessibility',
      autoFixable: true,
      fixSuggestion: 'Add aria-disabled="true" when disabled prop is true',
    },

    {
      id: 'BTN-A03',
      severity: 'error',
      description: 'Loading state must be announced to screen readers',
      rule: {
        type: 'accessibility',
        requiredAriaStates: ['aria-busy', 'aria-live'],
        wcagLevel: 'AA',
        wcagCriteria: ['4.1.3'],
      },
      message:
        'Buttons in loading state must have aria-busy="true" and aria-live region for status updates',
      autoFixable: true,
      fixSuggestion: 'Add aria-busy="true" and wrap status text in aria-live="polite" region',
    },

    {
      id: 'BTN-A04',
      severity: 'warning',
      description: 'Button should have sufficient color contrast',
      rule: {
        type: 'accessibility',
        colorContrast: {
          minimumRatio: 4.5,
          largeText: false,
        },
        wcagLevel: 'AA',
        wcagCriteria: ['1.4.3'],
      },
      message: 'Button text and background must have minimum 4.5:1 contrast ratio',
      autoFixable: false,
    },

    {
      id: 'BTN-A05',
      severity: 'info',
      description: 'Button should be keyboard accessible',
      rule: {
        type: 'accessibility',
        keyboardNavigation: true,
        wcagLevel: 'A',
        wcagCriteria: ['2.1.1'],
      },
      message: 'Ensure button can be activated with Enter and Space keys',
      autoFixable: false,
    },

    // ========================================================================
    // Prop Combination Constraints (BTN-P*)
    // ========================================================================

    {
      id: 'BTN-P01',
      severity: 'error',
      description: 'Button cannot be disabled and loading simultaneously',
      rule: {
        type: 'prop-combination',
        forbidden: [
          {
            props: ['disabled', 'loading'],
            reason: 'Disabled and loading states are mutually exclusive',
          },
        ],
      },
      message: 'Cannot use disabled=true and loading=true together. Choose one state.',
      autoFixable: false,
    },

    {
      id: 'BTN-P02',
      severity: 'error',
      description: 'asChild and href props are mutually exclusive',
      rule: {
        type: 'prop-combination',
        mutuallyExclusive: [
          {
            props: ['asChild', 'href'],
            reason: 'Use Link component for href, Button with asChild for custom elements',
          },
        ],
      },
      message: 'Use either asChild or href, not both. For links, use the Link component.',
      autoFixable: false,
    },

    {
      id: 'BTN-P03',
      severity: 'warning',
      description: 'asChild requires exactly one child element',
      rule: {
        type: 'prop-combination',
        conditional: [
          {
            if: 'asChild',
            then: ['children'],
            reason: 'asChild pattern requires a single child element to clone props onto',
          },
        ],
      },
      message: 'When asChild=true, provide exactly one child component',
      autoFixable: false,
    },

    {
      id: 'BTN-P04',
      severity: 'info',
      description: 'Destructive variant should be used carefully',
      rule: {
        type: 'prop-combination',
        conditional: [
          {
            if: 'variant',
            then: ['onClick', 'type'],
            reason: 'Destructive actions should have confirmation',
          },
        ],
      },
      message:
        'Destructive variants should have confirmation dialogs or clear visual feedback',
      autoFixable: false,
    },

    {
      id: 'BTN-P05',
      severity: 'warning',
      description: 'Form buttons should have explicit type',
      rule: {
        type: 'prop-combination',
        required: [
          {
            props: ['type'],
            reason: 'Forms need explicit button type to prevent accidental submissions',
          },
        ],
      },
      message: 'Specify type="button", type="submit", or type="reset" for form buttons',
      autoFixable: true,
      fixSuggestion: 'Add type="button" (default) or type="submit" for form submissions',
    },

    // ========================================================================
    // Structure Constraints (BTN-S*)
    // ========================================================================

    {
      id: 'BTN-S01',
      severity: 'error',
      description: 'Variant prop must be one of valid values',
      rule: {
        type: 'state',
        validStates: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      },
      message:
        'variant must be: default, destructive, outline, secondary, ghost, or link',
      autoFixable: false,
    },

    {
      id: 'BTN-S02',
      severity: 'error',
      description: 'Size prop must be one of valid values',
      rule: {
        type: 'state',
        validStates: ['default', 'sm', 'lg', 'icon'],
      },
      message: 'size must be: default, sm, lg, or icon',
      autoFixable: false,
    },

    {
      id: 'BTN-S03',
      severity: 'warning',
      description: 'Button should have visible text or icon',
      rule: {
        type: 'children',
        minCount: 1,
      },
      message: 'Button should have text content or icon children for visual feedback',
      autoFixable: false,
    },

    {
      id: 'BTN-S04',
      severity: 'info',
      description: 'Icon buttons should use size="icon" variant',
      rule: {
        type: 'prop-combination',
        conditional: [
          {
            if: 'children',
            then: ['size'],
            reason: 'Icon-only buttons need proper sizing',
          },
        ],
      },
      message: 'For icon-only buttons, use size="icon" for proper dimensions',
      autoFixable: true,
      fixSuggestion: 'Add size="icon" to icon-only buttons',
    },

    {
      id: 'BTN-S05',
      severity: 'info',
      description: 'Link variant buttons should use href or asChild',
      rule: {
        type: 'prop-combination',
        conditional: [
          {
            if: 'variant',
            then: ['href', 'asChild'],
            reason: 'Link-styled buttons should behave as links',
          },
        ],
      },
      message: 'When variant="link", consider using href or asChild with a Link component',
      autoFixable: false,
    },
  ],

  bestPractices: [
    'Use semantic <button> element for actions, <a> for navigation',
    'Provide clear, action-oriented button text (e.g., "Save Changes" not "Click Here")',
    'Ensure button labels describe the action that will occur',
    'Use appropriate variant for the action: destructive for delete, ghost for tertiary actions',
    'Place primary action buttons on the right in forms (e.g., Cancel | Submit)',
    'Disable buttons during async operations and show loading state',
    'Keep button text concise (1-3 words when possible)',
    'Use icon + text for important actions, icon-only for common actions with aria-label',
  ],
};
