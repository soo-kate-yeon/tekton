import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDropdownMenu } from '../../src/hooks/useDropdownMenu';

const mockItems = [
  { id: '1', label: 'Edit', onClick: vi.fn() },
  { id: '2', label: 'Delete', onClick: vi.fn() },
  { id: '3', label: 'Share', onClick: vi.fn() },
];

const mockItemsWithDisabled = [
  { id: '1', label: 'Edit', onClick: vi.fn() },
  { id: '2', label: 'Delete', onClick: vi.fn(), disabled: true },
  { id: '3', label: 'Share', onClick: vi.fn() },
];

describe('useDropdownMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize as closed', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems }));
      expect(result.current.isOpen).toBe(false);
    });

    it('should initialize with defaultOpen', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, defaultOpen: true }));
      expect(result.current.isOpen).toBe(true);
    });

    it('should initialize with no highlighted item', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems }));
      expect(result.current.highlightedIndex).toBe(-1);
    });

    it('should generate unique IDs', () => {
      const { result: result1 } = renderHook(() => useDropdownMenu({ items: mockItems }));
      const { result: result2 } = renderHook(() => useDropdownMenu({ items: mockItems }));

      expect(result1.current.menuProps.id).toBeTruthy();
      expect(result2.current.menuProps.id).toBeTruthy();
      expect(result1.current.menuProps.id).not.toBe(result2.current.menuProps.id);
    });
  });

  describe('Open/Close', () => {
    it('should open on trigger click', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems }));

      act(() => {
        result.current.triggerProps.onClick();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should close on second trigger click', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems }));

      act(() => {
        result.current.triggerProps.onClick();
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.triggerProps.onClick();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should close on Escape key from trigger', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, defaultOpen: true }));

      const event = new KeyboardEvent('keydown', { key: 'Escape' });

      act(() => {
        result.current.triggerProps.onKeyDown(event as any);
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should close on Escape key from menu', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, defaultOpen: true }));

      const event = new KeyboardEvent('keydown', { key: 'Escape' });

      act(() => {
        result.current.menuProps.onKeyDown(event as any);
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should close on item selection when closeOnSelect=true', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, defaultOpen: true, closeOnSelect: true }));

      const itemProps = result.current.getItemProps(mockItems[0], 0);

      act(() => {
        itemProps.onClick();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should not close on item selection when closeOnSelect=false', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, defaultOpen: true, closeOnSelect: false }));

      const itemProps = result.current.getItemProps(mockItems[0], 0);

      act(() => {
        itemProps.onClick();
      });

      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should highlight first item on ArrowDown when menu opens', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems }));

      act(() => {
        result.current.open();
      });

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

      act(() => {
        result.current.menuProps.onKeyDown(event as any);
      });

      expect(result.current.highlightedIndex).toBe(0);
    });

    it('should highlight next item on ArrowDown', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, defaultOpen: true }));

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

      act(() => {
        result.current.menuProps.onKeyDown(event as any);
      });

      expect(result.current.highlightedIndex).toBe(0);

      act(() => {
        result.current.menuProps.onKeyDown(event as any);
      });

      expect(result.current.highlightedIndex).toBe(1);
    });

    it('should wrap to first item when ArrowDown at end', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, defaultOpen: true }));

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

      act(() => {
        result.current.menuProps.onKeyDown(event as any);
        result.current.menuProps.onKeyDown(event as any);
        result.current.menuProps.onKeyDown(event as any);
      });

      expect(result.current.highlightedIndex).toBe(2);

      act(() => {
        result.current.menuProps.onKeyDown(event as any);
      });

      expect(result.current.highlightedIndex).toBe(0);
    });

    it('should highlight previous item on ArrowUp', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, defaultOpen: true }));

      act(() => {
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any);
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any);
      });

      expect(result.current.highlightedIndex).toBe(1);

      act(() => {
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }) as any);
      });

      expect(result.current.highlightedIndex).toBe(0);
    });

    it('should wrap to last item when ArrowUp at start', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, defaultOpen: true }));

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

      act(() => {
        result.current.menuProps.onKeyDown(event as any);
      });

      expect(result.current.highlightedIndex).toBe(2);
    });

    it('should jump to first item on Home', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, defaultOpen: true }));

      act(() => {
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any);
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any);
      });

      expect(result.current.highlightedIndex).toBe(1);

      act(() => {
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'Home' }) as any);
      });

      expect(result.current.highlightedIndex).toBe(0);
    });

    it('should jump to last item on End', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, defaultOpen: true }));

      act(() => {
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'End' }) as any);
      });

      expect(result.current.highlightedIndex).toBe(2);
    });

    it('should skip disabled items when navigating down', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItemsWithDisabled, defaultOpen: true }));

      act(() => {
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any);
      });

      expect(result.current.highlightedIndex).toBe(0);

      act(() => {
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any);
      });

      expect(result.current.highlightedIndex).toBe(2); // Skip index 1 (disabled)
    });

    it('should skip disabled items when navigating up', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItemsWithDisabled, defaultOpen: true }));

      act(() => {
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'End' }) as any);
      });

      expect(result.current.highlightedIndex).toBe(2);

      act(() => {
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }) as any);
      });

      expect(result.current.highlightedIndex).toBe(0); // Skip index 1 (disabled)
    });
  });

  describe('Item Selection', () => {
    it('should select item on Enter key', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, defaultOpen: true }));

      act(() => {
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any);
      });

      expect(result.current.highlightedIndex).toBe(0);

      act(() => {
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }) as any);
      });

      expect(mockItems[0].onClick).toHaveBeenCalled();
    });

    it('should select item on Space key', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, defaultOpen: true }));

      act(() => {
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any);
      });

      expect(result.current.highlightedIndex).toBe(0);

      act(() => {
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: ' ' }) as any);
      });

      expect(mockItems[0].onClick).toHaveBeenCalled();
    });

    it('should call item onClick when clicked', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, defaultOpen: true }));

      const itemProps = result.current.getItemProps(mockItems[1], 1);

      act(() => {
        itemProps.onClick();
      });

      expect(mockItems[1].onClick).toHaveBeenCalled();
    });

    it('should not select disabled items', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItemsWithDisabled, defaultOpen: true }));

      act(() => {
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any);
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any);
      });

      expect(result.current.highlightedIndex).toBe(2);

      const itemProps = result.current.getItemProps(mockItemsWithDisabled[1], 1);

      act(() => {
        itemProps.onClick();
      });

      expect(mockItemsWithDisabled[1].onClick).not.toHaveBeenCalled();
    });
  });

  describe('ARIA Attributes', () => {
    it('should set aria-expanded on trigger', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems }));

      expect(result.current.triggerProps['aria-expanded']).toBe(false);

      act(() => {
        result.current.open();
      });

      expect(result.current.triggerProps['aria-expanded']).toBe(true);
    });

    it('should set aria-haspopup="menu"', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems }));
      expect(result.current.triggerProps['aria-haspopup']).toBe('menu');
    });

    it('should set aria-controls linking to menu', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems }));
      const menuId = result.current.menuProps.id;
      expect(result.current.triggerProps['aria-controls']).toBe(menuId);
    });

    it('should set role="menu" on menu', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems }));
      expect(result.current.menuProps.role).toBe('menu');
    });

    it('should set role="menuitem" on items', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems }));
      const itemProps = result.current.getItemProps(mockItems[0], 0);
      expect(itemProps.role).toBe('menuitem');
    });

    it('should set aria-activedescendant when item is highlighted', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, defaultOpen: true }));

      act(() => {
        result.current.menuProps.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any);
      });

      expect(result.current.highlightedIndex).toBe(0);
      expect(result.current.menuProps['aria-activedescendant']).toBe(mockItems[0].id);
    });

    it('should set aria-disabled on disabled items', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItemsWithDisabled }));
      const itemProps = result.current.getItemProps(mockItemsWithDisabled[1], 1);
      expect(itemProps['aria-disabled']).toBe(true);
    });

    it('should set aria-label on menu when provided', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, ariaLabel: 'Actions menu' }));
      expect(result.current.menuProps['aria-label']).toBe('Actions menu');
    });
  });

  describe('Programmatic Control', () => {
    it('should open with open method', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems }));

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should close with close method', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems, defaultOpen: true }));

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should toggle with toggle method', () => {
      const { result } = renderHook(() => useDropdownMenu({ items: mockItems }));

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(false);
    });
  });
});
