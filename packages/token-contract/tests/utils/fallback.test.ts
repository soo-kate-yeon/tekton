/**
 * Fallback Handling Tests
 * Tests for missing token fallback with warnings
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getTokenWithFallback,
  getFallbackColor,
  logMissingTokenWarning,
} from '../../src/utils/fallback.js';
import type { SemanticToken } from '../../src/schemas/index.js';

describe('Fallback Handling', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  const mockTokens: SemanticToken = {
    primary: {
      '50': 'oklch(0.95 0.05 220)',
      '100': 'oklch(0.90 0.08 220)',
      '200': 'oklch(0.85 0.10 220)',
      '300': 'oklch(0.80 0.12 220)',
      '400': 'oklch(0.70 0.14 220)',
      '500': 'oklch(0.60 0.15 220)',
      '600': 'oklch(0.50 0.15 220)',
      '700': 'oklch(0.40 0.14 220)',
      '800': 'oklch(0.30 0.12 220)',
      '900': 'oklch(0.20 0.10 220)',
    },
    neutral: {
      '50': 'oklch(0.98 0.01 220)',
      '100': 'oklch(0.95 0.01 220)',
      '200': 'oklch(0.90 0.01 220)',
      '300': 'oklch(0.85 0.01 220)',
      '400': 'oklch(0.70 0.01 220)',
      '500': 'oklch(0.60 0.01 220)',
      '600': 'oklch(0.50 0.01 220)',
      '700': 'oklch(0.40 0.01 220)',
      '800': 'oklch(0.30 0.01 220)',
      '900': 'oklch(0.20 0.01 220)',
    },
    success: {
      '50': 'oklch(0.95 0.05 140)',
      '100': 'oklch(0.90 0.08 140)',
      '200': 'oklch(0.85 0.10 140)',
      '300': 'oklch(0.80 0.12 140)',
      '400': 'oklch(0.70 0.14 140)',
      '500': 'oklch(0.60 0.15 140)',
      '600': 'oklch(0.50 0.15 140)',
      '700': 'oklch(0.40 0.14 140)',
      '800': 'oklch(0.30 0.12 140)',
      '900': 'oklch(0.20 0.10 140)',
    },
    warning: {
      '50': 'oklch(0.95 0.05 60)',
      '100': 'oklch(0.90 0.08 60)',
      '200': 'oklch(0.85 0.10 60)',
      '300': 'oklch(0.80 0.12 60)',
      '400': 'oklch(0.70 0.14 60)',
      '500': 'oklch(0.60 0.15 60)',
      '600': 'oklch(0.50 0.15 60)',
      '700': 'oklch(0.40 0.14 60)',
      '800': 'oklch(0.30 0.12 60)',
      '900': 'oklch(0.20 0.10 60)',
    },
    error: {
      '50': 'oklch(0.95 0.05 20)',
      '100': 'oklch(0.90 0.08 20)',
      '200': 'oklch(0.85 0.10 20)',
      '300': 'oklch(0.80 0.12 20)',
      '400': 'oklch(0.70 0.14 20)',
      '500': 'oklch(0.60 0.15 20)',
      '600': 'oklch(0.50 0.15 20)',
      '700': 'oklch(0.40 0.14 20)',
      '800': 'oklch(0.30 0.12 20)',
      '900': 'oklch(0.20 0.10 20)',
    },
  };

  describe('getTokenWithFallback', () => {
    it('should return existing token value', () => {
      const value = getTokenWithFallback(mockTokens, 'primary', '500');
      expect(value).toBe('oklch(0.60 0.15 220)');
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should return fallback for missing semantic token', () => {
      const value = getTokenWithFallback(mockTokens, 'accent' as any, '500');
      expect(value).toBe('oklch(0.60 0.01 220)'); // Fallback to neutral-500
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing token: accent-500')
      );
    });

    it('should return fallback for missing step', () => {
      const value = getTokenWithFallback(mockTokens, 'primary', '950' as any);
      expect(value).toBe('oklch(0.60 0.15 220)'); // Fallback to primary-500
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing token: primary-950')
      );
    });

    it('should handle completely missing token gracefully', () => {
      const value = getTokenWithFallback({} as any, 'primary', '500');
      expect(value).toBe('oklch(0.5 0.1 220)'); // Default fallback
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should use custom fallback when provided', () => {
      const value = getTokenWithFallback(
        mockTokens,
        'missing' as any,
        '500',
        'oklch(1 0 0)'
      );
      expect(value).toBe('oklch(1 0 0)');
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });

  describe('getFallbackColor', () => {
    it('should return neutral-500 as default fallback', () => {
      const fallback = getFallbackColor(mockTokens);
      expect(fallback).toBe('oklch(0.60 0.01 220)');
    });

    it('should return primary-500 if neutral missing', () => {
      const partialTokens = { ...mockTokens };
      delete (partialTokens as any).neutral;

      const fallback = getFallbackColor(partialTokens);
      expect(fallback).toBe('oklch(0.60 0.15 220)'); // primary-500
    });

    it('should return hardcoded fallback if all missing', () => {
      const fallback = getFallbackColor({} as any);
      expect(fallback).toBe('oklch(0.5 0.1 220)');
    });

    it('should prefer step 500 for fallback', () => {
      const tokens: SemanticToken = {
        ...mockTokens,
        neutral: {
          '400': 'oklch(0.70 0.01 220)',
          '600': 'oklch(0.50 0.01 220)',
          '500': 'oklch(0.60 0.01 220)',
        } as any,
      };

      const fallback = getFallbackColor(tokens);
      expect(fallback).toBe('oklch(0.60 0.01 220)'); // neutral-500
    });
  });

  describe('logMissingTokenWarning', () => {
    it('should log warning with token information', () => {
      logMissingTokenWarning('primary', '500');

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing token: primary-500')
      );
    });

    it('should include fallback information in warning', () => {
      logMissingTokenWarning('accent', '500', 'oklch(0.6 0.1 220)');

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing token: accent-500')
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('oklch(0.6 0.1 220)')
      );
    });

    it('should be callable multiple times', () => {
      logMissingTokenWarning('token1', '100');
      logMissingTokenWarning('token2', '200');
      logMissingTokenWarning('token3', '300');

      expect(consoleWarnSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null tokens gracefully', () => {
      const value = getTokenWithFallback(null as any, 'primary', '500');
      expect(value).toBeDefined();
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should handle undefined tokens gracefully', () => {
      const value = getTokenWithFallback(undefined as any, 'primary', '500');
      expect(value).toBeDefined();
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should handle empty string token name', () => {
      const value = getTokenWithFallback(mockTokens, '' as any, '500');
      expect(value).toBeDefined();
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should handle empty string step', () => {
      const value = getTokenWithFallback(mockTokens, 'primary', '' as any);
      expect(value).toBeDefined();
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });
});
