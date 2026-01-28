# Phase 3: Output Generators

프로덕션 React 컴포넌트 및 스타일 코드 생성

## 개요

Phase 3는 ResolvedScreen을 프로덕션 React 컴포넌트로 변환하는 코드 생성기를 구현합니다. CSS-in-JS (styled-components, Emotion), Tailwind CSS, React JSX의 세 가지 출력 형식을 지원합니다.

**커버리지**: 91.17%
**상태**: ✅ 완료
**테스트**: 모두 통과

## 지원 출력 형식

| 형식          | CSS 프레임워크             | 사용 사례                             |
| ------------- | -------------------------- | ------------------------------------- |
| **CSS-in-JS** | styled-components, Emotion | 컴포넌트 스코프 스타일, 동적 테마     |
| **Tailwind**  | Tailwind CSS 3.4+          | 유틸리티 우선 개발, 빠른 프로토타이핑 |
| **React**     | CSS Modules/외부 CSS       | 분리된 스타일, 기존 프로젝트 통합     |

## 1. CSS-in-JS Generator

styled-components 및 Emotion을 사용한 컴포넌트 스타일 생성

### generateStyledComponents()

styled-components 또는 Emotion 코드를 생성합니다.

```typescript
import { generateStyledComponents, type GeneratorOptions } from '@tekton/core/screen-generation';

const resolved = await resolveScreen(screenDef);

const options: GeneratorOptions = {
  format: 'typescript', // 또는 'javascript'
  prettier: false, // Prettier 포맷팅 비활성화
};

// styled-components 출력
const styledResult = generateStyledComponents(resolved, 'styled-components', options);

console.log(styledResult.code);
```

**생성되는 코드 예제 (styled-components):**

```typescript
import styled from 'styled-components';
import { Card, Heading, Text } from '@tekton/components';

const StyledCard = styled(Card)`
  background: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.radius.md};

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }
`;

const StyledHeading = styled(Heading)`
  color: ${props => props.theme.colors.foreground};
  font-size: ${props => props.theme.typography.heading.size};
`;

export const DashboardScreen: React.FC = () => {
  return (
    <StyledCard>
      <StyledHeading level={3}>Total Users</StyledHeading>
      <Text>12,453</Text>
    </StyledCard>
  );
};
```

### generateComponentStyles()

개별 컴포넌트의 스타일을 생성합니다.

```typescript
import { generateComponentStyles } from '@tekton/core/screen-generation';

const component = {
  type: 'Button',
  resolvedStyles: {
    background: '#3b82f6',
    foreground: '#ffffff',
    padding: '16px',
  },
};

const styles = generateComponentStyles(component, 'styled-components');
// `
//   background: #3b82f6;
//   color: #ffffff;
//   padding: 16px;
// `
```

### convertCSSVarsToTheme()

CSS 변수를 테마 객체 구조로 변환합니다.

```typescript
import { convertCSSVarsToTheme } from '@tekton/core/screen-generation';

const cssVariables = {
  '--color-primary-500': '#3b82f6',
  '--spacing-4': '16px',
  '--radius-md': '8px',
};

const theme = convertCSSVarsToTheme(cssVariables);
// {
//   colors: { primary: { 500: '#3b82f6' } },
//   spacing: { 4: '16px' },
//   radius: { md: '8px' }
// }
```

### Emotion 출력

```typescript
// Emotion 출력
const emotionResult = generateStyledComponents(resolved, 'emotion', options);
```

**생성되는 코드 예제 (Emotion):**

```typescript
import styled from '@emotion/styled';
import { Card, Heading, Text } from '@tekton/components';

const StyledCard = styled(Card)`
  background: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing[4]};
`;

// Emotion CSS prop 사용
export const DashboardScreen: React.FC = () => {
  return (
    <Card
      css={{
        background: 'var(--color-primary-500)',
        padding: 'var(--spacing-4)',
        borderRadius: 'var(--radius-md)'
      }}
    >
      <Heading level={3}>Total Users</Heading>
      <Text>12,453</Text>
    </Card>
  );
};
```

## 2. Tailwind Generator

Tailwind CSS 클래스 및 설정 생성

### generateTailwindClasses()

Tailwind 유틸리티 클래스를 사용하는 React 컴포넌트를 생성합니다.

```typescript
import { generateTailwindClasses, type GeneratorOptions } from '@tekton/core/screen-generation';

