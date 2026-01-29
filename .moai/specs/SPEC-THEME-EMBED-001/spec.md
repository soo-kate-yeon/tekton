---
id: SPEC-THEME-EMBED-001
version: "1.0.0"
status: "draft"
created: "2026-01-29"
updated: "2026-01-29"
author: "soo-kate-yeon"
priority: "high"
lifecycle: "spec-anchored"
---

# HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-29 | soo-kate-yeon | npm 패키지 내장 테마 전략 SPEC 초안 작성 |

---

# SPEC-THEME-EMBED-001: npm 패키지 내장 테마 전략

## 1. Overview

### 1.1 Purpose

이 SPEC은 `@tekton/core` 패키지에 테마 파일을 내장하여 npm 배포 시 테마를 함께 제공하는 전략을 정의합니다. 현재 테마 로더는 `.moai/themes/generated/` 디렉토리에서 테마를 로드하지만, npm 패키지로 배포되면 이 디렉토리에 접근할 수 없습니다.

**Primary Goal**: npm 패키지 내부에 테마 파일을 포함하고, `import.meta.url` 기반으로 패키지 내부 경로를 지원하여 패키지 사용자가 별도 설정 없이 테마를 사용할 수 있도록 합니다.

**Design Principle**: Zero-configuration theme access. 패키지 설치만으로 테마 사용 가능.

### 1.2 User Story

```
AS A developer installing @tekton/core via npm
I WANT to use bundled themes without additional configuration
SO THAT I can immediately apply design tokens to my components
```

**Current User Flow (Broken)**:
1. 사용자가 `npm install @tekton/core` 실행
2. `loadThemeV2("linear-minimal-v1")` 호출
3. 테마 로더가 `.moai/themes/generated/` 디렉토리 검색
4. 디렉토리가 없어서 `null` 반환
5. 테마 적용 실패

**Target User Flow (Fixed)**:
1. 사용자가 `npm install @tekton/core` 실행
2. `loadThemeV2("linear-minimal-v1")` 호출
3. 테마 로더가 패키지 내부 `themes/` 디렉토리 검색
4. 테마 JSON 로드 성공
5. 테마 적용 완료

### 1.3 Scope

**In Scope (MVP)**:
- `.moai/themes/generated/*.json` 파일을 `packages/core/themes/`로 이동
- `theme-v2.ts` 로더를 `import.meta.url` 기반으로 수정
- ESM 환경에서 패키지 내부 경로 해석 지원
- `package.json` files 필드 검증
- `npm pack` 기반 패키지 구조 검증

**Out of Scope (Future)**:
- 사용자 정의 테마 추가 기능
- 런타임 테마 동적 로드
- CJS 환경 지원 (ESM only)

### 1.4 Dependencies

**Required SPEC Dependencies**:
- **SPEC-THEME-BIND-001**: Theme Token Binding - 테마 바인딩 메커니즘

**External Resources**:
- 현재 테마 파일: `.moai/themes/generated/*.json`
- 대상 위치: `packages/core/themes/`
- 테마 로더: `packages/core/src/theme-v2.ts`

---

## 2. Environment

### 2.1 Technical Environment

- **Runtime**: Node.js 20+ / Browser (ES2022+)
- **Module System**: ESM (type: "module")
- **Language**: TypeScript 5.7+
- **Package Manager**: pnpm (monorepo)
- **Testing**: Vitest

### 2.2 Existing Architecture

```
Current State:
.moai/themes/generated/          <- 현재 테마 위치 (npm 패키지에 포함 안됨)
├── atlantic-magazine-v1.json
├── blue-bottle-v2.json
├── equinox-fitness-v1.json
└── linear-minimal-v1.json

packages/core/
├── src/
│   └── theme-v2.ts             <- process.cwd() 기반 로더
├── dist/
└── package.json                <- files: ["dist", "themes"] 이미 포함

Target State:
packages/core/
├── src/
│   └── theme-v2.ts             <- import.meta.url 기반 로더
├── themes/                     <- 테마 파일 이동 위치 (NEW)
│   ├── atlantic-magazine-v1.json
│   ├── blue-bottle-v2.json
│   ├── equinox-fitness-v1.json
│   └── linear-minimal-v1.json
├── dist/
└── package.json
```

### 2.3 Integration Points

