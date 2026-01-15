import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBreadcrumb } from '../../src/hooks/useBreadcrumb';

const mockItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Details', isCurrent: true },
];

describe('useBreadcrumb', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with items', () => {
      const { result } = renderHook(() => useBreadcrumb({ items: mockItems }));

      expect(result.current.itemCount).toBe(3);
      expect(result.current.navProps).toBeDefined();
      expect(result.current.listProps).toBeDefined();
    });

    it('should set default aria-label', () => {
      const { result } = renderHook(() => useBreadcrumb({ items: mockItems }));

      expect(result.current.navProps['aria-label']).toBe('Breadcrumb');
    });

    it('should use custom aria-label when provided', () => {
      const { result } = renderHook(() =>
        useBreadcrumb({ items: mockItems, ariaLabel: 'Custom Navigation' })
      );

      expect(result.current.navProps['aria-label']).toBe('Custom Navigation');
    });
  });

  describe('Navigation Props', () => {
    it('should provide nav props with aria-label', () => {
      const { result } = renderHook(() => useBreadcrumb({ items: mockItems }));

      expect(result.current.navProps['aria-label']).toBe('Breadcrumb');
    });

    it('should provide list props with role="list"', () => {
      const { result } = renderHook(() => useBreadcrumb({ items: mockItems }));

      expect(result.current.listProps.role).toBe('list');
    });
  });

  describe('Item Props', () => {
    it('should set aria-current="page" on current item', () => {
      const { result } = renderHook(() => useBreadcrumb({ items: mockItems }));

      const currentItemProps = result.current.getItemProps(mockItems[2], 2);
      expect(currentItemProps['aria-current']).toBe('page');
    });

    it('should not set aria-current on non-current items', () => {
      const { result } = renderHook(() => useBreadcrumb({ items: mockItems }));

      const nonCurrentProps = result.current.getItemProps(mockItems[0], 0);
      expect(nonCurrentProps['aria-current']).toBeUndefined();
    });

    it('should call onNavigate when item clicked', () => {
      const onNavigate = vi.fn();
      const { result } = renderHook(() =>
        useBreadcrumb({ items: mockItems, onNavigate })
      );

      const itemProps = result.current.getItemProps(mockItems[0], 0);

      act(() => {
        itemProps.onClick?.();
      });

      expect(onNavigate).toHaveBeenCalledTimes(1);
    });

    it('should pass item and index to onNavigate', () => {
      const onNavigate = vi.fn();
      const { result } = renderHook(() =>
        useBreadcrumb({ items: mockItems, onNavigate })
      );

      const itemProps = result.current.getItemProps(mockItems[1], 1);

      act(() => {
        itemProps.onClick?.();
      });

      expect(onNavigate).toHaveBeenCalledWith(mockItems[1], 1);
    });
  });

  describe('Item Count', () => {
    it('should return correct item count', () => {
      const { result } = renderHook(() => useBreadcrumb({ items: mockItems }));

      expect(result.current.itemCount).toBe(3);
    });
  });
});
