# @tekton/mcp-server

Tekton MCP Server v2.0.0 - stdio-based MCP protocol implementation for Claude Code.

## Overview

MCP (Model Context Protocol) server enabling AI-driven blueprint generation, theme preview, and production code export for the Tekton design system.

**SPEC**: [SPEC-MCP-002 v2.0.0](../../.moai/specs/SPEC-MCP-002/spec.md) - stdio-based MCP Standard

## Features

- **🤖 stdio MCP Protocol**: Claude Code native tool registration via JSON-RPC 2.0
- **🎨 Theme Preview**: 13 built-in OKLCH-based themes with CSS variable generation
- **📋 Blueprint Generation**: Natural language → Blueprint JSON with validation
- **💾 Data-Only Output**: No file system writes, Claude Code handles file operations
- **🚀 Production Export**: JSX, TSX, Vue code generation
- **🔒 Secure Design**: No previewUrl/filePath exposure, input validation, path traversal protection

## Installation

```bash
pnpm install
```

## Quick Start

### 1. Build the Server

```bash
pnpm install
pnpm build
```

### 2. Test with MCP Inspector

```bash
pnpm inspect
# Opens browser at http://localhost:6274
```

### 3. Integrate with Claude Code

See [Claude Code Integration Guide](../../.moai/specs/SPEC-MCP-002/CLAUDE-CODE-INTEGRATION.md) for complete setup instructions.

**Quick Config** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "tekton": {
      "command": "node",
      "args": ["/absolute/path/to/tekton/packages/mcp-server/dist/index.js"],
      "env": { "NODE_ENV": "production" }
    }
  }
}
```

## MCP Tools

### 1. Generate Blueprint

**Tool**: `generate-blueprint`

**Description**: Generate a UI blueprint from natural language description

**Input**:
```json
{
  "description": "User profile dashboard with avatar, bio, settings link",
  "layout": "sidebar-left",
  "themeId": "calm-wellness",
  "componentHints": ["Card", "Avatar", "Button"]
}
```

**Output** (Data-Only, v2.0.0):
```json
{
  "success": true,
  "blueprint": {
    "id": "bp-1738123456789-abc123",
    "name": "User profile dashboard",
    "themeId": "calm-wellness",
    "layout": "sidebar-left",
    "components": [...],
    "timestamp": 1738123456789
  }
}
```

**Note**: `previewUrl` field removed in v2.0.0 (use SPEC-PLAYGROUND-001 for visual preview)

### 2. Preview Theme

**Tool**: `preview-theme`

**Description**: Preview a Tekton theme and retrieve its design tokens

**Input**:
```json
{
  "themeId": "premium-editorial"
}
```

**Output** (Data-Only, v2.0.0):
```json
{
  "success": true,
  "theme": {
    "id": "premium-editorial",
    "name": "Premium Editorial",
    "description": "Elegant magazine-style UI",
    "cssVariables": {
      "--color-primary": "oklch(0.2 0 0)",
      "--color-secondary": "oklch(0.98 0 0)",
      "--font-family": "Georgia",
      "--border-radius": "0"
    }
  }
}
```

**Note**: `previewUrl` field removed in v2.0.0

### 3. Export Screen

**Tool**: `export-screen`

**Description**: Export a blueprint to production-ready code (TSX/JSX/Vue)

**Input** (v2.0.0: accepts blueprint object):
```json
{
  "blueprint": {
    "id": "bp-1738123456789-abc123",
    "name": "User Dashboard",
    "themeId": "calm-wellness",
    "layout": "sidebar-left",
    "components": [],
    "timestamp": 1738123456789
  },
  "format": "tsx"
}
```

**Output** (Data-Only, v2.0.0):
```json
{
  "success": true,
  "code": "import React from 'react';\n\nexport default function UserDashboard() { ... }"
}
```

**Note**: `filePath` field removed in v2.0.0. Claude Code handles file writes.

## Usage Examples

### From Claude Code

```
User: "Create a user dashboard with profile card using calm-wellness theme"
→ Claude Code calls generate-blueprint
→ Blueprint JSON returned

User: "Show me the premium-editorial theme"
→ Claude Code calls preview-theme
→ Theme metadata and CSS variables returned

User: "Export that dashboard as TypeScript React"
→ Claude Code calls export-screen
→ TSX code returned (ready to copy/paste)
```

See [Claude Code Integration Guide](../../.moai/specs/SPEC-MCP-002/CLAUDE-CODE-INTEGRATION.md) for complete examples.

## Architecture

```
packages/mcp-server/
├── src/
│   ├── index.ts               # stdio MCP server entry point
│   ├── tools/                 # MCP tool implementations
│   │   ├── generate-blueprint.ts
│   │   ├── preview-theme.ts
│   │   └── export-screen.ts
│   ├── storage/               # Blueprint storage
│   │   ├── blueprint-storage.ts
│   │   └── timestamp-manager.ts
│   ├── schemas/               # Zod validation
│   │   └── mcp-schemas.ts
│   └── utils/                 # Helper functions
│       ├── error-handler.ts
│       └── logger.ts          # stderr-only logging
└── __tests__/                 # Test suites
    ├── tools/                 # Tool tests
    ├── mcp-protocol/          # JSON-RPC validation
    ├── storage/               # Storage tests
    └── utils/                 # Utility tests
