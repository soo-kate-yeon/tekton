import { useCallback } from "react";
import type { AriaAttributes } from "../types/index.js";
import { useUniqueId } from "../utils/id.js";

/**
 * Alert variant
 */
export type AlertVariant = "info" | "success" | "warning" | "error";

/**
 * Props for the useAlert hook
 */
export interface UseAlertProps {
  /**
   * Alert variant
   */
  variant?: AlertVariant;

  /**
   * Whether alert is dismissible
   */
  dismissible?: boolean;

  /**
   * Callback when alert is dismissed
   */
  onDismiss?: () => void;

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
 * Return type for the useAlert hook
 */
export interface UseAlertReturn {
  /**
   * Props for the alert container
   */
  alertProps: {
    id: string;
    role: "alert" | "status";
    "aria-live": "polite" | "assertive";
    "aria-atomic": true;
    "aria-label"?: string;
  } & Record<string, unknown>;

  /**
   * Props for the dismiss button
   */
  dismissButtonProps: {
    "aria-label": string;
    onClick: () => void;
  };

  /**
   * Alert variant
   */
  variant: AlertVariant;

  /**
   * Dismiss the alert
   */
  dismiss: () => void;
}

/**
 * useAlert Hook
 *
 * Headless hook for managing alert/notification with accessibility.
 *
 * Features:
 * - Multiple variants (info, success, warning, error)
 * - Dismissible alerts
 * - Full ARIA attributes (role=alert, aria-live)
 * - Proper live region announcements
 * - No styling logic
 *
 * @param props - Configuration options
 * @returns Object containing alert and dismiss button props
 *
 * @example
 * ```tsx
 * const { alertProps, dismissButtonProps, variant, dismiss } = useAlert({
 *   variant: 'success',
 *   dismissible: true,
 *   onDismiss: () => console.log('Dismissed'),
 * });
 *
 * return (
 *   <div {...alertProps} className={`alert-${variant}`}>
 *     Success message!
 *     <button {...dismissButtonProps}>×</button>
 *   </div>
 * );
 * ```
 */
export function useAlert(props: UseAlertProps = {}): UseAlertReturn {
  const {
    variant = "info",
    dismissible: _dismissible = false,
    onDismiss,
    id: customId,
    ariaLabel,
    ariaAttributes = {},
  } = props;

  // Generate unique ID for alert
  const alertId = useUniqueId(customId, "alert");

  // Determine role based on variant
  // error/warning use "alert" for immediate attention
  // info/success use "status" for less urgent updates
  const role: "alert" | "status" =
    variant === "error" || variant === "warning" ? "alert" : "status";

  // Determine aria-live based on variant
  // error/warning use "assertive" for immediate announcement
  // info/success use "polite" for non-interrupting announcement
  const ariaLive: "polite" | "assertive" =
    variant === "error" || variant === "warning" ? "assertive" : "polite";

  // Dismiss handler
  const dismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  // Alert props with ARIA attributes
  const alertProps = {
    id: alertId,
    role,
    "aria-live": ariaLive,
    "aria-atomic": true as const,
    "aria-label": ariaLabel,
    ...ariaAttributes,
  };

  // Dismiss button props
  const dismissButtonProps = {
    "aria-label": "Dismiss alert",
    onClick: dismiss,
  };

  return {
    alertProps: alertProps as UseAlertReturn['alertProps'],
    dismissButtonProps,
    variant,
    dismiss,
  };
}