**Input**:
- 기존 테마 JSON 파일 (`.moai/themes/generated/`)
- `theme-v2.ts` 로더 모듈

**Output**:
- 패키지 내장 테마 파일 (`packages/core/themes/`)
- ESM 호환 테마 로더 (`import.meta.url` 기반)
- 검증된 npm 패키지 구조

---

## 3. Assumptions

### 3.1 Technical Assumptions

**ASSUMPTION-001**: ESM 환경에서 `import.meta.url` 사용 가능
- **Confidence**: High - Node.js 20+ ESM 표준
- **Evidence**: TypeScript 5.7+ 및 "type": "module" 설정
- **Risk if Wrong**: CJS fallback 필요
- **Validation**: 테스트 환경에서 확인

**ASSUMPTION-002**: `new URL('./themes/', import.meta.url)` 패턴이 번들러에서 동작
- **Confidence**: High - Vite, esbuild, Node.js 지원
- **Evidence**: ESM 표준 패턴
- **Risk if Wrong**: 빌드 시점 경로 변환 필요
- **Validation**: `npm pack` 후 테스트

**ASSUMPTION-003**: package.json files 필드에 themes 디렉토리가 이미 포함됨
- **Confidence**: High - 현재 package.json 확인됨
- **Evidence**: `"files": ["dist", "themes", "README.md"]`
- **Risk if Wrong**: files 필드 수정 필요
- **Validation**: `npm pack --dry-run` 확인

### 3.2 Business Assumptions

**ASSUMPTION-004**: 기본 제공 테마 4개가 MVP에 충분함
- **Confidence**: High - 다양한 브랜드 톤 커버
- **Evidence**: atlantic-magazine, blue-bottle, equinox-fitness, linear-minimal
- **Risk if Wrong**: 추가 테마 생성 필요
- **Validation**: 사용자 피드백 수집

---

## 4. Requirements

### 4.1 Ubiquitous Requirements (Always Active)

**REQ-TE-001**: 시스템은 항상 ESM 환경에서 테마 파일에 접근할 수 있어야 한다
- **Rationale**: npm 패키지 기본 동작
- **Acceptance**: `loadThemeV2()` 호출 시 테마 로드 성공

**REQ-TE-002**: 시스템은 항상 `import.meta.url` 기반으로 패키지 내부 경로를 해석해야 한다
- **Rationale**: ESM 표준 패턴, 번들러 호환성
- **Acceptance**: 상대 경로 대신 URL 기반 경로 해석

**REQ-TE-003**: 시스템은 항상 기존 API(`loadThemeV2`, `listThemesV2`, `themeExistsV2`)를 유지해야 한다
- **Rationale**: 하위 호환성 보장
- **Acceptance**: 기존 함수 시그니처 변경 없음

### 4.2 Event-Driven Requirements (Trigger-Response)

**REQ-TE-004**: WHEN `loadThemeV2(themeId)`가 호출되면 THEN 패키지 내부 `themes/` 디렉토리에서 테마를 로드해야 한다
- **Rationale**: 핵심 기능
- **Acceptance**: 올바른 테마 JSON 반환

**REQ-TE-005**: WHEN `listThemesV2()`가 호출되면 THEN 패키지 내장 모든 테마 메타데이터를 반환해야 한다
- **Rationale**: 테마 목록 조회 기능
- **Acceptance**: 4개 테마 메타데이터 배열 반환

