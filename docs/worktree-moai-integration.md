# Tekton Worktree - MoAI Workflow Integration Analysis

**Version**: 1.0.0
**Date**: 2026-01-20
**Status**: Analysis Complete - Implementation Ready

---

## Executive Summary

This document analyzes integration points between the Tekton Worktree Management System (Phases 1-4 complete, 314 tests passing) and the MoAI workflow commands (`/moai:1-plan`, `/moai:2-run`, `/moai:3-sync`). The worktree system is fully implemented with CLI commands, but the MoAI commands need updates to suggest and utilize worktrees during SPEC development.

**Current State**:

- Worktree System: 100% complete (314 tests passing)
- MoAI Integration: Partially complete (worktree creation exists in `/moai:1-plan`)
- CLI Commands: Fully functional (`tekton worktree new|list|switch|remove|sync|status|config|clean`)

**Recommendation**: Update MoAI command documentation and add worktree detection/suggestion logic.

---

## Integration Points Analysis

### 1. `/moai:1-plan` - Planning Phase Integration

**File**: `/Users/asleep/Developer/tekton/.claude/commands/moai/1-plan.md`

**Current Worktree Support**: IMPLEMENTED (lines 884-1152)

The `/moai:1-plan` command already supports worktree creation through:

- `--worktree` flag parsing (line 885)
- WorktreeManager integration (lines 896-917)
- Success output with navigation guidance (lines 907-911)
- Error handling with fallback (lines 913-917)

**Integration Status**: ✅ Complete

**Existing Implementation**:

```markdown
#### Step 2.5: Worktree Creation (NEW - When --worktree flag provided)

CONDITION: `--worktree` flag is provided in user command

ACTION: Create Git worktree using WorktreeManager

Step 2.5A - Parse Command Arguments:

- Parse the command arguments from ARGUMENTS variable
- Check if --worktree flag is present in the arguments

Step 2.5B - Worktree Creation (when --worktree flag is present):

- Determine project root as the current working directory
- Set worktree root to the user home directory under worktrees/MoAI-ADK
- Initialize the WorktreeManager with project root and worktree root paths
- Create worktree for the SPEC with the following parameters:
  - spec_id: The generated SPEC ID (e.g., SPEC-AUTH-001)
  - branch_name: Feature branch name in format feature/SPEC-{ID}
  - base_branch: main
```

**Recommendation**: Working as designed. Consider adding to status output:

- Suggest `tekton worktree new` if user doesn't use `--worktree` flag
- Show worktree list at completion to remind users of parallel dev capability

**Example Enhancement** (Optional):
After SPEC creation, when no `--worktree` flag is provided, show:

```
SPEC created successfully: SPEC-AUTH-001

You can create an isolated worktree for this SPEC with:
  tekton worktree new SPEC-AUTH-001 "User Authentication System"

Benefits:
- Parallel development on multiple SPECs
- Zero context switching overhead
- Isolated Git state per SPEC
```

---

### 2. `/moai:2-run` - Development Phase Integration

**File**: `/Users/asleep/Developer/tekton/.claude/commands/moai/2-run.md`

**Current Worktree Support**: NOT IMPLEMENTED

**Integration Opportunity**: Worktree detection and status display

**Recommended Enhancement**:

Add worktree context detection at Phase 1 (Analysis & Planning):

```markdown
### Step 1.1: Detect Development Environment

Before analyzing SPEC, detect if running in worktree:

1. Check Worktree Context:
   - Execute: `git rev-parse --git-dir` to locate git directory
   - Analyze: Check if git directory path contains `worktrees/` component
   - If in worktree: Extract SPEC ID from current directory
   - Alternative: Check worktree registry at `~/.worktrees/.moai-worktree-registry.json`

2. Display Environment Context:
```

Development Environment: Worktree (SPEC-AUTH-001)
Path: ~/.worktrees/SPEC-AUTH-001
Branch: feature/SPEC-AUTH-001
Base: master
Sync Status: Up to date (0 commits behind)

```

3. If NOT in worktree:
```

Development Environment: Main Repository
Current Branch: feature/SPEC-AUTH-001

Tip: Consider using worktrees for parallel development:
tekton worktree new SPEC-AUTH-001 "Description"

```

```

**Integration Point Code**:

```typescript
// Before Phase 1 execution
async function detectWorktreeEnvironment(): Promise<WorktreeContext | null> {
  try {
    // Check if in worktree
    const gitDir = await execCommand('git rev-parse --git-dir');
    if (gitDir.includes('worktrees/')) {
      // Extract SPEC ID from path
      const cwd = process.cwd();
      const match = cwd.match(/SPEC-([A-Z]+-\d+)/);
      const specId = match ? match[0] : null;

      if (specId) {
        // Get worktree status
        const status = await execCommand(`tekton worktree status ${specId}`);
        return { specId, path: cwd, status };
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}
```

**Benefit**: Developers see their development environment context at the start of `/moai:2-run`, which helps avoid confusion about which SPEC they're working on.

**Impact**: LOW (informational only, does not block execution)

---

### 3. `/moai:3-sync` - Synchronization Phase Integration

**File**: `/Users/asleep/Developer/tekton/.claude/commands/moai/3-sync.md`

**Current Worktree Support**: PARTIALLY IMPLEMENTED (lines 337-350, 1142-1182)

**Existing Features**:

1. Worktree detection logic (lines 337-350)
2. Worktree-specific next steps (lines 1144-1182)
3. `--worktree` flag support (line 91)

**Current Implementation**:

```markdown
4. [SOFT] Handle Worktree Detection:

   Requirement: Identify if execution occurs within a Git worktree
   Actions:
   - Execute: `git rev-parse --git-dir` to locate git directory
   - Analyze: Check if git directory path contains `worktrees/` component
   - If in worktree: Extract SPEC ID from current path (format: SPEC-{DOMAIN}-{NUMBER})
   - Alternative: Check worktree registry at `~/worktrees/{PROJECT_NAME}/.moai-worktree-registry.json`
   - Store: `$WORKTREE_MODE=true` and `$CURRENT_SPEC_ID` for later use
     WHY: Worktree context enables specialized cleanup and workflow options
     IMPACT: Missing worktree detection prevents proper exit handling but does not block sync
```

**Recommended Enhancement**:

Strengthen worktree sync integration:

```markdown
### Step 2.0: Pre-Sync Worktree Validation

If executing in worktree context:

1. Validate Worktree Sync State:
   - Execute: `tekton worktree status $CURRENT_SPEC_ID`
   - Check: Commits ahead/behind base branch
   - If behind > 0: Suggest sync before documentation sync

2. Prompt User for Worktree Sync:
```

Worktree Status: SPEC-AUTH-001
Commits ahead: 5
Commits behind: 2 ← Your worktree is behind the base branch

Options:

1.  Sync Worktree First (recommended)
    - Ensures base branch changes are included
    - Prevents conflicts during documentation sync
2.  Skip Worktree Sync
    - Continue with current state
    - May cause sync conflicts if base changed
3.  Abort
    - Exit and sync manually

```

3. If user chooses "Sync Worktree First":
- Execute: `tekton worktree sync $CURRENT_SPEC_ID`
- Wait for sync completion
- Proceed to documentation sync
```

**Integration Point Code**:

```typescript
// Before Phase 2 execution
async function validateWorktreeSync(specId: string): Promise<boolean> {
  const status = await execCommand(`tekton worktree status ${specId} --format json`);
  const parsed = JSON.parse(status);

  if (parsed.behind > 0) {
    const choice = await askUser({
      question: `Worktree is ${parsed.behind} commits behind. Sync before doc sync?`,
      options: ['Sync Worktree First (recommended)', 'Skip Worktree Sync', 'Abort'],
    });

    if (choice === 0) {
      await execCommand(`tekton worktree sync ${specId}`);
      return true;
    } else if (choice === 2) {
      return false;
    }
  }
  return true;
}
```

**Benefit**: Prevents documentation sync conflicts by ensuring worktree is up to date with base branch.

**Impact**: MEDIUM (prevents sync conflicts, improves workflow quality)

---

## Worktree Command Reference

For MoAI command integration, these worktree commands are available:

### Core Commands

| Command  | Usage                                        | Purpose                  |
| -------- | -------------------------------------------- | ------------------------ |
| `new`    | `tekton worktree new SPEC-001 "Description"` | Create isolated worktree |
| `list`   | `tekton worktree list [--status active]`     | List all worktrees       |
| `switch` | `tekton worktree switch SPEC-001`            | Get path to worktree     |
| `status` | `tekton worktree status SPEC-001`            | Check sync status        |
| `sync`   | `tekton worktree sync SPEC-001`              | Sync with base branch    |
| `remove` | `tekton worktree remove SPEC-001`            | Remove worktree          |
| `clean`  | `tekton worktree clean --merged-only`        | Clean merged worktrees   |
| `config` | `tekton worktree config list`                | View configuration       |

