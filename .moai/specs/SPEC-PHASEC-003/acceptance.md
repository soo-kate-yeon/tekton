# SPEC-PHASEC-003 인수 기준

## 인수 시나리오

### 시나리오 1: 기본 화면 생성 워크플로우

**Given**: 사용자가 Tekton CLI를 설치하고 Next.js 프로젝트 루트에 위치
**When**: 사용자가 `tekton create screen UserProfile` 명령 실행
**Then**:
- Environment 선택 프롬프트가 표시됨 (Responsive, Desktop, Mobile 옵션)
- Skeleton 선택 프롬프트가 표시됨 (WithHeader, WithSidebar, Dashboard, FullScreen 옵션)
- Intent 선택 프롬프트가 표시됨 (DataDetail, DataList, Form, Dashboard 옵션)
- Component 다중 선택 프롬프트가 표시됨 (Card, Section, Button, Table, Chart 옵션)
- 선택 완료 후 `src/screens/user-profile/` 디렉토리 생성됨
- `page.tsx`, `layout.tsx`, `components/index.ts` 파일 생성됨
- 생성된 코드에 선택한 컴포넌트가 올바르게 import됨
- 터미널에 생성 완료 메시지 및 파일 경로 표시됨

**성공 기준**:
- [ ] 4단계 프롬프트 모두 정상 표시
- [ ] 각 프롬프트에서 올바른 선택지 제공
- [ ] 파일 생성 완료 메시지 출력 (경로 포함)
- [ ] 생성된 코드가 TypeScript 컴파일 오류 없음
- [ ] 생성된 코드가 ESLint 경고 없음
- [ ] 디렉토리 구조가 예상과 일치

---

### 시나리오 2: Non-Interactive 모드 화면 생성

**Given**: 사용자가 CI/CD 환경에서 자동화 스크립트 실행
**When**: 사용자가 다음 명령 실행:
```bash
tekton create screen UserProfile \
  --env responsive \
  --skeleton with-header \
  --intent data-detail \
  --components card,section,button
```
**Then**:
- 프롬프트 표시 없이 즉시 화면 생성 시작
- `src/screens/user-profile/` 디렉토리 생성됨
- Environment: Responsive (12-col grid, mouse-first)
- Skeleton: WithHeader (Header + Content)
- Intent: DataDetail (Card, Section, Button 포함)
- 생성된 코드에 토큰 자동 주입됨 (Tailwind CSS 클래스)
- 생성 완료 메시지 표시 (플래그 파라미터 확인 메시지 포함)

**성공 기준**:
- [ ] Non-interactive 모드 정상 동작
- [ ] 프롬프트 표시 없음
- [ ] 파라미터가 올바르게 적용됨 (Environment, Skeleton, Intent)
- [ ] 토큰 주입 확인 (Tailwind 클래스: `bg-primary`, `text-primary`)
- [ ] 생성된 코드가 빌드 통과
- [ ] CI/CD 환경에서 실행 가능 (exit code 0)

---

### 시나리오 3: Mobile 환경 화면 생성 및 토큰 적용

**Given**: 사용자가 React Native 프로젝트에서 작업
**When**: 사용자가 다음 명령 실행:
```bash
tekton create screen ProductList \
  --env mobile \
  --skeleton full-screen \
  --intent data-list \
  --components card,list,button
```
**Then**:
- Environment: Mobile (4-col grid, touch-first interaction, bottom-tabs navigation)
- Skeleton: FullScreen (Content only, no chrome)
- Intent: DataList (Card, List, Button 포함)
- `StyleSheet` 기반 스타일 생성 (React Native)
- 토큰 주입: Primary color, spacing, typography 자동 적용
- 환경 감지 경고 메시지 표시: "Detected React Native, using StyleSheet instead of Tailwind"

