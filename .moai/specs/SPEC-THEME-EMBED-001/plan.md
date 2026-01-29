# SPEC-THEME-EMBED-001: Implementation Plan

**TAG**: SPEC-THEME-EMBED-001
**Priority**: HIGH
**Estimated Complexity**: Medium

---

## 1. Implementation Overview

### 1.1 Summary

npm 패키지 `@tekton/core`에 테마 파일을 내장하고, ESM 호환 로더를 구현하여 패키지 사용자가 설정 없이 테마를 사용할 수 있도록 합니다.

### 1.2 Key Changes

| Component | Change Type | Impact |
|-----------|-------------|--------|
| `packages/core/themes/` | NEW | 테마 파일 4개 추가 |
| `packages/core/src/theme-v2.ts` | MODIFY | `import.meta.url` 기반으로 변경 |
| `packages/core/package.json` | VERIFY | files 필드 확인 |

### 1.3 Technical Approach

1. **파일 마이그레이션**: `.moai/themes/generated/` -> `packages/core/themes/`
2. **로더 수정**: `process.cwd()` 기반에서 `import.meta.url` 기반으로 전환
3. **패키지 검증**: `npm pack`으로 배포 구조 확인

---

## 2. Milestones

### Milestone 1: 테마 파일 이동 (Primary Goal)

**Tasks**:

- [ ] **Task 1.1**: `packages/core/themes/` 디렉토리 생성
- [ ] **Task 1.2**: 테마 파일 복사
  - `atlantic-magazine-v1.json`
  - `blue-bottle-v2.json`
  - `equinox-fitness-v1.json`
  - `linear-minimal-v1.json`
- [ ] **Task 1.3**: JSON 유효성 검증

**Deliverables**:
- `packages/core/themes/*.json` (4개 파일)

**Verification**:
```bash
ls packages/core/themes/
# 예상: 4개 JSON 파일
```

---

### Milestone 2: 테마 로더 수정 (Primary Goal)

**Tasks**:

- [ ] **Task 2.1**: `import` 문 추가
  ```typescript
  import { fileURLToPath } from 'node:url';
  import { dirname } from 'node:path';
  ```

- [ ] **Task 2.2**: `getThemesDir()` 함수 수정
  ```typescript
  function getThemesDir(): string {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    return join(__dirname, '..', 'themes');
  }
  ```

- [ ] **Task 2.3**: `findProjectRoot()` 함수 제거
  - 더 이상 필요 없음
  - 관련 코드 정리

- [ ] **Task 2.4**: `loadThemeV2()` 함수 업데이트
  - null 체크 로직 조정 (디렉토리는 항상 존재)
  - 파일 존재 여부만 확인

- [ ] **Task 2.5**: `listThemesV2()` 함수 업데이트
  - 디렉토리 존재 체크 로직 간소화

- [ ] **Task 2.6**: `themeExistsV2()` 함수 업데이트
  - 동일한 경로 해석 로직 적용

**Deliverables**:
- 수정된 `packages/core/src/theme-v2.ts`

**Verification**:
```bash
# TypeScript 컴파일 성공
pnpm --filter @tekton/core build
```

---

### Milestone 3: package.json 검증 (Secondary Goal)

**Tasks**:

- [ ] **Task 3.1**: files 필드 확인
  - `"themes"` 포함 여부 검증

- [ ] **Task 3.2**: (Optional) exports 필드 검토
  ```json
  {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts"
      },
      "./themes/*.json": "./themes/*.json"
    }
  }
  ```

**Deliverables**:
- 검증된 `packages/core/package.json`

---

### Milestone 4: 빌드 및 패키지 검증 (Secondary Goal)

**Tasks**:

- [ ] **Task 4.1**: TypeScript 빌드
  ```bash
  pnpm --filter @tekton/core build
  ```

- [ ] **Task 4.2**: npm pack dry-run
  ```bash
  cd packages/core
  npm pack --dry-run
  ```

