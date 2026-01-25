# MoAI Worktree Documentation Sync - Validation Checklist

**Date**: 2026-01-20
**Purpose**: Step-by-step validation checklist for documentation synchronization

---

## Pre-Execution Checklist

Before starting documentation sync, verify:

- [ ] Current branch: `feature/SPEC-LAYER1-001` or appropriate feature branch
- [ ] Implementation status: 100% complete (789 tests passing)
- [ ] All code changes committed and pushed
- [ ] Documentation sync plan reviewed and approved

---

## Action 1: MoAI Integration Enhancement

### README.md Update

**File**: `/Users/asleep/Developer/tekton/README.md`
**Location**: Lines 330-389 (Worktree section)
**Action**: Insert MoAI workflow integration example after line 349

**Checklist**:

- [ ] Open README.md in editor
- [ ] Locate worktree section (lines 330-389)
- [ ] Find insertion point (after line 349)
- [ ] Insert MoAI integration example (see plan Appendix A)
- [ ] Verify markdown formatting (headings, code blocks)
- [ ] Save file

**Validation**:

```bash
# Verify markdown syntax
markdownlint README.md

# Verify code blocks render correctly
cat README.md | grep -A 5 "Phase 1 - Planning"
```

**Expected Result**:

- ✅ Markdown linting passes
- ✅ MoAI integration clearly visible
- ✅ Code examples properly formatted

---

### SKILL.md Update

**File**: `/Users/asleep/Developer/tekton/.claude/skills/moai-workflow-worktree/SKILL.md`
**Location**: Lines 25-52 (Use Cases section)
**Action**: Insert MoAI integration callout after line 51

**Checklist**:

- [ ] Open SKILL.md in editor
- [ ] Locate use cases section (lines 25-52)
- [ ] Find insertion point (after line 51)
- [ ] Insert MoAI command callout (see plan Appendix A)
- [ ] Verify markdown formatting
- [ ] Save file

**Validation**:

```bash
# Verify markdown syntax
markdownlint .claude/skills/moai-workflow-worktree/SKILL.md

# Verify MoAI integration mentioned
grep -i "moai" .claude/skills/moai-workflow-worktree/SKILL.md
```

**Expected Result**:

- ✅ Markdown linting passes
- ✅ MoAI integration callout visible in Quick Reference
- ✅ Links to MoAI commands present

---

### Workflow Guide Diagram Addition

**File**: `/Users/asleep/Developer/tekton/docs/worktree-workflow-guide.md`
**Location**: Section 3 (lines 88-190)
**Action**: Insert Mermaid workflow diagram after line 87

**Checklist**:

- [ ] Open worktree-workflow-guide.md in editor
- [ ] Locate integration section (lines 88-190)
- [ ] Find insertion point (after line 87, before "Phase 1")
- [ ] Insert Mermaid diagram (see plan Appendix A)
- [ ] Verify diagram syntax
- [ ] Save file

**Validation**:

````bash
# Verify markdown syntax
markdownlint docs/worktree-workflow-guide.md

# Verify Mermaid diagram
grep -A 20 "```mermaid" docs/worktree-workflow-guide.md

# Optional: Render diagram (if mmdc installed)
# mmdc -i docs/worktree-workflow-guide.md -o /tmp/diagram.png
````

**Expected Result**:

- ✅ Markdown linting passes
- ✅ Mermaid diagram renders correctly
- ✅ Diagram shows complete workflow lifecycle

---

## Validation Phase

### Step 1: Markdown Linting

**Purpose**: Verify all markdown files have correct syntax

**Commands**:

```bash
# Lint all worktree documentation
markdownlint .claude/skills/moai-workflow-worktree/**/*.md
markdownlint docs/worktree-*.md
markdownlint README.md
```

**Checklist**:

- [ ] No linting errors in SKILL.md
- [ ] No linting errors in workflow-guide.md
- [ ] No linting errors in README.md
- [ ] No linting errors in integration.md
- [ ] No linting errors in module files

**Expected Output**: `0 errors` (all files pass)

---

### Step 2: Link Validation

**Purpose**: Verify all internal and external links work

**Commands**:

```bash
# Check all links in worktree documentation
markdown-link-check .claude/skills/moai-workflow-worktree/**/*.md
markdown-link-check docs/worktree-*.md
```

**Checklist**:

- [ ] All internal links resolve (modules/, examples.md, reference.md)
- [ ] All cross-references work (between files)
- [ ] External links valid (Git documentation, MoAI-ADK docs)
- [ ] No broken URLs or missing files

**Expected Output**: `✓ All links are valid`

---

### Step 3: Command Example Testing

**Purpose**: Verify all command examples execute successfully

**Commands**:

