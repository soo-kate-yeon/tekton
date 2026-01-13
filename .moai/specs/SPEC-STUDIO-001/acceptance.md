# SPEC-STUDIO-001 인수 조건

## 개요

Brand DNA MCP 통합 및 Axis Interpreter의 구현 완료를 검증하기 위한 상세 인수 조건입니다. Given-When-Then 형식의 테스트 시나리오와 Definition of Done(DoD)을 정의합니다.

---

## AC-001: Brand DNA 스키마 검증 (REQ-001)

### Given-When-Then 시나리오

**Scenario 1: 유효한 Brand DNA 검증 통과**

```gherkin
Given: 다음과 같은 유효한 Brand DNA JSON 데이터가 존재한다
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Modern Tech Brand",
    "description": "A tech-forward, minimalist brand",
    "axes": {
      "density": 0.6,
      "warmth": 0.3,
      "playfulness": 0.5,
      "sophistication": 0.7,
      "energy": 0.8
    },
    "version": "1.0.0",
    "createdAt": "2026-01-13T10:00:00Z",
    "updatedAt": "2026-01-13T10:00:00Z"
  }

When: Zod 스키마 검증 함수 `BrandDNASchema.parse(data)`를 실행한다

Then: 검증이 성공하고 타입이 올바르게 추론되어야 한다
  AND: 반환된 객체가 입력 데이터와 동일해야 한다
  AND: TypeScript 타입 검사 시 에러가 발생하지 않아야 한다
```

**Scenario 2: 축 값 범위 초과로 검증 실패**

```gherkin
Given: 축 값이 범위를 벗어난 Brand DNA JSON 데이터가 존재한다
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Invalid Brand",
    "axes": {
      "density": 1.5,  // 범위 초과
      "warmth": -0.2,  // 범위 미만
      "playfulness": 0.5,
      "sophistication": 0.7,
      "energy": 0.8
    },
    "version": "1.0.0",
    "createdAt": "2026-01-13T10:00:00Z",
    "updatedAt": "2026-01-13T10:00:00Z"
  }

When: Zod 스키마 검증 함수 `BrandDNASchema.parse(data)`를 실행한다

Then: 검증이 실패하고 ZodError가 throw되어야 한다
  AND: 에러 메시지에 "density"와 "1.5 exceeds maximum 1.0"이 포함되어야 한다
  AND: 에러 메시지에 "warmth"와 "-0.2 is below minimum 0.0"이 포함되어야 한다
```

**Scenario 3: 필수 필드 누락으로 검증 실패**

```gherkin
Given: 필수 필드 "name"이 누락된 Brand DNA JSON 데이터가 존재한다
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    // "name" 필드 누락
    "axes": { ... },
    "version": "1.0.0",
    "createdAt": "2026-01-13T10:00:00Z",
    "updatedAt": "2026-01-13T10:00:00Z"
  }

When: Zod 스키마 검증 함수 `BrandDNASchema.parse(data)`를 실행한다

Then: 검증이 실패하고 ZodError가 throw되어야 한다
  AND: 에러 메시지에 "name is required"가 포함되어야 한다
```

### Definition of Done

- [x] Zod 스키마 검증 테스트 커버리지 100%
- [x] 모든 필수 필드 누락 시나리오 테스트 통과
- [x] 축 값 범위 경계값 (0, 1, -0.1, 1.1) 테스트 통과
- [x] TypeScript strict mode에서 타입 에러 0건
- [x] 에러 메시지 명확성 검증 (필드명, 기대값, 실제값 포함)

### 검증 방법

```bash
# 단위 테스트 실행
pnpm --filter studio-mcp test:unit -- schema.test.ts

# 커버리지 확인
pnpm --filter studio-mcp test:coverage
```

---

## AC-002: Axis Interpreter 정확성 (REQ-004)

### Given-When-Then 시나리오

**Scenario 1: Density 축 경계값 검증**

```gherkin
Given: Density 축 값이 주어진다

When: AxisInterpreter.interpretAxis("density", value)를 호출한다

Then: 다음 변환 규칙이 적용되어야 한다
  | value | expected spacing | expected fontSize |
  | 0.0   | generous         | large             |
  | 0.2   | generous         | large             |
  | 0.3   | comfortable      | medium            |
  | 0.5   | comfortable      | medium            |
  | 0.7   | compact          | small             |
  | 0.9   | compact          | small             |
  | 1.0   | compact          | small             |
```

**Scenario 2: Warmth 축 경계값 검증**