- [ ] **Task 4.3**: tarball 구조 검증
  - themes/*.json 파일 포함 확인
  - dist/*.js 파일 포함 확인

- [ ] **Task 4.4**: 로컬 설치 테스트
  ```bash
  npm pack
  # 다른 디렉토리에서
  npm install /path/to/tekton-core-0.1.0.tgz
  ```

**Deliverables**:
- 검증된 npm 패키지 구조

**Verification**:
```bash
npm pack --dry-run 2>&1 | grep themes
# 예상: themes/atlantic-magazine-v1.json 등 출력
```

---

### Milestone 5: 테스트 작성 및 실행 (Final Goal)

**Tasks**:

- [ ] **Task 5.1**: 단위 테스트 업데이트
  - 새 경로 기반 테스트 작성
  - 모든 4개 테마 로드 테스트

- [ ] **Task 5.2**: 테스트 실행
  ```bash
  pnpm --filter @tekton/core test
  ```

- [ ] **Task 5.3**: 커버리지 확인
  ```bash
  pnpm --filter @tekton/core test:coverage
  # 목표: >= 85%
  ```

**Deliverables**:
- 테스트 통과 (>= 85% 커버리지)

---

## 3. Technical Details

### 3.1 Path Resolution Logic

**Development Environment (src/)**:
```
packages/core/src/theme-v2.ts
       │
       ├── import.meta.url = "file:///path/to/packages/core/src/theme-v2.ts"
       │
       └── getThemesDir() = "../themes" = "/path/to/packages/core/themes"
```

**Production Environment (dist/)**:
```
packages/core/dist/theme-v2.js
       │
       ├── import.meta.url = "file:///path/to/packages/core/dist/theme-v2.js"
       │
       └── getThemesDir() = "../themes" = "/path/to/packages/core/themes"
```

### 3.2 Error Handling

```typescript
export function loadThemeV2(themeId: string): ThemeV2 | null {
  // 보안: 경로 순회 공격 방지
  if (!themeId || !/^[a-z0-9-]+$/.test(themeId)) {
    return null;
  }

  const themesDir = getThemesDir();
  const themePath = join(themesDir, `${themeId}.json`);

  if (!existsSync(themePath)) {
    console.warn(`Theme "${themeId}" not found in bundled themes`);
    return null;
  }

  try {
    const content = readFileSync(themePath, 'utf-8');
    const theme = JSON.parse(content) as ThemeV2;

    if (theme.schemaVersion !== '2.1') {
      console.warn(`Theme ${themeId} has invalid schema version: ${theme.schemaVersion}`);
      return null;
    }

    return theme;
  } catch (error) {
    console.error(`Failed to load theme ${themeId}:`, error);
    return null;
  }
}
```

### 3.3 TypeScript Configuration

`packages/core/tsconfig.json` 확인 사항:
```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2022"
  }
}
```

---

## 4. Risk Assessment

### 4.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| `import.meta.url` 번들러 호환성 | Low | High | Vite, esbuild 테스트 |
| 상대 경로 해석 오류 | Medium | High | 빌드 후 테스트 |
| 테마 파일 누락 | Low | Medium | npm pack 검증 |

### 4.2 Rollback Plan

문제 발생 시:
1. `theme-v2.ts` 변경 revert
2. `packages/core/themes/` 디렉토리 제거
3. 기존 `.moai/themes/generated/` 경로 사용

---

## 5. Dependencies

### 5.1 External Dependencies

- Node.js 20+ (ESM 지원)
- TypeScript 5.7+ (import.meta 지원)

### 5.2 Internal Dependencies

- SPEC-THEME-BIND-001 (테마 바인딩 메커니즘)

---

## 6. Acceptance Checklist

- [ ] `packages/core/themes/` 디렉토리 생성됨
- [ ] 4개 테마 파일 복사 완료
- [ ] `theme-v2.ts` `import.meta.url` 기반으로 수정됨
- [ ] `findProjectRoot()` 함수 제거됨
- [ ] TypeScript 빌드 성공
- [ ] `npm pack --dry-run` 시 themes 포함 확인
- [ ] `loadThemeV2("linear-minimal-v1")` 정상 동작
- [ ] `listThemesV2()` 4개 테마 반환
- [ ] 테스트 커버리지 >= 85%
- [ ] 기존 API 호환성 유지

---

**TAG**: SPEC-THEME-EMBED-001
