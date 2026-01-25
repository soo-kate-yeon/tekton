---
id: SPEC-MCP-002
version: "2.0.0"
status: "planned"
created: "2026-01-25"
updated: "2026-01-25"
author: "MoAI-ADK"
priority: "HIGH"
lifecycle: "spec-anchored"
tags: ["SPEC-MCP-002", "MCP", "Blueprint", "stdio", "JSON-RPC"]
---

## HISTORY
- 2026-01-25 v2.0.0: Architecture migration from HTTP to stdio MCP standard. Remove web preview functionality. Delegate preview rendering to SPEC-PLAYGROUND-001.
- 2026-01-25 v1.0.0: Initial SPEC creation - Tekton MCP Server with Timestamp-Based Preview System

---

# SPEC-MCP-002: Tekton MCP Server - stdio-based MCP Standard Implementation

## Executive Summary

**Purpose**: Implement stdio-based MCP server compliant with Model Context Protocol standard, enabling native Claude Code integration for AI-driven blueprint generation and theme management through @tekton/core pipeline.

**Scope**: Implement 3 MCP tools (generate-blueprint, preview-theme, export-screen) using @modelcontextprotocol/sdk with stdio transport. Remove web server and preview URL functionality - preview rendering is delegated to SPEC-PLAYGROUND-001.

**Priority**: HIGH - Enables true Claude Code native integration via stdio transport, compliant with MCP standard.

**Impact**: Transforms Tekton from custom HTTP-based server to MCP standard-compliant service. Users invoke tools directly from Claude Code with seamless JSON-RPC communication. All tool outputs are data-only (no file system side effects in export-screen, no preview URLs).

**Differentiators vs Google Stitch**:
- **OKLCH Color System**: Perceptually uniform color transformations vs RGB approximations
- **Type-Safe Blueprints**: Zod schema validation prevents invalid component combinations
- **MCP Standard Compliant**: stdio transport enables native Claude Code integration
- **13 Built-in Themes**: Production-ready themes vs manual configuration
- **Data-Only Outputs**: Clean separation between MCP tools and file system operations

**Architecture Migration Summary**:
- **Transport**: HTTP REST API → stdio (StdioServerTransport)
- **Protocol**: Custom endpoints → JSON-RPC 2.0
- **Preview**: Removed entirely (SPEC-PLAYGROUND-001 responsibility)
- **Output**: No previewUrl, no filePath fields in tool responses
- **Dependency**: @modelcontextprotocol/sdk@^1.0.0

---

## ENVIRONMENT

### Current System Context

**Existing @tekton/core Pipeline:**
- **Theme Module**: 13 built-in themes (calm-wellness, dynamic-fitness, korean-fintech, etc.)
- **Blueprint Module**: 6 layout types (single-column, two-column, sidebar-left, sidebar-right, dashboard, landing)
- **Render Module**: Blueprint → JSX code generation with TypeScript support
- **Component Catalog**: 20 components (Button, Input, Card, Text, Heading, Image, Link, List, Form, Modal, Tabs, Table, Badge, Avatar, Dropdown, Checkbox, Radio, Switch, Slider, Progress)
- **OKLCH Color Space**: L(0-1), C(0-0.5), H(0-360) with CSS variable generation
- **Validation**: Blueprint structure validation, component type checking

**Technology Stack:**
- **Runtime**: Node.js 20+, TypeScript 5.7+
- **MCP SDK**: @modelcontextprotocol/sdk v1.x (stable, production-ready)
- **Transport**: stdio (StdioServerTransport)
- **Protocol**: JSON-RPC 2.0
- **Core Pipeline**: @tekton/core (Theme → Blueprint → Screen)
- **Schema Validation**: Zod 3.23+ for type-safe data validation
- **Color System**: OKLCH with CSS `oklch()` function support
- **Logging**: stderr only (stdout reserved for JSON-RPC messages)

**Integration Requirements:**
- **Claude Code**: Native MCP Protocol tool registration via stdio transport
- **@tekton/core**: Reuse existing theme loading, blueprint creation, and render functions
- **SPEC-PLAYGROUND-001**: Provides preview rendering UI (separate from MCP server)

---

## ASSUMPTIONS

