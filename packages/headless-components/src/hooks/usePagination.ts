import { useState, useCallback, useMemo } from "react";
import type { AriaAttributes } from "../types/index.js";
import { generateAriaProps } from "../utils/aria.js";

/**
 * Props for the usePagination hook
 */
export interface UsePaginationProps {
  /**
   * Total number of items
   */
  total: number;

  /**
   * Number of items per page
   */
  pageSize?: number;

  /**
   * Controlled current page (1-indexed)
   */
  page?: number;

  /**
   * Default page for uncontrolled mode (1-indexed)
   */
  defaultPage?: number;

  /**
   * Callback when page changes
   */
  onChange?: (page: number) => void;

  /**
   * Number of sibling pages to show around current page
   */
  siblings?: number;

  /**
   * Number of boundary pages to show at start/end
   */
  boundaries?: number;

  /**
   * Whether pagination is disabled
   */
  disabled?: boolean;

  /**
   * ARIA label for pagination nav
   */
  ariaLabel?: string;

  /**
   * Additional ARIA attributes
   */
  ariaAttributes?: Partial<AriaAttributes>;
}

/**
 * Page item type
 */
export type PageItem =
  | { type: "page"; value: number }
  | { type: "ellipsis"; value: string }
  | { type: "previous"; value: "previous" }
  | { type: "next"; value: "next" };

/**
 * Return type for the usePagination hook
 */
export interface UsePaginationReturn {
  /**
   * Props for the nav container
   */
  navProps: {
    role: "navigation";
    "aria-label": string;
  } & Record<string, unknown>;

  /**
   * Get props for a page button
   */
  getPageProps: (item: PageItem) => {
    "aria-current"?: "page";
    "aria-disabled"?: boolean;
    "aria-label": string;
    onClick: () => void;
    disabled: boolean;
  };

  /**
   * Array of page items to render
   */
  items: PageItem[];

  /**
   * Current page (1-indexed)
   */
  currentPage: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Whether there is a previous page
   */
  hasPrevious: boolean;

  /**
   * Whether there is a next page
   */
  hasNext: boolean;

  /**
   * Go to specific page
   */
  setPage: (page: number) => void;

  /**
   * Go to next page
   */
  next: () => void;

  /**
   * Go to previous page
   */
  previous: () => void;

  /**
   * Go to first page
   */
  first: () => void;

  /**
   * Go to last page
   */
  last: () => void;
}

/**
 * usePagination Hook
 *
 * Headless hook for managing pagination state and generating page items.
 *
 * Features:
 * - Controlled and uncontrolled modes
 * - Configurable siblings and boundaries
 * - Ellipsis generation for large page counts
 * - Previous/Next navigation
 * - Full ARIA attributes (aria-current, aria-label)
 * - No styling logic
 *
 * @param props - Configuration options for pagination
 * @returns Object containing nav props, page props, and navigation functions
 *
 * @example
 * ```tsx
 * const { navProps, items, getPageProps, currentPage } = usePagination({
 *   total: 100,
 *   pageSize: 10,
 *   defaultPage: 1,
 *   siblings: 1,
 *   boundaries: 1,
 * });
 *
 * return (
 *   <nav {...navProps}>
 *     {items.map((item, i) => (
 *       <button key={i} {...getPageProps(item)}>
 *         {item.type === 'ellipsis' ? '...' : item.value}
 *       </button>
 *     ))}
 *   </nav>
 * );
 * ```
 */
