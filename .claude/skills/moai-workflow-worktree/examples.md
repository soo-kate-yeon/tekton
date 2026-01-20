# Tekton Worktree Examples

Purpose: Real-world usage examples and patterns for worktree management with SPEC development workflow.

Version: 2.0.0
Last Updated: 2026-01-20

---

## Command Integration Examples

### Example 1: SPEC Development with Worktree

Scenario: Creating a new SPEC with worktree isolation

```bash
# Step 1: Create SPEC using /moai:1-plan (creates SPEC directory)
# This should be run in Claude Code or your workflow tool

# Step 2: Create worktree for the SPEC
tekton worktree new SPEC-AUTH-001 "User Authentication System"

# Output:
# Creating worktree for SPEC-AUTH-001...
#
# ✓ Worktree created successfully
#   Path: /Users/yourname/.worktrees/SPEC-AUTH-001
#   Branch: feature/SPEC-AUTH-001
#   Base: master
#
# To switch to worktree, run:
#   cd /Users/yourname/.worktrees/SPEC-AUTH-001

# Step 3: Switch to worktree
cd ~/.worktrees/SPEC-AUTH-001

# Step 4: Start development (run /moai:2-run in worktree)
# Implement your features here

# Step 5: Sync with base branch before PR
tekton worktree sync SPEC-AUTH-001

# Step 6: Create PR using /moai:3-sync

# Step 7: After PR is merged, clean up
tekton worktree clean --merged-only
```

### Example 2: Parallel SPEC Development

Scenario: Working on multiple SPECs simultaneously

```bash
# Create multiple worktrees for parallel development
tekton worktree new SPEC-AUTH-001 "User Authentication"
tekton worktree new SPEC-PAY-001 "Payment Processing"
tekton worktree new SPEC-DASH-001 "Dashboard Analytics"

# List all worktrees
tekton worktree list

# Output (table format):
# SPEC ID         STATUS   PATH                                        BRANCH
# SPEC-AUTH-001   active   /Users/you/.worktrees/SPEC-AUTH-001        feature/SPEC-AUTH-001
# SPEC-PAY-001    active   /Users/you/.worktrees/SPEC-PAY-001         feature/SPEC-PAY-001
# SPEC-DASH-001   active   /Users/you/.worktrees/SPEC-DASH-001        feature/SPEC-DASH-001

# Switch between worktrees
cd ~/.worktrees/SPEC-AUTH-001
# Work on authentication...

cd ~/.worktrees/SPEC-PAY-001
# Work on payment system...

cd ~/.worktrees/SPEC-DASH-001
# Work on dashboard...

# Check status of a specific worktree
tekton worktree status SPEC-AUTH-001

# Clean up completed worktrees
tekton worktree clean --merged-only
```

### Example 3: Worktree Sync Workflow

Scenario: Keeping worktree in sync with base branch

```bash
# Check current status before sync
tekton worktree status SPEC-AUTH-001

# Output:
# Current status:
#   Ahead: 5 commits
#   Behind: 2 commits
#   Uncommitted changes: 3 files

# Preview what will be synced (dry run)
tekton worktree sync SPEC-AUTH-001 --dry-run

# Output:
# Dry run - no changes made
# Would sync 2 commits from base branch using merge

# Perform actual sync
tekton worktree sync SPEC-AUTH-001

# Output:
# Current status:
#   Ahead: 5 commits
#   Behind: 2 commits
#
# Syncing worktree...
# ✓ Worktree synced successfully
#   Strategy: merge
#   Synced: 2 commits

# Use rebase strategy instead
tekton worktree sync SPEC-AUTH-001 --strategy rebase
```

---

## Configuration Management Examples

### Example 4: Configuring Worktree Settings

```bash
# List all configuration
tekton worktree config list

# Output:
# Configuration:
#   worktree_root: /Users/yourname/.worktrees
#   default_base: master
#   auto_sync: false
#   cleanup_merged: false

# Change worktree root directory
tekton worktree config set worktree_root ~/dev/worktrees

# Enable auto-cleanup of merged branches
tekton worktree config set cleanup_merged true

# Change default base branch
tekton worktree config set default_base develop

# Get specific configuration value
tekton worktree config get worktree_root

# Output:
# worktree_root: /Users/yourname/dev/worktrees
```

---

## Complete SPEC Development Workflow

### Example 5: End-to-End SPEC Workflow

```bash
#!/bin/bash
# spec-workflow.sh - Complete SPEC development workflow

SPEC_ID="$1"
SPEC_DESC="$2"

echo "Starting SPEC development workflow for $SPEC_ID"

# Step 1: Create SPEC specification
# This would typically be done via /moai:1-plan in Claude Code
echo "Step 1: Create SPEC specification"
# (Run /moai:1-plan in your workflow tool)

# Step 2: Create worktree
echo "Step 2: Creating worktree..."
tekton worktree new "$SPEC_ID" "$SPEC_DESC"

# Get worktree path
WORKTREE_PATH=$(tekton worktree switch "$SPEC_ID")

# Step 3: Navigate to worktree
echo "Step 3: Switching to worktree..."
cd "$WORKTREE_PATH"

# Step 4: Development phase
echo "Step 4: Development phase"
# This is where you'd run /moai:2-run for TDD implementation
# Work on your features here

# Step 5: Sync before PR
echo "Step 5: Syncing with base branch..."
cd - # Return to main repo
tekton worktree sync "$SPEC_ID"

# Step 6: Create PR
echo "Step 6: Creating PR"
# This would be done via /moai:3-sync in Claude Code

# Step 7: After merge, cleanup
echo "Step 7: Cleaning up merged worktrees..."
tekton worktree clean --merged-only --force

echo "SPEC workflow completed!"
```

