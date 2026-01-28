/**
 * @tekton/core - Resolver Utility Functions Tests
 * Phase B: Utility function tests for coverage improvement
 * [SPEC-LAYOUT-002] [PHASE-2]
 *
 * Target: +6.73% coverage to reach 85%+ total resolver coverage
 * Focus: Utility functions in component-resolver.ts, layout-resolver.ts, token-resolver.ts
 */

import { describe, it, expect } from 'vitest';
import {
  isValidComponentDefinition,
  extractComponentTypes,
} from '../src/screen-generation/resolver/component-resolver.js';
import {
  isValidShellToken,
  isValidPageToken,
  isValidSectionToken,
  parseLayoutType,
} from '../src/screen-generation/resolver/layout-resolver.js';
import {
  isValidTokenBinding,
  extractTemplateVariables,
  tokenRefToCSSVar,
  substituteTemplateVariables,
} from '../src/screen-generation/resolver/token-resolver.js';
import type { ComponentDefinition, ComponentType } from '../src/screen-generation/types.js';

// ============================================================================
// 1. Component Definition Validation (5 tests)
// ============================================================================

describe('Component Definition Validation', () => {
  it('should validate a complete valid component definition', () => {
    const validComponent: ComponentDefinition = {
      type: 'Button',
      props: { variant: 'primary', children: 'Click me' },
      children: [{ type: 'Text', props: { children: 'Label' } }],
      slot: 'main',
    };

    expect(isValidComponentDefinition(validComponent)).toBe(true);
  });

  it('should invalidate component definition with missing type field', () => {
    const invalidComponent = {
      props: { variant: 'primary' },
    };

    expect(isValidComponentDefinition(invalidComponent)).toBe(false);
  });

  it('should invalidate component definition with null or undefined props', () => {
    const nullPropsComponent = {
      type: 'Button',
      props: null,
    };

    const undefinedPropsComponent = {
      type: 'Button',
      props: undefined,
    };

    expect(isValidComponentDefinition(nullPropsComponent)).toBe(false);
    expect(isValidComponentDefinition(undefinedPropsComponent)).toBe(false);
  });

  it('should validate component with empty props object', () => {
    const emptyPropsComponent: ComponentDefinition = {
      type: 'Card',
      props: {},
    };

    expect(isValidComponentDefinition(emptyPropsComponent)).toBe(true);
  });

  it('should invalidate component with non-array children field', () => {
    const invalidChildren = {
      type: 'Card',
      props: {},
      children: 'not an array',
    };

    expect(isValidComponentDefinition(invalidChildren)).toBe(false);
  });
});

// ============================================================================
// 2. Component Type Extraction (4 tests)
// ============================================================================