```

**Key Changes in v2.0.0**:
- ✅ stdio transport (StdioServerTransport)
- ✅ JSON-RPC 2.0 protocol
- ✅ stderr-only logging (stdout reserved for MCP messages)
- ❌ HTTP endpoints removed (moved to SPEC-PLAYGROUND-001)
- ❌ previewUrl/filePath removed from outputs

## Built-in Themes (13 Total)

1. `calm-wellness` - Serene wellness applications
2. `dynamic-fitness` - Energetic fitness tracking
3. `korean-fintech` - Professional financial services
4. `media-streaming` - Video/audio streaming platforms
5. `next-styled-components` - Next.js with styled-components
6. `next-tailwind-radix` - Next.js + Tailwind + Radix UI
7. `next-tailwind-shadcn` - Next.js + Tailwind + shadcn/ui
8. `premium-editorial` - Sophisticated content platforms
9. `saas-dashboard` - Modern SaaS dashboards
10. `saas-modern` - Clean SaaS applications
11. `tech-startup` - Tech startup vibes
12. `vite-tailwind-shadcn` - Vite + Tailwind + shadcn/ui
13. `warm-humanist` - Warm and inviting experiences

**CSS Format**: All color values use OKLCH format for perceptual uniformity

## Quality Metrics (SPEC-MCP-002 v2.0.0)

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Test Coverage** | ≥ 85% | **94.39%** | ✅ |
| **TypeScript Errors** | 0 | **0** | ✅ |
| **Critical Vulnerabilities** | 0 | **0** | ✅ |
| **Tool Response Time** | < 500ms | < 100ms | ✅ |
| **Server Startup** | < 1s | < 500ms | ✅ |

**Test Results**:
- 22 test files
- 214 test cases
- 100% pass rate
- Zero failures

## Integration with @tekton/core

All MCP tools reuse `@tekton/core` functions:
- `loadTheme()` - Theme loading
- `createBlueprint()` - Blueprint creation
- `validateBlueprint()` - Schema validation
- `generateCSSVariables()` - CSS variable extraction
- `render()` - Code generation

**Zero code duplication** - Single source of truth maintained.

## Documentation

### SPEC-MCP-002 v2.0.0 Documentation

- 📋 [Specification](../../.moai/specs/SPEC-MCP-002/spec.md) - Complete requirements
- 📐 [Implementation Plan](../../.moai/specs/SPEC-MCP-002/plan.md) - Development roadmap
- ✅ [Acceptance Criteria](../../.moai/specs/SPEC-MCP-002/acceptance.md) - AC-001 ~ AC-012
- 🔄 [Handover Document](../../.moai/specs/SPEC-MCP-002/HANDOVER.md) - Implementation details

### Integration Guides

- 🤖 [Claude Code Integration](../../.moai/specs/SPEC-MCP-002/CLAUDE-CODE-INTEGRATION.md) - Setup and usage
- ✅ [Phase 5 Results](../../.moai/specs/SPEC-MCP-002/PHASE-5-RESULTS.md) - MCP Inspector validation
- 🎯 [Phase 6 Completion](../../.moai/specs/SPEC-MCP-002/PHASE-6-COMPLETION.md) - Integration testing

### Quick Links

- 🧪 [Test Coverage Report](./coverage/) - 94.39% coverage
- 🎨 [Theme System](../../packages/core/src/themes/) - 13 built-in themes
- 🔧 [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) - Protocol testing tool

## Development

```bash
# Install dependencies
pnpm install

# Build (TypeScript → dist/)
pnpm build

# Run tests
pnpm test

# Test with coverage
pnpm test:coverage

# Watch mode
pnpm dev

# Lint
pnpm lint

# Start MCP server (stdio)
pnpm start

# MCP Inspector (browser-based testing)
pnpm inspect
```

### Validation Scripts

```bash
# Automated MCP protocol validation
node validate-mcp.mjs

# Manual testing with MCP Inspector
pnpm inspect
```

## Migration from v1.0.0 (HTTP) to v2.0.0 (stdio)

**Breaking Changes**:
- ❌ HTTP endpoints removed → stdio transport only
- ❌ `previewUrl` field removed from `generate-blueprint` and `preview-theme` outputs
- ❌ `filePath` field removed from `export-screen` output
- ❌ File system writes removed from `export-screen`
- ✅ `export-screen` now accepts `blueprint` object instead of `blueprintId`

**Why?**
- **Claude Code Integration**: stdio is the standard MCP transport
- **Data-Only Philosophy**: Claude Code handles all file operations
- **Security**: No file system side effects from MCP tools

**Visual Preview**: Use [SPEC-PLAYGROUND-001](../../.moai/specs/SPEC-PLAYGROUND-001/) for React-based rendering

## Contributing

Contributions welcome! Please ensure:
- Tests pass (`pnpm test`)
- Coverage ≥ 85% (`pnpm test:coverage`)
- TypeScript strict mode compliance (`pnpm build`)
- MCP protocol validation (`node validate-mcp.mjs`)

## License

MIT

---

**Version**: 2.0.0 (stdio-based MCP standard)
**Last Updated**: 2026-01-25
**SPEC**: SPEC-MCP-002 v2.0.0
