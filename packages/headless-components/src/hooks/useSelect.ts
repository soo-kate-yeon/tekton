import { useState, useCallback, KeyboardEvent, useMemo } from "react";
import type { AriaAttributes } from "../types/index.js";
import { generateAriaProps } from "../utils/aria.js";
import { createKeyboardHandler } from "../utils/keyboard.js";
import { useUniqueId } from "../utils/id.js";

/**
 * Option in a select dropdown
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Props for the useSelect hook
 */
export interface UseSelectProps {
  /**
   * Available options
   */
  options: SelectOption[];

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
   * Whether the select is disabled
   */
  disabled?: boolean;

  /**
   * Whether the select is required
   */
  required?: boolean;

  /**
   * Placeholder text when no value selected
   */
  placeholder?: string;

  /**
   * Custom ID for the select element
   */
  id?: string;

  /**
   * ARIA label for the select
   */
  ariaLabel?: string;

  /**
   * Additional ARIA attributes
   */
  ariaAttributes?: Partial<AriaAttributes>;
}

/**
 * Return type for the useSelect hook
 */
export interface UseSelectReturn {
  /**
   * Props for the select trigger button
   */
  triggerProps: {
    id: string;
    role: "combobox";
    tabIndex: number;
    "aria-haspopup": "listbox";
    "aria-expanded": boolean;
    "aria-controls": string;
    "aria-activedescendant"?: string;
    "aria-disabled"?: boolean;
    "aria-required"?: boolean;
    "aria-label"?: string;
    onKeyDown: (event: KeyboardEvent) => void;
    onClick: () => void;
  } & Record<string, unknown>;

  /**
   * Props for the listbox container
   */
  listboxProps: {
    id: string;
    role: "listbox";
    "aria-labelledby": string;
  };

  /**
   * Get props for an individual option
   */
  getOptionProps: (
    option: SelectOption,
    index: number,
  ) => {
    id: string;
    role: "option";
    "aria-selected": boolean;
    "aria-disabled"?: boolean;
    onClick: () => void;
  };

  /**
   * Whether the dropdown is open
   */
  isOpen: boolean;

  /**
   * Current selected value
   */
  value: string;

  /**
   * Current selected option
   */
  selectedOption: SelectOption | null;

  /**
   * Index of highlighted option (for keyboard navigation)
   */
  highlightedIndex: number;

  /**
   * Open the dropdown
   */
  open: () => void;

  /**
   * Close the dropdown
   */
  close: () => void;

  /**
   * Toggle dropdown open/close
   */
  toggle: () => void;

  /**
   * Select an option by value
   */
  selectOption: (value: string) => void;
}

/**
 * useSelect Hook
 *
 * Headless hook for managing select/dropdown state with full keyboard navigation.
 *
 * Features:
 * - Controlled and uncontrolled modes
 * - Arrow key navigation through options
 * - Enter/Space to select highlighted option
 * - Escape to close dropdown
 * - Full ARIA attributes (role=combobox, aria-expanded, aria-activedescendant)
 * - Option highlighting with keyboard
 * - No styling logic
 *
 * @param props - Configuration options for the select
 * @returns Object containing trigger, listbox, and option props
 *
 * @example
 * ```tsx
 * const { triggerProps, listboxProps, getOptionProps, isOpen, selectedOption } = useSelect({
 *   options: [
 *     { value: 'red', label: 'Red' },
 *     { value: 'blue', label: 'Blue' },
 *   ],
 *   defaultValue: 'red',
 * });
 *
 * return (
 *   <div>
 *     <button {...triggerProps}>{selectedOption?.label || 'Select...'}</button>
 *     {isOpen && (
 *       <ul {...listboxProps}>
 *         {options.map((opt, i) => (
 *           <li key={opt.value} {...getOptionProps(opt, i)}>{opt.label}</li>
 *         ))}
 *       </ul>
 *     )}
 *   </div>
 * );
 * ```
 */
