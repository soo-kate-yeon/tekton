---
id: SPEC-MCP-002
title: "Tekton MCP Server v2.0.0 Acceptance Criteria"
version: "2.0.0"
created: "2026-01-25"
updated: "2026-01-25"
tags: ["SPEC-MCP-002", "Acceptance", "Testing", "stdio", "JSON-RPC"]
---

# SPEC-MCP-002: Acceptance Criteria v2.0.0

## Overview

This document defines the acceptance criteria for SPEC-MCP-002 v2.0.0 (stdio-based MCP standard) using Given-When-Then format. All scenarios must pass for the implementation to be considered complete.

**Key Changes from v1.0.0**:
- HTTP endpoint tests removed (stdio transport only)
- Preview URL tests removed (SPEC-PLAYGROUND-001 responsibility)
- File system write tests removed (data-only outputs)
- JSON-RPC format tests added
- stderr logging tests added
- Claude Code integration tests added

---

## AC-001: MCP Tool Registration via stdio

**Requirement**: U-001

**Test Scenario**: Verify all 3 MCP tools are registered and discoverable via stdio transport.

**Given**:
- MCP server is running via stdio
- MCP Inspector or Claude Code is connected

**When**:
- Client sends `tools/list` JSON-RPC request via stdin

**Then**:
- Response contains `generate-blueprint` tool with correct input schema
- Response contains `preview-theme` tool with correct input schema
- Response contains `export-screen` tool with correct input schema
- All tool descriptions are clear and actionable
- Response format is valid JSON-RPC 2.0

**Verification Method**: MCP Inspector tool discovery test

---

## AC-002: Input Schema Validation

**Requirement**: U-002

**Test Scenario**: Validate all MCP tool inputs reject invalid data with JSON-RPC compliant errors.

**Given**:
- MCP server is running via stdio

**When**:
- Invalid input is sent to `generate-blueprint` (e.g., description < 10 characters)

**Then**:
- Response is JSON-RPC error with code `-32602` (Invalid params)
- Error message specifies "Description must be at least 10 characters"
- Error data includes field name and validation details

**When**:
- Invalid theme ID format is sent (e.g., contains `../` path traversal)

**Then**:
- Response is JSON-RPC error with code `-32602`
- Error message indicates "Invalid theme ID format"
- Security check prevents malicious input processing

**Verification Method**: Unit tests with Zod schema validation

---

## AC-003: @tekton/core Integration

**Requirement**: U-003

**Test Scenario**: Verify MCP server reuses @tekton/core functions without duplication.

**Given**:
- MCP server implementation is complete

**When**:
- Code review is performed

**Then**:
- Blueprint creation uses `createBlueprint` from @tekton/core
- Blueprint validation uses `validateBlueprint` from @tekton/core
- Theme loading uses `loadTheme` from @tekton/core
- CSS variable generation uses `generateCSSVariables` from @tekton/core
- Code rendering uses `render` from @tekton/core
- No duplicate logic exists in MCP server code

**Verification Method**: Code review and static analysis

---

## AC-004: JSON-RPC Error Response Format

**Requirement**: U-004

**Test Scenario**: Verify all error responses follow JSON-RPC 2.0 format.

**Given**:
- MCP server is running via stdio

**When**:
- Blueprint generation fails due to invalid theme ID

**Then**:
- Response follows JSON-RPC 2.0 error format:
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

**When**:
- Blueprint validation fails

**Then**:
- Response includes error code and detailed validation errors in data field

**When**:
- Unknown tool is invoked

**Then**:
- Response includes error code `-32601` (Method not found)

**Verification Method**: Integration tests for all error scenarios

---

## AC-005: Theme Validation

**Requirement**: U-005

**Test Scenario**: Validate theme IDs against 13 built-in themes.

**Given**:
- MCP server is running via stdio

**When**:
- `generate-blueprint` is called with valid theme ID (e.g., `calm-wellness`)

**Then**:
- Blueprint is generated successfully
- Response includes valid blueprint data

**When**:
- `generate-blueprint` is called with invalid theme ID (e.g., `non-existent-theme`)

**Then**:
- Response is JSON-RPC error
- Error message includes: "Theme not found: non-existent-theme. Available themes: calm-wellness, dynamic-fitness, ..."
- Available theme list is complete (13 themes)

**Verification Method**: Unit tests with valid and invalid theme IDs

---

## AC-006: stderr-Only Logging

**Requirement**: U-006

**Test Scenario**: Verify all logs go to stderr, stdout reserved for JSON-RPC.

**Given**:
- MCP server is running via stdio
- stdout and stderr are captured separately

**When**:
- Multiple tool invocations are performed

**Then**:
- stdout contains only valid JSON-RPC 2.0 messages
- Each stdout line parses as valid JSON with `jsonrpc: "2.0"`
- stderr contains log messages with `[INFO]`, `[ERROR]`, or `[DEBUG]` prefixes
- No non-JSON content appears on stdout

**When**:
- Server encounters an internal error

