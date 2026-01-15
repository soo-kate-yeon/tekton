import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTooltip } from '../../src/hooks/useTooltip';

describe('useTooltip', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initialization', () => {
    it('should initialize as hidden', () => {
      const { result } = renderHook(() => useTooltip());
      expect(result.current.isVisible).toBe(false);
    });

    it('should generate unique ID', () => {
      const { result: result1 } = renderHook(() => useTooltip());
      const { result: result2 } = renderHook(() => useTooltip());

      expect(result1.current.tooltipProps.id).toBeTruthy();
      expect(result2.current.tooltipProps.id).toBeTruthy();
      expect(result1.current.tooltipProps.id).not.toBe(result2.current.tooltipProps.id);
    });

    it('should use custom ID when provided', () => {
      const { result } = renderHook(() => useTooltip({ id: 'custom-tooltip' }));
      expect(result.current.tooltipProps.id).toBe('custom-tooltip');
    });
  });

  describe('Show/Hide', () => {
    it('should show on mouse enter after delay', () => {
      const { result } = renderHook(() => useTooltip({ showDelay: 500 }));

      expect(result.current.isVisible).toBe(false);

      act(() => {
        result.current.triggerProps.onMouseEnter();
      });

      expect(result.current.isVisible).toBe(false);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.isVisible).toBe(true);
    });

    it('should hide on mouse leave after delay', () => {
      const { result } = renderHook(() => useTooltip({ hideDelay: 200 }));

      act(() => {
        result.current.show();
      });

      expect(result.current.isVisible).toBe(true);

      act(() => {
        result.current.triggerProps.onMouseLeave();
      });

      expect(result.current.isVisible).toBe(true);

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(result.current.isVisible).toBe(false);
    });

    it('should show on focus', () => {
      const { result } = renderHook(() => useTooltip({ showDelay: 0 }));

      act(() => {
        result.current.triggerProps.onFocus();
      });

      expect(result.current.isVisible).toBe(true);
    });

    it('should hide on blur', () => {
      const { result } = renderHook(() => useTooltip({ hideDelay: 0 }));

      act(() => {
        result.current.show();
      });

      expect(result.current.isVisible).toBe(true);

      act(() => {
        result.current.triggerProps.onBlur();
      });

      expect(result.current.isVisible).toBe(false);
    });
  });

  describe('Delays', () => {
    it('should respect showDelay', () => {
      const { result } = renderHook(() => useTooltip({ showDelay: 1000 }));

      act(() => {
        result.current.triggerProps.onMouseEnter();
        vi.advanceTimersByTime(500);
      });

      expect(result.current.isVisible).toBe(false);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.isVisible).toBe(true);
    });

    it('should respect hideDelay', () => {
      const { result } = renderHook(() => useTooltip({ hideDelay: 300 }));

      act(() => {
        result.current.show();
      });

      act(() => {
        result.current.triggerProps.onMouseLeave();
        vi.advanceTimersByTime(150);
      });

      expect(result.current.isVisible).toBe(true);

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(result.current.isVisible).toBe(false);
    });

    it('should cancel show timer if mouse leaves before delay', () => {
      const { result } = renderHook(() => useTooltip({ showDelay: 500 }));

      act(() => {
        result.current.triggerProps.onMouseEnter();
        vi.advanceTimersByTime(200);
      });

      expect(result.current.isVisible).toBe(false);

      act(() => {
        result.current.triggerProps.onMouseLeave();
        vi.advanceTimersByTime(500);
      });

      expect(result.current.isVisible).toBe(false);
    });

    it('should cancel hide timer if mouse enters before delay', () => {
      const { result } = renderHook(() => useTooltip({ showDelay: 0, hideDelay: 500 }));

      act(() => {
        result.current.show();
      });

      act(() => {
        result.current.triggerProps.onMouseLeave();
        vi.advanceTimersByTime(200);
      });

      expect(result.current.isVisible).toBe(true);

      act(() => {
        result.current.triggerProps.onMouseEnter();
        vi.advanceTimersByTime(500);
      });

      expect(result.current.isVisible).toBe(true);
    });
  });

  describe('ARIA Attributes', () => {
    it('should set role="tooltip"', () => {
      const { result } = renderHook(() => useTooltip());
      expect(result.current.tooltipProps.role).toBe('tooltip');
    });

    it('should link trigger with aria-describedby', () => {
      const { result } = renderHook(() => useTooltip());
      const tooltipId = result.current.tooltipProps.id;
      expect(result.current.triggerProps['aria-describedby']).toBe(tooltipId);
    });
  });

  describe('Disabled State', () => {
    it('should not show when disabled', () => {
      const { result } = renderHook(() => useTooltip({ disabled: true, showDelay: 0 }));

      act(() => {
        result.current.triggerProps.onMouseEnter();
      });

      expect(result.current.isVisible).toBe(false);

      act(() => {
        result.current.triggerProps.onFocus();
      });

      expect(result.current.isVisible).toBe(false);
    });

    it('should not allow programmatic show when disabled', () => {
      const { result } = renderHook(() => useTooltip({ disabled: true }));

      act(() => {
        result.current.show();
      });

      expect(result.current.isVisible).toBe(false);
    });
  });

  describe('Programmatic Control', () => {
    it('should show immediately with show method', () => {
      const { result } = renderHook(() => useTooltip());

      act(() => {
        result.current.show();
      });

      expect(result.current.isVisible).toBe(true);
    });

    it('should hide immediately with hide method', () => {
      const { result } = renderHook(() => useTooltip());

      act(() => {
        result.current.show();
      });

      expect(result.current.isVisible).toBe(true);

      act(() => {
        result.current.hide();
      });

      expect(result.current.isVisible).toBe(false);
    });
  });

  describe('Placement', () => {
    it('should accept placement prop', () => {
      const placements = ['top', 'bottom', 'left', 'right'] as const;

      placements.forEach((placement) => {
        const { result } = renderHook(() => useTooltip({ placement }));
        expect(result).toBeTruthy();
      });
    });
  });
});
