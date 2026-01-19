---
id: SPEC-MCP-STANDALONE-001
document: acceptance
version: "1.0.0"
created: "2026-01-18"
---

# Acceptance Criteria: Phase 1 Standalone MCP Completion

## Overview

This document defines the acceptance criteria and test scenarios for SPEC-MCP-STANDALONE-001, ensuring the MCP server can operate as an environment-independent npm package.

---

## Acceptance Criteria Summary

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| AC-001 | Environment independence | HIGH | Pending |
| AC-002 | Backward compatibility | HIGH | Pending |
| AC-003 | Zero configuration startup | HIGH | Pending |
| AC-004 | Local configuration persistence | HIGH | Pending |
| AC-005 | Bundled theme verification | HIGH | Pending |
| AC-006 | theme.list tool | HIGH | Pending |
| AC-007 | theme.get tool | HIGH | Pending |
| AC-008 | project.status tool | HIGH | Pending |
| AC-009 | project.useBuiltinPreset tool | HIGH | Pending |
| AC-010 | Mode selection logic | MEDIUM | Pending |
| AC-011 | Theme source selection | MEDIUM | Pending |
| AC-012 | npx execution | HIGH | Pending |

---

## Detailed Test Scenarios

### AC-001: Environment Independence

**Requirement**: U-001 - System operates without external API dependencies in standalone mode

**Scenario 1: Standalone Mode No Network Calls**
```gherkin
Given the MCP server is running in standalone mode
When any standalone tool is invoked
Then no HTTP requests are made to studio-api
And the tool completes successfully with local data
```

**Scenario 2: Offline Operation**
```gherkin
Given the network is completely disabled
And the MCP server is started with --standalone flag
When the server starts
Then the server starts successfully
And all standalone tools are available
And /health returns status "ok" with mode "standalone"
```

**Scenario 3: API Unavailable Fallback**
```gherkin
Given studio-api is not running
And the MCP server is started without --standalone flag
When the server performs mode detection
Then the server times out API check after 2 seconds
And the server falls back to standalone mode
And /health returns mode "standalone"
```

**Verification Method**: Network monitoring during test execution, mock API unavailability

---

### AC-002: Backward Compatibility

**Requirement**: U-002 - Maintain backward compatibility with existing MCP tool interfaces

**Scenario 1: Existing Component Tools Unchanged**
```gherkin
Given the MCP server is running
When component.list is invoked
Then the response format matches existing schema
And all hook names are returned as before
```

**Scenario 2: Existing Screen Tools Unchanged**
```gherkin
Given the MCP server is running in standalone mode
When screen.create is invoked with valid parameters
Then the screen file is created in the correct location
And the response format matches existing schema
```

**Scenario 3: Existing Project Detection Unchanged**
```gherkin
Given the MCP server is running
When project.detectStructure is invoked with a Next.js project
Then the framework type is correctly detected as "next-app"
And the response format matches existing schema
```

**Verification Method**: Run entire existing test suite, compare response schemas

---

### AC-003: Zero Configuration Startup

**Requirement**: U-003 - Start and serve all standalone tools with zero configuration

**Scenario 1: Fresh Project Startup**
```gherkin
Given a project directory with no .tekton folder
And no environment variables set
When the MCP server is started
Then the server starts successfully within 2 seconds
And /health returns status "ok"
And all standalone tools are available
```

**Scenario 2: npx First Run**
```gherkin
Given a fresh Node.js environment
And @tekton/mcp-server is not installed
When "npx @tekton/mcp-server" is executed
Then the package is downloaded and executed
And the server starts successfully
And /tools returns the list of available tools
```

**Scenario 3: No Config File Required**
```gherkin
Given the .tekton/config.json file does not exist
When theme.list is invoked
Then all 7 built-in themes are returned
And no error is thrown about missing configuration
```

**Verification Method**: Fresh environment testing, startup time measurement

---

### AC-004: Local Configuration Persistence

**Requirement**: U-004 - Persist user configuration to .tekton/config.json

**Scenario 1: Config File Creation**
```gherkin
Given a project with no .tekton directory
When project.useBuiltinPreset is invoked with "next-tailwind-shadcn"
Then .tekton directory is created
And .tekton/config.json is created with valid JSON
And the file contains activePresetId "next-tailwind-shadcn"
```

**Scenario 2: Config File Update**
```gherkin
Given .tekton/config.json exists with activePresetId "saas-dashboard"
When project.useBuiltinPreset is invoked with "tech-startup"
Then the file is updated with activePresetId "tech-startup"
And other configuration fields are preserved
```

**Scenario 3: Config Persistence Across Restart**
```gherkin
Given the MCP server has set activePresetId to "premium-editorial"
And the server is stopped and restarted
When project.status is invoked
Then activePresetId is "premium-editorial"
And the configuration was loaded from disk
```

**Scenario 4: Corrupted Config Recovery**
```gherkin
Given .tekton/config.json contains invalid JSON
When the MCP server attempts to load configuration
Then the server starts successfully
And project.status returns default values
And a warning is logged about corrupted config
```

