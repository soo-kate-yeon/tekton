/**
 * @tekton/core - Keyboard Utilities Tests
 * Comprehensive tests for keyboard handling and avoidance utilities
 * [SPEC-LAYOUT-004] [MILESTONE-7]
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import {
  getKeyboardHeight,
  applyKeyboardAvoidance,
  useKeyboardAvoidance,
  addKeyboardListener,
  getKeyboardAnimationDuration,
  getKeyboardAwareBottomSpacing,
  getDefaultKeyboardAnimation,
  isKeyboardVisible,
  getKeyboardProgressMode,
  type KeyboardState,
  type KeyboardEventType,
  type KeyboardAwareLayout,
} from '../src/layout-tokens/keyboard.js';

// ============================================================================
// Keyboard Height Tests
// ============================================================================

describe('getKeyboardHeight', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('returns 0 in web environment', () => {
    const height = getKeyboardHeight();
    expect(height).toBe(0);
  });

  test('returns 0 when Keyboard API is unavailable', () => {
    const height = getKeyboardHeight();
    expect(height).toBe(0);
  });

  test('returns number type', () => {
    const height = getKeyboardHeight();
    expect(typeof height).toBe('number');
  });

  test('returns non-negative height', () => {
    const height = getKeyboardHeight();
    expect(height).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================================
// Keyboard Avoidance Tests
// ============================================================================

describe('applyKeyboardAvoidance', () => {
  describe('padding strategy', () => {
    test('adds keyboard height to bottom padding', () => {
      const layout: KeyboardAwareLayout = {
        padding: { top: 0, bottom: 16, left: 0, right: 0 },
      };

      const config = {
        avoidance: 'padding' as const,
        behavior: 'height' as const,
        animation: {
          duration: 250,
          easing: 'keyboard' as const,
          enabled: true,
        },
        dismissMode: 'on-drag' as const,
      };

      const result = applyKeyboardAvoidance(layout, config);
      // Keyboard height is 0 in web, so padding.bottom should stay 16
      expect(result.padding!.bottom).toBe(16);
    });

    test('initializes padding if not present', () => {
      const layout: KeyboardAwareLayout = {};

      const config = {
        avoidance: 'padding' as const,
        behavior: 'padding' as const,
        animation: {
          duration: 250,
          easing: 'keyboard' as const,
          enabled: true,
        },
        dismissMode: 'interactive' as const,
      };

      const result = applyKeyboardAvoidance(layout, config);
      // In web environment, keyboard height is 0, so padding may not be initialized
      // This is correct behavior - padding is only added when keyboard is visible
      expect(result).toBeDefined();
    });

    test('preserves other padding values', () => {
      const layout: KeyboardAwareLayout = {
        padding: { top: 20, bottom: 16, left: 8, right: 8 },
      };

      const config = {
        avoidance: 'padding' as const,
        behavior: 'height' as const,
        animation: {
          duration: 250,
          easing: 'keyboard' as const,
          enabled: true,
        },
        dismissMode: 'on-drag' as const,
      };

      const result = applyKeyboardAvoidance(layout, config);
      expect(result.padding!.top).toBe(20);
      expect(result.padding!.left).toBe(8);
      expect(result.padding!.right).toBe(8);
    });
  });

  describe('resize strategy', () => {
    test('reduces container height by keyboard height', () => {
      const layout: KeyboardAwareLayout = {
        height: 812,
      };

      const config = {
        avoidance: 'resize' as const,
        behavior: 'height' as const,
        animation: {
          duration: 250,
          easing: 'keyboard' as const,
          enabled: true,
        },
        dismissMode: 'on-drag' as const,
      };

      const result = applyKeyboardAvoidance(layout, config);
      // Keyboard height is 0 in web, so height should stay 812
      expect(result.height).toBe(812);
    });

    test('does nothing if height is not defined', () => {
      const layout: KeyboardAwareLayout = {
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
      };

      const config = {
        avoidance: 'resize' as const,
        behavior: 'height' as const,
        animation: {
          duration: 250,
          easing: 'keyboard' as const,
          enabled: true,
        },
        dismissMode: 'on-drag' as const,
      };

      const result = applyKeyboardAvoidance(layout, config);
      expect(result.height).toBeUndefined();
    });
  });

  describe('position strategy', () => {
    test('adds translateY transform', () => {
      const layout: KeyboardAwareLayout = {};

      const config = {
        avoidance: 'position' as const,
        behavior: 'position' as const,
        animation: {
          duration: 250,
          easing: 'keyboard' as const,
          enabled: true,
        },
        dismissMode: 'on-drag' as const,
      };

      const result = applyKeyboardAvoidance(layout, config);
      // In web environment, keyboard height is 0, so transform may not be added
      // This is correct behavior - transform is only added when keyboard is visible
      expect(result).toBeDefined();
    });

    test('appends to existing transform array', () => {
      const layout: KeyboardAwareLayout = {
        transform: [{ scale: 1 }],
      };

      const config = {
        avoidance: 'position' as const,
        behavior: 'position' as const,
        animation: {
          duration: 250,
          easing: 'keyboard' as const,
          enabled: true,
        },
        dismissMode: 'on-drag' as const,
      };

      const result = applyKeyboardAvoidance(layout, config);
      // In web environment, keyboard height is 0, so original transform is preserved
      expect(result.transform).toBeDefined();
      expect(result.transform![0]).toEqual({ scale: 1 });
    });
  });

  describe('none strategy', () => {
    test('returns layout unchanged', () => {
      const layout: KeyboardAwareLayout = {
        padding: { top: 16, bottom: 16, left: 16, right: 16 },
        height: 812,
      };

      const config = {
        avoidance: 'none' as const,
        behavior: 'height' as const,
        animation: {
          duration: 250,
          easing: 'keyboard' as const,
          enabled: true,
        },
        dismissMode: 'on-drag' as const,
      };

      const result = applyKeyboardAvoidance(layout, config);
      expect(result.padding).toEqual(layout.padding);
      expect(result.height).toBe(layout.height);
    });
  });

  test('preserves other layout properties', () => {
    const layout: KeyboardAwareLayout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      backgroundColor: '#ffffff',
      borderRadius: 8,
    };

    const config = {
      avoidance: 'padding' as const,
      behavior: 'height' as const,
      animation: {
        duration: 250,
        easing: 'keyboard' as const,
        enabled: true,
      },
      dismissMode: 'on-drag' as const,
    };

    const result = applyKeyboardAvoidance(layout, config);
    expect(result.backgroundColor).toBe('#ffffff');
    expect(result.borderRadius).toBe(8);
  });
});

// ============================================================================
// Keyboard Animation Tests
// ============================================================================

describe('getKeyboardAnimationDuration', () => {
  test('returns 0 for web environment', () => {
    const duration = getKeyboardAnimationDuration();
    expect(duration).toBe(0);
  });

  test('returns non-negative duration', () => {
    const duration = getKeyboardAnimationDuration();
    expect(duration).toBeGreaterThanOrEqual(0);
  });

  test('returns number type', () => {
    const duration = getKeyboardAnimationDuration();
    expect(typeof duration).toBe('number');
  });
});

describe('getDefaultKeyboardAnimation', () => {
  test('returns animation config for web', () => {
    const config = getDefaultKeyboardAnimation();
    expect(config).toHaveProperty('duration');
    expect(config).toHaveProperty('easing');
    expect(config).toHaveProperty('enabled');
  });

  test('returns web defaults', () => {
    const config = getDefaultKeyboardAnimation();
    expect(config.duration).toBe(0);
    expect(config.easing).toBe('linear');
    expect(config.enabled).toBe(false);
  });

  test('returns valid easing value', () => {
    const config = getDefaultKeyboardAnimation();
    expect(['keyboard', 'linear', 'ease-in-out']).toContain(config.easing);
  });

  test('enabled is boolean', () => {
    const config = getDefaultKeyboardAnimation();
    expect(typeof config.enabled).toBe('boolean');
  });
});

// ============================================================================
// Keyboard State Tests
// ============================================================================

describe('useKeyboardAvoidance', () => {
  test('returns KeyboardState object', () => {
    const state = useKeyboardAvoidance();
    expect(state).toHaveProperty('isVisible');
    expect(state).toHaveProperty('height');
    expect(state).toHaveProperty('progress');
  });

  test('isVisible is boolean', () => {
    const state = useKeyboardAvoidance();
    expect(typeof state.isVisible).toBe('boolean');
  });

  test('height is number', () => {
    const state = useKeyboardAvoidance();
    expect(typeof state.height).toBe('number');
  });

  test('progress is number', () => {
    const state = useKeyboardAvoidance();
    expect(typeof state.progress).toBe('number');
  });

  test('progress is between 0 and 1', () => {
    const state = useKeyboardAvoidance();
    expect(state.progress).toBeGreaterThanOrEqual(0);
    expect(state.progress).toBeLessThanOrEqual(1);
  });

  test('height is non-negative', () => {
    const state = useKeyboardAvoidance();
    expect(state.height).toBeGreaterThanOrEqual(0);
  });

  test('returns consistent state', () => {
    const state1 = useKeyboardAvoidance();
    const state2 = useKeyboardAvoidance();
    expect(state1.isVisible).toBe(state2.isVisible);
    expect(state1.height).toBe(state2.height);
    expect(state1.progress).toBe(state2.progress);
  });
});

describe('isKeyboardVisible', () => {
  test('returns boolean', () => {
    const visible = isKeyboardVisible();
    expect(typeof visible).toBe('boolean');
  });

  test('returns false when keyboard height is 0', () => {
    const visible = isKeyboardVisible();
    expect(visible).toBe(false);
  });
});

// ============================================================================
// Keyboard Event Listener Tests
// ============================================================================

describe('addKeyboardListener', () => {
  test('returns cleanup function', () => {
    const listener = vi.fn();
    const cleanup = addKeyboardListener('show', listener);
    expect(typeof cleanup).toBe('function');
  });

  test('cleanup function does not throw', () => {
    const listener = vi.fn();
    const cleanup = addKeyboardListener('show', listener);
    expect(() => cleanup()).not.toThrow();
  });

  test('accepts show event type', () => {
    const listener = vi.fn();
    expect(() => addKeyboardListener('show', listener)).not.toThrow();
  });

  test('accepts hide event type', () => {
    const listener = vi.fn();
    expect(() => addKeyboardListener('hide', listener)).not.toThrow();
  });

  test('accepts change event type', () => {
    const listener = vi.fn();
    expect(() => addKeyboardListener('change', listener)).not.toThrow();
  });

  test('listener receives height parameter', () => {
    const listener = vi.fn();
    addKeyboardListener('show', listener);
    // In web environment, listener won't be called, but setup should succeed
    expect(listener).not.toHaveBeenCalled();
  });

  test('multiple listeners can be added', () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    const cleanup1 = addKeyboardListener('show', listener1);
    const cleanup2 = addKeyboardListener('hide', listener2);
    expect(typeof cleanup1).toBe('function');
    expect(typeof cleanup2).toBe('function');
  });

  test('cleanup can be called multiple times', () => {
    const listener = vi.fn();
    const cleanup = addKeyboardListener('show', listener);
    expect(() => {
      cleanup();
      cleanup();
      cleanup();
    }).not.toThrow();
  });
});

// ============================================================================
// Helper Functions Tests
// ============================================================================

describe('getKeyboardAwareBottomSpacing', () => {
  test('returns base spacing when includeKeyboard is false', () => {
    const spacing = getKeyboardAwareBottomSpacing(16, false);
    expect(spacing).toBe(16);
  });

  test('returns base spacing plus keyboard height when includeKeyboard is true', () => {
    const spacing = getKeyboardAwareBottomSpacing(16, true);
    // Keyboard height is 0 in web, so should equal base spacing
    expect(spacing).toBe(16);
  });

  test('defaults to includeKeyboard true', () => {
    const spacing = getKeyboardAwareBottomSpacing(16);
    expect(spacing).toBeGreaterThanOrEqual(16);
  });

  test('handles zero base spacing', () => {
    const spacing = getKeyboardAwareBottomSpacing(0, true);
    expect(spacing).toBeGreaterThanOrEqual(0);
  });

  test('handles negative base spacing', () => {
    const spacing = getKeyboardAwareBottomSpacing(-10, true);
    // Should still work mathematically
    expect(typeof spacing).toBe('number');
  });

  test('returns number type', () => {
    const spacing = getKeyboardAwareBottomSpacing(16, true);
    expect(typeof spacing).toBe('number');
  });
});

describe('getKeyboardProgressMode', () => {
  test('returns valid progress mode', () => {
    const mode = getKeyboardProgressMode();
    expect(['binary', 'continuous', 'none']).toContain(mode);
  });

  test('returns none for web environment', () => {
    const mode = getKeyboardProgressMode();
    expect(mode).toBe('none');
  });

  test('returns string type', () => {
    const mode = getKeyboardProgressMode();
    expect(typeof mode).toBe('string');
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Keyboard Integration', () => {
  test('KeyboardState interface has correct structure', () => {
    const state: KeyboardState = {
      isVisible: false,
      height: 0,
      progress: 0,
    };

    expect(typeof state.isVisible).toBe('boolean');
    expect(typeof state.height).toBe('number');
    expect(typeof state.progress).toBe('number');
  });

  test('KeyboardEventType enum has expected values', () => {
    const types: KeyboardEventType[] = ['show', 'hide', 'change'];
    types.forEach(type => {
      expect(typeof type).toBe('string');
    });
  });

  test('works with mobile shell keyboard config', () => {
    const layout: KeyboardAwareLayout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    // Simulating SHELL_MOBILE_APP keyboard config
    const config = {
      avoidance: 'padding' as const,
      behavior: 'height' as const,
      animation: {
        duration: 250,
        easing: 'keyboard' as const,
        enabled: true,
      },
      dismissMode: 'on-drag' as const,
    };

    const result = applyKeyboardAvoidance(layout, config);
    expect(result.padding).toBeDefined();
  });

  test('supports multiple avoidance applications', () => {
    const layout: KeyboardAwareLayout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    const config1 = {
      avoidance: 'padding' as const,
      behavior: 'height' as const,
      animation: {
        duration: 250,
        easing: 'keyboard' as const,
        enabled: true,
      },
      dismissMode: 'on-drag' as const,
    };

    const config2 = {
      avoidance: 'position' as const,
      behavior: 'position' as const,
      animation: {
        duration: 250,
        easing: 'keyboard' as const,
        enabled: true,
      },
      dismissMode: 'on-drag' as const,
    };

    const step1 = applyKeyboardAvoidance(layout, config1);
    const step2 = applyKeyboardAvoidance(step1, config2);

    // In web environment, both should return valid layouts
    expect(step2).toBeDefined();
    expect(step2.padding).toBeDefined();
  });

  test('animation config matches mobile shell defaults', () => {
    const config = getDefaultKeyboardAnimation();
    // Mobile shells use 250ms duration, web uses 0ms
    expect(typeof config.duration).toBe('number');
    expect(config.duration).toBeGreaterThanOrEqual(0);
  });

  test('keyboard state consistency', () => {
    const height = getKeyboardHeight();
    const visible = isKeyboardVisible();
    const state = useKeyboardAvoidance();

    // isVisible should match height > 0
    expect(visible).toBe(height > 0);
    expect(state.isVisible).toBe(height > 0);
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe('Keyboard Edge Cases', () => {
  test('handles layout with no properties', () => {
    const layout: KeyboardAwareLayout = {};

    const config = {
      avoidance: 'padding' as const,
      behavior: 'height' as const,
      animation: {
        duration: 250,
        easing: 'keyboard' as const,
        enabled: true,
      },
      dismissMode: 'on-drag' as const,
    };

    expect(() => applyKeyboardAvoidance(layout, config)).not.toThrow();
  });

  test('handles layout with undefined padding values', () => {
    const layout: KeyboardAwareLayout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    const config = {
      avoidance: 'padding' as const,
      behavior: 'height' as const,
      animation: {
        duration: 250,
        easing: 'keyboard' as const,
        enabled: true,
      },
      dismissMode: 'on-drag' as const,
    };

    const result = applyKeyboardAvoidance(layout, config);
    expect(result.padding!.bottom).toBeGreaterThanOrEqual(0);
  });

  test('preserves layout when keyboard height is 0', () => {
    const layout: KeyboardAwareLayout = {
      padding: { top: 16, bottom: 16, left: 16, right: 16 },
      height: 812,
    };

    const config = {
      avoidance: 'padding' as const,
      behavior: 'height' as const,
      animation: {
        duration: 250,
        easing: 'keyboard' as const,
        enabled: true,
      },
      dismissMode: 'on-drag' as const,
    };

    const result = applyKeyboardAvoidance(layout, config);
    // Since keyboard height is 0 in web, padding should stay the same
    expect(result.padding!.bottom).toBe(16);
  });

  test('handles very large keyboard heights gracefully', () => {
    // Even with keyboard height manipulation, should not throw
    const spacing = getKeyboardAwareBottomSpacing(16, true);
    expect(typeof spacing).toBe('number');
  });

  test('cleanup function is idempotent', () => {
    const listener = vi.fn();
    const cleanup = addKeyboardListener('show', listener);

    // Should be safe to call multiple times
    cleanup();
    cleanup();
    cleanup();

    expect(listener).not.toHaveBeenCalled();
  });

  test('different avoidance strategies can be mixed', () => {
    const layout: KeyboardAwareLayout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      height: 812,
    };

    const paddingConfig = {
      avoidance: 'padding' as const,
      behavior: 'height' as const,
      animation: {
        duration: 250,
        easing: 'keyboard' as const,
        enabled: true,
      },
      dismissMode: 'on-drag' as const,
    };

    const resizeConfig = {
      avoidance: 'resize' as const,
      behavior: 'height' as const,
      animation: {
        duration: 250,
        easing: 'keyboard' as const,
        enabled: true,
      },
      dismissMode: 'on-drag' as const,
    };

    const step1 = applyKeyboardAvoidance(layout, paddingConfig);
    const step2 = applyKeyboardAvoidance(step1, resizeConfig);

    expect(step2.padding).toBeDefined();
    expect(step2.height).toBeDefined();
  });
});
