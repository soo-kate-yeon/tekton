import { useState, useCallback, KeyboardEvent } from "react";
import type { AriaAttributes } from "../types/index.js";
import { handleKeyboardEvent } from "../utils/keyboard.js";
import { useUniqueId } from "../utils/id.js";

/**
 * Props for the useCard hook
 */
export interface UseCardProps {
  /**
   * Whether the card is interactive (clickable)
   */
  interactive?: boolean;

  /**
   * Whether the card is selected
   */
  selected?: boolean;

  /**
   * Default selected state
   */
  defaultSelected?: boolean;

  /**
   * Callback when card is clicked
   */
  onClick?: () => void;

  /**
   * Callback when selection changes
   */
  onSelectionChange?: (selected: boolean) => void;

  /**
   * Whether the card is disabled
   */
  disabled?: boolean;

  /**
   * Custom ID
   */
  id?: string;

  /**
   * ARIA label
   */
  ariaLabel?: string;

  /**
   * Additional ARIA attributes
   */
  ariaAttributes?: Partial<AriaAttributes>;
}

/**
 * Return type for the useCard hook
 */
export interface UseCardReturn {
  /**
   * Props for the card container
   */
  cardProps: {
    id: string;
    role?: "button";
    tabIndex?: number;
    "aria-pressed"?: boolean;
    "aria-disabled"?: boolean;
    "aria-label"?: string;
    onClick?: () => void;
    onKeyDown?: (event: KeyboardEvent) => void;
  } & Record<string, unknown>;

  /**
   * Whether card is selected
   */
  selected: boolean;

  /**
   * Toggle selection
   */
  toggleSelection: () => void;

  /**
   * Set selection state
   */
  setSelected: (selected: boolean) => void;
}

/**
 * useCard Hook
 *
 * Headless hook for managing card component with optional interactivity.
 *
 * Features:
 * - Interactive mode with click and keyboard support
 * - Selectable state
 * - Full ARIA attributes
 * - No styling logic
 *
 * @param props - Configuration options
 * @returns Object containing card props and selection state
 *
 * @example
 * ```tsx
 * const { cardProps, selected, toggleSelection } = useCard({
 *   interactive: true,
 *   defaultSelected: false,
 *   onClick: () => console.log('Card clicked'),
 * });
 *
 * return (
 *   <div {...cardProps} className={selected ? 'selected' : ''}>
 *     <h3>Card Title</h3>
 *     <p>Card content...</p>
 *   </div>
 * );
 * ```
 */
export function useCard(props: UseCardProps = {}): UseCardReturn {
  const {
    interactive = false,
    selected: controlledSelected,
    defaultSelected = false,
    onClick,
    onSelectionChange,
    disabled = false,
    id: customId,
    ariaLabel,
    ariaAttributes = {},
  } = props;

  // Generate unique ID
  const id = useUniqueId(customId, "card");

  // Manage selection state (controlled or uncontrolled)
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const selected =
    controlledSelected !== undefined ? controlledSelected : internalSelected;

  // Toggle selection handler
  const toggleSelection = useCallback(() => {
    const newSelected = !selected;
    setInternalSelected(newSelected);
    onSelectionChange?.(newSelected);
  }, [selected, onSelectionChange]);

  // Set selection handler
  const setSelected = useCallback(
    (newSelected: boolean) => {
      setInternalSelected(newSelected);
      onSelectionChange?.(newSelected);
    },
    [onSelectionChange],
  );

  // Click handler (only if interactive and not disabled)
  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick();
    }
  }, [disabled, onClick]);

  // Keyboard handler (Enter/Space)
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!disabled) {
        handleKeyboardEvent(event, ["Enter", " "], handleClick);
      }
    },
    [disabled, handleClick],
  );

  // Build card props based on interactive mode
  const cardProps = {
    id,
    ...ariaAttributes,
    ...(ariaLabel && { "aria-label": ariaLabel }),
    ...(interactive && {
      role: "button" as const,
      tabIndex: 0,
      "aria-pressed": selected,
      ...(disabled && { "aria-disabled": true }),
      onClick: handleClick,
      onKeyDown: handleKeyDown,
    }),
  };

  return {
    cardProps: cardProps as UseCardReturn['cardProps'],
    selected,
    toggleSelection,
    setSelected,
  };
}
