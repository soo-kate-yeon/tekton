---
id: SPEC-MCP-002
title: "Tekton MCP Server v2.0.0 Implementation Plan"
version: "2.0.0"
created: "2026-01-25"
updated: "2026-01-25"
tags: ["SPEC-MCP-002", "Implementation", "Plan", "stdio", "Migration"]
---

# SPEC-MCP-002: Implementation Plan v2.0.0

## Overview

**Objective**: Migrate Tekton MCP Server from HTTP-based architecture (v1.0.0) to stdio-based MCP standard (v2.0.0) for native Claude Code integration.

**Approach**: Replace HTTP server with @modelcontextprotocol/sdk stdio transport while preserving 90% of existing tool logic, Zod schemas, and @tekton/core integration.

**Migration Type**: Architecture migration (HTTP → stdio), not incremental update

**Estimated Total Time**: 4-6 hours

---

## Code Reusability Analysis

### Reusable Code (90%)

| Component | File | Reusability | Notes |
|-----------|------|-------------|-------|
| Tool Logic | `src/tools/*.ts` | 100% | Core business logic unchanged |
| Zod Schemas | `src/schemas/*.ts` | 100% | Input validation schemas unchanged |
| @tekton/core Integration | Various | 100% | loadTheme, createBlueprint, render unchanged |
| Blueprint ID Generation | `src/utils/` | 100% | Timestamp + suffix logic unchanged |
| Theme Validation | `src/tools/` | 100% | Theme ID checking unchanged |
| Error Formatting | Partial | 80% | Adapt to JSON-RPC format |

### Rewrite Required (10%)

| Component | Old File | New File | Changes |
|-----------|----------|----------|---------|
| Server Entry | `src/server.ts` | `src/index.ts` | HTTP → stdio transport |
| Tool Registration | Express routes | MCP SDK handlers | JSON-RPC handlers |
| Logging | console.log | stderr logger | stdout → stderr |

### Code to Remove

| Component | File | Reason |
|-----------|------|--------|
| HTTP Server | `src/server.ts` | Replaced by stdio |
| Preview Routes | `src/web/preview-routes.ts` | Preview moved to SPEC-PLAYGROUND-001 |
| API Routes | `src/web/api-routes.ts` | No HTTP endpoints needed |
| Blueprint Storage | `src/storage/` | No file storage in MCP tools |
| Preview HTML Template | Various | No preview generation |

---

## Implementation Phases

### Phase 1: MCP SDK Setup and stdio Transport (30 min)

**Priority**: HIGH (Foundation)

**Objective**: Establish MCP SDK foundation with stdio transport.

**Tasks**:
1. Install @modelcontextprotocol/sdk@^1.0.0
2. Create `src/index.ts` with StdioServerTransport
3. Configure MCP Server with tool capabilities
4. Implement stderr-only logger utility
5. Add shebang and package.json bin entry

**Technical Implementation**:
```typescript
// src/index.ts
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  { name: 'tekton-mcp-server', version: '2.0.0' },
  { capabilities: { tools: {} } }
);

// Tool handlers registered here
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [/* tool definitions */]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Route to appropriate tool handler
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

**Success Criteria**:
- MCP server starts without errors
- stdio transport connects successfully
- Empty tool list returned on tools/list request

**Dependencies**: None

---

### Phase 2: Tool Handler Migration (1.5 hours)

**Priority**: HIGH (Core Functionality)

**Objective**: Migrate all 3 tool handlers to MCP SDK format.

**Tasks**:
1. Migrate `generate-blueprint` tool handler
   - Remove previewUrl from output
   - Return blueprint data only
2. Migrate `preview-theme` tool handler
   - Remove previewUrl from output
   - Return theme data with CSS variables only
3. Migrate `export-screen` tool handler
   - Remove file system writes
   - Remove filePath from output
   - Accept blueprint as input (not blueprintId)
   - Return code string only
4. Define tool schemas for MCP SDK
5. Implement JSON-RPC error responses

**Tool Definition Example**:
```typescript
// Tool list definition
{
  tools: [
    {
      name: 'generate-blueprint',
      description: 'Generate a UI blueprint from natural language description using @tekton/core',
      inputSchema: {
        type: 'object',
        properties: {
          description: { type: 'string', minLength: 10, maxLength: 500 },
          layout: { type: 'string', enum: ['single-column', 'two-column', 'sidebar-left', 'sidebar-right', 'dashboard', 'landing'] },
          themeId: { type: 'string', pattern: '^[a-z0-9-]+$' },
          componentHints: { type: 'array', items: { type: 'string' } }
        },
        required: ['description', 'layout', 'themeId']
      }
    },
    // ... other tools
  ]
}
```

**Handler Migration Example**:
```typescript
// Old HTTP handler
app.post('/tools/generate-blueprint', async (req, res) => {
  const result = await generateBlueprint(req.body);
  res.json({ ...result, previewUrl: `http://localhost:3000/preview/...` });
});

