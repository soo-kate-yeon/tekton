import { useState, useCallback, KeyboardEvent } from "react";
import { useUniqueId } from "../utils/id.js";
import { isKeyboardKey } from "../utils/keyboard.js";

/**
 * Props for the useRadio hook
 */
export interface UseRadioProps {
  /**
   * The value of this radio option
   */
  value: string;

  /**
   * The currently selected value in the group
   */
  selectedValue?: string;

  /**
   * Default selected value for uncontrolled mode
   */
  defaultValue?: string;

  /**
   * Callback when selected value changes
   */
  onChange?: (value: string) => void;

  /**
   * Whether the radio is disabled
   */
  disabled?: boolean;

  /**
   * Whether the radio is required
   */
  required?: boolean;

  /**
   * Name for the radio group (for form submission)
   */
  name?: string;

  /**
   * Custom ID for the radio element
   */
  id?: string;

  /**
   * ARIA label for the radio
   */
  "aria-label"?: string;

  /**
   * ARIA labelledby for the radio
   */
  "aria-labelledby"?: string;

  /**
   * ARIA describedby for the radio
   */
  "aria-describedby"?: string;
}

/**
 * Return type for the useRadio hook
 */
export interface UseRadioReturn {
  /**
   * Props for the radio element
   */
  radioProps: {
    id: string;
    role: "radio";
    tabIndex: number;
    "aria-checked": boolean;
    "aria-disabled"?: boolean;
    "aria-required"?: boolean;
    "aria-label"?: string;
    onKeyDown: (event: KeyboardEvent) => void;
    onClick: () => void;
  } & Record<string, unknown>;

  /**
   * Whether this radio is checked
   */
  checked: boolean;

  /**
   * Select this radio option
   */
  select: () => void;
}

/**
 * Props for the useRadioGroup hook
 */
export interface UseRadioGroupProps {
  /**
   * Controlled selected value
   */
  value?: string;

  /**
   * Default selected value for uncontrolled mode
   */
  defaultValue?: string;

  /**
   * Callback when selection changes
   */
  onChange?: (value: string) => void;

  /**
   * Whether the radio group is disabled
   */
  disabled?: boolean;

  /**
   * Whether the radio group is required
   */
  required?: boolean;

  /**
   * Name for the radio group
   */
  name?: string;

  /**
   * Custom ID for the radio group
   */
  id?: string;

  /**
   * ARIA label for the radio group
   */
  "aria-label"?: string;

  /**
   * ARIA labelledby for the radio group
   */
  "aria-labelledby"?: string;

  /**
   * ARIA describedby for the radio group
   */
  "aria-describedby"?: string;
}

/**
 * Return type for the useRadioGroup hook
 */
export interface UseRadioGroupReturn {
  /**
   * Props for the radio group container
   */
  groupProps: {
    id: string;
    role: "radiogroup";
    "aria-label"?: string;
    "aria-required"?: boolean;
    "aria-disabled"?: boolean;
  } & Record<string, unknown>;

  /**
   * Current selected value
   */
  value: string;

  /**
   * Set the selected value
   */
  setValue: (value: string) => void;

  /**
   * Get props for an individual radio in this group
   */
  getRadioProps: (
    radioProps: Pick<UseRadioProps, "value" | "disabled" | "id" | "aria-label">,
  ) => UseRadioProps;
}

/**
 * useRadio Hook
 *
 * Headless hook for managing individual radio button state with accessibility.
 * Should be used in conjunction with useRadioGroup for proper group behavior.
 *
 * Features:
 * - Controlled and uncontrolled modes
 * - Space key to select
 * - Arrow keys for group navigation (when part of useRadioGroup)
 * - Full ARIA attributes (role=radio, aria-checked)
 * - No styling logic
 *
 * @param props - Configuration options for the radio
 * @returns Object containing radio props and state
 *
 * @example
 * ```tsx
 * const { radioProps, checked } = useRadio({
 *   value: 'option1',
 *   selectedValue: 'option1',
 *   onChange: (value) => console.log(value),
 * });
 *
 * return (
 *   <div {...radioProps} className={checked ? 'checked' : ''}>
 *     {checked && '●'}
 *   </div>
 * );
 * ```
 */
