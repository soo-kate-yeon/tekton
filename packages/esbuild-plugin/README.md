# @tekton/esbuild-plugin

esbuild plugin for build-time token compliance validation.

## Overview

Scans your codebase during build to ensure 100% token compliance. Fails the build if hardcoded CSS values are detected.

## Installation

```bash
pnpm add -D @tekton/esbuild-plugin
```

## Usage

### With esbuild

```javascript
import { build } from 'esbuild';
import { tektonPlugin } from '@tekton/esbuild-plugin';

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  plugins: [
    tektonPlugin({
      strict: true, // Fail build on violations (default: true in production)
      threshold: 100, // Required compliance percentage
      verbose: true, // Enable logging
      reportPath: './tekton-report.txt', // Optional report file
    }),
  ],
});
```

### With tsup

```javascript
import { defineConfig } from 'tsup';
import { tektonPlugin } from '@tekton/esbuild-plugin';

export default defineConfig({
  entry: ['src/index.ts'],
  esbuildPlugins: [
    tektonPlugin({
      strict: process.env.NODE_ENV === 'production',
    }),
  ],
});
```

## Options

```typescript
interface TektonPluginOptions {
  strict?: boolean; // Fail build on violations (default: true in prod)
  include?: RegExp[]; // File patterns to include (default: /.tsx?$/)
  exclude?: RegExp[]; // File patterns to exclude (default: node_modules, tests)
  threshold?: number; // Compliance threshold (default: 100)
  reportPath?: string; // Generate report file
  verbose?: boolean; // Enable verbose logging
}
```

## How It Works

1. **AST Analysis**: Uses Babel parser to analyze styled-components templates
2. **Pattern Detection**: Identifies hardcoded colors (hex, rgb, hsl) and spacing (px values)
3. **Violation Reporting**: Generates detailed reports with file, line, and suggestions
4. **Build Enforcement**: Fails build when compliance < threshold (100% by default)

## Development vs Production

- **Development mode** (`strict: false`): Warns about violations but doesn't fail build
- **Production mode** (`strict: true`): Fails build if any violations are found

## Example Violations

```typescript
// ❌ Detected violations:

styled.div`
  background: #ffffff; // Error: hex color "#ffffff"
  // Suggestion: tokens.bg.* or tokens.fg.*

  padding: 16px; // Error: pixel spacing "16px"
  // Suggestion: tokens.spacing[4]
`;
```

## Requirements

- REQ-STY-007: Scan all .tsx/.ts files for hardcoded values
- REQ-STY-008: Report file location, line number, and violation type
- REQ-STY-009: Fail build when compliance < 100%
- REQ-STY-012: Warn in dev, fail in production

## SPEC Reference

- [SPEC-STYLED-001](/.moai/specs/SPEC-STYLED-001/spec.md)
- TAG-006: esbuild Plugin Core
- TAG-007: AST Analysis Logic
- TAG-008: Build Reporting System

## License

MIT
