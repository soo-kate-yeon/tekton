import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToggle } from '../../src/hooks/useToggle';

describe('useToggle', () => {
  describe('initialization', () => {
    it('should initialize with default state (off)', () => {
      const { result } = renderHook(() => useToggle());

      expect(result.current.isOn).toBe(false);
      expect(result.current.toggleProps.role).toBe('switch');
      expect(result.current.toggleProps['aria-checked']).toBe(false);
    });

    it('should initialize with on state', () => {
      const { result } = renderHook(() => useToggle({ defaultOn: true }));

      expect(result.current.isOn).toBe(true);
      expect(result.current.toggleProps['aria-checked']).toBe(true);
    });

    it('should initialize with disabled state', () => {
      const { result } = renderHook(() => useToggle({ disabled: true }));

      expect(result.current.toggleProps['aria-disabled']).toBe(true);
      expect(result.current.toggleProps.disabled).toBe(true);
    });
  });

  describe('toggle functionality', () => {
    it('should toggle on click', () => {
      const { result } = renderHook(() => useToggle());

      expect(result.current.isOn).toBe(false);

      act(() => {
        result.current.toggleProps.onClick({} as any);
      });

      expect(result.current.isOn).toBe(true);

      act(() => {
        result.current.toggleProps.onClick({} as any);
      });

      expect(result.current.isOn).toBe(false);
    });

    it('should not toggle when disabled', () => {
      const { result } = renderHook(() => useToggle({ disabled: true }));

      act(() => {
        result.current.toggleProps.onClick({} as any);
      });

      expect(result.current.isOn).toBe(false);
    });

    it('should call onChange callback', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useToggle({ onChange }));

      act(() => {
        result.current.toggleProps.onClick({} as any);
      });

      expect(onChange).toHaveBeenCalledWith(true);

      act(() => {
        result.current.toggleProps.onClick({} as any);
      });

      expect(onChange).toHaveBeenCalledWith(false);
    });
  });

  describe('keyboard events', () => {
    it('should toggle on Space key', () => {
      const { result } = renderHook(() => useToggle());

      const event = {
        key: ' ',
        preventDefault: vi.fn(),
      } as any;

      act(() => {
        result.current.toggleProps.onKeyDown(event);
      });

      expect(event.preventDefault).toHaveBeenCalled();
      expect(result.current.isOn).toBe(true);
    });

    it('should toggle on Enter key', () => {
      const { result } = renderHook(() => useToggle());

      const event = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as any;

      act(() => {
        result.current.toggleProps.onKeyDown(event);
      });

      expect(event.preventDefault).toHaveBeenCalled();
      expect(result.current.isOn).toBe(true);
    });

    it('should not toggle on other keys', () => {
      const { result } = renderHook(() => useToggle());

      const event = {
        key: 'a',
        preventDefault: vi.fn(),
      } as any;

      act(() => {
        result.current.toggleProps.onKeyDown(event);
      });

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(result.current.isOn).toBe(false);
    });
  });

  describe('controlled mode', () => {
    it('should use external on state in controlled mode', () => {
      const { result } = renderHook(() => useToggle({ on: true, onChange: vi.fn() }));

      expect(result.current.isOn).toBe(true);
    });

    it('should call onChange in controlled mode', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useToggle({ on: false, onChange }));

      act(() => {
        result.current.toggleProps.onClick({} as any);
      });

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('should not update internal state in controlled mode', () => {
      const { result } = renderHook(() => useToggle({ on: false, onChange: vi.fn() }));

      act(() => {
        result.current.toggleProps.onClick({} as any);
      });

      // State remains false because it's controlled externally
      expect(result.current.isOn).toBe(false);
    });
  });

  describe('ARIA attributes', () => {
    it('should include aria-label when provided', () => {
      const { result } = renderHook(() => useToggle({ 'aria-label': 'Dark mode' }));

      expect(result.current.toggleProps['aria-label']).toBe('Dark mode');
    });

    it('should include tabIndex 0 when not disabled', () => {
      const { result } = renderHook(() => useToggle());

      expect(result.current.toggleProps.tabIndex).toBe(0);
    });

    it('should include tabIndex -1 when disabled', () => {
      const { result } = renderHook(() => useToggle({ disabled: true }));

      expect(result.current.toggleProps.tabIndex).toBe(-1);
    });
  });

  describe('direct control methods', () => {
    it('should provide setOn method', () => {
      const { result } = renderHook(() => useToggle());

      act(() => {
        result.current.setOn(true);
      });

      expect(result.current.isOn).toBe(true);
    });

    it('should provide toggle method', () => {
      const { result } = renderHook(() => useToggle());

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOn).toBe(true);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOn).toBe(false);
    });
  });
});
