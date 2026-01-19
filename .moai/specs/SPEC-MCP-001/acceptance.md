---
id: SPEC-MCP-001
document: acceptance
version: "1.0.0"
created: "2026-01-18"
updated: "2026-01-18"
---

# SPEC-MCP-001 Acceptance Criteria

## Overview

This document defines the acceptance criteria for the Tekton MCP Server Natural Language Screen Generation feature using Given/When/Then (Gherkin) format.

---

## AC-001: MCP Tool Registration

**Requirement**: U-001 (Tool Registration)

### Scenario: All tools are registered in MCP server

```gherkin
Given the studio-mcp server is initialized
When I send a GET request to /tools endpoint
Then I should receive a response with status 200
And the response should contain 8 new tools:
  | Tool Name                |
  | screen.create            |
  | screen.addComponent      |
  | screen.applyArchetype    |
  | screen.list              |
  | screen.preview           |
  | project.detectStructure  |
  | project.getActivePreset  |
  | project.setActivePreset  |
And each tool should have a valid inputSchema property
```

### Scenario: Tool discovery includes all existing tools

```gherkin
Given the studio-mcp server is running
When I send a GET request to /tools endpoint
Then I should receive all 15 tools (7 existing + 8 new)
And the existing component tools should remain unchanged
```

---

## AC-002: Input Schema Validation

**Requirement**: U-002 (Input Validation)

### Scenario: Valid input passes validation

```gherkin
Given the studio-mcp server is running
When I invoke screen.create with valid parameters:
  | Parameter   | Value                         |
  | name        | user-profile                  |
  | intent      | User profile page with avatar |
  | targetPath  | /users/profile                |
Then the tool should execute without validation errors
And I should receive a success response
```

### Scenario: Missing required parameter fails validation

```gherkin
Given the studio-mcp server is running
When I invoke screen.create with missing required parameter:
  | Parameter   | Value          |
  | name        | user-profile   |
  | targetPath  | /users/profile |
Then I should receive an error response with status 400
And the error message should indicate "intent is required"
```

### Scenario: Invalid parameter type fails validation

```gherkin
Given the studio-mcp server is running
When I invoke project.setActivePreset with invalid presetId:
  | Parameter | Value    |
  | presetId  | "string" |
Then I should receive an error response
And the error message should indicate "presetId must be an integer"
```

---

## AC-003: Error Response Consistency

**Requirement**: U-003 (Error Response Format)

### Scenario: Tool not found returns consistent error

```gherkin
Given the studio-mcp server is running
When I invoke a non-existent tool "screen.nonexistent"
Then I should receive status 404
And the response should have format:
  """
  {
    "error": "Tool not found: screen.nonexistent"
  }
  """
```

### Scenario: Tool execution error returns consistent format

```gherkin
Given the studio-mcp server is running
And the project path does not exist
When I invoke project.detectStructure with:
  | Parameter   | Value                    |
  | projectPath | /nonexistent/project/path |
Then I should receive a response with:
  """
  {
    "success": false,
    "error": "Project path does not exist: /nonexistent/project/path"
  }
  """
```

---

## AC-004: Framework Detection Accuracy

**Requirement**: U-004 (Framework Detection)

### Scenario: Detect Next.js App Router project

```gherkin
Given a project directory with the following structure:
  | File                  |
  | package.json          |
  | app/layout.tsx        |
  | app/page.tsx          |
  | app/globals.css       |
When I invoke project.detectStructure with the project path
Then I should receive:
  | Field          | Value                |
  | frameworkType  | next-app             |
  | appDirectory   | {projectPath}/app    |
  | pagesDirectory | null                 |
```

### Scenario: Detect Next.js Pages Router project

```gherkin
Given a project directory with the following structure:
  | File                  |
  | package.json          |
  | pages/_app.tsx        |
  | pages/index.tsx       |
When I invoke project.detectStructure with the project path
Then I should receive:
  | Field          | Value                  |
  | frameworkType  | next-pages             |
  | appDirectory   | null                   |
  | pagesDirectory | {projectPath}/pages    |
```

### Scenario: Detect Vite project

```gherkin
Given a project directory with the following structure:
  | File            |
  | package.json    |
  | vite.config.ts  |
  | src/main.tsx    |
When I invoke project.detectStructure with the project path
Then I should receive:
  | Field          | Value               |
  | frameworkType  | vite                |
  | srcDirectory   | {projectPath}/src   |
```

### Scenario: Unknown framework detection

