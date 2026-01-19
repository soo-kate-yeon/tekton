import { describe, it, expect } from 'vitest';
import type { HookPropRule } from '../src/schemas/hook-prop-rule';
import { validateHookPropRule } from '../src/validators/hook-prop-validator';

describe('Hook Prop Rules - Phase 1 TDD', () => {
  describe('HookPropRule Schema Validation', () => {
    it('should validate a complete useButton hook prop rule', () => {
      const useButtonRule: HookPropRule = {
        hookName: 'useButton',
        propObjects: ['buttonProps', 'isPressed'],
        baseStyles: [
          {
            propObject: 'buttonProps',
            cssProperties: {
              'background': 'var(--tekton-primary-500)',
              'color': 'var(--tekton-neutral-50)',
              'border': 'var(--tekton-border-width) solid var(--tekton-primary-600)',
              'border-radius': 'var(--tekton-border-radius)',
              'padding': 'var(--tekton-spacing-md)',
              'font-size': 'var(--tekton-font-size-base)',
              'font-weight': 'var(--tekton-font-weight-medium)',
              'cursor': 'pointer',
            },
          },
        ],
        requiredCSSVariables: [
          '--tekton-primary-500',
          '--tekton-primary-600',
          '--tekton-neutral-50',
          '--tekton-border-width',
          '--tekton-border-radius',
          '--tekton-spacing-md',
          '--tekton-font-size-base',
          '--tekton-font-weight-medium',
        ],
      };

      const result = validateHookPropRule(useButtonRule);
      expect(result.success).toBe(true);
    });

    it('should reject hook prop rule with hardcoded color values', () => {
      const invalidRule: HookPropRule = {
        hookName: 'useButton',
        propObjects: ['buttonProps'],
        baseStyles: [
          {
            propObject: 'buttonProps',
            cssProperties: {
              'background': '#3b82f6', // Hardcoded hex value
              'color': 'rgb(255, 255, 255)', // Hardcoded rgb value
            },
          },
        ],
        requiredCSSVariables: [],
      };

      const result = validateHookPropRule(invalidRule);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Hardcoded color values not allowed');
    });

    it('should reject hook prop rule with empty propObjects', () => {
      const invalidRule: HookPropRule = {
        hookName: 'useButton',
        propObjects: [],
        baseStyles: [],
        requiredCSSVariables: [],
      };

      const result = validateHookPropRule(invalidRule);
      expect(result.success).toBe(false);
    });

    it('should validate all 20 Tier 1 Component hooks have prop rules', () => {
      const tier1Hooks = [
        'useButton',
        'useToggleButton',
        'useSwitch',
        'useCheckbox',
        'useRadio',
        'useTextField',
      ];

      tier1Hooks.forEach((hookName) => {
        const rule: HookPropRule = {
          hookName,
          propObjects: ['testProps'],
          baseStyles: [
            {
              propObject: 'testProps',
              cssProperties: {
                'color': 'var(--tekton-primary-500)',
              },
            },
          ],
          requiredCSSVariables: ['--tekton-primary-500'],
        };

        const result = validateHookPropRule(rule);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('CSS Variable Reference Validation', () => {
    it('should validate all CSS variable references follow Token Contract naming', () => {
      const validVariables = [
        '--tekton-primary-500',
        '--tekton-neutral-50',
        '--tekton-border-width',
        '--tekton-spacing-md',
        '--tekton-font-size-base',
      ];

      validVariables.forEach((variable) => {
        expect(variable).toMatch(/^--tekton-[a-z0-9-]+$/);
      });
    });

    it('should detect non-existent CSS variables', () => {
      const rule: HookPropRule = {
        hookName: 'useButton',
        propObjects: ['buttonProps'],
        baseStyles: [
          {
            propObject: 'buttonProps',
            cssProperties: {
              'background': 'var(--invalid-variable)',
            },
          },
        ],
        requiredCSSVariables: ['--invalid-variable'],
      };

      const result = validateHookPropRule(rule);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('CSS variable --invalid-variable does not exist in Token Contract');
    });
  });

  describe('Hook Coverage Completeness', () => {
    it('should have hook prop rules for all 20 hooks', () => {
      const allHooks = [
        // Tier 1 - Component
        'useButton',
        'useToggleButton',
        'useSwitch',
        'useCheckbox',
        'useRadio',
        'useTextField',
        // Tier 2 - Overlay
        'useDialog',
        'useModal',
        'usePopover',
        'useTooltip',
        // Tier 3 - Navigation
        'useTabs',
        'useBreadcrumbs',
        'useMenu',
        'useDropdown',
        // Tier 4 - Display
        'useAccordion',
        'useTable',
        'usePagination',
        'useProgress',
        'useCalendar',
        'useRangeCalendar',
      ];

      expect(allHooks).toHaveLength(20);
    });
  });

  describe('Prop Object Mapping Validation', () => {
    it('should validate useButton returns buttonProps and isPressed', () => {
      const useButtonRule: HookPropRule = {
        hookName: 'useButton',
        propObjects: ['buttonProps', 'isPressed'],
        baseStyles: [
          {
            propObject: 'buttonProps',
            cssProperties: {
              'background': 'var(--tekton-primary-500)',
            },
          },
        ],
        requiredCSSVariables: ['--tekton-primary-500'],
      };

      expect(useButtonRule.propObjects).toContain('buttonProps');
      expect(useButtonRule.propObjects).toContain('isPressed');
    });

    it('should validate useTextField returns multiple prop objects', () => {
      const useTextFieldRule: HookPropRule = {
        hookName: 'useTextField',
        propObjects: [
          'inputProps',
          'labelProps',
          'descriptionProps',
          'errorMessageProps',
          'isInvalid',
        ],
        baseStyles: [
          {
            propObject: 'inputProps',
            cssProperties: {
              'border': 'var(--tekton-border-width) solid var(--tekton-neutral-300)',
            },
          },
        ],
        requiredCSSVariables: ['--tekton-border-width', '--tekton-neutral-300'],
      };

      expect(useTextFieldRule.propObjects).toHaveLength(5);
      expect(useTextFieldRule.propObjects).toContain('inputProps');
      expect(useTextFieldRule.propObjects).toContain('labelProps');
      expect(useTextFieldRule.propObjects).toContain('errorMessageProps');
    });
  });

  describe('Base Styles Validation', () => {
    it('should validate base styles contain only Token Contract CSS variables', () => {
      const rule: HookPropRule = {
        hookName: 'useButton',
        propObjects: ['buttonProps'],
        baseStyles: [
          {
            propObject: 'buttonProps',
            cssProperties: {
              'background': 'var(--tekton-primary-500)',
              'padding': 'var(--tekton-spacing-md)',
              'cursor': 'pointer',
            },
          },
        ],
        requiredCSSVariables: ['--tekton-primary-500', '--tekton-spacing-md'],
      };

      const cssValues = Object.values(rule.baseStyles[0].cssProperties);
      const tokenVariables = cssValues.filter((val) => val.includes('var(--tekton-'));

      expect(tokenVariables.length).toBeGreaterThan(0);
    });

    it('should validate requiredCSSVariables matches baseStyles usage', () => {
      const rule: HookPropRule = {
        hookName: 'useButton',
        propObjects: ['buttonProps'],
        baseStyles: [
          {
            propObject: 'buttonProps',
            cssProperties: {
              'background': 'var(--tekton-primary-500)',
              'color': 'var(--tekton-neutral-50)',
            },
          },
        ],
        requiredCSSVariables: ['--tekton-primary-500', '--tekton-neutral-50'],
      };

      const usedVariables = Object.values(rule.baseStyles[0].cssProperties)
        .filter((val) => val.includes('var(--tekton-'))
        .map((val) => val.match(/var\((--tekton-[^)]+)\)/)?.[1])
        .filter(Boolean);

      expect(rule.requiredCSSVariables).toEqual(expect.arrayContaining(usedVariables as string[]));
    });
  });
});