### Technical Assumptions

**A-001: MCP Protocol stdio Compatibility**
- **Assumption**: Claude Code supports MCP Protocol via stdio transport with JSON-RPC 2.0 communication
- **Confidence**: HIGH
- **Evidence**: MCP SDK v1.x provides stable StdioServerTransport, widely adopted by MCP servers
- **Risk if Wrong**: Cannot integrate natively with Claude Code
- **Validation**: MCP Inspector testing, Claude Code integration verification

**A-002: Timestamp Uniqueness for Blueprint IDs**
- **Assumption**: Timestamp-based blueprint IDs provide sufficient uniqueness for identification
- **Confidence**: HIGH
- **Evidence**: `Date.now()` provides millisecond precision, collision probability < 0.001% for typical usage
- **Risk if Wrong**: Blueprint ID collisions in rapid sequential generation
- **Validation**: Timestamp generation tests with collision detection, add random suffix if needed

**A-003: stdio Debugging Limitations**
- **Assumption**: Debugging stdio-based MCP servers requires specialized tools (MCP Inspector) since stdout is reserved for JSON-RPC
- **Confidence**: HIGH
- **Evidence**: All logging must use stderr; console.log breaks JSON-RPC protocol
- **Risk if Wrong**: Difficult to debug production issues
- **Validation**: Implement structured logging to stderr, test with MCP Inspector

**A-004: @tekton/core Stability**
- **Assumption**: @tekton/core API remains stable for theme loading, blueprint creation, and rendering
- **Confidence**: HIGH
- **Evidence**: @tekton/core v0.1.0 is production-ready with comprehensive test coverage
- **Risk if Wrong**: Breaking changes require MCP server updates
- **Validation**: Version pinning, integration tests with @tekton/core

### Business Assumptions

**A-005: Claude Code Integration Value**
- **Assumption**: Users prefer Claude Code natural language workflow over manual blueprint JSON authoring
- **Confidence**: HIGH
- **Evidence**: AI-driven design workflows reduce time-to-screen by 60-80% (industry benchmark)
- **Risk if Wrong**: Manual JSON authoring remains preferred, MCP integration underutilized
- **Validation**: User research, workflow comparison studies

**A-006: Data-Only Tool Outputs Preferred**
- **Assumption**: Users prefer MCP tools to return data only, with file system operations handled separately
- **Confidence**: HIGH
- **Evidence**: Clean separation of concerns enables flexible integration patterns
- **Risk if Wrong**: Users expect file system side effects from MCP tools
- **Validation**: User feedback on export-screen workflow

### Integration Assumptions

**A-007: SPEC-PLAYGROUND-001 Preview Responsibility**
- **Assumption**: SPEC-PLAYGROUND-001 handles all preview rendering and theme switching UI
- **Confidence**: HIGH
- **Evidence**: SPEC-PLAYGROUND-001 designed for React-based preview rendering
- **Risk if Wrong**: No preview capability until SPEC-PLAYGROUND-001 complete
- **Validation**: Cross-SPEC integration planning

---

## REQUIREMENTS

### Ubiquitous Requirements (Always Active)

**U-001: MCP Tool Registration via stdio**
- The system **shall** register all MCP tools (generate-blueprint, preview-theme, export-screen) via stdio transport using @modelcontextprotocol/sdk for native Claude Code discovery and invocation.
- **Rationale**: stdio transport is the MCP standard for Claude Code integration.
- **Test Strategy**: MCP Inspector tool list verification, Claude Code integration test.

**U-002: Input Schema Validation**
- The system **shall** validate all MCP tool inputs using Zod schemas before execution to prevent runtime errors and provide clear error messages.
- **Rationale**: Type-safe input validation ensures blueprint integrity and prevents invalid component combinations.
- **Test Strategy**: Schema validation tests with valid and invalid inputs, error message clarity verification.

**U-003: @tekton/core Integration**
- The system **shall** reuse @tekton/core functions (loadTheme, createBlueprint, renderScreen) without duplication to maintain single source of truth.
- **Rationale**: Code reuse prevents drift between core pipeline and MCP server logic.
- **Test Strategy**: Integration tests verifying @tekton/core function calls, no duplicate logic.

