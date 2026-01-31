# Git Worktree Management for Parallel Development

## Overview

Git worktrees enable parallel development of multiple SPECs by creating isolated working directories that share the same repository. This allows simultaneous work on different features without context switching between branches.

## Worktree Configuration

Configuration is managed in `.moai/config/sections/worktree.yaml`:

```yaml
worktree:
  auto_sync: false                          # Auto-sync with base branch
  cleanup_merged: true                      # Auto-cleanup after merge
  worktree_root: ~/worktrees/{PROJECT_NAME}/  # Worktree location
  default_base: master                      # Base branch
  sync_strategy: merge                      # merge or rebase
  max_worktrees: 10                        # Maximum worktrees
  stale_threshold_days: 30                 # Stale detection
```

## Worktree Lifecycle

### 1. Creation

**Best Practice**: Always create from latest master

```bash
# Step 1: Update master
git checkout master
git pull origin master

# Step 2: Create worktree from latest master
git worktree add ~/worktrees/tekton/SPEC-NEW -b feature/SPEC-NEW

# Step 3: Verify
cd ~/worktrees/tekton/SPEC-NEW
git branch --show-current  # Should show: feature/SPEC-NEW
```

**Why**: Creating from stale master causes merge conflicts later.

### 2. Development

**Daily Sync Protocol** (Prevents Conflicts):

```bash
cd ~/worktrees/tekton/SPEC-YOUR-FEATURE

# Every day or after other PRs merge
git fetch origin
git merge origin/master

# If conflicts, resolve immediately
# Run tests after merge
npm test
```

**Why**: Early conflict detection and resolution is easier than late-stage conflicts.

### 3. PR Preparation

**Pre-PR Checklist**:

```bash
# Step 1: Final master sync
git fetch origin
git merge origin/master

# Step 2: Resolve any conflicts
# (Use manager-git agent if needed)

# Step 3: Verify quality
npm test           # All tests pass
npm run build      # TypeScript compiles
npm run lint       # No lint errors

# Step 4: Push
git push origin feature/SPEC-YOUR-FEATURE

# Step 5: Create PR
gh pr create --title "..." --body "..."
```

### 4. Post-Merge Cleanup

**Manual Cleanup**:

```bash
# After PR merged to master
git worktree remove ~/worktrees/tekton/SPEC-YOUR-FEATURE
```

**Automatic Cleanup** (if `cleanup_merged: true`):
- Worktrees are auto-removed after successful merge
- Stale worktrees detected after `stale_threshold_days`

---

## Conflict Prevention Strategies

### Strategy 1: Domain Separation

**Recommended**: Assign different packages to different SPECs

```
SPEC-TOKEN-001:  packages/token-generator/
SPEC-THEME-001:  packages/component-generator/
SPEC-STUDIO-001: packages/studio-mcp/
```

**Why**: Minimal file overlap = minimal conflicts

### Strategy 2: File Ownership Matrix

**Before Starting SPEC**:

1. Check active worktrees:
   ```bash
   git worktree list
   ```

2. Identify files each SPEC modifies:
   ```
   SPEC-A: ast-builder.ts, jsx-generator.ts
   SPEC-B: token-resolver.ts, theme-types.ts
   ```

3. Avoid overlapping files when possible

**When Overlap Unavoidable**:
- Coordinate changes with other developers
- Use smaller, focused changes
- Merge frequently to minimize divergence

### Strategy 3: Interface Coordination

**Problem**: Multiple SPECs extending same interface

```typescript
// SPEC-THEME-BIND-001 wants to add:
interface BlueprintResult {
  themeId?: string;
}

// SPEC-LAYOUT-001 wants to add:
interface BlueprintResult {
  layout?: LayoutConfig;
}
```

**Solution**: Coordinate interface changes

```typescript
// Agreed structure (both SPECs)
interface BlueprintResult {
  themeId?: string;      // SPEC-THEME-BIND-001
  layout?: LayoutConfig; // SPEC-LAYOUT-001
}
```

**Protocol**:
- Check existing SPECs before modifying shared interfaces
- Document interface changes in SPEC
- Consider using interface composition instead of modification

---

## Conflict Resolution Protocol

### When Conflicts Occur

**Detection**: GitHub PR shows conflict badge

**Resolution Location**: Use worktree, not main repo

```bash
# Navigate to worktree
cd ~/worktrees/tekton/SPEC-YOUR-FEATURE

# Fetch latest master
git fetch origin

# Attempt merge
git merge origin/master
# Conflicts detected!
```

### Conflict Resolution Pattern

