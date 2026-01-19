# SPEC-PHASEC-003 구현 계획

## 마일스톤 개요

### M1: Core Screen Contract (Foundation)

**우선순위**: CRITICAL
**목표**: 4계층 Screen Contract 아키텍처의 핵심 스키마 정의 및 기본 검증 시스템 구축

**구현 항목**:

1. **Environment 계층 스키마 및 Grid 시스템**
   - TypeScript enum 정의: `Environment` (Web, Mobile, Tablet, Responsive, TV, Kiosk)
   - Zod 스키마 검증: `environmentSchema`
   - Grid 시스템 정의: columns, gutter, margin, breakpoint 매핑
   - Layout Behavior 정의: navigation, cardLayout, dataDensity, interactionModel
   - 환경별 기본 구성 매핑: `environmentBehaviors` Record 객체

2. **Skeleton 계층 스키마 및 Theme**
   - SkeletonPreset enum 정의: FullScreen, WithHeader, WithSidebar, WithHeaderSidebar, WithHeaderFooter, Dashboard
   - `skeletonContractSchema` 구현: header, sidebar, footer, content 속성 정의
   - Preset별 기본 구성: sticky, height, width, collapsible, maxWidth, padding 기본값
   - Override 시스템 설계: 사용자가 theme 선택 후 개별 속성 수정 허용

3. **Intent 계층 스키마 및 Compound Pattern 매핑**
   - ScreenIntent enum 정의: DataList, DataDetail, Dashboard, Form, Wizard, Auth, Settings, EmptyState, Error, Custom (총 10개)
   - `intentContractSchema` 구현: type, primaryComponents, layoutPatterns, actions, dataShape
   - Intent → Compound Pattern 매핑 테이블 구현
   - 각 Intent별 추천 컴포넌트 목록 정의
   - 각 Intent별 레이아웃 패턴 정의: single-column, two-column, grid, centered, masonry

**기술 스택**:
- TypeScript: `^5.3.0`
- Zod: `^3.23.8` (스키마 검증)
- @tekton/contracts: (재사용 Contract 검증 시스템)

**구현 경로**:
- `packages/contracts/src/definitions/screen/` 디렉토리 생성
- `environment.ts`: Environment enum 및 스키마
- `skeleton.ts`: Skeleton enum 및 스키마
- `intent.ts`: Intent enum 및 스키마
- `index.ts`: 통합 export

**검증 기준**:
- [ ] Environment enum 9개 타입 정의 완료
- [ ] Grid 시스템 6개 환경별 매핑 완료
- [ ] Layout Behavior 스키마 정의 및 환경별 기본값 설정
- [ ] Skeleton theme 6개 구현 완료
- [ ] Intent enum 10개 타입 정의 완료
- [ ] Intent → Compound Pattern 매핑 테이블 작성
- [ ] 단위 테스트 커버리지 80% 이상
- [ ] TypeScript 컴파일 오류 0건
- [ ] Zod 스키마 검증 정상 동작 확인

**의존성**:
- Phase B 완료 상태 (Monorepo 구조, @tekton/contracts 패키지 존재)

**예상 난이도**: MEDIUM
**예상 범위**: 3-5 세션

---

### M2: CLI Create Screen Command

**우선순위**: HIGH
**목표**: `tekton create screen` 명령어 구현 및 대화형 프롬프트 워크플로우 완성

**구현 항목**:

1. **`tekton create screen` 명령어 구현**
   - commander.js 기반 명령어 파싱: `program.command('create screen <name>')`
   - 명령어 옵션 정의: `--env`, `--skeleton`, `--intent`, `--components`, `--dry-run`
   - 입력 검증: 화면 이름 형식 검증 (kebab-case 권장)
   - 중복 화면 이름 감지: `src/screens/<name>` 디렉토리 존재 여부 확인

2. **Interactive Q&A 워크플로우**
   - enquirer 기반 대화형 프롬프트 구현
   - Environment 선택 프롬프트: Responsive, Desktop, Mobile, Tablet, TV, Kiosk 옵션 제공
   - Skeleton 선택 프롬프트: WithHeader, WithSidebar, Dashboard, FullScreen, WithHeaderFooter, WithHeaderSidebar
   - Intent 선택 프롬프트: DataDetail, DataList, Form, Dashboard, Wizard, Auth, Settings, EmptyState, Error, Custom
   - Component 다중 선택 프롬프트: Card, Section, Button, Table, Chart, Input, Select, List, Media 등 (Intent 기반 필터링)
   - 프롬프트 스킵 조건: 플래그 파라미터 제공 시 해당 프롬프트 건너뛰기

