#!/bin/bash

# MoAI Worktree E2E Test Script
# Tests all worktree commands with a real Git repository
# Run from: packages/cli directory

# Don't exit on error - we want to run all tests
# set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
}

print_test() {
    echo -e "${YELLOW}▶ Test ${TESTS_RUN}: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ PASS: $1${NC}"
    ((TESTS_PASSED++))
}

print_failure() {
    echo -e "${RED}✗ FAIL: $1${NC}"
    echo -e "${RED}  Error: $2${NC}"
    ((TESTS_FAILED++))
}

run_test() {
    ((TESTS_RUN++))
    print_test "$1"
}

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}Cleaning up test resources...${NC}"

    # Remove test worktrees if they exist
    if [ -d ~/worktrees/tekton ]; then
        node dist/index.js worktree remove SPEC-E2E-001 --force 2>/dev/null || true
        node dist/index.js worktree remove SPEC-E2E-002 --force 2>/dev/null || true
        node dist/index.js worktree remove SPEC-E2E-003 --force 2>/dev/null || true
    fi

    echo -e "${GREEN}Cleanup complete${NC}"
}

# Set trap to cleanup on exit
trap cleanup EXIT

# Main test execution
print_header "MoAI Worktree Management System - E2E Tests"

echo "Current directory: $(pwd)"
echo "Testing CLI: node dist/index.js worktree"
echo ""

# Test 1: Help command
run_test "Display worktree help"
if node dist/index.js worktree --help > /dev/null 2>&1; then
    print_success "Help command works"
else
    print_failure "Help command failed" "Command returned non-zero exit code"
fi

# Test 2: Config list (before any worktrees)
run_test "List configuration (default values)"
if node dist/index.js worktree config list > /dev/null 2>&1; then
    print_success "Config list works"
else
    print_failure "Config list failed" "Command returned non-zero exit code"
fi

# Test 3: Create first worktree
print_header "Creating First Worktree (SPEC-E2E-001)"
run_test "Create worktree SPEC-E2E-001"
if node dist/index.js worktree new SPEC-E2E-001 "E2E Test Worktree 1" --no-switch; then
    print_success "Created worktree SPEC-E2E-001"
    echo -e "${GREEN}  Path: ~/worktrees/tekton/SPEC-E2E-001${NC}"
    echo -e "${GREEN}  Branch: feature/SPEC-E2E-001${NC}"
else
    print_failure "Create worktree failed" "Command returned non-zero exit code"
fi

# Test 4: List worktrees (should show 1)
run_test "List worktrees (should show 1 worktree)"
OUTPUT=$(node dist/index.js worktree list)
if echo "$OUTPUT" | grep -q "SPEC-E2E-001"; then
    print_success "List shows SPEC-E2E-001"
    echo -e "${BLUE}Output:${NC}"
    echo "$OUTPUT" | head -5
else
    print_failure "List does not show worktree" "Expected SPEC-E2E-001 in output"
fi

# Test 5: Create second worktree
print_header "Creating Second Worktree (SPEC-E2E-002)"
run_test "Create worktree SPEC-E2E-002"
if node dist/index.js worktree new SPEC-E2E-002 "E2E Test Worktree 2" --no-switch; then
    print_success "Created worktree SPEC-E2E-002"
else
    print_failure "Create worktree failed" "Command returned non-zero exit code"
fi

# Test 6: List worktrees (should show 2)
run_test "List worktrees (should show 2 worktrees)"
OUTPUT=$(node dist/index.js worktree list)
COUNT=$(echo "$OUTPUT" | grep -c "SPEC-E2E" || true)
if [ "$COUNT" -eq 2 ]; then
    print_success "List shows 2 worktrees"
else
    print_failure "List does not show 2 worktrees" "Expected 2, got $COUNT"
fi

# Test 7: Status for specific worktree
run_test "Get status for SPEC-E2E-001"
if node dist/index.js worktree status SPEC-E2E-001 > /dev/null 2>&1; then
    print_success "Status command works"
else
    print_failure "Status command failed" "Command returned non-zero exit code"
fi

