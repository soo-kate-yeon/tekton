/**
 * @tekton/ui - Template Registry Tests
 * SPEC-UI-001 Phase 3: Template Registry Unit Tests
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { TemplateRegistry } from '../registry';
import { LoginTemplate } from '../auth/login';
import { DashboardTemplate } from '../dashboard/overview';
describe('TemplateRegistry', () => {
  let registry;
  beforeEach(() => {
    // Get a fresh instance and clear it
    registry = TemplateRegistry.getInstance();
    registry.clear();
  });
  describe('Singleton Pattern', () => {
    it('returns same instance', () => {
      const instance1 = TemplateRegistry.getInstance();
      const instance2 = TemplateRegistry.getInstance();
      expect(instance1).toBe(instance2);
    });
  });
  describe('Registration', () => {
    it('registers a single template', () => {
      registry.register(LoginTemplate);
      expect(registry.has('auth.login')).toBe(true);
      expect(registry.count()).toBe(1);
    });
    it('registers multiple templates', () => {
      registry.registerMany([LoginTemplate, DashboardTemplate]);
      expect(registry.count()).toBe(2);
      expect(registry.has('auth.login')).toBe(true);
      expect(registry.has('dashboard.overview')).toBe(true);
    });
    it('overwrites existing template with warning', () => {
      registry.register(LoginTemplate);
      registry.register(LoginTemplate);
      expect(registry.count()).toBe(1);
    });
  });
  describe('Retrieval', () => {
    beforeEach(() => {
      registry.registerMany([LoginTemplate, DashboardTemplate]);
    });
    it('gets template by ID', () => {
      const template = registry.get('auth.login');
      expect(template).toBeDefined();
      expect(template?.id).toBe('auth.login');
    });
    it('returns undefined for non-existent template', () => {
      const template = registry.get('non.existent');
      expect(template).toBeUndefined();
    });
    it('gets all templates', () => {
      const all = registry.getAll();
      expect(all).toHaveLength(2);
    });
    it('gets templates by category', () => {
      const authTemplates = registry.getByCategory('auth');
      expect(authTemplates).toHaveLength(1);
      expect(authTemplates[0]?.id).toBe('auth.login');
      const dashboardTemplates = registry.getByCategory('dashboard');
      expect(dashboardTemplates).toHaveLength(1);
      expect(dashboardTemplates[0]?.id).toBe('dashboard.overview');
    });
  });
  describe('Search', () => {
    beforeEach(() => {
      registry.registerMany([LoginTemplate, DashboardTemplate]);
    });
    it('finds templates by required components', () => {
      const withCard = registry.findByRequiredComponents(['Card']);
      expect(withCard.length).toBeGreaterThan(0);
    });
    it('finds templates with all specified components', () => {
      const withButtonAndCard = registry.findByRequiredComponents(['Button', 'Card']);
      expect(withButtonAndCard.some(t => t.id === 'auth.login')).toBe(true);
    });
    it('searches by keyword in id', () => {
      const results = registry.search('login');
      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe('auth.login');
    });
    it('searches by keyword in name', () => {
      const results = registry.search('dashboard');
      expect(results.length).toBeGreaterThan(0);
    });
    it('searches by keyword in tags', () => {
      const results = registry.search('auth');
      expect(results.some(t => t.id === 'auth.login')).toBe(true);
    });
    it('search is case-insensitive', () => {
      const results = registry.search('LOGIN');
      expect(results).toHaveLength(1);
    });
  });
  describe('Metadata Tracking', () => {
    beforeEach(() => {
      registry.register(LoginTemplate);
    });
    it('tracks usage count', () => {
      registry.get('auth.login');
      registry.get('auth.login');
      const metadata = registry.getMetadata('auth.login');
      expect(metadata?.usageCount).toBe(2);
    });
    it('tracks last used timestamp', () => {
      registry.get('auth.login');
      const metadata = registry.getMetadata('auth.login');
      expect(metadata?.lastUsed).toBeDefined();
    });
    it('returns most used templates', () => {
      registry.registerMany([LoginTemplate, DashboardTemplate]);
      registry.get('auth.login');
      registry.get('auth.login');
      registry.get('dashboard.overview');
      const mostUsed = registry.getMostUsed(1);
      expect(mostUsed[0]?.id).toBe('auth.login');
    });
    it('returns recently used templates', async () => {
      registry.registerMany([LoginTemplate, DashboardTemplate]);
      registry.get('auth.login');
      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      registry.get('dashboard.overview');
      const recent = registry.getRecentlyUsed(2);
      expect(recent).toHaveLength(2);
      expect(recent[0]?.id).toBe('dashboard.overview');
    });
  });
  describe('Removal', () => {
    beforeEach(() => {
      registry.register(LoginTemplate);
    });
    it('removes a template', () => {
      expect(registry.remove('auth.login')).toBe(true);
      expect(registry.has('auth.login')).toBe(false);
    });
    it('returns false when removing non-existent template', () => {
      expect(registry.remove('non.existent')).toBe(false);
    });
    it('clears all templates', () => {
      registry.registerMany([LoginTemplate, DashboardTemplate]);
      registry.clear();
      expect(registry.count()).toBe(0);
    });
  });
});
//# sourceMappingURL=registry.test.js.map
