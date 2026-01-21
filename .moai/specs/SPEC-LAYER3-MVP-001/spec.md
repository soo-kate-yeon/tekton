---
id: SPEC-LAYER3-MVP-001
version: "2.0.0"
status: "draft"
created: "2026-01-20"
updated: "2026-01-20"
author: "asleep"
priority: "high"
lifecycle: "spec-anchored"
---

# HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-20 | asleep | Initial SPEC creation for create-screen MVP |
| 2.0.0 | 2026-01-20 | asleep | Architecture change: CLI-driven to MCP-driven |

---

# SPEC-LAYER3-MVP-001: Layer 3 MCP-Driven Component Generation Engine

## 1. Overview

### 1.1 Purpose

This SPEC defines the MCP (Model Context Protocol) tool-based implementation for AI-driven React component generation. The system enables LLMs to design and generate screens by invoking MCP tools that provide component knowledge and execute code generation.

**Primary Goal**: LLM invokes `render-screen` MCP tool with AI-designed Blueprint to generate a complete `.tsx` file.

**Design Principle**: LLM-first architecture. MCP Server provides executor tools only. No CLI dependency.

### 1.2 Architecture Change

**OLD Architecture (Deprecated)**:
- CLI-driven: `tekton create-screen dashboard`
- Blueprint JSON stored as files
- CLI command triggers engine

**NEW Architecture (TO-BE)**:
- LLM + MCP-driven
- LLM designs screens using MCP tools
- MCP Server provides executor tools only
- No CLI dependency

**Flow**:
```
User -> LLM -> MCP (get-knowledge-schema) -> MCP (render-screen) -> .tsx
```

### 1.3 Scope

**In Scope (MVP Required)**:
- MCP Tool: `get-knowledge-schema` - AI learns component usage and design format
- MCP Tool: `get-component-list` - Query available components
- MCP Tool: `render-screen` - Convert Blueprint to code and save
- Knowledge Schema Definition (`knowledge-schema.ts`)
- AST Builder using Babel (`ast-builder.ts`)
- JSX Generator (`jsx-generator.ts`)
- MCP Server Extension (`studio-mcp/src/server/index.ts`)

**Out of Scope (Deferred)**:
- CLI commands (deprecated architecture)
- Supabase Integration (local files sufficient)
- AI Blueprint Generation within MCP (LLM handles this)

### 1.4 Dependencies

**Required SPEC Dependencies**:
- **SPEC-LAYER1-001**: Token Generator Engine - Provides CSS variables for styling
- **SPEC-LAYER2-001**: Component Knowledge System - Provides ComponentKnowledge catalog

**External Libraries**:
- `@babel/generator` (^7.24.0) - AST to code generation
- `@babel/types` (^7.24.0) - AST node construction
- `prettier` (^3.4.0) - Code formatting
- `zod` (^3.23.8) - Schema validation
- `@modelcontextprotocol/sdk` - MCP Server SDK

**Existing Implementation (M1-M3 Complete)**:
- Slot Semantic Registry (99.75% coverage)
- Semantic Scoring Algorithm (100% coverage)
- Safety Protocols including Hallucination Checker (99.53% coverage)

---

## 2. Environment

### 2.1 Technical Environment

- **Runtime**: Node.js 20+ / Browser (ES2022+)
- **Language**: TypeScript 5.9+
- **Build System**: Turbo (existing monorepo setup)
- **Package Manager**: pnpm (existing project standard)
- **Testing**: Vitest (existing test framework)
- **MCP Integration**: Model Context Protocol SDK

### 2.2 Integration Points

**Input**:
- LLM-generated Blueprint JSON via MCP tool invocation
- Layer 2 ComponentKnowledge catalog
- Layer 1 design tokens (CSS variables)

**Output**:
- React component files (`.tsx`) written to specified path
- Knowledge schema for LLM consumption
- Component metadata for LLM decision-making

---

## 3. Assumptions

### 3.1 Technical Assumptions

**ASSUMPTION-001**: MCP SDK provides stable tool registration and invocation interface
- **Confidence**: High - MCP is Anthropic's official protocol
- **Evidence**: Used in Claude Desktop and other LLM integrations
- **Risk if Wrong**: May need protocol adaptation
- **Validation**: Test with Claude Desktop integration

