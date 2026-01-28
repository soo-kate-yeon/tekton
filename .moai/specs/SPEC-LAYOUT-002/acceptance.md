# SPEC-LAYOUT-002: Acceptance Criteria

## TAG
- **SPEC-ID**: SPEC-LAYOUT-002
- **Related**: SPEC-LAYOUT-001, SPEC-COMPONENT-001-B

---

## Test Scenarios

### AC-001: JSON Schema Validation

**Given** a screen definition JSON
**When** validated against the JSON Schema
**Then** valid definitions pass validation
**And** invalid definitions produce clear error messages

**Test Cases:**
```typescript
describe('JSON Schema Validation', () => {
  test('valid screen definition passes', () => {
    const screen = {
      id: 'dashboard',
      name: 'Dashboard',
      shell: 'shell.web.dashboard',
      page: 'page.dashboard',
      sections: [
        {
          id: 'metrics',
          pattern: 'section.grid-4',
          components: [
            { type: 'Card', props: { title: 'Revenue' } }
          ]
        }
      ]
    };
    expect(validateScreenDefinition(screen).success).toBe(true);
  });

  test('invalid shell ID format fails', () => {
    const screen = {
      id: 'test',
      name: 'Test',
      shell: 'invalid-shell',  // Should be shell.platform.name
      page: 'page.dashboard',
      sections: []
    };
    const result = validateScreenDefinition(screen);
    expect(result.success).toBe(false);
    expect(result.errors).toContain('shell must match pattern ^shell\\.[a-z]+\\.[a-z-]+$');
  });

  test('missing required field fails with helpful error', () => {
    const screen = {
      id: 'test',
      // name missing
      shell: 'shell.web.app',
      page: 'page.dashboard',
      sections: []
    };
    const result = validateScreenDefinition(screen);
    expect(result.success).toBe(false);
    expect(result.errors).toContain('name is required');
  });
});
```

---

### AC-002: Screen Resolver Pipeline

**Given** a valid screen definition
**When** passed to the screen resolver
**Then** all layout tokens are resolved
**And** all component schemas are resolved
**And** token bindings resolve to CSS values

**Test Cases:**
```typescript
describe('Screen Resolver', () => {
  test('resolves complete screen structure', () => {
    const screen = {
      id: 'dashboard',
      name: 'Dashboard',
      shell: 'shell.web.dashboard',
      page: 'page.dashboard',
      sections: [
        {
          id: 'metrics',
          pattern: 'section.grid-4',
          components: [{ type: 'Card', props: {} }]
        }
      ]
    };

    const resolved = resolver.resolve(screen);

    expect(resolved.layout.shell.id).toBe('shell.web.dashboard');
    expect(resolved.layout.page.id).toBe('page.dashboard');
    expect(resolved.sections).toHaveLength(1);
    expect(resolved.sections[0].pattern.type).toBe('grid');
  });

  test('resolves layout tokens from SPEC-LAYOUT-001', () => {
    const screen = {
      id: 'test',
      name: 'Test',
      shell: 'shell.web.app',
      page: 'page.resource',
      sections: []
    };

    const resolved = resolver.resolve(screen);

    expect(resolved.layout.shell.regions).toBeDefined();
    expect(resolved.layout.shell.regions.length).toBeGreaterThan(0);
  });

  test('resolves component schemas from SPEC-COMPONENT-001-B', () => {
    const screen = {
      id: 'test',
      name: 'Test',
      shell: 'shell.web.app',
      page: 'page.dashboard',
      sections: [
        {
          id: 'content',
          pattern: 'section.container',
          components: [
            { type: 'Button', props: { variant: 'primary' } }
          ]
        }
      ]
    };

    const resolved = resolver.resolve(screen);

    expect(resolved.sections[0].components[0].schema).toBeDefined();
    expect(resolved.sections[0].components[0].schema.name).toBe('Button');
  });

  test('generates CSS variables', () => {
    const screen = {
      id: 'test',
      name: 'Test',
      shell: 'shell.web.dashboard',
      page: 'page.dashboard',
      sections: []
    };

    const resolved = resolver.resolve(screen);

    expect(resolved.cssVariables).toBeDefined();
    expect(Object.keys(resolved.cssVariables).length).toBeGreaterThan(0);
    expect(resolved.cssVariables['--layout-sidebar-width']).toBeDefined();
  });
});
```

---

### AC-003: CSS-in-JS Generator

**Given** a resolved screen
**When** CSS-in-JS generator is invoked
**Then** valid styled-components/emotion code is produced
**And** code includes responsive media queries
**And** no hard-coded values exist

