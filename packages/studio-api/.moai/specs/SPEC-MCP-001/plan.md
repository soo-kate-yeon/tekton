---
id: SPEC-MCP-001
document: plan
version: "1.0.0"
created: "2026-01-18"
updated: "2026-01-18"
---

# SPEC-MCP-001 Implementation Plan

## Overview

This plan outlines the implementation approach for the Tekton MCP Server Natural Language Screen Generation feature. The implementation is divided into 5 milestones with clear deliverables and dependencies.

---

## Implementation Phases

### Milestone 1: Project Infrastructure Setup (Primary Goal)

**Objective**: Establish database schema, API endpoints, and MCP tool registration infrastructure.

**Deliverables**:
1. Database migration for `project_settings` table
2. Settings API endpoints in studio-api
3. MCP tool registration framework extension
4. Basic project structure detection

**Files to Create/Modify**:

| File | Action | Description |
|------|--------|-------------|
| `packages/studio-api/migrations/versions/add_project_settings.py` | CREATE | Alembic migration for project_settings table |
| `packages/studio-api/src/studio_api/models/project_settings.py` | CREATE | SQLAlchemy model for ProjectSettings |
| `packages/studio-api/src/studio_api/schemas/project_settings.py` | CREATE | Pydantic schemas for settings requests/responses |
| `packages/studio-api/src/studio_api/repositories/project_settings.py` | CREATE | Repository for project settings CRUD |
| `packages/studio-api/src/studio_api/api/v2/settings.py` | CREATE | Settings router with endpoints |
| `packages/studio-api/src/studio_api/main.py` | MODIFY | Include settings router |
| `packages/studio-mcp/src/project/detector.ts` | CREATE | Project structure detection logic |
| `packages/studio-mcp/src/project/types.ts` | CREATE | TypeScript interfaces for project tools |

**Technical Approach**:

1. **Database Migration**:
   ```python
   # Alembic migration
   def upgrade():
       op.create_table(
           'project_settings',
           sa.Column('id', sa.Integer(), primary_key=True),
           sa.Column('project_path', sa.String(500), unique=True, nullable=False),
           sa.Column('active_preset_id', sa.Integer(), sa.ForeignKey('curated_presets.id', ondelete='SET NULL')),
           sa.Column('framework_type', sa.String(50)),
           sa.Column('detected_at', sa.DateTime(timezone=True)),
           sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
           sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
       )
       op.create_index('idx_project_settings_path', 'project_settings', ['project_path'])
   ```

2. **Framework Detection Algorithm**:
   ```typescript
   // Detection priority
   const detectionRules = [
     { marker: 'app/layout.tsx', framework: 'next-app' },
     { marker: 'app/layout.js', framework: 'next-app' },
     { marker: 'pages/_app.tsx', framework: 'next-pages' },
     { marker: 'pages/_app.js', framework: 'next-pages' },
     { marker: 'vite.config.ts', framework: 'vite' },
     { marker: 'vite.config.js', framework: 'vite' },
   ];
   ```

**Dependencies**: None (foundational milestone)

**Success Criteria**:
- Migration runs successfully on PostgreSQL and SQLite
- Settings API endpoints return correct responses
- Framework detection identifies all supported project types
- Unit tests achieve greater than or equal to 85% coverage

---

### Milestone 2: Project Tools Implementation (Primary Goal)

**Objective**: Implement all three project tools with full MCP integration.

**Deliverables**:
1. `project.detectStructure` tool
2. `project.getActivePreset` tool
3. `project.setActivePreset` tool
4. Integration tests with studio-api

**Files to Create/Modify**:

| File | Action | Description |
|------|--------|-------------|
| `packages/studio-mcp/src/project/tools.ts` | CREATE | Project tool implementations |
| `packages/studio-mcp/src/server/mcp-server.ts` | MODIFY | Add project tools to TOOLS array and executeTool |
| `packages/studio-mcp/tests/project/tools.test.ts` | CREATE | Project tools unit tests |
| `packages/studio-mcp/tests/project/detector.test.ts` | CREATE | Detector unit tests |

**Technical Approach**:

1. **Project Tools Class**:
   ```typescript
   export class ProjectTools {
     private apiBaseUrl: string;

     constructor(apiBaseUrl: string = 'http://localhost:8000') {
       this.apiBaseUrl = apiBaseUrl;
     }

     async detectStructure(projectPath: string): Promise<ToolResult<ProjectStructure>> {
       // File system analysis
     }

     async getActivePreset(): Promise<ToolResult<PresetResponse | null>> {
       // API call to studio-api
     }

     async setActivePreset(presetId: number, projectPath: string): Promise<ToolResult<boolean>> {
       // API call to studio-api
     }
   }
   ```

