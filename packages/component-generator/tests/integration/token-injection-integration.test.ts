/**
 * Integration Test: Token Injection
 * TAG: SPEC-THEME-BIND-001 TASK-005
 *
 * Verifies end-to-end token injection workflow from ComponentNode to generated JSX code
 */

import { describe, it, expect } from 'vitest';
import generate from '@babel/generator';
import { buildComponentNode } from '../../src/generator/jsx-element-generator';
import type { ComponentNode } from '../../src/types/knowledge-schema';
import type { BuildContext } from '../../src/types/theme-types';

describe('Token Injection Integration', () => {
  it('should generate valid React code with CSS variables for Card component', () => {
    const node: ComponentNode = {
      componentName: 'Card',
      props: {
        variant: 'elevated',
      },
      slots: {
        content: {
          componentName: 'Text',
          props: { text: 'Hello World' },
        },
      },
    };

    const buildContext: BuildContext = {
      themeId: 'calm-wellness',
      componentName: 'Card',
      state: 'default',
      tokenBindings: {
        backgroundColor: 'color-surface',
        borderColor: 'color-border',
        borderRadius: 'radius-lg',
        padding: 'spacing-4',
        boxShadow: 'shadow-sm',
      },
    };

    const jsxElement = buildComponentNode(node, buildContext);
    const code = generate(jsxElement).code;

    // Verify generated code structure
    expect(code).toContain('<Card');
    expect(code).toContain('variant="elevated"');
    expect(code).toContain('style={');

    // Verify CSS variables
    expect(code).toContain('backgroundColor: "var(--color-surface)"');
    expect(code).toContain('borderColor: "var(--color-border)"');
    expect(code).toContain('borderRadius: "var(--radius-lg)"');
    expect(code).toContain('padding: "var(--spacing-4)"');
    expect(code).toContain('boxShadow: "var(--shadow-sm)"');

    // Verify no hardcoded values
    expect(code).not.toMatch(/#[0-9a-fA-F]{3,6}/); // No hex colors
    expect(code).not.toMatch(/\d+px/); // No pixel values
    expect(code).not.toMatch(/oklch\(/); // No direct OKLCH values

    // Verify children are rendered
    expect(code).toContain('<Text');
    expect(code).toContain('text="Hello World"');
  });

  it('should handle Button component with existing style and token injection', () => {
    const node: ComponentNode = {
      componentName: 'Button',
      props: {
        variant: 'primary',
        onClick: 'handleClick',
        style: {
          marginTop: '20px',
          zIndex: 1000,
        },
      },
    };

    const buildContext: BuildContext = {
      themeId: 'calm-wellness',
      componentName: 'Button',
      state: 'default',
      tokenBindings: {
        backgroundColor: 'color-primary',
        color: 'color-text-on-primary',
        borderRadius: 'radius-md',
        padding: 'spacing-2',
      },
    };

    const jsxElement = buildComponentNode(node, buildContext);
    const code = generate(jsxElement).code;

    // Verify both token styles and user styles are present
    expect(code).toContain('backgroundColor: "var(--color-primary)"');
    expect(code).toContain('color: "var(--color-text-on-primary)"');
    expect(code).toContain('marginTop: "20px"');
    expect(code).toContain('zIndex: 1000');

    // User styles should come after token styles (override order)
    const bgIndex = code.indexOf('backgroundColor');
    const marginIndex = code.indexOf('marginTop');
    expect(bgIndex).toBeLessThan(marginIndex);
  });

  it('should work without buildContext for backward compatibility', () => {
    const node: ComponentNode = {
      componentName: 'Input',
      props: {
        type: 'text',
        placeholder: 'Enter name',
      },
    };

    // Call without buildContext
    const jsxElement = buildComponentNode(node);
    const code = generate(jsxElement).code;

    expect(code).toContain('<Input');
    expect(code).toContain('type="text"');
    expect(code).toContain('placeholder="Enter name"');
    // Should not have auto-generated style prop
    expect(code).not.toContain('var(--');
  });

  it('should handle complex nested structure with token injection', () => {
    const node: ComponentNode = {
      componentName: 'Modal',
      props: {},
      slots: {
        header: {
          componentName: 'Header',
          props: { title: 'Confirmation' },
        },
        content: {
          componentName: 'Card',
          props: {},
          slots: {
            body: {
              componentName: 'Text',
              props: { text: 'Are you sure?' },
            },
          },
        },
        footer: {
          componentName: 'Button',
          props: { label: 'Confirm' },
        },
      },
    };

    const buildContext: BuildContext = {
      themeId: 'calm-wellness',
      componentName: 'Modal',
      state: 'default',
      tokenBindings: {
        backgroundColor: 'color-surface',
        borderRadius: 'radius-lg',
        boxShadow: 'shadow-xl',
        padding: 'spacing-6',
      },
    };

    const jsxElement = buildComponentNode(node, buildContext);
    const code = generate(jsxElement).code;

    // Verify Modal has token styles
    expect(code).toContain('backgroundColor: "var(--color-surface)"');
    expect(code).toContain('boxShadow: "var(--shadow-xl)"');

    // Verify nested structure
    expect(code).toContain('<Modal');
    expect(code).toContain('<Header');
    expect(code).toContain('<Card');
    expect(code).toContain('<Text');
    expect(code).toContain('<Button');
    expect(code).toContain('</Modal>');
  });

  it('should handle empty tokenBindings gracefully', () => {
    const node: ComponentNode = {
      componentName: 'CustomComponent',
      props: { id: 'custom-1' },
    };

    const buildContext: BuildContext = {
      themeId: 'calm-wellness',
      componentName: 'CustomComponent',
      state: 'default',
      tokenBindings: {},
    };

    const jsxElement = buildComponentNode(node, buildContext);
    const code = generate(jsxElement).code;

    expect(code).toContain('CustomComponent');
    expect(code).toContain('id="custom-1"');
    // Empty tokenBindings should still add style prop (empty object)
    // This is okay as React handles empty style objects gracefully
  });

  it('should use correct CSS variable naming convention', () => {
    const node: ComponentNode = {
      componentName: 'Alert',
      props: {},
    };

    const buildContext: BuildContext = {
      themeId: 'calm-wellness',
      componentName: 'Alert',
      state: 'default',
      tokenBindings: {
        backgroundColor: 'color-surface',
        borderLeftWidth: 'border-width-4',
        borderLeftColor: 'color-primary',
      },
    };

    const jsxElement = buildComponentNode(node, buildContext);
    const code = generate(jsxElement).code;

    // CSS variables should use kebab-case in var() but camelCase as properties
    expect(code).toContain('backgroundColor: "var(--color-surface)"');
    expect(code).toContain('borderLeftWidth: "var(--border-width-4)"');
    expect(code).toContain('borderLeftColor: "var(--color-primary)"');

    // Verify CSS variable names use kebab-case
    expect(code).toMatch(/var\(--[a-z][a-z0-9-]*\)/);
  });
});
