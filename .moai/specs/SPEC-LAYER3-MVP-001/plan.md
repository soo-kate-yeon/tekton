---
id: SPEC-LAYER3-MVP-001
document: plan
version: "2.0.0"
created: "2026-01-20"
updated: "2026-01-20"
---

# SPEC-LAYER3-MVP-001: Implementation Plan

## Overview

This plan outlines the implementation strategy for the Layer 3 MCP-Driven Component Generation Engine. The architecture has changed from CLI-driven to MCP-driven, enabling LLMs to directly invoke component generation tools.

**Primary Goal**: LLM invokes MCP tools to generate React components from AI-designed Blueprints

**Implementation Order**: 3 milestones in strict sequence due to dependencies

---

## Implementation Milestones

### Milestone M1: Layer 3 Core (Rebuild)

**Priority**: Primary Goal
**Dependencies**: None (first implementation step)
**Scope**: Refine engine logic, remove CLI dependencies

#### Task 1.1: Knowledge Schema Definition

**Output**: `packages/component-generator/src/types/knowledge-schema.ts`

**Tasks**:

1. Define `SlotRole` type (reuse patterns from existing `slot-types.ts`)
2. Define `BlueprintResult` interface with:
   - `blueprintId`: Unique identifier
   - `recipeName`: Template name
   - `analysis`: Intent and tone metadata
   - `structure`: Root `ComponentNode`
3. Define `ComponentNode` interface with:
   - `componentName`: Layer 2 catalog reference
   - `props`: Record of component props
   - `slots`: Optional nested children
4. Export JSON Schema version of types for MCP tool:
   - `BlueprintResultSchema`: JSON Schema for LLM consumption
   - Usage examples and instructions

**Acceptance Criteria**:
- [ ] All types compile without errors
- [ ] Types exported from package index
- [ ] JSON Schema export for MCP integration
- [ ] JSDoc documentation for all public interfaces

**Technical Approach**:
- Use TypeScript strict mode
- Prefer Record over object for dynamic keys
- Use unknown over any for prop values
- Keep interfaces minimal and focused
- JSON Schema must be LLM-parseable

---

#### Task 1.2: AST Builder

**Output**: `packages/component-generator/src/generator/ast-builder.ts`

**Tasks**:

1. Install Babel dependencies:
   ```bash
   pnpm add @babel/types @babel/generator
   pnpm add -D @types/babel__generator
   ```

2. Implement `ASTBuilder` class:
   - Constructor accepting `ASTBuilderOptions` with catalog
   - `build(blueprint)` method returning `ASTBuildResult`

3. Implement component validation:
   - Integrate with existing `HallucinationChecker` from M3
   - Recursive validation of nested `ComponentNode` structures
   - Error collection with `LAYER3-E002` codes

4. Implement AST generation:
   - `generateImports()`: React and component imports
   - `buildComponentNode()`: Recursive JSX element construction
   - `buildProps()`: Props to JSX attributes conversion
   - `generateFunctionComponent()`: Export named function component

5. Write comprehensive tests:
   - Valid Blueprint generates valid AST
   - Invalid component triggers LAYER3-E002
   - Nested slots generate nested JSX
   - Props serialize correctly (string, number, boolean)
   - Empty slots generate self-closing elements

**Acceptance Criteria**:
- [ ] AST Builder generates valid Babel AST
- [ ] Hallucination check prevents invalid components
- [ ] Recursive slot processing works correctly
- [ ] Props serialization handles all JSON types
- [ ] Test coverage >= 85%

**Technical Approach**:
- Use `@babel/types` builders (t.jsxElement, t.importDeclaration, etc.)
- Map-based catalog lookup for O(1) validation
- Depth-first traversal for slot processing
- Fail-fast on first validation error

---

#### Task 1.3: JSX Generator

**Output**: `packages/component-generator/src/generator/jsx-generator.ts`

**Tasks**:

1. Install Prettier:
   ```bash
   pnpm add prettier
   ```

2. Implement `JSXGenerator` class:
   - Constructor accepting `JSXGeneratorOptions`
   - `generate(blueprint)` method returning `GenerationResult`

3. Implement generation pipeline:
   - Step 1: Build AST via `ASTBuilder`
   - Step 2: Generate code via `@babel/generator`
   - Step 3: Format via Prettier

4. Implement error handling:
   - Propagate AST builder errors
   - Wrap generation errors with LAYER3-E005
   - Wrap formatting errors with phase info

5. Write comprehensive tests:
   - End-to-end generation from Blueprint to code
   - Generated code compiles with tsc
   - Prettier formatting applied correctly
   - Error propagation from AST phase
   - Error handling for generation failures

**Acceptance Criteria**:
- [ ] JSX Generator produces valid TypeScript code
- [ ] Generated code passes tsc compilation
- [ ] Prettier formatting consistent with project style
- [ ] Error messages include actionable guidance
- [ ] Test coverage >= 85%

**Technical Approach**:
- Async generation for Prettier compatibility
- Default Prettier config matching project standards
- Structured error types with phase information
- No partial output on failure (atomic generation)

---

### Milestone M2: MCP Server Extension

**Priority**: Primary Goal
**Dependencies**: M1 (Layer 3 Core)
**Output**: `packages/studio-mcp/src/server/index.ts`

**Tasks**:

1. Import Layer 3 engine components:
   ```typescript
   import {
     JSXGenerator,
     BlueprintResultSchema,
     type BlueprintResult,
   } from '@tekton/component-generator';
   ```

2. Register MCP Tool: `get-knowledge-schema`
   - Returns complete Knowledge Schema definition
   - Includes JSON Schema for BlueprintResult
   - Includes usage example and instructions
   - No input parameters required

3. Register MCP Tool: `get-component-list`
   - Returns available components from Layer 2 catalog
   - Supports optional category/slot filters
   - Returns lightweight ComponentKnowledge subset

4. Register MCP Tool: `render-screen`
   - Accepts BlueprintResult and optional outputPath
   - Invokes JSXGenerator.generate()
   - Writes generated code to file system
   - Returns success/failure with file path

5. Implement error handling:
   - Wrap generator errors in MCP response format
   - Include error codes and actionable messages
   - Return structured JSON responses

6. Write MCP tool tests:
   - Tool registration verification
   - Schema validation for inputs/outputs
   - End-to-end tool invocation tests
   - Error handling tests

**Acceptance Criteria**:
- [ ] All three MCP tools registered and callable
- [ ] `get-knowledge-schema` returns valid schema
- [ ] `get-component-list` returns catalog data
- [ ] `render-screen` generates and writes files
- [ ] Error responses follow MCP format
- [ ] Test coverage >= 85%

**Technical Approach**:
- Use MCP SDK's setRequestHandler for tool registration
- JSON.stringify for structured responses
- fs/promises for async file operations
- Zod for input validation

---

### Milestone M3: LLM Execution Test

**Priority**: Primary Goal
**Dependencies**: M2 (MCP Server Extension)
**Output**: Verified end-to-end LLM flow

**Tasks**:

1. Create test scenario:
   - User request: "Look at Knowledge Schema and create a dashboard screen"
   - Expected LLM behavior:
     - Calls `get-knowledge-schema` to understand format
     - Calls `get-component-list` to see available components
     - Designs Blueprint based on user request
     - Calls `render-screen` with Blueprint

2. Verify MCP tool invocation sequence:
   - LLM correctly interprets schema
   - LLM correctly queries component list
   - LLM generates valid Blueprint JSON
   - LLM invokes render-screen correctly

3. Verify generated output:
   - File created at expected path
   - Generated code compiles without errors
   - Component structure matches Blueprint
   - Imports are correct

