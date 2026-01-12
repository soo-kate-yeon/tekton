# Tekton VS Code Extension

VS Code extension for the Tekton OKLCH Design Token Generator. This extension integrates with the Tekton CLI to provide framework detection, shadcn/ui setup, and design token generation directly from VS Code.

## Features

- **Detect Framework Stack**: Automatically detect Next.js, Vite, Remix, Tailwind CSS, and shadcn/ui in your workspace
- **Setup shadcn/ui**: One-click shadcn/ui installation with automatic configuration
- **Generate Design Tokens**: Interactive design token generation with OKLCH color space

## Requirements

- Node.js ≥18.0.0
- Tekton CLI installed globally (`npm install -g @tekton/cli`)
- VS Code ≥1.95.0

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

Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and type:

- **Tekton: Detect Framework Stack** - Detect framework and dependencies in current workspace
- **Tekton: Setup shadcn/ui** - Install and configure shadcn/ui
- **Tekton: Generate Design Tokens** - Generate OKLCH-based design tokens

### Output Panel

All command results are displayed in the "Tekton" output channel. To view:

1. Press `Ctrl+Shift+U` (or `Cmd+Shift+U` on macOS)
2. Select "Tekton" from the dropdown

## Commands

### Detect Framework Stack

Detects the following in your workspace:

- Framework: Next.js, Vite, or Remix
- Tailwind CSS configuration
- shadcn/ui components.json

**Output Example:**

```
✓ Framework: Next.js 14.0.0
✓ Tailwind CSS: Installed (tailwind.config.ts)
✗ shadcn/ui: Not installed
```

### Setup shadcn/ui

Prerequisites:
- Framework detected
- Tailwind CSS installed

This command runs `shadcn init` and displays progress notifications.

### Generate Design Tokens

Interactive workflow:
1. Enter primary color (hex code)
2. Select preset (Default Palette, Accessible, Vibrant, etc.)
3. Generate tokens to `src/styles/tokens.css`

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

If you see "tekton command not found":

1. Install Tekton CLI globally: `npm install -g @tekton/cli`
2. Verify installation: `tekton --version`
3. Restart VS Code

### No Workspace Open

Commands require an open workspace folder. Open a project folder before running commands.

### Permission Errors

On macOS/Linux, ensure the CLI has execution permissions:

```bash
chmod +x $(which tekton)
```

## Contributing

See the main [Tekton repository](https://github.com/your-org/tekton) for contribution guidelines.

## License

MIT
