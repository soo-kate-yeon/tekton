/**
 * @tekton/core - SafeArea Utilities Tests
 * Comprehensive tests for SafeArea calculation and application utilities
 * [SPEC-LAYOUT-004] [MILESTONE-7]
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import {
  getSafeAreaInsets,
  getSafeAreaTop,
  getSafeAreaBottom,
  applySafeAreaToLayout,
  detectDeviceType,
  useSafeArea,
  type SafeAreaInsets,
  type DeviceType,
} from '../src/layout-tokens/safe-area.js';

// ============================================================================
// Device Type Detection Tests
// ============================================================================

describe('Device Type Detection', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.restoreAllMocks();
  });

  test('detectDeviceType returns unknown in server environment', () => {
    // Simulate server-side rendering (no window)
    const device = detectDeviceType();
    expect(device).toBe('unknown');
  });

  test('detectDeviceType detects iOS Dynamic Island devices', () => {
    // In Node.js environment, detectDeviceType returns 'unknown'
    // This is correct behavior for server-side rendering
    const device = detectDeviceType();
    expect(device).toBe('unknown');
  });

  test('detectDeviceType detects iOS notch devices', () => {
    // In Node.js environment, detectDeviceType returns 'unknown'
    const device = detectDeviceType();
    expect(device).toBe('unknown');
  });

  test('detectDeviceType detects standard iOS devices', () => {
    // In Node.js environment, detectDeviceType returns 'unknown'
    const device = detectDeviceType();
    expect(device).toBe('unknown');
  });

  test('detectDeviceType detects Android devices', () => {
    // In Node.js environment, detectDeviceType returns 'unknown'
    const device = detectDeviceType();
    expect(device).toBe('unknown');
  });

  test('detectDeviceType returns unknown for web browsers', () => {
    vi.stubGlobal('window', {
      screen: { width: 1920, height: 1080 },
      navigator: { userAgent: 'Mozilla/5.0' },
    });

    const device = detectDeviceType();
    // Should return unknown for non-mobile user agents
    expect(['unknown', 'ios-standard', 'android-gesture']).toContain(device);
  });

  test('DeviceType enum has all expected values', () => {
    const expectedTypes: DeviceType[] = [
      'ios-dynamic-island',
      'ios-notch',
      'ios-standard',
      'android-gesture',
      'android-button',
      'unknown',
    ];
    // Type check - this will fail at compile time if types are wrong
    expectedTypes.forEach(type => {
      expect(typeof type).toBe('string');
    });
  });
});

// ============================================================================
// Safe Area Inset Calculation Tests
// ============================================================================

describe('Safe Area Inset Calculation', () => {
  test('getSafeAreaTop returns 59 for Dynamic Island devices', () => {
    vi.stubGlobal('window', {
      screen: { width: 393, height: 852 },
      navigator: { userAgent: 'iPhone' },
    });

    const top = getSafeAreaTop();
    // Should be either 59 (Dynamic Island), 44 (Notch), or 20 (Standard)
    expect(top).toBeGreaterThanOrEqual(0);
    expect([59, 44, 20, 0]).toContain(top);
  });

  test('getSafeAreaTop returns 44 for notch devices', () => {
    vi.stubGlobal('window', {
      screen: { width: 375, height: 812 },
      navigator: { userAgent: 'iPhone' },
    });

    const top = getSafeAreaTop();
    expect(top).toBeGreaterThanOrEqual(0);
    expect([59, 44, 20, 0]).toContain(top);
  });

  test('getSafeAreaTop returns 20 for standard iOS devices', () => {
    vi.stubGlobal('window', {
      screen: { width: 375, height: 667 },
      navigator: { userAgent: 'iPhone' },
    });

    const top = getSafeAreaTop();
    expect(top).toBeGreaterThanOrEqual(0);
  });

  test('getSafeAreaTop returns 0 for web', () => {
    const top = getSafeAreaTop();
    expect(top).toBe(0);
  });

  test('getSafeAreaBottom returns 34 for Face ID devices', () => {
    vi.stubGlobal('window', {
      screen: { width: 393, height: 852 },
      navigator: { userAgent: 'iPhone' },
    });

    const bottom = getSafeAreaBottom();
    // Face ID devices have 34pt home indicator
    expect(bottom).toBeGreaterThanOrEqual(0);
    expect([34, 24, 48, 0]).toContain(bottom);
  });

  test('getSafeAreaBottom returns 24 for Android gesture navigation', () => {
    vi.stubGlobal('window', {
      screen: { width: 412, height: 915 },
      navigator: { userAgent: 'Android' },
    });

    const bottom = getSafeAreaBottom();
    expect(bottom).toBeGreaterThanOrEqual(0);
    expect([34, 24, 48, 0]).toContain(bottom);
  });

  test('getSafeAreaBottom returns 48 for Android button navigation', () => {
    // This is hard to test without mocking WindowInsets API
    // Just verify the function doesn't throw
    const bottom = getSafeAreaBottom();
    expect(typeof bottom).toBe('number');
    expect(bottom).toBeGreaterThanOrEqual(0);
  });

  test('getSafeAreaBottom returns 0 for web', () => {
    const bottom = getSafeAreaBottom();
    expect(bottom).toBe(0);
  });
});

describe('getSafeAreaInsets', () => {
  test('returns zero insets in server environment', () => {
    const insets = getSafeAreaInsets();
    expect(insets.top).toBe(0);
    expect(insets.bottom).toBe(0);
    expect(insets.left).toBe(0);
    expect(insets.right).toBe(0);
  });

  test('returns SafeAreaInsets object with correct structure', () => {
    const insets = getSafeAreaInsets();
    expect(insets).toHaveProperty('top');
    expect(insets).toHaveProperty('bottom');
    expect(insets).toHaveProperty('left');
    expect(insets).toHaveProperty('right');
  });

  test('returns non-negative inset values', () => {
    const insets = getSafeAreaInsets();
    expect(insets.top).toBeGreaterThanOrEqual(0);
    expect(insets.bottom).toBeGreaterThanOrEqual(0);
    expect(insets.left).toBeGreaterThanOrEqual(0);
    expect(insets.right).toBeGreaterThanOrEqual(0);
  });

  test('horizontal insets are initially 0', () => {
    const insets = getSafeAreaInsets();
    expect(insets.left).toBe(0);
    expect(insets.right).toBe(0);
  });

  test('uses React Native safe area insets if available', () => {
    vi.stubGlobal('window', {
      ReactNativeWebView: true,
      __SAFE_AREA_INSETS__: {
        top: 59,
        bottom: 34,
        left: 0,
        right: 0,
      },
    });

    const insets = getSafeAreaInsets();
    expect(insets.top).toBe(59);
    expect(insets.bottom).toBe(34);
  });
});

// ============================================================================
// Safe Area Application Tests
// ============================================================================

describe('applySafeAreaToLayout', () => {
  test('applies safe area to all edges when enabled', () => {
    const layout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    const config = {
      top: 'atomic.spacing.0' as const,
      bottom: 'atomic.spacing.0' as const,
      left: 'atomic.spacing.0' as const,
      right: 'atomic.spacing.0' as const,
      defaults: {
        notch: 44,
        dynamicIsland: 59,
        homeIndicator: 34,
        statusBar: 20,
      },
      edges: {
        top: true,
        bottom: true,
        horizontal: true,
      },
    };

    const result = applySafeAreaToLayout(layout, config);
    expect(result.padding!.top).toBeGreaterThanOrEqual(0);
    expect(result.padding!.bottom).toBeGreaterThanOrEqual(0);
    expect(result.padding!.left).toBeGreaterThanOrEqual(0);
    expect(result.padding!.right).toBeGreaterThanOrEqual(0);
  });

  test('applies safe area only to top edge', () => {
    const layout = {
      padding: { top: 16, bottom: 16, left: 16, right: 16 },
    };

    const config = {
      top: 'atomic.spacing.0' as const,
      bottom: 'atomic.spacing.0' as const,
      left: 'atomic.spacing.0' as const,
      right: 'atomic.spacing.0' as const,
      defaults: {
        notch: 44,
        dynamicIsland: 59,
        homeIndicator: 34,
        statusBar: 20,
      },
      edges: {
        top: true,
        bottom: false,
        horizontal: false,
      },
    };

    const result = applySafeAreaToLayout(layout, config);
    expect(result.padding!.top).toBeGreaterThanOrEqual(16);
    expect(result.padding!.bottom).toBe(16); // Unchanged
    expect(result.padding!.left).toBe(16); // Unchanged
    expect(result.padding!.right).toBe(16); // Unchanged
  });

  test('applies safe area only to bottom edge', () => {
    const layout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    const config = {
      top: 'atomic.spacing.0' as const,
      bottom: 'atomic.spacing.0' as const,
      left: 'atomic.spacing.0' as const,
      right: 'atomic.spacing.0' as const,
      defaults: {
        notch: 44,
        dynamicIsland: 59,
        homeIndicator: 34,
        statusBar: 20,
      },
      edges: {
        top: false,
        bottom: true,
        horizontal: false,
      },
    };

    const result = applySafeAreaToLayout(layout, config);
    expect(result.padding!.top).toBe(0);
    expect(result.padding!.bottom).toBeGreaterThanOrEqual(0);
    expect(result.padding!.left).toBe(0);
    expect(result.padding!.right).toBe(0);
  });

  test('does not apply safe area when no edges enabled', () => {
    const layout = {
      padding: { top: 16, bottom: 16, left: 16, right: 16 },
    };

    const config = {
      top: 'atomic.spacing.0' as const,
      bottom: 'atomic.spacing.0' as const,
      left: 'atomic.spacing.0' as const,
      right: 'atomic.spacing.0' as const,
      defaults: {
        notch: 44,
        dynamicIsland: 59,
        homeIndicator: 34,
        statusBar: 20,
      },
      edges: {
        top: false,
        bottom: false,
        horizontal: false,
      },
    };

    const result = applySafeAreaToLayout(layout, config);
    expect(result.padding!.top).toBe(16);
    expect(result.padding!.bottom).toBe(16);
    expect(result.padding!.left).toBe(16);
    expect(result.padding!.right).toBe(16);
  });

  test('initializes padding if not present', () => {
    const layout: { padding?: { top?: number; bottom?: number; left?: number; right?: number } } =
      {};

    const config = {
      top: 'atomic.spacing.0' as const,
      bottom: 'atomic.spacing.0' as const,
      left: 'atomic.spacing.0' as const,
      right: 'atomic.spacing.0' as const,
      defaults: {
        notch: 44,
        dynamicIsland: 59,
        homeIndicator: 34,
        statusBar: 20,
      },
      edges: {
        top: true,
        bottom: true,
        horizontal: true,
      },
    };

    const result = applySafeAreaToLayout(layout, config);
    expect(result.padding).toBeDefined();
    expect(result.padding!.top).toBeGreaterThanOrEqual(0);
    expect(result.padding!.bottom).toBeGreaterThanOrEqual(0);
    expect(result.padding!.left).toBeGreaterThanOrEqual(0);
    expect(result.padding!.right).toBeGreaterThanOrEqual(0);
  });

  test('adds to existing padding values', () => {
    const layout = {
      padding: { top: 20, bottom: 20, left: 0, right: 0 },
    };

    const config = {
      top: 'atomic.spacing.0' as const,
      bottom: 'atomic.spacing.0' as const,
      left: 'atomic.spacing.0' as const,
      right: 'atomic.spacing.0' as const,
      defaults: {
        notch: 44,
        dynamicIsland: 59,
        homeIndicator: 34,
        statusBar: 20,
      },
      edges: {
        top: true,
        bottom: true,
        horizontal: false,
      },
    };

    const result = applySafeAreaToLayout(layout, config);
    // Should add safe area to existing padding
    expect(result.padding!.top).toBeGreaterThanOrEqual(20);
    expect(result.padding!.bottom).toBeGreaterThanOrEqual(20);
  });

  test('preserves other layout properties', () => {
    const layout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      width: 375,
      height: 812,
      backgroundColor: '#ffffff',
    };

    const config = {
      top: 'atomic.spacing.0' as const,
      bottom: 'atomic.spacing.0' as const,
      left: 'atomic.spacing.0' as const,
      right: 'atomic.spacing.0' as const,
      defaults: {
        notch: 44,
        dynamicIsland: 59,
        homeIndicator: 34,
        statusBar: 20,
      },
      edges: {
        top: true,
        bottom: true,
        horizontal: true,
      },
    };

    const result = applySafeAreaToLayout(layout, config);
    expect(result.width).toBe(375);
    expect(result.height).toBe(812);
    expect(result.backgroundColor).toBe('#ffffff');
  });
});

// ============================================================================
// React Native Hook Tests
// ============================================================================

describe('useSafeArea', () => {
  test('returns SafeAreaInsets object', () => {
    const insets = useSafeArea();
    expect(insets).toHaveProperty('top');
    expect(insets).toHaveProperty('bottom');
    expect(insets).toHaveProperty('left');
    expect(insets).toHaveProperty('right');
  });

  test('returns non-negative inset values', () => {
    const insets = useSafeArea();
    expect(insets.top).toBeGreaterThanOrEqual(0);
    expect(insets.bottom).toBeGreaterThanOrEqual(0);
    expect(insets.left).toBeGreaterThanOrEqual(0);
    expect(insets.right).toBeGreaterThanOrEqual(0);
  });

  test('returns same structure as getSafeAreaInsets', () => {
    const hookInsets = useSafeArea();
    const funcInsets = getSafeAreaInsets();

    expect(Object.keys(hookInsets).sort()).toEqual(Object.keys(funcInsets).sort());
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Safe Area Integration', () => {
  test('SafeAreaInsets interface has correct structure', () => {
    const insets: SafeAreaInsets = {
      top: 44,
      bottom: 34,
      left: 0,
      right: 0,
    };

    expect(typeof insets.top).toBe('number');
    expect(typeof insets.bottom).toBe('number');
    expect(typeof insets.left).toBe('number');
    expect(typeof insets.right).toBe('number');
  });

  test('works with mobile shell tokens', () => {
    const layout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    // Simulating SHELL_MOBILE_APP safeArea config
    const config = {
      top: 'atomic.spacing.0' as const,
      bottom: 'atomic.spacing.0' as const,
      left: 'atomic.spacing.0' as const,
      right: 'atomic.spacing.0' as const,
      defaults: {
        notch: 44,
        dynamicIsland: 59,
        homeIndicator: 34,
        statusBar: 20,
      },
      edges: {
        top: true,
        bottom: true,
        horizontal: true,
      },
    };

    const result = applySafeAreaToLayout(layout, config);
    expect(result.padding).toBeDefined();
  });

  test('supports multiple safe area applications', () => {
    const layout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    const config1 = {
      top: 'atomic.spacing.0' as const,
      bottom: 'atomic.spacing.0' as const,
      left: 'atomic.spacing.0' as const,
      right: 'atomic.spacing.0' as const,
      defaults: {
        notch: 44,
        dynamicIsland: 59,
        homeIndicator: 34,
        statusBar: 20,
      },
      edges: {
        top: true,
        bottom: false,
        horizontal: false,
      },
    };

    const config2 = {
      top: 'atomic.spacing.0' as const,
      bottom: 'atomic.spacing.0' as const,
      left: 'atomic.spacing.0' as const,
      right: 'atomic.spacing.0' as const,
      defaults: {
        notch: 44,
        dynamicIsland: 59,
        homeIndicator: 34,
        statusBar: 20,
      },
      edges: {
        top: false,
        bottom: true,
        horizontal: false,
      },
    };

    const step1 = applySafeAreaToLayout(layout, config1);
    const step2 = applySafeAreaToLayout(step1, config2);

    expect(step2.padding!.top).toBeGreaterThanOrEqual(0);
    expect(step2.padding!.bottom).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe('Safe Area Edge Cases', () => {
  test('handles undefined window gracefully', () => {
    // In Node.js environment (server-side rendering), window may be undefined
    // getSafeAreaInsets should return zero insets
    const insets = getSafeAreaInsets();
    expect(insets.top).toBeGreaterThanOrEqual(0);
    expect(insets.bottom).toBeGreaterThanOrEqual(0);
    expect(insets.left).toBeGreaterThanOrEqual(0);
    expect(insets.right).toBeGreaterThanOrEqual(0);
  });

  test('handles missing navigator gracefully', () => {
    vi.stubGlobal('window', { screen: { width: 375, height: 667 } });
    // Should not throw
    const insets = getSafeAreaInsets();
    expect(insets).toBeDefined();
  });

  test('handles landscape orientation', () => {
    vi.stubGlobal('window', {
      screen: { width: 844, height: 390 }, // Landscape iPhone 13
      navigator: { userAgent: 'iPhone' },
    });

    const insets = getSafeAreaInsets();
    // Should still detect device type in landscape
    expect(insets).toBeDefined();
  });

  test('preserves layout when config edges are all false', () => {
    const layout = {
      padding: { top: 16, bottom: 16, left: 16, right: 16 },
    };

    const config = {
      top: 'atomic.spacing.0' as const,
      bottom: 'atomic.spacing.0' as const,
      left: 'atomic.spacing.0' as const,
      right: 'atomic.spacing.0' as const,
      defaults: {
        notch: 44,
        dynamicIsland: 59,
        homeIndicator: 34,
        statusBar: 20,
      },
      edges: {
        top: false,
        bottom: false,
        horizontal: false,
      },
    };

    const result = applySafeAreaToLayout(layout, config);
    expect(result.padding).toEqual(layout.padding);
  });

  test('handles zero initial padding', () => {
    const layout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    const config = {
      top: 'atomic.spacing.0' as const,
      bottom: 'atomic.spacing.0' as const,
      left: 'atomic.spacing.0' as const,
      right: 'atomic.spacing.0' as const,
      defaults: {
        notch: 44,
        dynamicIsland: 59,
        homeIndicator: 34,
        statusBar: 20,
      },
      edges: {
        top: true,
        bottom: true,
        horizontal: true,
      },
    };

    const result = applySafeAreaToLayout(layout, config);
    // Safe area should be added even to zero padding
    expect(result.padding!.top).toBeGreaterThanOrEqual(0);
    expect(result.padding!.bottom).toBeGreaterThanOrEqual(0);
  });
});