```gherkin
Given a project directory with only package.json
When I invoke project.detectStructure with the project path
Then I should receive:
  | Field         | Value   |
  | frameworkType | unknown |
```

---

## AC-005: Screen Creation Workflow

**Requirement**: E-001 (Screen Creation)

### Scenario: Create screen in Next.js App Router project

```gherkin
Given a Next.js App Router project at /test/project
And the framework has been detected
When I invoke screen.create with:
  | Parameter   | Value                         |
  | name        | user-profile                  |
  | intent      | User profile page with avatar |
  | targetPath  | /users/profile                |
Then a file should be created at /test/project/app/users/profile/page.tsx
And the file should contain:
  """
  'use client';

  export default function UserProfilePage() {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        {/* User profile page with avatar */}
      </div>
    );
  }
  """
And I should receive success response with screen metadata
```

### Scenario: Create screen with link injection

```gherkin
Given a Next.js App Router project at /test/project
And a parent page exists at /test/project/app/users/page.tsx
When I invoke screen.create with:
  | Parameter   | Value                                                           |
  | name        | user-profile                                                    |
  | intent      | User profile page                                               |
  | targetPath  | /users/profile                                                  |
  | linkFrom    | { "page": "/users", "label": "View Profile", "description": "Navigate to user profile" } |
Then the parent page should contain a Link component:
  """
  <Link href="/users/profile">View Profile</Link>
  """
And the parent page should have Link import from 'next/link'
```

### Scenario: Screen name conflict detection

```gherkin
Given a Next.js App Router project at /test/project
And a screen already exists at /test/project/app/dashboard/page.tsx
When I invoke screen.create with:
  | Parameter   | Value      |
  | name        | dashboard  |
  | intent      | Main dash  |
  | targetPath  | /dashboard |
Then I should receive an error response:
  """
  {
    "success": false,
    "error": "Screen already exists at /dashboard. Use a different name or path."
  }
  """
```

---

## AC-006: Component Addition Workflow

**Requirement**: E-002 (Component Addition)

### Scenario: Add component to existing screen

```gherkin
Given a screen exists at /test/project/app/dashboard/page.tsx
When I invoke screen.addComponent with:
  | Parameter     | Value       |
  | screenName    | dashboard   |
  | componentType | useButton   |
Then the screen file should be updated with:
  - Import statement for Button component
  - Button component in the render section
And the file should remain valid TypeScript
```

### Scenario: Add component with custom props

```gherkin
Given a screen exists at /test/project/app/settings/page.tsx
When I invoke screen.addComponent with:
  | Parameter     | Value                              |
  | screenName    | settings                           |
  | componentType | useTextField                       |
  | props         | {"label": "Email", "type": "email"}|
Then the screen file should contain:
  """
  <TextField label="Email" type="email" />
  """
```

### Scenario: Add component to non-existent screen fails

```gherkin
Given no screen exists with name "nonexistent"
When I invoke screen.addComponent with:
  | Parameter     | Value        |
  | screenName    | nonexistent  |
  | componentType | useButton    |
Then I should receive an error response:
  """
  {
    "success": false,
    "error": "Screen not found: nonexistent"
  }
  """
```

---

## AC-007: Component Application Workflow

**Requirement**: E-003 (Component Application)

### Scenario: Apply Professional component to screen

```gherkin
Given a screen exists at /test/project/app/dashboard/page.tsx
When I invoke screen.applyArchetype with:
  | Parameter     | Value        |
  | screenName    | dashboard    |
  | archetypeName | Professional |
Then the screen should have CSS variable references for Professional component:
  - --tekton-primary-500
  - --tekton-neutral-50
  - Professional color palette applied
And I should receive success response
```

### Scenario: Apply all 7 components successfully

```gherkin
Given a screen exists at /test/project/app/test/page.tsx
When I invoke screen.applyArchetype with each component:
  | Component      |
  | Professional   |
  | Creative       |
  | Minimal        |
  | Bold           |
  | Warm           |
  | Cool           |
  | High-Contrast  |
Then each application should succeed
And each component should apply unique styling
```

### Scenario: Invalid component name fails

```gherkin
Given a screen exists at /test/project/app/dashboard/page.tsx
When I invoke screen.applyArchetype with:
  | Parameter     | Value      |
  | screenName    | dashboard  |
  | archetypeName | InvalidArch|
Then I should receive an error response:
  """
  {
    "success": false,
    "error": "Invalid component name: InvalidArch. Valid options: Professional, Creative, Minimal, Bold, Warm, Cool, High-Contrast"
  }
  """
```

---

## AC-008: Project Structure Detection

