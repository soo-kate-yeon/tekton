# Create-Screen User Flow Implementation Status

> 유저 플로우 완성을 위한 현재 상태 및 남은 작업 정리

**최종 업데이트**: 2026-01-17

---

## 목표 유저 플로우

```
유저: tekton create-screen Dashboard --theme "MyBrand"

→ AI 에이전트가 자동으로:
  1. Intent 분석 → 필요한 컴포넌트 추천 (Card, Progress, Badge)
  2. MCP로 각 컴포넌트의 아키타입(스타일 규칙) 조회
  3. 사용자 프리셋에서 토큰(색상, 간격 등) 조회
  4. 토큰이 적용된 완전한 컴포넌트 코드 생성
  5. 파일 저장
```

---

## 현재 구현 상태

### ✅ 완료된 것

| 레이어                 | 구현체                     | 설명                                 |
| ---------------------- | -------------------------- | ------------------------------------ |
| **Component System**   | `@tekton/component-system` | 20개 훅의 스타일 규칙 정의           |
| **Token Contract**     | `@tekton/token-contract`   | OKLCH 토큰 스키마, 7개 프리셋        |
| **Studio MCP**         | `@tekton/studio-mcp`       | AI용 아키타입 조회 API               |
| **Studio API**         | `studio-api`               | 프리셋 CRUD REST API                 |
| **Studio Web**         | `studio-web`               | 프리셋 갤러리 UI                     |
| **Contracts**          | `@tekton/contracts`        | Intent, Skeleton, Environment 스키마 |
| **create-screen 로직** | `cli/create-screen.ts`     | 파일 생성 로직 (단, CLI 미등록)      |

### ❌ 미완료 / 연결 안됨

| 문제                     | 현재 상태                       | 필요한 작업         |
| ------------------------ | ------------------------------- | ------------------- |
| **CLI 명령 미등록**      | `index.ts`에 create-screen 없음 | 명령어 등록         |
| **MCP 연동 없음**        | create-screen이 MCP 호출 안함   | ArchetypeTools 연동 |
| **프리셋 토큰 미적용**   | 프리셋 조회 로직 없음           | Studio API 연동     |
| **컴포넌트 코드 미생성** | 빈 스켈레톤만 생성              | 템플릿 엔진 구현    |

---

## 데이터 플로우 (목표)

```
┌─────────────────────────────────────────────────────────────┐
│                     tekton create-screen                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Intent 분석                                              │
│     └─→ INTENT_TO_COMPOUND_PATTERNS["Dashboard"]            │
│         → ["Card", "Progress", "Badge"]                     │
│                                                              │
│  2. 아키타입 조회 (MCP)                 ← 현재 연결 안됨 ❌   │
│     └─→ component.get("useCard")                            │
│         → { baseStyles, stateMappings, variants }           │
│                                                              │
│  3. 프리셋 토큰 조회 (API)             ← 현재 연결 안됨 ❌    │
│     └─→ GET /api/v2/themes/:id                             │
│         → { primary-500: "oklch(...)", radius-md: "8px" }   │
│                                                              │
│  4. 코드 생성 (템플릿)                  ← 현재 빈 스켈레톤만   │
│     └─→ 아키타입 규칙 + 토큰 값 결합                         │
│         → 완전한 React 컴포넌트 코드                         │
│                                                              │
│  5. 파일 저장                           ← 구현됨 ✅          │
│     └─→ src/screens/Dashboard/                              │
│         ├── page.tsx                                         │
│         ├── layout.tsx                                       │
│         └── components/                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 남은 태스크

### Priority 1: 연결 작업 (3-4시간)

1. **CLI에 create-screen 명령 등록**
   - 파일: `packages/cli/src/index.ts`
   - 작업: 명령어 추가, 옵션 정의

2. **MCP 클라이언트 연동**
   - 파일: `packages/cli/src/mcp-client.ts` (신규)
   - 작업: ArchetypeTools 호출, 스타일 규칙 조회

3. **프리셋 API 연동**
   - 파일: `packages/cli/src/api-client.ts` (신규)
   - 작업: Studio API에서 토큰 값 조회

### Priority 2: 코드 생성 (4-5시간)

4. **컴포넌트 템플릿 엔진**
   - 파일: `packages/cli/src/templates/*.ts`
   - 작업: 아키타입 규칙 + 토큰 → React 코드 생성

5. **스타일 주입 로직**
   - 작업: CSS 변수 또는 인라인 스타일 적용

### Priority 3: 테스트 및 문서화 (2시간)

6. **통합 테스트**
7. **USER_GUIDE 업데이트**

---

## 완료 기준

- [ ] `tekton create-screen Dashboard` 명령 실행 가능
- [ ] MCP에서 아키타입 조회 성공
- [ ] 프리셋 토큰이 컴포넌트에 적용됨
- [ ] 생성된 코드가 즉시 실행 가능
- [ ] 다크 모드 토큰 자동 포함

---

## 관련 파일

| 파일                                                  | 역할              |
| ----------------------------------------------------- | ----------------- |
| `packages/cli/src/index.ts`                           | CLI 진입점        |
| `packages/cli/src/commands/create-screen.ts`          | 화면 생성 로직    |
| `packages/cli/src/generators/screen-generator.ts`     | 파일 생성기       |
| `packages/studio-mcp/src/component/tools.ts`          | 아키타입 MCP 도구 |
| `packages/studio-api/src/studio_api/api/v2/themes.py` | 프리셋 API        |
