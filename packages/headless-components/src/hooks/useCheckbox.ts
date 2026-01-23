import { useState, useCallback, KeyboardEvent } from "react";
import { isKeyboardKey } from "../utils/keyboard.js";
import { useUniqueId } from "../utils/id.js";

/**
 * Props for the useCheckbox hook
 */
export interface UseCheckboxProps {
  /**
   * Controlled checked state
   */
  checked?: boolean;

  /**
   * Default checked state for uncontrolled mode
   */
  defaultChecked?: boolean;

  /**
   * Callback when checked state changes
   */
  onChange?: (checked: boolean) => void;

  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean;

  /**
   * Whether the checkbox is required
   */
  required?: boolean;

  /**
   * Indeterminate state (neither checked nor unchecked)
   */
  indeterminate?: boolean;

  /**
   * Callback when indeterminate state changes
   */
  onIndeterminateChange?: (indeterminate: boolean) => void;

  /**
   * Custom ID for the checkbox element
   */
  id?: string;

  /**
   * ARIA label for the checkbox
   */
  "aria-label"?: string;

  /**
   * ARIA labelledby for the checkbox
   */
  "aria-labelledby"?: string;

  /**
   * ARIA describedby for the checkbox
   */
  "aria-describedby"?: string;
}

/**
 * Return type for the useCheckbox hook
 */
export interface UseCheckboxReturn {
  /**
   * Props for the checkbox element
   */
  checkboxProps: {
    id: string;
    role: "checkbox";
    tabIndex: number;
    "aria-checked": boolean | "mixed";
    "aria-disabled"?: boolean;
    "aria-required"?: boolean;
    "aria-label"?: string;
    onKeyDown: (event: KeyboardEvent) => void;
    onClick: () => void;
  } & Record<string, unknown>;

  /**
   * Current checked state
   */
  checked: boolean;

  /**
   * Whether checkbox is in indeterminate state
   */
  indeterminate: boolean;

  /**
   * Set checked state programmatically
   */
  setChecked: (checked: boolean) => void;

  /**
   * Toggle checked state
   */
  toggle: () => void;
}

/**
 * useCheckbox Hook
 *
 * Headless hook for managing checkbox state and behavior with full accessibility support.
 *
 * Features:
 * - Controlled and uncontrolled modes
 * - Indeterminate state support
 * - Space key to toggle
 * - Full ARIA attributes (role=checkbox, aria-checked)
 * - Keyboard navigation
 * - No styling logic
 *
 * @param props - Configuration options for the checkbox
 * @returns Object containing checkbox props and state management functions
 *
 * @example
 * ```tsx
 * const { checkboxProps, checked, indeterminate, toggle } = useCheckbox({
 *   defaultChecked: false,
 *   indeterminate: false,
 * });
 *
 * return (
 *   <div
 *     {...checkboxProps}
 *     className={checked ? 'checked' : indeterminate ? 'indeterminate' : ''}
 *   >
 *     {checked && '✓'}
 *     {indeterminate && '−'}
 *   </div>
 * );
 * ```
 */
export function useCheckbox(props: UseCheckboxProps = {}): UseCheckboxReturn {
  const {
    checked: controlledChecked,
    defaultChecked = false,
    onChange,
    disabled = false,
    required = false,
    indeterminate = false,
    onIndeterminateChange,
    id: customId,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
  } = props;

  // Determine if component is controlled
  const isControlled = controlledChecked !== undefined;

  // Internal state for uncontrolled mode
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  // Use controlled state if provided, otherwise use internal state
  const checked = isControlled ? controlledChecked : internalChecked;

  // Generate unique ID
  const checkboxId = useUniqueId(customId, "checkbox");

  // Handle toggle
  const handleToggle = useCallback(() => {
    if (disabled) {
      return;
    }

    const newChecked = !checked;

    // Clear indeterminate state when toggled
    if (indeterminate) {
      onIndeterminateChange?.(false);
    }

    // Update internal state in uncontrolled mode
    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    // Call onChange callback
    onChange?.(newChecked);
  }, [
    disabled,
    checked,
    indeterminate,
    isControlled,
    onChange,
    onIndeterminateChange,
  ]);

  // Handle click
  const handleClick = useCallback(() => {
    handleToggle();
  }, [handleToggle]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) {
        return;
      }

      // Only handle Space key, not Enter
      if (isKeyboardKey(event, " ")) {
        event.preventDefault();
        handleToggle();
      }
    },
    [disabled, handleToggle],
  );

  // Programmatically set checked state
  const setChecked = useCallback(
    (newChecked: boolean) => {
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onChange?.(newChecked);
    },
    [isControlled, onChange],
  );

  // Toggle function
  const toggle = useCallback(() => {
    handleToggle();
  }, [handleToggle]);

  // Calculate aria-checked value
  const ariaChecked: boolean | "mixed" = indeterminate ? "mixed" : checked;

  // Build checkbox props
  const checkboxProps = {
    id: checkboxId,
    role: "checkbox" as const,
    tabIndex: 0,
    "aria-checked": ariaChecked,
    "aria-disabled": disabled,
    ...(required && { "aria-required": true }),
    ...(ariaLabel && { "aria-label": ariaLabel }),
    ...(ariaLabelledby && { "aria-labelledby": ariaLabelledby }),
    ...(ariaDescribedby && { "aria-describedby": ariaDescribedby }),
    onKeyDown: handleKeyDown,
    onClick: handleClick,
  };

  return {
    checkboxProps,
    checked,
    indeterminate,
    setChecked,
    toggle,
  };
}
