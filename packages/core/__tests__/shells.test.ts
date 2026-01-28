/**
 * @tekton/core - Shell Token Tests
 * Tests for concrete Shell Token definitions
 * [SPEC-LAYOUT-001] [PHASE-3]
 */

import { describe, it, expect } from 'vitest';
import {
  SHELL_WEB_APP,
  SHELL_WEB_MARKETING,
  SHELL_WEB_AUTH,
  SHELL_WEB_DASHBOARD,
  SHELL_WEB_ADMIN,
  SHELL_WEB_MINIMAL,
  getShellToken,
  getAllShellTokens,
  getShellsByPlatform,
} from '../src/layout-tokens/shells.js';
import { validateShellToken } from '../src/layout-validation.js';

// ============================================================================
// Individual Shell Token Validation Tests
// ============================================================================

describe('Shell Token Definitions', () => {
  describe('SHELL_WEB_APP', () => {
    it('should have correct id and platform', () => {
      expect(SHELL_WEB_APP.id).toBe('shell.web.app');
      expect(SHELL_WEB_APP.platform).toBe('web');
    });

    it('should have 4 regions: header, sidebar, main, footer', () => {
      expect(SHELL_WEB_APP.regions).toHaveLength(4);
      const regionNames = SHELL_WEB_APP.regions.map(r => r.name);
      expect(regionNames).toContain('header');
      expect(regionNames).toContain('sidebar');
      expect(regionNames).toContain('main');
      expect(regionNames).toContain('footer');
    });

    it('should have collapsible sidebar', () => {
      const sidebar = SHELL_WEB_APP.regions.find(r => r.name === 'sidebar');
      expect(sidebar?.collapsible).toBe(true);
      expect(sidebar?.defaultCollapsed).toBe(false);
    });

    it('should pass validateShellToken', () => {
      expect(() => validateShellToken(SHELL_WEB_APP)).not.toThrow();
      const validated = validateShellToken(SHELL_WEB_APP);
      expect(validated.id).toBe('shell.web.app');
    });

    it('should have responsive configuration', () => {
      expect(SHELL_WEB_APP.responsive.default).toBeDefined();
      expect(SHELL_WEB_APP.responsive.md).toBeDefined();
      expect(SHELL_WEB_APP.responsive.lg).toBeDefined();
    });

    it('should have token bindings', () => {
      expect(Object.keys(SHELL_WEB_APP.tokenBindings).length).toBeGreaterThan(0);
      expect(SHELL_WEB_APP.tokenBindings.headerBackground).toBeDefined();
      expect(SHELL_WEB_APP.tokenBindings.sidebarBackground).toBeDefined();
    });
  });

  describe('SHELL_WEB_MARKETING', () => {
    it('should have correct id and platform', () => {
      expect(SHELL_WEB_MARKETING.id).toBe('shell.web.marketing');
      expect(SHELL_WEB_MARKETING.platform).toBe('web');
    });

    it('should have 4 regions: hero, features, cta, footer', () => {
      expect(SHELL_WEB_MARKETING.regions).toHaveLength(4);
      const regionNames = SHELL_WEB_MARKETING.regions.map(r => r.name);
      expect(regionNames).toContain('hero');
      expect(regionNames).toContain('features');
      expect(regionNames).toContain('cta');
      expect(regionNames).toContain('footer');
    });

    it('should pass validateShellToken', () => {
      expect(() => validateShellToken(SHELL_WEB_MARKETING)).not.toThrow();
      const validated = validateShellToken(SHELL_WEB_MARKETING);
      expect(validated.id).toBe('shell.web.marketing');
    });

    it('should have responsive configuration', () => {
      expect(SHELL_WEB_MARKETING.responsive.default).toBeDefined();
      expect(SHELL_WEB_MARKETING.responsive.md).toBeDefined();
      expect(SHELL_WEB_MARKETING.responsive.lg).toBeDefined();
    });
  });

  describe('SHELL_WEB_AUTH', () => {
    it('should have correct id and platform', () => {
      expect(SHELL_WEB_AUTH.id).toBe('shell.web.auth');
      expect(SHELL_WEB_AUTH.platform).toBe('web');
    });

    it('should have 2 regions: logo, main', () => {
      expect(SHELL_WEB_AUTH.regions).toHaveLength(2);
      const regionNames = SHELL_WEB_AUTH.regions.map(r => r.name);
      expect(regionNames).toContain('logo');
      expect(regionNames).toContain('main');
    });

    it('should have centered main region with max width', () => {
      const main = SHELL_WEB_AUTH.regions.find(r => r.name === 'main');
      expect(main?.position).toBe('center');
      expect(main?.size).toBe('atomic.spacing.96');
    });

    it('should pass validateShellToken', () => {
      expect(() => validateShellToken(SHELL_WEB_AUTH)).not.toThrow();
      const validated = validateShellToken(SHELL_WEB_AUTH);
      expect(validated.id).toBe('shell.web.auth');
    });

    it('should have responsive configuration', () => {
      expect(SHELL_WEB_AUTH.responsive.default).toBeDefined();
      expect(SHELL_WEB_AUTH.responsive.md).toBeDefined();
    });
  });

  describe('SHELL_WEB_DASHBOARD', () => {
    it('should have correct id and platform', () => {
      expect(SHELL_WEB_DASHBOARD.id).toBe('shell.web.dashboard');
      expect(SHELL_WEB_DASHBOARD.platform).toBe('web');
    });

    it('should have 3 regions: header, sidebar, main', () => {
      expect(SHELL_WEB_DASHBOARD.regions).toHaveLength(3);
      const regionNames = SHELL_WEB_DASHBOARD.regions.map(r => r.name);
      expect(regionNames).toContain('header');
      expect(regionNames).toContain('sidebar');
      expect(regionNames).toContain('main');
    });

    it('should have collapsible sidebar', () => {
      const sidebar = SHELL_WEB_DASHBOARD.regions.find(r => r.name === 'sidebar');
      expect(sidebar?.collapsible).toBe(true);
      expect(sidebar?.defaultCollapsed).toBe(false);
    });

    it('should pass validateShellToken', () => {
      expect(() => validateShellToken(SHELL_WEB_DASHBOARD)).not.toThrow();
      const validated = validateShellToken(SHELL_WEB_DASHBOARD);
      expect(validated.id).toBe('shell.web.dashboard');
    });

    it('should have responsive configuration with sidebar states', () => {
      expect(SHELL_WEB_DASHBOARD.responsive.default).toBeDefined();
      expect(SHELL_WEB_DASHBOARD.responsive.default.sidebarVisible).toBe(false);
      expect(SHELL_WEB_DASHBOARD.responsive.lg?.sidebarVisible).toBe(true);
    });
  });

  describe('SHELL_WEB_ADMIN', () => {
    it('should have correct id and platform', () => {
      expect(SHELL_WEB_ADMIN.id).toBe('shell.web.admin');
      expect(SHELL_WEB_ADMIN.platform).toBe('web');
    });

    it('should have 4 regions: header, sidebar, main, footer', () => {
      expect(SHELL_WEB_ADMIN.regions).toHaveLength(4);
      const regionNames = SHELL_WEB_ADMIN.regions.map(r => r.name);
      expect(regionNames).toContain('header');
      expect(regionNames).toContain('sidebar');
      expect(regionNames).toContain('main');
      expect(regionNames).toContain('footer');
    });

    it('should have fixed (non-collapsible) sidebar', () => {
      const sidebar = SHELL_WEB_ADMIN.regions.find(r => r.name === 'sidebar');
      expect(sidebar?.collapsible).toBe(false);
    });

    it('should pass validateShellToken', () => {
      expect(() => validateShellToken(SHELL_WEB_ADMIN)).not.toThrow();
      const validated = validateShellToken(SHELL_WEB_ADMIN);
      expect(validated.id).toBe('shell.web.admin');
    });

    it('should have responsive configuration with layout modes', () => {
      expect(SHELL_WEB_ADMIN.responsive.default).toBeDefined();
      expect(SHELL_WEB_ADMIN.responsive.default.layout).toBe('stacked');
      expect(SHELL_WEB_ADMIN.responsive.md?.layout).toBe('side-by-side');
    });
  });

  describe('SHELL_WEB_MINIMAL', () => {
    it('should have correct id and platform', () => {
      expect(SHELL_WEB_MINIMAL.id).toBe('shell.web.minimal');
      expect(SHELL_WEB_MINIMAL.platform).toBe('web');
    });

    it('should have only 1 region: main', () => {
      expect(SHELL_WEB_MINIMAL.regions).toHaveLength(1);
      expect(SHELL_WEB_MINIMAL.regions[0].name).toBe('main');
    });

    it('should not have sidebar', () => {
      const sidebar = SHELL_WEB_MINIMAL.regions.find(r => r.name === 'sidebar');
      expect(sidebar).toBeUndefined();
    });

    it('should not have header', () => {
      const header = SHELL_WEB_MINIMAL.regions.find(r => r.name === 'header');
      expect(header).toBeUndefined();
    });

    it('should not have footer', () => {
      const footer = SHELL_WEB_MINIMAL.regions.find(r => r.name === 'footer');
      expect(footer).toBeUndefined();
    });

    it('should pass validateShellToken', () => {
      expect(() => validateShellToken(SHELL_WEB_MINIMAL)).not.toThrow();
      const validated = validateShellToken(SHELL_WEB_MINIMAL);
      expect(validated.id).toBe('shell.web.minimal');
    });

    it('should have responsive configuration', () => {
      expect(SHELL_WEB_MINIMAL.responsive.default).toBeDefined();
      expect(SHELL_WEB_MINIMAL.responsive.md).toBeDefined();
    });
  });
});

