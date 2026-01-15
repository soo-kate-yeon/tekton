import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSlider } from '../../src/hooks/useSlider';

describe('useSlider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with defaultValue', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 50, min: 0, max: 100 })
      );

      expect(result.current.value).toBe(50);
    });

    it('should initialize with min value by default', () => {
      const { result } = renderHook(() => useSlider({ min: 10, max: 100 }));

      expect(result.current.value).toBe(10);
    });

    it('should clamp initial value within min/max', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 150, min: 0, max: 100 })
      );

      expect(result.current.value).toBe(100);
    });
  });

  describe('Value Management', () => {
    it('should update value with setValue()', () => {
      const { result } = renderHook(() => useSlider({ min: 0, max: 100 }));

      act(() => {
        result.current.setValue(75);
      });

      expect(result.current.value).toBe(75);
    });

    it('should increment value with increment()', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 50, min: 0, max: 100, step: 5 })
      );

      act(() => {
        result.current.increment();
      });

      expect(result.current.value).toBe(55);
    });

    it('should decrement value with decrement()', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 50, min: 0, max: 100, step: 5 })
      );

      act(() => {
        result.current.decrement();
      });

      expect(result.current.value).toBe(45);
    });

    it('should respect step increments', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 0, min: 0, max: 100, step: 10 })
      );

      act(() => {
        result.current.increment();
      });

      expect(result.current.value).toBe(10);
    });

    it('should not exceed max value', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 95, min: 0, max: 100, step: 10 })
      );

      act(() => {
        result.current.increment();
      });

      expect(result.current.value).toBe(100);
    });

    it('should not go below min value', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 5, min: 0, max: 100, step: 10 })
      );

      act(() => {
        result.current.decrement();
      });

      expect(result.current.value).toBe(0);
    });
  });

  describe('Percentage Calculation', () => {
    it('should calculate percentage correctly', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 50, min: 0, max: 100 })
      );

      expect(result.current.percentage).toBe(50);
    });

    it('should return 0% at min value', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 0, min: 0, max: 100 })
      );

      expect(result.current.percentage).toBe(0);
    });

    it('should return 100% at max value', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 100, min: 0, max: 100 })
      );

      expect(result.current.percentage).toBe(100);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should increase value on ArrowUp', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 50, min: 0, max: 100, step: 1 })
      );

      act(() => {
        result.current.thumbProps.onKeyDown({
          key: 'ArrowUp',
          preventDefault: vi.fn(),
        } as any);
      });

      expect(result.current.value).toBe(51);
    });

    it('should increase value on ArrowRight', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 50, min: 0, max: 100, step: 1 })
      );

      act(() => {
        result.current.thumbProps.onKeyDown({
          key: 'ArrowRight',
          preventDefault: vi.fn(),
        } as any);
      });

      expect(result.current.value).toBe(51);
    });

    it('should decrease value on ArrowDown', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 50, min: 0, max: 100, step: 1 })
      );

      act(() => {
        result.current.thumbProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
      });

      expect(result.current.value).toBe(49);
    });

    it('should decrease value on ArrowLeft', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 50, min: 0, max: 100, step: 1 })
      );

      act(() => {
        result.current.thumbProps.onKeyDown({
          key: 'ArrowLeft',
          preventDefault: vi.fn(),
        } as any);
      });

      expect(result.current.value).toBe(49);
    });

    it('should jump to min value on Home key', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 50, min: 0, max: 100 })
      );

      act(() => {
        result.current.thumbProps.onKeyDown({
          key: 'Home',
          preventDefault: vi.fn(),
        } as any);
      });

      expect(result.current.value).toBe(0);
    });

    it('should jump to max value on End key', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 50, min: 0, max: 100 })
      );

      act(() => {
        result.current.thumbProps.onKeyDown({
          key: 'End',
          preventDefault: vi.fn(),
        } as any);
      });

      expect(result.current.value).toBe(100);
    });

    it('should increase by larger increment on PageUp', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 50, min: 0, max: 100, step: 1 })
      );

      act(() => {
        result.current.thumbProps.onKeyDown({
          key: 'PageUp',
          preventDefault: vi.fn(),
        } as any);
      });

      expect(result.current.value).toBeGreaterThan(50);
      expect(result.current.value).toBeLessThanOrEqual(100);
    });

    it('should decrease by larger increment on PageDown', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 50, min: 0, max: 100, step: 1 })
      );

      act(() => {
        result.current.thumbProps.onKeyDown({
          key: 'PageDown',
          preventDefault: vi.fn(),
        } as any);
      });

      expect(result.current.value).toBeLessThan(50);
      expect(result.current.value).toBeGreaterThanOrEqual(0);
    });

    it('should not respond to keyboard when disabled', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 50, min: 0, max: 100, disabled: true })
      );

      act(() => {
        result.current.thumbProps.onKeyDown({
          key: 'ArrowUp',
          preventDefault: vi.fn(),
        } as any);
      });

      expect(result.current.value).toBe(50);
    });
  });

  describe('ARIA Attributes', () => {
    it('should set role="slider"', () => {
      const { result } = renderHook(() => useSlider({ min: 0, max: 100 }));

      expect(result.current.thumbProps.role).toBe('slider');
    });

    it('should set aria-valuemin', () => {
      const { result } = renderHook(() => useSlider({ min: 10, max: 100 }));

      expect(result.current.thumbProps['aria-valuemin']).toBe(10);
    });

    it('should set aria-valuemax', () => {
      const { result } = renderHook(() => useSlider({ min: 0, max: 200 }));

      expect(result.current.thumbProps['aria-valuemax']).toBe(200);
    });

    it('should set aria-valuenow to current value', () => {
      const { result } = renderHook(() =>
        useSlider({ defaultValue: 75, min: 0, max: 100 })
      );

      expect(result.current.thumbProps['aria-valuenow']).toBe(75);
    });

    it('should set aria-orientation based on prop', () => {
      const { result } = renderHook(() =>
        useSlider({ min: 0, max: 100, orientation: 'vertical' })
      );

      expect(result.current.thumbProps['aria-orientation']).toBe('vertical');
    });

    it('should set aria-disabled when disabled', () => {
      const { result } = renderHook(() =>
        useSlider({ min: 0, max: 100, disabled: true })
      );

      expect(result.current.thumbProps['aria-disabled']).toBe(true);
    });

    it('should include aria-label when provided', () => {
      const { result } = renderHook(() =>
        useSlider({ min: 0, max: 100, ariaLabel: 'Volume control' })
      );

      expect(result.current.thumbProps['aria-label']).toBe('Volume control');
    });

    it('should set tabIndex=0 for keyboard focus', () => {
      const { result } = renderHook(() => useSlider({ min: 0, max: 100 }));

      expect(result.current.thumbProps.tabIndex).toBe(0);
    });
  });

  describe('Orientation', () => {
    it('should default to horizontal orientation', () => {
      const { result } = renderHook(() => useSlider({ min: 0, max: 100 }));

      expect(result.current.thumbProps['aria-orientation']).toBe('horizontal');
    });

    it('should support vertical orientation', () => {
      const { result } = renderHook(() =>
        useSlider({ min: 0, max: 100, orientation: 'vertical' })
      );

      expect(result.current.thumbProps['aria-orientation']).toBe('vertical');
    });
  });

  describe('Controlled Mode', () => {
    it('should work in controlled mode', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useSlider({ value, min: 0, max: 100 }),
        { initialProps: { value: 30 } }
      );

      expect(result.current.value).toBe(30);

      rerender({ value: 70 });
      expect(result.current.value).toBe(70);
    });

    it('should call onChange when value changes', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useSlider({ min: 0, max: 100, onChange })
      );

      act(() => {
        result.current.increment();
      });

      expect(onChange).toHaveBeenCalled();
    });

    it('should not update internal state in controlled mode', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useSlider({ value: 50, min: 0, max: 100, onChange })
      );

      act(() => {
        result.current.increment();
      });

      expect(onChange).toHaveBeenCalledWith(51);
      expect(result.current.value).toBe(50);
    });
  });

  describe('Disabled State', () => {
    it('should set aria-disabled when disabled', () => {
      const { result } = renderHook(() =>
        useSlider({ min: 0, max: 100, disabled: true })
      );

      expect(result.current.thumbProps['aria-disabled']).toBe(true);
    });

    it('should not call onChange when disabled', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useSlider({ min: 0, max: 100, disabled: true, onChange })
      );

      act(() => {
        result.current.increment();
      });

      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
