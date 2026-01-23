/**
 * Vanilla Extract Generator
 * TAG: SPEC-LAYER2-001
 *
 * Generates Vanilla Extract style recipes from ComponentKnowledge
 * REQ-LAYER2-004: CSS-in-JS bindings reference Layer 1 CSS variables
 * REQ-LAYER2-013: No hardcoded token values
 */

import type { ComponentKnowledge, TokenBindings } from '../types/knowledge.types.js';

/**
 * VanillaExtractGenerator creates Vanilla Extract style recipes
 */
export class VanillaExtractGenerator {
  /**
   * Generates Vanilla Extract style recipe code
   *
   * REQ-LAYER2-004: All bindings use var(--token-name) references
   * REQ-LAYER2-007: Generate importable TypeScript modules
   *
   * @param knowledge - ComponentKnowledge entry
   * @returns TypeScript module with Vanilla Extract recipe
   */
  generateStyles(knowledge: ComponentKnowledge): string {
    const componentName = knowledge.name.toLowerCase();
    const lines: string[] = [];

    // Imports
    lines.push(`import { recipe } from '@vanilla-extract/recipes';`);
    lines.push(``);

    // Recipe definition
    lines.push(`export const ${componentName}Styles = recipe({`);

    // Base styles from default state
    lines.push(`  base: {`);
    const baseStyles = this.convertTokenBindingsToCSS(knowledge.tokenBindings.states.default);
    for (const [property, value] of Object.entries(baseStyles)) {
      lines.push(`    ${property}: '${value}',`);
    }

    // Add hover state
    if (Object.keys(knowledge.tokenBindings.states.hover).length > 0) {
      lines.push(`    ':hover': {`);
      const hoverStyles = this.convertTokenBindingsToCSS(knowledge.tokenBindings.states.hover);
      for (const [property, value] of Object.entries(hoverStyles)) {
        lines.push(`      ${property}: '${value}',`);
      }
      lines.push(`    },`);
    }

    // Add focus state
    if (Object.keys(knowledge.tokenBindings.states.focus).length > 0) {
      lines.push(`    ':focus': {`);
      const focusStyles = this.convertTokenBindingsToCSS(knowledge.tokenBindings.states.focus);
      for (const [property, value] of Object.entries(focusStyles)) {
        lines.push(`      ${property}: '${value}',`);
      }
      lines.push(`    },`);
    }

    // Add active state
    if (Object.keys(knowledge.tokenBindings.states.active).length > 0) {
      lines.push(`    ':active': {`);
      const activeStyles = this.convertTokenBindingsToCSS(knowledge.tokenBindings.states.active);
      for (const [property, value] of Object.entries(activeStyles)) {
        lines.push(`      ${property}: '${value}',`);
      }
      lines.push(`    },`);
    }

    // Add disabled state
    if (Object.keys(knowledge.tokenBindings.states.disabled).length > 0) {
      lines.push(`    ':disabled': {`);
      const disabledStyles = this.convertTokenBindingsToCSS(knowledge.tokenBindings.states.disabled);
      for (const [property, value] of Object.entries(disabledStyles)) {
        lines.push(`      ${property}: '${value}',`);
      }
      lines.push(`    },`);
    }

    lines.push(`  },`);

    // Variants
    if (knowledge.tokenBindings.variants) {
      lines.push(`  variants: {`);
      lines.push(`    variant: {`);

      for (const [variantName, variantStates] of Object.entries(knowledge.tokenBindings.variants)) {
        lines.push(`      ${variantName}: {`);

        // Default variant styles
        if (variantStates.default) {
          const variantStyles = this.convertTokenBindingsToCSS(variantStates.default);
          for (const [property, value] of Object.entries(variantStyles)) {
            lines.push(`        ${property}: '${value}',`);
          }
        }

        // Hover variant styles
        if (variantStates.hover) {
          lines.push(`        ':hover': {`);
          const hoverStyles = this.convertTokenBindingsToCSS(variantStates.hover);
          for (const [property, value] of Object.entries(hoverStyles)) {
            lines.push(`          ${property}: '${value}',`);
          }
          lines.push(`        },`);
        }

        lines.push(`      },`);
      }

      lines.push(`    },`);
      lines.push(`  },`);
    }

    lines.push(`});`);

    return lines.join('\n');
  }

  /**
   * Converts TokenBindings to CSS properties with CSS variable references
   *
   * REQ-LAYER2-013: Reject hardcoded values
   *
   * @param bindings - TokenBindings object
   * @returns CSS properties object
   */
  private convertTokenBindingsToCSS(bindings: TokenBindings): Record<string, string> {
    const css: Record<string, string> = {};

    for (const [property, tokenName] of Object.entries(bindings)) {
      if (!tokenName) continue;

      // REQ-LAYER2-013: Detect hardcoded values
      if (this.isHardcodedValue(tokenName)) {
        throw new Error(
          `Hardcoded value detected: '${tokenName}' for property '${property}'. ` +
          `All values must reference CSS variables (tokens).`
        );
      }

      // Convert to CSS property name (camelCase to kebab-case)
      const cssProperty = this.camelToKebab(property);

      // Create CSS variable reference
      const cssValue = `var(--${tokenName})`;

      css[cssProperty] = cssValue;
    }

    return css;
  }

  /**
   * Checks if a value is hardcoded (not a token reference)
   *
   * @param value - Value to check
   * @returns True if hardcoded
   */
  private isHardcodedValue(value: string): boolean {
    // Check for hex colors
    if (value.startsWith('#')) return true;

    // Check for rgb/rgba
    if (value.startsWith('rgb(') || value.startsWith('rgba(')) return true;

    // Check for pixel values (not from tokens)
    if (/^\d+px$/.test(value)) return true;

    return false;
  }

  /**
   * Converts camelCase to kebab-case
   *
   * @param str - camelCase string
   * @returns kebab-case string
   */
  private camelToKebab(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
}