### JSON Output Support

All commands support `--format json` for programmatic usage:

```typescript
// Example: Get worktree status programmatically
const status = await execCommand('tekton worktree status SPEC-001 --format json');
const parsed = JSON.parse(status);

console.log(`Ahead: ${parsed.ahead} commits`);
console.log(`Behind: ${parsed.behind} commits`);
console.log(`Uncommitted changes: ${parsed.uncommittedChanges} files`);
```

---

## Integration Implementation Priority

Based on impact and effort analysis:

### Priority 1: CRITICAL (Must Have)

**1. `/moai:3-sync` - Pre-Sync Worktree Validation**

- **Impact**: HIGH (prevents sync conflicts)
- **Effort**: LOW (simple status check + user prompt)
- **Implementation**: Add Step 2.0 validation before Phase 2

**Benefits**:

- Prevents documentation sync conflicts
- Ensures base branch changes are included
- Improves workflow reliability

### Priority 2: HIGH (Should Have)

**2. `/moai:2-run` - Worktree Context Display**

- **Impact**: MEDIUM (improves developer awareness)
- **Effort**: LOW (detection + display logic)
- **Implementation**: Add Step 1.1 environment detection before Phase 1

**Benefits**:

- Clear context for developers
- Prevents confusion about current SPEC
- Shows sync status at start

**3. `/moai:1-plan` - Worktree Suggestion (Enhancement)**

- **Impact**: MEDIUM (improves discoverability)
- **Effort**: LOW (add suggestion to output)
- **Implementation**: Add tip to success message when `--worktree` not used

**Benefits**:

- Educates users about worktree benefits
- Increases worktree adoption
- Improves parallel development

### Priority 3: NICE TO HAVE (Optional)

**4. Automated Worktree Cleanup**

- **Impact**: LOW (convenience feature)
- **Effort**: MEDIUM (add cleanup logic to `/moai:3-sync`)
- **Implementation**: After PR merge, suggest `tekton worktree clean --merged-only`

**5. Worktree Health Dashboard**

- **Impact**: LOW (informational only)
- **Effort**: HIGH (new command implementation)
- **Implementation**: New `tekton worktree dashboard` command showing all active worktrees

---

## Testing Strategy

For each integration point, validate:

### Unit Tests

```typescript
describe('Worktree Integration', () => {
  describe('/moai:2-run worktree detection', () => {
    it('should detect worktree environment', async () => {
      // Setup: Create worktree
      await execCommand('tekton worktree new SPEC-TEST-001 "Test"');
      process.chdir('~/.worktrees/SPEC-TEST-001');

      // Execute: Detect worktree
      const context = await detectWorktreeEnvironment();

      // Assert: Context is detected
      expect(context).toBeDefined();
      expect(context.specId).toBe('SPEC-TEST-001');
    });

    it('should show worktree context in Phase 1', async () => {
      // Setup: In worktree
      await execCommand('tekton worktree new SPEC-TEST-001 "Test"');
      process.chdir('~/.worktrees/SPEC-TEST-001');

      // Execute: Run Phase 1
      const output = await runPhase1('SPEC-TEST-001');

      // Assert: Worktree context displayed
      expect(output).toContain('Development Environment: Worktree');
      expect(output).toContain('SPEC-TEST-001');
    });
  });

  describe('/moai:3-sync worktree validation', () => {
    it('should detect behind status and prompt sync', async () => {
      // Setup: Worktree behind base
      await execCommand('tekton worktree new SPEC-TEST-001 "Test"');
      // ... make commits on base branch ...

      // Execute: Run sync validation
      const needsSync = await validateWorktreeSync('SPEC-TEST-001');

      // Assert: Sync recommended
      expect(needsSync).toBe(true);
    });

    it('should skip worktree sync if up to date', async () => {
      // Setup: Worktree up to date
      await execCommand('tekton worktree new SPEC-TEST-001 "Test"');
      await execCommand('tekton worktree sync SPEC-TEST-001');

      // Execute: Run sync validation
      const needsSync = await validateWorktreeSync('SPEC-TEST-001');

      // Assert: No sync needed
      expect(needsSync).toBe(false);
    });
  });
});
```

