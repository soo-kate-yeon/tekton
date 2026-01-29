/**
 * @tekton/core - Touch Target Utilities
 * Validation and application utilities for accessible touch targets
 * [SPEC-LAYOUT-004] [MILESTONE-5]
 *
 * @see https://developer.apple.com/design/human-interface-guidelines/layout
 * @see https://m3.material.io/foundations/accessible-design/accessibility-basics
 * @see https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
 */

import type { HitSlopConfig } from './types.js';
import { TOUCH_TARGET } from './types.js';

/**
 * Accessibility guideline standards for touch targets
 */
export type AccessibilityGuideline = 'apple-hig' | 'material' | 'wcag';

/**
 * Touch target element interface for type safety
 */
export interface TouchTargetElement {
  width: number;
  height: number;
}

// ============================================================================
// Core Functions (Required)
// ============================================================================

/**
 * Validate if touch target meets minimum size requirements
 *
 * @param size - Touch target size in points or pixels
 * @param scale - Screen scale factor (1x, 2x, 3x, 4x). Defaults to 1.
 * @returns true if size >= minimum, false otherwise
 *
 * @example
 * ```typescript
 * validateTouchTarget(44);           // true (meets 44pt minimum)
 * validateTouchTarget(40);           // false (below minimum)
 * validateTouchTarget(88, 2);        // true (@2x scale)
 * validateTouchTarget(80, 2);        // false (@2x scale, needs 88px)
 * ```
 */
export function validateTouchTarget(size: number, scale?: number): boolean {
  const minSize = getMinTouchTargetForScale(scale ?? 1);
  return size >= minSize;
}

/**
 * Apply minimum touch target size to an element
 *
 * @param element - Element object to modify (with width/height properties)
 * @param minSize - Minimum size in points. Defaults to TOUCH_TARGET.MIN_SIZE_PT (44).
 * @returns Modified element with minimum size applied
 *
 * @example
 * ```typescript
 * const button = { width: 32, height: 32 };
 * const accessible = applyMinTouchTarget(button);
 * console.log(accessible.width);  // 44
 * console.log(accessible.height); // 44
 * ```
 */
export function applyMinTouchTarget(
  element: TouchTargetElement,
  minSize?: number
): TouchTargetElement {
  const min = minSize ?? TOUCH_TARGET.MIN_SIZE_PT;

  return {
    width: Math.max(element.width, min),
    height: Math.max(element.height, min),
  };
}

/**
 * Calculate hit slop to extend touch area to minimum size
 *
 * @param currentSize - Current visual size of element (width or height)
 * @param minSize - Minimum target size. Defaults to TOUCH_TARGET.MIN_SIZE_PT (44).
 * @returns HitSlopConfig with top, bottom, left, right values
 *
 * @example
 * ```typescript
 * const hitSlop = getHitSlop(24);  // Element is 24pt, needs to be 44pt
 * console.log(hitSlop);
 * // { top: 10, bottom: 10, left: 10, right: 10 }
 * // Total: 24 + 10 + 10 = 44pt
 *
 * const noSlop = getHitSlop(48);   // Already meets minimum
 * console.log(noSlop);
 * // { top: 0, bottom: 0, left: 0, right: 0 }
 * ```
 */
export function getHitSlop(currentSize: number, minSize?: number): HitSlopConfig {
  const min = minSize ?? TOUCH_TARGET.MIN_SIZE_PT;
  const deficit = min - currentSize;

  if (deficit <= 0) {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  const slop = Math.ceil(deficit / 2);

  return {
    top: slop,
    bottom: slop,
    left: slop,
    right: slop,
  };
}

// ============================================================================
// Helper Functions (Recommended)
// ============================================================================

/**
 * Get minimum touch target size for screen scale
 *
 * @param scale - Screen scale factor (1, 2, 3, 4)
 * @returns Minimum touch target size in pixels
 *
 * @example
 * ```typescript
 * getMinTouchTargetForScale(1);  // 44px
 * getMinTouchTargetForScale(2);  // 88px
 * getMinTouchTargetForScale(3);  // 132px
 * ```
 */
export function getMinTouchTargetForScale(scale: number): number {
  switch (scale) {
    case 2:
      return TOUCH_TARGET.MIN_SIZE_2X;
    case 3:
      return TOUCH_TARGET.MIN_SIZE_3X;
    case 4:
      return TOUCH_TARGET.MIN_SIZE_4X;
    default:
      return TOUCH_TARGET.MIN_SIZE_PT;
  }
}

/**
 * Check if touch target meets accessibility guidelines
 *
 * @param width - Element width in points
 * @param height - Element height in points
 * @param guideline - Accessibility guideline ('apple-hig' | 'material' | 'wcag')
 * @returns true if meets guideline, false otherwise
 *
 * @example
 * ```typescript
 * isAccessibleTouchTarget(44, 44, 'apple-hig');     // true
 * isAccessibleTouchTarget(48, 48, 'material');      // true
 * isAccessibleTouchTarget(40, 40, 'apple-hig');     // false
 * ```
 */
export function isAccessibleTouchTarget(
  width: number,
  height: number,
  guideline: AccessibilityGuideline = 'apple-hig'
): boolean {
  const minSize = guideline === 'material' ? 48 : 44;
  return width >= minSize && height >= minSize;
}

/**
 * Warn in development if touch target is below minimum
 * Only logs in development mode
 *
 * @param size - Touch target size
 * @param elementId - Optional element identifier for debugging
 *
 * @example
 * ```typescript
 * warnIfBelowMinimum(32, 'submit-button');
 * // Console warning: "Touch target 'submit-button' is 32pt,
 * // below minimum 44pt. Consider increasing size or adding hitSlop."
 * ```
 */
export function warnIfBelowMinimum(size: number, elementId?: string): void {
  if (process.env.NODE_ENV === 'development' && size < TOUCH_TARGET.MIN_SIZE_PT) {
    console.warn(
      `Touch target${elementId ? ` '${elementId}'` : ''} is ${size}pt, ` +
        `below minimum ${TOUCH_TARGET.MIN_SIZE_PT}pt. ` +
        `Consider increasing size or adding hitSlop.`
    );
  }
}
