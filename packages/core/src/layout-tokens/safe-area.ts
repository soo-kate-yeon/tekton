/**
 * @tekton/core - SafeArea Utilities
 * SafeArea calculation and application utilities for mobile platforms
 * [SPEC-LAYOUT-004] [MILESTONE-3]
 */

import { SAFE_AREA_DEFAULTS } from './types.js';
import type { SafeAreaConfig } from './types.js';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Safe Area Insets
 * Represents the safe area insets for all four edges in points
 */
export interface SafeAreaInsets {
  /** Top inset in points (notch, Dynamic Island, status bar) */
  top: number;

  /** Bottom inset in points (home indicator, gesture navigation) */
  bottom: number;

  /** Left inset in points (for landscape orientation) */
  left: number;

  /** Right inset in points (for landscape orientation) */
  right: number;
}

/**
 * Device Type Classification
 * Used to determine appropriate SafeArea defaults
 */
export type DeviceType =
  | 'ios-dynamic-island' // iPhone 14 Pro, 15 Pro, 16 Pro (59pt top, 34pt bottom)
  | 'ios-notch' // iPhone X - 13 series (44pt top, 34pt bottom)
  | 'ios-standard' // iPhone SE, 8, 7, 6s (20pt top, 0pt bottom)
  | 'android-gesture' // Android with gesture navigation (24dp bottom)
  | 'android-button' // Android with 3-button navigation (48dp bottom)
  | 'unknown'; // Web or undetectable platform

// ============================================================================
// Device Detection
// ============================================================================

/**
 * Detect device type for SafeArea defaults
 *
 * Uses screen dimensions and platform APIs to determine device classification.
 * Detection strategy:
 * - iOS: Checks screen dimensions and model via window.navigator
 * - Android: Checks navigation mode via WindowInsets API
 * - Web: Returns 'unknown'
 *
 * @returns DeviceType enum value
 *
 * @example
 * ```typescript
 * const device = detectDeviceType();
 * if (device === 'ios-dynamic-island') {
 *   console.log('Using 59pt top safe area');
 * }
 * ```
 */
export function detectDeviceType(): DeviceType {
  // Web environment - no safe area needed
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  // Check platform
  const platform = getPlatform();

  if (platform === 'ios') {
    return detectiOSDeviceType();
  } else if (platform === 'android') {
    return detectAndroidDeviceType();
  }

  // Default to unknown for web and other platforms
  return 'unknown';
}

/**
 * Get current platform
 * @internal
 */
function getPlatform(): 'ios' | 'android' | 'web' {
  if (typeof navigator === 'undefined') {
    return 'web';
  }

  const userAgent = navigator.userAgent || navigator.vendor;

  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'ios';
  } else if (/android/i.test(userAgent)) {
    return 'android';
  }

  return 'web';
}

/**
 * Detect iOS device type based on screen dimensions
 * @internal
 */
function detectiOSDeviceType(): DeviceType {
  if (typeof window === 'undefined') {
    return 'ios-standard';
  }

  const width = window.screen.width;
  const height = window.screen.height;

  // iPhone 14 Pro / 15 Pro / 16 Pro dimensions (Dynamic Island)
  // 393×852 @3x = 1179×2556
  const dynamicIslandModels = [
    { width: 393, height: 852 }, // iPhone 14 Pro, 15 Pro
    { width: 430, height: 932 }, // iPhone 14 Pro Max, 15 Pro Max, 16 Pro Max
  ];

  for (const model of dynamicIslandModels) {
    if (
      (width === model.width && height === model.height) ||
      (width === model.height && height === model.width)
    ) {
      return 'ios-dynamic-island';
    }
  }

  // iPhone with notch (X, XS, XR, 11, 12, 13 series)
  // 375×812, 390×844, 414×896, 428×926
  const notchModels = [
    { width: 375, height: 812 }, // iPhone X, XS, 11 Pro, 12 mini, 13 mini
    { width: 390, height: 844 }, // iPhone 12, 12 Pro, 13, 13 Pro, 14
    { width: 414, height: 896 }, // iPhone XR, 11, 11 Pro Max, XS Max
    { width: 428, height: 926 }, // iPhone 12 Pro Max, 13 Pro Max, 14 Plus
  ];

  for (const model of notchModels) {
    if (
      (width === model.width && height === model.height) ||
      (width === model.height && height === model.width)
    ) {
      return 'ios-notch';
    }
  }

  // Standard iOS devices (SE, 8, 7, 6s) - no notch or Dynamic Island
  return 'ios-standard';
}

/**
 * Detect Android device navigation type
 * @internal
 */
function detectAndroidDeviceType(): DeviceType {
  // In React Native, this would check WindowInsets
  // For web, we default to gesture navigation (more common on modern devices)
  if (typeof window === 'undefined') {
    return 'android-gesture';
  }

  // Check if running in React Native environment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isReactNative = typeof (window as any).ReactNativeWebView !== 'undefined';

  if (isReactNative) {
    // In React Native, we could check navigation bar height from WindowInsets
    // For now, default to gesture navigation (24dp)
    return 'android-gesture';
  }

  // Web Android defaults to gesture navigation
  return 'android-gesture';
}

// ============================================================================
// Safe Area Calculation
// ============================================================================

/**
 * Get safe area top inset based on device type
 *
 * @returns Top inset in points
 *
 * @example
 * ```typescript
 * const topInset = getSafeAreaTop();
 * // Returns 59 on iPhone 14 Pro (Dynamic Island)
 * // Returns 44 on iPhone 13 (Notch)
 * // Returns 20 on iPhone SE (Standard)
 * ```
 */