export function usePagination(props: UsePaginationProps): UsePaginationReturn {
  const {
    total,
    pageSize = 10,
    page: controlledPage,
    defaultPage = 1,
    onChange,
    siblings = 1,
    boundaries = 1,
    disabled = false,
    ariaLabel = "Pagination",
    ariaAttributes = {},
  } = props;

  const [internalPage, setInternalPage] = useState(defaultPage);
  const isControlled = controlledPage !== undefined;
  const currentPage = isControlled ? controlledPage : internalPage;

  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (disabled) {
        return;
      }

      const clampedPage = Math.max(1, Math.min(newPage, totalPages));

      if (!isControlled) {
        setInternalPage(clampedPage);
      }

      if (onChange && clampedPage !== currentPage) {
        onChange(clampedPage);
      }
    },
    [disabled, isControlled, totalPages, onChange, currentPage],
  );

  const setPage = useCallback(
    (page: number) => {
      handlePageChange(page);
    },
    [handlePageChange],
  );

  const next = useCallback(() => {
    handlePageChange(currentPage + 1);
  }, [handlePageChange, currentPage]);

  const previous = useCallback(() => {
    handlePageChange(currentPage - 1);
  }, [handlePageChange, currentPage]);

  const first = useCallback(() => {
    handlePageChange(1);
  }, [handlePageChange]);

  const last = useCallback(() => {
    handlePageChange(totalPages);
  }, [handlePageChange, totalPages]);

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const items = useMemo(() => {
    const items: PageItem[] = [];

    items.push({ type: "previous", value: "previous" });

    const range = (start: number, end: number) => {
      const result: number[] = [];
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
      return result;
    };

    const leftBoundary = range(1, Math.min(boundaries, totalPages));
    const rightBoundary = range(
      Math.max(totalPages - boundaries + 1, boundaries + 1),
      totalPages,
    );
    const siblingsStart = Math.max(currentPage - siblings, boundaries + 1);
    const siblingsEnd = Math.min(
      currentPage + siblings,
      totalPages - boundaries,
    );

    const pages = new Set<number>([
      ...leftBoundary,
      ...range(siblingsStart, siblingsEnd),
      ...rightBoundary,
    ]);

    const sortedPages = Array.from(pages).sort((a, b) => a - b);

    sortedPages.forEach((page, index) => {
      if (index > 0 && sortedPages[index - 1] !== page - 1) {
        items.push({ type: "ellipsis", value: "..." });
      }
      items.push({ type: "page", value: page });
    });

    items.push({ type: "next", value: "next" });

    return items;
  }, [currentPage, totalPages, siblings, boundaries]);

  const navProps = {
    role: "navigation" as const,
    "aria-label": ariaLabel,
    ...generateAriaProps(ariaAttributes),
  };

  const getPageProps = useCallback(
    (item: PageItem) => {
      const isCurrentPage = item.type === "page" && item.value === currentPage;
      const isPreviousDisabled = item.type === "previous" && !hasPrevious;
      const isNextDisabled = item.type === "next" && !hasNext;
      const isDisabled = disabled || isPreviousDisabled || isNextDisabled;

      let ariaLabelText = "";
      if (item.type === "page") {
        ariaLabelText = `Page ${item.value}`;
      } else if (item.type === "previous") {
        ariaLabelText = "Previous page";
      } else if (item.type === "next") {
        ariaLabelText = "Next page";
      }

      const props: {
        "aria-current"?: "page";
        "aria-disabled"?: boolean;
        "aria-label": string;
        onClick: () => void;
        disabled: boolean;
      } = {
        "aria-label": ariaLabelText,
        onClick: () => {
          if (isDisabled) {
            return;
          }

          if (item.type === "page") {
            handlePageChange(item.value);
          } else if (item.type === "previous") {
            previous();
          } else if (item.type === "next") {
            next();
          }
        },
        disabled: isDisabled,
      };

      if (isCurrentPage) {
        props["aria-current"] = "page";
      }

      if (isDisabled) {
        props["aria-disabled"] = true;
      }

      return props;
    },
    [
      currentPage,
      hasPrevious,
      hasNext,
      disabled,
      handlePageChange,
      previous,
      next,
    ],
  );

  return {
    navProps,
    getPageProps,
    items,
    currentPage,
    totalPages,
    hasPrevious,
    hasNext,
    setPage,
    next,
    previous,
    first,
    last,
  };
}
