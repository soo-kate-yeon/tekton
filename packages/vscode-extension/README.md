# Tekton VS Code Extension

VS Code extension for the Tekton OKLCH Design Token Generator. This extension integrates with the Tekton CLI to provide framework detection, shadcn/ui setup, and design token generation directly from VS Code.

[![VS Code](https://img.shields.io/badge/VS%20Code-1.95.0+-blue)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](../../LICENSE)

## Features

- **Detect Framework Stack**: Automatically detect Next.js, Vite, Remix, Nuxt, SvelteKit, Tailwind CSS, and shadcn/ui in your workspace
- **Setup shadcn/ui**: One-click shadcn/ui installation with automatic configuration
- **Generate Design Tokens**: Interactive design token generation with OKLCH color space
- **Command Palette Integration**: All features accessible via VS Code command palette
- **Output Channel**: Dedicated Tekton output panel for all CLI operations

## Requirements

- **Node.js** ≥18.0.0
- **Tekton CLI** installed globally: `npm install -g @tekton/cli`
- **VS Code** ≥1.95.0

### Supported Frameworks

- **Next.js** (React framework with SSR/SSG)
- **Vite** (Fast build tool for modern web)
- **Remix** (Full-stack React framework)
- **Nuxt** (Vue.js framework with SSR/SSG)
- **SvelteKit** (Svelte framework with SSR/SSG)

## Installation

### From VSIX

1. Download the latest `.vsix` file from releases
2. Open VS Code
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
4. Type "Install from VSIX"
5. Select the downloaded `.vsix` file

### From Source

```bash
cd packages/vscode-extension
pnpm install
pnpm build
pnpm package
code --install-extension tekton-vscode-*.vsix
```

## Usage

### Command Palette

Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS) and type:

- **Tekton: Detect Framework Stack** - Detect framework and dependencies in current workspace
- **Tekton: Setup shadcn/ui** - Install and configure shadcn/ui
- **Tekton: Generate Design Tokens** - Generate OKLCH-based design tokens

**Keyboard Shortcuts:**
- Detection: `Ctrl+Alt+D` (Windows/Linux) or `Cmd+Option+D` (macOS)
- Token Generation: `Ctrl+Alt+T` (Windows/Linux) or `Cmd+Option+T` (macOS)

### Output Panel

All command results are displayed in the "Tekton" output channel. To view:

1. Press `Ctrl+Shift+U` (Windows/Linux) or `Cmd+Shift+U` (macOS)
2. Select "Tekton" from the dropdown

Alternatively, use the command palette: `View: Show Tekton Output`

## Commands

### Detect Framework Stack

Detects the following in your workspace:

- **Framework**: Next.js, Vite, Remix, Nuxt, or SvelteKit
- **Tailwind CSS**: Configuration and version
- **shadcn/ui**: Components and configuration

**How to Use:**

1. Open your project folder in VS Code
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
3. Type "Tekton: Detect Framework Stack"
4. View results in the Tekton output panel

**Output Example:**

```
Scanning project: /Users/dev/my-app

✓ Framework: Next.js 14.2.0
  Config: next.config.js

✓ Tailwind CSS: 3.4.0
  Config: tailwind.config.ts

✓ shadcn/ui: Installed
  Components directory: src/components/ui
  Components: 12 found

Project Summary:
  Framework: Next.js
  Styling: Tailwind CSS + shadcn/ui
  Ready for token generation
```

**Supported Detection:**

| Technology | Configuration Files |
|------------|-------------------|
| Next.js | `next.config.js`, `next.config.mjs`, `next.config.ts` |
| Vite | `vite.config.js`, `vite.config.ts`, `vite.config.mjs` |
| Remix | `remix.config.js`, `remix.config.ts` |
| Nuxt | `nuxt.config.js`, `nuxt.config.ts` |
| SvelteKit | `svelte.config.js` |
| Tailwind CSS | `tailwind.config.js`, `tailwind.config.ts` |
| shadcn/ui | `components.json`, `src/components/ui/` |

### Setup shadcn/ui

Automatically install and configure shadcn/ui in your project.

**Prerequisites:**
- Framework detected (Next.js, Vite, or Remix recommended)
- Tailwind CSS installed and configured

**How to Use:**

1. Ensure prerequisites are met (run "Detect Framework Stack" first)
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
3. Type "Tekton: Setup shadcn/ui"
4. Follow the interactive prompts
5. Wait for installation to complete

**What This Does:**

- Runs `npx shadcn-ui@latest init`
- Creates `components.json` configuration
- Sets up `src/components/ui/` directory
- Installs required dependencies
- Configures TypeScript paths

**Progress Notifications:**

```
Tekton: Setting up shadcn/ui...
Tekton: Installing dependencies...
Tekton: shadcn/ui setup complete!
```

### Generate Design Tokens

Generate OKLCH-based design tokens with WCAG AA compliance.

**How to Use:**

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
2. Type "Tekton: Generate Design Tokens"
3. Follow the interactive prompts:
   - **Enter primary color**: Provide a hex code (e.g., `#3B82F6`)
   - **Select theme**: Choose from available themes
   - **Confirm generation**: Review settings and confirm

**Interactive Workflow:**

```
Step 1: Enter Primary Color
Enter your brand color in hex format:
> #3B82F6

Step 2: Select Theme
Choose a theme:
○ Default Palette (Balanced colors)
● Accessible (WCAG AAA compliance)
○ Vibrant (High chroma colors)
○ Muted (Low chroma colors)

Step 3: Generate
Generating tokens...
✓ Tokens generated to: src/styles/tokens.css
```

**Generated Output:**

Tokens are saved to `src/styles/tokens.css` in your project:

```css
:root {
  --primary: oklch(58% 0.18 248);
  --primary-50: oklch(98% 0.03 248);
  --primary-100: oklch(95% 0.06 248);
  --primary-200: oklch(90% 0.10 248);
  /* ... */
  --primary-950: oklch(15% 0.02 248);
}
```

**Features:**

- **OKLCH Color Space**: Perceptually uniform colors
- **10-Step Scales**: Tailwind-compatible (50-950)
- **WCAG Compliance**: Automatic accessibility validation
- **Dark Mode Support**: Automatically generated dark theme variants
- **Type-Safe**: TypeScript definitions included

## Development

### Prerequisites

```bash
pnpm install
```

### Build

```bash
pnpm build        # Build extension
pnpm dev          # Build with watch mode
```

### Test

```bash
pnpm test              # Run tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage
```

### Package

```bash
pnpm package      # Create .vsix file
```

## Architecture

```
vscode-extension/
├── src/
│   ├── commands/
│   │   ├── detectStack.ts      # Framework detection command
│   │   ├── setupShadcn.ts      # shadcn setup command
│   │   └── generateTokens.ts   # Token generation command
│   ├── utils/
│   │   └── cliRunner.ts        # CLI subprocess execution
│   └── extension.ts            # Extension entry point
├── tests/
│   ├── commands/               # Command tests
│   ├── utils/                  # Utility tests
│   └── integration/            # Integration tests
└── dist/                       # Build output
```

## Troubleshooting

### CLI Not Found

**Problem:** Error message "tekton command not found" or "Command failed".

**Solutions:**

1. **Install Tekton CLI globally:**
   ```bash
   npm install -g @tekton/cli
   ```

2. **Verify installation:**
   ```bash
   tekton --version
   ```

3. **Restart VS Code** after installation

4. **Check PATH environment:**
   ```bash
   # macOS/Linux
   echo $PATH | grep npm

   # Windows (PowerShell)
   $env:PATH -split ';' | Select-String npm
   ```

5. **Use absolute path** (if PATH issues persist):
   - Find CLI location: `which tekton` (macOS/Linux) or `where tekton` (Windows)
   - Configure extension setting: `tekton.cliPath` to absolute path

---

### No Workspace Open

**Problem:** Commands are disabled or show "No workspace folder open".

**Solution:** Commands require an open workspace folder.

1. **Open a folder:**
   - File → Open Folder...
   - Select your project directory
   - Click "Open"

2. **Verify workspace:**
   - Check bottom-left corner of VS Code
   - Should show your project name

---

### Permission Errors

**Problem:** `EACCES` or permission denied errors on macOS/Linux.

**Solutions:**

1. **Fix CLI permissions:**
   ```bash
   chmod +x $(which tekton)
   ```

2. **Fix npm global permissions:**
   ```bash
   sudo chown -R $USER $(npm config get prefix)
   ```

3. **Use npx instead:**
   ```bash
   npx tekton --version
   ```

---

### Framework Not Detected

**Problem:** Extension shows "No framework detected" even though you have a framework.

**Solutions:**

1. **Check configuration file exists:**
   ```bash
   ls -la next.config.js
   ls -la vite.config.ts
   ```

2. **Ensure you're in project root:**
   - Open the correct folder in VS Code
   - Check `package.json` exists in workspace root

3. **Reload window:**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
   - Type "Reload Window"

---

### Extension Not Loading

**Problem:** Tekton commands don't appear in command palette.

**Solutions:**

1. **Check extension is enabled:**
   - Extensions sidebar (`Ctrl+Shift+X`)
   - Search "Tekton"
   - Ensure it's enabled (not disabled)

2. **Reload window:**
   - Command palette: "Developer: Reload Window"

3. **Check extension logs:**
   - Help → Toggle Developer Tools
   - Console tab → Look for errors

---

### Output Panel Not Showing

**Problem:** Can't see command results.

**Solutions:**

1. **Open output panel:**
   - Press `Ctrl+Shift+U` (Windows/Linux) or `Cmd+Shift+U` (macOS)
   - Select "Tekton" from dropdown

2. **Verify output channel:**
   - Command palette: "View: Show Tekton Output"

---

### Command Timeout

**Problem:** Commands hang or timeout.

**Solutions:**

1. **Check CLI installation:**
   ```bash
   tekton detect --version
   ```

2. **Test CLI manually:**
   ```bash
   cd /path/to/project
   tekton detect framework
   ```

3. **Increase timeout** (if needed):
   - Settings → Search "Tekton"
   - Adjust `tekton.commandTimeout` (default: 30000ms)

---

### Windows-Specific Issues

**Problem:** Commands fail on Windows with path errors.

**Solutions:**

1. **Use PowerShell** (not CMD):
   - VS Code Settings → Terminal → Default Profile
   - Select "PowerShell"

2. **Escape paths:**
   ```powershell
   # Use quotes for paths with spaces
   "C:\Program Files\nodejs\tekton"
   ```

3. **Check Node.js installation:**
   ```powershell
   node --version
   npm --version
   ```

## FAQ

### Q: Does this work with non-React frameworks?

**A:** Yes! The extension supports:
- **Vue.js** projects via Nuxt detection
- **Svelte** projects via SvelteKit detection
- **Framework-agnostic** projects via Vite detection

### Q: Can I customize keyboard shortcuts?

**A:** Yes:

1. File → Preferences → Keyboard Shortcuts
2. Search "Tekton"
3. Click the pencil icon to edit
4. Set your preferred keybinding

### Q: Where are design tokens saved?

**A:** By default, tokens are saved to `src/styles/tokens.css` in your workspace. You can configure the output path in extension settings.

### Q: Does this work in remote development (SSH, WSL, Containers)?

**A:** Yes, but ensure Tekton CLI is installed in the remote environment:

```bash
# In remote terminal
npm install -g @tekton/cli
```

### Q: Can I use this with multiple workspace folders?

**A:** Yes! Commands run in the active workspace folder. Use the workspace selector in VS Code's bottom-left corner to switch between folders.

---

## Extension Settings

Configure the extension via VS Code settings:

- `tekton.cliPath` - Custom path to Tekton CLI executable (default: uses PATH)
- `tekton.commandTimeout` - Command execution timeout in milliseconds (default: 30000)
- `tekton.outputVerbose` - Enable verbose output logging (default: false)
- `tekton.autoDetectOnOpen` - Automatically detect framework when opening workspace (default: false)

**Access Settings:**

1. File → Preferences → Settings
2. Search "Tekton"
3. Adjust settings as needed

---

## Roadmap

**Phase C (Upcoming):**
- Screen generation commands
- Component scaffolding
- Visual token editor
- Real-time preview panel
- Token conflict resolution

---

## Contributing

We welcome contributions! See the main [Contributing Guide](../../CONTRIBUTING.md) for:

- Development workflow
- SPEC-first development process
- TDD approach
- Quality gates
- PR guidelines

### Quick Setup

```bash
# Clone monorepo
git clone https://github.com/asleep/tekton.git
cd tekton

# Install dependencies
npm install

# Build extension
cd packages/vscode-extension
npm run build

# Test in VS Code
# Press F5 to launch Extension Development Host
```

---

## Links

- [Tekton Monorepo](../../README.md)
- [Tekton CLI Documentation](../cli/README.md)
- [API Reference](../../docs/api/README.md)
- [Architecture Guide](../../docs/architecture/README.md)

---

## License

MIT © 2026

---

**Built with** [MoAI-ADK](https://github.com/asleep/moai-adk) - AI-Driven Development Kit