**ASSUMPTION-002**: LLM can correctly interpret Knowledge Schema and generate valid Blueprint
- **Confidence**: High - JSON schemas are well-understood by LLMs
- **Evidence**: Claude and GPT effectively process structured data
- **Risk if Wrong**: May need schema simplification
- **Validation**: Test with multiple LLM providers

**ASSUMPTION-003**: Babel AST can represent all required React/JSX patterns
- **Confidence**: High - Babel is the standard for React/JSX transformation
- **Evidence**: Widely used in create-react-app, Next.js, Vite
- **Risk if Wrong**: May need alternative AST library
- **Validation**: Prototype with complex nested components

**ASSUMPTION-004**: Layer 2 ComponentKnowledge catalog is stable and complete
- **Confidence**: Medium - Layer 2 implementation is complete per status
- **Evidence**: SPEC-LAYER2-001 shows complete implementation
- **Risk if Wrong**: May need to coordinate updates
- **Validation**: Verify catalog contains all needed components

### 3.2 Business Assumptions

**ASSUMPTION-005**: LLM-driven approach provides better user experience than CLI
- **Confidence**: High - Natural language is more intuitive
- **Evidence**: Conversational UI trend in developer tools
- **Risk if Wrong**: May need hybrid approach
- **Validation**: User feedback during testing

---

## 4. Requirements

### 4.1 Ubiquitous Requirements (Always Active)

**REQ-MCP-001**: The system shall always expose component generation capabilities via MCP tools
- **Rationale**: MCP is the primary integration interface for LLMs
- **Acceptance**: All three MCP tools registered and callable

**REQ-MCP-002**: The system shall always generate TypeScript-compatible React component files (.tsx) from Blueprint JSON input
- **Rationale**: TypeScript output is non-negotiable for the Tekton design system
- **Acceptance**: All generated files compile without TypeScript errors

**REQ-MCP-003**: The system shall always use Layer 1 design tokens (CSS variables) in generated component styles
- **Rationale**: Ensures design system consistency
- **Acceptance**: Zero hardcoded color/size values in generated code

**REQ-MCP-004**: The system shall always validate component references against Layer 2 ComponentKnowledge catalog
- **Rationale**: Prevents hallucinated component references
- **Acceptance**: Invalid components rejected with LAYER3-E002 error

### 4.2 Event-Driven Requirements (MCP Tool Invocations)

**REQ-MCP-005**: WHEN LLM invokes `get-knowledge-schema` tool, THEN the system shall return the complete Knowledge Schema definition in JSON format
- **Rationale**: LLM needs schema to understand component structure
- **Acceptance**: Schema returned within 50ms, includes all type definitions

**REQ-MCP-006**: WHEN LLM invokes `get-component-list` tool, THEN the system shall return available components with core metadata
- **Rationale**: LLM needs component catalog for design decisions
- **Acceptance**: Returns ComponentKnowledge[] with name, slots, props

**REQ-MCP-007**: WHEN LLM invokes `render-screen` tool with valid Blueprint, THEN the system shall generate and save a `.tsx` file to the specified path
- **Rationale**: Primary code generation interface
- **Acceptance**: File created, compilation verified, path returned

**REQ-MCP-008**: WHEN Blueprint JSON contains a `componentName` reference, THEN the system shall validate it against the ComponentKnowledge catalog
- **Rationale**: Leverages existing hallucination checker from M3
- **Acceptance**: Invalid components rejected with suggestions

**REQ-MCP-009**: WHEN JSX generation completes, THEN the system shall format output using Prettier with project-standard configuration
- **Rationale**: Code quality and consistency
- **Acceptance**: Generated code passes Prettier validation

**REQ-MCP-010**: WHEN an error occurs during processing, THEN MCP tool shall return a structured error response with code and actionable message
- **Rationale**: LLM-friendly error handling
- **Acceptance**: Error messages include context and remediation

### 4.3 State-Driven Requirements (Conditional Behavior)

**REQ-MCP-011**: IF a Blueprint contains nested `slots` structure, THEN the AST Builder shall recursively process each slot to generate nested JSX elements
- **Rationale**: Supports complex layout structures
- **Acceptance**: Nested components render with correct parent-child relationships

