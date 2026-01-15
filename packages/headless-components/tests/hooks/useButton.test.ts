import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useButton } from '../../src/hooks/useButton';

describe('useButton', () => {
  describe('initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useButton());

      expect(result.current.isPressed).toBe(false);
      expect(result.current.isDisabled).toBe(false);
      expect(result.current.buttonProps.role).toBe('button');
      expect(result.current.buttonProps['aria-disabled']).toBe(false);
    });

    it('should initialize with disabled state', () => {
      const { result } = renderHook(() => useButton({ disabled: true }));

      expect(result.current.isDisabled).toBe(true);
      expect(result.current.buttonProps['aria-disabled']).toBe(true);
      expect(result.current.buttonProps.disabled).toBe(true);
    });

    it('should initialize with pressed state in toggle mode', () => {
      const { result } = renderHook(() => useButton({ toggle: true, pressed: true }));

      expect(result.current.isPressed).toBe(true);
      expect(result.current.buttonProps['aria-pressed']).toBe(true);
    });
  });

  describe('click events', () => {
    it('should call onClick handler on click', () => {
      const onClick = vi.fn();
      const { result } = renderHook(() => useButton({ onClick }));

      act(() => {
        result.current.buttonProps.onClick({} as any);
      });

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const onClick = vi.fn();
      const { result } = renderHook(() => useButton({ disabled: true, onClick }));

      act(() => {
        result.current.buttonProps.onClick({} as any);
      });

      expect(onClick).not.toHaveBeenCalled();
    });

    it('should toggle pressed state in toggle mode', () => {
      const { result } = renderHook(() => useButton({ toggle: true }));

      expect(result.current.isPressed).toBe(false);

      act(() => {
        result.current.buttonProps.onClick({} as any);
      });

      expect(result.current.isPressed).toBe(true);
      expect(result.current.buttonProps['aria-pressed']).toBe(true);
    });
  });

  describe('keyboard events', () => {
    it('should handle Enter key', () => {
      const onClick = vi.fn();
      const { result } = renderHook(() => useButton({ onClick }));

      const event = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as any;

      act(() => {
        result.current.buttonProps.onKeyDown(event);
      });

      expect(event.preventDefault).toHaveBeenCalled();
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should handle Space key', () => {
      const onClick = vi.fn();
      const { result } = renderHook(() => useButton({ onClick }));

      const event = {
        key: ' ',
        preventDefault: vi.fn(),
      } as any;

      act(() => {
        result.current.buttonProps.onKeyDown(event);
      });

      expect(event.preventDefault).toHaveBeenCalled();
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not handle keyboard events when disabled', () => {
      const onClick = vi.fn();
      const { result } = renderHook(() => useButton({ disabled: true, onClick }));

      const event = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as any;

      act(() => {
        result.current.buttonProps.onKeyDown(event);
      });

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('ARIA attributes', () => {
    it('should include aria-label when provided', () => {
      const { result } = renderHook(() => useButton({ 'aria-label': 'Click me' }));

      expect(result.current.buttonProps['aria-label']).toBe('Click me');
    });

    it('should not include aria-pressed when not in toggle mode', () => {
      const { result } = renderHook(() => useButton());

      expect(result.current.buttonProps['aria-pressed']).toBeUndefined();
    });

    it('should include tabIndex 0 when not disabled', () => {
      const { result } = renderHook(() => useButton());

      expect(result.current.buttonProps.tabIndex).toBe(0);
    });

    it('should include tabIndex -1 when disabled', () => {
      const { result } = renderHook(() => useButton({ disabled: true }));

      expect(result.current.buttonProps.tabIndex).toBe(-1);
    });
  });

  describe('controlled mode', () => {
    it('should use external pressed state in controlled mode', () => {
      const { result } = renderHook(() =>
        useButton({ toggle: true, pressed: true, onPressedChange: vi.fn() })
      );

      expect(result.current.isPressed).toBe(true);
    });

    it('should call onPressedChange in controlled mode', () => {
      const onPressedChange = vi.fn();
      const { result } = renderHook(() =>
        useButton({ toggle: true, pressed: false, onPressedChange })
      );

      act(() => {
        result.current.buttonProps.onClick({} as any);
      });

      expect(onPressedChange).toHaveBeenCalledWith(true);
    });
  });
});
