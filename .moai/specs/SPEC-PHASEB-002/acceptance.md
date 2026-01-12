# Acceptance Criteria: SPEC-PHASEB-002

## 개요

이 문서는 Phase B: IDE Bootstrap + Integration의 인수 기준을 정의합니다. 모든 시나리오는 Given-When-Then 형식으로 작성되며, 최소 5개의 핵심 시나리오와 엣지 케이스를 포함합니다.

---

## 핵심 시나리오 (Core Scenarios)

### 시나리오 1: Monorepo 전환 검증

**목표**: Phase A 패키지를 손실 없이 Monorepo로 전환

**Given** (초기 조건):
- 기존 모놀리식 프로젝트 구조 존재
- Phase A 패키지가 src/ 하위에 위치
  - `src/preset/`
  - `src/token-generator/`
  - `src/contracts/`
- 모든 Phase A 테스트 통과 상태 (preset 97.77%, token-generator 100%, contracts 100%)

**When** (실행 동작):
- Monorepo 전환 스크립트 실행:
  ```bash
  pnpm install
  pnpm run migrate:monorepo
  ```
- pnpm workspace 설정 적용
- Phase A 패키지를 packages/ 하위로 이동

**Then** (예상 결과):
- `pnpm-workspace.yaml` 파일 생성 확인:
  ```yaml
  packages:
    - 'packages/*'
  ```
- 패키지 구조 확인:
  - `packages/preset/` 존재
  - `packages/token-generator/` 존재
  - `packages/contracts/` 존재
- 모든 Phase A 테스트 통과 (회귀 없음):
  ```bash
  pnpm --filter @tekton/preset test        # 통과
  pnpm --filter @tekton/token-generator test # 통과
  pnpm --filter @tekton/contracts test     # 통과
  ```
- 테스트 커버리지 유지:
  - preset: ≥97.77%
  - token-generator: 100% (critical paths)
  - contracts: 100% (208 tests)
- 빌드 시간 < 10초 (3개 패키지 병렬 빌드)
- 의존성 hoisting 정상 동작 (node_modules/.pnpm)

**Performance Criteria**:
- Monorepo 전환 시간: < 30초
- 빌드 시간: < 10초
- 테스트 실행 시간: < 20초 (모든 패키지)

**Quality Gates**:
- 모든 테스트 통과율 100%
- ESLint zero errors
- TypeScript strict mode 적용

---

### 시나리오 2: CLI 스택 감지

**목표**: 프로젝트의 프레임워크, Tailwind, shadcn 설치 여부 자동 감지

**Given** (초기 조건):
- Next.js 프로젝트 존재
  - `next.config.js` 파일 존재
  - `package.json`에 `"next": "^15.0.0"` 의존성
- Tailwind CSS 설치됨
  - `tailwind.config.ts` 파일 존재
- shadcn/ui 미설치 (components.json 없음)
- CLI 패키지 빌드 완료 (`@tekton/cli`)

**When** (실행 동작):
- CLI detect 명령어 실행:
  ```bash
  tekton detect
  ```

**Then** (예상 결과):
- 프레임워크 감지 성공:
  ```
  ✓ Framework: Next.js (v15.0.0)
  ```
- Tailwind 감지 성공:
  ```
  ✓ Tailwind CSS: Installed (tailwind.config.ts)
  ```
- shadcn 감지 결과:
  ```
  ✗ shadcn/ui: Not installed
  ```
- 실행 시간 < 1초
- Exit code: 0 (성공)

**Edge Cases**:
- Config 파일이 `.js`, `.mjs`, `.ts` 등 여러 확장자로 존재하는 경우
  - 우선순위: `.ts` > `.js` > `.mjs`
- 프레임워크 감지 실패 시 (config 파일 없음):
  ```
  ✗ Framework: Not detected
  ```
- 여러 프레임워크 config 동시 존재 시:
  - 우선순위: Next.js > Vite > Remix
  - 경고 메시지 출력