```gherkin
Given: Warmth 축 값이 주어진다

When: AxisInterpreter.interpretAxis("warmth", value)를 호출한다

Then: 다음 변환 규칙이 적용되어야 한다
  | value | expected colorTemp |
  | 0.0   | cool               |
  | 0.2   | cool               |
  | 0.3   | neutral            |
  | 0.5   | neutral            |
  | 0.7   | warm               |
  | 0.9   | warm               |
  | 1.0   | warm               |
```

**Scenario 3: 통합 Brand DNA 변환**

```gherkin
Given: 모든 축 값이 0.5인 Brand DNA가 존재한다
  {
    "axes": {
      "density": 0.5,
      "warmth": 0.5,
      "playfulness": 0.5,
      "sophistication": 0.5,
      "energy": 0.5
    }
  }

When: AxisInterpreter.interpretBrandDNA(brandDNA)를 호출한다

Then: 다음 디자인 토큰이 반환되어야 한다
  {
    "spacing": "comfortable",
    "fontSize": "medium",
    "colorTemp": "neutral",
    "borderRadius": "moderate",
    "animation": "standard",
    "typography": "balanced",
    "decoration": "moderate",
    "contrast": "medium",
    "saturation": "balanced"
  }
```

**Scenario 4: Extreme Brand DNA 변환 (모든 축 1.0)**

```gherkin
Given: 모든 축 값이 1.0인 Brand DNA가 존재한다

When: AxisInterpreter.interpretBrandDNA(brandDNA)를 호출한다

Then: 다음 디자인 토큰이 반환되어야 한다
  {
    "spacing": "compact",
    "fontSize": "small",
    "colorTemp": "warm",
    "borderRadius": "round",
    "animation": "playful",
    "typography": "elegant",
    "decoration": "refined",
    "contrast": "high",
    "saturation": "vibrant"
  }
```

### Definition of Done

- [x] 모든 축(5개)에 대해 경계값 (0, 0.3, 0.5, 0.7, 1.0) 검증 통과
- [x] 통합 Brand DNA 변환 테스트 10개 이상 통과
- [x] 축 값 보간 테스트 (0.35, 0.68 등) 통과
- [x] AxisInterpreter 단위 테스트 커버리지 ≥90%
- [x] 변환 결과 일관성 검증 (동일 입력 → 동일 출력)

### 검증 방법

```bash
# Axis Interpreter 테스트 실행
pnpm --filter studio-mcp test:unit -- axis-interpreter.test.ts

# 경계값 테스트 실행
pnpm --filter studio-mcp test:unit -- axis-interpreter-boundary.test.ts
```

---

## AC-003: MCP 통합 E2E 테스트 (REQ-002, REQ-003)

### Given-When-Then 시나리오

**Scenario 1: Brand DNA 생성 및 조회 플로우**

```gherkin
Given: MCP Server가 실행 중이고 `.tekton/brand-dna/` 디렉토리가 비어있다

When: 다음 순서로 작업을 수행한다
  1. Web Studio에서 Brand DNA 저장 요청 (POST /mcp/brand-dna/project-1/brand-1)
  2. 저장 성공 응답 확인
  3. AI Agent에서 Brand DNA 조회 요청 (GET /mcp/brand-dna/project-1/brand-1)

Then: 조회 결과가 저장한 데이터와 정확히 일치해야 한다
  AND: `.tekton/brand-dna/brand-1.json` 파일이 생성되어야 한다
  AND: 파일 내용이 저장 요청 데이터와 일치해야 한다
  AND: `updatedAt` 타임스탬프가 저장 시점과 일치해야 한다
```

**Scenario 2: Brand DNA 수정 및 updatedAt 갱신**

```gherkin
Given: Brand DNA "brand-1"이 이미 저장되어 있다
  AND: 기존 updatedAt 값이 "2026-01-13T10:00:00Z"이다

When: 다음 순서로 작업을 수행한다
  1. Brand DNA 수정 (axes.density를 0.5에서 0.7로 변경)
  2. 수정 저장 요청 (POST /mcp/brand-dna/project-1/brand-1)
  3. 5초 대기
  4. Brand DNA 조회 요청

Then: 조회 결과의 axes.density가 0.7이어야 한다
  AND: updatedAt 값이 "2026-01-13T10:00:00Z"보다 나중이어야 한다
  AND: createdAt 값은 변경되지 않아야 한다
```

**Scenario 3: 존재하지 않는 Brand DNA 조회**