3. **Non-Interactive 모드 지원**
   - 모든 플래그 파라미터 제공 시 프롬프트 없이 즉시 실행
   - 플래그 검증: 유효한 enum 값 확인 (Environment, SkeletonPreset, ScreenIntent)
   - 에러 메시지: 잘못된 플래그 값 제공 시 명확한 에러 메시지 및 유효한 값 목록 표시

4. **템플릿 기반 코드 생성**
   - `page.tsx.template` 활용: Intent별 기본 컴포넌트 구성
   - `layout.tsx.template` 활용: Skeleton preset별 레이아웃 구조
   - Component import 자동 생성: 선택한 컴포넌트의 import 문 추가
   - 디렉토리 구조 생성: `src/screens/<name>/page.tsx`, `layout.tsx`, `components/index.ts`
   - 파일 생성 확인 메시지: 생성된 파일 경로 및 다음 단계 가이드 표시

**기술 스택**:
- commander: `^12.x` (CLI 프레임워크)
- enquirer: `^2.x` (대화형 프롬프트)
- fs-extra: `^11.x` (파일 시스템 작업)
- chalk: `^5.x` (터미널 컬러 출력)

**구현 경로**:
- `packages/cli/src/commands/create-screen.ts`: 명령어 구현
- `packages/cli/src/prompts/screen-prompts.ts`: enquirer 프롬프트 정의
- `packages/cli/src/generators/screen-generator.ts`: 코드 생성 로직
- `packages/cli/src/validators/screen-validator.ts`: 입력 검증 로직

**검증 기준**:
- [ ] 명령어 파싱 정상 동작 (commander)
- [ ] 대화형 프롬프트 4단계 완료 (enquirer)
- [ ] Non-interactive 모드 정상 동작 (플래그 파싱)
- [ ] 생성된 코드가 올바른 디렉토리 구조 생성
- [ ] 템플릿 치환 정상 동작 (변수명, import 문)
- [ ] 중복 화면 이름 감지 및 경고 메시지 표시
- [ ] 에러 처리: 잘못된 입력 시 명확한 에러 메시지
- [ ] 단위 테스트 커버리지 80% 이상

**의존성**:
- M1 완료 (Environment, Skeleton, Intent enum 정의)
- Phase B 템플릿 시스템 완료 (`page.tsx.template`, `layout.tsx.template`)

**예상 난이도**: MEDIUM
**예상 범위**: 2-3 세션

---

### M3: Token & Contract Integration

**우선순위**: HIGH
**목표**: Extended Token System 통합 및 자동 토큰 주입 파이프라인 구축

**구현 항목**:

1. **`@tekton/token-generator` 연동**
   - Extended Token System 스키마 정의: `tokenPresetSchema`
   - Brand 계층 정의: primary, secondary, tertiary, quaternary (1~4단계)
   - Semantic Colors 정의: success, warning, error, info (WCAG 자동 검증)
   - Data Visualization 팔레트 정의: categorical (6~12색), sequential (start/end/steps), diverging (negative/neutral/positive)
   - Neutral Scale 정의: Gray 10단계 (50~950)
   - Spacing 정의: compact, comfortable, loose
   - Radius 정의: sharp, rounded, pill

2. **`@tekton/contracts` 검증 파이프라인**
   - Component Contract 검증: 생성된 컴포넌트 조합이 규칙 준수 확인
   - Composition Contract 검증: Intent에 맞는 컴포넌트 사용 여부 확인
   - 자동 fixSuggestion 적용: 위반 감지 시 수정 제안 적용
   - 검증 실패 처리: 코드 저장 차단 옵션 제공 (--force 플래그로 우회 가능)

3. **자동 토큰 주입**
   - 생성된 코드에 토큰 클래스 자동 적용
   - Tailwind CSS 변수 생성: `bg-primary`, `text-primary`, `border-primary` 등
   - React Native StyleSheet 생성 (mobile 환경): `backgroundColor: tokens.colors.primary`
   - 환경 감지 자동 전환: package.json에서 react-native 감지 시 StyleSheet 사용
   - WCAG 검증: 생성된 색상 조합이 WCAG 2.1 AA 기준 충족 확인

**기술 스택**:
- @tekton/token-generator: `^1.x`
- @tekton/contracts: `^1.x`
- tailwindcss: `^3.x`

**구현 경로**:
- `packages/cli/src/generators/token-injector.ts`: 토큰 주입 로직
- `packages/cli/src/validators/contract-validator.ts`: Contract 검증 로직
- `packages/cli/src/utils/environment-detector.ts`: 환경 감지 (Tailwind vs StyleSheet)