**Then**:
- Error details logged to stderr
- JSON-RPC error response sent to stdout
- stdout remains valid JSON-RPC stream

**Verification Method**: Integration test capturing stdout/stderr separately

---

## AC-007: Blueprint Generation (Data-Only Output)

**Requirement**: E-001

**Test Scenario**: Generate valid Blueprint JSON without previewUrl.

**Given**:
- MCP server is running via stdio
- Theme `calm-wellness` is available

**When**:
- `generate-blueprint` is called with:
  ```json
  {
    "description": "User profile dashboard with avatar, bio, and settings link",
    "layout": "sidebar-left",
    "themeId": "calm-wellness",
    "componentHints": ["Card", "Avatar", "Button"]
  }
  ```

**Then**:
- Response includes valid blueprint data:
  - `id` follows format `bp-{timestamp}-{suffix}`
  - `name` is derived from description
  - `themeId` is `calm-wellness`
  - `layout` is `sidebar-left`
  - `components` array contains valid component nodes
  - `timestamp` is recent (within last 5 seconds)
- Response does NOT include `previewUrl` field
- Response format is JSON-RPC 2.0 compliant

**Verification Method**: Integration test with sample descriptions

---

## AC-008: Theme Data Retrieval (No Preview URL)

**Requirement**: E-002

**Test Scenario**: Retrieve theme metadata and CSS variables without previewUrl.

**Given**:
- MCP server is running via stdio
- Theme `premium-editorial` is available

**When**:
- `preview-theme` is called with `{ "themeId": "premium-editorial" }`

**Then**:
- Response includes theme data:
  - `id` is `premium-editorial`
  - `name` is "Premium Editorial"
  - `description` contains theme description
  - `cssVariables` includes `--color-primary`, `--font-family`, `--border-radius`
  - CSS variables are in `oklch()` format where applicable
- Response does NOT include `previewUrl` field
- Response format is JSON-RPC 2.0 compliant

**Verification Method**: Integration test with all 13 themes

---

## AC-009: Screen Code Export (No File Writes)

**Requirement**: E-003

**Test Scenario**: Export generated code without file system writes.

**Given**:
- MCP server is running via stdio
- Valid blueprint data is available

**When**:
- `export-screen` is called with:
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

**Then**:
- Response includes `code` field with valid TypeScript React component
- Generated code includes proper imports
- Generated code compiles without TypeScript errors
- Response does NOT include `filePath` field
- No file is written to the file system
- Response format is JSON-RPC 2.0 compliant

**When**:
- `export-screen` is called with `format: "jsx"`

**Then**:
- Generated code is vanilla React without TypeScript annotations

**When**:
- `export-screen` is called with `format: "vue"`

**Then**:
- Generated code uses Vue 3 Composition API syntax

**Verification Method**: Integration test with TypeScript/Vue compiler validation

---

## AC-010: Tool List Discovery

**Requirement**: E-004

**Test Scenario**: Verify tool list discovery via MCP protocol.

**Given**:
- MCP server is running via stdio

**When**:
- `tools/list` JSON-RPC request is sent:
  ```json
  {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
  }
  ```

**Then**:
- Response includes exactly 3 tools
- Each tool has `name`, `description`, and `inputSchema`
- Tool names are: `generate-blueprint`, `preview-theme`, `export-screen`
- Input schemas are valid JSON Schema format
- Response format is JSON-RPC 2.0 compliant

**Verification Method**: MCP Inspector tool list verification

---

## AC-011: Timestamp Collision Handling

**Requirement**: S-001

**Test Scenario**: Detect and resolve timestamp collisions for blueprint IDs.

**Given**:
- MCP server is running via stdio

**When**:
- Two `generate-blueprint` calls occur within same millisecond

**Then**:
- First blueprint gets ID `bp-1738123456789-abc123`
- Second blueprint detects potential collision
- Second blueprint gets unique ID with different suffix (e.g., `bp-1738123456789-def456`)
- Both blueprints have unique IDs
- No ID collision occurs

**Verification Method**: Performance test with rapid sequential requests

---

## AC-012: Theme Availability Check

**Requirement**: S-002

**Test Scenario**: Provide helpful error messages for invalid themes with alternatives.

**Given**:
- MCP server is running via stdio

**When**:
- `preview-theme` is called with invalid theme ID `invalid-theme`

**Then**:
- Response is JSON-RPC error
- Error includes complete list of 13 available themes:
  ```
  Available themes: calm-wellness, dynamic-fitness, korean-fintech,
  premium-editorial, modern-saas, organic-food, tech-startup,
  luxury-fashion, health-medical, education-learning,
  travel-adventure, real-estate, creative-agency
  ```

**Verification Method**: Unit test with invalid theme ID

---

## Quality Gates

### Test Coverage
- **Target**: >= 85% statement coverage
- **Measurement**: Vitest coverage report
- **Gate**: CI pipeline fails if coverage < 85%

