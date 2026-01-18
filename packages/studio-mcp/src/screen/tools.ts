/**
 * Screen MCP Tools
 * Tool handlers for screen creation, component management, and archetype application
 *
 * @module screen/tools
 */

import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, resolve, dirname, basename } from "path";
import {
  type CreateScreenInput,
  type AddComponentInput,
  type ApplyArchetypeInput,
  type ListScreensInput,
  type PreviewScreenInput,
  type CreateScreenResponse,
  type AddComponentResponse,
  type ApplyArchetypeResponse,
  type ListScreensResponse,
  type PreviewScreenResponse,
  type ScreenMetadata,
  CreateScreenInputSchema,
  AddComponentInputSchema,
  ApplyArchetypeInputSchema,
  ListScreensInputSchema,
  PreviewScreenInputSchema,
} from "./schemas.js";
import {
  generateNextAppTemplate,
  generateNextPagesTemplate,
  generateViteTemplate,
  generateComponentCode,
  generateComponentImport,
  insertComponentIntoContent,
  applyArchetypeToContent,
  insertLinkIntoContent,
} from "./templates.js";
import type { FrameworkType } from "../project/schemas.js";

/**
 * Tool result wrapper (consistent with project tools)
 */
export interface ToolResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Configuration for ScreenTools
 */
export interface ScreenToolsConfig {
  devServerUrl?: string;
}

/**
 * Screen Tools - provides MCP tool implementations for screen management
 */
export class ScreenTools {
  private config: ScreenToolsConfig;

  constructor(config?: ScreenToolsConfig) {
    this.config = config || {
      devServerUrl: "http://localhost:3000",
    };
  }

