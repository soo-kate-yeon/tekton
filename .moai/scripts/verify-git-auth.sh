#!/bin/bash

################################################################################
# Git Authentication Verification Script
#
# Purpose: Verify GitHub CLI and Git credential configuration
# Usage: bash .moai/scripts/verify-git-auth.sh
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Git 인증 설정 검증 스크립트${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

PASSED=0
FAILED=0

# Helper functions
pass() {
  echo -e "${GREEN}✓${NC} $1"
  ((PASSED++))
}

fail() {
  echo -e "${RED}✗${NC} $1"
  ((FAILED++))
}

warn() {
  echo -e "${YELLOW}⚠${NC} $1"
}

info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

# Test 1: GitHub CLI 설치 확인
echo "검증 1: GitHub CLI 설치"
if command -v gh &> /dev/null; then
  gh_version=$(gh --version 2>/dev/null | head -1)
  pass "GitHub CLI 설치됨: $gh_version"
else
  fail "GitHub CLI가 설치되지 않았습니다"
  echo "   설치: brew install gh"
fi
echo ""

# Test 2: GitHub CLI 인증 상태
echo "검증 2: GitHub CLI 인증"
if gh auth status > /dev/null 2>&1; then
  auth_info=$(gh auth status 2>&1)
  pass "GitHub CLI 인증됨"
  echo "$auth_info" | sed 's/^/   /'
else
  fail "GitHub CLI 미인증"
  warn "다음 명령을 실행하세요:"
  echo "   gh auth logout --hostname github.com"
  echo "   gh auth login --hostname github.com --git-protocol https --scopes repo,workflow,write:packages,admin:public_key --web"
fi
echo ""

# Test 3: Git 자격증명 헬퍼
echo "검증 3: Git 자격증명 헬퍼"
helper=$(git config --global credential.helper 2>/dev/null || echo "미설정")
if [[ "$helper" == *"gh"* ]] || [[ "$helper" == "store" ]]; then
  pass "자격증명 헬퍼 설정됨: $helper"
else
  warn "자격증명 헬퍼가 GitHub CLI로 설정되지 않음: $helper"
  echo "   권장 설정:"
  echo "   git config --global credential.helper '!/opt/homebrew/bin/gh auth git-credential'"
  echo "   git config --global credential.helper store"
fi
echo ""

# Test 4: 원격 URL 프로토콜
echo "검증 4: 원격 URL"
remote_url=$(git remote get-url origin 2>/dev/null || echo "없음")
if [[ "$remote_url" == https://* ]]; then
  pass "HTTPS 프로토콜 사용 중: $remote_url"
elif [[ "$remote_url" == git@* ]]; then
  fail "SSH 프로토콜 사용 중: $remote_url"
  warn "HTTPS로 변환하세요:"
  echo "   git remote set-url origin $(echo $remote_url | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//).git"
else
  warn "원격 URL 확인 불가: $remote_url"
fi
echo ""

# Test 5: Git Fetch 테스트
echo "검증 5: Git 연결 테스트"
if git fetch origin --dry-run > /dev/null 2>&1; then
  pass "Git fetch 성공 (자격증명 동작 확인)"
else
  fail "Git fetch 실패"
  warn "GitHub CLI 재인증이 필요합니다"
fi
echo ""

# Test 6: GitHub CLI 스코프 확인
echo "검증 6: GitHub CLI 토큰 스코프"
if gh auth status 2>&1 | grep -q "Token scopes"; then
  scopes=$(gh auth status 2>&1 | grep "Token scopes" | sed "s/.*Token scopes: //")
  echo "   현재 스코프: $scopes"

  # 필수 스코프 확인
  required_scopes=("repo" "workflow" "write:packages")
  missing=()

  for scope in "${required_scopes[@]}"; do
    if [[ "$scopes" == *"$scope"* ]]; then
      pass "필수 스코프 포함: $scope"
    else
      missing+=("$scope")
      fail "필수 스코프 누락: $scope"
    fi
  done

  if [ ${#missing[@]} -gt 0 ]; then
    warn "누락된 스코프: ${missing[*]}"
    echo "   재인증 명령:"
    echo "   gh auth logout --hostname github.com"
    echo "   gh auth login --hostname github.com --git-protocol https --scopes repo,workflow,write:packages,admin:public_key --web"
  fi
else
  warn "토큰 스코프 정보를 확인할 수 없습니다"
fi
echo ""

# Test 7: git config 확인
echo "검증 7: Git 전역 설정"
git_config=$(git config --global --list)

configs_to_check=(
  "credential.helper=store"
  "push.default=simple"
  "url.https://github.com/.insteadof=git://github.com/"
)

for config in "${configs_to_check[@]}"; do
  if echo "$git_config" | grep -q "${config%=*}"; then
    pass "설정됨: $config"
  else
    warn "권장 설정 미적용: $config"
  fi
done
echo ""

# Test 8: 현재 분기 정보
echo "검증 8: 현재 저장소 상태"
current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
if [ ! -z "$current_branch" ]; then
  pass "현재 분기: $current_branch"

  # 추적 분기 확인
  tracking=$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo "추적 없음")
  info "추적 분기: $tracking"
fi
echo ""

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}검증 결과 요약${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "통과: ${GREEN}$PASSED${NC}"
echo -e "실패: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}모든 검증 통과! 자동화 워크플로우 준비 완료.${NC}"
  exit 0
else
  echo -e "${YELLOW}일부 검증 실패. 위의 권장사항을 따르세요.${NC}"
  exit 1
fi
