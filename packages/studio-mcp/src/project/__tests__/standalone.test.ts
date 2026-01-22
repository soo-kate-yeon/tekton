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
import { projectStatus } from "../standalone.js";
import { readConfig, writeConfig } from "../config.js";
import type { TektonConfig } from "../config-types.js";
import { BUILTIN_THEME_IDS } from "../../theme/types.js";

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
        theme: {
          activeThemeId: "next-tailwind-shadcn",
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
        theme: {
          activeThemeId: null,
          selectedAt: null,
        },
      };

      writeConfig(testDir, config);

      const result = await projectStatus({ projectPath: testDir });

      expect(result.data?.mode).toBe("connected");
    });
  });

  // TODO: useBuiltinPreset function was removed during Preset → Theme API migration
  // These tests need to be rewritten for the new Theme API
  // describe("useBuiltinPreset", () => {
  //   ...tests commented out...
  // });
});
