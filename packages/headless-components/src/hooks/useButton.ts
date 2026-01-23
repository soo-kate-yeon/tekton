import { useState, useCallback } from "react";
import type { KeyboardHandler, ClickHandler } from "../types/index.js";
import { generateAriaProps } from "../utils/aria.js";
import { handleKeyboardEvent } from "../utils/keyboard.js";

export interface UseButtonProps {
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in toggle mode */
  toggle?: boolean;
  /** Pressed state for toggle buttons (controlled) */
  pressed?: boolean;
  /** Default pressed state (uncontrolled) */
  defaultPressed?: boolean;
  /** Callback when pressed state changes */
  onPressedChange?: (pressed: boolean) => void;
  /** Click handler */
  onClick?: () => void;
  /** ARIA label */
  "aria-label"?: string;
  /** ARIA labelledby */
  "aria-labelledby"?: string;
  /** ARIA describedby */
  "aria-describedby"?: string;
}

export interface UseButtonReturn {
  /** Props to spread on button element */
  buttonProps: {
    role: "button";
    tabIndex: number;
    disabled: boolean;
    "aria-disabled": boolean;
    "aria-pressed"?: boolean;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    onClick: ClickHandler;
    onKeyDown: KeyboardHandler;
  };
  /** Current pressed state */
  isPressed: boolean;
  /** Current disabled state */
  isDisabled: boolean;
}

/**
 * Headless button hook with accessibility and keyboard navigation
 */
export function useButton(props: UseButtonProps = {}): UseButtonReturn {
  const {
    disabled = false,
    toggle = false,
    pressed: controlledPressed,
    defaultPressed = false,
    onPressedChange,
    onClick,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
  } = props;

  // Determine if component is controlled
  const isControlled = controlledPressed !== undefined;

  // Internal pressed state (for uncontrolled mode)
  const [internalPressed, setInternalPressed] = useState(defaultPressed);

  // Use controlled state if provided, otherwise use internal state
  const isPressed = isControlled ? controlledPressed : internalPressed;

  // Handle click
  const handleClick = useCallback(
    (_event: React.MouseEvent) => {
      if (disabled) {
        return;
      }

      if (toggle) {
        const newPressed = !isPressed;
        if (!isControlled) {
          setInternalPressed(newPressed);
        }
        onPressedChange?.(newPressed);
      }

      onClick?.();
    },
    [disabled, toggle, isPressed, isControlled, onPressedChange, onClick],
  );

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) {
        return;
      }

      handleKeyboardEvent(event, ["Enter", " "], () => {
        if (toggle) {
          const newPressed = !isPressed;
          if (!isControlled) {
            setInternalPressed(newPressed);
          }
          onPressedChange?.(newPressed);
        }
        onClick?.();
      });
    },
    [disabled, toggle, isPressed, isControlled, onPressedChange, onClick],
  );

  // Generate ARIA props
  const ariaProps = generateAriaProps({
    role: "button",
    disabled,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    ...(toggle && { "aria-pressed": isPressed }),
  });

  return {
    buttonProps: {
      ...ariaProps,
      role: "button",
      tabIndex: disabled ? -1 : 0,
      disabled,
      "aria-disabled": disabled,
      ...(toggle && { "aria-pressed": isPressed }),
      onClick: handleClick,
      onKeyDown: handleKeyDown,
    } as UseButtonReturn["buttonProps"],
    isPressed,
    isDisabled: disabled,
  };
}
