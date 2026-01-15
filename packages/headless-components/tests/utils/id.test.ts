import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUniqueId } from '../../src/utils/id';

describe('id utility functions', () => {
  describe('useUniqueId', () => {
    it('should generate a unique ID', () => {
      const { result } = renderHook(() => useUniqueId());
      expect(result.current).toBeTruthy();
      expect(typeof result.current).toBe('string');
    });

    it('should use provided ID when given', () => {
      const { result } = renderHook(() => useUniqueId('custom-id'));
      expect(result.current).toBe('custom-id');
    });

    it('should generate unique IDs for multiple instances', () => {
      const { result: result1 } = renderHook(() => useUniqueId());
      const { result: result2 } = renderHook(() => useUniqueId());

      expect(result1.current).not.toBe(result2.current);
    });

    it('should use prefix when provided', () => {
      const { result } = renderHook(() => useUniqueId(undefined, 'button'));
      expect(result.current).toMatch(/^button-/);
    });

    it('should maintain stable ID across re-renders', () => {
      const { result, rerender } = renderHook(() => useUniqueId());
      const firstId = result.current;

      rerender();

      expect(result.current).toBe(firstId);
    });
  });
});
