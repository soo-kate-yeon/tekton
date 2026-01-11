import { describe, it, expect } from 'vitest';
import { generateLightnessScale } from '../src/scale-generator';

describe('Lightness Scale Generator - TASK-007', () => {
  it('should generate 11-step scale from base color', () => {
    const base = { l: 0.5, c: 0.15, h: 220 };
    const scale = generateLightnessScale(base);

    expect(Object.keys(scale)).toHaveLength(11);
    expect(scale['50']).toBeDefined();
    expect(scale['100']).toBeDefined();
    expect(scale['500']).toBeDefined();
    expect(scale['900']).toBeDefined();
    expect(scale['950']).toBeDefined();
  });

  it('should have 500 match the base color', () => {
    const base = { l: 0.5, c: 0.15, h: 220 };
    const scale = generateLightnessScale(base);

    expect(scale['500'].l).toBeCloseTo(base.l, 2);
    expect(scale['500'].c).toBeCloseTo(base.c, 2);
    expect(scale['500'].h).toBeCloseTo(base.h, 2);
  });

  it('should generate lighter tints (50-400)', () => {
    const base = { l: 0.5, c: 0.15, h: 220 };
    const scale = generateLightnessScale(base);

    expect(scale['50'].l).toBeGreaterThan(scale['100'].l);
    expect(scale['100'].l).toBeGreaterThan(scale['200'].l);
    expect(scale['200'].l).toBeGreaterThan(scale['300'].l);
    expect(scale['300'].l).toBeGreaterThan(scale['400'].l);
    expect(scale['400'].l).toBeGreaterThan(scale['500'].l);
  });

  it('should generate darker shades (600-950)', () => {
    const base = { l: 0.5, c: 0.15, h: 220 };
    const scale = generateLightnessScale(base);

    expect(scale['500'].l).toBeGreaterThan(scale['600'].l);
    expect(scale['600'].l).toBeGreaterThan(scale['700'].l);
    expect(scale['700'].l).toBeGreaterThan(scale['800'].l);
    expect(scale['800'].l).toBeGreaterThan(scale['900'].l);
    expect(scale['900'].l).toBeGreaterThan(scale['950'].l);
  });

  it('should preserve hue across scale', () => {
    const base = { l: 0.5, c: 0.15, h: 220 };
    const scale = generateLightnessScale(base);

    Object.values(scale).forEach((color) => {
      expect(color.h).toBeCloseTo(base.h, 1);
    });
  });

  it('should maintain reasonable chroma values', () => {
    const base = { l: 0.5, c: 0.15, h: 220 };
    const scale = generateLightnessScale(base);

    Object.values(scale).forEach((color) => {
      expect(color.c).toBeGreaterThanOrEqual(0);
      expect(color.c).toBeLessThanOrEqual(0.5);
    });
  });

  it('should handle low chroma colors', () => {
    const gray = { l: 0.5, c: 0.01, h: 0 };
    const scale = generateLightnessScale(gray);

    expect(Object.keys(scale)).toHaveLength(11);
    Object.values(scale).forEach((color) => {
      expect(color.c).toBeLessThan(0.05);
    });
  });

  it('should handle very light base colors', () => {
    const light = { l: 0.9, c: 0.1, h: 180 };
    const scale = generateLightnessScale(light);

    expect(scale['50'].l).toBeLessThanOrEqual(1);
    expect(scale['950'].l).toBeGreaterThanOrEqual(0);
  });

  it('should handle very dark base colors', () => {
    const dark = { l: 0.2, c: 0.1, h: 180 };
    const scale = generateLightnessScale(dark);

    expect(scale['50'].l).toBeLessThanOrEqual(1);
    expect(scale['950'].l).toBeGreaterThanOrEqual(0);
  });
});
