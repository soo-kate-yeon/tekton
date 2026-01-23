/**
 * AST JSX Generator
 * TASK-004: Generate Babel AST for JSX elements
 */

import * as t from '@babel/types';
import type { ComponentBlueprint, SlotMapping, PropMapping } from '../types/knowledge-types.js';

/**
 * Generates Babel AST nodes for JSX elements
 */
export class ASTJSXGenerator {
  /**
   * Generate a complete JSX element from a blueprint
   *
   * @param blueprint - Component blueprint
   * @returns Babel JSXElement AST node
   */
  generateJSXElement(blueprint: ComponentBlueprint): t.JSXElement {
    const openingElement = this.generateOpeningElement(blueprint);
    const children = this.generateChildrenFromSlots(blueprint.slotMappings);
    const closingElement =
      children.length > 0
        ? t.jsxClosingElement(t.jsxIdentifier(blueprint.componentName))
        : null;

    // If no children, make it self-closing
    if (children.length === 0) {
      openingElement.selfClosing = true;
    }

    return t.jsxElement(openingElement, closingElement, children, children.length === 0);
  }

  /**
   * Generate JSX opening element with props
   */
  private generateOpeningElement(blueprint: ComponentBlueprint): t.JSXOpeningElement {
    const name = t.jsxIdentifier(blueprint.componentName);
    const attributes = this.generateAttributes(blueprint.propMappings);

    return t.jsxOpeningElement(name, attributes);
  }

  /**
   * Generate JSX attributes from prop mappings
   */
  private generateAttributes(propMappings: Record<string, PropMapping>): t.JSXAttribute[] {
    const attributes: t.JSXAttribute[] = [];

    for (const [propName, mapping] of Object.entries(propMappings)) {
      const attr = this.generateJSXAttribute(propName, mapping.value);
      attributes.push(attr);
    }

    return attributes;
  }

  /**
   * Generate a single JSX attribute
   *
   * @param name - Attribute name
   * @param value - Attribute value
   * @returns Babel JSXAttribute AST node
   */
  generateJSXAttribute(
    name: string,
    value: string | number | boolean
  ): t.JSXAttribute {
    const attrName = t.jsxIdentifier(name);

    let attrValue: t.JSXAttribute['value'];

    if (typeof value === 'string') {
      attrValue = t.stringLiteral(value);
    } else if (typeof value === 'boolean') {
      // For boolean true, we can use shorthand: <Component required />
      // For false, we need: <Component required={false} />
      if (value === true) {
        attrValue = null; // Shorthand
      } else {
        attrValue = t.jsxExpressionContainer(t.booleanLiteral(value));
      }
    } else if (typeof value === 'number') {
      attrValue = t.jsxExpressionContainer(t.numericLiteral(value));
    } else {
      attrValue = null;
    }

    return t.jsxAttribute(attrName, attrValue);
  }

  /**
   * Generate children from slot mappings
   */
  private generateChildrenFromSlots(
    slotMappings: Record<string, SlotMapping>
  ): Array<t.JSXText | t.JSXElement | t.JSXExpressionContainer> {
    const children: Array<t.JSXText | t.JSXElement | t.JSXExpressionContainer> = [];

    for (const mapping of Object.values(slotMappings)) {
      const slotChildren = this.generateJSXChildren(mapping);
      children.push(...slotChildren);
    }

    return children;
  }

  /**
   * Generate JSX children from a slot mapping
   *
   * @param mapping - Slot mapping
   * @returns Array of JSX children nodes
   */
  generateJSXChildren(
    mapping: SlotMapping
  ): Array<t.JSXText | t.JSXElement | t.JSXExpressionContainer> {
    const children: Array<t.JSXText | t.JSXElement | t.JSXExpressionContainer> = [];

    if (mapping.type === 'literal') {
      if (typeof mapping.value === 'string') {
        children.push(t.jsxText(mapping.value));
      } else if (typeof mapping.value === 'number') {
        children.push(t.jsxExpressionContainer(t.numericLiteral(mapping.value)));
      } else if (typeof mapping.value === 'boolean') {
        children.push(t.jsxExpressionContainer(t.booleanLiteral(mapping.value)));
      }
    } else if (mapping.type === 'component') {
      const childElement = this.generateJSXElement(mapping.blueprint);
      children.push(childElement);
    } else if (mapping.type === 'array') {
      for (const item of mapping.items) {
        const itemChildren = this.generateJSXChildren(item);
        children.push(...itemChildren);
      }
    }

    return children;
  }
}
