# Version Management

## Single Source of Truth

**[HARD]** `pyproject.toml` is the ONLY authoritative source for MoAI-ADK version.

**WHY**: Prevents version inconsistencies across multiple files.

### Version Reference

- **Authoritative Source**: `pyproject.toml` (version = "X.Y.Z")
- **Runtime Access**: `src/moai_adk/version.py` reads from `pyproject.toml`
- **Config Display**: `.moai/config/sections/system.yaml` (updated by release process)

**Critical Rule**: All version references must be derived from or synchronized with `pyproject.toml`.

---

## Files Requiring Version Sync

When releasing a new version, these files MUST be updated:

### Documentation Files

- `README.md` (Version line)
- `README.ko.md` (Version line)
- `README.ja.md` (Version line)
- `README.zh.md` (Version line)
- `CHANGELOG.md` (New version entry)

### Configuration Files

- `pyproject.toml` (Single Source - update FIRST)
- `src/moai_adk/version.py` (`_FALLBACK_VERSION`)
- `.moai/config/sections/system.yaml` (`moai.version`)
- `src/moai_adk/templates/.moai/config/config.yaml` (`moai.version`)

### Additional Files (Project-Specific)

- Package manifests (`package.json`, `Cargo.toml`, etc.)
- Version badges in documentation
- Installation scripts referencing specific versions
- Docker images with version tags

---

## Version Sync Process

**[HARD]** Before any release, follow this exact process:

### Step 1: Update pyproject.toml

Change version in the authoritative source:

```toml
[project]
name = "moai-adk"
version = "2.1.0"  # Update this first
```

### Step 2: Run Version Sync Script

Execute the automated sync script:

```bash
# Automated approach
.github/scripts/sync-versions.sh 2.1.0

# Manual approach (if script unavailable)
# Update each file listed in "Files Requiring Version Sync"
```

**Script Responsibilities**:
- Update all version references across the codebase
- Validate consistency after updates
- Generate version-specific documentation
- Update CHANGELOG.md with new entry

### Step 3: Verify Consistency

Confirm all versions are synchronized:

```bash
# Search for version references
grep -r "2.1.0" --include="*.md" --include="*.toml" --include="*.yaml" --include="*.py"

# Check for old version references
grep -r "2.0.0" --include="*.md" --include="*.toml" --include="*.yaml" --include="*.py"

# Verify no old version numbers remain
```

**Verification Checklist**:
- [ ] `pyproject.toml` updated
- [ ] All README files updated
- [ ] CHANGELOG.md has new version entry
- [ ] Configuration files synchronized
- [ ] No old version references remain
- [ ] Version sync script ran successfully
- [ ] All automated tests pass

---

## Version Numbering Strategy

### Semantic Versioning

Follow semantic versioning (SemVer) principles:

**Format**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Incompatible API changes
- **MINOR**: Backwards-compatible functionality additions
- **PATCH**: Backwards-compatible bug fixes

**Examples**:
- `2.0.0` → `2.0.1`: Bug fix (patch)
- `2.0.1` → `2.1.0`: New feature (minor)
- `2.1.0` → `3.0.0`: Breaking change (major)

### Pre-Release Versions

For pre-release versions, use suffixes:

- **Alpha**: `2.1.0-alpha.1` (early development)
- **Beta**: `2.1.0-beta.1` (feature complete, testing)
- **Release Candidate**: `2.1.0-rc.1` (release candidate)

**Progression**:
```
2.1.0-alpha.1 → 2.1.0-alpha.2 → 2.1.0-beta.1 → 2.1.0-rc.1 → 2.1.0
```

---

## Release Workflow

### Pre-Release Checklist

- [ ] All features for version complete
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md prepared
- [ ] Version numbers ready to update

### Release Steps

1. **Create Release Branch**:
   ```bash
   git checkout -b release/2.1.0
   ```

2. **Update Version**:
   ```bash
   # Update pyproject.toml
   # Run sync script
   .github/scripts/sync-versions.sh 2.1.0
   ```

3. **Verify Changes**:
   ```bash
   # Review all changed files
   git diff master

   # Run tests
   pytest
   npm test
   ```

4. **Commit Version Update**:
   ```bash
   git add .
   git commit -m "chore(release): bump version to 2.1.0"
   ```

5. **Create Tag**:
   ```bash
   git tag -a v2.1.0 -m "Release version 2.1.0"
   ```

6. **Push to Remote**:
   ```bash
   git push origin release/2.1.0
   git push origin v2.1.0
   ```

