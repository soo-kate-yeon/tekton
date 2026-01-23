/**
 * Zod Schema Generator
 * TAG: SPEC-LAYER2-001
 *
 * Generates type-safe Zod schemas for component props validation
 * REQ-LAYER2-002: Generate type-safe TypeScript schemas using Zod
 */

import { z } from 'zod';
import type { ComponentKnowledge } from '../types/knowledge.types.js';

/**
 * ZodSchemaGenerator generates Zod schemas from ComponentKnowledge
 */
export class ZodSchemaGenerator {
  /**
   * Generates Zod schema for component props
   *
   * REQ-LAYER2-002: All bindings have corresponding Zod schemas
   *
   * @param knowledge - ComponentKnowledge entry
   * @returns Zod schema for component props
   */
  generateSchema(knowledge: ComponentKnowledge): z.ZodObject<any> {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    // Add variant field if variants exist
    if (knowledge.tokenBindings.variants) {
      const variantNames = Object.keys(knowledge.tokenBindings.variants);
      if (variantNames.length > 0) {
        schemaFields.variant = z.enum(variantNames as [string, ...string[]]).optional();
      }
    }

    // Add common props
    schemaFields.disabled = z.boolean().optional();
    schemaFields.className = z.string().optional();
    schemaFields.style = z.record(z.string(), z.any()).optional();

    // Add component-specific props based on category
    switch (knowledge.category) {
      case 'input':
        schemaFields.value = z.any().optional();
        schemaFields.onChange = z.function().optional();
        schemaFields.placeholder = z.string().optional();
        schemaFields.required = z.boolean().optional();
        break;
      case 'action':
        schemaFields.onClick = z.function().optional();
        schemaFields.type = z.enum(['button', 'submit', 'reset']).optional();
        break;
      case 'display':
        schemaFields.children = z.any().optional();
        break;
      case 'container':
        schemaFields.children = z.any().optional();
        break;
      case 'navigation':
        schemaFields.children = z.any().optional();
        schemaFields.activeTab = z.string().optional();
        break;
    }

    return z.object(schemaFields);
  }

  /**
   * Generates TypeScript type definition as string
   *
   * @param knowledge - ComponentKnowledge entry
   * @returns TypeScript interface definition
   */
  generateTypeDefinition(knowledge: ComponentKnowledge): string {
    const lines: string[] = [];
    const interfaceName = `${knowledge.name}Props`;

    lines.push(`export interface ${interfaceName} {`);

    // Add variant prop if variants exist
    if (knowledge.tokenBindings.variants) {
      const variantNames = Object.keys(knowledge.tokenBindings.variants);
      if (variantNames.length > 0) {
        const variantUnion = variantNames.map(v => `'${v}'`).join(' | ');
        lines.push(`  variant?: ${variantUnion};`);
      }
    }

    // Add common props
    lines.push(`  disabled?: boolean;`);
    lines.push(`  className?: string;`);
    lines.push(`  style?: React.CSSProperties;`);

    // Add category-specific props
    switch (knowledge.category) {
      case 'input':
        lines.push(`  value?: any;`);
        lines.push(`  onChange?: (value: any) => void;`);
        lines.push(`  placeholder?: string;`);
        lines.push(`  required?: boolean;`);
        break;
      case 'action':
        lines.push(`  onClick?: () => void;`);
        lines.push(`  type?: 'button' | 'submit' | 'reset';`);
        break;
      case 'display':
      case 'container':
      case 'navigation':
        lines.push(`  children?: React.ReactNode;`);
        break;
    }

    lines.push(`}`);

    return lines.join('\n');
  }

  /**
   * Generates schema and type definition together
   *
   * @param knowledge - ComponentKnowledge entry
   * @returns Object with schema and type definition
   */
  generate(knowledge: ComponentKnowledge): {
    schema: z.ZodObject<any>;
    typeDefinition: string;
    propsType: string;
  } {
    const schema = this.generateSchema(knowledge);
    const typeDefinition = this.generateTypeDefinition(knowledge);

    return {
      schema,
      typeDefinition,
      propsType: `${knowledge.name}Props`,
    };
  }
}
