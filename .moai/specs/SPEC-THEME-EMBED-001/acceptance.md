# SPEC-THEME-EMBED-001: Acceptance Criteria

**TAG**: SPEC-THEME-EMBED-001
**Priority**: HIGH

---

## 1. Test Scenarios (Given-When-Then)

### 1.1 Theme Loading Scenarios

#### Scenario 1: 번들된 테마 로드 성공

```gherkin
Feature: 번들된 테마 로드
  AS A developer using @tekton/core
  I WANT to load bundled themes
  SO THAT I can apply design tokens

  Scenario: linear-minimal-v1 테마 로드
    Given @tekton/core 패키지가 설치되어 있음
    And packages/core/themes/linear-minimal-v1.json 파일이 존재함
    When loadThemeV2("linear-minimal-v1") 함수를 호출함
    Then ThemeV2 객체가 반환됨
    And theme.id가 "linear-minimal-v1"임
    And theme.schemaVersion이 "2.1"임

  Scenario: atlantic-magazine-v1 테마 로드
    Given @tekton/core 패키지가 설치되어 있음
    When loadThemeV2("atlantic-magazine-v1") 함수를 호출함
    Then ThemeV2 객체가 반환됨
    And theme.id가 "atlantic-magazine-v1"임

  Scenario: blue-bottle-v2 테마 로드
    Given @tekton/core 패키지가 설치되어 있음
    When loadThemeV2("blue-bottle-v2") 함수를 호출함
    Then ThemeV2 객체가 반환됨
    And theme.id가 "blue-bottle-v2"임

  Scenario: equinox-fitness-v1 테마 로드
    Given @tekton/core 패키지가 설치되어 있음
    When loadThemeV2("equinox-fitness-v1") 함수를 호출함
    Then ThemeV2 객체가 반환됨
    And theme.id가 "equinox-fitness-v1"임
```

#### Scenario 2: 존재하지 않는 테마 처리

```gherkin
  Scenario: 존재하지 않는 테마 요청
    Given @tekton/core 패키지가 설치되어 있음
    When loadThemeV2("non-existent-theme") 함수를 호출함
    Then null이 반환됨
    And 콘솔에 경고 메시지가 출력됨
```

#### Scenario 3: 잘못된 테마 ID 형식

```gherkin
  Scenario: 경로 순회 공격 시도
    Given @tekton/core 패키지가 설치되어 있음
    When loadThemeV2("../../../etc/passwd") 함수를 호출함
    Then null이 반환됨
    And 파일 시스템 접근이 발생하지 않음

  Scenario: 빈 문자열 테마 ID
    Given @tekton/core 패키지가 설치되어 있음
    When loadThemeV2("") 함수를 호출함
    Then null이 반환됨
```

---

### 1.2 Theme Listing Scenarios

```gherkin
Feature: 테마 목록 조회
  AS A developer
  I WANT to list all available themes
  SO THAT I can discover bundled themes

  Scenario: 모든 번들 테마 목록 조회
    Given @tekton/core 패키지가 설치되어 있음
    When listThemesV2() 함수를 호출함
    Then ThemeMetaV2 배열이 반환됨
    And 배열 길이가 4임
    And 배열에 "linear-minimal-v1" 테마가 포함됨
    And 배열에 "atlantic-magazine-v1" 테마가 포함됨
    And 배열에 "blue-bottle-v2" 테마가 포함됨
    And 배열에 "equinox-fitness-v1" 테마가 포함됨
```

---

### 1.3 Theme Existence Check Scenarios

```gherkin
Feature: 테마 존재 확인
  AS A developer
  I WANT to check if a theme exists
  SO THAT I can validate user input

  Scenario: 존재하는 테마 확인
    Given @tekton/core 패키지가 설치되어 있음
    When themeExistsV2("linear-minimal-v1") 함수를 호출함
    Then true가 반환됨

  Scenario: 존재하지 않는 테마 확인
    Given @tekton/core 패키지가 설치되어 있음
    When themeExistsV2("non-existent") 함수를 호출함
    Then false가 반환됨
```

---

### 1.4 Package Structure Scenarios

