import { useState, useCallback, KeyboardEvent } from "react";
import { useUniqueId } from "../utils/id.js";
import { isKeyboardKey } from "../utils/keyboard.js";

/**
 * Menu item
 */
export interface MenuItem {
  id: string;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

/**
 * Props for the useDropdownMenu hook
 */
export interface UseDropdownMenuProps {
  /**
   * Menu items
   */
  items: MenuItem[];

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
   * Whether to close on item selection
   */
  closeOnSelect?: boolean;

  /**
   * Custom ID
   */
  id?: string;

  /**
   * ARIA label
   */
  ariaLabel?: string;
}

/**
 * Return type for the useDropdownMenu hook
 */
export interface UseDropdownMenuReturn {
  /**
   * Props for trigger button
   */
  triggerProps: {
    "aria-expanded": boolean;
    "aria-haspopup": "menu";
    "aria-controls": string;
    onClick: () => void;
    onKeyDown: (event: KeyboardEvent) => void;
  };

  /**
   * Props for menu container
   */
  menuProps: {
    id: string;
    role: "menu";
    "aria-label"?: string;
    "aria-activedescendant"?: string;
    onKeyDown: (event: KeyboardEvent) => void;
  };

  /**
   * Get props for menu item
   */
  getItemProps: (
    item: MenuItem,
    index: number,
  ) => {
    id: string;
    role: "menuitem";
    "aria-disabled"?: boolean;
    tabIndex: number;
    onClick: () => void;
  };

  /**
   * Whether menu is open
   */
  isOpen: boolean;

  /**
   * Currently highlighted item index
   */
  highlightedIndex: number;

  /**
   * Open menu
   */
  open: () => void;

  /**
   * Close menu
   */
  close: () => void;

  /**
   * Toggle menu
   */
  toggle: () => void;
}

/**
 * useDropdownMenu Hook
 *
 * Headless hook for managing dropdown menu with keyboard navigation.
 *
 * Features:
 * - Arrow key navigation
 * - Enter/Space to select
 * - Escape to close
 * - Home/End key support
 * - Full ARIA attributes
 * - No styling logic
 *
 * @param props - Configuration options
 * @returns Object containing trigger, menu, and item props
 *
 * @example
 * ```tsx
 * const { triggerProps, menuProps, getItemProps, isOpen } = useDropdownMenu({
 *   items: [
 *     { id: '1', label: 'Edit', onClick: () => console.log('Edit') },
 *     { id: '2', label: 'Delete', onClick: () => console.log('Delete') },
 *   ],
 * });
 *
 * return (
 *   <>
 *     <button {...triggerProps}>Menu</button>
 *     {isOpen && (
 *       <ul {...menuProps}>
 *         {items.map((item, i) => (
 *           <li key={item.id} {...getItemProps(item, i)}>
 *             {item.label}
 *           </li>
 *         ))}
 *       </ul>
 *     )}
 *   </>
 * );
 * ```
 */
export function useDropdownMenu(
  props: UseDropdownMenuProps,
): UseDropdownMenuReturn {
  const {
    items,
    isOpen: controlledIsOpen,
    defaultOpen = false,
    onOpenChange,
    closeOnSelect = true,
    id: customId,
    ariaLabel,
  } = props;

  // Determine if component is controlled
  const isControlled = controlledIsOpen !== undefined;

  // Internal open state (for uncontrolled mode)
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  // Highlighted item index for keyboard navigation
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Use controlled state if provided, otherwise use internal state
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  // Generate unique ID for menu
  const menuId = useUniqueId(customId, "menu");

  // Update state and call onChange
  const updateIsOpen = useCallback(
    (newIsOpen: boolean) => {
      if (!isControlled) {
        setInternalIsOpen(newIsOpen);
      }
      onOpenChange?.(newIsOpen);

      // Reset highlighted index when closing
      if (!newIsOpen) {
        setHighlightedIndex(-1);
      }
    },
    [isControlled, onOpenChange],
  );

  // Open menu
  const open = useCallback(() => {
    updateIsOpen(true);
  }, [updateIsOpen]);

  // Close menu
  const close = useCallback(() => {
    updateIsOpen(false);
  }, [updateIsOpen]);

  // Toggle menu
  const toggle = useCallback(() => {
    updateIsOpen(!isOpen);
  }, [isOpen, updateIsOpen]);

  // Find next non-disabled item index
  const findNextEnabledIndex = useCallback(
    (startIndex: number, direction: 1 | -1): number => {
      let index = startIndex;
      const itemCount = items.length;

      for (let i = 0; i < itemCount; i++) {
        index = (index + direction + itemCount) % itemCount;
        if (!items[index].disabled) {
          return index;
        }
      }

      return startIndex; // No enabled items found
    },
    [items],
  );

  // Handle menu keyboard navigation
  const handleMenuKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isKeyboardKey(event, "Escape")) {
        event.preventDefault();
        close();
        return;
      }

      if (isKeyboardKey(event, "ArrowDown")) {
        event.preventDefault();
        setHighlightedIndex((current) => {
          if (current === -1) {
            return findNextEnabledIndex(-1, 1);
          }
          return findNextEnabledIndex(current, 1);
        });
        return;
      }

      if (isKeyboardKey(event, "ArrowUp")) {
        event.preventDefault();
        setHighlightedIndex((current) => {
          if (current === -1) {
            return findNextEnabledIndex(items.length, -1);
          }
          return findNextEnabledIndex(current, -1);
        });
        return;
      }

      if (isKeyboardKey(event, "Home")) {
        event.preventDefault();
        const firstEnabled = findNextEnabledIndex(-1, 1);
        setHighlightedIndex(firstEnabled);
        return;
      }

      if (isKeyboardKey(event, "End")) {
        event.preventDefault();
        const lastEnabled = findNextEnabledIndex(items.length, -1);
        setHighlightedIndex(lastEnabled);
        return;
      }

      if (isKeyboardKey(event, ["Enter", " "])) {
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < items.length) {
          const item = items[highlightedIndex];
          if (!item.disabled) {
            item.onClick?.();
            if (closeOnSelect) {
              close();
            }
          }
        }
        return;
      }
    },
    [highlightedIndex, items, close, closeOnSelect, findNextEnabledIndex],
  );

  // Handle trigger keyboard events
  const handleTriggerKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isKeyboardKey(event, "Escape")) {
        event.preventDefault();
        close();
        return;
      }
    },
    [close],
  );

  // Get item props
  const getItemProps = useCallback(
    (item: MenuItem, _index: number) => {
      const handleItemClick = () => {
        if (item.disabled) {
          return;
        }
        item.onClick?.();
        if (closeOnSelect) {
          close();
        }
      };

      return {
        id: item.id,
        role: "menuitem" as const,
        "aria-disabled": item.disabled ? true : undefined,
        tabIndex: -1,
        onClick: handleItemClick,
      };
    },
    [close, closeOnSelect],
  );

  return {
    triggerProps: {
      "aria-expanded": isOpen,
      "aria-haspopup": "menu" as const,
      "aria-controls": menuId,
      onClick: toggle,
      onKeyDown: handleTriggerKeyDown,
    },
    menuProps: {
      id: menuId,
      role: "menu",
      "aria-label": ariaLabel,
      "aria-activedescendant":
        highlightedIndex >= 0 ? items[highlightedIndex]?.id : undefined,
      onKeyDown: handleMenuKeyDown,
    },
    getItemProps,
    isOpen,
    highlightedIndex,
    open,
    close,
    toggle,
  };
}
