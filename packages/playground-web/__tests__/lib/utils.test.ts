/**
 * Utils Tests
 * SPEC-PLAYGROUND-001 Milestone 7: Integration Testing
 *
 * Test Coverage:
 * - cn() - Tailwind class name merging
 * - hexToRgb() - Hex to RGB conversion
 * - debounce() - Function debouncing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cn, hexToRgb, debounce } from '@/lib/utils';

describe('Utils', () => {
  describe('cn() - className merger', () => {
    it('should merge simple class names', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('should handle conditional classes', () => {
      const shouldHide = false;
      const result = cn('text-base', shouldHide && 'hidden', 'font-bold');
      expect(result).toBe('text-base font-bold');
    });

    it('should merge Tailwind conflicting classes', () => {
      const result = cn('px-2', 'px-4');
      expect(result).toBe('px-4'); // Last class wins
    });

    it('should handle empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle array inputs', () => {
      const result = cn(['text-sm', 'font-medium'], 'text-gray-900');
      expect(result).toBe('text-sm font-medium text-gray-900');
    });
  });

  describe('hexToRgb() - hex color converter', () => {
    it('should convert valid hex to RGB', () => {
      const result = hexToRgb('#ff0000');
      expect(result).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should convert hex without # prefix', () => {
      const result = hexToRgb('00ff00');
      expect(result).toEqual({ r: 0, g: 255, b: 0 });
    });

    it('should handle lowercase hex', () => {
      const result = hexToRgb('#0000ff');
      expect(result).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('should handle uppercase hex', () => {
      const result = hexToRgb('#ABCDEF');
      expect(result).toEqual({ r: 171, g: 205, b: 239 });
    });

    it('should return null for invalid hex', () => {
      expect(hexToRgb('invalid')).toBeNull();
      expect(hexToRgb('#gg0000')).toBeNull();
      expect(hexToRgb('#ff00')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(hexToRgb('')).toBeNull();
    });
  });

  describe('debounce() - function debouncer', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should debounce function calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments correctly', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2');

      vi.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should reset timer on multiple calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      vi.advanceTimersByTime(50);
      debouncedFn();
      vi.advanceTimersByTime(50);

      // Should not have been called yet (timer reset)
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);

      // Now it should be called
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should handle wait time of 0', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 0);

      debouncedFn();

      vi.advanceTimersByTime(0);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
