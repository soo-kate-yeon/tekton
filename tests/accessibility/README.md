# 접근성 테스트 가이드

SPEC-PLAYGROUND-001의 WCAG 2.1 AA 규정 준수를 위한 접근성 테스트 인프라입니다.

## 개요

이 디렉토리는 **axe-core**와 **Playwright**를 사용하여 자동화된 접근성 테스트를 제공합니다.

### 주요 기능

- ✅ WCAG 2.1 Level A 및 AA 준수 검증
- ✅ 색상 대비 자동 검사 (4.5:1 이상)
- ✅ 키보드 네비게이션 접근성 검증
- ✅ ARIA 레이블 및 역할 검증
- ✅ 의미론적 HTML 구조 검사
- ✅ 폼 접근성 검증
- ✅ 이미지 대체 텍스트 검증

## 설치

필요한 의존성은 이미 설치되어 있습니다:

```bash
pnpm install
```

### Playwright 브라우저 설치 (최초 1회)

```bash
npx playwright install chromium
```

## 사용법

### 접근성 테스트 실행

```bash
# 모든 접근성 테스트 실행
pnpm test:a11y

# UI 모드로 테스트 실행 (인터랙티브)
pnpm test:a11y:ui

# 디버그 모드로 테스트 실행
pnpm test:a11y:debug

# 테스트 리포트 보기
pnpm test:a11y:report
```

### 특정 테스트만 실행

```bash
# 색상 대비 테스트만 실행
npx playwright test --grep "색상 대비"

# 키보드 네비게이션 테스트만 실행
npx playwright test --grep "키보드 네비게이션"
```

### 특정 브라우저에서 실행

```bash
# Chromium에서만 실행
npx playwright test --project=chromium

# Firefox에서 실행 (설정 필요)
npx playwright test --project=firefox
```

## 테스트 구조

### wcag.test.ts

WCAG 2.1 AA 규정 준수를 검증하는 핵심 테스트 파일입니다.

#### 포함된 테스트 케이스

1. **샘플 페이지 접근성 검사**
   - 전체적인 WCAG 2.1 AA 준수 검증
   - 기본 페이지 구조 검사

2. **색상 대비 검사**
   - 일반 텍스트: 최소 4.5:1 대비
   - 큰 텍스트: 최소 3:1 대비

3. **키보드 네비게이션 접근성**
   - 모든 인터랙티브 요소의 키보드 접근성
   - 논리적인 탭 순서

4. **ARIA 레이블 및 역할 검증**
   - 적절한 ARIA 속성 사용
   - 역할 및 상태 관리

5. **폼 접근성 검증**
   - 레이블과 입력 필드 연결
   - 오류 메시지 및 도움말 텍스트

6. **의미론적 HTML 구조 검증**
   - 적절한 HTML5 시맨틱 요소 사용
   - 올바른 헤딩 계층 구조

7. **이미지 대체 텍스트 검증**
   - 모든 이미지의 대체 텍스트
   - 장식용 이미지의 적절한 처리

## WCAG 2.1 AA 준수 기준

### 색상 대비

- **일반 텍스트**: 최소 4.5:1
- **큰 텍스트** (18pt 이상 또는 14pt 볼드): 최소 3:1
- **UI 컴포넌트 및 그래픽**: 최소 3:1

### 키보드 접근성

- 모든 기능이 키보드로 접근 가능
- 포커스 표시자가 명확히 보임
- 논리적인 탭 순서

### ARIA 사용

- 적절한 역할(role) 지정
- 레이블과 설명 제공
- 상태 및 속성 관리

### 의미론적 HTML

- 적절한 HTML5 시맨틱 요소 사용
- 올바른 헤딩 계층 (h1 → h2 → h3)
- 랜드마크 영역 (header, nav, main, footer)

## axe-core 규칙

### 사용 중인 태그

- `wcag2a`: WCAG 2.0 Level A
- `wcag2aa`: WCAG 2.0 Level AA
- `wcag21a`: WCAG 2.1 Level A
- `wcag21aa`: WCAG 2.1 Level AA
- `best-practice`: 접근성 모범 사례

### 주요 검사 항목

| 규칙 ID          | 설명               | WCAG 기준    |
| ---------------- | ------------------ | ------------ |
| `color-contrast` | 색상 대비 검사     | 1.4.3 (AA)   |
| `label`          | 폼 레이블 검사     | 1.3.1, 4.1.2 |
| `aria-*`         | ARIA 속성 검증     | 4.1.2        |
| `heading-order`  | 헤딩 순서 검사     | 1.3.1        |
| `image-alt`      | 이미지 대체 텍스트 | 1.1.1        |
| `landmark-*`     | 랜드마크 영역 검사 | 1.3.1        |

## 테스트 작성 가이드

### 새로운 접근성 테스트 추가

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('새로운 접근성 테스트', async ({ page }) => {
  // 1. 테스트할 페이지 로드
  await page.goto('http://localhost:3000/your-page');

  // 2. axe-core로 검사 수행
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  // 3. 위반 사항 검증
  expect(results.violations).toEqual([]);
});
```

### 특정 규칙만 검사

```typescript
// 특정 규칙만 활성화
const results = await new AxeBuilder({ page }).withRules(['color-contrast', 'label']).analyze();

// 특정 규칙 비활성화
const results = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
```

### 특정 요소만 검사

```typescript
// CSS 선택자로 특정 요소만 검사
const results = await new AxeBuilder({ page }).include('#main-content').analyze();

// 특정 요소 제외
const results = await new AxeBuilder({ page }).exclude('.third-party-widget').analyze();
```

## CI/CD 통합

### GitHub Actions 예시

```yaml
name: Accessibility Tests

on: [push, pull_request]

jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run accessibility tests
        run: pnpm test:a11y

      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

## 문제 해결

### 테스트 실패 시

1. **리포트 확인**

   ```bash
   pnpm test:a11y:report
   ```

2. **디버그 모드로 실행**

   ```bash
   pnpm test:a11y:debug
   ```

3. **스크린샷 확인**
   - 실패한 테스트의 스크린샷은 `test-results/` 디렉토리에 저장됩니다.

### 일반적인 접근성 문제

1. **색상 대비 부족**
   - 해결: 더 어두운 색상을 사용하거나 배경색 조정
   - 도구: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

2. **누락된 레이블**
   - 해결: `<label>` 요소 추가 또는 `aria-label` 속성 사용

3. **잘못된 헤딩 순서**
   - 해결: 헤딩 레벨을 건너뛰지 말고 순차적으로 사용

4. **키보드 접근 불가**
   - 해결: `tabindex="0"` 추가 또는 네이티브 포커스 가능 요소 사용

## 추가 리소스

### 공식 문서

- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### 유용한 도구

- [axe DevTools Browser Extension](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Lighthouse (Chrome DevTools)](https://developers.google.com/web/tools/lighthouse)

### 학습 자료

- [A11y Project](https://www.a11yproject.com/)
- [WebAIM Resources](https://webaim.org/resources/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## 라이선스

이 테스트 인프라는 프로젝트와 동일한 라이선스를 따릅니다.

---

**SPEC-PLAYGROUND-001 U-003 요구사항 준수**
이 접근성 테스트 인프라는 WCAG 2.1 AA 규정 준수를 자동으로 검증합니다.
