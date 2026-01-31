# Headless Mode for CI/CD

## Overview

Headless mode enables programmatic and non-interactive usage of Claude Code, ideal for CI/CD pipelines, automation scripts, and batch processing.

**Key Benefits**:
- Non-interactive execution for automation
- Structured output for programmatic parsing
- Tool approval automation for trusted operations
- Session management for multi-step workflows

---

## Basic Usage

### Simple Prompt

Run Claude with a single prompt and exit after completion:

```bash
claude -p "Your prompt here"
```

**Example**:
```bash
claude -p "Analyze the codebase and generate a test coverage report"
```

### Continue Previous Conversation

Continue the most recent conversation:

```bash
claude -c "Follow-up question"
```

**Example**:
```bash
# First run
claude -p "Review the authentication module"

# Follow-up
claude -c "Now check for security vulnerabilities"
```

### Resume Specific Session

Resume a specific session by ID:

```bash
claude -r session_id "Continue this task"
```

**Example**:
```bash
# Initial session creates session_abc123
claude -p "Start refactoring user service"

# Later, resume
claude -r session_abc123 "Continue with the API endpoints"
```

---

## Output Formats

### Text Format (Default)

Human-readable text output:

```bash
claude -p "Generate API documentation"
# Outputs formatted text
```

### JSON Format

Structured JSON output for programmatic parsing:

```bash
claude -p "Analyze code quality" --output-format json
```

**Output Structure**:
```json
{
  "result": "Analysis complete",
  "data": {
    "quality_score": 85,
    "issues": [
      {"type": "complexity", "file": "main.py", "line": 42}
    ]
  },
  "session_id": "abc123"
}
```

### Stream JSON Format

Line-delimited JSON for streaming processing:

```bash
claude -p "Process large dataset" --output-format stream-json
```

**Output**:
```json
{"event": "start", "timestamp": "2026-01-23T10:00:00Z"}
{"event": "progress", "percent": 25, "message": "Processing batch 1"}
{"event": "progress", "percent": 50, "message": "Processing batch 2"}
{"event": "complete", "result": "Success"}
```

---

## Tool Management

### Allow Specific Tools

Auto-approve specified tools without user confirmation:

```bash
claude -p "Build the project" --allowedTools "Bash,Read,Write"
```

**Common Tool Sets**:
- **Read-only**: `Read,Grep,Glob`
- **Analysis**: `Read,Grep,Glob,Bash(git:*)`
- **Build**: `Bash,Read,Write,Edit`
- **Full access**: `Bash,Read,Write,Edit,Glob,Grep`

### Tool Pattern Matching

Allow only specific patterns within tools:

```bash
# Allow only git commands
claude -p "Check git status" --allowedTools "Bash(git:*)"

# Allow specific npm commands
claude -p "Install dependencies" --allowedTools "Bash(npm:install,npm:ci)"

# Allow read from specific paths
claude -p "Analyze source" --allowedTools "Read(/project/src/**)"
```

**Pattern Syntax**:
- `Bash(git:*)` - Allow all git commands
- `Bash(npm:install,npm:ci)` - Allow specific npm commands
- `Read(/path/to/dir/**)` - Allow reading from directory recursively
- `Write(/output/**)` - Allow writing to output directory

---

## Structured Output with JSON Schema

Validate output against provided JSON schema for reliable data extraction in automated pipelines.

### Define Schema

```json
{
  "type": "object",
  "properties": {
    "summary": {"type": "string"},
    "issues_found": {"type": "number"},
    "critical_issues": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "file": {"type": "string"},
          "line": {"type": "number"},
          "description": {"type": "string"}
        },
        "required": ["file", "line", "description"]
      }
    }
  },
  "required": ["summary", "issues_found"]
}
```

### Use Schema

```bash
claude -p "Analyze code quality" \
  --json-schema schema.json \
  --output-format json
```

**Output** (validated against schema):
```json
{
  "summary": "Code quality analysis complete",
  "issues_found": 3,
  "critical_issues": [
    {
      "file": "auth.py",
      "line": 42,
      "description": "SQL injection vulnerability"
    }
  ]
}
```

---

## Best Practices for CI/CD

### Use --append-system-prompt to Retain Claude Code Capabilities

Preserve Claude Code's built-in capabilities when adding custom instructions:

```bash
claude -p "Custom task" --append-system-prompt
```

**Why**: Without this flag, custom prompts replace system prompt, losing agent delegation and skill access.

### Always Specify --allowedTools in CI/CD

Prevent unintended actions by explicitly allowing only necessary tools:

```bash
# Good: Explicit tool allowlist
claude -p "Run tests" --allowedTools "Bash(npm:test),Read"

# Bad: No tool restrictions (dangerous in CI/CD)
claude -p "Run tests"
```

**Why**: Prevents accidental destructive operations (git push, rm -rf, etc.).

### Use --output-format json for Reliable Parsing

Enable programmatic parsing of results:

```bash
result=$(claude -p "Analyze code" --output-format json)
issues=$(echo "$result" | jq '.data.issues | length')

if [ "$issues" -gt 0 ]; then
  echo "Found $issues issues"
  exit 1
fi
```

