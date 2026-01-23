import { useUniqueId } from "../utils/id.js";

/**
 * Props for the useDivider hook
 */
export interface UseDividerProps {
  /**
   * Orientation of the divider
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Whether divider is decorative (no semantic meaning)
   */
  decorative?: boolean;

  /**
   * Label text (makes divider semantic with role="separator")
   */
  label?: string;

  /**
   * Custom ID
   */
  id?: string;
}

/**
 * Return type for the useDivider hook
 */
export interface UseDividerReturn {
  /**
   * Props for the divider element
   */
  dividerProps: {
    id: string;
    role?: "separator" | "none" | "presentation";
    "aria-orientation"?: "horizontal" | "vertical";
    "aria-label"?: string;
  };

  /**
   * Whether divider is decorative
   */
  isDecorative: boolean;

  /**
   * Divider orientation
   */
  orientation: "horizontal" | "vertical";
}

/**
 * useDivider Hook
 *
 * Headless hook for managing divider/separator element with accessibility.
 *
 * Features:
 * - Horizontal and vertical orientations
 * - Decorative vs semantic modes
 * - Optional label
 * - Full ARIA attributes
 * - No styling logic
 *
 * @param props - Configuration options
 * @returns Object containing divider props
 *
 * @example
 * ```tsx
 * const { dividerProps, orientation } = useDivider({
 *   orientation: 'horizontal',
 *   decorative: true,
 * });
 *
 * return (
 *   <div>
 *     <p>Section 1</p>
 *     <hr {...dividerProps} className={`divider-${orientation}`} />
 *     <p>Section 2</p>
 *   </div>
 * );
 * ```
 */
export function useDivider(props: UseDividerProps = {}): UseDividerReturn {
  const {
    orientation = "horizontal",
    decorative = false,
    label,
    id: customId,
  } = props;

  // Generate unique ID
  const id = useUniqueId(customId, "divider");

  // Determine role based on decorative flag
  const role = decorative ? ("presentation" as const) : ("separator" as const);

  // Build divider props
  const dividerProps = {
    id,
    role,
    // Only include aria-orientation for semantic (non-decorative) dividers
    ...(!decorative && { "aria-orientation": orientation }),
    // Include aria-label when label provided (makes it semantic)
    ...(label && { "aria-label": label }),
  };

  return {
    dividerProps,
    isDecorative: decorative,
    orientation,
  };
}
