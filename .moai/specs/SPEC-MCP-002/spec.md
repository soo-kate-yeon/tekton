---
id: SPEC-MCP-002
version: "1.0.0"
status: "planned"
created: "2026-01-25"
author: "MoAI-ADK"
priority: "HIGH"
lifecycle: "spec-anchored"
tags: ["SPEC-MCP-002", "MCP", "Blueprint", "Preview", "Timestamp"]
---

## HISTORY
- 2026-01-25 v1.0.0: Initial SPEC creation - Tekton MCP Server with Timestamp-Based Preview System

---

# SPEC-MCP-002: Tekton MCP Server with Timestamp-Based Preview System

## Executive Summary

**Purpose**: Extend Tekton MCP Server with Claude Code integration, enabling AI-driven blueprint generation, theme preview, and timestamp-based screen history management. Provides MCP Protocol tools for blueprint creation, theme switching, and immutable preview URL generation.

**Scope**: Add MCP Tools (generate-blueprint, preview-theme, export-screen) to existing @tekton/core pipeline. Implement web server with timestamp-based preview URLs (`/preview/:timestamp/:themeId`) for immutable screen history and real-time theme switching.

**Priority**: HIGH - Enables Google Stitch-like workflow with superior OKLCH-based theme system and type-safe blueprint validation.

**Impact**: Transforms Tekton from local token generator to Claude Code-native MCP service. Users generate production-ready screens through natural language prompts with instant visual feedback and theme quality checks.

**Differentiators vs Google Stitch**:
- **OKLCH Color System**: Perceptually uniform color transformations vs RGB approximations
- **Type-Safe Blueprints**: Zod schema validation prevents invalid component combinations
- **Immutable History**: Timestamp-based URLs preserve all design iterations
- **Claude Code Native**: MCP Protocol integration for seamless AI workflow
- **13 Built-in Themes**: Production-ready themes vs manual configuration

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
- **MCP Protocol**: Model Context Protocol for AI assistant integration
- **Core Pipeline**: @tekton/core (Theme → Blueprint → Screen)
- **Schema Validation**: Zod 3.23+ for type-safe data validation
- **Web Server**: Node.js HTTP server or Express.js (TBD)
- **Color System**: OKLCH with CSS `oklch()` function support

**Integration Requirements:**
- **Claude Code**: MCP Protocol tool registration and invocation
- **@tekton/core**: Reuse existing theme loading, blueprint creation, and render functions
- **SPEC-PLAYGROUND-001**: Serve preview URLs to Next.js playground

---

## ASSUMPTIONS

### Technical Assumptions

**A-001: MCP Protocol Compatibility**
- **Assumption**: Claude Code supports MCP Protocol with tool registration and JSON-RPC invocation
- **Confidence**: HIGH
- **Evidence**: MCP Protocol is standard for AI assistant integration (confirmed in SPEC-MCP-001)
- **Risk if Wrong**: Cannot integrate with Claude Code, manual API calls required
- **Validation**: MCP Protocol specification review, Claude Code integration testing

**A-002: Timestamp Uniqueness**
- **Assumption**: Timestamp-based preview URLs (`/preview/:timestamp/:themeId`) provide sufficient uniqueness for parallel screen generation
- **Confidence**: HIGH
- **Evidence**: `Date.now()` provides millisecond precision, collision probability < 0.001% for typical usage
- **Risk if Wrong**: Preview URL collisions overwrite previous screens
- **Validation**: Timestamp generation tests with collision detection, add random suffix if needed

**A-003: Theme Switching Performance**
- **Assumption**: CSS variable-based theme switching achieves < 100ms update time for smooth UX
- **Confidence**: MEDIUM
- **Evidence**: CSS variable updates trigger browser reflow but avoid full re-render
- **Risk if Wrong**: Slow theme switching degrades user experience
- **Validation**: Performance benchmarking with Chrome DevTools, optimize CSS variable scope

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

