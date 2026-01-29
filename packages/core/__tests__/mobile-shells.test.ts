/**
 * @tekton/core - Mobile Shell Token Tests
 * Comprehensive tests for all 6 mobile shell tokens and utility functions
 * [SPEC-LAYOUT-004] [MILESTONE-7]
 */

import { describe, test, expect } from 'vitest';
import {
  SHELL_MOBILE_APP,
  SHELL_MOBILE_FULLSCREEN,
  SHELL_MOBILE_MODAL,
  SHELL_MOBILE_TAB,
  SHELL_MOBILE_DRAWER,
  SHELL_MOBILE_DETAIL,
  getMobileShellToken,
  getAllMobileShellTokens,
  getMobileShellsByOS,
} from '../src/layout-tokens/mobile-shells.js';
import { validateMobileShellToken } from '../src/layout-validation.js';

// ============================================================================
// Individual Mobile Shell Token Tests
// ============================================================================

describe('Mobile Shell Token Definitions', () => {
  describe('SHELL_MOBILE_APP', () => {
    test('should have correct id, platform, and os', () => {
      expect(SHELL_MOBILE_APP.id).toBe('shell.mobile.app');
      expect(SHELL_MOBILE_APP.platform).toBe('mobile');
      expect(SHELL_MOBILE_APP.os).toBe('cross-platform');
    });

    test('should have 3 regions: header, main, bottomTab', () => {
      expect(SHELL_MOBILE_APP.regions).toHaveLength(3);
      const regionNames = SHELL_MOBILE_APP.regions.map(r => r.name);
      expect(regionNames).toContain('header');
      expect(regionNames).toContain('main');
      expect(regionNames).toContain('bottomTab');
    });

    test('should have collapsible bottomTab', () => {
      const bottomTab = SHELL_MOBILE_APP.regions.find(r => r.name === 'bottomTab');
      expect(bottomTab?.collapsible).toBe(true);
    });

    test('should have safe area configuration', () => {
      expect(SHELL_MOBILE_APP.safeArea).toBeDefined();
      expect(SHELL_MOBILE_APP.safeArea.defaults.notch).toBe(44);
      expect(SHELL_MOBILE_APP.safeArea.defaults.dynamicIsland).toBe(59);
      expect(SHELL_MOBILE_APP.safeArea.defaults.homeIndicator).toBe(34);
      expect(SHELL_MOBILE_APP.safeArea.defaults.statusBar).toBe(20);
    });

    test('should have safe area edges configuration', () => {
      expect(SHELL_MOBILE_APP.safeArea.edges.top).toBe(true);
      expect(SHELL_MOBILE_APP.safeArea.edges.bottom).toBe(true);
      expect(SHELL_MOBILE_APP.safeArea.edges.horizontal).toBe(true);
    });

    test('should have systemUI configuration', () => {
      expect(SHELL_MOBILE_APP.systemUI).toBeDefined();
      expect(SHELL_MOBILE_APP.systemUI.statusBar.visible).toBe(true);
      expect(SHELL_MOBILE_APP.systemUI.statusBar.style).toBe('auto');
      expect(SHELL_MOBILE_APP.systemUI.navigationBar.mode).toBe('overlay');
    });

    test('should have keyboard configuration', () => {
      expect(SHELL_MOBILE_APP.keyboard).toBeDefined();
      expect(SHELL_MOBILE_APP.keyboard.avoidance).toBe('padding');
      expect(SHELL_MOBILE_APP.keyboard.behavior).toBe('height');
      expect(SHELL_MOBILE_APP.keyboard.animation.duration).toBe(250);
    });

    test('should have bottomTab configuration', () => {
      expect(SHELL_MOBILE_APP.bottomTab).toBeDefined();
      expect(SHELL_MOBILE_APP.bottomTab!.maxItems).toBe(5);
      expect(SHELL_MOBILE_APP.bottomTab!.visibility).toBe('always');
    });

    test('should have touch target configuration', () => {
      expect(SHELL_MOBILE_APP.touchTarget).toBeDefined();
      expect(SHELL_MOBILE_APP.touchTarget.hitSlop.top).toBe(8);
      expect(SHELL_MOBILE_APP.touchTarget.hitSlop.bottom).toBe(8);
    });

    test('should have responsive configuration', () => {
      expect(SHELL_MOBILE_APP.responsive.default).toBeDefined();
      expect(SHELL_MOBILE_APP.responsive.default.headerVisible).toBe(true);
      expect(SHELL_MOBILE_APP.responsive.default.bottomTabVisible).toBe(true);
    });

    test('should have token bindings', () => {
      expect(Object.keys(SHELL_MOBILE_APP.tokenBindings).length).toBeGreaterThan(0);
      expect(SHELL_MOBILE_APP.tokenBindings.headerBackground).toBeDefined();
      expect(SHELL_MOBILE_APP.tokenBindings.mainBackground).toBeDefined();
      expect(SHELL_MOBILE_APP.tokenBindings.bottomTabBackground).toBeDefined();
    });

    test('should pass validateMobileShellToken', () => {
      expect(() => validateMobileShellToken(SHELL_MOBILE_APP)).not.toThrow();
      const validated = validateMobileShellToken(SHELL_MOBILE_APP);
      expect(validated.id).toBe('shell.mobile.app');
    });
  });

  describe('SHELL_MOBILE_FULLSCREEN', () => {
    test('should have correct id, platform, and os', () => {
      expect(SHELL_MOBILE_FULLSCREEN.id).toBe('shell.mobile.fullscreen');
      expect(SHELL_MOBILE_FULLSCREEN.platform).toBe('mobile');
      expect(SHELL_MOBILE_FULLSCREEN.os).toBe('cross-platform');
    });

    test('should have only 1 region: main', () => {
      expect(SHELL_MOBILE_FULLSCREEN.regions).toHaveLength(1);
      expect(SHELL_MOBILE_FULLSCREEN.regions[0].name).toBe('main');
    });

    test('should have keyboard avoidance set to none', () => {
      expect(SHELL_MOBILE_FULLSCREEN.keyboard.avoidance).toBe('none');
    });

    test('should have safe area configuration', () => {
      expect(SHELL_MOBILE_FULLSCREEN.safeArea).toBeDefined();
      expect(SHELL_MOBILE_FULLSCREEN.safeArea.edges.top).toBe(true);
      expect(SHELL_MOBILE_FULLSCREEN.safeArea.edges.bottom).toBe(true);
    });

    test('should have responsive configuration with contentFit', () => {
      expect(SHELL_MOBILE_FULLSCREEN.responsive.default.contentFit).toBe('cover');
      expect(SHELL_MOBILE_FULLSCREEN.responsive.md?.contentFit).toBe('contain');
    });

    test('should not have bottomTab configuration', () => {
      expect(SHELL_MOBILE_FULLSCREEN.bottomTab).toBeUndefined();
    });

    test('should have touch target configuration', () => {
      expect(SHELL_MOBILE_FULLSCREEN.touchTarget).toBeDefined();
    });

    test('should have systemUI configuration', () => {
      expect(SHELL_MOBILE_FULLSCREEN.systemUI.statusBar.visible).toBe(true);
    });

    test('should have token bindings', () => {
      expect(SHELL_MOBILE_FULLSCREEN.tokenBindings.mainBackground).toBeDefined();
    });

    test('should pass validateMobileShellToken', () => {
      expect(() => validateMobileShellToken(SHELL_MOBILE_FULLSCREEN)).not.toThrow();
    });
  });

  describe('SHELL_MOBILE_MODAL', () => {
    test('should have correct id, platform, and os', () => {
      expect(SHELL_MOBILE_MODAL.id).toBe('shell.mobile.modal');
      expect(SHELL_MOBILE_MODAL.platform).toBe('mobile');
      expect(SHELL_MOBILE_MODAL.os).toBe('cross-platform');
    });

    test('should have 2 regions: handle, content', () => {
      expect(SHELL_MOBILE_MODAL.regions).toHaveLength(2);
      const regionNames = SHELL_MOBILE_MODAL.regions.map(r => r.name);
      expect(regionNames).toContain('handle');
      expect(regionNames).toContain('content');
    });

    test('should have safe area bottom edge enabled', () => {
      expect(SHELL_MOBILE_MODAL.safeArea.edges.top).toBe(false);
      expect(SHELL_MOBILE_MODAL.safeArea.edges.bottom).toBe(true);
      expect(SHELL_MOBILE_MODAL.safeArea.edges.horizontal).toBe(false);
    });

    test('should have keyboard behavior set to padding', () => {
      expect(SHELL_MOBILE_MODAL.keyboard.avoidance).toBe('padding');
      expect(SHELL_MOBILE_MODAL.keyboard.behavior).toBe('padding');
    });

    test('should have responsive configuration with maxHeight', () => {
      expect(SHELL_MOBILE_MODAL.responsive.default.maxHeight).toBe('90%');
      expect(SHELL_MOBILE_MODAL.responsive.md?.maxHeight).toBe('80%');
    });

    test('should have overlay background in token bindings', () => {
      expect(SHELL_MOBILE_MODAL.tokenBindings.overlayBackground).toBeDefined();
      expect(SHELL_MOBILE_MODAL.tokenBindings.handleBackground).toBeDefined();
    });

    test('should have systemUI configuration', () => {
      expect(SHELL_MOBILE_MODAL.systemUI).toBeDefined();
    });

    test('should have touch target configuration', () => {
      expect(SHELL_MOBILE_MODAL.touchTarget).toBeDefined();
    });

    test('should not have bottomTab configuration', () => {
      expect(SHELL_MOBILE_MODAL.bottomTab).toBeUndefined();
    });

    test('should pass validateMobileShellToken', () => {
      expect(() => validateMobileShellToken(SHELL_MOBILE_MODAL)).not.toThrow();
    });
  });

  describe('SHELL_MOBILE_TAB', () => {
    test('should have correct id, platform, and os', () => {
      expect(SHELL_MOBILE_TAB.id).toBe('shell.mobile.tab');
      expect(SHELL_MOBILE_TAB.platform).toBe('mobile');
      expect(SHELL_MOBILE_TAB.os).toBe('cross-platform');
    });

    test('should have 2 regions: main, bottomTab', () => {
      expect(SHELL_MOBILE_TAB.regions).toHaveLength(2);
      const regionNames = SHELL_MOBILE_TAB.regions.map(r => r.name);
      expect(regionNames).toContain('main');
      expect(regionNames).toContain('bottomTab');
    });

    test('should have non-collapsible bottomTab', () => {
      const bottomTab = SHELL_MOBILE_TAB.regions.find(r => r.name === 'bottomTab');
      expect(bottomTab?.collapsible).toBe(false);
    });

    test('should have keyboard avoidance set to resize', () => {
      expect(SHELL_MOBILE_TAB.keyboard.avoidance).toBe('resize');
    });

    test('should have bottomTab configuration', () => {
      expect(SHELL_MOBILE_TAB.bottomTab).toBeDefined();
      expect(SHELL_MOBILE_TAB.bottomTab!.maxItems).toBe(5);
      expect(SHELL_MOBILE_TAB.bottomTab!.visibility).toBe('always');
    });

    test('should have safe area configuration', () => {
      expect(SHELL_MOBILE_TAB.safeArea.edges.top).toBe(true);
      expect(SHELL_MOBILE_TAB.safeArea.edges.bottom).toBe(true);
    });

    test('should have systemUI configuration', () => {
      expect(SHELL_MOBILE_TAB.systemUI).toBeDefined();
    });

    test('should have touch target configuration', () => {
      expect(SHELL_MOBILE_TAB.touchTarget).toBeDefined();
    });

    test('should have token bindings for tabs', () => {
      expect(SHELL_MOBILE_TAB.tokenBindings.tabActiveBackground).toBeDefined();
      expect(SHELL_MOBILE_TAB.tokenBindings.bottomTabBackground).toBeDefined();
    });

    test('should pass validateMobileShellToken', () => {
      expect(() => validateMobileShellToken(SHELL_MOBILE_TAB)).not.toThrow();
    });
  });

  describe('SHELL_MOBILE_DRAWER', () => {
    test('should have correct id, platform, and os', () => {
      expect(SHELL_MOBILE_DRAWER.id).toBe('shell.mobile.drawer');
      expect(SHELL_MOBILE_DRAWER.platform).toBe('mobile');
      expect(SHELL_MOBILE_DRAWER.os).toBe('cross-platform');
    });

    test('should have 2 regions: drawer, main', () => {
      expect(SHELL_MOBILE_DRAWER.regions).toHaveLength(2);
      const regionNames = SHELL_MOBILE_DRAWER.regions.map(r => r.name);
      expect(regionNames).toContain('drawer');
      expect(regionNames).toContain('main');
    });

    test('should have collapsible drawer with defaultCollapsed true', () => {
      const drawer = SHELL_MOBILE_DRAWER.regions.find(r => r.name === 'drawer');
      expect(drawer?.collapsible).toBe(true);
      expect(drawer?.defaultCollapsed).toBe(true);
    });

    test('should have keyboard avoidance set to none', () => {
      expect(SHELL_MOBILE_DRAWER.keyboard.avoidance).toBe('none');
    });

    test('should have safe area horizontal edges disabled', () => {
      expect(SHELL_MOBILE_DRAWER.safeArea.edges.horizontal).toBe(false);
    });

    test('should have responsive configuration with drawerWidth', () => {
      expect(SHELL_MOBILE_DRAWER.responsive.default.drawerWidth).toBeDefined();
      expect(SHELL_MOBILE_DRAWER.responsive.default.drawerType).toBe('overlay');
    });

    test('should have systemUI configuration', () => {
      expect(SHELL_MOBILE_DRAWER.systemUI).toBeDefined();
    });

    test('should have touch target configuration', () => {
      expect(SHELL_MOBILE_DRAWER.touchTarget).toBeDefined();
    });

    test('should have overlay background in token bindings', () => {
      expect(SHELL_MOBILE_DRAWER.tokenBindings.overlayBackground).toBeDefined();
      expect(SHELL_MOBILE_DRAWER.tokenBindings.drawerBackground).toBeDefined();
    });

    test('should pass validateMobileShellToken', () => {
      expect(() => validateMobileShellToken(SHELL_MOBILE_DRAWER)).not.toThrow();
    });
  });

  describe('SHELL_MOBILE_DETAIL', () => {
    test('should have correct id, platform, and os', () => {
      expect(SHELL_MOBILE_DETAIL.id).toBe('shell.mobile.detail');
      expect(SHELL_MOBILE_DETAIL.platform).toBe('mobile');
      expect(SHELL_MOBILE_DETAIL.os).toBe('cross-platform');
    });

    test('should have 3 regions: header, main, actionBar', () => {
      expect(SHELL_MOBILE_DETAIL.regions).toHaveLength(3);
      const regionNames = SHELL_MOBILE_DETAIL.regions.map(r => r.name);
      expect(regionNames).toContain('header');
      expect(regionNames).toContain('main');
      expect(regionNames).toContain('actionBar');
    });

    test('should have collapsible header', () => {
      const header = SHELL_MOBILE_DETAIL.regions.find(r => r.name === 'header');
      expect(header?.collapsible).toBe(true);
    });

    test('should have keyboard avoidance set to padding', () => {
      expect(SHELL_MOBILE_DETAIL.keyboard.avoidance).toBe('padding');
    });

    test('should have responsive configuration', () => {
      expect(SHELL_MOBILE_DETAIL.responsive.default.headerCollapsible).toBe(true);
      expect(SHELL_MOBILE_DETAIL.responsive.default.actionBarVisible).toBe(true);
    });

    test('should have safe area configuration', () => {
      expect(SHELL_MOBILE_DETAIL.safeArea.edges.top).toBe(true);
      expect(SHELL_MOBILE_DETAIL.safeArea.edges.bottom).toBe(true);
    });

    test('should have systemUI configuration', () => {
      expect(SHELL_MOBILE_DETAIL.systemUI).toBeDefined();
    });

    test('should have touch target configuration', () => {
      expect(SHELL_MOBILE_DETAIL.touchTarget).toBeDefined();
    });

    test('should have token bindings for actionBar', () => {
      expect(SHELL_MOBILE_DETAIL.tokenBindings.actionBarBackground).toBeDefined();
      expect(SHELL_MOBILE_DETAIL.tokenBindings.headerBackground).toBeDefined();
    });

    test('should pass validateMobileShellToken', () => {
      expect(() => validateMobileShellToken(SHELL_MOBILE_DETAIL)).not.toThrow();
    });
  });
});