**성공 기준**:
- [ ] Mobile 환경 감지 정상 동작
- [ ] 4-column 그리드 시스템 적용 확인
- [ ] touch-first 인터랙션 모델 적용 확인
- [ ] React Native 코드 생성 확인 (StyleSheet import)
- [ ] StyleSheet 기반 토큰 주입 확인 (`backgroundColor: tokens.colors.primary`)
- [ ] 환경 감지 경고 메시지 표시 확인
- [ ] 생성된 코드가 React Native에서 정상 동작

---

### 시나리오 4: Contract 검증 및 자동 수정

**Given**: 사용자가 화면 생성 후 컴포넌트 조합 규칙 위반
**When**: 사용자가 Form Intent에 Table 컴포넌트 추가 시도:
```bash
tekton create screen CreateUser \
  --env responsive \
  --skeleton with-header \
  --intent form \
  --components input,select,button,table
```
**Then**:
- Contract 검증 파이프라인 실행
- 위반 감지: "Table should not be used in Form intent"
- 위반 세부 정보 표시: Contract ID (FORM-C01), Severity (error), Description
- fixSuggestion 제안: "Remove Table or change Intent to DataList"
- 사용자에게 선택지 제공:
  - (1) Table 제거하고 계속 진행
  - (2) Intent를 DataList로 변경
  - (3) --force 플래그로 강제 진행 (권장하지 않음)

**성공 기준**:
- [ ] Contract 검증 정상 동작
- [ ] 위반 감지 및 명확한 메시지 표시
- [ ] fixSuggestion 제안 확인
- [ ] 사용자 선택지 제공 (3가지 옵션)
- [ ] 선택지 선택 후 정상 동작 확인
- [ ] --force 플래그 사용 시 검증 우회 확인

---

### 시나리오 5: AFDS Agent Context 생성 및 AI 에이전트 활용

**Given**: 사용자가 Phase C 구현 완료 후 AI 에이전트와 작업
**When**: 사용자가 "유저 프로필 화면 만들어줘" 요청
**Then**:
- AI 에이전트가 `agent-context.json` 로드
- Environment 정보 분석: Responsive 환경 (12-col grid)
- Intent 분석: "유저 프로필" → `DataDetail` 판단
- Screen Rules 참조: DataDetail → Card, Section, Button 추천
- Compound Pattern 적용: Single column layout, tabs
- 자동 코드 생성: `src/screens/user-profile/page.tsx`
- Contract 검증 실행 및 자동 수정
- 생성된 코드를 사용자에게 제시 (파일 경로 및 내용)

**성공 기준**:
- [ ] `agent-context.json` 생성 확인 (프로젝트 루트 또는 .moai/)
- [ ] Agent Context에 Environment, Skeleton, Intent, Token 정보 포함 확인
- [ ] AI 에이전트가 Intent 올바르게 판단 (DataDetail)
- [ ] Screen Rules 기반 컴포넌트 추천 확인 (Card, Section, Button)
- [ ] Compound Pattern 적용 확인 (Single column, tabs)
- [ ] Contract 검증 및 자동 수정 확인
- [ ] 생성된 코드가 올바른 구조 및 토큰 포함

---

### 시나리오 6: Dashboard Intent 화면 생성 및 다중 위젯 구성

**Given**: 사용자가 대시보드 화면 생성 요청
**When**: 사용자가 다음 명령 실행:
```bash
tekton create screen Analytics \
  --env responsive \
  --skeleton dashboard \
  --intent dashboard \
  --components card,chart,stat,table
```
**Then**:
- Environment: Responsive (12-col grid)
- Skeleton: Dashboard (Header + Sidebar + Content + Footer optional)
- Intent: Dashboard (Card, Chart, Stat, Table 포함)
- Layout Pattern: Grid, masonry
- Recommended Actions: Refresh, Filter 버튼 자동 추가
- 생성된 코드에 다중 위젯 구성: Card Grid (2x2), Chart (가로 전체), Stat (3개), Table (가로 전체)
- 토큰 주입: Data Visualization 팔레트 적용 (categorical colors)

