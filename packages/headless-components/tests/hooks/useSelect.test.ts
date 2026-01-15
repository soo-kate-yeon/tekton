import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSelect } from '../../src/hooks/useSelect';
import type { SelectOption } from '../../src/hooks/useSelect';

const mockOptions: SelectOption[] = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
];

const mockOptionsWithDisabled: SelectOption[] = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue', disabled: true },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow', disabled: true },
];

describe('useSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with closed dropdown', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      expect(result.current.isOpen).toBe(false);
    });

    it('should initialize with defaultValue', () => {
      const { result } = renderHook(() =>
        useSelect({ options: mockOptions, defaultValue: 'blue' })
      );
      expect(result.current.value).toBe('blue');
      expect(result.current.selectedOption).toEqual({
        value: 'blue',
        label: 'Blue',
      });
    });

    it('should initialize with no selection when defaultValue not in options', () => {
      const { result } = renderHook(() =>
        useSelect({ options: mockOptions, defaultValue: 'invalid' })
      );
      expect(result.current.value).toBe('');
      expect(result.current.selectedOption).toBeNull();
    });
  });

  describe('Open/Close State', () => {
    it('should open dropdown with open()', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);
    });

    it('should close dropdown with close()', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.open();
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);
    });

    it('should toggle dropdown with toggle()', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(false);
    });

    it('should open on trigger click', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.triggerProps.onClick();
      });
      expect(result.current.isOpen).toBe(true);
    });

    it('should close on Escape key', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.open();
      });
      act(() => {
        result.current.triggerProps.onKeyDown({
          key: 'Escape',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('Option Selection', () => {
    it('should select option on click', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.open();
      });
      act(() => {
        const optionProps = result.current.getOptionProps(mockOptions[1], 1);
        optionProps.onClick();
      });
      expect(result.current.value).toBe('blue');
      expect(result.current.selectedOption).toEqual({
        value: 'blue',
        label: 'Blue',
      });
    });

    it('should select highlighted option on Enter key', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.open();
      });
      act(() => {
        result.current.triggerProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
      });
      act(() => {
        result.current.triggerProps.onKeyDown({
          key: 'Enter',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.value).toBe('red');
    });

    it('should select highlighted option on Space key', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.open();
      });
      act(() => {
        result.current.triggerProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
      });
      act(() => {
        result.current.triggerProps.onKeyDown({
          key: ' ',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.value).toBe('red');
    });

    it('should call onChange when option selected', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useSelect({ options: mockOptions, onChange })
      );
      act(() => {
        result.current.selectOption('green');
      });
      expect(onChange).toHaveBeenCalledWith('green');
    });

    it('should close dropdown after selection', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.open();
      });
      act(() => {
        result.current.selectOption('blue');
      });
      expect(result.current.isOpen).toBe(false);
    });

    it('should not select disabled options', () => {
      const { result } = renderHook(() =>
        useSelect({ options: mockOptionsWithDisabled })
      );
      act(() => {
        result.current.open();
      });
      act(() => {
        const optionProps = result.current.getOptionProps(
          mockOptionsWithDisabled[1],
          1
        );
        optionProps.onClick();
      });
      expect(result.current.value).toBe('');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should highlight next option on ArrowDown', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.open();
      });
      act(() => {
        result.current.triggerProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.highlightedIndex).toBe(0);
    });

    it('should highlight previous option on ArrowUp', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.open();
      });
      act(() => {
        result.current.triggerProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
        result.current.triggerProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
      });
      act(() => {
        result.current.triggerProps.onKeyDown({
          key: 'ArrowUp',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.highlightedIndex).toBe(0);
    });

    it('should wrap to first option when at end', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.open();
      });
      act(() => {
        result.current.triggerProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
        result.current.triggerProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
        result.current.triggerProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
        result.current.triggerProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.highlightedIndex).toBe(0);
    });

    it('should wrap to last option when at start', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.open();
      });
      act(() => {
        result.current.triggerProps.onKeyDown({
          key: 'ArrowUp',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.highlightedIndex).toBe(2);
    });

    it('should jump to first option on Home key', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.open();
      });
      act(() => {
        result.current.triggerProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
        result.current.triggerProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
      });
      act(() => {
        result.current.triggerProps.onKeyDown({
          key: 'Home',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.highlightedIndex).toBe(0);
    });

    it('should jump to last option on End key', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.open();
      });
      act(() => {
        result.current.triggerProps.onKeyDown({
          key: 'End',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.highlightedIndex).toBe(2);
    });

    it('should skip disabled options during navigation', () => {
      const { result } = renderHook(() =>
        useSelect({ options: mockOptionsWithDisabled })
      );
      act(() => {
        result.current.open();
      });
      act(() => {
        result.current.triggerProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
        result.current.triggerProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.highlightedIndex).toBe(2);
    });

    it('should open dropdown on ArrowDown when closed', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.triggerProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
      });
      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('ARIA Attributes', () => {
    it('should set role="combobox" on trigger', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      expect(result.current.triggerProps.role).toBe('combobox');
    });

    it('should set aria-expanded based on open state', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      expect(result.current.triggerProps['aria-expanded']).toBe(false);
      act(() => {
        result.current.open();
      });
      expect(result.current.triggerProps['aria-expanded']).toBe(true);
    });

    it('should set aria-haspopup="listbox"', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      expect(result.current.triggerProps['aria-haspopup']).toBe('listbox');
    });

    it('should set aria-controls to listbox ID', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      expect(result.current.triggerProps['aria-controls']).toBe(
        result.current.listboxProps.id
      );
    });

    it('should set aria-activedescendant to highlighted option', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      act(() => {
        result.current.open();
      });
      act(() => {
        result.current.triggerProps.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as any);
      });
      const optionProps = result.current.getOptionProps(mockOptions[0], 0);
      expect(result.current.triggerProps['aria-activedescendant']).toBe(
        optionProps.id
      );
    });

    it('should set role="listbox" on listbox container', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      expect(result.current.listboxProps.role).toBe('listbox');
    });

    it('should set role="option" on each option', () => {
      const { result } = renderHook(() => useSelect({ options: mockOptions }));
      const optionProps = result.current.getOptionProps(mockOptions[0], 0);
      expect(optionProps.role).toBe('option');
    });

    it('should set aria-selected on selected option', () => {
      const { result } = renderHook(() =>
        useSelect({ options: mockOptions, defaultValue: 'blue' })
      );
      const optionProps = result.current.getOptionProps(mockOptions[1], 1);
      expect(optionProps['aria-selected']).toBe(true);
    });
  });

  describe('Controlled Mode', () => {
    it('should work in controlled mode', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useSelect({ options: mockOptions, value }),
        { initialProps: { value: 'red' } }
      );
      expect(result.current.value).toBe('red');
      rerender({ value: 'blue' });
      expect(result.current.value).toBe('blue');
    });

    it('should not update internal state in controlled mode', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useSelect({ options: mockOptions, value: 'red', onChange })
      );
      act(() => {
        result.current.selectOption('blue');
      });
      expect(onChange).toHaveBeenCalledWith('blue');
      expect(result.current.value).toBe('red');
    });
  });

  describe('Disabled State', () => {
    it('should set aria-disabled when disabled', () => {
      const { result } = renderHook(() =>
        useSelect({ options: mockOptions, disabled: true })
      );
      expect(result.current.triggerProps['aria-disabled']).toBe(true);
    });

    it('should not open when disabled', () => {
      const { result } = renderHook(() =>
        useSelect({ options: mockOptions, disabled: true })
      );
      act(() => {
        result.current.triggerProps.onClick();
      });
      expect(result.current.isOpen).toBe(false);
    });
  });
});
