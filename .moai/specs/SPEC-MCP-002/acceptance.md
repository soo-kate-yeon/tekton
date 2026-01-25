---
id: SPEC-MCP-002
title: "Tekton MCP Server Acceptance Criteria"
created: "2026-01-25"
tags: ["SPEC-MCP-002", "Acceptance", "Testing"]
---

# SPEC-MCP-002: Acceptance Criteria

## Overview

This document defines the acceptance criteria for SPEC-MCP-002 using Given-When-Then format. All scenarios must pass for the implementation to be considered complete.

---

## AC-001: MCP Tool Registration

**Test Scenario**: Verify all 3 MCP tools are registered and discoverable by Claude Code.

**Given**:
- MCP server is running
- Claude Code is connected to MCP server

**When**:
- Claude Code requests tool list from MCP server

**Then**:
- Tool list contains `generate-blueprint` with correct input schema
- Tool list contains `preview-theme` with correct input schema
- Tool list contains `export-screen` with correct input schema
- All schemas include required fields and validation rules
- Tool descriptions are clear and actionable

**Verification Method**: Integration test with MCP Protocol tool list endpoint

---

## AC-002: Input Schema Validation

**Test Scenario**: Validate all MCP tool inputs reject invalid data with clear error messages.

**Given**:
- MCP server is running

**When**:
- Invalid input is sent to `generate-blueprint` (e.g., description < 10 characters)

**Then**:
- Response returns `{ success: false, error: "Description must be at least 10 characters" }`
- Error message is actionable and specific

**When**:
- Invalid theme ID is sent (e.g., contains `../` path traversal)

**Then**:
- Response returns `{ success: false, error: "Invalid theme ID format" }`
- Security check prevents path traversal

**Verification Method**: Unit tests with Zod schema validation

---

## AC-003: @tekton/core Integration

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
- No duplicate logic exists in MCP server code

**Verification Method**: Code review and static analysis

---

## AC-004: Error Response Consistency

**Test Scenario**: Verify all error responses follow standardized format.

**Given**:
- MCP server is running

**When**:
- Blueprint generation fails due to invalid theme ID

**Then**:
- Response is `{ success: false, error: "Theme not found: invalid-theme" }`

**When**:
- Blueprint validation fails

**Then**:
- Response is `{ success: false, error: "Validation errors: ..." }`

**When**:
- Storage operation fails

**Then**:
- Response is `{ success: false, error: "Failed to save blueprint: ..." }`

**Verification Method**: Integration tests for all error scenarios

---

## AC-005: Theme Validation

**Test Scenario**: Validate theme IDs against 13 built-in themes.

**Given**:
- MCP server is running

**When**:
- `generate-blueprint` is called with valid theme ID (e.g., `calm-wellness`)

**Then**:
- Blueprint is generated successfully
- Response includes `success: true`

**When**:
- `generate-blueprint` is called with invalid theme ID (e.g., `non-existent-theme`)

**Then**:
- Response is `{ success: false, error: "Theme not found: non-existent-theme. Available themes: ..." }`
- Error message includes list of available themes

**Verification Method**: Unit tests with valid and invalid theme IDs

---

## AC-006: Blueprint Generation

**Test Scenario**: Generate valid Blueprint JSON from natural language description.

**Given**:
- MCP server is running
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
- Response includes `success: true`
- Blueprint contains valid component nodes (Card, Avatar, Button)
- Blueprint layout is `sidebar-left`
- Blueprint theme ID is `calm-wellness`
- Blueprint timestamp is recent (within last 5 seconds)
- Preview URL follows format `http://localhost:3000/preview/:timestamp/calm-wellness`

**Verification Method**: Integration test with sample descriptions

---

## AC-007: Theme Preview

**Test Scenario**: Generate theme preview with CSS variables.

**Given**:
- MCP server is running
- Theme `premium-editorial` is available

**When**:
- `preview-theme` is called with `{ "themeId": "premium-editorial" }`

**Then**:
- Response includes `success: true`
- Theme metadata contains `id`, `name`, `description`
- CSS variables include `--color-primary`, `--font-family`, `--border-radius`
- Preview URL follows format `http://localhost:3000/preview/:timestamp/premium-editorial`
- CSS variables are in `oklch()` format

**Verification Method**: Integration test with all 13 themes

---

## AC-008: Screen Export

**Test Scenario**: Export generated screen to production code.

**Given**:
- MCP server is running
- Blueprint `bp-1738123456789-abc123` exists

**When**:
- `export-screen` is called with:
  ```json
  {
    "blueprintId": "bp-1738123456789-abc123",
    "format": "tsx",
    "outputPath": "src/screens/user-profile.tsx"
  }
  ```

**Then**:
- Response includes `success: true`
- Generated code is valid TypeScript React component
- Code includes proper imports (e.g., `import { Card, Avatar } from '@/components'`)
- Code compiles without TypeScript errors
- File is saved to `src/screens/user-profile.tsx`

**Verification Method**: Integration test with TypeScript compiler validation

---

## AC-009: Preview URL Access

**Test Scenario**: Serve preview HTML with theme CSS variables.

**Given**:
- MCP server is running
- Blueprint with timestamp `1738123456789` and theme `calm-wellness` exists

