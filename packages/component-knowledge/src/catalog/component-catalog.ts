/**
 * Component Catalog
 * TAG: SPEC-LAYER2-001
 *
 * Complete catalog of 20 core components with ComponentKnowledge metadata
 */

import type { ComponentKnowledge } from '../types/knowledge.types';

/**
 * Component Catalog - All 20 core components
 * Each component includes complete ComponentKnowledge metadata
 */
export const COMPONENT_CATALOG: ComponentKnowledge[] = [
  // 1. Button - Primary action atom
  {
    name: 'Button',
    type: 'atom',
    category: 'action',
    slotAffinity: {
      main: 0.6,
      sidebar: 0.8,
      header: 0.7,
      footer: 0.9,
      card_actions: 0.95,
    },
    semanticDescription: {
      purpose: 'Primary interactive element for user actions like submit, confirm, or navigate.',
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
        default: {
          backgroundColor: 'color-primary',
          color: 'color-text-on-primary',
          borderRadius: 'radius-md',
          padding: 'spacing-2',
          fontSize: 'font-size-base',
        },
        hover: {
          backgroundColor: 'color-primary-hover',
          boxShadow: 'shadow-sm',
        },
        focus: {
          borderColor: 'color-focus-ring',
          boxShadow: 'shadow-focus',
        },
        active: {
          backgroundColor: 'color-primary-active',
          transform: 'scale-95',
        },
        disabled: {
          backgroundColor: 'color-disabled',
          color: 'color-text-disabled',
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 2. Input - Text input atom
  {
    name: 'Input',
    type: 'atom',
    category: 'input',
    slotAffinity: {
      main: 0.9,
      sidebar: 0.7,
      header: 0.3,
      footer: 0.2,
    },
    semanticDescription: {
      purpose: 'Single-line text input field for capturing user data like names, emails, or search queries.',
      visualImpact: 'neutral',
      complexity: 'low',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-surface',
          color: 'color-text',
          borderColor: 'color-border',
          borderWidth: 'border-width-1',
          borderRadius: 'radius-md',
          padding: 'spacing-2',
        },
        hover: {
          borderColor: 'color-border-hover',
        },
        focus: {
          borderColor: 'color-focus-ring',
          boxShadow: 'shadow-focus',
        },
        active: {
          borderColor: 'color-primary',
        },
        disabled: {
          backgroundColor: 'color-disabled',
          color: 'color-text-disabled',
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 3. Card - Container molecule
  {
    name: 'Card',
    type: 'molecule',
    category: 'container',
    slotAffinity: {
      main: 0.95,
      sidebar: 0.8,
      header: 0.1,
      footer: 0.2,
    },
    semanticDescription: {
      purpose: 'Content container with optional header, body, and footer sections for organizing related information.',
      visualImpact: 'neutral',
      complexity: 'medium',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-surface',
          borderColor: 'color-border',
          borderWidth: 'border-width-1',
          borderRadius: 'radius-lg',
          padding: 'spacing-4',
          boxShadow: 'shadow-sm',
        },
        hover: {
          boxShadow: 'shadow-md',
        },
        focus: {
          borderColor: 'color-focus-ring',
        },
        active: {},
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 4. Modal - Overlay organism
  {
    name: 'Modal',
    type: 'organism',
    category: 'container',
    slotAffinity: {
      main: 0.0,
      sidebar: 0.0,
      header: 0.0,
      footer: 0.0,
      overlay: 1.0,
    },
    semanticDescription: {
      purpose: 'Overlay dialog for focused user interactions requiring immediate attention or critical actions.',
      visualImpact: 'prominent',
      complexity: 'high',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: ['main', 'sidebar', 'header', 'footer'],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-surface',
          borderRadius: 'radius-lg',
          boxShadow: 'shadow-xl',
          padding: 'spacing-6',
        },
        hover: {},
        focus: {
          borderColor: 'color-focus-ring',
        },
        active: {},
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 5. Dropdown - Selection molecule
  {
    name: 'Dropdown',
    type: 'molecule',
    category: 'input',
    slotAffinity: {
      main: 0.7,
      sidebar: 0.6,
      header: 0.8,
      footer: 0.3,
    },
    semanticDescription: {
      purpose: 'Menu component for selecting one option from a list with trigger button and floating panel.',
      visualImpact: 'neutral',
      complexity: 'medium',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-surface',
          borderColor: 'color-border',
          borderRadius: 'radius-md',
          boxShadow: 'shadow-md',
        },
        hover: {
          backgroundColor: 'color-surface-hover',
        },
        focus: {
          borderColor: 'color-focus-ring',
        },
        active: {
          backgroundColor: 'color-surface-active',
        },
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 6. Checkbox - Input atom
  {
    name: 'Checkbox',
    type: 'atom',
    category: 'input',
    slotAffinity: {
      main: 0.8,
      sidebar: 0.7,
      header: 0.2,
      footer: 0.1,
    },
    semanticDescription: {
      purpose: 'Boolean input control for toggling options on or off in forms and settings.',
      visualImpact: 'subtle',
      complexity: 'low',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-surface',
          borderColor: 'color-border',
          borderWidth: 'border-width-2',
          borderRadius: 'radius-sm',
        },
        hover: {
          borderColor: 'color-border-hover',
          backgroundColor: 'color-surface-hover',
        },
        focus: {
          borderColor: 'color-focus-ring',
          boxShadow: 'shadow-focus',
        },
        active: {
          backgroundColor: 'color-primary',
          borderColor: 'color-primary',
        },
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 7. Radio - Input atom
  {
    name: 'Radio',
    type: 'atom',
    category: 'input',
    slotAffinity: {
      main: 0.8,
      sidebar: 0.7,
      header: 0.2,
      footer: 0.1,
    },
    semanticDescription: {
      purpose: 'Mutually exclusive selection control for choosing one option from a group.',
      visualImpact: 'subtle',
      complexity: 'low',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-surface',
          borderColor: 'color-border',
          borderWidth: 'border-width-2',
          borderRadius: 'radius-full',
        },
        hover: {
          borderColor: 'color-border-hover',
        },
        focus: {
          borderColor: 'color-focus-ring',
          boxShadow: 'shadow-focus',
        },
        active: {
          backgroundColor: 'color-primary',
          borderColor: 'color-primary',
        },
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 8. Switch - Toggle atom
  {
    name: 'Switch',
    type: 'atom',
    category: 'input',
    slotAffinity: {
      main: 0.6,
      sidebar: 0.9,
      header: 0.5,
      footer: 0.3,
    },
    semanticDescription: {
      purpose: 'Toggle control for binary on/off states with animated visual feedback.',
      visualImpact: 'neutral',
      complexity: 'low',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-surface',
          borderRadius: 'radius-full',
          padding: 'spacing-1',
        },
        hover: {
          backgroundColor: 'color-surface-hover',
        },
        focus: {
          boxShadow: 'shadow-focus',
        },
        active: {
          backgroundColor: 'color-primary',
        },
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 9. Slider - Range input atom
  {
    name: 'Slider',
    type: 'atom',
    category: 'input',
    slotAffinity: {
      main: 0.9,
      sidebar: 0.5,
      header: 0.1,
      footer: 0.1,
    },
    semanticDescription: {
      purpose: 'Range selector for choosing numeric values along a continuous or discrete scale.',
      visualImpact: 'neutral',
      complexity: 'medium',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-surface',
          borderRadius: 'radius-full',
          height: 'spacing-1',
        },
        hover: {
          backgroundColor: 'color-surface-hover',
        },
        focus: {
          boxShadow: 'shadow-focus',
        },
        active: {
          backgroundColor: 'color-primary',
        },
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 10. Badge - Display atom
  {
    name: 'Badge',
    type: 'atom',
    category: 'display',
    slotAffinity: {
      main: 0.5,
      sidebar: 0.6,
      header: 0.9,
      footer: 0.4,
      card: 0.8,
    },
    semanticDescription: {
      purpose: 'Small label or count indicator for highlighting status, notifications, or metadata.',
      visualImpact: 'subtle',
      complexity: 'low',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-primary',
          color: 'color-text-on-primary',
          borderRadius: 'radius-full',
          padding: 'spacing-1',
          fontSize: 'font-size-sm',
        },
        hover: {
          backgroundColor: 'color-primary-hover',
        },
        focus: {},
        active: {},
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 11. Alert - Display molecule
  {
    name: 'Alert',
    type: 'molecule',
    category: 'display',
    slotAffinity: {
      main: 0.95,
      sidebar: 0.4,
      header: 0.6,
      footer: 0.3,
    },
    semanticDescription: {
      purpose: 'Contextual message box for displaying important information, warnings, or errors to users.',
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
        default: {
          backgroundColor: 'color-surface',
          borderColor: 'color-border',
          borderWidth: 'border-width-1',
          borderRadius: 'radius-md',
          padding: 'spacing-4',
        },
        hover: {},
        focus: {},
        active: {},
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 12. Toast - Notification molecule
  {
    name: 'Toast',
    type: 'molecule',
    category: 'display',
    slotAffinity: {
      main: 0.0,
      sidebar: 0.0,
      header: 0.0,
      footer: 0.0,
      overlay: 0.9,
    },
    semanticDescription: {
      purpose: 'Temporary notification that appears briefly to confirm actions or display status messages.',
      visualImpact: 'prominent',
      complexity: 'medium',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: ['main', 'sidebar', 'header', 'footer'],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-surface',
          borderRadius: 'radius-md',
          boxShadow: 'shadow-lg',
          padding: 'spacing-4',
        },
        hover: {},
        focus: {},
        active: {},
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 13. Tooltip - Display atom
  {
    name: 'Tooltip',
    type: 'atom',
    category: 'display',
    slotAffinity: {
      main: 0.5,
      sidebar: 0.5,
      header: 0.5,
      footer: 0.5,
    },
    semanticDescription: {
      purpose: 'Small popup with helpful text that appears on hover to provide additional context.',
      visualImpact: 'subtle',
      complexity: 'low',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-surface-inverse',
          color: 'color-text-inverse',
          borderRadius: 'radius-sm',
          padding: 'spacing-2',
          fontSize: 'font-size-sm',
          boxShadow: 'shadow-md',
        },
        hover: {},
        focus: {},
        active: {},
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 14. Popover - Container molecule
  {
    name: 'Popover',
    type: 'molecule',
    category: 'container',
    slotAffinity: {
      main: 0.6,
      sidebar: 0.5,
      header: 0.6,
      footer: 0.4,
    },
    semanticDescription: {
      purpose: 'Floating panel triggered by user action to display additional content or controls.',
      visualImpact: 'neutral',
      complexity: 'medium',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-surface',
          borderColor: 'color-border',
          borderWidth: 'border-width-1',
          borderRadius: 'radius-md',
          boxShadow: 'shadow-lg',
          padding: 'spacing-4',
        },
        hover: {},
        focus: {
          borderColor: 'color-focus-ring',
        },
        active: {},
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 15. Tabs - Navigation molecule
  {
    name: 'Tabs',
    type: 'molecule',
    category: 'navigation',
    slotAffinity: {
      main: 0.95,
      sidebar: 0.3,
      header: 0.7,
      footer: 0.2,
    },
    semanticDescription: {
      purpose: 'Navigation component for organizing content into separate views accessible via labeled tabs.',
      visualImpact: 'neutral',
      complexity: 'medium',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {
          borderColor: 'color-border',
          borderWidth: 'border-width-1',
          padding: 'spacing-2',
        },
        hover: {
          backgroundColor: 'color-surface-hover',
        },
        focus: {
          borderColor: 'color-focus-ring',
        },
        active: {
          backgroundColor: 'color-surface',
          borderColor: 'color-primary',
        },
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 16. Accordion - Container molecule
  {
    name: 'Accordion',
    type: 'molecule',
    category: 'container',
    slotAffinity: {
      main: 0.9,
      sidebar: 0.8,
      header: 0.2,
      footer: 0.2,
    },
    semanticDescription: {
      purpose: 'Expandable/collapsible section container for organizing content in limited vertical space.',
      visualImpact: 'neutral',
      complexity: 'medium',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-surface',
          borderColor: 'color-border',
          borderWidth: 'border-width-1',
          borderRadius: 'radius-md',
          padding: 'spacing-3',
        },
        hover: {
          backgroundColor: 'color-surface-hover',
        },
        focus: {
          borderColor: 'color-focus-ring',
        },
        active: {
          backgroundColor: 'color-surface-active',
        },
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 17. Select - Input atom
  {
    name: 'Select',
    type: 'atom',
    category: 'input',
    slotAffinity: {
      main: 0.9,
      sidebar: 0.7,
      header: 0.4,
      footer: 0.3,
    },
    semanticDescription: {
      purpose: 'Native or custom dropdown for selecting one option from a list of choices.',
      visualImpact: 'neutral',
      complexity: 'low',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-surface',
          borderColor: 'color-border',
          borderWidth: 'border-width-1',
          borderRadius: 'radius-md',
          padding: 'spacing-2',
        },
        hover: {
          borderColor: 'color-border-hover',
        },
        focus: {
          borderColor: 'color-focus-ring',
          boxShadow: 'shadow-focus',
        },
        active: {
          borderColor: 'color-primary',
        },
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 18. Textarea - Input atom
  {
    name: 'Textarea',
    type: 'atom',
    category: 'input',
    slotAffinity: {
      main: 0.95,
      sidebar: 0.4,
      header: 0.1,
      footer: 0.1,
    },
    semanticDescription: {
      purpose: 'Multi-line text input field for capturing longer user input like comments or descriptions.',
      visualImpact: 'neutral',
      complexity: 'low',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-surface',
          borderColor: 'color-border',
          borderWidth: 'border-width-1',
          borderRadius: 'radius-md',
          padding: 'spacing-3',
        },
        hover: {
          borderColor: 'color-border-hover',
        },
        focus: {
          borderColor: 'color-focus-ring',
          boxShadow: 'shadow-focus',
        },
        active: {},
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 19. Progress - Display atom
  {
    name: 'Progress',
    type: 'atom',
    category: 'display',
    slotAffinity: {
      main: 0.8,
      sidebar: 0.5,
      header: 0.7,
      footer: 0.6,
    },
    semanticDescription: {
      purpose: 'Visual indicator showing completion percentage or loading state of an operation.',
      visualImpact: 'neutral',
      complexity: 'low',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-surface',
          borderRadius: 'radius-full',
          height: 'spacing-2',
        },
        hover: {},
        focus: {},
        active: {
          backgroundColor: 'color-primary',
        },
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },

  // 20. Avatar - Display atom
  {
    name: 'Avatar',
    type: 'atom',
    category: 'display',
    slotAffinity: {
      main: 0.4,
      sidebar: 0.8,
      header: 0.95,
      footer: 0.3,
    },
    semanticDescription: {
      purpose: 'Circular or rounded image representing a user, typically showing profile picture or initials.',
      visualImpact: 'subtle',
      complexity: 'low',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {
          backgroundColor: 'color-surface',
          borderRadius: 'radius-full',
          borderColor: 'color-border',
          borderWidth: 'border-width-2',
        },
        hover: {
          borderColor: 'color-border-hover',
        },
        focus: {
          borderColor: 'color-focus-ring',
          boxShadow: 'shadow-focus',
        },
        active: {},
        disabled: {
          opacity: 'opacity-disabled',
        },
      },
    },
  },
];

/**
 * Get component by name
 */
export function getComponentByName(name: string): ComponentKnowledge | undefined {
  return COMPONENT_CATALOG.find(c => c.name === name);
}

/**
 * Get all components
 */
export function getAllComponents(): ComponentKnowledge[] {
  return COMPONENT_CATALOG;
}

/**
 * Get components by type
 */
export function getComponentsByType(type: ComponentKnowledge['type']): ComponentKnowledge[] {
  return COMPONENT_CATALOG.filter(c => c.type === type);
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: ComponentKnowledge['category']): ComponentKnowledge[] {
  return COMPONENT_CATALOG.filter(c => c.category === category);
}
