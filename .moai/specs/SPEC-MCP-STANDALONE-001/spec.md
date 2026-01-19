---
id: SPEC-MCP-STANDALONE-001
version: "1.1.0"
status: "completed"
created: "2026-01-18"
updated: "2026-01-18"
author: "MoAI-ADK"
priority: "HIGH"
lifecycle: "spec-anchored"
---

## HISTORY
- 2026-01-18 v1.1.0: Implementation completed - All 299 tests passing, 91.76% coverage
- 2026-01-18 v1.0.0: Initial SPEC creation - Phase 1 Standalone MCP Completion

---

# SPEC-MCP-STANDALONE-001: Phase 1 Standalone MCP Completion

## Executive Summary

**Purpose**: Transform studio-mcp into an environment-independent npm package (@tekton/mcp-server) that can be installed and run via `npx @tekton/mcp-server` on any project without requiring studio-api, Supabase, or git clone.

**Scope**: Refactor studio-mcp to remove studio-api dependencies, bundle built-in themes as JSON, implement framework auto-detection with local configuration storage, and configure npm package publishing.

**Priority**: HIGH - Enables standalone MCP server distribution for the Free tier user experience

**Impact**: Transforms Tekton MCP from a development tool requiring full stack setup to a zero-dependency npm package that AI assistants can leverage on any project.

---

## ENVIRONMENT

### Current System Context

**Existing studio-mcp Package:**
- **16 MCP Tools**: 7 component tools + 3 project tools + 6 screen tools
- **Self-Contained Tools**: component.* and screen.* tools are 100% self-contained
- **API-Dependent Tools**: `project.getActivePreset` and `project.setActivePreset` require studio-api
- **Package Location**: `packages/studio-mcp/`
- **Current Binary**: `studio-mcp` pointing to `./dist/server/index.js`

**Dependencies on studio-api:**
- `project.getActivePreset`: Calls `GET /api/v2/settings/active-theme`
- `project.setActivePreset`: Calls `PUT /api/v2/settings/active-theme`
- **Why Problematic**: Requires running Python backend with PostgreSQL database

**Existing Theme Package:**
- **Location**: `packages/theme/`
- **Schema**: `PresetSchema` in `src/types.ts` with Zod validation
- **Loader**: `loadPreset()` and `loadDefaultPreset()` functions
- **Default Theme**: `next-tailwind-shadcn.json` bundled

**Target Distribution:**
- npm package: `@tekton/mcp-server`
- Executable: `npx @tekton/mcp-server`
- No external dependencies: Works without studio-api, Supabase, or database

### Technology Stack

**MCP Server (TypeScript):**
- TypeScript 5.7+
- Node.js 20+
- Zod 3.23+ (schema validation)
- @tekton/component-system (bundled)
- @tekton/theme (bundled themes)

**Local Storage:**
- `.tekton/config.json` - Project-local configuration
- No database required
- No authentication required

**npm Publishing:**
- npm registry: `@tekton` scope
- Semantic versioning
- ESM module format

---

## ASSUMPTIONS

### Technical Assumptions

**A-001: Theme JSON Bundling Feasibility**
- **Assumption**: 7 built-in themes can be bundled as JSON within the npm package without significant size increase
- **Confidence**: HIGH
- **Evidence**: Current theme JSON is approximately 1KB, 7 themes would add less than 10KB
- **Risk if Wrong**: Package size bloat affecting download times
- **Validation**: Measure bundle size before and after theme inclusion

**A-002: Local File System Access**
- **Assumption**: MCP server has read/write access to `.tekton/` directory in project root
- **Confidence**: HIGH
- **Evidence**: CLI tools commonly write configuration to project directories
- **Risk if Wrong**: Configuration persistence fails, fallback to memory-only mode
- **Validation**: Permission check with graceful fallback

**A-003: Framework Detection Without API**
- **Assumption**: Framework detection can work entirely with file system analysis
- **Confidence**: HIGH
- **Evidence**: Current `detectStructure` implementation uses only file system
- **Risk if Wrong**: None - already implemented and tested
- **Validation**: Existing test coverage confirms

**A-004: npx Execution Model**
- **Assumption**: `npx @tekton/mcp-server` will correctly invoke the bin entry point
- **Confidence**: HIGH
- **Evidence**: Standard npm/npx behavior for packages with bin field
- **Risk if Wrong**: Users must use alternative installation methods
- **Validation**: Test npx execution in clean environment

