---
id: SPEC-PHASEB-002
version: "1.1.0"
status: "complete"
created: "2026-01-12"
updated: "2026-01-13"
author: "asleep"
priority: "HIGH"
---

## HISTORY

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-01-12 | 1.0.0 | asleep | Initial draft creation |
| 2026-01-13 | 1.1.0 | asleep | Phase B completion - All milestones M1-M4 implemented |

# SPEC-PHASEB-002: IDE Bootstrap + Integration

## 개요

Phase B는 Tekton 디자인 시스템을 개발자 워크플로우에 통합하는 IDE 도구를 제공합니다. CLI 패키지와 VS Code extension을 통해 프로젝트 스택 감지, shadcn 자동 설치, 토큰 생성을 자동화하며, Monorepo 전환을 통해 Phase A의 패키지(theme, token-generator, contracts)를 통합 관리합니다.

## 목표

**Primary Goal (필수)**:
- Monorepo 전환을 통한 통합 패키지 관리 체계 구축
- CLI를 통한 프레임워크 감지 및 자동 설정 기능 제공
- Phase A 구현체의 재사용성 및 유지보수성 향상

**Secondary Goal (중요)**:
- VS Code extension을 통한 개발자 경험 개선
- 실시간 피드백 UI 제공으로 생산성 향상

**Optional Goal (선택)**:
- Phase C Create Screen Workflow 준비 기반 마련

## Phase A 의존성

Phase B는 Phase A의 완성된 구현체를 기반으로 합니다:

- **A1: Theme System** (완료 ✅)
  - 테스트 커버리지: 97.77%
  - 6개 프리셋 구현 완료 (color, typography, spacing, shadow, radius, opacity)
  - WCAG 준수 검증 통과

- **A2: Token Generator** (완료 ✅)
  - 100% 크리티컬 패스 커버리지
  - Q&A 기반 토큰 생성 워크플로우 검증
  - CSS variables 및 Tailwind config 출력 지원

- **A3: Component Contracts** (완료 ✅)
  - 8개 MVP 컴포넌트 계약 구현
  - 82개 제약조건, 208개 테스트 케이스
  - 계약 기반 검증 시스템 완성

## EARS 요구사항

### Ubiquitous Requirements (UR) - 시스템 전반 요구사항

**UR-001: Monorepo 구조 준수**
- 시스템은 **항상** pnpm workspaces 기반 monorepo 구조를 사용해야 한다
- WHY: 패키지 간 의존성 관리 및 공유 코드 재사용 효율화
- IMPACT: 단일 저장소로 버전 관리 복잡도 감소

**UR-002: TypeScript Strict Mode 사용**
- 모든 패키지는 **항상** TypeScript strict mode를 활성화해야 한다
- WHY: 타입 안전성 보장 및 런타임 오류 사전 방지
- IMPACT: 코드 품질 및 유지보수성 향상

**UR-003: 테스트 커버리지 기준 준수**
- CLI 패키지는 **항상** ≥85% 테스트 커버리지를 유지해야 한다
- VS Code extension은 **항상** ≥70% 테스트 커버리지를 유지해야 한다
- WHY: 신뢰성 있는 코드 품질 보장
- IMPACT: 프로덕션 버그 발생률 감소

**UR-004: 크로스 플랫폼 지원**
- 시스템은 **항상** Windows, macOS, Linux에서 동작해야 한다
- WHY: 다양한 개발 환경 지원으로 사용자 범위 확대
- IMPACT: 플랫폼별 path separator 및 명령어 차이 처리 필요

**UR-005: Phase A 패키지 의존성 명시**
- CLI 및 Extension은 **항상** Phase A 패키지를 workspace dependency로 참조해야 한다
- WHY: 코드 중복 방지 및 단일 진실 원천 유지
- IMPACT: Phase A 업데이트 시 자동 반영

### Event-Driven Requirements (EDR) - 이벤트 기반 요구사항

