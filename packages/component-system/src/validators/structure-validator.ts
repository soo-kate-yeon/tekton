/**
 * Structure Template Validator
 * Validates structure templates and accessibility compliance
 *
 * @module validators/structure-validator
 */

import {
  StructureTemplate,
  AccessibilitySpec,
  ARIAAttribute,
  KeyboardNavigation,
  isStructureTemplate,
  isAccessibilitySpec,
} from '../schemas/structure-template.js';

/**
 * Validation result for structure templates
 */
export interface StructureValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * WCAG 2.1 compliance levels
 */
const WCAG_LEVELS = ['A', 'AA', 'AAA'] as const;

/**
 * Common ARIA roles for interactive components
 */
const VALID_ARIA_ROLES = [
  'button',
  'checkbox',
  'radio',
  'textbox',
  'combobox',
  'listbox',
  'option',
  'tab',
  'tablist',
  'tabpanel',
  'dialog',
  'alertdialog',
  'menu',
  'menuitem',
  'menubar',
  'navigation',
  'link',
  'switch',
  'slider',
  'progressbar',
  'tooltip',
  'table',
  'row',
  'cell',
  'grid',
  'gridcell',
  'application',
];

/**
 * Valid keyboard keys for interactions
 */
const VALID_KEYBOARD_KEYS = [
  'Enter',
  'Space',
  'Escape',
  'Tab',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
];

/**
 * Validate ARIA attribute definition
 */
export function validateARIAAttribute(attr: ARIAAttribute): string[] {
  const errors: string[] = [];

  if (!attr.name || typeof attr.name !== 'string') {
    errors.push('ARIA attribute must have a valid name');
  }

  if (!attr.name.startsWith('aria-')) {
    errors.push(`ARIA attribute name must start with "aria-": ${attr.name}`);
  }

  if (typeof attr.required !== 'boolean') {
    errors.push(`ARIA attribute "${attr.name}" must have a boolean "required" field`);
  }

  if (!attr.description || typeof attr.description !== 'string') {
    errors.push(`ARIA attribute "${attr.name}" must have a description`);
  }

  return errors;
}

/**
 * Validate keyboard navigation specification
 */
export function validateKeyboardNavigation(nav: KeyboardNavigation): string[] {
  const errors: string[] = [];

  if (!nav.key || typeof nav.key !== 'string') {
    errors.push('Keyboard navigation must have a valid key');
  }

  if (!VALID_KEYBOARD_KEYS.includes(nav.key)) {
    errors.push(
      `Invalid keyboard key "${nav.key}". Must be one of: ${VALID_KEYBOARD_KEYS.join(', ')}`
    );
  }

  if (!nav.action || typeof nav.action !== 'string') {
    errors.push(`Keyboard navigation for "${nav.key}" must have an action description`);
  }

  if (typeof nav.required !== 'boolean') {
    errors.push(`Keyboard navigation for "${nav.key}" must have a boolean "required" field`);
  }

  return errors;
}

/**
 * Validate accessibility specification
 */
export function validateAccessibilitySpec(spec: AccessibilitySpec): string[] {
  const errors: string[] = [];

  if (!isAccessibilitySpec(spec)) {
    errors.push('Invalid accessibility specification structure');
    return errors;
  }

  // Validate ARIA role if provided
  if (spec.role && !VALID_ARIA_ROLES.includes(spec.role)) {
    errors.push(
      `Invalid ARIA role "${spec.role}". Must be one of: ${VALID_ARIA_ROLES.join(', ')}`
    );
  }

  // Validate WCAG level
  if (!WCAG_LEVELS.includes(spec.wcagLevel)) {
    errors.push(`Invalid WCAG level "${spec.wcagLevel}". Must be A, AA, or AAA`);
  }

  // Validate ARIA attributes
  if (!Array.isArray(spec.ariaAttributes)) {
    errors.push('Accessibility spec must have an ariaAttributes array');
  } else {
    spec.ariaAttributes.forEach((attr, index) => {
      const attrErrors = validateARIAAttribute(attr);
      errors.push(...attrErrors.map((e) => `ARIA attribute [${index}]: ${e}`));
    });
  }

  // Validate keyboard navigation
  if (!Array.isArray(spec.keyboardNavigation)) {
    errors.push('Accessibility spec must have a keyboardNavigation array');
  } else {
    spec.keyboardNavigation.forEach((nav, index) => {
      const navErrors = validateKeyboardNavigation(nav);
      errors.push(...navErrors.map((e) => `Keyboard navigation [${index}]: ${e}`));
    });
  }

  return errors;
}

/**
 * Validate JSX pattern syntax
 */
