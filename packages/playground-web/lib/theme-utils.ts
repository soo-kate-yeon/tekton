/** OKLCH color format */
export interface OKLCHColorV2 {
  l: number; // 0-1
  c: number; // 0-0.5
  h: number; // 0-360
}

/**
 * Convert OKLCH color object to CSS string
 */
export function oklchToCSSV2(color: OKLCHColorV2): string {
  const l = Math.max(0, Math.min(1, color.l));
  const c = Math.max(0, Math.min(0.5, color.c));
  const h = ((color.h % 360) + 360) % 360;
  return `oklch(${l} ${c} ${h})`;
}