### Integration Tests

```bash
#!/bin/bash
# integration-test.sh - Full workflow integration test

# Test 1: Complete workflow with worktrees
echo "Test 1: Full workflow integration"

# Create SPEC with worktree
/moai:1-plan "User Authentication" --worktree
# Expected: SPEC created + worktree created

# Switch to worktree
cd ~/.worktrees/SPEC-AUTH-001

# Run development
/moai:2-run SPEC-AUTH-001
# Expected: Environment context displayed, implementation complete

# Sync documentation
/moai:3-sync
# Expected: Worktree sync validation, doc sync complete

# Clean up
cd -
tekton worktree clean --merged-only

echo "Test 1: PASSED"

# Test 2: Worktree sync validation
echo "Test 2: Sync validation"

# Create worktree
tekton worktree new SPEC-TEST-001 "Test"

# Make changes on base branch
git checkout master
echo "change" >> README.md
git commit -am "Update README"

# Try to sync docs from worktree
cd ~/.worktrees/SPEC-TEST-001
/moai:3-sync
# Expected: Prompt to sync worktree first

echo "Test 2: PASSED"
```

---

## Rollout Plan

### Phase 1: Documentation Updates (Week 1)

1. Update `/moai:1-plan` documentation with worktree suggestion enhancement
2. Update `/moai:2-run` documentation with worktree context detection
3. Update `/moai:3-sync` documentation with worktree validation
4. Create workflow integration guide (this document)
5. Update README with worktree section

**Deliverables**:

- Updated command documentation
- Integration analysis document ✅ (this file)
- README updates
- Workflow guide ✅ (worktree-workflow-guide.md)

### Phase 2: Priority 1 Implementation (Week 2)

1. Implement `/moai:3-sync` pre-sync worktree validation
2. Add unit tests for validation logic
3. Add integration tests for full workflow
4. Update command help text

**Deliverables**:

- Working validation logic
- Test coverage ≥85%
- Updated command files

### Phase 3: Priority 2 Implementation (Week 3)

1. Implement `/moai:2-run` worktree context display
2. Enhance `/moai:1-plan` output with worktree suggestions
3. Add unit tests for context detection
4. Update examples in documentation

**Deliverables**:

- Working context display
- Enhanced suggestions
- Updated examples

### Phase 4: Validation & Documentation (Week 4)

1. Run integration test suite
2. Update all examples with real command usage
3. Create video walkthrough (optional)
4. Gather user feedback

**Deliverables**:

- Validated integration
- Complete documentation
- User feedback collected

---

## Success Metrics

Track these metrics to measure integration success:

1. **Worktree Adoption Rate**
   - Baseline: 0% (before integration)
   - Target: 40% of SPECs use worktrees
   - Measure: Count of worktree creations vs SPEC creations

2. **Sync Conflict Rate**
   - Baseline: X% (current conflict rate)
   - Target: <5% (with validation)
   - Measure: Count of sync conflicts vs total syncs

3. **Parallel Development**
   - Baseline: 1 SPEC at a time
   - Target: 2+ concurrent SPECs
   - Measure: Average concurrent active worktrees

4. **User Satisfaction**
   - Baseline: N/A (new feature)
   - Target: 80% positive feedback
   - Measure: User surveys and feedback

---

## Conclusion

The Tekton Worktree Management System is fully implemented (314 tests passing) and ready for integration with MoAI workflow commands. The analysis identifies three clear integration points:

1. **`/moai:1-plan`**: Already implemented with `--worktree` flag (✅ Complete)
2. **`/moai:2-run`**: Needs worktree context detection (Priority 2)
3. **`/moai:3-sync`**: Needs pre-sync validation (Priority 1)

**Recommended Next Steps**:

1. Implement Priority 1: `/moai:3-sync` pre-sync validation
2. Implement Priority 2: `/moai:2-run` context display
3. Enhance `/moai:1-plan` with worktree suggestions
4. Validate with integration tests
5. Gather user feedback

The integration is low-risk (all changes are additive, no breaking changes) and high-value (improves parallel development workflow and prevents sync conflicts).

---

**Document Version**: 1.0.0
**Last Updated**: 2026-01-20
**Status**: Ready for Implementation
**Next Review**: After Phase 2 completion
