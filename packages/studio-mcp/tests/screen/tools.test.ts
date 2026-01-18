/**
 * Screen Tools Tests
 * TDD tests for screen.create, screen.addComponent, screen.applyArchetype, screen.list, screen.preview
 *
 * @module tests/screen/tools.test
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { ScreenTools, type ArchetypeName } from "../../src/screen/index.js";

// Test fixtures directory
const TEST_FIXTURES_DIR = join(tmpdir(), "studio-mcp-screen-test-fixtures");

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

describe("ScreenTools", () => {
  let tools: ScreenTools;

  beforeAll(() => {
    // Clean up any existing fixtures
    cleanupTestFixtures();
    mkdirSync(TEST_FIXTURES_DIR, { recursive: true });
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  beforeEach(() => {
    tools = new ScreenTools();
    vi.clearAllMocks();
  });

  describe("create", () => {
    describe("Next.js App Router", () => {
      it("should create screen file in app directory", async () => {
        const projectPath = createTestProject("next-app-create", {
          "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
          "package.json": '{ "name": "test-next-app" }',
        });

        const result = await tools.create({
          name: "user-profile",
          intent: "User profile page with avatar and bio",
          targetPath: "/users/profile",
          projectPath,
        });

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.filePath).toContain("app/users/profile/page.tsx");

        // Verify file was created
        const createdFilePath = join(projectPath, "app/users/profile/page.tsx");
        expect(existsSync(createdFilePath)).toBe(true);

        // Verify file content contains expected elements
        const content = readFileSync(createdFilePath, "utf-8");
        expect(content).toContain("UserProfilePage");
        expect(content).toContain("export default");
      });

      it("should create screen file in src/app directory when using src layout", async () => {
        const projectPath = createTestProject("next-app-src-create", {
          "src/app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
          "package.json": '{ "name": "test-next-app-src" }',
        });

        const result = await tools.create({
          name: "dashboard",
          intent: "Dashboard page with stats and charts",
          targetPath: "/dashboard",
          projectPath,
        });

        expect(result.success).toBe(true);
        expect(result.data?.filePath).toContain("src/app/dashboard/page.tsx");

        const createdFilePath = join(projectPath, "src/app/dashboard/page.tsx");
        expect(existsSync(createdFilePath)).toBe(true);
      });

      it("should include 'use client' directive for client components", async () => {
        const projectPath = createTestProject("next-app-client", {
          "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
          "package.json": '{ "name": "test-next-app" }',
        });

        const result = await tools.create({
          name: "interactive-form",
          intent: "Form with client-side validation",
          targetPath: "/form",
          projectPath,
        });

        expect(result.success).toBe(true);

        const createdFilePath = join(projectPath, "app/form/page.tsx");
        const content = readFileSync(createdFilePath, "utf-8");
        expect(content).toContain("'use client'");
      });
    });

    describe("Next.js Pages Router", () => {
      it("should create screen file in pages directory", async () => {
        const projectPath = createTestProject("next-pages-create", {
          "pages/_app.tsx": "export default function App({ Component, pageProps }) { return <Component {...pageProps} />; }",
          "package.json": '{ "name": "test-next-pages" }',
        });

        const result = await tools.create({
          name: "settings",
          intent: "User settings page",
          targetPath: "/settings",
          projectPath,
        });

        expect(result.success).toBe(true);
        expect(result.data?.filePath).toContain("pages/settings.tsx");

        const createdFilePath = join(projectPath, "pages/settings.tsx");
        expect(existsSync(createdFilePath)).toBe(true);
      });

      it("should create nested screen file in pages directory", async () => {
        const projectPath = createTestProject("next-pages-nested", {
          "pages/_app.tsx": "export default function App({ Component, pageProps }) { return <Component {...pageProps} />; }",
          "package.json": '{ "name": "test-next-pages" }',
        });

        const result = await tools.create({
          name: "user-settings",
          intent: "User settings page",
          targetPath: "/users/settings",
          projectPath,
        });

        expect(result.success).toBe(true);
        expect(result.data?.filePath).toContain("pages/users/settings.tsx");
      });
    });

    describe("Vite", () => {
      it("should create screen file in src/pages directory", async () => {
        const projectPath = createTestProject("vite-create", {
          "vite.config.ts": "import { defineConfig } from 'vite'; export default defineConfig({});",
          "src/main.tsx": "import React from 'react';",
          "package.json": '{ "name": "test-vite" }',
        });

        const result = await tools.create({
          name: "about",
          intent: "About page with company info",
          targetPath: "/about",
          projectPath,
        });

        expect(result.success).toBe(true);
        expect(result.data?.filePath).toContain("src/pages/about.tsx");

        const createdFilePath = join(projectPath, "src/pages/about.tsx");
        expect(existsSync(createdFilePath)).toBe(true);
      });
    });

    describe("Link injection", () => {
      it("should inject link into parent page when linkFrom is provided", async () => {
        const projectPath = createTestProject("next-app-link", {
          "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
          "app/users/page.tsx": `export default function UsersPage() {
  return (
    <div>
      <h1>Users</h1>
    </div>
  );
}`,
          "package.json": '{ "name": "test-next-app" }',
        });

        const result = await tools.create({
          name: "user-profile",
          intent: "User profile page",
          targetPath: "/users/profile",
          projectPath,
          linkFrom: {
            page: "/users",
            label: "View Profile",
          },
        });

        expect(result.success).toBe(true);
        expect(result.data?.linkInjected).toBe(true);

        // Verify link was injected into parent page
        const parentContent = readFileSync(join(projectPath, "app/users/page.tsx"), "utf-8");
        expect(parentContent).toContain("View Profile");
        expect(parentContent).toContain("/users/profile");
      });

      it("should return warning when parent page not found", async () => {
        const projectPath = createTestProject("next-app-no-parent", {
          "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
          "package.json": '{ "name": "test-next-app" }',
        });

        const result = await tools.create({
          name: "user-profile",
          intent: "User profile page",
          targetPath: "/users/profile",
          projectPath,
          linkFrom: {
            page: "/users",
            label: "View Profile",
          },
        });

        expect(result.success).toBe(true);
        expect(result.data?.linkInjected).toBe(false);
        expect(result.data?.warnings).toContain("Parent page not found");
      });
    });

    describe("Error handling", () => {
      it("should return error for invalid project path", async () => {
        const result = await tools.create({
          name: "test-screen",
          intent: "Test screen",
          targetPath: "/test",
          projectPath: "/non/existent/path",
        });

        expect(result.success).toBe(false);
        expect(result.error).toContain("does not exist");
      });

      it("should return error for empty name", async () => {
        const projectPath = createTestProject("next-app-error", {
          "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
          "package.json": '{ "name": "test-next-app" }',
        });

        const result = await tools.create({
          name: "",
          intent: "Test screen",
          targetPath: "/test",
          projectPath,
        });

        expect(result.success).toBe(false);
        expect(result.error).toContain("Invalid input");
      });

      it("should return error when screen already exists", async () => {
        const projectPath = createTestProject("next-app-exists", {
          "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
          "app/existing/page.tsx": "export default function ExistingPage() { return <div>Existing</div>; }",
          "package.json": '{ "name": "test-next-app" }',
        });

        const result = await tools.create({
          name: "existing",
          intent: "Test screen",
          targetPath: "/existing",
          projectPath,
        });

        expect(result.success).toBe(false);
        expect(result.error).toContain("already exists");
      });

      it("should return error for unknown framework", async () => {
        const projectPath = createTestProject("unknown-framework", {
          "package.json": '{ "name": "test-unknown" }',
        });

        const result = await tools.create({
          name: "test-screen",
          intent: "Test screen",
          targetPath: "/test",
          projectPath,
        });

        expect(result.success).toBe(false);
        expect(result.error).toContain("Unknown framework");
      });
    });
  });

  describe("addComponent", () => {
    it("should add component to existing screen", async () => {
      const projectPath = createTestProject("next-app-add-component", {
        "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
        "app/test/page.tsx": `'use client';

export default function TestPage() {
  return (
    <div className="container">
      <h1>Test Page</h1>
    </div>
  );
}`,
        "package.json": '{ "name": "test-next-app" }',
      });

      const result = await tools.addComponent({
        screenName: "test",
        componentType: "useButton",
        projectPath,
      });

      expect(result.success).toBe(true);
      expect(result.data?.componentAdded).toBe(true);

      const content = readFileSync(join(projectPath, "app/test/page.tsx"), "utf-8");
      expect(content).toContain("Button");
    });

    it("should add component with props", async () => {
      const projectPath = createTestProject("next-app-add-component-props", {
        "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
        "app/test/page.tsx": `'use client';

export default function TestPage() {
  return (
    <div className="container">
      <h1>Test Page</h1>
    </div>
  );
}`,
        "package.json": '{ "name": "test-next-app" }',
      });

      const result = await tools.addComponent({
        screenName: "test",
        componentType: "useButton",
        props: {
          variant: "primary",
          size: "large",
        },
        projectPath,
      });

      expect(result.success).toBe(true);

      const content = readFileSync(join(projectPath, "app/test/page.tsx"), "utf-8");
      expect(content).toContain("variant");
      expect(content).toContain("primary");
    });

    it("should return error for non-existent screen", async () => {
      const projectPath = createTestProject("next-app-no-screen", {
        "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
        "package.json": '{ "name": "test-next-app" }',
      });

      const result = await tools.addComponent({
        screenName: "non-existent",
        componentType: "useButton",
        projectPath,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("not found");
    });

    it("should return error for invalid componentType", async () => {
      const projectPath = createTestProject("next-app-invalid-component", {
        "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
        "app/test/page.tsx": "export default function TestPage() { return <div>Test</div>; }",
        "package.json": '{ "name": "test-next-app" }',
      });

      const result = await tools.addComponent({
        screenName: "test",
        componentType: "",
        projectPath,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid input");
    });
  });

  describe("applyArchetype", () => {
    it("should apply archetype styles to screen", async () => {
      const projectPath = createTestProject("next-app-archetype", {
        "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
        "app/test/page.tsx": `'use client';

export default function TestPage() {
  return (
    <div className="container">
      <h1>Test Page</h1>
    </div>
  );
}`,
        "package.json": '{ "name": "test-next-app" }',
      });

      const result = await tools.applyArchetype({
        screenName: "test",
        archetypeName: "Professional",
        projectPath,
      });

      expect(result.success).toBe(true);
      expect(result.data?.archetypeApplied).toBe(true);
      expect(result.data?.archetypeName).toBe("Professional");
    });

    it("should apply all valid archetypes", async () => {
      const archetypes: ArchetypeName[] = [
        "Professional",
        "Creative",
        "Minimal",
        "Bold",
        "Warm",
        "Cool",
        "High-Contrast",
      ];

      for (const archetype of archetypes) {
        const projectPath = createTestProject(`next-app-archetype-${archetype.toLowerCase()}`, {
          "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
          "app/test/page.tsx": "export default function TestPage() { return <div>Test</div>; }",
          "package.json": '{ "name": "test-next-app" }',
        });

        const result = await tools.applyArchetype({
          screenName: "test",
          archetypeName: archetype,
          projectPath,
        });

        expect(result.success).toBe(true);
        expect(result.data?.archetypeName).toBe(archetype);
      }
    });

    it("should return error for non-existent screen", async () => {
      const projectPath = createTestProject("next-app-no-screen-archetype", {
        "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
        "package.json": '{ "name": "test-next-app" }',
      });

      const result = await tools.applyArchetype({
        screenName: "non-existent",
        archetypeName: "Professional",
        projectPath,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("not found");
    });

    it("should return error for invalid archetype name", async () => {
      const projectPath = createTestProject("next-app-invalid-archetype", {
        "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
        "app/test/page.tsx": "export default function TestPage() { return <div>Test</div>; }",
        "package.json": '{ "name": "test-next-app" }',
      });

      const result = await tools.applyArchetype({
        screenName: "test",
        // @ts-expect-error Testing invalid input
        archetypeName: "InvalidArchetype",
        projectPath,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid input");
    });
  });

  describe("list", () => {
    it("should list all screens in Next.js App Router project", async () => {
      const projectPath = createTestProject("next-app-list", {
        "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
        "app/page.tsx": "export default function HomePage() { return <div>Home</div>; }",
        "app/about/page.tsx": "export default function AboutPage() { return <div>About</div>; }",
        "app/users/page.tsx": "export default function UsersPage() { return <div>Users</div>; }",
        "app/users/profile/page.tsx": "export default function ProfilePage() { return <div>Profile</div>; }",
        "package.json": '{ "name": "test-next-app" }',
      });

      const result = await tools.list({ projectPath });

      expect(result.success).toBe(true);
      expect(result.data?.screens).toBeDefined();
      expect(result.data?.screens.length).toBe(4);

      const screenNames = result.data?.screens.map((s) => s.name);
      expect(screenNames).toContain("home");
      expect(screenNames).toContain("about");
      expect(screenNames).toContain("users");
      expect(screenNames).toContain("profile");
    });

    it("should include route path in screen metadata", async () => {
      const projectPath = createTestProject("next-app-list-routes", {
        "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
        "app/users/profile/page.tsx": "export default function ProfilePage() { return <div>Profile</div>; }",
        "package.json": '{ "name": "test-next-app" }',
      });

      const result = await tools.list({ projectPath });

      expect(result.success).toBe(true);
      const profileScreen = result.data?.screens.find((s) => s.name === "profile");
      expect(profileScreen?.routePath).toBe("/users/profile");
    });

    it("should return empty list for project without screens", async () => {
      const projectPath = createTestProject("next-app-empty", {
        "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
        "package.json": '{ "name": "test-next-app" }',
      });

      const result = await tools.list({ projectPath });

      expect(result.success).toBe(true);
      expect(result.data?.screens).toEqual([]);
    });

    it("should list screens in Next.js Pages Router project", async () => {
      const projectPath = createTestProject("next-pages-list", {
        "pages/_app.tsx": "export default function App({ Component, pageProps }) { return <Component {...pageProps} />; }",
        "pages/index.tsx": "export default function HomePage() { return <div>Home</div>; }",
        "pages/about.tsx": "export default function AboutPage() { return <div>About</div>; }",
        "package.json": '{ "name": "test-next-pages" }',
      });

      const result = await tools.list({ projectPath });

      expect(result.success).toBe(true);
      expect(result.data?.screens.length).toBe(2);
    });

    it("should return error for invalid project path", async () => {
      const result = await tools.list({ projectPath: "/non/existent/path" });

      expect(result.success).toBe(false);
      expect(result.error).toContain("does not exist");
    });
  });

  describe("preview", () => {
    it("should return preview URL for existing screen", async () => {
      const projectPath = createTestProject("next-app-preview", {
        "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
        "app/users/profile/page.tsx": "export default function ProfilePage() { return <div>Profile</div>; }",
        "package.json": '{ "name": "test-next-app" }',
      });

      const result = await tools.preview({
        screenName: "profile",
        projectPath,
      });

      expect(result.success).toBe(true);
      expect(result.data?.previewUrl).toBe("http://localhost:3000/users/profile");
    });

    it("should return preview URL with custom dev server port", async () => {
      const customTools = new ScreenTools({ devServerUrl: "http://localhost:5173" });

      const projectPath = createTestProject("vite-preview", {
        "vite.config.ts": "import { defineConfig } from 'vite'; export default defineConfig({});",
        "src/pages/about.tsx": "export default function AboutPage() { return <div>About</div>; }",
        "package.json": '{ "name": "test-vite" }',
      });

      const result = await customTools.preview({
        screenName: "about",
        projectPath,
      });

      expect(result.success).toBe(true);
      expect(result.data?.previewUrl).toBe("http://localhost:5173/about");
    });

    it("should return error for non-existent screen", async () => {
      const projectPath = createTestProject("next-app-no-preview", {
        "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
        "package.json": '{ "name": "test-next-app" }',
      });

      const result = await tools.preview({
        screenName: "non-existent",
        projectPath,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("not found");
    });

    it("should return error for empty screenName", async () => {
      const projectPath = createTestProject("next-app-empty-preview", {
        "app/layout.tsx": "export default function RootLayout({ children }) { return <html>{children}</html>; }",
        "package.json": '{ "name": "test-next-app" }',
      });

      const result = await tools.preview({
        screenName: "",
        projectPath,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid input");
    });
  });
});
