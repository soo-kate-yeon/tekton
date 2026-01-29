/**
 * @tekton/core - XL/2XL Breakpoint Tests
 * Verify all layout tokens have xl and 2xl responsive configurations
 * [SPEC-LAYOUT-003] [PHASE-4]
 */

import { describe, it, expect } from 'vitest';
import { getAllShellTokens, getShellToken } from '../src/layout-tokens/shells.js';
import { getAllPageLayoutTokens, getPageLayoutToken } from '../src/layout-tokens/pages.js';
import {
  getAllSectionPatternTokens,
  getSectionPatternToken,
} from '../src/layout-tokens/sections.js';

describe('XL/2XL Breakpoint Configuration', () => {
  describe('Shell Tokens', () => {
    const shells = getAllShellTokens();

    it('should have 6 shell tokens', () => {
      expect(shells).toHaveLength(6);
    });

    it.each([
      'shell.web.app',
      'shell.web.marketing',
      'shell.web.auth',
      'shell.web.dashboard',
      'shell.web.admin',
      'shell.web.minimal',
    ])('%s should have xl and 2xl breakpoints', shellId => {
      const shell = getShellToken(shellId);
      expect(shell).toBeDefined();
      expect(shell?.responsive).toBeDefined();
      expect(shell?.responsive.xl).toBeDefined();
      expect(shell?.responsive['2xl']).toBeDefined();
    });

    it('all shell tokens should have xl breakpoint', () => {
      shells.forEach(shell => {
        expect(shell.responsive.xl, `${shell.id} missing xl breakpoint`).toBeDefined();
      });
    });

    it('all shell tokens should have 2xl breakpoint', () => {
      shells.forEach(shell => {
        expect(shell.responsive['2xl'], `${shell.id} missing 2xl breakpoint`).toBeDefined();
      });
    });
  });

  describe('Page Layout Tokens', () => {
    const pages = getAllPageLayoutTokens();

    it('should have 8 page layout tokens', () => {
      expect(pages).toHaveLength(8);
    });

    it.each([
      'page.job',
      'page.resource',
      'page.dashboard',
      'page.settings',
      'page.detail',
      'page.empty',
      'page.wizard',
      'page.onboarding',
    ])('%s should have xl and 2xl breakpoints', pageId => {
      const page = getPageLayoutToken(pageId);
      expect(page).toBeDefined();
      expect(page?.responsive).toBeDefined();
      expect(page?.responsive.xl).toBeDefined();
      expect(page?.responsive['2xl']).toBeDefined();
    });

    it('all page layout tokens should have xl breakpoint', () => {
      pages.forEach(page => {
        expect(page.responsive.xl, `${page.id} missing xl breakpoint`).toBeDefined();
      });
    });

    it('all page layout tokens should have 2xl breakpoint', () => {
      pages.forEach(page => {
        expect(page.responsive['2xl'], `${page.id} missing 2xl breakpoint`).toBeDefined();
      });
    });
  });

  describe('Section Pattern Tokens', () => {
    const sections = getAllSectionPatternTokens();

    it('should have 13 section pattern tokens', () => {
      expect(sections).toHaveLength(13);
    });

    it.each([
      'section.grid-2',
      'section.grid-3',
      'section.grid-4',
      'section.grid-auto',
      'section.split-30-70',
      'section.split-50-50',
      'section.split-70-30',
      'section.stack-start',
      'section.stack-center',
      'section.stack-end',
      'section.sidebar-left',
      'section.sidebar-right',
      'section.container',
    ])('%s should have xl and 2xl breakpoints', sectionId => {
      const section = getSectionPatternToken(sectionId);
      expect(section).toBeDefined();
      expect(section?.responsive).toBeDefined();
      expect(section?.responsive.xl).toBeDefined();
      expect(section?.responsive['2xl']).toBeDefined();
    });

    it('all section pattern tokens should have xl breakpoint', () => {
      sections.forEach(section => {
        expect(section.responsive.xl, `${section.id} missing xl breakpoint`).toBeDefined();
      });
    });

    it('all section pattern tokens should have 2xl breakpoint', () => {
      sections.forEach(section => {
        expect(section.responsive['2xl'], `${section.id} missing 2xl breakpoint`).toBeDefined();
      });
    });
  });

  describe('Total Token Count Verification', () => {
    it('should have exactly 27 tokens total (6 shells + 8 pages + 13 sections)', () => {
      const totalTokens =
        getAllShellTokens().length +
        getAllPageLayoutTokens().length +
        getAllSectionPatternTokens().length;
      expect(totalTokens).toBe(27);
    });

    it('all 27 tokens should have both xl and 2xl breakpoints', () => {
      const allTokens = [
        ...getAllShellTokens(),
        ...getAllPageLayoutTokens(),
        ...getAllSectionPatternTokens(),
      ];

      const tokensWithXL = allTokens.filter(token => token.responsive.xl);
      const tokensWith2XL = allTokens.filter(token => token.responsive['2xl']);

      expect(tokensWithXL).toHaveLength(27);
      expect(tokensWith2XL).toHaveLength(27);
    });
  });

  describe('Breakpoint Value Validation', () => {
    it('xl breakpoint values should be larger than lg values where applicable', () => {
      // Test SHELL_WEB_APP sidebarWidth
      const webApp = getShellToken('shell.web.app');
      expect(webApp?.responsive.lg?.sidebarWidth).toBe('atomic.spacing.64');
      expect(webApp?.responsive.xl?.sidebarWidth).toBe('atomic.spacing.80');
      expect(webApp?.responsive['2xl']?.sidebarWidth).toBe('atomic.spacing.96');
    });

    it('2xl breakpoint values should be larger than xl values where applicable', () => {
      // Test PAGE_JOB formWidth
      const jobPage = getPageLayoutToken('page.job');
      expect(jobPage?.responsive.lg?.formWidth).toBe('atomic.spacing.160');
      expect(jobPage?.responsive.xl?.formWidth).toBe('atomic.spacing.192');
      expect(jobPage?.responsive['2xl']?.formWidth).toBe('atomic.spacing.224');
    });

    it('section gaps should progressively increase from lg to xl to 2xl', () => {
      // Test SECTION_GRID_3 gap
      const grid3 = getSectionPatternToken('section.grid-3');
      expect(grid3?.responsive.lg?.gap).toBe('atomic.spacing.4');
      expect(grid3?.responsive.xl?.gap).toBe('atomic.spacing.5');
      expect(grid3?.responsive['2xl']?.gap).toBe('atomic.spacing.6');
    });
  });
});