**REQ-TE-006**: WHEN `npm pack`이 실행되면 THEN themes 디렉토리가 패키지에 포함되어야 한다
- **Rationale**: 배포 검증
- **Acceptance**: tarball 내 themes/*.json 파일 존재

### 4.3 State-Driven Requirements (Conditional Behavior)

**REQ-TE-007**: IF 요청한 themeId가 존재하지 않으면 THEN `null`을 반환하고 경고를 출력해야 한다
- **Rationale**: 그레이스풀 디그레이데이션
- **Acceptance**: 존재하지 않는 ID에 대해 null 반환

**REQ-TE-008**: IF 테마 JSON 파싱이 실패하면 THEN 에러를 로깅하고 `null`을 반환해야 한다
- **Rationale**: 오류 복구
- **Acceptance**: 손상된 JSON에 대해 null 반환

### 4.4 Unwanted Behaviors (Prohibited Actions)

**REQ-TE-009**: 시스템은 `process.cwd()` 기반 경로 탐색을 하지 않아야 한다
- **Rationale**: npm 패키지 환경에서 동작하지 않음
- **Acceptance**: `process.cwd()` 호출 제거

**REQ-TE-010**: 시스템은 `.moai` 디렉토리 존재를 가정하지 않아야 한다
- **Rationale**: 패키지 독립성
- **Acceptance**: `.moai` 디렉토리 검색 로직 제거

**REQ-TE-011**: 시스템은 동기 파일 I/O (`readFileSync`)를 유지해야 한다
- **Rationale**: 기존 API 호환성 (비동기 전환은 breaking change)
- **Acceptance**: 동기 API 유지

### 4.5 Optional Requirements (Future Enhancement)

**REQ-TE-012**: WHERE possible, 사용자 정의 테마 디렉토리 옵션을 제공할 수 있다
- **Rationale**: 확장성
- **Acceptance**: `loadThemeV2(id, { customDir })` 옵션 시그니처

---

## 5. Technical Specifications

### 5.1 File Migration

**Source**: `.moai/themes/generated/*.json`
**Target**: `packages/core/themes/*.json`

```bash
# 마이그레이션 명령
cp -r .moai/themes/generated/* packages/core/themes/
```

파일 목록:
- `atlantic-magazine-v1.json`
- `blue-bottle-v2.json`
- `equinox-fitness-v1.json`
- `linear-minimal-v1.json`

### 5.2 Theme Loader Modification

**Before** (`process.cwd()` 기반):
```typescript
function findProjectRoot(startDir: string): string | null {
  let currentDir = startDir;
  const root = '/';
  while (currentDir !== root) {
    if (existsSync(join(currentDir, '.moai'))) {
      return currentDir;
    }
    currentDir = resolve(currentDir, '..');
  }
  return null;
}

function getThemesDir(): string | null {
  const projectRoot = findProjectRoot(process.cwd());
  if (!projectRoot) return null;
  return join(projectRoot, '.moai', 'themes', 'generated');
}
```

**After** (`import.meta.url` 기반):
```typescript
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/**
 * Get themes directory path relative to this module
 * Uses import.meta.url for ESM compatibility
 */
