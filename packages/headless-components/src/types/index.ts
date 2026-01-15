/**
 * Base hook props shared across all headless components
 */
export interface BaseHookProps {
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Unique identifier for the component */
  id?: string;
  /** Accessible label for screen readers */
  'aria-label'?: string;
  /** ID of element that labels this component */
  'aria-labelledby'?: string;
  /** ID of element that describes this component */
  'aria-describedby'?: string;
}

/**
 * Generic state hook return type
 */
export interface StateHookReturn<T> {
  /** Current value */
  value: T;
  /** Set new value */
  setValue: (value: T | ((prev: T) => T)) => void;
  /** Reset to initial value */
  reset: () => void;
}

/**
 * Keyboard event handler type
 */
export type KeyboardHandler = (event: React.KeyboardEvent) => void;

/**
 * Mouse/Click event handler type
 */
export type ClickHandler = (event: React.MouseEvent) => void;

/**
 * Focus event handler type
 */
export type FocusHandler = (event: React.FocusEvent) => void;

/**
 * Change event handler for input elements
 */
export type ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;

/**
 * ARIA role types
 */
export type AriaRole =
  | 'button'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'combobox'
  | 'listbox'
  | 'option'
  | 'tablist'
  | 'tab'
  | 'tabpanel'
  | 'dialog'
  | 'alertdialog'
  | 'alert'
  | 'tooltip'
  | 'menu'
  | 'menuitem'
  | 'navigation'
  | 'progressbar'
  | 'slider'
  | 'separator'
  | 'img'
  | 'article'
  | 'region'
  | 'status';

/**
 * Keyboard key names
 */
export type KeyboardKey =
  | 'Enter'
  | ' '
  | 'Escape'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Home'
  | 'End'
  | 'Tab';

/**
 * Controlled/uncontrolled mode detection
 */
export type ControlMode = 'controlled' | 'uncontrolled';
