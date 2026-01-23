import { useState, useCallback } from "react";
import type { KeyboardHandler, ClickHandler } from "../types/index.js";
import { generateAriaProps } from "../utils/aria.js";
import { handleKeyboardEvent } from "../utils/keyboard.js";

export interface UseToggleProps {
  /** Whether the toggle is on (controlled) */
  on?: boolean;
  /** Default on state (uncontrolled) */
  defaultOn?: boolean;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Callback when state changes */
  onChange?: (on: boolean) => void;
  /** ARIA label */
  "aria-label"?: string;
  /** ARIA labelledby */
  "aria-labelledby"?: string;
  /** ARIA describedby */
  "aria-describedby"?: string;
}

export interface UseToggleReturn {
  /** Props to spread on toggle element */
  toggleProps: {
    role: "switch";
    tabIndex: number;
    disabled: boolean;
    "aria-checked": boolean;
    "aria-disabled": boolean;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    onClick: ClickHandler;
    onKeyDown: KeyboardHandler;
  };
  /** Current on state */
  isOn: boolean;
  /** Set on state directly */
  setOn: (on: boolean) => void;
  /** Toggle the state */
  toggle: () => void;
}

/**
 * Headless toggle/switch hook with accessibility and keyboard navigation
 */
export function useToggle(props: UseToggleProps = {}): UseToggleReturn {
  const {
    on: controlledOn,
    defaultOn = false,
    disabled = false,
    onChange,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
  } = props;

  // Determine if component is controlled
  const isControlled = controlledOn !== undefined;

  // Internal on state (for uncontrolled mode)
  const [internalOn, setInternalOn] = useState(defaultOn);

  // Use controlled state if provided, otherwise use internal state
  const isOn = isControlled ? controlledOn : internalOn;

  // Handle toggle
  const handleToggle = useCallback(() => {
    if (disabled) {
      return;
    }

    const newOn = !isOn;
    if (!isControlled) {
      setInternalOn(newOn);
    }
    onChange?.(newOn);
  }, [disabled, isOn, isControlled, onChange]);

  // Handle click
  const handleClick = useCallback(
    (_event: React.MouseEvent) => {
      handleToggle();
    },
    [handleToggle],
  );

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) {
        return;
      }

      handleKeyboardEvent(event, ["Enter", " "], () => {
        handleToggle();
      });
    },
    [disabled, handleToggle],
  );

  // Generate ARIA props
  const ariaProps = generateAriaProps({
    role: "switch",
    disabled,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    "aria-checked": isOn,
  });

  // Direct control method for setting on state
  const setOn = useCallback(
    (on: boolean) => {
      if (!isControlled) {
        setInternalOn(on);
      }
      onChange?.(on);
    },
    [isControlled, onChange],
  );

  return {
    toggleProps: {
      ...ariaProps,
      role: "switch",
      tabIndex: disabled ? -1 : 0,
      disabled,
      "aria-checked": isOn,
      "aria-disabled": disabled,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
    } as UseToggleReturn["toggleProps"],
    isOn,
    setOn,
    toggle: handleToggle,
  };
}
