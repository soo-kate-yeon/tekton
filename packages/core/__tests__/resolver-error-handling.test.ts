/**
 * @tekton/core - Resolver Error Handling Tests
 * Phase A: Error handling tests for coverage improvement
 * [SPEC-LAYOUT-002] [PHASE-2]
 *
 * Target: +15% coverage through comprehensive error path testing
 * Focus: component-resolver.ts (59.85%), layout-resolver.ts (57.14%), token-resolver.ts (54.02%)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  resolveComponent,
  type ComponentContext,
} from '../src/screen-generation/resolver/component-resolver.js';
import {
  resolveShell,
  resolvePage,
  resolveSection,
  type LayoutContext,
} from '../src/screen-generation/resolver/layout-resolver.js';
import {
  substituteTemplateVariables,
  resolveBindings,
  type TokenBindingContext,
} from '../src/screen-generation/resolver/token-resolver.js';
import type { ComponentDefinition, ComponentType } from '../src/screen-generation/types.js';
import type { TokenBindings } from '../src/component-schemas.js';
import { clearScreenCache } from '../src/screen-generation/resolver/index.js';

// ============================================================================
// Test Setup
// ============================================================================

describe('Resolver Error Handling', () => {
  beforeEach(() => {
    // Clear cache before each test to ensure fresh error handling
    clearScreenCache();
  });

  // ==========================================================================
  // 1. Unknown Component Type Errors (3 tests)
  // ==========================================================================

  describe('Unknown Component Type Errors', () => {
    it('should throw error for unknown component type with helpful list of available types', () => {
      const unknownComponent: ComponentDefinition = {
        type: 'UnknownWidget' as ComponentType, // Intentionally invalid for error testing
        props: {
          value: 'test',
        },
      };

      const context: ComponentContext = {
        theme: 'default',
        screenId: 'test-screen',
      };

      expect(() => resolveComponent(unknownComponent, context)).toThrow(
        /Unknown component type 'UnknownWidget'/
      );
      expect(() => resolveComponent(unknownComponent, context)).toThrow(
        /Available types: Button, Input, Text, Heading/
      );
    });

    it('should include screen context in unknown component error message', () => {
      const unknownComponent: ComponentDefinition = {
        type: 'CustomComponent' as ComponentType, // Intentionally invalid for error testing
        props: {},
      };

      const context: ComponentContext = {
        theme: 'default',
        screenId: 'dashboard-screen',
      };

      expect(() => resolveComponent(unknownComponent, context)).toThrow(
        /screen 'dashboard-screen'/
      );
    });

    it('should include section context in unknown component error when resolving within section', () => {
      const unknownComponent: ComponentDefinition = {
        type: 'InvalidType' as ComponentType, // Intentionally invalid for error testing
        props: {},
      };

      const context: ComponentContext = {
        theme: 'default',
        screenId: 'test-screen',
        sectionId: 'hero-section',
      };

      expect(() => resolveComponent(unknownComponent, context)).toThrow(
        /Unknown component type 'InvalidType'/
      );
      expect(() => resolveComponent(unknownComponent, context)).toThrow(/screen 'test-screen'/);
    });
  });

  // ==========================================================================
  // 2. Invalid Token ID Errors (4 tests)
  // ==========================================================================

  describe('Invalid Token ID Errors', () => {
    it('should throw error for invalid shell token format with available shells list', () => {
      const context: LayoutContext = {
        screenId: 'test-screen',
        layoutType: 'shell',
      };

      // Invalid format: missing proper namespace
      expect(() => resolveShell('shell.invalid.nonexistent', context)).toThrow(
        /Failed to resolve shell 'shell.invalid.nonexistent'/
      );
      expect(() => resolveShell('shell.invalid.nonexistent', context)).toThrow(
        /Available shells: shell.web.dashboard, shell.web.settings/
      );
    });

    it('should throw error for invalid page token format with available pages list', () => {
      const context: LayoutContext = {
        screenId: 'test-screen',
        layoutType: 'page',
      };

      // Non-existent page
      expect(() => resolvePage('page.nonexistent', context)).toThrow(
        /Failed to resolve page 'page.nonexistent'/
      );
      expect(() => resolvePage('page.nonexistent', context)).toThrow(
        /Available pages: page.dashboard, page.detail, page.list/
      );
    });

    it('should throw error for invalid section token format with available sections list', () => {
      const context: LayoutContext = {
        screenId: 'test-screen',
        layoutType: 'section',
        meta: {
          sectionId: 'main-section',
          sectionIndex: 0,
        },
      };

      // Non-existent section pattern
      expect(() => resolveSection('section.invalid-pattern', context)).toThrow(
        /Failed to resolve section 'section.invalid-pattern'/
      );
      expect(() => resolveSection('section.invalid-pattern', context)).toThrow(
        /Available sections: section.grid-2, section.grid-3, section.grid-4/
      );
      expect(() => resolveSection('section.invalid-pattern', context)).toThrow(
        /section 'main-section' at index 0/
      );
    });

    it('should include helpful error message for malformed layout token ID', () => {
      const context: LayoutContext = {
        screenId: 'test-screen',
        layoutType: 'shell',
      };

      // Completely invalid format
      expect(() => resolveShell('invalid-token-format', context)).toThrow(
        /Failed to resolve shell/
      );
    });
  });

  // ==========================================================================
  // 3. Template Variable Errors (4 tests)
  // ==========================================================================

  describe('Template Variable Errors', () => {
    it('should throw error for missing template variable in token binding', () => {
      const binding = 'component.button.{variant}.background';
      const props = {
        size: 'medium',
        // variant is missing
      };

      expect(() => substituteTemplateVariables(binding, props)).toThrow(
        /Template variable 'variant' not found in props/
      );
      expect(() => substituteTemplateVariables(binding, props)).toThrow(/Available props: size/);
    });

    it('should throw error for undefined context key in template variable substitution', () => {
      const binding = 'atomic.spacing.{size}';
      const props = {
        variant: 'primary',
        // size is missing
      };

      expect(() => substituteTemplateVariables(binding, props)).toThrow(
        /Template variable 'size' not found in props/
      );
      expect(() => substituteTemplateVariables(binding, props)).toThrow(/Available props: variant/);
    });

    it('should report multiple missing template variables together', () => {
      const bindings: TokenBindings = {
        background: 'component.button.{variant}.background',
        padding: 'atomic.spacing.{size}',
      };

      const context: TokenBindingContext = {
        props: {
          disabled: false,
          // variant and size are both missing
        },
        theme: 'default',
      };

      // First binding will fail with variant error
      expect(() => resolveBindings(bindings, context)).toThrow(
        /Template variable 'variant' not found/
      );
    });

    it('should throw error for invalid template variable type', () => {
      const binding = 'component.button.{variant}.background';
      const props = {
        variant: { complex: 'object' }, // Must be string or number
      };

      expect(() => substituteTemplateVariables(binding, props)).toThrow(
        /Template variable 'variant' must be string or number/
      );
      expect(() => substituteTemplateVariables(binding, props)).toThrow(/got object/);
    });
  });

  // ==========================================================================
  // 4. Layout Resolution Errors (4 tests)
  // ==========================================================================

  describe('Layout Resolution Errors', () => {
    it('should throw error when shell token not found in layout-tokens', () => {
      const context: LayoutContext = {
        screenId: 'my-screen',
        layoutType: 'shell',
      };

      // Non-existent shell token
      expect(() => resolveShell('shell.web.nonexistent', context)).toThrow(
        /Failed to resolve shell 'shell.web.nonexistent'/
      );
      expect(() => resolveShell('shell.web.nonexistent', context)).toThrow(
        /for screen 'my-screen'/
      );
    });

    it('should throw error when page token not found in layout-tokens', () => {
      const context: LayoutContext = {
        screenId: 'my-screen',
        layoutType: 'page',
      };

      // Non-existent page token
      expect(() => resolvePage('page.nonexistent-page', context)).toThrow(
        /Failed to resolve page 'page.nonexistent-page'/
      );
      expect(() => resolvePage('page.nonexistent-page', context)).toThrow(/for screen 'my-screen'/);
    });

    it('should throw error when section token not found in layout-tokens', () => {
      const context: LayoutContext = {
        screenId: 'my-screen',
        layoutType: 'section',
        meta: {
          sectionId: 'content',
          sectionIndex: 1,
        },
      };

      // Non-existent section pattern
      expect(() => resolveSection('section.nonexistent', context)).toThrow(
        /Failed to resolve section 'section.nonexistent'/
      );
      expect(() => resolveSection('section.nonexistent', context)).toThrow(
        /for screen 'my-screen'/
      );
      expect(() => resolveSection('section.nonexistent', context)).toThrow(
        /section 'content' at index 1/
      );
    });

    it('should include context information in section resolution error messages', () => {
      const context: LayoutContext = {
        screenId: 'dashboard',
        layoutType: 'section',
        meta: {
          sectionId: 'stats-section',
          sectionIndex: 0,
        },
      };

      expect(() => resolveSection('section.invalid', context)).toThrow(
        /section 'stats-section' at index 0/
      );
    });
  });

  // ==========================================================================
  // 5. Component Props Resolution Errors (Additional Coverage)
  // ==========================================================================

  describe('Component Props Resolution Errors', () => {
    it('should throw error for missing required prop in component', () => {
      const invalidComponent: ComponentDefinition = {
        type: 'Button',
        props: {
          variant: 'primary',
          // children is required but missing
        },
      };

      const context: ComponentContext = {
        theme: 'default',
        screenId: 'test-screen',
      };

      expect(() => resolveComponent(invalidComponent, context)).toThrow(
        /Required prop 'children' is missing/
      );
      expect(() => resolveComponent(invalidComponent, context)).toThrow(/for component 'Button'/);
    });

    it('should provide helpful error context when component resolution fails in section', () => {
      const invalidComponent: ComponentDefinition = {
        type: 'Input',
        props: {
          // type prop has default, but testing error context
        },
      };

      const context: ComponentContext = {
        theme: 'default',
        screenId: 'form-screen',
        sectionId: 'input-section',
      };

      // Input doesn't have required props that would fail, so this should succeed
      const resolved = resolveComponent(invalidComponent, context);
      expect(resolved).toBeDefined();
      expect(resolved.type).toBe('Input');
    });
  });

  // ==========================================================================
  // 6. Token Binding Resolution Errors (Additional Coverage)
  // ==========================================================================

  describe('Token Binding Resolution Errors', () => {
    it('should throw error with property name when token binding resolution fails', () => {
      const bindings: TokenBindings = {
        background: 'component.button.{variant}.background',
        foreground: 'component.button.{variant}.foreground',
      };

      const context: TokenBindingContext = {
        props: {
          size: 'medium',
          // variant is missing, causing resolution to fail
        },
        theme: 'default',
      };

      expect(() => resolveBindings(bindings, context)).toThrow(
        /Failed to resolve token binding for property/
      );
      expect(() => resolveBindings(bindings, context)).toThrow(
        /Template variable 'variant' not found/
      );
    });

    it('should handle multiple template variables in single binding', () => {
      const binding = 'component.{type}.{variant}.{state}.color';
      const props = {
        type: 'button',
        variant: 'primary',
        // state is missing
      };

      expect(() => substituteTemplateVariables(binding, props)).toThrow(
        /Template variable 'state' not found/
      );
    });
  });

  // ==========================================================================
  // 7. Edge Cases and Integration Errors
  // ==========================================================================

  describe('Edge Cases and Integration Errors', () => {
    it('should handle error when resolving component with children that have invalid types', () => {
      const parentComponent: ComponentDefinition = {
        type: 'Card',
        props: {},
        children: [
          {
            type: 'InvalidChild' as ComponentType, // Intentionally invalid for error testing
            props: {},
          },
        ],
      };

      const context: ComponentContext = {
        theme: 'default',
        screenId: 'test-screen',
      };

      expect(() => resolveComponent(parentComponent, context)).toThrow(
        /Unknown component type 'InvalidChild'/
      );
    });

    it('should provide helpful error when required prop description is available', () => {
      const component: ComponentDefinition = {
        type: 'Link',
        props: {
          children: 'Click here',
          // href is required but missing
        },
      };

      const context: ComponentContext = {
        theme: 'default',
        screenId: 'test-screen',
      };

      expect(() => resolveComponent(component, context)).toThrow(/Required prop 'href' is missing/);
      expect(() => resolveComponent(component, context)).toThrow(/Link destination/); // Description from schema
    });
  });
});
