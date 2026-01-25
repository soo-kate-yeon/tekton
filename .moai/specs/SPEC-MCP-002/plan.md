---
id: SPEC-MCP-002
title: "Tekton MCP Server Implementation Plan"
created: "2026-01-25"
tags: ["SPEC-MCP-002", "Implementation", "Plan"]
---

# SPEC-MCP-002: Implementation Plan

## Overview

**Objective**: Implement Tekton MCP Server with Claude Code integration, timestamp-based preview system, and @tekton/core pipeline integration.

**Approach**: Modular architecture separating MCP protocol layer, business logic layer, and storage layer. Reuse @tekton/core functions for theme and blueprint operations.

**Estimated Complexity**: Medium - MCP Protocol integration is straightforward, timestamp management and preview URL generation are well-defined patterns.

---

## Implementation Milestones

### Milestone 1: MCP Protocol Foundation

**Priority**: HIGH (Primary Goal)

**Objective**: Establish MCP Protocol server with tool registration and JSON-RPC handling.

**Tasks**:
1. Set up MCP Protocol server boilerplate (Node.js HTTP server or Express.js)
2. Implement tool registration endpoint (`/tools`)
3. Define Zod schemas for all 3 MCP tools (generate-blueprint, preview-theme, export-screen)
4. Implement JSON-RPC request/response handling
5. Add CORS configuration for Claude Code access
6. Create error handling middleware for consistent error responses

**Dependencies**: None

**Success Criteria**:
- MCP tool list endpoint returns all 3 tools with correct schemas
- JSON-RPC invocation works for dummy tool implementations
- CORS headers allow Claude Code origin
- Error responses follow `{ success: false, error: string }` format

**Test Coverage**: ≥ 85% for protocol layer

---

### Milestone 2: Blueprint Generation Tool

**Priority**: HIGH (Primary Goal)

**Objective**: Implement `generate-blueprint` MCP tool with @tekton/core integration.

**Tasks**:
1. Integrate @tekton/core's `createBlueprint` function
2. Implement natural language description parsing (initial: simple keyword extraction)
3. Map component hints to @tekton/core's COMPONENT_CATALOG
4. Generate timestamp-based blueprint ID
5. Validate blueprint structure using @tekton/core's `validateBlueprint`
6. Save blueprint to `.tekton/blueprints/:timestamp/` directory
7. Generate preview URL with timestamp and theme ID

**Dependencies**: Milestone 1 (MCP Protocol Foundation)

**Technical Approach**:
```typescript
import { createBlueprint, validateBlueprint } from '@tekton/core';

async function generateBlueprintTool(input: GenerateBlueprintInput) {
  // 1. Parse description and map to components
  const components = parseDescription(input.description, input.componentHints);

  // 2. Create blueprint using @tekton/core
  const blueprint = createBlueprint({
    name: extractName(input.description),
    themeId: input.themeId,
    layout: input.layout,
    components
  });

  // 3. Validate blueprint
  const validation = validateBlueprint(blueprint);
  if (!validation.valid) {
    return { success: false, error: validation.errors.join(', ') };
  }

  // 4. Save to storage
  const timestamp = Date.now();
  await saveBlueprintToStorage(blueprint, timestamp);

  // 5. Generate preview URL
  const previewUrl = `http://localhost:3000/preview/${timestamp}/${input.themeId}`;

  return { success: true, blueprint, previewUrl };
}
```

**Success Criteria**:
- Valid blueprints generated from natural language descriptions
- Blueprint validation catches invalid component combinations
- Timestamp-based storage works correctly
- Preview URLs follow correct format

**Test Coverage**: ≥ 85% for blueprint generation logic

---

### Milestone 3: Theme Preview and Export Tools

**Priority**: HIGH (Primary Goal)

**Objective**: Implement `preview-theme` and `export-screen` MCP tools.

**Tasks**:
1. Implement `preview-theme` tool:
   - Load theme using @tekton/core's `loadTheme`
   - Extract CSS variables using `generateCSSVariables`
   - Generate preview URL with timestamp
2. Implement `export-screen` tool:
   - Load blueprint from storage
   - Generate code using @tekton/core's render function
   - Support JSX, TSX, Vue formats
   - Save to optional outputPath or return code string

**Dependencies**: Milestone 2 (Blueprint Generation Tool)

**Technical Approach**:
```typescript
import { loadTheme, generateCSSVariables } from '@tekton/core';

