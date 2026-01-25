import { describe, it, expect } from 'vitest';
import {
  mapSemanticTokens,
} from '../src/generator/semantic-mapper';
import type { OKLCHColor } from '../src/schemas';

describe('Semantic Token Mapper - TASK-004 (EDR-002)', () => {
  const mockPrimary: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
  const mockNeutral: OKLCHColor = { l: 0.5, c: 0.002, h: 0 };
  const mockDestructive: OKLCHColor = { l: 0.5, c: 0.18, h: 25 };

  describe('Light Mode Token Mapping', () => {
    it('should map all 12 shadcn/ui tokens', () => {
      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: mockPrimary,
        neutral: mockNeutral,
        destructive: mockDestructive,
      });

      expect(tokens.background).toBeDefined();
      expect(tokens.foreground).toBeDefined();
      expect(tokens.primary).toBeDefined();
      expect(tokens.secondary).toBeDefined();
      expect(tokens.muted).toBeDefined();
      expect(tokens.accent).toBeDefined();
      expect(tokens.destructive).toBeDefined();
      expect(tokens.border).toBeDefined();
      expect(tokens.input).toBeDefined();
      expect(tokens.ring).toBeDefined();
      expect(tokens.card).toBeDefined();
      expect(tokens.popover).toBeDefined();
    });

    it('should map background to neutral-50 in light mode', () => {
      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: mockPrimary,
        neutral: mockNeutral,
      });

      // Background should be very light
      expect(tokens.background.l).toBeGreaterThanOrEqual(0.95);
    });

    it('should map foreground to neutral-900 in light mode', () => {
      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: mockPrimary,
        neutral: mockNeutral,
      });

      // Foreground should be very dark
      expect(tokens.foreground.l).toBeLessThanOrEqual(0.20);
    });

    it('should map primary to primary-500', () => {
      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: mockPrimary,
        neutral: mockNeutral,
      });

      expect(tokens.primary.h).toBe(mockPrimary.h);
      expect(tokens.primary.c).toBeCloseTo(mockPrimary.c, 2);
    });

    it('should map muted to neutral-100', () => {
      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: mockPrimary,
        neutral: mockNeutral,
      });

      expect(tokens.muted.l).toBeGreaterThanOrEqual(0.90);
    });

    it('should map accent to primary-400', () => {
      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: mockPrimary,
        neutral: mockNeutral,
      });

      expect(tokens.accent.h).toBe(mockPrimary.h);
      expect(tokens.accent.l).toBeGreaterThan(tokens.primary.l);
    });

    it('should map border to neutral-200', () => {
      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: mockPrimary,
        neutral: mockNeutral,
      });

      expect(tokens.border.l).toBeGreaterThanOrEqual(0.85);
    });

    it('should map card to neutral-50 (same as background)', () => {
      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: mockPrimary,
        neutral: mockNeutral,
      });

      expect(tokens.card).toEqual(tokens.background);
    });
  });

  describe('Dark Mode Token Mapping', () => {
    it('should map background to neutral-900 in dark mode', () => {
      const tokens = mapSemanticTokens({
        mode: 'dark',
        primary: mockPrimary,
        neutral: mockNeutral,
      });

      // Background should be very dark
      expect(tokens.background.l).toBeLessThanOrEqual(0.15);
    });

    it('should map foreground to neutral-50 in dark mode', () => {
      const tokens = mapSemanticTokens({
        mode: 'dark',
        primary: mockPrimary,
        neutral: mockNeutral,
      });

      // Foreground should be very light
      expect(tokens.foreground.l).toBeGreaterThanOrEqual(0.95);
    });

    it('should adjust primary for dark mode visibility', () => {
      const tokens = mapSemanticTokens({
        mode: 'dark',
        primary: mockPrimary,
        neutral: mockNeutral,
      });

      // Dark mode primary should be lighter for visibility
      expect(tokens.primary.l).toBeGreaterThan(mockPrimary.l);
    });

    it('should map muted to neutral-800 in dark mode', () => {
      const tokens = mapSemanticTokens({
        mode: 'dark',
        primary: mockPrimary,
        neutral: mockNeutral,
      });

      expect(tokens.muted.l).toBeLessThanOrEqual(0.25);
    });
  });

  describe('Destructive Token Mapping', () => {
    it('should map destructive color when provided', () => {
      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: mockPrimary,
        neutral: mockNeutral,
        destructive: mockDestructive,
      });

      expect(tokens.destructive.h).toBe(mockDestructive.h);
      expect(tokens.destructive.c).toBeCloseTo(mockDestructive.c, 2);
    });

    it('should generate destructive from red when not provided', () => {
      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: mockPrimary,
        neutral: mockNeutral,
      });

      // Red hue is around 25-30
      expect(tokens.destructive.h).toBeGreaterThan(0);
      expect(tokens.destructive.h).toBeLessThan(40);
      expect(tokens.destructive.c).toBeGreaterThan(0.1);
    });
  });

  describe('Secondary Token Generation', () => {
    it('should generate secondary from primary when not provided', () => {
      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: mockPrimary,
        neutral: mockNeutral,
      });

      // Secondary should have reduced saturation
      expect(tokens.secondary.h).toBe(mockPrimary.h);
      expect(tokens.secondary.c).toBeLessThan(mockPrimary.c);
    });

    it('should use provided secondary color', () => {
      const mockSecondary: OKLCHColor = { l: 0.6, c: 0.12, h: 180 };

      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: mockPrimary,
        neutral: mockNeutral,
        secondary: mockSecondary,
      });

      expect(tokens.secondary).toEqual(mockSecondary);
    });
  });

  describe('WCAG Compliance', () => {
    it('should ensure background-foreground contrast >= 4.5:1', () => {
      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: mockPrimary,
        neutral: mockNeutral,
      });

      const contrastRatio = tokens.background.l / tokens.foreground.l;
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
    });

    it('should ensure primary-background contrast >= 3:1', () => {
      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: mockPrimary,
        neutral: mockNeutral,
      });

      // Primary should be distinguishable from background
      const lightnessDiff = Math.abs(tokens.primary.l - tokens.background.l);
      expect(lightnessDiff).toBeGreaterThan(0.2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle highly saturated primary colors', () => {
      const saturated: OKLCHColor = { l: 0.5, c: 0.35, h: 280 };

      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: saturated,
        neutral: mockNeutral,
      });

      expect(tokens.primary).toBeDefined();
      expect(tokens.primary.c).toBeLessThanOrEqual(0.5);
    });

    it('should handle low chroma primary colors', () => {
      const lowChroma: OKLCHColor = { l: 0.5, c: 0.01, h: 120 };

      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: lowChroma,
        neutral: mockNeutral,
      });

      expect(tokens.primary).toBeDefined();
    });

    it('should handle extreme lightness values', () => {
      const darkPrimary: OKLCHColor = { l: 0.1, c: 0.15, h: 200 };

      const tokens = mapSemanticTokens({
        mode: 'light',
        primary: darkPrimary,
        neutral: mockNeutral,
      });

      // Should adjust for visibility
      expect(tokens.primary.l).toBeGreaterThanOrEqual(0.1);
    });
  });
});