4. Document integration guide:
   - How to connect MCP server to Claude Desktop
   - How to test with different LLMs
   - Common issues and troubleshooting

**Acceptance Criteria**:
- [ ] LLM successfully calls `get-knowledge-schema`
- [ ] LLM successfully calls `get-component-list`
- [ ] LLM generates valid Blueprint JSON
- [ ] LLM successfully calls `render-screen`
- [ ] Generated .tsx file compiles and renders
- [ ] Integration guide documented

**Technical Approach**:
- Manual testing with Claude Desktop
- Automated smoke tests with mock LLM responses
- Capture and verify MCP message flow
- Document observed LLM behavior patterns

---

## Dependencies and Installation

### New Dependencies to Add

**packages/component-generator/package.json**:
```json
{
  "dependencies": {
    "@babel/generator": "^7.24.0",
    "@babel/types": "^7.24.0",
    "prettier": "^3.4.0"
  },
  "devDependencies": {
    "@types/babel__generator": "^7.6.8"
  }
}
```

**packages/studio-mcp/package.json**:
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "@tekton/component-generator": "workspace:*"
  }
}
```

### Existing Dependencies to Leverage

- `@tekton/component-knowledge`: ComponentKnowledge types
- `@tekton/theme`: Layer 1 design tokens
- `zod`: Schema validation
- `vitest`: Testing framework

---

## Risk Mitigation

### Risk 1: MCP SDK Stability

**Probability**: Low
**Impact**: High
**Mitigation**:
- Pin MCP SDK version
- Abstract MCP interface for potential replacement
- Monitor Anthropic SDK updates
- Have fallback plan for direct HTTP integration

### Risk 2: LLM Schema Interpretation

**Probability**: Medium
**Impact**: Medium
**Mitigation**:
- Keep JSON Schema simple and flat
- Provide clear examples in schema response
- Include natural language instructions
- Test with multiple LLM providers
- Iterate on schema based on LLM behavior

### Risk 3: Babel AST Complexity

**Probability**: Medium
**Impact**: High
**Mitigation**:
- Start with flat structure (no nesting)
- Add nesting incrementally
- Create utility functions for common patterns
- Extensive test coverage for edge cases

### Risk 4: File System Permissions

**Probability**: Low
**Impact**: Medium
**Mitigation**:
- Use fs/promises with proper error handling
- Validate path before writing
- Create directories recursively
- Return clear error messages for permission issues

---

## Quality Checkpoints

### After M1 (Layer 3 Core)
- [ ] Knowledge schema types compile without errors
- [ ] JSON Schema export works correctly
- [ ] AST Builder test coverage >= 85%
- [ ] JSX Generator test coverage >= 85%
- [ ] Generated code compiles with tsc

### After M2 (MCP Server Extension)
- [ ] All three MCP tools registered
- [ ] Tool schemas validated
- [ ] End-to-end tool invocation works
- [ ] Error handling verified
- [ ] Test coverage >= 85%

### After M3 (LLM Execution Test)
- [ ] LLM successfully completes full flow
- [ ] Generated file compiles and renders
- [ ] Integration guide documented
- [ ] Known issues documented

---

## Success Metrics

| Metric | Target | Validation |
|--------|--------|------------|
| Test Coverage | >= 85% | vitest coverage report |
| TypeScript Errors | 0 | tsc --noEmit |
| MCP Tool Response Time | < 300ms | Performance tests |
| Generated Code Valid | 100% | tsc compilation of output |
| LLM Success Rate | >= 90% | Manual testing |

---

## Next Steps After MVP

1. **Enhanced Schema**: Richer component metadata for better LLM decisions
2. **Template Library**: Pre-built Blueprint templates accessible via MCP
3. **Visual Preview**: MCP tool to preview generated component
4. **Supabase Storage**: Persist Blueprints with versioning
5. **Multi-file Generation**: Generate related files (styles, tests, stories)

---

**TAG**: SPEC-LAYER3-MVP-001