**REQ-MCP-012**: IF a component has `props` defined, THEN the JSX Generator shall serialize them as valid JSX attributes
- **Rationale**: Supports component configuration
- **Acceptance**: String, number, boolean, and object props correctly serialized

**REQ-MCP-013**: IF Blueprint validation fails, THEN no file shall be written and error shall be returned
- **Rationale**: Prevents broken partial outputs
- **Acceptance**: Atomic generation - all or nothing

**REQ-MCP-014**: IF `render-screen` output path is not provided, THEN the system shall use a default path pattern
- **Rationale**: Convenience for common use cases
- **Acceptance**: Default to `src/app/{recipeName}/page.tsx`

### 4.4 Unwanted Behaviors (Prohibited Actions)

**REQ-MCP-015**: The system shall NOT generate components with hardcoded design values (colors, sizes, spacing)
- **Rationale**: Must use Layer 1 tokens
- **Acceptance**: Zero hardcoded values in generated code

**REQ-MCP-016**: The system shall NOT generate files with invalid TypeScript syntax
- **Rationale**: Must be immediately usable
- **Acceptance**: All generated files pass `tsc --noEmit`

**REQ-MCP-017**: The system shall NOT silently fail - all errors must surface via MCP response
- **Rationale**: LLM needs feedback for correction
- **Acceptance**: Every error path produces structured MCP response

---

## 5. Technical Specifications

### 5.1 MCP Tool Definitions

#### Tool 1: `get-knowledge-schema`

**Purpose**: AI learns component usage, slot rules, and design format

**Input Schema**:
```typescript
interface GetKnowledgeSchemaInput {
  // No input parameters required
}
```

**Output Schema**:
```typescript
interface GetKnowledgeSchemaOutput {
  schema: {
    BlueprintResult: object;      // JSON Schema for BlueprintResult
    ComponentNode: object;        // JSON Schema for ComponentNode
    SlotRole: string[];           // Available slot roles
    PropTypes: object;            // Supported prop types
  };
  usage: {
    example: BlueprintResult;     // Example Blueprint
    instructions: string;         // Usage instructions for LLM
  };
}
```

#### Tool 2: `get-component-list`

**Purpose**: Query available components with core metadata

**Input Schema**:
```typescript
interface GetComponentListInput {
  filter?: {
    category?: string;            // Filter by component category
    hasSlot?: string;             // Filter by slot availability
  };
}
```

**Output Schema**:
```typescript
interface GetComponentListOutput {
  components: Array<{
    name: string;                 // Component name
    description: string;          // Human-readable description
    slots: string[];              // Available slot names
    requiredProps: string[];      // Required props
    optionalProps: string[];      // Optional props
  }>;
  totalCount: number;
}
```

#### Tool 3: `render-screen`

**Purpose**: Convert AI-designed Blueprint to actual code and save

**Input Schema**:
```typescript
interface RenderScreenInput {
  blueprint: BlueprintResult;     // AI-generated Blueprint JSON
  outputPath?: string;            // Target file path (default: derived from recipeName)
}
```

**Output Schema**:
```typescript
interface RenderScreenOutput {
  success: boolean;
  filePath: string;               // Actual file path written
  componentName: string;          // Generated component name
  imports: string[];              // Generated imports
  errors?: Array<{
    code: string;
    message: string;
  }>;
}
```

### 5.2 Module Structure

```
packages/component-generator/
├── src/
│   ├── types/
│   │   └── knowledge-schema.ts     # Type definitions and JSON schemas
│   ├── generator/
│   │   ├── ast-builder.ts          # Babel AST construction
│   │   └── jsx-generator.ts        # Code generation and formatting
│   ├── registry/                   # EXISTING: M1
│   ├── scoring/                    # EXISTING: M2
│   ├── safety/                     # EXISTING: M3
│   └── index.ts                    # Public API exports
├── tests/
│   ├── generator/
│   │   ├── ast-builder.test.ts
│   │   └── jsx-generator.test.ts
│   └── mcp/
│       └── tools.test.ts           # MCP tool tests
└── package.json

packages/studio-mcp/
├── src/
│   └── server/
│       └── index.ts                # MCP Server with tool registration
└── package.json
```

