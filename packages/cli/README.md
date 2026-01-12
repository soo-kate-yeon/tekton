# Tekton CLI

Command-line interface for Tekton - OKLCH design token generator with framework detection and project setup automation.

[![NPM Version](https://img.shields.io/badge/npm-0.1.0-blue)](https://npmjs.com/package/@tekton/cli)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](../../LICENSE)

## Features

- **Framework Detection** - Automatically detect Next.js, Vite, Remix, Nuxt, and SvelteKit projects
- **Tailwind Detection** - Identify Tailwind CSS configuration and version
- **shadcn/ui Detection** - Detect shadcn/ui components and configuration
- **Project Scanning** - Comprehensive project analysis with all detectors combined
- **Screen Templates** - Ready-to-use templates for Phase C screen generation
- **Zero Configuration** - Works out of the box with sensible defaults

## Installation

### Global Installation (Recommended)

```bash
npm install -g @tekton/cli
```

```bash
yarn global add @tekton/cli
```

```bash
pnpm add -g @tekton/cli
```

### Local Installation (Project-Specific)

```bash
npm install --save-dev @tekton/cli
```

```bash
yarn add --dev @tekton/cli
```

```bash
pnpm add -D @tekton/cli
```

## Quick Start

```bash
# Navigate to your project directory
cd my-nextjs-app

# Detect the framework
tekton detect framework

# Detect Tailwind CSS
tekton detect tailwind

# Detect shadcn/ui
tekton detect shadcn

# Scan entire project (all detectors)
tekton detect
```

## Commands

### `tekton detect`

Scan the entire project and detect all technologies.

**Usage:**
```bash
tekton detect [options]
```

**Options:**
- `-p, --path <path>` - Project directory path (default: current directory)
- `-j, --json` - Output results in JSON format
- `-v, --verbose` - Show detailed detection information

**Examples:**

```bash
# Detect in current directory
tekton detect

# Detect in specific directory
tekton detect --path ../my-project

# Output as JSON
tekton detect --json

# Verbose output
tekton detect --verbose
```

**Sample Output:**

```
Scanning project: /Users/dev/my-app

✓ Framework: Next.js (v14.2.0)
  Config: next.config.js

✓ Tailwind CSS: v3.4.0
  Config: tailwind.config.ts

✓ shadcn/ui detected
  Components directory: src/components/ui
  Components: 12 components found

Project Summary:
  Framework: Next.js
  Styling: Tailwind CSS + shadcn/ui
  Ready for Tekton token generation
```

---

### `tekton detect framework`

Detect the JavaScript framework used in your project.

**Supported Frameworks:**
- **Next.js** - React framework with SSR/SSG
- **Vite** - Fast build tool for modern web projects
- **Remix** - Full-stack React framework
- **Nuxt** - Vue.js framework with SSR/SSG
- **SvelteKit** - Svelte framework with SSR/SSG

**Detection Priority:**
1. Next.js (highest priority)
2. Vite
3. Remix
4. Nuxt
5. SvelteKit (lowest priority)

**Usage:**
```bash
tekton detect framework [options]
```

**Options:**
- `-p, --path <path>` - Project directory path (default: current directory)
- `-j, --json` - Output results in JSON format

**Examples:**

```bash
# Detect in current directory
tekton detect framework

# Detect in specific directory
tekton detect framework --path /path/to/project

# JSON output for CI/CD
tekton detect framework --json
```

**Sample Output:**

```
Framework Detection:
  Framework: Next.js
  Version: ^14.2.0
  Config: next.config.js

Detection Strategy:
  Looking for: next.config.js, next.config.mjs, next.config.ts
  Version source: package.json dependencies
```

**JSON Output:**
```json
{
  "framework": "Next.js",
  "version": "^14.2.0",
  "configPath": "/Users/dev/my-app/next.config.js"
}
```

---

### `tekton detect tailwind`

Detect Tailwind CSS configuration and version.

**Usage:**
```bash
tekton detect tailwind [options]
```

**Options:**
- `-p, --path <path>` - Project directory path (default: current directory)
- `-j, --json` - Output results in JSON format

**Examples:**

```bash
# Detect Tailwind in current directory
tekton detect tailwind

# Check specific project
tekton detect tailwind --path ../my-app

# JSON output
tekton detect tailwind --json
```

**Sample Output:**

```
Tailwind CSS Detection:
  Version: ^3.4.0
  Config: tailwind.config.ts
  PostCSS: Detected (postcss.config.js)

Configuration Analysis:
  Content paths configured: 3 patterns
  Plugins: 0 custom plugins
  Theme extensions: Yes
```

**JSON Output:**
```json
{
  "detected": true,
  "version": "^3.4.0",
  "configPath": "/Users/dev/my-app/tailwind.config.ts",
  "hasPostCSS": true
}
```

---

### `tekton detect shadcn`

Detect shadcn/ui components and configuration.

**Usage:**
```bash
tekton detect shadcn [options]
```

**Options:**
- `-p, --path <path>` - Project directory path (default: current directory)
- `-j, --json` - Output results in JSON format
- `--list` - List all detected components

**Examples:**

```bash
# Detect shadcn/ui
tekton detect shadcn

# List all components
tekton detect shadcn --list

# JSON output with components
tekton detect shadcn --json --list
```

**Sample Output:**

```
shadcn/ui Detection:
  Status: Installed
  Components directory: src/components/ui
  Components count: 12 components

Detected Components:
  - button
  - card
  - input
  - dialog
  - form
  - select
  - alert
  - checkbox
  - badge
  - avatar
  - dropdown-menu
  - tabs

Configuration:
  components.json: Found
  Style: default
  TypeScript: Yes
```

**JSON Output:**
```json
{
  "detected": true,
  "componentsDir": "src/components/ui",
  "components": [
    "button",
    "card",
    "input",
    "dialog"
  ],
  "configPath": "/Users/dev/my-app/components.json"
}
```

---

### `tekton --version`

Display the CLI version.

**Usage:**
```bash
tekton --version
tekton -v
```

**Output:**
```
@tekton/cli version 0.1.0
```

---

### `tekton --help`

Display help information.

**Usage:**
```bash
tekton --help
tekton -h
tekton detect --help
```

## Use Cases

### 1. Project Onboarding

Quickly understand a new project's technology stack:

```bash
cd new-project
tekton detect --verbose
```

### 2. CI/CD Integration

Automate framework detection in build pipelines:

```bash
#!/bin/bash
FRAMEWORK=$(tekton detect framework --json | jq -r '.framework')

if [ "$FRAMEWORK" == "Next.js" ]; then
  npm run build
elif [ "$FRAMEWORK" == "Vite" ]; then
  npm run build:vite
fi
```

### 3. Documentation Generation

Generate project documentation automatically:

```bash
tekton detect --json > project-info.json
```

### 4. Compatibility Checking

Verify project compatibility before token generation:

```bash
#!/bin/bash
TAILWIND=$(tekton detect tailwind --json | jq -r '.detected')
SHADCN=$(tekton detect shadcn --json | jq -r '.detected')

if [ "$TAILWIND" == "true" ] && [ "$SHADCN" == "true" ]; then
  echo "Project is ready for Tekton tokens"
  tekton generate tokens
else
  echo "Missing required dependencies"
fi
```

## Framework Detection Details

### Next.js Detection

**Configuration Files Checked:**
- `next.config.js`
- `next.config.mjs`
- `next.config.ts`

**Package Name:** `next`

**Example:**
```bash
$ tekton detect framework
Framework: Next.js (v14.2.0)
Config: next.config.js
```

### Vite Detection

**Configuration Files Checked:**
- `vite.config.js`
- `vite.config.ts`
- `vite.config.mjs`

**Package Name:** `vite`

**Example:**
```bash
$ tekton detect framework
Framework: Vite (v5.0.0)
Config: vite.config.ts
```

### Remix Detection

**Configuration Files Checked:**
- `remix.config.js`
- `remix.config.ts`

**Package Name:** `@remix-run/react`

**Example:**
```bash
$ tekton detect framework
Framework: Remix (v2.0.0)
Config: remix.config.js
```

### Nuxt Detection

**Configuration Files Checked:**
- `nuxt.config.js`
- `nuxt.config.ts`

**Package Name:** `nuxt`

**Example:**
```bash
$ tekton detect framework
Framework: Nuxt (v3.0.0)
Config: nuxt.config.ts
```

### SvelteKit Detection

**Configuration Files Checked:**
- `svelte.config.js`

**Package Name:** `@sveltejs/kit`

**Example:**
```bash
$ tekton detect framework
Framework: SvelteKit (v2.0.0)
Config: svelte.config.js
```

## Troubleshooting

### Framework Not Detected

**Problem:** CLI returns "No framework detected" even though you have a framework.

**Solutions:**

1. **Check Configuration File:**
   ```bash
   # Verify config file exists
   ls -la next.config.js
   ls -la vite.config.ts
   ```

2. **Run from Project Root:**
   ```bash
   # Make sure you're in the project root
   pwd
   ls package.json
   ```

3. **Use Explicit Path:**
   ```bash
   tekton detect framework --path /absolute/path/to/project
   ```

4. **Check File Permissions:**
   ```bash
   # Ensure files are readable
   chmod 644 next.config.js
   ```

---

### Version Not Detected

**Problem:** Framework detected but version shows as `undefined`.

**Solutions:**

1. **Check package.json:**
   ```bash
   # Verify package is listed
   cat package.json | grep "next\|vite\|remix\|nuxt"
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Check Dependencies vs DevDependencies:**
   - CLI checks both `dependencies` and `devDependencies`
   - Ensure package is listed in one of them

---

### Multiple Frameworks Detected

**Problem:** Project has multiple framework configs (e.g., Next.js + Vite).

**Behavior:** CLI follows priority order (Next.js > Vite > Remix > Nuxt > SvelteKit).

**Example:**
```bash
# If you have both next.config.js and vite.config.ts
$ tekton detect framework
Framework: Next.js  # Next.js takes priority
```

**To Force Detection:**
```bash
# Temporarily rename configs
mv next.config.js next.config.js.bak
tekton detect framework
mv next.config.js.bak next.config.js
```

---

### Permission Errors

**Problem:** `EACCES` or permission denied errors.

**Solutions:**

1. **Run with Correct Permissions:**
   ```bash
   # Check directory permissions
   ls -la

   # Fix if needed
   chmod 755 .
   ```

2. **Check File Ownership:**
   ```bash
   ls -l next.config.js

   # Fix if needed
   sudo chown $USER:$USER next.config.js
   ```

---

### JSON Output Invalid

**Problem:** JSON output is malformed or cannot be parsed.

**Solutions:**

1. **Use Strict JSON Mode:**
   ```bash
   tekton detect framework --json | jq '.'
   ```

2. **Check for Error Messages:**
   ```bash
   # Errors are printed to stderr
   tekton detect framework --json 2>&1
   ```

---

### CLI Command Not Found

**Problem:** `tekton: command not found` after installation.

**Solutions:**

1. **Global Installation:**
   ```bash
   npm install -g @tekton/cli

   # Verify installation
   which tekton
   ```

2. **Local Installation (Use npx):**
   ```bash
   npx tekton detect
   ```

3. **Check npm Global Path:**
   ```bash
   npm config get prefix

   # Add to PATH if needed
   export PATH="$(npm config get prefix)/bin:$PATH"
   ```

---

## FAQ

### Q: Which frameworks are supported?

**A:** Tekton CLI supports 5 frameworks:
- Next.js (React)
- Vite (Framework-agnostic)
- Remix (React)
- Nuxt (Vue.js)
- SvelteKit (Svelte)

More frameworks will be added in future releases.

---

### Q: Can I use this in a monorepo?

**A:** Yes! Use the `--path` option:

```bash
# Detect in workspace packages
tekton detect --path ./packages/web
tekton detect --path ./packages/mobile
```

---

### Q: Does detection work with JavaScript or only TypeScript?

**A:** Both JavaScript and TypeScript configs are detected:
- `next.config.js` (JavaScript)
- `next.config.ts` (TypeScript)
- `next.config.mjs` (ES Modules)

---

### Q: What if I don't have a config file?

**A:** Some frameworks (like Next.js) can run without explicit config files. However, Tekton CLI requires config files for detection.

**Solution:** Create a minimal config file:

```javascript
// next.config.js
module.exports = {}
```

---

### Q: Can I use this for non-React frameworks?

**A:** Yes! Tekton CLI supports:
- **Vue.js** via Nuxt detection
- **Svelte** via SvelteKit detection
- **Framework-agnostic** via Vite detection

---

### Q: How do I integrate this with CI/CD?

**A:** Use JSON output and parse with `jq`:

```bash
# GitHub Actions example
- name: Detect Framework
  run: |
    FRAMEWORK=$(npx tekton detect framework --json | jq -r '.framework')
    echo "Detected: $FRAMEWORK"
    echo "framework=$FRAMEWORK" >> $GITHUB_OUTPUT
```

---

### Q: Does this work on Windows?

**A:** Yes! Tekton CLI is cross-platform and works on:
- macOS
- Linux
- Windows (PowerShell and CMD)

---

### Q: Can I detect frameworks in multiple projects at once?

**A:** Yes, use a shell loop:

```bash
for dir in ./packages/*; do
  echo "Checking $dir"
  tekton detect framework --path "$dir"
done
```

---

## Screen Templates (Phase C Preview)

Tekton CLI includes screen templates for future screen generation features. Templates are located in `templates/screen/`:

- `page.tsx.template` - Page component template
- `layout.tsx.template` - Layout component template
- `index.ts.template` - Barrel export template

These will be used in Phase C for:
```bash
# Coming in Phase C
tekton generate screen Dashboard --with-layout
```

See [templates/screen/README.md](./templates/screen/README.md) for details.

---

## API Usage (Programmatic)

You can use Tekton CLI detectors in your Node.js scripts:

```typescript
import { detectFramework, detectTailwind, detectShadcn } from '@tekton/cli';

// Detect framework
const framework = await detectFramework('/path/to/project');
console.log(framework.framework); // 'Next.js'
console.log(framework.version);   // '^14.2.0'

// Detect Tailwind
const tailwind = await detectTailwind('/path/to/project');
console.log(tailwind.detected);   // true

// Detect shadcn/ui
const shadcn = await detectShadcn('/path/to/project');
console.log(shadcn.components);   // ['button', 'card', ...]
```

---

## Development

### Building from Source

```bash
# Clone the monorepo
git clone https://github.com/asleep/tekton.git
cd tekton

# Install dependencies
npm install

# Build CLI package
cd packages/cli
npm run build

# Link for local testing
npm link
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Project Structure

```
packages/cli/
├── src/
│   ├── commands/         # CLI command implementations
│   ├── detectors/        # Framework/tool detection logic
│   │   ├── framework.ts  # Framework detector
│   │   ├── tailwind.ts   # Tailwind detector
│   │   └── shadcn.ts     # shadcn/ui detector
│   └── index.ts          # Main CLI entry point
├── templates/
│   └── screen/           # Screen templates for Phase C
├── tests/
│   └── detectors/        # Unit tests for detectors
└── package.json
```

---

## Contributing

We welcome contributions! Please see the main [Contributing Guide](../../CONTRIBUTING.md) for:

- Development workflow
- SPEC-first development process
- TDD approach
- Quality gates
- PR guidelines

### Quick Contribution Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/tekton.git
cd tekton

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
cd packages/cli
npm test

# Commit and push
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature
```

---

## License

MIT © 2026

---

## Links

- [Tekton Monorepo](../../README.md)
- [API Documentation](../../docs/api/README.md)
- [Architecture Guide](../../docs/architecture/README.md)
- [VS Code Extension](../vscode-extension/README.md)

---

**Built with** [MoAI-ADK](https://github.com/asleep/moai-adk) - AI-Driven Development Kit
