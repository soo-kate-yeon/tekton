import { useCallback } from "react";
import type { AriaAttributes } from "../types/index.js";
import { generateAriaProps } from "../utils/aria.js";

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

/**
 * Props for the useBreadcrumb hook
 */
export interface UseBreadcrumbProps {
  /**
   * Breadcrumb items
   */
  items: BreadcrumbItem[];

  /**
   * Separator character or element
   */
  separator?: string;

  /**
   * Callback when breadcrumb item clicked
   */
  onNavigate?: (item: BreadcrumbItem, index: number) => void;

  /**
   * Custom ID for the breadcrumb nav
   */
  id?: string;

  /**
   * ARIA label for the breadcrumb navigation
   */
  ariaLabel?: string;

  /**
   * Additional ARIA attributes
   */
  ariaAttributes?: Partial<AriaAttributes>;
}

/**
 * Return type for the useBreadcrumb hook
 */
export interface UseBreadcrumbReturn {
  /**
   * Props for the nav container
   */
  navProps: {
    "aria-label": string;
  } & Record<string, unknown>;

  /**
   * Props for the ordered list
   */
  listProps: {
    role: "list";
  };

  /**
   * Get props for an individual breadcrumb item
   */
  getItemProps: (
    item: BreadcrumbItem,
    index: number,
  ) => {
    "aria-current"?: "page";
    onClick?: () => void;
  };

  /**
   * Total number of items
   */
  itemCount: number;
}

/**
 * useBreadcrumb Hook
 *
 * Headless hook for managing breadcrumb navigation with accessibility support.
 *
 * Features:
 * - Semantic nav/ol/li structure support
 * - aria-current="page" for current item
 * - Navigation callback support
 * - No styling logic
 *
 * @param props - Configuration options for breadcrumb
 * @returns Object containing nav, list, and item props
 *
 * @example
 * ```tsx
 * const { navProps, listProps, getItemProps } = useBreadcrumb({
 *   items: [
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Details', isCurrent: true },
 *   ],
 *   onNavigate: (item) => router.push(item.href),
 * });
 *
 * return (
 *   <nav {...navProps}>
 *     <ol {...listProps}>
 *       {items.map((item, i) => (
 *         <li key={i}>
 *           <a {...getItemProps(item, i)} href={item.href}>
 *             {item.label}
 *           </a>
 *         </li>
 *       ))}
 *     </ol>
 *   </nav>
 * );
 * ```
 */
export function useBreadcrumb(props: UseBreadcrumbProps): UseBreadcrumbReturn {
  const {
    items,
    separator: _separator = "/",
    onNavigate,
    id: _customId,
    ariaLabel = "Breadcrumb",
    ariaAttributes = {},
  } = props;

  const handleNavigate = useCallback(
    (item: BreadcrumbItem, index: number) => {
      if (onNavigate) {
        onNavigate(item, index);
      }
    },
    [onNavigate],
  );

  const navProps = {
    "aria-label": ariaLabel,
    ...generateAriaProps(ariaAttributes),
  };

  const listProps = {
    role: "list" as const,
  };

  const getItemProps = useCallback(
    (item: BreadcrumbItem, index: number) => {
      const props: {
        "aria-current"?: "page";
        onClick?: () => void;
      } = {};

      if (item.isCurrent) {
        props["aria-current"] = "page";
      }

      if (onNavigate) {
        props.onClick = () => handleNavigate(item, index);
      }

      return props;
    },
    [onNavigate, handleNavigate],
  );

  return {
    navProps,
    listProps,
    getItemProps,
    itemCount: items.length,
  };
}