**검증 기준**:
- [ ] Extended Token System 스키마 정의 완료
- [ ] Brand 계층 4단계 구현 확인
- [ ] Semantic Colors 4개 정의 및 WCAG 검증 통과
- [ ] Data Visualization 팔레트 구현 확인 (categorical, sequential, diverging)
- [ ] Neutral Scale 10단계 생성 확인
- [ ] 토큰 생성 파이프라인 정상 동작
- [ ] Contract 검증 정상 동작 (위반 감지 및 메시지 표시)
- [ ] 생성된 코드에 토큰 자동 주입 확인 (Tailwind 또는 StyleSheet)
- [ ] 환경 감지 정상 동작 (React Native 감지 시 StyleSheet 전환)
- [ ] 단위 테스트 커버리지 80% 이상

**의존성**:
- M2 완료 (CLI 명령어 및 코드 생성)
- Phase B 완료 (`@tekton/token-generator`, `@tekton/contracts`)

**예상 난이도**: HIGH
**예상 범위**: 2-3 세션

---

### M4: AFDS Agent Context

**우선순위**: MEDIUM
**목표**: AI 에이전트가 Screen 생성 규칙을 이해할 수 있도록 Agent Context JSON 및 문서 생성

**구현 항목**:

1. **Agent Context JSON 생성기**
   - `agent-context.json` 자동 생성: 프로젝트 루트 또는 `.moai/` 디렉토리에 배치
   - Environment 정보 포함: Grid 시스템, Layout Behavior
   - Skeleton 정보 포함: Theme 목록 및 기본 구성
   - Intent 정보 포함: Compound Pattern 매핑, 추천 컴포넌트
   - ComponentContract 정보 포함: 사용 가능한 컴포넌트 목록 및 Contract ID
   - 토큰 정보 포함: Brand colors, Semantic colors, Spacing, Radius
   - 프로젝트 메타데이터: framework (Next.js, React Native), designSystem (@tekton/default)

2. **Screen Rules 문서화 (에이전트 친화적)**
   - Markdown 기반 Screen Rules 가이드: `.moai/docs/screen-rules.md`
   - Intent 별 Best Practices: 각 Intent에 적합한 컴포넌트 조합 및 레이아웃 패턴
   - Compound Pattern 사용 예시: DataList, DataDetail, Dashboard, Form 등 예제 코드
   - Contract 위반 사례 및 수정 방법: 자주 발생하는 위반 및 fixSuggestion
   - 에이전트 컨텍스트 주입 방법: LLM 프롬프트에 포함할 주요 정보 정리

3. **VS Code Extension 연동**
   - Command Palette에서 "Create Screen" 명령 추가
   - Extension이 `agent-context.json` 참조하도록 수정
   - Quick Pick 메뉴: Environment, Skeleton, Intent 선택 UI
   - 생성 결과 표시: 생성된 파일 경로 및 다음 단계 가이드

**기술 스택**:
- VS Code Extension API
- JSON Schema 검증

**구현 경로**:
- `packages/cli/src/generators/agent-context-generator.ts`: JSON 생성 로직
- `.moai/docs/screen-rules.md`: 문서 템플릿
- `packages/vscode-extension/src/commands/create-screen.ts`: Extension 명령어

**검증 기준**:
- [ ] `agent-context.json` 생성 확인 (프로젝트 루트 또는 .moai/)
- [ ] Environment, Skeleton, Intent, Token 정보 포함 확인
- [ ] Screen Rules 문서 생성 확인 (Markdown 형식)
- [ ] Intent 별 Best Practices 작성 완료
- [ ] Compound Pattern 예제 코드 포함 확인
- [ ] VS Code Extension 연동 정상 동작
- [ ] Command Palette에서 "Create Screen" 실행 확인
- [ ] Extension이 `agent-context.json` 올바르게 참조 확인

**의존성**:
- M1, M2, M3 완료 (모든 스키마 및 CLI 명령어 완성)
- Phase B VS Code Extension 완료

**예상 난이도**: LOW
**예상 범위**: 1-2 세션

---

## 기술 제약사항

### Phase B 의존성

- ✅ @tekton/theme (완료) - Theme 시스템 재사용
- ✅ @tekton/token-generator (완료) - Extended Token System 통합
- ✅ @tekton/contracts (완료) - Component Contract 검증
- ✅ CLI 도구 (완료) - 기존 CLI 인프라 재사용
- ✅ VS Code Extension (완료) - Extension 확장

### Library Versions

- TypeScript: `^5.3.0`
- Zod: `^3.23.8`
- commander: `^12.x`
- enquirer: `^2.x`
- fs-extra: `^11.x`
- chalk: `^5.x`
- tailwindcss: `^3.x`

### 기술 스택 결정 사항

