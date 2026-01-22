---
id: SPEC-THEME-BIND-001
document: acceptance
version: "1.0.0"
created: "2026-01-21"
updated: "2026-01-21"
---

# Acceptance Criteria: Theme Token Binding

**TAG**: SPEC-THEME-BIND-001

## Overview

This document defines the acceptance criteria for Theme Token Binding implementation using Given-When-Then format (Gherkin syntax).

---

## Feature: Blueprint Schema Extension

### Scenario 1: Blueprint with themeId is accepted

```gherkin
Given a Blueprint JSON with the following structure:
  {
    "blueprintId": "bp-001",
    "recipeName": "TestPage",
    "themeId": "calm-wellness",
    "analysis": { "intent": "Display", "tone": "calm" },
    "structure": { "componentName": "Card", "props": {} }
  }
When the Blueprint is validated against BlueprintResultSchema
Then validation should pass
And themeId should be accessible as "calm-wellness"
```

### Scenario 2: Blueprint without themeId is accepted (backward compatibility)

```gherkin
Given a Blueprint JSON without themeId field:
  {
    "blueprintId": "bp-002",
    "recipeName": "LegacyPage",
    "analysis": { "intent": "Display", "tone": "professional" },
    "structure": { "componentName": "Card", "props": {} }
  }
When the Blueprint is validated against BlueprintResultSchema
Then validation should pass
And themeId should be undefined
```

### Scenario 3: TypeScript type check passes

```gherkin
Given the updated BlueprintResult interface
When TypeScript compiler processes the codebase
Then no type errors should be reported
And existing code using BlueprintResult should compile without changes
```

---

## Feature: TokenResolver Theme Loading

### Scenario 4: Load all available themes

```gherkin
Given a TokenResolver instance
When initialized with default themes path
Then it should load all 13 theme files:
  | Theme ID          |
  | calm-wellness     |
  | dynamic-fitness   |
  | korean-fintech    |
  | media-streaming   |
  | premium-editorial |
  | saas-dashboard    |
  | saas-modern       |
  | tech-startup      |
  | warm-humanist     |
  | next-styled-components |
  | next-tailwind-radix    |
  | next-tailwind-shadcn   |
  | vite-tailwind-shadcn   |
And hasTheme("calm-wellness") should return true
And getAvailableThemes() should return 13 themes
```

### Scenario 5: Resolve tokens for calm-wellness theme

```gherkin
Given a TokenResolver with loaded themes
And a Card component with tokenBindings:
  {
    "states": {
      "default": {
        "backgroundColor": "color-surface",
        "borderRadius": "radius-large",
        "boxShadow": "shadow-soft"
      }
    }
  }
When resolveTokens("Card", tokenBindings, "calm-wellness") is called
Then the result should contain:
  | Property        | CSS Variable                    |
  | backgroundColor | var(--tekton-surface-elevated)  |
  | borderRadius    | var(--tekton-radius-large)      |
  | boxShadow       | var(--tekton-shadow-soft)       |
```

### Scenario 6: Unknown theme falls back to default

```gherkin
Given a TokenResolver with loaded themes
When resolveTokens("Card", tokenBindings, "nonexistent-theme") is called
Then a warning should be logged: "Theme 'nonexistent-theme' not found, using default"
And tokens should be resolved using "calm-wellness" theme
And the result should be identical to calm-wellness resolution
```

### Scenario 7: Missing token produces fallback with warning

```gherkin
Given a TokenResolver with loaded themes
And a tokenBindings object referencing "color-undefined-token"
When resolveTokens is called for that component
Then a warning should be logged about the undefined token
And a fallback value should be used (e.g., "inherit" or neutral color)
And the process should not throw an error
```

---

## Feature: JSXGenerator Theme Integration

### Scenario 8: Generate component with theme-resolved tokens

```gherkin
Given a Blueprint:
  {
    "blueprintId": "bp-themed-001",
    "recipeName": "ThemedCard",
    "themeId": "calm-wellness",
    "analysis": { "intent": "Display", "tone": "calm" },
    "structure": {
      "componentName": "Card",
      "props": { "variant": "elevated" }
    }
  }
When JSXGenerator.generate(blueprint) is called
Then the generated code should include:
  """tsx
  <Card
    variant="elevated"
    style={{
      backgroundColor: "var(--tekton-surface-elevated)",
      borderRadius: "var(--tekton-radius-large)"
    }}
  />
  """
```

### Scenario 9: Generate nested components with theme tokens

```gherkin
Given a Blueprint with nested structure:
  {
    "blueprintId": "bp-nested-001",
    "recipeName": "ContentCard",
    "themeId": "calm-wellness",
    "structure": {
      "componentName": "Card",
      "props": {},
      "slots": {
        "content": {
          "componentName": "Typography",
          "props": { "variant": "body1" }
        }
      }
    }
  }
When JSXGenerator.generate(blueprint) is called
Then both Card and Typography should have style props with CSS variables
And the Typography style should include color and font-weight tokens
```

### Scenario 10: Theme option overrides blueprint themeId

```gherkin
Given a Blueprint with themeId "calm-wellness"
When JSXGenerator.generate(blueprint, { themeId: "tech-startup" }) is called
Then the generated code should use tech-startup theme tokens
And calm-wellness tokens should NOT be present
```

### Scenario 11: Component without token bindings processes normally