```gherkin
Feature: npm 패키지 구조 검증
  AS A package maintainer
  I WANT to verify package structure
  SO THAT themes are included in distribution

  Scenario: npm pack 시 themes 디렉토리 포함
    Given packages/core/themes/ 디렉토리에 4개 테마 파일이 있음
    And package.json files 필드에 "themes"가 포함됨
    When npm pack --dry-run 명령을 실행함
    Then 출력에 "themes/atlantic-magazine-v1.json"이 포함됨
    And 출력에 "themes/blue-bottle-v2.json"이 포함됨
    And 출력에 "themes/equinox-fitness-v1.json"이 포함됨
    And 출력에 "themes/linear-minimal-v1.json"이 포함됨

  Scenario: tarball 설치 후 테마 로드
    Given npm pack 명령으로 tarball이 생성됨
    And 다른 프로젝트에서 tarball을 설치함
    When loadThemeV2("linear-minimal-v1") 함수를 호출함
    Then ThemeV2 객체가 반환됨
```

---

### 1.5 Build Scenarios

```gherkin
Feature: TypeScript 빌드 검증
  AS A developer
  I WANT to verify build success
  SO THAT the package is ready for distribution

  Scenario: TypeScript 컴파일 성공
    Given theme-v2.ts 파일이 import.meta.url을 사용함
    When pnpm --filter @tekton/core build 명령을 실행함
    Then 빌드가 성공함
    And dist/theme-v2.js 파일이 생성됨
    And dist/theme-v2.d.ts 파일이 생성됨

  Scenario: ESLint 검증 통과
    Given theme-v2.ts 파일이 수정됨
    When pnpm --filter @tekton/core lint 명령을 실행함
    Then 린트 에러가 없음
```

---

## 2. Unit Test Specifications

### 2.1 loadThemeV2 Tests

```typescript
describe('loadThemeV2', () => {
  describe('성공 케이스', () => {
    it('should load linear-minimal-v1 theme', () => {
      const theme = loadThemeV2('linear-minimal-v1');
      expect(theme).not.toBeNull();
      expect(theme?.id).toBe('linear-minimal-v1');
      expect(theme?.schemaVersion).toBe('2.1');
    });

    it('should load atlantic-magazine-v1 theme', () => {
      const theme = loadThemeV2('atlantic-magazine-v1');
      expect(theme).not.toBeNull();
      expect(theme?.id).toBe('atlantic-magazine-v1');
    });

    it('should load blue-bottle-v2 theme', () => {
      const theme = loadThemeV2('blue-bottle-v2');
      expect(theme).not.toBeNull();
      expect(theme?.id).toBe('blue-bottle-v2');
    });

    it('should load equinox-fitness-v1 theme', () => {
      const theme = loadThemeV2('equinox-fitness-v1');
      expect(theme).not.toBeNull();
      expect(theme?.id).toBe('equinox-fitness-v1');
    });
  });

  describe('실패 케이스', () => {
    it('should return null for non-existent theme', () => {
      const theme = loadThemeV2('non-existent');
      expect(theme).toBeNull();
    });

    it('should return null for empty string', () => {
      const theme = loadThemeV2('');
      expect(theme).toBeNull();
    });

    it('should return null for path traversal attempt', () => {
      const theme = loadThemeV2('../../../etc/passwd');
      expect(theme).toBeNull();
    });

    it('should return null for special characters', () => {
      const theme = loadThemeV2('theme/with/slashes');
      expect(theme).toBeNull();
    });
  });
});
```

### 2.2 listThemesV2 Tests

```typescript
describe('listThemesV2', () => {
  it('should return array of 4 themes', () => {
    const themes = listThemesV2();
    expect(themes).toHaveLength(4);
  });

  it('should include all bundled theme IDs', () => {
    const themes = listThemesV2();
    const ids = themes.map(t => t.id);

    expect(ids).toContain('linear-minimal-v1');
    expect(ids).toContain('atlantic-magazine-v1');
    expect(ids).toContain('blue-bottle-v2');
    expect(ids).toContain('equinox-fitness-v1');
  });

  it('should return valid ThemeMetaV2 objects', () => {
    const themes = listThemesV2();

    for (const theme of themes) {
      expect(theme).toHaveProperty('id');
      expect(theme).toHaveProperty('name');
      expect(theme).toHaveProperty('brandTone');
      expect(theme).toHaveProperty('schemaVersion');
    }
  });
});
```

