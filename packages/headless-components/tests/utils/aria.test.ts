import { describe, it, expect } from 'vitest';
import { generateAriaProps, mergeAriaProps } from '../../src/utils/aria';

describe('aria utility functions', () => {
  describe('generateAriaProps', () => {
    it('should generate basic ARIA props', () => {
      const props = generateAriaProps({
        role: 'button',
        disabled: false,
      });

      expect(props).toHaveProperty('role', 'button');
      expect(props).toHaveProperty('aria-disabled', false);
    });

    it('should include aria-label when provided', () => {
      const props = generateAriaProps({
        role: 'button',
        'aria-label': 'Click me',
      });

      expect(props['aria-label']).toBe('Click me');
    });

    it('should include aria-labelledby when provided', () => {
      const props = generateAriaProps({
        role: 'button',
        'aria-labelledby': 'label-id',
      });

      expect(props['aria-labelledby']).toBe('label-id');
    });

    it('should include aria-describedby when provided', () => {
      const props = generateAriaProps({
        role: 'button',
        'aria-describedby': 'desc-id',
      });

      expect(props['aria-describedby']).toBe('desc-id');
    });

    it('should set aria-disabled to true when disabled', () => {
      const props = generateAriaProps({
        role: 'button',
        disabled: true,
      });

      expect(props['aria-disabled']).toBe(true);
    });
  });

  describe('mergeAriaProps', () => {
    it('should merge multiple ARIA prop objects', () => {
      const base = { role: 'button' as const, 'aria-label': 'Base' };
      const override = { 'aria-label': 'Override', 'aria-disabled': true };

      const merged = mergeAriaProps(base, override);

      expect(merged.role).toBe('button');
      expect(merged['aria-label']).toBe('Override');
      expect(merged['aria-disabled']).toBe(true);
    });

    it('should handle empty objects', () => {
      const merged = mergeAriaProps({}, { role: 'button' as const });
      expect(merged.role).toBe('button');
    });
  });
});
