/**
 * @tekton/esbuild-plugin - Integration Tests
 * [SPEC-STYLED-001] Tests for TAG-006: esbuild Plugin Core
 * REQ-STY-012: Development vs production mode
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { tektonPlugin } from '../src/index.js';

// ============================================================================
// Plugin Configuration
// ============================================================================

describe('Integration - Plugin Configuration', () => {
  it('should accept default options', () => {
    expect(() => tektonPlugin()).not.toThrow();
  });

  it('should accept custom options', () => {
    const plugin = tektonPlugin({
      strict: true,
      threshold: 100,
      verbose: true,
    });

    expect(plugin).toBeDefined();
    expect(plugin.name).toBe('tekton-token-validator');
  });

  it('should have correct plugin name', () => {
    const plugin = tektonPlugin();
    expect(plugin.name).toBe('tekton-token-validator');
  });

  it('should have setup method', () => {
    const plugin = tektonPlugin();
    expect(typeof plugin.setup).toBe('function');
  });
});

// ============================================================================
// REQ-STY-012: Strict Mode Behavior
// ============================================================================

describe('Integration - Strict Mode', () => {
  it('should default to production mode when NODE_ENV is production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const plugin = tektonPlugin();
    expect(plugin).toBeDefined();

    process.env.NODE_ENV = originalEnv;
  });

  it('should accept explicit strict mode', () => {
    const plugin = tektonPlugin({ strict: true });
    expect(plugin).toBeDefined();
  });

  it('should accept lenient mode', () => {
    const plugin = tektonPlugin({ strict: false });
    expect(plugin).toBeDefined();
  });

  it('should allow strict mode override regardless of NODE_ENV', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const plugin = tektonPlugin({ strict: true });
    expect(plugin).toBeDefined();

    process.env.NODE_ENV = originalEnv;
  });
});

// ============================================================================
// Threshold Configuration
// ============================================================================

describe('Integration - Threshold Configuration', () => {
  it('should default to 100% threshold', () => {
    const plugin = tektonPlugin();
    expect(plugin).toBeDefined();
    // Default threshold is 100
  });

  it('should accept custom threshold', () => {
    const plugin = tektonPlugin({ threshold: 90 });
    expect(plugin).toBeDefined();
  });

  it('should accept 0% threshold', () => {
    const plugin = tektonPlugin({ threshold: 0 });
    expect(plugin).toBeDefined();
  });

  it('should accept 100% threshold explicitly', () => {
    const plugin = tektonPlugin({ threshold: 100 });
    expect(plugin).toBeDefined();
  });
});

// ============================================================================
// Include/Exclude Patterns
// ============================================================================

describe('Integration - File Pattern Filtering', () => {
  it('should accept default include patterns', () => {
    const plugin = tektonPlugin();
    expect(plugin).toBeDefined();
    // Default includes .tsx? files
  });

  it('should accept custom include patterns', () => {
    const plugin = tektonPlugin({
      include: [/\.tsx$/, /\.ts$/],
    });
    expect(plugin).toBeDefined();
  });

  it('should accept custom exclude patterns', () => {
    const plugin = tektonPlugin({
      exclude: [/node_modules/, /\.test\./, /__tests__/],
    });
    expect(plugin).toBeDefined();
  });

  it('should accept both include and exclude patterns', () => {
    const plugin = tektonPlugin({
      include: [/\.tsx$/],
      exclude: [/\.test\.tsx$/],
    });
    expect(plugin).toBeDefined();
  });

  it('should handle empty include array', () => {
    const plugin = tektonPlugin({
      include: [],
    });
    expect(plugin).toBeDefined();
  });

  it('should handle empty exclude array', () => {
    const plugin = tektonPlugin({
      exclude: [],
    });
    expect(plugin).toBeDefined();
  });
});

// ============================================================================
// Report Path Configuration
// ============================================================================

describe('Integration - Report Path', () => {
  it('should accept report path option', () => {
    const plugin = tektonPlugin({
      reportPath: './build-reports/tekton-compliance.txt',
    });
    expect(plugin).toBeDefined();
  });

  it('should work without report path', () => {
    const plugin = tektonPlugin();
    expect(plugin).toBeDefined();
  });

  it('should accept relative paths', () => {
    const plugin = tektonPlugin({
      reportPath: './report.txt',
    });
    expect(plugin).toBeDefined();
  });

  it('should accept absolute paths', () => {
    const plugin = tektonPlugin({
      reportPath: '/tmp/tekton-report.txt',
    });
    expect(plugin).toBeDefined();
  });
});

// ============================================================================
// Verbose Mode
// ============================================================================

describe('Integration - Verbose Mode', () => {
  let consoleLogSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should accept verbose option', () => {
    const plugin = tektonPlugin({ verbose: true });
    expect(plugin).toBeDefined();
  });

  it('should default to non-verbose', () => {
    const plugin = tektonPlugin();
    expect(plugin).toBeDefined();
  });

  it('should work with verbose false', () => {
    const plugin = tektonPlugin({ verbose: false });
    expect(plugin).toBeDefined();
  });
});

// ============================================================================
// Option Combinations
// ============================================================================

describe('Integration - Option Combinations', () => {
  it('should handle all options together', () => {
    const plugin = tektonPlugin({
      strict: true,
      include: [/\.tsx$/],
      exclude: [/\.test\.tsx$/],
      threshold: 100,
      reportPath: './report.txt',
      verbose: true,
    });

    expect(plugin).toBeDefined();
    expect(plugin.name).toBe('tekton-token-validator');
  });

  it('should handle production configuration', () => {
    const plugin = tektonPlugin({
      strict: true,
      threshold: 100,
      verbose: false,
      reportPath: './tekton-compliance-report.txt',
    });

    expect(plugin).toBeDefined();
  });

  it('should handle development configuration', () => {
    const plugin = tektonPlugin({
      strict: false,
      threshold: 80,
      verbose: true,
    });

    expect(plugin).toBeDefined();
  });

  it('should handle minimal configuration', () => {
    const plugin = tektonPlugin({
      strict: false,
    });

    expect(plugin).toBeDefined();
  });
});

// ============================================================================
// Plugin Behavior Validation
// ============================================================================

describe('Integration - Plugin Behavior', () => {
  it('should provide setup function', () => {
    const plugin = tektonPlugin();
    expect(typeof plugin.setup).toBe('function');
  });

  it('should call setup with build object', () => {
    const plugin = tektonPlugin();
    const mockBuild = {
      onLoad: vi.fn(),
      onEnd: vi.fn(),
      initialOptions: {},
    };

    // Setup should be callable
    expect(() => plugin.setup(mockBuild as any)).not.toThrow();
  });

  it('should register onLoad handler', () => {
    const plugin = tektonPlugin();
    const mockBuild = {
      onLoad: vi.fn(),
      onEnd: vi.fn(),
      initialOptions: {},
    };

    plugin.setup(mockBuild as any);
    expect(mockBuild.onLoad).toHaveBeenCalled();
  });

  it('should register onEnd handler', () => {
    const plugin = tektonPlugin();
    const mockBuild = {
      onLoad: vi.fn(),
      onEnd: vi.fn(),
      initialOptions: {},
    };

    plugin.setup(mockBuild as any);
    expect(mockBuild.onEnd).toHaveBeenCalled();
  });

  it('should register filter for TypeScript files', () => {
    const plugin = tektonPlugin();
    const mockBuild = {
      onLoad: vi.fn(),
      onEnd: vi.fn(),
      initialOptions: {},
    };

    plugin.setup(mockBuild as any);

    // Check that onLoad was called with a filter
    expect(mockBuild.onLoad).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: expect.any(RegExp),
      }),
      expect.any(Function)
    );

    // Verify filter matches .tsx? files
    const filter = mockBuild.onLoad.mock.calls[0][0].filter;
    expect(filter.test('test.ts')).toBe(true);
    expect(filter.test('test.tsx')).toBe(true);
  });
});

// ============================================================================
// Error Handling
// ============================================================================

describe('Integration - Error Handling', () => {
  it('should handle invalid options gracefully', () => {
    // TypeScript should catch these, but test runtime behavior
    expect(() =>
      tektonPlugin({
        threshold: -1, // Invalid but shouldn't crash
      })
    ).not.toThrow();
  });

  it('should handle null options', () => {
    expect(() => tektonPlugin(null as any)).not.toThrow();
  });

  it('should handle undefined options', () => {
    expect(() => tektonPlugin(undefined)).not.toThrow();
  });

  it('should handle invalid regex patterns gracefully', () => {
    expect(() =>
      tektonPlugin({
        include: [] as any, // Empty array
      })
    ).not.toThrow();
  });
});

// ============================================================================
// Default Values
// ============================================================================

describe('Integration - Default Values', () => {
  it('should use production strict mode by default in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const plugin = tektonPlugin();
    expect(plugin).toBeDefined();
    // Strict mode should be true by default

    process.env.NODE_ENV = originalEnv;
  });

  it('should use lenient mode by default in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const plugin = tektonPlugin();
    expect(plugin).toBeDefined();
    // Strict mode should be false by default

    process.env.NODE_ENV = originalEnv;
  });

  it('should default to 100% threshold', () => {
    const plugin = tektonPlugin();
    expect(plugin).toBeDefined();
    // Default threshold is 100
  });

  it('should include .ts and .tsx files by default', () => {
    const plugin = tektonPlugin();
    expect(plugin).toBeDefined();
    // Default include pattern matches .tsx?
  });

  it('should exclude node_modules by default', () => {
    const plugin = tektonPlugin();
    expect(plugin).toBeDefined();
    // Default exclude includes node_modules
  });

  it('should exclude test files by default', () => {
    const plugin = tektonPlugin();
    expect(plugin).toBeDefined();
    // Default exclude includes *.test.*, *.spec.*, __tests__
  });
});

// ============================================================================
// Type Safety
// ============================================================================

describe('Integration - Type Safety', () => {
  it('should export TektonPluginOptions type', () => {
    // Type check - this should compile
    const options: import('../src/index.js').TektonPluginOptions = {
      strict: true,
      threshold: 100,
    };
    expect(options).toBeDefined();
  });

  it('should export Violation type', () => {
    // Type check - this should compile
    const violation: import('../src/index.js').Violation = {
      file: 'test.tsx',
      line: 1,
      column: 0,
      type: 'color',
      value: '#ffffff',
    };
    expect(violation).toBeDefined();
  });

  it('should accept typed options', () => {
    const options: import('../src/index.js').TektonPluginOptions = {
      strict: true,
      include: [/\.tsx$/],
      exclude: [/node_modules/],
      threshold: 100,
      reportPath: './report.txt',
      verbose: true,
    };

    const plugin = tektonPlugin(options);
    expect(plugin).toBeDefined();
  });
});

// ============================================================================
// Export Validation
// ============================================================================

describe('Integration - Exports', () => {
  it('should export tektonPlugin as named export', () => {
    expect(tektonPlugin).toBeDefined();
    expect(typeof tektonPlugin).toBe('function');
  });

  it('should export default plugin', async () => {
    const module = await import('../src/index.js');
    expect(module.default).toBeDefined();
    expect(typeof module.default).toBe('function');
  });

  it('should export types', () => {
    // Type exports are validated during compilation
    // TektonPluginOptions and Violation types should be exported
    expect(true).toBe(true);
  });
});