**A-006: Timestamp History Usefulness**
- **Assumption**: Immutable timestamp-based preview history enables design iteration tracking and comparison
- **Confidence**: MEDIUM
- **Evidence**: Version control for design decisions is valuable for collaboration
- **Risk if Wrong**: History grows indefinitely, storage overhead increases
- **Validation**: User feedback, implement TTL-based cleanup after 30 days

### Integration Assumptions

**A-007: SPEC-PLAYGROUND-001 Compatibility**
- **Assumption**: React playground consumes preview URLs and renders screens with correct theme application
- **Confidence**: HIGH
- **Evidence**: SPEC-PLAYGROUND-001 designed for MCP server integration
- **Risk if Wrong**: Preview rendering fails, theme variables not applied
- **Validation**: Cross-SPEC integration tests, end-to-end workflow validation

---

## REQUIREMENTS

### Ubiquitous Requirements (Always Active)

**U-001: MCP Tool Registration**
- The system **shall** register all MCP tools (generate-blueprint, preview-theme, export-screen) with Claude Code for AI assistant discovery and invocation.
- **Rationale**: Tool visibility enables natural language blueprint generation workflow.
- **Test Strategy**: MCP Protocol tool list verification, Claude Code integration test.

**U-002: Input Schema Validation**
- The system **shall** validate all MCP tool inputs using Zod schemas before execution to prevent runtime errors and provide clear error messages.
- **Rationale**: Type-safe input validation ensures blueprint integrity and prevents invalid component combinations.
- **Test Strategy**: Schema validation tests with valid and invalid inputs, error message clarity verification.

**U-003: @tekton/core Integration**
- The system **shall** reuse @tekton/core functions (loadTheme, createBlueprint, renderScreen) without duplication to maintain single source of truth.
- **Rationale**: Code reuse prevents drift between core pipeline and MCP server logic.
- **Test Strategy**: Integration tests verifying @tekton/core function calls, no duplicate logic.

**U-004: Error Response Consistency**
- The system **shall** return standardized error responses with `{ success: false, error: string }` format for all MCP tool failures.
- **Rationale**: Consistent error format enables AI assistant error handling and user feedback.
- **Test Strategy**: Error response format validation across all tools, error message actionability check.

**U-005: Theme Validation**
- The system **shall** validate theme IDs against 13 built-in themes before blueprint generation and return error for invalid theme IDs.
- **Rationale**: Invalid theme IDs cause render failures, early validation prevents downstream errors.
- **Test Strategy**: Theme ID validation tests with valid and invalid IDs, error message clarity.

### Event-Driven Requirements (Trigger-Response)

**E-001: Blueprint Generation Request**
- **WHEN** `generate-blueprint` tool invoked with natural language description, layout type, and theme ID **THEN** generate valid Blueprint JSON with timestamp, component nodes, and preview URL.
- **Rationale**: Single MCP tool call creates complete blueprint ready for rendering.
- **Test Strategy**: Blueprint generation tests with various descriptions and layouts, output validation.

**E-002: Theme Preview Request**
- **WHEN** `preview-theme` tool invoked with theme ID **THEN** return preview URL with current timestamp and theme CSS variables.
- **Rationale**: Theme preview enables quality check before blueprint generation.
- **Test Strategy**: Preview URL generation tests, CSS variable extraction verification.

**E-003: Screen Export Request**
- **WHEN** `export-screen` tool invoked with blueprint ID and format (jsx, tsx, vue) **THEN** return generated code and save to timestamp-based file path.
- **Rationale**: Screen export enables production code integration from AI-generated blueprints.
- **Test Strategy**: Code export tests with multiple formats, file path validation, code quality check.

**E-004: Preview URL Access**
- **WHEN** HTTP GET request to `/preview/:timestamp/:themeId` **THEN** serve HTML page with theme CSS variables and blueprint rendering instructions for SPEC-PLAYGROUND-001.
- **Rationale**: Preview URL provides immutable access to generated screens with applied theme.
- **Test Strategy**: HTTP endpoint tests, theme variable injection verification, CORS configuration.

