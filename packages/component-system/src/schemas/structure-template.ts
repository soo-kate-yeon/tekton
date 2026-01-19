/**
 * Structure Template Schema
 * Defines HTML/JSX templates and accessibility rules for hooks
 *
 * @module schemas/structure-template
 */

/**
 * ARIA attribute definition with validation rules
 */
export interface ARIAAttribute {
  /**
   * ARIA attribute name (e.g., "aria-label", "aria-pressed")
   */
  name: string;

  /**
   * Whether this attribute is required for accessibility compliance
   */
  required: boolean;

  /**
   * Valid values for this attribute (if applicable)
   */
  validValues?: string[];

  /**
   * Description of the attribute's purpose
   */
  description: string;
}

/**
 * Keyboard navigation specification
 */
export interface KeyboardNavigation {
  /**
   * Key that triggers this interaction (e.g., "Enter", "Space", "Escape")
   */
  key: string;

  /**
   * Description of what happens when key is pressed
   */
  action: string;

  /**
   * Whether this key interaction is required for accessibility
   */
  required: boolean;
}

/**
 * Accessibility requirements for a component
 */
export interface AccessibilitySpec {
  /**
   * ARIA role for the component (if applicable)
   */
  role?: string;

  /**
   * ARIA attributes supported or required
   */
  ariaAttributes: ARIAAttribute[];

  /**
   * Keyboard navigation requirements
   */
  keyboardNavigation: KeyboardNavigation[];

  /**
   * Focus management requirements
   */
  focusManagement?: string;

  /**
   * WCAG 2.1 Level (A, AA, AAA)
   */
  wcagLevel: 'A' | 'AA' | 'AAA';

  /**
   * Additional accessibility notes
   */
  notes?: string[];
}

/**
 * Nested component in complex structures
 */
export interface NestedComponent {
  /**
   * HTML element or component name
   */
  element: string;

  /**
   * Props object from hook (if applicable)
   */
  propsObject?: string;

  /**
   * Order in the structure
   */
  order: number;

  /**
   * Purpose or role in the composition
   */
  purpose: string;
}

/**
 * Structure composition for complex components
 */
export interface StructureComposition {
  /**
   * List of nested components
   */
  components: NestedComponent[];

  /**
   * Description of how components compose together
   */
  compositionPattern: string;

  /**
   * Whether this structure requires wrapper elements
   */
  requiresWrapper: boolean;
}

/**
 * Complete structure template for a hook
 */
export interface StructureTemplate {
  /**
   * Hook name (e.g., "useButton", "useDialog")
   */
  hookName: string;

  /**
   * Primary HTML element (e.g., "button", "input", "dialog")
   */
  htmlElement: string;

  /**
   * JSX pattern template
   * Uses placeholders: {children}, {...propsObject}
   */
  jsxPattern: string;

  /**
   * Accessibility specifications
   */
  accessibility: AccessibilitySpec;

  /**
   * Nested structure definition (for complex components)
   */
  nestedStructure?: StructureComposition;

  /**
   * Examples of usage
   */
  examples?: string[];

  /**
   * Integration notes with other hooks
   */
  integrationNotes?: string[];
}

/**
 * Collection of all structure templates
 */
export interface StructureTemplateCollection {
  version: string;
  templates: StructureTemplate[];
}

/**
 * Type guard to check if a value is a valid StructureTemplate object
 */
export function isStructureTemplate(value: any): value is StructureTemplate {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.hookName === 'string' &&
    typeof value.htmlElement === 'string' &&
    typeof value.jsxPattern === 'string' &&
    typeof value.accessibility === 'object' &&
    value.accessibility !== null
  );
}

/**
 * Type guard to check if a value is a valid AccessibilitySpec object
 */
export function isAccessibilitySpec(value: any): value is AccessibilitySpec {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray(value.ariaAttributes) &&
    Array.isArray(value.keyboardNavigation) &&
    ['A', 'AA', 'AAA'].includes(value.wcagLevel)
  );
}