2. **MCP Tool Registration**:
   ```typescript
   // Add to TOOLS array
   {
     name: "project.detectStructure",
     description: "Detect project structure and framework type.",
     inputSchema: {
       type: "object",
       properties: {
         projectPath: { type: "string", description: "Path to project root" }
       },
       required: ["projectPath"]
     }
   }
   ```

**Dependencies**: Milestone 1 (database and API infrastructure)

**Success Criteria**:
- All three project tools registered in MCP server
- API integration works correctly
- Framework detection returns accurate results
- Test coverage greater than or equal to 85%

---

### Milestone 3: Screen Tools Core Implementation (Secondary Goal)

**Objective**: Implement screen creation and component addition tools.

**Deliverables**:
1. `screen.create` tool
2. `screen.addComponent` tool
3. Template-based code generation system
4. Link injection mechanism

**Files to Create/Modify**:

| File | Action | Description |
|------|--------|-------------|
| `packages/studio-mcp/src/screen/tools.ts` | CREATE | Screen tool implementations |
| `packages/studio-mcp/src/screen/templates.ts` | CREATE | Screen generation templates |
| `packages/studio-mcp/src/screen/types.ts` | CREATE | TypeScript interfaces for screen tools |
| `packages/studio-mcp/src/routing/linker.ts` | CREATE | Link injection logic |
| `packages/studio-mcp/src/server/mcp-server.ts` | MODIFY | Add screen tools to TOOLS array |
| `packages/studio-mcp/tests/screen/tools.test.ts` | CREATE | Screen tools unit tests |
| `packages/studio-mcp/tests/routing/linker.test.ts` | CREATE | Link injection tests |

**Technical Approach**:

1. **Screen Tools Class**:
   ```typescript
   export class ScreenTools {
     private projectTools: ProjectTools;
     private archetypeTools: ArchetypeTools;

     async create(params: ScreenCreateParams): Promise<ToolResult<ScreenMetadata>> {
       // 1. Detect project structure
       // 2. Generate screen template
       // 3. Write file to correct directory
       // 4. Optionally inject link into parent
       // 5. Return metadata
     }

     async addComponent(params: AddComponentParams): Promise<ToolResult<boolean>> {
       // 1. Read existing screen file
       // 2. Parse and add component
       // 3. Update imports
       // 4. Write updated file
     }
   }
   ```

2. **Template Generation**:
   ```typescript
   // Next.js App Router template
   const appRouterTemplate = (screenName: string, intent: string) => `
   'use client';

   import React from 'react';

   export default function ${toPascalCase(screenName)}Page() {
     return (
       <div className="container mx-auto px-4 py-8">
         <h1 className="text-2xl font-bold mb-4">${toTitleCase(screenName)}</h1>
         {/* ${intent} */}
       </div>
     );
   }
   `;
   ```

3. **Link Injection**:
   ```typescript
   // AST-based approach for safety
   interface LinkFromConfig {
     page: string;         // Parent page path
     label: string;        // Link text label
     description?: string; // Optional link description
   }

   async function injectLink(parentPath: string, linkConfig: LinkFromConfig, targetPath: string): Promise<boolean> {
     const sourceCode = await fs.readFile(parentPath, 'utf-8');
     // Use ts-morph or @babel/parser for safe AST manipulation
     // Add Link import if not present
     // Find appropriate location and inject Link component with label
     // <Link href={targetPath}>{linkConfig.label}</Link>
     return true;
   }
   ```

**Dependencies**: Milestone 2 (project detection for correct paths)

**Success Criteria**:
- Screen creation generates valid TypeScript/JSX
- Generated code compiles without errors
- Link injection works without corrupting files
- Test coverage greater than or equal to 85%

---

### Milestone 4: Screen Tools Extended Implementation (Secondary Goal)

**Objective**: Implement remaining screen tools and component integration.

**Deliverables**:
1. `screen.applyArchetype` tool
2. `screen.list` tool
3. `screen.preview` tool
4. Full component system integration

**Files to Create/Modify**:

| File | Action | Description |
|------|--------|-------------|
| `packages/studio-mcp/src/screen/tools.ts` | MODIFY | Add remaining tool implementations |
| `packages/studio-mcp/src/screen/component-applier.ts` | CREATE | Component application logic |
| `packages/studio-mcp/src/screen/scanner.ts` | CREATE | Project screen scanner |
| `packages/studio-mcp/src/server/mcp-server.ts` | MODIFY | Add remaining screen tools |
| `packages/studio-mcp/tests/screen/component-applier.test.ts` | CREATE | Component application tests |
| `packages/studio-mcp/tests/screen/scanner.test.ts` | CREATE | Screen scanner tests |

**Technical Approach**:

1. **Component Application**:
   ```typescript
   async applyArchetype(screenName: string, archetypeName: string): Promise<ToolResult<boolean>> {
     // 1. Load component rules from component-system
     // 2. Read existing screen file
     // 3. Apply CSS variable updates
     // 4. Update component styling
     // 5. Write updated file
   }
   ```

