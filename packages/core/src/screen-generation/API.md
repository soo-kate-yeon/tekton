# API Reference

Screen Generation Pipeline의 모든 공개 API 완전한 참조

## 목차

- [타입 정의](#타입-정의)
- [검증 함수](#검증-함수)
- [리졸버 함수](#리졸버-함수)
- [생성기 함수](#생성기-함수)
- [유틸리티 함수](#유틸리티-함수)

---

## 타입 정의

### ComponentType

지원되는 컴포넌트 타입 (20개).

```typescript
type ComponentType =
  // 프리미티브 (10)
  | 'Button'
  | 'Input'
  | 'Text'
  | 'Heading'
  | 'Checkbox'
  | 'Radio'
  | 'Switch'
  | 'Slider'
  | 'Badge'
  | 'Avatar'
  // 조합 (10)
  | 'Card'
  | 'Modal'
  | 'Tabs'
  | 'Table'
  | 'Link'
  | 'List'
  | 'Image'
  | 'Form'
  | 'Dropdown'
  | 'Progress';
```

### ScreenDefinition

화면의 완전한 선언적 사양.

```typescript
interface ScreenDefinition {
  id: string;
  name: string;
  description?: string;
  shell: string;
  page: string;
  themeId?: string;
  sections: SectionDefinition[];
  meta?: ScreenMeta;
}
```

### SectionDefinition

레이아웃 섹션 정의.

```typescript
interface SectionDefinition {
  id: string;
  pattern: string;
  components: ComponentDefinition[];
  responsive?: ResponsiveOverrides;
}
```

### ComponentDefinition

컴포넌트 인스턴스 사양.

```typescript
interface ComponentDefinition {
  type: ComponentType;
  props: Record<string, unknown>;
  children?: (ComponentDefinition | string)[];
  slot?: string;
}
```

### ResolvedScreen

완전히 해석된 화면 구조.

```typescript
interface ResolvedScreen {
  id: string;
  name: string;
  description?: string;
  shell: ResolvedLayout;
  page: ResolvedLayout;
  sections: ResolvedSection[];
  cssVariables: Record<string, string>;
  componentTree: ComponentTree;
  meta?: ScreenMeta;
  themeId: string;
}
```

### ValidationResult

검증 결과.

```typescript
interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}
```

### GeneratorOptions

코드 생성 옵션.

```typescript
interface GeneratorOptions {
  format?: 'typescript' | 'javascript';
  prettier?: boolean;
  indent?: number;
  semicolons?: boolean;
  singleQuote?: boolean;
}
```

### GeneratorResult

코드 생성 결과.

```typescript
interface GeneratorResult {
  code: string;
  success: boolean;
  error?: string;
  files?: GeneratedFile[];
  meta?: {
    lines: number;
    componentTypes: string[];
    generationTime: number;
  };
}
```

---

## 검증 함수

### validateScreenDefinition()

화면 정의를 검증합니다.

**시그니처:**

```typescript
function validateScreenDefinition(screen: unknown, context?: ValidationContext): ValidationResult;
```

**매개변수:**

- `screen` - 검증할 화면 정의
- `context` (선택적) - 추가 검사를 위한 검증 컨텍스트

**반환값:**

- `ValidationResult` - 검증 결과 (valid, errors, warnings)

**예제:**

```typescript
const result = validateScreenDefinition(screenDef);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}

if (result.warnings) {
  console.warn('Warnings:', result.warnings);
}
```

**에러:**

- 스키마 불일치 시 errors 배열 반환
- 컨텍스트 기반 경고 시 warnings 배열 반환

---

### assertValidScreenDefinition()

화면 정의를 검증하고 실패 시 예외를 발생시킵니다.

**시그니처:**

```typescript
function assertValidScreenDefinition(
  screen: unknown,
  context?: ValidationContext
): asserts screen is ScreenDefinition;
```

**매개변수:**

- `screen` - 검증할 화면 정의
- `context` (선택적) - 검증 컨텍스트

**예외:**

- `Error` - 검증 실패 시 오류 메시지와 함께 예외 발생

**예제:**

```typescript
try {
  assertValidScreenDefinition(screenDef);
  // 검증 성공, screen은 ScreenDefinition 타입
} catch (error) {
  console.error('Invalid screen:', error.message);
}
```

---

### validateComponent()

컴포넌트 정의를 검증합니다.

**시그니처:**

```typescript
function validateComponent(component: unknown): ValidationResult;
```

**매개변수:**

- `component` - 검증할 컴포넌트 정의

**반환값:**

- `ValidationResult` - 검증 결과

**예제:**

```typescript
const result = validateComponent({
  type: 'Button',
  props: { variant: 'primary' },
  children: ['Click me'],
});
```

---

### validateSection()

섹션 정의를 검증합니다.

**시그니처:**

```typescript
function validateSection(section: unknown): ValidationResult;
```

**매개변수:**

- `section` - 검증할 섹션 정의

**반환값:**

- `ValidationResult` - 검증 결과

**예제:**

```typescript
const result = validateSection({
  id: 'hero-section',
  pattern: 'section.hero',
  components: [
    /* ... */
  ],
});
```

---

### validateScreenDefinitions()

여러 화면 정의를 배치로 검증합니다.

**시그니처:**

```typescript
function validateScreenDefinitions(
  screens: unknown[],
  context?: ValidationContext
): {
  totalScreens: number;
  validScreens: number;
  invalidScreens: number;
  validationResults: Array<{
    id: string;
    valid: boolean;
    errors?: string[];
    warnings?: string[];
  }>;
};
```

**매개변수:**

- `screens` - 검증할 화면 정의 배열
- `context` (선택적) - 검증 컨텍스트

**반환값:**

- 검증 요약 객체

**예제:**

```typescript
const summary = validateScreenDefinitions([screen1, screen2, screen3]);
console.log(`Valid: ${summary.validScreens}/${summary.totalScreens}`);
```

---

### isValidShellToken()

Shell 토큰 ID 패턴을 검증합니다.

**시그니처:**

```typescript
function isValidShellToken(tokenId: string): boolean;
```

**매개변수:**

- `tokenId` - 검증할 토큰 ID

**반환값:**

- `boolean` - 유효한 Shell 토큰이면 true

**예제:**

```typescript
isValidShellToken('shell.web.dashboard'); // true
isValidShellToken('invalid'); // false
```

---

### isValidPageToken()

Page 토큰 ID 패턴을 검증합니다.

**시그니처:**

```typescript
function isValidPageToken(tokenId: string): boolean;
```

---

### isValidSectionToken()

Section 토큰 ID 패턴을 검증합니다.

**시그니처:**

```typescript
function isValidSectionToken(tokenId: string): boolean;
```

---

### getUsedComponentTypes()

화면 정의에서 사용된 모든 컴포넌트 타입을 추출합니다.

**시그니처:**

```typescript
function getUsedComponentTypes(screen: ScreenDefinition): Set<ComponentType>;
```

**매개변수:**

- `screen` - 화면 정의

**반환값:**

- `Set<ComponentType>` - 사용된 컴포넌트 타입 집합

**예제:**

```typescript
const types = getUsedComponentTypes(screenDef);
console.log(`Uses ${types.size} component types:`, Array.from(types));
```

---

## 리졸버 함수

### resolveScreen()

ScreenDefinition을 ResolvedScreen으로 해석합니다.

**시그니처:**

```typescript
async function resolveScreen(
  screen: ScreenDefinition,
  context?: { themeId?: string }
): Promise<ResolvedScreen>;
```

**매개변수:**

- `screen` - 해석할 화면 정의
- `context` (선택적) - 해석 컨텍스트

**반환값:**

- `Promise<ResolvedScreen>` - 완전히 해석된 화면

**예제:**

```typescript
const resolved = await resolveScreen(screenDef);
console.log(`Resolved ${resolved.sections.length} sections`);
```

**에러:**

- 토큰 미발견 시 예외
- 순환 참조 감지 시 예외

---

### resolveBinding()

단일 토큰 바인딩을 해석합니다.

**시그니처:**

```typescript
function resolveBinding(binding: string, context: TokenBindingContext): string;
```

**매개변수:**

- `binding` - 토큰 바인딩 또는 일반 값
- `context` - 바인딩 컨텍스트

**반환값:**

- `string` - 해석된 값

**예제:**

```typescript
const value = resolveBinding('{{color.primary.500}}', context);
// → '#3b82f6'
```

---

### resolveBindings()

여러 토큰 바인딩을 해석합니다.

**시그니처:**

```typescript
function resolveBindings(
  bindings: Record<string, string>,
  context: TokenBindingContext
): ResolvedTokenBindings;
```

**매개변수:**

- `bindings` - 바인딩 객체
- `context` - 바인딩 컨텍스트

**반환값:**

- `ResolvedTokenBindings` - 해석된 바인딩

**예제:**

```typescript
const resolved = resolveBindings(
  {
    background: '{{color.primary.500}}',
    padding: '{{spacing.4}}',
  },
  context
);
```

---

### substituteTemplateVariables()

객체 내 모든 템플릿 변수를 재귀적으로 대체합니다.

**시그니처:**

```typescript
function substituteTemplateVariables<T>(obj: T, context: TokenBindingContext): T;
```

**매개변수:**

- `obj` - 템플릿 변수를 포함하는 객체
- `context` - 바인딩 컨텍스트

**반환값:**

- `T` - 템플릿이 대체된 객체

**예제:**

```typescript
const result = substituteTemplateVariables(
  {
    style: { background: '{{color.primary.500}}' },
  },
  context
);
```

---

### tokenRefToCSSVar()

토큰 참조를 CSS 변수로 변환합니다.

**시그니처:**

```typescript
function tokenRefToCSSVar(tokenRef: string): string;
```

**매개변수:**

- `tokenRef` - 토큰 참조 (예: 'color.primary.500')

**반환값:**

- `string` - CSS 변수 (예: 'var(--color-primary-500)')

**예제:**

```typescript
tokenRefToCSSVar('color.primary.500');
// → 'var(--color-primary-500)'
```

---

### resolveShell()

Shell 토큰을 해석합니다.

**시그니처:**

```typescript
async function resolveShell(shellToken: string, context: LayoutContext): Promise<ResolvedLayout>;
```

**매개변수:**

- `shellToken` - Shell 토큰 ID
- `context` - 레이아웃 컨텍스트

**반환값:**

- `Promise<ResolvedLayout>` - 해석된 Shell 레이아웃

---

### resolvePage()

Page 토큰을 해석합니다.

**시그니처:**

```typescript
async function resolvePage(pageToken: string, context: LayoutContext): Promise<ResolvedLayout>;
```

---

### resolveSection()

Section 토큰을 해석합니다.

**시그니처:**

```typescript
async function resolveSection(
  sectionToken: string,
  context: LayoutContext
): Promise<ResolvedLayout>;
```

---

### resolveComponent()

ComponentDefinition을 완전한 스키마로 해석합니다.

**시그니처:**

```typescript
async function resolveComponent(
  component: ComponentDefinition,
  context: ComponentContext
): Promise<ResolvedComponent>;
```

**매개변수:**

- `component` - 컴포넌트 정의
- `context` - 컴포넌트 컨텍스트

**반환값:**

- `Promise<ResolvedComponent>` - 해석된 컴포넌트

**예제:**

```typescript
const resolved = await resolveComponent(
  {
    type: 'Button',
    props: { variant: 'primary' },
    children: ['Click me'],
  },
  context
);
```

---

### getScreenStats()

해석된 화면의 통계를 가져옵니다.

**시그니처:**

```typescript
function getScreenStats(screen: ResolvedScreen): {
  sectionCount: number;
  componentCount: number;
  cssVariableCount: number;
  maxDepth: number;
};
```

**매개변수:**

- `screen` - 해석된 화면

**반환값:**

- 화면 통계 객체

**예제:**

```typescript
const stats = getScreenStats(resolved);
console.log(`Sections: ${stats.sectionCount}`);
console.log(`Components: ${stats.componentCount}`);
```

---

### clearBindingCache()

토큰 바인딩 캐시를 클리어합니다.

**시그니처:**

```typescript
function clearBindingCache(): void;
```

---

### clearComponentCache()

컴포넌트 스키마 캐시를 클리어합니다.

**시그니처:**

```typescript
function clearComponentCache(): void;
```

---

### clearScreenCache()

화면 해석 캐시를 클리어합니다.

**시그니처:**

```typescript
function clearScreenCache(): void;
```

---

## 생성기 함수

### generateReactComponent()

TypeScript React 컴포넌트를 생성합니다.

**시그니처:**

```typescript
function generateReactComponent(
  resolved: ResolvedScreen,
  options?: GeneratorOptions
): GeneratorResult;
```

**매개변수:**

- `resolved` - 해석된 화면
- `options` (선택적) - 생성기 옵션

**반환값:**

- `GeneratorResult` - 생성된 React 컴포넌트 코드

**예제:**

```typescript
const result = generateReactComponent(resolved, {
  format: 'typescript',
  prettier: false,
});

if (result.success) {
  console.log(result.code);
}
```

---

### generateStyledComponents()

styled-components 또는 Emotion 코드를 생성합니다.

**시그니처:**

```typescript
function generateStyledComponents(
  resolved: ResolvedScreen,
  framework: 'styled-components' | 'emotion',
  options?: GeneratorOptions
): GeneratorResult;
```

**매개변수:**

- `resolved` - 해석된 화면
- `framework` - CSS-in-JS 프레임워크
- `options` (선택적) - 생성기 옵션

**반환값:**

- `GeneratorResult` - 생성된 CSS-in-JS 코드

**예제:**

```typescript
const styledResult = generateStyledComponents(resolved, 'styled-components', {
  format: 'typescript',
});

const emotionResult = generateStyledComponents(resolved, 'emotion', { format: 'typescript' });
```

---

### generateTailwindClasses()

Tailwind CSS 클래스를 사용하는 컴포넌트를 생성합니다.

**시그니처:**

```typescript
function generateTailwindClasses(
  resolved: ResolvedScreen,
  options?: GeneratorOptions
): GeneratorResult;
```

**매개변수:**

- `resolved` - 해석된 화면
- `options` (선택적) - 생성기 옵션

**반환값:**

- `GeneratorResult` - 생성된 Tailwind 코드

**예제:**

```typescript
const result = generateTailwindClasses(resolved, {
  format: 'typescript',
});
```

---

### generateTailwindConfig()

화면에서 사용된 토큰을 기반으로 Tailwind 설정을 생성합니다.

**시그니처:**

```typescript
function generateTailwindConfig(resolved: ResolvedScreen): string;
```

**매개변수:**

- `resolved` - 해석된 화면

**반환값:**

- `string` - Tailwind 설정 코드

**예제:**

```typescript
const config = generateTailwindConfig(resolved);
// tailwind.config.js 파일 생성
```

---

### generateComponentInterface()

컴포넌트 props를 위한 TypeScript 인터페이스를 생성합니다.

**시그니처:**

```typescript
function generateComponentInterface(component: ResolvedComponent): string;
```

**매개변수:**

- `component` - 해석된 컴포넌트

**반환값:**

- `string` - TypeScript 인터페이스 코드

**예제:**

```typescript
const interfaceCode = generateComponentInterface(component);
// interface ButtonProps { ... }
```

---

### generateComponentJSX()

컴포넌트와 그 자식들에 대한 JSX를 생성합니다.

**시그니처:**

```typescript
function generateComponentJSX(
  component: ResolvedComponent,
  context: ComponentGenerationContext
): string;
```

**매개변수:**

- `component` - 해석된 컴포넌트
- `context` - 생성 컨텍스트

**반환값:**

- `string` - JSX 코드

**예제:**

```typescript
const jsx = generateComponentJSX(component, {
  format: 'typescript',
  indent: 2,
});
```

---

## 유틸리티 함수

### camelCase()

문자열을 camelCase로 변환합니다.

**시그니처:**

```typescript
function camelCase(str: string): string;
```

**예제:**

```typescript
camelCase('dashboard-screen'); // 'dashboardScreen'
```

---

### pascalCase()

문자열을 PascalCase로 변환합니다.

**시그니처:**

```typescript
function pascalCase(str: string): string;
```

**예제:**

```typescript
pascalCase('dashboard-screen'); // 'DashboardScreen'
```

---

### kebabCase()

문자열을 kebab-case로 변환합니다.

**시그니처:**

```typescript
function kebabCase(str: string): string;
```

**예제:**

```typescript
kebabCase('DashboardScreen'); // 'dashboard-screen'
```

---

### formatCode()

코드를 포맷팅합니다 (선택적으로 Prettier 사용).

**시그니처:**

```typescript
function formatCode(code: string, options: GeneratorOptions): string;
```

**매개변수:**

- `code` - 포맷팅할 코드
- `options` - 포맷팅 옵션

**반환값:**

- `string` - 포맷팅된 코드

**예제:**

```typescript
const formatted = formatCode(code, {
  format: 'typescript',
  prettier: true,
});
```

---

### propValueToJSX()

prop 값을 JSX 표현식으로 변환합니다.

**시그니처:**

```typescript
function propValueToJSX(value: unknown): string;
```

**매개변수:**

- `value` - prop 값

**반환값:**

- `string` - JSX 표현식

**예제:**

```typescript
propValueToJSX('primary'); // '"primary"'
propValueToJSX(3); // '{3}'
propValueToJSX(true); // '{true}'
propValueToJSX({ variant: 'primary' }); // `{{ variant: "primary" }}`
```

---

### generateImports()

import 문을 생성합니다.

**시그니처:**

```typescript
function generateImports(imports: Record<string, string[]>): string;
```

**매개변수:**

- `imports` - 패키지별 import 목록

**반환값:**

- `string` - import 문 코드

**예제:**

```typescript
const imports = generateImports({
  react: ['React', 'useState'],
  '@tekton/components': ['Button', 'Card'],
});
// import React, { useState } from 'react';
// import { Button, Card } from '@tekton/components';
```

---

### isValidIdentifier()

유효한 JavaScript 식별자인지 확인합니다.

**시그니처:**

```typescript
function isValidIdentifier(name: string): boolean;
```

**예제:**

```typescript
isValidIdentifier('myComponent'); // true
isValidIdentifier('my-component'); // false
isValidIdentifier('123component'); // false
```

---

### sanitizeIdentifier()

문자열을 유효한 JavaScript 식별자로 정제합니다.

**시그니처:**

```typescript
function sanitizeIdentifier(name: string): string;
```

**예제:**

```typescript
sanitizeIdentifier('my-component'); // 'myComponent'
sanitizeIdentifier('123-component'); // '_123Component'
```

---

## 타입 가드

### isComponentDefinition()

값이 ComponentDefinition인지 확인합니다.

**시그니처:**

```typescript
function isComponentDefinition(value: unknown): value is ComponentDefinition;
```

---

### isScreenDefinition()

값이 ScreenDefinition인지 확인합니다.

**시그니처:**

```typescript
function isScreenDefinition(value: unknown): value is ScreenDefinition;
```

---

### isValidResolvedScreen()

값이 유효한 ResolvedScreen인지 확인합니다.

**시그니처:**

```typescript
function isValidResolvedScreen(value: unknown): value is ResolvedScreen;
```

---

## 기본 옵션

### defaultGeneratorOptions

기본 생성기 옵션.

```typescript
const defaultGeneratorOptions: GeneratorOptions = {
  format: 'typescript',
  prettier: false,
  indent: 2,
  semicolons: true,
  singleQuote: false,
};
```

---

## 추가 자료

- **[Phase 1: Schema & Validation](./PHASE-1.md)** - 스키마 및 검증 상세
- **[Phase 2: Resolver Pipeline](./PHASE-2.md)** - 리졸버 파이프라인 상세
- **[Phase 3: Output Generators](./PHASE-3.md)** - 생성기 상세
- **[Integration Guide](./INTEGRATION.md)** - 통합 가이드

---

**[SPEC-LAYOUT-002]** [PHASE-5: API Reference]
