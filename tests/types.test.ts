import { describe, it, expectTypeOf } from 'vitest';
import type {
  OKLCHColor,
  RGBColor,
  ColorScale,
  TokenDefinition,
  AccessibilityCheck,
  ComponentPreset,
} from '../src/schemas';

describe('TypeScript Type Definitions - TASK-004', () => {
  it('should define OKLCHColor type correctly', () => {
    expectTypeOf<OKLCHColor>().toMatchTypeOf<{
      l: number;
      c: number;
      h: number;
    }>();
  });

  it('should define RGBColor type correctly', () => {
    expectTypeOf<RGBColor>().toMatchTypeOf<{
      r: number;
      g: number;
      b: number;
    }>();
  });

  it('should define ColorScale as record of OKLCH colors', () => {
    expectTypeOf<ColorScale>().toMatchTypeOf<Record<string, OKLCHColor>>();
  });

  it('should define TokenDefinition with required and optional fields', () => {
    expectTypeOf<TokenDefinition>().toMatchTypeOf<{
      id: string;
      name: string;
      value: OKLCHColor;
      scale?: ColorScale;
      metadata?: Record<string, unknown>;
    }>();
  });

  it('should define AccessibilityCheck type correctly', () => {
    expectTypeOf<AccessibilityCheck>().toMatchTypeOf<{
      contrastRatio: number;
      wcagLevel: 'AA' | 'AAA';
      passed: boolean;
      foreground?: RGBColor;
      background?: RGBColor;
    }>();
  });

  it('should define ComponentPreset type correctly', () => {
    expectTypeOf<ComponentPreset>().toMatchTypeOf<{
      name: string;
      states: Record<string, OKLCHColor>;
      accessibility?: AccessibilityCheck[];
    }>();
  });
});
