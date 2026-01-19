---
id: SPEC-MCP-001
version: "1.0.0"
status: "completed"
created: "2026-01-18"
updated: "2026-01-18"
author: "MoAI-ADK"
priority: "HIGH"
lifecycle: "spec-anchored"
---

## HISTORY
- 2026-01-18 v1.0.0: Initial SPEC creation - Tekton MCP Server Natural Language Screen Generation

---

## IMPLEMENTATION STATUS

**Status**: COMPLETED
**Completed Date**: 2026-01-18
**Implementation Branch**: feature/SPEC-MCP-001

### Commits
- 477bc9e feat(studio-api): add ProjectSettings model and migration
- 049962b feat(studio-api): add Settings API with theme management
- 73cd4cb test(studio-api): add comprehensive tests for project settings
- 41acdee feat(studio-mcp): add project tools for structure detection
- f890622 feat(studio-mcp): add screen tools for natural language generation
- 4d409cb test(studio-mcp): add tests for project and screen tools

### Test Coverage
- studio-mcp: 196 tests passing, 92% coverage
- studio-api: 111 tests passing, 86% coverage

### Files Created

**studio-api Package:**
- src/studio_api/models/project_settings.py
- alembic/versions/003_create_project_settings_table.py
- src/studio_api/schemas/project_settings.py
- src/studio_api/repositories/project_settings.py
- src/studio_api/api/v2/settings.py

**studio-mcp Package:**
- src/project/schemas.ts
- src/project/tools.ts
- src/screen/schemas.ts
- src/screen/tools.ts
- src/screen/templates.ts

---

# SPEC-MCP-001: Tekton MCP Server Natural Language Screen Generation

## Executive Summary

**Purpose**: Extend the Tekton MCP Server with natural language screen generation capabilities, enabling AI assistants to create complete screens with routing setup, component composition, and style component application through simple MCP tool invocations.

**Scope**: Add Screen Tools (create, addComponent, applyArchetype, list, preview) and Project Tools (detectStructure, getActivePreset, setActivePreset) to the existing studio-mcp package, with supporting infrastructure in studio-api and studio-web.

**Priority**: HIGH - Enables single-prompt screen generation workflow for AI-driven development

**Impact**: Reduces screen creation from multi-step manual process to single MCP tool invocation. AI assistants can create complete screens with correct routing, components, and styling in one prompt.

---

## ENVIRONMENT

### Current System Context

**Existing studio-mcp Package:**
- **HTTP-based MCP Server**: Located at `packages/studio-mcp/src/server/mcp-server.ts`
- **Component Tools**: 7 existing tools (component.list, component.get, component.getPropRules, component.getStateMappings, component.getVariants, component.getStructure, component.query)
- **Tool Execution**: `executeTool()` function at lines 172-205 with switch-case pattern
- **CORS Support**: Enabled with wildcard origin for development
- **Health Endpoint**: `/health` returning tool list

**Existing studio-api Package:**
- **FastAPI Backend**: Python 3.11+ with async/await patterns
- **SQLAlchemy 2.0**: Async ORM with PostgreSQL/SQLite support
- **Pydantic v2.9**: Data validation and serialization
- **Curated Themes System**: `curated_preset` model with category, tags, and config
- **Database Infrastructure**: Alembic migrations, async session management

**Existing studio-web Package:**
- **Next.js App Router**: Client components with React 19 patterns
- **Theme Detail Page**: `packages/studio-web/src/app/themes/[id]/page.tsx`
- **React Query**: Data fetching with usePreset, useDeletePreset hooks
- **UI Components**: Button, Card, Badge, Skeleton from custom UI library

**Target MCP Tools Integration:**
- **Screen Tools**: Create screens, add components, apply components
- **Project Tools**: Detect framework structure, manage active theme
- **Auto-Routing**: Automatic file creation in correct app/pages directories
- **Link Injection**: Add navigation links to parent pages

### Technology Stack

