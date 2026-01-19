# Contributing to @tekton/token-contract

Thank you for your interest in contributing to the Token Contract & CSS Variable System! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)

---

## Code of Conduct

This project follows the Tekton Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

**Core Principles**:
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Assume good intentions

---

## Getting Started

### Prerequisites

- **Node.js**: 20.x or higher
- **pnpm**: 9.x or higher (package manager)
- **Git**: 2.x or higher

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/tekton.git
   cd tekton
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/tekton/tekton.git
   ```

---

## Development Setup

### Install Dependencies

```bash
# Install all dependencies
pnpm install

# Navigate to token-contract package
cd packages/token-contract
```

### Build the Package

```bash
# Build TypeScript
pnpm build

# Build in watch mode
pnpm build:watch
```

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Development Scripts

```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm typecheck

# Run all quality checks
pnpm quality
```

---

## Project Structure

```
packages/token-contract/
├── src/
│   ├── schemas/               # Zod validation schemas
│   │   ├── color-token.ts
│   │   ├── semantic-token.ts
│   │   ├── state-token.ts
│   │   └── composition-token.ts
│   ├── themes/               # Curated design themes
│   │   ├── professional.ts
│   │   ├── creative.ts
│   │   ├── minimal.ts
│   │   ├── bold.ts
│   │   ├── warm.ts
│   │   ├── cool.ts
│   │   └── high-contrast.ts
│   ├── css-generator/         # CSS variable generation
│   │   ├── variable-naming.ts
│   │   ├── css-generator.ts
│   │   └── dark-mode.ts
│   ├── theme-provider/        # React theme provider
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeContext.tsx
│   │   └── useTheme.ts
│   ├── utils/                 # Utility functions
│   │   ├── fallback.ts
│   │   ├── override.ts
│   │   └── validation.ts
│   └── index.ts               # Public API exports
├── tests/                     # Test files
│   ├── schemas.test.ts
│   ├── themes.test.ts
│   ├── css-generator.test.ts
│   ├── theme-provider.test.tsx
│   └── utils.test.ts
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md
│   ├── INTEGRATION.md
│   ├── MIGRATION.md
│   ├── API.md
│   └── BEST-PRACTICES.md
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── README.md
├── CHANGELOG.md
└── CONTRIBUTING.md
```

---

## Development Workflow

### 1. Create a Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

**Branch Naming Conventions**:
- `feature/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `docs/update-description` - Documentation updates
- `refactor/component-name` - Code refactoring
- `test/test-description` - Test improvements

### 2. Make Changes

