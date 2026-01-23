import { useMemo } from "react";
import { useUniqueId } from "../utils/id.js";

/**
 * Props for the useProgress hook
 */
export interface UseProgressProps {
  /**
   * Current progress value
   */
  value?: number;

  /**
   * Minimum value
   */
  min?: number;

  /**
   * Maximum value
   */
  max?: number;

  /**
   * Whether progress is indeterminate (loading spinner)
   */
  indeterminate?: boolean;

  /**
   * Custom ID
   */
  id?: string;

  /**
   * ARIA label
   */
  ariaLabel?: string;

  /**
   * ID of element that labels the progress
   */
  ariaLabelledBy?: string;
}

/**
 * Return type for the useProgress hook
 */
export interface UseProgressReturn {
  /**
   * Props for the progress element
   */
  progressProps: {
    id: string;
    role: "progressbar";
    "aria-valuemin"?: number;
    "aria-valuemax"?: number;
    "aria-valuenow"?: number;
    "aria-label"?: string;
    "aria-labelledby"?: string;
  };

  /**
   * Current value
   */
  value: number;

  /**
   * Percentage (0-100)
   */
  percentage: number;

  /**
   * Whether progress is indeterminate
   */
  isIndeterminate: boolean;

  /**
   * Whether progress is complete (value >= max)
   */
  isComplete: boolean;
}

/**
 * useProgress Hook
 *
 * Headless hook for managing progress indicator (bar or spinner).
 *
 * Features:
 * - Determinate and indeterminate modes
 * - Percentage calculation
 * - Completion detection
 * - Full ARIA attributes (role=progressbar, aria-valuenow)
 * - No styling logic
 *
 * @param props - Configuration options
 * @returns Object containing progress props and state
 *
 * @example
 * ```tsx
 * const { progressProps, percentage, isComplete } = useProgress({
 *   value: 45,
 *   min: 0,
 *   max: 100,
 * });
 *
 * return (
 *   <div {...progressProps} className="progress-bar">
 *     <div
 *       className="progress-fill"
 *       style={{ width: `${percentage}%` }}
 *     />
 *     {isComplete && <span>Complete!</span>}
 *   </div>
 * );
 * ```
 */
export function useProgress(props: UseProgressProps = {}): UseProgressReturn {
  const {
    value = 0,
    min = 0,
    max = 100,
    indeterminate = false,
    id: customId,
    ariaLabel,
    ariaLabelledBy,
  } = props;

  // Generate unique ID
  const id = useUniqueId(customId, "progress");

  // Clamp value within min/max range
  const clampedValue = useMemo(() => {
    return Math.min(Math.max(value, min), max);
  }, [value, min, max]);

  // Calculate percentage from value, min, and max
  const percentage = useMemo(() => {
    if (indeterminate) {
      return 0;
    }
    const range = max - min;
    if (range === 0) {
      return 0;
    }
    return ((clampedValue - min) / range) * 100;
  }, [clampedValue, min, max, indeterminate]);

  // Determine if progress is complete
  const isComplete = useMemo(() => {
    return clampedValue >= max;
  }, [clampedValue, max]);

  // Build progress props
  const progressProps = {
    id,
    role: "progressbar" as const,
    ...(ariaLabel && { "aria-label": ariaLabel }),
    ...(ariaLabelledBy && { "aria-labelledby": ariaLabelledBy }),
    // Only include value attributes for determinate progress
    ...(!indeterminate && {
      "aria-valuemin": min,
      "aria-valuemax": max,
      "aria-valuenow": clampedValue,
    }),
  };

  return {
    progressProps,
    value: clampedValue,
    percentage,
    isIndeterminate: indeterminate,
    isComplete,
  };
}
