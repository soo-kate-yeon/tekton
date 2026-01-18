---
id: SPEC-MCP-STANDALONE-001
document: plan
version: "1.0.0"
created: "2026-01-18"
---

# Implementation Plan: Phase 1 Standalone MCP Completion

## Overview

This plan outlines the implementation strategy for transforming studio-mcp into an environment-independent npm package that can be run via `npx @tekton/mcp-server` without requiring studio-api or database infrastructure.

---

## Milestone Structure

### Milestone 1: Built-in Preset Bundling (Primary Goal)

**Objective**: Create and bundle 7 built-in presets as JSON files within the MCP package.

**Tasks**:

1. **Create Preset JSON Files** [MCP-PRESET]
   - Create `src/preset/presets/` directory structure
   - Copy existing `next-tailwind-shadcn.json` as base template
   - Create 6 additional preset JSON files:
     - next-tailwind-radix.json
     - vite-tailwind-shadcn.json
     - next-styled-components.json
     - saas-dashboard.json
     - tech-startup.json
     - premium-editorial.json
   - Validate all presets against PresetSchema from @tekton/preset
   - Dependencies: None (can start immediately)

2. **Implement Preset Loader** [MCP-PRESET]
   - Create `src/preset/builtin.ts` module
   - Import all 7 preset JSON files with type assertions
   - Implement `listBuiltinPresets()` function
   - Implement `getBuiltinPreset(presetId)` function
   - Implement `validatePreset()` for runtime validation
   - Export PresetInfo type for AI context
   - Dependencies: Task 1 (preset files exist)

3. **Write Preset Tests** [MCP-PRESET]
   - Create `tests/preset/builtin.test.ts`
   - Test preset listing returns all 7 presets
   - Test individual preset retrieval
   - Test invalid preset ID handling
   - Test preset schema validation
   - Target: 100% coverage for preset module
   - Dependencies: Task 2 (loader implemented)

**Completion Criteria**:
- All 7 preset JSON files created and validated
- Loader functions working correctly
- Test coverage at 100% for preset module

---

### Milestone 2: Local Configuration Management (Primary Goal)

**Objective**: Implement local configuration storage using `.tekton/config.json`.

**Tasks**:

4. **Define Configuration Schema** [MCP-CONFIG]
   - Create `src/project/config.ts` module
   - Define TektonConfig Zod schema
   - Define ConfigSchema with version, mode, project, preset sections
   - Export TypeScript types derived from schema
   - Dependencies: None (can start in parallel with M1)

5. **Implement Config Manager** [MCP-CONFIG]
   - Create `src/project/config-manager.ts` class
   - Implement `ConfigManager.load(projectPath)` - reads or creates config
   - Implement `ConfigManager.save(config)` - atomic write with backup
   - Implement `ConfigManager.update(partial)` - merge updates
   - Handle missing/corrupted config gracefully
   - Create `.tekton/` directory if needed
   - Dependencies: Task 4 (schema defined)

6. **Write Config Tests** [MCP-CONFIG]
   - Create `tests/project/config-manager.test.ts`
   - Test config creation in fresh project
   - Test config loading from existing file
   - Test config update preserves other fields
   - Test corrupted config handling
   - Test missing directory handling
   - Target: 95% coverage for config module
   - Dependencies: Task 5 (manager implemented)

**Completion Criteria**:
- Config schema defined with Zod
- Config manager handles all CRUD operations
- Graceful handling of edge cases

---

### Milestone 3: Standalone Tool Implementation (Primary Goal)

**Objective**: Implement 4 standalone MCP tools that work without studio-api.

**Tasks**:

7. **Implement preset.list Tool** [MCP-PRESET]
   - Add tool definition to TOOLS array in mcp-server.ts
   - Implement handler calling `listBuiltinPresets()`
   - Return array of {id, name, description, stack} objects
   - Dependencies: M1 complete (preset loader ready)

8. **Implement preset.get Tool** [MCP-PRESET]
   - Add tool definition to TOOLS array
   - Implement handler calling `getBuiltinPreset(presetId)`
   - Return complete preset with questionnaire and metadata
   - Return error for invalid preset ID
   - Dependencies: M1 complete

9. **Implement project.status Tool** [MCP-CONFIG]
   - Add tool definition to TOOLS array
   - Implement handler reading local config
   - Return {mode, activePresetId, frameworkType, detectedAt}
   - Return sensible defaults if no config exists
   - Dependencies: M2 complete (config manager ready)

10. **Implement project.useBuiltinPreset Tool** [MCP-CONFIG]
    - Add tool definition to TOOLS array
    - Validate presetId against builtin presets
    - Update local config with selected preset
    - Return updated status with confirmation
    - Dependencies: M2 complete, Task 7 (preset.list for validation)

