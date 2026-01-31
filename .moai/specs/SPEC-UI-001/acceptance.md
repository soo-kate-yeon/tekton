---
id: SPEC-UI-001
version: "1.0.0"
status: planned
created: "2026-01-31"
updated: "2026-01-31"
author: soo-kate-yeon
tags: [TAG-001, TAG-002, TAG-003, TAG-006, TAG-008, TAG-014, TAG-015]
---

# SPEC-UI-001: Acceptance Criteria

## 1. 개요

shadcn-ui Fork & Token Integration의 수락 기준을 Given-When-Then 형식으로 정의합니다.

---

## 2. 핵심 수락 시나리오

### AC-001: Token CSS Variable 바인딩

```gherkin
Feature: Token CSS Variable 바인딩
  모든 컴포넌트는 Tekton Token CSS Variable을 사용해야 한다

  Scenario: Button 컴포넌트 토큰 바인딩
    Given Button 컴포넌트가 렌더링되었을 때
    When 개발자 도구에서 computed styles를 확인하면
    Then background-color는 "var(--tekton-bg-primary)"를 참조해야 한다
    And color는 "var(--tekton-bg-primary-foreground)"를 참조해야 한다
    And border-radius는 "var(--tekton-radius-md)"를 참조해야 한다

  Scenario: 하드코딩된 값 금지
    Given 모든 컴포넌트 소스 코드를 스캔할 때
    When "#" 또는 "rgb(" 또는 "hsl(" 패턴을 검색하면
    Then 매칭되는 결과가 0개여야 한다

  Scenario: 하드코딩된 spacing 금지
    Given 모든 컴포넌트 소스 코드를 스캔할 때
    When Tailwind 클래스에서 "p-[숫자]" 또는 "m-[숫자]" (토큰 변수 제외)를 검색하면
    Then "var(--tekton-spacing-*)" 형태만 허용되어야 한다
```

### AC-002: 테마 연동 (linear-minimal-v1)

```gherkin
Feature: linear-minimal-v1 테마 연동
  기존 테마 JSON 파일을 CSS Variables로 변환하여 적용해야 한다

  Scenario: 테마 JSON → CSS Variable 변환
    Given linear-minimal-v1.json 테마 파일이 로드되었을 때
    When themeToCSS() 함수로 변환하면
    Then OKLCH 색상이 CSS oklch() 형식으로 변환되어야 한다
    And spacing 토큰이 --tekton-spacing-* 변수로 매핑되어야 한다
    And radius 토큰이 --tekton-radius-* 변수로 매핑되어야 한다

  Scenario: 테마 적용 확인
    Given linear-minimal-v1 테마가 적용된 페이지가 있을 때
    When Button 컴포넌트를 렌더링하면
    Then background-color가 테마의 brand.500 OKLCH 색상이어야 한다
    And border-radius가 테마의 radius.md 값이어야 한다

  Scenario: 컴포넌트별 테마 일관성
    Given Dialog 컴포넌트가 열려있을 때
    When linear-minimal-v1 테마가 적용되면
    Then Dialog의 overlay, content, close button 모두 테마 토큰이 적용되어야 한다
```

### AC-003: TypeScript 타입 안전성

```gherkin
Feature: TypeScript 타입 안전성
  모든 컴포넌트는 strict mode에서 컴파일되어야 한다

  Scenario: TypeScript 컴파일
    Given packages/ui 디렉토리에서
    When "tsc --noEmit" 명령을 실행하면
    Then 오류가 0개여야 한다
    And 경고가 0개여야 한다

  Scenario: TokenReference 타입 준수
    Given Token을 사용하는 모든 위치에서
    When TokenReference 타입으로 지정했을 때
    Then "var(--tekton-" 접두사가 아닌 값은 타입 오류가 발생해야 한다
```

### AC-004: 접근성

```gherkin
Feature: 접근성 (WCAG 2.1 AA)
  모든 컴포넌트는 접근성 기준을 충족해야 한다

  Scenario: 키보드 네비게이션
    Given Button, Input, Checkbox, Select 컴포넌트가 있을 때
    When Tab 키로 포커스를 이동하면
    Then 모든 인터랙티브 요소에 순서대로 포커스가 이동해야 한다
    And focus-visible 스타일이 명확하게 표시되어야 한다

  Scenario: 스크린 리더 지원
    Given Dialog 컴포넌트가 열렸을 때
    When 스크린 리더가 읽을 때
    Then role="dialog"가 적용되어야 한다
    And aria-labelledby가 제목을 참조해야 한다
    And aria-describedby가 설명을 참조해야 한다

  Scenario: axe-core 테스트
    Given 모든 컴포넌트에 대해
    When axe-core 접근성 테스트를 실행하면
    Then critical 또는 serious violation이 0개여야 한다
```

