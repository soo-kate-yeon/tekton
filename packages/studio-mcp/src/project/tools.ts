/**
 * Project MCP Tools
 * Tool handlers for project structure detection and preset management
 *
 * @module project/tools
 */

import { existsSync, readdirSync } from "fs";
import { join, resolve } from "path";
import {
  type DetectStructureInput,
  type GetActivePresetInput,
  type SetActivePresetInput,
  type ProjectStructure,
  type FrameworkType,
  type ActivePreset,
  DetectStructureInputSchema,
  GetActivePresetInputSchema,
  SetActivePresetInputSchema,
} from "./schemas.js";

/**
 * Tool result wrapper (consistent with archetype tools)
 */
export interface ToolResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Configuration for studio-api connection
 */
export interface StudioApiConfig {
  baseUrl: string;
  timeout?: number;
}

/**
 * Project Tools - provides MCP tool implementations for project management
 */
export class ProjectTools {
  private apiConfig: StudioApiConfig;

  constructor(apiConfig?: StudioApiConfig) {
    this.apiConfig = apiConfig || {
      baseUrl: process.env.STUDIO_API_URL || "http://localhost:8000",
      timeout: 5000,
    };
  }

  /**
   * Detect project structure and framework type
   *
   * Detection Priority:
   * 1. Check for app/layout.tsx or app/layout.js -> Next.js App Router
   * 2. Check for pages/_app.tsx or pages/_app.js -> Next.js Pages Router
   * 3. Check for vite.config.ts or vite.config.js -> Vite
   * 4. Default -> Unknown framework
   */
  async detectStructure(
    input: DetectStructureInput
  ): Promise<ToolResult<ProjectStructure>> {
    // Validate input
    const validation = DetectStructureInputSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: `Invalid input: ${validation.error.message}`,
      };
    }

    const { projectPath } = validation.data;
    const absolutePath = resolve(projectPath);

    // Check if project path exists
    if (!existsSync(absolutePath)) {
      return {
        success: false,
        error: `Project path does not exist: ${absolutePath}`,
      };
    }

    // Detect framework type
    const frameworkType = this.detectFrameworkType(absolutePath);

    // Find directories
    const appDirectory = this.findDirectory(absolutePath, "app");
    const pagesDirectory = this.findDirectory(absolutePath, "pages");
    const srcDirectory = this.findDirectory(absolutePath, "src");

    // Find config files
    const configFiles = this.findConfigFiles(absolutePath);

    const structure: ProjectStructure = {
      frameworkType,
      rootPath: absolutePath,
      pagesDirectory,
      appDirectory,
      srcDirectory,
      configFiles,
    };

    return {
      success: true,
      data: structure,
    };
  }

  /**
   * Get the currently active preset for the project
   * Calls studio-api endpoint: GET /api/v2/settings/active-preset?project_path=...
   */
  async getActivePreset(
    input: GetActivePresetInput = {}
  ): Promise<ToolResult<ActivePreset>> {
    // Validate input
    const validation = GetActivePresetInputSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: `Invalid input: ${validation.error.message}`,
      };
    }

    const { projectPath } = validation.data;

    try {
      const url = new URL(
        "/api/v2/settings/active-preset",
        this.apiConfig.baseUrl
      );
      if (projectPath) {
        url.searchParams.set("project_path", projectPath);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(this.apiConfig.timeout || 5000),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          detail?: string;
        };
        return {
          success: false,
          error:
            errorData.detail ||
            `API request failed with status ${response.status}`,
        };
      }

      const data = (await response.json()) as {
        active_preset?: ActivePreset;
      };

      return {
        success: true,
        data: data.active_preset || null,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "TimeoutError" || error.name === "AbortError") {
          return {
            success: false,
            error: "API request timed out",
          };
        }
        return {
          success: false,
          error: `Failed to get active preset: ${error.message}`,
        };
      }
      return {
        success: false,
        error: "Failed to get active preset: Unknown error",
      };
    }
  }

  /**
   * Set the active preset for the project
   * Calls studio-api endpoint: PUT /api/v2/settings/active-preset
   */
  async setActivePreset(
    input: SetActivePresetInput
  ): Promise<ToolResult<ActivePreset>> {
    // Validate input
    const validation = SetActivePresetInputSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: `Invalid input: ${validation.error.message}`,
      };
    }

    const { presetId, projectPath } = validation.data;

    try {
      const url = new URL(
        "/api/v2/settings/active-preset",
        this.apiConfig.baseUrl
      );

      const body: Record<string, unknown> = {
        preset_id: presetId,
      };
      if (projectPath) {
        body.project_path = projectPath;
      }

      const response = await fetch(url.toString(), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(this.apiConfig.timeout || 5000),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          detail?: string;
        };
        return {
          success: false,
          error:
            errorData.detail ||
            `API request failed with status ${response.status}`,
        };
      }

      const data = (await response.json()) as {
        active_preset?: ActivePreset;
      };

      return {
        success: true,
        data: data.active_preset || null,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "TimeoutError" || error.name === "AbortError") {
          return {
            success: false,
            error: "API request timed out",
          };
        }
        return {
          success: false,
          error: `Failed to set active preset: ${error.message}`,
        };
      }
      return {
        success: false,
        error: "Failed to set active preset: Unknown error",
      };
    }
  }

  /**
   * Detect framework type based on marker files
   */
  private detectFrameworkType(projectPath: string): FrameworkType {
    // Priority 1: Check for Next.js App Router (app/layout.tsx or app/layout.js)
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

    // Priority 2: Check for Next.js Pages Router (pages/_app.tsx or pages/_app.js)
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

    // Priority 3: Check for Vite (vite.config.ts or vite.config.js)
    const viteConfigTs = join(projectPath, "vite.config.ts");
    const viteConfigJs = join(projectPath, "vite.config.js");

    if (existsSync(viteConfigTs) || existsSync(viteConfigJs)) {
      return "vite";
    }

    // Default: Unknown framework
    return "unknown";
  }

  /**
   * Find a directory in the project root or src directory
   */
  private findDirectory(projectPath: string, dirName: string): string | null {
    const rootDir = join(projectPath, dirName);
    const srcDir = join(projectPath, "src", dirName);

    if (existsSync(rootDir)) {
      return rootDir;
    }
    if (existsSync(srcDir)) {
      return srcDir;
    }
    return null;
  }

  /**
   * Find common config files in the project root
   */
  private findConfigFiles(projectPath: string): string[] {
    const configPatterns = [
      "package.json",
      "tsconfig.json",
      "next.config.js",
      "next.config.mjs",
      "next.config.ts",
      "vite.config.js",
      "vite.config.ts",
      "tailwind.config.js",
      "tailwind.config.ts",
      "postcss.config.js",
      "postcss.config.mjs",
    ];

    const foundFiles: string[] = [];

    try {
      const files = readdirSync(projectPath);
      for (const pattern of configPatterns) {
        if (files.includes(pattern)) {
          foundFiles.push(pattern);
        }
      }
    } catch {
      // Return empty array if directory read fails
    }

    return foundFiles;
  }
}

// Export singleton instance with default config
export const projectTools = new ProjectTools();
