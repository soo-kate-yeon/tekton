import { useState, useCallback, ChangeEvent, FocusEvent } from "react";
import { useUniqueId } from "../utils/id.js";

/**
 * Props for the useInput hook
 */
export interface UseInputProps {
  /**
   * The controlled value of the input
   */
  value?: string;

  /**
   * Default value for uncontrolled mode
   */
  defaultValue?: string;

  /**
   * Callback when value changes
   */
  onChange?: (value: string) => void;

  /**
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * Whether the input is required
   */
  required?: boolean;

  /**
   * Whether the input is read-only
   */
  readOnly?: boolean;

  /**
   * Validation error message (sets aria-invalid)
   */
  errorMessage?: string;

  /**
   * Input type (text, email, password, etc.)
   */
  type?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Callback when input gains focus
   */
  onFocus?: () => void;

  /**
   * Callback when input loses focus
   */
  onBlur?: () => void;

  /**
   * Custom ID for the input element
   */
  id?: string;

  /**
   * ARIA label for the input
   */
  "aria-label"?: string;

  /**
   * ARIA labelledby for the input
   */
  "aria-labelledby"?: string;

  /**
   * ARIA describedby for the input
   */
  "aria-describedby"?: string;
}

/**
 * Return type for the useInput hook
 */
export interface UseInputReturn {
  /**
   * Props for the input element
   */
  inputProps: {
    id: string;
    value: string;
    type: string;
    placeholder?: string;
    disabled: boolean;
    readOnly: boolean;
    required: boolean;
    "aria-invalid": boolean;
    "aria-errormessage"?: string;
    "aria-label"?: string;
    onChange: (_event: ChangeEvent<HTMLInputElement>) => void;
    onFocus: (_event: FocusEvent<HTMLInputElement>) => void;
    onBlur: (_event: FocusEvent<HTMLInputElement>) => void;
  } & Record<string, unknown>;

  /**
   * Current value of the input
   */
  value: string;

  /**
   * Whether the input is in an error state
   */
  isInvalid: boolean;

  /**
   * Set the input value programmatically
   */
  setValue: (value: string) => void;

  /**
   * Clear the input value
   */
  clear: () => void;

  /**
   * Props for the error message element (if errorMessage is provided)
   */
  errorProps?: {
    id: string;
    role: string;
  };
}

/**
 * useInput Hook
 *
 * Headless hook for managing text input state and behavior with full accessibility support.
 *
 * Features:
 * - Controlled and uncontrolled modes
 * - Focus/blur event handling
 * - Validation state with aria-invalid
 * - Full ARIA attribute support
 * - Type support (text, email, password, etc.)
 * - No styling logic
 *
 * @param props - Configuration options for the input
 * @returns Object containing input props and state management functions
 *
 * @example
 * ```tsx
 * const { inputProps, value, isInvalid, setValue, clear } = useInput({
 *   defaultValue: '',
 *   errorMessage: value ? undefined : 'This field is required',
 *   required: true,
 *   type: 'email',
 * });
 *
 * return (
 *   <div>
 *     <input {...inputProps} className="custom-input" />
 *     {isInvalid && <span {...errorProps}>Error!</span>}
 *   </div>
 * );
 * ```
 */
export function useInput(props: UseInputProps = {}): UseInputReturn {
  const {
    value: controlledValue,
    defaultValue = "",
    onChange,
    disabled = false,
    required = false,
    readOnly = false,
    errorMessage,
    type = "text",
    placeholder,
    onFocus,
    onBlur,
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

  // Generate unique IDs
  const inputId = useUniqueId(customId, "input");
  const errorId = useUniqueId(undefined, "input-error");

  // Determine if input is invalid
  const isInvalid = Boolean(errorMessage);

  // Handle change event
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (disabled || readOnly) {
        return;
      }

      const newValue = event.target.value;

      // Update internal state in uncontrolled mode
      if (!isControlled) {
        setInternalValue(newValue);
      }

      // Call onChange callback
      onChange?.(newValue);
    },
    [disabled, readOnly, isControlled, onChange],
  );

  // Handle focus event
  const handleFocus = useCallback(
    (_event: FocusEvent<HTMLInputElement>) => {
      onFocus?.();
    },
    [onFocus],
  );

  // Handle blur event
  const handleBlur = useCallback(
    (_event: FocusEvent<HTMLInputElement>) => {
      onBlur?.();
    },
    [onBlur],
  );

  // Programmatically set value
  const setValue = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange],
  );

  // Clear value
  const clear = useCallback(() => {
    if (!isControlled) {
      setInternalValue("");
    }
    onChange?.("");
  }, [isControlled, onChange]);

  // Build input props
  const inputProps = {
    id: inputId,
    value,
    type,
    ...(placeholder && { placeholder }),
    disabled,
    readOnly,
    required,
    "aria-disabled": disabled,
    "aria-invalid": isInvalid,
    "aria-required": required,
    ...(ariaLabel && { "aria-label": ariaLabel }),
    ...(ariaLabelledby && { "aria-labelledby": ariaLabelledby }),
    ...(ariaDescribedby && { "aria-describedby": ariaDescribedby }),
    ...(isInvalid && { "aria-errormessage": errorId }),
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  // Build error props
  const errorProps = errorMessage
    ? {
        id: errorId,
        role: "alert" as const,
      }
    : undefined;

  return {
    inputProps,
    value,
    isInvalid,
    setValue,
    clear,
    ...(errorProps && { errorProps }),
  };
}
