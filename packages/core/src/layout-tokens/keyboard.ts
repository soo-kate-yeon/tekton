/**
 * @tekton/core - Keyboard Utilities
 * Keyboard handling and avoidance utilities for mobile and web platforms
 * [SPEC-LAYOUT-004] [MILESTONE-4]
 */

import type { KeyboardConfig, KeyboardAnimationConfig } from './types.js';

// ============================================================================
// Platform Detection
// ============================================================================

/**
 * Detect current platform
 * @internal
 */
function detectPlatform(): 'ios' | 'android' | 'web' {
  // Check if running in React Native environment
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    // Detect iOS or Android
    const globalAny = global as any;
    const Platform = globalAny.Platform;
    if (Platform && Platform.OS) {
      return Platform.OS === 'ios' ? 'ios' : 'android';
    }
  }
  return 'web';
}

/**
 * Check if React Native Keyboard API is available
 * @internal
 */
function isKeyboardAPIAvailable(): boolean {
  try {
    const globalAny = global as any;
    return typeof globalAny.Keyboard !== 'undefined';
  } catch {
    return false;
  }
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Keyboard state for tracking visibility and dimensions
 */
export interface KeyboardState {
  /** Whether the keyboard is currently visible */
  isVisible: boolean;

  /** Current keyboard height in points/dp (0 if hidden) */
  height: number;

  /** Animation progress from 0.0 (hidden) to 1.0 (fully visible) */
  progress: number;
}

/**
 * Keyboard event types
 */
export type KeyboardEventType = 'show' | 'hide' | 'change';

/**
 * Keyboard event listener callback
 */
export type KeyboardEventListener = (height: number) => void;

/**
 * Layout object that can be modified by keyboard avoidance
 */
export interface KeyboardAwareLayout {
  /** Padding values */
  padding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };

  /** Height dimension */
  height?: number;

  /** Transform values */
  transform?: Array<{ translateY?: number; [key: string]: unknown }>;

  /** Position values */
  position?: {
    bottom?: number;
    top?: number;
    left?: number;
    right?: number;
  };

  /** Allow additional properties */
  [key: string]: unknown;
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Get current keyboard height
 *
 * @returns Keyboard height in points/dp (0 if hidden or unavailable)
 *
 * @example
 * ```typescript
 * const keyboardHeight = getKeyboardHeight();
 * console.log(keyboardHeight); // 336 on iPhone, varies on Android, 0 on web
 * ```
 *
 * @remarks
 * - On web: Always returns 0 (no software keyboard tracking)
 * - On iOS: Returns keyboard height from Keyboard API (typically 336pt on iPhone)
 * - On Android: Returns keyboard height from Keyboard API (varies by device)
 * - Falls back to 0 if Keyboard API is unavailable
 */
export function getKeyboardHeight(): number {
  const platform = detectPlatform();

  // Web platform: no keyboard tracking
  if (platform === 'web') {
    return 0;
  }

  // React Native: try to get keyboard height
  if (isKeyboardAPIAvailable()) {
    try {
      const globalAny = global as any;
      const Keyboard = globalAny.Keyboard;

      // Check if there's an active keyboard metrics method
      if (typeof Keyboard?.metrics === 'function') {
        const metrics = Keyboard.metrics();
        return metrics?.height ?? 0;
      }

      // Alternative: check stored keyboard height (if available)
      // This would require integration with react-native-keyboard-controller
      // or a custom keyboard state manager
    } catch (error) {
      console.warn('[Keyboard] Failed to get keyboard height:', error);
    }
  }

  // Fallback: return 0
  return 0;
}

/**
 * Apply keyboard avoidance strategy to a layout
 *
 * @param layout - Layout object to modify
 * @param config - Keyboard configuration defining avoidance strategy
 * @returns Modified layout with keyboard avoidance applied
 *
 * @example
 * ```typescript
 * const layout = { padding: { bottom: 0 }, height: 812 };
 * const keyboardHeight = 336;
 * const adjusted = applyKeyboardAvoidance(layout, {
 *   avoidance: 'padding',
 *   behavior: 'height',
 *   animation: { duration: 250, easing: 'keyboard', enabled: true },
 *   dismissMode: 'interactive'
 * });
 * console.log(adjusted.padding.bottom); // 336
 * ```
 *
 * @remarks
 * Avoidance strategies:
 * - 'padding': Adds keyboard height to bottom padding
 * - 'resize': Reduces container height by keyboard height
 * - 'position': Translates container up by keyboard height
 * - 'none': Returns layout unchanged
 *
 * The behavior property determines how the adjustment is applied:
 * - 'height': Modifies height property (for resize strategy)
 * - 'position': Modifies transform/translateY (for position strategy)
 * - 'padding': Modifies padding (for padding strategy)
 */
export function applyKeyboardAvoidance(
  layout: KeyboardAwareLayout,
  config: KeyboardConfig
): KeyboardAwareLayout {
  const keyboardHeight = getKeyboardHeight();

  // No keyboard or no avoidance needed
  if (keyboardHeight === 0 || config.avoidance === 'none') {
    return layout;
  }

  // Create a copy of the layout to avoid mutation
  const adjustedLayout: KeyboardAwareLayout = { ...layout };

  // Apply avoidance strategy
  switch (config.avoidance) {
    case 'padding': {
      // Add keyboard height to bottom padding
      const currentPadding = layout.padding ?? {};
      adjustedLayout.padding = {
        ...currentPadding,
        bottom: (currentPadding.bottom ?? 0) + keyboardHeight,
      };
      break;
    }

    case 'resize': {
      // Reduce container height by keyboard height
      if (typeof layout.height === 'number') {
        adjustedLayout.height = layout.height - keyboardHeight;
      }
      break;
    }

    case 'position': {
      // Translate container up by keyboard height
      const currentTransform = layout.transform ?? [];
      adjustedLayout.transform = [...currentTransform, { translateY: -keyboardHeight }];
      break;
    }

    default:
      // Unknown avoidance strategy, return unchanged
      break;
  }

  return adjustedLayout;
}

/**
 * React Native hook to track keyboard state
 *
 * @returns KeyboardState object with isVisible, height, progress
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const keyboard = useKeyboardAvoidance();
 *   return (
 *     <View style={{
 *       paddingBottom: keyboard.isVisible ? keyboard.height : 0
 *     }} />
 *   );
 * }
 * ```
 *
 * @remarks
 * This is a placeholder implementation that returns default values.
 * In production, integrate with react-native-keyboard-controller:
 *
 * ```typescript
 * import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
 *
 * export function useKeyboardAvoidance(): KeyboardState {
 *   const { height, progress } = useReanimatedKeyboardAnimation();
 *   return {
 *     isVisible: height.value > 0,
 *     height: height.value,
 *     progress: progress.value,
 *   };
 * }
 * ```
 *
 * @see https://github.com/kirillzyusko/react-native-keyboard-controller
 */
export function useKeyboardAvoidance(): KeyboardState {
  // Placeholder implementation
  // In production, use react-native-keyboard-controller or custom hook
  return {
    isVisible: false,
    height: 0,
    progress: 0,
  };
}

/**
 * Add keyboard event listener
 *
 * @param event - Event type to listen for ('show' | 'hide' | 'change')
 * @param listener - Callback function receiving keyboard height
 * @returns Cleanup function to remove listener
 *
 * @example
 * ```typescript
 * const unsubscribe = addKeyboardListener('show', (height) => {
 *   console.log('Keyboard shown with height:', height);
 * });
 *
 * // Later: unsubscribe();
 * ```
 *
 * @remarks
 * - On web: Returns no-op cleanup function (no keyboard events)
 * - On React Native: Uses Keyboard.addListener() API
 * - Supported events: 'show', 'hide', 'change'
 * - Always call the cleanup function to prevent memory leaks
 */
export function addKeyboardListener(
  event: KeyboardEventType,
  listener: KeyboardEventListener
): () => void {
  const platform = detectPlatform();

  // Web platform: no keyboard events
  if (platform === 'web') {
    return () => {
      // No-op cleanup
    };
  }

  // React Native: try to add listener
  if (isKeyboardAPIAvailable()) {
    try {
      const globalAny = global as any;
      const Keyboard = globalAny.Keyboard;

      // Map event type to React Native event names
      const eventName =
        event === 'show'
          ? 'keyboardDidShow'
          : event === 'hide'
            ? 'keyboardDidHide'
            : 'keyboardDidChangeFrame';

      // Create listener wrapper
      const wrappedListener = (e: { endCoordinates?: { height: number } }) => {
        const height = e.endCoordinates?.height ?? 0;
        listener(height);
      };

      // Add listener
      const subscription = Keyboard.addListener(eventName, wrappedListener);

      // Return cleanup function
      return () => {
        subscription?.remove?.();
      };
    } catch (error) {
      console.warn('[Keyboard] Failed to add keyboard listener:', error);
    }
  }

  // Fallback: return no-op cleanup
  return () => {
    // No-op cleanup
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get platform-specific keyboard animation duration
 *
 * @returns Animation duration in milliseconds
 *
 * @example
 * ```typescript
 * const duration = getKeyboardAnimationDuration();
 * // iOS: 250, Android: 300, Web: 0
 * ```
 *
 * @remarks
 * Default animation durations:
 * - iOS: 250ms (from UIKit keyboard animation)
 * - Android: 300ms (from WindowInsetsAnimationCompat)
 * - Web: 0ms (no keyboard animation)
 */
export function getKeyboardAnimationDuration(): number {
  const platform = detectPlatform();

  switch (platform) {
    case 'ios':
      return 250;
    case 'android':
      return 300;
    case 'web':
    default:
      return 0;
  }
}

/**
 * Calculate keyboard-aware bottom spacing
 *
 * @param baseSpacing - Base spacing value in points/dp
 * @param includeKeyboard - Whether to include keyboard height (default: true)
 * @returns Total spacing including keyboard height if applicable
 *
 * @example
 * ```typescript
 * // With keyboard visible (height: 336)
 * const spacing = getKeyboardAwareBottomSpacing(16, true);
 * console.log(spacing); // 352 (16 + 336)
 *
 * // Without keyboard consideration
 * const spacing = getKeyboardAwareBottomSpacing(16, false);
 * console.log(spacing); // 16
 * ```
 *
 * @remarks
 * Useful for calculating dynamic spacing that accounts for keyboard visibility.
 * Common use cases:
 * - Bottom padding for scrollable content
 * - Bottom margin for floating action buttons
 * - Bottom inset for safe area + keyboard
 */
export function getKeyboardAwareBottomSpacing(baseSpacing: number, includeKeyboard = true): number {
  if (!includeKeyboard) {
    return baseSpacing;
  }

  const keyboardHeight = getKeyboardHeight();
  return baseSpacing + keyboardHeight;
}

/**
 * Get default keyboard animation configuration for current platform
 *
 * @returns KeyboardAnimationConfig with platform-specific defaults
 *
 * @example
 * ```typescript
 * const animConfig = getDefaultKeyboardAnimation();
 * // iOS: { duration: 250, easing: 'keyboard', enabled: true }
 * // Android: { duration: 300, easing: 'keyboard', enabled: true }
 * // Web: { duration: 0, easing: 'linear', enabled: false }
 * ```
 */
export function getDefaultKeyboardAnimation(): KeyboardAnimationConfig {
  const platform = detectPlatform();

  switch (platform) {
    case 'ios':
      return {
        duration: 250,
        easing: 'keyboard',
        enabled: true,
      };
    case 'android':
      return {
        duration: 300,
        easing: 'keyboard',
        enabled: true,
      };
    case 'web':
    default:
      return {
        duration: 0,
        easing: 'linear',
        enabled: false,
      };
  }
}

/**
 * Check if keyboard is currently visible
 *
 * @returns True if keyboard is visible, false otherwise
 *
 * @example
 * ```typescript
 * if (isKeyboardVisible()) {
 *   console.log('Keyboard is visible');
 * }
 * ```
 */
export function isKeyboardVisible(): boolean {
  return getKeyboardHeight() > 0;
}

/**
 * Get keyboard behavior progress tracking mode
 *
 * @returns Progress tracking mode ('binary' for iOS, 'continuous' for Android, 'none' for web)
 *
 * @example
 * ```typescript
 * const mode = getKeyboardProgressMode();
 * // iOS: 'binary' (0 or 1 only)
 * // Android: 'continuous' (0, 0.07, 0.12, ..., 1.0)
 * // Web: 'none'
 * ```
 *
 * @remarks
 * iOS keyboard animations have binary progress (0 or 1) due to willShow/willHide notifications.
 * Android keyboard animations have continuous progress tracking via WindowInsetsAnimationCompat.
 */
export function getKeyboardProgressMode(): 'binary' | 'continuous' | 'none' {
  const platform = detectPlatform();

  switch (platform) {
    case 'ios':
      return 'binary';
    case 'android':
      return 'continuous';
    case 'web':
    default:
      return 'none';
  }
}
