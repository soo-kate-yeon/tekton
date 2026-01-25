# Architecture Diagrams

**Generated:** 2026-01-23
**Purpose:** Visual documentation of Tekton Studio MCP system architecture
**Diagram Tool:** Mermaid 11.x

---

## Table of Contents

1. [System Context Diagram (C4 Level 1)](#system-context-diagram-c4-level-1)
2. [Container Diagram (C4 Level 2)](#container-diagram-c4-level-2)
3. [Component Diagram (C4 Level 3)](#component-diagram-c4-level-3)
4. [Adapter Pattern Structure](#adapter-pattern-structure)
5. [Component Generator Flow](#component-generator-flow)
6. [Theme Binding Sequence](#theme-binding-sequence)
7. [Layout Management Flow](#layout-management-flow)
8. [MCP Tool Interaction Sequence](#mcp-tool-interaction-sequence)
9. [Blueprint Validation Process](#blueprint-validation-process)
10. [Error Handling Flow](#error-handling-flow)

---

## System Context Diagram (C4 Level 1)

**Purpose:** Shows high-level system interactions and external dependencies.

```mermaid
C4Context
  title System Context Diagram - Tekton Studio MCP

  Person(user, "AI Assistant", "Claude, GPT, or other AI model")

  System(studio_mcp, "Studio MCP Server", "Provides component generation capabilities via MCP protocol")

  System_Ext(claude_code, "Claude Code", "MCP client that connects to Studio MCP")
  System_Ext(component_gen, "Component Generator Library", "Core component generation and blueprint processing")

  Rel(user, claude_code, "Sends component generation requests", "Natural language")
  Rel(claude_code, studio_mcp, "Invokes MCP tools", "JSON-RPC over stdio")
  Rel(studio_mcp, component_gen, "Generates React components", "TypeScript API")
  Rel(studio_mcp, user, "Returns generated components", "MCP response")
```

**Key External Systems:**
- **Claude Code**: MCP client that orchestrates AI workflows
- **Component Generator Library**: Shared library for blueprint processing
- **AI Assistant**: End user (Claude, GPT, or other AI models)

---

## Container Diagram (C4 Level 2)

**Purpose:** Shows main containers and their relationships within the system.

```mermaid
C4Container
  title Container Diagram - Studio MCP Internal Architecture

  Person(ai, "AI Assistant")

  Container(mcp_server, "MCP Server", "Node.js/TypeScript", "Handles MCP protocol and tool routing")
  Container(layer3_tools, "Layer 3 Tools", "TypeScript", "MCP tool implementations for component operations")
  Container(adapters, "Adapter Layer", "TypeScript", "Decouples MCP tools from component-generator")
  Container(component_gen, "Component Generator", "TypeScript Library", "Blueprint parsing, AST building, code generation")
  Container(theme_system, "Theme System", "TypeScript", "Theme resolution and CSS variable injection")
  Container(layout_system, "Layout System", "TypeScript", "Layout config parsing and Tailwind class generation")

  Rel(ai, mcp_server, "MCP requests", "JSON-RPC")
  Rel(mcp_server, layer3_tools, "Routes tool calls", "Function invocation")
  Rel(layer3_tools, adapters, "Uses adapters", "TypeScript API")
  Rel(adapters, component_gen, "Delegates to library", "TypeScript API")
  Rel(adapters, theme_system, "Resolves themes", "TypeScript API")
  Rel(adapters, layout_system, "Resolves layouts", "TypeScript API")
  Rel(component_gen, theme_system, "Injects theme tokens", "TypeScript API")
  Rel(component_gen, layout_system, "Applies layout classes", "TypeScript API")
```

**Container Responsibilities:**

| Container | Responsibility | Technology |
|-----------|---------------|------------|
| MCP Server | Protocol handling, tool registration | Node.js + MCP SDK |
| Layer 3 Tools | Tool implementations, request validation | TypeScript |
| Adapter Layer | API abstraction, type transformation | TypeScript |
| Component Generator | Blueprint → AST → Code generation | TypeScript |
| Theme System | Theme resolution, token injection | TypeScript |
| Layout System | Layout parsing, Tailwind class gen | TypeScript |

---

## Component Diagram (C4 Level 3)

**Purpose:** Detailed view of key components within the Adapter Layer and Layer 3 Tools.

```mermaid
C4Component
  title Component Diagram - Adapter Layer and Layer 3 Tools

  Container_Boundary(layer3, "Layer 3 Tools") {
    Component(get_schema, "get-knowledge-schema", "Function", "Returns blueprint JSON schema for AI")
    Component(generate_comp, "generate-component", "Function", "Generates component from blueprint")
    Component(list_comp, "list-components", "Function", "Lists available components in catalog")
  }

  Container_Boundary(adapters, "Adapter Layer") {
    Component(comp_adapter, "ComponentAdapter", "Class", "Wraps component generation APIs")
    Component(catalog_adapter, "CatalogAdapter", "Class", "Wraps component catalog APIs")
    Component(adapter_types, "Adapter Types", "TypeScript Interfaces", "Shared type definitions")
  }

  Container_Boundary(component_gen, "Component Generator Library") {
    Component(ast_builder, "ASTBuilder", "Class", "Builds AST from blueprint")
    Component(jsx_gen, "JSXGenerator", "Class", "Generates JSX code from AST")
    Component(schema_validator, "SchemaValidator", "Class", "Validates blueprints")
    Component(catalog, "ComponentCatalog", "Module", "Built-in component registry")
  }

  Rel(get_schema, comp_adapter, "Uses", "validateBlueprint()")
  Rel(generate_comp, comp_adapter, "Uses", "generateComponent()")
  Rel(list_comp, catalog_adapter, "Uses", "listComponents()")

  Rel(comp_adapter, ast_builder, "Delegates to", "buildAST()")
  Rel(comp_adapter, jsx_gen, "Delegates to", "generateJSX()")
  Rel(comp_adapter, schema_validator, "Validates with", "validate()")

  Rel(catalog_adapter, catalog, "Queries", "getAllComponents()")
```

**Component Responsibilities:**

**Layer 3 Tools:**
- `get-knowledge-schema`: Provides JSON schema and examples for AI assistants
- `generate-component`: Orchestrates component generation workflow
- `list-components`: Returns searchable component catalog

**Adapter Layer:**
- `ComponentAdapter`: Wraps component generation, theme resolution, validation
- `CatalogAdapter`: Wraps component listing, searching, filtering
- `Adapter Types`: Shared interfaces (ComponentInfo, ComponentFilter)

**Component Generator:**
- `ASTBuilder`: Transforms blueprint JSON to AST representation
- `JSXGenerator`: Converts AST to executable JSX code
- `SchemaValidator`: Validates blueprint against JSON schema
- `ComponentCatalog`: Registry of built-in component blueprints

---

## Adapter Pattern Structure

**Purpose:** Shows adapter pattern relationships and data flow.

```mermaid
classDiagram
  class ComponentAdapter {
    -astBuilder: ASTBuilder
    -themeResolver: ThemeResolver
    -validator: SchemaValidator
    +generateComponent(blueprint, options?) ASTBuildResult
    +resolveTheme(themeId: string) Theme
    +validateBlueprint(blueprint: unknown) ValidationResult
  }

  class CatalogAdapter {
    -catalog: ComponentCatalog
    +listComponents(filter?: ComponentFilter) ComponentInfo[]
    +getComponent(componentId: string) ComponentInfo | null
    +searchComponents(query: string) ComponentInfo[]
  }

  class ComponentInfo {
    +id: string
    +name: string
    +description: string
    +category: string
    +slots?: string[]
    +tags?: string[]
  }

  class ComponentFilter {
    +category?: string
    +hasSlot?: string
  }

  class BlueprintResult {
    +blueprintId: string
    +componentName: string
    +rootElement: ElementBlueprint
    +themeId?: string
    +layout?: LayoutConfig
  }

  class ASTBuildResult {
    +code: string
    +metadata: Metadata
  }

  class Theme {
    +themeId: string
    +themeName: string
    +tokens: Record~string, string~
  }

  ComponentAdapter --> BlueprintResult : accepts
  ComponentAdapter --> ASTBuildResult : returns
  ComponentAdapter --> Theme : resolves

  CatalogAdapter --> ComponentInfo : returns
  CatalogAdapter --> ComponentFilter : accepts

  ComponentInfo --> ComponentFilter : filters

  note for ComponentAdapter "Adapter Pattern: Wraps component-generator library"
  note for CatalogAdapter "Adapter Pattern: Wraps component catalog"
```

**Pattern Benefits:**
1. **Decoupling**: MCP tools don't depend on component-generator implementation
2. **Type Safety**: Adapters provide stable, well-typed interfaces
3. **Flexibility**: Easy to swap component-generator implementations
4. **Testability**: Adapters can be mocked for unit testing

---

## Component Generator Flow

**Purpose:** End-to-end component generation process.

```mermaid
flowchart TD
  Start([AI Request: Generate Component]) --> ReceiveMCP[MCP Server Receives Request]

  ReceiveMCP --> ValidateParams{Validate MCP Parameters}
  ValidateParams -->|Invalid| ErrorParams[Return Parameter Error]
  ValidateParams -->|Valid| InvokeLayer3[Invoke Layer 3 Tool: generate-component]

  InvokeLayer3 --> UseAdapter[ComponentAdapter.generateComponent]

  UseAdapter --> ValidateBlueprint{Validate Blueprint}
  ValidateBlueprint -->|Invalid| ErrorValidation[Return Validation Error]
  ValidateBlueprint -->|Valid| ResolveTheme[Resolve Theme if themeId present]

  ResolveTheme --> BuildAST[ASTBuilder: Transform Blueprint to AST]
  BuildAST --> InjectTheme{Theme Binding Enabled?}

  InjectTheme -->|Yes| ApplyTheme[Inject CSS Variables in style prop]
  InjectTheme -->|No| SkipTheme[Skip theme injection]

  ApplyTheme --> ApplyLayout
  SkipTheme --> ApplyLayout

  ApplyLayout[Apply Layout Classes] --> GenerateJSX[JSXGenerator: Convert AST to Code]

  GenerateJSX --> FormatCode[Format Generated Code]
  FormatCode --> ReturnResult[Return ASTBuildResult]

  ReturnResult --> MCPResponse[MCP Server Sends Response]
  MCPResponse --> End([AI Receives Generated Component])

  ErrorParams --> End
  ErrorValidation --> End

  style Start fill:#e1f5e1
  style End fill:#e1f5e1
  style ErrorParams fill:#ffe1e1
  style ErrorValidation fill:#ffe1e1
```

**Key Decision Points:**
1. **MCP Parameter Validation**: Ensures request structure is valid
2. **Blueprint Validation**: Validates against JSON schema
3. **Theme Binding**: Optional CSS variable injection
4. **Layout Application**: Optional Tailwind class injection

**Error Handling:**
- Invalid parameters → Return error immediately
- Invalid blueprint → Return validation errors with details
- Theme not found → Continue without theme (optional feature)

---

## Theme Binding Sequence

**Purpose:** Detailed sequence of theme resolution and injection process.

```mermaid
sequenceDiagram
  participant AI as AI Assistant
  participant MCP as MCP Server
  participant Tool as Layer 3 Tool
  participant Adapter as ComponentAdapter
  participant Theme as ThemeResolver
  participant AST as ASTBuilder
  participant JSX as JSXGenerator

  AI->>MCP: generate-component(blueprint with themeId)
  MCP->>Tool: Invoke generate-component tool
  Tool->>Adapter: generateComponent(blueprint, options)

  alt themeId present in blueprint or options
    Adapter->>Theme: resolveTheme(themeId)
    Theme->>Theme: Load theme from catalog

    alt theme found
      Theme-->>Adapter: Return Theme object with tokens
      Note over Adapter: Theme tokens: {color-primary: '#007bff', ...}
    else theme not found
      Theme-->>Adapter: Throw ThemeNotFoundError
      Adapter-->>Tool: Return error response
      Tool-->>MCP: Error response
      MCP-->>AI: Theme not found error
    end
  end

  Adapter->>AST: buildASTFromBlueprint(blueprint)
  AST->>AST: Parse rootElement recursively
  AST-->>Adapter: Return AST structure

  alt theme present
    Adapter->>JSX: generateJSX(ast, theme)
    JSX->>JSX: Inject CSS variables in style prop
    Note over JSX: style={{ '--color-primary': '#007bff' }}
  else no theme
    Adapter->>JSX: generateJSX(ast)
  end

  JSX-->>Adapter: Return generated code
  Adapter-->>Tool: Return ASTBuildResult
  Tool-->>MCP: Success response
  MCP-->>AI: Generated component with theme
```

**Theme Resolution Steps:**
1. Extract `themeId` from blueprint or options
2. Query theme catalog with theme ID
3. Retrieve theme tokens (color, typography, spacing)
4. Inject tokens as CSS variables in component's `style` prop

**CSS Variable Injection Example:**
```typescript
// Without theme
<button>Click me</button>

// With theme (minimal-theme)
<button style={{
  '--color-primary': '#007bff',
  '--color-secondary': '#6c757d',
  '--font-family': 'Inter, sans-serif'
}}>
  Click me
</button>
```

---

## Layout Management Flow

**Purpose:** Layout configuration parsing and Tailwind class generation.

```mermaid
flowchart TD
  Start([Blueprint with Layout Config]) --> ParseLayout[Parse Layout Config]

  ParseLayout --> DetectEnv{Environment Detection}
  DetectEnv -->|isMobile| MobileLayout[Apply Mobile Layout]
  DetectEnv -->|isTablet| TabletLayout[Apply Tablet Layout]
  DetectEnv -->|isDesktop| DesktopLayout[Apply Desktop Layout]
  DetectEnv -->|No Env| DefaultLayout[Apply Default Layout]

  MobileLayout --> GenerateClasses[Layout Class Generator]
  TabletLayout --> GenerateClasses
  DesktopLayout --> GenerateClasses
  DefaultLayout --> GenerateClasses

  GenerateClasses --> ResponsiveBreakpoints{Responsive Mode?}

  ResponsiveBreakpoints -->|Yes| ApplyBreakpoints[Apply Tailwind Breakpoints]
  ResponsiveBreakpoints -->|No| SkipBreakpoints[Single Layout Mode]

  ApplyBreakpoints --> CombineClasses[Combine Layout Classes]
  SkipBreakpoints --> CombineClasses

  CombineClasses --> InjectClasses[Inject className Prop]
  InjectClasses --> End([Component with Layout Classes])

  style Start fill:#e1f5e1
  style End fill:#e1f5e1
```

**Layout Class Generation Example:**

**Input (Blueprint with Layout):**
```json
{
  "blueprintId": "btn-001",
  "componentName": "ResponsiveButton",
  "layout": {
    "mode": "responsive",
    "mobile": { "width": "full", "padding": "sm" },
    "tablet": { "width": "auto", "padding": "md" },
    "desktop": { "width": "auto", "padding": "lg" }
  },
  "rootElement": {
    "tag": "button",
    "children": [{ "type": "text", "value": "Click me" }]
  }
}
```

**Output (Generated Classes):**
```typescript
<button className="w-full p-2 sm:w-auto sm:p-4 lg:w-auto lg:p-6">
  Click me
</button>
```

**Tailwind Breakpoints:**
- Mobile (default): `w-full p-2`
- Tablet (sm): `sm:w-auto sm:p-4`
- Desktop (lg): `lg:w-auto lg:p-6`

---

## MCP Tool Interaction Sequence

**Purpose:** Complete MCP tool invocation flow from AI request to response.

```mermaid
sequenceDiagram
  participant AI as AI Assistant (Claude)
  participant Client as Claude Code (MCP Client)
  participant Server as Studio MCP Server
  participant Router as Tool Router
  participant Tool as Layer 3 Tool Handler
  participant Adapter as Adapter Layer
  participant Library as Component Generator Library

  AI->>Client: Request: Generate button component
  Client->>Client: Translate to MCP tool call
  Client->>Server: MCP Request (JSON-RPC over stdio)
  Note over Client,Server: {"method": "tools/call", "params": {...}}

  Server->>Router: Route to tool handler
  Router->>Router: Validate tool exists
  Router->>Tool: Invoke generate-component

  Tool->>Tool: Validate parameters
  alt parameters invalid
    Tool-->>Server: Return validation error
    Server-->>Client: MCP error response
    Client-->>AI: Error message
  end

  Tool->>Adapter: Call adapter method
  Adapter->>Library: Delegate to library

  Library->>Library: Process blueprint
  Library->>Library: Generate component code
  Library-->>Adapter: Return result

  Adapter->>Adapter: Transform library types to adapter types
  Adapter-->>Tool: Return adapter result

  Tool->>Tool: Format MCP response
  Tool-->>Server: Success response with component code

  Server-->>Client: MCP success response
  Note over Server,Client: {"result": {"code": "..."}}

  Client->>Client: Parse MCP response
  Client-->>AI: Generated component code

  AI->>AI: Analyze generated code
```

**MCP Tool Registry:**
1. `get-knowledge-schema`: Returns blueprint JSON schema
2. `generate-component`: Generates component from blueprint
3. `list-components`: Lists available components in catalog

**Protocol Details:**
- **Transport:** stdio (standard input/output)
- **Format:** JSON-RPC 2.0
- **Message Structure:**
  - Request: `{ jsonrpc, method, params, id }`
  - Response: `{ jsonrpc, result, id }` or `{ jsonrpc, error, id }`

---

## Blueprint Validation Process

**Purpose:** Multi-stage blueprint validation flow.

```mermaid
flowchart TD
  Start([Receive Blueprint]) --> ParseJSON{Parse JSON}

  ParseJSON -->|Parse Error| JSONError[Return JSON Parse Error]
  ParseJSON -->|Success| SchemaValidation[Schema Validation]

  SchemaValidation --> ValidateStructure{Validate Structure}
  ValidateStructure -->|Missing Fields| StructureError[Return Missing Fields Error]
  ValidateStructure -->|Valid| TypeValidation[Type Validation]

  TypeValidation --> ValidateTypes{Validate Field Types}
  ValidateTypes -->|Type Mismatch| TypeError[Return Type Error]
  ValidateTypes -->|Valid| BusinessRules[Business Rules Validation]

  BusinessRules --> ValidateRules{Validate Business Rules}
  ValidateRules -->|Rule Violation| RuleError[Return Rule Violation Error]
  ValidateRules -->|Valid| OptionalFields[Optional Fields Validation]

  OptionalFields --> ValidateTheme{themeId Present?}
  ValidateTheme -->|Yes| CheckTheme{Theme Exists?}
  ValidateTheme -->|No| ValidateLayout

  CheckTheme -->|No| ThemeWarning[Add Theme Warning]
  CheckTheme -->|Yes| ValidateLayout

  ThemeWarning --> ValidateLayout

  ValidateLayout --> CheckLayout{layout Present?}
  CheckLayout -->|Yes| ValidateLayoutSchema{Valid Layout Schema?}
  CheckLayout -->|No| Success

  ValidateLayoutSchema -->|Invalid| LayoutError[Return Layout Error]
  ValidateLayoutSchema -->|Valid| Success[Validation Success]

  Success --> End([Return Valid Blueprint])

  JSONError --> End
  StructureError --> End
  TypeError --> End
  RuleError --> End
  LayoutError --> End

  style Start fill:#e1f5e1
  style End fill:#e1f5e1
  style Success fill:#e1f5e1
  style JSONError fill:#ffe1e1
  style StructureError fill:#ffe1e1
  style TypeError fill:#ffe1e1
  style RuleError fill:#ffe1e1
  style LayoutError fill:#ffe1e1
  style ThemeWarning fill:#fff5e1
```

**Validation Stages:**

**Stage 1: JSON Parsing**
- Validate JSON syntax
- Check for malformed JSON
- Return parse error if invalid

**Stage 2: Schema Validation**
- Validate against Zod schema (`BlueprintResultSchema`)
- Check required fields: `blueprintId`, `componentName`, `rootElement`
- Validate field types (string, object, array)

**Stage 3: Type Validation**
- Validate `rootElement` structure
- Check element tag names (valid HTML tags)
- Validate children structure (text, element)

**Stage 4: Business Rules**
- Unique blueprint ID
- Valid component name (PascalCase)
- No circular element references
- Maximum nesting depth (10 levels)

**Stage 5: Optional Fields**
- Validate `themeId` if present (warning if not found)
- Validate `layout` if present (schema validation)
- Validate `environment` if present

**Validation Error Format:**
```typescript
{
  valid: false,
  errors: [
    {
      field: 'rootElement.tag',
      message: 'Invalid HTML tag: "invalid-tag"',
      code: 'INVALID_TAG'
    }
  ]
}
```

---

## Error Handling Flow

**Purpose:** Comprehensive error handling strategy across all layers.

```mermaid
flowchart TD
  Start([Error Occurs]) --> ClassifyError{Classify Error Type}

  ClassifyError -->|Validation Error| ValidationHandler[Validation Error Handler]
  ClassifyError -->|Theme Error| ThemeHandler[Theme Error Handler]
  ClassifyError -->|Generation Error| GenerationHandler[Generation Error Handler]
  ClassifyError -->|System Error| SystemHandler[System Error Handler]

  ValidationHandler --> FormatValidation[Format Validation Errors]
  FormatValidation --> ReturnValidation[Return Validation Error Response]

  ThemeHandler --> CheckThemeCritical{Theme Critical?}
  CheckThemeCritical -->|Yes| ThemeError[Return Theme Error]
  CheckThemeCritical -->|No| ThemeWarning[Add Warning, Continue]

  GenerationHandler --> LogGeneration[Log Generation Error]
  LogGeneration --> ReturnGeneration[Return Generation Error with Details]

  SystemHandler --> LogSystem[Log System Error]
  LogSystem --> ReturnSystem[Return Generic Error Message]

  ReturnValidation --> FormatResponse[Format MCP Error Response]
  ThemeError --> FormatResponse
  ThemeWarning --> Success[Continue with Warning]
  ReturnGeneration --> FormatResponse
  ReturnSystem --> FormatResponse

  FormatResponse --> SendResponse[Send Error Response to Client]
  SendResponse --> End([AI Receives Error])

  Success --> End

  style Start fill:#ffe1e1
  style End fill:#e1f5e1
  style Success fill:#fff5e1
  style ReturnValidation fill:#ffe1e1
  style ThemeError fill:#ffe1e1
  style ReturnGeneration fill:#ffe1e1
  style ReturnSystem fill:#ffe1e1
```

**Error Categories:**

**1. Validation Errors (User-Facing)**
- Caused by invalid blueprint structure
- Examples: Missing fields, invalid types, rule violations
- Response: Detailed error messages with field names and suggestions
- Recovery: User fixes blueprint and retries

**2. Theme Errors (Optional Feature)**
- Caused by missing or invalid theme ID
- Examples: Theme not found, theme load failure
- Response: Warning or error depending on criticality
- Recovery: Continue without theme (warning) or fail (error)

**3. Generation Errors (Internal)**
- Caused by failures in code generation process
- Examples: AST build failure, JSX generation failure
- Response: Error message with internal details
- Recovery: Log error, return generic message to user

**4. System Errors (Critical)**
- Caused by unexpected system failures
- Examples: File system errors, memory errors, crashes
- Response: Generic error message (hide internal details)
- Recovery: Log full error, alert developers, return safe message

**Error Response Format:**
```typescript
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Blueprint validation failed',
    details: [
      {
        field: 'rootElement.tag',
        message: 'Invalid HTML tag',
        suggestion: 'Use valid HTML5 tag (div, button, etc.)'
      }
    ]
  }
}
```

**Error Handling Best Practices:**
1. **Classify errors early**: Determine error type as soon as possible
2. **Provide context**: Include field names, values, and suggestions
3. **Fail fast**: Return errors immediately when detected
4. **Log everything**: Log all errors for debugging and monitoring
5. **User-friendly messages**: Translate internal errors to actionable messages
6. **Avoid leaking internals**: Hide implementation details in system errors

---

## Diagram Usage Guide

### How to Read These Diagrams

**C4 Diagrams (Context, Container, Component):**
- Read from top to bottom, outside to inside
- Start with external actors (users, systems)
- Follow relationships to understand interactions
- Blue boxes: Internal systems/components
- Gray boxes: External systems

**Flowcharts:**
- Follow arrows from start to end
- Diamond shapes: Decision points
- Rectangle shapes: Process steps
- Green backgrounds: Start/success states
- Red backgrounds: Error states
- Yellow backgrounds: Warning states

**Sequence Diagrams:**
- Read from top to bottom
- Participants shown at top
- Solid arrows: Requests
- Dashed arrows: Responses
- Notes: Additional context
- Alt/Opt blocks: Conditional flows

**Class Diagrams:**
- Boxes represent classes/interfaces
- Arrows show relationships
- `+` prefix: Public methods/properties
- `-` prefix: Private methods/properties
- `~` symbol: Generic types

### Updating These Diagrams

**When to Update:**
1. New components added to system
2. Architecture changes (new layers, patterns)
3. API changes (new parameters, methods)
4. New error handling paths
5. New integrations or external systems

**How to Update:**
1. Edit Mermaid syntax in this markdown file
2. Test rendering with Mermaid Live Editor (https://mermaid.live)
3. Ensure diagram remains readable (not too complex)
4. Update description text if needed
5. Commit changes with descriptive message

**Best Practices:**
- Keep diagrams focused (one concept per diagram)
- Use consistent naming across diagrams
- Add notes for complex interactions
- Update related documentation when changing diagrams
- Test rendering before committing

---

## Related Documentation

**Internal Documentation:**
- [Implementation State Report](implementation-state-2026-01-23.md) - Current system state
- [Adapter Pattern Guide](adapter-pattern-guide.md) - Adapter implementation details
- [API Changes Guide](api-changes-preset-to-theme.md) - API migration documentation
- [Test Coverage Report](test-coverage-report.md) - Test coverage analysis

**External Resources:**
- [C4 Model Documentation](https://c4model.com/) - C4 diagramming approach
- [Mermaid Documentation](https://mermaid.js.org/) - Mermaid syntax reference
- [UML Sequence Diagrams](https://www.uml-diagrams.org/sequence-diagrams.html) - Sequence diagram guide

---

**Document Metadata:**
- **Generated:** 2026-01-23
- **Diagrams:** 10 total (C4, sequence, flowchart, class)
- **Diagram Tool:** Mermaid 11.x
- **Maintained by:** workflow-docs agent
- **Version:** 1.0.0

---

**End of Architecture Diagrams**
