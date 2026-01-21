---
id: SPEC-LAYER3-MVP-001
document: acceptance
version: "2.0.0"
created: "2026-01-20"
updated: "2026-01-20"
---

# SPEC-LAYER3-MVP-001: Acceptance Criteria

## Overview

This document defines the acceptance criteria for the Layer 3 MCP-Driven Component Generation Engine using Given-When-Then (Gherkin) format. All scenarios must pass before the SPEC is considered complete.

---

## Scenario 1: MCP Tool - get-knowledge-schema

**Feature**: Provide Knowledge Schema to LLM via MCP tool
**Priority**: Critical
**Milestone**: M2

```gherkin
Feature: Get Knowledge Schema MCP Tool

  Scenario: Return complete Knowledge Schema
    Given the MCP server is running
    And the studio-mcp tools are registered
    When the LLM invokes the "get-knowledge-schema" tool
    Then the response shall contain a valid JSON Schema for BlueprintResult
    And the schema shall define blueprintId as required string
    And the schema shall define recipeName as required string
    And the schema shall define structure as required ComponentNode
    And the response shall include a usage example Blueprint
    And the response shall include natural language instructions
    And the response time shall be less than 50ms

  Scenario: Schema enables LLM to generate valid Blueprint
    Given the LLM has received the Knowledge Schema
    When the LLM generates a Blueprint JSON based on the schema
    Then the Blueprint shall validate against the schema
    And all required fields shall be present
    And the structure shall be a valid ComponentNode tree
```

---

## Scenario 2: MCP Tool - get-component-list

**Feature**: Provide Component Catalog to LLM via MCP tool
**Priority**: Critical
**Milestone**: M2

```gherkin
Feature: Get Component List MCP Tool

  Scenario: Return all available components
    Given the MCP server is running
    And the Layer 2 ComponentKnowledge catalog is loaded
    When the LLM invokes the "get-component-list" tool without filters
    Then the response shall contain all components from the catalog
    And each component shall have name, description, slots, and props
    And the totalCount shall match the catalog size
    And the response time shall be less than 30ms

  Scenario: Filter components by category
    Given the MCP server is running
    And the catalog contains components in different categories
    When the LLM invokes "get-component-list" with filter.category = "layout"
    Then the response shall contain only layout components
    And the totalCount shall reflect the filtered result

  Scenario: Filter components by slot availability
    Given the MCP server is running
    And the catalog contains components with various slots
    When the LLM invokes "get-component-list" with filter.hasSlot = "main"
    Then the response shall contain only components with "main" slot
    And the totalCount shall reflect the filtered result
```

---

## Scenario 3: MCP Tool - render-screen

**Feature**: Generate React component from Blueprint via MCP tool
**Priority**: Critical
**Milestone**: M2

```gherkin
Feature: Render Screen MCP Tool

  Scenario: Generate component from valid Blueprint
    Given the MCP server is running
    And a valid Blueprint JSON with the following structure:
      | Field          | Value                          |
      | blueprintId    | bp-001                         |
      | recipeName     | DashboardLayout                |
      | rootComponent  | PageLayout                     |
    And the Blueprint contains a main slot with Card and DataTable children
    And all components exist in the Layer 2 ComponentKnowledge catalog
    When the LLM invokes "render-screen" with the Blueprint
    Then the response shall indicate success: true
    And the response shall include the generated filePath
    And the response shall include the componentName
    And the response shall include the imports array
    And a file shall be created at the specified path
    And the file shall contain valid TypeScript React code

  Scenario: Use default output path when not specified
    Given a valid Blueprint with recipeName "DashboardLayout"
    When the LLM invokes "render-screen" without specifying outputPath
    Then the file shall be created at "src/app/dashboardlayout/page.tsx"
    And the response filePath shall reflect the default path

  Scenario: Use custom output path when specified
    Given a valid Blueprint
    When the LLM invokes "render-screen" with outputPath "src/components/MyComponent.tsx"
    Then the file shall be created at "src/components/MyComponent.tsx"
    And the response filePath shall match the specified path

  Scenario: Reject Blueprint with invalid component
    Given a Blueprint JSON that references a component "FakeWidget"
    And "FakeWidget" does not exist in the Layer 2 ComponentKnowledge catalog
    When the LLM invokes "render-screen" with the Blueprint
    Then the response shall indicate success: false
    And the errors array shall contain an error with code "LAYER3-E002"
    And the error message shall contain "FakeWidget not found in catalog"
    And no file shall be created
```

---

## Scenario 4: Component Validation Against Layer 2 Catalog

