import { useState, useCallback, KeyboardEvent } from "react";
import type { AriaAttributes } from "../types/index.js";
import { generateAriaProps } from "../utils/aria.js";
import { useUniqueId } from "../utils/id.js";

/**
 * Props for the useSlider hook
 */
export interface UseSliderProps {
  /**
   * Controlled value
   */
  value?: number;

  /**
   * Default value for uncontrolled mode
   */
  defaultValue?: number;

  /**
   * Callback when value changes
   */
  onChange?: (value: number) => void;

  /**
   * Minimum value
   */
  min?: number;

  /**
   * Maximum value
   */
  max?: number;

  /**
   * Step increment
   */
  step?: number;

  /**
   * Whether the slider is disabled
   */
  disabled?: boolean;

  /**
   * Orientation of the slider
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Custom ID for the slider
   */
  id?: string;

  /**
   * ARIA label for the slider
   */
  ariaLabel?: string;

  /**
   * Additional ARIA attributes
   */
  ariaAttributes?: Partial<AriaAttributes>;
}

/**
 * Return type for the useSlider hook
 */
export interface UseSliderReturn {
  /**
   * Props for the slider thumb/handle
   */
  thumbProps: {
    id: string;
    role: "slider";
    tabIndex: number;
    "aria-valuemin": number;
    "aria-valuemax": number;
    "aria-valuenow": number;
    "aria-orientation": "horizontal" | "vertical";
    "aria-disabled"?: boolean;
    "aria-label"?: string;
    onKeyDown: (event: KeyboardEvent) => void;
  } & Record<string, unknown>;

  /**
   * Props for the slider track
   */
  trackProps: {
    "aria-hidden": true;
  };

  /**
   * Current value
   */
  value: number;

  /**
   * Percentage (0-100) of value in range
   */
  percentage: number;

  /**
   * Set value programmatically
   */
  setValue: (value: number) => void;

  /**
   * Increment value by step
   */
  increment: () => void;

  /**
   * Decrement value by step
   */
  decrement: () => void;
}

/**
 * useSlider Hook
 *
 * Headless hook for managing slider/range control with keyboard navigation.
 *
 * Features:
 * - Controlled and uncontrolled modes
 * - Arrow keys to adjust value (Up/Right increase, Down/Left decrease)
 * - Home/End keys for min/max values
 * - PageUp/PageDown for larger increments
 * - Full ARIA attributes (role=slider, aria-valuemin/max/now)
 * - Horizontal and vertical orientations
 * - Step support
 * - No styling logic
 *
 * @param props - Configuration options for the slider
 * @returns Object containing thumb props, track props, and value management
 *
 * @example
 * ```tsx
 * const { thumbProps, trackProps, value, percentage } = useSlider({
 *   min: 0,
 *   max: 100,
 *   step: 1,
 *   defaultValue: 50,
 * });
 *
 * return (
 *   <div {...trackProps} className="slider-track">
 *     <div
 *       {...thumbProps}
 *       className="slider-thumb"
 *       style={{ left: `${percentage}%` }}
 *     />
 *   </div>
 * );
 * ```
 */
export function useSlider(props: UseSliderProps = {}): UseSliderReturn {
  const {
    value: controlledValue,
    defaultValue,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    orientation = "horizontal",
    id: customId,
    ariaLabel,
    ariaAttributes = {},
  } = props;

  const clamp = useCallback(
    (value: number) => Math.max(min, Math.min(max, value)),
    [min, max],
  );

  const initialValue = clamp(defaultValue !== undefined ? defaultValue : min);
  const [internalValue, setInternalValue] = useState(initialValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? clamp(controlledValue) : internalValue;

  const id = useUniqueId(customId);

  const handleValueChange = useCallback(
    (newValue: number) => {
      if (disabled) {
        return;
      }

      const clampedValue = clamp(newValue);

      if (!isControlled) {
        setInternalValue(clampedValue);
      }

      if (onChange && clampedValue !== value) {
        onChange(clampedValue);
      }
    },
    [disabled, isControlled, clamp, onChange, value],
  );

  const setValue = useCallback(
    (newValue: number) => {
      handleValueChange(newValue);
    },
    [handleValueChange],
  );

  const increment = useCallback(() => {
    handleValueChange(value + step);
  }, [handleValueChange, value, step]);

  const decrement = useCallback(() => {
    handleValueChange(value - step);
  }, [handleValueChange, value, step]);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) {
        return;
      }

      const largeStep = step * 10;

      switch (event.key) {
        case "ArrowUp":
        case "ArrowRight":
          event.preventDefault();
          increment();
          break;
        case "ArrowDown":
        case "ArrowLeft":
          event.preventDefault();
          decrement();
          break;
        case "Home":
          event.preventDefault();
          handleValueChange(min);
          break;
        case "End":
          event.preventDefault();
          handleValueChange(max);
          break;
        case "PageUp":
          event.preventDefault();
          handleValueChange(value + largeStep);
          break;
        case "PageDown":
          event.preventDefault();
          handleValueChange(value - largeStep);
          break;
      }
    },
    [disabled, increment, decrement, handleValueChange, min, max, value, step],
  );

  const thumbProps = {
    id,
    role: "slider" as const,
    tabIndex: 0,
    "aria-valuemin": min,
    "aria-valuemax": max,
    "aria-valuenow": value,
    "aria-orientation": orientation,
    ...(disabled && { "aria-disabled": true }),
    ...(ariaLabel && { "aria-label": ariaLabel }),
    ...generateAriaProps(ariaAttributes),
    onKeyDown: handleKeyDown,
  };

  const trackProps = {
    "aria-hidden": true as const,
  };

  return {
    thumbProps,
    trackProps,
    value,
    percentage,
    setValue,
    increment,
    decrement,
  };
}