**When**:
- HTTP GET request to `/preview/1738123456789/calm-wellness`

**Then**:
- Response status code is 200
- Response HTML includes `<style>:root { ... }</style>` with CSS variables
- HTML includes `<div id="root" data-timestamp="1738123456789" data-theme-id="calm-wellness">`
- HTML includes `window.__TEKTON_PREVIEW__` global with timestamp and blueprintUrl
- CORS headers allow playground origin

**Verification Method**: HTTP endpoint test with HTML parsing

---

## AC-010: Real-Time Theme Switch

**Test Scenario**: Switch theme without regenerating blueprint.

**Given**:
- MCP server is running
- Blueprint exists with timestamp `1738123456789`

**When**:
- HTTP GET request to `/preview/1738123456789/calm-wellness`

**Then**:
- Preview renders with `calm-wellness` theme CSS variables

**When**:
- HTTP GET request to `/preview/1738123456789/premium-editorial` (same timestamp, different theme)

**Then**:
- Preview renders with `premium-editorial` theme CSS variables
- Blueprint structure remains identical
- Only CSS variables change

**Verification Method**: HTTP endpoint test with CSS variable comparison

---

## AC-011: Timestamp Collision Handling

**Test Scenario**: Detect and resolve timestamp collisions.

**Given**:
- MCP server is running

**When**:
- Two `generate-blueprint` calls occur within same millisecond

**Then**:
- First blueprint saves with timestamp `1738123456789`
- Second blueprint detects collision
- Second blueprint appends random 6-character suffix (e.g., `1738123456789abc123`)
- Both blueprints saved successfully
- No overwrites occur

**Verification Method**: Performance test with parallel requests

---

## AC-012: Theme Availability Check

**Test Scenario**: Provide helpful error messages for invalid themes.

**Given**:
- MCP server is running

**When**:
- `generate-blueprint` is called with invalid theme ID `invalid-theme`

**Then**:
- Response is:
  ```json
  {
    "success": false,
    "error": "Theme not found: invalid-theme. Available themes: calm-wellness, dynamic-fitness, korean-fintech, ..."
  }
  ```
- Error message includes complete list of 13 available themes

**Verification Method**: Unit test with invalid theme ID

---

## Quality Gates

### Test Coverage
- **Target**: ≥ 85% statement coverage
- **Measurement**: Vitest coverage report
- **Gate**: CI pipeline fails if coverage < 85%

### Performance
- **Blueprint Generation**: < 500ms per request
- **Theme Preview**: < 100ms per request
- **Preview URL Serving**: < 50ms per request
- **Measurement**: Performance test suite
- **Gate**: CI pipeline fails if any endpoint exceeds threshold

### Type Safety
- **Target**: Zero TypeScript compilation errors
- **Measurement**: `tsc --noEmit` in strict mode
- **Gate**: CI pipeline fails on type errors

### Security
- **Target**: Zero critical/high vulnerabilities
- **Measurement**: `npm audit`
- **Gate**: CI pipeline fails on critical vulnerabilities

### Integration
- **Target**: All 12 acceptance criteria pass
- **Measurement**: Integration test suite
- **Gate**: CI pipeline fails if any AC fails

---

## Definition of Done

Implementation is considered complete when:

1. ✅ All 12 acceptance criteria pass
2. ✅ Test coverage ≥ 85%
3. ✅ All performance thresholds met
4. ✅ Zero TypeScript errors in strict mode
5. ✅ Security audit passes
6. ✅ @tekton/core integration verified (no code duplication)
7. ✅ MCP tools accessible from Claude Code
8. ✅ Preview URLs render in SPEC-PLAYGROUND-001
9. ✅ Documentation complete (README, API reference)
10. ✅ Code review approved

---

## User Acceptance Scenarios

### Scenario 1: AI-Driven Blueprint Generation

**Given**:
- User opens Claude Code
- Tekton MCP server is running

**When**:
- User types: "Create a user dashboard with profile card and activity feed using calm-wellness theme"

**Then**:
- Claude Code invokes `generate-blueprint` MCP tool
- Blueprint is generated with Card components and sidebar layout
- Preview URL is returned
- User clicks preview URL and sees rendered dashboard

**Success Metric**: Complete workflow in < 10 seconds

---

### Scenario 2: Theme Quality Check

**Given**:
- User is exploring Tekton themes

**When**:
- User types: "Show me how premium-editorial theme looks"

**Then**:
- Claude Code invokes `preview-theme` MCP tool
- Theme CSS variables are displayed
- Preview URL is provided with sample components
- User compares with other themes using different preview URLs

**Success Metric**: Theme preview loads in < 2 seconds

---

### Scenario 3: Production Code Export

**Given**:
- User has generated a dashboard blueprint

**When**:
- User types: "Export the dashboard as TypeScript React component"

**Then**:
- Claude Code invokes `export-screen` MCP tool
- Generated `.tsx` file is created in project
- Code compiles without errors
- User integrates into production app

**Success Metric**: Exported code is production-ready without manual fixes

---

**Last Updated**: 2026-01-25
**Status**: Planned
**Related**: SPEC-MCP-002/spec.md, SPEC-MCP-002/plan.md
