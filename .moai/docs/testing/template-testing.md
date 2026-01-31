# 템플릿 테스팅 가이드

Screen Template 시스템의 테스트 전략, 테스트 작성 가이드, 품질 보증 프로세스를 설명합니다.

## 목차

1. [테스트 전략](#테스트-전략)
2. [테스트 환경 설정](#테스트-환경-설정)
3. [단위 테스트](#단위-테스트)
4. [통합 테스트](#통합-테스트)
5. [접근성 테스트](#접근성-테스트)
6. [성능 테스트](#성능-테스트)
7. [커버리지 관리](#커버리지-관리)

---

## 테스트 전략

### 테스트 피라미드

```
         ┌─────────────┐
         │  E2E Tests  │  < 5%
         │  (Cypress)  │
         └─────────────┘
       ┌───────────────────┐
       │ Integration Tests │  15%
       │   (Vitest + RTL)  │
       └───────────────────┘
     ┌─────────────────────────┐
     │     Unit Tests          │  80%
     │   (Vitest + RTL)        │
     └─────────────────────────┘
```

**비율 목표:**
- Unit Tests: 80% (497개 중 ~398개)
- Integration Tests: 15% (~75개)
- E2E Tests: 5% (~24개)

### 품질 목표

| 메트릭 | 목표 | 현재 | 상태 |
|--------|------|------|------|
| 테스트 통과율 | 100% | 100% (497/497) | ✅ |
| Statement Coverage | 95%+ | 91.72% | ⚠️ |
| Branch Coverage | 90%+ | 95.52% | ✅ |
| Function Coverage | 100% | 100% | ✅ |
| Line Coverage | 95%+ | 91.72% | ⚠️ |

**Phase 4 목표:** Statement/Line Coverage를 95%+로 향상

---

## 테스트 환경 설정

### 필수 도구

```json
{
  "devDependencies": {
    "vitest": "^2.1.8",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "vitest-axe": "^1.0.0",
    "jsdom": "^25.0.1"
  }
}
```

### Vitest 설정

`vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**',
        'src/index.ts',
      ],
      thresholds: {
        statements: 95,
        branches: 90,
        functions: 100,
        lines: 95,
      },
    },
  },
});
```

### 테스트 Setup

`vitest.setup.ts`:

```typescript
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { toHaveNoViolations } from 'vitest-axe/matchers';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// Extend matchers
expect.extend(matchers);
expect.extend(toHaveNoViolations);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

---

## 단위 테스트

### 1. 템플릿 메타데이터 테스트

메타데이터 정합성을 검증합니다.

```typescript
import { describe, it, expect } from 'vitest';
import { LoginTemplate } from '../auth/login';

describe('LoginTemplate Metadata', () => {
  it('has valid metadata structure', () => {
    expect(LoginTemplate.meta).toBeDefined();
    expect(LoginTemplate.meta.id).toBe('login-minimal');
    expect(LoginTemplate.meta.name).toBe('Minimal Login');
    expect(LoginTemplate.meta.category).toBe('auth');
    expect(LoginTemplate.meta.tags).toContain('login');
    expect(LoginTemplate.meta.supportedThemes).toContain('*');
  });

  it('has unique template ID', () => {
    // ID는 kebab-case 형식
    expect(LoginTemplate.meta.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('has descriptive tags', () => {
    // 최소 2개 이상의 태그
    expect(LoginTemplate.meta.tags.length).toBeGreaterThanOrEqual(2);
  });
});
```

### 2. 레이아웃 설정 테스트

레이아웃 구성을 검증합니다.

```typescript
describe('LoginTemplate Layout', () => {
  it('has valid layout configuration', () => {
    expect(LoginTemplate.layout.type).toBe('centered');
    expect(LoginTemplate.layout.maxWidth).toBe('sm');
  });

  it('uses CSS Variables for spacing', () => {
    const { padding, gap } = LoginTemplate.layout;

    if (padding) {
      expect(padding).toMatch(/var\(--tekton-/);
    }

    if (gap) {
      expect(gap).toMatch(/var\(--tekton-/);
    }
  });
});
```

### 3. 슬롯 정의 테스트

슬롯 구조를 검증합니다.

```typescript
describe('LoginTemplate Slots', () => {
  it('defines all slots', () => {
    expect(LoginTemplate.slots).toBeDefined();
    expect(LoginTemplate.slots.length).toBeGreaterThan(0);
  });

  it('has valid slot structure', () => {
    LoginTemplate.slots.forEach(slot => {
      expect(slot.id).toBeDefined();
      expect(slot.name).toBeDefined();
      expect(typeof slot.required).toBe('boolean');
    });
  });

  it('uses camelCase for slot IDs', () => {
    LoginTemplate.slots.forEach(slot => {
      expect(slot.id).toMatch(/^[a-z][a-zA-Z0-9]*$/);
    });
  });
});
```

### 4. 컴포넌트 렌더링 테스트

React 컴포넌트 렌더링을 검증합니다.

```typescript
import { render, screen } from '@testing-library/react';

describe('LoginTemplate Component', () => {
  it('renders without slots', () => {
    const { Component } = LoginTemplate;
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
  });

  it('renders with branding slot', () => {
    const { Component } = LoginTemplate;

    render(
      <Component
        slots={{
          branding: <div data-testid="branding">Logo</div>,
        }}
      />
    );

    expect(screen.getByTestId('branding')).toBeInTheDocument();
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('renders with footer slot', () => {
    const { Component } = LoginTemplate;

    render(
      <Component
        slots={{
          footer: <div data-testid="footer">Footer</div>,
        }}
      />
    );

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders with multiple slots', () => {
    const { Component } = LoginTemplate;

    render(
      <Component
        slots={{
          branding: <div data-testid="branding">Logo</div>,
          footer: <div data-testid="footer">Footer</div>,
        }}
      />
    );

    expect(screen.getByTestId('branding')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { Component } = LoginTemplate;
    const { container } = render(
      <Component className="custom-class" />
    );

    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement.className).toContain('custom-class');
  });

  it('applies theme attribute', () => {
    const { Component } = LoginTemplate;
    const { container } = render(
      <Component theme="linear-minimal-v1" />
    );

    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement.getAttribute('data-theme')).toBe('linear-minimal-v1');
  });
});
```

### 5. Required 슬롯 검증 테스트

Required 슬롯 누락을 감지합니다.

```typescript
describe('DashboardTemplate Required Slots', () => {
  it('logs warning when required slot is missing', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation();

    const { Component } = DashboardTemplate;

    render(
      <Component
        slots={{
          // sidebar (required) 누락
          content: <div>Content</div>,
        }}
      />
    );

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Required slot "sidebar" is missing')
    );

    consoleWarnSpy.mockRestore();
  });
});
```

---

## 통합 테스트

### 1. TemplateRegistry 통합 테스트

레지스트리와 템플릿 통합을 검증합니다.

```typescript
import { TemplateRegistry } from '../registry';
import { LoginTemplate } from '../auth/login';
import { DashboardTemplate } from '../dashboard/overview';

describe('TemplateRegistry Integration', () => {
  it('retrieves registered template', () => {
    const template = TemplateRegistry.get('login-minimal');

    expect(template).toBeDefined();
    expect(template?.meta.id).toBe('login-minimal');
  });

  it('filters templates by category', () => {
    const authTemplates = TemplateRegistry.getByCategory('auth');

    expect(authTemplates.length).toBeGreaterThan(0);
    expect(authTemplates.every(t => t.meta.category === 'auth')).toBe(true);
  });

  it('returns all templates', () => {
    const allTemplates = TemplateRegistry.getAll();

    expect(allTemplates.length).toBeGreaterThanOrEqual(2);
    expect(allTemplates).toContainEqual(
      expect.objectContaining({ meta: expect.objectContaining({ id: 'login-minimal' }) })
    );
  });
});
```

### 2. 슬롯과 컴포넌트 통합 테스트

슬롯에 @tekton/ui 컴포넌트를 주입하여 검증합니다.

```typescript
import { Button, Card } from '@tekton/ui';

describe('LoginTemplate with UI Components', () => {
  it('renders with Button in footer slot', () => {
    const { Component } = LoginTemplate;

    render(
      <Component
        slots={{
          footer: <Button variant="primary">Get Started</Button>,
        }}
      />
    );

    const button = screen.getByRole('button', { name: 'Get Started' });
    expect(button).toBeInTheDocument();
  });

  it('renders with Card in branding slot', () => {
    const { Component } = LoginTemplate;

    render(
      <Component
        slots={{
          branding: (
            <Card>
              <CardHeader>
                <CardTitle>Welcome</CardTitle>
              </CardHeader>
            </Card>
          ),
        }}
      />
    );

    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });
});
```

### 3. 테마 전환 통합 테스트

CSS Variables 기반 테마 전환을 검증합니다.

```typescript
describe('Template Theme Integration', () => {
  it('applies theme CSS Variables', () => {
    const { Component } = LoginTemplate;
    const { container } = render(
      <Component theme="linear-minimal-v1" />
    );

    const rootElement = container.firstChild as HTMLElement;

    // data-theme 속성 확인
    expect(rootElement.getAttribute('data-theme')).toBe('linear-minimal-v1');

    // CSS Variables 적용 확인 (실제 값은 런타임에 주입)
    const styles = window.getComputedStyle(rootElement);
    // Note: jsdom에서는 CSS Variables 값을 가져올 수 없으므로
    // 실제 브라우저 환경에서만 검증 가능
  });

  it('switches theme dynamically', () => {
    const { Component } = LoginTemplate;
    const { container, rerender } = render(
      <Component theme="linear-minimal-v1" />
    );

    let rootElement = container.firstChild as HTMLElement;
    expect(rootElement.getAttribute('data-theme')).toBe('linear-minimal-v1');

    // 테마 변경
    rerender(<Component theme="linear-dark-v1" />);

    rootElement = container.firstChild as HTMLElement;
    expect(rootElement.getAttribute('data-theme')).toBe('linear-dark-v1');
  });
});
```

---

## 접근성 테스트

### 1. WCAG 2.1 AA 준수 테스트

vitest-axe로 접근성을 검증합니다.

```typescript
import { axe } from 'vitest-axe';

describe('LoginTemplate Accessibility', () => {
  it('meets WCAG 2.1 AA standards', async () => {
    const { Component } = LoginTemplate;
    const { container } = render(
      <Component
        slots={{
          branding: <img src="/logo.svg" alt="Company Logo" />,
          footer: <p>© 2026 Company</p>,
        }}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper heading hierarchy', () => {
    const { Component } = LoginTemplate;

    render(
      <Component
        slots={{
          branding: <h1>Login</h1>,
        }}
      />
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('uses semantic HTML elements', () => {
    const { Component } = DashboardTemplate;
    const { container } = render(
      <Component
        slots={{
          sidebar: <nav>Sidebar</nav>,
          content: <main>Content</main>,
        }}
      />
    );

    expect(container.querySelector('nav')).toBeInTheDocument();
    expect(container.querySelector('main')).toBeInTheDocument();
  });
});
```

### 2. 키보드 네비게이션 테스트

키보드 접근성을 검증합니다.

```typescript
import { userEvent } from '@testing-library/user-event';

describe('LoginTemplate Keyboard Navigation', () => {
  it('supports Tab navigation', async () => {
    const user = userEvent.setup();
    const { Component } = LoginTemplate;

    render(
      <Component
        slots={{
          footer: (
            <>
              <button>Button 1</button>
              <button>Button 2</button>
            </>
          ),
        }}
      />
    );

    const button1 = screen.getByRole('button', { name: 'Button 1' });
    const button2 = screen.getByRole('button', { name: 'Button 2' });

    // Tab으로 이동
    await user.tab();
    expect(button1).toHaveFocus();

    await user.tab();
    expect(button2).toHaveFocus();
  });

  it('shows focus indicators', async () => {
    const user = userEvent.setup();
    const { Component } = LoginTemplate;

    render(
      <Component
        slots={{
          footer: <button>Action</button>,
        }}
      />
    );

    const button = screen.getByRole('button', { name: 'Action' });

    await user.tab();

    // focus-visible 클래스가 적용되어야 함
    expect(button).toHaveFocus();
  });
});
```

### 3. Screen Reader 호환성 테스트

ARIA 속성을 검증합니다.

```typescript
describe('DashboardTemplate ARIA Labels', () => {
  it('has proper ARIA labels', () => {
    const { Component } = DashboardTemplate;

    render(
      <Component
        slots={{
          sidebar: (
            <nav aria-label="Main navigation">
              <ul>
                <li>Dashboard</li>
              </ul>
            </nav>
          ),
          content: (
            <main aria-label="Dashboard content">
              <h1>Dashboard</h1>
            </main>
          ),
        }}
      />
    );

    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('Dashboard content')).toBeInTheDocument();
  });
});
```

---

## 성능 테스트

### 1. 렌더링 성능 테스트

초기 렌더링 시간을 측정합니다.

```typescript
describe('LoginTemplate Performance', () => {
  it('renders within acceptable time', () => {
    const { Component } = LoginTemplate;

    const startTime = performance.now();

    render(
      <Component
        slots={{
          branding: <div>Logo</div>,
          footer: <div>Footer</div>,
        }}
      />
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // 100ms 이내 렌더링
    expect(renderTime).toBeLessThan(100);
  });
});
```

### 2. 메모리 누수 테스트

반복 렌더링 시 메모리 증가를 확인합니다.

```typescript
describe('Template Memory Leaks', () => {
  it('does not leak memory on repeated renders', () => {
    const { Component } = LoginTemplate;

    // 100번 렌더링/언마운트 반복
    for (let i = 0; i < 100; i++) {
      const { unmount } = render(<Component />);
      unmount();
    }

    // 메모리 누수 감지 (실제 브라우저 환경에서만 정확)
    // jsdom에서는 제한적이므로 E2E 테스트에서 추가 검증 필요
  });
});
```

---

## 커버리지 관리

### 현재 커버리지 (Phase 3)

| 카테고리 | Statement | Branch | Function | Line |
|----------|-----------|--------|----------|------|
| **전체** | 91.72% | 95.52% | 100% | 91.72% |
| Components | 93.5% | 96.2% | 100% | 93.5% |
| Templates | 88.1% | 94.5% | 100% | 88.1% |
| Lib | 95.8% | 97.1% | 100% | 95.8% |

### 미커버 영역 분석

**미커버 코드 (8.28%):**

1. **Edge Cases (3.5%)**
   - 슬롯 타입 검증 분기
   - 에러 핸들링 try-catch 블록
   - Theme fallback 로직

2. **Error Handling (2.8%)**
   - 잘못된 슬롯 ID 처리
   - 템플릿 등록 실패 처리
   - CSS Variables 미지원 환경 처리

3. **Type Guards (1.98%)**
   - `isValidSlot()` 함수
   - `isRequiredSlotMissing()` 함수

### Phase 4 커버리지 개선 계획

**목표:** 95%+ Statement/Line Coverage

**전략:**

1. **Day 1: Edge Case 테스트 추가 (1.5%)**

```typescript
describe('LoginTemplate Edge Cases', () => {
  it('handles invalid slot ID gracefully', () => {
    const { Component } = LoginTemplate;

    render(
      <Component
        slots={{
          invalidSlot: <div>Content</div>, // 정의되지 않은 슬롯
        }}
      />
    );

    // 경고 메시지만 출력하고 렌더링 계속
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('handles null slot content', () => {
    const { Component } = LoginTemplate;

    render(
      <Component
        slots={{
          branding: null, // null 슬롯
        }}
      />
    );

    // null은 렌더링하지 않음
    expect(screen.queryByTestId('branding')).not.toBeInTheDocument();
  });
});
```

2. **Day 2: Error Handling 테스트 추가 (1.8%)**

```typescript
describe('TemplateRegistry Error Handling', () => {
  it('throws error on duplicate template ID', () => {
    const duplicateTemplate = {
      ...LoginTemplate,
      meta: { ...LoginTemplate.meta, id: 'login-minimal' }, // 중복 ID
    };

    expect(() => {
      TemplateRegistry.register(duplicateTemplate);
    }).toThrow('Template login-minimal already registered');
  });

  it('returns undefined for non-existent template', () => {
    const template = TemplateRegistry.get('non-existent-template');

    expect(template).toBeUndefined();
  });
});
```

3. **Day 3: Type Guard 테스트 추가 (1%)**

```typescript
import { isValidSlot, isRequiredSlotMissing } from '../utils';

describe('Template Utilities', () => {
  it('validates slot structure', () => {
    expect(isValidSlot({ id: 'test', name: 'Test', required: true })).toBe(true);
    expect(isValidSlot({ id: '', name: 'Test', required: true })).toBe(false);
  });

  it('detects missing required slots', () => {
    const slots = [
      { id: 'required1', name: 'Required 1', required: true },
      { id: 'optional1', name: 'Optional 1', required: false },
    ];

    expect(isRequiredSlotMissing(slots, {})).toBe(true);
    expect(isRequiredSlotMissing(slots, { required1: <div /> })).toBe(false);
  });
});
```

**예상 커버리지 개선:**
- Statement: 91.72% → 95.5% (+3.78%)
- Line: 91.72% → 95.5% (+3.78%)

---

## 테스트 자동화

### CI/CD 통합

`.github/workflows/test.yml`:

```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
          flags: ui-package
          fail_ci_if_error: true

      - name: Check coverage thresholds
        run: |
          if [ $(cat coverage/coverage-summary.json | jq '.total.statements.pct') -lt 95 ]; then
            echo "Statement coverage below 95%"
            exit 1
          fi
```

### Pre-commit Hook

`.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run tests before commit
pnpm test --run --coverage

# Check coverage thresholds
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

---

## 모범 사례

### DO

- ✅ AAA 패턴 사용 (Arrange, Act, Assert)
- ✅ 테스트 격리 (각 테스트는 독립적)
- ✅ 의미 있는 테스트 이름 (무엇을 테스트하는지 명확히)
- ✅ Edge Case 테스트
- ✅ 접근성 테스트 포함
- ✅ 커버리지 95%+ 유지

### DON'T

- ❌ 구현 세부사항 테스트 (인터페이스 테스트)
- ❌ 테스트 간 의존성 생성
- ❌ Happy Path만 테스트
- ❌ 접근성 테스트 생략
- ❌ 커버리지 95% 미만 허용

---

## 참조 문서

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/)
- [vitest-axe](https://github.com/chaance/vitest-axe)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Template Architecture](../frontend/template-architecture.md)
- [Templates API Reference](../../../packages/ui/docs/templates-api.md)

---

**문서 버전**: 1.0.0
**작성일**: 2026-01-31
**작성자**: soo-kate-yeon
**다음 검토일**: Phase 4 완료 시점