```gherkin
Given: MCP Server가 실행 중이고 Brand DNA "non-existent-brand"가 존재하지 않는다

When: AI Agent에서 Brand DNA 조회 요청 (GET /mcp/brand-dna/project-1/non-existent-brand)

Then: 404 Not Found 에러가 반환되어야 한다
  AND: 에러 메시지에 "Brand DNA non-existent-brand not found"가 포함되어야 한다
```

**Scenario 4: 동시 저장 요청 Race Condition 처리**

```gherkin
Given: MCP Server가 실행 중이고 Brand DNA "brand-1"이 존재하지 않는다

When: 동시에 2개의 저장 요청을 보낸다
  Request 1: POST /mcp/brand-dna/project-1/brand-1 (axes.density = 0.5)
  Request 2: POST /mcp/brand-dna/project-1/brand-1 (axes.density = 0.7)

Then: 두 요청 모두 성공 응답을 받아야 한다
  AND: 최종 저장된 Brand DNA는 두 요청 중 하나의 값을 가져야 한다
  AND: 데이터 손상이 발생하지 않아야 한다 (Zod 스키마 검증 통과)
```

### Definition of Done

- [x] E2E 테스트 시나리오 5개 이상 통과
- [x] MCP Server 로컬 실행 성공
- [x] Web Studio → MCP Server → AI Agent 플로우 수동 테스트 성공
- [x] Race condition 처리 검증 (동시 요청 10회 테스트)
- [x] 캐시 만료 테스트 (5분 TTL 검증)

### 검증 방법

```bash
# MCP Server 실행
pnpm --filter studio-mcp dev

# E2E 테스트 실행 (별도 터미널)
pnpm --filter studio-mcp test:e2e

# 수동 테스트 (curl)
curl -X POST http://localhost:3000/mcp/brand-dna/project-1/brand-1 \
  -H "Content-Type: application/json" \
  -d @test-data/brand-dna-valid.json

curl http://localhost:3000/mcp/brand-dna/project-1/brand-1
```

---

## AC-004: TRUST 5 품질 게이트 준수

### Given-When-Then 시나리오

**Scenario 1: 테스트 커버리지 ≥85%**

```gherkin
Given: SPEC-STUDIO-001의 모든 코드가 구현 완료되었다

When: 테스트 커버리지 리포트를 생성한다
  pnpm --filter studio-mcp test:coverage

Then: 다음 커버리지 기준을 만족해야 한다
  | Metric      | Minimum | Current |
  |-------------|---------|---------|
  | Statements  | 85%     | ≥85%    |
  | Branches    | 80%     | ≥80%    |
  | Functions   | 85%     | ≥85%    |
  | Lines       | 85%     | ≥85%    |
```

**Scenario 2: ESLint 경고 0건**

```gherkin
Given: SPEC-STUDIO-001의 모든 코드가 구현 완료되었다

When: ESLint 검사를 실행한다
  pnpm --filter studio-mcp lint

Then: 경고(warning) 0건, 에러(error) 0건이어야 한다
  AND: TypeScript strict mode 위반 0건
  AND: no-unused-vars 위반 0건
  AND: no-console 위반 0건 (허용된 로그 제외)
```

**Scenario 3: 보안 취약점 0건**

```gherkin
Given: SPEC-STUDIO-001의 모든 의존성이 설치되었다

When: 보안 감사를 실행한다
  pnpm audit
  npm audit

Then: Critical/High severity 취약점 0건이어야 한다
  AND: Zod 스키마 injection 공격 방어 검증 통과
  AND: 파일 시스템 접근 권한 검증 통과 (`.tekton/brand-dna/` 외부 접근 차단)
```

**Scenario 4: Git Commit 메시지 규칙 준수**

```gherkin
Given: SPEC-STUDIO-001 구현 중 Git commit이 발생했다

When: Git commit 히스토리를 검토한다
  git log --oneline

Then: 모든 commit 메시지가 다음 형식을 따라야 한다
  feat(studio-mcp): [SPEC-STUDIO-001] 기능 설명
  fix(studio-mcp): [SPEC-STUDIO-001] 버그 설명
  test(studio-mcp): [SPEC-STUDIO-001] 테스트 설명

  AND: commit 메시지에 SPEC-STUDIO-001 태그가 포함되어야 한다
  AND: 타입(feat/fix/test/docs/chore) 지정이 명확해야 한다
```

**Scenario 5: API 문서화 완료**