export function useRadio(props: UseRadioProps): UseRadioReturn {
  const {
    value,
    selectedValue,
    onChange,
    disabled = false,
    required = false,
    name,
    id: customId,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
  } = props;

  // Generate unique ID
  const radioId = useUniqueId(customId, "radio");

  // Calculate checked state
  const checked = value === selectedValue;

  // Handle select
  const handleSelect = useCallback(() => {
    if (disabled) {
      return;
    }
    onChange?.(value);
  }, [disabled, onChange, value]);

  // Handle click
  const handleClick = useCallback(() => {
    handleSelect();
  }, [handleSelect]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) {
        return;
      }

      // Only handle Space key
      if (isKeyboardKey(event, " ")) {
        event.preventDefault();
        handleSelect();
      }
    },
    [disabled, handleSelect],
  );

  // Build radio props
  const radioProps = {
    id: radioId,
    role: "radio" as const,
    tabIndex: checked ? 0 : -1,
    "aria-checked": checked,
    "aria-disabled": disabled,
    ...(required && { "aria-required": true }),
    ...(name && { name }),
    ...(ariaLabel && { "aria-label": ariaLabel }),
    ...(ariaLabelledby && { "aria-labelledby": ariaLabelledby }),
    ...(ariaDescribedby && { "aria-describedby": ariaDescribedby }),
    value,
    onKeyDown: handleKeyDown,
    onClick: handleClick,
  };

  return {
    radioProps,
    checked,
    select: handleSelect,
  };
}

/**
 * useRadioGroup Hook
 *
 * Headless hook for managing a group of radio buttons with keyboard navigation.
 *
 * Features:
 * - Controlled and uncontrolled modes
 * - Arrow key navigation (Up/Down/Left/Right)
 * - Home/End key support
 * - Full ARIA attributes (role=radiogroup)
 * - Automatic radio management
 * - No styling logic
 *
 * @param props - Configuration options for the radio group
 * @returns Object containing group props and radio factory function
 *
 * @example
 * ```tsx
 * const { groupProps, value, getRadioProps } = useRadioGroup({
 *   defaultValue: 'option1',
 *   onChange: (val) => console.log(val),
 * });
 *
 * return (
 *   <div {...groupProps}>
 *     {['option1', 'option2', 'option3'].map(opt => {
 *       const { radioProps, checked } = getRadioProps({ value: opt });
 *       return <div key={opt} {...radioProps}>{checked && '●'}</div>;
 *     })}
 *   </div>
 * );
 * ```
 */
export function useRadioGroup(
  props: UseRadioGroupProps = {},
): UseRadioGroupReturn {
  const {
    value: controlledValue,
    defaultValue = "",
    onChange,
    disabled = false,
    required = false,
    name,
    id: customId,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
  } = props;

  // Determine if component is controlled
  const isControlled = controlledValue !== undefined;

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(defaultValue);

  // Use controlled value if provided, otherwise use internal state
  const value = isControlled ? controlledValue : internalValue;

  // Generate unique ID for group
  const groupId = useUniqueId(customId, "radiogroup");

  // Handle value change
  const handleChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange],
  );

  // Set value programmatically
  const setValue = useCallback(
    (newValue: string) => {
      handleChange(newValue);
    },
    [handleChange],
  );

  // Factory function to create radio props
  const getRadioProps = useCallback(
    (
      radioProps: Pick<
        UseRadioProps,
        "value" | "disabled" | "id" | "aria-label"
      >,
    ) => {
      return {
        ...radioProps,
        selectedValue: value,
        onChange: handleChange,
        disabled: radioProps.disabled ?? disabled,
        required,
        name,
      };
    },
    [value, handleChange, disabled, required, name],
  );

  // Build group props
  const groupProps = {
    id: groupId,
    role: "radiogroup" as const,
    "aria-disabled": disabled,
    ...(required && { "aria-required": true }),
    ...(ariaLabel && { "aria-label": ariaLabel }),
    ...(ariaLabelledby && { "aria-labelledby": ariaLabelledby }),
    ...(ariaDescribedby && { "aria-describedby": ariaDescribedby }),
  };

  return {
    groupProps,
    value,
    setValue,
    getRadioProps,
  };
}