// New MCP handler
case 'generate-blueprint': {
  const result = await generateBlueprint(args);
  // No previewUrl - data only
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
}
```

**Success Criteria**:
- All 3 tools registered and listed
- generate-blueprint returns blueprint without previewUrl
- preview-theme returns theme data without previewUrl
- export-screen returns code string without file writes
- Zod validation works for all inputs

**Dependencies**: Phase 1

---

### Phase 3: HTTP Code Removal (30 min)

**Priority**: MEDIUM (Cleanup)

**Objective**: Remove all HTTP-related code and dependencies.

**Tasks**:
1. Delete `src/server.ts`
2. Delete `src/web/` directory
3. Delete `src/storage/` directory (no local storage needed)
4. Remove Express.js dependency from package.json
5. Remove CORS configuration
6. Update package.json scripts (remove start:http)
7. Clean up unused imports

**Files to Delete**:
```
src/
├── server.ts              # DELETE
├── web/
│   ├── preview-routes.ts  # DELETE
│   └── api-routes.ts      # DELETE
└── storage/
    ├── blueprint-storage.ts  # DELETE
    └── timestamp-manager.ts  # KEEP (for ID generation only)
```

**Package.json Changes**:
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "@tekton/core": "workspace:*",
    "zod": "^3.23.0"
    // REMOVE: "express", "cors"
  },
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "inspect": "npx @anthropic-ai/mcp-inspector node dist/index.js"
  },
  "bin": {
    "tekton-mcp": "./dist/index.js"
  }
}
```

**Success Criteria**:
- No HTTP-related code remains
- Build succeeds without Express
- Package size reduced

**Dependencies**: Phase 2

---

### Phase 4: Test Updates (1.5 hours)

**Priority**: HIGH (Quality Assurance)

**Objective**: Update test suite for stdio-based architecture.

**Tasks**:
1. Remove HTTP endpoint tests
2. Remove preview URL tests
3. Add stdio communication tests
4. Add JSON-RPC format tests
5. Add stderr logging verification tests
6. Update tool output assertions (no previewUrl, no filePath)
7. Add MCP Inspector-based integration tests

**New Test Structure**:
```
tests/
├── unit/
│   ├── tools/
│   │   ├── generate-blueprint.test.ts  # Updated: no previewUrl
│   │   ├── preview-theme.test.ts       # Updated: no previewUrl
│   │   └── export-screen.test.ts       # Updated: no filePath, no file writes
│   └── schemas/
│       └── mcp-schemas.test.ts         # Unchanged
├── integration/
│   ├── stdio-transport.test.ts         # NEW: stdio communication
│   ├── json-rpc-format.test.ts         # NEW: JSON-RPC compliance
│   └── tool-discovery.test.ts          # NEW: tools/list verification
└── e2e/
    └── claude-code-integration.test.ts  # NEW: end-to-end with Claude
```

**Test Example - stdio Communication**:
```typescript
import { spawn } from 'child_process';

describe('stdio transport', () => {
  it('should respond to tools/list request', async () => {
    const server = spawn('node', ['dist/index.js']);

    const request = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {}
    });

    server.stdin.write(request + '\n');

    const response = await readJsonRpcResponse(server.stdout);
    expect(response.result.tools).toHaveLength(3);
    expect(response.result.tools.map(t => t.name)).toEqual([
      'generate-blueprint',
      'preview-theme',
      'export-screen'
    ]);
  });
});
```

