# Integration Guide

기존 프로젝트에 Screen Generation Pipeline 통합하기

## 개요

이 가이드는 Screen Generation Pipeline을 기존 프로젝트에 통합하는 방법을 단계별로 안내합니다. Next.js, Create React App, Vite 등 다양한 React 설정에 적용할 수 있습니다.

## 설치

### 1. 패키지 설치

```bash
# npm
npm install @tekton/core

# pnpm
pnpm add @tekton/core

# yarn
yarn add @tekton/core
```

### 2. TypeScript 설정

`tsconfig.json` 설정:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 3. CSS-in-JS 프레임워크 설치 (선택적)

**styled-components 사용 시:**

```bash
npm install styled-components
npm install -D @types/styled-components
```

**Emotion 사용 시:**

```bash
npm install @emotion/react @emotion/styled
```

### 4. Tailwind CSS 설정 (선택적)

**Tailwind 사용 시:**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 프로젝트 구조

권장 디렉토리 구조:

```
src/
├── screens/                    # 화면 정의 (JSON)
│   ├── dashboard-screen.json
│   └── settings-screen.json
├── components/                 # 생성된 컴포넌트
│   ├── DashboardScreen.tsx
│   └── SettingsScreen.tsx
├── scripts/                    # 생성 스크립트
│   └── generate-screens.ts
└── types/                      # 타입 정의
    └── screen-generation.d.ts
```

## 통합 워크플로우

### 1. 화면 정의 생성

`src/screens/dashboard-screen.json` 생성:

```json
{
  "id": "dashboard-screen",
  "name": "Dashboard Overview",
  "shell": "shell.web.dashboard",
  "page": "page.dashboard",
  "sections": [
    {
      "id": "metrics-section",
      "pattern": "section.grid-4",
      "components": [
        {
          "type": "Card",
          "props": { "variant": "elevated" },
          "children": [
            {
              "type": "Heading",
              "props": { "level": 3 },
              "children": ["Total Users"]
            }
          ]
        }
      ]
    }
  ]
}
```

### 2. 생성 스크립트 작성

`src/scripts/generate-screens.ts` 생성:

```typescript
import fs from 'fs/promises';
import path from 'path';
import {
  validateScreenDefinition,
  resolveScreen,
  generateReactComponent,
  type ScreenDefinition,
} from '@tekton/core/screen-generation';

async function generateScreen(screenPath: string, outputDir: string) {
  // 1. 화면 정의 로드
  const screenDefRaw = await fs.readFile(screenPath, 'utf-8');
  const screenDef: ScreenDefinition = JSON.parse(screenDefRaw);

  // 2. 검증
  const validation = validateScreenDefinition(screenDef);
  if (!validation.valid) {
    console.error(`Validation failed for ${screenPath}:`, validation.errors);
    process.exit(1);
  }

  // 3. 해석
  console.log(`Resolving ${screenDef.id}...`);
  const resolved = await resolveScreen(screenDef);

  // 4. 코드 생성
  console.log(`Generating React component...`);
  const result = generateReactComponent(resolved, {
    format: 'typescript',
    prettier: false,
  });

  if (!result.success) {
    console.error(`Generation failed:`, result.error);
    process.exit(1);
  }

  // 5. 파일 저장
  const componentName = screenDef.id
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  const outputPath = path.join(outputDir, `${componentName}.tsx`);

  await fs.writeFile(outputPath, result.code, 'utf-8');
  console.log(`✅ Generated: ${outputPath}`);
}

async function main() {
  const screensDir = path.join(__dirname, '../screens');
  const outputDir = path.join(__dirname, '../components');

  // 출력 디렉토리 생성
  await fs.mkdir(outputDir, { recursive: true });

  // 모든 화면 정의 처리
  const files = await fs.readdir(screensDir);
  const screenFiles = files.filter(f => f.endsWith('.json'));

  for (const file of screenFiles) {
    const screenPath = path.join(screensDir, file);
    await generateScreen(screenPath, outputDir);
  }

  console.log(`\n✅ Generated ${screenFiles.length} screens`);
}

main().catch(console.error);
```

### 3. package.json 스크립트 추가

```json
{
  "scripts": {
    "generate:screens": "tsx src/scripts/generate-screens.ts",
    "dev": "npm run generate:screens && next dev",
    "build": "npm run generate:screens && next build"
  }
}
```

### 4. 생성된 컴포넌트 사용

```typescript
// app/dashboard/page.tsx
import { DashboardScreen } from '@/components/DashboardScreen';

export default function DashboardPage() {
  return <DashboardScreen />;
}
```

## 프레임워크별 통합

### Next.js 통합

**App Router (Next.js 13+):**

```typescript
// app/dashboard/page.tsx
import { DashboardScreen } from '@/components/DashboardScreen';

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-6">
      <DashboardScreen />
    </main>
  );
}
```

**Pages Router:**

```typescript
// pages/dashboard.tsx
import { DashboardScreen } from '@/components/DashboardScreen';

export default function Dashboard() {
  return <DashboardScreen />;
}
```

**빌드 타임 생성:**

