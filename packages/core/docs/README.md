# @tekton/core Documentation

Complete documentation for the @tekton/core Token System.

## Documentation Structure

### Getting Started

- **[Main README](../README.md)** - Quick start guide, installation, and overview
- **[CHANGELOG](../CHANGELOG.md)** - Version history and release notes

### Token System Documentation

- **[Token System Guide](./token-system.md)** - Complete architecture overview
  - 3-Layer Token Architecture
  - Layer 1: Atomic Tokens
  - Layer 2: Semantic Tokens
  - Layer 3: Component Tokens
  - Token Resolution
  - Dark Mode Support
  - CSS Variables Generation
  - Validation
  - Best Practices

- **[API Reference](./api-reference.md)** - Detailed API documentation
  - Type Definitions (AtomicTokens, SemanticTokens, ComponentTokens, ThemeWithTokens)
  - Functions (resolveToken, resolveWithFallback, generateThemeCSS, validateTheme)
  - Complete parameter and return type documentation

- **[Examples](./examples.md)** - Real-world usage examples
  - Basic Usage
  - Building a Complete Theme
  - Dark Mode Implementation
  - Custom Component Tokens
  - Token Resolution Patterns
  - React Integration
  - Migration from Old System
  - Performance Optimization

## Quick Links

### For New Users

1. Start with [Main README](../README.md) for installation and quick start
2. Read [Token System Guide](./token-system.md) for architecture overview
3. Explore [Examples](./examples.md) for practical implementation patterns

### For API Reference

- [API Reference](./api-reference.md) - Complete function and type documentation

### For Migration

- [README Migration Guide](../README.md#migration-guide) - Upgrading from 0.1.0
- [Examples Migration Section](./examples.md#migration-from-old-system) - Step-by-step migration

## Documentation Overview

### Token System Guide

Comprehensive guide covering the 3-layer token architecture:

```
Atomic Tokens (Layer 1)
    ↓ references
Semantic Tokens (Layer 2)
    ↓ references
Component Tokens (Layer 3)
    ↓ generates
CSS Variables
```

**Topics Covered:**

- Architecture principles and design philosophy
- Each layer's structure and purpose
- Token resolution algorithm
- Dark mode implementation strategies
- CSS Variables naming conventions
- Runtime validation
- Best practices and common patterns

### API Reference

Complete API documentation with examples:

**Type Definitions:**

- `AtomicTokens` - Foundation tokens
- `SemanticTokens` - Meaning-based mappings
- `ComponentTokens` - Component-specific bindings
- `ThemeWithTokens` - Complete theme structure
- `ValidationResult` - Validation output

**Functions:**

- `resolveToken()` - Token reference resolution
- `resolveWithFallback()` - Fallback chain resolution
- `generateThemeCSS()` - CSS Variables generation
- `validateTheme()` - Runtime validation

### Examples

Real-world usage patterns:

**Basic Patterns:**

- Minimal theme setup
- Token resolution
- CSS generation

**Advanced Patterns:**

- E-commerce theme (complete example)
- Dark mode implementation
- Custom component tokens
- React integration with ThemeProvider
- Build-time optimization

**Migration:**

- Backward compatibility
- Gradual migration strategy
- Performance optimization

## Feature Highlights

### 🎨 3-Layer Token Architecture

Professional design token system with clear separation of concerns:

- **Atomic**: Raw values (colors, spacing)
- **Semantic**: Meaning-based mappings (page, surface, primary)
- **Component**: Component-specific bindings (button, input, card)

### 🔗 Automatic Resolution

Multi-level token reference resolution with circular detection:

```typescript
resolveToken('component.button.primary.background', tokens);
// → '#3b82f6' (semantic.foreground.accent → atomic.color.blue.500)
```

### 🌓 Dark Mode Support

Built-in dark mode with token overrides:

```typescript
darkMode: {
  tokens: {
    semantic: {
      background: {
        page: 'atomic.color.neutral.900';
      }
    }
  }
}
```

### ✅ Runtime Validation

Zod-based schema validation with detailed error reporting:

```typescript
const result = validateTheme(theme);
// { valid: false, errors: ['tokens.atomic.color: Required'] }
```

### 📦 CSS Variables Generation

Automatic CSS custom properties with consistent naming:

```css
:root {
  --color-blue-500: #3b82f6;
  --button-primary-background: #3b82f6;
}
```

## Version History

- **0.2.0** (2026-01-25): Added 3-Layer Token System
  - 784 LOC token system implementation
  - 132 tests, 96.37% coverage
  - Complete documentation suite

- **0.1.0** (2026-01-24): Initial minimal pipeline
  - 742 LOC core pipeline
  - 21 tests, 83% coverage

## Contributing

When contributing to the token system:

1. **Maintain backward compatibility** - Old themes should continue working
2. **Add tests** - All new features require tests (96%+ coverage target)
3. **Update documentation** - Keep all docs in sync with code changes
4. **Follow naming conventions** - Consistent token naming patterns
5. **Validate themes** - Use `validateTheme()` in examples

## Support

- **Issues**: [GitHub Issues](https://github.com/your-org/tekton/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/tekton/discussions)
- **Documentation**: This directory

## License

MIT - See [LICENSE](../LICENSE) for details

---

**Generated by**: SPEC-COMPONENT-001-A Implementation
**Last Updated**: 2026-01-25
**Package Version**: 0.2.0