### AC-005: ScreenTemplate 시스템

```gherkin
Feature: ScreenTemplate 시스템
  화면 템플릿이 정의된 인터페이스를 따라야 한다

  Scenario: LoginTemplate 렌더링
    Given LoginTemplate이 구현되었을 때
    When 템플릿을 렌더링하면
    Then 로고 슬롯이 표시되어야 한다
    And 폼 영역에 Input, Button이 포함되어야 한다
    And 모든 컴포넌트가 토큰 바인딩을 유지해야 한다

  Scenario: DashboardTemplate 렌더링
    Given DashboardTemplate이 구현되었을 때
    When 템플릿을 렌더링하면
    Then Sidebar 영역이 표시되어야 한다
    And 메인 콘텐츠 영역이 표시되어야 한다
    And 반응형 레이아웃이 적용되어야 한다

  Scenario: 템플릿 레지스트리 조회
    Given TemplateRegistry에 템플릿이 등록되었을 때
    When getByCategory('auth')를 호출하면
    Then LoginTemplate이 포함되어야 한다
    When getByCategory('dashboard')를 호출하면
    Then DashboardTemplate이 포함되어야 한다
```

### AC-006: playground-web 연동

```gherkin
Feature: playground-web 연동
  기존 playground-web에서 새 컴포넌트가 동작해야 한다

  Scenario: 컴포넌트 import
    Given playground-web의 dashboard 페이지에서
    When "@tekton/ui"에서 Button을 import하면
    Then 컴파일 오류 없이 import되어야 한다
    And 컴포넌트가 정상적으로 렌더링되어야 한다

  Scenario: 스타일 적용
    Given playground-web에서 @tekton/ui 컴포넌트를 사용할 때
    When 페이지를 로드하면
    Then Token CSS Variable이 적용된 스타일이 표시되어야 한다
    And 기존 Tailwind 클래스와 충돌이 없어야 한다
```

---

## 3. 품질 게이트

### QG-001: 빌드 검증

| 항목 | 명령어 | 기준 |
|------|--------|------|
| TypeScript | `pnpm --filter @tekton/ui type-check` | 오류 0개 |
| Lint | `pnpm --filter @tekton/ui lint` | 경고 0개 |
| Build | `pnpm --filter @tekton/ui build` | 성공 |
| Test | `pnpm --filter @tekton/ui test` | 통과율 100% |
| Coverage | `pnpm --filter @tekton/ui test:coverage` | 85% 이상 |

### QG-002: 번들 크기

| 항목 | 기준 |
|------|------|
| 전체 번들 | 150KB 미만 (gzip) |
| 컴포넌트당 평균 | 5KB 미만 |
| Tree-shaking | 사용하지 않는 컴포넌트 제외 확인 |

### QG-003: 토큰 준수율

```bash
# 토큰 준수 검사 스크립트
#!/bin/bash
# check-token-compliance.sh

echo "Checking for hardcoded colors..."
COLORS=$(grep -rn --include="*.tsx" --include="*.ts" -E '#[0-9a-fA-F]{3,6}|rgb\(|hsl\(' src/components/ | wc -l)
if [ "$COLORS" -gt 0 ]; then
  echo "ERROR: Found $COLORS hardcoded color values"
  exit 1
fi

echo "Checking for token usage..."
TOKENS=$(grep -rn --include="*.tsx" 'var(--tekton-' src/components/ | wc -l)
echo "Found $TOKENS token references"

echo "Token compliance check passed!"
```

---

## 4. 테스트 시나리오

### 단위 테스트

```typescript
// __tests__/components/button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Button } from '../src/components/button';

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('applies token-based styles', () => {
    render(<Button>Styled</Button>);
    const button = screen.getByRole('button');
    // Token CSS Variable이 적용되었는지 확인
    expect(button.className).toMatch(/var\(--tekton-/);
  });

  it('supports all variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    variants.forEach((variant) => {
      const { container } = render(<Button variant={variant}>Test</Button>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  it('passes accessibility checks', async () => {
    const { container } = render(<Button>Accessible</Button>);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 통합 테스트

```typescript
// __tests__/templates/login.test.tsx
import { render, screen } from '@testing-library/react';
import { LoginTemplate } from '../src/templates/auth/login';
import { TemplateRegistry } from '../src/templates/registry';