- Write code following [Coding Standards](#coding-standards)
- Add tests for new functionality
- Update documentation as needed
- Run quality checks: `pnpm quality`

### 3. Commit Changes

Follow [Commit Message Guidelines](#commit-message-guidelines):

```bash
git add .
git commit -m "feat: add new theme validation function"
```

### 4. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## Testing Guidelines

### Test Coverage Requirements

- **Minimum Coverage**: 85% (enforced by CI/CD)
- **Target Coverage**: 95%+
- **Critical Paths**: 100% coverage required

### Writing Tests

**Unit Tests**:
```typescript
import { describe, it, expect } from 'vitest';
import { ColorTokenSchema } from '../src/schemas';

describe('ColorTokenSchema', () => {
  it('validates valid OKLCH color token', () => {
    const result = ColorTokenSchema.safeParse({
      l: 0.6,
      c: 0.15,
      h: 220,
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid lightness value', () => {
    const result = ColorTokenSchema.safeParse({
      l: 1.5, // Invalid: exceeds max
      c: 0.15,
      h: 220,
    });

    expect(result.success).toBe(false);
  });
});
```

**React Component Tests**:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../src/theme-provider';

function TestComponent() {
  const { theme, setPreset } = useTheme();
  return (
    <div>
      <p data-testid="theme">{theme}</p>
      <button onClick={() => setPreset('creative')}>Switch</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  it('allows theme switching', () => {
    render(
      <ThemeProvider defaultPreset="professional">
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('professional');

    fireEvent.click(screen.getByText('Switch'));

    expect(screen.getByTestId('theme')).toHaveTextContent('creative');
  });
});
```

### Test Organization

- **Group related tests**: Use `describe` blocks
- **Clear test names**: Describe expected behavior
- **Arrange-Act-Assert**: Structure tests clearly
- **Mock external dependencies**: Isolate unit tests

---

## Documentation Guidelines

### Documentation Requirements

All contributions should include appropriate documentation:

- **API Changes**: Update API.md
- **New Features**: Add examples to README.md
- **Breaking Changes**: Update MIGRATION.md
- **Architecture Changes**: Update ARCHITECTURE.md
- **Best Practices**: Update BEST-PRACTICES.md

### Documentation Style

**Code Examples**:
```typescript
// ✅ Good: Clear, self-contained example
import { loadPreset, generateCSSVariables } from '@tekton/token-contract';

const theme = loadPreset('professional');
const css = generateCSSVariables(theme.tokens);
console.log(css);
```

**Inline Comments**:
```typescript
/**
 * Generate CSS variables from semantic tokens.
 *
 * @param tokens - Semantic token object
 * @returns CSS string with :root selector and variables
 *
 * @example
 * const css = generateCSSVariables(theme.tokens);
 * console.log(css);
 * // :root {
 * //   --tekton-primary-500: oklch(0.6 0.15 220);
 * //   ...
 * // }
 */
export function generateCSSVariables(tokens: SemanticToken): string {
  // Implementation
}
```

---

## Pull Request Process

### Before Submitting

- [ ] All tests pass (`pnpm test`)
- [ ] Code coverage meets requirements (`pnpm test:coverage`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (for significant changes)

### PR Template

```markdown
## Description

Brief description of changes.

## Type of Change

- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Checklist

- [ ] Code follows project coding standards
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
```

### Review Process

1. **Automated Checks**: CI/CD runs all tests and quality checks
2. **Code Review**: At least one maintainer review required
3. **Feedback**: Address review comments and update PR
4. **Approval**: PR approved and merged by maintainer

---

## Coding Standards

### TypeScript Guidelines

**Use Strict Mode**:
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Type Safety**:
```typescript
// ✅ Good: Explicit types
export function generateVariableName(semantic: string, step: string): string {
  return `--tekton-${semantic}-${step}`;
}

// ❌ Avoid: Implicit any
export function generateVariableName(semantic, step) {
  return `--tekton-${semantic}-${step}`;
}
```

**Use Zod for Validation**:
```typescript
// ✅ Good: Runtime validation with Zod
import { z } from 'zod';

const ColorTokenSchema = z.object({
  l: z.number().min(0).max(1),
  c: z.number().min(0).max(0.4),
  h: z.number().min(0).max(360),
});

// ❌ Avoid: Manual validation
function isValidColor(token: any): boolean {
  return token.l >= 0 && token.l <= 1 && /* ... */;
}
```

### Code Style

**Follow ESLint and Prettier**:
```bash
# Auto-format code
pnpm format

# Check linting
pnpm lint

# Fix linting issues
pnpm lint:fix
```

**Naming Conventions**:
- **Functions**: camelCase (`loadPreset`, `generateCSSVariables`)
- **Types/Interfaces**: PascalCase (`ColorToken`, `SemanticToken`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_PRESET`, `MAX_CHROMA`)
- **Files**: kebab-case (`color-token.ts`, `theme-provider.tsx`)

---

## Commit Message Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring (no feature or bug fix)
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, build config)

### Examples

```
feat(themes): add new warm theme with orange primary color

- Add warm theme configuration
- Update theme loader to include warm theme
- Add tests for warm theme validation

Closes #123
```

```
fix(css-generator): correct dark mode variable naming

Fix issue where dark mode variables were not properly prefixed
with data-theme selector.

Fixes #456
```

---

## Reporting Issues

### Bug Reports

**Template**:
```markdown
**Describe the bug**
Clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Load theme 'professional'
2. Call generateCSSVariables()
3. See error

**Expected behavior**
What you expected to happen.

**Actual behavior**
What actually happened.

**Environment**
- Package version: 0.1.0
- Node.js version: 20.x
- Browser: Chrome 120

**Additional context**
Any other relevant information.
```

### Feature Requests

**Template**:
```markdown
**Is your feature request related to a problem?**
Clear description of the problem.

**Describe the solution you'd like**
Clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've considered.

**Additional context**
Any other relevant information.
```

---

## Getting Help

- **Documentation**: Start with [docs/](./docs/) directory
- **Issues**: Search [existing issues](https://github.com/tekton/tekton/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/tekton/tekton/discussions)
- **Discord**: Join the Tekton community on Discord

---

## Recognition

Contributors will be recognized in:
- CHANGELOG.md for significant contributions
- README.md contributors section
- GitHub contributor graph

Thank you for contributing to @tekton/token-contract! 🎉

---

**Last Updated**: 2026-01-17
**Maintained by**: Tekton Team
**License**: MIT