**U-004: JSON-RPC Error Response Format**
- The system **shall** return JSON-RPC 2.0 compliant error responses with error code, message, and optional data field for all MCP tool failures.
- **Rationale**: MCP standard requires JSON-RPC 2.0 error format for proper Claude Code error handling.
- **Test Strategy**: Error response format validation across all tools, JSON-RPC compliance check.

**U-005: Theme Validation**
- The system **shall** validate theme IDs against 13 built-in themes before blueprint generation and return error for invalid theme IDs.
- **Rationale**: Invalid theme IDs cause render failures, early validation prevents downstream errors.
- **Test Strategy**: Theme ID validation tests with valid and invalid IDs, error message clarity.

**U-006: stderr-Only Logging**
- The system **shall** output all log messages to stderr only, reserving stdout exclusively for JSON-RPC 2.0 messages.
- **Rationale**: stdout pollution breaks JSON-RPC protocol and causes Claude Code communication failures.
- **Test Strategy**: Logging output verification, stdout content validation.

### Event-Driven Requirements (Trigger-Response)

**E-001: Blueprint Generation Request**
- **WHEN** `generate-blueprint` tool invoked with natural language description, layout type, and theme ID **THEN** generate valid Blueprint JSON with timestamp-based ID and component nodes.
- **Rationale**: Single MCP tool call creates complete blueprint ready for rendering.
- **Output**: Blueprint data only (no previewUrl).
- **Test Strategy**: Blueprint generation tests with various descriptions and layouts, output validation.

**E-002: Theme Data Request**
- **WHEN** `preview-theme` tool invoked with theme ID **THEN** return theme metadata and CSS variables.
- **Rationale**: Theme data enables quality check and integration with external preview systems.
- **Output**: Theme data only (no previewUrl) - preview rendering is SPEC-PLAYGROUND-001 responsibility.
- **Test Strategy**: Theme loading tests, CSS variable extraction verification.

**E-003: Screen Code Export Request**
- **WHEN** `export-screen` tool invoked with blueprint data and format (jsx, tsx, vue) **THEN** return generated code as string.
- **Rationale**: Code export enables production integration from AI-generated blueprints.
- **Output**: Code string only (no file system writes, no filePath).
- **Test Strategy**: Code generation tests with multiple formats, syntax validation.

**E-004: Tool List Request**
- **WHEN** Claude Code requests tool list via MCP protocol **THEN** return all registered tools with schemas and descriptions.
- **Rationale**: Tool discovery enables Claude Code to invoke appropriate tools.
- **Test Strategy**: MCP Inspector tool list verification.

### State-Driven Requirements (Conditional Behavior)

**S-001: Timestamp Collision Handling**
- **IF** timestamp collision detected (same millisecond for blueprint ID generation) **THEN** append random 6-character suffix to ensure uniqueness.
- **Rationale**: Rapid sequential tool calls may produce identical timestamps, suffix prevents ID collisions.
- **Test Strategy**: Collision detection tests, suffix uniqueness verification.

**S-002: Theme Availability Check**
- **IF** requested theme ID exists in built-in themes **THEN** load theme and return data.
- **IF** requested theme ID not found **THEN** return error with available theme list.
- **Rationale**: Clear error messages with alternatives improve user experience.
- **Test Strategy**: Theme availability tests with valid and invalid IDs, error message verification.

**S-003: Blueprint Validation Result**
- **IF** generated blueprint passes validation **THEN** return blueprint data.
- **IF** generated blueprint fails validation **THEN** return validation errors.
- **Rationale**: Invalid blueprints should not be returned to prevent downstream rendering errors.
- **Test Strategy**: Blueprint validation tests with valid and invalid structures, error clarity.

**S-004: Export Format Selection**
- **IF** export format is `tsx` **THEN** include TypeScript type annotations in generated code.
- **IF** export format is `jsx` **THEN** generate vanilla React without TypeScript.
- **IF** export format is `vue` **THEN** generate Vue 3 Composition API syntax.
- **Rationale**: Framework-specific exports enable integration with diverse tech stacks.
- **Test Strategy**: Format-specific generation tests, syntax validation for each format.

### Unwanted Behaviors (Prohibited Actions)