const resolved = await resolveScreen(screenDef);

const options: GeneratorOptions = {
  format: 'typescript',
  prettier: false,
};

const result = generateTailwindClasses(resolved, options);
console.log(result.code);
```

**생성되는 코드 예제:**

```typescript
import { Card, Heading, Text, Badge } from '@tekton/components';

export const DashboardScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white p-6 rounded-lg shadow-md">
            <Heading level={3} className="text-lg font-semibold text-gray-900">
              Total Users
            </Heading>
            <Text className="text-2xl font-bold text-gray-900">12,453</Text>
            <Badge className="bg-green-100 text-green-800 px-2 py-1 rounded">
              +12.5%
            </Badge>
          </Card>
        </div>
      </div>
    </div>
  );
};
```

### tokenToTailwindClass()

토큰 참조를 Tailwind 클래스로 변환합니다.

```typescript
import { tokenToTailwindClass } from '@tekton/core/screen-generation';

// 색상 토큰
const bgClass = tokenToTailwindClass('color.primary.500', 'background');
// 'bg-primary-500'

// 간격 토큰
const paddingClass = tokenToTailwindClass('spacing.4', 'padding');
// 'p-4'

// 반경 토큰
const radiusClass = tokenToTailwindClass('radius.md', 'borderRadius');
// 'rounded-md'
```

### generateComponentClasses()

컴포넌트에 대한 Tailwind 클래스 문자열을 생성합니다.

```typescript
import { generateComponentClasses } from '@tekton/core/screen-generation';