### 5.3 Knowledge Schema Definition

```typescript
// packages/component-generator/src/types/knowledge-schema.ts

// =============================================================================
// 1. Slot Role Types (Reuse from existing slot-types.ts)
// =============================================================================

export type SlotRole =
  | 'layout'      // Overall structure (Header, Sidebar, Main)
  | 'navigation'  // Navigation elements
  | 'content'     // Primary information display
  | 'action'      // User input and controls
  | 'meta';       // Supplementary information

// =============================================================================
// 2. Blueprint Result (Assembly Design)
// =============================================================================

export interface BlueprintResult {
  /** Unique identifier for this blueprint */
  blueprintId: string;

  /** Recipe/template name for reference */
  recipeName: string;

  /** Analysis metadata from intent parsing */
  analysis: {
    intent: string;
    tone: string;
  };

  /** Root component structure (recursive) */
  structure: ComponentNode;
}

export interface ComponentNode {
  /** Component name from Layer 2 catalog */
  componentName: string;

  /** Component props */
  props: Record<string, unknown>;

  /** Named slots with child components */
  slots?: {
    [slotName: string]: ComponentNode | ComponentNode[];
  };
}

// =============================================================================
// 3. JSON Schema Export (For MCP Tool)
// =============================================================================

export const BlueprintResultSchema = {
  type: 'object',
  required: ['blueprintId', 'recipeName', 'analysis', 'structure'],
  properties: {
    blueprintId: { type: 'string' },
    recipeName: { type: 'string' },
    analysis: {
      type: 'object',
      properties: {
        intent: { type: 'string' },
        tone: { type: 'string' },
      },
    },
    structure: { $ref: '#/definitions/ComponentNode' },
  },
  definitions: {
    ComponentNode: {
      type: 'object',
      required: ['componentName', 'props'],
      properties: {
        componentName: { type: 'string' },
        props: { type: 'object' },
        slots: {
          type: 'object',
          additionalProperties: {
            oneOf: [
              { $ref: '#/definitions/ComponentNode' },
              { type: 'array', items: { $ref: '#/definitions/ComponentNode' } },
            ],
          },
        },
      },
    },
  },
};
```

### 5.4 MCP Server Integration

