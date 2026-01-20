# Worktree Commands Module

Purpose: Complete CLI command reference for Git worktree management with detailed usage examples and advanced options.

Version: 2.0.0
Last Updated: 2026-01-06

---

## Quick Reference (30 seconds)

Command Categories:
- Creation: new - Create isolated worktree
- Navigation: list, switch, go - Browse and navigate
- Management: sync, remove, clean - Maintain worktrees
- Status: status - Check worktree state
- Configuration: config - Manage settings

Quick Start:
1. Create worktree: tekton worktree new SPEC-001 "User Authentication"
2. Switch to worktree: cd ~/.worktrees/SPEC-001 (or path shown in output)
3. List worktrees: tekton worktree list

---

## Creation Commands

### tekton worktree new - Create Worktree

Create a new isolated Git worktree for SPEC development.

Syntax: tekton worktree new <spec-id> [description] [options]

Arguments:
- spec-id: SPEC identifier (e.g., SPEC-001, SPEC-AUTH-001)
- description: Optional description for the worktree

Options:
- --base <branch>: Base branch for new worktree (default: master)
- --no-switch: Do not display switch instructions

Examples:
- Basic creation: tekton worktree new SPEC-001 "User Auth System"
- From develop: tekton worktree new SPEC-003 "API Refactor" --base develop

Auto-Generated Branch Pattern:
- Format: feature/SPEC-{ID}
- Example: SPEC-001 becomes feature/SPEC-001

---

## Navigation Commands

### tekton worktree list - List Worktrees

Display all registered worktrees with their status and metadata.

Syntax: tekton worktree list [options]

Options:
- --format <format>: Output format (table or json)
- --status <status>: Filter by status (active, merged, or stale)

Examples:
- Table format: tekton worktree list
- JSON output: tekton worktree list --format json
- Active only: tekton worktree list --status active

### tekton worktree switch - Switch to Worktree

Display the path to switch to the specified worktree.

Syntax: tekton worktree switch <spec-id>

Note: This command outputs the worktree path. Use cd to navigate:
- cd $(tekton worktree switch SPEC-001)

Examples:
- Get worktree path: tekton worktree switch SPEC-001
- Navigate to worktree: cd $(tekton worktree switch SPEC-001)

---

## Management Commands

### tekton worktree sync - Synchronize Worktree

Synchronize worktree with its base branch.

Syntax: tekton worktree sync <spec-id> [options]

Arguments:
- spec-id: Worktree identifier

Options:
- --strategy <merge|rebase>: Sync strategy (default: merge)
- --dry-run: Show what would be synced without doing it

Examples:
- Sync with merge: tekton worktree sync SPEC-001
- Sync with rebase: tekton worktree sync SPEC-001 --strategy rebase
- Preview: tekton worktree sync SPEC-001 --dry-run

Conflict Resolution:
When conflicts are detected, the command will fail and provide guidance for manual resolution. Resolve conflicts in the worktree, commit, and run sync again.

### tekton worktree remove - Remove Worktree

Remove a worktree and clean up its registration.

Syntax: tekton worktree remove <spec-id> [options]

Options:
- --force: Force removal without confirmation
- --keep-branch: Keep the branch after removing worktree

Examples:
- Interactive: tekton worktree remove SPEC-001
- Force: tekton worktree remove SPEC-001 --force
- Keep branch: tekton worktree remove SPEC-001 --keep-branch

### tekton worktree clean - Clean Up Worktrees

Remove worktrees for merged branches.

Syntax: tekton worktree clean [options]

Options:
- --merged-only: Only remove worktrees with merged branches (default behavior)
- --force: Skip confirmation prompts

Examples:
- Clean merged: tekton worktree clean --merged-only
- Force clean: tekton worktree clean --force

---

## Status and Configuration

### tekton worktree status - Show Worktree Status

Display detailed status information about worktrees.

Syntax: tekton worktree status <spec-id> [options]

Arguments:
- spec-id: Specific worktree to check status

Options:
- --format <format>: Output format (table or json)

Examples:
- Check status: tekton worktree status SPEC-001
- JSON output: tekton worktree status SPEC-001 --format json

Status Output Includes:
- Worktree path and branch
- Commits ahead/behind base
- Modified and untracked files
- Last sync time

### tekton worktree config - Configuration Management

Manage worktree configuration settings.

Syntax: tekton worktree config <action> [key] [value]

Actions:
- get <key>: Get configuration value
- set <key> <value>: Set configuration value
- list: List all configuration

Configuration Keys:
- worktree_root: Root directory for worktrees
- auto_sync: Enable automatic sync (true/false)
- cleanup_merged: Auto-cleanup merged worktrees (true/false)
- default_base: Default base branch (master/develop)

Examples:
- List all: tekton worktree config list
- Get value: tekton worktree config get worktree_root
- Set value: tekton worktree config set auto_sync true

---

## Advanced Usage

### Batch Operations

Clean all merged worktrees:
- tekton worktree clean --merged-only --force

### Shell Aliases

Recommended aliases for .bashrc or .zshrc:
```bash
alias tw='tekton worktree'
alias twl='tekton worktree list'
alias tws='tekton worktree switch'
alias twn='tekton worktree new'
alias twsync='tekton worktree sync'
alias twclean='tekton worktree clean'
```

### Git Hooks Integration

Git hooks can be used to enhance worktree workflows:

Post-checkout hook actions:
- Detect worktree environment
- Update last access time in registry
- Check if sync needed with base branch

Pre-push hook actions:
- Detect if pushing from worktree
- Check for uncommitted changes
- Verify sync status with base

---

Version: 2.0.0
Last Updated: 2026-01-06
Module: Complete CLI command reference with usage examples