7. **Create Release PR**:
   ```bash
   gh pr create --title "Release v2.1.0" --body "Release version 2.1.0"
   ```

8. **Merge and Deploy**:
   - Merge PR to master
   - Trigger CI/CD deployment
   - Verify deployment success

---

## Prohibited Practices

### Never Hardcode Versions

**Bad**:
```python
# version.py
VERSION = "2.1.0"  # Hardcoded, will get out of sync

# README.md
Current version: 2.1.0  # Hardcoded
```

**Good**:
```python
# version.py
import toml

with open("pyproject.toml") as f:
    VERSION = toml.load(f)["project"]["version"]

# README.md
Current version: See pyproject.toml
```

### Never Update README Without Updating pyproject.toml

**Wrong Process**:
1. Update README.md to v2.1.0
2. Forget to update pyproject.toml
3. Release with inconsistent versions

**Correct Process**:
1. Update pyproject.toml to v2.1.0 FIRST
2. Run sync script to update all files
3. Verify consistency before release

### Never Release with Mismatched Versions

**Problem**: Different files showing different versions

**Detection**:
```bash
# Find all version references
grep -r "version.*=.*[0-9]\+\.[0-9]\+\.[0-9]\+" .

# Look for inconsistencies
grep -r "2.0.0" .  # Old version
grep -r "2.1.0" .  # New version
```

**Prevention**:
- Always use sync script
- Always verify before release
- Include version check in CI/CD

---

## Automation

### CI/CD Version Validation

Add to CI/CD pipeline:

```yaml
# .github/workflows/version-check.yml
name: Version Consistency Check

on: [push, pull_request]

jobs:
  check-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Extract versions
        id: versions
        run: |
          PYPROJECT_VERSION=$(grep '^version = ' pyproject.toml | cut -d'"' -f2)
          README_VERSION=$(grep 'Version:' README.md | cut -d' ' -f2)

          echo "pyproject=$PYPROJECT_VERSION" >> $GITHUB_OUTPUT
          echo "readme=$README_VERSION" >> $GITHUB_OUTPUT

      - name: Verify consistency
        run: |
          if [ "${{ steps.versions.outputs.pyproject }}" != "${{ steps.versions.outputs.readme }}" ]; then
            echo "Version mismatch detected!"
            echo "pyproject.toml: ${{ steps.versions.outputs.pyproject }}"
            echo "README.md: ${{ steps.versions.outputs.readme }}"
            exit 1
          fi
```

### Pre-Commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash

# Extract version from pyproject.toml
PYPROJECT_VERSION=$(grep '^version = ' pyproject.toml | cut -d'"' -f2)

# Check if version appears in CHANGELOG.md
if ! grep -q "$PYPROJECT_VERSION" CHANGELOG.md; then
  echo "Warning: Version $PYPROJECT_VERSION not found in CHANGELOG.md"
  echo "Please update CHANGELOG.md before committing"
  exit 1
fi
```

---

## Troubleshooting

### Version Mismatch Detected

**Symptom**: CI/CD fails with version inconsistency error

**Solution**:
1. Identify which files have wrong versions
2. Update pyproject.toml to correct version
3. Run sync script
4. Verify consistency
5. Commit and push

### Sync Script Fails

**Symptom**: Version sync script errors out

**Common Causes**:
- Missing files expected by script
- Permission issues
- Malformed version number

**Solution**:
1. Check script error message
2. Verify all expected files exist
3. Ensure version format is correct (X.Y.Z)
4. Run script with verbose output for debugging

### Release Tag Already Exists

**Symptom**: Cannot create tag v2.1.0 because it exists

**Solution**:
```bash
# Delete local tag
git tag -d v2.1.0

# Delete remote tag
git push origin :refs/tags/v2.1.0

# Recreate tag
git tag -a v2.1.0 -m "Release version 2.1.0"
git push origin v2.1.0
```

---

## Works Well With

**Documentation**:
- [CLAUDE.md](/Users/asleep/Developer/tekton/CLAUDE.md) - Release workflow integration
- [Git Worktree Management](../workflows/git-worktree.md) - Release branch management

**Tools**:
- GitHub Actions - Automated version validation
- Pre-commit hooks - Version consistency checks
- Release automation scripts

**Related Processes**:
- Release management
- Changelog maintenance
- Documentation updates

---

**Last Updated**: 2026-01-23
**Status**: Production Ready
**Source**: Extracted from CLAUDE.md for improved maintainability
**WHY**: Version inconsistency causes confusion and breaks tooling expectations.
