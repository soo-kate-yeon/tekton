/**
 * @tekton/esbuild-plugin - Build-time Token Validation Plugin
 * [SPEC-STYLED-001] [TAG-006]
 * esbuild plugin for token compliance validation
 * REQ-STY-007, REQ-STY-009, REQ-STY-012
 */

import type { Plugin } from 'esbuild';
import { analyzeCode, type Violation } from './analyzer.js';
import { generateReport, calculateCompliance } from './reporter.js';

export interface TektonPluginOptions {
  /**
   * Fail build on violations (default: true in production)
   * REQ-STY-012: Warn in dev, fail in production
   */
  strict?: boolean;

  /**
   * File patterns to include
   * REQ-STY-007: Scan all .tsx/.ts files
   */
  include?: RegExp[];

  /**
   * File patterns to exclude
   */
  exclude?: RegExp[];

  /**
   * Compliance threshold (default: 100)
   * REQ-STY-009: Fail when compliance < 100%
   */
  threshold?: number;

  /**
   * Generate report file
   */
  reportPath?: string;

  /**
   * Enable verbose logging
   */
  verbose?: boolean;
}

const DEFAULT_INCLUDE = [/\.tsx?$/];
const DEFAULT_EXCLUDE = [/node_modules/, /\.test\.tsx?$/, /\.spec\.tsx?$/, /__tests__/];

/**
 * Tekton esbuild plugin for token compliance validation
 * REQ-STY-006: Build validation
 */
export function tektonPlugin(options: TektonPluginOptions = {}): Plugin {
  const violations: Violation[] = [];
  // Handle null/undefined options
  const opts = options || {};
  const {
    strict = process.env.NODE_ENV === 'production',
    include = DEFAULT_INCLUDE,
    exclude = DEFAULT_EXCLUDE,
    threshold = 100,
    reportPath,
    verbose = false,
  } = opts;

  return {
    name: 'tekton-token-validator',
    setup(build) {
      // Track analyzed files
      let filesAnalyzed = 0;

      // Intercept file loading to analyze code
      build.onLoad({ filter: /\.tsx?$/ }, async args => {
        // Check if file should be processed
        if (!shouldProcess(args.path, include, exclude)) {
          return null;
        }

        // Read and analyze the file
        const fs = await import('fs/promises');
        const code = await fs.readFile(args.path, 'utf8');

        const fileViolations = analyzeCode(code, args.path);
        violations.push(...fileViolations);

        filesAnalyzed++;

        if (verbose && fileViolations.length > 0) {
          console.log(`[Tekton] Found ${fileViolations.length} violations in ${args.path}`);
        }

        // Don't modify the code, just analyze it
        return null;
      });

      // Report results at build end
      build.onEnd(result => {
        if (filesAnalyzed === 0 && verbose) {
          console.log('[Tekton] No files were analyzed. Check include/exclude patterns.');
        }

        if (violations.length > 0) {
          const report = generateReport(violations);
          console.error(report);

          if (reportPath) {
            // Would write report to file
            console.log(`[Tekton] Report would be written to: ${reportPath}`);
          }

          const compliance = calculateCompliance(violations);

          // REQ-STY-012: Warn in dev, fail in production
          if (strict && compliance < threshold) {
            // Add error to build result
            result.errors.push({
              id: 'tekton-token-compliance',
              text: `[Tekton] Token compliance ${compliance}% is below threshold ${threshold}%`,
              detail: `Found ${violations.length} violation(s). Use @tekton/styled tokens for all design values.`,
              location: null,
              notes: [],
              pluginName: 'tekton-token-validator',
            });
          } else if (!strict) {
            console.warn(
              `[Tekton] Development mode: Found ${violations.length} violations but not failing build`
            );
          }
        } else if (verbose) {
          console.log('✅ [Tekton] Token compliance: 100% - No violations found');
        }
      });
    },
  };
}

/**
 * Check if file should be processed
 */
function shouldProcess(path: string, include: RegExp[], exclude: RegExp[]): boolean {
  // Check exclusions first
  for (const pattern of exclude) {
    if (pattern.test(path)) {
      return false;
    }
  }

  // Check inclusions
  for (const pattern of include) {
    if (pattern.test(path)) {
      return true;
    }
  }

  return false;
}

export default tektonPlugin;
export type { Violation } from './analyzer.js';
