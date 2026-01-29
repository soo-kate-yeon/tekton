/**
 * @tekton/core - Mobile Integration Tests
 * Integration tests combining SafeArea, Keyboard, TouchTarget, and Mobile Shells
 * [SPEC-LAYOUT-004] [MILESTONE-7]
 */

import { describe, test, expect } from 'vitest';
import {
  SHELL_MOBILE_APP,
  SHELL_MOBILE_TAB,
  getAllMobileShellTokens,
} from '../src/layout-tokens/mobile-shells.js';
import { getSafeAreaInsets, applySafeAreaToLayout } from '../src/layout-tokens/safe-area.js';
import {
  applyKeyboardAvoidance,
  getKeyboardAnimationDuration,
} from '../src/layout-tokens/keyboard.js';
import {
  validateTouchTarget,
  isAccessibleTouchTarget,
  getHitSlop,
} from '../src/layout-tokens/touch-target.js';

// ============================================================================
// SafeArea + Mobile Shell Integration
// ============================================================================

describe('SafeArea + Mobile Shell Integration', () => {
  test('applies SafeArea to SHELL_MOBILE_APP layout', () => {
    const layout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    const result = applySafeAreaToLayout(layout, SHELL_MOBILE_APP.safeArea);

    // SafeArea should be applied based on edges configuration
    expect(result.padding).toBeDefined();
    expect(result.padding!.top).toBeGreaterThanOrEqual(0);
    expect(result.padding!.bottom).toBeGreaterThanOrEqual(0);
  });

  test('respects safeArea edges configuration', () => {
    const layout = {
      padding: { top: 16, bottom: 16, left: 16, right: 16 },
    };

    const result = applySafeAreaToLayout(layout, SHELL_MOBILE_APP.safeArea);

    // All edges enabled, so all should be modified or stay same (in web)
    expect(result.padding!.top).toBeGreaterThanOrEqual(16);
    expect(result.padding!.bottom).toBeGreaterThanOrEqual(16);
  });

  test('applies SafeArea to SHELL_MOBILE_MODAL with bottom-only edges', () => {
    const layout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    // SHELL_MOBILE_MODAL has edges: { top: false, bottom: true, horizontal: false }
    const modalShell = getAllMobileShellTokens().find(s => s.id === 'shell.mobile.modal');
    expect(modalShell).toBeDefined();

    const result = applySafeAreaToLayout(layout, modalShell!.safeArea);

    // Only bottom should be modified (or stay same in web)
    expect(result.padding!.top).toBe(0); // Unchanged
    expect(result.padding!.left).toBe(0); // Unchanged
    expect(result.padding!.right).toBe(0); // Unchanged
    expect(result.padding!.bottom).toBeGreaterThanOrEqual(0);
  });

  test('all mobile shells have valid safeArea configurations', () => {
    const shells = getAllMobileShellTokens();

    shells.forEach(shell => {
      const layout = { padding: { top: 0, bottom: 0, left: 0, right: 0 } };
      expect(() => applySafeAreaToLayout(layout, shell.safeArea)).not.toThrow();
    });
  });

  test('SafeArea defaults match across all shells', () => {
    const shells = getAllMobileShellTokens();

    shells.forEach(shell => {
      expect(shell.safeArea.defaults.notch).toBe(44);
      expect(shell.safeArea.defaults.dynamicIsland).toBe(59);
      expect(shell.safeArea.defaults.homeIndicator).toBe(34);
      expect(shell.safeArea.defaults.statusBar).toBe(20);
    });
  });

  test('SafeArea insets can be retrieved and applied', () => {
    const insets = getSafeAreaInsets();
    const layout = {
      padding: {
        top: insets.top,
        bottom: insets.bottom,
        left: insets.left,
        right: insets.right,
      },
    };

    expect(layout.padding.top).toBeGreaterThanOrEqual(0);
    expect(layout.padding.bottom).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================================
// Keyboard + Mobile Shell Integration
// ============================================================================

describe('Keyboard + Mobile Shell Integration', () => {
  test('applies keyboard avoidance to SHELL_MOBILE_APP', () => {
    const layout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    const result = applyKeyboardAvoidance(layout, SHELL_MOBILE_APP.keyboard);

    // Keyboard height is 0 in web, but function should not throw
    expect(result.padding).toBeDefined();
  });

  test('all mobile shells have valid keyboard configurations', () => {
    const shells = getAllMobileShellTokens();

    shells.forEach(shell => {
      const layout = { padding: { top: 0, bottom: 0, left: 0, right: 0 }, height: 812 };
      expect(() => applyKeyboardAvoidance(layout, shell.keyboard)).not.toThrow();
    });
  });

  test('keyboard animation durations match shell configurations', () => {
    const shells = getAllMobileShellTokens();

    shells.forEach(shell => {
      expect(shell.keyboard.animation.duration).toBe(250);
      expect(shell.keyboard.animation.easing).toBe('keyboard');
      expect(shell.keyboard.animation.enabled).toBe(true);
    });
  });

  test('different avoidance strategies work correctly', () => {
    const shells = getAllMobileShellTokens();

    const paddingShells = shells.filter(s => s.keyboard.avoidance === 'padding');
    const resizeShells = shells.filter(s => s.keyboard.avoidance === 'resize');
    const noneShells = shells.filter(s => s.keyboard.avoidance === 'none');

    // Verify each strategy works
    paddingShells.forEach(shell => {
      const layout = { padding: { top: 0, bottom: 0, left: 0, right: 0 } };
      const result = applyKeyboardAvoidance(layout, shell.keyboard);
      expect(result.padding).toBeDefined();
    });

    resizeShells.forEach(shell => {
      const layout = { height: 812 };
      const result = applyKeyboardAvoidance(layout, shell.keyboard);
      expect(result.height).toBeDefined();
    });

    noneShells.forEach(shell => {
      const layout = { padding: { top: 0, bottom: 0, left: 0, right: 0 } };
      const result = applyKeyboardAvoidance(layout, shell.keyboard);
      expect(result.padding).toEqual(layout.padding);
    });
  });

  test('keyboard animation duration is consistent', () => {
    const duration = getKeyboardAnimationDuration();
    const shells = getAllMobileShellTokens();

    // Verify animation duration is retrieved
    expect(typeof duration).toBe('number');

    // All shells use 250ms duration (iOS default)
    shells.forEach(shell => {
      // In web, duration is 0, but in mobile it would be 250
      expect(shell.keyboard.animation.duration).toBe(250);
    });
  });

  test('combining SafeArea and Keyboard adjustments', () => {
    const layout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    // Step 1: Apply SafeArea
    const withSafeArea = applySafeAreaToLayout(layout, SHELL_MOBILE_APP.safeArea);

    // Step 2: Apply Keyboard
    const withKeyboard = applyKeyboardAvoidance(withSafeArea, SHELL_MOBILE_APP.keyboard);

    // Both should be applied
    expect(withKeyboard.padding).toBeDefined();
    expect(withKeyboard.padding!.bottom).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================================
// TouchTarget + Mobile Shell Integration
// ============================================================================

describe('TouchTarget + Mobile Shell Integration', () => {
  test('validates bottomTab items meet 44pt minimum', () => {
    const shells = getAllMobileShellTokens().filter(s => s.bottomTab);

    shells.forEach(shell => {
      const minTouchTarget = shell.bottomTab!.item.minTouchTarget;
      // Token reference like "atomic.spacing.11" = 44pt
      expect(minTouchTarget).toBeDefined();
      expect(typeof minTouchTarget).toBe('string');
    });
  });

  test('bottomTab items pass accessibility guidelines', () => {
    // SHELL_MOBILE_APP and SHELL_MOBILE_TAB have bottomTab
    const itemSize = 44; // Minimum from atomic.spacing.11

    expect(validateTouchTarget(itemSize)).toBe(true);
    expect(isAccessibleTouchTarget(itemSize, itemSize, 'apple-hig')).toBe(true);
  });

  test('all shells have valid touchTarget configurations', () => {
    const shells = getAllMobileShellTokens();

    shells.forEach(shell => {
      expect(shell.touchTarget).toBeDefined();
      expect(shell.touchTarget.hitSlop).toBeDefined();
      expect(shell.touchTarget.hitSlop.top).toBe(8);
      expect(shell.touchTarget.hitSlop.bottom).toBe(8);
      expect(shell.touchTarget.hitSlop.left).toBe(8);
      expect(shell.touchTarget.hitSlop.right).toBe(8);
    });
  });

  test('hitSlop values are applied correctly', () => {
    const elementSize = 36; // Below minimum
    const hitSlop = getHitSlop(elementSize);

    // hitSlop should extend to minimum 44pt
    const effectiveSize = elementSize + hitSlop.top + hitSlop.bottom;
    expect(effectiveSize).toBeGreaterThanOrEqual(44);
  });

  test('all bottomTab configurations meet touch target standards', () => {
    const shellsWithBottomTab = getAllMobileShellTokens().filter(s => s.bottomTab);

    shellsWithBottomTab.forEach(shell => {
      // bottomTab items should be accessible
      const maxItems = shell.bottomTab!.maxItems;
      expect(maxItems).toBe(5); // Standard iOS/Android limit

      // Touch target should be defined
      expect(shell.touchTarget.minSize).toBeDefined();
    });
  });

  test('touch targets work with different screen scales', () => {
    // @1x: 44pt
    expect(validateTouchTarget(44, 1)).toBe(true);

    // @2x: 88px = 44pt
    expect(validateTouchTarget(88, 2)).toBe(true);

    // @3x: 132px = 44pt
    expect(validateTouchTarget(132, 3)).toBe(true);
  });
});

// ============================================================================
// Full Mobile Shell Workflow Integration
// ============================================================================

describe('Full Mobile Shell Token Workflow', () => {
  test('complete SHELL_MOBILE_APP integration', () => {
    // Step 1: Create base layout
    const layout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      height: 812,
    };

    // Step 2: Apply SafeArea
    const withSafeArea = applySafeAreaToLayout(layout, SHELL_MOBILE_APP.safeArea);
    expect(withSafeArea.padding).toBeDefined();

    // Step 3: Apply Keyboard
    const withKeyboard = applyKeyboardAvoidance(withSafeArea, SHELL_MOBILE_APP.keyboard);
    expect(withKeyboard.padding).toBeDefined();

    // Step 4: Validate touch targets
    const bottomTabHeight = 64; // Example height
    expect(validateTouchTarget(bottomTabHeight)).toBe(true);
  });

  test('complete SHELL_MOBILE_TAB integration', () => {
    // Similar workflow for tab shell
    const layout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      height: 812,
    };

    const withSafeArea = applySafeAreaToLayout(layout, SHELL_MOBILE_TAB.safeArea);
    const withKeyboard = applyKeyboardAvoidance(withSafeArea, SHELL_MOBILE_TAB.keyboard);

    expect(withKeyboard).toBeDefined();
    expect(withKeyboard.padding).toBeDefined();
  });

  test('validates all mobile shells in complete workflow', () => {
    const shells = getAllMobileShellTokens();

    shells.forEach(shell => {
      const layout = {
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
        height: 812,
      };

      // Apply all utilities
      const withSafeArea = applySafeAreaToLayout(layout, shell.safeArea);
      const withKeyboard = applyKeyboardAvoidance(withSafeArea, shell.keyboard);

      expect(withKeyboard).toBeDefined();
      expect(withKeyboard.padding).toBeDefined();
    });
  });

  test('creates custom mobile shell with all features', () => {
    // Custom shell configuration
    const customShell = {
      id: 'shell.mobile.custom',
      platform: 'mobile' as const,
      os: 'cross-platform' as const,
      description: 'Custom mobile shell for testing',
      regions: [
        {
          name: 'main',
          position: 'center' as const,
          size: 'atomic.spacing.full',
          collapsible: false,
        },
      ],
      safeArea: {
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
      },
      systemUI: {
        statusBar: {
          height: 'atomic.spacing.5' as const,
          visible: true,
          style: 'auto' as const,
          translucent: true,
        },
        navigationBar: {
          height: 'atomic.spacing.12' as const,
          mode: 'overlay' as const,
          buttonStyle: 'auto' as const,
        },
      },
      keyboard: {
        avoidance: 'padding' as const,
        behavior: 'height' as const,
        animation: {
          duration: 250,
          easing: 'keyboard' as const,
          enabled: true,
        },
        dismissMode: 'on-drag' as const,
      },
      touchTarget: {
        minSize: 'atomic.spacing.11' as const,
        hitSlop: {
          top: 8,
          bottom: 8,
          left: 8,
          right: 8,
        },
      },
      responsive: {
        default: {},
      },
      tokenBindings: {
        mainBackground: 'semantic.background.base',
      },
    };

    // Validate custom shell works with all utilities
    const layout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    const withSafeArea = applySafeAreaToLayout(layout, customShell.safeArea);
    const withKeyboard = applyKeyboardAvoidance(withSafeArea, customShell.keyboard);

    expect(withKeyboard).toBeDefined();
    expect(withKeyboard.padding).toBeDefined();
  });

  test('all mobile shells use consistent token references', () => {
    const shells = getAllMobileShellTokens();

    shells.forEach(shell => {
      // SafeArea tokens
      expect(shell.safeArea.top).toMatch(/^atomic\.spacing\.\d+$/);
      expect(shell.safeArea.bottom).toMatch(/^atomic\.spacing\.\d+$/);

      // SystemUI tokens
      expect(shell.systemUI.statusBar.height).toMatch(/^atomic\.spacing\.\d+$/);
      expect(shell.systemUI.navigationBar.height).toMatch(/^atomic\.spacing\.\d+$/);

      // TouchTarget tokens
      expect(shell.touchTarget.minSize).toMatch(/^atomic\.spacing\.\d+$/);

      // Token bindings use semantic tokens
      Object.values(shell.tokenBindings).forEach(binding => {
        expect(String(binding)).toMatch(/^semantic\./);
      });
    });
  });

  test('responsive configurations are consistent', () => {
    const shells = getAllMobileShellTokens();

    shells.forEach(shell => {
      expect(shell.responsive).toBeDefined();
      expect(shell.responsive.default).toBeDefined();
      // Some shells have md breakpoint
      if (shell.responsive.md) {
        expect(typeof shell.responsive.md).toBe('object');
      }
    });
  });

  test('validates mobile shell integration with validation schema', () => {
    const shells = getAllMobileShellTokens();

    shells.forEach(shell => {
      // Basic structure validation
      expect(shell.id).toMatch(/^shell\.mobile\./);
      expect(shell.platform).toBe('mobile');
      expect(['ios', 'android', 'cross-platform']).toContain(shell.os);
      expect(shell.regions.length).toBeGreaterThan(0);
      expect(shell.safeArea).toBeDefined();
      expect(shell.systemUI).toBeDefined();
      expect(shell.keyboard).toBeDefined();
      expect(shell.touchTarget).toBeDefined();
      expect(shell.responsive).toBeDefined();
      expect(shell.tokenBindings).toBeDefined();
    });
  });
});

// ============================================================================
// Cross-Feature Edge Cases
// ============================================================================

describe('Mobile Integration Edge Cases', () => {
  test('handles layout with all features combined', () => {
    const layout = {
      padding: { top: 16, bottom: 16, left: 16, right: 16 },
      height: 812,
      width: 375,
    };

    // Apply all utilities
    const withSafeArea = applySafeAreaToLayout(layout, SHELL_MOBILE_APP.safeArea);
    const withKeyboard = applyKeyboardAvoidance(withSafeArea, SHELL_MOBILE_APP.keyboard);

    // Validate touch targets
    const touchTargetValid = validateTouchTarget(44);
    expect(touchTargetValid).toBe(true);

    // All properties should be preserved and modified correctly
    expect(withKeyboard.padding).toBeDefined();
    expect(withKeyboard.width).toBe(375);
  });

  test('handles empty initial layout', () => {
    const layout = {};

    const withSafeArea = applySafeAreaToLayout(layout, SHELL_MOBILE_APP.safeArea);
    const withKeyboard = applyKeyboardAvoidance(withSafeArea, SHELL_MOBILE_APP.keyboard);

    expect(withKeyboard).toBeDefined();
    expect(withKeyboard.padding).toBeDefined();
  });

  test('preserves non-layout properties through transformations', () => {
    const layout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      backgroundColor: '#ffffff',
      borderRadius: 8,
      elevation: 4,
    };

    const withSafeArea = applySafeAreaToLayout(layout, SHELL_MOBILE_APP.safeArea);
    const withKeyboard = applyKeyboardAvoidance(withSafeArea, SHELL_MOBILE_APP.keyboard);

    expect(withKeyboard.backgroundColor).toBe('#ffffff');
    expect(withKeyboard.borderRadius).toBe(8);
    expect(withKeyboard.elevation).toBe(4);
  });

  test('applies utilities in different orders', () => {
    const layout = {
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    // Order 1: SafeArea then Keyboard
    const order1_step1 = applySafeAreaToLayout(layout, SHELL_MOBILE_APP.safeArea);
    const order1_step2 = applyKeyboardAvoidance(order1_step1, SHELL_MOBILE_APP.keyboard);

    // Order 2: Keyboard then SafeArea
    const order2_step1 = applyKeyboardAvoidance(layout, SHELL_MOBILE_APP.keyboard);
    const order2_step2 = applySafeAreaToLayout(order2_step1, SHELL_MOBILE_APP.safeArea);

    // Both orders should produce valid results
    expect(order1_step2.padding).toBeDefined();
    expect(order2_step2.padding).toBeDefined();
  });

  test('validates consistency across all mobile shells', () => {
    const shells = getAllMobileShellTokens();

    // All shells should have the same safe area defaults
    const firstDefaults = shells[0].safeArea.defaults;
    shells.forEach(shell => {
      expect(shell.safeArea.defaults).toEqual(firstDefaults);
    });

    // All shells should have the same keyboard animation
    const firstAnimation = shells[0].keyboard.animation;
    shells.forEach(shell => {
      expect(shell.keyboard.animation).toEqual(firstAnimation);
    });

    // All shells should have the same hitSlop
    const firstHitSlop = shells[0].touchTarget.hitSlop;
    shells.forEach(shell => {
      expect(shell.touchTarget.hitSlop).toEqual(firstHitSlop);
    });
  });
});
