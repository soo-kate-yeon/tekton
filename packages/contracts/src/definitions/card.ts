import { type ComponentContract } from '../types';

/**
 * Card Component Contract
 *
 * Defines design constraints for semantic card components.
 * Ensures proper structure, composition, and interactive states.
 */
export const CardContract: ComponentContract = {
  id: 'card',
  version: '1.0.0',
  description: 'Design contract for semantic card components',
  constraints: [
    // Accessibility Constraints
    {
      id: 'CRD-A01',
      rule: {
        type: 'accessibility',
        requirement: 'Card should use semantic HTML (article or section) when appropriate',
        wcagCriteria: ['1.3.1'],
      },
      rationale: 'Semantic elements provide structure for assistive technologies',
      severity: 'warning',
    },
    {
      id: 'CRD-A02',
      rule: {
        type: 'accessibility',
        requirement: 'Card should have accessible heading for screen reader navigation',
        wcagCriteria: ['2.4.6'],
      },
      rationale: 'Headings allow screen reader users to navigate card content',
      severity: 'warning',
    },

    // Composition Constraints
    {
      id: 'CRD-CO01',
      rule: {
        type: 'composition',
        optionalComponents: ['CardHeader', 'CardTitle'],
        relationships: [
          {
            component: 'CardHeader',
            relationship: 'contains',
            cardinality: '0..1',
          },
        ],
      },
      rationale: 'Card header provides consistent structure',
      severity: 'info',
    },
    {
      id: 'CRD-CO02',
      rule: {
        type: 'composition',
        optionalComponents: ['CardContent', 'CardBody'],
        relationships: [
          {
            component: 'CardContent',
            relationship: 'contains',
            cardinality: '0..1',
          },
        ],
      },
      rationale: 'Card content provides main body structure',
      severity: 'info',
    },
    {
      id: 'CRD-CO03',
      rule: {
        type: 'composition',
        optionalComponents: ['CardFooter', 'CardActions'],
        relationships: [
          {
            component: 'CardFooter',
            relationship: 'contains',
            cardinality: '0..1',
          },
        ],
      },
      rationale: 'Card footer provides action area structure',
      severity: 'info',
    },

    // State Constraints
    {
      id: 'CRD-S01',
      rule: {
        type: 'state',
        stateName: 'interactive',
        requiredProps: ['onClick', 'onKeyDown'],
        requiredAttributes: ['role', 'tabIndex'],
      },
      rationale: 'Interactive cards must be keyboard accessible',
      severity: 'error',
    },

    // Children Constraints
    {
      id: 'CRD-CH01',
      rule: {
        type: 'children',
        allowedComponents: ['CardHeader', 'CardContent', 'CardFooter', 'CardTitle', 'CardDescription'],
      },
      rationale: 'Card should use structured child components',
      severity: 'info',
    },

    // Prop Combination Constraints
    {
      id: 'CRD-P01',
      rule: {
        type: 'prop-combination',
        requiredProps: ['role', 'tabIndex'],
        condition: 'onClick is defined',
      },
      rationale: 'Clickable cards must have appropriate role and keyboard accessibility',
      severity: 'error',
    },
  ],
};