### Business Assumptions

**A-005: Free Tier Feature Set Sufficiency**
- **Assumption**: Built-in themes and local configuration satisfy Free tier users
- **Confidence**: MEDIUM
- **Evidence**: 7 themes cover common design patterns (Professional, Creative, Minimal, etc.)
- **Risk if Wrong**: Users demand custom theme creation without upgrade
- **Validation**: User feedback collection after launch

**A-006: No Authentication for Standalone Mode**
- **Assumption**: Standalone mode operates without user authentication
- **Confidence**: HIGH
- **Evidence**: Local tools typically don't require auth for basic functionality
- **Risk if Wrong**: Feature abuse potential, but low risk for design themes
- **Validation**: Security review of exposed functionality

### Integration Assumptions

**A-007: Component System Compatibility**
- **Assumption**: @tekton/component-system package can be bundled without modification
- **Confidence**: HIGH
- **Evidence**: Already works as workspace dependency
- **Risk if Wrong**: Requires component-system refactoring
- **Validation**: Build and test bundled package

---

## REQUIREMENTS

### Ubiquitous Requirements (Always Active)

**U-001: Environment Independence**
- The system **shall** operate without any external API dependencies when running in standalone mode
- **Rationale**: npx users should not need to run additional services
- **Test Strategy**: Integration test with all API endpoints disabled

**U-002: Backward Compatibility**
- The system **shall** maintain backward compatibility with existing MCP tool interfaces
- **Rationale**: Existing AI assistant integrations must continue to work
- **Test Strategy**: Existing test suite must pass without modification

**U-003: Zero Configuration Startup**
- The system **shall** start and serve all standalone tools with zero configuration required
- **Rationale**: npx experience should be instant and frictionless
- **Test Strategy**: Fresh installation test with no config files present

**U-004: Local Configuration Persistence**
- The system **shall** persist user configuration to `.tekton/config.json` in the project root
- **Rationale**: Configuration survives server restarts without database
- **Test Strategy**: Configuration persistence tests across restarts

**U-005: Built-in Theme Bundling**
- The system **shall** bundle all 7 built-in themes as JSON within the npm package
- **Rationale**: Themes must be available without network access
- **Test Strategy**: Verify all themes load from bundled JSON

### Event-Driven Requirements (Trigger-Response)

**E-001: Theme List Request (Standalone)**
- **WHEN** `theme.list` tool invoked **THEN** return list of all 7 built-in themes with metadata
- **Rationale**: AI assistants need to discover available themes
- **Test Strategy**: Verify all 7 themes returned with correct schema

**E-002: Theme Get Request (Standalone)**
- **WHEN** `theme.get` tool invoked with presetId **THEN** return complete theme data including AI context
- **Rationale**: AI assistants need full theme details for styling decisions
- **Test Strategy**: Verify theme data matches bundled JSON

**E-003: Project Status Request (Standalone)**
- **WHEN** `project.status` tool invoked **THEN** return connection status and active theme from local config
- **Rationale**: AI assistants need to understand current project state
- **Test Strategy**: Verify status reflects local configuration state

**E-004: Use Built-in Theme Request**
- **WHEN** `project.useBuiltinPreset` tool invoked with presetId **THEN** set active theme in local config and return confirmation
- **Rationale**: Users select themes without studio-api connection
- **Test Strategy**: Verify local config updated with theme selection

**E-005: Server Health Check**
- **WHEN** `/health` endpoint accessed **THEN** return server status, mode (standalone/connected), and available tools
- **Rationale**: Users and AI assistants can verify server availability
- **Test Strategy**: Health check returns complete status in both modes

**E-006: Framework Auto-Detection on Startup**
- **WHEN** MCP server starts with projectPath **THEN** automatically detect framework type and store in local config
- **Rationale**: Framework detection provides context for screen generation
- **Test Strategy**: Verify correct detection for Next.js App/Pages and Vite projects

### State-Driven Requirements (Conditional Behavior)

