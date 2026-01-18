# Tekton System User Guide

> Complete workflow verification guide for the Tekton Design System

**Version**: 1.0.0
**Last Updated**: 2026-01-17

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Prerequisites & Setup](#2-prerequisites--setup)
3. [Web View Studio (Planned)](#3-web-view-studio-planned)
4. [MCP Integration](#4-mcp-integration)
5. [Environment Detection](#5-environment-detection)
6. [Token & CSS Mapping](#6-token--css-mapping)
7. [Hook Component Configuration](#7-hook-component-configuration)
8. [Screen Creation](#8-screen-creation)
9. [End-to-End Verification Checklist](#9-end-to-end-verification-checklist)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. System Overview

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        TEKTON STUDIO                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│   │  Studio Web     │    │  Studio API     │    │  Studio MCP  │ │
│   │  (PLANNED)      │◄──►│  (FastAPI)      │◄──►│  (MCP Server)│ │
│   │  - UI Preview   │    │  - Presets CRUD │    │  - Archetype │ │
│   │  - Editor       │    │  - PostgreSQL   │    │  - MCP Tools │ │
│   └────────┬────────┘    └────────┬────────┘    └──────┬───────┘ │
│            │                      │                     │         │
│   ┌────────▼──────────────────────▼─────────────────────▼──────┐ │
│   │              TOKEN CONTRACT (@tekton/token-contract)        │ │
│   │   - CSS Variables (--tekton-*)  - OKLCH Color Space        │ │
│   │   - Dark Mode Support           - Tailwind Integration     │ │
│   └────────┬────────────────────────────────────────────────────┘ │
│            │                                                      │
│   ┌────────▼────────────────────────────────────────────────────┐ │
│   │         HEADLESS COMPONENTS (@tekton/headless-components)    │ │
│   │   - 20 React Hooks (useButton, useInput, useModal, etc.)    │ │
│   │   - ARIA Compliance (WCAG AA/AAA)                           │ │
│   └────────┬────────────────────────────────────────────────────┘ │
│            │                                                      │
│   ┌────────▼────────────────────────────────────────────────────┐ │
│   │           ARCHETYPE SYSTEM (@tekton/archetype-system)        │ │
│   │   - Hook Prop Rules      - State-Style Mapping              │ │
│   │   - Variant Branching    - Structure Templates              │ │
│   └────────┬────────────────────────────────────────────────────┘ │
│            │                                                      │
│   ┌────────▼────────────────────────────────────────────────────┐ │
│   │                     CLI (@tekton/cli)                        │ │
│   │   - Environment Detection   - Screen Generator              │ │
│   │   - Contract Validator      - Token Injector                │ │
│   └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Package Structure

| Package | Purpose | Location | Status |
|---------|---------|----------|--------|
| `@tekton/studio-web` | Web-based design studio UI | `packages/studio-web/` | **Planned** |
| `@tekton/studio-api` | REST API for presets management | `packages/studio-api/` | Implemented |
| `@tekton/studio-mcp` | MCP server for Archetypes | `packages/studio-mcp/` | Implemented |
| `@tekton/token-contract` | Design token → CSS mapping | `packages/token-contract/` | Implemented |
| `@tekton/headless-components` | Unstyled React hooks | `packages/headless-components/` | Planned |
| `@tekton/archetype-system` | Component archetype rules | `packages/archetype-system/` | Implemented |
| `@tekton/cli` | Command-line interface | `packages/cli/` | Planned |
| `@tekton/contracts` | Type definitions & schemas | `packages/contracts/` | Planned |

---

## 2. Prerequisites & Setup

### System Requirements

- **Node.js**: 22.x LTS or later
- **pnpm**: 9.x or later
- **Python**: 3.13+ (for Studio API)
- **PostgreSQL**: 16+ (for preset storage)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/tekton.git
cd tekton

# Install all dependencies
pnpm install

# Build all packages
pnpm build
```

### Environment Configuration

Create environment files for each service:

**Studio API** (`packages/studio-api/.env`):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/tekton
MCP_SERVER_URL=http://localhost:3000
API_HOST=0.0.0.0
API_PORT=8000
```

**Studio MCP** (`packages/studio-mcp/.env`):
```env
MCP_PORT=3000
```

### Start All Services

```bash
# Terminal 1: Start MCP Server
cd packages/studio-mcp
pnpm install  # Install nodemon if first time
pnpm dev      # Now runs TypeScript compilation + server

# Terminal 2: Start Studio API
cd packages/studio-api
uv sync                                                    # Install dependencies
uv run uvicorn studio_api.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 3: Studio Web (currently not implemented)
# Studio Web UI is planned but not yet implemented
```

**Note**: Studio Web is currently under development. The core functionality (MCP and API) works without it.

---

## 3. Web View Studio (Planned)

> **Status**: This package is planned but not yet implemented.

### Overview

The Web View Studio will provide a visual interface for:
- Browsing curated design presets
- Previewing components with different token configurations
- Editing and creating new presets
- Exporting design tokens

### Planned Features

| Feature | Description |
|---------|-------------|
| Preset Gallery | Browse and search design presets |
| Component Preview | Live preview with token configurations |
| Token Editor | Visual editor for design tokens |
| Export | Export to CSS, JSON, or StyleSheet format |
| Dark Mode | Toggle between light and dark themes |

### Current Alternative

Until Studio Web is implemented, you can:
1. Use the **MCP Integration** (Section 4) with Claude Code for AI-assisted component generation
2. Use the **Studio API** directly for preset management
3. Use the **CLI** (when implemented) for token generation

### Verification Checklist (Future)

- [ ] Studio Web loads at `http://localhost:3001`
- [ ] API health check returns healthy status
- [ ] Preset gallery displays available presets
- [ ] Component preview renders correctly
- [ ] Dark mode toggle works

---

## 4. MCP Integration

### Overview

The MCP (Model Context Protocol) server enables AI assistants to:
- Query hook archetypes for component generation
- Access 4-layer archetype data (prop rules, state mappings, variants, structures)
- Search archetypes by WCAG level, state names, and other criteria

### Archetype System Architecture

The archetype system provides structured data for AI-driven component generation:

| Layer | Description | Content |
|-------|-------------|---------|
| **Layer 1** | Hook Prop Rules | Maps hooks to prop objects and base CSS styles |
| **Layer 2** | State-Style Mappings | Visual feedback rules for component states |
| **Layer 3** | Variant Branching | Conditional styling based on configuration |
| **Layer 4** | Structure Templates | HTML/JSX patterns and accessibility rules |

### MCP Tools Available

#### Archetype Tools

| Tool | Description |
|------|-------------|
| `archetype.list` | List all available hooks |
| `archetype.get` | Get complete archetype for a hook |
| `archetype.getPropRules` | Get Layer 1 (hook prop rules) |
| `archetype.getStateMappings` | Get Layer 2 (state-style mappings) |
| `archetype.getVariants` | Get Layer 3 (variant branching) |
| `archetype.getStructure` | Get Layer 4 (structure templates) |
| `archetype.query` | Search by criteria (WCAG level, state name) |

#### Project Tools

| Tool | Description |
|------|-------------|
| `project.detectStructure` | Detect project framework (Next.js App/Pages, Vite) |
| `project.getActivePreset` | Get the currently active preset for a project |
| `project.setActivePreset` | Set a curated preset as active for a project |

#### Screen Tools

| Tool | Description |
|------|-------------|
| `screen.create` | Create a new screen with routing setup |
| `screen.addComponent` | Add a component to an existing screen |
| `screen.applyArchetype` | Apply a style archetype to a screen |
| `screen.list` | List all screens in the project |
| `screen.preview` | Get preview URL for a screen |

### Applying Curated Presets via MCP

The MCP server enables AI-driven UI redesign by applying curated design presets to your project. This workflow allows you to transform your application's look and feel using pre-defined style archetypes.

#### Available Curated Presets

| Preset Name | Category | Reference Style | Description |
|-------------|----------|-----------------|-------------|
| SaaS Modern | productivity | Notion, Linear | Clean, information-dense UI |
| Dynamic Fitness | sports | Nike | Bold and dynamic with high energy |
| **Premium Editorial** | media | New York Times | Elegant magazine-style, reading-focused |
| Media Streaming | entertainment | Netflix | Content-first immersive dark UI |
| Calm Wellness | wellness | Calm, Headspace | Meditative with blur effects |
| Korean Fintech | finance | Toss | Friendly cards with large radius |
| Warm Humanist | conversational | Claude, Pi | Warm serif fonts, cream background |

#### Workflow: Apply Premium Editorial Theme

This example demonstrates the complete MCP flow for applying the "Premium Editorial" preset to a Next.js project:

**Step 1: Detect Project Structure**

```bash
curl -X POST http://localhost:3000/tools/project.detectStructure \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/path/to/your/project"}'

# Response:
# {
#   "success": true,
#   "data": {
#     "frameworkType": "next-app",
#     "rootPath": "/path/to/your/project",
#     "appDirectory": "/path/to/your/project/src/app",
#     "configFiles": ["package.json", "tsconfig.json", "next.config.ts", "tailwind.config.ts"]
#   }
# }
```

**Step 2: List Available Presets**

```bash
curl http://localhost:8000/api/v2/presets | jq '.items[] | {id, name, category}'

# Response shows all presets with their IDs
```

**Step 3: Set Active Preset**

```bash
curl -X POST http://localhost:3000/tools/project.setActivePreset \
  -H "Content-Type: application/json" \
  -d '{"presetId": 10, "projectPath": "/path/to/your/project"}'

# Response:
# {
#   "success": true,
#   "data": {
#     "name": "Premium Editorial",
#     "category": "media",
#     "config": {
#       "colors": { "background": "#FAFAFA", "text-primary": "#121212", ... },
#       "typography": { "font-family-body": "Georgia, serif", ... },
#       "radius": "0px"
#     }
#   }
# }
```

**Step 4: Apply Theme to Application**

After setting the active preset, update your application's CSS variables to match the preset configuration:

```css
/* globals.css - Add theme based on preset config */
[data-theme='premium-editorial'] {
  --color-background: #FAFAFA;
  --color-foreground: #121212;
  --color-primary: #567B95;
  --font-family-heading: 'Georgia', 'Times New Roman', serif;
  --font-family-body: 'Georgia', 'Times New Roman', serif;
  --radius-lg: 0;
  --radius-md: 0;
  --radius-sm: 0;
}
```

**Step 5: Enable Theme Switching in UI**

Add a theme selector to your application (see Studio Web's `ThemeSelector` component for reference):

```tsx
import { useTheme } from '@/providers/ThemeProvider';

function ThemeSelector() {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      {availableThemes.map((t) => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  );
}
```

#### Verification Checklist for Preset Application

- [ ] Project structure detected correctly
- [ ] Preset list retrieved from API
- [ ] Active preset set via MCP
- [ ] CSS variables generated from preset config
- [ ] Theme selector component added
- [ ] Theme switching works in browser
- [ ] Typography changes applied (serif fonts for editorial)
- [ ] Color scheme applied
- [ ] Border radius applied (0px for editorial aesthetic)

### Implementation Details

#### Package Structure

```
packages/studio-mcp/
├── src/
│   ├── index.ts              # Package exports
│   ├── archetype/
│   │   └── tools.ts          # ArchetypeTools class
│   ├── server/
│   │   ├── index.ts          # Server entry point
│   │   └── mcp-server.ts     # HTTP MCP server
│   ├── storage/
│   │   └── storage.ts        # Generic storage utilities
│   └── types/
│       └── design-tokens.ts  # Design token schemas
└── tests/
    ├── archetype/
    │   └── tools.test.ts     # ArchetypeTools tests
    ├── storage/
    │   └── storage.test.ts   # Storage tests
    └── index.test.ts         # Export tests
```

#### ArchetypeTools Class

The `ArchetypeTools` class provides programmatic access to archetype data:

```typescript
import { ArchetypeTools, archetypeTools } from '@tekton/studio-mcp';

// Initialize (loads data from @tekton/archetype-system)
await archetypeTools.initialize();

// List all available hooks
const hookList = await archetypeTools.list();
// { success: true, data: ["useButton", "useTextField", ...] }

// Get complete archetype for a hook
const archetype = await archetypeTools.get("useButton");
// { success: true, data: { hookName, propRules, stateMappings, variants, structure } }

// Get individual layers
const propRules = await archetypeTools.getPropRules("useButton");
const stateMappings = await archetypeTools.getStateMappings("useButton");
const variants = await archetypeTools.getVariants("useButton");
const structure = await archetypeTools.getStructure("useButton");

// Query by criteria
const aaComponents = await archetypeTools.query({ wcagLevel: "AA" });
const buttonComponents = await archetypeTools.query({ propObject: "buttonProps" });
```

#### MCP Server Implementation

The MCP server is an HTTP-based implementation with CORS support:

```typescript
import { createMCPServer, TOOLS } from '@tekton/studio-mcp';

// Start server on port 3000
const server = createMCPServer(3000);

// Available endpoints:
// GET  /health              - Health check
// GET  /tools               - List available tools
// POST /tools/:toolName     - Execute a tool
```

**Server Features:**
- CORS enabled for cross-origin requests
- JSON request/response format
- Tool execution via POST requests
- Graceful shutdown handling (SIGINT, SIGTERM)

#### Storage Utilities

Generic storage functions for persisting archetype data:

```typescript
import {
  saveArchetype,
  loadArchetype,
  listArchetypes,
  deleteArchetype,
  archetypeExists
} from '@tekton/studio-mcp';
import { z } from 'zod';

// Define a schema
const MySchema = z.object({
  hookName: z.string(),
  version: z.string(),
});

// Save data with schema validation
await saveArchetype('useButton', myData, MySchema);

// Load data with schema validation
const data = await loadArchetype('useButton', MySchema);

// List all saved archetypes
const hooks = await listArchetypes();
// ["useButton", "useTextField", ...]

// Check if archetype exists
const exists = await archetypeExists('useButton');

// Delete an archetype
await deleteArchetype('useButton');
```

**Storage Features:**
- Zod schema validation on save/load
- Automatic directory creation
- JSON file format with metadata (hookName, updatedAt)
- Custom storage path support

### Workflow Verification

#### Step 1: Verify MCP Server

```bash
# Check MCP server is running
curl http://localhost:3000/health

# Expected response:
# {"status": "ok", "service": "studio-mcp", "tools": ["archetype.list", ...]}
```

#### Step 2: List Available Hooks

```bash
# List all hooks with archetypes
curl -X POST http://localhost:3000/tools/archetype.list

# Expected: { "success": true, "data": ["useButton", "useTextField", ...] }
```

#### Step 3: Get Hook Archetype

```bash
# Get complete archetype for useButton
curl -X POST http://localhost:3000/tools/archetype.get \
  -H "Content-Type: application/json" \
  -d '{"hookName": "useButton"}'

# Expected: Complete archetype with all 4 layers
```

#### Step 4: Query by Criteria

```bash
# Find all AA-compliant archetypes
curl -X POST http://localhost:3000/tools/archetype.query \
  -H "Content-Type: application/json" \
  -d '{"wcagLevel": "AA"}'

# Expected: Array of matching archetypes
```

#### Step 5: Verify Claude Integration

Configure Claude Code to use the MCP server:

```json
// .claude/settings.json
{
  "mcpServers": {
    "tekton-archetypes": {
      "command": "node",
      "args": ["packages/studio-mcp/dist/server/index.js"],
      "env": {
        "MCP_PORT": "3000"
      }
    }
  }
}
```

In Claude, verify access:
```
> What hooks are available?
> Show me the useButton archetype
> Find all AA-compliant components
```

### Verification Checklist

- [ ] MCP server starts without errors
- [ ] Health endpoint returns tool list
- [ ] Hook listing returns all 20 hooks
- [ ] Archetype retrieval returns 4-layer data
- [ ] Query filtering works correctly
- [ ] Claude can access MCP tools

---

## 5. Environment Detection

### Overview

The CLI automatically detects your project environment to:
- Select appropriate token format (CSS variables vs StyleSheet)
- Generate platform-specific component code
- Configure proper build tooling

### Supported Environments

| Platform | Framework | Detection Method |
|----------|-----------|------------------|
| Web | Next.js | `next` in dependencies |
| Web | Vite | `vite` in dependencies |
| Web | React | `react` in dependencies |
| Mobile | React Native | `react-native` in dependencies |
| Mobile | Expo | `expo` in dependencies |

### Workflow Verification

#### Step 1: Check Current Environment

```bash
# From your project root
cd /path/to/your/project

# Run environment detection
npx @tekton/cli detect-env

# Expected output:
# Environment Detection Results:
# ├── Platform: web
# ├── Framework: next
# ├── React Native: false
# ├── Expo: false
# ├── Next.js: true
# └── Vite: false
```

#### Step 2: Verify Detection Logic

For a **Next.js** project:
```json
// package.json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0"
  }
}
```

Expected detection:
```typescript
{
  platform: 'web',
  isWeb: true,
  isReactNative: false,
  framework: 'next',
  hasNext: true
}
```

For a **React Native** project:
```json
// package.json
{
  "dependencies": {
    "react-native": "^0.75.0",
    "expo": "^52.0.0"
  }
}
```

Expected detection:
```typescript
{
  platform: 'react-native',
  isWeb: false,
  isReactNative: true,
  hasExpo: true
}
```

#### Step 3: Environment Contract Validation

```bash
# Validate environment configuration
npx @tekton/cli validate-env --config tekton.config.json
```

### Verification Checklist

- [ ] `detect-env` command runs successfully
- [ ] Platform detected correctly (web/react-native)
- [ ] Framework identified (next/vite/react/expo)
- [ ] Detection works in Next.js project
- [ ] Detection works in React Native project
- [ ] Unknown projects return `platform: 'unknown'`

---

## 6. Token & CSS Mapping

### Overview

The Token Contract system maps design tokens to CSS variables:
- Semantic naming: `--tekton-{category}-{variant}`
- OKLCH color space for perceptual uniformity
- Automatic dark mode generation

### CSS Variable Naming Convention

```css
/* Pattern */
--tekton-{semantic}-{step}

/* Examples */
--tekton-primary-500      /* Primary color, medium intensity */
--tekton-neutral-100      /* Neutral color, light */
--tekton-spacing-md       /* Medium spacing */
--tekton-radius-lg        /* Large border radius */
```

### Token Categories

| Category | Examples | Format |
|----------|----------|--------|
| `colors` | `primary-500`, `neutral-100` | OKLCH values |
| `spacing` | `xs`, `sm`, `md`, `lg`, `xl` | rem values |
| `typography` | `font-size-base`, `line-height-tight` | rem/unitless |
| `borderRadius` | `sm`, `md`, `lg`, `full` | rem values |
| `shadows` | `sm`, `md`, `lg`, `xl` | box-shadow |
| `transitions` | `fast`, `normal`, `slow` | duration |
| `breakpoints` | `sm`, `md`, `lg`, `xl` | px values |
| `zIndex` | `modal`, `tooltip`, `dropdown` | integers |
| `opacity` | `disabled`, `hover`, `muted` | 0-1 |

### Workflow Verification

#### Step 1: Generate CSS from Tokens

```bash
# Generate CSS variables
npx @tekton/cli generate-tokens \
  --preset next-tailwind-shadcn \
  --output ./styles/tokens.css
```

Expected output (`styles/tokens.css`):
```css
:root {
  /* Colors - OKLCH format */
  --tekton-primary-500: oklch(0.5 0.15 220);
  --tekton-primary-600: oklch(0.4 0.15 220);
  --tekton-neutral-100: oklch(0.95 0.01 0);
  --tekton-neutral-900: oklch(0.15 0.01 0);

  /* Spacing */
  --tekton-spacing-xs: 0.25rem;
  --tekton-spacing-sm: 0.5rem;
  --tekton-spacing-md: 1rem;
  --tekton-spacing-lg: 1.5rem;

  /* Border Radius */
  --tekton-radius-sm: 0.25rem;
  --tekton-radius-md: 0.5rem;
  --tekton-radius-lg: 1rem;
}
```

#### Step 2: Generate Dark Mode Overrides

```bash
# Generate with dark mode
npx @tekton/cli generate-tokens \
  --preset next-tailwind-shadcn \
  --dark-mode \
  --output ./styles/tokens.css
```

Expected dark mode section:
```css
[data-theme="dark"] {
  --tekton-primary-500: oklch(0.6 0.15 220);
  --tekton-neutral-100: oklch(0.15 0.01 0);
  --tekton-neutral-900: oklch(0.95 0.01 0);
}
```

#### Step 3: Integrate with Tailwind

Add to `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: 'var(--tekton-primary-500)',
          600: 'var(--tekton-primary-600)',
        },
        neutral: {
          100: 'var(--tekton-neutral-100)',
          900: 'var(--tekton-neutral-900)',
        },
      },
      spacing: {
        'tekton-xs': 'var(--tekton-spacing-xs)',
        'tekton-sm': 'var(--tekton-spacing-sm)',
        'tekton-md': 'var(--tekton-spacing-md)',
      },
      borderRadius: {
        'tekton-sm': 'var(--tekton-radius-sm)',
        'tekton-md': 'var(--tekton-radius-md)',
      },
    },
  },
};

export default config;
```

#### Step 4: Verify Token Usage

```tsx
// Component using Tekton tokens via Tailwind
export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-primary-500 text-neutral-100 rounded-tekton-md px-tekton-md py-tekton-sm">
      {children}
    </button>
  );
}
```

#### Step 5: React Native StyleSheet Integration

For React Native projects:

```bash
npx @tekton/cli generate-tokens \
  --preset react-native \
  --format stylesheet \
  --output ./styles/tokens.ts
```

Expected output (`styles/tokens.ts`):
```typescript
export const tokens = {
  colors: {
    primary500: 'oklch(0.5 0.15 220)',
    neutral100: 'oklch(0.95 0.01 0)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
};
```

### Verification Checklist

- [ ] Token generation produces valid CSS
- [ ] OKLCH color format is correct
- [ ] Dark mode overrides generate correctly
- [ ] CSS variables use `--tekton-*` prefix
- [ ] Tailwind integration works
- [ ] React Native StyleSheet format generates
- [ ] All 9 token categories are present

---

## 7. Hook Component Configuration

### Overview

The Archetype System defines how headless hooks connect to design tokens:
- **Hook Prop Rules**: Map hook props to CSS properties
- **State-Style Mapping**: Define styles for component states
- **Variant Branching**: Handle component variants
- **Structure Templates**: Define component HTML structure

### Available Headless Hooks (20 total)

**Component Tier**:
| Hook | Purpose | Props |
|------|---------|-------|
| `useButton` | Button with toggle | `buttonProps` |
| `useCheckbox` | Checkbox with a11y | `checkboxProps`, `labelProps` |
| `useRadio` | Radio button groups | `radioProps`, `radioGroupProps` |
| `useToggle` | Toggle switch | `toggleProps` |
| `useInput` | Text input | `inputProps`, `labelProps` |
| `useSelect` | Select/Combobox | `selectProps`, `optionProps` |

**Overlay Tier**:
| Hook | Purpose | Props |
|------|---------|-------|
| `useModal` | Modal dialog | `overlayProps`, `modalProps` |
| `usePopover` | Popover positioning | `triggerProps`, `popoverProps` |
| `useDropdownMenu` | Dropdown menu | `menuProps`, `itemProps` |
| `useTooltip` | Tooltip | `triggerProps`, `tooltipProps` |
| `useAlert` | Alert dialog | `alertProps` |
| `useSlider` | Range slider | `sliderProps`, `thumbProps` |

**Navigation Tier**:
| Hook | Purpose | Props |
|------|---------|-------|
| `useTabs` | Tab navigation | `tabListProps`, `tabProps`, `panelProps` |
| `useBreadcrumb` | Breadcrumb nav | `navProps`, `itemProps` |
| `usePagination` | Pagination | `paginationProps`, `pageProps` |
| `useRangeCalendar` | Date range | `calendarProps`, `cellProps` |
| `useProgress` | Progress bar | `progressProps`, `fillProps` |

**Display Tier**:
| Hook | Purpose | Props |
|------|---------|-------|
| `useCard` | Card container | `cardProps` |
| `useBadge` | Badge display | `badgeProps` |
| `useAvatar` | Avatar display | `avatarProps` |
| `useDivider` | Divider | `dividerProps` |

### Hook Prop Rule Structure

```typescript
interface HookPropRule {
  hookName: string;           // "useButton"
  propObjects: string[];      // ["buttonProps"]
  baseStyles: BaseStyle[];    // CSS property mappings
  requiredCSSVariables: string[];
}

interface BaseStyle {
  propObject: string;
  cssProperties: Record<string, string>;
}
```

### Workflow Verification

#### Step 1: View Hook Prop Rules

```bash
# List all hook prop rules
npx @tekton/cli list-archetypes

# Expected output:
# Available Hook Archetypes:
# ├── useButton (buttonProps)
# ├── useInput (inputProps, labelProps)
# ├── useModal (overlayProps, modalProps)
# └── ... (17 more)
```

#### Step 2: Inspect Specific Rule

```bash
# Get details for useButton
npx @tekton/cli show-archetype useButton
```

Expected output:
```yaml
Hook: useButton
PropObjects:
  - buttonProps
BaseStyles:
  buttonProps:
    background-color: var(--tekton-primary-500)
    color: var(--tekton-neutral-100)
    border-radius: var(--tekton-radius-md)
    padding: var(--tekton-spacing-sm) var(--tekton-spacing-md)
    transition: var(--tekton-transition-normal)
RequiredCSSVariables:
  - --tekton-primary-500
  - --tekton-neutral-100
  - --tekton-radius-md
  - --tekton-spacing-sm
  - --tekton-spacing-md
  - --tekton-transition-normal
```

#### Step 3: Validate Hook Prop Rules

```bash
# Validate all rules against token contract
npx @tekton/cli validate-archetypes

# Expected output:
# Validating Hook Prop Rules...
# ✓ useButton: All CSS variables exist in token contract
# ✓ useInput: All CSS variables exist in token contract
# ✓ useModal: All CSS variables exist in token contract
# ...
# Validation complete: 20/20 rules valid
```

#### Step 4: Generate Styled Component

```bash
# Generate styled component from hook
npx @tekton/cli generate-component \
  --hook useButton \
  --variant primary \
  --output ./components/Button.tsx
```

Expected output (`components/Button.tsx`):
```tsx
'use client';

import { useButton } from '@tekton/headless-components';
import { forwardRef } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  isDisabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, onPress, isDisabled }, ref) => {
    const { buttonProps } = useButton({
      onPress,
      isDisabled,
    });

    return (
      <button
        {...buttonProps}
        ref={ref}
        style={{
          backgroundColor: 'var(--tekton-primary-500)',
          color: 'var(--tekton-neutral-100)',
          borderRadius: 'var(--tekton-radius-md)',
          padding: 'var(--tekton-spacing-sm) var(--tekton-spacing-md)',
          transition: 'var(--tekton-transition-normal)',
        }}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

#### Step 5: Verify State-Style Mapping

State-style mappings define styles for different component states:

```typescript
// State-Style Mapping Example
{
  hookName: 'useButton',
  states: {
    default: {
      backgroundColor: 'var(--tekton-primary-500)',
    },
    hover: {
      backgroundColor: 'var(--tekton-primary-600)',
    },
    pressed: {
      backgroundColor: 'var(--tekton-primary-700)',
    },
    disabled: {
      backgroundColor: 'var(--tekton-neutral-300)',
      opacity: 'var(--tekton-opacity-disabled)',
    },
  },
}
```

#### Step 6: Test Variant Branching

```bash
# Generate multiple variants
npx @tekton/cli generate-component \
  --hook useButton \
  --variants primary,secondary,outline \
  --output ./components/
```

### Verification Checklist

- [ ] All 20 hooks are listed
- [ ] Hook prop rules load correctly
- [ ] Base styles use `var(--tekton-*)` format
- [ ] No hardcoded colors in rules
- [ ] CSS variable validation passes
- [ ] Component generation works
- [ ] State-style mappings apply correctly
- [ ] Variant branching generates multiple styles

---

## 8. Screen Creation

### Overview

The screen creation workflow generates complete page structures:
- Environment-aware code generation
- Skeleton-based layouts
- Intent-driven component suggestions
- Contract validation at each step

### Screen Intents

| Intent | Description | Suggested Components |
|--------|-------------|---------------------|
| `DataList` | Data listing page | Table, Card, Pagination, Search |
| `DataDetail` | Detail view page | Card, Badge, Button, Tabs |
| `Dashboard` | Dashboard layout | Card, Chart, Progress, Badge |
| `Form` | Form submission | Input, Select, Checkbox, Button |
| `Wizard` | Multi-step flow | Progress, Button, Card |
| `Auth` | Authentication | Input, Button, Card |
| `Settings` | Settings page | Toggle, Input, Select, Card |
| `EmptyState` | Empty state | Button, Card |
| `Error` | Error page | Button, Card |
| `Custom` | Custom layout | (user-specified) |

### Skeleton Presets

| Preset | Structure |
|--------|-----------|
| `full-screen` | Content only, no chrome |
| `with-header` | Header + Content |
| `with-sidebar` | Sidebar + Content |
| `with-header-sidebar` | Header + Sidebar + Content |
| `with-header-footer` | Header + Content + Footer |
| `dashboard` | Header + Sidebar + Content + Footer |

### Workflow Verification

#### Step 1: Create Screen (Interactive Mode)

```bash
npx @tekton/cli create-screen --interactive
```

Interactive prompts:
```
? Screen name: UserDashboard
? Environment: web
? Skeleton preset: dashboard
? Screen intent: Dashboard
? Components (auto-suggested): Card, Progress, Badge, Chart
? Output path: src/screens
```

#### Step 2: Create Screen (Non-Interactive)

```bash
npx @tekton/cli create-screen \
  --name UserDashboard \
  --environment web \
  --skeleton dashboard \
  --intent Dashboard \
  --components Card,Progress,Badge \
  --path src/screens
```

#### Step 3: Verify Generated Structure

```bash
tree src/screens/UserDashboard/
```

Expected structure:
```
src/screens/UserDashboard/
├── page.tsx           # Page component
├── layout.tsx         # Layout wrapper
└── components/
    └── index.ts       # Component exports
```

#### Step 4: Inspect Generated Files

**`page.tsx`**:
```tsx
'use client';

import { Card } from '@tekton/headless-components';
import { Progress } from '@tekton/headless-components';
import { Badge } from '@tekton/headless-components';

export default function UserDashboardPage() {
  return (
    <div className="flex flex-col gap-tekton-md p-tekton-lg">
      <section className="grid grid-cols-3 gap-tekton-md">
        <Card>
          <Card.Header>
            <Badge>Active</Badge>
          </Card.Header>
          <Card.Body>
            <Progress value={75} />
          </Card.Body>
        </Card>
      </section>
    </div>
  );
}
```

**`layout.tsx`**:
```tsx
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function UserDashboardLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b">
        {/* Header content */}
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r">
          {/* Sidebar content */}
        </aside>
        <main className="flex-1 p-tekton-lg">
          {children}
        </main>
      </div>
      <footer className="h-12 border-t">
        {/* Footer content */}
      </footer>
    </div>
  );
}
```

#### Step 5: Validate Screen Contract

```bash
npx @tekton/cli validate-screen src/screens/UserDashboard
```

Expected output:
```
Validating Screen: UserDashboard
├── ✓ Screen name format: PascalCase
├── ✓ Environment: web (valid)
├── ✓ Skeleton: dashboard (valid)
├── ✓ Intent: Dashboard (valid)
├── ✓ Components: Card, Progress, Badge (all exist)
└── ✓ File structure: Complete

Validation passed!
```

#### Step 6: Test Environment-Specific Generation

For React Native:
```bash
npx @tekton/cli create-screen \
  --name UserProfile \
  --environment mobile \
  --skeleton with-header \
  --intent DataDetail
```

Expected React Native structure:
```tsx
// Uses StyleSheet instead of Tailwind classes
import { StyleSheet, View, ScrollView } from 'react-native';
import { tokens } from '@tekton/token-contract';

export default function UserProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Content */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: tokens.spacing.lg,
  },
});
```

### Verification Checklist

- [ ] Interactive mode prompts correctly
- [ ] Screen name validation (PascalCase)
- [ ] Environment detection works
- [ ] Skeleton presets apply correctly
- [ ] Intent suggests appropriate components
- [ ] File structure generates correctly
- [ ] Contract validation passes
- [ ] Web generates Tailwind classes
- [ ] Mobile generates StyleSheet
- [ ] Components import from headless library

---

## 9. End-to-End Verification Checklist

Use this checklist to verify the complete Tekton system is working:

### Infrastructure

- [ ] **Node.js 22+** installed (`node --version`)
- [ ] **pnpm 9+** installed (`pnpm --version`)
- [ ] **Python 3.13+** installed (`python --version`)
- [ ] **PostgreSQL 16+** running (`pg_isready`)

### Services

- [ ] **Studio MCP** running at `http://localhost:3000`
- [ ] **Studio API** running at `http://localhost:8000`
- [ ] **Studio Web** *(Planned)* - not yet implemented

### MCP Integration

- [ ] MCP health check passes
- [ ] Hook listing returns all hooks
- [ ] Archetype retrieval works
- [ ] Query filtering works correctly
- [ ] Claude Code can access MCP tools

### Environment Detection

- [ ] Next.js project detected correctly
- [ ] React Native project detected correctly
- [ ] Vite project detected correctly
- [ ] Unknown project returns `unknown`

### Token & CSS Mapping

- [ ] CSS generation produces valid output
- [ ] OKLCH colors format correctly
- [ ] Dark mode overrides work
- [ ] Tailwind integration functions
- [ ] React Native StyleSheet generates

### Hook Component Configuration

- [ ] All 20 hooks are available
- [ ] Hook prop rules validate
- [ ] No hardcoded colors in rules
- [ ] Component generation works
- [ ] State-style mappings apply

### Screen Creation

- [ ] Interactive mode works
- [ ] Non-interactive mode works
- [ ] All skeleton presets generate
- [ ] All intents suggest components
- [ ] Web output uses Tailwind
- [ ] Mobile output uses StyleSheet
- [ ] Contract validation passes

### Integration Flow

- [ ] Archetype → Component Generation → CSS Variables → Component Styling
- [ ] Environment Detection → Platform-Specific Generation
- [ ] Intent → Component Suggestions → Screen Generation

---

## 10. Troubleshooting

### Common Issues

#### MCP Server Won't Start

```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill existing process
kill -9 <PID>

# Restart MCP server
cd packages/studio-mcp && pnpm dev
```

#### Database Connection Failed

```bash
# Verify PostgreSQL is running
pg_isready -h localhost -p 5432

# Check connection string
echo $DATABASE_URL

# Run migrations
cd packages/studio-api
alembic upgrade head
```

#### Token Generation Fails

```bash
# Check preset exists
ls packages/token-contract/dist/presets/defaults/

# Validate preset JSON
cat packages/token-contract/dist/presets/defaults/next-tailwind-shadcn.json | jq .
```

#### Hook Validation Errors

```bash
# Check for hardcoded colors
grep -r "rgb\|hsl\|#[0-9a-fA-F]" packages/archetype-system/src/

# Validate CSS variables exist
npx @tekton/cli validate-tokens
```

#### Screen Generation Fails

```bash
# Check screen name format
# Must be PascalCase: UserDashboard, not user-dashboard

# Verify environment
npx @tekton/cli detect-env

# Check output directory exists
mkdir -p src/screens
```

### Getting Help

- **Documentation**: `docs/` directory
- **Specifications**: `.moai/specs/` directory
- **Issues**: GitHub Issues
- **MoAI Commands**: `/moai:9-feedback "your feedback"`

---

## Appendix: Quick Reference

### CLI Commands

```bash
# Environment
npx @tekton/cli detect-env

# Tokens
npx @tekton/cli generate-tokens --preset <name> --output <path>
npx @tekton/cli validate-tokens

# Archetypes
npx @tekton/cli list-archetypes
npx @tekton/cli show-archetype <hookName>
npx @tekton/cli validate-archetypes

# Components
npx @tekton/cli generate-component --hook <name> --output <path>

# Screens
npx @tekton/cli create-screen --interactive
npx @tekton/cli create-screen --name <Name> --skeleton <preset> --intent <type>
npx @tekton/cli validate-screen <path>
```

### API Endpoints

```bash
# Health Checks
GET /api/v2/health

# Presets
GET    /api/v2/presets
POST   /api/v2/presets
GET    /api/v2/presets/{id}
PUT    /api/v2/presets/{id}
DELETE /api/v2/presets/{id}
```

### MCP Tools

```bash
archetype.list          # List all hooks
archetype.get           # Get complete archetype
archetype.getPropRules  # Get Layer 1 (prop rules)
archetype.getStateMappings  # Get Layer 2 (state mappings)
archetype.getVariants   # Get Layer 3 (variants)
archetype.getStructure  # Get Layer 4 (structure)
archetype.query         # Search by criteria
```

---

*This guide is part of the Tekton Design System documentation.*