function getThemesDir(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  // 빌드 후: dist/theme-v2.js -> ../themes
  // 개발 시: src/theme-v2.ts -> ../themes
  return join(__dirname, '..', 'themes');
}
```

### 5.3 Directory Structure After Build

```
packages/core/ (npm package root)
├── dist/
│   ├── index.js
│   ├── index.d.ts
│   ├── theme-v2.js         <- getThemesDir()는 '../themes' 참조
│   └── theme-v2.d.ts
├── themes/                  <- npm 패키지에 포함
│   ├── atlantic-magazine-v1.json
│   ├── blue-bottle-v2.json
│   ├── equinox-fitness-v1.json
│   └── linear-minimal-v1.json
├── package.json
└── README.md
```

### 5.4 package.json Verification

현재 `files` 필드:
```json
{
  "files": [
    "dist",
    "themes",
    "README.md"
  ]
}
```

검증 명령:
```bash
cd packages/core
npm pack --dry-run
```

기대 출력에 포함되어야 할 파일:
- `dist/**`
- `themes/atlantic-magazine-v1.json`
- `themes/blue-bottle-v2.json`
- `themes/equinox-fitness-v1.json`
- `themes/linear-minimal-v1.json`
- `README.md`

### 5.5 Code Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `packages/core/src/theme-v2.ts` | MODIFY | `import.meta.url` 기반 경로 해석으로 변경 |
| `packages/core/themes/*.json` | NEW | 테마 파일 이동 (4개) |
| `.moai/themes/generated/*.json` | KEEP | 원본 유지 (개발용) |

### 5.6 Module Compatibility

**ESM (import.meta.url)**:
- Node.js 20+: 지원
- Vite: 지원
- esbuild: 지원
- webpack 5+: 지원 (output.module: true)

**CJS Fallback** (향후 필요시):
```typescript
const __dirname = typeof import.meta !== 'undefined'
  ? dirname(fileURLToPath(import.meta.url))
  : __dirname; // CJS global
```

### 5.7 Performance Considerations

- 테마 로드는 동기 I/O 유지 (`readFileSync`)
- 테마 캐싱은 현재 미구현 (향후 개선 가능)
- 4개 테마 JSON 파일 크기: 각 약 5-10KB

---

## 6. Implementation Plan

### Phase 1: 테마 파일 이동 (Priority: Critical)

**Task 1.1**: themes 디렉토리 생성 및 파일 복사
- `.moai/themes/generated/*.json` -> `packages/core/themes/`
- 4개 파일 복사

**Task 1.2**: 파일 무결성 확인
- JSON 유효성 검증
- schemaVersion 확인

### Phase 2: 테마 로더 수정 (Priority: Critical)

**Task 2.1**: `getThemesDir()` 함수 수정
- `process.cwd()` 기반 로직 제거
- `import.meta.url` 기반 경로 해석 구현

**Task 2.2**: `findProjectRoot()` 함수 제거
- 더 이상 필요 없음

**Task 2.3**: 관련 함수 업데이트
- `loadThemeV2()`: 새 경로 사용
- `listThemesV2()`: 새 경로 사용
- `themeExistsV2()`: 새 경로 사용

### Phase 3: package.json 검증 (Priority: High)

**Task 3.1**: files 필드 확인
- `themes` 디렉토리 포함 확인

**Task 3.2**: exports 필드 검토 (선택)
- themes 서브패스 export 고려

### Phase 4: 빌드 및 패키지 검증 (Priority: High)

**Task 4.1**: TypeScript 빌드
- `pnpm --filter @tekton/core build`

**Task 4.2**: npm pack 검증
- `npm pack --dry-run` 출력 확인
- themes 디렉토리 포함 확인

**Task 4.3**: 패키지 설치 테스트
- tarball 로컬 설치
- `loadThemeV2()` 동작 확인

### Phase 5: 테스트 (Priority: High)

**Task 5.1**: 단위 테스트 업데이트
- 새 경로 기반 테스트

**Task 5.2**: 통합 테스트
- 패키지 설치 후 테마 로드 테스트

---

## 7. Testing Strategy

### 7.1 Unit Tests

```typescript
describe('theme-v2 with bundled themes', () => {
  it('should load atlantic-magazine-v1 theme');
  it('should load blue-bottle-v2 theme');
  it('should load equinox-fitness-v1 theme');
  it('should load linear-minimal-v1 theme');
  it('should return null for non-existent theme');
  it('should list all 4 bundled themes');
});
```

### 7.2 Integration Tests

```typescript
describe('npm package theme integration', () => {
  it('should resolve themes from package-relative path');
  it('should work after TypeScript compilation');
});
```

### 7.3 Package Structure Tests

```bash
# npm pack 검증 스크립트
npm pack --dry-run 2>&1 | grep -E "themes/.*\.json"
# 예상: 4개 테마 파일 출력
```

---

## 8. Quality Gates

### 8.1 TRUST 5 Framework Compliance

- **Test-first**: >= 85% 테스트 커버리지
- **Readable**: JSDoc 주석, 명확한 함수명
- **Unified**: ESLint + Prettier 준수
- **Secured**: 경로 순회 공격 방지 (기존 유지)
- **Trackable**: SPEC-THEME-EMBED-001 태그

### 8.2 Acceptance Criteria Summary

- [ ] `packages/core/themes/` 디렉토리에 4개 테마 파일 존재
- [ ] `theme-v2.ts`가 `import.meta.url` 기반으로 동작
- [ ] `loadThemeV2("linear-minimal-v1")` 호출 성공
- [ ] `listThemesV2()` 호출 시 4개 테마 반환
- [ ] `npm pack --dry-run` 시 themes 디렉토리 포함
- [ ] 기존 API 시그니처 변경 없음
- [ ] TypeScript 빌드 성공
- [ ] 테스트 커버리지 >= 85%

---

## 9. Traceability

**TAG**: SPEC-THEME-EMBED-001

**Dependencies**:
- SPEC-THEME-BIND-001 (Theme Token Binding) - 테마 바인딩 메커니즘 참조

**Related Assets**:
- 원본 테마 파일: `.moai/themes/generated/`
- 대상 위치: `packages/core/themes/`
- 테마 로더: `packages/core/src/theme-v2.ts`

**Implementation Files**:
- `packages/core/src/theme-v2.ts` (MODIFY)
- `packages/core/themes/*.json` (NEW)
- `packages/core/package.json` (VERIFY)

---

**END OF SPEC**
