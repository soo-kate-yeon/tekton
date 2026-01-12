import type { OKLCHColor, RGBColor } from '@tekton/preset';

/**
 * Convert OKLCH to linear RGB
 * Based on OKLab color space conversion
 */
function oklchToLinearRgb(oklch: OKLCHColor): { r: number; g: number; b: number } {
  const { l, c, h } = oklch;

  // Convert OKLCH to OKLab
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // OKLab to linear RGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  return {
    r: +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    g: -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    b: -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3,
  };
}

/**
 * Convert linear RGB to sRGB (gamma correction)
 */
function linearToSrgb(linear: number): number {
  const abs = Math.abs(linear);
  if (abs <= 0.0031308) {
    return linear * 12.92;
  }
  return (Math.sign(linear) || 1) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
}

/**
 * Convert sRGB to linear RGB
 */
function srgbToLinear(srgb: number): number {
  const abs = Math.abs(srgb);
  if (abs <= 0.04045) {
    return srgb / 12.92;
  }
  return (Math.sign(srgb) || 1) * Math.pow((abs + 0.055) / 1.055, 2.4);
}

/**
 * Clamp value between 0 and 1
 */
function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Convert OKLCH to RGB
 */
export function oklchToRgb(oklch: OKLCHColor): RGBColor {
  const linear = oklchToLinearRgb(oklch);

  const r = Math.round(clamp01(linearToSrgb(linear.r)) * 255);
  const g = Math.round(clamp01(linearToSrgb(linear.g)) * 255);
  const b = Math.round(clamp01(linearToSrgb(linear.b)) * 255);

  return { r, g, b };
}

/**
 * Convert RGB to linear RGB then to OKLab
 */
function rgbToOklab(rgb: RGBColor): { l: number; a: number; b: number } {
  const r = srgbToLinear(rgb.r / 255);
  const g = srgbToLinear(rgb.g / 255);
  const b = srgbToLinear(rgb.b / 255);

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    l: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  };
}

/**
 * Convert RGB to OKLCH
 */
export function rgbToOklch(rgb: RGBColor): OKLCHColor {
  const { l, a, b } = rgbToOklab(rgb);

  const c = Math.sqrt(a * a + b * b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;

  // Normalize hue to 0-360
  if (h < 0) {h += 360;}

  return { l, c, h };
}

/**
 * Convert OKLCH to hex color string
 */
export function oklchToHex(oklch: OKLCHColor): string {
  const rgb = oklchToRgb(oklch);
  const r = rgb.r.toString(16).padStart(2, '0');
  const g = rgb.g.toString(16).padStart(2, '0');
  const b = rgb.b.toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
}

/**
 * Convert hex color string to OKLCH
 */
export function hexToOklch(hex: string): OKLCHColor {
  // Remove hash if present
  const cleanHex = hex.replace('#', '');

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return rgbToOklch({ r, g, b });
}