```typescript
// packages/studio-mcp/src/server/index.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  JSXGenerator,
  BlueprintResultSchema,
  type BlueprintResult,
} from '@tekton/component-generator';
import { ComponentKnowledge } from '@tekton/component-knowledge';
import * as fs from 'fs/promises';
import * as path from 'path';

const server = new Server(
  { name: 'tekton-studio', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// Load component catalog
const catalog: ComponentKnowledge[] = await loadComponentCatalog();
const generator = new JSXGenerator({ catalog });

// Tool 1: get-knowledge-schema
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'get-knowledge-schema') {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          schema: BlueprintResultSchema,
          usage: {
            example: getExampleBlueprint(),
            instructions: getUsageInstructions(),
          },
        }),
      }],
    };
  }

  // Tool 2: get-component-list
  if (request.params.name === 'get-component-list') {
    const filter = request.params.arguments?.filter;
    const components = filterComponents(catalog, filter);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          components: components.map(c => ({
            name: c.name,
            description: c.description,
            slots: c.slots,
            requiredProps: c.requiredProps,
            optionalProps: c.optionalProps,
          })),
          totalCount: components.length,
        }),
      }],
    };
  }

  // Tool 3: render-screen
  if (request.params.name === 'render-screen') {
    const { blueprint, outputPath } = request.params.arguments as {
      blueprint: BlueprintResult;
      outputPath?: string;
    };

    const result = await generator.generate(blueprint);

    if (!result.success) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            errors: result.errors,
          }),
        }],
      };
    }

    const targetPath = outputPath ?? `src/app/${blueprint.recipeName.toLowerCase()}/page.tsx`;
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, result.code!);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          filePath: targetPath,
          componentName: blueprint.recipeName,
          imports: extractImports(result.code!),
        }),
      }],
    };
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

### 5.5 Sample Blueprint JSON (Dashboard)

```json
{
  "blueprintId": "bp-001",
  "recipeName": "DashboardLayout",
  "analysis": {
    "intent": "Read-only",
    "tone": "Professional"
  },
  "structure": {
    "componentName": "PageLayout",
    "props": {},
    "slots": {
      "main": [
        {
          "componentName": "Card",
          "props": { "title": "Revenue" },
          "slots": {}
        },
        {
          "componentName": "DataTable",
          "props": { "columns": 5 },
          "slots": {}
        }
      ]
    }
  }
}
```

### 5.6 Performance Targets

| Operation | Target | Notes |
|-----------|--------|-------|
| `get-knowledge-schema` | < 10ms | Static data return |
| `get-component-list` | < 30ms | Catalog lookup with optional filter |
| Blueprint validation | < 20ms | Catalog lookup via Map |
| AST building | < 50ms | Recursive but typically shallow |
| JSX generation | < 30ms | Babel generator |
| Prettier formatting | < 100ms | Async formatting |
| File write | < 20ms | Async file system |
| **Total `render-screen`** | < 250ms | End-to-end |

### 5.7 Error Code System

| Code | Type | Description |
|------|------|-------------|
| LAYER3-E002 | Hallucination | Component not found in Layer 2 catalog |
| LAYER3-E005 | Generation | AST/JSX generation failed |
| LAYER3-E008 | Validation | Blueprint schema validation failed |
| LAYER3-E010 | MCP | MCP tool invocation error |
| LAYER3-E011 | FileSystem | File write operation failed |
| LAYER3-W001 | Warning | Non-critical issue during generation |

---

## 6. Testing Strategy

### 6.1 Unit Test Coverage

**AST Builder Tests**:
- Component validation against catalog
- Import generation accuracy
- Props serialization (string, number, boolean, object)
- Nested slot handling
- Error cases (invalid components)

**JSX Generator Tests**:
- End-to-end generation from Blueprint
- Prettier formatting verification
- Error propagation from AST builder
- TypeScript compilation validation

**Target Coverage**: >= 85% (TRUST 5 requirement)

### 6.2 MCP Integration Tests

**Tool Registration Tests**:
- All three tools registered correctly
- Tool schemas match specifications
- Tool descriptions accurate

**Tool Execution Tests**:
- `get-knowledge-schema` returns valid schema
- `get-component-list` returns catalog data
- `render-screen` generates and writes file
- Error handling for invalid inputs

### 6.3 LLM Execution Tests

**End-to-End Flow**:
1. LLM calls `get-knowledge-schema` to understand format
2. LLM calls `get-component-list` to see available components
3. LLM designs Blueprint based on user request
4. LLM calls `render-screen` with Blueprint
5. Verify generated file compiles and renders

---

## 7. Quality Gates

### 7.1 TRUST 5 Framework Compliance

- **Test-first**: >= 85% test coverage with vitest
- **Readable**: Clear naming, JSDoc comments
- **Unified**: ESLint + Prettier formatting
- **Secured**: Input validation via Zod schemas
- **Trackable**: Commits reference SPEC-LAYER3-MVP-001

### 7.2 Acceptance Criteria Summary

- [ ] MCP tool `get-knowledge-schema` returns complete schema
- [ ] MCP tool `get-component-list` returns component catalog
- [ ] MCP tool `render-screen` generates valid `.tsx` files
- [ ] Knowledge schema types defined with JSON Schema export
- [ ] AST Builder generates valid Babel AST from Blueprint
- [ ] JSX Generator produces compilable TypeScript React code
- [ ] Hallucination checker validates all component references
- [ ] Generated code uses Layer 1 tokens (no hardcoded values)
- [ ] Test coverage >= 85%
- [ ] Zero TypeScript errors in generated output
- [ ] LLM can successfully complete end-to-end flow

---

## 8. Traceability

**TAG**: SPEC-LAYER3-MVP-001
**Parent SPEC**: SPEC-LAYER3-001 (Component Generation Engine)
**Dependencies**:
- SPEC-LAYER1-001 (Token Generator Engine) - REQUIRED
- SPEC-LAYER2-001 (Component Knowledge System) - REQUIRED

**Implementation Milestones**:
- M1: Layer 3 Core (Knowledge Schema, AST Builder, JSX Generator)
- M2: MCP Server Extension (Tool Registration)
- M3: LLM Execution Test (End-to-End Verification)

---

**END OF SPEC**