**Performance Criteria**:
- 감지 시간: < 1초 (대규모 프로젝트 포함)
- 메모리 사용량: < 50MB
- CPU 사용률: < 10%

---

### 시나리오 3: shadcn 자동 설치

**목표**: shadcn/ui를 자동으로 설치하고 components.json 생성

**Given** (초기 조건):
- Next.js + Tailwind CSS 프로젝트
  - `next.config.js` 존재
  - `tailwind.config.ts` 존재
- shadcn/ui 미설치
  - `components.json` 파일 없음
- CLI 패키지 빌드 완료

**When** (실행 동작):
- CLI setup shadcn 명령어 실행:
  ```bash
  tekton setup shadcn
  ```
- Prerequisite check 통과 (Framework ✓, Tailwind ✓)
- shadcn CLI 자동 실행:
  ```bash
  npx shadcn@latest init
  ```

**Then** (예상 결과):
- shadcn CLI 실행 로그 출력:
  ```
  ✓ Checking prerequisites...
    ✓ Framework: Next.js
    ✓ Tailwind CSS: Installed
  ✓ Running shadcn init...
  ```
- `components.json` 생성 확인:
  ```json
  {
    "style": "default",
    "tailwind": {
      "config": "tailwind.config.ts",
      "css": "src/app/globals.css"
    },
    "aliases": {
      "components": "@/components",
      "utils": "@/lib/utils"
    }
  }
  ```
- 설치 완료 메시지:
  ```
  ✓ shadcn/ui installed successfully!
  ```
- Exit code: 0 (성공)

**Edge Cases**:
- shadcn 이미 설치된 경우:
  ```
  ⚠ shadcn/ui is already installed
  ```
  - Exit code: 0 (스킵)
- Framework 미감지 시:
  ```
  ✗ Framework not detected. Please ensure you are in a Next.js/Vite/Remix project.
  ```
  - Exit code: 1 (실패)
- Tailwind 미설치 시:
  ```
  ✗ Tailwind CSS not found. Please install Tailwind CSS first:
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
  ```
  - Exit code: 1 (실패)

**Performance Criteria**:
- 설치 시간: < 30초 (npm install 제외)
- Prerequisite check 시간: < 1초

---

### 시나리오 4: VS Code Extension 통합

**목표**: VS Code에서 CLI 명령어를 Command Palette를 통해 실행

**Given** (초기 조건):
- VS Code에 Tekton extension 설치 및 활성화
- Workspace에 Next.js 프로젝트 열림
- CLI 패키지가 글로벌 또는 로컬에 설치됨

**When** (실행 동작):
- Command Palette 열기 (Cmd+Shift+P 또는 Ctrl+Shift+P)
- "Tekton: Detect Stack" 명령어 실행

**Then** (예상 결과):
- CLI subprocess 실행:
  ```typescript
  execa('tekton', ['detect'], { cwd: workspace.rootPath })
  ```
- VS Code Output 패널에 결과 표시:
  ```
  [Tekton] Running: tekton detect
  [Tekton] ✓ Framework: Next.js (v15.0.0)
  [Tekton] ✓ Tailwind CSS: Installed
  [Tekton] ✗ shadcn/ui: Not installed
  [Tekton] Completed in 0.8s
  ```
- 실행 상태 표시:
  - 진행 중: Status bar에 "Detecting stack..." 표시
  - 완료: Status bar에 "✓ Detection complete" 표시 (3초 후 자동 사라짐)
- Exit code에 따른 처리:
  - 0 (성공): 정보 메시지
  - 1 (실패): 에러 메시지 표시

**Extension Commands**:
- `tekton.detectStack`: CLI `detect` 실행
- `tekton.setupShadcn`: CLI `setup shadcn` 실행
- `tekton.generateTokens`: CLI `generate` 실행

**Edge Cases**:
- CLI 미설치 시:
  ```
  ✗ Tekton CLI not found. Please install:
    npm install -g @tekton/cli
  ```
  - "Install CLI" 버튼 제공
