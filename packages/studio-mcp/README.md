# @tekton/studio-mcp

Component MCP Integration for Tekton Studio - Model Context Protocol integration enabling AI assistants to query and use hook components for component generation.

## Overview

This package provides MCP (Model Context Protocol) integration for the Tekton Component System, implementing:

- **Component MCP Tools** - Query hook components via HTTP-based MCP protocol
- **4-Layer Component Access** - Prop rules, state mappings, variants, and structure templates
- **Query Interface** - Search components by WCAG level, state name, variants, etc.
- **Storage Utilities** - Generalized component data persistence

## Installation

```bash
pnpm add @tekton/studio-mcp
```

## Quick Start

### Using MCP Tools Programmatically

```typescript
import { archetypeTools } from '@tekton/studio-mcp';

// List all available hooks
const hooks = await archetypeTools.list();
console.log(hooks.data); // ['useButton', 'useTextField', ...]

// Get complete component for a hook
const buttonArchetype = await archetypeTools.get('useButton');
console.log(buttonArchetype.data);
// {
//   hookName: 'useButton',
//   propRules: { ... },
//   stateMappings: { ... },
//   variants: { ... },
//   structure: { ... }
// }

// Query components by criteria
const aaCompliant = await archetypeTools.query({ wcagLevel: 'AA' });
console.log(aaCompliant.data); // All hooks with WCAG AA compliance
```

### Starting the MCP Server

```bash
# Using npm script
pnpm start

# Or with custom port
MCP_PORT=4000 pnpm start

# Or programmatically
```

```typescript
import { createMCPServer } from '@tekton/studio-mcp';

const server = createMCPServer(3000);
// Server running at http://localhost:3000
```

## MCP Tools

The server exposes the following tools via HTTP:

| Tool | Description |
|------|-------------|
| `component.list` | List all 20+ available hooks |
| `component.get` | Get complete component for a hook |
| `component.getPropRules` | Get Layer 1 (hook prop rules) |
| `component.getStateMappings` | Get Layer 2 (state-style mappings) |
| `component.getVariants` | Get Layer 3 (variant branching) |
| `component.getStructure` | Get Layer 4 (structure templates) |
| `component.query` | Search by criteria (WCAG level, state name) |

### API Endpoints

```bash
# Health check
GET /health
# Response: { status: 'ok', tools: [...] }

# List available tools
GET /tools
# Response: { tools: [...tool definitions...] }

# Execute a tool
POST /tools/{toolName}
Content-Type: application/json
# Body: { ...parameters... }
```

### Example Usage with curl

```bash
# Health check
curl http://localhost:3000/health

# List all hooks
curl -X POST http://localhost:3000/tools/component.list

# Get useButton component
curl -X POST http://localhost:3000/tools/component.get \
  -H "Content-Type: application/json" \
  -d '{"hookName": "useButton"}'

# Query by WCAG level
curl -X POST http://localhost:3000/tools/component.query \
  -H "Content-Type: application/json" \
  -d '{"wcagLevel": "AA"}'
```

## 4-Layer Component System

### Layer 1: Hook Prop Rules

Maps hooks to prop objects and base CSS styles.

```typescript
const rules = await archetypeTools.getPropRules('useButton');
// {
//   hookName: 'useButton',
//   propObjects: ['buttonProps', 'isPressed'],
//   baseStyles: [{
//     propObject: 'buttonProps',
//     cssProperties: {
//       'background': 'var(--tekton-primary-500)',
//       'color': 'var(--tekton-neutral-50)',
//       ...
//     }
//   }],
//   requiredCSSVariables: ['--tekton-primary-500', ...]
// }
```

### Layer 2: State-Style Mappings

Defines visual feedback for component states.

```typescript
const mappings = await archetypeTools.getStateMappings('useButton');
// {
//   hookName: 'useButton',
//   states: [{
//     stateName: 'isPressed',
//     stateType: 'boolean',
//     visualFeedback: {
//       cssProperties: { 'background': 'var(--tekton-primary-700)' }
//     }
//   }],
//   transitions: { duration: '150ms', easing: 'ease-out', reducedMotion: true }
// }
```

