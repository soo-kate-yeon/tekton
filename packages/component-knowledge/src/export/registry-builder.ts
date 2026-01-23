/**
 * Layer 3 Registry Builder
 * TAG: SPEC-LAYER2-001
 *
 * Builds Layer 3 registry format from ComponentKnowledge catalog
 * Integrates Zod schemas and CSS-in-JS bindings
 */

import type { ComponentKnowledge, ComponentState } from '../types/knowledge.types.js';
import type { Layer2Output } from '../types/export.types.js';
import { ZodSchemaGenerator } from '../schema/zod-schema-generator.js';
import { VanillaExtractGenerator } from '../css-in-js/vanilla-extract-generator.js';
import { TokenValidator } from '../validator/token-validator.js';

/**
 * Layer3RegistryBuilder creates Layer 3 output format
 */
export class Layer3RegistryBuilder {
  private schemaGenerator: ZodSchemaGenerator;
  private styleGenerator: VanillaExtractGenerator;

  constructor() {
    this.schemaGenerator = new ZodSchemaGenerator();
    this.styleGenerator = new VanillaExtractGenerator();
  }

  /**
   * Builds Layer 3 registry from component catalog
   *
   * @param components - Array of ComponentKnowledge entries
   * @param tokenValidator - Optional TokenValidator for token references
   * @returns Layer 3 output format
   */
  buildRegistry(components: ComponentKnowledge[], tokenValidator?: TokenValidator): Layer2Output {
    const registry: Layer2Output = {
      schemaVersion: '2.0.0',
      generatedAt: new Date().toISOString(),
      components: {},
      standardSlots: this.getStandardSlots(),
    };

    for (const component of components) {
      registry.components[component.name] = {
        knowledge: component,
        zodSchema: this.schemaGenerator.generateSchema(component),
        propsType: `${component.name}Props`,
        cssBindings: {
          vanillaExtract: {
            baseStyle: this.styleGenerator.generateStyles(component),
            variants: this.extractVariantNames(component),
          },
        },
        states: this.getAllStates(),
        variants: this.extractVariantNamesList(component),
        tokenReferences: tokenValidator
          ? tokenValidator.resolveTokenReferences(component)
          : this.extractTokenReferences(component),
      };
    }

    return registry;
  }

  /**
   * Gets all required states
   *
   * @returns Array of component states
   */
  private getAllStates(): ComponentState[] {
    return ['default', 'hover', 'focus', 'active', 'disabled'];
  }

  /**
   * Extracts variant names as object
   *
   * @param component - ComponentKnowledge entry
   * @returns Variant names object
   */
  private extractVariantNames(component: ComponentKnowledge): Record<string, string> {
    const variants: Record<string, string> = {};

    if (component.tokenBindings.variants) {
      for (const variantName of Object.keys(component.tokenBindings.variants)) {
        variants[variantName] = variantName;
      }
    }

    return variants;
  }

  /**
   * Extracts variant names as array
   *
   * @param component - ComponentKnowledge entry
   * @returns Array of variant names
   */
  private extractVariantNamesList(component: ComponentKnowledge): string[] {
    if (component.tokenBindings.variants) {
      return Object.keys(component.tokenBindings.variants);
    }
    return [];
  }

  /**
   * Extracts token references from component
   *
   * @param component - ComponentKnowledge entry
   * @returns Array of unique token names
   */
  private extractTokenReferences(component: ComponentKnowledge): string[] {
    const references = new Set<string>();

    // Extract from all states
    for (const stateBindings of Object.values(component.tokenBindings.states)) {
      for (const tokenName of Object.values(stateBindings)) {
        if (tokenName) {
          references.add(tokenName);
        }
      }
    }

    // Extract from variants
    if (component.tokenBindings.variants) {
      for (const variantStates of Object.values(component.tokenBindings.variants)) {
        for (const stateBindings of Object.values(variantStates)) {
          if (stateBindings) {
            for (const tokenName of Object.values(stateBindings)) {
              if (tokenName) {
                references.add(tokenName);
              }
            }
          }
        }
      }
    }

    return Array.from(references).sort();
  }

  /**
   * Defines standard slots for Layer 3
   *
   * @returns Array of slot definitions
   */
  private getStandardSlots(): Layer2Output['standardSlots'] {
    return [
      {
        name: 'main',
        role: 'Primary content area',
        allowedTypes: ['atom', 'molecule', 'organism', 'template'],
        allowedCategories: ['display', 'input', 'action', 'container', 'navigation'],
      },
      {
        name: 'sidebar',
        role: 'Secondary navigation or content',
        allowedTypes: ['atom', 'molecule'],
        allowedCategories: ['navigation', 'action', 'input', 'display'],
      },
      {
        name: 'header',
        role: 'Top navigation and branding',
        allowedTypes: ['atom', 'molecule'],
        allowedCategories: ['navigation', 'action', 'display'],
      },
      {
        name: 'footer',
        role: 'Bottom content and links',
        allowedTypes: ['atom', 'molecule'],
        allowedCategories: ['navigation', 'action', 'display'],
      },
      {
        name: 'overlay',
        role: 'Modal and toast overlays',
        allowedTypes: ['organism'],
        allowedCategories: ['container', 'display'],
      },
    ];
  }
}
