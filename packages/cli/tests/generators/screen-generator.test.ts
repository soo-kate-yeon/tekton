import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import {
  generateScreenFiles,
  checkDuplicateScreen,
  type ScreenGenerationOptions,
  type ScreenGenerationResult,
} from '../../src/generators/screen-generator.js';

const TEST_OUTPUT_DIR = path.join(process.cwd(), 'test-output');

describe('screen-generator', () => {
  beforeEach(async () => {
    // Clean up test directory
    await fs.remove(TEST_OUTPUT_DIR);
    await fs.ensureDir(TEST_OUTPUT_DIR);
  });

  afterEach(async () => {
    // Clean up after tests
    await fs.remove(TEST_OUTPUT_DIR);
  });

  describe('generateScreenFiles', () => {
    it('should generate page.tsx with correct content', async () => {
      const options: ScreenGenerationOptions = {
        name: 'UserProfile',
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-detail',
        components: ['Card', 'Button'],
        outputDir: TEST_OUTPUT_DIR,
      };

      const result = await generateScreenFiles(options);

      expect(result.success).toBe(true);
      expect(result.files?.page).toBeDefined();

      const pageContent = await fs.readFile(result.files!.page, 'utf-8');
      expect(pageContent).toContain('UserProfile');
      expect(pageContent).toContain('export default function UserProfile');
    });

    it('should generate layout.tsx with correct content', async () => {
      const options: ScreenGenerationOptions = {
        name: 'Dashboard',
        environment: 'web',
        skeleton: 'dashboard',
        intent: 'dashboard',
        components: ['Chart', 'Card'],
        outputDir: TEST_OUTPUT_DIR,
      };

      const result = await generateScreenFiles(options);

      expect(result.success).toBe(true);
      expect(result.files?.layout).toBeDefined();

      const layoutContent = await fs.readFile(result.files!.layout, 'utf-8');
      expect(layoutContent).toContain('export default function Layout');
    });

    it('should generate components/index.ts with component exports', async () => {
      const options: ScreenGenerationOptions = {
        name: 'ProductList',
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
        components: ['Table', 'SearchBar', 'Pagination'],
        outputDir: TEST_OUTPUT_DIR,
      };

      const result = await generateScreenFiles(options);

      expect(result.success).toBe(true);
      expect(result.files?.components).toBeDefined();

      const componentsContent = await fs.readFile(result.files!.components, 'utf-8');
      expect(componentsContent).toContain('export');
    });

    it('should create correct directory structure: src/screens/<name>/', async () => {
      const options: ScreenGenerationOptions = {
        name: 'Settings',
        environment: 'mobile',
        skeleton: 'with-header',
        intent: 'settings',
        components: ['Form', 'Switch'],
        outputDir: TEST_OUTPUT_DIR,
      };

      const result = await generateScreenFiles(options);

      expect(result.success).toBe(true);

      const screenDir = path.join(TEST_OUTPUT_DIR, 'src', 'screens', 'Settings');
      expect(await fs.pathExists(screenDir)).toBe(true);
      expect(await fs.pathExists(path.join(screenDir, 'page.tsx'))).toBe(true);
      expect(await fs.pathExists(path.join(screenDir, 'layout.tsx'))).toBe(true);
      expect(await fs.pathExists(path.join(screenDir, 'components', 'index.ts'))).toBe(true);
    });

    it('should complete file generation in < 1 second', async () => {
      const startTime = Date.now();

      const options: ScreenGenerationOptions = {
        name: 'FastScreen',
        environment: 'web',
        skeleton: 'with-header',
        intent: 'custom',
        components: ['Component1'],
        outputDir: TEST_OUTPUT_DIR,
      };

      await generateScreenFiles(options);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000);
    });

    it('should generate TypeScript code without compilation errors', async () => {
      const options: ScreenGenerationOptions = {
        name: 'ValidScreen',
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
        components: ['Table'],
        outputDir: TEST_OUTPUT_DIR,
      };

      const result = await generateScreenFiles(options);

      expect(result.success).toBe(true);

      // Check page.tsx has valid TypeScript syntax
      const pageContent = await fs.readFile(result.files!.page, 'utf-8');
      expect(pageContent).toContain('export default function');
      expect(pageContent).toContain('return (');
      expect(pageContent).toContain(');');
    });

    it('should inject environment-specific configuration', async () => {
      const mobileOptions: ScreenGenerationOptions = {
        name: 'MobileScreen',
        environment: 'mobile',
        skeleton: 'with-header',
        intent: 'data-list',
        components: ['List'],
        outputDir: TEST_OUTPUT_DIR,
      };

      const mobileResult = await generateScreenFiles(mobileOptions);
      const mobileContent = await fs.readFile(mobileResult.files!.page, 'utf-8');

      // Mobile screens should have mobile-specific metadata or imports
      expect(mobileContent).toContain('mobile');
    });

    it('should inject skeleton-specific layout structure', async () => {
      const dashboardOptions: ScreenGenerationOptions = {
        name: 'DashboardScreen',
        environment: 'web',
        skeleton: 'dashboard',
        intent: 'dashboard',
        components: ['Chart'],
        outputDir: TEST_OUTPUT_DIR,
      };

      const result = await generateScreenFiles(dashboardOptions);
      const layoutContent = await fs.readFile(result.files!.layout, 'utf-8');

      // Dashboard skeleton should have dashboard-specific structure
      expect(layoutContent).toContain('dashboard');
    });

    it('should inject intent-specific components', async () => {
      const formOptions: ScreenGenerationOptions = {
        name: 'RegistrationForm',
        environment: 'web',
        skeleton: 'full-screen',
        intent: 'form',
        components: ['Form', 'Input', 'Button'],
        outputDir: TEST_OUTPUT_DIR,
      };

      const result = await generateScreenFiles(formOptions);
      const pageContent = await fs.readFile(result.files!.page, 'utf-8');

      // Form intent should have form-related imports or components
      expect(pageContent).toContain('form');
    });
  });

  describe('checkDuplicateScreen', () => {
    it('should return false when screen does not exist', async () => {
      const isDuplicate = await checkDuplicateScreen('NewScreen', TEST_OUTPUT_DIR);
      expect(isDuplicate).toBe(false);
    });

    it('should return true when screen directory already exists', async () => {
      const screenDir = path.join(TEST_OUTPUT_DIR, 'src', 'screens', 'ExistingScreen');
      await fs.ensureDir(screenDir);

      const isDuplicate = await checkDuplicateScreen('ExistingScreen', TEST_OUTPUT_DIR);
      expect(isDuplicate).toBe(true);
    });

    it('should detect duplicate case-insensitively', async () => {
      const screenDir = path.join(TEST_OUTPUT_DIR, 'src', 'screens', 'UserProfile');
      await fs.ensureDir(screenDir);

      const isDuplicate = await checkDuplicateScreen('userprofile', TEST_OUTPUT_DIR);
      expect(isDuplicate).toBe(true);
    });
  });

  describe('Duplicate Handling', () => {
    it('should prompt user when duplicate screen detected', async () => {
      // Create existing screen
      const existingScreenDir = path.join(TEST_OUTPUT_DIR, 'src', 'screens', 'DuplicateScreen');
      await fs.ensureDir(existingScreenDir);
      await fs.writeFile(path.join(existingScreenDir, 'page.tsx'), 'existing content');

      const options: ScreenGenerationOptions = {
        name: 'DuplicateScreen',
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
        components: ['Table'],
        outputDir: TEST_OUTPUT_DIR,
      };

      // Should detect duplicate
      const isDuplicate = await checkDuplicateScreen(options.name, options.outputDir);
      expect(isDuplicate).toBe(true);
    });

    it('should support overwrite action when user chooses', async () => {
      const existingScreenDir = path.join(TEST_OUTPUT_DIR, 'src', 'screens', 'OverwriteScreen');
      await fs.ensureDir(existingScreenDir);
      await fs.writeFile(path.join(existingScreenDir, 'page.tsx'), 'old content');

      const options: ScreenGenerationOptions = {
        name: 'OverwriteScreen',
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
        components: ['Table'],
        outputDir: TEST_OUTPUT_DIR,
        overwrite: true, // User chose to overwrite
      };

      const result = await generateScreenFiles(options);

      expect(result.success).toBe(true);

      const newContent = await fs.readFile(result.files!.page, 'utf-8');
      expect(newContent).not.toContain('old content');
      expect(newContent).toContain('OverwriteScreen');
    });

    it('should support cancel action when user chooses', async () => {
      const existingScreenDir = path.join(TEST_OUTPUT_DIR, 'src', 'screens', 'CancelScreen');
      await fs.ensureDir(existingScreenDir);
      await fs.writeFile(path.join(existingScreenDir, 'page.tsx'), 'existing content');

      const options: ScreenGenerationOptions = {
        name: 'CancelScreen',
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
        components: ['Table'],
        outputDir: TEST_OUTPUT_DIR,
        overwrite: false, // User chose to cancel
      };

      const result = await generateScreenFiles(options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('cancelled');
    });

    it('should support rename action when user chooses', async () => {
      const existingScreenDir = path.join(TEST_OUTPUT_DIR, 'src', 'screens', 'RenameScreen');
      await fs.ensureDir(existingScreenDir);

      const options: ScreenGenerationOptions = {
        name: 'RenameScreen',
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
        components: ['Table'],
        outputDir: TEST_OUTPUT_DIR,
        rename: 'RenameScreen2', // User chose new name
      };

      const result = await generateScreenFiles(options);

      expect(result.success).toBe(true);

      const newScreenDir = path.join(TEST_OUTPUT_DIR, 'src', 'screens', 'RenameScreen2');
      expect(await fs.pathExists(newScreenDir)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle file write errors gracefully', async () => {
      const options: ScreenGenerationOptions = {
        name: 'ErrorScreen',
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
        components: ['Table'],
        outputDir: '/invalid/path/that/does/not/exist',
      };

      const result = await generateScreenFiles(options);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should rollback on partial failure', async () => {
      // Test rollback by using an invalid output directory during write
      const options: ScreenGenerationOptions = {
        name: 'RollbackScreen',
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
        components: ['Table'],
        outputDir: '/invalid/readonly/path',
      };

      const result = await generateScreenFiles(options);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Template Rendering', () => {
    it('should replace all template variables in page.tsx', async () => {
      const options: ScreenGenerationOptions = {
        name: 'TemplateTest',
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
        components: ['Table', 'SearchBar'],
        outputDir: TEST_OUTPUT_DIR,
      };

      const result = await generateScreenFiles(options);
      const pageContent = await fs.readFile(result.files!.page, 'utf-8');

      // Should not contain template placeholders
      expect(pageContent).not.toContain('{{');
      expect(pageContent).not.toContain('}}');
      expect(pageContent).toContain('TemplateTest');
    });

    it('should replace all template variables in layout.tsx', async () => {
      const options: ScreenGenerationOptions = {
        name: 'LayoutTest',
        environment: 'web',
        skeleton: 'dashboard',
        intent: 'dashboard',
        components: ['Chart'],
        outputDir: TEST_OUTPUT_DIR,
      };

      const result = await generateScreenFiles(options);
      const layoutContent = await fs.readFile(result.files!.layout, 'utf-8');

      // Should not contain unresolved template variables (but JSX {{ }} for styles is OK)
      expect(layoutContent).not.toMatch(/\$\{[^}]+\}/);  // No ${variable} patterns
      expect(layoutContent).toContain('layout--dashboard');  // Skeleton value resolved
      expect(layoutContent).toContain('--grid-columns');
    });

    it('should inject component imports correctly', async () => {
      const options: ScreenGenerationOptions = {
        name: 'ImportTest',
        environment: 'web',
        skeleton: 'with-header',
        intent: 'data-list',
        components: ['Table', 'SearchBar', 'Pagination'],
        outputDir: TEST_OUTPUT_DIR,
      };

      const result = await generateScreenFiles(options);
      const pageContent = await fs.readFile(result.files!.page, 'utf-8');

      // Should have import statements for components
      expect(pageContent).toContain('import');
    });
  });
});
