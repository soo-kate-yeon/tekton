import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAlert } from '../../src/hooks/useAlert';

describe('useAlert', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should default to info variant', () => {
      const { result } = renderHook(() => useAlert());
      expect(result.current.variant).toBe('info');
    });

    it('should accept custom variant', () => {
      const { result } = renderHook(() => useAlert({ variant: 'success' }));
      expect(result.current.variant).toBe('success');
    });

    it('should generate unique ID', () => {
      const { result: result1 } = renderHook(() => useAlert());
      const { result: result2 } = renderHook(() => useAlert());

      expect(result1.current.alertProps.id).toBeTruthy();
      expect(result2.current.alertProps.id).toBeTruthy();
      expect(result1.current.alertProps.id).not.toBe(result2.current.alertProps.id);
    });

    it('should use custom ID when provided', () => {
      const { result } = renderHook(() => useAlert({ id: 'custom-alert' }));
      expect(result.current.alertProps.id).toBe('custom-alert');
    });
  });

  describe('Variants', () => {
    it('should support info variant', () => {
      const { result } = renderHook(() => useAlert({ variant: 'info' }));
      expect(result.current.variant).toBe('info');
      expect(result.current.alertProps.role).toBe('status');
      expect(result.current.alertProps['aria-live']).toBe('polite');
    });

    it('should support success variant', () => {
      const { result } = renderHook(() => useAlert({ variant: 'success' }));
      expect(result.current.variant).toBe('success');
      expect(result.current.alertProps.role).toBe('status');
      expect(result.current.alertProps['aria-live']).toBe('polite');
    });

    it('should support warning variant', () => {
      const { result } = renderHook(() => useAlert({ variant: 'warning' }));
      expect(result.current.variant).toBe('warning');
      expect(result.current.alertProps.role).toBe('alert');
      expect(result.current.alertProps['aria-live']).toBe('assertive');
    });

    it('should support error variant', () => {
      const { result } = renderHook(() => useAlert({ variant: 'error' }));
      expect(result.current.variant).toBe('error');
      expect(result.current.alertProps.role).toBe('alert');
      expect(result.current.alertProps['aria-live']).toBe('assertive');
    });
  });

  describe('Dismissible', () => {
    it('should call onDismiss when dismiss button clicked', () => {
      const onDismiss = vi.fn();
      const { result } = renderHook(() => useAlert({ dismissible: true, onDismiss }));

      act(() => {
        result.current.dismissButtonProps.onClick();
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('should call dismiss method', () => {
      const onDismiss = vi.fn();
      const { result } = renderHook(() => useAlert({ onDismiss }));

      act(() => {
        result.current.dismiss();
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('should have aria-label on dismiss button', () => {
      const { result } = renderHook(() => useAlert({ dismissible: true }));
      expect(result.current.dismissButtonProps['aria-label']).toBe('Dismiss alert');
    });
  });

  describe('ARIA Attributes', () => {
    it('should set role="alert" for error variant', () => {
      const { result } = renderHook(() => useAlert({ variant: 'error' }));
      expect(result.current.alertProps.role).toBe('alert');
    });

    it('should set role="alert" for warning variant', () => {
      const { result } = renderHook(() => useAlert({ variant: 'warning' }));
      expect(result.current.alertProps.role).toBe('alert');
    });

    it('should set role="status" for info variant', () => {
      const { result } = renderHook(() => useAlert({ variant: 'info' }));
      expect(result.current.alertProps.role).toBe('status');
    });

    it('should set role="status" for success variant', () => {
      const { result } = renderHook(() => useAlert({ variant: 'success' }));
      expect(result.current.alertProps.role).toBe('status');
    });

    it('should set aria-live="assertive" for error', () => {
      const { result } = renderHook(() => useAlert({ variant: 'error' }));
      expect(result.current.alertProps['aria-live']).toBe('assertive');
    });

    it('should set aria-live="assertive" for warning', () => {
      const { result } = renderHook(() => useAlert({ variant: 'warning' }));
      expect(result.current.alertProps['aria-live']).toBe('assertive');
    });

    it('should set aria-live="polite" for info', () => {
      const { result } = renderHook(() => useAlert({ variant: 'info' }));
      expect(result.current.alertProps['aria-live']).toBe('polite');
    });

    it('should set aria-live="polite" for success', () => {
      const { result } = renderHook(() => useAlert({ variant: 'success' }));
      expect(result.current.alertProps['aria-live']).toBe('polite');
    });

    it('should set aria-atomic=true', () => {
      const { result } = renderHook(() => useAlert());
      expect(result.current.alertProps['aria-atomic']).toBe(true);
    });

    it('should include aria-label when provided', () => {
      const { result } = renderHook(() => useAlert({ ariaLabel: 'Custom alert' }));
      expect(result.current.alertProps['aria-label']).toBe('Custom alert');
    });

    it('should include additional aria attributes', () => {
      const { result } = renderHook(() =>
        useAlert({ ariaAttributes: { 'aria-describedby': 'desc-1' } })
      );
      expect(result.current.alertProps['aria-describedby']).toBe('desc-1');
    });
  });

  describe('Programmatic Control', () => {
    it('should allow programmatic dismissal', () => {
      const onDismiss = vi.fn();
      const { result } = renderHook(() => useAlert({ onDismiss }));

      act(() => {
        result.current.dismiss();
      });

      expect(onDismiss).toHaveBeenCalled();
    });
  });
});
