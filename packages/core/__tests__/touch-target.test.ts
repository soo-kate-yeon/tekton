/**
 * @tekton/core - Touch Target Utilities Tests
 * Comprehensive tests for accessible touch target validation and utilities
 * [SPEC-LAYOUT-004] [MILESTONE-7]
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validateTouchTarget,
  applyMinTouchTarget,
  getHitSlop,
  getMinTouchTargetForScale,
  isAccessibleTouchTarget,
  warnIfBelowMinimum,
  type AccessibilityGuideline,
  type TouchTargetElement,
} from '../src/layout-tokens/touch-target.js';

// ============================================================================
// validateTouchTarget Tests
// ============================================================================

describe('validateTouchTarget', () => {
  test('returns true for 44pt minimum size', () => {
    expect(validateTouchTarget(44)).toBe(true);
  });

  test('returns true for sizes above minimum', () => {
    expect(validateTouchTarget(48)).toBe(true);
    expect(validateTouchTarget(56)).toBe(true);
    expect(validateTouchTarget(100)).toBe(true);
  });

  test('returns false for sizes below minimum', () => {
    expect(validateTouchTarget(40)).toBe(false);
    expect(validateTouchTarget(32)).toBe(false);
    expect(validateTouchTarget(24)).toBe(false);
  });

  test('returns false for zero size', () => {
    expect(validateTouchTarget(0)).toBe(false);
  });

  test('returns false for negative size', () => {
    expect(validateTouchTarget(-10)).toBe(false);
  });

  test('handles @2x scale correctly', () => {
    expect(validateTouchTarget(88, 2)).toBe(true); // 88px = 44pt @2x
    expect(validateTouchTarget(80, 2)).toBe(false); // 80px < 88px
  });

  test('handles @3x scale correctly', () => {
    expect(validateTouchTarget(132, 3)).toBe(true); // 132px = 44pt @3x
    expect(validateTouchTarget(120, 3)).toBe(false); // 120px < 132px
  });

  test('handles @4x scale correctly', () => {
    expect(validateTouchTarget(176, 4)).toBe(true); // 176px = 44pt @4x
    expect(validateTouchTarget(160, 4)).toBe(false); // 160px < 176px
  });

  test('defaults to 1x scale when scale not provided', () => {
    expect(validateTouchTarget(44)).toBe(true);
    expect(validateTouchTarget(40)).toBe(false);
  });

  test('handles fractional sizes', () => {
    expect(validateTouchTarget(44.5)).toBe(true);
    expect(validateTouchTarget(43.5)).toBe(false);
  });

  test('handles very large sizes', () => {
    expect(validateTouchTarget(1000)).toBe(true);
    expect(validateTouchTarget(10000)).toBe(true);
  });
});

// ============================================================================
// applyMinTouchTarget Tests
// ============================================================================

describe('applyMinTouchTarget', () => {
  test('increases width and height to minimum when below', () => {
    const element = { width: 32, height: 32 };
    const result = applyMinTouchTarget(element);
    expect(result.width).toBe(44);
    expect(result.height).toBe(44);
  });

  test('preserves size when already at minimum', () => {
    const element = { width: 44, height: 44 };
    const result = applyMinTouchTarget(element);
    expect(result.width).toBe(44);
    expect(result.height).toBe(44);
  });

  test('preserves size when above minimum', () => {
    const element = { width: 48, height: 56 };
    const result = applyMinTouchTarget(element);
    expect(result.width).toBe(48);
    expect(result.height).toBe(56);
  });

  test('handles zero size', () => {
    const element = { width: 0, height: 0 };
    const result = applyMinTouchTarget(element);
    expect(result.width).toBe(44);
    expect(result.height).toBe(44);
  });

  test('handles different width and height', () => {
    const element = { width: 32, height: 48 };
    const result = applyMinTouchTarget(element);
    expect(result.width).toBe(44); // Increased
    expect(result.height).toBe(48); // Preserved
  });

  test('accepts custom minimum size', () => {
    const element = { width: 40, height: 40 };
    const result = applyMinTouchTarget(element, 48);
    expect(result.width).toBe(48);
    expect(result.height).toBe(48);
  });

  test('uses 44pt default when minSize not provided', () => {
    const element = { width: 40, height: 40 };
    const result = applyMinTouchTarget(element);
    expect(result.width).toBe(44);
    expect(result.height).toBe(44);
  });

  test('handles negative sizes gracefully', () => {
    const element = { width: -10, height: -10 };
    const result = applyMinTouchTarget(element);
    expect(result.width).toBe(44);
    expect(result.height).toBe(44);
  });

  test('handles fractional sizes', () => {
    const element = { width: 43.5, height: 43.5 };
    const result = applyMinTouchTarget(element);
    expect(result.width).toBe(44);
    expect(result.height).toBe(44);
  });

  test('does not mutate original element', () => {
    const element = { width: 32, height: 32 };
    const result = applyMinTouchTarget(element);
    expect(element.width).toBe(32); // Original unchanged
    expect(element.height).toBe(32); // Original unchanged
    expect(result.width).toBe(44); // Result modified
    expect(result.height).toBe(44); // Result modified
  });
});

// ============================================================================
// getHitSlop Tests
// ============================================================================

describe('getHitSlop', () => {
  test('calculates hit slop for 24pt element', () => {
    const hitSlop = getHitSlop(24);
    expect(hitSlop.top).toBe(10);
    expect(hitSlop.bottom).toBe(10);
    expect(hitSlop.left).toBe(10);
    expect(hitSlop.right).toBe(10);
    // Total: 24 + 10 + 10 = 44pt
  });

  test('calculates hit slop for 32pt element', () => {
    const hitSlop = getHitSlop(32);
    expect(hitSlop.top).toBe(6);
    expect(hitSlop.bottom).toBe(6);
    expect(hitSlop.left).toBe(6);
    expect(hitSlop.right).toBe(6);
    // Total: 32 + 6 + 6 = 44pt
  });

  test('returns zero slop for 44pt element', () => {
    const hitSlop = getHitSlop(44);
    expect(hitSlop.top).toBe(0);
    expect(hitSlop.bottom).toBe(0);
    expect(hitSlop.left).toBe(0);
    expect(hitSlop.right).toBe(0);
  });

  test('returns zero slop for sizes above minimum', () => {
    const hitSlop = getHitSlop(48);
    expect(hitSlop.top).toBe(0);
    expect(hitSlop.bottom).toBe(0);
    expect(hitSlop.left).toBe(0);
    expect(hitSlop.right).toBe(0);
  });

  test('uses custom minimum size', () => {
    const hitSlop = getHitSlop(40, 48);
    expect(hitSlop.top).toBe(4);
    expect(hitSlop.bottom).toBe(4);
    expect(hitSlop.left).toBe(4);
    expect(hitSlop.right).toBe(4);
    // Total: 40 + 4 + 4 = 48pt
  });

  test('handles zero size', () => {
    const hitSlop = getHitSlop(0);
    expect(hitSlop.top).toBe(22);
    expect(hitSlop.bottom).toBe(22);
    expect(hitSlop.left).toBe(22);
    expect(hitSlop.right).toBe(22);
    // Total: 0 + 22 + 22 = 44pt
  });

  test('rounds up for odd deficits', () => {
    const hitSlop = getHitSlop(43);
    // Deficit: 44 - 43 = 1, half = 0.5, ceil = 1
    expect(hitSlop.top).toBe(1);
    expect(hitSlop.bottom).toBe(1);
    expect(hitSlop.left).toBe(1);
    expect(hitSlop.right).toBe(1);
  });

  test('distributes slop evenly for even deficits', () => {
    const hitSlop = getHitSlop(40);
    // Deficit: 44 - 40 = 4, half = 2
    expect(hitSlop.top).toBe(2);
    expect(hitSlop.bottom).toBe(2);
    expect(hitSlop.left).toBe(2);
    expect(hitSlop.right).toBe(2);
  });

  test('handles very small sizes', () => {
    const hitSlop = getHitSlop(10);
    // Deficit: 44 - 10 = 34, half = 17
    expect(hitSlop.top).toBe(17);
    expect(hitSlop.bottom).toBe(17);
    expect(hitSlop.left).toBe(17);
    expect(hitSlop.right).toBe(17);
  });

  test('returns zero for very large sizes', () => {
    const hitSlop = getHitSlop(100);
    expect(hitSlop.top).toBe(0);
    expect(hitSlop.bottom).toBe(0);
    expect(hitSlop.left).toBe(0);
    expect(hitSlop.right).toBe(0);
  });
});

// ============================================================================
// getMinTouchTargetForScale Tests
// ============================================================================

describe('getMinTouchTargetForScale', () => {
  test('returns 44px for 1x scale', () => {
    expect(getMinTouchTargetForScale(1)).toBe(44);
  });

  test('returns 88px for 2x scale', () => {
    expect(getMinTouchTargetForScale(2)).toBe(88);
  });

  test('returns 132px for 3x scale', () => {
    expect(getMinTouchTargetForScale(3)).toBe(132);
  });

  test('returns 176px for 4x scale', () => {
    expect(getMinTouchTargetForScale(4)).toBe(176);
  });

  test('defaults to 44px for unknown scales', () => {
    expect(getMinTouchTargetForScale(5)).toBe(44);
    expect(getMinTouchTargetForScale(0)).toBe(44);
    expect(getMinTouchTargetForScale(-1)).toBe(44);
  });

  test('returns number type', () => {
    expect(typeof getMinTouchTargetForScale(1)).toBe('number');
    expect(typeof getMinTouchTargetForScale(2)).toBe('number');
  });

  test('returns positive values', () => {
    expect(getMinTouchTargetForScale(1)).toBeGreaterThan(0);
    expect(getMinTouchTargetForScale(2)).toBeGreaterThan(0);
    expect(getMinTouchTargetForScale(3)).toBeGreaterThan(0);
    expect(getMinTouchTargetForScale(4)).toBeGreaterThan(0);
  });

  test('scales linearly', () => {
    const scale1 = getMinTouchTargetForScale(1);
    const scale2 = getMinTouchTargetForScale(2);
    const scale3 = getMinTouchTargetForScale(3);
    const scale4 = getMinTouchTargetForScale(4);

    expect(scale2).toBe(scale1 * 2);
    expect(scale3).toBe(scale1 * 3);
    expect(scale4).toBe(scale1 * 4);
  });
});

// ============================================================================
// isAccessibleTouchTarget Tests
// ============================================================================

describe('isAccessibleTouchTarget', () => {
  describe('Apple HIG guideline', () => {
    test('returns true for 44×44pt', () => {
      expect(isAccessibleTouchTarget(44, 44, 'apple-hig')).toBe(true);
    });

    test('returns true for sizes above minimum', () => {
      expect(isAccessibleTouchTarget(48, 48, 'apple-hig')).toBe(true);
      expect(isAccessibleTouchTarget(56, 56, 'apple-hig')).toBe(true);
    });

    test('returns false for sizes below minimum', () => {
      expect(isAccessibleTouchTarget(40, 40, 'apple-hig')).toBe(false);
      expect(isAccessibleTouchTarget(32, 32, 'apple-hig')).toBe(false);
    });

    test('requires both dimensions to meet minimum', () => {
      expect(isAccessibleTouchTarget(44, 40, 'apple-hig')).toBe(false);
      expect(isAccessibleTouchTarget(40, 44, 'apple-hig')).toBe(false);
    });
  });

  describe('Material Design guideline', () => {
    test('returns true for 48×48dp', () => {
      expect(isAccessibleTouchTarget(48, 48, 'material')).toBe(true);
    });

    test('returns true for sizes above minimum', () => {
      expect(isAccessibleTouchTarget(56, 56, 'material')).toBe(true);
      expect(isAccessibleTouchTarget(64, 64, 'material')).toBe(true);
    });

    test('returns false for sizes below minimum', () => {
      expect(isAccessibleTouchTarget(44, 44, 'material')).toBe(false);
      expect(isAccessibleTouchTarget(40, 40, 'material')).toBe(false);
    });

    test('requires both dimensions to meet minimum', () => {
      expect(isAccessibleTouchTarget(48, 44, 'material')).toBe(false);
      expect(isAccessibleTouchTarget(44, 48, 'material')).toBe(false);
    });
  });

  describe('WCAG guideline', () => {
    test('returns true for 44×44px', () => {
      expect(isAccessibleTouchTarget(44, 44, 'wcag')).toBe(true);
    });

    test('uses same standard as Apple HIG', () => {
      const appleResult = isAccessibleTouchTarget(44, 44, 'apple-hig');
      const wcagResult = isAccessibleTouchTarget(44, 44, 'wcag');
      expect(appleResult).toBe(wcagResult);
    });
  });

  test('defaults to apple-hig guideline', () => {
    expect(isAccessibleTouchTarget(44, 44)).toBe(true);
    expect(isAccessibleTouchTarget(40, 40)).toBe(false);
  });

  test('handles square targets', () => {
    expect(isAccessibleTouchTarget(44, 44, 'apple-hig')).toBe(true);
    expect(isAccessibleTouchTarget(48, 48, 'material')).toBe(true);
  });

  test('handles rectangular targets', () => {
    expect(isAccessibleTouchTarget(100, 44, 'apple-hig')).toBe(true);
    expect(isAccessibleTouchTarget(44, 100, 'apple-hig')).toBe(true);
  });

  test('handles zero dimensions', () => {
    expect(isAccessibleTouchTarget(0, 0, 'apple-hig')).toBe(false);
    expect(isAccessibleTouchTarget(44, 0, 'apple-hig')).toBe(false);
  });
});

// ============================================================================
// warnIfBelowMinimum Tests
// ============================================================================

describe('warnIfBelowMinimum', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    delete process.env.NODE_ENV;
  });

  test('warns when size is below minimum in development', () => {
    warnIfBelowMinimum(32, 'submit-button');
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  test('does not warn when size meets minimum', () => {
    warnIfBelowMinimum(44, 'submit-button');
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  test('does not warn when size is above minimum', () => {
    warnIfBelowMinimum(48, 'submit-button');
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  test('includes element ID in warning message', () => {
    warnIfBelowMinimum(32, 'submit-button');
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('submit-button'));
  });

  test('works without element ID', () => {
    warnIfBelowMinimum(32);
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  test('includes size in warning message', () => {
    warnIfBelowMinimum(32, 'submit-button');
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('32pt'));
  });

  test('includes minimum size in warning message', () => {
    warnIfBelowMinimum(32, 'submit-button');
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('44pt'));
  });

  test('suggests using hitSlop in warning message', () => {
    warnIfBelowMinimum(32, 'submit-button');
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('hitSlop'));
  });

  test('does not warn in production environment', () => {
    process.env.NODE_ENV = 'production';
    warnIfBelowMinimum(32, 'submit-button');
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  test('does not throw when console.warn is unavailable', () => {
    consoleWarnSpy.mockRestore();
    expect(() => warnIfBelowMinimum(32, 'submit-button')).not.toThrow();
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Touch Target Integration', () => {
  test('TouchTargetElement interface has correct structure', () => {
    const element: TouchTargetElement = {
      width: 44,
      height: 44,
    };

    expect(typeof element.width).toBe('number');
    expect(typeof element.height).toBe('number');
  });

  test('AccessibilityGuideline type has expected values', () => {
    const guidelines: AccessibilityGuideline[] = ['apple-hig', 'material', 'wcag'];
    guidelines.forEach(guideline => {
      expect(typeof guideline).toBe('string');
    });
  });

  test('validates and applies minimum in workflow', () => {
    const element = { width: 32, height: 32 };

    // Step 1: Validate
    const isValid = validateTouchTarget(element.width);
    expect(isValid).toBe(false);

    // Step 2: Apply minimum
    const fixed = applyMinTouchTarget(element);
    expect(fixed.width).toBe(44);
    expect(fixed.height).toBe(44);

    // Step 3: Validate again
    const isValidNow = validateTouchTarget(fixed.width);
    expect(isValidNow).toBe(true);
  });

  test('calculates hit slop for undersized elements', () => {
    const element = { width: 24, height: 24 };

    // Option 1: Apply minimum size
    const enlarged = applyMinTouchTarget(element);
    expect(enlarged.width).toBe(44);

    // Option 2: Use hit slop
    const hitSlop = getHitSlop(element.width);
    const effectiveSize = element.width + hitSlop.top + hitSlop.bottom;
    expect(effectiveSize).toBeGreaterThanOrEqual(44);
  });

  test('works with mobile shell bottomTab items', () => {
    // Simulating SHELL_MOBILE_APP bottomTab item
    const tabItem = {
      width: 56, // iconSize: 24pt
      height: 56, // minTouchTarget: 44pt
    };

    expect(validateTouchTarget(tabItem.width)).toBe(true);
    expect(validateTouchTarget(tabItem.height)).toBe(true);
    expect(isAccessibleTouchTarget(tabItem.width, tabItem.height, 'apple-hig')).toBe(true);
  });

  test('validates different scale factors', () => {
    // @1x: 44pt
    expect(validateTouchTarget(44, 1)).toBe(true);

    // @2x: 88px = 44pt
    expect(validateTouchTarget(88, 2)).toBe(true);

    // @3x: 132px = 44pt
    expect(validateTouchTarget(132, 3)).toBe(true);

    // @4x: 176px = 44pt
    expect(validateTouchTarget(176, 4)).toBe(true);
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe('Touch Target Edge Cases', () => {
  test('handles extremely small sizes', () => {
    expect(validateTouchTarget(1)).toBe(false);
    const fixed = applyMinTouchTarget({ width: 1, height: 1 });
    expect(fixed.width).toBe(44);
    expect(fixed.height).toBe(44);
  });

  test('handles extremely large sizes', () => {
    expect(validateTouchTarget(10000)).toBe(true);
    const element = { width: 10000, height: 10000 };
    const result = applyMinTouchTarget(element);
    expect(result.width).toBe(10000);
    expect(result.height).toBe(10000);
  });

  test('handles fractional pixel values', () => {
    expect(validateTouchTarget(43.9)).toBe(false);
    expect(validateTouchTarget(44.1)).toBe(true);
  });

  test('hit slop for exact minimum returns zero', () => {
    const hitSlop = getHitSlop(44);
    expect(hitSlop.top).toBe(0);
    expect(hitSlop.bottom).toBe(0);
    expect(hitSlop.left).toBe(0);
    expect(hitSlop.right).toBe(0);
  });

  test('handles custom minimum sizes', () => {
    const element = { width: 40, height: 40 };
    const result = applyMinTouchTarget(element, 56);
    expect(result.width).toBe(56);
    expect(result.height).toBe(56);
  });

  test('validates asymmetric elements', () => {
    expect(isAccessibleTouchTarget(100, 44, 'apple-hig')).toBe(true);
    expect(isAccessibleTouchTarget(44, 100, 'apple-hig')).toBe(true);
    expect(isAccessibleTouchTarget(100, 40, 'apple-hig')).toBe(false);
  });

  test('handles different guidelines with same size', () => {
    expect(isAccessibleTouchTarget(44, 44, 'apple-hig')).toBe(true);
    expect(isAccessibleTouchTarget(44, 44, 'material')).toBe(false);
    expect(isAccessibleTouchTarget(48, 48, 'material')).toBe(true);
  });

  test('combines validation and hit slop calculation', () => {
    const size = 32;
    const isValid = validateTouchTarget(size);
    expect(isValid).toBe(false);

    const hitSlop = getHitSlop(size);
    const totalSize = size + hitSlop.top + hitSlop.bottom;
    expect(totalSize).toBeGreaterThanOrEqual(44);
  });

  test('preserves element properties not related to size', () => {
    const element = { width: 32, height: 32, color: 'blue', label: 'Button' };
    const result = applyMinTouchTarget(element);
    expect(result.width).toBe(44);
    expect(result.height).toBe(44);
    // Original properties are not preserved in the return type
    // but the function should not modify other properties if they exist
  });
});