export function useSelect(props: UseSelectProps): UseSelectReturn {
  const {
    options,
    value: controlledValue,
    defaultValue = "",
    onChange,
    disabled = false,
    required = false,
    placeholder: _placeholder = "Select...",
    id: customId,
    ariaLabel,
    ariaAttributes = {},
  } = props;

  // Generate unique IDs
  const triggerId = useUniqueId(customId);
  const listboxId = `${triggerId}-listbox`;

  // Determine if component is controlled
  const isControlled = controlledValue !== undefined;

  // State management
  const [internalValue, setInternalValue] = useState(() => {
    // Validate defaultValue is in options
    const validOption = options.find((opt) => opt.value === defaultValue);
    return validOption ? defaultValue : "";
  });
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Use controlled value if provided, otherwise use internal state
  const value = isControlled ? controlledValue : internalValue;

  // Find selected option
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value) || null,
    [options, value],
  );

  // Open/close handlers
  const open = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
      // Reset highlighted index to -1 (no highlight initially)
      setHighlightedIndex(-1);
    }
  }, [disabled]);

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Select option handler
  const selectOption = useCallback(
    (optionValue: string) => {
      const option = options.find((opt) => opt.value === optionValue);
      if (!option || option.disabled) {
        return;
      }

      // Update value
      if (!isControlled) {
        setInternalValue(optionValue);
      }

      // Call onChange callback
      onChange?.(optionValue);

      // Close dropdown
      close();
    },
    [options, isControlled, onChange, close],
  );

  // Find next non-disabled option index
  const findNextEnabledIndex = useCallback(
    (currentIndex: number, direction: 1 | -1): number => {
      // If no current index, start from beginning or end based on direction
      if (currentIndex < 0) {
        if (direction === 1) {
          // Find first non-disabled
          const firstEnabled = options.findIndex((opt) => !opt.disabled);
          return firstEnabled >= 0 ? firstEnabled : 0;
        } else {
          // Find last non-disabled
          const lastEnabledIndex = options
            .slice()
            .reverse()
            .findIndex((opt) => !opt.disabled);
          return lastEnabledIndex >= 0
            ? options.length - 1 - lastEnabledIndex
            : options.length - 1;
        }
      }

      let nextIndex = currentIndex;
      let attempts = 0;

      do {
        nextIndex = nextIndex + direction;

        // Wrap around
        if (nextIndex >= options.length) {
          nextIndex = 0;
        } else if (nextIndex < 0) {
          nextIndex = options.length - 1;
        }

        // Prevent infinite loop
        attempts++;
        if (attempts > options.length) {
          return currentIndex;
        }
      } while (options[nextIndex]?.disabled);

      return nextIndex;
    },
    [options],
  );

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) {
        return;
      }

      const handlers: Record<string, () => void> = {
        ArrowDown: () => {
          if (!isOpen) {
            open();
          } else {
            setHighlightedIndex((current) => findNextEnabledIndex(current, 1));
          }
        },
        ArrowUp: () => {
          if (!isOpen) {
            open();
          } else {
            setHighlightedIndex((current) => findNextEnabledIndex(current, -1));
          }
        },
        Enter: () => {
          if (isOpen && highlightedIndex >= 0) {
            const option = options[highlightedIndex];
            if (option && !option.disabled) {
              selectOption(option.value);
            }
          }
        },
        " ": () => {
          if (isOpen && highlightedIndex >= 0) {
            const option = options[highlightedIndex];
            if (option && !option.disabled) {
              selectOption(option.value);
            }
          }
        },
        Escape: () => {
          if (isOpen) {
            close();
          }
        },
        Home: () => {
          if (isOpen) {
            // Find first non-disabled option
            const firstEnabledIndex = options.findIndex((opt) => !opt.disabled);
            if (firstEnabledIndex >= 0) {
              setHighlightedIndex(firstEnabledIndex);
            }
          }
        },
        End: () => {
          if (isOpen) {
            // Find last non-disabled option
            const lastEnabledIndex = options
              .slice()
              .reverse()
              .findIndex((opt) => !opt.disabled);
            if (lastEnabledIndex >= 0) {
              setHighlightedIndex(options.length - 1 - lastEnabledIndex);
            }
          }
        },
      };

      const keyboardHandler = createKeyboardHandler(handlers);
      keyboardHandler(event);
    },
    [
      disabled,
      isOpen,
      open,
      close,
      highlightedIndex,
      findNextEnabledIndex,
      options,
      selectOption,
    ],
  );

  // Click handler for trigger
  const handleTriggerClick = useCallback(() => {
    if (!disabled) {
      toggle();
    }
  }, [disabled, toggle]);

  // Get props for individual option
  const getOptionProps = useCallback(
    (option: SelectOption, index: number) => {
      const optionId = `${listboxId}-option-${index}`;
      const isSelected = option.value === value;

      return {
        id: optionId,
        role: "option" as const,
        "aria-selected": isSelected,
        ...(option.disabled && { "aria-disabled": true }),
        onClick: () => {
          if (!option.disabled) {
            selectOption(option.value);
          }
        },
      };
    },
    [listboxId, value, selectOption],
  );

  // Calculate aria-activedescendant
  const activeDescendant =
    isOpen && highlightedIndex >= 0
      ? `${listboxId}-option-${highlightedIndex}`
      : undefined;

  // Generate ARIA props for trigger
  const triggerAriaProps = generateAriaProps({
    role: "combobox",
    "aria-haspopup": "listbox",
    "aria-expanded": isOpen,
    "aria-controls": listboxId,
    "aria-activedescendant": activeDescendant,
    "aria-disabled": disabled,
    "aria-required": required,
    "aria-label": ariaLabel,
    ...ariaAttributes,
  });

  return {
    triggerProps: {
      ...triggerAriaProps,
      id: triggerId,
      role: "combobox",
      tabIndex: disabled ? -1 : 0,
      "aria-haspopup": "listbox" as const,
      "aria-expanded": isOpen,
      "aria-controls": listboxId,
      ...(activeDescendant && { "aria-activedescendant": activeDescendant }),
      ...(disabled && { "aria-disabled": true }),
      ...(required && { "aria-required": true }),
      ...(ariaLabel && { "aria-label": ariaLabel }),
      onKeyDown: handleKeyDown,
      onClick: handleTriggerClick,
    },
    listboxProps: {
      id: listboxId,
      role: "listbox",
      "aria-labelledby": triggerId,
    },
    getOptionProps,
    isOpen,
    value,
    selectedOption,
    highlightedIndex,
    open,
    close,
    toggle,
    selectOption,
  };
}