**Test Example - No stdout Pollution**:
```typescript
describe('logging', () => {
  it('should only write JSON-RPC to stdout', async () => {
    const server = spawn('node', ['dist/index.js']);
    const stdoutData: string[] = [];
    const stderrData: string[] = [];

    server.stdout.on('data', (data) => stdoutData.push(data.toString()));
    server.stderr.on('data', (data) => stderrData.push(data.toString()));

    // Send request and wait for response
    // ...

    // Verify stdout only contains valid JSON-RPC
    for (const line of stdoutData) {
      expect(() => JSON.parse(line)).not.toThrow();
      expect(JSON.parse(line)).toHaveProperty('jsonrpc', '2.0');
    }

    // Verify logs went to stderr
    expect(stderrData.some(line => line.includes('[INFO]'))).toBe(true);
  });
});
```

**Success Criteria**:
- Test coverage >= 85%
- All stdio communication tests pass
- All JSON-RPC format tests pass
- No HTTP-related tests remain

**Dependencies**: Phase 3

---

### Phase 5: MCP Inspector Validation (30 min)

**Priority**: HIGH (Verification)

**Objective**: Verify MCP protocol compliance using official MCP Inspector.

**Tasks**:
1. Install MCP Inspector: `npm install -D @anthropic-ai/mcp-inspector`
2. Add inspect script to package.json
3. Run inspector and verify tool discovery
4. Test each tool invocation through inspector
5. Verify error response format
6. Document any protocol issues

**Validation Checklist**:
- [ ] Server connects via stdio
- [ ] tools/list returns all 3 tools
- [ ] Tool schemas are valid JSON Schema
- [ ] generate-blueprint invocation succeeds
- [ ] preview-theme invocation succeeds
- [ ] export-screen invocation succeeds
- [ ] Invalid input returns proper error
- [ ] Error responses are JSON-RPC 2.0 compliant

**Success Criteria**:
- All MCP Inspector tests pass
- No protocol violations detected

**Dependencies**: Phase 4

---

### Phase 6: Claude Code Integration Test (1 hour)

**Priority**: HIGH (Final Validation)

**Objective**: Verify end-to-end integration with Claude Code.

**Tasks**:
1. Configure claude_desktop_config.json
2. Restart Claude Code to load MCP server
3. Verify tool discovery in Claude Code
4. Test natural language blueprint generation
5. Test theme preview workflow
6. Test code export workflow
7. Document user-facing workflow

**Claude Configuration**:
```json
{
  "mcpServers": {
    "tekton": {
      "command": "node",
      "args": ["/absolute/path/to/tekton/packages/mcp-server/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**Integration Test Scenarios**:
1. "Create a user dashboard with profile card using calm-wellness theme"
   - Verify generate-blueprint tool invoked
   - Verify blueprint returned without previewUrl
2. "Show me the premium-editorial theme"
   - Verify preview-theme tool invoked
   - Verify CSS variables returned
3. "Export that dashboard as TypeScript React"
   - Verify export-screen tool invoked
   - Verify code returned without file writes

**Success Criteria**:
- Tools appear in Claude Code tool list
- Natural language invokes correct tools
- All tool responses display correctly
- No Claude Code errors or warnings

**Dependencies**: Phase 5

---

## Technical Architecture

### New Module Structure

```
packages/mcp-server/
├── src/
│   ├── index.ts              # NEW: stdio entry point
│   ├── tools/
│   │   ├── index.ts          # Tool router
│   │   ├── generate-blueprint.ts  # Updated: no previewUrl
│   │   ├── preview-theme.ts      # Updated: no previewUrl
│   │   └── export-screen.ts      # Updated: no file writes
│   ├── schemas/
│   │   └── mcp-schemas.ts    # Zod schemas (unchanged)
│   ├── utils/
│   │   ├── logger.ts         # NEW: stderr-only logger
│   │   └── id-generator.ts   # Timestamp + suffix
│   └── types/
│       └── index.ts          # Type definitions
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
└── tsconfig.json
```

### Dependency Graph

```
index.ts (stdio entry point)
  ├─ @modelcontextprotocol/sdk (StdioServerTransport, Server)
  └─ tools/
      ├─ generate-blueprint.ts
      │   ├─ @tekton/core (createBlueprint, validateBlueprint)
      │   └─ schemas/mcp-schemas.ts (Zod)
      ├─ preview-theme.ts
      │   ├─ @tekton/core (loadTheme, generateCSSVariables)
      │   └─ schemas/mcp-schemas.ts (Zod)
      └─ export-screen.ts
          ├─ @tekton/core (render)
          └─ schemas/mcp-schemas.ts (Zod)
