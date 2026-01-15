import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePopover } from '../../src/hooks/usePopover';

describe('usePopover', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock document event listeners
    document.addEventListener = vi.fn();
    document.removeEventListener = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize as closed', () => {
      const { result } = renderHook(() => usePopover());
      expect(result.current.isOpen).toBe(false);
    });

    it('should initialize with defaultOpen', () => {
      const { result } = renderHook(() => usePopover({ defaultOpen: true }));
      expect(result.current.isOpen).toBe(true);
    });

    it('should use controlled isOpen prop', () => {
      const { result } = renderHook(() => usePopover({ isOpen: true }));
      expect(result.current.isOpen).toBe(true);
    });

    it('should generate unique IDs', () => {
      const { result: result1 } = renderHook(() => usePopover());
      const { result: result2 } = renderHook(() => usePopover());

      expect(result1.current.popoverProps.id).toBeTruthy();
      expect(result2.current.popoverProps.id).toBeTruthy();
      expect(result1.current.popoverProps.id).not.toBe(result2.current.popoverProps.id);
    });

    it('should use custom ID when provided', () => {
      const { result } = renderHook(() => usePopover({ id: 'custom-popover' }));
      expect(result.current.popoverProps.id).toBe('custom-popover');
    });
  });

  describe('Click Trigger', () => {
    it('should toggle on click when trigger="click"', () => {
      const { result } = renderHook(() => usePopover({ trigger: 'click' }));

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.triggerProps.onClick?.();
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.triggerProps.onClick?.();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should not respond to hover when trigger="click"', () => {
      const { result } = renderHook(() => usePopover({ trigger: 'click' }));

      act(() => {
        result.current.triggerProps.onMouseEnter?.();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should call onOpenChange callback', () => {
      const onOpenChange = vi.fn();
      const { result } = renderHook(() => usePopover({ trigger: 'click', onOpenChange }));

      act(() => {
        result.current.triggerProps.onClick?.();
      });

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Hover Trigger', () => {
    it('should open on mouse enter when trigger="hover"', () => {
      const { result } = renderHook(() => usePopover({ trigger: 'hover' }));

      act(() => {
        result.current.triggerProps.onMouseEnter?.();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should close on mouse leave when trigger="hover"', () => {
      const { result } = renderHook(() => usePopover({ trigger: 'hover' }));

      act(() => {
        result.current.triggerProps.onMouseEnter?.();
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.triggerProps.onMouseLeave?.();
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('Focus Trigger', () => {
    it('should open on focus when trigger="focus"', () => {
      const { result } = renderHook(() => usePopover({ trigger: 'focus' }));

      act(() => {
        result.current.triggerProps.onFocus?.();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should close on blur when trigger="focus"', () => {
      const { result } = renderHook(() => usePopover({ trigger: 'focus' }));

      act(() => {
        result.current.triggerProps.onFocus?.();
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.triggerProps.onBlur?.();
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('Escape Key', () => {
    it('should close on Escape key when enabled', () => {
      const { result } = renderHook(() => usePopover({ closeOnEscape: true, defaultOpen: true }));

      const event = new KeyboardEvent('keydown', { key: 'Escape' });

      act(() => {
        result.current.popoverProps.onKeyDown(event as any);
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should not close on other keys', () => {
      const { result } = renderHook(() => usePopover({ closeOnEscape: true, defaultOpen: true }));

      const event = new KeyboardEvent('keydown', { key: 'Enter' });

      act(() => {
        result.current.popoverProps.onKeyDown(event as any);
      });

      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('ARIA Attributes', () => {
    it('should set aria-expanded based on open state', () => {
      const { result } = renderHook(() => usePopover());

      expect(result.current.triggerProps['aria-expanded']).toBe(false);

      act(() => {
        result.current.open();
      });

      expect(result.current.triggerProps['aria-expanded']).toBe(true);
    });

    it('should set aria-controls linking to popover', () => {
      const { result } = renderHook(() => usePopover());
      const popoverId = result.current.popoverProps.id;
      expect(result.current.triggerProps['aria-controls']).toBe(popoverId);
    });

    it('should set aria-haspopup=true', () => {
      const { result } = renderHook(() => usePopover());
      expect(result.current.triggerProps['aria-haspopup']).toBe(true);
    });

    it('should set role="dialog" on popover', () => {
      const { result } = renderHook(() => usePopover());
      expect(result.current.popoverProps.role).toBe('dialog');
    });
  });

  describe('Programmatic Control', () => {
    it('should open with open method', () => {
      const { result } = renderHook(() => usePopover());

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should close with close method', () => {
      const { result } = renderHook(() => usePopover({ defaultOpen: true }));

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should toggle with toggle method', () => {
      const { result } = renderHook(() => usePopover());

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

  describe('Controlled Mode', () => {
    it('should work in controlled mode', () => {
      const { result, rerender } = renderHook(
        ({ isOpen }) => usePopover({ isOpen }),
        { initialProps: { isOpen: false } }
      );

      expect(result.current.isOpen).toBe(false);

      rerender({ isOpen: true });

      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('Placement', () => {
    it('should accept placement prop', () => {
      const placements = ['top', 'bottom', 'left', 'right'] as const;

      placements.forEach((placement) => {
        const { result } = renderHook(() => usePopover({ placement }));
        expect(result).toBeTruthy();
      });
    });
  });
});
