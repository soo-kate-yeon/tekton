# Tekton Standalone MCP Server - User Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Built-in Themes](#built-in-themes)
5. [Available MCP Tools](#available-mcp-tools)
6. [Claude Code Integration](#claude-code-integration)
7. [Configuration](#configuration)
8. [API Reference](#api-reference)
9. [Usage Examples](#usage-examples)
10. [Troubleshooting](#troubleshooting)

---

## Introduction

### What is Tekton Standalone MCP Server?

Tekton Standalone MCP Server (`@tekton/mcp-server`) is an npm-distributed package that provides AI-powered design system tools via the Model Context Protocol (MCP). It enables AI assistants like Claude to query and use design themes, components, and component generation tools for building modern web applications.

### Key Benefits

- **Zero Configuration**: Works out-of-the-box with 7 professional built-in themes
- **Framework Agnostic**: Supports Next.js, Vite, React, and more
- **AI-Powered**: Provides context-aware design guidance for AI assistants
- **Type-Safe**: Full TypeScript support with Zod schema validation
- **Standalone or Connected**: Works independently or connects to Tekton Studio API

### Use Cases

- Rapid prototyping with AI-assisted component generation
- Maintaining design consistency across projects
- Applying professional design systems without manual setup
- Creating accessible, WCAG-compliant interfaces
- Framework detection and project structure analysis

### Operating Modes

**Standalone Mode** (Default)
- Uses 7 built-in themes bundled with the package
- No external API connection required
- Perfect for getting started quickly
- Full offline support

**Connected Mode** (Advanced)
- Connects to Tekton Studio API at `http://localhost:8000`
- Access to custom themes and cloud features
- Collaborative design system management
- Analytics and usage tracking

---

## Installation

### Requirements

- **Node.js**: Version 20.0.0 or higher
- **Package Manager**: npm, pnpm, or yarn

### Option 1: Install from npm (When Published)

> ⚠️ **Note:** This package is not yet published to npm. Use Option 2 or 3 below for now.

Once published to npm, you can install directly:

```bash
npm install @tekton/mcp-server
# or
pnpm add @tekton/mcp-server
# or
yarn add @tekton/mcp-server
```

### Option 2: Install from GitHub Repository

Install directly from the GitHub repository:

```bash
npm install github:tekton-design/tekton#main
# or specify a specific commit/tag
npm install github:tekton-design/tekton#v1.0.0
```

> ⚠️ **Note:** This requires the repository to be public and may have issues with workspace dependencies.

### Option 3: Install from Local Development (Recommended for Testing)

If you're testing the package before it's published to npm, follow these steps:

#### Step 1: Clone and Build the Repository

```bash
# Clone the Tekton repository
git clone https://github.com/tekton-design/tekton.git
cd tekton

# Install all dependencies (this handles workspace dependencies)
pnpm install

# Build the component-system package (required dependency)
cd packages/component-system
pnpm run build
cd ../..

# Build the studio-mcp package
cd packages/studio-mcp
pnpm run build
cd ../..
```

#### Step 2: Install in Your Project

Choose one of the following methods:

**Method A - Direct Path Installation:**

```bash
# From your project directory
npm install /absolute/path/to/tekton/packages/studio-mcp

# Example
npm install /Users/yourname/Developer/tekton/packages/studio-mcp
```

**Method B - Using npm link:**

```bash
# Step 1: Link the component-system package first
cd /path/to/tekton/packages/component-system
npm link

# Step 2: Link the studio-mcp package
cd /path/to/tekton/packages/studio-mcp
npm link @tekton/component-system
npm link

# Step 3: Link in your project
cd /path/to/your/project
npm link @tekton/mcp-server
```

**Method C - Using npm pack (Most Reliable):**

```bash
# From the studio-mcp directory
cd /path/to/tekton/packages/studio-mcp
npm pack
# This creates: tekton-mcp-server-1.0.0.tgz

# From your project directory
npm install /path/to/tekton/packages/studio-mcp/tekton-mcp-server-1.0.0.tgz
```

#### Step 3: Run the Server

Since you installed locally, run the server using one of these methods:

```bash
# Using npx (if installed in node_modules)
npx tekton-mcp

# Or run directly from the tekton repository
node /path/to/tekton/packages/studio-mcp/dist/server/index.js

# Or add to your package.json scripts
{
  "scripts": {
    "mcp": "tekton-mcp"
  }
}
```

### Important: Workspace Dependencies

The `@tekton/mcp-server` package depends on `@tekton/component-system`, which is a workspace dependency in the monorepo. When installing locally:

1. **Always build component-system first:**
   ```bash
   cd packages/component-system
   pnpm run build
   ```

2. **Then build studio-mcp:**
   ```bash
   cd packages/studio-mcp
   pnpm run build
   ```

3. **The build creates these directories:**
   - `packages/component-system/dist/` - TypeScript compiled output
   - `packages/studio-mcp/dist/` - Server executable and types

### Verify Installation

```bash
# Check if CLI is available
npx tekton-mcp --help

# Or run directly
node /path/to/tekton/packages/studio-mcp/dist/server/index.js

# Test with curl
curl http://localhost:3000/health
```

---

## Quick Start

### Starting the Server

**Default Configuration** (Port 3000)

```bash
npx tekton-mcp
```

**Custom Port Configuration**

```bash
# Using environment variable
MCP_PORT=4000 npx tekton-mcp

# Using npm
MCP_PORT=4000 npm start

# Using pnpm
MCP_PORT=4000 pnpm start
```

### Server Output

When the server starts successfully, you'll see:

```
🚀 Tekton MCP Server running at http://localhost:3000
   Mode:   Standalone
   Health: http://localhost:3000/health
   Tools:  http://localhost:3000/tools
```

### Health Check

Verify the server is running:

```bash
curl http://localhost:3000/health
```

**Response:**

```json
{
  "status": "ok",
  "service": "tekton-mcp",
  "mode": "standalone",
  "version": "1.0.0",
  "tools": [
    "component.list",
    "component.get",
    "theme.list",
    "theme.get",
    "project.status",
    "screen.create",
    ...
  ],
  "features": {
    "customPresets": false,
    "cloudSync": false,
    "analytics": false
  }
}
```

### Basic Tool Usage Example

**List Available Themes:**

```bash
curl -X POST http://localhost:3000/tools/theme.list
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "next-tailwind-shadcn",
      "name": "Next.js + Tailwind + shadcn/ui",
      "description": "Professional web applications...",
      "stackInfo": {
        "framework": "nextjs",
        "styling": "tailwindcss",
        "components": "shadcn-ui"
      },
      "brandTone": "professional"
    },
    ...
  ]
}
```

---

## Built-in Themes

The MCP server includes 7 professionally crafted themes for different use cases and technology stacks.

### Theme Overview

| Theme ID | Name | Framework | Styling | Components | Brand Tone |
|-----------|------|-----------|---------|------------|------------|
| `next-tailwind-shadcn` | Next.js + Tailwind + shadcn/ui | Next.js | Tailwind CSS | shadcn/ui | Professional |
| `next-tailwind-radix` | Next.js + Tailwind + Radix UI | Next.js | Tailwind CSS | Radix UI | Professional |
| `vite-tailwind-shadcn` | Vite + Tailwind + shadcn/ui | Vite | Tailwind CSS | shadcn/ui | Professional |
| `next-styled-components` | Next.js + Styled Components | Next.js | Styled Components | - | Elegant |
| `saas-dashboard` | SaaS Dashboard | Next.js | Tailwind CSS | shadcn/ui | Professional |
| `tech-startup` | Tech Startup | Next.js | Tailwind CSS | Radix UI | Bold |
| `premium-editorial` | Premium Editorial | Next.js | Tailwind CSS | - | Elegant |

### Theme Structure

Each theme contains:

#### 1. Basic Information
- **id**: Unique identifier
- **name**: Human-readable name
- **description**: Purpose and use case
- **stackInfo**: Framework, styling, and component library

#### 2. Design Tokens

**Color Palette (OKLCH Color System)**
```json
{
  "primary": { "l": 0.5, "c": 0.15, "h": 220 },
  "secondary": { "l": 0.6, "c": 0.1, "h": 200 },
  "accent": { "l": 0.55, "c": 0.2, "h": 250 },
  "neutral": { "l": 0.5, "c": 0.02, "h": 220 }
}
```

- **L (Lightness)**: 0-1 (0 = black, 1 = white)
- **C (Chroma)**: 0-0.5 (color intensity)
- **H (Hue)**: 0-360 (color angle)

**Typography**
```json
{
  "fontFamily": "Inter, system-ui, sans-serif",
  "fontScale": "medium",
  "headingWeight": 600,
  "bodyWeight": 400
}
```

**Component Defaults**
```json
{
  "borderRadius": "medium",
  "density": "comfortable",
  "contrast": "high"
}
```

#### 3. AI Context

Provides guidance for AI assistants:

```json
{
  "brandTone": "professional",
  "designPhilosophy": "Clean, modern, and accessible design...",
  "colorGuidance": "Use primary blue for interactive elements...",
  "componentGuidance": "Follow shadcn/ui component patterns...",
  "accessibilityNotes": "All components meet WCAG 2.1 AA standards..."
}
```

### Theme Selection Guide

**For Professional Applications:**
- Use `next-tailwind-shadcn` for enterprise apps with high accessibility needs
- Use `next-tailwind-radix` for headless UI with full customization

**For Rapid Prototyping:**
- Use `vite-tailwind-shadcn` for fast development cycles
- Use `next-styled-components` for CSS-in-JS approach

**For Specific Domains:**
- Use `saas-dashboard` for B2B SaaS applications
- Use `tech-startup` for tech-focused products with bold branding
- Use `premium-editorial` for content-heavy, editorial-style sites

---

## Available MCP Tools

The server provides 26 MCP tools across 4 categories.

### Component Tools (7 tools)

Query hook components for component generation with 4-layer architecture.

| Tool | Description | Parameters |
|------|-------------|------------|
| `component.list` | List all available hooks | None |
| `component.get` | Get complete component (all 4 layers) | `hookName` |
| `component.getPropRules` | Get Layer 1: Hook prop rules | `hookName` |
| `component.getStateMappings` | Get Layer 2: State-style mappings | `hookName` |
| `component.getVariants` | Get Layer 3: Variant branching | `hookName` |
| `component.getStructure` | Get Layer 4: Structure templates | `hookName` |
| `component.query` | Search components by criteria | `wcagLevel`, `stateName`, `hasVariant`, `propObject` |

**Available Hooks:**
- `useButton`, `useTextField`, `useCheckbox`, `useRadio`, `useToggle`
- `useDialog`, `useMenu`, `useTooltip`, `usePopover`
- `useTable`, `useList`, `useCard`, `useTabs`
- And 20+ more...

### Screen Tools (5 tools)

Create and manage screens (pages) in your project.

| Tool | Description | Parameters |
|------|-------------|------------|
| `screen.create` | Create new screen with routing | `name`, `intent`, `targetPath`, `linkFrom?`, `projectPath?` |
| `screen.addComponent` | Add component to existing screen | `screenName`, `componentType`, `props?`, `projectPath?` |
| `screen.applyArchetype` | Apply style component to screen | `screenName`, `archetypeName`, `projectPath?` |
| `screen.list` | List all screens in project | `projectPath?` |
| `screen.preview` | Get preview URL for screen | `screenName`, `projectPath?` |

**Available Components:**
- Professional, Creative, Minimal, Bold, Warm, Cool, High-Contrast

### Project Tools (4 tools)

Detect project structure and manage configuration.

| Tool | Description | Parameters |
|------|-------------|------------|
| `project.detectStructure` | Detect framework and project type | `projectPath` |
| `project.getActivePreset` | Get currently active theme | `projectPath?` |
| `project.setActivePreset` | Set active theme (connected mode) | `presetId`, `projectPath?` |
| `project.status` | Get project status and mode | `projectPath?` |

### Theme Tools (4 tools)

Manage design themes (standalone mode).

| Tool | Description | Parameters |
|------|-------------|------------|
| `theme.list` | List all built-in themes | None |
| `theme.get` | Get complete theme details | `presetId` |
| `project.useBuiltinPreset` | Activate built-in theme | `presetId`, `projectPath?` |
| `theme.status` | Get theme system status | None |

---

## Claude Code Integration

### Configure Claude Code Settings

Add the MCP server to your Claude Code configuration:

**Option 1: Local Installation**

Edit `.claude/settings.json`:

```json
{
  "mcpServers": {
    "tekton": {
      "command": "npx",
      "args": ["tekton-mcp"],
      "env": {
        "MCP_PORT": "3000"
      }
    }
  }
}
```

**Option 2: Project-Specific Installation**

If installed in a monorepo or specific package:

```json
{
  "mcpServers": {
    "tekton": {
      "command": "node",
      "args": ["./packages/studio-mcp/dist/server/index.js"],
      "env": {
        "MCP_PORT": "3000"
      }
    }
  }
}
```

### Using Tools in Claude

Once configured, Claude can access all MCP tools directly.

**Example Conversations:**

```
User: What themes are available?
Claude: [Uses theme.list tool]

User: Show me the next-tailwind-shadcn theme details
Claude: [Uses theme.get tool with presetId="next-tailwind-shadcn"]

User: Create a user profile page
Claude: [Uses screen.create tool]

User: What's the project status?
Claude: [Uses project.status tool]

User: Add a button component to the dashboard screen
Claude: [Uses screen.addComponent tool]

User: Find all WCAG AA compliant components
Claude: [Uses component.query with wcagLevel="AA"]
```

### Tool Invocation Best Practices

**Let Claude decide when to use tools:**
- Ask high-level questions about design and components
- Request specific themes or components
- Request project structure analysis
- Ask for component generation

**Claude will automatically:**
- Select appropriate tools based on your question
- Chain multiple tool calls when needed
- Format responses with the retrieved data
- Provide design guidance using AI context from themes

---

## Configuration

### Local Configuration File

The MCP server creates a local configuration file at `.tekton/config.json` in your project.

**Default Configuration:**

```json
{
  "$schema": "https://tekton.design/schemas/config.json",
  "version": "1.0.0",
  "mode": "standalone",
  "project": {
    "name": "my-project",
    "frameworkType": "nextjs",
    "detectedAt": "2026-01-18T12:00:00Z"
  },
  "theme": {
    "activePresetId": null,
    "selectedAt": null
  }
}
```

### Configuration Schema

**Top-Level Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `$schema` | string | JSON schema URL for validation |
| `version` | string | Config version (semver) |
| `mode` | enum | `"standalone"` or `"connected"` |
| `project` | object | Project metadata |
| `theme` | object | Active theme selection |

**Project Object:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Project name |
| `frameworkType` | string | Detected framework (`nextjs`, `vite`, etc.) |
| `detectedAt` | string | ISO 8601 timestamp of detection |

**Theme Object:**

| Field | Type | Description |
|-------|------|-------------|
| `activePresetId` | string \| null | Currently active theme ID |
| `selectedAt` | string \| null | ISO 8601 timestamp of selection |

### Mode Detection

The server automatically detects its operating mode:

**Standalone Mode** (Default)
- Activated when: Studio API is not available
- Features: Built-in themes, local config, offline operation
- Limitations: No custom themes, no cloud sync

**Connected Mode** (Advanced)
- Activated when: Studio API is available at `http://localhost:8000`
- Features: All standalone features + custom themes + cloud sync + analytics
- Requires: Tekton Studio API running locally

**Manual Mode Override:**

```bash
# Force standalone mode
TEKTON_MODE=standalone npx tekton-mcp

# Force connected mode (will fail if API unavailable)
TEKTON_MODE=connected npx tekton-mcp
```

### Framework Detection

The MCP server detects your project's framework automatically.

**Supported Frameworks:**

- **Next.js**: Detected via `next.config.js` or `next.config.mjs`
- **Vite**: Detected via `vite.config.js` or `vite.config.ts`
- **Create React App**: Detected via `react-scripts` in `package.json`
- **Remix**: Detected via `remix.config.js`
- **Astro**: Detected via `astro.config.mjs`
- **SvelteKit**: Detected via `svelte.config.js`

**Detection Process:**

1. Read `package.json` for framework dependencies
2. Check for framework-specific config files
3. Analyze directory structure patterns
4. Store detected framework in `.tekton/config.json`

---

## API Reference

### HTTP Endpoints

The MCP server exposes three primary HTTP endpoints.

#### GET /health

Health check endpoint.

**Request:**

```bash
curl http://localhost:3000/health
```

**Response:**

```json
{
  "status": "ok",
  "service": "tekton-mcp",
  "mode": "standalone",
  "version": "1.0.0",
  "tools": ["component.list", "theme.list", ...],
  "features": {
    "customPresets": false,
    "cloudSync": false,
    "analytics": false
  }
}
```

**Response Fields:**

- `status`: Server status (`"ok"` or `"error"`)
- `service`: Service identifier (`"tekton-mcp"`)
- `mode`: Operating mode (`"standalone"` or `"connected"`)
- `version`: Package version
- `tools`: Array of available tool names
- `features`: Feature availability flags

#### GET /tools

List all available MCP tools.

**Request:**

```bash
curl http://localhost:3000/tools
```

**Response:**

```json
{
  "tools": [
    {
      "name": "theme.list",
      "description": "List all built-in themes...",
      "inputSchema": {
        "type": "object",
        "properties": {},
        "required": []
      }
    },
    {
      "name": "theme.get",
      "description": "Get complete theme details...",
      "inputSchema": {
        "type": "object",
        "properties": {
          "presetId": {
            "type": "string",
            "description": "Theme ID"
          }
        },
        "required": ["presetId"]
      }
    },
    ...
  ]
}
```

**Tool Definition:**

- `name`: Tool identifier
- `description`: Human-readable description
- `inputSchema`: JSON Schema for parameters

#### POST /tools/{toolName}

Execute an MCP tool.

**Request:**

```bash
curl -X POST http://localhost:3000/tools/theme.get \
  -H "Content-Type: application/json" \
  -d '{"presetId": "next-tailwind-shadcn"}'
```

**Response (Success):**

```json
{
  "success": true,
  "data": {
    "id": "next-tailwind-shadcn",
    "name": "Next.js + Tailwind + shadcn/ui",
    "description": "...",
    "stackInfo": { ... },
    "colorPalette": { ... },
    "typography": { ... },
    "componentDefaults": { ... },
    "aiContext": { ... }
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Theme not found: invalid-theme-id"
}
```

### Tool Examples

#### Theme Tools

**List Themes:**

```bash
curl -X POST http://localhost:3000/tools/theme.list
```

**Get Theme:**

```bash
curl -X POST http://localhost:3000/tools/theme.get \
  -H "Content-Type: application/json" \
  -d '{"presetId": "next-tailwind-shadcn"}'
```

**Use Built-in Theme:**

```bash
curl -X POST http://localhost:3000/tools/project.useBuiltinPreset \
  -H "Content-Type: application/json" \
  -d '{
    "presetId": "saas-dashboard",
    "projectPath": "/path/to/project"
  }'
```

#### Project Tools

**Detect Structure:**

```bash
curl -X POST http://localhost:3000/tools/project.detectStructure \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/path/to/project"}'
```

**Get Project Status:**

```bash
curl -X POST http://localhost:3000/tools/project.status \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/path/to/project"}'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "mode": "standalone",
    "activePreset": {
      "id": "next-tailwind-shadcn",
      "name": "Next.js + Tailwind + shadcn/ui"
    },
    "framework": {
      "type": "nextjs",
      "version": "14.0.0"
    }
  }
}
```

#### Component Tools

**List Components:**

```bash
curl -X POST http://localhost:3000/tools/component.list
```

**Get Button Component:**

```bash
curl -X POST http://localhost:3000/tools/component.get \
  -H "Content-Type: application/json" \
  -d '{"hookName": "useButton"}'
```

**Query by WCAG Level:**

```bash
curl -X POST http://localhost:3000/tools/component.query \
  -H "Content-Type: application/json" \
  -d '{"wcagLevel": "AA"}'
```

**Query by State Name:**

```bash
curl -X POST http://localhost:3000/tools/component.query \
  -H "Content-Type: application/json" \
  -d '{"stateName": "isPressed"}'
```

#### Screen Tools

**Create Screen:**

```bash
curl -X POST http://localhost:3000/tools/screen.create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "user-profile",
    "intent": "User profile page with avatar and settings",
    "targetPath": "/users/profile",
    "projectPath": "/path/to/project"
  }'
```

**Add Component:**

```bash
curl -X POST http://localhost:3000/tools/screen.addComponent \
  -H "Content-Type: application/json" \
  -d '{
    "screenName": "dashboard",
    "componentType": "useButton",
    "props": {
      "variant": "primary",
      "size": "medium"
    },
    "projectPath": "/path/to/project"
  }'
```

**List Screens:**

```bash
curl -X POST http://localhost:3000/tools/screen.list \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/path/to/project"}'
```

---

## Usage Examples

### Example 1: Starting a New Project

**Scenario:** You're starting a new Next.js project and want to use the shadcn/ui theme.

**Step 1:** Install and start the MCP server

```bash
npm install @tekton/mcp-server
npx tekton-mcp
```

**Step 2:** List available themes

```bash
curl -X POST http://localhost:3000/tools/theme.list
```

**Step 3:** Get theme details

```bash
curl -X POST http://localhost:3000/tools/theme.get \
  -H "Content-Type: application/json" \
  -d '{"presetId": "next-tailwind-shadcn"}'
```

**Step 4:** Activate the theme

```bash
curl -X POST http://localhost:3000/tools/project.useBuiltinPreset \
  -H "Content-Type: application/json" \
  -d '{
    "presetId": "next-tailwind-shadcn",
    "projectPath": "."
  }'
```

### Example 2: Creating Pages with AI

**Scenario:** Use Claude Code to create a dashboard page.

**Conversation:**

```
You: Create a dashboard page with navigation and user profile

Claude: I'll create a dashboard page for you.
[Uses screen.create tool]

You: Add a table component to show user data

Claude: I'll add a table component to the dashboard.
[Uses screen.addComponent with componentType="useTable"]

You: Apply a professional style component

Claude: I'll apply the Professional component.
[Uses screen.applyArchetype with archetypeName="Professional"]
```

### Example 3: Querying Accessible Components

**Scenario:** Find all WCAG AA compliant components.

```bash
curl -X POST http://localhost:3000/tools/component.query \
  -H "Content-Type: application/json" \
  -d '{"wcagLevel": "AA"}'
```

**Response:**

```json
{
  "success": true,
  "data": [
    "useButton",
    "useTextField",
    "useCheckbox",
    "useRadio",
    "useDialog",
    ...
  ]
}
```

### Example 4: Project Structure Detection

**Scenario:** Analyze an existing project's structure.

```bash
curl -X POST http://localhost:3000/tools/project.detectStructure \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/Users/dev/my-app"}'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "framework": "nextjs",
    "version": "14.0.3",
    "hasAppRouter": true,
    "hasPagesRouter": false,
    "stylingMethod": "tailwindcss",
    "componentLibraries": ["shadcn-ui"],
    "packageManager": "pnpm"
  }
}
```

### Example 5: Working with Themes Programmatically

**JavaScript/TypeScript Example:**

```typescript
import { presetList, presetGet } from '@tekton/mcp-server';

// List all themes
async function listPresets() {
  const result = await presetList();
  console.log('Available themes:', result.data);
  return result.data;
}

// Get specific theme
async function getPreset(id: string) {
  const result = await presetGet({ presetId: id });
  if (result.success) {
    console.log('Theme:', result.data);
    console.log('Color palette:', result.data.colorPalette);
    console.log('Typography:', result.data.typography);
  }
  return result;
}

// Usage
const themes = await listPresets();
const shadcnPreset = await getPreset('next-tailwind-shadcn');
```

---

## Troubleshooting

### Common Issues

#### Port Conflicts

**Problem:** Port 3000 is already in use.

**Solution:**

```bash
# Use a different port
MCP_PORT=4000 npx tekton-mcp

# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

#### Mode Detection Issues

**Problem:** Server starts in wrong mode.

**Symptoms:**
- Expected connected mode but got standalone
- Features not available

**Solution:**

```bash
# Force standalone mode
TEKTON_MODE=standalone npx tekton-mcp

# Verify API availability
curl http://localhost:8000/health

# Check server logs for mode detection
```

#### Configuration Problems

**Problem:** `.tekton/config.json` is corrupted or invalid.

**Solution:**

```bash
# Remove config file to regenerate
rm .tekton/config.json

# Restart server
npx tekton-mcp

# Or manually create valid config
mkdir -p .tekton
cat > .tekton/config.json << 'EOF'
{
  "$schema": "https://tekton.design/schemas/config.json",
  "version": "1.0.0",
  "mode": "standalone",
  "project": {
    "name": "my-project",
    "frameworkType": "nextjs",
    "detectedAt": "2026-01-18T12:00:00Z"
  },
  "theme": {
    "activePresetId": null,
    "selectedAt": null
  }
}
EOF
```

#### Claude Code Integration Issues

**Problem:** Claude doesn't recognize MCP tools.

**Solutions:**

1. **Verify server is running:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Check Claude settings:**
   - Ensure `.claude/settings.json` is correctly configured
   - Verify `mcpServers` configuration
   - Restart Claude Code

3. **Test tool manually:**
   ```bash
   curl -X POST http://localhost:3000/tools/theme.list
   ```

4. **Check logs:**
   - Look at server console output for errors
   - Verify Claude Code is connecting to the right port

#### Theme Not Found

**Problem:** Getting "Theme not found" error.

**Solution:**

```bash
# List available themes
curl -X POST http://localhost:3000/tools/theme.list

# Verify theme ID spelling (case-sensitive)
# Valid IDs:
# - next-tailwind-shadcn
# - next-tailwind-radix
# - vite-tailwind-shadcn
# - next-styled-components
# - saas-dashboard
# - tech-startup
# - premium-editorial
```

#### Framework Detection Failure

**Problem:** Project framework not detected correctly.

**Solution:**

1. **Verify project structure:**
   ```bash
   # Check for framework config files
   ls -la next.config.* vite.config.* package.json
   ```

2. **Check package.json:**
   ```bash
   # Verify framework dependencies are listed
   cat package.json | grep -E "(next|vite|react)"
   ```

3. **Manual detection:**
   ```bash
   curl -X POST http://localhost:3000/tools/project.detectStructure \
     -H "Content-Type: application/json" \
     -d '{"projectPath": "."}'
   ```

### Error Messages

#### "Invalid JSON"

**Error:**
```json
{ "error": "Invalid JSON" }
```

**Cause:** Request body is not valid JSON.

**Solution:**
```bash
# Ensure proper JSON formatting
curl -X POST http://localhost:3000/tools/theme.get \
  -H "Content-Type: application/json" \
  -d '{"presetId": "next-tailwind-shadcn"}'  # Valid JSON
```

#### "Tool not found"

**Error:**
```json
{ "error": "Tool not found: theme.invalid" }
```

**Cause:** Tool name is incorrect.

**Solution:**
```bash
# List available tools
curl http://localhost:3000/tools

# Use exact tool name (case-sensitive)
```

#### "EADDRINUSE: address already in use"

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Cause:** Port 3000 is already in use by another process.

**Solution:**
```bash
# Option 1: Use different port
MCP_PORT=4000 npx tekton-mcp

# Option 2: Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Getting Help

**GitHub Issues:**
- Repository: https://github.com/tekton-design/tekton
- Issues: https://github.com/tekton-design/tekton/issues
- Discussions: https://github.com/tekton-design/tekton/discussions

**Documentation:**
- Homepage: https://tekton.design
- API Reference: https://tekton.design/docs/mcp-server

**Community:**
- Discord: [Coming soon]
- Twitter: [@tektondesign](https://twitter.com/tektondesign)

---

## Appendix

### Complete Tool Reference

See [API Reference](#api-reference) for detailed tool documentation.

### Theme Comparison Table

| Feature | next-tailwind-shadcn | vite-tailwind-shadcn | saas-dashboard | tech-startup | premium-editorial |
|---------|---------------------|---------------------|----------------|--------------|------------------|
| Framework | Next.js | Vite | Next.js | Next.js | Next.js |
| Styling | Tailwind | Tailwind | Tailwind | Tailwind | Tailwind |
| Components | shadcn/ui | shadcn/ui | shadcn/ui | Radix UI | - |
| Brand Tone | Professional | Professional | Professional | Bold | Elegant |
| Best For | Enterprise | Rapid prototyping | B2B SaaS | Tech products | Content sites |
| Accessibility | WCAG AA | WCAG AA | WCAG AA | WCAG AA | WCAG AA |

### Version History

**v1.0.0** (2026-01-18)
- Initial release with standalone MCP server
- 7 built-in themes
- 26 MCP tools across 4 categories
- Framework detection support
- TypeScript + Zod validation
- Standalone and connected modes

### License

MIT License - See [LICENSE](LICENSE) file for details.

---

**Last Updated:** January 18, 2026
**Package Version:** 1.0.0
**Maintained by:** Tekton Design Team