---

## JSON Output Examples

### Example 6: Working with JSON Output

```bash
# List worktrees in JSON format
tekton worktree list --format json

# Output:
# {
#   "worktrees": {
#     "SPEC-AUTH-001": {
#       "spec_id": "SPEC-AUTH-001",
#       "path": "/Users/you/.worktrees/SPEC-AUTH-001",
#       "branch": "feature/SPEC-AUTH-001",
#       "base_branch": "master",
#       "status": "active",
#       "created_at": "2026-01-20T10:30:00Z",
#       "last_sync": null
#     }
#   }
# }

# Get status in JSON format
tekton worktree status SPEC-AUTH-001 --format json

# Output:
# {
#   "spec_id": "SPEC-AUTH-001",
#   "path": "/Users/you/.worktrees/SPEC-AUTH-001",
#   "branch": "feature/SPEC-AUTH-001",
#   "ahead": 5,
#   "behind": 0,
#   "uncommittedChanges": 0,
#   "lastSync": "2026-01-20T11:00:00Z"
# }

# Parse JSON with jq
tekton worktree list --format json | jq '.worktrees | keys[]'

# Output:
# "SPEC-AUTH-001"
# "SPEC-PAY-001"
# "SPEC-DASH-001"
```

---

## Shell Integration Examples

### Example 7: Shell Aliases and Functions

Add to your `.bashrc` or `.zshrc`:

```bash
# Tekton worktree aliases
alias tw='tekton worktree'
alias twl='tekton worktree list'
alias tws='tekton worktree switch'
alias twn='tekton worktree new'
alias twsync='tekton worktree sync'
alias twst='tekton worktree status'
alias twrm='tekton worktree remove'
alias twclean='tekton worktree clean'

# Function to create and switch to worktree
twgo() {
    local spec_id="$1"
    local description="$2"

    if [ -z "$spec_id" ]; then
        echo "Usage: twgo SPEC-ID [description]"
        return 1
    fi

    tekton worktree new "$spec_id" "$description"
    local path=$(tekton worktree switch "$spec_id")
    cd "$path"
}

# Function to sync current worktree
twsynchere() {
    local current_dir=$(basename "$PWD")
    if [[ $current_dir == SPEC-* ]]; then
        tekton worktree sync "$current_dir"
    else
        echo "Not in a worktree directory"
        return 1
    fi
}
```

Usage:

```bash
# Create and switch in one command
twgo SPEC-AUTH-001 "User Authentication"

# Sync from within worktree
cd ~/.worktrees/SPEC-AUTH-001
twsynchere
```

---

## Troubleshooting Examples

### Example 8: Common Issues and Solutions

```bash
# Problem 1: Worktree creation fails
echo "Diagnosing worktree creation issues..."

# Check if you're in a Git repository
git status

# Check if SPEC ID is valid (format: SPEC-XXX-001)
tekton worktree new SPEC-001 "Test"  # Invalid format
tekton worktree new SPEC-ABC-001 "Test"  # Valid format

# Problem 2: Sync conflicts
echo "Resolving sync conflicts..."

# Check sync status
tekton worktree status SPEC-CONFLICT-001

# Try dry run first
tekton worktree sync SPEC-CONFLICT-001 --dry-run

# If conflicts occur during sync:
# 1. The command will fail with error message
# 2. Navigate to worktree
cd ~/.worktrees/SPEC-CONFLICT-001

# 3. Resolve conflicts manually
git status
# Edit conflicted files
git add .
git commit -m "Resolve merge conflicts"

# 4. Try sync again
cd -
tekton worktree sync SPEC-CONFLICT-001

# Problem 3: Remove worktree with uncommitted changes
echo "Handling uncommitted changes..."

# Check status first
tekton worktree status SPEC-OLD-001

# If uncommitted changes exist:
# Option 1: Commit them
cd ~/.worktrees/SPEC-OLD-001
git add .
git commit -m "Final changes"

# Option 2: Force remove (loses changes)
cd -
tekton worktree remove SPEC-OLD-001 --force
```

---

## Best Practices

### Example 9: Recommended Workflow Patterns

```bash
# Pattern 1: Always check status before sync
tekton worktree status SPEC-001
tekton worktree sync SPEC-001 --dry-run
tekton worktree sync SPEC-001

# Pattern 2: Regular cleanup of merged worktrees
# Run this weekly or after each PR merge
tekton worktree clean --merged-only

# Pattern 3: List worktrees to see what's in progress
tekton worktree list --status active

# Pattern 4: Use descriptive names for worktrees
tekton worktree new SPEC-AUTH-001 "JWT Authentication with Refresh Tokens"

# Pattern 5: Keep base branch up to date
cd /path/to/main/repo
git pull origin master
cd ~/.worktrees/SPEC-001
tekton worktree sync SPEC-001
```

---

Version: 2.0.0
Last Updated: 2026-01-20
Examples: Real-world usage patterns for tekton worktree commands