**스키마 검증**: Zod 선택
- 이유: 타입 안정성 + 런타임 검증 동시 제공
- 대안: Yup (런타임만), TypeScript (컴파일 타임만)

**CLI 프레임워크**: commander 선택
- 이유: 표준 CLI 패턴, 풍부한 플래그 파싱
- 대안: yargs (복잡도 높음), oclif (과도한 보일러플레이트)

**대화형 프롬프트**: enquirer 선택
- 이유: 풍부한 UI, 다중 선택 지원
- 대안: inquirer (성능 낮음), prompts (기능 부족)

**파일 시스템**: fs-extra 선택
- 이유: Promise 기반 API, 추가 유틸리티 제공
- 대안: node:fs (콜백 기반), fs-jetpack (과도한 추상화)

**터미널 출력**: chalk 선택
- 이유: 컬러 지원, 간단한 API
- 대안: kleur (기능 부족), ansi-colors (복잡도 높음)

---

## 위험 요소 및 완화 전략

### R-001: Intent 분류의 모호성

**영향도**: HIGH
**설명**: 사용자가 원하는 화면이 여러 Intent에 걸쳐 있을 수 있음 (예: Dashboard + Form)

**완화 전략**:
- Intent 조합 허용: `{ primary: 'dashboard', secondary: 'form' }` 형태 지원
- Custom Intent fallback 제공: 사용자가 명시적으로 Custom 선택 시 자유 조합 허용
- Intent 선택 프롬프트에 상세 설명 추가: 각 Intent의 적합 사례 표시

**구현 우선순위**: M1 단계에서 Intent 조합 스키마 설계

---

### R-002: 에이전트의 규칙 무시

**영향도**: HIGH
**설명**: AI 에이전트가 Screen Contract 규칙을 무시하고 잘못된 컴포넌트 조합 생성

**완화 전략**:
- Contract 검증 필수화: 생성된 코드가 저장되기 전 자동 검증
- 검증 실패 시 코드 저장 차단 옵션: `--strict` 모드에서 저장 불가
- fixSuggestion 자동 적용: 위반 감지 시 자동 수정 제안 적용
- Agent Context JSON 명확화: 에이전트가 이해하기 쉬운 문서 및 예제 제공

**구현 우선순위**: M3 단계에서 Contract 검증 파이프라인 강화

---

### R-003: 템플릿 경직성

**영향도**: MEDIUM
**설명**: Skeleton Preset이 사용자의 요구사항과 정확히 일치하지 않을 수 있음

**완화 전략**:
- Skeleton Theme 선택 후 개별 속성 수정 허용: Override 시스템 구현
- 커스텀 템플릿 등록 시스템 제공: 사용자가 자신만의 템플릿 추가 가능
- Override 시스템 구현: `tekton.config.json`에서 theme override 정의

**구현 우선순위**: M2 단계에서 Override 시스템 설계 및 구현

---

### R-004: 성능 저하 (토큰 생성 및 검증)

**영향도**: MEDIUM
**설명**: 대규모 프로젝트에서 토큰 생성 및 Contract 검증 시간 증가

**완화 전략**:
- 캐싱 시스템 구현: 동일한 Environment/Skeleton/Intent 조합 캐시
- 병렬 처리: 토큰 생성 및 Contract 검증 병렬 실행
- Progressive 검증: 필수 규칙 먼저 검증 후 선택적 규칙 나중에 검증

**구현 우선순위**: M3 단계에서 성능 최적화 고려

---

## 다음 단계 (Phase D 준비)

Phase C 완료 후:

1. **Phase D: Figma 동기화**
   - Figma Token 동기화 인터페이스 설계
   - Design System 버전 관리 전략 수립
   - Figma Plugin 개발 (Token Export/Import)

2. **AFDS 마켓플레이스 출시**
   - Domain Pack 판매 플랫폼 구축 (SaaS Pack, E-commerce Pack, Data-Heavy Pack)
   - 에이전트 최적화 UI Kit 개발
   - 커뮤니티 기여 시스템 구축

---

## 참고 문서

- Phase A 완료 보고서: `.moai/docs/phase-a-completion.md`
- Phase B 완료 보고서: `.moai/specs/SPEC-PHASEB-002/M4-completion-report.md`
- AFDS 전략 문서: `AFDS_PLAN.md` (Artifacts)
- 기존 SPEC 문서: `.moai/specs/SPEC-PHASEC-003/spec-antigravity.md`
- TypeScript 공식 문서: https://www.typescriptlang.org/
- Zod 공식 문서: https://zod.dev/
- commander 공식 문서: https://github.com/tj/commander.js
- enquirer 공식 문서: https://github.com/enquirer/enquirer
