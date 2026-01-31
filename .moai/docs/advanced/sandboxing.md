# Sandboxing Guidelines

## OS-Level Security Isolation

Claude Code provides OS-level sandboxing to restrict file system and network access during code execution.

**Linux**: Uses bubblewrap (`bwrap`) for namespace-based isolation

**macOS**: Uses Seatbelt (`sandbox-exec`) for profile-based restrictions

**Purpose**: Prevent unauthorized access to system resources and sensitive data during code execution.

---

## Default Sandbox Behavior

When sandboxing is enabled:

**File System Restrictions**:
- File writes are restricted to the current working directory
- Read access limited to allowed paths
- System directories are protected from modification

**Network Restrictions**:
- Network access is limited to allowed domains
- Outbound connections require explicit allowlisting
- Inbound connections are blocked by default

**System Resource Protection**:
- System resources are protected from modification
- Process isolation prevents interference with other processes
- Resource limits prevent denial-of-service conditions

---

## Auto-Allow Mode

If a command only reads from allowed paths, writes to allowed paths, and accesses allowed network domains, it executes automatically without user confirmation.

**Auto-Allowed Operations**:
- Reading files in current working directory
- Writing files to current working directory
- Network requests to allowlisted domains
- Safe system commands (ls, cat, grep, etc.)

**Requires Confirmation**:
- Writing outside current directory
- Network requests to non-allowlisted domains
- System modifications (installing packages, changing settings)
- Executing potentially dangerous commands

---

## Security Best Practices

### Start Restrictive

Begin with minimal permissions, monitor for violations, add specific allowances as needed.

**Initial Setup**:
1. Enable sandbox with default restrictive settings
2. Monitor operation logs for denied operations
3. Add specific allowances for legitimate operations
4. Document allowances and justification

### Combine with IAM

Sandbox provides OS-level isolation, IAM provides Claude-level permissions. Together they create defense-in-depth.

**Defense Layers**:
- **IAM Layer**: Controls which agents can use which tools
- **Sandbox Layer**: Controls which operations can access which resources
- **Combined**: Both must approve for operation to execute

**Example Configuration**:
```json
{
  "iam": {
    "agents": {
      "read-only-agent": {
        "tools": ["Read", "Grep", "Glob"]
      }
    }
  },
  "sandbox": {
    "allowedPaths": {
      "read": ["/project/**"],
      "write": ["/project/generated/**"]
    },
    "allowedDomains": [
      "*.example.com",
      "api.openai.com"
    ]
  }
}
```

---

## Configuration

### File System Configuration

**Allow Read Access**:
```json
{
  "sandbox": {
    "allowedPaths": {
      "read": [
        "/project/**",
        "/home/user/.config/**",
        "/usr/share/docs/**"
      ]
    }
  }
}
```

**Allow Write Access**:
```json
{
  "sandbox": {
    "allowedPaths": {
      "write": [
        "/project/output/**",
        "/project/logs/**",
        "/tmp/claude-work/**"
      ]
    }
  }
}
```

### Network Configuration

**Allow Domain Access**:
```json
{
  "sandbox": {
    "allowedDomains": [
      "*.github.com",
      "api.openai.com",
      "pypi.org",
      "npmjs.com"
    ]
  }
}
```

**Block Specific Domains**:
```json
{
  "sandbox": {
    "blockedDomains": [
      "*.tracker.com",
      "analytics.example.com"
    ]
  }
}
```

---

## Dangerous Operations Override

For trusted operations that need to bypass sandbox, use the `dangerouslyDisableSandbox` parameter.

**Use Sparingly**: Only for well-understood, necessary operations.

**Example**:
```bash
claude --dangerouslyDisableSandbox -p "Install system dependencies"
```

**Warning**: This bypasses all sandbox protections and should only be used when absolutely necessary and after careful review.

---

## Monitoring and Auditing

### Operation Logs

All sandbox violations are logged for security auditing.

**Log Location**: Check Claude Code logs for denied operations.

**Log Format**:
```
[SANDBOX] Denied write operation: /etc/hosts (outside allowed paths)
[SANDBOX] Denied network access: suspicious-site.com (not in allowlist)
[SANDBOX] Allowed operation: Read /project/src/main.py
```

### Violation Analysis

Regularly review sandbox violations to identify:
- Legitimate operations that need allowlisting
- Potential security issues or malicious behavior
- Misconfigurations in allowlists

### Audit Reports

Generate periodic audit reports showing:
- Frequency of sandbox violations by operation type
- Domains and paths frequently denied
- Agents triggering most violations
- Trends over time

---

## Troubleshooting

### Operation Denied Unexpectedly

**Symptom**: Legitimate operation is blocked by sandbox.

**Solution**:
1. Check sandbox logs for specific denial reason
2. Add specific allowance to configuration
3. Restart Claude Code to apply changes
4. Verify operation succeeds

### Performance Impact

**Symptom**: Operations slower with sandbox enabled.

**Cause**: Sandbox overhead for permission checks.

**Mitigation**:
- Use auto-allow mode for trusted operations
- Pre-allowlist frequently accessed resources
- Consider disabling sandbox for development environments (with caution)

### Conflicts with Dev Containers

**Symptom**: Sandbox conflicts with dev container restrictions.

**Solution**:
- Configure dev container to work with sandbox
- Use consistent path mappings
- Align allowlists between sandbox and container

---

## Works Well With

**Documentation**:
- [moai-foundation-claude](../../.claude/skills/moai-foundation-claude/reference/claude-code-sandboxing-official.md) - Complete sandboxing reference
- [IAM & Permissions Guide](../../.claude/skills/moai-foundation-claude/reference/claude-code-iam-official.md) - Access control integration
- [Dev Containers Guide](../../.claude/skills/moai-foundation-claude/reference/claude-code-devcontainers-official.md) - Container security

**Related Topics**:
- Security best practices
- Tool access restrictions
- Agent permission management

---

**Last Updated**: 2026-01-23
**Status**: Production Ready
**Source**: Extracted from CLAUDE.md for improved maintainability
