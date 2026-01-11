# Contributing to Tekton

Thank you for your interest in contributing to Tekton! This document provides guidelines and workflows for contributing to the project.

## Table of Contents

- [Development Setup](#development-setup)
- [SPEC-First Development Workflow](#spec-first-development-workflow)
- [TDD Workflow](#tdd-workflow)
- [Quality Gates](#quality-gates)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Security Reporting](#security-reporting)
- [Code of Conduct](#code-of-conduct)

---

## Development Setup

### Prerequisites

- **Node.js**: ≥20.0.0 (LTS recommended)
- **npm**: ≥10.0.0 (or yarn/pnpm equivalent)
- **Git**: ≥2.40.0

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-org/tekton.git
cd tekton

# Install dependencies
npm install

# Run tests to verify setup
npm test

# Generate coverage report
npm run test:coverage
```

### Project Structure

```
tekton/
├── src/                    # Source code
│   ├── schemas.ts          # Zod validation schemas
│   ├── color-conversion.ts # OKLCH ↔ RGB ↔ Hex conversions
│   ├── scale-generator.ts  # 10-step lightness scales
│   ├── wcag-validator.ts   # WCAG AA/AAA compliance
│   ├── token-generator.ts  # Core token generation
│   ├── component-presets.ts # UI component presets
│   └── index.ts            # Public API exports
│
├── tests/                  # Test files (mirrors src/ structure)
│   ├── schemas.test.ts
│   ├── color-conversion.test.ts
│   └── ...
│
├── docs/                   # Documentation
│   ├── api/                # API reference
│   ├── guides/             # User guides
│   ├── examples/           # Code examples
│   └── architecture/       # Architecture documentation
│
├── .moai/                  # MoAI-ADK configuration
│   ├── specs/              # SPEC documents
│   │   └── SPEC-PHASEAB-001/ # Current phase specification
│   └── reports/            # Quality reports
│
├── coverage/               # Test coverage reports (generated)
├── dist/                   # Build output (generated)
└── package.json            # Project metadata
```

---

## SPEC-First Development Workflow

Tekton follows a **SPEC-First** development approach, ensuring all features are planned before implementation.

### What is SPEC-First?

SPEC (Specification) documents define requirements using the **EARS** (Easy Approach to Requirements Syntax) format before any code is written.

### EARS Format

Requirements are categorized into 5 types:

1. **Ubiquitous Requirements (UR)**: Always active, system-wide
   - Format: "The system **shall** [requirement]"
   - Example: "The token generator **shall** produce identical output for identical input"

2. **Event-Driven Requirements (EDR)**: Trigger-based
   - Format: "**WHEN** [trigger event], **THEN** the system **shall** [response]"
   - Example: "**WHEN** token generation is requested, **THEN** the system **shall** generate CSS variables"

3. **State-Driven Requirements (SDR)**: Conditional on system state
   - Format: "**IF/WHILE** [condition], **THEN** the system **shall** [behavior]"
   - Example: "**IF** the system is in light mode, **THEN** neutral palette **shall** use lightness scale where 50 = background"

4. **Unwanted Behavior Requirements (UBR)**: Prohibited actions
   - Format: "The system **shall not** [unwanted behavior]"
   - Example: "The system **shall not** use random number generation in palette creation"

5. **Complex Requirements (CR)**: Multi-condition requirements
   - Format: Combination of above patterns
   - Example: "**WHILE** generating primary palette, **WHEN** target color exceeds sRGB gamut, **THEN** clamp chroma **AND** log event"

### SPEC Workflow

#### Step 1: Identify Feature Need

```bash
# Example: Adding tinted neutral palette support
# Document the business case and user need
```

#### Step 2: Create SPEC Document

```bash
# Create or update SPEC in .moai/specs/
# Follow EARS format for all requirements
# Include acceptance criteria and test scenarios
```

#### Step 3: Review and Approve SPEC

```bash
# SPEC review checklist:
# - All requirements use EARS format
# - Acceptance criteria are measurable
# - Test scenarios cover edge cases
# - Dependencies documented
```

#### Step 4: Implement with TDD

```bash
# Only after SPEC approval, begin implementation
# Follow RED-GREEN-REFACTOR cycle (see TDD Workflow)
```

### Current SPEC: SPEC-PHASEAB-001

**Location**: `.moai/specs/SPEC-PHASEAB-001/spec.md`

**Scope**: FigmArchitect Phase A - Design System Foundation

**Phases**:
- A1: Preset Definition System (Not Started)
- **A2: Token Generator (In Progress - 75% Complete)**
- A3: Component Contracts (Not Started)

**Implementation Status**: See [Implementation Status](/.moai/specs/SPEC-PHASEAB-001/implementation-status.md)

---

## TDD Workflow

Tekton strictly follows **Test-Driven Development (TDD)** with the RED-GREEN-REFACTOR cycle.

### The TDD Cycle

```
┌──────────────────────────────────────┐
│         1. RED Phase                 │
│  Write a failing test that defines  │
│  the desired functionality           │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│        2. GREEN Phase                │
│  Write minimal code to make the      │
│  test pass (don't optimize yet)      │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│       3. REFACTOR Phase              │
│  Improve code quality while keeping  │
│  all tests green                     │
└──────────────────────────────────────┘
             │
             └───> Repeat for next feature
```

### RED Phase: Write Failing Test

```typescript
// tests/token-generator.test.ts
import { describe, it, expect } from 'vitest';
import { generateToken } from '../src/token-generator';

describe('generateToken', () => {
  it('should generate deterministic token ID', () => {
    const color = { l: 0.5, c: 0.15, h: 220 };

    const token1 = generateToken('primary', color);
    const token2 = generateToken('primary', color);

    // This test will FAIL initially (RED phase)
    expect(token1.id).toBe(token2.id);
  });
});
```

**Run test** (should fail):
```bash
npm test -- --run
# FAIL: generateToken is not defined
```

### GREEN Phase: Make Test Pass

```typescript
// src/token-generator.ts
export function generateToken(name: string, color: OKLCHColor): TokenDefinition {
  // Minimal implementation to pass test
  const id = `${name}-${color.l.toFixed(3)}-${color.c.toFixed(3)}-${color.h.toFixed(0)}`;

  return {
    id,
    name,
    value: color,
  };
}
```

**Run test** (should pass):
```bash
npm test -- --run
# PASS: generateToken creates deterministic ID
```

### REFACTOR Phase: Improve Code

```typescript
// src/token-generator.ts (refactored)
export function generateTokenId(name: string, color: OKLCHColor): string {
  const colorKey = `${color.l.toFixed(3)}-${color.c.toFixed(3)}-${color.h.toFixed(0)}`;
  return `${name}-${colorKey}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

export function generateToken(name: string, baseColor: OKLCHColor): TokenDefinition {
  OKLCHColorSchema.parse(baseColor); // Add validation

  const id = generateTokenId(name, baseColor);
  const scale = generateLightnessScale(baseColor);

  return {
    id,
    name,
    value: baseColor,
    scale,
    metadata: {
      generated: new Date().toISOString(),
      gamutClipped: false,
    },
  };
}
```

**Run all tests** (should still pass):
```bash
npm test -- --run
# PASS: All tests green after refactoring
```

### Coverage Measurement

```bash
# Generate coverage report
npm run test:coverage

# Coverage should be ≥85%
# Current status: 72.37% (needs improvement)
```

**Coverage Requirements**:
- **Target**: ≥85% for all modules
- **Statements**: ≥85%
- **Branches**: ≥80%
- **Functions**: ≥85%
- **Lines**: ≥85%

### Writing Good Tests

**DO**:
- Test behavior, not implementation
- Use descriptive test names
- Follow Arrange-Act-Assert pattern
- Test edge cases and error conditions
- Keep tests isolated and independent

**DON'T**:
- Test private functions directly
- Mock unnecessarily
- Write tests after implementation
- Skip edge cases
- Create test interdependencies

**Example: Good Test Structure**

```typescript
describe('generateLightnessScale', () => {
  it('should generate 11 steps from 50 to 950', () => {
    // Arrange
    const baseColor = { l: 0.5, c: 0.15, h: 220 };

    // Act
    const scale = generateLightnessScale(baseColor);

    // Assert
    expect(Object.keys(scale)).toHaveLength(11);
    expect(scale['50'].l).toBeGreaterThan(0.95);
    expect(scale['950'].l).toBeLessThan(0.10);
  });

  it('should maintain hue across all steps', () => {
    // Arrange
    const baseColor = { l: 0.5, c: 0.15, h: 220 };

    // Act
    const scale = generateLightnessScale(baseColor);

    // Assert
    Object.values(scale).forEach(color => {
      expect(color.h).toBe(220);
    });
  });
});
```

---

## Quality Gates

All contributions must pass quality gates before merging.

### Pre-Commit Checks

**Automated via Git Hooks** (if configured):

1. **Type Safety**: `npm run build` (tsc compilation)
2. **Linting**: `npm run lint` (ESLint)
3. **Formatting**: `npm run format` (Prettier)

### CI/CD Pipeline Checks

**GitHub Actions** (`.github/workflows/ci.yml`):

```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build      # Type safety
      - run: npm run lint       # Code quality
      - run: npm test           # All tests pass
      - run: npm run test:coverage # Coverage ≥85%
```

### Quality Standards

| Metric | Requirement | Current Status |
|--------|-------------|----------------|
| Test Coverage | ≥85% | 🔄 72.37% (in progress) |
| Type Safety | Zero `any` types in public API | ✅ Pass |
| Linting | Zero errors, warnings allowed | ⚠️ 1 warning |
| Tests | 100% passing | ✅ 142/142 pass |
| Build | Clean compilation | ✅ Pass |
| Security | No high/critical vulnerabilities | ✅ Pass (6 moderate dev deps) |

---

## Pull Request Guidelines

### Before Creating a PR

1. **Ensure SPEC Alignment**
   - Feature is defined in SPEC document
   - Implementation follows EARS requirements
   - Acceptance criteria are met

2. **Run Quality Checks**
   ```bash
   npm run build    # Must pass
   npm run lint     # Zero errors
   npm test         # All tests green
   npm run test:coverage # Check coverage
   ```

3. **Update Documentation**
   - API changes documented in `docs/api/README.md`
   - Examples added to `docs/examples/`
   - CHANGELOG.md updated

4. **Self-Review Code**
   - Remove debug statements
   - Check for hardcoded values
   - Verify error handling
   - Confirm TypeScript types

### PR Title Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation only
- test: Adding missing tests
- refactor: Code refactoring
- perf: Performance improvement
- chore: Build/tooling changes
```

**Examples**:
- `feat(token-generator): Add tinted neutral palette generation`
- `fix(wcag-validator): Correct contrast ratio calculation for edge cases`
- `docs(api): Add component presets usage examples`
- `test(scale-generator): Add edge case tests for extreme lightness`

### PR Description Template

```markdown
## Summary
Brief description of changes and motivation.

## SPEC Reference
- SPEC ID: SPEC-PHASEAB-001
- Requirement IDs: UR-002, EDR-003
- Acceptance Criteria: [Link to acceptance.md]

## Changes
- Added X functionality
- Fixed Y bug
- Updated Z documentation

## Testing
- [ ] All tests pass
- [ ] Coverage ≥85% (or justification for exception)
- [ ] Manual testing completed

## Quality Checklist
- [ ] TypeScript compiles without errors
- [ ] Linter passes (or warnings justified)
- [ ] Documentation updated
- [ ] CHANGELOG.md updated

## Breaking Changes
None / [List breaking changes]

## Screenshots (if UI changes)
[Add screenshots if applicable]
```

### Review Process

1. **Automated Checks**: CI pipeline must pass
2. **Code Review**: At least 1 approval required
3. **SPEC Alignment**: Reviewer verifies SPEC compliance
4. **Quality Standards**: Reviewer confirms quality gates met

### Merge Strategy

- **Squash and Merge**: For feature branches
- **Rebase and Merge**: For hot fixes
- **No Merge Commits**: Keep history clean

---

## Security Reporting

### Reporting Vulnerabilities

**DO NOT** open public issues for security vulnerabilities.

**Instead**:
1. Email security@tekton-project.org (if available)
2. Use GitHub Security Advisories (private disclosure)
3. Provide detailed description and reproduction steps

**We will**:
- Acknowledge receipt within 48 hours
- Provide timeline for fix within 7 days
- Credit reporter (unless anonymity requested)

### Security Best Practices

When contributing:
- Never commit secrets (API keys, tokens, passwords)
- Validate all external inputs
- Use Zod schemas for runtime validation
- Avoid `eval()` or dynamic code execution
- Follow OWASP security guidelines

---

## Code of Conduct

### Our Standards

**Positive Behavior**:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Accepting constructive criticism gracefully
- Focusing on what's best for the community

**Unacceptable Behavior**:
- Harassment, trolling, or insulting comments
- Personal or political attacks
- Public or private harassment
- Sharing others' private information

### Enforcement

Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report incidents to: conduct@tekton-project.org

---

## Development Commands Reference

```bash
# Testing
npm test                    # Run all tests
npm run test:watch          # Watch mode for TDD
npm run test:coverage       # Generate coverage report

# Building
npm run build               # Compile TypeScript to dist/
npm run dev                 # Build in watch mode

# Code Quality
npm run lint                # Run ESLint
npm run lint:fix            # Auto-fix linting issues
npm run format              # Format code with Prettier

# Documentation
npm run docs:build          # Build documentation (if configured)
npm run docs:serve          # Serve documentation locally
```

---

## Getting Help

- **Documentation**: [docs/README.md](./docs/README.md)
- **API Reference**: [docs/api/README.md](./docs/api/README.md)
- **Examples**: [docs/examples/](./docs/examples/)
- **Issues**: [GitHub Issues](https://github.com/your-org/tekton/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/tekton/discussions)

---

## License

By contributing to Tekton, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Tekton!** 🎨

Your efforts help build accessible, perceptually uniform design systems for everyone.