// ============================================================================
// All Mobile Shells Validation Tests
// ============================================================================

describe('All Mobile Shell Tokens Validation', () => {
  const shellIds = [
    'shell.mobile.app',
    'shell.mobile.fullscreen',
    'shell.mobile.modal',
    'shell.mobile.tab',
    'shell.mobile.drawer',
    'shell.mobile.detail',
  ];

  test.each(shellIds)('mobile shell %s should be valid', shellId => {
    const shell = getMobileShellToken(shellId);
    expect(shell).toBeDefined();
    expect(shell!.id).toBe(shellId);
    expect(shell!.platform).toBe('mobile');
    expect(shell!.regions.length).toBeGreaterThan(0);

    // Validate against Zod schema
    expect(() => validateMobileShellToken(shell!)).not.toThrow();
    const result = validateMobileShellToken(shell!);
    expect(result.id).toBe(shellId);
  });

  test('all mobile shells should have unique ids', () => {
    const shells = getAllMobileShellTokens();
    const ids = shells.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  test('all mobile shells should have descriptions', () => {
    const shells = getAllMobileShellTokens();
    shells.forEach(shell => {
      expect(shell.description).toBeDefined();
      expect(shell.description.length).toBeGreaterThan(0);
    });
  });

  test('all mobile shells should have at least one region', () => {
    const shells = getAllMobileShellTokens();
    shells.forEach(shell => {
      expect(shell.regions.length).toBeGreaterThan(0);
    });
  });

  test('all mobile shells should have safeArea configuration', () => {
    const shells = getAllMobileShellTokens();
    shells.forEach(shell => {
      expect(shell.safeArea).toBeDefined();
      expect(shell.safeArea.defaults).toBeDefined();
      expect(shell.safeArea.edges).toBeDefined();
    });
  });

  test('all mobile shells should have systemUI configuration', () => {
    const shells = getAllMobileShellTokens();
    shells.forEach(shell => {
      expect(shell.systemUI).toBeDefined();
      expect(shell.systemUI.statusBar).toBeDefined();
      expect(shell.systemUI.navigationBar).toBeDefined();
    });
  });

  test('all mobile shells should have keyboard configuration', () => {
    const shells = getAllMobileShellTokens();
    shells.forEach(shell => {
      expect(shell.keyboard).toBeDefined();
      expect(shell.keyboard.avoidance).toMatch(/^(padding|resize|position|none)$/);
    });
  });

  test('all mobile shells should have touchTarget configuration', () => {
    const shells = getAllMobileShellTokens();
    shells.forEach(shell => {
      expect(shell.touchTarget).toBeDefined();
      expect(shell.touchTarget.hitSlop).toBeDefined();
    });
  });

  test('all mobile shells should have valid token bindings', () => {
    const shells = getAllMobileShellTokens();
    shells.forEach(shell => {
      expect(Object.keys(shell.tokenBindings).length).toBeGreaterThan(0);
    });
  });

  test('all mobile shells should have responsive configuration', () => {
    const shells = getAllMobileShellTokens();
    shells.forEach(shell => {
      expect(shell.responsive).toBeDefined();
      expect(shell.responsive.default).toBeDefined();
    });
  });

  test('all mobile shells should use valid TokenReference format for region sizes', () => {
    const shells = getAllMobileShellTokens();
    const tokenReferencePattern = /^[a-z]+\.[a-z-]+(\.[a-z0-9-]+)*$|^auto$/;

    shells.forEach(shell => {
      shell.regions.forEach(region => {
        expect(region.size).toMatch(tokenReferencePattern);
      });
    });
  });
});

// ============================================================================
// Utility Functions Tests
// ============================================================================

describe('Mobile Shell Utility Functions', () => {
  describe('getMobileShellToken', () => {
    test('should return shell for valid id', () => {
      const shell = getMobileShellToken('shell.mobile.app');
      expect(shell).toBeDefined();
      expect(shell!.id).toBe('shell.mobile.app');
    });

    test('should return undefined for invalid id', () => {
      const shell = getMobileShellToken('shell.mobile.nonexistent');
      expect(shell).toBeUndefined();
    });

    test('should return correct shell for each id', () => {
      expect(getMobileShellToken('shell.mobile.app')).toBe(SHELL_MOBILE_APP);
      expect(getMobileShellToken('shell.mobile.fullscreen')).toBe(SHELL_MOBILE_FULLSCREEN);
      expect(getMobileShellToken('shell.mobile.modal')).toBe(SHELL_MOBILE_MODAL);
      expect(getMobileShellToken('shell.mobile.tab')).toBe(SHELL_MOBILE_TAB);
      expect(getMobileShellToken('shell.mobile.drawer')).toBe(SHELL_MOBILE_DRAWER);
      expect(getMobileShellToken('shell.mobile.detail')).toBe(SHELL_MOBILE_DETAIL);
    });
  });

  describe('getAllMobileShellTokens', () => {
    test('should return exactly 6 mobile shells', () => {
      const shells = getAllMobileShellTokens();
      expect(shells).toHaveLength(6);
    });

    test('should return all defined mobile shells', () => {
      const shells = getAllMobileShellTokens();
      const ids = shells.map(s => s.id).sort();
      expect(ids).toEqual([
        'shell.mobile.app',
        'shell.mobile.detail',
        'shell.mobile.drawer',
        'shell.mobile.fullscreen',
        'shell.mobile.modal',
        'shell.mobile.tab',
      ]);
    });

    test('should return valid MobileShellToken objects', () => {
      const shells = getAllMobileShellTokens();
      shells.forEach(shell => {
        expect(shell.id).toBeDefined();
        expect(shell.platform).toBe('mobile');
        expect(shell.os).toBeDefined();
        expect(shell.regions).toBeDefined();
        expect(Array.isArray(shell.regions)).toBe(true);
      });
    });
  });

  describe('getMobileShellsByOS', () => {
    test('should return 6 shells for cross-platform', () => {
      const shells = getMobileShellsByOS('cross-platform');
      expect(shells).toHaveLength(6);
    });

    test('should return 6 shells for ios (includes cross-platform)', () => {
      const shells = getMobileShellsByOS('ios');
      expect(shells).toHaveLength(6);
    });

    test('should return 6 shells for android (includes cross-platform)', () => {
      const shells = getMobileShellsByOS('android');
      expect(shells).toHaveLength(6);
    });

    test('should filter correctly by os', () => {
      const crossPlatformShells = getMobileShellsByOS('cross-platform');
      crossPlatformShells.forEach(shell => {
        expect(shell.os).toBe('cross-platform');
      });
    });
  });
});

// ============================================================================
// Region-Specific Tests
// ============================================================================

describe('Mobile Shell Region Properties', () => {
  describe('Collapsible Regions', () => {
    test('SHELL_MOBILE_APP should have collapsible bottomTab', () => {
      const bottomTab = SHELL_MOBILE_APP.regions.find(r => r.name === 'bottomTab');
      expect(bottomTab?.collapsible).toBe(true);
    });

    test('SHELL_MOBILE_TAB should have non-collapsible bottomTab', () => {
      const bottomTab = SHELL_MOBILE_TAB.regions.find(r => r.name === 'bottomTab');
      expect(bottomTab?.collapsible).toBe(false);
    });

    test('SHELL_MOBILE_DRAWER should have collapsible drawer with defaultCollapsed', () => {
      const drawer = SHELL_MOBILE_DRAWER.regions.find(r => r.name === 'drawer');
      expect(drawer?.collapsible).toBe(true);
      expect(drawer?.defaultCollapsed).toBe(true);
    });

    test('SHELL_MOBILE_DETAIL should have collapsible header', () => {
      const header = SHELL_MOBILE_DETAIL.regions.find(r => r.name === 'header');
      expect(header?.collapsible).toBe(true);
    });
  });

  describe('Region Positions', () => {
    test('header regions should have top position', () => {
      const appHeader = SHELL_MOBILE_APP.regions.find(r => r.name === 'header');
      const detailHeader = SHELL_MOBILE_DETAIL.regions.find(r => r.name === 'header');
      expect(appHeader?.position).toBe('top');
      expect(detailHeader?.position).toBe('top');
    });

    test('main regions should have center position', () => {
      const shells = getAllMobileShellTokens();
      shells.forEach(shell => {
        const main = shell.regions.find(r => r.name === 'main');
        if (main) {
          expect(main.position).toBe('center');
        }
      });
    });

    test('bottomTab regions should have bottom position', () => {
      const appBottomTab = SHELL_MOBILE_APP.regions.find(r => r.name === 'bottomTab');
      const tabBottomTab = SHELL_MOBILE_TAB.regions.find(r => r.name === 'bottomTab');
      expect(appBottomTab?.position).toBe('bottom');
      expect(tabBottomTab?.position).toBe('bottom');
    });

    test('drawer region should have left position', () => {
      const drawer = SHELL_MOBILE_DRAWER.regions.find(r => r.name === 'drawer');
      expect(drawer?.position).toBe('left');
    });
  });

  describe('Region Sizes', () => {
    test('should use atomic.spacing tokens for sizes', () => {
      const shells = getAllMobileShellTokens();
      const atomicPattern = /^atomic\.spacing\.(full|\d+)$/;

      shells.forEach(shell => {
        shell.regions.forEach(region => {
          expect(region.size).toMatch(atomicPattern);
        });
      });
    });

    test('main regions should use atomic.spacing.full', () => {
      const shells = getAllMobileShellTokens();
      shells.forEach(shell => {
        const main = shell.regions.find(r => r.name === 'main');
        if (main) {
          expect(main.size).toBe('atomic.spacing.full');
        }
      });
    });
  });
});

// ============================================================================
// Configuration Tests
// ============================================================================

describe('Mobile Shell Configuration', () => {
  test('all shells have valid safe area defaults', () => {
    const shells = getAllMobileShellTokens();
    shells.forEach(shell => {
      expect(shell.safeArea.defaults.notch).toBe(44);
      expect(shell.safeArea.defaults.dynamicIsland).toBe(59);
      expect(shell.safeArea.defaults.homeIndicator).toBe(34);
      expect(shell.safeArea.defaults.statusBar).toBe(20);
    });
  });

  test('all shells have keyboard animation configuration', () => {
    const shells = getAllMobileShellTokens();
    shells.forEach(shell => {
      expect(shell.keyboard.animation.duration).toBe(250);
      expect(shell.keyboard.animation.easing).toBe('keyboard');
      expect(shell.keyboard.animation.enabled).toBe(true);
    });
  });

  test('all shells have dismissMode for keyboard', () => {
    const shells = getAllMobileShellTokens();
    shells.forEach(shell => {
      expect(shell.keyboard.dismissMode).toBe('on-drag');
    });
  });

  test('all shells have hitSlop configuration', () => {
    const shells = getAllMobileShellTokens();
    shells.forEach(shell => {
      expect(shell.touchTarget.hitSlop.top).toBe(8);
      expect(shell.touchTarget.hitSlop.bottom).toBe(8);
      expect(shell.touchTarget.hitSlop.left).toBe(8);
      expect(shell.touchTarget.hitSlop.right).toBe(8);
    });
  });

  test('shells with bottomTab have bottomTab configuration', () => {
    const shellsWithBottomTab = [SHELL_MOBILE_APP, SHELL_MOBILE_TAB];
    shellsWithBottomTab.forEach(shell => {
      expect(shell.bottomTab).toBeDefined();
      expect(shell.bottomTab!.maxItems).toBe(5);
      expect(shell.bottomTab!.item.minTouchTarget).toBeDefined();
    });
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Mobile Shell Token Integration', () => {
  test('should integrate with validateMobileShellToken from layout-validation', () => {
    const shells = getAllMobileShellTokens();
    shells.forEach(shell => {
      expect(() => validateMobileShellToken(shell)).not.toThrow();
    });
  });

  test('should provide consistent data structure across all shells', () => {
    const shells = getAllMobileShellTokens();
    shells.forEach(shell => {
      expect(shell).toHaveProperty('id');
      expect(shell).toHaveProperty('description');
      expect(shell).toHaveProperty('platform');
      expect(shell).toHaveProperty('os');
      expect(shell).toHaveProperty('regions');
      expect(shell).toHaveProperty('safeArea');
      expect(shell).toHaveProperty('systemUI');
      expect(shell).toHaveProperty('keyboard');
      expect(shell).toHaveProperty('touchTarget');
      expect(shell).toHaveProperty('responsive');
      expect(shell).toHaveProperty('tokenBindings');
    });
  });

  test('should use semantic token references in tokenBindings', () => {
    const shells = getAllMobileShellTokens();
    const semanticPattern = /^semantic\./;

    shells.forEach(shell => {
      const bindings = Object.values(shell.tokenBindings);
      bindings.forEach(binding => {
        expect(String(binding)).toMatch(semanticPattern);
      });
    });
  });
});
