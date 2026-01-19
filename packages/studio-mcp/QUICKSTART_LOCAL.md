# Quick Start: Using Tekton MCP Server Locally (Before npm Publish)

This guide shows you how to test the Tekton MCP Server in other projects before it's published to npm.

## Prerequisites

- Node.js >= 20.0.0
- npm, pnpm, or yarn
- Git

## Step-by-Step Installation

### 1. Build the Tekton Repository

```bash
# Navigate to your local Tekton repository
cd /Users/asleep/Developer/tekton

# Install dependencies if you haven't already
pnpm install

# Build the component-system dependency
cd packages/component-system
pnpm run build

# Build the studio-mcp package
cd ../studio-mcp
pnpm run build
```

### 2. Choose an Installation Method

#### Option A: Run Directly (No Installation Required)

The simplest method - no installation needed in your other project:

```bash
# From anywhere, run the server directly
node /Users/asleep/Developer/tekton/packages/studio-mcp/dist/server/index.js
```

**Pros:** No installation needed, always uses latest build
**Cons:** Must specify full path, not integrated with project

#### Option B: Install via Direct Path

Install the package directly from your local file system:

```bash
# From your other project directory
cd /path/to/your/other-project

# Install using absolute path
npm install /Users/asleep/Developer/tekton/packages/studio-mcp
```

**Pros:** Integrates with your project, can use `npx tekton-mcp`
**Cons:** Must reinstall after changes to studio-mcp

#### Option C: Use npm pack

Create a tarball and install from it:

```bash
# From the studio-mcp directory
cd /Users/asleep/Developer/tekton/packages/studio-mcp
npm pack
# Creates: tekton-mcp-server-1.0.0.tgz

# From your project
cd /path/to/your/other-project
npm install /Users/asleep/Developer/tekton/packages/studio-mcp/tekton-mcp-server-1.0.0.tgz
```

**Pros:** Most reliable, works like published package
**Cons:** Must recreate tarball after changes

#### Option D: Use npm link (For Active Development)

Link the package globally, then link in your project:

```bash
# Step 1: Link component-system
cd /Users/asleep/Developer/tekton/packages/component-system
npm link

# Step 2: Link studio-mcp and connect to component-system
cd /Users/asleep/Developer/tekton/packages/studio-mcp
npm link @tekton/component-system
npm link

# Step 3: Link in your project
cd /path/to/your/other-project
npm link @tekton/mcp-server
```

**Pros:** Best for active development, changes reflect immediately
**Cons:** More complex setup, links can break

## 3. Start the Server

After installation (or using Option A):

```bash
# If you installed in your project (Options B, C, or D)
npx tekton-mcp

# Or run directly (Option A)
node /Users/asleep/Developer/tekton/packages/studio-mcp/dist/server/index.js

# Custom port
MCP_PORT=4000 npx tekton-mcp
```

## 4. Verify It's Working

```bash
# Check server health
curl http://localhost:3000/health

# List available themes
curl -X POST http://localhost:3000/tools/theme.list

# Get theme details
curl -X POST http://localhost:3000/tools/theme.get \
  -H "Content-Type: application/json" \
  -d '{"presetId": "next-tailwind-shadcn"}'
```

Expected health response:

```json
{
  "status": "ok",
  "service": "tekton-mcp",
  "mode": "standalone",
  "version": "1.0.0",
  "tools": ["component.list", "theme.list", ...]
}
```

## 5. Configure Claude Code (Optional)

Add to your project's `.claude/settings.json`:

```json
{
  "mcpServers": {
    "tekton": {
      "command": "node",
      "args": [
        "/Users/asleep/Developer/tekton/packages/studio-mcp/dist/server/index.js"
      ],
      "env": {
        "MCP_PORT": "3000"
      }
    }
  }
}
```

Or if you installed via npm:

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

## Troubleshooting

### Error: Cannot find module '@tekton/component-system'

**Cause:** The component-system package wasn't built or linked properly.

**Solution:**

```bash
# Rebuild component-system
cd /Users/asleep/Developer/tekton/packages/component-system
pnpm run build

# Rebuild studio-mcp
cd /Users/asleep/Developer/tekton/packages/studio-mcp
pnpm run build

# If using npm link, relink
npm link @tekton/component-system
```

### Error: EADDRINUSE (Port already in use)

**Cause:** Port 3000 is already in use.

**Solution:**

```bash
# Use a different port
MCP_PORT=4000 npx tekton-mcp

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Changes Not Reflected

**Cause:** You need to rebuild after making changes.

**Solution:**

```bash
# Rebuild the package
cd /Users/asleep/Developer/tekton/packages/studio-mcp
pnpm run build

# If you installed via direct path or tarball, reinstall
cd /path/to/your/project
npm install /Users/asleep/Developer/tekton/packages/studio-mcp --force
```

## Development Workflow

If you're actively developing the MCP server and testing in another project:

1. **Use npm link** (Option D) for the most seamless experience
2. **Make changes** to studio-mcp source code
3. **Rebuild** with `pnpm run build`
4. **Restart server** - changes are reflected immediately with npm link
5. **Test** in your other project

## Quick Reference: Available Tools

### Theme Tools

- `theme.list` - List all 7 built-in themes
- `theme.get` - Get theme details
- `project.useBuiltinPreset` - Activate a theme

### Component Tools

- `component.list` - List all component hooks
- `component.get` - Get complete component
- `component.query` - Search by WCAG level, state, etc.

### Project Tools

- `project.detectStructure` - Detect Next.js, Vite, etc.
- `project.status` - Get project info and active theme
- `project.getActivePreset` - Get current theme

### Screen Tools

- `screen.create` - Generate new page with routing
- `screen.addComponent` - Add component to page
- `screen.list` - List all screens

## Next Steps

- Read the [full USER_GUIDE.md](./USER_GUIDE.md) for detailed documentation
- Explore the [7 built-in themes](./USER_GUIDE.md#built-in-themes)
- Try the [usage examples](./USER_GUIDE.md#usage-examples)
- Learn about [Claude Code integration](./USER_GUIDE.md#claude-code-integration)

## Recommended: Option B (Direct Path Installation)

For most users testing the MCP server in other projects:

```bash
# One-time setup: Build both packages
cd /Users/asleep/Developer/tekton
pnpm install
cd packages/component-system && pnpm run build && cd ../..
cd packages/studio-mcp && pnpm run build && cd ../..

# In your other project: Install
cd /path/to/your/other-project
npm install /Users/asleep/Developer/tekton/packages/studio-mcp

# Run the server
npx tekton-mcp

# Test it
curl http://localhost:3000/health
```

This method is simple, reliable, and works just like a published npm package.