**Test Cases:**
```typescript
describe('CSS-in-JS Generator', () => {
  test('generates styled-components code', () => {
    const resolved = resolver.resolve(sampleScreen);
    const output = cssInJSGenerator.generate(resolved, {
      library: 'styled-components',
      typescript: true
    });

    expect(output.components).toContain("import styled from 'styled-components'");
    expect(output.components).toContain('const DashboardShell = styled.div`');
  });

  test('generates emotion code', () => {
    const resolved = resolver.resolve(sampleScreen);
    const output = cssInJSGenerator.generate(resolved, {
      library: 'emotion',
      typescript: true
    });

    expect(output.components).toContain("import styled from '@emotion/styled'");
  });

  test('includes responsive media queries', () => {
    const resolved = resolver.resolve(sampleScreen);
    const output = cssInJSGenerator.generate(resolved, {
      library: 'styled-components',
      typescript: true
    });

    expect(output.components).toContain('@media (max-width:');
    expect(output.components).toContain('@media (min-width:');
  });

  test('uses CSS variables instead of hard-coded values', () => {
    const resolved = resolver.resolve(sampleScreen);
    const output = cssInJSGenerator.generate(resolved, {
      library: 'styled-components',
      typescript: true
    });

    // Should not contain hard-coded pixel values for layout
    expect(output.components).not.toMatch(/width:\s*\d+px/);
    expect(output.components).not.toMatch(/height:\s*\d+px/);

    // Should use CSS variables
    expect(output.components).toContain('var(--');
  });

  test('generated code compiles without errors', async () => {
    const resolved = resolver.resolve(sampleScreen);
    const output = cssInJSGenerator.generate(resolved, {
      library: 'styled-components',
      typescript: true
    });

    // Write to temp file and compile
    const result = await compileTypeScript(output.components);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
```

---

### AC-004: Tailwind CSS Generator

**Given** a resolved screen
**When** Tailwind generator is invoked
**Then** valid Tailwind CSS classes are produced
**And** responsive variants are included
**And** custom CSS is generated for token-based values

**Test Cases:**
```typescript
describe('Tailwind Generator', () => {
  test('generates component with Tailwind classes', () => {
    const resolved = resolver.resolve(sampleScreen);
    const output = tailwindGenerator.generate(resolved, {
      typescript: true,
      classNameStrategy: 'inline'
    });

    expect(output.components).toContain('className="');
    expect(output.components).toContain('grid');
  });

  test('includes responsive variants', () => {
    const resolved = resolver.resolve(sampleScreen);
    const output = tailwindGenerator.generate(resolved, {
      typescript: true,
      classNameStrategy: 'inline'
    });

    expect(output.components).toContain('lg:');
    expect(output.components).toContain('md:');
    expect(output.components).toContain('sm:');
  });

  test('generates custom CSS for token-based values', () => {
    const resolved = resolver.resolve(sampleScreen);
    const output = tailwindGenerator.generate(resolved, {
      typescript: true,
      classNameStrategy: 'inline'
    });

    expect(output.customCSS).toBeDefined();
    expect(output.customCSS).toContain(':root');
    expect(output.customCSS).toContain('--layout-');
  });

  test('supports cn() strategy for class composition', () => {
    const resolved = resolver.resolve(sampleScreen);
    const output = tailwindGenerator.generate(resolved, {
      typescript: true,
      classNameStrategy: 'cn'
    });

    expect(output.components).toContain("import { cn } from");
    expect(output.components).toContain('className={cn(');
  });
});
```

---

### AC-005: React Component Generator

**Given** a resolved screen
**When** React generator is invoked
**Then** valid React component code is produced
**And** accessibility attributes are included
**And** TypeScript types are generated when requested

**Test Cases:**
```typescript
describe('React Generator', () => {
  test('generates valid React component', () => {
    const resolved = resolver.resolve(sampleScreen);
    const output = reactGenerator.generate(resolved, {
      typescript: true,
      serverComponent: false,
      exportStyle: 'named'
    });

    expect(output.component).toContain('function Dashboard');
    expect(output.component).toContain('return (');
    expect(output.component).toContain('export { Dashboard }');
  });

  test('includes use client directive when not server component', () => {
    const resolved = resolver.resolve(sampleScreen);
    const output = reactGenerator.generate(resolved, {
      typescript: true,
      serverComponent: false,
      exportStyle: 'named'
    });

    expect(output.component).toContain("'use client'");
  });

  test('excludes use client for server components', () => {
    const resolved = resolver.resolve(sampleScreen);
    const output = reactGenerator.generate(resolved, {
      typescript: true,
      serverComponent: true,
      exportStyle: 'named'
    });

    expect(output.component).not.toContain("'use client'");
  });

  test('includes accessibility attributes', () => {
    const resolved = resolver.resolve(sampleScreen);
    const output = reactGenerator.generate(resolved, {
      typescript: true,
      serverComponent: false,
      exportStyle: 'named'
    });

    expect(output.component).toContain('role=');
    expect(output.component).toContain('aria-');
  });

  test('generates TypeScript types when requested', () => {
    const resolved = resolver.resolve(sampleScreen);
    const output = reactGenerator.generate(resolved, {
      typescript: true,
      serverComponent: false,
      exportStyle: 'named'
    });

    expect(output.types).toBeDefined();
    expect(output.types).toContain('interface');
  });
});
```

---

### AC-006: MCP Server Integration

**Given** the MCP server is running
**When** generate_screen tool is invoked
**Then** screen generation completes successfully
**And** tool returns properly formatted response
**And** errors include recovery suggestions

**Test Cases:**
```typescript
describe('MCP Server Tools', () => {
  test('generate_screen tool returns valid code', async () => {
    const args = {
      screen: {
        id: 'dashboard',
        name: 'Dashboard',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [
          {
            id: 'metrics',
            pattern: 'section.grid-4',
            components: [{ type: 'Card', props: {} }]
          }
        ]
      },
      format: 'react',
      options: { typescript: true }
    };

    const result = await handleGenerateScreen(args);

    expect(result.isError).toBeFalsy();
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('function Dashboard');
  });

  test('validate_screen tool returns validation results', async () => {
    const args = {
      screen: {
        id: 'test',
        name: 'Test',
        shell: 'invalid-shell',
        page: 'page.dashboard',
        sections: []
      }
    };

    const result = await handleValidateScreen(args);

    expect(result.content[0].text).toContain('Validation failed');
    expect(result.content[0].text).toContain('shell');
  });

  test('list_tokens tool returns available tokens', async () => {
    const args = { type: 'shell' };

    const result = await handleListTokens(args);

    expect(result.content[0].text).toContain('shell.web.app');
    expect(result.content[0].text).toContain('shell.web.dashboard');
  });

  test('error responses include recovery suggestions', async () => {
    const args = {
      screen: {
        id: 'test',
        name: 'Test',
        shell: 'shell.web.nonexistent',
        page: 'page.dashboard',
        sections: []
      },
      format: 'react'
    };

    const result = await handleGenerateScreen(args);

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('suggestion');
    expect(result.content[0].text).toContain('available shells');
  });

  test('performance: generation completes in <2s', async () => {
    const args = {
      screen: largeScreenDefinition, // 10+ sections, 50+ components
      format: 'react'
    };

    const start = performance.now();
    await handleGenerateScreen(args);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(2000);
  });
});
```

---

### AC-007: Generated Code Quality

**Given** generated screen code
**When** analyzed for code quality
**Then** code passes ESLint checks
**And** code includes no hard-coded values
**And** code compiles without TypeScript errors

**Test Cases:**
```typescript
describe('Generated Code Quality', () => {
  const formats = ['css-in-js', 'tailwind', 'react'] as const;

  test.each(formats)('%s output passes ESLint', async (format) => {
    const resolved = resolver.resolve(sampleScreen);
    const generator = getGenerator(format);
    const output = generator.generate(resolved, { typescript: true });

    const lintResult = await lintCode(output.component || output.components);
    expect(lintResult.errors).toHaveLength(0);
  });

  test.each(formats)('%s output compiles', async (format) => {
    const resolved = resolver.resolve(sampleScreen);
    const generator = getGenerator(format);
    const output = generator.generate(resolved, { typescript: true });

    const compileResult = await compileTypeScript(output.component || output.components);
    expect(compileResult.success).toBe(true);
  });

  test.each(formats)('%s output has no hard-coded colors', (format) => {
    const resolved = resolver.resolve(sampleScreen);
    const generator = getGenerator(format);
    const output = generator.generate(resolved, { typescript: true });

    const code = output.component || output.components;

    // No hex colors
    expect(code).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    // No rgb/rgba
    expect(code).not.toMatch(/rgba?\([^)]+\)/);
  });

  test.each(formats)('%s output has no hard-coded spacing', (format) => {
    const resolved = resolver.resolve(sampleScreen);
    const generator = getGenerator(format);
    const output = generator.generate(resolved, { typescript: true });

    const code = output.component || output.components;

    // Layout-related pixel values should use tokens
    expect(code).not.toMatch(/padding:\s*\d+px/);
    expect(code).not.toMatch(/margin:\s*\d+px/);
    expect(code).not.toMatch(/gap:\s*\d+px/);
  });
});
```

---

### AC-008: Test Coverage Requirement

**Given** the complete screen generation implementation
**When** test coverage is measured
**Then** coverage is >=85% across all modules

**Verification:**
```bash
# Run coverage report
pnpm test:coverage

# Expected output:
# schema/screen-definition.ts  | 95%  | 90%  | 100% | 95%
# schema/validators.ts         | 95%  | 95%  | 100% | 95%
# resolver/screen-resolver.ts  | 90%  | 85%  | 95%  | 90%
# resolver/layout-resolver.ts  | 90%  | 85%  | 95%  | 90%
# resolver/component-resolver.ts | 90% | 85% | 95%  | 90%
# generators/css-in-js.ts      | 85%  | 80%  | 90%  | 85%
# generators/tailwind.ts       | 85%  | 80%  | 90%  | 85%
# generators/react.ts          | 85%  | 80%  | 90%  | 85%
# mcp-server/tools/*.ts        | 90%  | 85%  | 95%  | 90%
# ---------------------------+----- +------+------+------
# All files                    | 89%  | 85%  | 94%  | 89%
```

---

### AC-009: Accessibility Compliance

**Given** generated screen code
**When** accessibility is analyzed
**Then** all interactive elements have ARIA attributes
**And** semantic HTML is used appropriately
**And** accessibility requirements from component schemas are applied

**Test Cases:**
```typescript
describe('Accessibility Compliance', () => {
  test('generated buttons have accessible labels', () => {
    const screen = {
      id: 'test',
      name: 'Test',
      shell: 'shell.web.app',
      page: 'page.dashboard',
      sections: [
        {
          id: 'actions',
          pattern: 'section.container',
          components: [
            { type: 'Button', props: { label: 'Submit' } },
            { type: 'Button', props: { 'aria-label': 'Close' } }
          ]
        }
      ]
    };

    const resolved = resolver.resolve(screen);
    const output = reactGenerator.generate(resolved, { typescript: true });

    expect(output.component).toContain('aria-label');
  });

  test('generated forms have proper labeling', () => {
    const screen = {
      id: 'test',
      name: 'Test',
      shell: 'shell.web.app',
      page: 'page.settings',
      sections: [
        {
          id: 'form',
          pattern: 'section.container',
          components: [
            {
              type: 'Input',
              props: { label: 'Email', id: 'email' }
            }
          ]
        }
      ]
    };

    const resolved = resolver.resolve(screen);
    const output = reactGenerator.generate(resolved, { typescript: true });

    expect(output.component).toContain('htmlFor');
    expect(output.component).toContain('aria-describedby');
  });

  test('navigation has proper landmarks', () => {
    const screen = {
      id: 'test',
      name: 'Test',
      shell: 'shell.web.dashboard',
      page: 'page.dashboard',
      sections: []
    };

    const resolved = resolver.resolve(screen);
    const output = reactGenerator.generate(resolved, { typescript: true });

    expect(output.component).toContain('role="navigation"');
    expect(output.component).toContain('role="main"');
  });
});
```

---

## Quality Gates

### Code Quality
- [x] All generators produce compilable code
- [x] ESLint passes with zero warnings
- [x] No `any` types in generated TypeScript
- [x] All functions have JSDoc comments

### Performance
- [x] Screen generation < 2s for complex screens
- [x] MCP tool response < 3s including network
- [x] No memory leaks in resolver pipeline

### Documentation
- [x] LLM prompting guide complete
- [x] JSON Schema documented with examples
- [x] API reference for all generators
- [x] MCP tool descriptions optimized for Claude

---

## Definition of Done

- [x] JSON Schema for screen definitions complete
- [x] Zod validators with helpful errors
- [x] Screen resolver pipeline operational
- [x] CSS-in-JS generator (styled-components/emotion) complete
- [x] Tailwind CSS generator complete
- [x] React component generator complete
- [x] MCP server with all tools complete
- [x] Test coverage >= 85%
- [x] All generated code passes ESLint
- [x] All generated code compiles
- [x] Accessibility attributes included
- [x] No hard-coded values in output
- [x] Performance targets met
- [x] LLM prompting guide complete
- [x] Integration with SPEC-LAYOUT-001 verified
- [x] Code review approved

---

**Last Updated**: 2026-01-28
**Status**: Completed
**Final Coverage**: 90.34% (292 tests passing)