**MCP Server (TypeScript):**
- TypeScript 5.7+
- Node.js 20+
- Zod 3.23+ (schema validation)
- @tekton/component-system (workspace dependency)

**Backend API (Python):**
- FastAPI 0.118+
- SQLAlchemy 2.0+ (async)
- Pydantic 2.9+
- asyncpg (PostgreSQL driver)
- Alembic 1.13+ (migrations)

**Frontend (TypeScript/React):**
- Next.js 16+ (App Router)
- React 19
- React Query (@tanstack/react-query)
- Tailwind CSS

**Testing:**
- Vitest (MCP server)
- pytest-asyncio (Python API)
- @testing-library/react (Frontend)

---

## ASSUMPTIONS

### Technical Assumptions

**A-001: Framework Detection Feasibility**
- **Assumption**: Project structure can reliably identify Next.js App Router, Pages Router, and Vite projects through file system analysis
- **Confidence**: HIGH
- **Evidence**: Distinct marker files (app/layout.tsx, pages/_app.tsx, vite.config.ts)
- **Risk if Wrong**: Incorrect file generation paths, broken routing
- **Validation**: Integration tests with sample project structures

**A-002: File System Write Permissions**
- **Assumption**: MCP server has write access to project directories for screen file creation
- **Confidence**: MEDIUM
- **Evidence**: Development environments typically have full write access
- **Risk if Wrong**: Screen creation fails silently or with permission errors
- **Validation**: Permission check before file write, clear error messages

**A-003: Theme Configuration Stability**
- **Assumption**: CuratedPreset model structure remains stable for active_preset_id foreign key
- **Confidence**: HIGH
- **Evidence**: Model established in SPEC-PHASEAB-001, stable since v0.1.0
- **Risk if Wrong**: Database migration conflicts, foreign key violations
- **Validation**: Alembic migration testing, rollback procedures

**A-004: Link Injection Safety**
- **Assumption**: Parent page files follow predictable patterns for safe code injection
- **Confidence**: MEDIUM
- **Evidence**: Next.js generates consistent page structures
- **Risk if Wrong**: Code injection corrupts parent files
- **Validation**: AST parsing for safe injection, backup before modification

### Business Assumptions

**A-005: Single Active Theme Workflow**
- **Assumption**: Users work with one active theme at a time per project
- **Confidence**: HIGH
- **Evidence**: Design system consistency requires single active theme
- **Risk if Wrong**: Theme conflicts, inconsistent styling
- **Validation**: UI enforces single active theme selection

**A-006: Screen Name Uniqueness**
- **Assumption**: Screen names are unique within a project for routing
- **Confidence**: HIGH
- **Evidence**: File system requires unique paths
- **Risk if Wrong**: Overwrite existing screens, routing conflicts
- **Validation**: Existence check before creation, confirmation prompt

### Integration Assumptions

**A-007: Component System Compatibility**
- **Assumption**: Style components from SPEC-COMPONENT-001 are directly applicable to generated screens
- **Confidence**: HIGH
- **Evidence**: Component system designed for component styling
- **Risk if Wrong**: Styling mismatches, incompatible CSS variable references
- **Validation**: Integration tests with all 7 style components

---

## REQUIREMENTS

### Ubiquitous Requirements (Always Active)

**U-001: MCP Tool Registration**
- The system **shall** register all Screen Tools and Project Tools in the TOOLS array of mcp-server.ts
- **Rationale**: Tool visibility enables AI assistant discovery and invocation
- **Test Strategy**: Tool list verification, /tools endpoint response validation

**U-002: Input Schema Validation**
- The system **shall** validate all tool inputs using Zod schemas before execution
- **Rationale**: Input validation prevents runtime errors and provides clear error messages
- **Test Strategy**: Schema validation tests with valid and invalid inputs

**U-003: Error Response Consistency**
- The system **shall** return standardized error responses with `{ success: false, error: string }` format
- **Rationale**: Consistent error format enables AI assistant error handling
- **Test Strategy**: Error response format validation across all tools