### 2.3 themeExistsV2 Tests

```typescript
describe('themeExistsV2', () => {
  it('should return true for existing themes', () => {
    expect(themeExistsV2('linear-minimal-v1')).toBe(true);
    expect(themeExistsV2('atlantic-magazine-v1')).toBe(true);
    expect(themeExistsV2('blue-bottle-v2')).toBe(true);
    expect(themeExistsV2('equinox-fitness-v1')).toBe(true);
  });

  it('should return false for non-existent theme', () => {
    expect(themeExistsV2('non-existent')).toBe(false);
  });

  it('should return false for invalid theme ID', () => {
    expect(themeExistsV2('')).toBe(false);
    expect(themeExistsV2('../hack')).toBe(false);
  });
});
```

---

## 3. Integration Test Specifications

### 3.1 Package Installation Test

```typescript
describe('Package Integration', () => {
  it('should work after npm install', async () => {
    // 이 테스트는 실제 패키지 설치 후 실행
    const { loadThemeV2 } = await import('@tekton/core');
    const theme = loadThemeV2('linear-minimal-v1');

    expect(theme).not.toBeNull();
    expect(theme?.tokens).toBeDefined();
  });
});
```

### 3.2 Path Resolution Test

```typescript
describe('Path Resolution', () => {
  it('should resolve themes from import.meta.url', () => {
    // getThemesDir() 내부 동작 검증
    const theme = loadThemeV2('linear-minimal-v1');
    expect(theme).not.toBeNull();
  });

  it('should work in dist/ directory after build', () => {
    // 빌드 후 dist/theme-v2.js에서 호출 시 동작 검증
    const theme = loadThemeV2('linear-minimal-v1');
    expect(theme).not.toBeNull();
  });
});
```

---

## 4. Quality Gates

### 4.1 Code Quality

| Metric | Target | Current |
|--------|--------|---------|
| Test Coverage | >= 85% | TBD |
| ESLint Errors | 0 | TBD |
| TypeScript Errors | 0 | TBD |

### 4.2 Package Quality

| Check | Status |
|-------|--------|
| npm pack includes themes/ | [ ] |
| tarball size reasonable (< 100KB) | [ ] |
| No dev dependencies in bundle | [ ] |

### 4.3 API Compatibility

| Function | Signature Preserved |
|----------|-------------------|
| loadThemeV2(themeId: string): ThemeV2 \| null | [ ] |
| listThemesV2(): ThemeMetaV2[] | [ ] |
| themeExistsV2(themeId: string): boolean | [ ] |

---

## 5. Definition of Done

### 5.1 Development Complete

- [ ] `packages/core/themes/` 디렉토리 생성
- [ ] 4개 테마 파일 복사 완료
- [ ] `theme-v2.ts` 수정 완료
- [ ] `findProjectRoot()` 함수 제거
- [ ] TypeScript 빌드 성공

### 5.2 Testing Complete

- [ ] 모든 단위 테스트 통과
- [ ] 통합 테스트 통과
- [ ] 커버리지 >= 85%

### 5.3 Package Validation

- [ ] `npm pack --dry-run` 검증 완료
- [ ] tarball 설치 테스트 성공
- [ ] 외부 프로젝트에서 테마 로드 성공

### 5.4 Documentation

- [ ] 코드 주석 업데이트
- [ ] README 변경사항 반영 (필요시)

---

## 6. Verification Commands

```bash
# 1. 빌드 검증
pnpm --filter @tekton/core build

# 2. 테스트 실행
pnpm --filter @tekton/core test

# 3. 커버리지 확인
pnpm --filter @tekton/core test:coverage

# 4. 린트 검증
pnpm --filter @tekton/core lint

# 5. 패키지 구조 검증
cd packages/core && npm pack --dry-run

# 6. 테마 파일 확인
ls -la packages/core/themes/
```

---

**TAG**: SPEC-THEME-EMBED-001
