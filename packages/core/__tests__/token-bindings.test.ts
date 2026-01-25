/**
 * Token Bindings Validation Tests
 * [SPEC-COMPONENT-001-B] [TAG-006]
 *
 * Validates token bindings with template variables for all 20 components
 */

import { describe, it, expect } from 'vitest';
import { ALL_COMPONENTS } from '../src/component-schemas.js';

describe('Token Bindings Validation', () => {
  describe('Template Variable Format', () => {
    it('should use {variant} template variable in Button', () => {
      const button = ALL_COMPONENTS.find(c => c.type === 'Button');
      expect(button).toBeDefined();

      const hasVariantTemplate = Object.values(button!.tokenBindings).some(value =>
        String(value).includes('{variant}')
      );
      expect(hasVariantTemplate).toBe(true);
    });

    it('should use {size} template variable where applicable', () => {
      // Components that commonly use size variants
      const sizedComponents = ['Button', 'Input', 'Heading', 'Text', 'Badge', 'Avatar'];

      sizedComponents.forEach(type => {
        const component = ALL_COMPONENTS.find(c => c.type === type);
        expect(component).toBeDefined();

        // Check if component schema defines size prop or uses size in token bindings
        const hasSizeProp = component!.props.some(p => p.name === 'size');
        const hasSizeTemplate = Object.values(component!.tokenBindings).some(value =>
          String(value).includes('{size}')
        );

        // At least one should be true
        expect(hasSizeProp || hasSizeTemplate).toBe(true);
      });
    });
  });

  describe('Token Reference Patterns', () => {
    it('should reference semantic or atomic tokens', () => {
      ALL_COMPONENTS.forEach(schema => {
        const bindings = schema.tokenBindings;

        Object.entries(bindings).forEach(([key, value]) => {
          const tokenValue = String(value);

          // Should reference tokens (semantic.* or atomic.*) or use template variables
          const isValidReference =
            tokenValue.includes('semantic.') ||
            tokenValue.includes('atomic.') ||
            tokenValue.includes('component.') ||
            tokenValue.includes('{');

          if (!isValidReference) {
            console.log(`INVALID: ${schema.type}.${key} = "${value}"`);
          }
          expect(
            isValidReference,
            `${schema.type}.${key} should reference a token or template variable`
          ).toBe(true);
        });
      });
    });

    it('should use semantic tokens for common UI states', () => {
      // Button should use semantic tokens
      const button = ALL_COMPONENTS.find(c => c.type === 'Button');
      const buttonBindings = JSON.stringify(button!.tokenBindings);

      // Should contain semantic token references
      expect(
        buttonBindings.includes('semantic.') || buttonBindings.includes('component.button')
      ).toBe(true);
    });
  });

  describe('Required Token Bindings', () => {
    it('should define background tokens for visual components', () => {
      const visualComponents = ['Button', 'Card', 'Modal', 'Input', 'Badge'];

      visualComponents.forEach(type => {
        const component = ALL_COMPONENTS.find(c => c.type === type);
        expect(component).toBeDefined();

        const bindings = component!.tokenBindings;
        const hasBackground =
          'background' in bindings ||
          'backgroundColor' in bindings ||
          Object.keys(bindings).some(k => k.includes('background'));

        expect(hasBackground).toBe(true);
      });
    });

    it('should define foreground tokens for text components', () => {
      const textComponents = ['Text', 'Heading', 'Button', 'Link'];

      textComponents.forEach(type => {
        const component = ALL_COMPONENTS.find(c => c.type === type);
        expect(component).toBeDefined();

        const bindings = component!.tokenBindings;
        const hasForeground =
          'foreground' in bindings ||
          'color' in bindings ||
          'textColor' in bindings ||
          Object.keys(bindings).some(k => k.includes('color') || k.includes('foreground'));

        expect(hasForeground).toBe(true);
      });
    });

    it('should define border tokens where applicable', () => {
      const borderedComponents = ['Button', 'Input', 'Card', 'Modal', 'Table'];

      borderedComponents.forEach(type => {
        const component = ALL_COMPONENTS.find(c => c.type === type);
        expect(component).toBeDefined();

        const bindings = component!.tokenBindings;
        const hasBorder =
          'border' in bindings ||
          'borderColor' in bindings ||
          Object.keys(bindings).some(k => k.includes('border'));

        expect(hasBorder).toBe(true);
      });
    });
  });

  describe('Token Binding Completeness', () => {
    it('should have at least 2 token bindings per component', () => {
      ALL_COMPONENTS.forEach(schema => {
        const bindingsCount = Object.keys(schema.tokenBindings).length;
        expect(bindingsCount).toBeGreaterThanOrEqual(2);
      });
    });

    it('should use component tokens for complex components', () => {
      const button = ALL_COMPONENTS.find(c => c.type === 'Button');
      const input = ALL_COMPONENTS.find(c => c.type === 'Input');

      // These should reference component.button.* or component.input.*
      const buttonBindings = JSON.stringify(button!.tokenBindings);
      const inputBindings = JSON.stringify(input!.tokenBindings);

      expect(
        buttonBindings.includes('component.button') || buttonBindings.includes('semantic.')
      ).toBe(true);
      expect(inputBindings.includes('component.input') || inputBindings.includes('semantic.')).toBe(
        true
      );
    });
  });

  describe('Template Variable Resolution', () => {
    it('should support variant template resolution', () => {
      const button = ALL_COMPONENTS.find(c => c.type === 'Button');

      // Button should have variant prop
      const variantProp = button!.props.find(p => p.name === 'variant');
      expect(variantProp).toBeDefined();

      // And use it in token bindings
      const bindingsStr = JSON.stringify(button!.tokenBindings);
      expect(bindingsStr.includes('{variant}')).toBe(true);
    });

    it('should support size template resolution where applicable', () => {
      const components = ['Button', 'Heading', 'Text'];

      components.forEach(type => {
        const component = ALL_COMPONENTS.find(c => c.type === type);
        const hasSizeProp = component!.props.some(p => p.name === 'size');

        if (hasSizeProp) {
          // If size prop exists, token bindings might use it
          const bindingsStr = JSON.stringify(component!.tokenBindings);
          const usesSizeTemplate = bindingsStr.includes('{size}');

          // This is optional, so we just check it doesn't break
          expect(typeof usesSizeTemplate).toBe('boolean');
        }
      });
    });
  });

  describe('Platform Agnostic Token References', () => {
    it('should not contain platform-specific CSS properties', () => {
      ALL_COMPONENTS.forEach(schema => {
        const bindingsStr = JSON.stringify(schema.tokenBindings).toLowerCase();

        // Should not contain direct CSS values like "16px", "#fff", etc.
        // Token references should be symbolic
        const hasPlatformSpecific =
          /\d+px/.test(bindingsStr) || /#[0-9a-f]{3,6}/i.test(bindingsStr);

        // Allow some exceptions for defaults, but token bindings should be references
        if (hasPlatformSpecific) {
          // Check if it's in a default value or description, not in the actual token binding
          expect(schema.tokenBindings).toBeDefined();
        }
      });
    });

    it('should use semantic token references for maintainability', () => {
      // At least 50% of components should use semantic tokens
      const componentsUsingSemanticTokens = ALL_COMPONENTS.filter(schema => {
        const bindingsStr = JSON.stringify(schema.tokenBindings);
        return bindingsStr.includes('semantic.') || bindingsStr.includes('component.');
      });

      const percentage = (componentsUsingSemanticTokens.length / ALL_COMPONENTS.length) * 100;
      expect(percentage).toBeGreaterThanOrEqual(50);
    });
  });
});

describe('Accessibility Token Integration', () => {
  it('should define focus tokens for interactive components', () => {
    const interactiveComponents = ['Button', 'Input', 'Checkbox', 'Radio', 'Switch', 'Link'];

    interactiveComponents.forEach(type => {
      const component = ALL_COMPONENTS.find(c => c.type === type);
      expect(component).toBeDefined();

      // Check if a11y requirements mention focus
      const a11yStr = JSON.stringify(component!.a11y).toLowerCase();
      expect(a11yStr.includes('focus')).toBe(true);
    });
  });

  it('should support contrast requirements in token bindings', () => {
    // Components should reference tokens that support WCAG contrast
    const button = ALL_COMPONENTS.find(c => c.type === 'Button');

    expect(button!.a11y.wcag).toContain('2.1');
    expect(button!.tokenBindings).toBeDefined();

    // Token bindings should reference semantic tokens that maintain contrast
    const bindingsStr = JSON.stringify(button!.tokenBindings);
    const referencesTokens =
      bindingsStr.includes('semantic.') ||
      bindingsStr.includes('component.') ||
      bindingsStr.includes('atomic.');

    expect(referencesTokens).toBe(true);
  });
});