**UW-001: No stdout Pollution**
- The system **shall not** write any non-JSON-RPC content to stdout to prevent protocol corruption.
- **Rationale**: stdout is reserved for JSON-RPC 2.0 messages; any other content breaks Claude Code communication.
- **Test Strategy**: stdout content verification, no console.log usage.

**UW-002: No Theme ID Injection**
- The system **shall not** allow theme ID injection attacks through malicious input to prevent unauthorized operations.
- **Rationale**: Security requirement prevents malicious input processing.
- **Test Strategy**: Security tests with malicious inputs (e.g., `../../../etc/passwd`), input sanitization verification.

**UW-003: No Silent Failures**
- The system **shall not** return success status when blueprint generation or code export fails.
- **Rationale**: Accurate status enables Claude Code error recovery and user feedback.
- **Test Strategy**: Failure mode tests with comprehensive error verification.

**UW-004: No Duplicate Tool Registration**
- The system **shall not** register multiple tools with same name to prevent Claude Code invocation conflicts.
- **Rationale**: Tool name uniqueness ensures predictable AI assistant behavior.
- **Test Strategy**: Tool registration tests, duplicate name detection.

**UW-005: No File System Writes from Tools**
- The system **shall not** write files to the file system from MCP tool handlers to maintain data-only output pattern.
- **Rationale**: Clean separation of concerns - MCP tools return data, file operations are handled externally.
- **Test Strategy**: File system monitoring during tool execution, no file creation verification.

### Optional Requirements (Future Enhancements)

**O-001: Blueprint Template Library**
- **Where possible**, provide pre-built blueprint templates (dashboard, landing, settings) for common screen patterns.
- **Priority**: DEFERRED to Phase 2
- **Rationale**: Templates accelerate screen generation, but AI-driven generation sufficient for MVP.

**O-002: Custom Theme Registration**
- **Where possible**, enable registration of custom themes beyond 13 built-in themes.
- **Priority**: DEFERRED to Phase 2
- **Rationale**: Custom themes enable brand-specific design systems.

**O-003: Streaming Code Generation**
- **Where possible**, stream large code outputs incrementally for better UX with large blueprints.
- **Priority**: DEFERRED to Phase 2
- **Rationale**: Streaming improves perceived performance for complex screens.

---

## SPECIFICATIONS

### stdio Transport Setup

**Entry Point Configuration:**
```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Create MCP server instance
const server = new Server(
  {
    name: 'tekton-mcp-server',
    version: '2.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Connect via stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
```

**Logging to stderr:**
```typescript
// All logging must use stderr
const logger = {
  info: (msg: string) => console.error(`[INFO] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
  debug: (msg: string) => console.error(`[DEBUG] ${msg}`),
};
```

### JSON-RPC Message Flow

**Tool Invocation Request (from Claude Code):**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "generate-blueprint",
    "arguments": {
      "description": "User profile dashboard with avatar and bio",
      "layout": "sidebar-left",
      "themeId": "calm-wellness"
    }
  }
}
```

**Tool Response (to Claude Code):**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"success\":true,\"blueprint\":{...}}"
      }
    ]
  }
}
```

**Error Response (JSON-RPC 2.0 compliant):**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Invalid params",
    "data": {
      "field": "themeId",
      "message": "Theme not found: invalid-theme"
    }
  }
}
```

### MCP Tool Definitions

#### generate-blueprint

**Purpose**: Generate Blueprint JSON from natural language description.

**Input Schema (Zod)**:
```typescript
{
  description: z.string().min(10).max(500),
  layout: z.enum(['single-column', 'two-column', 'sidebar-left', 'sidebar-right', 'dashboard', 'landing']),
  themeId: z.string().regex(/^[a-z0-9-]+$/),
  componentHints?: z.array(z.string()).optional()
}
```

**Output Schema**:
```typescript
{
  success: boolean,
  blueprint?: {
    id: string,           // Format: bp-{timestamp}-{randomSuffix}
    name: string,
    themeId: string,
    layout: LayoutType,
    components: ComponentNode[],
    timestamp: number
  },
  error?: string
}
```

