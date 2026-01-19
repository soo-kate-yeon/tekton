/**
 * useComponentData Hook
 * Load and manage archetype system data
 */

import { useMemo } from 'react';
import {
  HOOK_METADATA,
  getHookMeta,
  getVariantOptions,
  getAccessibilitySpec,
  type HookName,
  type HookMeta,
} from '@/lib/component-preview';
import type { VariantConfigurationOption, AccessibilitySpec } from '@tekton/component-system';

export interface ComponentData {
  hookMeta: HookMeta | undefined;
  variantOptions: VariantConfigurationOption[];
  accessibility: AccessibilitySpec | undefined;
}

/**
 * Load archetype data for a specific hook
 */
export function useComponentData(hookName: HookName | null): ComponentData {
  return useMemo(() => {
    if (!hookName) {
      return {
        hookMeta: undefined,
        variantOptions: [],
        accessibility: undefined,
      };
    }

    return {
      hookMeta: getHookMeta(hookName),
      variantOptions: getVariantOptions(hookName),
      accessibility: getAccessibilitySpec(hookName),
    };
  }, [hookName]);
}

/**
 * Get all hooks grouped by category
 */
export function useHooksByCategory() {
  return useMemo(() => {
    const categories = {
      form: HOOK_METADATA.filter((h) => h.category === 'form'),
      complex: HOOK_METADATA.filter((h) => h.category === 'complex'),
      overlay: HOOK_METADATA.filter((h) => h.category === 'overlay'),
      display: HOOK_METADATA.filter((h) => h.category === 'display'),
    };

    return categories;
  }, []);
}

type StateValue = string | number | boolean | null | undefined;

/**
 * Get default state values for a hook's variant options
 */
export function getDefaultState(
  options: VariantConfigurationOption[]
): Record<string, StateValue> {
  const state: Record<string, StateValue> = {};

  for (const option of options) {
    if (option.optionType === 'boolean') {
      state[option.optionName] = false;
    } else if (option.possibleValues.length > 0) {
      state[option.optionName] = option.possibleValues[0];
    }
  }

  return state;
}