**E-005: Real-Time Theme Switch**
- **WHEN** theme ID parameter changes in preview URL **THEN** reload page with new theme CSS variables without regenerating blueprint.
- **Rationale**: Theme switching enables design system quality comparison without recreating screens.
- **Test Strategy**: Theme switch tests, CSS variable update verification, layout preservation check.

### State-Driven Requirements (Conditional Behavior)

**S-001: Timestamp Collision Handling**
- **IF** timestamp collision detected (same millisecond) **THEN** append random 6-character suffix to ensure uniqueness.
- **Rationale**: Parallel screen generation may produce identical timestamps, suffix prevents overwrites.
- **Test Strategy**: Collision detection tests, suffix uniqueness verification.

**S-002: Theme Availability Check**
- **IF** requested theme ID exists in built-in themes **THEN** load theme and generate blueprint.
- **IF** requested theme ID not found **THEN** return error with available theme list.
- **Rationale**: Clear error messages with alternatives improve user experience.
- **Test Strategy**: Theme availability tests with valid and invalid IDs, error message verification.

**S-003: Blueprint Validation Result**
- **IF** generated blueprint passes validation **THEN** save blueprint and return preview URL.
- **IF** generated blueprint fails validation **THEN** return validation errors without saving.
- **Rationale**: Invalid blueprints should not persist, preventing broken preview URLs.
- **Test Strategy**: Blueprint validation tests with valid and invalid structures, error clarity.

**S-004: Export Format Compatibility**
- **IF** export format is `tsx` **THEN** include TypeScript type annotations in generated code.
- **IF** export format is `jsx` **THEN** generate vanilla React without TypeScript.
- **IF** export format is `vue` **THEN** generate Vue 3 Composition API syntax.
- **Rationale**: Framework-specific exports enable integration with diverse tech stacks.
- **Test Strategy**: Format-specific generation tests, syntax validation for each format.

### Unwanted Behaviors (Prohibited Actions)

**UW-001: No Blueprint Mutation**
- The system **shall not** modify blueprints after creation to preserve timestamp-based immutability.
- **Rationale**: Immutable blueprints enable design iteration tracking and comparison.
- **Test Strategy**: Blueprint modification tests, immutability verification.

**UW-002: No Theme ID Injection**
- The system **shall not** allow theme ID injection attacks through path parameters to prevent unauthorized theme access.
- **Rationale**: Security requirement prevents malicious theme loading or path traversal.
- **Test Strategy**: Security tests with malicious inputs (e.g., `../../../etc/passwd`), input sanitization verification.

**UW-003: No Silent Failures**
- The system **shall not** return success status when blueprint generation or rendering fails.
- **Rationale**: Accurate status enables AI assistant error recovery and user feedback.
- **Test Strategy**: Failure mode tests with comprehensive error verification.

**UW-004: No Duplicate Tool Registration**
- The system **shall not** register multiple tools with same name to prevent Claude Code invocation conflicts.
- **Rationale**: Tool name uniqueness ensures predictable AI assistant behavior.
- **Test Strategy**: Tool registration tests, duplicate name detection.

### Optional Requirements (Future Enhancements)

**O-001: WebSocket Real-Time Updates**
- **Where possible**, provide WebSocket connection for real-time theme switching without page reload.
- **Priority**: DEFERRED to Phase 2
- **Rationale**: WebSocket enables smoother theme switching UX, but HTTP polling acceptable for MVP.

**O-002: Blueprint Template Library**
- **Where possible**, provide pre-built blueprint templates (dashboard, landing, settings) for common screen patterns.
- **Priority**: DEFERRED to Phase 2
- **Rationale**: Templates accelerate screen generation, but AI-driven generation sufficient for MVP.

**O-003: Multi-Theme Preview Comparison**
- **Where possible**, enable side-by-side preview with 2-3 themes for visual comparison.
- **Priority**: DEFERRED to Phase 2
- **Rationale**: Visual comparison aids theme selection, but sequential switching acceptable for MVP.

