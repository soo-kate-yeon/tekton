/**
 * Config Manager Tests
 * TDD RED phase: Tests for local configuration management
 *
 * @module project/__tests__/config.test
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import {
  getConfigPath,
  readConfig,
  writeConfig,
  updateConfig,
  getDefaultConfig,
} from "../config.js";
import {
  TektonConfigSchema,
  type TektonConfig,
} from "../config-types.js";

describe("Config Manager", () => {
  let testDir: string;

  beforeEach(() => {
    // Create a unique temp directory for each test
    testDir = join(tmpdir(), `tekton-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    // Clean up test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("getConfigPath", () => {
    it("should return correct .tekton/config.json path", () => {
      const configPath = getConfigPath(testDir);
      expect(configPath).toBe(join(testDir, ".tekton", "config.json"));
    });

    it("should handle paths with trailing slash", () => {
      const configPath = getConfigPath(testDir + "/");
      expect(configPath).toBe(join(testDir, ".tekton", "config.json"));
    });
  });

  describe("getDefaultConfig", () => {
    it("should return valid default config", () => {
      const defaultConfig = getDefaultConfig();

      const result = TektonConfigSchema.safeParse(defaultConfig);
      expect(result.success).toBe(true);
    });

    it("should have standalone mode by default", () => {
      const defaultConfig = getDefaultConfig();
      expect(defaultConfig.mode).toBe("standalone");
    });

    it("should have correct schema URL", () => {
      const defaultConfig = getDefaultConfig();
      expect(defaultConfig.$schema).toBe("https://tekton.design/schemas/config.json");
    });

    it("should have version 1.0.0", () => {
      const defaultConfig = getDefaultConfig();
      expect(defaultConfig.version).toBe("1.0.0");
    });

    it("should have null active preset by default", () => {
      const defaultConfig = getDefaultConfig();
      expect(defaultConfig.preset.activePresetId).toBeNull();
    });
  });

  describe("readConfig", () => {
    it("should return null when .tekton directory does not exist", () => {
      const config = readConfig(testDir);
      expect(config).toBeNull();
    });

    it("should return null when config.json does not exist", () => {
      mkdirSync(join(testDir, ".tekton"), { recursive: true });
      const config = readConfig(testDir);
      expect(config).toBeNull();
    });

    it("should return null for corrupted JSON", () => {
      const tektonDir = join(testDir, ".tekton");
      mkdirSync(tektonDir, { recursive: true });
      writeFileSync(join(tektonDir, "config.json"), "{ invalid json }");

      const config = readConfig(testDir);
      expect(config).toBeNull();
    });

    it("should read valid config file", () => {
      const tektonDir = join(testDir, ".tekton");
      mkdirSync(tektonDir, { recursive: true });

      const testConfig: TektonConfig = {
        $schema: "https://tekton.design/schemas/config.json",
        version: "1.0.0",
        mode: "standalone",
        project: {
          name: "test-project",
          frameworkType: "next-app",
          detectedAt: new Date().toISOString(),
        },
        preset: {
          activePresetId: "next-tailwind-shadcn",
          selectedAt: new Date().toISOString(),
        },
      };

      writeFileSync(join(tektonDir, "config.json"), JSON.stringify(testConfig, null, 2));

      const config = readConfig(testDir);
      expect(config).not.toBeNull();
      expect(config?.mode).toBe("standalone");
      expect(config?.preset.activePresetId).toBe("next-tailwind-shadcn");
    });
  });

  describe("writeConfig", () => {
    it("should create .tekton directory if it does not exist", () => {
      const config = getDefaultConfig();
      writeConfig(testDir, config);

      expect(existsSync(join(testDir, ".tekton"))).toBe(true);
    });

    it("should write valid JSON config file", () => {
      const config: TektonConfig = {
        $schema: "https://tekton.design/schemas/config.json",
        version: "1.0.0",
        mode: "standalone",
        project: {
          name: "my-project",
          frameworkType: "vite",
          detectedAt: new Date().toISOString(),
        },
        preset: {
          activePresetId: "vite-tailwind-shadcn",
          selectedAt: new Date().toISOString(),
        },
      };

      writeConfig(testDir, config);

      const configPath = join(testDir, ".tekton", "config.json");
      expect(existsSync(configPath)).toBe(true);

      const content = readFileSync(configPath, "utf-8");
      const parsed = JSON.parse(content);
      expect(parsed.mode).toBe("standalone");
      expect(parsed.preset.activePresetId).toBe("vite-tailwind-shadcn");
    });

    it("should overwrite existing config", () => {
      const config1: TektonConfig = {
        $schema: "https://tekton.design/schemas/config.json",
        version: "1.0.0",
        mode: "standalone",
        project: {
          name: "project-1",
          frameworkType: "next-app",
          detectedAt: new Date().toISOString(),
        },
        preset: {
          activePresetId: "next-tailwind-shadcn",
          selectedAt: new Date().toISOString(),
        },
      };

      const config2: TektonConfig = {
        ...config1,
        project: {
          ...config1.project,
          name: "project-2",
        },
        preset: {
          activePresetId: "saas-dashboard",
          selectedAt: new Date().toISOString(),
        },
      };

      writeConfig(testDir, config1);
      writeConfig(testDir, config2);

      const savedConfig = readConfig(testDir);
      expect(savedConfig?.project.name).toBe("project-2");
      expect(savedConfig?.preset.activePresetId).toBe("saas-dashboard");
    });
  });

  describe("updateConfig", () => {
    it("should create config with defaults when no config exists", () => {
      const updated = updateConfig(testDir, {
        preset: {
          activePresetId: "tech-startup",
          selectedAt: new Date().toISOString(),
        },
      });

      expect(updated.mode).toBe("standalone");
      expect(updated.preset.activePresetId).toBe("tech-startup");
    });

    it("should preserve existing config values when updating", () => {
      const initialConfig: TektonConfig = {
        $schema: "https://tekton.design/schemas/config.json",
        version: "1.0.0",
        mode: "standalone",
        project: {
          name: "existing-project",
          frameworkType: "next-pages",
          detectedAt: "2026-01-01T00:00:00Z",
        },
        preset: {
          activePresetId: "next-tailwind-shadcn",
          selectedAt: "2026-01-01T00:00:00Z",
        },
      };

      writeConfig(testDir, initialConfig);

      const updated = updateConfig(testDir, {
        preset: {
          activePresetId: "premium-editorial",
          selectedAt: new Date().toISOString(),
        },
      });

      // Project info should be preserved
      expect(updated.project.name).toBe("existing-project");
      expect(updated.project.frameworkType).toBe("next-pages");
      // Preset should be updated
      expect(updated.preset.activePresetId).toBe("premium-editorial");
    });

    it("should merge nested objects correctly", () => {
      const initialConfig: TektonConfig = {
        $schema: "https://tekton.design/schemas/config.json",
        version: "1.0.0",
        mode: "standalone",
        project: {
          name: "test",
          frameworkType: "vite",
          detectedAt: "2026-01-01T00:00:00Z",
        },
        preset: {
          activePresetId: null,
          selectedAt: null,
        },
      };

      writeConfig(testDir, initialConfig);

      const updated = updateConfig(testDir, {
        project: {
          name: "updated-name",
          frameworkType: "vite",
          detectedAt: "2026-01-01T00:00:00Z",
        },
      });

      expect(updated.project.name).toBe("updated-name");
      expect(updated.preset.activePresetId).toBeNull();
    });

    it("should return the updated config", () => {
      const updated = updateConfig(testDir, {
        mode: "connected",
      });

      expect(updated.mode).toBe("connected");

      // Verify it was persisted
      const savedConfig = readConfig(testDir);
      expect(savedConfig?.mode).toBe("connected");
    });
  });

  describe("TektonConfigSchema validation", () => {
    it("should validate correct config", () => {
      const config: TektonConfig = {
        $schema: "https://tekton.design/schemas/config.json",
        version: "1.0.0",
        mode: "standalone",
        project: {
          name: "valid-project",
          frameworkType: "next-app",
          detectedAt: new Date().toISOString(),
        },
        preset: {
          activePresetId: "next-tailwind-shadcn",
          selectedAt: new Date().toISOString(),
        },
      };

      const result = TektonConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it("should accept connected mode", () => {
      const config: TektonConfig = {
        $schema: "https://tekton.design/schemas/config.json",
        version: "1.0.0",
        mode: "connected",
        project: {
          name: "connected-project",
          frameworkType: "next-app",
          detectedAt: new Date().toISOString(),
        },
        preset: {
          activePresetId: null,
          selectedAt: null,
        },
      };

      const result = TektonConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it("should accept null values for preset", () => {
      const config: TektonConfig = {
        $schema: "https://tekton.design/schemas/config.json",
        version: "1.0.0",
        mode: "standalone",
        project: {
          name: "no-preset",
          frameworkType: "unknown",
          detectedAt: new Date().toISOString(),
        },
        preset: {
          activePresetId: null,
          selectedAt: null,
        },
      };

      const result = TektonConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it("should reject invalid mode", () => {
      const config = {
        $schema: "https://tekton.design/schemas/config.json",
        version: "1.0.0",
        mode: "invalid-mode",
        project: {
          name: "test",
          frameworkType: "next-app",
          detectedAt: new Date().toISOString(),
        },
        preset: {
          activePresetId: null,
          selectedAt: null,
        },
      };

      const result = TektonConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });
  });
});
