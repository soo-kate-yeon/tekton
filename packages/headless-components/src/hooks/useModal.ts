import { useState, useCallback, KeyboardEvent, useEffect, useRef } from "react";
import type { AriaAttributes } from "../types/index.js";
import { useUniqueId } from "../utils/id.js";
import { isKeyboardKey } from "../utils/keyboard.js";

/**
 * Props for the useModal hook
 */
export interface UseModalProps {
  /**
   * Controlled open state
   */
  isOpen?: boolean;

  /**
   * Default open state for uncontrolled mode
   */
  defaultOpen?: boolean;

  /**
   * Callback when modal opens
   */
  onOpen?: () => void;

  /**
   * Callback when modal closes
   */
  onClose?: () => void;

  /**
   * Whether clicking overlay closes modal
   */
  closeOnOverlayClick?: boolean;

  /**
   * Whether pressing Escape closes modal
   */
  closeOnEscape?: boolean;

  /**
   * Whether to trap focus within modal
   */
  trapFocus?: boolean;

  /**
   * Whether to restore focus on close
   */
  restoreFocus?: boolean;

  /**
   * Custom ID for the modal
   */
  id?: string;

  /**
   * ARIA label for the modal
   */
  ariaLabel?: string;

  /**
   * ID of element that labels the modal
   */
  ariaLabelledBy?: string;

  /**
   * ID of element that describes the modal
   */
  ariaDescribedBy?: string;

  /**
   * Additional ARIA attributes
   */
  ariaAttributes?: Partial<AriaAttributes>;
}

/**
 * Return type for the useModal hook
 */
export interface UseModalReturn {
  /**
   * Props for the modal dialog element
   */
  modalProps: {
    id: string;
    role: "dialog";
    "aria-modal": true;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    tabIndex: number;
    onKeyDown: (event: KeyboardEvent) => void;
  } & Record<string, unknown>;

  /**
   * Props for the overlay backdrop
   */
  overlayProps: {
    onClick: () => void;
    "aria-hidden": true;
  };

  /**
   * Props for the close button
   */
  closeButtonProps: {
    "aria-label": string;
    onClick: () => void;
  };

  /**
   * Whether modal is open
   */
  isOpen: boolean;

  /**
   * Open the modal
   */
  open: () => void;

  /**
   * Close the modal
   */
  close: () => void;

  /**
   * Toggle modal open/close
   */
  toggle: () => void;
}

/**
 * useModal Hook
 *
 * Headless hook for managing modal dialog with focus trap and keyboard support.
 *
 * Features:
 * - Controlled and uncontrolled modes
 * - Focus trap (Tab/Shift+Tab boundary)
 * - Escape key to close
 * - Overlay click to close (optional)
 * - Focus restoration on close
 * - Full ARIA attributes (role=dialog, aria-modal)
 * - Prevents body scroll when open
 * - No styling logic
 *
 * @param props - Configuration options for the modal
 * @returns Object containing modal, overlay, and close button props
 *
 * @example
 * ```tsx
 * const { modalProps, overlayProps, closeButtonProps, isOpen, open, close } = useModal({
 *   closeOnEscape: true,
 *   closeOnOverlayClick: true,
 *   trapFocus: true,
 * });
 *
 * return (
 *   <>
 *     <button onClick={open}>Open Modal</button>
 *     {isOpen && (
 *       <>
 *         <div {...overlayProps} className="overlay" />
 *         <div {...modalProps} className="modal">
 *           <h2>Modal Title</h2>
 *           <p>Modal content...</p>
 *           <button {...closeButtonProps}>Close</button>
 *         </div>
 *       </>
 *     )}
 *   </>
 * );
 * ```
 */
export function useModal(props: UseModalProps = {}): UseModalReturn {
  const {
    isOpen: controlledOpen,
    defaultOpen = false,
    onOpen,
    onClose,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    trapFocus = true,
    restoreFocus = true,
    id: customId,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    ariaAttributes = {},
  } = props;

  // Determine if controlled mode
  const isControlled = controlledOpen !== undefined;

  // Internal state for uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  // Use controlled state if provided, otherwise use internal state
  const isOpen = isControlled ? controlledOpen : internalOpen;

  // Generate unique ID for modal
  const modalId = useUniqueId(customId, "modal");

  // Store reference to trigger element for focus restoration
  const triggerRef = useRef<HTMLElement | null>(null);

  // Reference to modal element
  const modalRef = useRef<HTMLElement | null>(null);

  // Open handler
  const open = useCallback(() => {
    // Store current active element for focus restoration
    if (restoreFocus && document.activeElement instanceof HTMLElement) {
      triggerRef.current = document.activeElement;
    }

    if (!isControlled) {
      setInternalOpen(true);
    }

    onOpen?.();
  }, [isControlled, onOpen, restoreFocus]);

  // Close handler
  const close = useCallback(() => {
    if (!isControlled) {
      setInternalOpen(false);
    }

    onClose?.();

    // Restore focus to trigger element
    if (restoreFocus && triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isControlled, onClose, restoreFocus]);

  // Toggle handler
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Get all focusable elements within the modal
  const getFocusableElements = useCallback(
    (container: HTMLElement | null): HTMLElement[] => {
      if (!container) {
        return [];
      }

      const focusableSelectors = [
        "a[href]",
        "button:not([disabled])",
        "textarea:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
      ].join(",");

      return Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelectors),
      );
    },
    [],
  );

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Handle Escape key
      if (closeOnEscape && isKeyboardKey(event as any, "Escape")) {
        event.preventDefault();
        close();
        return;
      }

      // Handle focus trap with Tab key
      if (trapFocus && isKeyboardKey(event as any, "Tab")) {
        const modalElement = event.currentTarget as HTMLElement;
        const focusableElements = getFocusableElements(modalElement);

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement as HTMLElement;

        // Shift+Tab: Move backward
        if (event.shiftKey) {
          if (
            activeElement === firstElement ||
            !modalElement.contains(activeElement)
          ) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: Move forward
          if (
            activeElement === lastElement ||
            !modalElement.contains(activeElement)
          ) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [closeOnEscape, trapFocus, close, getFocusableElements],
  );

  // Overlay click handler
  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlayClick) {
      close();
    }
  }, [closeOnOverlayClick, close]);

  // Effect: Manage body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Store original overflow style
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      // Calculate scrollbar width
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Lock body scroll
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        // Restore original styles
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
    return undefined;
  }, [isOpen]);

  // Effect: Focus modal when opened
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Ref callback to store modal element reference
  const setModalRef = useCallback((element: HTMLElement | null) => {
    modalRef.current = element;
  }, []);

  // Generate modal props
  const modalProps = {
    id: modalId,
    role: "dialog" as const,
    "aria-modal": true as const,
    ...(ariaLabel && { "aria-label": ariaLabel }),
    ...(ariaLabelledBy && { "aria-labelledby": ariaLabelledBy }),
    ...(ariaDescribedBy && { "aria-describedby": ariaDescribedBy }),
    ...ariaAttributes,
    tabIndex: -1,
    onKeyDown: handleKeyDown,
    ref: setModalRef,
  };

  // Generate overlay props
  const overlayProps = {
    onClick: handleOverlayClick,
    "aria-hidden": true as const,
  };

  // Generate close button props
  const closeButtonProps = {
    "aria-label": "Close modal",
    onClick: close,
  };

  return {
    modalProps: modalProps as UseModalReturn['modalProps'],
    overlayProps,
    closeButtonProps,
    isOpen,
    open,
    close,
    toggle,
  };
}