```typescript
// next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // 서버 사이드 빌드 시 화면 생성
      require('./src/scripts/generate-screens.ts');
    }
    return config;
  },
};
```

### Create React App 통합

```typescript
// src/App.tsx
import React from 'react';
import { DashboardScreen } from './components/DashboardScreen';

function App() {
  return (
    <div className="App">
      <DashboardScreen />
    </div>
  );
}

export default App;
```

**개발 워크플로우:**

```bash
# 화면 생성 후 개발 서버 시작
npm run generate:screens && npm start
```

### Vite 통합

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { DashboardScreen } from './components/DashboardScreen';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DashboardScreen />
  </React.StrictMode>
);
```

**Vite 플러그인 (자동 생성):**

```typescript
// vite-plugin-screen-generation.ts
import type { Plugin } from 'vite';
import { generateScreens } from './scripts/generate-screens';

export function screenGenerationPlugin(): Plugin {
  return {
    name: 'screen-generation',
    buildStart: async () => {
      console.log('Generating screens...');
      await generateScreens();
      console.log('✅ Screens generated');
    },
  };
}

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { screenGenerationPlugin } from './vite-plugin-screen-generation';

export default defineConfig({
  plugins: [react(), screenGenerationPlugin()],
});
```

## CSS 프레임워크 통합

### styled-components

**테마 설정:**

```typescript
// src/theme/theme.ts
import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6'
  },
  spacing: {
    4: '16px',
    6: '24px'
  }
};

// src/App.tsx
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { DashboardScreen } from './components/DashboardScreen';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <DashboardScreen />
    </ThemeProvider>
  );
}
```

**생성 옵션:**

```typescript
const result = generateStyledComponents(resolved, 'styled-components', {
  format: 'typescript',
  prettier: true,
});
```

### Emotion

**설정:**

```typescript
// src/App.tsx
import { ThemeProvider } from '@emotion/react';
import { theme } from './theme/theme';
import { DashboardScreen } from './components/DashboardScreen';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <DashboardScreen />
    </ThemeProvider>
  );
}
```

### Tailwind CSS

**tailwind.config.js 자동 생성:**

```typescript
// src/scripts/generate-tailwind-config.ts
import fs from 'fs/promises';
import {
  resolveScreen,
  generateTailwindConfig,
  type ScreenDefinition,
} from '@tekton/core/screen-generation';

async function generateConfig() {
  // 화면 정의 로드
  const screenDef: ScreenDefinition = JSON.parse(
    await fs.readFile('./src/screens/dashboard-screen.json', 'utf-8')
  );

  // 화면 해석
  const resolved = await resolveScreen(screenDef);

  // Tailwind 설정 생성
  const config = generateTailwindConfig(resolved);

  // 파일 저장
  await fs.writeFile('./tailwind.config.js', config);
  console.log('✅ Generated tailwind.config.js');
}

generateConfig();
```

**사용:**

```bash
npm run generate:tailwind && npm run dev
```

## 에러 처리

### 검증 에러

```typescript
import { validateScreenDefinition, type ValidationResult } from '@tekton/core/screen-generation';

function handleValidationError(result: ValidationResult) {
  if (!result.valid) {
    console.error('❌ Validation Errors:');
    result.errors?.forEach((error, index) => {
      console.error(`  ${index + 1}. ${error}`);
    });
    process.exit(1);
  }

  if (result.warnings) {
    console.warn('⚠️  Warnings:');
    result.warnings.forEach((warning, index) => {
      console.warn(`  ${index + 1}. ${warning}`);
    });
  }
}
```

### 해석 에러

```typescript
try {
  const resolved = await resolveScreen(screenDef);
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('Token not found')) {
      console.error('❌ Missing token:', error.message);
      console.error('Check SPEC-LAYOUT-001 token definitions');
    } else if (error.message.includes('Circular reference')) {
      console.error('❌ Circular token reference:', error.message);
    } else {
      console.error('❌ Resolution error:', error.message);
    }
  }
  process.exit(1);
}
```

### 생성 에러

```typescript
const result = generateReactComponent(resolved, options);

if (!result.success) {
  console.error('❌ Code generation failed:', result.error);
  // 폴백 또는 재시도 로직
  process.exit(1);
}
```

## 테스트 전략

### 화면 정의 검증 테스트

```typescript
// tests/screens/dashboard-screen.test.ts
import { describe, it, expect } from 'vitest';
import { validateScreenDefinition } from '@tekton/core/screen-generation';
import screenDef from '../../src/screens/dashboard-screen.json';

describe('Dashboard Screen Definition', () => {
  it('should be valid', () => {
    const result = validateScreenDefinition(screenDef);
    expect(result.valid).toBe(true);
  });

  it('should have required fields', () => {
    expect(screenDef.id).toBe('dashboard-screen');
    expect(screenDef.sections).toHaveLength(1);
  });
});
```

### 생성된 컴포넌트 테스트

```typescript
// tests/components/DashboardScreen.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DashboardScreen } from '../../src/components/DashboardScreen';