export function getSafeAreaTop(): number {
  const device = detectDeviceType();
  switch (device) {
    case 'ios-dynamic-island':
      return SAFE_AREA_DEFAULTS.DYNAMIC_ISLAND;
    case 'ios-notch':
      return SAFE_AREA_DEFAULTS.NOTCH;
    case 'ios-standard':
      return SAFE_AREA_DEFAULTS.STATUS_BAR;
    default:
      return 0;
  }
}

/**
 * Get safe area bottom inset based on device type
 *
 * @returns Bottom inset in points
 *
 * @example
 * ```typescript
 * const bottomInset = getSafeAreaBottom();
 * // Returns 34 on iPhone with Face ID (home indicator)
 * // Returns 24 on Android with gesture navigation
 * // Returns 48 on Android with 3-button navigation
 * ```
 */
export function getSafeAreaBottom(): number {
  const device = detectDeviceType();
  switch (device) {
    case 'ios-dynamic-island':
    case 'ios-notch':
      return SAFE_AREA_DEFAULTS.HOME_INDICATOR;
    case 'android-gesture':
      return 24; // Android gesture navigation bar
    case 'android-button':
      return 48; // Android 3-button navigation
    default:
      return 0;
  }
}

/**
 * Get safe area insets for the current device
 *
 * Detection strategy:
 * 1. In browser/web context: Returns zero insets
 * 2. In React Native with react-native-safe-area-context: Uses library
 * 3. Fallback: Uses detectDeviceType() and applies defaults
 *
 * @returns SafeAreaInsets object with top, bottom, left, right values in points
 *
 * @example
 * ```typescript
 * const insets = getSafeAreaInsets();
 * console.log(insets.top); // 44 on iPhone 14, 59 on iPhone 14 Pro
 * console.log(insets.bottom); // 34 on Face ID iPhones, 24 on Android gesture
 * ```
 */
export function getSafeAreaInsets(): SafeAreaInsets {
  // Web environment - no safe area
  if (typeof window === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  // Check if running in React Native with safe area context
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = window as any;
  if (global.ReactNativeWebView && global.__SAFE_AREA_INSETS__) {
    // Use provided safe area insets from React Native
    return global.__SAFE_AREA_INSETS__ as SafeAreaInsets;
  }

  // Fallback to device type detection
  const top = getSafeAreaTop();
  const bottom = getSafeAreaBottom();

  return {
    top,
    bottom,
    left: 0, // Horizontal insets typically handled in landscape
    right: 0,
  };
}

// ============================================================================
// Safe Area Application
// ============================================================================

/**
 * Apply safe area configuration to a layout
 *
 * Modifies layout padding based on safe area configuration and edges.
 * Respects the edges configuration to determine which sides receive safe area padding.
 *
 * @param layout - Layout object to modify (must have padding property)
 * @param config - SafeArea configuration from ShellToken
 * @returns Modified layout with safe area applied
 *
 * @example
 * ```typescript
 * const layout = { padding: { top: 0, bottom: 0, left: 0, right: 0 } };
 * const safeLayout = applySafeAreaToLayout(layout, shellConfig.safeArea);
 * // Result: { padding: { top: 44, bottom: 34, left: 0, right: 0 } }
 * ```
 *
 * @example
 * ```typescript
 * // Only apply safe area to top edge
 * const config = {
 *   edges: { top: true, bottom: false, horizontal: false },
 *   // ... other config
 * };
 * const layout = applySafeAreaToLayout(baseLayout, config);
 * // Result: Only top padding is modified
 * ```
 */
export function applySafeAreaToLayout<
  T extends {
    padding?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    [key: string]: unknown;
  },
>(layout: T, config: SafeAreaConfig): T {
  // Get current safe area insets
  const insets = getSafeAreaInsets();

  // Initialize padding if not present
  if (!layout.padding) {
    layout.padding = { top: 0, bottom: 0, left: 0, right: 0 };
  }

  // Ensure all padding properties exist
  const padding = layout.padding;
  if (padding.top === undefined) {
    padding.top = 0;
  }
  if (padding.bottom === undefined) {
    padding.bottom = 0;
  }
  if (padding.left === undefined) {
    padding.left = 0;
  }
  if (padding.right === undefined) {
    padding.right = 0;
  }

  // Apply safe area based on edges configuration
  if (config.edges.top) {
    padding.top += insets.top;
  }

  if (config.edges.bottom) {
    padding.bottom += insets.bottom;
  }

  if (config.edges.horizontal) {
    padding.left += insets.left;
    padding.right += insets.right;
  }

  return layout;
}

// ============================================================================
// React Native Hook (Placeholder)
// ============================================================================

/**
 * React Native hook to get safe area insets
 *
 * This is a placeholder implementation that wraps getSafeAreaInsets().
 * In a real React Native environment, this should use the
 * react-native-safe-area-context library's useSafeAreaInsets() hook.
 *
 * @returns SafeAreaInsets from react-native-safe-area-context or fallback
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const insets = useSafeArea();
 *   return <View style={{ paddingTop: insets.top }} />;
 * }
 * ```
 *
 * @see https://github.com/th3rdwave/react-native-safe-area-context
 *
 * @remarks
 * For production use, replace this with:
 * ```typescript
 * import { useSafeAreaInsets } from 'react-native-safe-area-context';
 * export const useSafeArea = useSafeAreaInsets;
 * ```
 */
export function useSafeArea(): SafeAreaInsets {
  // Placeholder implementation - returns static insets
  // In a real React environment, this would use React hooks
  return getSafeAreaInsets();
}
