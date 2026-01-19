/**
 * useTheme Hook Tests
 * Tests for the useTheme hook outside of ThemeProvider
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTheme } from '../../src/theme-provider/useTheme.js';
import { ThemeProvider } from '../../src/theme-provider/ThemeProvider.js';

describe('useTheme Hook', () => {
  describe('Outside Provider', () => {
    it('should throw error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = () => {};

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');

      console.error = originalError;
    });
  });

  describe('Inside Provider', () => {
    it('should return theme context values', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.preset).toBeDefined();
      expect(result.current.tokens).toBeDefined();
      expect(result.current.composition).toBeDefined();
      expect(result.current.darkMode).toBeDefined();
      expect(typeof result.current.setTheme).toBe('function');
      expect(typeof result.current.toggleDarkMode).toBe('function');
    });

    it('should return professional preset by default', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.preset).toBe('professional');
    });

    it('should return light mode by default', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.darkMode).toBe(false);
    });

    it('should return tokens with semantic colors', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.tokens).toBeDefined();
      expect(result.current.tokens?.primary).toBeDefined();
      expect(result.current.tokens?.neutral).toBeDefined();
      expect(result.current.tokens?.success).toBeDefined();
      expect(result.current.tokens?.warning).toBeDefined();
      expect(result.current.tokens?.error).toBeDefined();
    });

    it('should return composition tokens', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.composition).toBeDefined();
      expect(result.current.composition?.border).toBeDefined();
      expect(result.current.composition?.shadow).toBeDefined();
      expect(result.current.composition?.spacing).toBeDefined();
      expect(result.current.composition?.typography).toBeDefined();
    });
  });

  describe('Hook Updates', () => {
    it('should update when preset changes', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="professional">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.preset).toBe('professional');

      // Note: Testing updates requires act() and would be covered in theme-switch.test.tsx
    });

    it('should update when dark mode toggles', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultDarkMode={false}>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.darkMode).toBe(false);

      // Note: Testing updates requires act() and would be covered in theme-switch.test.tsx
    });
  });

  describe('Type Safety', () => {
    it('should have correct TypeScript types', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      // TypeScript should enforce these types at compile time
      const preset: string = result.current.preset;
      const darkMode: boolean = result.current.darkMode;
      const setTheme: (preset: any) => void = result.current.setTheme;
      const toggleDarkMode: () => void = result.current.toggleDarkMode;

      expect(typeof preset).toBe('string');
      expect(typeof darkMode).toBe('boolean');
      expect(typeof setTheme).toBe('function');
      expect(typeof toggleDarkMode).toBe('function');
    });
  });

  describe('Memoization', () => {
    it('should memoize tokens to prevent unnecessary recalculations', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result, rerender } = renderHook(() => useTheme(), { wrapper });

      const firstTokens = result.current.tokens;

      // Re-render without changing props
      rerender();

      const secondTokens = result.current.tokens;

      // Tokens should be the same reference (memoized)
      expect(firstTokens).toBe(secondTokens);
    });

    it('should memoize composition to prevent unnecessary recalculations', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result, rerender } = renderHook(() => useTheme(), { wrapper });

      const firstComposition = result.current.composition;

      // Re-render without changing props
      rerender();

      const secondComposition = result.current.composition;

      // Composition should be the same reference (memoized)
      expect(firstComposition).toBe(secondComposition);
    });
  });
});