**성공 기준**:
- [ ] Dashboard Skeleton 정상 적용 (Header + Sidebar + Content)
- [ ] Grid layout 정상 적용 (12-col grid, 2x2 card layout)
- [ ] 다중 위젯 구성 확인 (Card, Chart, Stat, Table)
- [ ] Data Visualization 팔레트 적용 확인 (categorical colors)
- [ ] Refresh, Filter 버튼 자동 추가 확인
- [ ] 생성된 코드가 빌드 통과
- [ ] 브라우저에서 정상 렌더링 확인

---

### 시나리오 7: 중복 화면 이름 감지 및 처리

**Given**: `src/screens/user-profile/` 디렉토리가 이미 존재
**When**: `tekton create screen UserProfile` 재실행
**Then**:
- 중복 화면 이름 감지
- 경고 메시지 표시: "Screen 'UserProfile' already exists at src/screens/user-profile/"
- 선택지 제공:
  - (1) 덮어쓰기 (Overwrite) - 기존 디렉토리 삭제 후 재생성
  - (2) 취소 (Cancel) - 명령 실행 중단
  - (3) 다른 이름 입력 (Rename) - 새로운 이름 입력 프롬프트 표시
- 선택에 따라 적절한 동작 수행

**성공 기준**:
- [ ] 중복 화면 이름 감지 정상 동작
- [ ] 경고 메시지 명확하게 표시
- [ ] 선택지 3가지 제공
- [ ] 덮어쓰기 선택 시 기존 디렉토리 삭제 후 재생성
- [ ] 취소 선택 시 명령 실행 중단 (exit code 1)
- [ ] 다른 이름 입력 선택 시 프롬프트 재표시

---

## 성공 기준 (종합)

### 기능 요구사항

- [ ] M1: Core Screen Contract 스키마 정의 완료
  - [ ] Environment enum 9개 타입 정의
  - [ ] Grid 시스템 6개 환경별 매핑
  - [ ] Layout Behavior 스키마 정의
  - [ ] Skeleton preset 6개 구현
  - [ ] Intent enum 10개 타입 정의
  - [ ] Intent → Compound Pattern 매핑 테이블 작성

- [ ] M2: `tekton create screen` 명령어 정상 동작
  - [ ] Interactive 프롬프트 4단계 동작
  - [ ] Non-interactive 플래그 파싱 정상
  - [ ] 디렉토리 및 파일 생성 확인
  - [ ] 템플릿 치환 정상 동작

- [ ] M3: 토큰 자동 주입 파이프라인 구현
  - [ ] Extended Token System 스키마 정의
  - [ ] @tekton/token-generator 연동 확인
  - [ ] @tekton/contracts 검증 파이프라인 동작
  - [ ] 토큰 자동 주입 확인 (Tailwind 또는 StyleSheet)
  - [ ] fixSuggestion 자동 적용 확인

- [ ] M4: `agent-context.json` 자동 생성
  - [ ] Agent Context JSON 생성 확인
  - [ ] Screen Rules 문서 생성 확인
  - [ ] VS Code Extension 연동 확인
  - [ ] AI 에이전트가 agent-context 올바르게 참조

### 품질 요구사항

- [ ] 단위 테스트 커버리지 80% 이상
  - [ ] Environment 스키마 테스트
  - [ ] Skeleton 스키마 테스트
  - [ ] Intent 스키마 테스트
  - [ ] CLI 명령어 파싱 테스트
  - [ ] 코드 생성 로직 테스트
  - [ ] Contract 검증 테스트

- [ ] TypeScript 컴파일 오류 0건
  - [ ] 모든 .ts 파일 컴파일 통과
  - [ ] enum 타입 정의 정확성
  - [ ] Zod 스키마 타입 안정성

- [ ] ESLint 경고 0건
  - [ ] Naming convention 준수
  - [ ] Import order 정리
  - [ ] Unused variables 제거