- CLI 실행 실패 시 (exit code ≠ 0):
  - Output 패널에 stderr 표시
  - 에러 notification 표시

**Performance Criteria**:
- Subprocess 실행 시간: < 2초 (CLI 실행 시간 포함)
- Output 패널 업데이트 지연: < 100ms (실시간 스트리밍)

---

### 시나리오 5: 토큰 생성 워크플로우

**목표**: Q&A 기반으로 디자인 토큰을 생성하고 파일로 저장

**Given** (초기 조건):
- shadcn/ui 설치 완료
  - `components.json` 존재
- Next.js 프로젝트 (App Router)
- CLI 패키지 빌드 완료

**When** (실행 동작):
- CLI generate 명령어 실행:
  ```bash
  tekton generate
  ```
- Q&A 프롬프트 진행:
  1. Primary color 입력: `#3b82f6` (blue-500)
  2. Preset 선택: `Default Palette`

**Then** (예상 결과):
- Phase A token-generator 호출:
  ```typescript
  import { generateTokens } from '@tekton/token-generator';
  const tokens = await generateTokens({
    primaryColor: '#3b82f6',
    preset: 'default-palette'
  });
  ```
- CSS variables 파일 생성 (`src/app/globals.css`):
  ```css
  :root {
    --color-primary: #3b82f6;
    --color-primary-foreground: #ffffff;
    --color-secondary: #8b5cf6;
    /* ... */
  }
  ```
- Tailwind config 업데이트 (`tailwind.config.ts`):
  ```typescript
  export default {
    theme: {
      extend: {
        colors: {
          primary: 'var(--color-primary)',
          'primary-foreground': 'var(--color-primary-foreground)',
          // ...
        }
      }
    }
  };
  ```
- WCAG 검증 통과:
  ```
  ✓ WCAG validation passed (AA standard)
  ```
- 성공 메시지:
  ```
  ✓ Tokens generated successfully!
    - src/app/globals.css
    - tailwind.config.ts
  ```
- Exit code: 0 (성공)

**Edge Cases**:
- 잘못된 색상 입력 (invalid hex):
  ```
  ✗ Invalid hex color: #xyz
  ```
  - 재입력 요청
- WCAG 검증 실패:
  ```
  ⚠ Primary color contrast ratio: 2.5:1 (requires ≥4.5:1)
  ```
  - 경고 표시, 계속 여부 확인
- 기존 토큰 파일 존재 시:
  ```
  ⚠ globals.css already contains tokens. Overwrite? (y/N)
  ```
  - 사용자 확인 후 진행

**Performance Criteria**:
- 토큰 생성 시간: < 500ms (WCAG 검증 포함)
- 파일 쓰기 시간: < 100ms

**Quality Gates**:
- WCAG AA 표준 준수
- CSS variables 문법 오류 없음
- Tailwind config 유효성 검증 통과

---

## 엣지 케이스 (Edge Cases)

### EC-1: 비정상 프로젝트 구조

**Given**:
- 프로젝트 루트에 `package.json` 없음

**When**:
- `tekton detect` 실행

**Then**:
- 에러 메시지:
  ```
  ✗ Not a Node.js project (package.json not found)
  ```
- Exit code: 1

---

### EC-2: Windows Path Separator 처리

