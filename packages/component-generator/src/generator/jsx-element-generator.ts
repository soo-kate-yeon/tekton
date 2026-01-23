/**
 * JSX Element Generator
 * Converts ComponentNode to JSX AST elements
 * SPEC-LAYER3-MVP-001 M1-TASK-004
 * TAG: SPEC-THEME-BIND-001 TASK-005
 * SPEC-LAYOUT-001 - Extended with className support for layout
 */

import * as t from '@babel/types';
import type { ComponentNode } from '../types/knowledge-schema.js';
import type { BuildContext } from '../types/theme-types.js';

// Re-export BuildContext for convenience
export type { BuildContext };

/**
 * Build a JSX element from a ComponentNode
 * TAG: SPEC-THEME-BIND-001 TASK-005
 *
 * @param node - ComponentNode to convert
 * @param buildContext - Optional build context with theme and token information
 * @returns JSXElement AST node
 *
 * @example
 * // Without theme context (backward compatible)
 * buildComponentNode({
 *   componentName: 'Button',
 *   props: { variant: 'primary' },
 *   slots: { content: { componentName: 'Text', props: {} } }
 * })
 * // Returns AST for: <Button variant="primary"><Text /></Button>
 *
 * @example
 * // With theme context
 * buildComponentNode(
 *   { componentName: 'Card', props: {} },
 *   {
 *     themeId: 'calm-wellness',
 *     componentName: 'Card',
 *     state: 'default',
 *     tokenBindings: { backgroundColor: 'color-surface', borderRadius: 'radius-lg' }
 *   }
 * )
 * // Returns AST for: <Card style={{ backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-lg)" }} />
 */
export function buildComponentNode(
  node: ComponentNode,
  buildContext?: BuildContext
): t.JSXElement {
  return buildComponentNodeInternal(node, undefined, buildContext);
}

/**
 * Build a JSX element from a ComponentNode with additional className
 * SPEC-LAYOUT-001 - TASK-009
 *
 * @param node - ComponentNode to convert
 * @param className - Additional className to apply to root element
 * @param buildContext - Optional build context with theme and token information
 * @returns JSXElement AST node
 *
 * @example
 * buildComponentNodeWithClassName(
 *   { componentName: 'div', props: {}, slots: {} },
 *   'container mx-auto grid grid-cols-4'
 * )
 * // Returns AST for: <div className="container mx-auto grid grid-cols-4">...</div>
 */
export function buildComponentNodeWithClassName(
  node: ComponentNode,
  className: string,
  buildContext?: BuildContext
): t.JSXElement {
  return buildComponentNodeInternal(node, className, buildContext);
}

/**
 * Internal function to build JSX element with optional className and theme context
 */
function buildComponentNodeInternal(
  node: ComponentNode,
  additionalClassName: string | undefined,
  buildContext?: BuildContext
): t.JSXElement {
  const { componentName, props, slots } = node;

  // Step 1: Start with base props
  let mergedProps = { ...props };

  // Step 2: Inject theme tokens as style props if buildContext provided
  // TAG: SPEC-THEME-BIND-001 TASK-005
  if (buildContext?.tokenBindings) {
    const tokenStyles = tokensToStyleObject(buildContext.tokenBindings);
    // Merge with existing style prop, preserving user's custom styles
    mergedProps.style = { ...tokenStyles, ...(props.style || {}) };
  }

  // Step 3: Merge additionalClassName with existing className if present
  // SPEC-LAYOUT-001 - TASK-009
  if (additionalClassName) {
    const existingClassName = props.className as string | undefined;
    mergedProps.className = existingClassName
      ? `${additionalClassName} ${existingClassName}`
      : additionalClassName;
  }

  // Create JSX identifier for component name
  const jsxName = t.jsxIdentifier(componentName);

  // Convert props to JSX attributes (including injected style and className)
  const attributes = propsToJSXAttributes(mergedProps);

  // Check if component has children
  const hasChildren = slots && Object.keys(slots).length > 0;

  // Create opening element
  const openingElement = t.jsxOpeningElement(
    jsxName,
    attributes,
    !hasChildren // self-closing if no children
  );

  // Create closing element (only if has children)
  const closingElement = hasChildren
    ? t.jsxClosingElement(jsxName)
    : null;

  // Convert slots to JSX children (pass buildContext down for theme support)
  const children = hasChildren ? slotsToJSXChildren(slots!, buildContext) : [];

  return t.jsxElement(openingElement, closingElement, children, !hasChildren);
}