async function previewThemeTool(input: PreviewThemeInput) {
  const theme = loadTheme(input.themeId);
  if (!theme) {
    return { success: false, error: `Theme not found: ${input.themeId}` };
  }

  const cssVariables = generateCSSVariables(theme);
  const timestamp = Date.now();
  const previewUrl = `http://localhost:3000/preview/${timestamp}/${input.themeId}`;

  return {
    success: true,
    theme: { id: theme.id, name: theme.name, description: theme.description, cssVariables },
    previewUrl
  };
}
```

**Success Criteria**:
- Theme preview loads all 13 built-in themes correctly
- CSS variables extracted match @tekton/core format
- Screen export generates valid React/Vue code
- Code compiles without errors in target framework

**Test Coverage**: ≥ 85% for preview and export logic

---

### Milestone 4: Preview Web Server

**Priority**: HIGH (Secondary Goal)

**Objective**: Implement HTTP endpoints for preview URL serving and blueprint retrieval.

**Tasks**:
1. Implement `GET /preview/:timestamp/:themeId` endpoint:
   - Load theme CSS variables
   - Render HTML template with theme variables
   - Include blueprint URL in `window.__TEKTON_PREVIEW__` global
2. Implement `GET /api/blueprints/:timestamp` endpoint:
   - Load blueprint from storage
   - Return blueprint JSON
3. Implement `GET /api/themes` endpoint:
   - List all available themes
   - Return theme metadata
4. Add static file serving for preview assets (optional)

**Dependencies**: Milestone 3 (Preview and Export Tools)

**Technical Approach**:
```typescript
app.get('/preview/:timestamp/:themeId', async (req, res) => {
  const { timestamp, themeId } = req.params;

  // Load theme
  const theme = loadTheme(themeId);
  if (!theme) {
    return res.status(404).send('Theme not found');
  }

  // Generate CSS variables
  const cssVariables = generateCSSVariables(theme);
  const cssString = Object.entries(cssVariables)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');

  // Render HTML
  const html = `<!DOCTYPE html>
<html>
<head>
  <style>:root { ${cssString} }</style>
</head>
<body>
  <div id="root" data-timestamp="${timestamp}" data-theme-id="${themeId}"></div>
  <script>
    window.__TEKTON_PREVIEW__ = {
      timestamp: ${timestamp},
      themeId: "${themeId}",
      blueprintUrl: "/api/blueprints/${timestamp}"
    };
  </script>
</body>
</html>`;

  res.send(html);
});
```

**Success Criteria**:
- Preview URLs render HTML with correct CSS variables
- Blueprint API returns saved blueprint JSON
- Theme API lists all 13 built-in themes
- CORS headers allow playground access

**Test Coverage**: ≥ 85% for HTTP endpoints

---

### Milestone 5: Storage and Timestamp Management

**Priority**: MEDIUM (Secondary Goal)

**Objective**: Implement robust blueprint storage with collision detection and cleanup.

**Tasks**:
1. Create `.tekton/blueprints/` directory structure
2. Implement timestamp collision detection (< 0.001% probability)
3. Add random 6-character suffix when collision detected
4. Implement blueprint index for fast lookup (`index.json`)
5. Add TTL-based cleanup (30 days, configurable)
6. Implement storage health check endpoint

**Dependencies**: Milestone 2 (Blueprint Generation)

**Technical Approach**:
```typescript
async function saveBlueprintToStorage(blueprint: Blueprint, timestamp: number) {
  const baseDir = `.tekton/blueprints/${timestamp}`;

  // Check for collision
  if (fs.existsSync(baseDir)) {
    const suffix = generateRandomSuffix(6);
    timestamp = parseInt(`${timestamp}${suffix}`);
  }

  const dir = `.tekton/blueprints/${timestamp}`;
  fs.mkdirSync(dir, { recursive: true });

  // Save blueprint
  fs.writeFileSync(`${dir}/blueprint.json`, JSON.stringify(blueprint, null, 2));

  // Save metadata
  const metadata = {
    timestamp,
    themeId: blueprint.themeId,
    createdAt: new Date().toISOString(),
    ttl: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  };
  fs.writeFileSync(`${dir}/metadata.json`, JSON.stringify(metadata, null, 2));

  // Update index
  await updateBlueprintIndex(timestamp, metadata);
}
```

**Success Criteria**:
- Timestamp collision detection works correctly
- Blueprints saved with metadata and indexed
- Cleanup removes blueprints older than 30 days
- Storage health check detects corruption

**Test Coverage**: ≥ 85% for storage layer

---

### Milestone 6: SPEC-PLAYGROUND-001 Integration

**Priority**: MEDIUM (Final Goal)

**Objective**: Ensure seamless integration with React playground for preview rendering.

**Tasks**:
1. Coordinate with SPEC-PLAYGROUND-001 for preview URL format
2. Test preview URL rendering in playground
3. Verify theme CSS variables applied correctly
4. Test theme switching without blueprint regeneration
5. Validate blueprint JSON structure compatibility
6. Add integration tests for end-to-end workflow

**Dependencies**: Milestone 4 (Preview Web Server), SPEC-PLAYGROUND-001 completion

**Success Criteria**:
- Preview URLs render correctly in playground
- Theme switching works without page reload (if playground supports)
- Blueprint JSON parsed and rendered correctly
- CSS variables applied to all components

**Test Coverage**: ≥ 80% for integration scenarios

---

## Technical Architecture

### Module Structure

```
packages/mcp-server/
├── src/
│   ├── server.ts           # MCP Protocol server
│   ├── tools/
│   │   ├── generate-blueprint.ts
│   │   ├── preview-theme.ts
│   │   └── export-screen.ts
│   ├── storage/
│   │   ├── blueprint-storage.ts
│   │   └── timestamp-manager.ts
│   ├── web/
│   │   ├── preview-routes.ts
│   │   └── api-routes.ts
│   ├── schemas/
│   │   └── mcp-schemas.ts  # Zod schemas
│   └── utils/
│       ├── description-parser.ts
│       └── error-handler.ts
├── tests/
│   ├── tools/
│   ├── storage/
│   └── integration/
└── package.json
```

### Dependency Graph

```
server.ts
  ├─ tools/
  │   ├─ generate-blueprint.ts → @tekton/core (createBlueprint, validateBlueprint)
  │   ├─ preview-theme.ts → @tekton/core (loadTheme, generateCSSVariables)
  │   └─ export-screen.ts → @tekton/core (render)
  ├─ storage/
  │   ├─ blueprint-storage.ts → fs, timestamp-manager
  │   └─ timestamp-manager.ts → crypto (random suffix)
  └─ web/
      ├─ preview-routes.ts → @tekton/core (loadTheme, generateCSSVariables)
      └─ api-routes.ts → blueprint-storage