# Test 8: Switch command (should output path)
run_test "Get switch path for SPEC-E2E-001"
OUTPUT=$(node dist/index.js worktree switch SPEC-E2E-001 2>&1)
if echo "$OUTPUT" | grep -q "SPEC-E2E-001"; then
    print_success "Switch command outputs path"
    echo -e "${BLUE}Output: $OUTPUT${NC}"
else
    print_failure "Switch command failed" "Expected path in output"
fi

# Test 9: Sync command
print_header "Testing Sync Command"
run_test "Sync SPEC-E2E-001 with base branch"
if node dist/index.js worktree sync SPEC-E2E-001 2>&1 | grep -q "up to date\|synced"; then
    print_success "Sync command works"
else
    print_failure "Sync command failed" "Command returned non-zero exit code"
fi

# Test 10: List with status filter
run_test "List active worktrees only"
if node dist/index.js worktree list --status active > /dev/null 2>&1; then
    print_success "List with status filter works"
else
    print_failure "List with status filter failed" "Command returned non-zero exit code"
fi

# Test 11: JSON output
run_test "List worktrees in JSON format"
OUTPUT=$(node dist/index.js worktree list --format json 2>&1)
if echo "$OUTPUT" | grep -q "\"id\": \"SPEC-E2E-001\""; then
    print_success "JSON output works"
else
    print_failure "JSON output failed" "Expected JSON with SPEC-E2E-001"
fi

# Test 12: Config get
run_test "Get specific config value (default_base)"
OUTPUT=$(node dist/index.js worktree config get default_base 2>&1)
if [ -n "$OUTPUT" ]; then
    print_success "Config get works (value: $OUTPUT)"
else
    print_failure "Config get failed" "No output returned"
fi

# Test 13: Config set
run_test "Set config value (auto_sync)"
if node dist/index.js worktree config set auto_sync true > /dev/null 2>&1; then
    print_success "Config set works"
else
    print_failure "Config set failed" "Command returned non-zero exit code"
fi

# Test 14: Remove first worktree
print_header "Testing Remove Command"
run_test "Remove worktree SPEC-E2E-001 (with force)"
if node dist/index.js worktree remove SPEC-E2E-001 --force; then
    print_success "Removed worktree SPEC-E2E-001"
else
    print_failure "Remove command failed" "Command returned non-zero exit code"
fi

# Test 15: Verify removal
run_test "Verify worktree was removed (should show only 1)"
OUTPUT=$(node dist/index.js worktree list)
if echo "$OUTPUT" | grep -q "SPEC-E2E-001"; then
    print_failure "Worktree still exists after removal" "SPEC-E2E-001 found in list"
else
    print_success "Worktree successfully removed"
fi

# Test 16: Clean command
print_header "Testing Clean Command"
run_test "Clean merged worktrees (dry-run)"
if node dist/index.js worktree clean --dry-run > /dev/null 2>&1; then
    print_success "Clean dry-run works"
else
    print_failure "Clean dry-run failed" "Command returned non-zero exit code"
fi

# Test 17: Invalid SPEC ID
print_header "Testing Error Handling"
run_test "Reject invalid SPEC ID format"
if ! node dist/index.js worktree new invalid-spec "Should fail" --no-switch 2>&1 | grep -q "Invalid SPEC ID"; then
    print_failure "Should reject invalid SPEC ID" "Expected validation error"
else
    print_success "Invalid SPEC ID rejected correctly"
fi

# Test 18: Non-existent worktree
run_test "Handle non-existent worktree gracefully"
if ! node dist/index.js worktree status SPEC-NONEXISTENT-999 > /dev/null 2>&1; then
    print_success "Non-existent worktree handled gracefully"
else
    print_failure "Should error on non-existent worktree" "Command succeeded unexpectedly"
fi

# Final Summary
print_header "Test Summary"
echo -e "Total Tests:  ${BLUE}${TESTS_RUN}${NC}"
echo -e "Passed:       ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Failed:       ${RED}${TESTS_FAILED}${NC}"
echo ""

if [ "$TESTS_FAILED" -eq 0 ]; then
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✓ All E2E tests passed! Worktree system is working!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
    exit 0
else
    echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}  ✗ Some tests failed. Please review errors above.${NC}"
    echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
    exit 1
fi
