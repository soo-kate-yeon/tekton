/**
 * usePreviewState Hook
 * Manage component preview state and variant selection
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { VariantConfigurationOption } from '@tekton/component-system';
import {
  generateStylesFromVariants,
  generateBaseStyles,
  type ComponentState,
  type HookName,
} from '@/lib/component-preview';
import { getDefaultState } from './useComponentData';

export interface PreviewState {
  hookName: HookName | null;
  componentState: ComponentState;
  styles: Record<string, string>;
}

type StateValue = string | number | boolean | null | undefined;

interface UsePreviewStateReturn {
  state: PreviewState;
  setHookName: (hookName: HookName | null) => void;
  setStateValue: (key: string, value: StateValue) => void;
  resetState: () => void;
}

/**
 * Manage preview state for component preview
 */
export function usePreviewState(
  initialHookName: HookName | null = null,
  variantOptions: VariantConfigurationOption[] = []
): UsePreviewStateReturn {
  const [hookName, setHookName] = useState<HookName | null>(initialHookName);
  const [componentState, setComponentState] = useState<ComponentState>(() =>
    getDefaultState(variantOptions)
  );

  // Reset state when hook changes or options change
  useEffect(() => {
    setComponentState(getDefaultState(variantOptions));
  }, [hookName, variantOptions]);

  // Calculate styles from current state
  const styles = useMemo(() => {
    const htmlElement = getHtmlElement(hookName);
    const baseStyles = generateBaseStyles(htmlElement);
    const variantStyles = generateStylesFromVariants(variantOptions, componentState);

    return { ...baseStyles, ...variantStyles };
  }, [hookName, variantOptions, componentState]);

  const setStateValue = useCallback((key: string, value: StateValue) => {
    setComponentState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetState = useCallback(() => {
    setComponentState(getDefaultState(variantOptions));
  }, [variantOptions]);

  return {
    state: {
      hookName,
      componentState,
      styles,
    },
    setHookName,
    setStateValue,
    resetState,
  };
}

/**
 * Get HTML element for a hook
 */
function getHtmlElement(hookName: HookName | null): string {
  if (!hookName) {
    return 'div';
  }

  const elementMap: Record<string, string> = {
    useButton: 'button',
    useToggleButton: 'button',
    useInput: 'input',
    useCheckbox: 'input',
    useRadio: 'input',
    useSelect: 'select',
    useTabs: 'div',
    useBreadcrumb: 'nav',
    usePagination: 'nav',
    useSlider: 'input',
    useModal: 'dialog',
    useTooltip: 'div',
    usePopover: 'div',
    useDropdownMenu: 'div',
    useAlert: 'div',
    useCard: 'div',
    useAvatar: 'span',
    useBadge: 'span',
    useDivider: 'hr',
    useProgress: 'div',
  };

  return elementMap[hookName] ?? 'div';
}