**Feature**: Prevent hallucinated component references
**Priority**: Critical
**Milestone**: M1

```gherkin
Feature: Component Validation Against Layer 2 Catalog

  Scenario: Reject Blueprint with non-existent component
    Given a Blueprint JSON that references a component "FakeWidget"
    And "FakeWidget" does not exist in the Layer 2 ComponentKnowledge catalog
    When the AST Builder attempts to process the Blueprint
    Then the system shall reject the Blueprint
    And the error shall have code "LAYER3-E002"
    And the error message shall contain "FakeWidget not found in catalog"
    And the error shall include similar component suggestions
    And no partial .tsx file shall be generated

  Scenario: Provide helpful suggestions for misspelled components
    Given a Blueprint JSON that references "Buttn" (misspelled Button)
    And "Button" exists in the Layer 2 ComponentKnowledge catalog
    When the AST Builder validates the Blueprint
    Then the error message shall suggest "Button" as an alternative
    And the suggestion shall use Levenshtein distance matching

  Scenario: Validate all components including nested children
    Given a Blueprint with the following nested structure:
      | Level | Component   |
      | 0     | PageLayout  |
      | 1     | Card        |
      | 2     | InvalidComp |
    When the AST Builder validates the Blueprint
    Then validation shall fail on "InvalidComp" at level 2
    And the error path shall indicate the nested location
```

---

## Scenario 5: Nested Slot Processing

**Feature**: Support complex nested component structures
**Priority**: High
**Milestone**: M1

```gherkin
Feature: Nested Slot Processing

  Scenario: Process Blueprint with nested slots
    Given a Blueprint with the following structure:
      | Component   | Slot   | Children     |
      | PageLayout  | main   | Card, Table  |
      | Card        | header | Badge        |
    When the JSX Generator processes the Blueprint
    Then the generated JSX shall have PageLayout as the root element
    And Card shall be a direct child of PageLayout
    And Badge shall be nested within Card
    And the nesting depth shall be correctly maintained

  Scenario: Handle multiple children in single slot
    Given a Blueprint with main slot containing:
      | Component | Props          |
      | Card      | title="A"      |
      | Card      | title="B"      |
      | Card      | title="C"      |
    When the JSX Generator processes the Blueprint
    Then all three Card components shall be siblings
    And they shall appear in the order specified
    And each shall have its respective title prop

  Scenario: Handle empty slots gracefully
    Given a Blueprint with PageLayout having no children
    When the JSX Generator processes the Blueprint
    Then PageLayout shall render as self-closing element
    And no empty children array shall be generated
```

---

## Scenario 6: Props Serialization

**Feature**: Correctly serialize component props to JSX
**Priority**: High
**Milestone**: M1

```gherkin
Feature: Props Serialization

  Scenario: Serialize string props
    Given a component with props:
      | Prop   | Value      | Type   |
      | title  | "Revenue"  | string |
      | label  | "Click me" | string |
    When the JSX Generator serializes the props
    Then the output shall contain title="Revenue"
    And the output shall contain label="Click me"
    And string values shall be properly quoted

  Scenario: Serialize numeric props
    Given a component with props:
      | Prop    | Value | Type   |
      | columns | 5     | number |
      | rows    | 10    | number |
    When the JSX Generator serializes the props
    Then the output shall contain columns={5}
    And the output shall contain rows={10}
    And numeric values shall be in JSX expression syntax

  Scenario: Serialize boolean props
    Given a component with props:
      | Prop     | Value | Type    |
      | disabled | true  | boolean |
      | visible  | false | boolean |
    When the JSX Generator serializes the props
    Then the output shall contain disabled={true}
    And the output shall contain visible={false}

  Scenario: Serialize object props
    Given a component with props:
      | Prop  | Value                    | Type   |
      | style | {"color": "red"}         | object |
      | data  | {"id": 1, "name": "test"} | object |
    When the JSX Generator serializes the props
    Then the output shall contain style={{ color: 'red' }}
    And object values shall be wrapped in JSX expression containers
```

---

## Scenario 7: Error Handling

**Feature**: Provide actionable error messages via MCP
**Priority**: High
**Milestone**: M2