```gherkin
Given a Blueprint with a component that has no tokenBindings in catalog
When JSXGenerator.generate(blueprint) is called
Then the component should be generated without style prop injection
And no error should be thrown
And other components with tokenBindings should still receive tokens
```

---

## Feature: renderScreen API

### Scenario 12: renderScreen accepts themeId option

```gherkin
Given a valid Blueprint
When renderScreen(blueprint, { themeId: "calm-wellness" }) is called
Then the function should complete successfully
And the response should include:
  | Field        | Value              |
  | success      | true               |
  | themeApplied | "calm-wellness"    |
And the generated file should contain calm-wellness CSS variables
```

### Scenario 13: renderScreen uses default theme when not specified

```gherkin
Given a Blueprint without themeId
And renderScreen options without themeId
When renderScreen(blueprint, { outputPath: "test.tsx" }) is called
Then the response should include:
  | Field        | Value           |
  | success      | true            |
  | themeApplied | "calm-wellness" |
```

### Scenario 14: renderScreen with legacy signature (backward compatibility)

```gherkin
Given a Blueprint without themeId
When renderScreen(blueprint, "output/page.tsx") is called with string path
Then the function should work as before
And use "calm-wellness" as default theme
And write file to specified path
```

### Scenario 15: renderScreen reports unknown theme with warning

```gherkin
Given a Blueprint with themeId "invalid-theme"
When renderScreen(blueprint) is called
Then a warning should be logged
And the response should include:
  | Field        | Value           |
  | success      | true            |
  | themeApplied | "calm-wellness" |
And the generated code should use calm-wellness tokens
```

---

## Feature: Generated Code Quality

### Scenario 16: Generated code compiles without TypeScript errors

```gherkin
Given a Blueprint with themeId "calm-wellness"
When renderScreen generates a .tsx file
And tsc --noEmit is run on the generated file
Then no TypeScript errors should be reported
```

### Scenario 17: Generated code contains no hardcoded design values

```gherkin
Given a Blueprint with themeId "calm-wellness"
When renderScreen generates a .tsx file
Then the generated code should NOT contain:
  | Pattern                    | Description              |
  | #[0-9A-Fa-f]{3,8}          | Hex color codes          |
  | rgb\(|rgba\(               | RGB color values         |
  | \d+px                      | Pixel values for spacing |
  | fontSize: \d+              | Hardcoded font sizes     |
And all design values should be CSS variable references
```

### Scenario 18: Generated code passes Prettier formatting

```gherkin
Given a Blueprint with themeId "calm-wellness"
When renderScreen generates a .tsx file
Then the code should be formatted with Prettier
And running Prettier --check should report no issues
```

---

## Feature: End-to-End LLM Workflow

### Scenario 19: Complete LLM workflow with theme

```gherkin
Given an LLM agent with access to MCP tools
When the LLM performs:
  1. Call get-knowledge-schema to learn Blueprint format
  2. Design a Blueprint with themeId "calm-wellness"
  3. Call render-screen with the Blueprint
Then each step should complete successfully
And the final .tsx file should:
  - Contain valid React component code
  - Include CSS variable style props
  - Reference calm-wellness theme tokens
  - Compile without TypeScript errors
```

### Scenario 20: Theme-aware knowledge schema

```gherkin
Given an LLM calling get-knowledge-schema
When the schema is returned
Then it should include information about:
  - themeId field in BlueprintResult
  - Available theme options (or how to query them)
  - Default theme behavior
```

---

## Feature: Error Handling

### Scenario 21: Structured error for theme load failure

```gherkin
Given a TokenResolver attempting to load themes
When a theme file is corrupted or missing
Then an error should be reported with:
  | Field   | Value                              |
  | code    | THEME-E002                         |
  | message | Failed to load theme: {filename}   |
And other themes should still be available
And the system should remain functional
```

### Scenario 22: Graceful handling of missing component knowledge

```gherkin
Given a Blueprint with componentName "NonExistentComponent"
When TokenResolver attempts to resolve tokens
Then the component should be processed without token injection
And no error should be thrown (component validation is separate concern)
```

---

## Quality Gates

### Scenario 23: Test coverage meets requirements

```gherkin
Given the complete implementation
When vitest coverage report is generated
Then coverage should be:
  | Metric     | Minimum |
  | Statements | 85%     |
  | Branches   | 80%     |
  | Functions  | 85%     |
  | Lines      | 85%     |
```

### Scenario 24: No ESLint errors

```gherkin
Given the complete implementation
When ESLint is run on all modified files
Then no errors should be reported
And no warnings for severity "error" rules
```

### Scenario 25: All existing tests pass

```gherkin
Given the complete implementation
When the full test suite is executed
Then all pre-existing tests should pass
And no tests should require modification for backward compatibility
```

---

## Definition of Done

The Theme Token Binding feature is complete when:

1. **Schema**: BlueprintResult includes optional themeId field
2. **TokenResolver**: Loads all themes and resolves tokens correctly
3. **JSXGenerator**: Produces code with CSS variable style props
4. **renderScreen**: Accepts theme parameter and reports applied theme
5. **Default Theme**: "calm-wellness" used when themeId not specified
6. **Backward Compatibility**: Existing blueprints work without modification
7. **Code Quality**:
   - Test coverage >= 85%
   - Zero TypeScript errors
   - Zero ESLint errors
   - Generated code passes tsc --noEmit
8. **Documentation**: All scenarios in this document verified

---

**END OF ACCEPTANCE CRITERIA**
