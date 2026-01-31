# Advanced Agent Patterns

## Two-Agent Pattern for Long-Running Tasks

For complex, multi-session tasks, use a two-agent system:

### Initializer Agent (runs once)

- Sets up project structure and environment
- Creates feature registry tracking completion status
- Establishes progress documentation patterns
- Generates initialization scripts for future sessions

### Executor Agent (runs repeatedly)

- Consumes environment created by initializer
- Works on single features per session
- Updates progress documentation
- Maintains feature registry state

**Use Case**: Large refactoring projects, multi-phase migrations, incremental feature rollouts.

---

## Orchestrator-Worker Architecture

### Lead Agent (higher capability model)

- Analyzes incoming queries
- Decomposes into parallel subtasks
- Spawns specialized worker agents
- Synthesizes results into final output

### Worker Agents (cost-effective models)

- Execute specific, focused tasks
- Return condensed summaries
- Operate with isolated context windows
- Use specialized prompts and tool access

### Scaling Rules

- **Simple queries**: Single agent with 3-10 tool calls
- **Complex research**: 10+ workers with parallel execution
- **State persistence**: Prevent disruption during updates

**Use Case**: Research tasks, multi-file analysis, parallel implementation.

---

## Context Engineering

### Core Principle

Find the smallest possible set of high-signal tokens that maximize likelihood of desired outcome.

### Information Prioritization

- Place critical information at start and end of context
- Use clear section markers (XML tags or Markdown headers)
- Remove redundant or low-signal content
- Summarize when precision not required

### Context Compaction for Long-Running Tasks

- Summarize conversation history automatically
- Reinitiate with compressed context
- Preserve architectural decisions and key findings
- Maintain external memory files outside context window

**Techniques**:
- Just-in-time retrieval over upfront loading
- External memory files for persistent state
- Progressive summarization as context grows
- Selective file loading based on relevance

---

## Tool Design Best Practices

### Consolidation Principle

Consolidate related functions into single tools rather than multiple narrow tools.

**Example**: Instead of separate `read_user`, `update_user`, `delete_user` tools, create one `manage_user` tool with action parameter.

### High-Signal Responses

Return context-aware, high-signal responses that directly address the agent's needs.

**Bad**: `{"status": "success"}`
**Good**: `{"status": "success", "user": {"id": 123, "name": "John"}, "next_actions": ["verify_email", "set_password"]}`

### Clear Parameter Names

Use descriptive parameter names that clearly indicate purpose and expected format.

**Bad**: `user` (ambiguous - ID, name, or object?)
**Good**: `user_id`, `user_name`, `user_object`

### Instructive Error Messages

Provide actionable error messages with examples of correct usage.

**Bad**: `{"error": "Invalid input"}`
**Good**: `{"error": "Invalid user_id format. Expected integer, got string. Example: user_id=123"}`

---

## Performance Optimization Patterns

### Parallel Execution

When multiple independent operations can run simultaneously, use parallel execution:

```python
# Sequential (slow)
result1 = agent.analyze_file("file1.py")
result2 = agent.analyze_file("file2.py")
result3 = agent.analyze_file("file3.py")

# Parallel (fast)
results = await Promise.all([
    agent.analyze_file("file1.py"),
    agent.analyze_file("file2.py"),
    agent.analyze_file("file3.py")
])
```

### Caching Strategy

Cache frequently accessed data within session:

- Documentation references
- Configuration files
- Schema definitions
- Common patterns and templates

### Selective Loading

Load only necessary context for each task:

- Avoid loading entire codebase upfront
- Use targeted file reads based on task requirements
- Defer loading of optional resources until needed

---

## Works Well With

**Related Documentation**:
- [moai-foundation-claude](../../.claude/skills/moai-foundation-claude/SKILL.md) - Complete Claude Code authoring reference
- [CLAUDE.md](/Users/asleep/Developer/tekton/CLAUDE.md) - Core policies and agent invocation patterns

**Skills**:
- moai-foundation-core - Delegation patterns and token optimization
- moai-workflow-project - Project-level orchestration

**Agents**:
- core-planner - Strategic planning and decomposition
- manager-strategy - Complex decision-making workflows

---

**Last Updated**: 2026-01-23
**Status**: Production Ready
**Source**: Extracted from CLAUDE.md for improved maintainability