```bash
# Extract and test all command examples
grep -r "tekton worktree" docs/ .claude/skills/moai-workflow-worktree/ | \
  grep -v "Binary" | \
  sed 's/.*: //' | \
  while read cmd; do
    # Extract just the command
    cmd=$(echo "$cmd" | sed 's/#.*//' | sed 's/|.*//' | xargs)
    if [[ "$cmd" == tekton\ worktree* ]]; then
      echo "Testing: $cmd --help"
      eval "$cmd --help" >/dev/null 2>&1 || echo "❌ FAILED: $cmd"
    fi
  done
```

**Checklist**:

- [ ] `tekton worktree new --help` works
- [ ] `tekton worktree list --help` works
- [ ] `tekton worktree switch --help` works
- [ ] `tekton worktree status --help` works
- [ ] `tekton worktree sync --help` works
- [ ] `tekton worktree remove --help` works
- [ ] `tekton worktree clean --help` works
- [ ] `tekton worktree config --help` works

**Expected Output**: All commands return help text successfully

---

### Step 4: Cross-Reference Validation

**Purpose**: Verify all module cross-references resolve correctly

**Commands**:

```bash
# Check all markdown links in skill directory
find .claude/skills/moai-workflow-worktree -name "*.md" -exec grep -H "\[.*\](.*\.md)" {} \; | \
  while IFS=: read -r file link; do
    target=$(echo "$link" | sed 's/.*(\(.*\.md\)).*/\1/')
    basedir=$(dirname "$file")
    fullpath="$basedir/$target"
    [ -f "$fullpath" ] || echo "❌ Broken link: $file -> $target"
  done
```

**Checklist**:

- [ ] SKILL.md → modules/\* links work
- [ ] modules/\* → other modules links work
- [ ] docs/_ → .claude/skills/_ links work (if any)
- [ ] examples.md → reference.md links work

**Expected Output**: `0 broken links`

---

### Step 5: Mermaid Diagram Validation

**Purpose**: Verify Mermaid diagrams have correct syntax

**Commands**:

````bash
# Extract Mermaid blocks
grep -A 30 "```mermaid" docs/worktree-workflow-guide.md

# Optional: Validate syntax (if mmdc installed)
# mmdc -i docs/worktree-workflow-guide.md -o /tmp/test.png
````

**Checklist**:

- [ ] Mermaid diagram opens with `flowchart TD` or similar
- [ ] All nodes defined (A[], B{}, C(), etc.)
- [ ] All connections valid (-->, -->|, etc.)
- [ ] Diagram closes with ` ``` `
- [ ] No syntax errors

**Expected Output**: Diagram renders successfully (if tested)

---

### Step 6: Spell Check

**Purpose**: Verify no spelling errors in user-facing text

**Commands**:

```bash
# Spell check all documentation
aspell check docs/worktree-workflow-guide.md
aspell check .claude/skills/moai-workflow-worktree/SKILL.md
aspell check README.md
```

**Checklist**:

- [ ] No spelling errors in README.md
- [ ] No spelling errors in SKILL.md
- [ ] No spelling errors in workflow-guide.md
- [ ] Technical terms in dictionary or ignored
- [ ] Consistent terminology throughout

**Expected Output**: `0 spelling errors` (excluding technical terms)

---

### Step 7: End-to-End Workflow Test

**Purpose**: Verify complete workflow follows documentation

**Test Scenario**: Create SPEC with worktree, develop, sync, cleanup

**Commands**:

```bash
# Step 1: Create worktree (following README.md example)
tekton worktree new SPEC-TEST-001 "Documentation Test"

# Verify: Worktree created
ls -la ~/.worktrees/SPEC-TEST-001 || echo "❌ Worktree not created"

# Step 2: Switch to worktree
cd ~/.worktrees/SPEC-TEST-001 || exit 1

# Verify: In worktree
pwd | grep "SPEC-TEST-001" || echo "❌ Not in worktree"

# Step 3: Check status (following workflow guide)
cd -
tekton worktree status SPEC-TEST-001

# Step 4: Sync worktree
tekton worktree sync SPEC-TEST-001 --dry-run