**U-004: Framework Detection Accuracy**
- The system **shall** correctly identify Next.js App Router, Pages Router, and Vite projects with 100% accuracy for marker files present
- **Rationale**: Correct framework detection determines file generation paths
- **Test Strategy**: Framework detection tests with sample project structures

**U-005: Test Coverage Requirement**
- The system **shall** maintain greater than or equal to 85% test coverage for all new code
- **Rationale**: TRUST 5 framework Test-first pillar enforcement
- **Test Strategy**: Vitest/pytest coverage reporting, automated coverage gates

### Event-Driven Requirements (Trigger-Response)

**E-001: Screen Creation Request**
- **WHEN** `screen.create` tool invoked with name, intent, targetPath, and linkFrom **THEN** generate complete screen file with routing setup in framework-appropriate directory
- **Rationale**: Single invocation creates complete, functional screen
- **Test Strategy**: Screen creation tests with various framework types

**E-002: Component Addition Request**
- **WHEN** `screen.addComponent` tool invoked with screenName and componentType **THEN** add component to existing screen file with proper imports
- **Rationale**: Incremental component building without full regeneration
- **Test Strategy**: Component addition tests, import statement verification

**E-003: Component Application Request**
- **WHEN** `screen.applyArchetype` tool invoked with screenName and archetypeName **THEN** apply style component to screen with Token Contract CSS variables
- **Rationale**: Style component application ensures design system consistency
- **Test Strategy**: Component application tests with all 7 style components

**E-004: Project Structure Detection Request**
- **WHEN** `project.detectStructure` tool invoked with projectPath **THEN** return detected framework type and relevant paths
- **Rationale**: Framework detection enables correct file generation paths
- **Test Strategy**: Detection tests with Next.js App/Pages and Vite projects

**E-005: Active Theme Retrieval Request**
- **WHEN** `project.getActivePreset` tool invoked **THEN** return current active theme from project settings database
- **Rationale**: Active theme provides styling context for screen generation
- **Test Strategy**: Active theme retrieval tests with various theme states

**E-006: Active Theme Update Request**
- **WHEN** `project.setActivePreset` tool invoked with presetId **THEN** update project settings and return confirmation
- **Rationale**: Theme selection determines global styling for new screens
- **Test Strategy**: Active theme update tests with valid and invalid theme IDs

**E-007: Screen List Request**
- **WHEN** `screen.list` tool invoked **THEN** return list of all screens in current project with metadata
- **Rationale**: Screen inventory enables AI assistant to understand project structure
- **Test Strategy**: Screen listing tests with populated and empty projects

**E-008: Screen Preview Request**
- **WHEN** `screen.preview` tool invoked with screenName **THEN** return preview URL for the specified screen
- **Rationale**: Preview URL enables visual verification of generated screens
- **Test Strategy**: Preview URL generation tests with valid and invalid screen names

### State-Driven Requirements (Conditional Behavior)

**S-001: Framework-Specific File Generation**
- **IF** detected framework is Next.js App Router **THEN** generate files in `app/` directory with layout.tsx pattern
- **IF** detected framework is Next.js Pages Router **THEN** generate files in `pages/` directory with _app.tsx pattern
- **IF** detected framework is Vite **THEN** generate files in `src/` directory with router configuration
- **Rationale**: Framework-appropriate file structure ensures correct routing
- **Test Strategy**: File path validation tests for each framework type

**S-002: Link Injection Conditional**
- **IF** linkFrom object provided with page and label properties and parent page exists **THEN** inject Link component into parent page with specified label
- **IF** linkFrom object provided but parent page not found **THEN** return warning without failing screen creation
- **Rationale**: Optional link injection with configurable label improves navigation without blocking creation
- **Test Strategy**: Link injection tests with present and absent parent pages, label verification

**S-003: Active Theme Conditional**
- **IF** active theme exists **THEN** apply theme styling to new screens automatically
- **IF** no active theme set **THEN** use default styling without error
- **Rationale**: Theme-driven styling without hard requirement
- **Test Strategy**: Screen creation tests with and without active theme