/**
 * Convert props object to JSX attributes
 *
 * @param props - Props object
 * @returns Array of JSX attributes
 */
function propsToJSXAttributes(
  props: Record<string, unknown>
): Array<t.JSXAttribute | t.JSXSpreadAttribute> {
  const attributes: t.JSXAttribute[] = [];

  for (const [key, value] of Object.entries(props)) {
    // Skip null and undefined values
    if (value === null || value === undefined) {
      continue;
    }

    const attrName = t.jsxIdentifier(key);
    const attrValue = valueToJSXAttributeValue(value);

    attributes.push(t.jsxAttribute(attrName, attrValue));
  }

  return attributes;
}

/**
 * Convert a JavaScript value to JSX attribute value
 *
 * @param value - JavaScript value
 * @returns JSX attribute value
 */
function valueToJSXAttributeValue(
  value: unknown
): t.StringLiteral | t.JSXExpressionContainer {
  // String values use string literals
  if (typeof value === 'string') {
    return t.stringLiteral(value);
  }

  // All other values (numbers, booleans, objects, arrays) use expression containers
  return t.jsxExpressionContainer(valueToExpression(value));
}

/**
 * Convert a JavaScript value to an expression
 *
 * @param value - JavaScript value
 * @returns Expression AST node
 */
function valueToExpression(value: unknown): t.Expression {
  // Numbers
  if (typeof value === 'number') {
    return t.numericLiteral(value);
  }

  // Booleans
  if (typeof value === 'boolean') {
    return t.booleanLiteral(value);
  }

  // Arrays
  if (Array.isArray(value)) {
    const elements = value.map(item => valueToExpression(item));
    return t.arrayExpression(elements);
  }

  // Objects
  if (typeof value === 'object' && value !== null) {
    const properties = Object.entries(value).map(([key, val]) => {
      return t.objectProperty(
        t.identifier(key),
        valueToExpression(val)
      );
    });
    return t.objectExpression(properties);
  }

  // Null
  if (value === null) {
    return t.nullLiteral();
  }

  // Fallback to string literal
  return t.stringLiteral(String(value));
}

/**
 * Convert slots to JSX children
 *
 * @param slots - Slots object
 * @param buildContext - Optional build context to pass down to children
 * @returns Array of JSX children
 */
function slotsToJSXChildren(
  slots: {
    [slotName: string]: ComponentNode | ComponentNode[];
  },
  buildContext?: BuildContext
): Array<t.JSXElement | t.JSXText | t.JSXExpressionContainer> {
  const children: t.JSXElement[] = [];

  for (const slotContent of Object.values(slots)) {
    if (Array.isArray(slotContent)) {
      // Array of components
      for (const node of slotContent) {
        children.push(buildComponentNode(node, buildContext));
      }
    } else {
      // Single component
      children.push(buildComponentNode(slotContent, buildContext));
    }
  }

  return children;
}

/**
 * Convert token bindings to React inline style object with CSS variables
 * TAG: SPEC-THEME-BIND-001 TASK-005
 *
 * REQ-TB-004: Always use CSS variable syntax var(--token-name)
 * REQ-TB-012: NOT hardcode color/size values
 *
 * @param tokenBindings - Token bindings mapping CSS properties to token names
 * @returns Style object with CSS variable values
 *
 * @example
 * tokensToStyleObject({
 *   backgroundColor: 'color-surface',
 *   borderRadius: 'radius-lg',
 *   padding: 'spacing-4'
 * })
 * // Returns:
 * // {
 * //   backgroundColor: 'var(--color-surface)',
 * //   borderRadius: 'var(--radius-lg)',
 * //   padding: 'var(--spacing-4)'
 * // }
 */
function tokensToStyleObject(
  tokenBindings: Record<string, string>
): Record<string, string> {
  const style: Record<string, string> = {};

  // Convert each token binding to CSS variable syntax
  for (const [cssProperty, tokenName] of Object.entries(tokenBindings)) {
    if (tokenName) {
      // REQ-TB-004: Use var(--token-name) syntax
      style[cssProperty] = `var(--${tokenName})`;
    }
  }

  return style;
}