**Step 1: Understand Both Changes**

Read conflicting file sections:
```
<<<<<<< HEAD (Your changes)
// Your feature implementation
=======
// Master's new implementation
>>>>>>> origin/master
```

**Step 2: Integration Strategy**

**DO NOT**: Choose one side and discard the other
**DO**: Integrate both features

Example from SPEC-THEME-BIND-001 vs SPEC-LAYOUT-001:

```typescript
// CONFLICT: Method signature
<<<<<<< HEAD
build(blueprint: BlueprintResult, options?: ASTBuildOptions): ASTBuildResult
=======
build(blueprint: BlueprintResult | BlueprintResultV2): ASTBuildResult
>>>>>>> origin/master

// RESOLUTION: Support both parameters
build(
  blueprint: BlueprintResult | BlueprintResultV2,
  options?: ASTBuildOptions
): ASTBuildResult {
  const blueprintV2 = blueprint as BlueprintResultV2;
  // Integrate both features
}
```

**Step 3: Delegate to manager-git Agent**

For complex conflicts, use specialized agent:

```typescript
Task({
  subagent_type: "manager-git",
  description: "Resolve merge conflicts",
  prompt: `
    Resolve merge conflicts in feature/SPEC-YOUR-FEATURE.

    Context:
    - Our branch adds: [feature description]
    - Master branch adds: [feature description]
    - Strategy: Integrate both features

    Conflicting files: [list]
  `
})
```

**Why**: manager-git agent has conflict resolution expertise

**Step 4: Verify Integration**

```bash
# After conflict resolution
npm test              # All tests must pass
npm run build         # TypeScript must compile
npm run lint          # No new lint errors

# Stage and commit
git add <resolved-files>
git commit  # Default merge message

# Push
git push origin feature/SPEC-YOUR-FEATURE
```

---

## Conflict Case Study: SPEC-THEME-BIND-001

### Background

**Timeline**:
```
Dec 20: SPEC-THEME-BIND-001 branches from master (f800e6b)
Dec 20-27: Implements theme binding (7 commits)
Dec 27: SPEC-LAYOUT-001 (PR #37) merges to master
Dec 28: SPEC-THEME-BIND-001 tries to merge → CONFLICT
```

### Root Cause

**Both SPECs modified identical files**:
- `ast-builder.ts`: Method signatures
- `jsx-element-generator.ts`: Component building logic
- `knowledge-schema.ts`: Interface extensions
- `index.ts`: Export lists
- `layer3-tools.test.ts`: Test suites

**Why Conflict Occurred**:
1. Long development period (7 days) without master sync
2. Identical file modifications
3. Same functions/interfaces changed for different purposes

### Resolution Approach

**Integration Strategy**: Merge both feature sets

1. **ast-builder.ts**:
   - THEME: Added `ASTBuildOptions` parameter
   - LAYOUT: Added `BlueprintResultV2` support
   - **Resolution**: Support both parameters

2. **jsx-element-generator.ts**:
   - THEME: Injected CSS variables in `style` prop
   - LAYOUT: Injected Tailwind classes in `className` prop
   - **Resolution**: Generate both props

3. **knowledge-schema.ts**:
   - THEME: Added `themeId` field
   - LAYOUT: Added `layout` and `environment` fields
   - **Resolution**: Include all fields

**Result**: Both features coexist without interference

### Testing After Resolution

```bash
# All tests passed
Test Files: 20 passed (20)
Tests:      293 passed (293)
Duration:   2.00s

# TypeScript compiled successfully
tsc --noEmit
# (no errors)
```

### Lessons Learned

**Prevention**:
- Sync with master every 2-3 days during development
- Coordinate when modifying shared interfaces
- Create smaller PRs (merge more frequently)

**Resolution**:
- Always integrate both features, never discard one
- Use manager-git agent for complex conflicts
- Verify with full test suite after resolution

---

## Worktree Commands Reference

### Creation

```bash
# From latest master
git checkout master && git pull
git worktree add <path> -b <branch-name>

# Example
git worktree add ~/worktrees/tekton/SPEC-001 -b feature/SPEC-001
```

### Status Check

```bash
# List all worktrees
git worktree list

# Check specific worktree status
cd ~/worktrees/tekton/SPEC-001
git status
git log master..HEAD --oneline  # Commits ahead of master
```

### Sync with Master

```bash
cd ~/worktrees/tekton/SPEC-001

# Merge strategy (default)
git fetch origin
git merge origin/master

# Rebase strategy (alternative)
git fetch origin
git rebase origin/master
```

### Cleanup