- [ ] 생성된 코드가 프로젝트 빌드 통과
  - [ ] Next.js 빌드 성공
  - [ ] React Native 빌드 성공 (해당 환경)
  - [ ] Tailwind CSS 클래스 정상 적용
  - [ ] StyleSheet 정상 적용 (React Native)

### 성능 요구사항

- [ ] `tekton create screen` 명령 실행 시간 < 3초
  - [ ] Interactive 모드: 프롬프트 표시 시간 < 500ms
  - [ ] Non-interactive 모드: 전체 실행 시간 < 2초
  - [ ] 파일 생성 시간 < 1초

- [ ] Contract 검증 실행 시간 < 1초
  - [ ] Component Contract 검증 < 500ms
  - [ ] Composition Contract 검증 < 500ms

- [ ] 토큰 주입 실행 시간 < 500ms
  - [ ] Extended Token System 생성 < 300ms
  - [ ] 코드 치환 및 주입 < 200ms

### 사용성 요구사항

- [ ] 프롬프트 메시지가 명확하고 이해하기 쉬움
  - [ ] 각 프롬프트에 설명 텍스트 포함
  - [ ] 선택지가 명확하게 구분됨
  - [ ] 기본값 명시 (recommended)

- [ ] 에러 메시지가 구체적이고 해결 방법 제시
  - [ ] 잘못된 플래그 값 제공 시 유효한 값 목록 표시
  - [ ] Contract 위반 시 fixSuggestion 제안
  - [ ] 중복 화면 이름 감지 시 선택지 제공

- [ ] 생성된 코드에 주석 포함 (Intent 설명, Component 역할)
  - [ ] 각 파일 상단에 생성 정보 주석
  - [ ] Intent 설명 주석
  - [ ] Component 역할 주석

---

## Edge Case 테스트

### EC-001: 중복 화면 이름

**Given**: `src/screens/user-profile/` 디렉토리가 이미 존재
**When**: `tekton create screen UserProfile` 재실행
**Then**:
- 경고 메시지 표시: "Screen already exists"
- 선택지 제공: (1) 덮어쓰기, (2) 취소, (3) 다른 이름 입력

**검증 방법**:
- [ ] 중복 감지 정상 동작
- [ ] 경고 메시지 표시 확인
- [ ] 선택지 3가지 제공 확인
- [ ] 각 선택지 선택 시 정상 동작

---

### EC-002: 잘못된 Environment 값

**Given**: Non-interactive 모드 실행
**When**: `--env invalid` 파라미터 전달
**Then**:
- 에러 메시지 표시: "Invalid environment: invalid"
- 유효한 값 목록 표시: "Valid values: responsive, web, mobile, tablet, tv, kiosk"
- 명령 실행 중단 (exit code 1)

**검증 방법**:
- [ ] 잘못된 값 감지 정상 동작
- [ ] 에러 메시지 명확하게 표시
- [ ] 유효한 값 목록 표시 확인
- [ ] 명령 실행 중단 확인 (exit code 1)

---

### EC-003: 빈 Component 선택

**Given**: 사용자가 Component 선택 프롬프트에서 아무것도 선택하지 않음
**When**: Enter 키 입력
**Then**:
- 경고 메시지 표시: "At least one component must be selected"
- 프롬프트 재표시

**검증 방법**:
- [ ] 빈 선택 감지 정상 동작
- [ ] 경고 메시지 표시 확인
- [ ] 프롬프트 재표시 확인

---

### EC-004: React Native 프로젝트에서 Tailwind 토큰 시도

**Given**: `package.json`에 `react-native` 의존성 존재
**When**: Tailwind 기반 토큰 주입 시도
**Then**:
- 환경 감지: React Native
- 자동 전환: StyleSheet 기반 토큰 생성
- 경고 메시지 표시: "Detected React Native, using StyleSheet instead of Tailwind"