**Verification Method**: File system verification, restart tests, corruption simulation

---

### AC-005: Bundled Theme Verification

**Requirement**: U-005 - Bundle all 7 built-in themes as JSON

**Scenario 1: All Themes Available**
```gherkin
Given the MCP server is running in standalone mode
When theme.list is invoked
Then exactly 7 themes are returned
And the themes include:
  | id                       |
  | next-tailwind-shadcn     |
  | next-tailwind-radix      |
  | vite-tailwind-shadcn     |
  | next-styled-components   |
  | saas-dashboard           |
  | tech-startup             |
  | premium-editorial        |
```

**Scenario 2: Theme Schema Validation**
```gherkin
Given any built-in theme is loaded
When validated against PresetSchema
Then the theme passes all validation rules
And contains required fields: id, version, name, description, stack, questionnaire
```

**Scenario 3: Theme Data Completeness**
```gherkin
Given the "next-tailwind-shadcn" theme
When theme.get is invoked with presetId "next-tailwind-shadcn"
Then the response includes:
  | field              | type   |
  | id                 | string |
  | version            | string |
  | name               | string |
  | description        | string |
  | stack.framework    | string |
  | stack.styling      | string |
  | questionnaire      | object |
  | metadata           | object |
```

**Verification Method**: Enumeration test, schema validation, field presence checks

---

### AC-006: theme.list Tool

**Requirement**: E-001 - Return list of all 7 built-in themes

**Scenario 1: Successful List**
```gherkin
Given the MCP server is running
When POST /tools/theme.list is called with empty body
Then response status is 200
And response.success is true
And response.data is an array of 7 themes
And each theme contains id, name, description, stack
```

**Scenario 2: List Format**
```gherkin
Given the MCP server is running
When theme.list is invoked
Then each theme in response contains:
  | field       | example value                        |
  | id          | "next-tailwind-shadcn"               |
  | name        | "Next.js + Tailwind CSS + shadcn/ui" |
  | description | "Default theme for..."              |
  | stack       | { framework, styling, components }   |
```

**Verification Method**: HTTP request test, response schema validation

---

### AC-007: theme.get Tool

**Requirement**: E-002 - Return complete theme data including AI context

**Scenario 1: Valid Theme Retrieval**
```gherkin
Given the MCP server is running
When POST /tools/theme.get is called with:
  | field    | value                |
  | presetId | next-tailwind-shadcn |
Then response status is 200
And response.success is true
And response.data contains complete theme with questionnaire
```

**Scenario 2: Invalid Theme ID**
```gherkin
Given the MCP server is running
When POST /tools/theme.get is called with:
  | field    | value           |
  | presetId | non-existent-id |
Then response status is 200
And response.success is false
And response.error contains "Theme not found"
```

**Scenario 3: AI Context Included**
```gherkin
Given the MCP server is running
When theme.get is invoked for "next-tailwind-shadcn"
Then response includes questionnaire with:
  | field        | purpose                    |
  | brandTone    | AI styling decisions       |
  | contrast     | Accessibility guidance     |
  | density      | Layout spacing decisions   |
  | borderRadius | Component corner styling   |
  | primaryColor | Color scheme generation    |
```

**Verification Method**: HTTP request test, error handling test, content verification

---

### AC-008: project.status Tool

**Requirement**: E-003 - Return connection status and active theme

**Scenario 1: Status with Active Theme**
```gherkin
Given .tekton/config.json contains activePresetId "tech-startup"
And detected frameworkType is "next-app"
When POST /tools/project.status is called
Then response contains:
  | field          | value        |
  | mode           | standalone   |
  | activePresetId | tech-startup |
  | frameworkType  | next-app     |
```

**Scenario 2: Status with No Configuration**
```gherkin
Given .tekton/config.json does not exist
When project.status is invoked
Then response contains:
  | field          | value      |
  | mode           | standalone |
  | activePresetId | null       |
  | frameworkType  | unknown    |
```

**Scenario 3: Status with Project Path**
```gherkin
Given a project at /path/to/project
When project.status is invoked with projectPath "/path/to/project"
Then the status is read from /path/to/project/.tekton/config.json
And frameworkType is detected from /path/to/project
```

**Verification Method**: Config state variations, path resolution tests

---

### AC-009: project.useBuiltinPreset Tool

**Requirement**: E-004 - Set active theme in local config

**Scenario 1: Select Valid Theme**
```gherkin
Given the MCP server is running in standalone mode
When POST /tools/project.useBuiltinPreset is called with:
  | field    | value          |
  | presetId | saas-dashboard |
Then response.success is true
And .tekton/config.json contains activePresetId "saas-dashboard"
And response contains selectedAt timestamp
```

**Scenario 2: Select Invalid Theme**
```gherkin
Given the MCP server is running
When project.useBuiltinPreset is invoked with:
  | field    | value       |
  | presetId | invalid-id  |
Then response.success is false
And response.error contains "Invalid theme ID"
And .tekton/config.json is not modified
```