describe('Component Type Extraction', () => {
  it('should extract types from flat component tree without children', () => {
    const component: ComponentDefinition = {
      type: 'Button',
      props: { variant: 'primary' },
    };

    const types = extractComponentTypes(component);

    expect(types).toEqual(new Set(['Button']));
    expect(types.size).toBe(1);
  });

  it('should extract types from nested component tree recursively', () => {
    const component: ComponentDefinition = {
      type: 'Card',
      props: {},
      children: [
        { type: 'Heading', props: { children: 'Title' } },
        { type: 'Text', props: { children: 'Content' } },
        {
          type: 'Button',
          props: { variant: 'primary' },
          children: [{ type: 'Text', props: { children: 'Submit' } }],
        },
      ],
    };

    const types = extractComponentTypes(component);

    expect(types).toEqual(new Set(['Card', 'Heading', 'Text', 'Button']));
    expect(types.size).toBe(4);
  });

  it('should handle deeply nested components (5+ levels)', () => {
    // Using type assertions for test-only component types to verify deep traversal
    const deepComponent: ComponentDefinition = {
      type: 'Card' as ComponentType,
      props: {},
      children: [
        {
          type: 'Text' as ComponentType,
          props: {},
          children: [
            {
              type: 'Badge' as ComponentType,
              props: {},
              children: [
                {
                  type: 'Avatar' as ComponentType,
                  props: {},
                  children: [
                    {
                      type: 'Button' as ComponentType,
                      props: {},
                      children: [{ type: 'Input' as ComponentType, props: {} }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const types = extractComponentTypes(deepComponent);

    expect(types).toEqual(new Set(['Card', 'Text', 'Badge', 'Avatar', 'Button', 'Input']));
    expect(types.size).toBe(6);
  });

  it('should handle mixed string and component children', () => {
    const mixedComponent: ComponentDefinition = {
      type: 'Card',
      props: {},
      children: [
        'Text content',
        { type: 'Heading', props: { children: 'Title' } },
        'More text',
        { type: 'Button', props: { children: 'Click' } },
      ],
    };

    const types = extractComponentTypes(mixedComponent);

    expect(types).toEqual(new Set(['Card', 'Heading', 'Button']));
    expect(types.size).toBe(3);
  });
});

// ============================================================================
// 3. Token Validation Utilities (6 tests)
// ============================================================================

describe('Token Validation Utilities', () => {
  describe('Shell Token Validation', () => {
    it('should validate valid shell tokens with correct format', () => {
      expect(isValidShellToken('shell.web.dashboard')).toBe(true);
      expect(isValidShellToken('shell.mobile.bottom-nav')).toBe(true);
      expect(isValidShellToken('shell.mobile.tabs')).toBe(true);
    });

    it('should invalidate shell tokens with incorrect format', () => {
      expect(isValidShellToken('page.dashboard')).toBe(false);
      expect(isValidShellToken('section.grid-4')).toBe(false);
      expect(isValidShellToken('shell.web')).toBe(false); // Too short
      expect(isValidShellToken('invalid')).toBe(false);
    });
  });

  describe('Page Token Validation', () => {
    it('should validate valid page layout tokens', () => {
      expect(isValidPageToken('page.dashboard')).toBe(true);
      expect(isValidPageToken('page.detail')).toBe(true);
      expect(isValidPageToken('page.settings')).toBe(true);
    });

    it('should invalidate page tokens with incorrect format', () => {
      expect(isValidPageToken('shell.web.dashboard')).toBe(false);
      expect(isValidPageToken('section.grid-4')).toBe(false);
      expect(isValidPageToken('page')).toBe(false); // Too short
      expect(isValidPageToken('invalid')).toBe(false);
    });
  });

  describe('Section Token Validation', () => {
    it('should validate valid section pattern tokens', () => {
      expect(isValidSectionToken('section.grid-4')).toBe(true);
      expect(isValidSectionToken('section.split-50-50')).toBe(true);
      expect(isValidSectionToken('section.container')).toBe(true);
    });

    it('should invalidate section tokens with incorrect format', () => {
      expect(isValidSectionToken('shell.web.dashboard')).toBe(false);
      expect(isValidSectionToken('page.dashboard')).toBe(false);
      expect(isValidSectionToken('section')).toBe(false); // Too short
      expect(isValidSectionToken('invalid')).toBe(false);
    });
  });
});

// ============================================================================
// 4. Layout Type Parsing (3 tests)
// ============================================================================

describe('Layout Type Parsing', () => {
  it('should correctly parse shell, page, and section layout types', () => {
    expect(parseLayoutType('shell.web.dashboard')).toBe('shell');
    expect(parseLayoutType('page.dashboard')).toBe('page');
    expect(parseLayoutType('section.grid-4')).toBe('section');
  });

  it('should return undefined for invalid layout ID formats', () => {
    expect(parseLayoutType('invalid')).toBeUndefined();
    expect(parseLayoutType('unknown.format')).toBeUndefined();
    expect(parseLayoutType('')).toBeUndefined();
  });

  it('should handle edge cases with partial matches', () => {
    // Should return undefined for incomplete tokens
    expect(parseLayoutType('shell.web')).toBeUndefined();
    expect(parseLayoutType('page')).toBeUndefined();
    expect(parseLayoutType('section')).toBeUndefined();
  });
});

// ============================================================================
// 5. Token Binding Validation (4 tests)
// ============================================================================

describe('Token Binding Validation', () => {
  it('should validate token bindings with valid layer prefixes', () => {
    expect(isValidTokenBinding('atomic.spacing.16')).toBe(true);
    expect(isValidTokenBinding('semantic.color.primary')).toBe(true);
    expect(isValidTokenBinding('component.button.primary.background')).toBe(true);
  });

  it('should validate token bindings with template variables', () => {
    expect(isValidTokenBinding('component.button.{variant}.background')).toBe(true);
    expect(isValidTokenBinding('atomic.spacing.{size}')).toBe(true);
    expect(isValidTokenBinding('semantic.color.{theme}.primary')).toBe(true);
  });

  it('should invalidate token bindings without valid layer prefix', () => {
    expect(isValidTokenBinding('invalid.spacing.16')).toBe(false);
    expect(isValidTokenBinding('spacing.16')).toBe(false);
    expect(isValidTokenBinding('16')).toBe(false);
  });

  it('should invalidate token bindings with malformed template syntax', () => {
    expect(isValidTokenBinding('component.button.{invalid var}.background')).toBe(false);
    expect(isValidTokenBinding('component.button.{123-invalid}.background')).toBe(false);
    expect(isValidTokenBinding('component.button.{invalid-name}.background')).toBe(false);
  });
});

// ============================================================================
// 6. Template Variable Operations (5 tests)
// ============================================================================

describe('Template Variable Operations', () => {
  describe('Extract Template Variables', () => {
    it('should extract multiple variables from single binding string', () => {
      const variables = extractTemplateVariables('component.button.{variant}.{size}.background');

      expect(variables).toEqual(['variant', 'size']);
      expect(variables.length).toBe(2);
    });

    it('should return empty array for bindings without template variables', () => {
      const variables = extractTemplateVariables('atomic.spacing.16');

      expect(variables).toEqual([]);
      expect(variables.length).toBe(0);
    });

    it('should handle nested template syntax edge cases', () => {
      const variables = extractTemplateVariables('component.{category}.{type}.{variant}');

      expect(variables).toEqual(['category', 'type', 'variant']);
      expect(variables.length).toBe(3);
    });
  });

  describe('Token Reference to CSS Variable Conversion', () => {
    it('should convert token reference to CSS variable format', () => {
      expect(tokenRefToCSSVar('atomic.spacing.16')).toBe('var(--atomic-spacing-16)');
      expect(tokenRefToCSSVar('semantic.color.primary')).toBe('var(--semantic-color-primary)');
      expect(tokenRefToCSSVar('component.button.primary.background')).toBe(
        'var(--component-button-primary-background)'
      );
    });

    it('should handle single-level token references', () => {
      expect(tokenRefToCSSVar('spacing.16')).toBe('var(--spacing-16)');
    });
  });

  describe('Substitute Template Variables', () => {
    it('should substitute template variables from props', () => {
      const result = substituteTemplateVariables('component.button.{variant}.background', {
        variant: 'primary',
      });

      expect(result).toBe('component.button.primary.background');
    });

    it('should throw error for missing template variable in props', () => {
      expect(() =>
        substituteTemplateVariables('component.button.{variant}.background', {})
      ).toThrow(/Template variable 'variant' not found in props/);
    });

    it('should handle multiple template variables', () => {
      const result = substituteTemplateVariables('component.button.{variant}.{size}.padding', {
        variant: 'primary',
        size: 'large',
      });

      expect(result).toBe('component.button.primary.large.padding');
    });

    it('should handle numeric template variable values', () => {
      const result = substituteTemplateVariables('atomic.spacing.{size}', { size: 16 });

      expect(result).toBe('atomic.spacing.16');
    });

    it('should throw error for non-string and non-number template values', () => {
      expect(() =>
        substituteTemplateVariables('component.button.{variant}.background', {
          variant: { complex: 'object' },
        })
      ).toThrow(/Template variable 'variant' must be string or number/);
    });
  });
});