**검증 방법**:
- [ ] React Native 환경 감지 정상 동작
- [ ] 자동 전환 확인 (StyleSheet 생성)
- [ ] 경고 메시지 표시 확인
- [ ] 생성된 코드가 React Native에서 정상 동작

---

### EC-005: Intent 미지정

**Given**: 사용자가 Intent 선택 프롬프트에서 아무것도 선택하지 않음
**When**: ESC 키 입력 또는 빈 값 제출
**Then**:
- 시스템은 Custom Intent로 fallback하지 않음
- 경고 메시지 표시: "Intent selection is required"
- Intent 선택 프롬프트 재표시

**검증 방법**:
- [ ] Intent 미지정 감지 정상 동작
- [ ] Custom Intent fallback 발생하지 않음 확인
- [ ] 경고 메시지 표시 확인
- [ ] 프롬프트 재표시 확인

---

### EC-006: Skeleton Preset Override

**Given**: 사용자가 WithHeader preset 선택 후 header height 수정 요청
**When**: `--skeleton with-header --header-height lg` 파라미터 전달
**Then**:
- WithHeader preset 기본 구성 로드
- header.height 속성을 'lg'로 override
- 생성된 코드에 override된 값 적용 확인

**검증 방법**:
- [ ] Preset 기본 구성 로드 확인
- [ ] Override 값 적용 확인
- [ ] 생성된 코드에 올바른 값 반영 확인

---

### EC-007: WCAG 검증 실패

**Given**: 사용자가 Primary color를 매우 밝은 색상으로 설정
**When**: 토큰 생성 파이프라인 실행
**Then**:
- WCAG 검증 실행: Primary color와 Background color의 대비 비율 계산
- 검증 실패: 대비 비율 < 4.5:1 (AA 기준)
- 에러 메시지 표시: "Primary color fails WCAG AA contrast ratio (3.2:1, required: 4.5:1)"
- fixSuggestion 제안: "Adjust Primary color lightness to 0.45 for AA compliance"

**검증 방법**:
- [ ] WCAG 검증 정상 동작
- [ ] 대비 비율 계산 정확성 확인
- [ ] 검증 실패 메시지 표시 확인
- [ ] fixSuggestion 제안 확인
- [ ] 수정 후 재검증 통과 확인

---

## 검증 체크리스트

### M1 검증

- [ ] Environment enum 9개 타입 정의
  - [ ] Web, Mobile, Tablet, Responsive, TV, Kiosk 포함
  - [ ] TypeScript enum 컴파일 통과

- [ ] Grid 시스템 6개 환경별 매핑
  - [ ] Desktop: 12-col, 24px gutter, 64px margin
  - [ ] Tablet: 8-col, 16px gutter, 32px margin
  - [ ] Mobile: 4-col, 12px gutter, 16px margin
  - [ ] TV: 16-col, 48px gutter, 96px margin
  - [ ] Kiosk: 6-col, 32px gutter, 48px margin
  - [ ] Responsive: Breakpoint 기반 자동 전환

- [ ] Layout Behavior 스키마 정의
  - [ ] navigation, cardLayout, dataDensity, interactionModel 속성 정의
  - [ ] 환경별 기본값 설정

- [ ] Skeleton preset 6개 구현
  - [ ] FullScreen, WithHeader, WithSidebar, WithHeaderSidebar, WithHeaderFooter, Dashboard
  - [ ] 각 preset별 기본 구성 정의

- [ ] Intent enum 10개 타입 정의
  - [ ] DataList, DataDetail, Dashboard, Form, Wizard, Auth, Settings, EmptyState, Error, Custom
  - [ ] TypeScript enum 컴파일 통과

- [ ] Intent → Compound Pattern 매핑 테이블 작성
  - [ ] 각 Intent별 primaryComponents 목록
  - [ ] 각 Intent별 layoutPatterns 목록
  - [ ] 각 Intent별 actions 목록

