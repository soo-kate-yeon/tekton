import { useState, useCallback, useRef, useEffect } from "react";
import { useUniqueId } from "../utils/id.js";

/**
 * Props for the useTooltip hook
 */
export interface UseTooltipProps {
  /**
   * Delay before showing tooltip (ms)
   */
  showDelay?: number;

  /**
   * Delay before hiding tooltip (ms)
   */
  hideDelay?: number;

  /**
   * Placement of tooltip relative to trigger
   */
  placement?: "top" | "bottom" | "left" | "right";

  /**
   * Whether tooltip is disabled
   */
  disabled?: boolean;

  /**
   * Custom ID for tooltip
   */
  id?: string;
}

/**
 * Return type for the useTooltip hook
 */
export interface UseTooltipReturn {
  /**
   * Props for the trigger element
   */
  triggerProps: {
    "aria-describedby": string;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
  };

  /**
   * Props for the tooltip element
   */
  tooltipProps: {
    id: string;
    role: "tooltip";
  };

  /**
   * Whether tooltip is visible
   */
  isVisible: boolean;

  /**
   * Show tooltip programmatically
   */
  show: () => void;

  /**
   * Hide tooltip programmatically
   */
  hide: () => void;
}

/**
 * useTooltip Hook
 *
 * Headless hook for managing tooltip visibility with hover/focus triggers.
 *
 * Features:
 * - Hover and focus triggers
 * - Configurable show/hide delays
 * - Full ARIA attributes (role=tooltip, aria-describedby)
 * - Placement support
 * - No styling logic
 *
 * @param props - Configuration options for tooltip
 * @returns Object containing trigger and tooltip props
 *
 * @example
 * ```tsx
 * const { triggerProps, tooltipProps, isVisible } = useTooltip({
 *   showDelay: 500,
 *   placement: 'top',
 * });
 *
 * return (
 *   <>
 *     <button {...triggerProps}>Hover me</button>
 *     {isVisible && (
 *       <div {...tooltipProps} className="tooltip">
 *         Tooltip content
 *       </div>
 *     )}
 *   </>
 * );
 * ```
 */
export function useTooltip(props: UseTooltipProps = {}): UseTooltipReturn {
  const {
    showDelay = 0,
    hideDelay = 0,
    placement: _placement = "top",
    disabled = false,
    id: customId,
  } = props;

  // State
  const [isVisible, setIsVisible] = useState(false);

  // Timers
  const showTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate unique ID for tooltip
  const tooltipId = useUniqueId(customId, "tooltip");

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  // Show tooltip
  const show = useCallback(() => {
    if (disabled) {
      return;
    }

    // Clear any pending hide timer
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    setIsVisible(true);
  }, [disabled]);

  // Hide tooltip
  const hide = useCallback(() => {
    // Clear any pending show timer
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }

    setIsVisible(false);
  }, []);

  // Handle mouse enter with delay
  const handleMouseEnter = useCallback(() => {
    if (disabled) {
      return;
    }

    // Clear any pending hide timer
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (showDelay > 0) {
      showTimerRef.current = setTimeout(() => {
        setIsVisible(true);
      }, showDelay);
    } else {
      setIsVisible(true);
    }
  }, [disabled, showDelay]);

  // Handle mouse leave with delay
  const handleMouseLeave = useCallback(() => {
    // Clear any pending show timer
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }

    if (hideDelay > 0) {
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);
    } else {
      setIsVisible(false);
    }
  }, [hideDelay]);

  // Handle focus (show immediately)
  const handleFocus = useCallback(() => {
    if (disabled) {
      return;
    }

    // Clear any pending hide timer
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    setIsVisible(true);
  }, [disabled]);

  // Handle blur (hide immediately)
  const handleBlur = useCallback(() => {
    // Clear any pending show timer
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }

    setIsVisible(false);
  }, []);

  return {
    triggerProps: {
      "aria-describedby": tooltipId,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
    tooltipProps: {
      id: tooltipId,
      role: "tooltip",
    },
    isVisible,
    show,
    hide,
  };
}