export function validateJSXPattern(pattern: string, _hookName: string): string[] {
  const errors: string[] = [];

  // Check for proper JSX structure
  if (!pattern.includes('<') || !pattern.includes('>')) {
    errors.push('JSX pattern must contain valid JSX elements');
  }

  // Check for required placeholders
  const hasPropsSpread = /\{\.\.\.[\w]+Props\}/.test(pattern);
  if (!hasPropsSpread) {
    errors.push('JSX pattern must include props spread (e.g., {...buttonProps})');
  }

  // Validate closing tags match opening tags
  const openingTags = pattern.match(/<(\w+)[\s>]/g);
  const closingTags = pattern.match(/<\/(\w+)>/g);
  const selfClosingTags = pattern.match(/<(\w+)[^>]*\/>/g);

  if (openingTags) {
    const openTags = openingTags.map((t) => t.replace(/<(\w+)[\s>]/, '$1'));
    const closeTags = closingTags ? closingTags.map((t) => t.replace(/<\/(\w+)>/, '$1')) : [];
    const selfClosedTags = selfClosingTags
      ? selfClosingTags.map((t) => t.replace(/<(\w+)[^>]*\/>/, '$1'))
      : [];

    openTags.forEach((tag) => {
      // Check if tag is closed, self-closed, or is a self-closing HTML element
      const selfClosingElements = ['input', 'img', 'br', 'hr', 'meta', 'link'];
      const isSelfClosingElement = selfClosingElements.includes(tag);
      const hasClosingTag = closeTags.includes(tag);
      const hasSelfClosingTag = selfClosedTags.includes(tag);

      if (!hasClosingTag && !hasSelfClosingTag && !isSelfClosingElement) {
        errors.push(`Unclosed JSX tag: <${tag}>`);
      }
    });
  }

  return errors;
}

/**
 * Validate complete structure template
 */
export function validateStructureTemplate(template: StructureTemplate): StructureValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Type guard check
  if (!isStructureTemplate(template)) {
    return {
      valid: false,
      errors: ['Invalid structure template: missing required fields'],
      warnings: [],
    };
  }

  // Validate hook name
  if (!template.hookName.startsWith('use')) {
    errors.push(`Hook name must start with "use": ${template.hookName}`);
  }

  // Validate HTML element
  if (!template.htmlElement || template.htmlElement.length === 0) {
    errors.push('HTML element must be specified');
  }

  // Validate JSX pattern
  const jsxErrors = validateJSXPattern(template.jsxPattern, template.hookName);
  errors.push(...jsxErrors);

  // Validate accessibility spec
  const accessibilityErrors = validateAccessibilitySpec(template.accessibility);
  errors.push(...accessibilityErrors);

  // Validate nested structure if present
  if (template.nestedStructure) {
    if (!Array.isArray(template.nestedStructure.components)) {
      errors.push('Nested structure must have a components array');
    } else {
      template.nestedStructure.components.forEach((comp, index) => {
        if (!comp.element || typeof comp.element !== 'string') {
          errors.push(`Nested component [${index}] must have a valid element name`);
        }
        if (typeof comp.order !== 'number') {
          errors.push(`Nested component [${index}] must have a numeric order`);
        }
        if (!comp.purpose || typeof comp.purpose !== 'string') {
          errors.push(`Nested component [${index}] must have a purpose description`);
        }
      });
    }

    if (!template.nestedStructure.compositionPattern) {
      errors.push('Nested structure must have a compositionPattern description');
    }

    if (typeof template.nestedStructure.requiresWrapper !== 'boolean') {
      errors.push('Nested structure must specify requiresWrapper as boolean');
    }
  }

  // Warnings for best practices
  if (!template.examples || template.examples.length === 0) {
    warnings.push('Consider adding usage examples for better documentation');
  }

  if (template.accessibility.wcagLevel === 'A') {
    warnings.push('Consider targeting WCAG 2.1 Level AA or higher for better accessibility');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate collection of structure templates
 */
export function validateStructureTemplateCollection(
  templates: StructureTemplate[]
): StructureValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // Check for duplicate hook names
  const hookNames = templates.map((t) => t.hookName);
  const duplicates = hookNames.filter((name, index) => hookNames.indexOf(name) !== index);

  if (duplicates.length > 0) {
    allErrors.push(`Duplicate hook names found: ${duplicates.join(', ')}`);
  }

  // Validate each template
  templates.forEach((template, index) => {
    const result = validateStructureTemplate(template);
    allErrors.push(...result.errors.map((e) => `Template [${index}] (${template.hookName}): ${e}`));
    allWarnings.push(
      ...result.warnings.map((w) => `Template [${index}] (${template.hookName}): ${w}`)
    );
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}