**Why**: Structured output is easier to parse than free-form text.

### Handle Errors with Exit Code Checks

Check exit codes to detect failures:

```bash
if ! claude -p "Run quality checks" --allowedTools "Bash,Read"; then
  echo "Quality checks failed"
  exit 1
fi
```

**Exit Codes**:
- `0` - Success
- `1` - General error
- `2` - Invalid arguments
- `3` - Tool execution error

---

## CI/CD Integration Examples

### GitHub Actions

```yaml
name: Code Quality Check

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Run Quality Analysis
        run: |
          claude -p "Analyze code quality and generate report" \
            --allowedTools "Read,Grep,Bash(npm:test)" \
            --output-format json \
            --append-system-prompt > quality-report.json

      - name: Check Results
        run: |
          issues=$(jq '.data.issues | length' quality-report.json)
          if [ "$issues" -gt 0 ]; then
            echo "Found $issues quality issues"
            exit 1
          fi
```

### GitLab CI

```yaml
code_quality:
  stage: test
  script:
    - npm install -g @anthropic-ai/claude-code
    - |
      claude -p "Run comprehensive code analysis" \
        --allowedTools "Read,Grep,Bash(npm:*)" \
        --output-format json > analysis.json
    - jq '.data.quality_score' analysis.json
  artifacts:
    reports:
      codequality: analysis.json
```

### Jenkins Pipeline

```groovy
pipeline {
  agent any

  stages {
    stage('Quality Check') {
      steps {
        sh '''
          claude -p "Analyze codebase for issues" \
            --allowedTools "Read,Grep" \
            --output-format json > quality.json

          issues=$(jq '.data.issues | length' quality.json)
          if [ "$issues" -gt 10 ]; then
            exit 1
          fi
        '''
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'quality.json'
    }
  }
}
```

---

## Advanced Patterns

### Multi-Step Workflows

Chain multiple Claude Code invocations:

```bash
#!/bin/bash
set -e

# Step 1: Analyze
session=$(claude -p "Analyze codebase structure" \
  --allowedTools "Read,Grep,Glob" \
  --output-format json | jq -r '.session_id')

# Step 2: Generate recommendations (continue session)
claude -r "$session" "Based on analysis, generate refactoring recommendations" \
  --allowedTools "Read,Write" \
  --output-format json > recommendations.json

# Step 3: Apply changes (continue session)
claude -r "$session" "Apply top 3 recommendations" \
  --allowedTools "Read,Write,Edit,Bash(git:*)" \
  --output-format json
```

### Conditional Execution

Execute different actions based on results:

```bash
result=$(claude -p "Check code coverage" \
  --allowedTools "Bash(npm:test),Read" \
  --output-format json)

coverage=$(echo "$result" | jq '.data.coverage')

if (( $(echo "$coverage < 80" | bc -l) )); then
  claude -p "Generate additional tests to reach 80% coverage" \
    --allowedTools "Read,Write" \
    --output-format json
fi
```

### Parallel Execution

Run multiple analyses in parallel:

```bash
claude -p "Analyze security vulnerabilities" \
  --allowedTools "Read,Grep" \
  --output-format json > security.json &

claude -p "Analyze performance bottlenecks" \
  --allowedTools "Read,Grep,Bash(npm:test)" \
  --output-format json > performance.json &

claude -p "Analyze code complexity" \
  --allowedTools "Read,Grep" \
  --output-format json > complexity.json &

wait

# Combine results
jq -s 'reduce .[] as $item ({}; . * $item)' \
  security.json performance.json complexity.json > combined-report.json
```

---

## Troubleshooting

### Command Hangs in CI/CD

**Symptom**: Claude Code command doesn't complete in CI/CD.

**Causes**:
- Waiting for user input (tool approval)
- Network timeout
- Insufficient resources

**Solutions**:
- Always use `--allowedTools` to prevent approval prompts
- Set timeout using CI/CD platform's timeout configuration
- Increase resource allocation if needed

### Unexpected Tool Denials

**Symptom**: Operations fail with "tool not allowed" errors.

**Solution**: Expand `--allowedTools` to include necessary tools:

```bash
# Add specific tools needed
claude -p "Build project" --allowedTools "Bash(npm:*),Read,Write,Edit"
```

### JSON Parsing Errors

**Symptom**: Cannot parse JSON output.

**Causes**:
- Mixed text and JSON output
- Malformed JSON

**Solutions**:
- Use `--output-format json` explicitly
- Validate JSON with `jq` before parsing
- Use `--json-schema` to enforce structure

---

## Works Well With

**Documentation**:
- [CLI Reference](../../.claude/skills/moai-foundation-claude/reference/claude-code-cli-reference-official.md) - Complete CLI documentation
- [Sandboxing Guide](sandboxing.md) - Security in headless mode
- [IAM Guide](../../.claude/skills/moai-foundation-claude/reference/claude-code-iam-official.md) - Tool permission management

**Related Topics**:
- CI/CD integration patterns
- Automation best practices
- Tool access control

---

**Last Updated**: 2026-01-23
**Status**: Production Ready
**Source**: Extracted from CLAUDE.md for improved maintainability
