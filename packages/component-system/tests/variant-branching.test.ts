/**
 * @file variant-branching.test.ts
 * @description Tests for variant branching system that defines conditional styling logic
 * based on hook configuration options
 */

import { describe, it, expect } from 'vitest';
import type { VariantBranching } from '../src/schemas/variant-branching';
import { isVariantBranching } from '../src/schemas/variant-branching';
import { variantBranchingData } from '../src/data/variant-branching';
import { VariantValidator } from '../src/validators/variant-validator';

describe('Variant Branching Schema', () => {
  it('should define variant branching schema with required fields', () => {
    const schema: VariantBranching = {
      hookName: 'useButton',
      configurationOptions: [
        {
          optionName: 'variant',
          optionType: 'enum',
          possibleValues: ['primary', 'secondary'],
          styleRules: [
            {
              condition: "variant === 'primary'",
              cssProperties: {
                background: 'var(--tekton-primary-500)',
              },
            },
          ],
        },
      ],
    };

    expect(schema).toBeDefined();
    expect(schema.hookName).toBe('useButton');
    expect(schema.configurationOptions).toHaveLength(1);
  });

  it('should support boolean configuration options', () => {
    const schema: VariantBranching = {
      hookName: 'useButton',
      configurationOptions: [
        {
          optionName: 'toggle',
          optionType: 'boolean',
          possibleValues: [true, false],
          styleRules: [
            {
              condition: 'toggle === true',
              cssProperties: {
                background: 'var(--tekton-neutral-200)',
              },
            },
          ],
        },
      ],
    };

    expect(schema.configurationOptions[0].optionType).toBe('boolean');
    expect(schema.configurationOptions[0].possibleValues).toEqual([
      true,
      false,
    ]);
  });

  it('should support enum configuration options', () => {
    const schema: VariantBranching = {
      hookName: 'useButton',
      configurationOptions: [
        {
          optionName: 'variant',
          optionType: 'enum',
          possibleValues: ['primary', 'secondary', 'warning', 'danger'],
          styleRules: [
            {
              condition: "variant === 'primary'",
              cssProperties: {
                background: 'var(--tekton-primary-500)',
              },
            },
          ],
        },
      ],
    };

    expect(schema.configurationOptions[0].optionType).toBe('enum');
    expect(schema.configurationOptions[0].possibleValues).toHaveLength(4);
  });

  it('should support string configuration options', () => {
    const schema: VariantBranching = {
      hookName: 'useTextField',
      configurationOptions: [
        {
          optionName: 'size',
          optionType: 'string',
          possibleValues: ['sm', 'md', 'lg'],
          styleRules: [
            {
              condition: "size === 'md'",
              cssProperties: {
                padding: 'var(--tekton-spacing-md)',
              },
            },
          ],
        },
      ],
    };

    expect(schema.configurationOptions[0].optionType).toBe('string');
  });
});

