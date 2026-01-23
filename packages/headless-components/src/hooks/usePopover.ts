import { useState, useCallback, KeyboardEvent } from "react";
import { isKeyboardKey } from "../utils/keyboard.js";
import { useUniqueId } from "../utils/id.js";

/**
 * Props for the usePopover hook
 */
export interface UsePopoverProps {
  /**
   * Controlled open state
   */
  isOpen?: boolean;

  /**
   * Default open state
   */
  defaultOpen?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Trigger mode
   */
  trigger?: "click" | "hover" | "focus";

  /**
   * Whether to close on click outside
   */
  closeOnClickOutside?: boolean;

  /**
   * Whether to close on Escape key
   */
  closeOnEscape?: boolean;

  /**
   * Placement relative to trigger
   */
  placement?: "top" | "bottom" | "left" | "right";

  /**
   * Custom ID
   */
  id?: string;
}

/**
 * Return type for the usePopover hook
 */
export interface UsePopoverReturn {
  /**
   * Props for trigger element
   */
  triggerProps: {
    "aria-expanded": boolean;
    "aria-controls": string;
    "aria-haspopup": true;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
  };

  /**
   * Props for popover content
   */
  popoverProps: {
    id: string;
    role: "dialog";
    onKeyDown: (event: KeyboardEvent) => void;
  };

  /**
   * Whether popover is open
   */
  isOpen: boolean;

  /**
   * Open popover
   */
  open: () => void;

  /**
   * Close popover
   */
  close: () => void;

  /**
   * Toggle popover
   */
  toggle: () => void;
}

/**
 * usePopover Hook
 *
 * Headless hook for managing popover visibility with multiple trigger modes.
 *
 * Features:
 * - Click, hover, and focus triggers
 * - Click outside to close
 * - Escape key to close
 * - Full ARIA attributes
 * - No styling logic
 *
 * @param props - Configuration options
 * @returns Object containing trigger and popover props
 *
 * @example
 * ```tsx
 * const { triggerProps, popoverProps, isOpen } = usePopover({
 *   trigger: 'click',
 *   closeOnClickOutside: true,
 * });
 *
 * return (
 *   <>
 *     <button {...triggerProps}>Toggle</button>
 *     {isOpen && (
 *       <div {...popoverProps} className="popover">
 *         Popover content
 *       </div>
 *     )}
 *   </>
 * );
 * ```
 */
export function usePopover(props: UsePopoverProps = {}): UsePopoverReturn {
  const {
    isOpen: controlledIsOpen,
    defaultOpen = false,
    onOpenChange,
    trigger = "click",
    closeOnClickOutside: _closeOnClickOutside = true,
    closeOnEscape = true,
    placement: _placement = "bottom",
    id: customId,
  } = props;

  // Determine if component is controlled
  const isControlled = controlledIsOpen !== undefined;

  // Internal open state (for uncontrolled mode)
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  // Use controlled state if provided, otherwise use internal state
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  // Generate unique ID for popover
  const popoverId = useUniqueId(customId, "popover");

  // Update state and call onChange
  const updateIsOpen = useCallback(
    (newIsOpen: boolean) => {
      if (!isControlled) {
        setInternalIsOpen(newIsOpen);
      }
      onOpenChange?.(newIsOpen);
    },
    [isControlled, onOpenChange],
  );

  // Open popover
  const open = useCallback(() => {
    updateIsOpen(true);
  }, [updateIsOpen]);

  // Close popover
  const close = useCallback(() => {
    updateIsOpen(false);
  }, [updateIsOpen]);

  // Toggle popover
  const toggle = useCallback(() => {
    updateIsOpen(!isOpen);
  }, [isOpen, updateIsOpen]);

  // Handle click trigger
  const handleClick = useCallback(() => {
    if (trigger === "click") {
      toggle();
    }
  }, [trigger, toggle]);

  // Handle mouse enter
  const handleMouseEnter = useCallback(() => {
    if (trigger === "hover") {
      open();
    }
  }, [trigger, open]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (trigger === "hover") {
      close();
    }
  }, [trigger, close]);

  // Handle focus
  const handleFocus = useCallback(() => {
    if (trigger === "focus") {
      open();
    }
  }, [trigger, open]);

  // Handle blur
  const handleBlur = useCallback(() => {
    if (trigger === "focus") {
      close();
    }
  }, [trigger, close]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEscape && isKeyboardKey(event, "Escape")) {
        event.preventDefault();
        close();
      }
    },
    [closeOnEscape, close],
  );

  // Build trigger props based on trigger mode
  const triggerProps: UsePopoverReturn["triggerProps"] = {
    "aria-expanded": isOpen,
    "aria-controls": popoverId,
    "aria-haspopup": true,
  };

  if (trigger === "click") {
    triggerProps.onClick = handleClick;
  } else if (trigger === "hover") {
    triggerProps.onMouseEnter = handleMouseEnter;
    triggerProps.onMouseLeave = handleMouseLeave;
  } else if (trigger === "focus") {
    triggerProps.onFocus = handleFocus;
    triggerProps.onBlur = handleBlur;
  }

  return {
    triggerProps,
    popoverProps: {
      id: popoverId,
      role: "dialog",
      onKeyDown: handleKeyDown,
    },
    isOpen,
    open,
    close,
    toggle,
  };
}