**Scenario 3: Switch Between Themes**
```gherkin
Given activePresetId is currently "saas-dashboard"
When project.useBuiltinPreset is invoked with "tech-startup"
Then activePresetId changes to "tech-startup"
And subsequent project.status returns "tech-startup"
```

**Verification Method**: File content verification, state transition tests

---

### AC-010: Mode Selection Logic

**Requirement**: S-001 - Mode selection based on API availability

**Scenario 1: Forced Standalone Mode**
```gherkin
Given the server is started with --standalone flag
And studio-api is running
When mode detection occurs
Then mode is "standalone" (forced)
And no API health check is performed
```

**Scenario 2: Auto-detect Connected Mode**
```gherkin
Given the server is started without --standalone flag
And studio-api health check returns 200
When mode detection occurs
Then mode is "connected"
And connected tools are available
```

**Scenario 3: Auto-detect Standalone Mode (Timeout)**
```gherkin
Given the server is started without --standalone flag
And studio-api is unreachable
When mode detection occurs
Then API health check times out after 2 seconds
And mode falls back to "standalone"
```

**Scenario 4: Environment Variable Override**
```gherkin
Given TEKTON_MODE environment variable is set to "standalone"
When the server starts
Then mode is "standalone"
And no API check is attempted
```

**Verification Method**: CLI flag testing, mock API responses, timeout simulation

---

### AC-011: Theme Source Selection

**Requirement**: S-002 - Load themes from appropriate source based on mode

**Scenario 1: Standalone Mode Uses Bundled**
```gherkin
Given the server is in standalone mode
When theme.list is invoked
Then themes are loaded from bundled JSON
And exactly 7 themes are available
And no API calls are made
```

**Scenario 2: Connected Mode Uses API**
```gherkin
Given the server is in connected mode
When theme operations are performed
Then themes are loaded from studio-api
And custom themes are available if defined
```

**Verification Method**: Source verification, mode isolation tests

---

### AC-012: npx Execution

**Requirement**: Package executes correctly via npx

**Scenario 1: npx Download and Run**
```gherkin
Given a fresh environment with no @tekton packages
When "npx @tekton/mcp-server" is executed
Then the package is downloaded from npm
And the server starts on default port 3000
And /health returns valid response
```

**Scenario 2: npx with Custom Port**
```gherkin
Given npx @tekton/mcp-server is available
When "npx @tekton/mcp-server --port 4000" is executed
Then the server starts on port 4000
And /health is accessible at http://localhost:4000/health
```

**Scenario 3: npx Package Size**
```gherkin
Given the published @tekton/mcp-server package
When the package size is measured
Then total size is less than 5MB
And download time is acceptable for CLI experience
```

**Verification Method**: Fresh environment test, port configuration test, size measurement

---

## Quality Gates

### Code Coverage Requirements

| Module | Minimum Coverage |
|--------|------------------|
| src/theme/builtin.ts | 100% |
| src/project/config.ts | 95% |
| src/project/config-manager.ts | 95% |
| src/project/standalone.ts | 95% |
| src/server/mode.ts | 90% |
| Overall new code | 90% |

### Performance Requirements

| Metric | Target |
|--------|--------|
| Server cold start | < 2 seconds |
| Tool response time | < 500ms |
| Package download size | < 5MB |
| Memory usage (idle) | < 50MB |

### Compatibility Requirements

| Integration | Verified |
|-------------|----------|
| Claude Desktop | Pending |
| VS Code Extension | Pending |
| Cursor IDE | Pending |
| Node.js 20+ | Pending |
| npm v9+ | Pending |

---

## Test Execution Plan

### Unit Tests
```bash
# Run all unit tests
pnpm --filter @tekton/studio-mcp test

# Run with coverage
pnpm --filter @tekton/studio-mcp test:coverage
```

### Integration Tests
```bash
# Start server in standalone mode
pnpm --filter @tekton/studio-mcp start -- --standalone

# In another terminal, run integration tests
pnpm --filter @tekton/studio-mcp test:integration
```

### E2E Tests (Fresh Environment)
```bash
# Build and pack
pnpm --filter @tekton/studio-mcp build
cd packages/studio-mcp && npm pack

# Test in isolated environment
docker run -it --rm -v $(pwd):/pkg node:20 sh -c \
  "cd /tmp && npm init -y && npm install /pkg/*.tgz && npx tekton-mcp"
```

---

## Sign-off Checklist

Before marking SPEC complete, verify:

- [ ] All AC scenarios passing
- [ ] Code coverage meets minimum requirements
- [ ] Performance metrics within targets
- [ ] npx execution verified in fresh environment
- [ ] Claude Desktop integration tested
- [ ] No regressions in existing tests
- [ ] Documentation complete (README, inline comments)
- [ ] Package published (or ready for publish)

---

**Last Updated**: 2026-01-18
**Status**: Pending Implementation