### Layer 3: Variant Branching

Conditional styling based on configuration options.

```typescript
const variants = await archetypeTools.getVariants('useButton');
// {
//   hookName: 'useButton',
//   configurationOptions: [{
//     optionName: 'variant',
//     optionType: 'enum',
//     possibleValues: ['primary', 'secondary', 'outline'],
//     styleRules: [{
//       condition: "variant === 'secondary'",
//       cssProperties: { 'background': 'var(--tekton-neutral-200)' }
//     }]
//   }]
// }
```

### Layer 4: Structure Templates

HTML/JSX patterns and accessibility requirements.

```typescript
const structure = await archetypeTools.getStructure('useButton');
// {
//   hookName: 'useButton',
//   htmlElement: 'button',
//   jsxPattern: '<button {...buttonProps}>{children}</button>',
//   accessibility: {
//     role: 'button',
//     wcagLevel: 'AA',
//     ariaAttributes: [...],
//     keyboardNavigation: [...]
//   }
// }
```

## Storage Utilities

Generalized storage functions for component data persistence:

```typescript
import { saveArchetype, loadArchetype, listArchetypes } from '@tekton/studio-mcp';
import { z } from 'zod';

// Define a schema
const MySchema = z.object({ name: z.string() });

// Save data
await saveArchetype('myHook', { name: 'test' }, MySchema);

// Load data
const data = await loadArchetype('myHook', MySchema);

// List stored components
const stored = await listArchetypes();
```

## LLM Integration Guide (M3)

### Overview

The Layer 3 Knowledge Schema provides LLM-optimized tools for component generation. LLMs can:
1. Query the Blueprint schema to understand component structure
2. List available components from the catalog
3. Design component blueprints as JSON
4. Generate React `.tsx` files from blueprints

### Step 1: Get Knowledge Schema

```bash
curl -X POST http://localhost:3000/tools/knowledge.getSchema
```

Response:
```json
{
  "success": true,
  "schema": {
    "type": "object",
    "required": ["blueprintId", "recipeName", "analysis", "structure"],
    "properties": {
      "blueprintId": { "type": "string" },
      "recipeName": { "type": "string" },
      "analysis": {
        "type": "object",
        "properties": {
          "intent": { "type": "string" },
          "tone": { "type": "string" }
        }
      },
      "structure": { "type": "object" }
    }
  },
  "usage": {
    "example": { ... },
    "instructions": "..."
  }
}
```

### Step 2: Get Component List

Query available components by category or slot:

```bash
# Get all layout components
curl -X POST http://localhost:3000/tools/knowledge.getComponentList \
  -H "Content-Type: application/json" \
  -d '{"filter": {"category": "layout"}}'

# Get components with 'header' slot
curl -X POST http://localhost:3000/tools/knowledge.getComponentList \
  -H "Content-Type: application/json" \
  -d '{"filter": {"hasSlot": "header"}}'
```

Response:
```json
{
  "success": true,
  "components": [
    {
      "name": "Card",
      "description": "Container component with elevation and padding",
      "category": "layout",
      "slots": ["header", "content", "footer", "actions"],
      "props": ["variant", "elevation", "padding"]
    }
  ],
  "count": 1
}
```

### Step 3: Design Blueprint JSON

LLMs create component blueprints following the schema:

```json
{
  "blueprintId": "dashboard-001",
  "recipeName": "user-dashboard",
  "analysis": {
    "intent": "Dashboard with user statistics card",
    "tone": "professional"
  },
  "structure": {
    "componentName": "Card",
    "props": {
      "variant": "elevated",
      "padding": "large"
    }
  }
}
```

**Available Components** (20 total):
- **Action**: Button
- **Container**: Card, Modal
- **Input**: Input, Checkbox, Radio, Switch, Slider, Select, Textarea
- **Navigation**: Dropdown, Tabs, Accordion
- **Feedback**: Badge, Alert, Toast, Tooltip, Popover, Progress
- **Content**: Avatar