2. **Screen Listing**:
   ```typescript
   async list(): Promise<ToolResult<ScreenMetadata[]>> {
     // 1. Detect project structure
     // 2. Scan app/pages directory recursively
     // 3. Filter for page files (page.tsx, [slug].tsx, etc.)
     // 4. Extract metadata (name, path, components)
     // 5. Return list
   }
   ```

3. **Preview URL Generation**:
   ```typescript
   async preview(screenName: string): Promise<ToolResult<string>> {
     // 1. Resolve screen path
     // 2. Generate dev server URL
     // 3. Return preview URL
   }
   ```

**Dependencies**: Milestone 3, SPEC-COMPONENT-001 (component system)

**Success Criteria**:
- All 7 style components apply correctly
- Screen listing returns accurate metadata
- Preview URLs resolve correctly
- Test coverage greater than or equal to 85%

---

### Milestone 5: Frontend Integration and Polish (Final Goal)

**Objective**: Integrate active theme selection into studio-web and finalize documentation.

**Deliverables**:
1. "Set as Active" button on theme detail page
2. Active theme indicator in UI
3. Integration tests across all packages
4. Documentation updates

**Files to Create/Modify**:

| File | Action | Description |
|------|--------|-------------|
| `packages/studio-web/src/app/themes/[id]/page.tsx` | MODIFY | Add "Set as Active" button |
| `packages/studio-web/src/hooks/useActivePreset.ts` | CREATE | Active theme hooks |
| `packages/studio-web/src/components/themes/ActivePresetIndicator.tsx` | CREATE | Active indicator component |
| `packages/studio-api/tests/api/test_settings.py` | CREATE | Settings API integration tests |
| `packages/studio-mcp/tests/integration/full-workflow.test.ts` | CREATE | End-to-end integration tests |

**Technical Approach**:

1. **Active Theme Hook**:
   ```typescript
   export function useActivePreset(projectPath: string) {
     return useQuery({
       queryKey: ['activePreset', projectPath],
       queryFn: () => fetchActivePreset(projectPath),
     });
   }

   export function useSetActivePreset() {
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: setActivePreset,
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['activePreset'] });
       },
     });
   }
   ```

2. **UI Integration**:
   ```tsx
   // In theme detail page
   const setActivePreset = useSetActivePreset();

   <Button
     onClick={() => setActivePreset.mutate({ presetId: theme.id })}
     disabled={setActivePreset.isPending}
   >
     {isActive ? 'Active Theme' : 'Set as Active'}
   </Button>
   ```

**Dependencies**: Milestones 1-4

**Success Criteria**:
- "Set as Active" button works correctly
- Active theme persists across sessions
- Full workflow integration test passes
- All tests pass with greater than or equal to 85% coverage

---

## Task Decomposition for TDD

### Milestone 1 Tasks

| Task ID | Task Description | Test First | Estimated Complexity |
|---------|-----------------|------------|---------------------|
| M1-T1 | Create project_settings Alembic migration | Migration test | Low |
| M1-T2 | Implement ProjectSettings SQLAlchemy model | Model test | Low |
| M1-T3 | Create ProjectSettings Pydantic schemas | Schema validation test | Low |
| M1-T4 | Implement ProjectSettingsRepository | Repository CRUD tests | Medium |
| M1-T5 | Create settings router with PUT/GET endpoints | API endpoint tests | Medium |
| M1-T6 | Implement project detector module | Detection accuracy tests | Medium |
| M1-T7 | Add settings router to main.py | Router integration test | Low |

### Milestone 2 Tasks

| Task ID | Task Description | Test First | Estimated Complexity |
|---------|-----------------|------------|---------------------|
| M2-T1 | Implement project.detectStructure tool | Structure detection tests | Medium |
| M2-T2 | Implement project.getActivePreset tool | API call tests | Low |
| M2-T3 | Implement project.setActivePreset tool | API call tests | Low |
| M2-T4 | Add project tools to MCP TOOLS array | Tool registration tests | Low |
| M2-T5 | Implement executeTool switch cases | Tool execution tests | Low |
| M2-T6 | Add Zod input validation | Validation tests | Low |

### Milestone 3 Tasks

| Task ID | Task Description | Test First | Estimated Complexity |
|---------|-----------------|------------|---------------------|
| M3-T1 | Create screen generation templates | Template output tests | Medium |
| M3-T2 | Implement screen.create tool | Screen creation tests | High |
| M3-T3 | Implement screen.addComponent tool | Component addition tests | High |
| M3-T4 | Create link injection module | AST injection tests | High |
| M3-T5 | Add screen tools to MCP TOOLS array | Tool registration tests | Low |
| M3-T6 | Implement path resolution for frameworks | Path resolution tests | Medium |