**Requirement**: E-004 (Structure Detection)

### Scenario: Detect project with all configuration files

```gherkin
Given a project directory with:
  | File                    |
  | package.json            |
  | tsconfig.json           |
  | next.config.js          |
  | app/layout.tsx          |
When I invoke project.detectStructure with the project path
Then I should receive configFiles array containing:
  | Config File      |
  | package.json     |
  | tsconfig.json    |
  | next.config.js   |
And frameworkType should be "next-app"
```

### Scenario: Handle symlinked directories

```gherkin
Given a project directory with symlinked node_modules
When I invoke project.detectStructure with the project path
Then detection should complete without following symlinks
And I should receive valid framework detection result
```

---

## AC-009: Active Theme Retrieval

**Requirement**: E-005 (Active Theme Get)

### Scenario: Get active theme when set

```gherkin
Given project settings exist with active_preset_id = 5
And theme with id 5 exists with name "Professional Dark"
When I invoke project.getActivePreset
Then I should receive:
  """
  {
    "success": true,
    "data": {
      "id": 5,
      "name": "Professional Dark",
      "category": "Professional",
      "config": {...}
    }
  }
  """
```

### Scenario: Get active theme when not set

```gherkin
Given project settings exist with active_preset_id = null
When I invoke project.getActivePreset
Then I should receive:
  """
  {
    "success": true,
    "data": null
  }
  """
```

### Scenario: Get active theme for new project

```gherkin
Given no project settings exist for the current project
When I invoke project.getActivePreset
Then project settings should be created with active_preset_id = null
And I should receive:
  """
  {
    "success": true,
    "data": null
  }
  """
```

---

## AC-010: Active Theme Update

**Requirement**: E-006 (Active Theme Set)

### Scenario: Set valid active theme

```gherkin
Given a theme exists with id = 3
When I invoke project.setActivePreset with:
  | Parameter | Value |
  | presetId  | 3     |
Then project_settings.active_preset_id should be updated to 3
And I should receive:
  """
  {
    "success": true,
    "data": true
  }
  """
```

### Scenario: Set active theme with invalid ID

```gherkin
Given no theme exists with id = 999
When I invoke project.setActivePreset with:
  | Parameter | Value |
  | presetId  | 999   |
Then I should receive:
  """
  {
    "success": false,
    "error": "Theme not found: 999"
  }
  """
And project_settings should remain unchanged
```

### Scenario: Clear active theme

```gherkin
Given project settings have active_preset_id = 5
When I invoke project.setActivePreset with:
  | Parameter | Value |
  | presetId  | null  |
Then project_settings.active_preset_id should be set to null
And I should receive success response
```

---

## AC-011: Framework-Specific Generation

**Requirement**: S-001 (Framework Conditional)

### Scenario: Next.js App Router generates correct structure

```gherkin
Given project framework is detected as "next-app"
When I invoke screen.create with targetPath "/admin/users"
Then file should be created at app/admin/users/page.tsx
And file should use 'use client' directive
And file should export default function
```

### Scenario: Next.js Pages Router generates correct structure

```gherkin
Given project framework is detected as "next-pages"
When I invoke screen.create with targetPath "/admin/users"
Then file should be created at pages/admin/users.tsx
And file should not have 'use client' directive
And file should export default function
```

### Scenario: Vite generates correct structure

```gherkin
Given project framework is detected as "vite"
When I invoke screen.create with targetPath "/admin/users"
Then file should be created at src/pages/admin/users.tsx
And router configuration should be updated
```

---

## AC-012: Link Injection Conditional

**Requirement**: S-002 (Link Injection)

### Scenario: Link injection with existing parent

```gherkin
Given parent page exists at app/users/page.tsx
And parent page has existing content
When I invoke screen.create with linkFrom = { "page": "/users", "label": "Profile" }
Then parent page should have Link import added
And Link component should be added without removing existing content
And parent page should remain valid TypeScript
```

### Scenario: Link injection with missing parent

```gherkin
Given no parent page exists at app/admin/page.tsx
When I invoke screen.create with linkFrom = { "page": "/admin", "label": "Settings" }
Then screen should be created successfully
And response should include warning:
  """
  "warning": "Parent page not found at /admin. Link injection skipped."
  """
```

### Scenario: Link already exists in parent

```gherkin
Given parent page exists at app/users/page.tsx
And parent page already contains Link to /users/profile
When I invoke screen.create with linkFrom = { "page": "/users", "label": "Profile" } and targetPath = "/users/profile"
Then no duplicate link should be added
And response should indicate link already exists
```

