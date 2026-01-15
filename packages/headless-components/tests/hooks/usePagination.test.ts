import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../../src/hooks/usePagination';

describe('usePagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with page 1 by default', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10 })
      );

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(10);
    });

    it('should initialize with defaultPage', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10, defaultPage: 5 })
      );

      expect(result.current.currentPage).toBe(5);
    });

    it('should calculate total pages correctly', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 95, pageSize: 10 })
      );

      expect(result.current.totalPages).toBe(10);
    });
  });

  describe('Page Navigation', () => {
    it('should go to next page with next()', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10 })
      );

      act(() => {
        result.current.next();
      });

      expect(result.current.currentPage).toBe(2);
    });

    it('should go to previous page with previous()', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10, defaultPage: 3 })
      );

      act(() => {
        result.current.previous();
      });

      expect(result.current.currentPage).toBe(2);
    });

    it('should go to first page with first()', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10, defaultPage: 5 })
      );

      act(() => {
        result.current.first();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should go to last page with last()', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10 })
      );

      act(() => {
        result.current.last();
      });

      expect(result.current.currentPage).toBe(10);
    });

    it('should go to specific page with setPage()', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10 })
      );

      act(() => {
        result.current.setPage(7);
      });

      expect(result.current.currentPage).toBe(7);
    });

    it('should call onChange when page changes', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10, onChange })
      );

      act(() => {
        result.current.next();
      });

      expect(onChange).toHaveBeenCalledWith(2);
    });
  });

  describe('Boundary Checks', () => {
    it('should not go before page 1', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10 })
      );

      act(() => {
        result.current.previous();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should not go beyond last page', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10, defaultPage: 10 })
      );

      act(() => {
        result.current.next();
      });

      expect(result.current.currentPage).toBe(10);
    });

    it('should set hasPrevious correctly', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10 })
      );

      expect(result.current.hasPrevious).toBe(false);

      act(() => {
        result.current.next();
      });

      expect(result.current.hasPrevious).toBe(true);
    });

    it('should set hasNext correctly', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10, defaultPage: 10 })
      );

      expect(result.current.hasNext).toBe(false);

      act(() => {
        result.current.previous();
      });

      expect(result.current.hasNext).toBe(true);
    });
  });

  describe('Page Items Generation', () => {
    it('should generate items with pages', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 50, pageSize: 10 })
      );

      const pageItems = result.current.items.filter((item) => item.type === 'page');
      expect(pageItems.length).toBeGreaterThan(0);
    });

    it('should include previous and next items', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10 })
      );

      const hasPrevious = result.current.items.some((item) => item.type === 'previous');
      const hasNext = result.current.items.some((item) => item.type === 'next');

      expect(hasPrevious).toBe(true);
      expect(hasNext).toBe(true);
    });

    it('should generate ellipsis for large page counts', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 1000, pageSize: 10, siblings: 1, boundaries: 1 })
      );

      const hasEllipsis = result.current.items.some((item) => item.type === 'ellipsis');
      expect(hasEllipsis).toBe(true);
    });

    it('should respect siblings count', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 1000, pageSize: 10, defaultPage: 50, siblings: 2, boundaries: 1 })
      );

      const pageItems = result.current.items.filter((item) => item.type === 'page');
      const hasPage48 = pageItems.some((item) => item.type === 'page' && item.value === 48);
      const hasPage52 = pageItems.some((item) => item.type === 'page' && item.value === 52);

      expect(hasPage48).toBe(true);
      expect(hasPage52).toBe(true);
    });

    it('should respect boundaries count', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 1000, pageSize: 10, defaultPage: 50, siblings: 1, boundaries: 2 })
      );

      const pageItems = result.current.items.filter((item) => item.type === 'page');
      const hasPage1 = pageItems.some((item) => item.type === 'page' && item.value === 1);
      const hasPage2 = pageItems.some((item) => item.type === 'page' && item.value === 2);
      const hasPage99 = pageItems.some((item) => item.type === 'page' && item.value === 99);
      const hasPage100 = pageItems.some((item) => item.type === 'page' && item.value === 100);

      expect(hasPage1).toBe(true);
      expect(hasPage2).toBe(true);
      expect(hasPage99).toBe(true);
      expect(hasPage100).toBe(true);
    });
  });

  describe('ARIA Attributes', () => {
    it('should set role="navigation" on nav', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10 })
      );

      expect(result.current.navProps.role).toBe('navigation');
    });

    it('should set aria-label on nav', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10, ariaLabel: 'Page navigation' })
      );

      expect(result.current.navProps['aria-label']).toBe('Page navigation');
    });

    it('should set aria-current="page" on current page', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10, defaultPage: 3 })
      );

      const pageItem = result.current.items.find(
        (item) => item.type === 'page' && item.value === 3
      );
      const props = result.current.getPageProps(pageItem!);

      expect(props['aria-current']).toBe('page');
    });

    it('should set aria-label with page number for page buttons', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10 })
      );

      const pageItem = result.current.items.find((item) => item.type === 'page' && item.value === 1);
      expect(pageItem).toBeDefined();
      const props = result.current.getPageProps(pageItem!);

      expect(props['aria-label']).toContain('1');
    });

    it('should set aria-disabled on disabled previous/next', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10 })
      );

      const previousItem = result.current.items.find((item) => item.type === 'previous');
      const props = result.current.getPageProps(previousItem!);

      expect(props['aria-disabled']).toBe(true);
    });
  });

  describe('Disabled State', () => {
    it('should disable all buttons when disabled', () => {
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10, disabled: true })
      );

      const pageItem = result.current.items.find((item) => item.type === 'page');
      const props = result.current.getPageProps(pageItem!);

      expect(props.disabled).toBe(true);
    });

    it('should not change page when disabled', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10, disabled: true, onChange })
      );

      act(() => {
        result.current.next();
      });

      expect(onChange).not.toHaveBeenCalled();
      expect(result.current.currentPage).toBe(1);
    });
  });

  describe('Controlled Mode', () => {
    it('should work in controlled mode', () => {
      const { result, rerender } = renderHook(
        ({ page }) => usePagination({ total: 100, pageSize: 10, page }),
        { initialProps: { page: 3 } }
      );

      expect(result.current.currentPage).toBe(3);

      rerender({ page: 5 });
      expect(result.current.currentPage).toBe(5);
    });

    it('should not update internal state in controlled mode', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        usePagination({ total: 100, pageSize: 10, page: 3, onChange })
      );

      act(() => {
        result.current.next();
      });

      expect(onChange).toHaveBeenCalledWith(4);
      expect(result.current.currentPage).toBe(3);
    });
  });
});