const component = {
  type: 'Card',
  resolvedStyles: {
    background: '#ffffff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
};

const classes = generateComponentClasses(component);
// 'bg-white p-6 rounded-lg shadow-md'
```

### generateTailwindConfig()

화면에서 사용된 토큰을 기반으로 Tailwind 설정을 생성합니다.

```typescript
import { generateTailwindConfig } from '@tekton/core/screen-generation';

const resolved = await resolveScreen(screenDef);
const config = generateTailwindConfig(resolved);
```

**생성되는 설정 예제:**

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#3b82f6',
          600: '#2563eb',
        },
        neutral: {
          50: '#f9fafb',
          900: '#111827',
        },
      },
      spacing: {
        4: '16px',
        6: '24px',
        8: '32px',
      },
      borderRadius: {
        md: '8px',
        lg: '12px',
      },
    },
  },
  plugins: [],
};
```

## 3. React Generator

순수 React 컴포넌트 생성 (스타일 분리)

### generateReactComponent()

TypeScript React 함수형 컴포넌트를 생성합니다.

```typescript
import { generateReactComponent, type GeneratorOptions } from '@tekton/core/screen-generation';

const resolved = await resolveScreen(screenDef);

const options: GeneratorOptions = {
  format: 'typescript',
  prettier: false,
};

const result = generateReactComponent(resolved, options);
console.log(result.code);
```

**생성되는 코드 예제:**

```typescript
import React from 'react';
import { Card, Heading, Text, Badge } from '@tekton/components';

export interface DashboardScreenProps {
  className?: string;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  className
}) => {
  return (
    <div className={className} data-screen-id="dashboard-screen">
      <div className="metrics-section" data-section-id="metrics-section">
        <Card data-slot="metric-1">
          <Heading level={3}>Total Users</Heading>
          <Text>12,453</Text>
          <Badge variant="success">+12.5%</Badge>
        </Card>
        <Card data-slot="metric-2">
          <Heading level={3}>Revenue</Heading>
          <Text>$45,230</Text>
          <Badge variant="success">+8.2%</Badge>
        </Card>
      </div>
    </div>
  );
};
```

### generateComponentInterface()

컴포넌트 props를 위한 TypeScript 인터페이스를 생성합니다.

```typescript
import { generateComponentInterface } from '@tekton/core/screen-generation';

const component = {
  type: 'Button',
  schema: {
    props: [
      { name: 'variant', type: 'string', required: false },
      { name: 'children', type: 'React.ReactNode', required: true },
    ],
  },
};

const interfaceCode = generateComponentInterface(component);
```

**생성되는 인터페이스:**

```typescript
interface ButtonProps {
  variant?: string;
  children: React.ReactNode;
}
```

### generateComponentJSX()

컴포넌트와 그 자식들에 대한 JSX를 생성합니다.

```typescript
import { generateComponentJSX } from '@tekton/core/screen-generation';

const component = {
  type: 'Button',
  props: { variant: 'primary' },
  children: ['Click me'],
};

const context = {
  format: 'typescript' as const,
};

const jsx = generateComponentJSX(component, context);
// '<Button variant="primary">Click me</Button>'
```

### generateComponentTree()

전체 컴포넌트 트리에 대한 JSX를 생성합니다.

```typescript
import { generateComponentTree } from '@tekton/core/screen-generation';

const tree = resolved.componentTree;
const context = {
  format: 'typescript' as const,
  indent: 2,
};

const treeJSX = generateComponentTree(tree, context);
// 중첩된 컴포넌트가 있는 완전한 JSX 트리
```

## 공통 유틸리티

모든 생성기에서 공유하는 유틸리티 함수

### 케이스 변환

```typescript
import { camelCase, pascalCase, kebabCase } from '@tekton/core/screen-generation';

camelCase('dashboard-screen'); // 'dashboardScreen'
pascalCase('dashboard-screen'); // 'DashboardScreen'
kebabCase('DashboardScreen'); // 'dashboard-screen'
```

### 코드 포맷팅

```typescript
import { formatCode, indent, escapeJSX } from '@tekton/core/screen-generation';

// 코드 포맷팅 (기본 또는 Prettier)
const formatted = formatCode(code, {
  format: 'typescript',
  prettier: true,
});

// 들여쓰기 추가
const indented = indent('const x = 1;', 2); // '  const x = 1;'

// JSX 이스케이프
const escaped = escapeJSX('Hello <World>'); // 'Hello &lt;World&gt;'
```

### Import 생성

```typescript
import { generateImports } from '@tekton/core/screen-generation';

const imports = {
  react: ['React', 'useState'],
  '@tekton/components': ['Button', 'Card'],
};

const importCode = generateImports(imports);
// import React, { useState } from 'react';
// import { Button, Card } from '@tekton/components';
```

### Props를 JSX로 변환

```typescript
import { propValueToJSX, needsJSXExpression } from '@tekton/core/screen-generation';

// 문자열 props
propValueToJSX('primary'); // '"primary"'

// 숫자 props
propValueToJSX(3); // '{3}'

// 불리언 props
propValueToJSX(true); // '{true}'

// 객체 props
propValueToJSX({ variant: 'primary' }); // `{{ variant: "primary" }}`

// JSX 표현식 필요 여부 확인
needsJSXExpression('primary'); // false (문자열)
needsJSXExpression(3); // true (숫자)
needsJSXExpression({ variant: 'primary' }); // true (객체)
```

### CSS 변수 유틸리티

```typescript
import { cssVarToToken, extractPropertyFromCSSVar } from '@tekton/core/screen-generation';

// CSS 변수를 토큰 참조로 변환
cssVarToToken('var(--color-primary-500)'); // 'color.primary.500'

// CSS 변수에서 속성 추출
extractPropertyFromCSSVar('--color-primary-500'); // 'color'
extractPropertyFromCSSVar('--spacing-4'); // 'spacing'
```

### 식별자 검증 및 정제

```typescript
import { isValidIdentifier, sanitizeIdentifier } from '@tekton/core/screen-generation';

// 유효한 JavaScript 식별자 확인
isValidIdentifier('myComponent'); // true
isValidIdentifier('my-component'); // false
isValidIdentifier('123component'); // false

// 유효한 식별자로 정제
sanitizeIdentifier('my-component'); // 'myComponent'
sanitizeIdentifier('123-component'); // '_123Component'
```

## 생성 옵션

모든 생성기가 공유하는 옵션 인터페이스

```typescript
interface GeneratorOptions {
  /** 출력 형식: 'typescript' | 'javascript' */
  format?: 'typescript' | 'javascript';

  /** Prettier 포맷팅 활성화 */
  prettier?: boolean;

  /** 들여쓰기 크기 (기본값: 2) */
  indent?: number;

  /** 세미콜론 포함 (기본값: true) */
  semicolons?: boolean;

  /** 단일 따옴표 사용 (기본값: false) */
  singleQuote?: boolean;
}

// 기본 옵션
import { defaultGeneratorOptions } from '@tekton/core/screen-generation';

console.log(defaultGeneratorOptions);
// {
//   format: 'typescript',
//   prettier: false,
//   indent: 2,
//   semicolons: true,
//   singleQuote: false
// }
```

## 생성 결과

모든 생성기는 `GeneratorResult`를 반환합니다:

```typescript
interface GeneratorResult {
  /** 생성된 코드 */
  code: string;

  /** 생성 성공 여부 */
  success: boolean;

  /** 오류 메시지 (실패 시) */
  error?: string;

  /** 생성된 파일 (여러 파일 생성 시) */
  files?: GeneratedFile[];

  /** 생성 메타데이터 */
  meta?: {
    /** 생성된 라인 수 */
    lines: number;

    /** 사용된 컴포넌트 타입 */
    componentTypes: string[];

    /** 생성 시간 (ms) */
    generationTime: number;
  };
}
```

## 고급 사용 예제

### 다중 형식 생성

```typescript
import {
  resolveScreen,
  generateStyledComponents,
  generateTailwindClasses,
  generateReactComponent,
} from '@tekton/core/screen-generation';

const resolved = await resolveScreen(screenDef);
const options = { format: 'typescript' as const };

// 모든 형식 생성
const styledComponents = generateStyledComponents(resolved, 'styled-components', options);
const tailwind = generateTailwindClasses(resolved, options);
const react = generateReactComponent(resolved, options);

// 프로젝트 선호도에 따라 선택
const output = process.env.CSS_FRAMEWORK === 'tailwind' ? tailwind : styledComponents;
```

### 커스텀 컴포넌트 래핑

```typescript
// 생성된 컴포넌트를 추가 로직으로 래핑
const baseCode = generateReactComponent(resolved, options).code;

const wrappedCode = `
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Analytics } from '@/lib/analytics';

