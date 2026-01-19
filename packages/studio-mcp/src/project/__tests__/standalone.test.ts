/**
 * Standalone Project Tools Tests
 * TDD RED phase: Tests for project.status and project.useBuiltinPreset tools
 *
 * @module project/__tests__/standalone.test
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { projectStatus, useBuiltinPreset } from "../standalone.js";
import { readConfig, writeConfig } from "../config.js";
import type { TektonConfig } from "../config-types.js";
import { BUILTIN_PRESET_IDS } from "../../theme/types.js";

describe("Standalone Project Tools", () => {
  let testDir: string;

  beforeEach(() => {
    testDir = join(tmpdir(), `tekton-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("projectStatus", () => {
    it("should return success with default status when no config exists", async () => {
      const result = await projectStatus({ projectPath: testDir });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should return standalone mode by default", async () => {
      const result = await projectStatus({ projectPath: testDir });

      expect(result.data?.mode).toBe("standalone");
    });

    it("should return null activeTheme when no preset selected", async () => {
      const result = await projectStatus({ projectPath: testDir });

      expect(result.data?.activeTheme).toBeNull();
    });

    it("should return detected framework info when available", async () => {
      // Create a Next.js App Router project structure
      mkdirSync(join(testDir, "app"), { recursive: true });
      writeFileSync(join(testDir, "app", "layout.tsx"), "export default function Layout() {}");
      writeFileSync(join(testDir, "package.json"), JSON.stringify({ name: "test-project" }));

      const result = await projectStatus({ projectPath: testDir });

      expect(result.data?.project?.frameworkType).toBe("next-app");
    });

    it("should return active preset info from config", async () => {
      const config: TektonConfig = {
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

      writeConfig(testDir, config);

      const result = await projectStatus({ projectPath: testDir });

      expect(result.data?.activeTheme?.id).toBe("next-tailwind-shadcn");
      expect(result.data?.activeTheme?.name).toBeDefined();
    });

    it("should use current working directory when projectPath not provided", async () => {
      const result = await projectStatus({});

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should return connection mode from config", async () => {
      const config: TektonConfig = {
        $schema: "https://tekton.design/schemas/config.json",
        version: "1.0.0",
        mode: "connected",
        project: {
          name: "connected-project",
          frameworkType: "vite",
          detectedAt: new Date().toISOString(),
        },
        preset: {
          activePresetId: null,
          selectedAt: null,
        },
      };

      writeConfig(testDir, config);

      const result = await projectStatus({ projectPath: testDir });

      expect(result.data?.mode).toBe("connected");
    });
  });

  describe("useBuiltinPreset", () => {
    it("should return success when selecting valid preset", async () => {
      const result = await useBuiltinPreset({
        themeId: "next-tailwind-shadcn",
        projectPath: testDir,
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should return error for invalid preset ID", async () => {
      const result = await useBuiltinPreset({
        themeId: "invalid-preset",
        projectPath: testDir,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid preset ID");
    });

    it("should return error for empty preset ID", async () => {
      const result = await useBuiltinPreset({
        themeId: "",
        projectPath: testDir,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("required");
    });

    it("should return error for whitespace-only preset ID", async () => {
      const result = await useBuiltinPreset({
        themeId: "   ",
        projectPath: testDir,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("required");
    });

    it("should persist preset selection to config", async () => {
      await useBuiltinPreset({
        themeId: "saas-dashboard",
        projectPath: testDir,
      });

      const config = readConfig(testDir);
      expect(config?.preset.activePresetId).toBe("saas-dashboard");
    });

    it("should return preset info in response", async () => {
      const result = await useBuiltinPreset({
        themeId: "tech-startup",
        projectPath: testDir,
      });

      expect(result.data?.preset.id).toBe("tech-startup");
      expect(result.data?.preset.name).toBeDefined();
      expect(result.data?.preset.brandTone).toBe("creative");
    });

    it("should update selectedAt timestamp", async () => {
      const before = new Date().toISOString();

      await useBuiltinPreset({
        themeId: "premium-editorial",
        projectPath: testDir,
      });

      const config = readConfig(testDir);
      expect(config?.preset.selectedAt).toBeDefined();
      expect(new Date(config?.preset.selectedAt ?? "").getTime()).toBeGreaterThanOrEqual(
        new Date(before).getTime()
      );
    });

    it("should preserve existing project info when updating preset", async () => {
      const initialConfig: TektonConfig = {
        $schema: "https://tekton.design/schemas/config.json",
        version: "1.0.0",
        mode: "standalone",
        project: {
          name: "existing-project",
          frameworkType: "vite",
          detectedAt: "2026-01-01T00:00:00Z",
        },
        preset: {
          activePresetId: "next-tailwind-shadcn",
          selectedAt: "2026-01-01T00:00:00Z",
        },
      };

      writeConfig(testDir, initialConfig);

      await useBuiltinPreset({
        themeId: "vite-tailwind-shadcn",
        projectPath: testDir,
      });

      const config = readConfig(testDir);
      expect(config?.project.name).toBe("existing-project");
      expect(config?.project.frameworkType).toBe("vite");
      expect(config?.preset.activePresetId).toBe("vite-tailwind-shadcn");
    });

    it("should work for all built-in preset IDs", async () => {
      for (const themeId of BUILTIN_PRESET_IDS) {
        // Clean up and recreate test dir for each iteration
        if (existsSync(testDir)) {
          rmSync(testDir, { recursive: true, force: true });
        }
        mkdirSync(testDir, { recursive: true });

        const result = await useBuiltinPreset({
          themeId,
          projectPath: testDir,
        });

        expect(result.success).toBe(true);
        expect(result.data?.preset.id).toBe(themeId);
      }
    });

    it("should create .tekton directory if it does not exist", async () => {
      await useBuiltinPreset({
        themeId: "next-tailwind-shadcn",
        projectPath: testDir,
      });

      expect(existsSync(join(testDir, ".tekton"))).toBe(true);
      expect(existsSync(join(testDir, ".tekton", "config.json"))).toBe(true);
    });
  });
});