describe('LoginTemplate', () => {
  it('renders all required elements', () => {
    render(<LoginTemplate />);

    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('is registered in TemplateRegistry', () => {
    const registry = new TemplateRegistry();
    registry.register(LoginTemplate.meta);

    const authTemplates = registry.getByCategory('auth');
    expect(authTemplates.some(t => t.meta.id === 'login')).toBe(true);
  });

  it('uses tokenized components', () => {
    const { container } = render(<LoginTemplate />);

    // Token CSS Variable 사용 확인
    const styles = window.getComputedStyle(container.firstChild as Element);
    // CSS Variable이 올바르게 적용되었는지 확인
    expect(container.innerHTML).toMatch(/var\(--tekton-/);
  });
});
```

### 테마 스위칭 테스트

```typescript
// __tests__/theme-switching.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../src/components/button';

describe('Theme Switching', () => {
  beforeEach(() => {
    // CSS Variables 모의 설정
    document.documentElement.style.setProperty('--tekton-bg-primary', '240 5.9% 10%');
  });

  it('responds to theme changes', () => {
    render(<Button>Theme Test</Button>);

    // Light theme
    document.documentElement.setAttribute('data-theme', 'linear-minimal');
    const lightBg = getComputedStyle(document.documentElement)
      .getPropertyValue('--tekton-bg-primary');

    // Dark theme
    document.documentElement.setAttribute('data-theme', 'linear-minimal-dark');
    const darkBg = getComputedStyle(document.documentElement)
      .getPropertyValue('--tekton-bg-primary');

    // 값이 변경되었는지 확인 (실제 테스트에서는 CSS 파일 로드 필요)
    expect(document.documentElement.getAttribute('data-theme')).toBe('linear-minimal-dark');
  });
});
```

---

## 5. Definition of Done

SPEC-UI-001이 완료되려면 다음 조건을 모두 충족해야 합니다:

### 기능 완료

- [ ] 30개 컴포넌트 토큰화 완료
- [ ] ScreenTemplate 타입 시스템 구현
- [ ] LoginTemplate 구현
- [ ] DashboardTemplate 구현
- [ ] Linear Minimal 테마 파일 생성

### 품질 기준

- [ ] TypeScript 컴파일 오류 0개
- [ ] ESLint 경고 0개
- [ ] 테스트 커버리지 85% 이상
- [ ] axe-core 접근성 violation 0개
- [ ] 토큰 준수율 100% (하드코딩 색상/spacing 0개)

### 통합 검증

- [ ] playground-web 연동 테스트 통과
- [ ] 테마 스위칭 동작 확인
- [ ] 빌드 성공 및 export 확인

### 문서화

- [ ] 컴포넌트 Props 문서화 (TSDoc)
- [ ] 사용 예제 README 작성
- [ ] 변경 사항 CHANGELOG 기록

---

## 6. 검증 체크리스트

### Phase 1 검증 (Day 2)

- [ ] `pnpm --filter @tekton/ui type-check` 통과
- [ ] `packages/ui/src/lib/tokens.ts` 파일 존재
- [ ] `packages/ui/src/lib/theme-loader.ts` 파일 존재 (linear-minimal-v1 연동)
- [ ] shadcn-ui 유틸리티 함수 (`cn()`) 동작

### Phase 2 검증 (Day 4)

- [ ] 25개 컴포넌트 파일 존재
- [ ] 각 컴포넌트 `var(--tekton-*)` 패턴 사용
- [ ] `pnpm --filter @tekton/ui test` 통과
- [ ] 커버리지 85% 이상

### Phase 3 검증 (Day 7)

- [ ] `src/templates/types.ts` 타입 정의 완료
- [ ] `src/templates/auth/login.tsx` 구현
- [ ] `src/templates/dashboard/overview.tsx` 구현
- [ ] playground-web 빌드 통과
- [ ] 테마 스위칭 수동 테스트 통과

---

## 7. 참조

- [SPEC-UI-001/spec.md](./spec.md) - 요구사항 명세
- [SPEC-UI-001/plan.md](./plan.md) - 구현 계획
- [Vitest Testing Library](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [axe-core](https://github.com/dequelabs/axe-core)