**S-001: Mode Selection Based on API Availability**
- **IF** studio-api is reachable **THEN** operate in connected mode with full feature set
- **IF** studio-api is not reachable **THEN** operate in standalone mode with built-in themes only
- **Rationale**: Graceful degradation ensures functionality without API
- **Test Strategy**: Test both modes with API available and unavailable

**S-002: Theme Selection Source**
- **IF** operating in standalone mode **THEN** load themes from bundled JSON
- **IF** operating in connected mode **THEN** load themes from studio-api with bundled as fallback
- **Rationale**: Connected mode enables custom themes, standalone uses built-in
- **Test Strategy**: Verify correct theme source in each mode

**S-003: Configuration File Creation**
- **IF** `.tekton/config.json` does not exist **THEN** create with default configuration on first theme selection
- **IF** `.tekton/config.json` exists **THEN** update existing configuration preserving other settings
- **Rationale**: Non-destructive configuration management
- **Test Strategy**: Verify file creation and update behaviors

**S-004: Tool Registration Based on Mode**
- **IF** operating in standalone mode **THEN** register standalone tool variants (theme.list, theme.get, project.status, project.useBuiltinPreset)
- **IF** operating in connected mode **THEN** register full tool set including API-dependent tools
- **Rationale**: Tool availability reflects actual capabilities
- **Test Strategy**: Verify tool list differs by mode

### Unwanted Behaviors (Prohibited Actions)

**UW-001: No API Calls in Standalone Mode**
- The system **shall not** make HTTP requests to studio-api when operating in standalone mode
- **Rationale**: Standalone mode must work offline and without API
- **Test Strategy**: Network monitoring during standalone operation

**UW-002: No Sensitive Data in Local Config**
- The system **shall not** store authentication tokens or API keys in `.tekton/config.json`
- **Rationale**: Local config may be committed to version control
- **Test Strategy**: Config schema validation, no credential fields

**UW-003: No Blocking on Missing Config**
- The system **shall not** fail to start when `.tekton/config.json` is missing or corrupted
- **Rationale**: Server must start in clean/corrupted environments
- **Test Strategy**: Startup tests with missing and malformed config

**UW-004: No Package Size Explosion**
- The system **shall not** exceed 5MB total package size including all bundled themes
- **Rationale**: Large packages create poor npx experience
- **Test Strategy**: Measure and enforce package size limit

### Optional Requirements (Future Enhancements)

**O-001: Theme Preview in Terminal**
- **Where possible**, provide ASCII art preview of theme color scheme
- **Priority**: DEFERRED to Phase 2
- **Rationale**: Terminal users benefit from visual theme preview

**O-002: Framework-Specific Theme Recommendations**
- **Where possible**, suggest themes based on detected framework
- **Priority**: DEFERRED to Phase 2
- **Rationale**: Intelligent recommendations improve user experience

**O-003: Local Theme Creation**
- **Where possible**, enable custom theme creation in standalone mode (saved locally)
- **Priority**: DEFERRED to Phase 2
- **Rationale**: Power users may want custom themes without upgrade

---

## SPECIFICATIONS

### Built-in Themes (7 Types)

**Theme IDs and Descriptions:**

1. **next-tailwind-shadcn** (existing)
   - Description: Next.js + Tailwind CSS + shadcn/ui - Professional web applications
   - Stack: nextjs, tailwindcss, shadcn-ui
   - Brand Tone: professional

2. **next-tailwind-radix**
   - Description: Next.js + Tailwind CSS + Radix UI - Accessible component library
   - Stack: nextjs, tailwindcss, radix-ui
   - Brand Tone: professional

3. **vite-tailwind-shadcn**
   - Description: Vite + Tailwind CSS + shadcn/ui - Fast single-page applications
   - Stack: vite, tailwindcss, shadcn-ui
   - Brand Tone: creative

4. **next-styled-components**
   - Description: Next.js + Styled Components - CSS-in-JS approach
   - Stack: nextjs, styled-components
   - Brand Tone: flexible

5. **saas-dashboard**
   - Description: Data-rich enterprise dashboard design - Optimized for analytics and complex data visualization
   - Stack: nextjs, tailwindcss, shadcn-ui
   - Brand Tone: professional

6. **tech-startup**
   - Description: Modern innovative tech company aesthetic - Bold gradients and contemporary design patterns
   - Stack: nextjs, tailwindcss, shadcn-ui
   - Brand Tone: creative