// ============================================================================
// All Shells Validation Tests
// ============================================================================

describe('All Shell Tokens Validation', () => {
  const shellIds = [
    'shell.web.app',
    'shell.web.marketing',
    'shell.web.auth',
    'shell.web.dashboard',
    'shell.web.admin',
    'shell.web.minimal',
  ];

  it.each(shellIds)('shell %s should be valid', shellId => {
    const shell = getShellToken(shellId);
    expect(shell).toBeDefined();
    expect(shell!.id).toBe(shellId);
    expect(shell!.regions.length).toBeGreaterThan(0);

    // Validate against Zod schema
    expect(() => validateShellToken(shell!)).not.toThrow();
    const result = validateShellToken(shell!);
    expect(result.id).toBe(shellId);
  });

  it('all shells should have unique ids', () => {
    const shells = getAllShellTokens();
    const ids = shells.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('all shells should have descriptions', () => {
    const shells = getAllShellTokens();
    shells.forEach(shell => {
      expect(shell.description).toBeDefined();
      expect(shell.description.length).toBeGreaterThan(0);
    });
  });

  it('all shells should have at least one region', () => {
    const shells = getAllShellTokens();
    shells.forEach(shell => {
      expect(shell.regions.length).toBeGreaterThan(0);
    });
  });

  it('all shells should have valid token bindings', () => {
    const shells = getAllShellTokens();
    shells.forEach(shell => {
      expect(Object.keys(shell.tokenBindings).length).toBeGreaterThan(0);
    });
  });

  it('all shells should have responsive configuration', () => {
    const shells = getAllShellTokens();
    shells.forEach(shell => {
      expect(shell.responsive).toBeDefined();
      expect(shell.responsive.default).toBeDefined();
    });
  });

  it('all shells should use valid TokenReference format for region sizes', () => {
    const shells = getAllShellTokens();
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

describe('Shell Utility Functions', () => {
  describe('getShellToken', () => {
    it('should return shell for valid id', () => {
      const shell = getShellToken('shell.web.app');
      expect(shell).toBeDefined();
      expect(shell!.id).toBe('shell.web.app');
    });

    it('should return undefined for invalid id', () => {
      const shell = getShellToken('shell.web.nonexistent');
      expect(shell).toBeUndefined();
    });

    it('should return correct shell for each id', () => {
      expect(getShellToken('shell.web.app')).toBe(SHELL_WEB_APP);
      expect(getShellToken('shell.web.marketing')).toBe(SHELL_WEB_MARKETING);
      expect(getShellToken('shell.web.auth')).toBe(SHELL_WEB_AUTH);
      expect(getShellToken('shell.web.dashboard')).toBe(SHELL_WEB_DASHBOARD);
      expect(getShellToken('shell.web.admin')).toBe(SHELL_WEB_ADMIN);
      expect(getShellToken('shell.web.minimal')).toBe(SHELL_WEB_MINIMAL);
    });
  });

  describe('getAllShellTokens', () => {
    it('should return exactly 6 shells', () => {
      const shells = getAllShellTokens();
      expect(shells).toHaveLength(6);
    });

    it('should return all defined shells', () => {
      const shells = getAllShellTokens();
      const ids = shells.map(s => s.id).sort();
      expect(ids).toEqual([
        'shell.web.admin',
        'shell.web.app',
        'shell.web.auth',
        'shell.web.dashboard',
        'shell.web.marketing',
        'shell.web.minimal',
      ]);
    });

    it('should return valid ShellToken objects', () => {
      const shells = getAllShellTokens();
      shells.forEach(shell => {
        expect(shell.id).toBeDefined();
        expect(shell.platform).toBeDefined();
        expect(shell.regions).toBeDefined();
        expect(Array.isArray(shell.regions)).toBe(true);
      });
    });
  });

  describe('getShellsByPlatform', () => {
    it('should return 6 shells for web platform', () => {
      const webShells = getShellsByPlatform('web');
      expect(webShells).toHaveLength(6);
    });

    it('should return 0 shells for mobile platform', () => {
      const mobileShells = getShellsByPlatform('mobile');
      expect(mobileShells).toHaveLength(0);
    });

    it('should return 0 shells for desktop platform', () => {
      const desktopShells = getShellsByPlatform('desktop');
      expect(desktopShells).toHaveLength(0);
    });

    it('should filter correctly by platform', () => {
      const webShells = getShellsByPlatform('web');
      webShells.forEach(shell => {
        expect(shell.platform).toBe('web');
      });
    });
  });
});

// ============================================================================
// Region-Specific Tests
// ============================================================================

describe('Shell Region Properties', () => {
  describe('Collapsible Regions', () => {
    it('should have collapsible sidebar in shell.web.app', () => {
      const shell = getShellToken('shell.web.app');
      const sidebar = shell!.regions.find(r => r.name === 'sidebar');
      expect(sidebar?.collapsible).toBe(true);
    });

    it('should have collapsible sidebar in shell.web.dashboard', () => {
      const shell = getShellToken('shell.web.dashboard');
      const sidebar = shell!.regions.find(r => r.name === 'sidebar');
      expect(sidebar?.collapsible).toBe(true);
    });

    it('should have non-collapsible sidebar in shell.web.admin', () => {
      const shell = getShellToken('shell.web.admin');
      const sidebar = shell!.regions.find(r => r.name === 'sidebar');
      expect(sidebar?.collapsible).toBe(false);
    });

    it('should not have sidebar in shell.web.minimal', () => {
      const shell = getShellToken('shell.web.minimal');
      const sidebar = shell!.regions.find(r => r.name === 'sidebar');
      expect(sidebar).toBeUndefined();
    });
  });

  describe('Region Positions', () => {
    it('should have top position for header regions', () => {
      const appShell = getShellToken('shell.web.app');
      const header = appShell!.regions.find(r => r.name === 'header');
      expect(header?.position).toBe('top');
    });

    it('should have left position for sidebar regions', () => {
      const appShell = getShellToken('shell.web.app');
      const sidebar = appShell!.regions.find(r => r.name === 'sidebar');
      expect(sidebar?.position).toBe('left');
    });

    it('should have center position for main regions', () => {
      const appShell = getShellToken('shell.web.app');
      const main = appShell!.regions.find(r => r.name === 'main');
      expect(main?.position).toBe('center');
    });

    it('should have bottom position for footer regions', () => {
      const appShell = getShellToken('shell.web.app');
      const footer = appShell!.regions.find(r => r.name === 'footer');
      expect(footer?.position).toBe('bottom');
    });
  });

  describe('Region Sizes', () => {
    it('should use atomic.spacing tokens for sizes', () => {
      const shells = getAllShellTokens();
      const atomicPattern = /^atomic\.spacing\.(full|\d+)$/;

      shells.forEach(shell => {
        shell.regions.forEach(region => {
          expect(region.size).toMatch(atomicPattern);
        });
      });
    });

    it('should use atomic.spacing.full for flexible main regions', () => {
      const appShell = getShellToken('shell.web.app');
      const main = appShell!.regions.find(r => r.name === 'main');
      expect(main?.size).toBe('atomic.spacing.full');
    });
  });
});

// ============================================================================
// Responsive Configuration Tests
// ============================================================================

describe('Shell Responsive Configurations', () => {
  it('all shells should follow mobile-first pattern', () => {
    const shells = getAllShellTokens();
    shells.forEach(shell => {
      expect(shell.responsive.default).toBeDefined();
    });
  });

  it('shell.web.app should hide sidebar on mobile', () => {
    const shell = getShellToken('shell.web.app');
    expect(shell!.responsive.default.sidebarVisible).toBe(false);
  });

  it('shell.web.app should show sidebar on md+', () => {
    const shell = getShellToken('shell.web.app');
    expect(shell!.responsive.md?.sidebarVisible).toBe(true);
  });

  it('shell.web.dashboard should collapse sidebar on mobile', () => {
    const shell = getShellToken('shell.web.dashboard');
    expect(shell!.responsive.default.sidebarCollapsed).toBe(true);
  });

  it('shell.web.auth should be full-width on mobile', () => {
    const shell = getShellToken('shell.web.auth');
    expect(shell!.responsive.default.mainMaxWidth).toBe('100%');
  });

  it('shell.web.auth should be centered on md+', () => {
    const shell = getShellToken('shell.web.auth');
    expect(shell!.responsive.md?.mainMaxWidth).toBe('atomic.spacing.96');
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Shell Token Integration', () => {
  it('should integrate with validateShellToken from layout-validation', () => {
    const shells = getAllShellTokens();
    shells.forEach(shell => {
      expect(() => validateShellToken(shell)).not.toThrow();
    });
  });

  it('should provide consistent data structure across all shells', () => {
    const shells = getAllShellTokens();
    shells.forEach(shell => {
      expect(shell).toHaveProperty('id');
      expect(shell).toHaveProperty('description');
      expect(shell).toHaveProperty('platform');
      expect(shell).toHaveProperty('regions');
      expect(shell).toHaveProperty('responsive');
      expect(shell).toHaveProperty('tokenBindings');
    });
  });

  it('should use semantic token references in tokenBindings', () => {
    const shells = getAllShellTokens();
    const semanticPattern = /^semantic\./;

    shells.forEach(shell => {
      const bindings = Object.values(shell.tokenBindings);
      bindings.forEach(binding => {
        expect(String(binding)).toMatch(semanticPattern);
      });
    });
  });
});
