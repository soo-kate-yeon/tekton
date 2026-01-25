# 테스트 작성 가이드 (Testing Guide)

> PR #45와 같은 반복적인 실수를 방지하기 위한 체크리스트와 베스트 프랙티스

## 목차

1. [테스트 파일 작성 체크리스트](#테스트-파일-작성-체크리스트)
2. [필수 Import 가이드](#필수-import-가이드)
3. [ESLint 설정 가이드](#eslint-설정-가이드)
4. [테스트 파일 네이밍 규칙](#테스트-파일-네이밍-규칙)
5. [일반적인 실수 및 해결 방법](#일반적인-실수-및-해결-방법)
6. [로컬 검증 프로세스](#로컬-검증-프로세스)
7. [Pre-commit Hook 정보](#pre-commit-hook-정보)
8. [참고 자료](#참고-자료)

---

## 테스트 파일 작성 체크리스트

새로운 테스트 파일을 작성할 때 다음 항목을 확인하세요:

- [ ] 파일 확장자가 `.ts` 또는 `.test.ts`인가요?
- [ ] 필수 import를 모두 포함했나요? (`describe`, `it`, `expect`, `beforeEach`, `afterEach`)
- [ ] 테스트 파일이 올바른 위치에 있나요? (`tests/` 또는 `__tests__/` 디렉토리)
- [ ] 로컬에서 `pnpm lint` 검사를 실행했나요?
- [ ] 로컬에서 `pnpm test` 검사를 실행했나요?
- [ ] Pre-commit hook이 정상적으로 통과했나요?
- [ ] 모든 `if`, `for`, `while` 문에 중괄호 `{}`를 사용했나요?

---

## 필수 Import 가이드

### Vitest 기본 함수 Import

모든 vitest 테스트 파일 상단에 필요한 import를 추가하세요:

```typescript
import { describe, it, expect } from 'vitest';
```

### Lifecycle Hooks 사용 시

테스트 전후 처리가 필요한 경우 lifecycle hooks를 추가로 import 하세요:

```typescript
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
```

### 타입 테스트 시

타입 검증이 필요한 경우 `expectTypeOf`를 추가로 import 하세요:

```typescript
import { describe, it, expectTypeOf } from 'vitest';
```

### ❌ 잘못된 예시

```typescript
// Import 누락 - beforeEach is not defined 오류 발생
describe('MyTest', () => {
  beforeEach(() => {
    // setup
  });

  it('should work', () => {
    expect(true).toBe(true);
  });
});
```

### ✅ 올바른 예시

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('MyTest', () => {
  beforeEach(() => {
    // setup
  });

  it('should work', () => {
    expect(true).toBe(true);
  });
});
```

---

## ESLint 설정 가이드

이 프로젝트는 ESLint Flat Config를 사용하여 테스트 파일에 대한 특별한 규칙을 적용합니다.

### 테스트 파일 패턴

다음 패턴의 파일들은 자동으로 테스트 파일로 인식됩니다:

- `tests/**/*.ts`
- `tests/**/*.js`
- `**/*.test.ts`
- `**/*.test.js`
- `**/__tests__/*.ts`
- `**/__tests__/*.js`

### Vitest Globals 설정

`eslint.config.js`에서 테스트 파일에 대해 자동으로 globals를 설정합니다:

```javascript
{
  files: ['tests/**/*.ts', 'tests/**/*.js', '**/*.test.ts', '**/*.test.js'],
  languageOptions: {
    globals: {
      describe: 'readonly',
      it: 'readonly',
      test: 'readonly',
      beforeEach: 'readonly',
      afterEach: 'readonly',
      beforeAll: 'readonly',
      afterAll: 'readonly',
      expect: 'readonly',
      vi: 'readonly',
    },
  },
}
```

**중요**: globals 설정이 있더라도 반드시 vitest에서 함수를 import 해야 합니다.

### 테스트 파일에서 완화된 규칙

테스트 파일에서는 다음 규칙이 완화됩니다:

```javascript
rules: {
  '@typescript-eslint/no-explicit-any': 'off',  // any 타입 허용
  'no-console': 'off',                          // console.log 허용
  '@typescript-eslint/no-unused-vars': 'off',   // 미사용 변수 허용
}
```

---

## 테스트 파일 네이밍 규칙

### 파일명 형식

- **권장**: `*.test.ts` (TypeScript)
- **허용**: `*.test.js` (JavaScript)

### 디렉토리 구조

프로젝트에서 사용하는 두 가지 패턴:

1. **루트 레벨 테스트**: `tests/` 디렉토리

   ```
   tests/
   ├── types.test.ts
   └── wcag-validator.test.ts
   ```

2. **패키지 레벨 테스트**: `__tests__/` 디렉토리
   ```
   packages/core/
   ├── src/
   └── __tests__/
       ├── tokens.test.ts
       └── css-generator.test.ts
   ```

### 파일명 규칙

- 테스트 대상 파일과 동일한 이름 사용
- 예: `token-resolver.ts` → `token-resolver.test.ts`

---

## 일반적인 실수 및 해결 방법

### 문제 1: `beforeEach is not defined`

**원인**:

- vitest에서 `beforeEach` import 누락
- ESLint globals 미설정 (일반적으로 이미 설정됨)

**해결**:

```typescript
// ❌ 잘못된 예시
describe('MyTest', () => {
  beforeEach(() => {
    /* ... */
  });
});

// ✅ 올바른 예시
import { describe, it, expect, beforeEach } from 'vitest';

describe('MyTest', () => {
  beforeEach(() => {
    /* ... */
  });
});
```

---

### 문제 2: `console is not defined`

**원인**:

- 테스트 파일이 ESLint 패턴에서 제외됨
- `.js` 확장자 파일이 테스트 패턴에 포함되지 않음

**해결**:

1. 파일명이 테스트 패턴과 일치하는지 확인:
   - `tests/**/*.js`
   - `**/*.test.js`

2. `.js` 파일 대신 `.ts` 파일 사용 권장

---

### 문제 3: `Expected { after 'if' condition`

**원인**:

- ESLint `curly` 규칙 위반
- 단일 라인 if문에서 중괄호 생략

**해결**:

```typescript
// ❌ 잘못된 예시
if (condition) return true;

if (error) throw new Error('Something went wrong');

// ✅ 올바른 예시
if (condition) {
  return true;
}

if (error) {
  throw new Error('Something went wrong');
}
```

**규칙**: 모든 제어문(`if`, `for`, `while`, `do-while`)에 항상 중괄호 사용

---

### 문제 4: `'expect' is assigned a value but never used`

**원인**:

- `expect`를 import 했지만 테스트에서 사용하지 않음

**해결**:

```typescript
// ❌ 잘못된 예시
import { describe, it, expect } from 'vitest';

it('should do something', () => {
  // expect를 사용하지 않음
});

// ✅ 올바른 예시 1: expect 제거
import { describe, it } from 'vitest';

it('should do something', () => {
  // expect 없이 동작만 테스트
});

// ✅ 올바른 예시 2: expect 사용
import { describe, it, expect } from 'vitest';

it('should do something', () => {
  expect(result).toBe(true);
});
```

---

## 로컬 검증 프로세스

테스트 파일 작성 후 다음 검증 단계를 순서대로 실행하세요:

### 1. Lint 검사

```bash
# 프로젝트 전체 lint 검사
pnpm lint:all

# 또는 개별 패키지 lint 검사
pnpm lint
```

**통과 기준**: 0 errors, 0 warnings

---

### 2. 타입 검사

```bash
# TypeScript 컴파일 검사
pnpm exec tsc --build

# 또는 개별 패키지 타입 검사
pnpm exec tsc --noEmit
```

**통과 기준**: 0 type errors

---

### 3. 테스트 실행

```bash
# 전체 테스트 실행
pnpm test

# 또는 watch 모드로 실행
pnpm test:watch

# 커버리지 포함
pnpm test:coverage
```

**통과 기준**: All tests passing

---

### 4. 전체 CI 검증

```bash
# CI 파이프라인과 동일한 검증 실행
pnpm ci:test
```

**포함 내용**:

- Lint 검사
- 타입 검사
- 테스트 실행
- 빌드 검증

---

## Pre-commit Hook 정보

이 프로젝트는 Husky와 lint-staged를 사용하여 커밋 전 자동 검증을 수행합니다.

### 자동 실행 검사

커밋 시 다음이 자동으로 실행됩니다:

```bash
# .husky/pre-commit
pnpm exec lint-staged
```

**검사 내용**:

- ESLint 자동 검사 및 수정
- Prettier 자동 포맷팅
- TypeScript 타입 검사
- 변경된 파일만 검사 (성능 최적화)

### Hook 우회 방법 (권장하지 않음)

긴급한 경우에만 사용하세요:

```bash
# Pre-commit hook 우회
git commit --no-verify -m "message"
```

⚠️ **주의**: Hook을 우회하면 CI에서 실패할 수 있습니다.

### 오류 발생 시 대처 방법

#### 1. ESLint 오류

```bash
# 자동 수정 시도
pnpm lint --fix

# 수동 수정 필요 시 오류 메시지 확인
pnpm lint
```

#### 2. Prettier 오류

```bash
# 자동 포맷팅
pnpm format
```

#### 3. 타입 오류

```bash
# 타입 오류 확인
pnpm exec tsc --noEmit
```

오류를 수정한 후 다시 커밋을 시도하세요.

---

## 참고 자료

### Vitest 공식 문서

- **공식 사이트**: https://vitest.dev/
- **API Reference**: https://vitest.dev/api/
- **Configuration**: https://vitest.dev/config/

### 프로젝트 설정 파일

- **ESLint 설정**: `/Users/asleep/Developer/tekton/eslint.config.js`
- **Vitest 설정**: `/Users/asleep/Developer/tekton/vitest.config.ts`
- **Package.json**: `/Users/asleep/Developer/tekton/package.json`

### 테스트 예시 파일

프로젝트 내 참고할 만한 테스트 파일:

- **타입 테스트**: `tests/types.test.ts`
- **기능 테스트**: `tests/wcag-validator.test.ts`
- **통합 테스트**: `packages/core/__tests__/integration.test.ts`

### 추가 학습 자료

- **Testing Best Practices**: https://vitest.dev/guide/
- **TypeScript Testing**: https://vitest.dev/guide/using-typescript.html
- **Coverage Reports**: https://vitest.dev/guide/coverage.html

---

## 요약

### 핵심 체크포인트

1. ✅ 파일 확장자는 `.ts` 권장
2. ✅ 필수 import 포함 (`describe`, `it`, `expect`, lifecycle hooks)
3. ✅ 테스트 파일 위치 확인 (`tests/` 또는 `__tests__/`)
4. ✅ 모든 제어문에 중괄호 사용 (`curly: 'all'` 규칙)
5. ✅ 로컬 검증 실행 (lint → type → test)
6. ✅ Pre-commit hook 통과 확인

### 문제 발생 시

1. 오류 메시지를 자세히 읽기
2. 이 문서의 [일반적인 실수](#일반적인-실수-및-해결-방법) 섹션 확인
3. 참고 자료에서 해결 방법 검색
4. 그래도 해결되지 않으면 팀에 문의

---

**마지막 업데이트**: 2026-01-26
**관련 PR**: #45 (테스트 파일 ESLint 오류 수정)