**S-004: Screen Name Conflict Resolution**
- **IF** screen name already exists **THEN** return error with existing screen metadata
- **Rationale**: Prevent accidental overwrites, require explicit confirmation
- **Test Strategy**: Conflict detection tests with duplicate screen names

### Unwanted Behaviors (Prohibited Actions)

**UW-001: No Direct File System Injection**
- The system **shall not** inject code into files without AST parsing or template-based generation
- **Rationale**: Direct string injection risks file corruption
- **Test Strategy**: Code generation validation, no regex-based injection

**UW-002: No Unvalidated Database Writes**
- The system **shall not** write to project_settings table without input validation
- **Rationale**: Data integrity requires validation before persistence
- **Test Strategy**: Validation layer tests, SQL injection prevention

**UW-003: No Cross-Project Data Leakage**
- The system **shall not** expose theme or screen data from other projects
- **Rationale**: Project isolation ensures data privacy
- **Test Strategy**: Multi-project isolation tests

**UW-004: No Silent Failures**
- The system **shall not** return success status when operations fail
- **Rationale**: Accurate status enables AI assistant error handling
- **Test Strategy**: Failure mode tests with comprehensive error verification

### Optional Requirements (Future Enhancements)

**O-001: Screen Template Gallery**
- **Where possible**, provide pre-built screen templates (dashboard, settings, profile)
- **Priority**: DEFERRED to Phase 2
- **Rationale**: Templates accelerate common screen creation

**O-002: Component Suggestion Engine**
- **Where possible**, suggest relevant components based on screen intent
- **Priority**: DEFERRED to Phase 2
- **Rationale**: AI-assisted component selection improves screen quality

**O-003: Multi-Theme Preview**
- **Where possible**, enable side-by-side preview with different themes
- **Priority**: DEFERRED to Phase 2
- **Rationale**: Visual comparison aids theme selection

---

## SPECIFICATIONS

### MCP Tool Definitions

#### Screen Tools

**screen.create**
```typescript
{
  name: "screen.create",
  description: "Create a new screen with routing setup. Generates complete page file in framework-appropriate directory.",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Screen name (e.g., 'user-profile', 'dashboard'). Used for file name and route."
      },
      intent: {
        type: "string",
        description: "Natural language description of screen purpose (e.g., 'User profile page with avatar, bio, and settings link')"
      },
      targetPath: {
        type: "string",
        description: "Target route path (e.g., '/users/profile', '/dashboard')"
      },
      linkFrom: {
        type: "object",
        description: "Optional. Configuration for adding navigation link to parent page.",
        properties: {
          page: {
            type: "string",
            description: "Parent page path to add navigation link (e.g., '/users')"
          },
          label: {
            type: "string",
            description: "Link text label (e.g., 'View Profile')"
          },
          description: {
            type: "string",
            description: "Optional description for the link (e.g., 'Navigate to user profile page')"
          }
        },
        required: ["page", "label"]
      }
    },
    required: ["name", "intent", "targetPath"]
  }
}
```

**screen.addComponent**
```typescript
{
  name: "screen.addComponent",
  description: "Add a component to an existing screen. Handles imports and placement.",
  inputSchema: {
    type: "object",
    properties: {
      screenName: {
        type: "string",
        description: "Target screen name"
      },
      componentType: {
        type: "string",
        description: "Component type from component system (e.g., 'useButton', 'useTextField', 'useDialog')"
      },
      props: {
        type: "object",
        description: "Optional component props configuration"
      }
    },
    required: ["screenName", "componentType"]
  }
}
```