---

## SPECIFICATIONS

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
    id: string,
    name: string,
    themeId: string,
    layout: LayoutType,
    components: ComponentNode[],
    timestamp: number
  },
  previewUrl?: string,
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
  },
  "previewUrl": "http://localhost:3000/preview/1738123456789/calm-wellness"
}
```

#### preview-theme

**Purpose**: Generate preview URL for theme quality check.

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
  previewUrl?: string,
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
  },
  "previewUrl": "http://localhost:3000/preview/1738123456790/premium-editorial"
}
```

#### export-screen

**Purpose**: Export generated screen to production code.

**Input Schema (Zod)**:
```typescript
{
  blueprintId: z.string(),
  format: z.enum(['jsx', 'tsx', 'vue']),
  outputPath?: z.string().optional()
}
```

**Output Schema**:
```typescript
{
  success: boolean,
  code?: string,
  filePath?: string,
  error?: string
}
```

**Example Request**:
```json
{
  "blueprintId": "bp-1738123456789-abc123",
  "format": "tsx",
  "outputPath": "src/screens/user-profile.tsx"
}
```

**Example Response**:
```json
{
  "success": true,
  "code": "export default function UserProfile() {\n  return (\n    <div className=\"container\">\n      <Card>\n        <Avatar size=\"large\" />\n        <Text>User bio content</Text>\n      </Card>\n    </div>\n  );\n}",
  "filePath": "src/screens/user-profile.tsx"
}
```

### Web Server Endpoints

#### GET /preview/:timestamp/:themeId

**Purpose**: Serve preview page with theme CSS variables for SPEC-PLAYGROUND-001.

**Response**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tekton Preview - {{ themeId }}</title>
  <style>
    :root {
      {{ cssVariables }}
    }
  </style>
</head>
<body>
  <div id="root" data-timestamp="{{ timestamp }}" data-theme-id="{{ themeId }}"></div>
  <script>
    window.__TEKTON_PREVIEW__ = {
      timestamp: {{ timestamp }},
      themeId: "{{ themeId }}",
      blueprintUrl: "/api/blueprints/{{ timestamp }}"
    };
  </script>
</body>
</html>
```

#### GET /api/blueprints/:timestamp

**Purpose**: Fetch blueprint JSON for rendering in playground.

**Response**:
```json
{
  "success": true,
  "blueprint": {
    "id": "bp-1738123456789-abc123",
    "name": "User Profile Dashboard",
    "themeId": "calm-wellness",
    "layout": "sidebar-left",
    "components": [...],
    "timestamp": 1738123456789
  }
}
```

#### GET /api/themes

**Purpose**: List all available themes for theme selection UI.

**Response**:
```json
{
  "success": true,
  "themes": [
    { "id": "calm-wellness", "name": "Calm Wellness", "description": "..." },
    { "id": "dynamic-fitness", "name": "Dynamic Fitness", "description": "..." },
    ...
  ]
}
```

### File Storage Structure

```
.tekton/
├── blueprints/
│   ├── 1738123456789/
│   │   ├── blueprint.json
│   │   ├── metadata.json
│   │   └── preview.html
│   ├── 1738123456790/
│   │   └── ...
│   └── index.json  # Timestamp index
└── exports/
    ├── user-profile.tsx
    ├── dashboard.tsx
    └── ...
