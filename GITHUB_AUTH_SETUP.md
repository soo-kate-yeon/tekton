# GitHub CLI & Git 인증 설정 가이드

## 개요

이 가이드는 GitHub CLI와 Git 자격증명을 올바르게 구성하여 자동화된 Git 작업을 수행하는 방법을 설명합니다.

**설정 상태**: 부분 완료 (GitHub CLI 재인증 필요)

---

## 1단계: GitHub CLI 재인증 (필수)

### 이유

- 필수 스코프 추가: `repo`, `workflow`, `write:packages`
- 자격증명 저장소 초기화
- 토큰 만료 시간 설정

### 실행 방법

터미널에서 다음 명령을 순서대로 실행하세요:

```bash
# 1-1. 기존 GitHub 로그인 제거
gh auth logout --hostname github.com

# 1-2. 필수 스코프를 포함하여 다시 로그인
gh auth login --hostname github.com \
  --git-protocol https \
  --scopes repo,workflow,write:packages,admin:public_key \
  --web
```

### 웹 브라우저 인증

위 명령을 실행하면 **웹 브라우저가 자동으로 열립니다**:

1. GitHub 웹사이트에서 디바이스 코드를 확인하세요
2. 계정으로 로그인하세요
3. 요청된 권한을 승인하세요
4. 터미널로 돌아가세요 (자동으로 인증 완료됨)

### 인증 확인

```bash
gh auth status
```

**예상 출력**:

```
github.com
  ✓ Logged in to github.com account soo-kate-yeon (keyring)
  - Active account: true
  - Git operations protocol: https
  - Token scopes: 'admin:public_key', 'gist', 'read:org', 'repo', 'workflow', 'write:packages'
```

---

## 2단계: Git 자격증명 설정 확인

### 현재 설정 상태

다음 설정이 이미 적용되었습니다:

```bash
# GitHub CLI를 기본 자격증명 헬퍼로 설정
$ git config --global credential.helper '!/opt/homebrew/bin/gh auth git-credential'

# HTTPS 프로토콜 사용
$ git config --global url.https://github.com/.insteadOf git://github.com/

# Push 기본값 설정
$ git config --global push.default simple

# 인증 캐싱 활성화
$ git config --global credential.useHttpPath true
$ git config --global credential.helper store
```

### 설정 확인

```bash
git config --global --list | grep -E "credential|push|url"
```

**예상 출력**:

```
credential.https://github.com.helper=!/opt/homebrew/bin/gh auth git-credential
credential.usehttppath=true
credential.helper=store
url.https://github.com/.insteadof=git://github.com/
push.default=simple
```

---

## 3단계: 저장소 설정 확인

### 원격 URL 변환

SSH에서 HTTPS로 변환되었습니다:

```bash
# 변환 전: git@github.com:soo-kate-yeon/tekton.git (SSH)
# 변환 후: https://github.com/soo-kate-yeon/tekton.git (HTTPS)

$ git remote -v
origin	https://github.com/soo-kate-yeon/tekton.git (fetch)
origin	https://github.com/soo-kate-yeon/tekton.git (push)
```

### 저장소별 설정

각 저장소에서 로컬 사용자 정보를 설정할 수 있습니다 (선택사항):

```bash
# 저장소별 사용자 설정 (선택사항)
git config user.name "soo-kate-yeon"
git config user.email "soo.kate.yeon@example.com"

# 저장소별 HTTPS 자동 변환 (선택사항)
git config url."https://github.com/".insteadOf git://github.com/
```

---

## 4단계: 인증 테스트

### 테스트 1: GitHub CLI 연결 확인

```bash
gh auth status
```

**예상 결과**: 로그인 상태 확인 가능

### 테스트 2: Git Push/Pull 테스트

```bash
# 현재 분기 정보 확인
git branch -vv

# 원격 상태 확인 (인증 테스트)
git fetch origin

# 로컬과 원격 동기화 확인
git pull origin master
```

**예상 결과**: 인증 프롬프트 없이 작업 완료

### 테스트 3: PR 생성 테스트

```bash
# gh CLI를 통한 PR 목록 확인
gh pr list

# PR 생성 테스트 (현재 분기)
# gh pr create --title "테스트 PR" --body "자동화 워크플로우 테스트"
```

**예상 결과**: 인증 프롬프트 없이 명령 실행

### 테스트 4: 자동화 워크플로우 시뮬레이션

```bash
# 1. 현재 상태 확인
git status

# 2. 변경사항 스테이징 (있을 경우)
# git add .

# 3. 커밋 (선택)
# git commit -m "test: Verify authentication workflow"

# 4. 푸시
# git push origin feature/SPEC-QUALITY-001

# 5. PR 생성 (선택)
# gh pr create --base master --head feature/SPEC-QUALITY-001
```

---

## 5단계: 자동화 워크플로우 설정

### 브랜치 생성 자동화

```bash
# 새로운 피처 브랜치 생성
git checkout -b feature/SPEC-NEW-ID

# 자동으로 원격에 추적 설정하며 푸시
git push -u origin feature/SPEC-NEW-ID
```

### PR 생성 자동화