```

---

## Testing Strategy

### Unit Tests
- **MCP Tool Schema Validation**: Test all input schemas with valid and invalid data
- **Blueprint Generation**: Test description parsing, component mapping, validation
- **Theme Loading**: Test all 13 built-in themes load correctly
- **Storage Operations**: Test save, load, collision detection, cleanup
- **CSS Variable Generation**: Test CSS variable extraction for all themes

### Integration Tests
- **End-to-End MCP Workflow**: Claude Code invocation → Blueprint generation → Preview URL serving
- **@tekton/core Integration**: Verify no code duplication, correct function usage
- **SPEC-PLAYGROUND-001 Integration**: Preview URL rendering, theme switching

### Performance Tests
- **Blueprint Generation**: < 500ms for typical description
- **Theme Preview**: < 100ms for CSS variable extraction
- **Storage Operations**: < 50ms for save/load

---

## Risk Mitigation

### Timestamp Collision Risk
- **Mitigation**: Collision detection with random suffix
- **Testing**: Parallel generation tests, collision rate measurement

### @tekton/core API Changes
- **Mitigation**: Version pinning, integration tests
- **Contingency**: Adapter layer for API changes

### MCP Protocol Incompatibility
- **Mitigation**: Follow MCP Protocol spec strictly
- **Contingency**: Fallback to REST API if needed

---

## Deployment Considerations

### Development Mode
- Local HTTP server on `localhost:3000`
- File-based blueprint storage (`.tekton/blueprints/`)
- No authentication required

### Production Mode (Future)
- HTTPS with SSL certificate
- S3/cloud storage for blueprints
- API key authentication for MCP tools
- Rate limiting and DDoS protection

---

## Next Steps

1. **Create package structure**: `packages/mcp-server/` with TypeScript configuration
2. **Set up dependencies**: Install Zod, Express.js, MCP Protocol library
3. **Implement Milestone 1**: MCP Protocol foundation
4. **Test with Claude Code**: Verify tool registration and invocation
5. **Implement Milestones 2-6**: Iterate through implementation plan

**Implementation Branch**: `feature/SPEC-MCP-002`

---

**Last Updated**: 2026-01-25
**Status**: Planned
**Ready for**: /moai:2-run SPEC-MCP-002