---

## AC-013: Screen List Functionality

**Requirement**: E-007 (Screen List)

### Scenario: List all screens in project

```gherkin
Given a Next.js App Router project with screens:
  | Screen Path              |
  | app/page.tsx             |
  | app/users/page.tsx       |
  | app/users/[id]/page.tsx  |
  | app/settings/page.tsx    |
When I invoke screen.list
Then I should receive:
  """
  {
    "success": true,
    "data": [
      {"name": "home", "path": "/", "type": "static"},
      {"name": "users", "path": "/users", "type": "static"},
      {"name": "user-detail", "path": "/users/[id]", "type": "dynamic"},
      {"name": "settings", "path": "/settings", "type": "static"}
    ]
  }
  """
```

### Scenario: List screens in empty project

```gherkin
Given a Next.js App Router project with no screen files
When I invoke screen.list
Then I should receive:
  """
  {
    "success": true,
    "data": []
  }
  """
```

---

## AC-014: Screen Preview Functionality

**Requirement**: E-008 (Screen Preview)

### Scenario: Get preview URL for existing screen

```gherkin
Given a screen exists with name "dashboard"
And the dev server is running on port 3000
When I invoke screen.preview with screenName = "dashboard"
Then I should receive:
  """
  {
    "success": true,
    "data": {
      "previewUrl": "http://localhost:3000/dashboard"
    }
  }
  """
```

### Scenario: Get preview URL for non-existent screen

```gherkin
Given no screen exists with name "nonexistent"
When I invoke screen.preview with screenName = "nonexistent"
Then I should receive:
  """
  {
    "success": false,
    "error": "Screen not found: nonexistent"
  }
  """
```

---

## AC-015: Settings API Endpoints

**Requirement**: API Integration

### Scenario: PUT /settings/active-theme

```gherkin
Given the studio-api server is running
When I send PUT request to /api/v2/settings/active-theme with:
  """
  {
    "preset_id": 5,
    "project_path": "/test/project"
  }
  """
Then I should receive status 200
And response should contain updated active_preset
```

### Scenario: GET /settings/active-theme

```gherkin
Given the studio-api server is running
And project settings exist for "/test/project"
When I send GET request to /api/v2/settings/active-theme?project_path=/test/project
Then I should receive status 200
And response should contain active_preset or null
```

### Scenario: GET /settings/project

```gherkin
Given the studio-api server is running
When I send GET request to /api/v2/settings/project?project_path=/test/project
Then I should receive status 200
And response should contain complete project settings
```

---

## AC-016: Frontend Integration

**Requirement**: M5 (UI Integration)

### Scenario: "Set as Active" button displays correctly

```gherkin
Given I am viewing a theme detail page
And the theme is not currently active
When the page renders
Then I should see a "Set as Active" button
And the button should be enabled
```

### Scenario: Setting active theme updates UI

```gherkin
Given I am viewing a theme detail page
When I click the "Set as Active" button
Then the button should show loading state
And after success, the button should change to "Active Theme"
And a success toast should appear
```

### Scenario: Active theme indicator shows correctly

```gherkin
Given a theme is set as active for the current project
When I navigate to the theme gallery
Then the active theme card should have an "Active" badge
And the badge should use distinct styling
```

---

## Quality Gate Criteria

### Test Coverage Gate

```gherkin
Given all acceptance criteria tests pass
When test coverage is calculated
Then coverage should be greater than or equal to 85% for:
  | Package     | Coverage Requirement |
  | studio-mcp  | >= 85%              |
  | studio-api  | >= 85%              |
  | studio-web  | >= 80%              |
```

### Performance Gate

```gherkin
Given the system is under normal load
When any MCP tool is invoked
Then response time should be less than 2000ms
And screen creation should complete in less than 5000ms
```

### Security Gate

```gherkin
Given malicious input is provided
When project.detectStructure is invoked with path traversal:
  | Parameter   | Value               |
  | projectPath | /../../../etc/passwd |
Then the request should be rejected
And no sensitive files should be accessed
```

---

## Definition of Done

- All acceptance criteria scenarios pass
- Test coverage greater than or equal to 85% for new code
- No TypeScript errors in strict mode
- No ESLint/Ruff warnings
- All existing tests continue to pass
- Documentation updated with tool usage examples
- Code reviewed and approved
- Integration tests pass in CI/CD pipeline

---

**Last Updated**: 2026-01-18
**Status**: Ready for Implementation
**Traceability**: All scenarios map to SPEC-MCP-001 requirements