```gherkin
Feature: Error Handling

  Scenario: Handle AST generation failure
    Given an internal error occurs during AST construction
    When the LLM invokes "render-screen"
    Then the response shall indicate success: false
    And the errors array shall contain an error with code "LAYER3-E005"
    And the error shall include phase: "ast"
    And the error message shall describe the failure
    And no file shall be created

  Scenario: Handle Prettier formatting failure
    Given valid AST is generated
    And Prettier encounters a formatting error
    When the LLM invokes "render-screen"
    Then the response shall indicate success: false
    And the errors array shall contain an error with code "LAYER3-E005"
    And the error shall include phase: "formatting"
    And the error message shall include Prettier details

  Scenario: Handle file system error
    Given Blueprint generation succeeds
    And the output path is not writable
    When the LLM invokes "render-screen"
    Then the response shall indicate success: false
    And the errors array shall contain an error with code "LAYER3-E011"
    And the error message shall describe the file system issue

  Scenario: Return structured error for invalid Blueprint schema
    Given a Blueprint JSON missing required fields
    When the LLM invokes "render-screen"
    Then the response shall indicate success: false
    And the errors array shall contain an error with code "LAYER3-E008"
    And the error message shall list missing fields
```

---

## Scenario 8: Import Generation

**Feature**: Generate correct import statements
**Priority**: High
**Milestone**: M1

```gherkin
Feature: Import Generation

  Scenario: Generate React import
    Given any valid Blueprint
    When the AST Builder generates imports
    Then the output shall contain:
      """
      import React from 'react';
      """

  Scenario: Generate component imports
    Given a Blueprint using Card, Button, and DataTable components
    When the AST Builder generates imports
    Then the output shall contain:
      """
      import { Button, Card, DataTable } from '@tekton/components';
      """
    And components shall be listed alphabetically
    And no duplicate imports shall exist

  Scenario: Deduplicate repeated component usage
    Given a Blueprint using Card three times
    When the AST Builder generates imports
    Then Card shall appear only once in the import statement
```

---

## Scenario 9: LLM End-to-End Flow

**Feature**: Complete LLM workflow using MCP tools
**Priority**: Critical
**Milestone**: M3

```gherkin
Feature: LLM End-to-End Flow

  Scenario: LLM creates dashboard screen from natural language
    Given the MCP server is connected to Claude Desktop
    And the user requests "Create a dashboard screen with revenue cards and a data table"
    When the LLM processes the request
    Then the LLM shall call "get-knowledge-schema" to understand Blueprint format
    And the LLM shall call "get-component-list" to discover available components
    And the LLM shall design a Blueprint with PageLayout, Card, and DataTable
    And the LLM shall call "render-screen" with the designed Blueprint
    And the generated file shall compile without TypeScript errors
    And the component structure shall match the LLM's design

  Scenario: LLM handles component not found error
    Given the MCP server is running
    And the LLM designs a Blueprint with a non-existent component
    When the LLM calls "render-screen"
    Then the response shall indicate failure
    And the LLM shall receive error code "LAYER3-E002"
    And the error shall suggest valid alternatives
    And the LLM can retry with corrected Blueprint

  Scenario: LLM uses filtered component list
    Given the MCP server is running
    And the user requests "Create a navigation screen"
    When the LLM processes the request
    Then the LLM may call "get-component-list" with filter.category = "navigation"
    And the LLM shall use navigation components in the Blueprint
```

---

## Quality Gate Criteria

### Test Coverage Requirements

| Module | Minimum Coverage |
|--------|-----------------|
| knowledge-schema.ts | 100% (types + schemas) |
| ast-builder.ts | >= 85% |
| jsx-generator.ts | >= 85% |
| studio-mcp/server/index.ts | >= 85% |
| **Overall** | >= 85% |

### Compilation Requirements

| Check | Requirement |
|-------|-------------|
| Package TypeScript | Zero errors |
| Generated Code TypeScript | Zero errors |
| ESLint | Zero errors |
| Prettier | Formatting consistent |

### Performance Requirements

| Operation | Maximum Time |
|-----------|--------------|
| get-knowledge-schema | 50ms |
| get-component-list | 30ms |
| Blueprint validation | 20ms |
| AST building | 50ms |
| Code generation | 30ms |
| Prettier formatting | 100ms |
| File write | 20ms |
| **Total render-screen** | 250ms |

---

## Definition of Done

### For Each Milestone

- [ ] All acceptance scenarios pass
- [ ] Test coverage meets or exceeds 85%
- [ ] Zero TypeScript compilation errors
- [ ] Zero ESLint errors
- [ ] Code reviewed and approved
- [ ] Documentation updated

### For Complete SPEC

- [ ] All milestones complete
- [ ] All three MCP tools functional
- [ ] End-to-end LLM test passes
- [ ] Generated code compiles and renders
- [ ] Performance targets met
- [ ] Integration guide documented
- [ ] README documentation updated

---

**TAG**: SPEC-LAYER3-MVP-001