7. **premium-editorial**
   - Description: Sophisticated magazine-style typography - Elegant serif fonts and refined visual hierarchy
   - Stack: nextjs, tailwindcss, custom
   - Brand Tone: elegant

### MCP Tool Definitions (Standalone Mode)

**theme.list**
```typescript
{
  name: "theme.list",
  description: "List all built-in themes available in standalone mode. Returns theme ID, name, description, and stack info.",
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  }
}
```

**theme.get**
```typescript
{
  name: "theme.get",
  description: "Get complete theme details including AI context for styling decisions. Provides questionnaire defaults and design tokens.",
  inputSchema: {
    type: "object",
    properties: {
      presetId: {
        type: "string",
        description: "Theme ID (e.g., 'next-tailwind-shadcn', 'saas-dashboard')"
      }
    },
    required: ["presetId"]
  }
}
```

**project.status**
```typescript
{
  name: "project.status",
  description: "Get project status including connection mode (standalone/connected), active theme, and detected framework.",
  inputSchema: {
    type: "object",
    properties: {
      projectPath: {
        type: "string",
        description: "Optional project path (defaults to current working directory)"
      }
    },
    required: []
  }
}
```

**project.useBuiltinPreset**
```typescript
{
  name: "project.useBuiltinPreset",
  description: "Select a built-in theme as the active theme for the project. Persists to local .tekton/config.json.",
  inputSchema: {
    type: "object",
    properties: {
      presetId: {
        type: "string",
        description: "Built-in theme ID to activate"
      },
      projectPath: {
        type: "string",
        description: "Optional project path (defaults to current working directory)"
      }
    },
    required: ["presetId"]
  }
}
```

### Local Configuration Schema

**.tekton/config.json:**
```json
{
  "$schema": "https://tekton.design/schemas/config.json",
  "version": "1.0.0",
  "mode": "standalone",
  "project": {
    "name": "my-project",
    "frameworkType": "next-app",
    "detectedAt": "2026-01-18T00:00:00Z"
  },
  "theme": {
    "activePresetId": "next-tailwind-shadcn",
    "selectedAt": "2026-01-18T00:00:00Z"
  }
}
```

### Package Structure Changes

**Current Structure:**
```
packages/studio-mcp/
  src/
    component/tools.ts     # Self-contained
    project/tools.ts       # API-dependent (getActivePreset, setActivePreset)
    screen/tools.ts        # Self-contained
    server/mcp-server.ts   # HTTP server
```

**Target Structure:**
```
packages/studio-mcp/
  src/
    component/tools.ts     # Unchanged
    project/
      tools.ts             # Refactored - mode-aware
      standalone.ts        # NEW - standalone implementations
      config.ts            # NEW - local config management
    screen/tools.ts        # Unchanged
    theme/
      builtin.ts           # NEW - bundled theme loader
      themes/             # NEW - 7 JSON theme files
        next-tailwind-shadcn.json
        next-tailwind-radix.json
        vite-tailwind-shadcn.json
        next-styled-components.json
        saas-dashboard.json
        tech-startup.json
        premium-editorial.json
    server/
      mcp-server.ts        # Updated - mode detection
```

### npm Package Configuration

**package.json Updates:**
```json
{
  "name": "@tekton/mcp-server",
  "version": "1.0.0",
  "description": "Tekton MCP Server - AI-powered design system tools for any project",
  "bin": {
    "tekton-mcp": "./dist/server/index.js"
  },
  "files": [
    "dist",
    "README.md"
  ],
  "publishConfig": {
    "access": "public"
  },
  "keywords": [
    "mcp",
    "model-context-protocol",
    "design-system",
    "ai-tools",
    "tekton"
  ]
}
```

### Mode Detection Logic

**Startup Sequence:**
1. Parse command line arguments for --standalone flag
2. If not forced standalone, attempt studio-api health check with 2 second timeout
3. If API reachable, operate in connected mode
4. If API not reachable, operate in standalone mode
5. Register tools appropriate for current mode
6. Load/create local configuration if applicable

**Mode Indicator in /health Response:**
```json
{
  "status": "ok",
  "service": "tekton-mcp",
  "mode": "standalone",
  "version": "1.0.0",
  "tools": ["component.list", "component.get", "theme.list", "theme.get", "project.status", "project.useBuiltinPreset", "screen.create", "..."],
  "features": {
    "customPresets": false,
    "cloudSync": false,
    "analytics": false
  }
}
```