- [ ] 단위 테스트 통과
  - [ ] Environment 스키마 검증 테스트
  - [ ] Skeleton 스키마 검증 테스트
  - [ ] Intent 스키마 검증 테스트

---

### M2 검증

- [ ] `tekton create screen` 명령 정상 등록
  - [ ] commander 명령어 파싱 확인
  - [ ] 플래그 파라미터 파싱 확인 (--env, --skeleton, --intent, --components)

- [ ] Interactive 프롬프트 4단계 동작
  - [ ] Environment 선택 프롬프트
  - [ ] Skeleton 선택 프롬프트
  - [ ] Intent 선택 프롬프트
  - [ ] Component 다중 선택 프롬프트

- [ ] Non-interactive 플래그 파싱 정상
  - [ ] 모든 플래그 제공 시 프롬프트 건너뛰기
  - [ ] 플래그 검증 (유효한 enum 값 확인)

- [ ] 디렉토리 및 파일 생성 확인
  - [ ] `src/screens/<name>/` 디렉토리 생성
  - [ ] `page.tsx`, `layout.tsx`, `components/index.ts` 파일 생성

- [ ] 생성된 코드 TypeScript 컴파일 통과
  - [ ] 모든 생성된 파일 컴파일 오류 없음
  - [ ] Import 문 정확성

- [ ] 템플릿 치환 정상 동작
  - [ ] 변수명 치환 확인
  - [ ] Component import 문 추가 확인

---

### M3 검증

- [ ] Extended Token System 스키마 정의
  - [ ] Brand 계층 4단계 (primary, secondary, tertiary, quaternary)
  - [ ] Semantic Colors 4개 (success, warning, error, info)
  - [ ] Data Visualization 팔레트 (categorical, sequential, diverging)
  - [ ] Neutral Scale 10단계

- [ ] @tekton/token-generator 연동 확인
  - [ ] 토큰 생성 파이프라인 정상 동작
  - [ ] OKLCH 색상 변환 정확성

- [ ] @tekton/contracts 검증 파이프라인 동작
  - [ ] Component Contract 검증 정상 동작
  - [ ] Composition Contract 검증 정상 동작
  - [ ] 위반 감지 및 메시지 표시

- [ ] 토큰 자동 주입 확인 (Tailwind 또는 StyleSheet)
  - [ ] Tailwind CSS 클래스 주입 확인 (`bg-primary`, `text-primary`)
  - [ ] React Native StyleSheet 주입 확인 (`backgroundColor: tokens.colors.primary`)

- [ ] fixSuggestion 자동 적용 확인
  - [ ] 위반 감지 시 수정 제안 표시
  - [ ] 사용자 선택에 따라 자동 수정 적용

---

### M4 검증

- [ ] `agent-context.json` 생성 확인
  - [ ] 프로젝트 루트 또는 `.moai/` 디렉토리에 배치
  - [ ] Environment, Skeleton, Intent, Token 정보 포함

- [ ] Screen Rules 문서 생성
  - [ ] `.moai/docs/screen-rules.md` 파일 생성
  - [ ] Intent 별 Best Practices 작성
  - [ ] Compound Pattern 예제 코드 포함

- [ ] VS Code Extension 연동 확인
  - [ ] Command Palette에서 "Create Screen" 실행
  - [ ] Extension이 `agent-context.json` 올바르게 참조

- [ ] AI 에이전트가 agent-context 올바르게 참조
  - [ ] 에이전트가 Intent 올바르게 판단
  - [ ] Screen Rules 기반 컴포넌트 추천 확인

---

## 참고 문서

- SPEC 문서: `.moai/specs/SPEC-PHASEC-003/spec.md`
- 구현 계획: `.moai/specs/SPEC-PHASEC-003/plan.md`
- Phase B 완료 보고서: `.moai/specs/SPEC-PHASEB-002/M4-completion-report.md`
- AFDS 전략 문서: `AFDS_PLAN.md` (Artifacts)
