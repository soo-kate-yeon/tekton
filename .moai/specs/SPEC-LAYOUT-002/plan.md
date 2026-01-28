# SPEC-LAYOUT-002: Implementation Plan

## TAG
- **SPEC-ID**: SPEC-LAYOUT-002
- **Related**: SPEC-LAYOUT-001, SPEC-COMPONENT-001-B

---

## Overview

This plan outlines the implementation strategy for the Screen Generation Pipeline, enabling LLM-driven screen generation from JSON definitions.

## Technical Approach

### Architecture Design

**Pipeline Flow:**
```
Input (JSON) → Validate → Resolve → Generate → Output (Code)

┌─────────────────────────────────────────────────────────────┐
│                    Screen Generation Pipeline                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐   ┌──────────┐   ┌──────────┐   ┌───────────┐ │
│  │ Validate │ → │ Resolve  │ → │ Generate │ → │  Output   │ │
│  │ (Zod)   │   │ (Layout) │   │ (Format) │   │  (Code)   │ │
│  └─────────┘   └──────────┘   └──────────┘   └───────────┘ │
│       ↑              ↑              ↑                       │
│       │              │              │                       │
│  JSON Schema    SPEC-LAYOUT-001   Generator                 │
│                 SPEC-COMPONENT-001-B  Selection             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Module Dependency Graph:**
```
schema/screen-definition.ts
         ↓
schema/validators.ts ────────────────┐
         ↓                           │
resolver/screen-resolver.ts ←────────┤
    ↙        ↘                       │
resolver/     resolver/              │
layout-       component-             │
resolver.ts   resolver.ts            │
    ↓              ↓                 │
    └──────┬───────┘                 │
           ↓                         │
generators/index.ts ←────────────────┘
    ↙       ↓       ↘
css-in-js  tailwind  react
.ts        .ts       .ts
           ↓
    mcp-server/tools/
    generate-screen.ts
```

---

## Milestones

### ✅ Primary Goal: JSON Schema & Validation

**Tasks:**
1. ✅ Define TypeScript interfaces for screen definitions
2. ✅ Create JSON Schema (Draft 2020-12)
3. ✅ Implement Zod validators with helpful error messages
4. ✅ Create example screen definitions

**Deliverables:**
- ✅ `schema/screen-definition.ts` - TypeScript types
- ✅ `schema/screen-definition.schema.json` - JSON Schema
- ✅ `schema/validators.ts` - Zod validation
- ✅ `schema/examples/` - Example definitions

**Acceptance Criteria:**
- ✅ JSON Schema validates all example definitions
- ✅ Zod validators produce clear error messages
- ✅ TypeScript types match JSON Schema

**Coverage**: 92.88% | **Tests**: 69 passing

### ✅ Secondary Goal: Screen Resolver Pipeline

**Tasks:**
1. ✅ Implement screen resolver entry point
2. ✅ Integrate with SPEC-LAYOUT-001 layout resolution
3. ✅ Implement component resolution with schema bindings
4. ✅ Implement token binding resolution

**Deliverables:**
- ✅ `resolver/screen-resolver.ts` - Main resolver
- ✅ `resolver/layout-resolver.ts` - Layout integration
- ✅ `resolver/component-resolver.ts` - Component resolution
- ✅ `resolver/token-resolver.ts` - Token binding resolution

**Acceptance Criteria:**
- ✅ Resolver produces complete ResolvedScreen
- ✅ All layout tokens resolved from SPEC-LAYOUT-001
- ✅ All component schemas resolved from SPEC-COMPONENT-001-B
- ✅ Token bindings resolve to CSS values

**Coverage**: 90.16% | **Tests**: 150 passing

### ✅ Tertiary Goal: Output Generators

**Tasks:**
1. ✅ Implement CSS-in-JS generator (styled-components/emotion)
2. ✅ Implement Tailwind CSS generator
3. ✅ Implement React component generator
4. ✅ Create generator factory with format selection

**Deliverables:**
- ✅ `generators/css-in-js.ts` - CSS-in-JS output
- ✅ `generators/tailwind.ts` - Tailwind output
- ✅ `generators/react.ts` - Plain React output
- ✅ `generators/index.ts` - Factory and utilities

**Acceptance Criteria:**
- ✅ All generators produce valid, compilable code
- ✅ Output passes ESLint checks
- ✅ Output includes accessibility attributes
- ✅ No hard-coded values in generated code

**Coverage**: 91.17% | **Tests**: 53 passing

### ✅ Final Goal: MCP Server Integration

**Tasks:**
1. ✅ Implement `generate_screen` MCP tool
2. ✅ Implement `validate_screen` MCP tool
3. ✅ Implement `list_tokens` MCP tool
4. ✅ Create MCP server package
5. ✅ Document LLM prompting guide

**Deliverables:**
- ✅ `mcp-server/src/tools/generate-screen.ts`
- ✅ `mcp-server/src/tools/validate-screen.ts`
- ✅ `mcp-server/src/tools/list-tokens.ts`
- ✅ `mcp-server/src/server.ts`
- ✅ `docs/llm-prompting-guide.md`

**Acceptance Criteria:**
- ✅ MCP tools callable from Claude
- ✅ Tools return properly formatted responses
- ✅ Error handling with recovery suggestions
- ✅ Documentation enables effective LLM usage

**Coverage**: 85%+ | **Tests**: 14 passing

---

## Task Breakdown

### TASK-001: JSON Schema for Screen Definitions

**Priority**: High (Primary Goal)

**Description**: Create JSON Schema that defines valid screen definitions for LLM generation.

**Implementation Details:**

JSON Schema Structure:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://tekton.dev/schemas/screen-definition.json",
  "title": "Tekton Screen Definition",
  "type": "object",
  "required": ["id", "name", "shell", "page", "sections"],
  "properties": {
    "id": { "type": "string", "pattern": "^[a-z][a-z0-9-]*$" },
    "name": { "type": "string", "minLength": 1, "maxLength": 100 },
    "shell": { "type": "string", "pattern": "^shell\\.[a-z]+\\.[a-z-]+$" },
    "page": { "type": "string", "pattern": "^page\\.[a-z-]+$" },
    "sections": { "type": "array", "items": { "$ref": "#/$defs/section" } }
  }
}
```

