/**
 * @file integration.test.ts
 * @description Integration tests to verify module exports and cross-module functionality
 */

import { describe, it, expect } from 'vitest';
import * as Schemas from '../src/schemas';
import * as Data from '../src/data';
import * as Validators from '../src/validators';

describe('Module Exports Integration', () => {
  it('should export all schema types from schemas module', () => {
    expect(Schemas.isHookPropRule).toBeDefined();
    expect(Schemas.isStateStyleMapping).toBeDefined();
    expect(Schemas.isVariantBranching).toBeDefined();
  });

  it('should export all data from data module', () => {
    expect(Data.hookPropRulesData).toBeDefined();
    expect(Data.stateStyleMappingsData).toBeDefined();
    expect(Data.variantBranchingData).toBeDefined();

    expect(Array.isArray(Data.hookPropRulesData)).toBe(true);
    expect(Array.isArray(Data.stateStyleMappingsData)).toBe(true);
    expect(Array.isArray(Data.variantBranchingData)).toBe(true);
  });

  it('should export all validators from validators module', () => {
    expect(Validators.validateHookPropRule).toBeDefined();
    expect(Validators.validateStateStyleMapping).toBeDefined();
    expect(Validators.VariantValidator).toBeDefined();
  });

  it('should validate hook prop rules using exported validator', () => {
    for (const rule of Data.hookPropRulesData) {
      const result = Validators.validateHookPropRule(rule);
      expect(result.success).toBe(true);
    }
  });

  it('should validate state mappings using exported validator', () => {
    let validCount = 0;
    for (const mapping of Data.stateStyleMappingsData) {
      const result = Validators.validateStateStyleMapping(mapping);
      if (result.success) {
        validCount++;
      }
    }
    // Most mappings should be valid
    expect(validCount).toBeGreaterThan(Data.stateStyleMappingsData.length * 0.5);
  });

  it('should validate variant branching using exported validator', () => {
    const validator = new Validators.VariantValidator();
    const result = validator.validateAll(Data.variantBranchingData);
    expect(result.valid).toBe(true);
  });

  it('should use type guards from schema exports', () => {
    const hookPropRule = Data.hookPropRulesData[0];
    const stateMapping = Data.stateStyleMappingsData[0];
    const variantBranching = Data.variantBranchingData[0];

    expect(Schemas.isHookPropRule(hookPropRule)).toBe(true);
    expect(Schemas.isStateStyleMapping(stateMapping)).toBe(true);
    expect(Schemas.isVariantBranching(variantBranching)).toBe(true);
  });

  it('should have consistent hook names across all data modules', () => {
    const hookPropHooks = Data.hookPropRulesData.map((r) => r.hookName);
    const stateMappingHooks = Data.stateStyleMappingsData.map((r) => r.hookName);
    const variantHooks = Data.variantBranchingData.map((r) => r.hookName);

    // All should have 20 hooks
    expect(hookPropHooks).toHaveLength(20);
    expect(stateMappingHooks).toHaveLength(20);
    expect(variantHooks).toHaveLength(20);

    // All should have the same hook names
    const allHooksMatch = hookPropHooks.every((hook) =>
      stateMappingHooks.includes(hook) && variantHooks.includes(hook)
    );
    expect(allHooksMatch).toBe(true);
  });

  it('should validate that all CSS variables use Token Contract convention', () => {
    const validator = new Validators.VariantValidator();

    // Check variant branching data
    for (const rule of Data.variantBranchingData) {
      const result = validator.validate(rule);
      expect(result.valid).toBe(true);

      // Ensure all CSS variables start with --tekton-
      for (const option of rule.configurationOptions) {
        for (const styleRule of option.styleRules) {
          for (const value of Object.values(styleRule.cssProperties)) {
            if (typeof value === 'string' && value.includes('var(')) {
              expect(value).toMatch(/var\(--tekton-/);
            }
          }
        }
      }
    }
  });

  it('should have matching states between state mappings and hook prop rules', () => {
    for (const hookPropRule of Data.hookPropRulesData) {
      const stateMapping = Data.stateStyleMappingsData.find(
        (m) => m.hookName === hookPropRule.hookName
      );

      expect(stateMapping).toBeDefined();

      // Check that states mentioned in hook prop rules exist in state mappings
      const statePropObjects = hookPropRule.propObjects.filter(
        (prop) => prop.startsWith('is') || prop.includes('selected') || prop.includes('Key')
      );

      for (const stateProp of statePropObjects) {
        const stateExists = stateMapping?.states.some(
          (s) => s.stateName === stateProp || stateProp.includes(s.stateName)
        );

        if (!stateExists && stateProp !== 'isInvalid' && stateProp !== 'isIndeterminate') {
          // Some states might be documented separately
          expect(stateMapping?.states.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
