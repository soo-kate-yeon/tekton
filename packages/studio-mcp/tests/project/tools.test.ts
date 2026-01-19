/**
 * Project Tools Tests
 * TDD tests for project.detectStructure, project.getActivePreset, project.setActivePreset
 *
 * @module tests/project/tools.test
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { ProjectTools } from "../../src/project/tools.js";

// Test fixtures directory
const TEST_FIXTURES_DIR = join(tmpdir(), "studio-mcp-test-fixtures");

// Helper to create test project structure
function createTestProject(name: string, structure: Record<string, string>): string {
  const projectPath = join(TEST_FIXTURES_DIR, name);

  // Create project directory
  mkdirSync(projectPath, { recursive: true });

  // Create files based on structure
  for (const [filePath, content] of Object.entries(structure)) {
    const fullPath = join(projectPath, filePath);
    const dirPath = fullPath.substring(0, fullPath.lastIndexOf("/"));
    if (dirPath && dirPath !== projectPath) {
      mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(fullPath, content);
  }

  return projectPath;
}

// Clean up test fixtures
function cleanupTestFixtures(): void {
  if (existsSync(TEST_FIXTURES_DIR)) {
    rmSync(TEST_FIXTURES_DIR, { recursive: true, force: true });
  }
}

describe("ProjectTools", () => {
  let tools: ProjectTools;

  beforeAll(() => {
    // Clean up any existing fixtures
    cleanupTestFixtures();
    mkdirSync(TEST_FIXTURES_DIR, { recursive: true });
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  beforeEach(() => {
    tools = new ProjectTools({
      baseUrl: "http://localhost:8000",
      timeout: 5000,
    });
    vi.clearAllMocks();
  });

  describe("detectStructure", () => {
    describe("Next.js App Router detection", () => {
      it("should detect Next.js App Router with app/layout.tsx", async () => {
        const projectPath = createTestProject("next-app-tsx", {
          "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
          "app/page.tsx": "export default function Home() { return <div>Home</div>; }",
          "package.json": '{ "name": "test-next-app" }',
        });

        const result = await tools.detectStructure({ projectPath });

        expect(result.success).toBe(true);
        expect(result.data?.frameworkType).toBe("next-app");
        expect(result.data?.appDirectory).toBe(join(projectPath, "app"));
        expect(result.data?.configFiles).toContain("package.json");
      });

      it("should detect Next.js App Router with app/layout.js", async () => {
        const projectPath = createTestProject("next-app-js", {
          "app/layout.js": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
          "package.json": '{ "name": "test-next-app-js" }',
        });

        const result = await tools.detectStructure({ projectPath });

        expect(result.success).toBe(true);
        expect(result.data?.frameworkType).toBe("next-app");
      });

      it("should detect Next.js App Router with src/app/layout.tsx", async () => {
        const projectPath = createTestProject("next-app-src", {
          "src/app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
          "src/app/page.tsx": "export default function Home() { return <div>Home</div>; }",
          "package.json": '{ "name": "test-next-app-src" }',
        });

        const result = await tools.detectStructure({ projectPath });

        expect(result.success).toBe(true);
        expect(result.data?.frameworkType).toBe("next-app");
        expect(result.data?.srcDirectory).toBe(join(projectPath, "src"));
      });
    });

    describe("Next.js Pages Router detection", () => {
      it("should detect Next.js Pages Router with pages/_app.tsx", async () => {
        const projectPath = createTestProject("next-pages-tsx", {
          "pages/_app.tsx": "export default function App({ Component, pageProps }) { return <Component {...pageProps} />; }",
          "pages/index.tsx": "export default function Home() { return <div>Home</div>; }",
          "package.json": '{ "name": "test-next-pages" }',
        });

        const result = await tools.detectStructure({ projectPath });

        expect(result.success).toBe(true);
        expect(result.data?.frameworkType).toBe("next-pages");
        expect(result.data?.pagesDirectory).toBe(join(projectPath, "pages"));
      });

      it("should detect Next.js Pages Router with pages/_app.js", async () => {
        const projectPath = createTestProject("next-pages-js", {
          "pages/_app.js": "export default function App({ Component, pageProps }) { return <Component {...pageProps} />; }",
          "package.json": '{ "name": "test-next-pages-js" }',
        });

        const result = await tools.detectStructure({ projectPath });

        expect(result.success).toBe(true);
        expect(result.data?.frameworkType).toBe("next-pages");
      });

      it("should detect Next.js Pages Router with src/pages/_app.tsx", async () => {
        const projectPath = createTestProject("next-pages-src", {
          "src/pages/_app.tsx": "export default function App({ Component, pageProps }) { return <Component {...pageProps} />; }",
          "package.json": '{ "name": "test-next-pages-src" }',
        });

        const result = await tools.detectStructure({ projectPath });

        expect(result.success).toBe(true);
        expect(result.data?.frameworkType).toBe("next-pages");
      });
    });

    describe("Vite detection", () => {
      it("should detect Vite with vite.config.ts", async () => {
        const projectPath = createTestProject("vite-ts", {
          "vite.config.ts": "import { defineConfig } from 'vite'; export default defineConfig({});",
          "src/main.tsx": "import React from 'react'; ReactDOM.render(<App />, document.getElementById('root'));",
          "package.json": '{ "name": "test-vite" }',
        });

        const result = await tools.detectStructure({ projectPath });

        expect(result.success).toBe(true);
        expect(result.data?.frameworkType).toBe("vite");
        expect(result.data?.configFiles).toContain("vite.config.ts");
      });

      it("should detect Vite with vite.config.js", async () => {
        const projectPath = createTestProject("vite-js", {
          "vite.config.js": "import { defineConfig } from 'vite'; export default defineConfig({});",
          "package.json": '{ "name": "test-vite-js" }',
        });

        const result = await tools.detectStructure({ projectPath });

        expect(result.success).toBe(true);
        expect(result.data?.frameworkType).toBe("vite");
        expect(result.data?.configFiles).toContain("vite.config.js");
      });
    });

    describe("Unknown framework detection", () => {
      it("should return unknown for project without recognized markers", async () => {
        const projectPath = createTestProject("unknown-project", {
          "package.json": '{ "name": "test-unknown" }',
          "index.html": "<html><body>Hello</body></html>",
        });

        const result = await tools.detectStructure({ projectPath });

        expect(result.success).toBe(true);
        expect(result.data?.frameworkType).toBe("unknown");
      });
    });

    describe("Error handling", () => {
      it("should return error for non-existent path", async () => {
        const result = await tools.detectStructure({
          projectPath: "/non/existent/path/12345",
        });

        expect(result.success).toBe(false);
        expect(result.error).toContain("does not exist");
      });

      it("should return error for empty project path", async () => {
        const result = await tools.detectStructure({ projectPath: "" });

        expect(result.success).toBe(false);
        expect(result.error).toContain("Invalid input");
      });
    });

    describe("Config file detection", () => {
      it("should detect multiple config files", async () => {
        const projectPath = createTestProject("multi-config", {
          "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
          "package.json": '{ "name": "test-multi-config" }',
          "tsconfig.json": '{ "compilerOptions": {} }',
          "next.config.js": "module.exports = {};",
          "tailwind.config.js": "module.exports = {};",
        });

        const result = await tools.detectStructure({ projectPath });

        expect(result.success).toBe(true);
        expect(result.data?.configFiles).toContain("package.json");
        expect(result.data?.configFiles).toContain("tsconfig.json");
        expect(result.data?.configFiles).toContain("next.config.js");
        expect(result.data?.configFiles).toContain("tailwind.config.js");
      });
    });

    describe("Framework detection priority", () => {
      it("should prioritize Next.js App Router over Pages Router when both exist", async () => {
        const projectPath = createTestProject("next-both", {
          "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
          "pages/_app.tsx": "export default function App({ Component, pageProps }) { return <Component {...pageProps} />; }",
          "package.json": '{ "name": "test-next-both" }',
        });

        const result = await tools.detectStructure({ projectPath });

        expect(result.success).toBe(true);
        expect(result.data?.frameworkType).toBe("next-app");
      });

      it("should prioritize Next.js over Vite when both exist", async () => {
        const projectPath = createTestProject("next-vite", {
          "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
          "vite.config.ts": "import { defineConfig } from 'vite'; export default defineConfig({});",
          "package.json": '{ "name": "test-next-vite" }',
        });

        const result = await tools.detectStructure({ projectPath });

        expect(result.success).toBe(true);
        expect(result.data?.frameworkType).toBe("next-app");
      });
    });
  });

  describe("getActivePreset", () => {
    describe("Successful retrieval", () => {
      it("should return active preset when one is set", async () => {
        // Mock fetch for API call
        const mockPreset = {
          id: 1,
          name: "Professional Dark",
          category: "professional",
          style_archetype: "Professional",
        };

        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ success: true, active_preset: mockPreset }),
        });

        const result = await tools.getActivePreset({});

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockPreset);
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/api/v2/settings/active-preset"),
          expect.objectContaining({ method: "GET" })
        );
      });

      it("should return null when no preset is active", async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ success: true, active_preset: null }),
        });

        const result = await tools.getActivePreset({});

        expect(result.success).toBe(true);
        expect(result.data).toBeNull();
      });

      it("should include project_path in query when provided", async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ success: true, active_preset: null }),
        });

        await tools.getActivePreset({ projectPath: "/test/project" });

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("project_path=%2Ftest%2Fproject"),
          expect.any(Object)
        );
      });
    });

    describe("Error handling", () => {
      it("should return error on API failure", async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ detail: "Internal server error" }),
        });

        const result = await tools.getActivePreset({});

        expect(result.success).toBe(false);
        expect(result.error).toContain("Internal server error");
      });

      it("should handle network errors", async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

        const result = await tools.getActivePreset({});

        expect(result.success).toBe(false);
        expect(result.error).toContain("Failed to get active preset");
      });

      it("should handle timeout errors", async () => {
        const timeoutError = new Error("Timeout");
        timeoutError.name = "TimeoutError";
        global.fetch = vi.fn().mockRejectedValue(timeoutError);

        const result = await tools.getActivePreset({});

        expect(result.success).toBe(false);
        expect(result.error).toContain("timed out");
      });
    });
  });

  describe("setActivePreset", () => {
    describe("Successful update", () => {
      it("should set active preset with valid preset ID", async () => {
        const mockPreset = {
          id: 2,
          name: "Creative Bright",
          category: "creative",
          style_archetype: "Creative",
        };

        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ success: true, active_preset: mockPreset }),
        });

        const result = await tools.setActivePreset({ themeId: 2 });

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockPreset);
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/api/v2/settings/active-preset"),
          expect.objectContaining({
            method: "PUT",
            body: expect.stringContaining('"theme_id":2'),
          })
        );
      });

      it("should include project_path in request body when provided", async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ success: true, active_preset: null }),
        });

        await tools.setActivePreset({
          themeId: 1,
          projectPath: "/test/project",
        });

        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: expect.stringContaining('"project_path":"/test/project"'),
          })
        );
      });
    });

    describe("Validation errors", () => {
      it("should return error for invalid preset ID (negative)", async () => {
        const result = await tools.setActivePreset({ themeId: -1 });

        expect(result.success).toBe(false);
        expect(result.error).toContain("Invalid input");
      });

      it("should return error for invalid preset ID (zero)", async () => {
        const result = await tools.setActivePreset({ themeId: 0 });

        expect(result.success).toBe(false);
        expect(result.error).toContain("Invalid input");
      });

      it("should return error for invalid preset ID (float)", async () => {
        const result = await tools.setActivePreset({ themeId: 1.5 });

        expect(result.success).toBe(false);
        expect(result.error).toContain("Invalid input");
      });
    });

    describe("API error handling", () => {
      it("should return error when preset not found", async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ detail: "Preset not found" }),
        });

        const result = await tools.setActivePreset({ themeId: 9999 });

        expect(result.success).toBe(false);
        expect(result.error).toContain("Preset not found");
      });

      it("should handle network errors", async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error("Connection refused"));

        const result = await tools.setActivePreset({ themeId: 1 });

        expect(result.success).toBe(false);
        expect(result.error).toContain("Failed to set active preset");
      });

      it("should handle timeout errors", async () => {
        const timeoutError = new Error("Timeout");
        timeoutError.name = "AbortError";
        global.fetch = vi.fn().mockRejectedValue(timeoutError);

        const result = await tools.setActivePreset({ themeId: 1 });

        expect(result.success).toBe(false);
        expect(result.error).toContain("timed out");
      });
    });
  });
});