**EDR-001: CLI 명령어 실행 시 스택 감지 수행**
- **WHEN** 사용자가 `tekton detect` 명령어를 실행하면
- **THEN** 시스템은 프로젝트 루트에서 프레임워크 식별 파일(next.config.js, vite.config.ts 등)을 스캔하고 감지 결과를 출력해야 한다
- WHY: 수동 설정 없이 자동으로 프로젝트 환경 파악
- IMPACT: 개발자 초기 설정 시간 단축

**EDR-002: shadcn 설치 명령 시 프로젝트 구조 분석**
- **WHEN** 사용자가 `tekton setup shadcn` 명령어를 실행하면
- **THEN** 시스템은 프레임워크 감지, Tailwind 설치 여부 확인, shadcn 설치 여부 확인 후 적절한 설정 명령어를 실행해야 한다
- WHY: shadcn 수동 설치 과정의 복잡도 제거
- IMPACT: shadcn 도입 장벽 감소

**EDR-003: VS Code 명령어 실행 시 CLI subprocess 호출**
- **WHEN** 사용자가 VS Code Command Palette에서 "Tekton: Detect Stack"을 실행하면
- **THEN** extension은 CLI subprocess를 생성하고 결과를 Output 패널에 표시해야 한다
- WHY: VS Code 사용자에게 일관된 명령어 인터페이스 제공
- IMPACT: CLI 로직 재사용으로 중복 구현 방지

**EDR-004: 토큰 생성 완료 시 결과 파일 저장**
- **WHEN** 토큰 생성 워크플로우가 완료되면
- **THEN** 시스템은 CSS variables 파일과 Tailwind config를 지정된 경로에 저장해야 한다
- WHY: 생성된 토큰의 프로젝트 적용 자동화
- IMPACT: 수동 파일 복사 작업 제거

### State-Driven Requirements (SDR) - 상태 기반 요구사항

**SDR-001: 프로젝트가 Next.js인 경우 Next.js 전용 설정 적용**
- **IF** 감지된 프레임워크가 Next.js이면
- **THEN** 시스템은 App Router 기반 경로 설정을 적용해야 한다
- WHY: 프레임워크별 디렉토리 구조 차이 대응
- IMPACT: 잘못된 경로 설정으로 인한 설치 실패 방지

**SDR-002: shadcn 미설치 상태인 경우 자동 설치 제안**
- **IF** shadcn이 설치되지 않았으면
- **THEN** 시스템은 shadcn 설치 명령어 실행을 제안해야 한다
- WHY: 필수 의존성 누락 방지
- IMPACT: 사용자가 수동으로 shadcn 설치 여부를 확인할 필요 제거

**SDR-003: VS Code extension 활성화 시 명령 팔레트 등록**
- **IF** extension이 활성화되면
- **THEN** 시스템은 "Tekton: Detect Stack", "Tekton: Setup shadcn", "Tekton: Generate Tokens" 명령어를 Command Palette에 등록해야 한다
- WHY: VS Code 표준 UX 패턴 준수
- IMPACT: 사용자 학습 곡선 감소

### Optional Features (OF) - 선택적 기능

**OF-001: Create Screen Workflow 템플릿 스캐폴딩**
- **가능하면** Phase C를 위한 화면 생성 템플릿 기본 구조를 제공한다
- WHY: Phase C 시작 시점 단축
- IMPACT: Phase C 구현 시 초기 설정 시간 절감

**OF-002: 고급 스택 감지**
- **가능하면** Nuxt, SvelteKit 등 추가 프레임워크 감지를 지원한다
- WHY: 지원 프레임워크 범위 확장
- IMPACT: 더 넓은 사용자층 확보

### Complex Requirements (CR) - 복잡 요구사항

