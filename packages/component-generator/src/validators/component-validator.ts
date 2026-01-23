/**
 * Component Validator
 * TASK-002: Blueprint validation against knowledge schema
 */

import type {
  ComponentBlueprint,
  ComponentKnowledge,
  KnowledgeSchema,
  SlotMapping,
  PropMapping,
} from '../types/knowledge-types.js';

/**
 * Validation error types
 */
export type ValidationErrorType =
  | 'unknown_component'
  | 'missing_required_slot'
  | 'invalid_prop_value'
  | 'type_mismatch'
  | 'unknown_slot'
  | 'unknown_prop';

/**
 * Validation error details
 */
export interface ValidationError {
  type: ValidationErrorType;
  message: string;
  field?: string;
  path?: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates component blueprints against knowledge schema
 */
export class ComponentValidator {
  private componentMap: Map<string, ComponentKnowledge>;

  constructor(schema: KnowledgeSchema) {
    this.componentMap = new Map(
      schema.components.map((comp) => [comp.componentName, comp])
    );
  }

  /**
   * Validate a component blueprint
   */
  validateBlueprint(blueprint: ComponentBlueprint, path = 'root'): ValidationResult {
    const errors: ValidationError[] = [];

    // Check if component exists
    const component = this.componentMap.get(blueprint.componentName);
    if (!component) {
      errors.push({
        type: 'unknown_component',
        message: `Component '${blueprint.componentName}' not found in schema`,
        path,
      });
      return { isValid: false, errors };
    }

    // Validate slots
    const slotErrors = this.validateSlots(blueprint, component, path);
    errors.push(...slotErrors);

    // Validate props
    const propErrors = this.validateProps(blueprint, component, path);
    errors.push(...propErrors);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate slot mappings
   */
  private validateSlots(
    blueprint: ComponentBlueprint,
    component: ComponentKnowledge,
    path: string
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check required slots
    for (const slotDef of component.slots) {
      if (slotDef.required && !blueprint.slotMappings[slotDef.slotName]) {
        errors.push({
          type: 'missing_required_slot',
          message: `Required slot '${slotDef.slotName}' is missing`,
          field: slotDef.slotName,
          path,
        });
      }
    }

    // Validate each slot mapping
    for (const [slotName, mapping] of Object.entries(blueprint.slotMappings)) {
      const slotErrors = this.validateSlotMapping(
        slotName,
        mapping,
        component,
        `${path}.slots.${slotName}`
      );
      errors.push(...slotErrors);
    }

    return errors;
  }

  /**
   * Validate a single slot mapping
   */
  private validateSlotMapping(
    slotName: string,
    mapping: SlotMapping,
    component: ComponentKnowledge,
    path: string
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check if slot exists in component
    const slotDef = component.slots.find((s) => s.slotName === slotName);
    if (!slotDef) {
      errors.push({
        type: 'unknown_slot',
        message: `Slot '${slotName}' not found in component '${component.componentName}'`,
        field: slotName,
        path,
      });
      return errors;
    }

    // Validate based on mapping type
    if (mapping.type === 'component') {
      // Recursively validate nested blueprint
      const nestedResult = this.validateBlueprint(mapping.blueprint, `${path}.component`);
      errors.push(...nestedResult.errors);
    } else if (mapping.type === 'array') {
      // Validate each item in array
      mapping.items.forEach((item, index) => {
        const itemErrors = this.validateSlotMapping(
          slotName,
          item,
          component,
          `${path}[${index}]`
        );
        errors.push(...itemErrors);
      });
    }

    return errors;
  }

  /**
   * Validate prop mappings
   */
  private validateProps(
    blueprint: ComponentBlueprint,
    component: ComponentKnowledge,
    path: string
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate each prop mapping
    for (const [propName, mapping] of Object.entries(blueprint.propMappings)) {
      const propErrors = this.validatePropMapping(
        propName,
        mapping,
        component,
        `${path}.props.${propName}`
      );
      errors.push(...propErrors);
    }

    return errors;
  }

  /**
   * Validate a single prop mapping
   */
  private validatePropMapping(
    propName: string,
    mapping: PropMapping,
    component: ComponentKnowledge,
    path: string
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check if prop exists in component
    const propDef = component.props.find((p) => p.propName === propName);
    if (!propDef) {
      errors.push({
        type: 'unknown_prop',
        message: `Prop '${propName}' not found in component '${component.componentName}'`,
        field: propName,
        path,
      });
      return errors;
    }

    // Validate type
    const actualType = typeof mapping.value;
    const expectedType = propDef.propType;

    if (expectedType === 'string' && actualType !== 'string') {
      errors.push({
        type: 'type_mismatch',
        message: `Prop '${propName}' expects string, got ${actualType}`,
        field: propName,
        path,
      });
    } else if (expectedType === 'number' && actualType !== 'number') {
      errors.push({
        type: 'type_mismatch',
        message: `Prop '${propName}' expects number, got ${actualType}`,
        field: propName,
        path,
      });
    } else if (expectedType === 'boolean' && actualType !== 'boolean') {
      errors.push({
        type: 'type_mismatch',
        message: `Prop '${propName}' expects boolean, got ${actualType}`,
        field: propName,
        path,
      });
    } else if (expectedType === 'enum') {
      // Validate enum value
      if (actualType !== 'string') {
        errors.push({
          type: 'type_mismatch',
          message: `Enum prop '${propName}' expects string, got ${actualType}`,
          field: propName,
          path,
        });
      } else if (
        propDef.possibleValues &&
        !propDef.possibleValues.includes(mapping.value as string)
      ) {
        errors.push({
          type: 'invalid_prop_value',
          message: `Prop '${propName}' value '${mapping.value}' is not in allowed values: ${propDef.possibleValues.join(', ')}`,
          field: propName,
          path,
        });
      }
    }

    return errors;
  }
}