**Example Request**:
```json
{
  "description": "User profile dashboard with avatar, bio, settings link",
  "layout": "sidebar-left",
  "themeId": "calm-wellness",
  "componentHints": ["Card", "Avatar", "Button"]
}
```

**Example Response**:
```json
{
  "success": true,
  "blueprint": {
    "id": "bp-1738123456789-abc123",
    "name": "User Profile Dashboard",
    "themeId": "calm-wellness",
    "layout": "sidebar-left",
    "components": [
      { "type": "Card", "slot": "main", "children": [
        { "type": "Avatar", "props": { "size": "large" } },
        { "type": "Text", "children": ["User bio content"] }
      ]},
      { "type": "Button", "slot": "sidebar", "props": { "variant": "primary" }, "children": ["Settings"] }
    ],
    "timestamp": 1738123456789
  }
}
```

#### preview-theme

**Purpose**: Get theme metadata and CSS variables for preview integration.

**Input Schema (Zod)**:
```typescript
{
  themeId: z.string().regex(/^[a-z0-9-]+$/)
}
```

**Output Schema**:
```typescript
{
  success: boolean,
  theme?: {
    id: string,
    name: string,
    description: string,
    cssVariables: Record<string, string>
  },
  error?: string
}
```

**Example Request**:
```json
{
  "themeId": "premium-editorial"
}
```

**Example Response**:
```json
{
  "success": true,
  "theme": {
    "id": "premium-editorial",
    "name": "Premium Editorial",
    "description": "Sophisticated editorial design with high contrast and serif typography",
    "cssVariables": {
      "--color-primary": "oklch(0.45 0.15 220)",
      "--color-secondary": "oklch(0.60 0.12 280)",
      "--font-family": "Georgia, serif",
      "--border-radius": "4px"
    }
  }
}
```

#### export-screen

**Purpose**: Generate production code from blueprint data.

**Input Schema (Zod)**:
```typescript
{
  blueprint: z.object({
    id: z.string(),
    name: z.string(),
    themeId: z.string(),
    layout: z.enum(['single-column', 'two-column', 'sidebar-left', 'sidebar-right', 'dashboard', 'landing']),
    components: z.array(z.any()),
    timestamp: z.number()
  }),
  format: z.enum(['jsx', 'tsx', 'vue'])
}
```

**Output Schema**:
```typescript
{
  success: boolean,
  code?: string,
  error?: string
}
```

**Example Request**:
```json
{
  "blueprint": {
    "id": "bp-1738123456789-abc123",
    "name": "User Profile Dashboard",
    "themeId": "calm-wellness",
    "layout": "sidebar-left",
    "components": [...],
    "timestamp": 1738123456789
  },
  "format": "tsx"
}
```

**Example Response**:
```json
{
  "success": true,
  "code": "import React from 'react';\nimport { Card, Avatar, Text, Button } from '@tekton/components';\n\nexport default function UserProfileDashboard() {\n  return (\n    <div className=\"container sidebar-left\">\n      <Card>\n        <Avatar size=\"large\" />\n        <Text>User bio content</Text>\n      </Card>\n      <Button variant=\"primary\">Settings</Button>\n    </div>\n  );\n}"
}
```

### Claude Code Integration