### Milestone 4 Tasks

| Task ID | Task Description | Test First | Estimated Complexity |
|---------|-----------------|------------|---------------------|
| M4-T1 | Create component applier module | Component application tests | Medium |
| M4-T2 | Implement screen.applyArchetype tool | Style application tests | Medium |
| M4-T3 | Create screen scanner module | Scanner accuracy tests | Medium |
| M4-T4 | Implement screen.list tool | List completeness tests | Low |
| M4-T5 | Implement screen.preview tool | URL generation tests | Low |
| M4-T6 | Integrate with component-system package | Integration tests | Medium |

### Milestone 5 Tasks

| Task ID | Task Description | Test First | Estimated Complexity |
|---------|-----------------|------------|---------------------|
| M5-T1 | Create useActivePreset hook | Hook behavior tests | Low |
| M5-T2 | Add "Set as Active" button to theme page | Component render tests | Low |
| M5-T3 | Create ActivePresetIndicator component | Indicator display tests | Low |
| M5-T4 | Create full workflow integration test | E2E workflow tests | High |
| M5-T5 | Update documentation | N/A | Low |

---

## Technical Architecture

### Package Relationships

```
studio-mcp (MCP Server)
    |
    +-- project/
    |     +-- detector.ts      (Framework detection)
    |     +-- tools.ts         (Project tool implementations)
    |     +-- types.ts         (TypeScript interfaces)
    |
    +-- screen/
    |     +-- tools.ts         (Screen tool implementations)
    |     +-- templates.ts     (Code generation templates)
    |     +-- scanner.ts       (Project screen scanner)
    |     +-- component-applier.ts (Style application)
    |     +-- types.ts         (TypeScript interfaces)
    |
    +-- routing/
    |     +-- linker.ts        (Link injection)
    |
    +-- server/
          +-- mcp-server.ts    (Extended with new tools)

studio-api (Backend API)
    |
    +-- models/
    |     +-- project_settings.py
    |
    +-- schemas/
    |     +-- project_settings.py
    |
    +-- repositories/
    |     +-- project_settings.py
    |
    +-- api/v2/
          +-- settings.py      (New router)

studio-web (Frontend)
    |
    +-- hooks/
    |     +-- useActivePreset.ts
    |
    +-- components/themes/
          +-- ActivePresetIndicator.tsx
```

### Data Flow

```
AI Assistant
     |
     v
MCP Tool Invocation (screen.create)
     |
     v
studio-mcp (Tool Handler)
     |
     +-- project.detectStructure
     |         |
     |         v
     |    File System Analysis
     |
     +-- project.getActivePreset
     |         |
     |         v
     |    studio-api (GET /settings/active-theme)
     |         |
     |         v
     |    project_settings table
     |
     +-- screen.create
               |
               +-- Generate template
               +-- Write to file system
               +-- Inject link (optional)
               |
               v
          Return success/metadata
```

---

## Risk Mitigation

### File System Safety

1. **Backup Strategy**: Create `.bak` files before any modifications
2. **Atomic Writes**: Use temp file + rename pattern
3. **Validation**: Compile generated TypeScript before finalizing

### Database Safety

1. **Migration Testing**: Test on SQLite before PostgreSQL
2. **Rollback Scripts**: Include downgrade in all migrations
3. **Foreign Key Safety**: Use ON DELETE SET NULL for theme references

### API Safety

1. **Input Validation**: Zod schemas on all inputs
2. **Path Sanitization**: Prevent directory traversal attacks
3. **Rate Limiting**: Consider for production deployment

---

## Quality Gates

### Per-Milestone Gates

1. **Test Coverage**: Greater than or equal to 85% for new code
2. **Type Safety**: No TypeScript errors with strict mode
3. **Linting**: Zero ESLint/Ruff warnings
4. **Integration**: Existing tests continue to pass

### Final Release Gate

1. **Full Integration Test**: Complete workflow passes
2. **Documentation**: All tools documented with examples
3. **Performance**: Tool execution under 2 seconds
4. **Security**: Path sanitization verified

---

## Recommendations

### Immediate Actions

1. Start with Milestone 1 to establish infrastructure
2. Use TDD approach with test-first development
3. Create integration tests early to catch cross-package issues

### Technical Decisions

1. Use ts-morph for AST manipulation (safer than regex)
2. Use httpx for async API calls from MCP server
3. Consider caching for framework detection results

### Future Considerations

1. Add WebSocket support for real-time preview updates
2. Consider screen versioning for rollback support
3. Evaluate integration with external code formatters (Prettier)

---

**Last Updated**: 2026-01-18
**Status**: Ready for Implementation
**Next Step**: `/moai:2-run SPEC-MCP-001` to begin Milestone 1