**screen.applyArchetype**
```typescript
{
  name: "screen.applyArchetype",
  description: "Apply a style component to a screen. Updates CSS variables and component styling.",
  inputSchema: {
    type: "object",
    properties: {
      screenName: {
        type: "string",
        description: "Target screen name"
      },
      archetypeName: {
        type: "string",
        enum: ["Professional", "Creative", "Minimal", "Bold", "Warm", "Cool", "High-Contrast"],
        description: "Style component to apply"
      }
    },
    required: ["screenName", "archetypeName"]
  }
}
```

**screen.list**
```typescript
{
  name: "screen.list",
  description: "List all screens in the current project with metadata.",
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  }
}
```

**screen.preview**
```typescript
{
  name: "screen.preview",
  description: "Get preview URL for a screen.",
  inputSchema: {
    type: "object",
    properties: {
      screenName: {
        type: "string",
        description: "Screen name to preview"
      }
    },
    required: ["screenName"]
  }
}
```

#### Project Tools

**project.detectStructure**
```typescript
{
  name: "project.detectStructure",
  description: "Detect project structure and framework type.",
  inputSchema: {
    type: "object",
    properties: {
      projectPath: {
        type: "string",
        description: "Path to project root directory"
      }
    },
    required: ["projectPath"]
  }
}
```

**project.getActivePreset**
```typescript
{
  name: "project.getActivePreset",
  description: "Get the currently active theme for the project.",
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  }
}
```

**project.setActivePreset**
```typescript
{
  name: "project.setActivePreset",
  description: "Set the active theme for the project.",
  inputSchema: {
    type: "object",
    properties: {
      presetId: {
        type: "integer",
        description: "ID of the theme to set as active"
      }
    },
    required: ["presetId"]
  }
}
```

### Database Schema

**project_settings Table:**
```sql
CREATE TABLE project_settings (
    id SERIAL PRIMARY KEY,
    project_path VARCHAR(500) NOT NULL UNIQUE,
    active_preset_id INTEGER REFERENCES curated_presets(id) ON DELETE SET NULL,
    framework_type VARCHAR(50),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_project_settings_path ON project_settings(project_path);
```

### API Endpoints

**Settings Router (`/api/v2/settings`):**

```
PUT /settings/active-theme
Request Body: { "preset_id": integer, "project_path": string }
Response: { "success": boolean, "active_preset": PresetResponse | null }

GET /settings/active-theme
Query Params: project_path (required)
Response: { "success": boolean, "active_preset": PresetResponse | null }

GET /settings/project
Query Params: project_path (required)
Response: { "success": boolean, "settings": ProjectSettingsResponse }
```

### Framework Detection Logic

**Detection Priority:**
1. Check for `app/layout.tsx` or `app/layout.js` -> Next.js App Router
2. Check for `pages/_app.tsx` or `pages/_app.js` -> Next.js Pages Router
3. Check for `vite.config.ts` or `vite.config.js` -> Vite
4. Default -> Unknown framework

**Response Structure:**
```typescript
interface ProjectStructure {
  frameworkType: "next-app" | "next-pages" | "vite" | "unknown";
  rootPath: string;
  pagesDirectory: string | null;
  appDirectory: string | null;
  srcDirectory: string | null;
  configFiles: string[];
}
```

### Screen Generation Templates

**Next.js App Router Template:**
```typescript
// app/{targetPath}/page.tsx
'use client';

import { /* components */ } from '@/components';

export default function {ScreenName}Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Generated content based on intent */}
    </div>
  );
}
```

**Link Injection Pattern:**
```typescript
// AST-based injection into parent page
import Link from 'next/link';

// Add to component JSX:
<Link href="{targetPath}">{linkText}</Link>
```

---

## TRACEABILITY

### Requirements to Test Scenarios Mapping

| Requirement ID | Test Scenario ID | Component |
|----------------|------------------|-----------|
| U-001 | AC-001 | Tool registration verification |
| U-002 | AC-002 | Input schema validation |
| U-003 | AC-003 | Error response consistency |
| U-004 | AC-004 | Framework detection accuracy |
| E-001 | AC-005 | Screen creation workflow |
| E-002 | AC-006 | Component addition workflow |
| E-003 | AC-007 | Component application workflow |
| E-004 | AC-008 | Project structure detection |
| E-005 | AC-009 | Active theme retrieval |
| E-006 | AC-010 | Active theme update |
| S-001 | AC-011 | Framework-specific generation |
| S-002 | AC-012 | Link injection conditional |

