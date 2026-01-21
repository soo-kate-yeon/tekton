import { describe, it, expect } from 'vitest';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { buildComponentNode } from '../src/generator/jsx-element-generator';
import type { ComponentNode } from '../src/types/knowledge-schema';

describe('JSX Element Generator', () => {
  describe('buildComponentNode', () => {
    it('should generate simple component without props or slots', () => {
      const node: ComponentNode = {
        componentName: 'Button',
        props: {},
      };

      const jsxElement = buildComponentNode(node);

      expect(t.isJSXElement(jsxElement)).toBe(true);

      const code = generate(jsxElement).code;
      expect(code).toContain('Button');
      expect(code).toContain('/>'); // Self-closing
    });

    it('should generate component with string props', () => {
      const node: ComponentNode = {
        componentName: 'Button',
        props: {
          variant: 'primary',
          label: 'Click me',
        },
      };

      const jsxElement = buildComponentNode(node);
      const code = generate(jsxElement).code;

      expect(code).toContain('Button');
      expect(code).toContain('variant="primary"');
      expect(code).toContain('label="Click me"');
    });

    it('should generate component with number props', () => {
      const node: ComponentNode = {
        componentName: 'Input',
        props: {
          maxLength: 100,
          tabIndex: 0,
        },
      };

      const jsxElement = buildComponentNode(node);
      const code = generate(jsxElement).code;

      expect(code).toContain('maxLength={100}');
      expect(code).toContain('tabIndex={0}');
    });

    it('should generate component with boolean props', () => {
      const node: ComponentNode = {
        componentName: 'Checkbox',
        props: {
          checked: true,
          disabled: false,
        },
      };

      const jsxElement = buildComponentNode(node);
      const code = generate(jsxElement).code;

      expect(code).toContain('checked={true}');
      expect(code).toContain('disabled={false}');
    });

    it('should generate component with object props', () => {
      const node: ComponentNode = {
        componentName: 'Card',
        props: {
          style: { width: '100px', height: '200px' },
        },
      };

      const jsxElement = buildComponentNode(node);
      const code = generate(jsxElement).code;

      expect(code).toContain('Card');
      expect(code).toContain('style={');
    });

    it('should generate component with array props', () => {
      const node: ComponentNode = {
        componentName: 'List',
        props: {
          items: ['item1', 'item2', 'item3'],
        },
      };

      const jsxElement = buildComponentNode(node);
      const code = generate(jsxElement).code;

      expect(code).toContain('List');
      expect(code).toContain('items={');
    });

    it('should generate component with single slot child', () => {
      const node: ComponentNode = {
        componentName: 'Card',
        props: {},
        slots: {
          content: {
            componentName: 'Text',
            props: { text: 'Hello' },
          },
        },
      };

      const jsxElement = buildComponentNode(node);
      const code = generate(jsxElement).code;

      expect(code).toContain('<Card>');
      expect(code).toContain('<Text');
      expect(code).toContain('text="Hello"');
      expect(code).toContain('</Card>');
    });

    it('should generate component with multiple slot children (array)', () => {
      const node: ComponentNode = {
        componentName: 'List',
        props: {},
        slots: {
          items: [
            { componentName: 'ListItem', props: { text: 'Item 1' } },
            { componentName: 'ListItem', props: { text: 'Item 2' } },
          ],
        },
      };

      const jsxElement = buildComponentNode(node);
      const code = generate(jsxElement).code;

      expect(code).toContain('<List>');
      expect(code).toContain('<ListItem');
      expect(code).toContain('text="Item 1"');
      expect(code).toContain('text="Item 2"');
      expect(code).toContain('</List>');
    });

    it('should handle nested component structure', () => {
      const node: ComponentNode = {
        componentName: 'Page',
        props: {},
        slots: {
          header: {
            componentName: 'Header',
            props: {},
            slots: {
              navigation: {
                componentName: 'Navigation',
                props: { items: [] },
              },
            },
          },
        },
      };

      const jsxElement = buildComponentNode(node);
      const code = generate(jsxElement).code;

      expect(code).toContain('<Page>');
      expect(code).toContain('<Header>');
      expect(code).toContain('<Navigation');
      expect(code).toContain('</Header>');
      expect(code).toContain('</Page>');
    });

    it('should be self-closing when no slots are present', () => {
      const node: ComponentNode = {
        componentName: 'Button',
        props: { label: 'Click' },
      };

      const jsxElement = buildComponentNode(node);
      const code = generate(jsxElement).code;

      expect(code).toMatch(/<Button\s+[^>]*\/>/);
    });

    it('should not be self-closing when slots are present', () => {
      const node: ComponentNode = {
        componentName: 'Card',
        props: {},
        slots: {
          content: { componentName: 'Text', props: {} },
        },
      };

      const jsxElement = buildComponentNode(node);
      const code = generate(jsxElement).code;

      expect(code).toContain('<Card>');
      expect(code).toContain('</Card>');
      expect(code).not.toMatch(/<Card[^>]*\/>/);
    });

    it('should handle mixed prop types in same component', () => {
      const node: ComponentNode = {
        componentName: 'Input',
        props: {
          name: 'email',
          maxLength: 50,
          required: true,
          style: { width: '100%' },
        },
      };

      const jsxElement = buildComponentNode(node);
      const code = generate(jsxElement).code;

      expect(code).toContain('name="email"');
      expect(code).toContain('maxLength={50}');
      expect(code).toContain('required={true}');
      expect(code).toContain('style={');
    });

    it('should handle empty slots object', () => {
      const node: ComponentNode = {
        componentName: 'Card',
        props: {},
        slots: {},
      };

      const jsxElement = buildComponentNode(node);
      const code = generate(jsxElement).code;

      // Empty slots should result in self-closing tag
      expect(code).toMatch(/<Card[^>]*\/>/);
    });

    it('should handle null and undefined prop values', () => {
      const node: ComponentNode = {
        componentName: 'Input',
        props: {
          value: null,
          placeholder: undefined,
        },
      };

      const jsxElement = buildComponentNode(node);
      const code = generate(jsxElement).code;

      expect(code).toContain('Input');
    });

    it('should generate valid JSXElement AST structure', () => {
      const node: ComponentNode = {
        componentName: 'Button',
        props: { label: 'Test' },
      };

      const jsxElement = buildComponentNode(node);

      expect(t.isJSXElement(jsxElement)).toBe(true);
      expect(t.isJSXOpeningElement(jsxElement.openingElement)).toBe(true);
      expect(t.isJSXClosingElement(jsxElement.closingElement) || jsxElement.closingElement === null).toBe(true);
      expect(t.isJSXIdentifier(jsxElement.openingElement.name)).toBe(true);
    });

    it('should handle deeply nested structures', () => {
      const node: ComponentNode = {
        componentName: 'App',
        props: {},
        slots: {
          main: {
            componentName: 'Container',
            props: {},
            slots: {
              content: {
                componentName: 'Card',
                props: {},
                slots: {
                  body: {
                    componentName: 'Text',
                    props: { text: 'Deep nested' },
                  },
                },
              },
            },
          },
        },
      };

      const jsxElement = buildComponentNode(node);
      const code = generate(jsxElement).code;

      expect(code).toContain('<App>');
      expect(code).toContain('<Container>');
      expect(code).toContain('<Card>');
      expect(code).toContain('<Text');
      expect(code).toContain('text="Deep nested"');
    });

    it('should handle multiple slots with different content types', () => {
      const node: ComponentNode = {
        componentName: 'Layout',
        props: {},
        slots: {
          header: {
            componentName: 'Header',
            props: { title: 'Title' },
          },
          items: [
            { componentName: 'Item', props: { id: 1 } },
            { componentName: 'Item', props: { id: 2 } },
          ],
          footer: {
            componentName: 'Footer',
            props: {},
          },
        },
      };

      const jsxElement = buildComponentNode(node);
      const code = generate(jsxElement).code;

      expect(code).toContain('<Layout>');
      expect(code).toContain('<Header');
      expect(code).toContain('<Item');
      expect(code).toContain('<Footer');
      expect(code).toContain('</Layout>');
    });
  });

  describe('Token Injection (TASK-005)', () => {
    it('should inject token CSS variables as style props when component has tokenBindings', () => {
      const node: ComponentNode = {
        componentName: 'Card',
        props: { variant: 'elevated' },
      };

      // BuildContext with themeId and tokenResolver mock
      const buildContext = {
        themeId: 'calm-wellness',
        componentName: 'Card',
        state: 'default',
        tokenBindings: {
          backgroundColor: 'color-surface',
          borderRadius: 'radius-large',
          boxShadow: 'shadow-md',
        },
      };

      const jsxElement = buildComponentNode(node, buildContext);
      const code = generate(jsxElement).code;

      // Should have style prop with CSS variables
      expect(code).toContain('style={');
      expect(code).toContain('var(--color-surface)');
      expect(code).toContain('var(--radius-large)');
      expect(code).toContain('var(--shadow-md)');
    });

    it('should preserve existing style props when injecting tokens', () => {
      const node: ComponentNode = {
        componentName: 'Button',
        props: {
          variant: 'primary',
          style: { marginTop: '10px', zIndex: 999 },
        },
      };

      const buildContext = {
        themeId: 'calm-wellness',
        componentName: 'Button',
        state: 'default',
        tokenBindings: {
          backgroundColor: 'color-primary',
          padding: 'spacing-2',
        },
      };

      const jsxElement = buildComponentNode(node, buildContext);
      const code = generate(jsxElement).code;

      // Should preserve existing style
      expect(code).toContain('marginTop');
      expect(code).toContain('10px');
      expect(code).toContain('zIndex');
      expect(code).toContain('999');
      // Should add token styles
      expect(code).toContain('var(--color-primary)');
      expect(code).toContain('var(--spacing-2)');
    });

    it('should work normally for components without tokenBindings', () => {
      const node: ComponentNode = {
        componentName: 'CustomComponent',
        props: { text: 'Hello' },
      };

      // BuildContext without tokenBindings
      const buildContext = {
        themeId: 'calm-wellness',
        componentName: 'CustomComponent',
        state: 'default',
        tokenBindings: undefined,
      };

      const jsxElement = buildComponentNode(node, buildContext);
      const code = generate(jsxElement).code;

      expect(code).toContain('CustomComponent');
      expect(code).toContain('text="Hello"');
      // Should not have auto-injected style
      expect(code).not.toContain('style={');
    });

    it('should use CSS variable syntax var(--token-name)', () => {
      const node: ComponentNode = {
        componentName: 'Input',
        props: {},
      };

      const buildContext = {
        themeId: 'calm-wellness',
        componentName: 'Input',
        state: 'default',
        tokenBindings: {
          borderColor: 'color-border',
          borderWidth: 'border-width-1',
        },
      };

      const jsxElement = buildComponentNode(node, buildContext);
      const code = generate(jsxElement).code;

      // Should use var(--token-name) syntax exactly
      expect(code).toContain('var(--color-border)');
      expect(code).toContain('var(--border-width-1)');
      // Should NOT have hardcoded color values
      expect(code).not.toMatch(/#[0-9a-fA-F]{3,6}/); // No hex colors
      expect(code).not.toMatch(/rgb\(/); // No rgb()
      expect(code).not.toMatch(/oklch\(/); // No oklch()
    });

    it('should handle camelCase to kebab-case conversion for CSS properties', () => {
      const node: ComponentNode = {
        componentName: 'Card',
        props: {},
      };

      const buildContext = {
        themeId: 'calm-wellness',
        componentName: 'Card',
        state: 'default',
        tokenBindings: {
          backgroundColor: 'color-surface',
          borderRadius: 'radius-lg',
          boxShadow: 'shadow-sm',
        },
      };

      const jsxElement = buildComponentNode(node, buildContext);
      const code = generate(jsxElement).code;

      // CSS properties should be in camelCase for React inline styles
      expect(code).toContain('backgroundColor');
      expect(code).toContain('borderRadius');
      expect(code).toContain('boxShadow');
    });

    it('should support buildComponentNode without buildContext (backward compatibility)', () => {
      const node: ComponentNode = {
        componentName: 'Button',
        props: { label: 'Click' },
      };

      // Call without buildContext (old signature)
      const jsxElement = buildComponentNode(node);
      const code = generate(jsxElement).code;

      expect(code).toContain('Button');
      expect(code).toContain('label="Click"');
      // Should not throw error
      expect(t.isJSXElement(jsxElement)).toBe(true);
    });
  });
});
