import { z } from 'zod';

/**
 * OKLCH Color Token Schema
 * Validates color values in OKLCH color space
 *
 * @property l - Lightness (0-1)
 * @property c - Chroma (0-0.4 practical max for sRGB gamut)
 * @property h - Hue (0-360 degrees)
 */
export const ColorTokenSchema = z.object({
  l: z.number().min(0).max(1),
  c: z.number().min(0).max(0.4),
  h: z.number().min(0).max(360),
});

export type ColorToken = z.infer<typeof ColorTokenSchema>;

/**
 * Color Scale Schema
 * Validates 10-step Tailwind-compatible color scales
 *
 * Valid scale keys: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
 */
const scaleKeys = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const;

export const ColorScaleSchema = z.record(z.enum(scaleKeys), ColorTokenSchema);

export type ColorScale = z.infer<typeof ColorScaleSchema>;