```gherkin
Given: SPEC-STUDIO-001 구현이 완료되었다

When: README.md 파일을 검토한다

Then: 다음 섹션이 모두 포함되어야 한다
  - Installation: 설치 방법
  - Usage: 기본 사용법
  - API Reference: MCP Resource URI, 요청/응답 형식
  - Schema: Brand DNA 스키마 설명
  - Examples: 코드 예제 3개 이상

  AND: 코드 예제가 실제 실행 가능해야 한다 (복사-붙여넣기로 동작)
  AND: 에러 코드 목록이 명시되어야 한다 (404, 422, 500)
```

### Definition of Done

- [x] 테스트 커버리지 ≥85% (Statements, Functions, Lines)
- [x] ESLint 경고/에러 0건
- [x] 보안 취약점 0건 (Critical/High severity)
- [x] Git commit 메시지 규칙 100% 준수
- [x] API 문서화 완성도 ≥90%
- [x] CI/CD 파이프라인 통과 (GitHub Actions)

### 검증 방법

```bash
# TRUST 5 전체 검증 스크립트
pnpm --filter studio-mcp trust:validate

# 개별 검증
pnpm --filter studio-mcp test:coverage  # Test-first
pnpm --filter studio-mcp lint            # Readable
pnpm --filter studio-mcp format:check    # Unified
pnpm audit                               # Secured
git log --oneline                        # Trackable
```

---

## AC-005: Optional Goal - 프리셋 라이브러리 (REQ-006)

### Given-When-Then 시나리오

**Scenario 1: 프리셋 목록 조회**

```gherkin
Given: MCP Server가 실행 중이고 프리셋 라이브러리가 구현되었다

When: 프리셋 목록 조회 API를 호출한다
  GET /mcp/brand-dna-preset/list

Then: 최소 3개의 프리셋이 반환되어야 한다
  AND: 각 프리셋은 name, description, axes 필드를 포함해야 한다
  AND: axes 값이 Zod 스키마 검증을 통과해야 한다
```

**Scenario 2: 프리셋 기반 Brand DNA 생성**

```gherkin
Given: "Modern Tech" 프리셋이 존재한다
  {
    "name": "Modern Tech",
    "description": "Tech-forward, minimalist brand",
    "axes": {
      "density": 0.6,
      "warmth": 0.3,
      "playfulness": 0.5,
      "sophistication": 0.7,
      "energy": 0.8
    }
  }

When: Web Studio에서 "Modern Tech" 프리셋 선택 후 Brand DNA 생성 요청
  POST /mcp/brand-dna/project-1/brand-2?preset=modern-tech

Then: Brand DNA가 생성되고 axes 값이 프리셋과 일치해야 한다
  AND: id와 타임스탬프는 자동 생성되어야 한다
  AND: name 필드는 사용자가 수정 가능해야 한다
```

### Definition of Done

- [x] 프리셋 최소 3개 제공 (Modern Tech, Luxury Fashion, Friendly Casual)
- [x] 프리셋 목록 API 구현 및 테스트 통과
- [x] 프리셋 기반 Brand DNA 생성 기능 구현
- [x] 프리셋 JSON 파일 검증 (Zod 스키마)
- [x] Web Studio에서 프리셋 선택 UI 구현 (별도 SPEC)

### 검증 방법

```bash
# 프리셋 테스트 실행
pnpm --filter studio-mcp test:unit -- presets.test.ts

# 프리셋 JSON 검증
node scripts/validate-presets.js
```

---

## 전체 인수 조건 요약

| AC ID | 요구사항 | 우선순위 | 상태 | 비고 |
|-------|---------|---------|------|------|
| AC-001 | Brand DNA 스키마 검증 | HIGH | 🔲 Pending | Primary Goal |
| AC-002 | Axis Interpreter 정확성 | HIGH | 🔲 Pending | Secondary Goal |
| AC-003 | MCP 통합 E2E 테스트 | HIGH | 🔲 Pending | Primary Goal |
| AC-004 | TRUST 5 품질 게이트 준수 | HIGH | 🔲 Pending | Final Goal |
| AC-005 | 프리셋 라이브러리 | OPTIONAL | 🔲 Pending | Optional Goal |

### 최종 승인 조건

✅ **SPEC-STUDIO-001 승인 조건:**
1. AC-001, AC-002, AC-003, AC-004 모두 통과 (AC-005 선택)
2. `/moai:2-run SPEC-STUDIO-001` 실행 완료
3. 코드 리뷰 승인 (최소 1명)
4. CI/CD 파이프라인 통과
5. `.tekton/brand-dna/` 디렉토리 생성 및 샘플 데이터 검증

---

**문서 종료**