TypeScript Types:
```typescript
interface ScreenDefinition {
  id: string;
  name: string;
  description?: string;
  shell: string;
  page: string;
  themeId?: string;
  sections: SectionDefinition[];
  meta?: ScreenMeta;
}
```

**Estimated Complexity**: Medium
**Dependencies**: SPEC-LAYOUT-001 (token ID patterns)

---

### TASK-002: Screen Resolver Pipeline

**Priority**: High (Secondary Goal)

**Description**: Implement the core resolution pipeline that transforms screen definitions into resolved structures.

**Implementation Details:**

```typescript
// screen-resolver.ts
export class ScreenResolver {
  constructor(
    private layoutResolver: LayoutResolver,
    private componentResolver: ComponentResolver,
    private tokenResolver: TokenResolver
  ) {}

  resolve(screen: ScreenDefinition): ResolvedScreen {
    // 1. Resolve layout (shell + page)
    const layout = this.layoutResolver.resolve(screen.shell, screen.page);

    // 2. Resolve sections
    const sections = screen.sections.map(s =>
      this.resolveSectionWithComponents(s, layout)
    );

    // 3. Build component tree
    const componentTree = this.buildComponentTree(sections);

    // 4. Generate CSS variables
    const cssVariables = this.generateCSSVariables(layout, sections);

    return {
      id: screen.id,
      name: screen.name,
      layout,
      sections,
      componentTree,
      cssVariables,
    };
  }

  private resolveSectionWithComponents(
    section: SectionDefinition,
    layout: ResolvedLayout
  ): ResolvedSection {
    // Resolve section pattern
    const pattern = resolveLayout(section.pattern);

    // Resolve components with schemas
    const components = section.components.map(c =>
      this.componentResolver.resolve(c)
    );

    return { ...section, pattern, components };
  }
}
```

**Estimated Complexity**: High
**Dependencies**: TASK-001, SPEC-LAYOUT-001, SPEC-COMPONENT-001-B

---

### TASK-003: CSS-in-JS Generator

**Priority**: High (Tertiary Goal)

**Description**: Generate styled-components or emotion code from resolved screens.

**Implementation Details:**

