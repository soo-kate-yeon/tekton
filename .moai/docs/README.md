# MoAI-ADK Documentation

Comprehensive documentation for MoAI-ADK's development workflows and best practices.

## Overview

This documentation directory contains extracted, focused guides that were previously embedded in the main CLAUDE.md file. The restructuring improves maintainability and makes content easier to find and update.

## Directory Structure

```
.moai/docs/
├── advanced/           # Advanced features and patterns
│   ├── agent-patterns.md
│   ├── plugin-integration.md
│   ├── sandboxing.md
│   └── headless-mode.md
├── workflows/          # Development workflows
│   ├── git-worktree.md
│   └── strategic-thinking.md
├── development/        # Development processes
│   └── version-management.md
├── guidelines/         # Best practices and policies
│   └── web-search.md
└── README.md          # This file
```

## Documentation Catalog

### Advanced Topics

#### [Advanced Agent Patterns](advanced/agent-patterns.md)
Complex agent orchestration patterns for sophisticated workflows.

**Key Topics**:
- Two-Agent Pattern for long-running tasks
- Orchestrator-Worker Architecture for parallel execution
- Context Engineering for token optimization
- Tool design best practices
- Performance optimization patterns

**When to Use**: Multi-session projects, parallel execution, context-heavy workflows.

---

#### [Plugin Integration](advanced/plugin-integration.md)
Complete guide to Claude Code plugin development and management.

**Key Topics**:
- Plugin vs standalone configuration
- Plugin management commands
- Plugin structure and manifest
- Development and publishing workflow
- Best practices and security

**When to Use**: Creating reusable tools, sharing team standards, marketplace distribution.

---

#### [Sandboxing](advanced/sandboxing.md)
OS-level security isolation for code execution.

**Key Topics**:
- File system and network restrictions
- Auto-allow mode configuration
- Security best practices
- Defense-in-depth with IAM
- Configuration and troubleshooting

**When to Use**: Security-sensitive environments, production deployments, untrusted code execution.

---

#### [Headless Mode](advanced/headless-mode.md)
Programmatic and CI/CD integration patterns.

**Key Topics**:
- Non-interactive execution modes
- Structured output formats
- Tool approval automation
- JSON schema validation
- CI/CD pipeline integration

**When to Use**: Automation scripts, GitHub Actions, GitLab CI, Jenkins pipelines.

---

### Workflows

#### [Git Worktree Management](workflows/git-worktree.md)
Comprehensive guide to parallel SPEC development using git worktrees.

**Key Topics**:
- Worktree lifecycle (creation, development, cleanup)
- Conflict prevention strategies
- Conflict resolution protocol
- Real-world case studies
- Commands reference and troubleshooting

**When to Use**: Parallel SPEC development, long-running features, multi-version maintenance.

---

#### [Strategic Thinking Framework](workflows/strategic-thinking.md)
Five-phase decision-making framework for complex technical choices.

**Key Topics**:
- Assumption audit process
- First principles decomposition
- Alternative generation techniques
- Trade-off analysis methodology
- Cognitive bias checking

**When to Use**: Architecture decisions, technology selection, performance trade-offs.

---

### Development

#### [Version Management](development/version-management.md)
Single source of truth approach to version control.

**Key Topics**:
- pyproject.toml as authoritative source
- Automated version sync process
- Files requiring synchronization
- Release workflow
- CI/CD validation

**When to Use**: Creating releases, updating versions, maintaining consistency.

---

### Guidelines

#### [Web Search](guidelines/web-search.md)
Anti-hallucination protocol for web research.

**Key Topics**:
- URL verification mandate
- Three-phase verification process
- Source credibility assessment
- Quality evaluation criteria
- Error handling workflows

**When to Use**: Researching documentation, verifying claims, citing sources.

---

## Quick Navigation

**By Role**:
- **Developers**: git-worktree.md, version-management.md, advanced/headless-mode.md
- **Architects**: workflows/strategic-thinking.md, advanced/agent-patterns.md
- **DevOps**: advanced/headless-mode.md, advanced/sandboxing.md
- **Documentation Writers**: guidelines/web-search.md

**By Task**:
- **Parallel Development**: workflows/git-worktree.md
- **CI/CD Integration**: advanced/headless-mode.md
- **Security Setup**: advanced/sandboxing.md
- **Plugin Development**: advanced/plugin-integration.md
- **Making Decisions**: workflows/strategic-thinking.md
- **Research**: guidelines/web-search.md

**By Complexity**:
- **Beginner**: guidelines/web-search.md, development/version-management.md
- **Intermediate**: workflows/git-worktree.md, advanced/plugin-integration.md
- **Advanced**: advanced/agent-patterns.md, advanced/headless-mode.md

---

## Integration with CLAUDE.md

The main [CLAUDE.md](../../CLAUDE.md) file now contains:
- Core policies and principles (always in main file)
- Brief summaries of each topic
- Direct links to detailed guides in this directory

**Benefits**:
- **Faster Navigation**: Find relevant content quickly
- **Better Maintainability**: Update focused files independently
- **Reduced Token Usage**: Load only needed documentation
- **Clearer Structure**: Separation of concerns

---

## Contributing

When adding new documentation:

1. **Determine Category**: Decide if content belongs in advanced/, workflows/, development/, or guidelines/
2. **Create Focused File**: Keep files focused on single topic (500-1000 lines ideal)
3. **Update CLAUDE.md**: Add brief summary with link in appropriate section
4. **Update This README**: Add entry to catalog with key topics and use cases
5. **Cross-Reference**: Link to related documentation where appropriate

---

## Statistics

**Before Restructuring**:
- CLAUDE.md: 1,465 lines (hard to navigate)
- All content in single file
- Token-heavy loading

**After Restructuring**:
- CLAUDE.md: 505 lines (65% reduction)
- 8 focused documentation files
- Average file size: 600 lines
- Total documentation: ~5,000 lines (more comprehensive)
- Improved maintainability and discoverability

---

**Last Updated**: 2026-01-23
**Version**: 1.0.0
**Maintained by**: MoAI-ADK Team