**Given**:
- Windows 환경 (path separator: `\`)
- Next.js 프로젝트: `C:\Users\user\project\`

**When**:
- `tekton detect` 실행

**Then**:
- Path 정상 처리:
  ```typescript
  import path from 'path';
  const configPath = path.join(projectRoot, 'next.config.js');
  // C:\Users\user\project\next.config.js
  ```
- 감지 결과 정상 출력

---

### EC-3: 여러 프레임워크 Config 동시 존재

**Given**:
- `next.config.js` 및 `vite.config.ts` 모두 존재

**When**:
- `tekton detect` 실행

**Then**:
- 우선순위에 따라 Next.js 선택
- 경고 메시지:
  ```
  ⚠ Multiple framework configs detected:
    - Next.js (next.config.js)
    - Vite (vite.config.ts)
  Selected: Next.js (priority)
  ```

---

### EC-4: CLI 글로벌 설치 없이 Extension 실행

**Given**:
- Tekton CLI 미설치
- VS Code extension 설치됨

**When**:
- "Tekton: Detect Stack" 실행

**Then**:
- 에러 notification:
  ```
  Tekton CLI not found
  Would you like to install it?
  [Install Globally] [Install Locally] [Cancel]
  ```
- 버튼 클릭 시 해당 명령어 실행:
  - Install Globally: `npm install -g @tekton/cli`
  - Install Locally: `npm install -D @tekton/cli`

---

### EC-5: shadcn CLI 실행 실패

**Given**:
- Network 오류로 shadcn CLI 다운로드 실패

**When**:
- `tekton setup shadcn` 실행

**Then**:
- 에러 메시지:
  ```
  ✗ Failed to run shadcn init:
    Error: connect ETIMEDOUT
  ```
- 재시도 제안:
  ```
  Would you like to retry? (y/N)
  ```

---

## 성능 기준 (Performance Criteria)

### 응답 시간

| 작업 | 목표 시간 | 측정 방법 |
|------|----------|----------|
| 스택 감지 (`tekton detect`) | < 1초 | `time tekton detect` |
| shadcn 설치 (`tekton setup shadcn`) | < 30초 | npm install 제외 |
| 토큰 생성 (`tekton generate`) | < 500ms | WCAG 검증 포함 |
| Monorepo 빌드 | < 30초 | `pnpm run build:all` |
| VS Code 명령어 응답 | < 2초 | Subprocess 포함 |

### 리소스 사용량

| 지표 | 제한 | 측정 방법 |
|------|------|----------|
| CLI 메모리 사용량 | < 50MB | `ps -o rss -p <pid>` |
| Extension 메모리 사용량 | < 30MB | VS Code Developer Tools |
| CPU 사용률 | < 10% | `top -pid <pid>` |
| 디스크 I/O | < 10MB/s | `iostat` |

---

## 품질 게이트 (Quality Gates)

### 코드 품질

- [ ] **테스트 커버리지**:
  - CLI: ≥85%
  - Extension: ≥70%
  - 측정 도구: vitest coverage

- [ ] **Linting**:
  - ESLint errors: 0
  - ESLint warnings: ≤5
  - 명령어: `pnpm run lint`

- [ ] **타입 안전성**:
  - TypeScript strict mode 활성화
  - 컴파일 에러: 0
  - 명령어: `pnpm run typecheck`

### 보안

- [ ] **의존성 취약점**:
  - Critical: 0
  - High: 0
  - Medium: ≤3
  - 명령어: `pnpm audit`

- [ ] **OWASP Top 10 검증**:
  - Injection 공격 방지 (user input sanitization)
  - Path traversal 방지 (filesystem 접근 제한)

### 문서화

- [ ] **README 업데이트**:
  - Monorepo 구조 설명
  - CLI 명령어 사용법
  - Extension 설치 가이드

- [ ] **API 문서**:
  - TypeDoc 생성
  - 모든 public API에 JSDoc 주석

- [ ] **CHANGELOG**:
  - Conventional Commits 준수
  - 버전별 변경사항 기록

---

## 크로스 플랫폼 검증

### 테스트 환경

| OS | Node.js | pnpm | VS Code |
|----|---------|------|---------|
| Windows 11 | 18.x, 20.x, 22.x | 9.15.0 | 1.95.0 |
| macOS 14 | 18.x, 20.x, 22.x | 9.15.0 | 1.95.0 |
| Ubuntu 24.04 | 18.x, 20.x, 22.x | 9.15.0 | 1.95.0 |

### 검증 항목

- [ ] CLI 명령어 실행 (detect, setup, generate)
- [ ] Path separator 처리 (Windows `\`, Unix `/`)
- [ ] Extension subprocess 실행
- [ ] 빌드 및 테스트 (CI/CD)

---

## 회귀 테스트 (Regression Tests)

### Phase A 기능 유지

Phase B Monorepo 전환 후에도 Phase A의 모든 기능이 정상 동작해야 합니다.

- [ ] **A1: Preset System**:
  - 6개 프리셋 정상 로드
  - WCAG 검증 통과
  - 테스트 ≥97.77%

- [ ] **A2: Token Generator**:
  - Q&A 워크플로우 정상 실행
  - CSS variables 생성
  - Tailwind config 생성

- [ ] **A3: Component Contracts**:
  - 8개 컴포넌트 계약 검증
  - 82개 제약조건 통과
  - 208개 테스트 통과

### 측정 방법

```bash
# Phase A 패키지별 테스트 실행
pnpm --filter @tekton/preset test
pnpm --filter @tekton/token-generator test
pnpm --filter @tekton/contracts test

# 커버리지 확인
pnpm --filter @tekton/preset test:coverage
```

---

## Definition of Done (DoD)

Phase B가 완료되었다고 판단하는 기준:

### 필수 조건 (Must Have)

- [ ] Monorepo 전환 완료 (pnpm workspace)
- [ ] CLI 3개 명령어 구현 (detect, setup, generate)
- [ ] VS Code extension 3개 명령어 구현
- [ ] 테스트 커버리지 목표 달성 (CLI ≥85%, Extension ≥70%)
- [ ] 모든 핵심 시나리오 통과 (5개)
- [ ] 크로스 플랫폼 테스트 통과 (Windows, macOS, Linux)
- [ ] 성능 기준 충족 (감지 < 1s, 설치 < 30s, 생성 < 500ms)
- [ ] 품질 게이트 통과 (ESLint, TypeScript, Security)
- [ ] Phase A 회귀 테스트 통과 (모든 기능 유지)
- [ ] 문서화 완료 (README, CLI 가이드, Extension 가이드)

### 선택 조건 (Should Have)

- [ ] Create Screen 템플릿 스캐폴딩
- [ ] 고급 스택 감지 (Nuxt, SvelteKit)
- [ ] TypeDoc API 문서 생성
- [ ] CHANGELOG 생성 (changesets)

### 검증 방법

```bash
# 1. 빌드 검증
pnpm install
pnpm run build:all

# 2. 테스트 검증
pnpm run test:all
pnpm run test:coverage

# 3. Linting 검증
pnpm run lint
pnpm run typecheck

# 4. 보안 검증
pnpm audit

# 5. CLI 기능 검증
tekton detect
tekton setup shadcn
tekton generate

# 6. Extension 검증 (VS Code)
# Command Palette에서 "Tekton" 명령어 실행
```

---

## 추가 검증 항목

### 사용자 경험 (UX)

- [ ] CLI 출력 메시지 명확성 (색상, 아이콘, 들여쓰기)
- [ ] 에러 메시지 친절성 (원인 + 해결 방법 제시)
- [ ] Extension notification 적절성 (너무 많지 않게)
- [ ] 진행 상태 표시 (progress bar, spinner)

### 접근성 (Accessibility)

- [ ] 색상 맹 지원 (아이콘 + 텍스트)
- [ ] Screen reader 호환 (VS Code extension)
- [ ] 키보드 단축키 지원 (Extension 명령어)

### 국제화 (i18n)

- [ ] 에러 메시지 영문 제공 (현재)
- [ ] 향후 다국어 지원 준비 (message catalog 구조)

---

## 참고 문서

- SPEC 문서: `spec.md`
- 구현 계획: `plan.md`
- Phase A 완료 보고서: `.moai/docs/phase-a-completion.md`
- TRUST 5 Framework: `moai-foundation-core`
- SPEC-First TDD: `moai-workflow-spec`