# Step 5: Cleanup (following README.md example)
tekton worktree remove SPEC-TEST-001 --force
```

**Checklist**:

- [ ] Worktree creation works as documented
- [ ] Directory switching works as documented
- [ ] Status command works as documented
- [ ] Sync command works as documented
- [ ] Cleanup works as documented
- [ ] All examples match documentation

**Expected Output**: Complete workflow executes successfully

---

## Review Phase

### Content Accuracy Review

**Reviewer**: Technical lead or feature implementer

**Checklist**:

- [ ] All command syntax matches CLI implementation
- [ ] Configuration options match YAML schema
- [ ] Workflow examples reflect actual behavior
- [ ] Error messages match CLI output
- [ ] Return codes documented correctly

**Method**: Side-by-side comparison of docs and code

**Sign-off**: **\*\***\*\***\*\***\_\_**\*\***\*\***\*\*** Date: \***\*\_\_\*\***

---

### Usability Review

**Reviewer**: Developer unfamiliar with worktree feature

**Checklist**:

- [ ] Can create worktree following README only
- [ ] Can complete workflow following workflow guide only
- [ ] Troubleshooting section addresses encountered issues
- [ ] Examples are copy-paste ready
- [ ] MoAI integration clear and understandable

**Method**: Complete workflow from scratch following docs

**Sign-off**: **\*\***\*\***\*\***\_\_**\*\***\*\***\*\*** Date: \***\*\_\_\*\***

---

### Quality Review

**Reviewer**: Documentation specialist or technical writer

**Checklist**:

- [ ] Consistent terminology (worktree vs work tree)
- [ ] Clear headings and section structure
- [ ] Proper code block formatting
- [ ] Professional tone and style
- [ ] Grammar and punctuation correct

**Method**: Read-through and editorial review

**Sign-off**: **\*\***\*\***\*\***\_\_**\*\***\*\***\*\*** Date: \***\*\_\_\*\***

---

## Completion Checklist

### Documentation Changes

- [ ] README.md updated with MoAI integration
- [ ] SKILL.md updated with MoAI callout
- [ ] worktree-workflow-guide.md updated with diagram
- [ ] All changes committed to Git

### Validation Results

- [ ] Markdown linting: 0 errors
- [ ] Link validation: 0 broken links
- [ ] Command examples: All tested and working
- [ ] Cross-references: All resolve correctly
- [ ] Mermaid diagrams: All render correctly
- [ ] Spell check: 0 errors
- [ ] End-to-end test: Passes

### Review Results

- [ ] Content accuracy review: Approved
- [ ] Usability review: Approved
- [ ] Quality review: Approved

### Release Readiness

- [ ] All validation steps passed
- [ ] All reviews approved
- [ ] CHANGELOG.md updated with documentation changes
- [ ] Documentation marked as 95% complete
- [ ] Ready for release

---

## Post-Completion Actions

### Git Operations

```bash
# Stage documentation changes
git add README.md
git add .claude/skills/moai-workflow-worktree/SKILL.md
git add docs/worktree-workflow-guide.md
git add docs/worktree-documentation-sync-plan.md
git add docs/worktree-sync-executive-summary.md
git add docs/worktree-sync-visual-overview.md
git add docs/worktree-sync-validation-checklist.md

# Commit changes
git commit -m "docs(worktree): enhance MoAI workflow integration

- Add MoAI workflow integration example to README
- Add MoAI command callout to SKILL.md
- Add Mermaid workflow diagram to workflow guide
- Create comprehensive documentation sync plan
- Add visual overview and validation checklist

Closes: Documentation sync for moai-worktree feature
Documentation completeness: 90% → 95%"

# Push changes
git push origin feature/SPEC-LAYER1-001
```

### CHANGELOG Update

Add entry to CHANGELOG.md:

```markdown
## [Unreleased]

### Documentation

- Enhanced MoAI workflow integration in worktree documentation
- Added visual workflow diagram to worktree-workflow-guide.md
- Created comprehensive documentation sync plan
- Added executive summary and validation checklist
- Documentation completeness: 95% (5,044+ lines)
```

### Notification

Notify team:

- [ ] Update project status dashboard
- [ ] Notify stakeholders of documentation completion
- [ ] Share documentation sync results in team channel
- [ ] Schedule follow-up for optional enhancements (if desired)

---

## Optional Actions (Future Sprint)

If proceeding with Actions 2-3:

### Action 2: Formal API Reference

- [ ] Create `docs/worktree-api-reference.md`
- [ ] Document WorktreeManager class
- [ ] Document WorktreeRegistry class
- [ ] Document configuration schema
- [ ] Add usage examples for each method
- [ ] Validate and review

**Estimated Effort**: 4 hours

### Action 3: IDE Integration Guide

- [ ] Create `docs/worktree-ide-integration.md`
- [ ] Document VS Code workspace setup
- [ ] Document VS Code tasks integration
- [ ] Document IntelliJ project setup
- [ ] Document shell aliases and functions
- [ ] Validate and review

**Estimated Effort**: 3 hours

---

## Success Metrics

Track these metrics post-release:

| Metric                 | Baseline | Target | Measurement Method                |
| ---------------------- | -------- | ------ | --------------------------------- |
| Worktree Adoption      | 0%       | 40%    | Count worktree creations vs SPECs |
| Support Requests       | TBD      | -50%   | Track worktree-related questions  |
| User Satisfaction      | N/A      | 80%+   | Survey after 2 weeks              |
| Documentation Accuracy | 100%     | 100%   | Monitor bug reports               |

---

**Checklist Status**: Ready for Execution
**Last Updated**: 2026-01-20
**Owner**: Documentation Team

---

_This validation checklist ensures comprehensive quality assurance for the moai-worktree documentation synchronization._
