import type { AriaRole } from '../types';

/**
 * ARIA props configuration
 */
export interface AriaPropsConfig {
  role?: AriaRole;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-disabled'?: boolean;
  'aria-pressed'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-controls'?: string;
  'aria-activedescendant'?: string;
  'aria-selected'?: boolean;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  'aria-modal'?: boolean;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
  'aria-orientation'?: 'horizontal' | 'vertical';
  'aria-hidden'?: boolean;
}

/**
 * Generate ARIA props based on configuration
 */
export function generateAriaProps(config: AriaPropsConfig): Record<string, any> {
  const props: Record<string, any> = {};

  // Add role if provided
  if (config.role) {
    props.role = config.role;
  }

  // Add aria-disabled based on disabled state
  if (config.disabled !== undefined) {
    props['aria-disabled'] = config.disabled;
  }

  // Add all other ARIA attributes
  const ariaKeys = Object.keys(config).filter((key) => key.startsWith('aria-'));
  ariaKeys.forEach((key) => {
    const value = config[key as keyof AriaPropsConfig];
    if (value !== undefined) {
      props[key] = value;
    }
  });

  return props;
}

/**
 * Merge multiple ARIA prop objects
 * Later objects override earlier ones
 */
export function mergeAriaProps(
  ...propObjects: Record<string, any>[]
): Record<string, any> {
  return Object.assign({}, ...propObjects);
}
