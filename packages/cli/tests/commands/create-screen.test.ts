import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createScreen, type CreateScreenOptions } from '../../src/commands/create-screen.js';

describe('create-screen command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Interactive Mode', () => {
    it('should prompt for environment selection', async () => {
      const options: CreateScreenOptions = {
        name: 'UserProfile',
        interactive: true,
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-detail',
      };

      const result = await createScreen(options);

      expect(result.success).toBe(true);
      expect(result.screenName).toBe('UserProfile');
    });

    it('should prompt for skeleton preset selection', async () => {
      const options: CreateScreenOptions = {
        name: 'Dashboard',
        interactive: true,
        environment: 'web',
        skeleton: 'dashboard',
        intent: 'dashboard',
      };

      const result = await createScreen(options);

      expect(result.success).toBe(true);
      expect(result.screenContract).toBeDefined();
      expect(result.screenContract?.skeleton).toBe('dashboard');
    });

    it('should prompt for screen intent selection', async () => {
      const options: CreateScreenOptions = {
        name: 'ProductList',
        interactive: true,
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
      };

      const result = await createScreen(options);

      expect(result.success).toBe(true);
      expect(result.screenContract?.intent).toBe('data-list');
    });

    it('should prompt for component selection', async () => {
      const options: CreateScreenOptions = {
        name: 'LoginForm',
        interactive: true,
        environment: 'web',
        skeleton: 'full-screen',
        intent: 'auth',
        components: ['Form', 'Input', 'Button'],
      };

      const result = await createScreen(options);

      expect(result.success).toBe(true);
      expect(result.screenContract?.components).toContain('Form');
      expect(result.screenContract?.components).toContain('Input');
      expect(result.screenContract?.components).toContain('Button');
    });

    it('should complete all 4 prompt steps in correct order', async () => {
      const options: CreateScreenOptions = {
        name: 'Settings',
        interactive: true,
        environment: 'mobile',
        skeleton: 'with-header',
        intent: 'settings',
        components: ['Form', 'Switch', 'Button'],
      };

      const result = await createScreen(options);

      expect(result.success).toBe(true);
      expect(result.screenContract?.environment).toBe('mobile');
      expect(result.screenContract?.skeleton).toBe('with-header');
      expect(result.screenContract?.intent).toBe('settings');
      expect(result.screenContract?.components).toHaveLength(3);
    });

    it('should suggest components based on selected intent', async () => {
      const options: CreateScreenOptions = {
        name: 'ProductList',
        interactive: true,
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
      };

      const result = await createScreen(options);

      expect(result.success).toBe(true);
      // DataList intent should suggest Table, Card, Pagination, SearchBar
      expect(result.suggestedComponents).toContain('Table');
      expect(result.suggestedComponents).toContain('Card');
    });
  });

  describe('Non-Interactive Mode', () => {
    it('should accept --env flag and bypass environment prompt', async () => {
      const options: CreateScreenOptions = {
        name: 'UserProfile',
        interactive: false,
        environment: 'mobile',
        skeleton: 'with-header',
        intent: 'data-detail',
      };

      const result = await createScreen(options);

      expect(result.success).toBe(true);
      expect(result.screenContract?.environment).toBe('mobile');
    });

    it('should accept --skeleton flag and bypass skeleton prompt', async () => {
      const options: CreateScreenOptions = {
        name: 'Dashboard',
        interactive: false,
        environment: 'web',
        skeleton: 'dashboard',
        intent: 'dashboard',
      };

      const result = await createScreen(options);

      expect(result.success).toBe(true);
      expect(result.screenContract?.skeleton).toBe('dashboard');
    });

    it('should accept --intent flag and bypass intent prompt', async () => {
      const options: CreateScreenOptions = {
        name: 'ProductList',
        interactive: false,
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
      };

      const result = await createScreen(options);

      expect(result.success).toBe(true);
      expect(result.screenContract?.intent).toBe('data-list');
    });

    it('should accept --components flag and bypass component prompt', async () => {
      const options: CreateScreenOptions = {
        name: 'LoginForm',
        interactive: false,
        environment: 'web',
        skeleton: 'full-screen',
        intent: 'auth',
        components: ['Form', 'Input', 'Button'],
      };

      const result = await createScreen(options);

      expect(result.success).toBe(true);
      expect(result.screenContract?.components).toEqual(['Form', 'Input', 'Button']);
    });

    it('should reject invalid environment value', async () => {
      const options: CreateScreenOptions = {
        name: 'UserProfile',
        interactive: false,
        environment: 'invalid-env' as any,
        skeleton: 'with-header',
        intent: 'data-detail',
      };

      const result = await createScreen(options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid environment');
    });

    it('should reject invalid skeleton value', async () => {
      const options: CreateScreenOptions = {
        name: 'Dashboard',
        interactive: false,
        environment: 'web',
        skeleton: 'invalid-skeleton' as any,
        intent: 'dashboard',
      };

      const result = await createScreen(options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid skeleton');
    });

    it('should reject invalid intent value', async () => {
      const options: CreateScreenOptions = {
        name: 'ProductList',
        interactive: false,
        environment: 'web',
        skeleton: 'with-header',
        intent: 'invalid-intent' as any,
      };

      const result = await createScreen(options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid intent');
    });

    it('should complete in < 2 seconds (faster than interactive)', async () => {
      const startTime = Date.now();

      const options: CreateScreenOptions = {
        name: 'FastScreen',
        interactive: false,
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
      };

      await createScreen(options);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(2000);
    });
  });

  describe('Screen Name Validation', () => {
    it('should accept valid PascalCase screen name', async () => {
      const options: CreateScreenOptions = {
        name: 'UserProfile',
        interactive: false,
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-detail',
      };

      const result = await createScreen(options);

      expect(result.success).toBe(true);
    });

    it('should reject empty screen name', async () => {
      const options: CreateScreenOptions = {
        name: '',
        interactive: false,
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-detail',
      };

      const result = await createScreen(options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Screen name is required');
    });

    it('should reject screen name with spaces', async () => {
      const options: CreateScreenOptions = {
        name: 'User Profile',
        interactive: false,
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-detail',
      };

      const result = await createScreen(options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid screen name format');
    });

    it('should reject screen name starting with lowercase', async () => {
      const options: CreateScreenOptions = {
        name: 'userProfile',
        interactive: false,
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-detail',
      };

      const result = await createScreen(options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Screen name must start with uppercase');
    });
  });

  describe('Performance', () => {
    it('should complete within 3 seconds end-to-end', async () => {
      const startTime = Date.now();

      const options: CreateScreenOptions = {
        name: 'PerformanceTest',
        interactive: false,
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
      };

      await createScreen(options);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(3000);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle all environment types correctly', async () => {
      const environments = ['web', 'mobile', 'tablet', 'responsive', 'tv', 'kiosk'];

      for (const env of environments) {
        const result = await createScreen({
          name: 'TestScreen',
          interactive: false,
          environment: env,
          skeleton: 'with-header',
          intent: 'data-list',
        });

        expect(result.success).toBe(true);
        expect(result.screenContract?.environment).toBe(env);
      }
    });

    it('should handle all skeleton presets correctly', async () => {
      const skeletons = [
        'full-screen',
        'with-header',
        'with-sidebar',
        'with-header-sidebar',
        'with-header-footer',
        'dashboard',
      ];

      for (const skeleton of skeletons) {
        const result = await createScreen({
          name: 'TestScreen',
          interactive: false,
          environment: 'web',
          skeleton,
          intent: 'custom',
        });

        expect(result.success).toBe(true);
        expect(result.screenContract?.skeleton).toBe(skeleton);
      }
    });

    it('should handle all intent types correctly', async () => {
      const intents = [
        'data-list',
        'data-detail',
        'dashboard',
        'form',
        'wizard',
        'auth',
        'settings',
        'empty-state',
        'error',
        'custom',
      ];

      for (const intent of intents) {
        const result = await createScreen({
          name: 'TestScreen',
          interactive: false,
          environment: 'web',
          skeleton: 'with-header',
          intent,
        });

        expect(result.success).toBe(true);
        expect(result.screenContract?.intent).toBe(intent);
      }
    });

    it('should provide different suggested components for different intents', async () => {
      const dataListResult = await createScreen({
        name: 'ListScreen',
        interactive: false,
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
      });

      const formResult = await createScreen({
        name: 'FormScreen',
        interactive: false,
        environment: 'web',
        skeleton: 'with-header',
        intent: 'form',
      });

      expect(dataListResult.suggestedComponents).toBeDefined();
      expect(formResult.suggestedComponents).toBeDefined();
      expect(dataListResult.suggestedComponents).not.toEqual(formResult.suggestedComponents);
    });

    it('should use provided components when specified', async () => {
      const customComponents = ['CustomComponent1', 'CustomComponent2'];

      const result = await createScreen({
        name: 'CustomScreen',
        interactive: false,
        environment: 'web',
        skeleton: 'with-header',
        intent: 'custom',
        components: customComponents,
      });

      expect(result.success).toBe(true);
      expect(result.screenContract?.components).toEqual(customComponents);
    });

    it('should use suggested components when none provided', async () => {
      const result = await createScreen({
        name: 'AutoScreen',
        interactive: false,
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
      });

      expect(result.success).toBe(true);
      expect(result.screenContract?.components).toBeDefined();
      expect(result.screenContract?.components.length).toBeGreaterThan(0);
    });
  });
});
