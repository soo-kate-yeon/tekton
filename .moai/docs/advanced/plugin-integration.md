# Plugin Integration Guide

## What are Plugins

Plugins are reusable extensions that bundle Claude Code configurations for distribution across projects. Unlike standalone configurations in `.claude/` directories, plugins can be installed via marketplaces and version-controlled independently.

**Key Benefits**:
- Reusable across multiple projects
- Version-controlled independently
- Installable via marketplaces or git URLs
- Share team standards and workflows
- Community-driven ecosystem

---

## Plugin vs Standalone Configuration

### Standalone Configuration

**Scope**: Single project only

**Sharing**: Manual copy or git submodules

**Location**: `.claude/` directory in project root

**Best for**:
- Project-specific customizations
- Experimental features
- One-off workflows
- Proprietary internal tools

### Plugin Configuration

**Scope**: Reusable across multiple projects

**Sharing**: Installable via marketplaces or git URLs

**Location**: Installed to user or project plugin directory

**Best for**:
- Team standards and conventions
- Reusable workflows and patterns
- Community tools and integrations
- Cross-project consistency

---

## Plugin Management Commands

### Installation

**From Marketplace**:
```bash
/plugin install plugin-name
```

**From GitHub**:
```bash
/plugin install owner/repo
```

**With Scope**:
```bash
/plugin install plugin-name --scope project  # Project-level
/plugin install plugin-name --scope user     # User-level (default)
```

### Other Commands

**Uninstall Plugin**:
```bash
/plugin uninstall plugin-name
```

**Enable/Disable Plugin**:
```bash
/plugin enable plugin-name
/plugin disable plugin-name
```

**Update Plugin**:
```bash
/plugin update plugin-name
/plugin update --all  # Update all plugins
```

**List Installed Plugins**:
```bash
/plugin list
/plugin list --scope project  # Project plugins only
/plugin list --scope user     # User plugins only
```

**Validate Plugin**:
```bash
/plugin validate plugin-name
/plugin validate .  # Validate current directory as plugin
```

---

## Plugin Structure

### Basic Directory Layout

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest
├── commands/                 # Slash commands
│   └── my-command.md
├── agents/                   # Sub-agents
│   └── my-agent.md
├── skills/                   # Skills
│   └── my-skill/
│       └── SKILL.md
├── hooks/                    # Event hooks
│   └── hooks.json
├── .mcp.json                # MCP server config (optional)
└── README.md                # Plugin documentation
```

### Plugin Manifest (plugin.json)

```json
{
  "name": "my-plugin",
  "description": "Plugin description",
  "version": "1.0.0",
  "author": {
    "name": "Author Name",
    "email": "author@example.com"
  },
  "license": "MIT",
  "repository": "https://github.com/owner/repo",
  "keywords": ["documentation", "workflow", "automation"],
  "dependencies": {
    "another-plugin": "^2.0.0"
  }
}
```

---

## Plugin Development

### Creating a Plugin

1. **Initialize Plugin Structure**:
   ```bash
   mkdir my-plugin
   cd my-plugin
   mkdir -p .claude-plugin commands agents skills hooks
   ```

2. **Create Plugin Manifest**:
   Create `.claude-plugin/plugin.json` with required metadata.

3. **Add Components**:
   - Commands in `commands/`
   - Agents in `agents/`
   - Skills in `skills/`
   - Hooks in `hooks/hooks.json`

4. **Validate Plugin**:
   ```bash
   /plugin validate .
   ```

5. **Test Locally**:
   ```bash
   /plugin install . --scope project
   ```

### Publishing to Marketplace

1. **Prepare Repository**:
   - Create GitHub repository
   - Add comprehensive README.md
   - Include examples and documentation
   - Tag release version

2. **Submit to Marketplace**:
   Follow Claude Code marketplace submission guidelines.

3. **Versioning**:
   Use semantic versioning (MAJOR.MINOR.PATCH).

---

## Plugin Best Practices

### Design Principles

**Single Responsibility**: Each plugin should solve one specific problem well.

**Clear Documentation**: Include comprehensive README with examples and use cases.

**Version Compatibility**: Test with multiple Claude Code versions.

**Minimal Dependencies**: Keep plugin dependencies minimal and well-justified.

### Security Considerations

**Validate Inputs**: All plugin components should validate user inputs.

**Least Privilege**: Request only necessary tool permissions.

**Transparent Behavior**: Clearly document what plugin does and requires.

**Safe Defaults**: Use conservative defaults that prioritize safety.

### Performance Guidelines

**Lazy Loading**: Load resources only when needed.

**Efficient Caching**: Cache frequently accessed data appropriately.

**Token Optimization**: Minimize token usage in skills and prompts.

**Graceful Degradation**: Handle failures gracefully without breaking workflows.

---

## Example Plugins

### Documentation Plugin

**Purpose**: Auto-generate and validate project documentation.

**Components**:
- Command: `/docs:generate` - Generate documentation from source
- Agent: `docs-validator` - Validate documentation completeness
- Skill: `moai-docs-generation` - Documentation patterns
- Hook: `PreCommit` - Validate docs before commit

### Security Audit Plugin

**Purpose**: Automated security scanning and reporting.

**Components**:
- Command: `/security:audit` - Run security audit
- Agent: `security-scanner` - Scan codebase for vulnerabilities
- Skill: `moai-security-patterns` - Security best practices
- Hook: `PreToolUse` - Block dangerous operations

---

## Troubleshooting

### Plugin Not Loading

**Check installation**:
```bash
/plugin list
```

**Verify manifest**:
```bash
/plugin validate plugin-name
```

**Check logs**: Review Claude Code logs for errors.

### Conflicts with Other Plugins

**Identify conflicts**:
```bash
/plugin list --conflicts
```

**Disable conflicting plugin**:
```bash
/plugin disable conflicting-plugin
```

### Update Issues

**Clear plugin cache**:
```bash
/plugin update --clear-cache
```

**Reinstall plugin**:
```bash
/plugin uninstall plugin-name
/plugin install plugin-name
```

---

## Works Well With

**Documentation**:
- [moai-foundation-claude](../../.claude/skills/moai-foundation-claude/reference/claude-code-plugins-official.md) - Complete plugin development guide
- [CLAUDE.md](/Users/asleep/Developer/tekton/CLAUDE.md) - Core policies and integration patterns

**Related Topics**:
- [Slash Commands Guide](../../.claude/skills/moai-foundation-claude/reference/claude-code-custom-slash-commands-official.md)
- [Sub-agents Guide](../../.claude/skills/moai-foundation-claude/reference/claude-code-sub-agents-official.md)
- [Skills Guide](../../.claude/skills/moai-foundation-claude/reference/claude-code-skills-official.md)

---

**Last Updated**: 2026-01-23
**Status**: Production Ready
**Source**: Extracted from CLAUDE.md for improved maintainability