${baseCode}

export default function WrappedDashboard() {
  useEffect(() => {
    Analytics.track('screen_view', { screen: 'dashboard' });
  }, []);

  return (
    <ErrorBoundary>
      <DashboardScreen />
    </ErrorBoundary>
  );
}
`;
```

### 조건부 스타일

```typescript
// 테마에 따라 다른 스타일 생성
const isDarkTheme = resolved.themeId === 'dark';

const result = generateReactComponent(resolved, {
  ...options,
  customStyles: isDarkTheme
    ? { background: '#1a1a1a', color: '#ffffff' }
    : { background: '#ffffff', color: '#000000' },
});
```

## 에러 처리

### 생성 오류

```typescript
const result = generateReactComponent(resolved, options);

if (!result.success) {
  console.error('Code generation failed:', result.error);
  // 오류 처리 로직
}
```

### 유효성 검사

```typescript
// 생성 전 해석된 화면 검증
import { isValidResolvedScreen } from '@tekton/core/screen-generation';

if (!isValidResolvedScreen(resolved)) {
  throw new Error('Invalid resolved screen structure');
}

const result = generateReactComponent(resolved, options);
```

## 테스트

생성된 코드 테스트:

```typescript
import { render } from '@testing-library/react';
import { DashboardScreen } from './DashboardScreen';

describe('DashboardScreen', () => {
  it('renders without crashing', () => {
    const { container } = render(<DashboardScreen />);
    expect(container).toBeInTheDocument();
  });

  it('contains metrics section', () => {
    const { getByText } = render(<DashboardScreen />);
    expect(getByText('Total Users')).toBeInTheDocument();
  });
});
```

## 성능

생성기 성능 메트릭:

| 생성기    | 평균 시간 | 최대 컴포넌트 |
| --------- | --------- | ------------- |
| CSS-in-JS | ~15ms     | 100+          |
| Tailwind  | ~10ms     | 100+          |
| React     | ~8ms      | 100+          |

**최적화 팁:**

- 복잡한 화면의 경우 섹션별로 생성
- Prettier를 비활성화하여 더 빠른 생성
- 생성된 코드 캐싱

## 다음 단계

출력 생성기를 이해했다면:

1. **[API Reference](./API.md)** - 모든 생성기 함수 탐색
2. **[Integration Guide](./INTEGRATION.md)** - 프로젝트에 통합
3. **[MCP Tools](../../mcp-server/SCREEN-TOOLS.md)** - LLM과 함께 사용

## 참고

- CSS-in-JS Generator: `generators/css-in-js-generator.ts`
- Tailwind Generator: `generators/tailwind-generator.ts`
- React Generator: `generators/react-generator.ts`
- Utilities: `generators/utils.ts`

---

**[SPEC-LAYOUT-002]** [PHASE-3] [Coverage: 91.17%]