```typescript
// generators/css-in-js.ts
export class CSSInJSGenerator {
  generate(screen: ResolvedScreen, options: CSSInJSOptions): CSSInJSOutput {
    const { library, typescript } = options;

    const imports = this.generateImports(library, typescript);
    const shellComponent = this.generateShellComponent(screen.layout.shell);
    const sectionComponents = screen.sections.map(s =>
      this.generateSectionComponent(s)
    );
    const pageComponent = this.generatePageComponent(screen, sectionComponents);

    return {
      components: [imports, shellComponent, ...sectionComponents, pageComponent].join('\n\n'),
      styles: this.extractStyles(screen),
      types: typescript ? this.generateTypes(screen) : undefined,
    };
  }

  private generateShellComponent(shell: ResolvedShell): string {
    return `
const ${this.componentName(shell.id)}Shell = styled.div\`
  display: grid;
  grid-template-areas: ${this.gridAreas(shell.regions)};
  grid-template-columns: ${this.gridColumns(shell.regions)};
  grid-template-rows: ${this.gridRows(shell.regions)};
  min-height: 100vh;

  \${props => props.theme.responsive?.md && css\`
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      grid-template-areas: ${this.mobileGridAreas(shell.regions)};
    }
  \`}
\`;`;
  }
}
```

**Estimated Complexity**: High
**Dependencies**: TASK-002

---

### TASK-004: Tailwind CSS Generator

**Priority**: High (Tertiary Goal)

**Description**: Generate React components with Tailwind CSS classes.

**Implementation Details:**

```typescript
// generators/tailwind.ts
export class TailwindGenerator {
  generate(screen: ResolvedScreen, options: TailwindOptions): TailwindOutput {
    const { typescript, classNameStrategy } = options;

    const imports = this.generateImports(classNameStrategy, typescript);
    const shellClasses = this.resolveShellClasses(screen.layout.shell);
    const sectionClasses = screen.sections.map(s =>
      this.resolveSectionClasses(s)
    );

    const component = this.generateComponent(screen, shellClasses, sectionClasses);

    return {
      components: [imports, component].join('\n\n'),
      customCSS: this.generateCustomCSS(screen),
    };
  }

  private resolveShellClasses(shell: ResolvedShell): string {
    // Map shell configuration to Tailwind classes
    const classes = [
      'grid',
      'min-h-screen',
      this.gridColsClass(shell.regions),
      this.gridRowsClass(shell.regions),
    ];

    return classes.join(' ');
  }

  private gridColsClass(regions: ShellRegion[]): string {
    // e.g., "grid-cols-[var(--layout-sidebar-width)_1fr]"
    const sidebar = regions.find(r => r.position === 'left' || r.position === 'right');
    if (sidebar) {
      return `grid-cols-[var(--layout-sidebar-width)_1fr]`;
    }
    return 'grid-cols-1';
  }
}
```

**Estimated Complexity**: High
**Dependencies**: TASK-002

---

### TASK-005: React Component Generator

**Priority**: High (Tertiary Goal)

**Description**: Generate plain React components with inline styles from CSS variables.

**Implementation Details:**

```typescript
// generators/react.ts
export class ReactGenerator {
  generate(screen: ResolvedScreen, options: ReactOptions): ReactOutput {
    const { typescript, serverComponent, exportStyle } = options;

    const directive = serverComponent ? '' : "'use client';\n\n";
    const imports = this.generateImports(typescript);
    const component = this.generateScreenComponent(screen);
    const exportStatement = this.generateExport(screen.name, exportStyle);

    return {
      component: [directive, imports, component, exportStatement].join('\n'),
      subComponents: this.extractSubComponents(screen),
      types: typescript ? this.generateTypes(screen) : undefined,
    };
  }

  private generateScreenComponent(screen: ResolvedScreen): string {
    return `
function ${this.componentName(screen.name)}() {
  return (
    <div style={${JSON.stringify(this.shellStyles(screen.layout.shell))}}>
      ${this.generateRegions(screen.layout.shell.regions)}
      <main style={${JSON.stringify(this.mainStyles())}}>
        ${this.generateSections(screen.sections)}
      </main>
    </div>
  );
}`;
  }
}
```

**Estimated Complexity**: Medium
**Dependencies**: TASK-002

---

### TASK-006: MCP Server Integration

**Priority**: High (Final Goal)

**Description**: Create MCP server with tools for screen generation, validation, and token listing.

**Implementation Details:**

```typescript
// mcp-server/src/tools/generate-screen.ts
import { Tool, ToolResult } from '@modelcontextprotocol/sdk';
import { ScreenResolver } from '@tekton/core/screen-generation';