**claude_desktop_config.json Configuration:**
```json
{
  "mcpServers": {
    "tekton": {
      "command": "node",
      "args": ["/path/to/tekton/packages/mcp-server/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**Tool Discovery:**
Claude Code automatically discovers tools via `tools/list` JSON-RPC method:
```json
{
  "tools": [
    {
      "name": "generate-blueprint",
      "description": "Generate a UI blueprint from natural language description",
      "inputSchema": { ... }
    },
    {
      "name": "preview-theme",
      "description": "Get theme metadata and CSS variables",
      "inputSchema": { ... }
    },
    {
      "name": "export-screen",
      "description": "Export blueprint to production code (JSX, TSX, or Vue)",
      "inputSchema": { ... }
    }
  ]
}
```

---

## TRACEABILITY

### Requirements to Test Scenarios Mapping

| Requirement ID | Test Scenario ID | Component |
|----------------|------------------|-----------|
| U-001 | AC-001 | MCP tool registration via stdio |
| U-002 | AC-002 | Input schema validation |
| U-003 | AC-003 | @tekton/core integration |
| U-004 | AC-004 | JSON-RPC error response format |
| U-005 | AC-005 | Theme validation |
| U-006 | AC-006 | stderr-only logging |
| E-001 | AC-007 | Blueprint generation |
| E-002 | AC-008 | Theme data retrieval |
| E-003 | AC-009 | Screen code export |
| E-004 | AC-010 | Tool list discovery |
| S-001 | AC-011 | Timestamp collision handling |
| S-002 | AC-012 | Theme availability check |

### SPEC-to-Implementation Tags

- **[SPEC-MCP-002]**: All commits related to MCP server implementation
- **[MCP-TOOLS]**: MCP tool implementations (generate-blueprint, preview-theme, export-screen)
- **[MCP-STDIO]**: stdio transport and JSON-RPC handling
- **[MCP-INTEGRATION]**: @tekton/core integration and Claude Code compatibility

---

## DEPENDENCIES

### Internal Dependencies
- **@tekton/core**: Theme loading, blueprint creation, screen rendering
- **SPEC-PLAYGROUND-001**: Preview rendering UI (separate implementation)

### External Dependencies
- **@modelcontextprotocol/sdk**: ^1.0.0 - MCP SDK with stdio transport
- **Zod**: ^3.23.0 - Schema validation
- **TypeScript**: ^5.7.0 - Type safety

### Technical Dependencies
- **Node.js**: 20+ runtime
- **TypeScript**: 5.7+ compiler
- **Claude Code**: MCP Protocol support via stdio

---

## RISK ANALYSIS

### High-Risk Areas

**Risk 1: stdio Debugging Complexity**
- **Likelihood**: MEDIUM
- **Impact**: MEDIUM
- **Mitigation**: Structured stderr logging, MCP Inspector for testing
- **Contingency**: Implement detailed debug logging with log levels

**Risk 2: @tekton/core API Changes**
- **Likelihood**: LOW
- **Impact**: HIGH
- **Mitigation**: Version pinning, integration tests, semantic versioning
- **Contingency**: Implement adapter layer for API changes

**Risk 3: JSON-RPC Protocol Compliance**
- **Likelihood**: LOW
- **Impact**: HIGH
- **Mitigation**: Use @modelcontextprotocol/sdk which handles protocol details
- **Contingency**: Manual protocol testing with MCP Inspector

### Medium-Risk Areas

**Risk 4: Timestamp Collision**
- **Likelihood**: LOW
- **Impact**: MEDIUM
- **Mitigation**: Collision detection with random suffix
- **Contingency**: Implement UUID-based IDs if collisions increase

**Risk 5: Code Generation Quality**
- **Likelihood**: MEDIUM
- **Impact**: MEDIUM
- **Mitigation**: Comprehensive format-specific tests, syntax validation
- **Contingency**: Manual review process for generated code

---

## SUCCESS CRITERIA

### Implementation Success Criteria
- All 3 MCP tools registered and functional via stdio transport
- JSON-RPC 2.0 protocol compliance verified with MCP Inspector
- stderr-only logging verified (no stdout pollution)
- @tekton/core integration works without code duplication
- Blueprint validation prevents invalid component combinations
- No file system side effects from tool handlers

### Quality Success Criteria
- Test coverage >= 85% for all new code
- All MCP tool invocations complete in < 500ms
- Error messages follow JSON-RPC 2.0 format
- Zero TypeScript compilation errors with strict mode
- Security audit passes with no critical vulnerabilities

### Integration Success Criteria
- MCP tools accessible from Claude Code with natural language prompts
- Tool discovery works correctly via MCP protocol
- Generated code compiles without errors in target framework
- Theme data enables SPEC-PLAYGROUND-001 integration

---

## REFERENCES

- [SPEC-PLAYGROUND-001: React Playground](../SPEC-PLAYGROUND-001/spec.md)
- [@tekton/core Package](../../packages/core/)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [TRUST 5 Framework](../../.claude/skills/moai-foundation-core/modules/trust-5-framework.md)

---

**Last Updated**: 2026-01-25
**Status**: Planned
**Version**: 2.0.0
**Next Steps**: /moai:2-run SPEC-MCP-002 for DDD implementation