### Performance
- **Tool Response Time**: < 500ms for all tools
- **Server Startup**: < 1 second to ready state
- **Memory Usage**: < 100MB baseline
- **Measurement**: Performance test suite
- **Gate**: CI pipeline fails if thresholds exceeded

### Type Safety
- **Target**: Zero TypeScript compilation errors
- **Measurement**: `tsc --noEmit` in strict mode
- **Gate**: CI pipeline fails on type errors

### Security
- **Target**: Zero critical/high vulnerabilities
- **Measurement**: `npm audit`
- **Gate**: CI pipeline fails on critical vulnerabilities

### Protocol Compliance
- **Target**: All JSON-RPC 2.0 responses valid
- **Measurement**: MCP Inspector validation
- **Gate**: Manual verification before release

### Integration
- **Target**: All 12 acceptance criteria pass
- **Measurement**: Integration test suite
- **Gate**: CI pipeline fails if any AC fails

---

## Definition of Done

Implementation is considered complete when:

1. All 12 acceptance criteria pass
2. Test coverage >= 85%
3. All performance thresholds met
4. Zero TypeScript errors in strict mode
5. Security audit passes
6. @tekton/core integration verified (no code duplication)
7. MCP tools accessible from Claude Code
8. JSON-RPC 2.0 protocol compliance verified
9. stderr-only logging verified (no stdout pollution)
10. No file system side effects from tool handlers
11. Documentation complete (README, migration guide)
12. Code review approved

---

## User Acceptance Scenarios

### Scenario 1: AI-Driven Blueprint Generation

**Given**:
- User opens Claude Code
- Tekton MCP server is configured in claude_desktop_config.json

**When**:
- User types: "Create a user dashboard with profile card and activity feed using calm-wellness theme"

**Then**:
- Claude Code invokes `generate-blueprint` MCP tool
- Blueprint is generated with Card components and sidebar layout
- Blueprint data is returned (no preview URL)
- User can see blueprint structure in Claude Code response

**Success Metric**: Complete workflow in < 5 seconds

---

### Scenario 2: Theme Quality Check

**Given**:
- User is exploring Tekton themes via Claude Code

**When**:
- User types: "Show me how premium-editorial theme looks"

**Then**:
- Claude Code invokes `preview-theme` MCP tool
- Theme metadata and CSS variables are returned
- User can see OKLCH color values and typography settings
- User can use this data with SPEC-PLAYGROUND-001 for visual preview

**Success Metric**: Theme data returned in < 2 seconds

---

### Scenario 3: Production Code Export

**Given**:
- User has generated a dashboard blueprint via Claude Code

**When**:
- User types: "Export the dashboard as TypeScript React component"

**Then**:
- Claude Code invokes `export-screen` MCP tool
- Generated `.tsx` code is returned as string
- Code includes proper imports and type annotations
- User can copy/paste code into their project
- No file is automatically written

**Success Metric**: Code generation in < 3 seconds, code compiles without errors

---

### Scenario 4: Error Recovery

**Given**:
- User is using Tekton MCP tools via Claude Code

**When**:
- User requests blueprint with invalid theme: "Create dashboard with non-existent-theme"

**Then**:
- Claude Code receives clear error response
- Error message lists all 13 available themes
- User can retry with valid theme name
- Workflow continues without restart

**Success Metric**: Error response provides actionable guidance

---

### Scenario 5: Multiple Tool Workflow

**Given**:
- User wants to explore themes and generate code

**When**:
- User types: "Show me calm-wellness theme, then create a login page with it, and export as TSX"

**Then**:
- Claude Code invokes `preview-theme` for calm-wellness
- Claude Code invokes `generate-blueprint` for login page
- Claude Code invokes `export-screen` with TSX format
- All three responses are displayed in sequence
- Complete workflow succeeds

**Success Metric**: Multi-tool workflow completes in < 10 seconds

---

## MCP Inspector Validation Checklist

Before release, manually verify with MCP Inspector:

- [ ] Server connects via stdio transport
- [ ] `tools/list` returns all 3 tools
- [ ] Tool schemas are valid JSON Schema
- [ ] `generate-blueprint` invocation succeeds
- [ ] `preview-theme` invocation succeeds
- [ ] `export-screen` invocation succeeds
- [ ] Invalid input returns proper JSON-RPC error
- [ ] Error responses include helpful messages
- [ ] No stdout pollution observed
- [ ] Logs appear on stderr only

---

## Claude Code Integration Checklist

Before release, manually verify with Claude Code:

- [ ] MCP server appears in Claude Code MCP panel
- [ ] All 3 tools are discoverable
- [ ] Natural language triggers correct tool
- [ ] Tool responses render correctly in Claude
- [ ] Error responses are user-friendly
- [ ] No Claude Code warnings or errors
- [ ] Multi-turn conversations work correctly
- [ ] Tool parameters are passed correctly

---

**Last Updated**: 2026-01-25
**Status**: Planned
**Version**: 2.0.0
**Related**: SPEC-MCP-002/spec.md, SPEC-MCP-002/plan.md
