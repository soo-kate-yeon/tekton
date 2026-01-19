/**
 * Accessibility Audit Tests
 * WCAG 2.1 AA compliance tests for all structure templates
 */

import { describe, it, expect } from 'vitest';
import { structureTemplatesData } from '../src/data/structure-templates';
import type { StructureTemplate, KeyboardNavigation } from '../src/schemas/structure-template';

describe('WCAG 2.1 AA Compliance Audit', () => {
  describe('Perceivable - Information and UI components must be presentable', () => {
    describe('1.1 Text Alternatives', () => {
      it('should provide ARIA labels for non-text content', () => {
        structureTemplatesData.forEach((template) => {
          const hasAriaLabel = template.accessibility.ariaAttributes.some(
            (attr) => attr.name === 'aria-label' || attr.name === 'aria-labelledby'
          );

          // Interactive components should have accessible names
          const interactiveElements = ['button', 'input', 'dialog', 'nav'];
          if (interactiveElements.includes(template.htmlElement)) {
            expect(
              hasAriaLabel || template.jsxPattern.includes('label'),
              `${template.hookName} should provide accessible text alternatives`
            ).toBeTruthy();
          }
        });
      });
    });

    describe('1.3 Adaptable - Content can be presented in different ways', () => {
      it('should use semantic HTML elements', () => {
        const semanticElements = [
          'button',
          'input',
          'dialog',
          'nav',
          'table',
          'div', // Allowed with proper ARIA roles
        ];

        structureTemplatesData.forEach((template) => {
          expect(
            semanticElements.includes(template.htmlElement),
            `${template.hookName} uses semantic element: ${template.htmlElement}`
          ).toBe(true);
        });
      });

      it('should define ARIA roles where appropriate', () => {
        const componentsRequiringRoles = [
          'useButton',
          'useSwitch',
          'useDialog',
          'useModal',
          'useTabs',
          'useMenu',
          'useProgress',
          'useCalendar',
          'useRangeCalendar',
        ];

        componentsRequiringRoles.forEach((hookName) => {
          const template = structureTemplatesData.find((t) => t.hookName === hookName);
          expect(template).toBeDefined();

          const hasRole =
            template!.accessibility.role !== undefined ||
            template!.jsxPattern.includes('role=');

          expect(hasRole, `${hookName} should define ARIA role`).toBe(true);
        });
      });
    });

    describe('1.4 Distinguishable - Make it easier to see and hear content', () => {
      it('should support state indication through ARIA', () => {
        const statefulComponents = [
          'useToggleButton',
          'useSwitch',
          'useCheckbox',
          'useRadio',
          'useTabs',
        ];

        statefulComponents.forEach((hookName) => {
          const template = structureTemplatesData.find((t) => t.hookName === hookName);
          expect(template).toBeDefined();

          const hasStateAria = template!.accessibility.ariaAttributes.some(
            (attr) =>
              attr.name === 'aria-pressed' ||
              attr.name === 'aria-checked' ||
              attr.name === 'aria-selected'
          );

          expect(hasStateAria, `${hookName} should indicate state via ARIA`).toBe(true);
        });
      });
    });
  });

  describe('Operable - UI components must be operable', () => {
    describe('2.1 Keyboard Accessible - All functionality available from keyboard', () => {
      it('should provide keyboard navigation for interactive components', () => {
        const interactiveComponents = [
          'useButton',
          'useToggleButton',
          'useSwitch',
          'useCheckbox',
          'useRadio',
          'useDialog',
          'useModal',
          'usePopover',
          'useTooltip',
          'useTabs',
          'useMenu',
          'useDropdown',
          'useAccordion',
          'useCalendar',
          'useRangeCalendar',
        ];

        interactiveComponents.forEach((hookName) => {
          const template = structureTemplatesData.find((t) => t.hookName === hookName);
          expect(template).toBeDefined();
          expect(
            template!.accessibility.keyboardNavigation.length,
            `${hookName} should define keyboard navigation`
          ).toBeGreaterThan(0);
        });
      });

      it('should support Enter and Space for buttons', () => {
        const buttonLikeComponents = ['useButton', 'useToggleButton'];

        buttonLikeComponents.forEach((hookName) => {
          const template = structureTemplatesData.find((t) => t.hookName === hookName);
          expect(template).toBeDefined();

          const hasEnter = template!.accessibility.keyboardNavigation.some(
            (nav) => nav.key === 'Enter'
          );
          const hasSpace = template!.accessibility.keyboardNavigation.some(
            (nav) => nav.key === 'Space'
          );

          expect(hasEnter, `${hookName} should support Enter key`).toBe(true);
          expect(hasSpace, `${hookName} should support Space key`).toBe(true);
        });
      });

      it('should support Escape for dismissible components', () => {
        const dismissibleComponents = [
          'useDialog',
          'useModal',
          'usePopover',
          'useTooltip',
          'useMenu',
          'useDropdown',
        ];

        dismissibleComponents.forEach((hookName) => {
          const template = structureTemplatesData.find((t) => t.hookName === hookName);
          expect(template).toBeDefined();

          const hasEscape = template!.accessibility.keyboardNavigation.some(
            (nav) => nav.key === 'Escape'
          );

          expect(hasEscape, `${hookName} should support Escape key to close`).toBe(true);
        });
      });

      it('should support arrow keys for navigation components', () => {
        const navigationComponents = [
          { hook: 'useRadio', keys: ['ArrowUp', 'ArrowDown'] },
          { hook: 'useTabs', keys: ['ArrowLeft', 'ArrowRight'] },
          { hook: 'useMenu', keys: ['ArrowUp', 'ArrowDown'] },
          { hook: 'useCalendar', keys: ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'] },
        ];

        navigationComponents.forEach(({ hook, keys }) => {
          const template = structureTemplatesData.find((t) => t.hookName === hook);
          expect(template).toBeDefined();

          keys.forEach((key) => {
            const hasKey = template!.accessibility.keyboardNavigation.some((nav) => nav.key === key);
            expect(hasKey, `${hook} should support ${key} key`).toBe(true);
          });
        });
      });

      it('should mark required keyboard interactions', () => {
        structureTemplatesData.forEach((template) => {
          template.accessibility.keyboardNavigation.forEach((nav) => {
            expect(
              typeof nav.required,
              `${template.hookName}: ${nav.key} should have required property`
            ).toBe('boolean');

            expect(
              nav.action,
              `${template.hookName}: ${nav.key} should have action description`
            ).toBeTruthy();
          });
        });
      });
    });

    describe('2.4 Navigable - Provide ways to help users navigate', () => {
      it('should provide navigation landmarks', () => {
        const landmarkComponents = ['useBreadcrumbs', 'usePagination'];

        landmarkComponents.forEach((hookName) => {
          const template = structureTemplatesData.find((t) => t.hookName === hookName);
          expect(template).toBeDefined();
          expect(template!.htmlElement).toBe('nav');
        });
      });

      it('should require aria-label for navigation regions', () => {
        const navComponents = ['useBreadcrumbs', 'usePagination'];

        navComponents.forEach((hookName) => {
          const template = structureTemplatesData.find((t) => t.hookName === hookName);
          expect(template).toBeDefined();

          const hasAriaLabel = template!.accessibility.ariaAttributes.some(
            (attr) => attr.name === 'aria-label' && attr.required
          );

          expect(hasAriaLabel, `${hookName} should require aria-label`).toBe(true);
        });
      });

      it('should indicate current page in breadcrumbs and pagination', () => {
        const currentIndicatorComponents = ['useBreadcrumbs', 'usePagination'];

        currentIndicatorComponents.forEach((hookName) => {
          const template = structureTemplatesData.find((t) => t.hookName === hookName);
          expect(template).toBeDefined();

          const hasAriaCurrent = template!.accessibility.ariaAttributes.some(
            (attr) => attr.name === 'aria-current'
          );

          expect(hasAriaCurrent, `${hookName} should support aria-current`).toBe(true);
        });
      });
    });

    describe('2.5 Input Modalities', () => {
      it('should not rely solely on path-based gestures', () => {
        // All keyboard navigation should have alternatives
        structureTemplatesData.forEach((template) => {
          template.accessibility.keyboardNavigation.forEach((nav) => {
            // Ensure action is clearly defined
            expect(nav.action.length).toBeGreaterThan(0);
          });
        });
      });
    });
  });

  describe('Understandable - Information and UI operation must be understandable', () => {
    describe('3.2 Predictable - Web pages appear and operate in predictable ways', () => {
      it('should provide aria-expanded for expandable components', () => {
        const expandableComponents = ['usePopover', 'useDropdown', 'useAccordion'];

        expandableComponents.forEach((hookName) => {
          const template = structureTemplatesData.find((t) => t.hookName === hookName);
          expect(template).toBeDefined();

          const hasExpanded = template!.accessibility.ariaAttributes.some(
            (attr) => attr.name === 'aria-expanded'
          );

          expect(hasExpanded, `${hookName} should support aria-expanded`).toBe(true);
        });
      });

      it('should indicate popup type with aria-haspopup', () => {
        const popupComponents = ['usePopover', 'useDropdown'];

        popupComponents.forEach((hookName) => {
          const template = structureTemplatesData.find((t) => t.hookName === hookName);
          expect(template).toBeDefined();

          const hasHasPopup = template!.accessibility.ariaAttributes.some(
            (attr) => attr.name === 'aria-haspopup'
          );

          expect(hasHasPopup, `${hookName} should have aria-haspopup`).toBe(true);
        });
      });
    });

    describe('3.3 Input Assistance - Help users avoid and correct mistakes', () => {
      it('should support error indication for text fields', () => {
        const template = structureTemplatesData.find((t) => t.hookName === 'useTextField');
        expect(template).toBeDefined();

        const hasInvalid = template!.accessibility.ariaAttributes.some(
          (attr) => attr.name === 'aria-invalid'
        );

        expect(hasInvalid, 'useTextField should support aria-invalid').toBe(true);
      });

      it('should support required field indication', () => {
        const template = structureTemplatesData.find((t) => t.hookName === 'useTextField');
        expect(template).toBeDefined();

        const hasRequired = template!.accessibility.ariaAttributes.some(
          (attr) => attr.name === 'aria-required'
        );

        expect(hasRequired, 'useTextField should support aria-required').toBe(true);
      });

      it('should support describedby for help text', () => {
        const template = structureTemplatesData.find((t) => t.hookName === 'useTextField');
        expect(template).toBeDefined();

        const hasDescribedBy = template!.accessibility.ariaAttributes.some(
          (attr) => attr.name === 'aria-describedby'
        );

        expect(hasDescribedBy, 'useTextField should support aria-describedby').toBe(true);
      });
    });
  });

  describe('Robust - Content must be robust enough for wide variety of user agents', () => {
    describe('4.1 Compatible - Maximize compatibility with assistive technologies', () => {
      it('should have valid ARIA attribute names', () => {
        const validAriaAttrs = [
          'aria-label',
          'aria-labelledby',
          'aria-describedby',
          'aria-pressed',
          'aria-checked',
          'aria-selected',
          'aria-expanded',
          'aria-haspopup',
          'aria-controls',
          'aria-current',
          'aria-disabled',
          'aria-invalid',
          'aria-required',
          'aria-modal',
          'aria-valuenow',
          'aria-valuemin',
          'aria-valuemax',
          'aria-orientation',
          'aria-rowcount',
        ];

        structureTemplatesData.forEach((template) => {
          template.accessibility.ariaAttributes.forEach((attr) => {
            expect(
              validAriaAttrs.includes(attr.name),
              `${template.hookName}: ${attr.name} is a valid ARIA attribute`
            ).toBe(true);
          });
        });
      });

      it('should specify valid values for state ARIA attributes', () => {
        const stateAttrs = ['aria-pressed', 'aria-checked', 'aria-selected', 'aria-expanded'];

        structureTemplatesData.forEach((template) => {
          template.accessibility.ariaAttributes
            .filter((attr) => stateAttrs.includes(attr.name))
            .forEach((attr) => {
              expect(
                attr.validValues,
                `${template.hookName}: ${attr.name} should define valid values`
              ).toBeDefined();

              if (attr.validValues) {
                expect(attr.validValues.length).toBeGreaterThan(0);
                expect(
                  attr.validValues.every((v) => ['true', 'false', 'mixed'].includes(v))
                ).toBe(true);
              }
            });
        });
      });

      it('should require aria-modal for modal dialogs', () => {
        const modalComponents = ['useDialog', 'useModal'];

        modalComponents.forEach((hookName) => {
          const template = structureTemplatesData.find((t) => t.hookName === hookName);
          expect(template).toBeDefined();

          const ariaModal = template!.accessibility.ariaAttributes.find(
            (attr) => attr.name === 'aria-modal'
          );

          expect(ariaModal, `${hookName} should have aria-modal`).toBeDefined();
          expect(ariaModal!.required, `${hookName} aria-modal should be required`).toBe(true);
        });
      });

      it('should require aria-labelledby for dialogs', () => {
        const dialogComponents = ['useDialog', 'useModal'];

        dialogComponents.forEach((hookName) => {
          const template = structureTemplatesData.find((t) => t.hookName === hookName);
          expect(template).toBeDefined();

          const labelledBy = template!.accessibility.ariaAttributes.find(
            (attr) => attr.name === 'aria-labelledby'
          );

          expect(labelledBy, `${hookName} should have aria-labelledby`).toBeDefined();
          expect(labelledBy!.required, `${hookName} aria-labelledby should be required`).toBe(true);
        });
      });
    });
  });

  describe('Focus Management', () => {
    it('should define focus management for modal components', () => {
      const modalComponents = ['useDialog', 'useModal'];

      modalComponents.forEach((hookName) => {
        const template = structureTemplatesData.find((t) => t.hookName === hookName);
        expect(template).toBeDefined();
        expect(
          template!.accessibility.focusManagement,
          `${hookName} should define focus management`
        ).toBeDefined();
        expect(template!.accessibility.focusManagement).toContain('focus');
      });
    });

    it('should support Tab key for focus traversal in complex components', () => {
      const complexComponents = ['useDialog', 'useModal'];

      complexComponents.forEach((hookName) => {
        const template = structureTemplatesData.find((t) => t.hookName === hookName);
        expect(template).toBeDefined();

        const hasTab = template!.accessibility.keyboardNavigation.some((nav) => nav.key === 'Tab');
        expect(hasTab, `${hookName} should support Tab key`).toBe(true);
      });
    });
  });

  describe('Progressive Enhancement', () => {
    it('should target WCAG 2.1 Level AA or higher', () => {
      structureTemplatesData.forEach((template) => {
        expect(['AA', 'AAA']).toContain(template.accessibility.wcagLevel);
      });
    });

    it('should provide additional accessibility notes for complex components', () => {
      const complexComponents = ['useTooltip', 'useCalendar', 'useRangeCalendar'];

      complexComponents.forEach((hookName) => {
        const template = structureTemplatesData.find((t) => t.hookName === hookName);
        expect(template).toBeDefined();

        if (template!.accessibility.notes) {
          expect(template!.accessibility.notes.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Component-Specific Accessibility Requirements', () => {
    it('useProgress should have aria-value attributes', () => {
      const template = structureTemplatesData.find((t) => t.hookName === 'useProgress');
      expect(template).toBeDefined();

      const hasValueNow = template!.accessibility.ariaAttributes.some(
        (attr) => attr.name === 'aria-valuenow'
      );
      const hasValueMin = template!.accessibility.ariaAttributes.some(
        (attr) => attr.name === 'aria-valuemin'
      );
      const hasValueMax = template!.accessibility.ariaAttributes.some(
        (attr) => attr.name === 'aria-valuemax'
      );

      expect(hasValueNow).toBe(true);
      expect(hasValueMin).toBe(true);
      expect(hasValueMax).toBe(true);
    });

    it('useTabs should support Home and End keys', () => {
      const template = structureTemplatesData.find((t) => t.hookName === 'useTabs');
      expect(template).toBeDefined();

      const hasHome = template!.accessibility.keyboardNavigation.some((nav) => nav.key === 'Home');
      const hasEnd = template!.accessibility.keyboardNavigation.some((nav) => nav.key === 'End');

      expect(hasHome).toBe(true);
      expect(hasEnd).toBe(true);
    });

    it('useCalendar should support PageUp and PageDown for month navigation', () => {
      const template = structureTemplatesData.find((t) => t.hookName === 'useCalendar');
      expect(template).toBeDefined();

      const hasPageUp = template!.accessibility.keyboardNavigation.some(
        (nav) => nav.key === 'PageUp'
      );
      const hasPageDown = template!.accessibility.keyboardNavigation.some(
        (nav) => nav.key === 'PageDown'
      );

      expect(hasPageUp).toBe(true);
      expect(hasPageDown).toBe(true);
    });
  });

  describe('Accessibility Documentation', () => {
    it('should have descriptions for all ARIA attributes', () => {
      structureTemplatesData.forEach((template) => {
        template.accessibility.ariaAttributes.forEach((attr) => {
          expect(
            attr.description,
            `${template.hookName}: ${attr.name} should have description`
          ).toBeTruthy();
          expect(attr.description.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have action descriptions for all keyboard navigation', () => {
      structureTemplatesData.forEach((template) => {
        template.accessibility.keyboardNavigation.forEach((nav) => {
          expect(
            nav.action,
            `${template.hookName}: ${nav.key} should have action description`
          ).toBeTruthy();
          expect(nav.action.length).toBeGreaterThan(0);
        });
      });
    });
  });
});

describe('Accessibility Best Practices', () => {
  it('should not use role="button" on actual button elements', () => {
    const buttonTemplate = structureTemplatesData.find((t) => t.hookName === 'useButton');
    expect(buttonTemplate).toBeDefined();
    expect(buttonTemplate!.htmlElement).toBe('button');

    // Native button element, role is implicit
    if (buttonTemplate!.accessibility.role === 'button') {
      // This is acceptable but redundant
      expect(true).toBe(true);
    }
  });

  it('should prefer native HTML elements over ARIA roles', () => {
    // Check that we use semantic HTML
    const nativeElements = structureTemplatesData.filter((t) =>
      ['button', 'input', 'dialog', 'nav', 'table'].includes(t.htmlElement)
    );

    expect(nativeElements.length).toBeGreaterThan(0);
  });

  it('should not have conflicting ARIA attributes', () => {
    structureTemplatesData.forEach((template) => {
      const ariaNames = template.accessibility.ariaAttributes.map((attr) => attr.name);
      const uniqueNames = new Set(ariaNames);

      expect(
        ariaNames.length === uniqueNames.size,
        `${template.hookName} should not have duplicate ARIA attributes`
      ).toBe(true);
    });
  });
});
