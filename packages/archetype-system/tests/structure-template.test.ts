/**
 * Structure Template Tests
 * Tests for structure template schema, validation, and data integrity
 */

import { describe, it, expect } from 'vitest';
import {
  isStructureTemplate,
  isAccessibilitySpec,
  type StructureTemplate,
  type AccessibilitySpec,
} from '../src/schemas/structure-template';
import {
  validateStructureTemplate,
  validateAccessibilitySpec,
  validateARIAAttribute,
  validateKeyboardNavigation,
  validateJSXPattern,
  validateStructureTemplateCollection,
} from '../src/validators/structure-validator';
import {
  structureTemplatesData,
  getStructureTemplateByHook,
  getComplexTemplates,
  getTemplatesByWCAGLevel,
  getTemplatesWithKeyboardNav,
} from '../src/data/structure-templates';

describe('Structure Template Schema', () => {
  describe('Type Guards', () => {
    it('should validate correct StructureTemplate', () => {
      const validTemplate: StructureTemplate = {
        hookName: 'useButton',
        htmlElement: 'button',
        jsxPattern: '<button {...buttonProps}>{children}</button>',
        accessibility: {
          role: 'button',
          ariaAttributes: [],
          keyboardNavigation: [],
          wcagLevel: 'AA',
        },
      };

      expect(isStructureTemplate(validTemplate)).toBe(true);
    });

    it('should reject invalid StructureTemplate', () => {
      const invalidTemplate = {
        hookName: 'useButton',
        // missing required fields
      };

      expect(isStructureTemplate(invalidTemplate)).toBe(false);
    });

    it('should validate correct AccessibilitySpec', () => {
      const validSpec: AccessibilitySpec = {
        ariaAttributes: [],
        keyboardNavigation: [],
        wcagLevel: 'AA',
      };

      expect(isAccessibilitySpec(validSpec)).toBe(true);
    });

    it('should reject invalid WCAG level', () => {
      const invalidSpec = {
        ariaAttributes: [],
        keyboardNavigation: [],
        wcagLevel: 'B', // Invalid level
      };

      expect(isAccessibilitySpec(invalidSpec)).toBe(false);
    });
  });
});

