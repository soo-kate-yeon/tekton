# 개발자 가이드 (Developer Guide)

Tekton MCP Server 개발에 기여하는 방법을 안내합니다.

## 목차

1. [개발 환경 설정](#개발-환경-설정)
2. [코드 구조](#코드-구조)
3. [테스트 가이드](#테스트-가이드)
4. [기여 방법](#기여-방법)
5. [코딩 규칙](#코딩-규칙)
6. [릴리스 프로세스](#릴리스-프로세스)

---

## 개발 환경 설정

### 전제 조건

- **Node.js**: 20.0.0 이상
- **pnpm**: 8.0.0 이상
- **TypeScript**: 5.7.0 이상 (자동 설치됨)
- **Git**: 최신 버전

### 저장소 클론

```bash
# 저장소 클론
git clone https://github.com/your-org/tekton.git
cd tekton

# 의존성 설치 (monorepo 전체)
pnpm install

# MCP 서버로 이동
cd packages/mcp-server
```

### 개발 서버 실행

```bash
# 개발 모드 (자동 재빌드)
pnpm dev

# 빌드
pnpm build

# 프로덕션 모드
pnpm start
```

### IDE 설정

**VS Code 권장 설정** (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    }
  }
}
```

**권장 확장**:

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Vitest (테스트 실행기)

---

## 코드 구조

### 프로젝트 구조 상세

```
packages/mcp-server/
├── src/
│   ├── server.ts              # MCP 서버 진입점
│   │   - MCP Tool 등록
│   │   - HTTP 서버 초기화
│   │   - 라우팅 설정
│   │
│   ├── tools/                 # MCP Tool 구현
│   │   ├── generate-blueprint.ts
│   │   │   - 자연어 → 블루프린트 변환
│   │   │   - @tekton/core 통합
│   │   │   - 검증 및 저장
│   │   │
│   │   ├── preview-theme.ts
│   │   │   - 테마 로드
│   │   │   - CSS 변수 생성
│   │   │   - 미리보기 URL 생성
│   │   │
│   │   └── export-screen.ts
│   │       - 블루프린트 → 코드 변환
│   │       - 형식별 렌더링 (JSX/TSX/Vue)
│   │       - 파일 저장
│   │
│   ├── storage/               # 블루프린트 저장소
│   │   ├── blueprint-storage.ts
│   │   │   - 파일 시스템 I/O
│   │   │   - CRUD 작업
│   │   │   - 인덱스 관리
│   │   │
│   │   └── timestamp-manager.ts
│   │       - 타임스탬프 생성
│   │       - 충돌 감지 및 해결
│   │       - 고유성 보장
│   │
│   ├── web/                   # HTTP 엔드포인트
│   │   ├── preview-routes.ts
│   │   │   - GET /preview/:timestamp/:themeId
│   │   │   - HTML 템플릿 렌더링
│   │   │   - CSS 변수 주입
│   │   │
│   │   └── api-routes.ts
│   │       - GET /api/blueprints/:timestamp
│   │       - GET /api/themes
│   │       - JSON 응답 처리
│   │
│   ├── schemas/               # Zod 검증 스키마
│   │   └── mcp-schemas.ts
│   │       - 입력/출력 타입 정의
│   │       - Zod 스키마
│   │       - 타입 추론
│   │
│   └── utils/                 # 유틸리티 함수
│       └── error-handler.ts
│           - 오류 정규화
│           - 로깅
│           - 사용자 친화적 메시지
│
├── __tests__/                 # 테스트 스위트
│   ├── tools/                 # Tool 단위 테스트
│   ├── storage/               # Storage 단위 테스트
│   ├── web/                   # HTTP 엔드포인트 테스트
│   ├── schemas/               # 스키마 검증 테스트
│   └── integration/           # 통합 테스트
│
├── docs/                      # 문서
├── dist/                      # 빌드 출력
├── coverage/                  # 테스트 커버리지
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### 모듈 책임

#### server.ts

- MCP Protocol 서버 초기화
- Tool 등록 및 관리
- HTTP 라우팅 설정
- CORS 설정

#### tools/\*

- MCP Tool 비즈니스 로직
- 입력 검증 (Zod)
- @tekton/core 호출
- 응답 포맷팅

#### storage/\*

- 블루프린트 영속성
- 파일 시스템 관리
- 타임스탬프 관리

#### web/\*

- HTTP 요청/응답 처리
- 미리보기 HTML 렌더링
- API 엔드포인트

---

## 테스트 가이드

### 테스트 실행

```bash
# 모든 테스트 실행
pnpm test

# 워치 모드
pnpm test:watch

# 커버리지 리포트
pnpm test:coverage
```

### 테스트 구조

Tekton MCP Server는 **87.82% 커버리지**를 달성했으며, **73개 테스트**가 통과했습니다.

#### 단위 테스트 (Unit Tests)

**위치**: `__tests__/tools/`, `__tests__/storage/`, `__tests__/schemas/`

**목적**: 개별 함수와 모듈 테스트

**예제** - `generate-blueprint` 테스트:

```typescript
import { describe, it, expect } from 'vitest';
import { generateBlueprintTool } from '../src/tools/generate-blueprint';

describe('generateBlueprintTool', () => {
  it('should generate valid blueprint with correct input', async () => {
    const input = {
      description: 'Simple login form with email and password',
      layout: 'single-column',
      themeId: 'calm-wellness',
    };

    const result = await generateBlueprintTool(input);

    expect(result.success).toBe(true);
    expect(result.blueprint).toBeDefined();
    expect(result.blueprint.themeId).toBe('calm-wellness');
    expect(result.blueprint.layout).toBe('single-column');
    expect(result.previewUrl).toMatch(/^http:\/\/localhost:3000\/preview\/\d+\/calm-wellness$/);
  });

  it('should reject invalid theme ID', async () => {
    const input = {
      description: 'Test description',
      layout: 'single-column',
      themeId: 'invalid-theme',
    };

    const result = await generateBlueprintTool(input);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Theme');
  });

  it('should reject short description', async () => {
    const input = {
      description: 'Short',
      layout: 'single-column',
      themeId: 'calm-wellness',
    };

    const result = await generateBlueprintTool(input);

    expect(result.success).toBe(false);
    expect(result.error).toContain('at least 10 characters');
  });
});
```

#### 통합 테스트 (Integration Tests)

**위치**: `__tests__/integration/`

**목적**: 여러 모듈 간 상호작용 테스트

**예제** - 블루프린트 생성 → 저장 → 로드:

```typescript
import { describe, it, expect } from 'vitest';
import { generateBlueprintTool } from '../src/tools/generate-blueprint';
import { BlueprintStorage } from '../src/storage/blueprint-storage';

describe('Blueprint Generation Integration', () => {
  it('should create, save, and load blueprint', async () => {
    const storage = new BlueprintStorage();

    // 1. 블루프린트 생성
    const result = await generateBlueprintTool({
      description: 'User profile dashboard with avatar',
      layout: 'sidebar-left',
      themeId: 'korean-fintech',
    });

    expect(result.success).toBe(true);
    const timestamp = result.blueprint.timestamp;

    // 2. 저장 확인
    const exists = await storage.exists(timestamp);
    expect(exists).toBe(true);

    // 3. 로드 확인
    const loaded = await storage.load(timestamp);
    expect(loaded).toBeDefined();
    expect(loaded.id).toBe(result.blueprint.id);
  });
});
```

#### HTTP 엔드포인트 테스트

**예제** - 미리보기 엔드포인트:

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createServer } from '../src/server';

describe('Preview Routes', () => {
  const server = createServer({ port: 3001, host: 'localhost', baseUrl: 'http://localhost:3001' });

  it('should return preview HTML', async () => {
    const response = await request(server)
      .get('/preview/1738123456789/calm-wellness')
      .expect(200)
      .expect('Content-Type', /html/);

    expect(response.text).toContain('data-theme-id="calm-wellness"');
    expect(response.text).toContain('--color-primary:');
  });

  it('should return 404 for non-existent blueprint', async () => {
    const response = await request(server).get('/preview/9999999999999/calm-wellness').expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('not found');
  });
});
```

### 테스트 모범 사례

#### 1. AAA 패턴 (Arrange-Act-Assert)

```typescript
it('should validate theme ID format', () => {
  // Arrange: 테스트 데이터 준비
  const invalidThemeId = '../../../etc/passwd';

  // Act: 함수 실행
  const result = ThemeIdSchema.safeParse(invalidThemeId);

  // Assert: 결과 검증
  expect(result.success).toBe(false);
});
```

#### 2. 명확한 테스트 이름

```typescript
// ❌ 나쁜 예
it('test 1', () => {
  /* ... */
});

// ✅ 좋은 예
it('should reject theme ID with path traversal characters', () => {
  /* ... */
});
```

#### 3. 독립적인 테스트

```typescript
// ❌ 나쁜 예 - 전역 상태 공유
let sharedStorage = new BlueprintStorage();

it('test 1', () => {
  sharedStorage.save(/* ... */);
});

it('test 2', () => {
  // test 1에 의존
  const result = sharedStorage.load(/* ... */);
});

// ✅ 좋은 예 - 각 테스트가 독립적
it('test 1', () => {
  const storage = new BlueprintStorage();
  storage.save(/* ... */);
});

it('test 2', () => {
  const storage = new BlueprintStorage();
  storage.save(/* ... */);
  const result = storage.load(/* ... */);
});
```

#### 4. Edge Case 테스트

```typescript
describe('Timestamp collision handling', () => {
  it('should handle millisecond collision', () => {
    // 동일한 타임스탬프로 2개 생성 시도
  });

  it('should add random suffix on collision', () => {
    // 접미사 추가 확인
  });

  it('should retry up to 3 times', () => {
    // 재시도 로직 확인
  });
});
```

### 커버리지 목표

- **전체 커버리지**: ≥ 85%
- **핵심 모듈**: ≥ 90%
  - `tools/`
  - `storage/`
  - `schemas/`
- **유틸리티**: ≥ 80%
  - `utils/`
  - `web/`

**현재 달성**: 87.82% (73/73 테스트 통과)

---

## 기여 방법

### 기여 워크플로우

1. **이슈 확인**
   - GitHub Issues에서 작업할 이슈 선택
   - 없으면 새 이슈 생성 (기능 요청, 버그 리포트)

2. **브랜치 생성**

   ```bash
   git checkout -b feature/SPEC-MCP-002-add-websocket-support
   ```

3. **코드 작성**
   - 테스트 먼저 작성 (TDD)
   - 구현
   - 테스트 통과 확인

4. **커밋**

   ```bash
   git add .
   git commit -m "feat(mcp-server): add WebSocket support for real-time theme switching

   [SPEC-MCP-002]

   - Implement WebSocket server
   - Add real-time CSS variable updates
   - Update preview client to use WebSocket
   - Add integration tests

   Resolves #123"
   ```

5. **Pull Request**
   - GitHub에서 PR 생성
   - 템플릿 작성
   - CI 통과 확인

6. **코드 리뷰**
   - 리뷰어 피드백 반영
   - 테스트 추가/수정

7. **머지**
   - Squash and merge 권장
   - 브랜치 삭제

### 커밋 메시지 규칙

**형식**:

```
<type>(<scope>): <subject>

[SPEC-MCP-002]

<body>

<footer>
```

**Type**:

- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `test`: 테스트 추가/수정
- `refactor`: 리팩토링
- `style`: 코드 스타일 변경 (포맷팅)
- `chore`: 빌드, 설정 변경

**Scope**:

- `mcp-server`: MCP 서버
- `tools`: MCP Tools
- `storage`: 저장소
- `web`: HTTP 엔드포인트

**예제**:

```bash
feat(tools): add componentHints support to generate-blueprint

[SPEC-MCP-002]

- Add optional componentHints parameter to input schema
- Pass hints to @tekton/core createBlueprint
- Update validation tests
- Add integration test with hints

Resolves #456
```

---

## 코딩 규칙

### TypeScript 규칙

#### 1. 엄격한 타입 사용

```typescript
// ❌ 나쁜 예
function process(data: any) {
  return data.value;
}

// ✅ 좋은 예
interface InputData {
  value: string;
}

function process(data: InputData): string {
  return data.value;
}
```

#### 2. 명시적 반환 타입

```typescript
// ❌ 나쁜 예
async function loadTheme(id: string) {
  return await fetchTheme(id);
}

// ✅ 좋은 예
async function loadTheme(id: string): Promise<Theme> {
  return await fetchTheme(id);
}
```

#### 3. 불변성 선호

```typescript
// ❌ 나쁜 예
let result = [];
for (const item of items) {
  result.push(transform(item));
}

// ✅ 좋은 예
const result = items.map(transform);
```

### 코드 스타일

#### 1. 명확한 변수명

```typescript
// ❌ 나쁜 예
const t = Date.now();
const bp = createBlueprint();

// ✅ 좋은 예
const timestamp = Date.now();
const blueprint = createBlueprint();
```

#### 2. 함수 크기 제한

- 함수는 **30줄 이하** 권장
- 복잡한 로직은 여러 작은 함수로 분리

#### 3. 주석 작성

```typescript
/**
 * Generate unique timestamp for blueprint ID
 *
 * Handles collision by adding random 6-character suffix.
 * Collision probability: < 0.001%
 *
 * @returns Unique timestamp as number
 * @throws Error if unable to generate after 3 retries
 */
function generateUniqueTimestamp(): number {
  // 구현...
}
```

### 오류 처리

#### 1. 명시적 오류 타입

```typescript
// ❌ 나쁜 예
throw new Error('Invalid');

// ✅ 좋은 예
throw new ValidationError('Theme ID must contain only lowercase letters, numbers, and hyphens');
```

#### 2. 오류 복구

```typescript
try {
  const blueprint = await storage.load(timestamp);
  return blueprint;
} catch (error) {
  if (error instanceof NotFoundError) {
    // 복구 가능한 오류
    return null;
  }
  // 복구 불가능한 오류는 재throw
  throw error;
}
```

---

## 릴리스 프로세스

### 버전 관리

Tekton은 **Semantic Versioning (SemVer)**를 따릅니다.

**형식**: `MAJOR.MINOR.PATCH`

- **MAJOR**: 호환성 파괴 변경
- **MINOR**: 새 기능 (호환성 유지)
- **PATCH**: 버그 수정

### 릴리스 체크리스트

1. **테스트 통과 확인**

   ```bash
   pnpm test:coverage
   # 커버리지 ≥ 85% 확인
   ```

2. **문서 업데이트**
   - README.md
   - CHANGELOG.md
   - API 문서

3. **버전 업데이트**

   ```bash
   pnpm version minor  # 또는 major, patch
   ```

4. **빌드 확인**

   ```bash
   pnpm build
   # dist/ 디렉토리 확인
   ```

5. **태그 생성**

   ```bash
   git tag v0.2.0
   git push origin v0.2.0
   ```

6. **GitHub Release 생성**
   - Release notes 작성
   - 변경사항 요약
   - 마이그레이션 가이드 (필요시)

---

## 문제 해결

### 개발 환경 문제

#### TypeScript 컴파일 오류

```bash
# tsconfig.json 확인
cat tsconfig.json

# 의존성 재설치
rm -rf node_modules
pnpm install
```

#### 테스트 실패

```bash
# 단일 테스트 파일 실행
pnpm test __tests__/tools/generate-blueprint.test.ts

# 디버그 모드
pnpm test --reporter=verbose
```

### 일반적인 실수

#### 1. @tekton/core 버전 불일치

**문제**: MCP 서버와 @tekton/core 버전 불일치

**해결**:

```bash
# Workspace 버전 확인
pnpm list @tekton/core

# 최신 버전으로 업데이트
pnpm update @tekton/core
```

#### 2. 포트 충돌

**문제**: 3000번 포트가 이미 사용 중

**해결**:

```bash
# 사용 중인 프로세스 확인
lsof -i :3000

# 다른 포트로 실행
PORT=3001 pnpm start
```

---

## 추가 리소스

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [Zod Documentation](https://zod.dev/)
- [MCP Protocol Spec](https://modelcontextprotocol.io/)

---

**다음**: [통합 가이드](./06-integration-guide.md) - SPEC-PLAYGROUND-001 통합