```

---

## Testing Strategy

### Unit Tests
- **Tool Logic**: Test each tool handler in isolation
- **Schema Validation**: Test Zod schemas with valid/invalid inputs
- **ID Generation**: Test timestamp collision handling
- **Logger**: Verify stderr-only output

### Integration Tests
- **stdio Transport**: Test JSON-RPC communication via stdin/stdout
- **Tool Discovery**: Test tools/list response format
- **Error Handling**: Test JSON-RPC error responses

### End-to-End Tests
- **MCP Inspector**: Protocol compliance verification
- **Claude Code**: Real-world integration testing

### Performance Tests
- **Tool Response Time**: < 500ms for all tools
- **Memory Usage**: Baseline memory footprint
- **Startup Time**: < 1 second to ready state

---

## Risk Mitigation

### stdio Debugging Risk
- **Mitigation**: Implement structured logger with log levels
- **Testing**: Use MCP Inspector for protocol debugging
- **Fallback**: Add --debug flag for verbose stderr logging

### Migration Regression Risk
- **Mitigation**: Comprehensive test coverage before migration
- **Testing**: Compare tool outputs before/after migration
- **Fallback**: Keep v1.0.0 branch for rollback if needed

### Claude Code Compatibility Risk
- **Mitigation**: Follow MCP SDK patterns exactly
- **Testing**: Test with multiple Claude Code versions
- **Fallback**: Document known compatibility issues

---

## Documentation Updates

### Files to Update
1. `README.md`: Update installation and usage for stdio
2. `CHANGELOG.md`: Document v2.0.0 breaking changes
3. `docs/mcp-integration.md`: Claude Code configuration guide
4. `docs/migration-v1-v2.md`: Migration guide for HTTP→stdio

### Breaking Changes to Document
- HTTP endpoints removed (no REST API)
- Preview URLs removed (use SPEC-PLAYGROUND-001)
- export-screen no longer writes files
- blueprintId replaced with inline blueprint object

---

## Deployment Considerations

### Development Mode
- Run with `npm run inspect` for MCP Inspector
- Debug logs to stderr with DEBUG=tekton-mcp

### Production Mode
- Configure in claude_desktop_config.json
- No port binding (stdio only)
- Log aggregation via stderr redirection

### CI/CD Pipeline
1. Build: `npm run build`
2. Test: `npm run test`
3. Inspect: `npm run inspect` (manual verification)
4. Package: Create distribution bundle

---

## Timeline Summary

| Phase | Duration | Priority | Dependencies |
|-------|----------|----------|--------------|
| Phase 1: MCP SDK Setup | 30 min | HIGH | None |
| Phase 2: Tool Migration | 1.5 hours | HIGH | Phase 1 |
| Phase 3: HTTP Removal | 30 min | MEDIUM | Phase 2 |
| Phase 4: Test Updates | 1.5 hours | HIGH | Phase 3 |
| Phase 5: MCP Inspector | 30 min | HIGH | Phase 4 |
| Phase 6: Claude Integration | 1 hour | HIGH | Phase 5 |
| **Total** | **5.5 hours** | - | - |

---

## Next Steps

1. **Start Phase 1**: Install MCP SDK and create stdio entry point
2. **Preserve v1.0.0**: Create git tag for rollback capability
3. **Migrate incrementally**: One tool at a time with tests
4. **Validate continuously**: Run MCP Inspector after each phase

**Implementation Branch**: `feature/SPEC-MCP-002` (current)
**Base Branch**: `master`

---

**Last Updated**: 2026-01-25
**Status**: Planned
**Version**: 2.0.0
**Ready for**: /moai:2-run SPEC-MCP-002