describe('Structure Template Validator', () => {
  describe('ARIA Attribute Validation', () => {
    it('should validate correct ARIA attribute', () => {
      const validAttr = {
        name: 'aria-label',
        required: true,
        description: 'Accessible label',
      };

      const errors = validateARIAAttribute(validAttr);
      expect(errors).toHaveLength(0);
    });

    it('should reject ARIA attribute without aria- prefix', () => {
      const invalidAttr = {
        name: 'label', // Missing aria- prefix
        required: true,
        description: 'Label',
      };

      const errors = validateARIAAttribute(invalidAttr);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('must start with "aria-"');
    });

    it('should require description for ARIA attributes', () => {
      const invalidAttr = {
        name: 'aria-label',
        required: true,
        description: '', // Empty description
      };

      const errors = validateARIAAttribute(invalidAttr);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Keyboard Navigation Validation', () => {
    it('should validate correct keyboard navigation', () => {
      const validNav = {
        key: 'Enter',
        action: 'Activates the button',
        required: true,
      };

      const errors = validateKeyboardNavigation(validNav);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid keyboard key', () => {
      const invalidNav = {
        key: 'InvalidKey',
        action: 'Does something',
        required: true,
      };

      const errors = validateKeyboardNavigation(invalidNav);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Invalid keyboard key');
    });

    it('should accept all valid keyboard keys', () => {
      const validKeys = [
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

      validKeys.forEach((key) => {
        const nav = {
          key,
          action: 'Test action',
          required: true,
        };
        const errors = validateKeyboardNavigation(nav);
        expect(errors).toHaveLength(0);
      });
    });
  });

  describe('Accessibility Spec Validation', () => {
    it('should validate complete accessibility spec', () => {
      const validSpec: AccessibilitySpec = {
        role: 'button',
        ariaAttributes: [
          {
            name: 'aria-label',
            required: true,
            description: 'Accessible label',
          },
        ],
        keyboardNavigation: [
          {
            key: 'Enter',
            action: 'Activates button',
            required: true,
          },
        ],
        wcagLevel: 'AA',
      };

      const errors = validateAccessibilitySpec(validSpec);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid ARIA role', () => {
      const invalidSpec: AccessibilitySpec = {
        role: 'invalidrole',
        ariaAttributes: [],
        keyboardNavigation: [],
        wcagLevel: 'AA',
      };

      const errors = validateAccessibilitySpec(invalidSpec);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Invalid ARIA role');
    });

    it('should accept all valid ARIA roles', () => {
      const validRoles = [
        'button',
        'checkbox',
        'radio',
        'textbox',
        'dialog',
        'menu',
        'menuitem',
        'tab',
        'tablist',
        'tabpanel',
      ];

      validRoles.forEach((role) => {
        const spec: AccessibilitySpec = {
          role,
          ariaAttributes: [],
          keyboardNavigation: [],
          wcagLevel: 'AA',
        };
        const errors = validateAccessibilitySpec(spec);
        expect(errors).toHaveLength(0);
      });
    });
  });

  describe('JSX Pattern Validation', () => {
    it('should validate correct JSX pattern', () => {
      const validPattern = '<button {...buttonProps}>{children}</button>';
      const errors = validateJSXPattern(validPattern, 'useButton');
      expect(errors).toHaveLength(0);
    });

    it('should require props spread in JSX pattern', () => {
      const invalidPattern = '<button>{children}</button>';
      const errors = validateJSXPattern(invalidPattern, 'useButton');
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('props spread');
    });

    it('should validate complex nested JSX patterns', () => {
      const complexPattern = `<dialog {...dialogProps}>
  <h2 {...titleProps}>{title}</h2>
  <div>{children}</div>
  <button onClick={close}>Close</button>
</dialog>`;
      const errors = validateJSXPattern(complexPattern, 'useDialog');
      expect(errors).toHaveLength(0);
    });

    it('should detect unclosed JSX tags', () => {
      const invalidPattern = '<button {...buttonProps}>{children}';
      const errors = validateJSXPattern(invalidPattern, 'useButton');
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Complete Template Validation', () => {
    it('should validate complete structure template', () => {
      const validTemplate: StructureTemplate = {
        hookName: 'useButton',
        htmlElement: 'button',
        jsxPattern: '<button {...buttonProps}>{children}</button>',
        accessibility: {
          role: 'button',
          ariaAttributes: [
            {
              name: 'aria-label',
              required: false,
              description: 'Accessible label',
            },
          ],
          keyboardNavigation: [
            {
              key: 'Enter',
              action: 'Activates button',
              required: true,
            },
          ],
          wcagLevel: 'AA',
        },
      };

      const result = validateStructureTemplate(validTemplate);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject hook name without use prefix', () => {
      const invalidTemplate: StructureTemplate = {
        hookName: 'button', // Missing 'use' prefix
        htmlElement: 'button',
        jsxPattern: '<button {...buttonProps}>{children}</button>',
        accessibility: {
          ariaAttributes: [],
          keyboardNavigation: [],
          wcagLevel: 'AA',
        },
      };

      const result = validateStructureTemplate(invalidTemplate);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('must start with "use"'))).toBe(true);
    });

    it('should validate nested structure if present', () => {
      const templateWithNested: StructureTemplate = {
        hookName: 'useDialog',
        htmlElement: 'dialog',
        jsxPattern: '<dialog {...dialogProps}><h2 {...titleProps}>{title}</h2></dialog>',
        accessibility: {
          ariaAttributes: [],
          keyboardNavigation: [],
          wcagLevel: 'AA',
        },
        nestedStructure: {
          components: [
            {
              element: 'dialog',
              propsObject: 'dialogProps',
              order: 1,
              purpose: 'Main container',
            },
            {
              element: 'h2',
              propsObject: 'titleProps',
              order: 2,
              purpose: 'Title',
            },
          ],
          compositionPattern: 'Dialog + Title',
          requiresWrapper: false,
        },
      };

      const result = validateStructureTemplate(templateWithNested);
      expect(result.valid).toBe(true);
    });

    it('should provide warnings for missing examples', () => {
      const templateWithoutExamples: StructureTemplate = {
        hookName: 'useButton',
        htmlElement: 'button',
        jsxPattern: '<button {...buttonProps}>{children}</button>',
        accessibility: {
          ariaAttributes: [],
          keyboardNavigation: [],
          wcagLevel: 'AA',
        },
      };

      const result = validateStructureTemplate(templateWithoutExamples);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.includes('examples'))).toBe(true);
    });
  });
});

describe('Structure Templates Data', () => {
  describe('Data Integrity', () => {
    it('should have exactly 20 templates', () => {
      expect(structureTemplatesData).toHaveLength(20);
    });

    it('should have unique hook names', () => {
      const hookNames = structureTemplatesData.map((t) => t.hookName);
      const uniqueNames = new Set(hookNames);
      expect(uniqueNames.size).toBe(hookNames.length);
    });

    it('should validate all templates', () => {
      const result = validateStructureTemplateCollection(structureTemplatesData);
      if (!result.valid) {
        console.error('Validation errors:', result.errors);
        console.error('Warnings:', result.warnings);
      }
      expect(result.valid).toBe(true);
    });

    it('should have all required hooks', () => {
      const requiredHooks = [
        'useButton',
        'useToggleButton',
        'useSwitch',
        'useCheckbox',
        'useRadio',
        'useTextField',
        'useDialog',
        'useModal',
        'usePopover',
        'useTooltip',
        'useTabs',
        'useBreadcrumbs',
        'useMenu',
        'useDropdown',
        'useAccordion',
        'useTable',
        'usePagination',
        'useProgress',
        'useCalendar',
        'useRangeCalendar',
      ];

      requiredHooks.forEach((hookName) => {
        const template = structureTemplatesData.find((t) => t.hookName === hookName);
        expect(template).toBeDefined();
      });
    });
  });

  describe('Accessibility Compliance', () => {
    it('should have WCAG level AA or higher for all templates', () => {
      structureTemplatesData.forEach((template) => {
        expect(['A', 'AA', 'AAA']).toContain(template.accessibility.wcagLevel);
      });
    });

    it('should have keyboard navigation for interactive components', () => {
      const interactiveHooks = [
        'useButton',
        'useToggleButton',
        'useSwitch',
        'useCheckbox',
        'useRadio',
        'useDialog',
        'useModal',
        'useTabs',
        'useMenu',
        'useDropdown',
        'useAccordion',
      ];

      interactiveHooks.forEach((hookName) => {
        const template = structureTemplatesData.find((t) => t.hookName === hookName);
        expect(template).toBeDefined();
        expect(template!.accessibility.keyboardNavigation.length).toBeGreaterThan(0);
      });
    });

    it('should have ARIA attributes for complex components', () => {
      const complexHooks = ['useDialog', 'useModal', 'useTabs', 'useMenu'];

      complexHooks.forEach((hookName) => {
        const template = structureTemplatesData.find((t) => t.hookName === hookName);
        expect(template).toBeDefined();
        expect(template!.accessibility.ariaAttributes.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Helper Functions', () => {
    it('should find template by hook name', () => {
      const template = getStructureTemplateByHook('useButton');
      expect(template).toBeDefined();
      expect(template!.hookName).toBe('useButton');
    });

    it('should return undefined for non-existent hook', () => {
      const template = getStructureTemplateByHook('useNonExistent');
      expect(template).toBeUndefined();
    });

    it('should get complex templates with nested structures', () => {
      const complexTemplates = getComplexTemplates();
      expect(complexTemplates.length).toBeGreaterThan(0);
      complexTemplates.forEach((template) => {
        expect(template.nestedStructure).toBeDefined();
      });
    });

    it('should filter templates by WCAG level', () => {
      const aaTemplates = getTemplatesByWCAGLevel('AA');
      expect(aaTemplates.length).toBeGreaterThan(0);
      aaTemplates.forEach((template) => {
        expect(template.accessibility.wcagLevel).toBe('AA');
      });
    });

    it('should find templates with specific keyboard navigation', () => {
      const enterTemplates = getTemplatesWithKeyboardNav('Enter');
      expect(enterTemplates.length).toBeGreaterThan(0);
      enterTemplates.forEach((template) => {
        const hasEnter = template.accessibility.keyboardNavigation.some((nav) => nav.key === 'Enter');
        expect(hasEnter).toBe(true);
      });
    });
  });

  describe('JSX Pattern Quality', () => {
    it('should have valid JSX patterns for all templates', () => {
      structureTemplatesData.forEach((template) => {
        const errors = validateJSXPattern(template.jsxPattern, template.hookName);
        expect(errors).toHaveLength(0);
      });
    });

    it('should include props spread in all JSX patterns', () => {
      structureTemplatesData.forEach((template) => {
        expect(template.jsxPattern).toMatch(/\{\.\.\.[\w]+Props\}/);
      });
    });
  });

  describe('Nested Structure Validation', () => {
    it('should have valid nested structures for complex components', () => {
      const complexTemplates = getComplexTemplates();

      complexTemplates.forEach((template) => {
        expect(template.nestedStructure).toBeDefined();
        expect(template.nestedStructure!.components.length).toBeGreaterThan(0);
        expect(template.nestedStructure!.compositionPattern).toBeTruthy();
        expect(typeof template.nestedStructure!.requiresWrapper).toBe('boolean');
      });
    });

    it('should have ordered components in nested structures', () => {
      const complexTemplates = getComplexTemplates();

      complexTemplates.forEach((template) => {
        const orders = template.nestedStructure!.components.map((c) => c.order);
        const sortedOrders = [...orders].sort((a, b) => a - b);
        expect(orders).toEqual(sortedOrders);
      });
    });
  });
});

describe('Integration with Other Layers', () => {
  it('should have matching hook names with hook-prop-rules', () => {
    // This test ensures structure templates align with Phase 1 data
    const expectedHooks = [
      'useButton',
      'useToggleButton',
      'useSwitch',
      'useCheckbox',
      'useRadio',
      'useTextField',
      'useDialog',
      'useModal',
      'usePopover',
      'useTooltip',
      'useTabs',
      'useBreadcrumbs',
      'useMenu',
      'useDropdown',
      'useAccordion',
      'useTable',
      'usePagination',
      'useProgress',
      'useCalendar',
      'useRangeCalendar',
    ];

    const actualHooks = structureTemplatesData.map((t) => t.hookName);
    expect(actualHooks.sort()).toEqual(expectedHooks.sort());
  });
});