11. **Write Standalone Tool Tests** [MCP-PRESET, MCP-CONFIG]
    - Create `tests/project/standalone-tools.test.ts`
    - Test all 4 tools in isolation
    - Test integration between tools
    - Test error cases (invalid preset, missing config)
    - Target: 95% coverage for standalone tools
    - Dependencies: Tasks 7-10 complete

**Completion Criteria**:
- All 4 standalone tools registered and functional
- Tools work without any API calls
- Test coverage at 95%

---

### Milestone 4: Mode Detection and Switching (Secondary Goal)

**Objective**: Implement automatic mode detection (standalone vs connected).

**Tasks**:

12. **Implement Mode Detection** [MCP-MODE]
    - Create `src/server/mode.ts` module
    - Implement `detectMode()` function:
      - Check for --standalone CLI flag (force standalone)
      - Check TEKTON_MODE environment variable
      - Attempt studio-api health check with 2s timeout
      - Return 'standalone' or 'connected'
    - Cache mode for server lifetime
    - Dependencies: None (can start in parallel)

13. **Refactor Tool Registration** [MCP-MODE]
    - Update `mcp-server.ts` to call detectMode() on startup
    - Create `getStandaloneTools()` returning standalone-only tools
    - Create `getConnectedTools()` returning full tool set
    - Update TOOLS export to be mode-aware
    - Update /health endpoint to include mode
    - Dependencies: Task 12 (mode detection ready)

14. **Refactor project.getActivePreset** [MCP-MODE]
    - Update to check mode before API call
    - In standalone mode, read from local config instead
    - In connected mode, keep existing API behavior
    - Dependencies: Task 13 (mode-aware system)

15. **Refactor project.setActivePreset** [MCP-MODE]
    - Update to check mode before API call
    - In standalone mode, redirect to useBuiltinPreset
    - In connected mode, keep existing API behavior
    - Dependencies: Task 13

16. **Write Mode Detection Tests** [MCP-MODE]
    - Create `tests/server/mode.test.ts`
    - Test CLI flag detection
    - Test environment variable detection
    - Test API health check timeout
    - Test mode caching behavior
    - Target: 90% coverage for mode module
    - Dependencies: Tasks 12-15 complete

**Completion Criteria**:
- Mode auto-detection working correctly
- Tools behave appropriately per mode
- Health endpoint reflects current mode

---

### Milestone 5: npm Package Configuration (Secondary Goal)

**Objective**: Configure package for npm publishing as @tekton/mcp-server.

**Tasks**:

17. **Update package.json** [MCP-NPM]
    - Change name to "@tekton/mcp-server"
    - Update version to "1.0.0"
    - Update bin entry to "tekton-mcp"
    - Add publishConfig with public access
    - Update keywords for discoverability
    - Add files array for publish inclusion
    - Dependencies: None (documentation task)

18. **Create npm README** [MCP-NPM]
    - Write comprehensive README.md for npm page
    - Include quick start guide
    - Document all available tools
    - Add usage examples with Claude/VS Code
    - Include feature comparison (standalone vs connected)
    - Dependencies: M3 complete (tools documented)

19. **Configure Build for Publishing** [MCP-NPM]
    - Ensure dist/ includes all bundled presets
    - Verify source maps excluded from publish
    - Add prepublishOnly script for safety
    - Test package with `npm pack` and inspect contents
    - Dependencies: Tasks 17-18

20. **Publish Dry Run** [MCP-NPM]
    - Run `npm publish --dry-run` to verify
    - Check package size (must be < 5MB)
    - Verify bin works with `npx ./`
    - Document publish process
    - Dependencies: Task 19

**Completion Criteria**:
- Package publishable to npm
- README comprehensive and helpful
- Package size within limits

---

### Milestone 6: Integration Testing (Final Goal)

**Objective**: Comprehensive integration testing in real-world scenarios.

**Tasks**:

21. **Fresh Environment Test** [MCP-NPM]
    - Create fresh Node.js environment (Docker or VM)
    - Run `npx @tekton/mcp-server` (using local pack)
    - Verify server starts in standalone mode
    - Test all standalone tools via HTTP
    - Dependencies: M5 complete

22. **Claude Desktop Integration Test**
    - Configure Claude Desktop with local MCP server
    - Test tool discovery
    - Test preset listing and selection
    - Test screen generation with selected preset
    - Document any issues
    - Dependencies: Task 21

23. **Regression Test Suite**
    - Run full existing test suite
    - Verify no regressions in archetype tools
    - Verify no regressions in screen tools
    - Verify connected mode still works
    - Dependencies: M4 complete