**CR-001: CLI ↔ VS Code Extension 통합 테스트**
- **IF** extension이 활성화되고 **WHEN** 명령어 실행 시
- **THEN** CLI subprocess가 정상 실행되고 결과가 Output 패널에 표시되어야 한다
- WHY: 두 패키지 간 통합 동작 검증 필요
- IMPACT: 통합 테스트 미비 시 프로덕션 통합 오류 발생 가능

**CR-002: Monorepo 전환 시 기존 테스트 유지**
- **WHEN** Monorepo 구조로 전환할 때
- **THEN** Phase A의 모든 테스트가 그대로 통과해야 한다
- WHY: 기능 회귀 방지
- IMPACT: 전환 과정에서 기능 손실 없음을 보장

## 기술 스택

### Core Dependencies

**Monorepo 관리**:
- pnpm (v9.x): Workspace 기반 패키지 관리
- Turborepo (optional): 빌드 캐시 및 병렬 실행

**CLI Framework**:
- commander.js (v12.x): 명령어 파싱 및 옵션 처리
- chalk (v5.x): 터미널 출력 색상 지원
- enquirer (v2.x): 대화형 프롬프트
- execa (v9.x): Subprocess 실행 (shadcn CLI 호출)
- fs-extra (v11.x): 파일 시스템 유틸리티

**VS Code Extension**:
- @types/vscode (v1.95.x): VS Code API 타입 정의
- vscode-languageclient (선택): LSP 통신 (향후 확장 시)

**Build Tools**:
- esbuild (v0.20.x): 빠른 번들링
- TypeScript (v5.9.x): 타입 체크 및 컴파일

**Testing**:
- vitest (v2.x): 단위 테스트 및 통합 테스트
- @vitest/ui (v2.x): 테스트 결과 시각화

### Phase A Package References

CLI 및 Extension은 다음 Phase A 패키지를 workspace dependency로 참조:
- `@tekton/theme`: 프리셋 시스템
- `@tekton/token-generator`: 토큰 생성 엔진
- `@tekton/contracts`: 컴포넌트 계약

## 아키텍처

### Monorepo 구조

```
packages/
├── theme/              # Phase A - Theme System
│   ├── src/
│   └── tests/
├── token-generator/     # Phase A - Token Generator
│   ├── src/
│   └── tests/
├── contracts/           # Phase A - Component Contracts
│   ├── src/
│   └── tests/
├── cli/                 # Phase B - CLI Package (NEW)
│   ├── src/
│   │   ├── commands/
│   │   │   ├── detect.ts
│   │   │   ├── setup.ts
│   │   │   └── generate.ts
│   │   ├── detectors/
│   │   │   ├── framework.ts
│   │   │   ├── tailwind.ts
│   │   │   └── shadcn.ts
│   │   ├── setup/
│   │   │   ├── shadcn-installer.ts
│   │   │   └── config-generator.ts
│   │   └── index.ts
│   ├── tests/
│   └── package.json
└── vscode-extension/    # Phase B - VS Code Extension (NEW)
    ├── src/
    │   ├── extension.ts
    │   ├── commands/
    │   │   ├── detectStack.ts
    │   │   ├── setupShadcn.ts
    │   │   └── generateTokens.ts
    │   └── utils/
    │       └── cliRunner.ts
    ├── tests/
    └── package.json
```

### CLI 명령어 구조

**tekton detect**:
- Framework Detection: next.config.js, vite.config.ts, remix.config.js 검색
- Tailwind Detection: tailwind.config.js/ts 존재 여부 확인
- shadcn Detection: components.json 존재 여부 확인

**tekton setup shadcn**:
- Prerequisite Check: Framework 및 Tailwind 설치 여부 확인
- shadcn CLI Execution: `npx shadcn@latest init` 실행
- Config Generation: components.json 생성 확인

**tekton generate**:
- Token Generation Workflow: Phase A token-generator 호출
- Q&A Prompts: enquirer를 통한 대화형 입력
- File Output: CSS variables 및 Tailwind config 저장

### VS Code Extension 아키텍처