```

---

## TRACEABILITY

### Requirements to Test Scenarios Mapping

| Requirement ID | Test Scenario ID | Component |
|----------------|------------------|-----------|
| U-001 | AC-001 | MCP tool registration |
| U-002 | AC-002 | Input schema validation |
| U-003 | AC-003 | @tekton/core integration |
| U-004 | AC-004 | Error response consistency |
| U-005 | AC-005 | Theme validation |
| E-001 | AC-006 | Blueprint generation |
| E-002 | AC-007 | Theme preview |
| E-003 | AC-008 | Screen export |
| E-004 | AC-009 | Preview URL access |
| E-005 | AC-010 | Real-time theme switch |
| S-001 | AC-011 | Timestamp collision handling |
| S-002 | AC-012 | Theme availability check |

### SPEC-to-Implementation Tags

- **[SPEC-MCP-002]**: All commits related to MCP server implementation
- **[MCP-TOOLS]**: MCP tool implementations (generate-blueprint, preview-theme, export-screen)
- **[MCP-SERVER]**: Web server and HTTP endpoints
- **[MCP-STORAGE]**: Blueprint storage and timestamp management
- **[MCP-INTEGRATION]**: @tekton/core integration and SPEC-PLAYGROUND-001 compatibility

---

## DEPENDENCIES

### Internal Dependencies
- **@tekton/core**: Theme loading, blueprint creation, screen rendering
- **SPEC-PLAYGROUND-001**: React playground for preview rendering

### External Dependencies
- **Zod**: Schema validation (^3.23.0)
- **MCP Protocol**: Model Context Protocol for Claude Code integration
- **Node.js HTTP/Express**: Web server framework
- **TypeScript**: Type safety (^5.7.0)

### Technical Dependencies
- **Node.js**: 20+ runtime
- **TypeScript**: 5.7+ compiler
- **Claude Code**: MCP Protocol support

---

## RISK ANALYSIS

### High-Risk Areas

**Risk 1: Timestamp Collision**
- **Likelihood**: LOW
- **Impact**: MEDIUM
- **Mitigation**: Add random suffix when collision detected, millisecond precision sufficient for typical usage
- **Contingency**: Implement retry with exponential backoff

**Risk 2: @tekton/core API Changes**
- **Likelihood**: LOW
- **Impact**: HIGH
- **Mitigation**: Version pinning, integration tests, semantic versioning
- **Contingency**: Implement adapter layer for API changes

**Risk 3: MCP Protocol Compatibility**
- **Likelihood**: MEDIUM
- **Impact**: HIGH
- **Mitigation**: Follow MCP Protocol specification strictly, integration testing with Claude Code
- **Contingency**: Fallback to REST API if MCP incompatible

### Medium-Risk Areas

**Risk 4: Theme Switching Performance**
- **Likelihood**: MEDIUM
- **Impact**: MEDIUM
- **Mitigation**: CSS variable optimization, performance benchmarking
- **Contingency**: Implement debouncing, reduce CSS variable scope

**Risk 5: Blueprint Storage Growth**
- **Likelihood**: HIGH
- **Impact**: LOW
- **Mitigation**: Implement 30-day TTL cleanup, storage limit warnings
- **Contingency**: S3/cloud storage migration for large-scale usage

---

## SUCCESS CRITERIA

### Implementation Success Criteria
- All 3 MCP tools registered and functional in Claude Code
- Preview URLs generated with unique timestamps (< 0.001% collision rate)
- Theme switching completes in < 100ms (CSS variable update)
- @tekton/core integration works without code duplication
- Blueprint validation prevents invalid component combinations

### Quality Success Criteria
- Test coverage ≥ 85% for all new code
- All MCP tool invocations complete in < 500ms
- Error messages are actionable and include available alternatives
- Zero TypeScript compilation errors with strict mode
- Security audit passes with no critical vulnerabilities

### Integration Success Criteria
- MCP tools accessible from Claude Code with natural language prompts
- Preview URLs render correctly in SPEC-PLAYGROUND-001
- Theme CSS variables applied without layout shifts
- Exported code compiles without errors in target framework

---

## REFERENCES

- [SPEC-PLAYGROUND-001: React Playground](../SPEC-PLAYGROUND-001/spec.md)
- [SPEC-MCP-001: Natural Language Screen Generation](../SPEC-MCP-001/spec.md)
- [@tekton/core Package](../../packages/core/)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [TRUST 5 Framework](../../.claude/skills/moai-foundation-core/modules/trust-5-framework.md)

---

**Last Updated**: 2026-01-25
**Status**: Planned
**Next Steps**: /moai:2-run SPEC-MCP-002 for DDD implementation
