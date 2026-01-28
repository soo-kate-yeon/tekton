/**
 * @tekton/core - Page Layout Token Tests
 * Test suite for page layout token definitions
 * [SPEC-LAYOUT-001] [PHASE-4]
 */

import { describe, test, expect } from 'vitest';
import {
  PAGE_JOB,
  PAGE_RESOURCE,
  PAGE_DASHBOARD,
  PAGE_SETTINGS,
  PAGE_DETAIL,
  PAGE_EMPTY,
  PAGE_WIZARD,
  PAGE_ONBOARDING,
  getPageLayoutToken,
  getAllPageLayoutTokens,
  getPagesByPurpose,
  getPageSections,
} from '../src/layout-tokens/pages.js';
// PageLayoutToken type is used implicitly via token retrieval functions

describe('Page Layout Token Definitions', () => {
  describe('Individual Page Tokens', () => {
    test('PAGE_JOB has correct structure', () => {
      expect(PAGE_JOB.id).toBe('page.job');
      expect(PAGE_JOB.purpose).toBe('job');
      expect(PAGE_JOB.description).toContain('Task execution');
      expect(PAGE_JOB.sections).toHaveLength(3);
      expect(PAGE_JOB.sections.some(s => s.name === 'header')).toBe(true);
      expect(PAGE_JOB.sections.some(s => s.name === 'form')).toBe(true);
      expect(PAGE_JOB.sections.some(s => s.name === 'actions')).toBe(true);
      expect(PAGE_JOB.responsive).toBeDefined();
      expect(PAGE_JOB.tokenBindings).toBeDefined();
    });

    test('PAGE_RESOURCE has correct structure', () => {
      expect(PAGE_RESOURCE.id).toBe('page.resource');
      expect(PAGE_RESOURCE.purpose).toBe('resource');
      expect(PAGE_RESOURCE.description).toContain('CRUD');
      expect(PAGE_RESOURCE.sections).toHaveLength(3);
      expect(PAGE_RESOURCE.sections.some(s => s.name === 'toolbar')).toBe(true);
      expect(PAGE_RESOURCE.sections.some(s => s.name === 'list')).toBe(true);
      expect(PAGE_RESOURCE.sections.some(s => s.name === 'detail')).toBe(true);
    });

    test('PAGE_DASHBOARD has correct structure', () => {
      expect(PAGE_DASHBOARD.id).toBe('page.dashboard');
      expect(PAGE_DASHBOARD.purpose).toBe('dashboard');
      expect(PAGE_DASHBOARD.description).toContain('Dashboard');
      expect(PAGE_DASHBOARD.sections).toHaveLength(3);
      expect(PAGE_DASHBOARD.sections.some(s => s.name === 'metrics')).toBe(true);
      expect(PAGE_DASHBOARD.sections.some(s => s.name === 'charts')).toBe(true);
      expect(PAGE_DASHBOARD.sections.some(s => s.name === 'tables')).toBe(true);
    });

    test('PAGE_SETTINGS has correct structure', () => {
      expect(PAGE_SETTINGS.id).toBe('page.settings');
      expect(PAGE_SETTINGS.purpose).toBe('settings');
      expect(PAGE_SETTINGS.description).toContain('Configuration');
      expect(PAGE_SETTINGS.sections.length).toBeGreaterThanOrEqual(2);
      expect(PAGE_SETTINGS.sections.some(s => s.name === 'content')).toBe(true);
    });

    test('PAGE_DETAIL has correct structure', () => {
      expect(PAGE_DETAIL.id).toBe('page.detail');
      expect(PAGE_DETAIL.purpose).toBe('detail');
      expect(PAGE_DETAIL.description).toContain('Item focus');
      expect(PAGE_DETAIL.sections).toHaveLength(3);
      expect(PAGE_DETAIL.sections.some(s => s.name === 'hero')).toBe(true);
      expect(PAGE_DETAIL.sections.some(s => s.name === 'content')).toBe(true);
      expect(PAGE_DETAIL.sections.some(s => s.name === 'related')).toBe(true);
    });

    test('PAGE_EMPTY has correct structure', () => {
      expect(PAGE_EMPTY.id).toBe('page.empty');
      expect(PAGE_EMPTY.purpose).toBe('empty');
      expect(PAGE_EMPTY.description).toContain('Empty state');
      expect(PAGE_EMPTY.sections).toHaveLength(3);
      expect(PAGE_EMPTY.sections.some(s => s.name === 'illustration')).toBe(true);
      expect(PAGE_EMPTY.sections.some(s => s.name === 'message')).toBe(true);
      expect(PAGE_EMPTY.sections.some(s => s.name === 'cta')).toBe(true);
    });

    test('PAGE_WIZARD has correct structure', () => {
      expect(PAGE_WIZARD.id).toBe('page.wizard');
      expect(PAGE_WIZARD.purpose).toBe('wizard');
      expect(PAGE_WIZARD.description).toContain('Multi-step');
      expect(PAGE_WIZARD.sections).toHaveLength(3);
      expect(PAGE_WIZARD.sections.some(s => s.name === 'progress')).toBe(true);
      expect(PAGE_WIZARD.sections.some(s => s.name === 'step')).toBe(true);
      expect(PAGE_WIZARD.sections.some(s => s.name === 'navigation')).toBe(true);
    });

    test('PAGE_ONBOARDING has correct structure', () => {
      expect(PAGE_ONBOARDING.id).toBe('page.onboarding');
      expect(PAGE_ONBOARDING.purpose).toBe('onboarding');
      expect(PAGE_ONBOARDING.description).toContain('First-run');
      expect(PAGE_ONBOARDING.sections.length).toBeGreaterThanOrEqual(2);
      expect(PAGE_ONBOARDING.sections.some(s => s.name === 'welcome')).toBe(true);
      expect(PAGE_ONBOARDING.sections.some(s => s.name === 'steps')).toBe(true);
    });
  });

  describe('Page Token Validation', () => {
    const pageIds = [
      'page.job',
      'page.resource',
      'page.dashboard',
      'page.settings',
      'page.detail',
      'page.empty',
      'page.wizard',
      'page.onboarding',
    ];

    test.each(pageIds)('page %s is valid', pageId => {
      const page = getPageLayoutToken(pageId);
      expect(page).toBeDefined();
      expect(page!.id).toBe(pageId);
      expect(page!.sections.length).toBeGreaterThanOrEqual(0);
      expect(page!.purpose).toBeDefined();
      expect(page!.responsive).toBeDefined();
      expect(page!.tokenBindings).toBeDefined();
    });

    test.each(pageIds)('page %s has valid sections', pageId => {
      const page = getPageLayoutToken(pageId);
      expect(page).toBeDefined();

      page!.sections.forEach(section => {
        expect(section.name).toBeDefined();
        expect(section.pattern).toBeDefined();
        expect(typeof section.required).toBe('boolean');
        expect(section.pattern).toMatch(/^section\./);
      });
    });

    test.each(pageIds)('page %s has valid responsive config', pageId => {
      const page = getPageLayoutToken(pageId);
      expect(page).toBeDefined();
      expect(page!.responsive.default).toBeDefined();
    });

    test.each(pageIds)('page %s has valid token bindings', pageId => {
      const page = getPageLayoutToken(pageId);
      expect(page).toBeDefined();
      expect(Object.keys(page!.tokenBindings).length).toBeGreaterThan(0);
    });
  });

  describe('Utility Functions', () => {
    describe('getPageLayoutToken', () => {
      test('returns page token for valid ID', () => {
        const dashboard = getPageLayoutToken('page.dashboard');
        expect(dashboard).toBeDefined();
        expect(dashboard!.id).toBe('page.dashboard');
      });

      test('returns undefined for invalid ID', () => {
        const invalid = getPageLayoutToken('page.nonexistent');
        expect(invalid).toBeUndefined();
      });

      test('returns correct page for each valid ID', () => {
        expect(getPageLayoutToken('page.job')).toBe(PAGE_JOB);
        expect(getPageLayoutToken('page.resource')).toBe(PAGE_RESOURCE);
        expect(getPageLayoutToken('page.dashboard')).toBe(PAGE_DASHBOARD);
        expect(getPageLayoutToken('page.settings')).toBe(PAGE_SETTINGS);
        expect(getPageLayoutToken('page.detail')).toBe(PAGE_DETAIL);
        expect(getPageLayoutToken('page.empty')).toBe(PAGE_EMPTY);
        expect(getPageLayoutToken('page.wizard')).toBe(PAGE_WIZARD);
        expect(getPageLayoutToken('page.onboarding')).toBe(PAGE_ONBOARDING);
      });
    });

    describe('getAllPageLayoutTokens', () => {
      test('returns 8 page layout tokens', () => {
        const pages = getAllPageLayoutTokens();
        expect(pages).toHaveLength(8);
      });

      test('returns array of PageLayoutToken objects', () => {
        const pages = getAllPageLayoutTokens();
        pages.forEach(page => {
          expect(page.id).toBeDefined();
          expect(page.description).toBeDefined();
          expect(page.purpose).toBeDefined();
          expect(page.sections).toBeDefined();
          expect(page.responsive).toBeDefined();
          expect(page.tokenBindings).toBeDefined();
        });
      });

      test('includes all expected page tokens', () => {
        const pages = getAllPageLayoutTokens();
        const pageIds = pages.map(p => p.id);

        expect(pageIds).toContain('page.job');
        expect(pageIds).toContain('page.resource');
        expect(pageIds).toContain('page.dashboard');
        expect(pageIds).toContain('page.settings');
        expect(pageIds).toContain('page.detail');
        expect(pageIds).toContain('page.empty');
        expect(pageIds).toContain('page.wizard');
        expect(pageIds).toContain('page.onboarding');
      });
    });

    describe('getPagesByPurpose', () => {
      test('filters pages by purpose correctly', () => {
        const dashboards = getPagesByPurpose('dashboard');
        expect(dashboards).toHaveLength(1);
        expect(dashboards[0].id).toBe('page.dashboard');
      });

      test('returns empty array for non-existent purpose', () => {
        // @ts-expect-error Testing invalid purpose
        const invalid = getPagesByPurpose('nonexistent');
        expect(invalid).toHaveLength(0);
      });

      test('filters job pages correctly', () => {
        const jobs = getPagesByPurpose('job');
        expect(jobs).toHaveLength(1);
        expect(jobs[0].purpose).toBe('job');
      });

      test('filters resource pages correctly', () => {
        const resources = getPagesByPurpose('resource');
        expect(resources).toHaveLength(1);
        expect(resources[0].purpose).toBe('resource');
      });

      test('filters settings pages correctly', () => {
        const settings = getPagesByPurpose('settings');
        expect(settings).toHaveLength(1);
        expect(settings[0].purpose).toBe('settings');
      });

      test('filters detail pages correctly', () => {
        const details = getPagesByPurpose('detail');
        expect(details).toHaveLength(1);
        expect(details[0].purpose).toBe('detail');
      });

      test('filters empty pages correctly', () => {
        const empties = getPagesByPurpose('empty');
        expect(empties).toHaveLength(1);
        expect(empties[0].purpose).toBe('empty');
      });

      test('filters wizard pages correctly', () => {
        const wizards = getPagesByPurpose('wizard');
        expect(wizards).toHaveLength(1);
        expect(wizards[0].purpose).toBe('wizard');
      });

      test('filters onboarding pages correctly', () => {
        const onboardings = getPagesByPurpose('onboarding');
        expect(onboardings).toHaveLength(1);
        expect(onboardings[0].purpose).toBe('onboarding');
      });
    });

    describe('getPageSections', () => {
      test('returns correct sections for page.dashboard', () => {
        const sections = getPageSections('page.dashboard');
        expect(sections.length).toBeGreaterThan(0);
        expect(sections.some(s => s.name === 'metrics')).toBe(true);
      });

      test('returns correct sections for page.resource', () => {
        const sections = getPageSections('page.resource');
        expect(sections.some(s => s.name === 'list')).toBe(true);
        expect(sections.some(s => s.name === 'detail')).toBe(true);
      });

      test('returns empty array for invalid page ID', () => {
        const sections = getPageSections('page.nonexistent');
        expect(sections).toEqual([]);
      });

      test('returns sections with correct structure', () => {
        const sections = getPageSections('page.job');
        sections.forEach(section => {
          expect(section.name).toBeDefined();
          expect(section.pattern).toBeDefined();
          expect(typeof section.required).toBe('boolean');
        });
      });
    });
  });

  describe('Section Requirements', () => {
    test('page.dashboard metrics section is required', () => {
      const dashboard = getPageLayoutToken('page.dashboard');
      const metrics = dashboard!.sections.find(s => s.name === 'metrics');
      expect(metrics?.required).toBe(true);
    });

    test('page.resource has list and detail sections', () => {
      const resource = getPageLayoutToken('page.resource');
      expect(resource!.sections.some(s => s.name === 'list')).toBe(true);
      expect(resource!.sections.some(s => s.name === 'detail')).toBe(true);
    });

    test('page.wizard has progress section', () => {
      const wizard = getPageLayoutToken('page.wizard');
      expect(wizard!.sections.some(s => s.name === 'progress')).toBe(true);
    });

    test('page.empty has illustration, message, and cta sections', () => {
      const empty = getPageLayoutToken('page.empty');
      expect(empty!.sections.some(s => s.name === 'illustration')).toBe(true);
      expect(empty!.sections.some(s => s.name === 'message')).toBe(true);
      expect(empty!.sections.some(s => s.name === 'cta')).toBe(true);
    });

    test('page.settings has content and actions sections', () => {
      const settings = getPageLayoutToken('page.settings');
      expect(settings!.sections.some(s => s.name === 'content')).toBe(true);
      expect(settings!.sections.some(s => s.name === 'actions')).toBe(true);
    });
  });

  describe('Allowed Components', () => {
    test('page.dashboard metrics section allows Card, Stat, Metric', () => {
      const dashboard = getPageLayoutToken('page.dashboard');
      const metrics = dashboard!.sections.find(s => s.name === 'metrics');
      expect(metrics?.allowedComponents).toContain('Card');
      expect(metrics?.allowedComponents).toContain('Stat');
      expect(metrics?.allowedComponents).toContain('Metric');
    });

    test('page.resource list section allows Table and List', () => {
      const resource = getPageLayoutToken('page.resource');
      const list = resource!.sections.find(s => s.name === 'list');
      expect(list?.allowedComponents).toContain('Table');
      expect(list?.allowedComponents).toContain('List');
    });

    test('page.wizard step section allows Form components', () => {
      const wizard = getPageLayoutToken('page.wizard');
      const step = wizard!.sections.find(s => s.name === 'step');
      expect(step?.allowedComponents).toContain('Form');
      expect(step?.allowedComponents).toContain('Input');
    });
  });

  describe('Responsive Configuration', () => {
    test('all pages have default responsive config', () => {
      const pages = getAllPageLayoutTokens();
      pages.forEach(page => {
        expect(page.responsive.default).toBeDefined();
      });
    });

    test('page.dashboard has responsive column configuration', () => {
      const dashboard = getPageLayoutToken('page.dashboard');
      expect(dashboard!.responsive.default).toHaveProperty('metricsColumns');
      expect(dashboard!.responsive.md).toHaveProperty('metricsColumns');
      expect(dashboard!.responsive.lg).toHaveProperty('metricsColumns');
    });

    test('page.resource has responsive layout configuration', () => {
      const resource = getPageLayoutToken('page.resource');
      expect(resource!.responsive.default).toHaveProperty('layout');
      expect(resource!.responsive.lg).toHaveProperty('layout');
    });

    test('responsive configs follow mobile-first pattern', () => {
      const pages = getAllPageLayoutTokens();
      pages.forEach(page => {
        // Default should always be defined (mobile-first)
        expect(page.responsive.default).toBeDefined();

        // Optional breakpoints
        if (page.responsive.md) {
          expect(typeof page.responsive.md).toBe('object');
        }
        if (page.responsive.lg) {
          expect(typeof page.responsive.lg).toBe('object');
        }
      });
    });
  });

  describe('Token Bindings', () => {
    test('all pages have background token binding', () => {
      const pages = getAllPageLayoutTokens();
      pages.forEach(page => {
        expect(page.tokenBindings).toHaveProperty('background');
      });
    });

    test('page.dashboard has section spacing token binding', () => {
      const dashboard = getPageLayoutToken('page.dashboard');
      expect(dashboard!.tokenBindings).toHaveProperty('sectionSpacing');
    });

    test('page.job has form-related token bindings', () => {
      const job = getPageLayoutToken('page.job');
      expect(job!.tokenBindings).toHaveProperty('formBackground');
    });
  });
});