describe('DashboardScreen', () => {
  it('renders without crashing', () => {
    const { container } = render(<DashboardScreen />);
    expect(container).toBeInTheDocument();
  });

  it('contains metrics section', () => {
    const { getByText } = render(<DashboardScreen />);
    expect(getByText('Total Users')).toBeInTheDocument();
  });

  it('has correct data attributes', () => {
    const { container } = render(<DashboardScreen />);
    const section = container.querySelector('[data-section-id="metrics-section"]');
    expect(section).toBeInTheDocument();
  });
});
```

### 통합 테스트

```typescript
// tests/integration/screen-generation.test.ts
import { describe, it, expect } from 'vitest';
import {
  validateScreenDefinition,
  resolveScreen,
  generateReactComponent,
} from '@tekton/core/screen-generation';
import screenDef from '../../src/screens/dashboard-screen.json';

describe('Screen Generation Integration', () => {
  it('complete pipeline works', async () => {
    // 1. 검증
    const validation = validateScreenDefinition(screenDef);
    expect(validation.valid).toBe(true);

    // 2. 해석
    const resolved = await resolveScreen(screenDef);
    expect(resolved.sections).toHaveLength(1);

    // 3. 생성
    const result = generateReactComponent(resolved, {
      format: 'typescript',
    });
    expect(result.success).toBe(true);
    expect(result.code).toContain('DashboardScreen');
  });
});
```

## CI/CD 통합

### GitHub Actions

`.github/workflows/generate-screens.yml`:

```yaml
name: Generate Screens

on:
  push:
    paths:
      - 'src/screens/**'
  pull_request:
    paths:
      - 'src/screens/**'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate screens
        run: npm run generate:screens

      - name: Run tests
        run: npm test

      - name: Commit generated files
        if: github.event_name == 'push'
        run: |
          git config --local user.name "GitHub Actions"
          git config --local user.email "actions@github.com"
          git add src/components/*.tsx
          git diff --cached --quiet || git commit -m "chore: regenerate screens [skip ci]"
          git push
```

### 로컬 Git Hooks

`.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# 화면 정의 변경 시 자동 재생성
if git diff --cached --name-only | grep -q "src/screens/.*\.json"; then
  echo "🔨 Regenerating screens..."
  npm run generate:screens
  git add src/components/*.tsx
fi
```

## 성능 최적화

### 캐싱

```typescript
// src/scripts/generate-screens-cached.ts
import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

const cache = new LRUCache<string, string>({
  max: 100,
  ttl: 1000 * 60 * 60, // 1시간
});

function getCacheKey(screenDef: ScreenDefinition): string {
  return crypto.createHash('md5').update(JSON.stringify(screenDef)).digest('hex');
}

async function generateScreenCached(screenDef: ScreenDefinition) {
  const cacheKey = getCacheKey(screenDef);

  // 캐시 확인
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`✅ Using cached result for ${screenDef.id}`);
    return cached;
  }

  // 생성
  const resolved = await resolveScreen(screenDef);
  const result = generateReactComponent(resolved);

  // 캐시 저장
  cache.set(cacheKey, result.code);

  return result.code;
}
```

### 병렬 생성

```typescript
// src/scripts/generate-screens-parallel.ts
async function generateAllScreens(screenFiles: string[]) {
  const results = await Promise.all(screenFiles.map(file => generateScreen(file, outputDir)));

  console.log(`✅ Generated ${results.length} screens in parallel`);
}
```

## 트러블슈팅

### 일반적인 문제

**문제: 토큰 미발견 오류**

```
Error: Token not found: color.primary.500
```

**해결책:**

- SPEC-LAYOUT-001 토큰 정의 확인
- 테마 ID가 올바른지 확인
- 토큰 철자 확인

**문제: TypeScript 컴파일 오류**

```
Cannot find module '@tekton/core/screen-generation'
```

**해결책:**

- tsconfig.json에 `"moduleResolution": "bundler"` 또는 `"node16"` 설정
- `npm install` 재실행

**문제: 생성된 컴포넌트가 렌더링되지 않음**

**해결책:**

- 컴포넌트 라이브러리 설치 확인 (`@tekton/components`)
- CSS 프레임워크 설정 확인
- 브라우저 콘솔에서 에러 확인

## 다음 단계

통합을 완료했다면:

1. **[MCP Tools](../../mcp-server/SCREEN-TOOLS.md)** - Claude와 함께 LLM 생성 사용
2. **[API Reference](./API.md)** - 고급 API 사용법 탐색
3. **프로덕션 배포** - 빌드 최적화 및 성능 튜닝

## 추가 자료

- **SPEC-LAYOUT-001** - 레이아웃 토큰 시스템
- **SPEC-COMPONENT-001-B** - 컴포넌트 스키마
- **[Phase 1: Schema & Validation](./PHASE-1.md)** - 화면 정의 작성법
- **[Phase 2: Resolver Pipeline](./PHASE-2.md)** - 해석 과정 이해
- **[Phase 3: Output Generators](./PHASE-3.md)** - 생성 옵션 커스터마이징

---

**[SPEC-LAYOUT-002]** [PHASE-5: Integration Guide]