describe('Variant Branching Data', () => {
  it('should include variant rules for all 20 hooks', () => {
    const hookNames = variantBranchingData.map((rule) => rule.hookName);

    // Tier 1 - Component Hooks
    expect(hookNames).toContain('useButton');
    expect(hookNames).toContain('useToggleButton');
    expect(hookNames).toContain('useSwitch');
    expect(hookNames).toContain('useCheckbox');
    expect(hookNames).toContain('useRadio');
    expect(hookNames).toContain('useTextField');

    // Tier 2 - Overlay Hooks
    expect(hookNames).toContain('useDialog');
    expect(hookNames).toContain('useModal');
    expect(hookNames).toContain('usePopover');
    expect(hookNames).toContain('useTooltip');

    // Tier 3 - Navigation Hooks
    expect(hookNames).toContain('useTabs');
    expect(hookNames).toContain('useBreadcrumbs');
    expect(hookNames).toContain('useMenu');
    expect(hookNames).toContain('useDropdown');

    // Tier 4 - Display Hooks
    expect(hookNames).toContain('useAccordion');
    expect(hookNames).toContain('useTable');
    expect(hookNames).toContain('usePagination');
    expect(hookNames).toContain('useProgress');
    expect(hookNames).toContain('useCalendar');
    expect(hookNames).toContain('useRangeCalendar');

    expect(variantBranchingData).toHaveLength(20);
  });

  it('should define variant branching for useButton with toggle option', () => {
    const buttonVariants = variantBranchingData.find(
      (rule) => rule.hookName === 'useButton'
    );

    expect(buttonVariants).toBeDefined();
    expect(buttonVariants?.configurationOptions).toBeDefined();

    const toggleOption = buttonVariants?.configurationOptions.find(
      (opt) => opt.optionName === 'toggle'
    );
    expect(toggleOption).toBeDefined();
    expect(toggleOption?.optionType).toBe('boolean');
    expect(toggleOption?.possibleValues).toEqual([true, false]);
  });

  it('should define variant branching for useButton with variant option', () => {
    const buttonVariants = variantBranchingData.find(
      (rule) => rule.hookName === 'useButton'
    );

    const variantOption = buttonVariants?.configurationOptions.find(
      (opt) => opt.optionName === 'variant'
    );
    expect(variantOption).toBeDefined();
    expect(variantOption?.optionType).toBe('enum');
    expect(variantOption?.possibleValues).toContain('primary');
    expect(variantOption?.possibleValues).toContain('secondary');
    expect(variantOption?.possibleValues).toContain('warning');
    expect(variantOption?.possibleValues).toContain('danger');
  });

  it('should define variant branching for useButton with disabled option', () => {
    const buttonVariants = variantBranchingData.find(
      (rule) => rule.hookName === 'useButton'
    );

    const disabledOption = buttonVariants?.configurationOptions.find(
      (opt) => opt.optionName === 'disabled'
    );
    expect(disabledOption).toBeDefined();
    expect(disabledOption?.optionType).toBe('boolean');
  });

  it('should reference only Token Contract CSS variables in style rules', () => {
    for (const variantRule of variantBranchingData) {
      for (const option of variantRule.configurationOptions) {
        for (const styleRule of option.styleRules) {
          for (const [_prop, value] of Object.entries(
            styleRule.cssProperties
          )) {
            if (typeof value === 'string' && value.includes('var(')) {
              expect(value).toMatch(/var\(--tekton-/);
            }
          }
        }
      }
    }
  });
});

describe('VariantValidator', () => {
  const validator = new VariantValidator();

  it('should validate variant branching rules successfully', () => {
    const validRule: VariantBranching = {
      hookName: 'useButton',
      configurationOptions: [
        {
          optionName: 'variant',
          optionType: 'enum',
          possibleValues: ['primary', 'secondary'],
          styleRules: [
            {
              condition: "variant === 'primary'",
              cssProperties: {
                background: 'var(--tekton-primary-500)',
                color: 'white',
              },
            },
          ],
        },
      ],
    };

    const result = validator.validate(validRule);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject rules with hardcoded hex color values', () => {
    const invalidRule: VariantBranching = {
      hookName: 'useButton',
      configurationOptions: [
        {
          optionName: 'variant',
          optionType: 'enum',
          possibleValues: ['primary'],
          styleRules: [
            {
              condition: "variant === 'primary'",
              cssProperties: {
                background: '#ff0000', // Hardcoded value
              },
            },
          ],
        },
      ],
    };

    const result = validator.validate(invalidRule);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('hardcoded');
  });

  it('should reject rules with hardcoded rgb color values', () => {
    const invalidRule: VariantBranching = {
      hookName: 'useButton',
      configurationOptions: [
        {
          optionName: 'variant',
          optionType: 'enum',
          possibleValues: ['primary'],
          styleRules: [
            {
              condition: "variant === 'primary'",
              cssProperties: {
                background: 'rgb(255, 0, 0)', // Hardcoded value
              },
            },
          ],
        },
      ],
    };

    const result = validator.validate(invalidRule);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('rgb'))).toBe(true);
  });

  it('should reject rules with hardcoded hsl color values', () => {
    const invalidRule: VariantBranching = {
      hookName: 'useButton',
      configurationOptions: [
        {
          optionName: 'variant',
          optionType: 'enum',
          possibleValues: ['primary'],
          styleRules: [
            {
              condition: "variant === 'primary'",
              cssProperties: {
                background: 'hsl(0, 100%, 50%)', // Hardcoded value
              },
            },
          ],
        },
      ],
    };

    const result = validator.validate(invalidRule);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('hsl'))).toBe(true);
  });

  it('should reject rules with non-Token Contract CSS variables', () => {
    const invalidRule: VariantBranching = {
      hookName: 'useButton',
      configurationOptions: [
        {
          optionName: 'variant',
          optionType: 'enum',
          possibleValues: ['primary'],
          styleRules: [
            {
              condition: "variant === 'primary'",
              cssProperties: {
                background: 'var(--custom-color)', // Non-Token Contract variable
              },
            },
          ],
        },
      ],
    };

    const result = validator.validate(invalidRule);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('--tekton-'))).toBe(true);
  });

  it('should reject rules with missing hookName', () => {
    const invalidRule = {
      configurationOptions: [],
    } as any;

    const result = validator.validate(invalidRule);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('hookName'))).toBe(true);
  });

  it('should reject rules with invalid optionType', () => {
    const invalidRule: any = {
      hookName: 'useButton',
      configurationOptions: [
        {
          optionName: 'variant',
          optionType: 'invalid', // Invalid type
          possibleValues: ['primary'],
          styleRules: [],
        },
      ],
    };

    const result = validator.validate(invalidRule);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('optionType'))).toBe(true);
  });

  it('should reject rules with missing possibleValues', () => {
    const invalidRule: any = {
      hookName: 'useButton',
      configurationOptions: [
        {
          optionName: 'variant',
          optionType: 'enum',
          // Missing possibleValues
          styleRules: [],
        },
      ],
    };

    const result = validator.validate(invalidRule);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('possibleValues'))).toBe(true);
  });

  it('should reject rules with invalid styleRules', () => {
    const invalidRule: any = {
      hookName: 'useButton',
      configurationOptions: [
        {
          optionName: 'variant',
          optionType: 'enum',
          possibleValues: ['primary'],
          styleRules: 'not-an-array', // Invalid
        },
      ],
    };

    const result = validator.validate(invalidRule);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('styleRules'))).toBe(true);
  });

  it('should reject rules with missing condition', () => {
    const invalidRule: any = {
      hookName: 'useButton',
      configurationOptions: [
        {
          optionName: 'variant',
          optionType: 'enum',
          possibleValues: ['primary'],
          styleRules: [
            {
              // Missing condition
              cssProperties: {
                background: 'var(--tekton-primary-500)',
              },
            },
          ],
        },
      ],
    };

    const result = validator.validate(invalidRule);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('condition'))).toBe(true);
  });

  it('should reject rules with invalid cssProperties type', () => {
    const invalidRule: any = {
      hookName: 'useButton',
      configurationOptions: [
        {
          optionName: 'variant',
          optionType: 'enum',
          possibleValues: ['primary'],
          styleRules: [
            {
              condition: "variant === 'primary'",
              cssProperties: 'not-an-object', // Invalid
            },
          ],
        },
      ],
    };

    const result = validator.validate(invalidRule);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('cssProperties'))).toBe(true);
  });

  it('should reject rules with non-string CSS property values', () => {
    const invalidRule: any = {
      hookName: 'useButton',
      configurationOptions: [
        {
          optionName: 'variant',
          optionType: 'enum',
          possibleValues: ['primary'],
          styleRules: [
            {
              condition: "variant === 'primary'",
              cssProperties: {
                background: 123, // Non-string value
              },
            },
          ],
        },
      ],
    };

    const result = validator.validate(invalidRule);
    expect(result.valid).toBe(false);
  });

  it('should validate all variant branching data from file', () => {
    for (const rule of variantBranchingData) {
      const result = validator.validate(rule);
      expect(result.valid).toBe(true);
    }
  });

  it('should validate complex multi-condition rules', () => {
    const complexRule: VariantBranching = {
      hookName: 'useButton',
      configurationOptions: [
        {
          optionName: 'toggle',
          optionType: 'boolean',
          possibleValues: [true, false],
          styleRules: [
            {
              condition: 'toggle === true && isSelected === false',
              cssProperties: {
                background: 'var(--tekton-neutral-200)',
              },
            },
            {
              condition: 'toggle === true && isSelected === true',
              cssProperties: {
                background: 'var(--tekton-primary-500)',
              },
            },
          ],
        },
      ],
    };

    const result = validator.validate(complexRule);
    expect(result.valid).toBe(true);
  });

  it('should validate decision trees for hooks with multiple configuration options', () => {
    const complexHook = variantBranchingData.find(
      (rule) => rule.configurationOptions.length >= 3
    );

    if (complexHook) {
      const result = validator.validate(complexHook);
      expect(result.valid).toBe(true);
    }
  });

  it('should validate all rules using validateAll method', () => {
    const result = validator.validateAll(variantBranchingData);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should collect all errors when validating multiple invalid rules', () => {
    const invalidRules: any[] = [
      {
        hookName: 'useButton',
        // Missing configurationOptions
      },
      {
        hookName: 'useSwitch',
        configurationOptions: [
          {
            optionName: 'variant',
            optionType: 'invalid',
            possibleValues: [],
            styleRules: [],
          },
        ],
      },
    ];

    const result = validator.validateAll(invalidRules);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe('Type Guards', () => {
  it('should correctly identify valid VariantBranching objects', () => {
    const valid: VariantBranching = {
      hookName: 'useButton',
      configurationOptions: [],
    };

    expect(isVariantBranching(valid)).toBe(true);
  });

  it('should reject null values', () => {
    expect(isVariantBranching(null)).toBe(false);
  });

  it('should reject undefined values', () => {
    expect(isVariantBranching(undefined)).toBe(false);
  });

  it('should reject objects without hookName', () => {
    const invalid = {
      configurationOptions: [],
    };

    expect(isVariantBranching(invalid)).toBe(false);
  });

  it('should reject objects without configurationOptions', () => {
    const invalid = {
      hookName: 'useButton',
    };

    expect(isVariantBranching(invalid)).toBe(false);
  });

  it('should reject primitive values', () => {
    expect(isVariantBranching('string')).toBe(false);
    expect(isVariantBranching(123)).toBe(false);
    expect(isVariantBranching(true)).toBe(false);
  });

  it('should reject arrays', () => {
    expect(isVariantBranching([])).toBe(false);
  });
});
