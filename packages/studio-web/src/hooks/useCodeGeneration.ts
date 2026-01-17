/**
 * useCodeGeneration Hook
 * Generate code snippets for preview
 */

import { useMemo } from 'react';
import {
  generateHTMLCode,
  generateJSXCode,
  generateCSSCode,
  type ComponentState,
  type HookName,
} from '@/lib/component-preview';

export type CodeFormat = 'html' | 'jsx' | 'css';

export interface GeneratedCode {
  html: string;
  jsx: string;
  css: string;
}

interface UseCodeGenerationProps {
  hookName: HookName | null;
  componentState: ComponentState;
  styles: Record<string, string>;
  children?: string;
}

/**
 * Generate code in multiple formats
 */
export function useCodeGeneration({
  hookName,
  componentState,
  styles,
  children = 'Click me',
}: UseCodeGenerationProps): GeneratedCode {
  return useMemo(() => {
    if (!hookName) {
      return {
        html: '<!-- Select a hook to preview -->',
        jsx: '// Select a hook to preview',
        css: '/* Select a hook to preview */',
      };
    }

    const htmlElement = getHtmlElement(hookName);
    const className = hookName.replace('use', '').toLowerCase();

    return {
      html: generateHTMLCode({
        hookName,
        htmlElement,
        state: componentState,
        styles,
        children,
      }),
      jsx: generateJSXCode({
        hookName,
        htmlElement,
        state: componentState,
        styles,
        children,
      }),
      css: generateCSSCode(className, styles),
    };
  }, [hookName, componentState, styles, children]);
}

/**
 * Get HTML element for a hook
 */
function getHtmlElement(hookName: string): string {
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