```bash
# GitHub CLI를 통한 PR 자동 생성
gh pr create \
  --base master \
  --head feature/SPEC-NEW-ID \
  --title "feat: SPEC-NEW-ID implementation" \
  --body "자동화된 워크플로우 테스트"
```

### 자동 병합 설정

```bash
# PR 자동 병합 활성화 (조건: CI 통과 + 승인)
gh pr merge <PR_NUMBER> --auto --squash

# 또는 현재 분기의 PR 자동 병합
gh pr merge --auto --squash
```

---

## 문제 해결

### 문제: "permission denied" 또는 "authentication failed"

**원인**: GitHub CLI 재인증 필요

**해결 방법**:

```bash
gh auth logout --hostname github.com
gh auth login --hostname github.com --git-protocol https --scopes repo,workflow,write:packages,admin:public_key --web
```

### 문제: "fatal: could not read Username for 'https://github.com'"

**원인**: 자격증명 헬퍼 설정 누락

**해결 방법**:

```bash
git config --global credential.helper '!/opt/homebrew/bin/gh auth git-credential'
git config --global credential.helper store
```

### 문제: SSH 키를 사용했던 경우

**원인**: SSH와 HTTPS 프로토콜 혼합

**해결 방법**:

```bash
# SSH 저장소를 HTTPS로 변환
git remote set-url origin https://github.com/soo-kate-yeon/tekton.git

# 모든 저장소에 적용
git config --global url."https://github.com/".insteadOf git@github.com:
```

### 문제: 토큰 만료

**원인**: GitHub CLI 토큰이 만료됨

**해결 방법**:

```bash
gh auth refresh --scopes repo,workflow,write:packages,admin:public_key
```

---

## 보안 모범 사례

### 1. 토큰 관리

- GitHub CLI는 자동으로 macOS Keychain에 토큰을 저장합니다
- 토큰은 **절대** Git 커밋에 포함시키지 마세요
- `.gitignore`에 민감한 파일을 추가하세요

```bash
echo ".env.local" >> .gitignore
echo "*.key" >> .gitignore
echo ".github/workflows/secrets" >> .gitignore
```

### 2. 권한 최소화

사용되지 않는 스코프는 제거하세요:

```bash
# 필수 스코프만 유지
# - repo: 저장소 접근
# - workflow: 워크플로우 트리거
# - write:packages: 패키지 배포
# - admin:public_key: SSH 키 관리
```

### 3. 정기적인 감사

```bash
# 토큰 스코프 확인
gh auth status

# 액세스 로그 확인 (GitHub 웹사이트)
# Settings > Developer settings > Personal access tokens
```

---

## 자동화 워크플로우 체크리스트

설정이 완료되려면 다음을 확인하세요:

- [ ] 1단계: GitHub CLI 재인증 완료 (`gh auth status` 확인)
- [ ] 2단계: Git 자격증명 설정 확인
- [ ] 3단계: 저장소 원격 URL이 HTTPS 사용 중
- [ ] 4단계: 인증 테스트 모두 통과
- [ ] 5단계: 자동화 워크플로우 준비 완료

### 빠른 검증 스크립트

```bash
#!/bin/bash

echo "GitHub 인증 설정 검증..."

# 1. GitHub CLI 인증 확인
echo -n "1. GitHub CLI 인증: "
if gh auth status > /dev/null 2>&1; then
  echo "✓"
else
  echo "✗ (gh auth login 필요)"
  exit 1
fi

# 2. 자격증명 헬퍼 확인
echo -n "2. 자격증명 헬퍼: "
HELPER=$(git config --global credential.helper)
if [[ "$HELPER" == *"gh"* ]] || [[ "$HELPER" == "store" ]]; then
  echo "✓"
else
  echo "✗"
  exit 1
fi

# 3. 원격 URL 프로토콜 확인
echo -n "3. 원격 URL 프로토콜: "
REMOTE=$(git remote get-url origin)
if [[ "$REMOTE" == https://* ]]; then
  echo "✓"
else
  echo "✗ (HTTPS로 변환 필요)"
  exit 1
fi

# 4. Git Fetch 테스트
echo -n "4. Git 연결 테스트: "
if git fetch origin --dry-run > /dev/null 2>&1; then
  echo "✓"
else
  echo "✗"
  exit 1
fi

echo ""
echo "모든 검증 통과! 자동화 워크플로우 준비 완료."
```

---

## 참고 자료

- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [Git Credential Helper Documentation](https://git-scm.com/book/en/v2/Git-Tools-Credential-Storage)
- [macOS Keychain Integration](https://support.apple.com/en-us/102287)

---

## 최종 설정 요약

**설정 날짜**: 2026-01-31
**사용자**: soo-kate-yeon
**저장소**: tekton
**프로토콜**: HTTPS
**자격증명 헬퍼**: GitHub CLI (osxkeychain 백엔드)
**상태**: 부분 완료 (GitHub CLI 재인증 필요)

### 다음 단계

1. 웹 브라우저에서 GitHub CLI 재인증 완료
2. `gh auth status` 실행하여 토큰 스코프 확인
3. 제공된 테스트 스크립트 실행하여 자동화 워크플로우 검증
4. `/moai:2-run` 명령으로 자동화된 Git 작업 테스트
