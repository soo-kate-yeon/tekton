import { useMemo } from "react";
import { useUniqueId } from "../utils/id.js";

/**
 * Props for the useBadge hook
 */
export interface UseBadgeProps {
  /**
   * Badge content (number, text, etc.)
   */
  content?: string | number;

  /**
   * Maximum count to display (e.g., 99+)
   */
  max?: number;

  /**
   * Whether to show zero count
   */
  showZero?: boolean;

  /**
   * Whether badge is visible
   */
  visible?: boolean;

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
 * Return type for the useBadge hook
 */
export interface UseBadgeReturn {
  /**
   * Props for the badge element
   */
  badgeProps: {
    id: string;
    role: "status";
    "aria-label"?: string;
  };

  /**
   * Formatted content to display
   */
  displayContent: string;

  /**
   * Whether badge should be visible
   */
  isVisible: boolean;

  /**
   * Raw content value
   */
  content: string | number | undefined;
}

/**
 * useBadge Hook
 *
 * Headless hook for managing badge/notification indicator.
 *
 * Features:
 * - Content formatting with max limit
 * - Show/hide zero values
 * - Full ARIA attributes
 * - No styling logic
 *
 * @param props - Configuration options
 * @returns Object containing badge props and display content
 *
 * @example
 * ```tsx
 * const { badgeProps, displayContent, isVisible } = useBadge({
 *   content: 42,
 *   max: 99,
 *   showZero: false,
 * });
 *
 * return (
 *   <div className="button-with-badge">
 *     <button>Notifications</button>
 *     {isVisible && (
 *       <span {...badgeProps} className="badge">
 *         {displayContent}
 *       </span>
 *     )}
 *   </div>
 * );
 * ```
 */
export function useBadge(props: UseBadgeProps = {}): UseBadgeReturn {
  const {
    content,
    max = 99,
    showZero = false,
    visible = true,
    id: customId,
    ariaLabel,
  } = props;

  // Generate unique ID
  const id = useUniqueId(customId, "badge");

  // Format content based on max value
  const displayContent = useMemo(() => {
    if (content === undefined || content === null) {
      return "";
    }

    if (typeof content === "string") {
      return content;
    }

    // Numeric content
    if (typeof content === "number") {
      if (content > max) {
        return `${max}+`;
      }
      return String(content);
    }

    return String(content);
  }, [content, max]);

  // Determine visibility based on content, showZero, and visible prop
  const isVisible = useMemo(() => {
    if (!visible) {
      return false;
    }

    // If content is undefined or null, respect visible prop
    if (content === undefined || content === null) {
      return visible;
    }

    // For numeric content
    if (typeof content === "number") {
      if (content === 0) {
        return showZero;
      }
      return true;
    }

    // For string content, always visible if visible=true
    return true;
  }, [content, showZero, visible]);

  // Generate ARIA label if not provided
  const generatedAriaLabel = useMemo(() => {
    if (ariaLabel) {
      return ariaLabel;
    }

    if (typeof content === "number") {
      return `${content} items`;
    }

    if (content) {
      return String(content);
    }

    return undefined;
  }, [ariaLabel, content]);

  // Badge props
  const badgeProps = {
    id,
    role: "status" as const,
    ...(generatedAriaLabel && { "aria-label": generatedAriaLabel }),
  };

  return {
    badgeProps,
    displayContent,
    isVisible,
    content,
  };
}