```bash
# Remove worktree (clean working directory required)
git worktree remove ~/worktrees/tekton/SPEC-001

# Force remove (discard uncommitted changes)
git worktree remove --force ~/worktrees/tekton/SPEC-001

# Prune stale worktree references
git worktree prune
```

### Recovery

```bash
# Recreate removed worktree
git worktree add ~/worktrees/tekton/SPEC-001 feature/SPEC-001
# Branch must still exist
```

---

## Agent Guidelines for Worktree Operations

### When to Use Worktrees

**Use Worktrees** (Recommended):
- Parallel SPEC development
- Long-running feature branches
- Maintaining multiple versions simultaneously
- Isolating experimental changes

**Use Branch Switching** (Simpler):
- Quick bug fixes
- Single active feature
- Short-lived branches

### Agent Worktree Protocol

**Before Creating Worktree**:

1. Verify master is up-to-date:
   ```bash
   git checkout master && git pull
   ```

2. Check existing worktrees:
   ```bash
   git worktree list
   ```

3. Verify path availability:
   ```bash
   ls ~/worktrees/tekton/SPEC-NEW
   # Should not exist
   ```

**During Development**:

1. Sync with master every 2-3 days
2. Run tests after each sync
3. Resolve conflicts immediately when detected

**Before PR Creation**:

1. Final master sync
2. Conflict resolution (if any)
3. Full test suite execution
4. TypeScript compilation verification

**After PR Merge**:

1. Return to main repository: `cd /main/repo/path`
2. Update master: `git checkout master && git pull`
3. Clean worktree: `git worktree remove <path>` (or let auto-cleanup handle it)

---

## Troubleshooting

### Issue: "worktree contains modified or untracked files"

**Error**:
```
fatal: '/path/to/worktree' contains modified or untracked files, use --force to delete it
```

**Solution**:
```bash
cd /path/to/worktree
git status  # Check what's uncommitted

# Option 1: Commit changes
git add .
git commit -m "final changes"

# Option 2: Discard changes
git reset --hard
git clean -fd

# Option 3: Force remove
cd /main/repo
git worktree remove --force /path/to/worktree
```

### Issue: Merge conflicts during sync

**Symptom**: `git merge origin/master` shows conflicts

**Solution**: Use manager-git agent

```bash
# Don't manually resolve complex conflicts
# Delegate to specialized agent
Task({
  subagent_type: "manager-git",
  description: "Resolve merge conflicts",
  prompt: "Resolve conflicts in worktree at <path>..."
})
```

### Issue: Stale worktree reference

**Error**:
```
fatal: 'worktree' already exists
```

**Solution**:
```bash
# Prune stale references
git worktree prune

# Try creation again
git worktree add <path> -b <branch>
```

---

## Best Practices Summary

### Critical Rules

1. **[HARD] Always create worktrees from latest master**
   - WHY: Prevents merge conflicts from stale base
   - ACTION: `git checkout master && git pull` before `git worktree add`

2. **[HARD] Sync with master every 2-3 days**
   - WHY: Early conflict detection and resolution
   - ACTION: Daily `git fetch origin && git merge origin/master`

3. **[HARD] Integrate both features when resolving conflicts**
   - WHY: Discarding code loses functionality
   - ACTION: Merge implementations, never delete one side

4. **[SOFT] Coordinate shared interface changes**
   - WHY: Prevents conflicting modifications
   - ACTION: Check active SPECs before modifying common types

5. **[SOFT] Use domain separation when possible**
   - WHY: Minimizes file overlap and conflicts
   - ACTION: Assign different packages to different SPECs

### Workflow Checklist

**SPEC Start**:
- [ ] Update master: `git checkout master && git pull`
- [ ] Create worktree from latest: `git worktree add <path> -b <branch>`
- [ ] Verify base commit: `git log -1`

**During Development** (Every 2-3 Days):
- [ ] Fetch updates: `git fetch origin`
- [ ] Merge master: `git merge origin/master`
- [ ] Resolve conflicts if any
- [ ] Run tests: `npm test`

**Pre-PR**:
- [ ] Final master sync
- [ ] All conflicts resolved
- [ ] Tests passing: `npm test`
- [ ] TypeScript compiles: `npm run build`
- [ ] Lint clean: `npm run lint`

**Post-Merge**:
- [ ] Return to main repo
- [ ] Update master: `git pull`
- [ ] Remove worktree: `git worktree remove <path>`

---

**Last Updated**: 2026-01-23
**Status**: Production Ready
**Maintained by**: MoAI-ADK Team