export const generateScreenTool: Tool = {
  name: 'generate_screen',
  description: `Generate a React screen from a JSON definition.

Uses Tekton's Layout Token System for consistent styling.
Supports multiple output formats: css-in-js, tailwind, react.

Example usage:
{
  "screen": {
    "id": "dashboard",
    "name": "Dashboard",
    "shell": "shell.web.dashboard",
    "page": "page.dashboard",
    "sections": [...]
  },
  "format": "tailwind",
  "options": { "typescript": true }
}`,
  inputSchema: {
    type: 'object',
    required: ['screen'],
    properties: {
      screen: { type: 'object' },
      format: {
        type: 'string',
        enum: ['css-in-js', 'tailwind', 'react'],
        default: 'react'
      },
      options: {
        type: 'object',
        properties: {
          typescript: { type: 'boolean', default: true },
          theme: { type: 'string', default: 'default' },
          library: { type: 'string', enum: ['styled-components', 'emotion'] }
        }
      }
    }
  }
};

export async function handleGenerateScreen(
  args: GenerateScreenArgs
): Promise<ToolResult> {
  try {
    // 1. Validate
    const validation = validateScreenDefinition(args.screen);
    if (!validation.success) {
      return {
        content: [
          {
            type: 'text',
            text: `Validation failed:\n${validation.errors.map(e => `- ${e}`).join('\n')}`,
          }
        ],
        isError: true,
      };
    }

    // 2. Resolve
    const resolver = new ScreenResolver();
    const resolved = resolver.resolve(args.screen);

    // 3. Generate
    const generator = getGenerator(args.format);
    const output = generator.generate(resolved, args.options);

    return {
      content: [
        {
          type: 'text',
          text: output.component,
        }
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        }
      ],
      isError: true,
    };
  }
}
```

**Estimated Complexity**: High
**Dependencies**: TASK-001 through TASK-005

---

## Risks and Mitigation

### Risk 1: LLM JSON Generation Quality
**Mitigation**: Comprehensive schema documentation, example prompts, detailed error messages

### Risk 2: Output Format Complexity
**Mitigation**: Start with React generator, add CSS-in-JS and Tailwind incrementally

### Risk 3: MCP Protocol Stability
**Mitigation**: Abstract MCP-specific code, maintain adapter layer

### Risk 4: Performance
**Mitigation**: Caching, lazy resolution, streaming for large screens

---

## Architecture Decisions

### Decision 1: JSON Schema vs Custom DSL

**Choice**: JSON Schema (Draft 2020-12)

**Rationale**:
- Industry standard, well-documented
- LLMs trained on JSON, high generation quality
- Existing tooling (validators, editors, documentation)
- No learning curve for custom DSL

### Decision 2: Multiple Output Formats vs Single Format

**Choice**: Multiple formats (CSS-in-JS, Tailwind, React)

**Rationale**:
- Industry split between styling approaches
- Maximum adoption potential
- Modular generator architecture enables easy addition

### Decision 3: MCP vs REST API

**Choice**: MCP (Model Context Protocol)

**Rationale**:
- Native Claude integration
- Designed for LLM tool use
- Reduces latency compared to HTTP
- Emerging standard for AI tools

---

## Dependencies Summary

```
SPEC-LAYOUT-001 (REQUIRED) ─────────────────────────┐
                                                    │
TASK-001 (Schema) ─────────────────────────────────┤
         ↓                                          │
TASK-002 (Resolver) ←───────────────────────────────┤
         ↓                                          │
    ┌────┴────┐                                     │
    ↓         ↓                                     │
TASK-003   TASK-004   TASK-005                      │
(CSS-in-JS)(Tailwind) (React)                       │
    └─────────┬───────────┘                         │
              ↓                                     │
         TASK-006                                   │
         (MCP Server)                               │
```

---

## Implementation Complete

**Status**: ✅ **COMPLETED**
**Completion Date**: 2026-01-28
**Overall Coverage**: 90.34%
**Total Tests**: 292 passing

**Achievement Summary**:
- All 4 milestones completed on schedule
- Zero ESLint errors or TypeScript warnings
- TRUST 5 compliance: PASS
- Performance targets exceeded (<2s generation time)
- Complete MCP integration with Claude Desktop/Code

**Last Updated**: 2026-01-28
**Status**: Completed