### SPEC-to-Implementation Tags

- **[SPEC-MCP-001]**: All commits related to MCP screen generation
- **[MCP-SCREEN]**: Screen tool implementations
- **[MCP-PROJECT]**: Project tool implementations
- **[MCP-API]**: Settings API endpoints
- **[MCP-DB]**: Database migration and models
- **[MCP-WEB]**: Frontend UI changes

---

## DEPENDENCIES

### Internal Dependencies
- **SPEC-COMPONENT-001**: Style components for screen styling
- **studio-mcp**: Existing MCP server infrastructure
- **studio-api**: FastAPI backend for settings storage
- **studio-web**: Frontend for theme management

### External Dependencies
- **@tekton/component-system**: Style component data
- **Zod**: Schema validation
- **SQLAlchemy 2.0**: Async database operations
- **Alembic**: Database migrations

### Technical Dependencies
- **TypeScript 5.7+**: Type definitions
- **Python 3.11+**: Backend runtime
- **Node.js 20+**: MCP server runtime
- **PostgreSQL 15+**: Production database

---

## RISK ANALYSIS

### High-Risk Areas

**Risk 1: File System Corruption**
- **Likelihood**: MEDIUM
- **Impact**: HIGH
- **Mitigation**: Backup before modification, AST-based code generation, atomic writes
- **Contingency**: Rollback mechanism, version control integration

**Risk 2: Framework Detection Failures**
- **Likelihood**: LOW
- **Impact**: HIGH
- **Mitigation**: Comprehensive marker file detection, user confirmation for ambiguous cases
- **Contingency**: Manual framework specification fallback

**Risk 3: Database Migration Conflicts**
- **Likelihood**: LOW
- **Impact**: MEDIUM
- **Mitigation**: Clean migration scripts, rollback testing
- **Contingency**: Manual migration, data recovery procedures

### Medium-Risk Areas

**Risk 4: Cross-Package Dependency Management**
- **Likelihood**: MEDIUM
- **Impact**: MEDIUM
- **Mitigation**: Workspace dependency pinning, integration testing
- **Contingency**: Version lock, dependency isolation

**Risk 5: API Compatibility**
- **Likelihood**: LOW
- **Impact**: MEDIUM
- **Mitigation**: Semantic versioning, backward compatibility tests
- **Contingency**: API versioning, deprecation warnings

---

## SUCCESS CRITERIA

### Implementation Success Criteria
- All 8 MCP tools registered and functional
- Framework detection works for Next.js App Router, Pages Router, and Vite
- Screen creation generates valid, compilable code
- Active theme integration works with existing theme system
- Test coverage greater than or equal to 85% for all new code

### Quality Success Criteria
- All tool invocations complete in less than 2 seconds
- Error messages are actionable and clear
- Generated code follows project conventions
- No file corruption during link injection

### Integration Success Criteria
- MCP tools accessible from AI assistants (Claude, etc.)
- Settings API integrates with existing studio-api
- Frontend theme selection works with active theme system
- All existing tests continue to pass

---

## REFERENCES

- [SPEC-COMPONENT-001: Hook Component Integration System](../SPEC-COMPONENT-001/spec.md)
- [Existing MCP Server](../../packages/studio-mcp/src/server/mcp-server.ts)
- [Studio API Main](../../packages/studio-api/src/studio_api/main.py)
- [Studio Web Theme Page](../../packages/studio-web/src/app/themes/[id]/page.tsx)
- [TRUST 5 Framework](../../.claude/skills/moai-foundation-core/modules/trust-5-framework.md)

---

**Last Updated**: 2026-01-18
**Status**: Completed
**Implementation Branch**: feature/SPEC-MCP-001