---

## TRACEABILITY

### Requirements to Test Scenarios Mapping

| Requirement ID | Test Scenario ID | Component |
|----------------|------------------|-----------|
| U-001 | AC-001 | Environment independence verification |
| U-002 | AC-002 | Backward compatibility test suite |
| U-003 | AC-003 | Zero configuration startup test |
| U-004 | AC-004 | Local configuration persistence |
| U-005 | AC-005 | Bundled theme verification |
| E-001 | AC-006 | theme.list tool test |
| E-002 | AC-007 | theme.get tool test |
| E-003 | AC-008 | project.status tool test |
| E-004 | AC-009 | project.useBuiltinPreset tool test |
| S-001 | AC-010 | Mode selection logic test |
| S-002 | AC-011 | Theme source selection test |

### SPEC-to-Implementation Tags

- **[SPEC-MCP-STANDALONE-001]**: All commits related to standalone MCP
- **[MCP-THEME]**: Bundled theme implementations
- **[MCP-CONFIG]**: Local configuration management
- **[MCP-MODE]**: Mode detection and switching
- **[MCP-NPM]**: npm package configuration

---

## DEPENDENCIES

### Internal Dependencies
- **SPEC-MCP-001**: Completed - base MCP server infrastructure
- **@tekton/component-system**: Component data (bundled)
- **@tekton/theme**: Theme schemas (referenced for compatibility)

### External Dependencies
- **Zod**: Schema validation (already dependency)
- **Node.js 20+**: Runtime requirement

### No External Dependencies (Standalone Mode)
- **No studio-api**: API calls removed in standalone mode
- **No PostgreSQL**: Database not required
- **No Supabase**: Cloud services not required
- **No Authentication**: Auth removed for standalone

---

## RISK ANALYSIS

### High-Risk Areas

**Risk 1: npm Package Naming Collision**
- **Likelihood**: LOW
- **Impact**: HIGH
- **Mitigation**: Verify @tekton/mcp-server availability before development
- **Contingency**: Alternative names: @tekton/studio-mcp, @tekton-design/mcp

**Risk 2: Bundled Theme Size Growth**
- **Likelihood**: MEDIUM
- **Impact**: MEDIUM
- **Mitigation**: Minify JSON, monitor bundle size in CI
- **Contingency**: Lazy-load themes, external theme CDN

### Medium-Risk Areas

**Risk 3: Framework Detection Edge Cases**
- **Likelihood**: MEDIUM
- **Impact**: LOW
- **Mitigation**: Comprehensive framework detection tests
- **Contingency**: Manual framework specification option

**Risk 4: Local Config File Conflicts**
- **Likelihood**: LOW
- **Impact**: LOW
- **Mitigation**: Version field in config, migration logic
- **Contingency**: Reset config command

---

## SUCCESS CRITERIA

### Implementation Success Criteria
- [ ] All 4 standalone tools implemented and functional
- [ ] 7 built-in themes bundled and validated
- [ ] Local configuration storage working
- [ ] Mode detection working correctly
- [ ] npm package publishable

### Quality Success Criteria
- [ ] Test coverage greater than or equal to 85% for new code
- [ ] Package size less than 5MB
- [ ] Zero external API calls in standalone mode
- [ ] Startup time less than 2 seconds

### Integration Success Criteria
- [ ] `npx @tekton/mcp-server` works in fresh environment
- [ ] Existing screen.* and component.* tools unaffected
- [ ] Claude Desktop integration verified
- [ ] VS Code extension integration verified

---

## REFERENCES

- [SPEC-MCP-001: Tekton MCP Server Natural Language Screen Generation](../SPEC-MCP-001/spec.md) - Completed base implementation
- [Existing MCP Server](../../packages/studio-mcp/src/server/mcp-server.ts)
- [Theme Package](../../packages/theme/src/loader.ts)
- [npm Publishing Guide](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [MCP Specification](https://modelcontextprotocol.io/specification)

---

**Last Updated**: 2026-01-18
**Status**: Planned
**Implementation Branch**: feature/SPEC-MCP-STANDALONE-001