  /**
   * Create a new screen with routing setup
   */
  async create(
    input: CreateScreenInput & { projectPath?: string }
  ): Promise<ToolResult<CreateScreenResponse>> {
    // Validate input
    const validation = CreateScreenInputSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: `Invalid input: ${validation.error.message}`,
      };
    }

    const { name, intent, targetPath, linkFrom, projectPath } = validation.data;
    const absolutePath = resolve(projectPath || process.cwd());

    // Check if project path exists
    if (!existsSync(absolutePath)) {
      return {
        success: false,
        error: `Project path does not exist: ${absolutePath}`,
      };
    }

    // Detect framework type
    const frameworkType = this.detectFrameworkType(absolutePath);
    if (frameworkType === "unknown") {
      return {
        success: false,
        error: "Unknown framework. Cannot determine file generation path.",
      };
    }

    // Determine output file path
    const { filePath, routePath } = this.getScreenFilePath(
      absolutePath,
      targetPath,
      frameworkType
    );

    // Check if screen already exists
    if (existsSync(filePath)) {
      return {
        success: false,
        error: `Screen already exists at: ${filePath}`,
      };
    }

    // Generate screen content
    const content = this.generateScreenContent(
      name,
      intent,
      targetPath,
      frameworkType
    );

    // Create directory if it doesn't exist
    const dirPath = dirname(filePath);
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }

    // Write screen file
    writeFileSync(filePath, content, "utf-8");

    // Handle link injection if linkFrom is provided
    let linkInjected = false;
    const warnings: string[] = [];

    if (linkFrom) {
      const linkResult = this.injectLink(
        absolutePath,
        linkFrom.page,
        targetPath,
        linkFrom.label,
        frameworkType
      );
      linkInjected = linkResult.success;
      if (!linkResult.success && linkResult.warning) {
        warnings.push(linkResult.warning);
      }
    }

    return {
      success: true,
      data: {
        filePath,
        routePath,
        frameworkType,
        linkInjected,
        warnings: warnings.length > 0 ? warnings : undefined,
      },
    };
  }

  /**
   * Add a component to an existing screen
   */
  async addComponent(
    input: AddComponentInput & { projectPath?: string }
  ): Promise<ToolResult<AddComponentResponse>> {
    // Validate input
    const validation = AddComponentInputSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: `Invalid input: ${validation.error.message}`,
      };
    }

    const { screenName, componentType, props, projectPath } = validation.data;
    const absolutePath = resolve(projectPath || process.cwd());

    // Check if project path exists
    if (!existsSync(absolutePath)) {
      return {
        success: false,
        error: `Project path does not exist: ${absolutePath}`,
      };
    }

    // Find the screen file
    const screenFile = this.findScreenFile(absolutePath, screenName);
    if (!screenFile) {
      return {
        success: false,
        error: `Screen '${screenName}' not found in project`,
      };
    }

    // Read current content
    const content = readFileSync(screenFile, "utf-8");

    // Generate component code and import
    const componentCode = generateComponentCode(componentType, props);
    const componentImport = generateComponentImport(componentType);

    // Insert component into content
    const newContent = insertComponentIntoContent(
      content,
      componentCode,
      componentImport
    );

    // Write updated content
    writeFileSync(screenFile, newContent, "utf-8");

    return {
      success: true,
      data: {
        componentAdded: true,
        componentType,
        screenPath: screenFile,
      },
    };
  }

  /**
   * Apply a style archetype to a screen
   */
  async applyArchetype(
    input: ApplyArchetypeInput & { projectPath?: string }
  ): Promise<ToolResult<ApplyArchetypeResponse>> {
    // Validate input
    const validation = ApplyArchetypeInputSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: `Invalid input: ${validation.error.message}`,
      };
    }

    const { screenName, archetypeName, projectPath } = validation.data;
    const absolutePath = resolve(projectPath || process.cwd());

    // Check if project path exists
    if (!existsSync(absolutePath)) {
      return {
        success: false,
        error: `Project path does not exist: ${absolutePath}`,
      };
    }

    // Find the screen file
    const screenFile = this.findScreenFile(absolutePath, screenName);
    if (!screenFile) {
      return {
        success: false,
        error: `Screen '${screenName}' not found in project`,
      };
    }

    // Read current content
    const content = readFileSync(screenFile, "utf-8");

    // Apply archetype styles
    const newContent = applyArchetypeToContent(content, archetypeName);

    // Write updated content
    writeFileSync(screenFile, newContent, "utf-8");

    return {
      success: true,
      data: {
        archetypeApplied: true,
        archetypeName,
        screenPath: screenFile,
      },
    };
  }

  /**
   * List all screens in the project
   */
  async list(
    input: ListScreensInput = {}
  ): Promise<ToolResult<ListScreensResponse>> {
    // Validate input
    const validation = ListScreensInputSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: `Invalid input: ${validation.error.message}`,
      };
    }

    const { projectPath } = validation.data;
    const absolutePath = resolve(projectPath || process.cwd());

    // Check if project path exists
    if (!existsSync(absolutePath)) {
      return {
        success: false,
        error: `Project path does not exist: ${absolutePath}`,
      };
    }

    // Detect framework type
    const frameworkType = this.detectFrameworkType(absolutePath);

    // Find all screens
    const screens = this.findAllScreens(absolutePath, frameworkType);

    return {
      success: true,
      data: {
        screens,
        frameworkType,
        projectPath: absolutePath,
      },
    };
  }

  /**
   * Get preview URL for a screen
   */
  async preview(
    input: PreviewScreenInput & { projectPath?: string }
  ): Promise<ToolResult<PreviewScreenResponse>> {
    // Validate input
    const validation = PreviewScreenInputSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: `Invalid input: ${validation.error.message}`,
      };
    }

    const { screenName, projectPath } = validation.data;
    const absolutePath = resolve(projectPath || process.cwd());

    // Check if project path exists
    if (!existsSync(absolutePath)) {
      return {
        success: false,
        error: `Project path does not exist: ${absolutePath}`,
      };
    }

    // Detect framework type
    const frameworkType = this.detectFrameworkType(absolutePath);

    // Find the screen and get its route
    const screens = this.findAllScreens(absolutePath, frameworkType);
    const screen = screens.find(
      (s) => s.name.toLowerCase() === screenName.toLowerCase()
    );

    if (!screen) {
      return {
        success: false,
        error: `Screen '${screenName}' not found in project`,
      };
    }

    const devServerUrl = this.config.devServerUrl || "http://localhost:3000";
    const previewUrl = `${devServerUrl}${screen.routePath}`;

    return {
      success: true,
      data: {
        previewUrl,
        screenName: screen.name,
        routePath: screen.routePath,
      },
    };
  }

  /**
   * Detect framework type based on marker files
   */
  private detectFrameworkType(projectPath: string): FrameworkType {
    // Priority 1: Check for Next.js App Router
    const appLayoutTs = join(projectPath, "app", "layout.tsx");
    const appLayoutJs = join(projectPath, "app", "layout.js");
    const srcAppLayoutTs = join(projectPath, "src", "app", "layout.tsx");
    const srcAppLayoutJs = join(projectPath, "src", "app", "layout.js");

    if (
      existsSync(appLayoutTs) ||
      existsSync(appLayoutJs) ||
      existsSync(srcAppLayoutTs) ||
      existsSync(srcAppLayoutJs)
    ) {
      return "next-app";
    }

    // Priority 2: Check for Next.js Pages Router
    const pagesAppTs = join(projectPath, "pages", "_app.tsx");
    const pagesAppJs = join(projectPath, "pages", "_app.js");
    const srcPagesAppTs = join(projectPath, "src", "pages", "_app.tsx");
    const srcPagesAppJs = join(projectPath, "src", "pages", "_app.js");

    if (
      existsSync(pagesAppTs) ||
      existsSync(pagesAppJs) ||
      existsSync(srcPagesAppTs) ||
      existsSync(srcPagesAppJs)
    ) {
      return "next-pages";
    }

    // Priority 3: Check for Vite
    const viteConfigTs = join(projectPath, "vite.config.ts");
    const viteConfigJs = join(projectPath, "vite.config.js");

    if (existsSync(viteConfigTs) || existsSync(viteConfigJs)) {
      return "vite";
    }

    return "unknown";
  }

  /**
   * Get the file path for a screen based on framework type
   */
  private getScreenFilePath(
    projectPath: string,
    targetPath: string,
    frameworkType: FrameworkType
  ): { filePath: string; routePath: string } {
    const normalizedPath = targetPath.startsWith("/")
      ? targetPath.slice(1)
      : targetPath;

    switch (frameworkType) {
      case "next-app": {
        // Check if using src directory
        const useSrc =
          existsSync(join(projectPath, "src", "app", "layout.tsx")) ||
          existsSync(join(projectPath, "src", "app", "layout.js"));
        const baseDir = useSrc ? join(projectPath, "src", "app") : join(projectPath, "app");
        return {
          filePath: join(baseDir, normalizedPath, "page.tsx"),
          routePath: `/${normalizedPath}`,
        };
      }

      case "next-pages": {
        // Check if using src directory
        const useSrc =
          existsSync(join(projectPath, "src", "pages", "_app.tsx")) ||
          existsSync(join(projectPath, "src", "pages", "_app.js"));
        const baseDir = useSrc ? join(projectPath, "src", "pages") : join(projectPath, "pages");
        return {
          filePath: join(baseDir, `${normalizedPath}.tsx`),
          routePath: `/${normalizedPath}`,
        };
      }

      case "vite": {
        return {
          filePath: join(projectPath, "src", "pages", `${normalizedPath}.tsx`),
          routePath: `/${normalizedPath}`,
        };
      }

      default:
        return {
          filePath: join(projectPath, "src", "pages", `${normalizedPath}.tsx`),
          routePath: `/${normalizedPath}`,
        };
    }
  }

  /**
   * Generate screen content based on framework type
   */
  private generateScreenContent(
    name: string,
    intent: string,
    targetPath: string,
    frameworkType: FrameworkType
  ): string {
    switch (frameworkType) {
      case "next-app":
        return generateNextAppTemplate(name, intent, targetPath);
      case "next-pages":
        return generateNextPagesTemplate(name, intent, targetPath);
      case "vite":
        return generateViteTemplate(name, intent, targetPath);
      default:
        return generateViteTemplate(name, intent, targetPath);
    }
  }

  /**
   * Inject a link into a parent page
   */
  private injectLink(
    projectPath: string,
    parentPage: string,
    targetPath: string,
    label: string,
    frameworkType: FrameworkType
  ): { success: boolean; warning?: string } {
    // Find parent page file
    const parentFile = this.findScreenFileByRoute(projectPath, parentPage, frameworkType);

    if (!parentFile || !existsSync(parentFile)) {
      return {
        success: false,
        warning: "Parent page not found",
      };
    }

    // Read parent page content
    const content = readFileSync(parentFile, "utf-8");

    // Insert link into content
    const newContent = insertLinkIntoContent(content, targetPath, label);

    // Write updated content
    writeFileSync(parentFile, newContent, "utf-8");

    return { success: true };
  }

  /**
   * Find a screen file by name
   */
  private findScreenFile(projectPath: string, screenName: string): string | null {
    const frameworkType = this.detectFrameworkType(projectPath);
    const screens = this.findAllScreens(projectPath, frameworkType);

    const screen = screens.find(
      (s) => s.name.toLowerCase() === screenName.toLowerCase()
    );

    return screen?.filePath || null;
  }

  /**
   * Find a screen file by route path
   */
  private findScreenFileByRoute(
    projectPath: string,
    routePath: string,
    frameworkType: FrameworkType
  ): string | null {
    const normalizedPath = routePath.startsWith("/")
      ? routePath.slice(1)
      : routePath;

    switch (frameworkType) {
      case "next-app": {
        const useSrc =
          existsSync(join(projectPath, "src", "app", "layout.tsx")) ||
          existsSync(join(projectPath, "src", "app", "layout.js"));
        const baseDir = useSrc ? join(projectPath, "src", "app") : join(projectPath, "app");
        const filePath = join(baseDir, normalizedPath, "page.tsx");
        if (existsSync(filePath)) return filePath;
        const jsPath = join(baseDir, normalizedPath, "page.js");
        if (existsSync(jsPath)) return jsPath;
        return null;
      }

      case "next-pages": {
        const useSrc =
          existsSync(join(projectPath, "src", "pages", "_app.tsx")) ||
          existsSync(join(projectPath, "src", "pages", "_app.js"));
        const baseDir = useSrc ? join(projectPath, "src", "pages") : join(projectPath, "pages");
        const tsxPath = join(baseDir, `${normalizedPath}.tsx`);
        if (existsSync(tsxPath)) return tsxPath;
        const jsPath = join(baseDir, `${normalizedPath}.js`);
        if (existsSync(jsPath)) return jsPath;
        return null;
      }

      case "vite": {
        const tsxPath = join(projectPath, "src", "pages", `${normalizedPath}.tsx`);
        if (existsSync(tsxPath)) return tsxPath;
        const jsPath = join(projectPath, "src", "pages", `${normalizedPath}.js`);
        if (existsSync(jsPath)) return jsPath;
        return null;
      }

      default:
        return null;
    }
  }

  /**
   * Find all screens in a project
   */
  private findAllScreens(
    projectPath: string,
    frameworkType: FrameworkType
  ): ScreenMetadata[] {
    const screens: ScreenMetadata[] = [];

    switch (frameworkType) {
      case "next-app": {
        const useSrc =
          existsSync(join(projectPath, "src", "app", "layout.tsx")) ||
          existsSync(join(projectPath, "src", "app", "layout.js"));
        const baseDir = useSrc ? join(projectPath, "src", "app") : join(projectPath, "app");

        if (existsSync(baseDir)) {
          this.scanNextAppDirectory(baseDir, baseDir, screens);
        }
        break;
      }

      case "next-pages": {
        const useSrc =
          existsSync(join(projectPath, "src", "pages", "_app.tsx")) ||
          existsSync(join(projectPath, "src", "pages", "_app.js"));
        const baseDir = useSrc ? join(projectPath, "src", "pages") : join(projectPath, "pages");

        if (existsSync(baseDir)) {
          this.scanNextPagesDirectory(baseDir, baseDir, screens);
        }
        break;
      }

      case "vite": {
        const pagesDir = join(projectPath, "src", "pages");
        if (existsSync(pagesDir)) {
          this.scanVitePagesDirectory(pagesDir, pagesDir, screens);
        }
        break;
      }
    }

    return screens;
  }

  /**
   * Scan Next.js App Router directory for pages
   */
  private scanNextAppDirectory(
    baseDir: string,
    currentDir: string,
    screens: ScreenMetadata[]
  ): void {
    try {
      const entries = readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);

        if (entry.isDirectory()) {
          // Skip special directories
          if (entry.name.startsWith("_") || entry.name.startsWith(".")) {
            continue;
          }
          this.scanNextAppDirectory(baseDir, fullPath, screens);
        } else if (entry.name === "page.tsx" || entry.name === "page.js") {
          const relativePath = currentDir.slice(baseDir.length);
          const routePath = relativePath || "/";
          const name = basename(dirname(fullPath)) || "home";

          screens.push({
            name: name === "app" ? "home" : name,
            filePath: fullPath,
            routePath: routePath || "/",
          });
        }
      }
    } catch {
      // Ignore read errors
    }
  }

  /**
   * Scan Next.js Pages Router directory for pages
   */
  private scanNextPagesDirectory(
    baseDir: string,
    currentDir: string,
    screens: ScreenMetadata[]
  ): void {
    try {
      const entries = readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);

        if (entry.isDirectory()) {
          // Skip special directories
          if (entry.name.startsWith("_") || entry.name.startsWith(".")) {
            continue;
          }
          this.scanNextPagesDirectory(baseDir, fullPath, screens);
        } else if (
          (entry.name.endsWith(".tsx") || entry.name.endsWith(".js")) &&
          !entry.name.startsWith("_")
        ) {
          const relativePath = fullPath.slice(baseDir.length);
          const name = basename(entry.name, entry.name.endsWith(".tsx") ? ".tsx" : ".js");
          const routePath =
            relativePath.replace(/\.(tsx|js)$/, "").replace(/\/index$/, "") || "/";

          screens.push({
            name: name === "index" ? "home" : name,
            filePath: fullPath,
            routePath,
          });
        }
      }
    } catch {
      // Ignore read errors
    }
  }

  /**
   * Scan Vite pages directory for pages
   */
  private scanVitePagesDirectory(
    baseDir: string,
    currentDir: string,
    screens: ScreenMetadata[]
  ): void {
    try {
      const entries = readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);

        if (entry.isDirectory()) {
          this.scanVitePagesDirectory(baseDir, fullPath, screens);
        } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".js")) {
          const relativePath = fullPath.slice(baseDir.length);
          const name = basename(entry.name, entry.name.endsWith(".tsx") ? ".tsx" : ".js");
          const routePath =
            relativePath.replace(/\.(tsx|js)$/, "").replace(/\/index$/, "") || "/";

          screens.push({
            name,
            filePath: fullPath,
            routePath,
          });
        }
      }
    } catch {
      // Ignore read errors
    }
  }
}

// Export singleton instance with default config
export const screenTools = new ScreenTools();