24. **Performance Benchmarking**
    - Measure cold start time (target < 2s)
    - Measure tool response times
    - Measure memory usage
    - Document baseline metrics
    - Dependencies: Task 21

**Completion Criteria**:
- All integration tests pass
- No regressions in existing functionality
- Performance meets targets

---

## Technical Approach

### Architecture Changes

```
Current:
  mcp-server.ts -> projectTools -> fetch() -> studio-api

Target (Standalone):
  mcp-server.ts -> standaloneTools -> configManager -> .tekton/config.json
                -> builtinPresets -> bundled JSON

Target (Connected - unchanged):
  mcp-server.ts -> projectTools -> fetch() -> studio-api
```

### Key Design Decisions

1. **Mode Detection First**: Server determines mode at startup, not per-request
2. **Graceful Degradation**: If API check times out, assume standalone
3. **Local-First Config**: Config always stored locally, synced in connected mode
4. **No Feature Flags**: All standalone features always available, connected adds more

### File Structure After Implementation

```
packages/studio-mcp/
  src/
    archetype/
      tools.ts                    # Unchanged
    preset/
      builtin.ts                  # NEW - preset loader
      presets/                    # NEW - bundled JSON
        next-tailwind-shadcn.json
        next-tailwind-radix.json
        vite-tailwind-shadcn.json
        next-styled-components.json
        saas-dashboard.json
        tech-startup.json
        premium-editorial.json
    project/
      tools.ts                    # Refactored - mode-aware
      standalone.ts               # NEW - standalone tool implementations
      config.ts                   # NEW - config schema
      config-manager.ts           # NEW - config CRUD
      schemas.ts                  # Unchanged
      index.ts                    # Updated exports
    screen/
      tools.ts                    # Unchanged
      schemas.ts                  # Unchanged
      templates.ts                # Unchanged
      index.ts                    # Unchanged
    server/
      mcp-server.ts               # Updated - mode detection
      mode.ts                     # NEW - mode detection logic
      index.ts                    # Unchanged
    storage/
      storage.ts                  # Unchanged
    types/
      design-tokens.ts            # Unchanged
    index.ts                      # Updated exports
  tests/
    preset/
      builtin.test.ts             # NEW
    project/
      config-manager.test.ts      # NEW
      standalone-tools.test.ts    # NEW
      tools.test.ts               # Unchanged
      index.test.ts               # Unchanged
    server/
      mode.test.ts                # NEW
      mcp-server.test.ts          # Unchanged
    # ... existing tests unchanged
  dist/                           # Build output
  package.json                    # Updated for npm publish
  README.md                       # NEW - npm documentation
  tsconfig.json                   # Unchanged
  vitest.config.ts                # Unchanged
```

---

## Risk Mitigation

### Risk: npm Package Name Unavailable
- **Check**: Verify @tekton/mcp-server availability before Task 17
- **Fallback**: Use @tekton/studio-mcp or @tekton-design/mcp

### Risk: Bundle Size Exceeds Limit
- **Monitor**: Check size after each JSON addition in M1
- **Fallback**: Minify JSON, consider external CDN for presets

### Risk: Mode Detection Flaky
- **Mitigation**: Conservative timeout (2s), clear failure = standalone
- **Fallback**: Explicit --standalone flag always works

---

## Definition of Done

Each milestone is complete when:
1. All tasks in milestone completed
2. All tests passing with target coverage
3. No regressions in existing tests
4. Code reviewed and merged
5. Documentation updated

Overall SPEC is complete when:
1. All 6 milestones completed
2. `npx @tekton/mcp-server` works in fresh environment
3. All standalone tools functional
4. Package published to npm (or ready for publish)
5. Integration tests verified with Claude Desktop

---

## Estimated Effort

| Milestone | Tasks | Complexity | Estimated Effort |
|-----------|-------|------------|------------------|
| M1: Preset Bundling | 3 | Medium | 4-6 hours |
| M2: Config Management | 3 | Medium | 4-6 hours |
| M3: Standalone Tools | 5 | Medium | 6-8 hours |
| M4: Mode Detection | 5 | High | 6-8 hours |
| M5: npm Configuration | 4 | Low | 2-4 hours |
| M6: Integration Testing | 4 | Medium | 4-6 hours |

**Total Estimated Effort**: 26-38 hours

---

## Next Steps

1. Verify @tekton/mcp-server npm name availability
2. Begin M1 and M2 in parallel (no dependencies)
3. Begin M4 (mode detection) in parallel with M1/M2
4. M3 follows M1 and M2 completion
5. M5 can proceed once M3 shows stable tools
6. M6 final validation after all prior milestones

---

**Last Updated**: 2026-01-18
**Status**: Planned