### Step 4: Render Screen from Blueprint

```bash
curl -X POST http://localhost:3000/tools/knowledge.renderScreen \
  -H "Content-Type: application/json" \
  -d '{
    "blueprint": {
      "blueprintId": "dashboard-001",
      "recipeName": "user-dashboard",
      "analysis": {
        "intent": "Dashboard card",
        "tone": "professional"
      },
      "structure": {
        "componentName": "Card",
        "props": {
          "variant": "elevated"
        }
      }
    },
    "outputPath": "src/app/dashboard/page.tsx"
  }'
```

Response:
```json
{
  "success": true,
  "filePath": "src/app/dashboard/page.tsx",
  "code": "export default function GeneratedComponent() {\n  return <Card variant=\"elevated\" />;\n}"
}
```

### Error Handling

The system provides structured error responses:

**Error Codes:**
- `INVALID_BLUEPRINT` - Missing required fields (blueprintId, recipeName, structure)
- `GENERATION_FAILED` - Invalid component name or generation error
- `FILE_WRITE_ERROR` - File system write failure
- `UNEXPECTED_ERROR` - Unhandled exception

Example error:
```json
{
  "success": false,
  "error": "Component \"NonExistent\" not found in catalog. Available components: Button, Card, Modal, ...",
  "errorCode": "GENERATION_FAILED"
}
```

### Performance Targets

- `knowledge.getSchema`: <50ms
- `knowledge.getComponentList`: <30ms
- `knowledge.renderScreen`: <200ms (varies by blueprint complexity)

### Example LLM Prompts

```
User: "Create a dashboard with a card"

LLM:
1. Call knowledge.getSchema to understand Blueprint structure
2. Call knowledge.getComponentList with {"category": "container"}
3. Design Blueprint:
   {
     "blueprintId": "dash-001",
     "recipeName": "dashboard",
     "analysis": {"intent": "Dashboard card", "tone": "professional"},
     "structure": {"componentName": "Card", "props": {"variant": "elevated"}}
   }
4. Call knowledge.renderScreen with Blueprint
5. Confirm file created at src/app/dashboard/page.tsx
```

See [examples/blueprints/](./examples/blueprints/) for more Blueprint JSON examples.

## Claude Code Integration

Configure Claude Code to use the MCP server:

```json
// .claude/settings.json
{
  "mcpServers": {
    "tekton-components": {
      "command": "node",
      "args": ["packages/studio-mcp/dist/server/index.js"],
      "env": {
        "MCP_PORT": "3000"
      }
    }
  }
}
```

In Claude, query components:
```
> What hooks are available?
> Show me the useButton component
> Find all AA-compliant components
> Create a dashboard with Card and Button components
```

## TypeScript Support

Full TypeScript definitions are provided:

```typescript
import type {
  CompleteArchetype,
  ArchetypeQueryCriteria,
  ToolResult,
  DesignToken,
  TypographyValue
} from '@tekton/studio-mcp';
```

## Development

```bash
# Install dependencies
pnpm install

# Build TypeScript
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Start dev server (watch mode)
pnpm dev

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code
pnpm format
```

## Architecture

**Technology Stack:**
- TypeScript 5.7.3 (strict mode)
- Zod 3.23.8 (schema validation)
- Node.js 20+ (ES2022 modules)
- Vitest 2.1.8 (testing)
- @tekton/component-system (data source)

**Design Decisions:**
1. **HTTP-based MCP** - Simple, universal protocol support
2. **Lazy data loading** - Component data loaded on first request
3. **4-layer architecture** - Clear separation of component concerns
4. **Query interface** - Flexible filtering for AI assistants

## Dependencies

- **@tekton/component-system** - Source of hook component data
- **@anthropic-ai/sdk** - MCP protocol support
- **zod** - Runtime type validation

## License

MIT

## Version

Current version: 0.1.0

Last updated: 2026-01-17