**Command Registration**:
- `tekton.detectStack`: CLI `detect` 명령어 래핑
- `tekton.setupShadcn`: CLI `setup shadcn` 명령어 래핑
- `tekton.generateTokens`: CLI `generate` 명령어 래핑

**CLI Integration**:
- execa를 사용한 CLI subprocess 실행
- 실시간 stdout/stderr 스트리밍
- Output 패널에 결과 표시

**Error Handling**:
- CLI 실행 실패 시 에러 메시지 표시
- 필수 의존성 누락 시 설치 가이드 제공

## 제약사항

### 기술적 제약

1. **Node.js 버전**: ≥18.0.0 (ESM 지원 필수)
2. **pnpm 버전**: ≥9.0.0 (workspace protocol 지원)
3. **VS Code 버전**: ≥1.95.0 (최신 Extension API)

### 성능 제약

1. **스택 감지 시간**: < 1초 (대규모 프로젝트 포함)
2. **shadcn 설치 시간**: < 30초 (npm install 제외)
3. **토큰 생성 시간**: < 500ms (파일 I/O 포함)

### 보안 제약

1. **Subprocess 실행**: 사용자 입력 sanitization 필수
2. **파일 시스템 접근**: 프로젝트 루트 외부 접근 금지
3. **환경 변수**: 민감 정보 노출 방지

## 품질 기준

### TRUST 5 Framework

**Test-first (테스트 우선)**:
- CLI 테스트 커버리지 ≥85%
- Extension 테스트 커버리지 ≥70%
- 모든 명령어에 대한 단위 테스트 및 통합 테스트

**Readable (가독성)**:
- ESLint 규칙 준수 (zero errors)
- 명확한 함수 및 변수 명명 규칙
- JSDoc 주석 (공개 API)

**Unified (일관성)**:
- Prettier 포맷팅 자동 적용
- 공통 TypeScript 설정 공유 (tsconfig.base.json)

**Secured (보안)**:
- OWASP Top 10 보안 점검
- 의존성 취약점 스캔 (npm audit)

**Trackable (추적 가능)**:
- Conventional Commits 준수
- CHANGELOG 자동 생성 (changesets)

### 성공 지표

1. **기능 완성도**: 모든 Primary Goal 구현 완료
2. **테스트 통과율**: 100% (모든 테스트 통과)
3. **성능 목표**: 모든 성능 제약 충족
4. **문서 완성도**: README, API 문서, 사용 예제 작성

## 위험 요소

### 높은 위험

**R-001: 크로스 플랫폼 Path 처리 불일치**
- 영향도: HIGH
- 발생 가능성: MEDIUM
- 완화 전략: path 모듈 사용, CI에서 3개 OS 모두 테스트

**R-002: VS Code Extension API 제한**
- 영향도: MEDIUM
- 발생 가능성: MEDIUM
- 완화 전략: CLI subprocess로 로직 분리, Extension은 UI만 담당

### 중간 위험

**R-003: shadcn CLI 버전 변경**
- 영향도: MEDIUM
- 발생 가능성: LOW
- 완화 전략: shadcn CLI 버전 고정, 정기적 호환성 테스트

**R-004: Monorepo 전환 시 빌드 시간 증가**
- 영향도: LOW
- 발생 가능성: MEDIUM
- 완화 전략: Turborepo 도입, 빌드 캐시 활용

## 다음 단계

Phase B 완료 후:
1. **Phase C: Create Screen Workflow 구현**
   - Compound Pattern 기반 화면 생성
   - 토큰 및 컴포넌트 자동 적용

2. **Phase D: 고급 기능 확장**
   - Figma Token 동기화
   - 디자인 시스템 버전 관리

## 참고 문서

- Phase A 완료 보고서: `.moai/docs/phase-a-completion.md`
- Monorepo 마이그레이션 가이드: (TBD)
- CLI 개발 가이드: (TBD)
- VS Code Extension 개발 가이드: (TBD)
