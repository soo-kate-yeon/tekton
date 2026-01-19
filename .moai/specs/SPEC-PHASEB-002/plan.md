# Implementation Plan: SPEC-PHASEB-002

## 마일스톤 개요

Phase B 구현은 4개의 순차적 마일스톤으로 구성되며, Monorepo 전환부터 시작하여 CLI 코어 기능, VS Code extension, 선택적 고급 기능 순으로 진행됩니다.

```
Milestone 1: Monorepo 전환 (Foundation)
    ↓
Milestone 2: CLI 코어 기능 (Primary Goal)
    ↓
Milestone 3: VS Code Extension (Secondary Goal)
    ↓
Milestone 4: 고급 기능 (Optional Goal)
```

---

## Milestone 1: Monorepo 전환

### 목표
Phase A의 개별 패키지를 통합 관리하는 pnpm workspace 기반 monorepo 구조 확립

### 주요 작업

**M1.1: Workspace 설정**
- pnpm-workspace.yaml 생성
  ```yaml
  packages:
    - 'packages/*'
  ```
- Root package.json 설정
  - Private repository 설정 (`"private": true`)
  - Workspace 전역 devDependencies (TypeScript, ESLint, Prettier, Vitest)
  - Scripts: `test:all`, `build:all`, `lint:all`

**M1.2: Phase A 패키지 추출**
- 기존 src/ 디렉토리를 packages/ 하위로 이동
  - `packages/theme/`: Phase A1 프리셋 시스템
  - `packages/token-generator/`: Phase A2 토큰 생성기
  - `packages/contracts/`: Phase A3 컴포넌트 계약
- 각 패키지의 package.json 생성
  - Package name: `@tekton/theme`, `@tekton/token-generator`, `@tekton/contracts`
  - Exports 설정: `"exports": { ".": "./src/index.ts" }`
- Workspace protocol 사용: `"@tekton/theme": "workspace:*"`

**M1.3: 빌드 및 테스트 검증**
- Root에서 `pnpm install` 실행
- 모든 Phase A 테스트 실행 및 통과 확인
  - `pnpm --filter @tekton/theme test`
  - `pnpm --filter @tekton/token-generator test`
  - `pnpm --filter @tekton/contracts test`
- 테스트 커버리지 유지 확인:
  - theme: ≥97.77%
  - token-generator: 100% (critical paths)
  - contracts: 100% (208 tests)

**M1.4: 공통 설정 통합**
- `tsconfig.base.json` 생성 (공통 TypeScript 설정)
- `.eslintrc.base.json` 생성 (공통 ESLint 규칙)
- `vitest.config.base.ts` 생성 (공통 테스트 설정)

### 성공 기준
- [ ] pnpm workspace가 정상 동작 (의존성 hoisting 확인)
- [ ] Phase A의 모든 테스트 통과 (회귀 없음)
- [ ] 빌드 시간 < 10초 (3개 패키지 병렬 빌드)
- [ ] 공통 설정 파일 적용 확인

### 위험 관리
- **위험**: 패키지 간 순환 의존성 발생
  - **대응**: 의존성 그래프 분석, 인터페이스 분리
- **위험**: 기존 import 경로 변경으로 인한 빌드 오류
  - **대응**: TypeScript path mapping 활용

---

## Milestone 2: CLI 코어 기능

### 목표
프레임워크 감지, shadcn 자동 설치, 토큰 생성 기능을 제공하는 CLI 패키지 구현

### 주요 작업

**M2.1: CLI 패키지 스캐폴딩**
- `packages/cli/` 디렉토리 생성
- package.json 설정
  ```json
  {
    "name": "@tekton/cli",
    "bin": { "tekton": "./dist/index.js" },
    "type": "module",
    "engines": { "node": ">=18.0.0" }
  }
  ```
- Dependencies:
  - commander (v12.x): 명령어 파싱
  - chalk (v5.x): 색상 출력
  - enquirer (v2.x): 대화형 프롬프트
  - execa (v9.x): subprocess 실행
  - fs-extra (v11.x): 파일 유틸리티
- Workspace dependencies:
  - `@tekton/theme`, `@tekton/token-generator`

**M2.2: 프레임워크 감지 (detect 명령어)**
- `src/detectors/framework.ts` 구현
  - Framework enum: `Next.js | Vite | Remix`
  - Detection logic:
    - Next.js: `next.config.js` 또는 `next.config.mjs` 존재
    - Vite: `vite.config.ts` 또는 `vite.config.js` 존재
    - Remix: `remix.config.js` 존재
  - Return type: `{ framework: Framework | null, version?: string }`
- `src/detectors/tailwind.ts` 구현
  - tailwind.config.js/ts 존재 여부 확인
  - Return type: `{ installed: boolean, configPath?: string }`
- `src/detectors/shadcn.ts` 구현
  - components.json 존재 여부 확인
  - Return type: `{ installed: boolean, configPath?: string }`
- `src/commands/detect.ts` 구현
  - commander 명령어 등록: `program.command('detect')`
  - 3가지 detector 순차 실행
  - 결과를 chalk로 포맷하여 출력

**M2.3: shadcn 자동 설치 (setup 명령어)**
- `src/setup/shadcn-installer.ts` 구현
  - Prerequisite check:
    - Framework detected 확인
    - Tailwind installed 확인
  - shadcn CLI 실행:
    ```typescript
    await execa('npx', ['shadcn@latest', 'init'], {
      stdio: 'inherit',
      cwd: projectRoot
    });
    ```
  - Post-installation validation: components.json 생성 확인
- `src/commands/setup.ts` 구현
  - commander 명령어 등록: `program.command('setup').argument('<target>')`
  - Target validation: 현재는 'shadcn'만 지원

**M2.4: 토큰 생성 (generate 명령어)**
- `src/commands/generate.ts` 구현
  - Phase A token-generator import
  - enquirer를 사용한 Q&A 워크플로우:
    - Primary color 입력 (hex code)
    - Theme 선택 (Default Palette / Accessible / Vibrant 등)
  - Token generation 실행:
    ```typescript
    import { generateTokens } from '@tekton/token-generator';
    const tokens = await generateTokens({ primaryColor, theme });
    ```
  - 파일 출력:
    - `src/styles/tokens.css`: CSS variables
    - `tailwind.config.js`: Tailwind config 업데이트
  - 성공 메시지 출력 (chalk.green)

**M2.5: CLI 테스트**
- Unit tests (`tests/detectors/*.test.ts`):
  - Framework detection logic 테스트 (mocked file system)
  - Tailwind detection logic 테스트
  - shadcn detection logic 테스트
- Integration tests (`tests/commands/*.test.ts`):
  - detect 명령어 E2E 테스트 (fixture 프로젝트)
  - setup shadcn 명령어 테스트 (mocked execa)
  - generate 명령어 테스트 (mocked enquirer)
- 테스트 커버리지 목표: ≥85%

### 성공 기준
- [ ] `tekton detect` 실행 시 < 1초 내 결과 출력
- [ ] `tekton setup shadcn` 실행 시 shadcn CLI 정상 호출
- [ ] `tekton generate` 실행 시 토큰 파일 생성
- [ ] 테스트 커버리지 ≥85%
- [ ] Windows, macOS, Linux에서 모두 동작 확인

### 위험 관리
- **위험**: 프레임워크별 config 파일 경로 차이
  - **대응**: 각 프레임워크별 fallback 경로 리스트 유지
- **위험**: shadcn CLI 버전 변경으로 인한 호환성 문제
  - **대응**: shadcn CLI 버전 고정 (package.json에 명시)

---

## Milestone 3: VS Code Extension

### 목표
VS Code 내에서 CLI 명령어를 실행할 수 있는 extension 제공

### 주요 작업

**M3.1: Extension 스캐폴딩**
- `packages/vscode-extension/` 디렉토리 생성
- package.json 설정
  ```json
  {
    "name": "tekton-vscode",
    "displayName": "Tekton Design System",
    "version": "0.1.0",
    "engines": { "vscode": "^1.95.0" },
    "activationEvents": ["onCommand:tekton.detectStack"],
    "main": "./dist/extension.js"
  }
  ```
- Dependencies:
  - `@types/vscode` (v1.95.x)
  - `execa` (v9.x): CLI subprocess 실행

**M3.2: CLI 통합 유틸리티**
- `src/utils/cliRunner.ts` 구현
  - CLI 실행 함수:
    ```typescript
    async function runCLI(command: string, args: string[]): Promise<{ stdout: string, stderr: string }> {
      const { stdout, stderr } = await execa('tekton', [command, ...args], {
        cwd: vscode.workspace.rootPath,
        reject: false
      });
      return { stdout, stderr };
    }
    ```
  - Output 채널 관리:
    ```typescript
    const outputChannel = vscode.window.createOutputChannel('Tekton');
    outputChannel.appendLine(stdout);
    ```

**M3.3: 명령어 구현**
- `src/commands/detectStack.ts`:
  - 명령어 ID: `tekton.detectStack`
  - CLI `detect` 실행 후 Output 패널에 결과 표시
- `src/commands/setupShadcn.ts`:
  - 명령어 ID: `tekton.setupShadcn`
  - CLI `setup shadcn` 실행
  - 진행 중 Progress notification 표시
- `src/commands/generateTokens.ts`:
  - 명령어 ID: `tekton.generateTokens`
  - CLI `generate` 실행
  - 완료 후 생성된 파일 경로 notification

**M3.4: Extension 등록**
- `src/extension.ts` 구현
  - activate() 함수에서 명령어 등록:
    ```typescript
    export function activate(context: vscode.ExtensionContext) {
      context.subscriptions.push(
        vscode.commands.registerCommand('tekton.detectStack', detectStack),
        vscode.commands.registerCommand('tekton.setupShadcn', setupShadcn),
        vscode.commands.registerCommand('tekton.generateTokens', generateTokens)
      );
    }
    ```

**M3.5: Extension 테스트**
- Unit tests (`tests/utils/*.test.ts`):
  - cliRunner 유틸리티 테스트 (mocked execa)
- Integration tests (`tests/commands/*.test.ts`):
  - 각 명령어 실행 테스트 (mocked vscode API)
- 테스트 커버리지 목표: ≥70%

**M3.6: Extension 빌드 및 패키징**
- esbuild 설정으로 번들링
- .vsix 파일 생성 (vsce package)
- Local 설치 테스트

### 성공 기준
- [ ] Command Palette에서 3개 명령어 정상 실행
- [ ] CLI subprocess 실행 시 실시간 출력 스트리밍
- [ ] 에러 발생 시 적절한 에러 메시지 표시
- [ ] 테스트 커버리지 ≥70%

### 위험 관리
- **위험**: VS Code API 변경으로 인한 호환성 문제
  - **대응**: VS Code 최소 버전 명시 (engines.vscode)
- **위험**: CLI가 설치되지 않은 경우
  - **대응**: CLI 설치 여부 확인, 미설치 시 설치 가이드 표시

---

## Milestone 4: 고급 기능 (Optional)

### 목표
Phase C 준비 및 추가 프레임워크 지원

### 주요 작업

**M4.1: Create Screen 템플릿 준비**
- `packages/cli/templates/screen/` 디렉토리 생성
- 기본 화면 템플릿 파일:
  - `page.tsx.template`: 기본 페이지 컴포넌트
  - `layout.tsx.template`: 레이아웃 컴포넌트
  - `index.ts.template`: Barrel export

**M4.2: 고급 스택 감지**
- Nuxt 감지: `nuxt.config.ts` 존재 여부
- SvelteKit 감지: `svelte.config.js` 존재 여부
- 감지 결과에 따른 프레임워크별 설정 적용

**M4.3: 문서화**
- README 업데이트: Monorepo 구조 설명
- CLI 사용 가이드 작성: 각 명령어 예제
- Extension 사용 가이드 작성: 스크린샷 포함

### 성공 기준
- [ ] 템플릿 파일 생성 완료
- [ ] Nuxt 및 SvelteKit 감지 테스트 통과
- [ ] 문서화 완료

---

## 기술 스택 버전

### Core Dependencies

**Monorepo 관리**:
- pnpm: ^9.15.0
- Turborepo (optional): ^2.3.0

**CLI Dependencies**:
- commander: ^12.1.0
- chalk: ^5.3.0
- enquirer: ^2.4.1
- execa: ^9.5.2
- fs-extra: ^11.2.0

**VS Code Extension Dependencies**:
- @types/vscode: ^1.95.0
- esbuild: ^0.24.2

**Build & Test**:
- TypeScript: ^5.9.0
- vitest: ^2.1.8
- @vitest/ui: ^2.1.8
- ESLint: ^9.18.0
- Prettier: ^3.4.2

**Phase A Package References** (Workspace):
- @tekton/theme: workspace:*
- @tekton/token-generator: workspace:*
- @tekton/contracts: workspace:*

### Version Validation

모든 의존성 버전은 다음 명령어로 검증:
```bash
pnpm outdated
pnpm audit
```

---

## 테스트 전략

### 단위 테스트 (Unit Tests)

**CLI 패키지**:
- `detectors/*.test.ts`: 각 detector 로직 테스트
  - Framework detection: Next.js, Vite, Remix 각각 테스트
  - Tailwind detection: config 파일 존재/부재 시나리오
  - shadcn detection: components.json 존재/부재 시나리오
- `commands/*.test.ts`: 각 명령어 handler 테스트
  - Mocked file system (memfs)
  - Mocked subprocess (execa mock)

**Extension 패키지**:
- `utils/*.test.ts`: CLI runner 유틸리티 테스트
  - Mocked execa 응답
  - Output 채널 기록 확인

### 통합 테스트 (Integration Tests)

**CLI E2E**:
- Fixture 프로젝트 생성 (Next.js, Vite 각각)
- 실제 CLI 명령어 실행
- 예상 출력 및 파일 생성 확인

**Extension E2E**:
- VS Code Extension Test Runner 사용
- 실제 workspace에서 명령어 실행
- Output 패널 내용 검증

### 크로스 플랫폼 테스트

**CI 설정** (GitHub Actions):
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, macos-latest, windows-latest]
    node: [18, 20, 22]
```

**Path Separator 테스트**:
- Windows: `\` (backslash)
- macOS/Linux: `/` (forward slash)
- Node.js `path` 모듈 사용으로 통일

---

## 위험 관리

### 높은 위험 (High Risk)

**R-001: 크로스 플랫폼 Path 처리 불일치**
- **영향도**: HIGH
- **발생 가능성**: MEDIUM
- **완화 전략**:
  - Node.js `path` 모듈 사용 (path.join, path.resolve)
  - CI에서 3개 OS 모두 테스트
  - Path 관련 테스트 추가 (Windows/Unix 각각)
- **비상 계획**:
  - Platform-specific 로직 분리
  - Path normalization 유틸리티 함수 작성

**R-002: VS Code Extension API 제한**
- **영향도**: MEDIUM
- **발생 가능성**: MEDIUM
- **완화 전략**:
  - CLI subprocess로 모든 로직 분리
  - Extension은 UI 및 subprocess 호출만 담당
  - VS Code API 사용 최소화
- **비상 계획**:
  - CLI 독립 실행 가능하도록 설계
  - Extension 없이도 CLI 사용 가능

### 중간 위험 (Medium Risk)

**R-003: shadcn CLI 버전 변경**
- **영향도**: MEDIUM
- **발생 가능성**: LOW
- **완화 전략**:
  - shadcn CLI 버전 고정 (package.json)
  - 정기적 호환성 테스트 (월 1회)
  - shadcn CLI 업데이트 모니터링
- **비상 계획**:
  - shadcn CLI wrapper 구현
  - 버전별 호환 레이어 추가

**R-004: Monorepo 전환 시 빌드 시간 증가**
- **영향도**: LOW
- **발생 가능성**: MEDIUM
- **완화 전략**:
  - Turborepo 도입 (빌드 캐시)
  - 병렬 빌드 활성화
  - Incremental build 설정 (TypeScript)
- **비상 계획**:
  - Watch mode 최적화
  - 개발 시 특정 패키지만 빌드

---

## 성공 지표

### 기능 완성도
- [ ] Milestone 1 완료: Monorepo 전환, Phase A 테스트 통과
- [ ] Milestone 2 완료: CLI 3개 명령어 구현, 테스트 ≥85%
- [ ] Milestone 3 완료: Extension 3개 명령어 구현, 테스트 ≥70%
- [ ] Milestone 4 완료 (Optional): 템플릿 및 고급 감지 구현

### 품질 지표
- [ ] 테스트 통과율 100% (모든 테스트 통과)
- [ ] CLI 테스트 커버리지 ≥85%
- [ ] Extension 테스트 커버리지 ≥70%
- [ ] ESLint zero errors
- [ ] TypeScript strict mode 적용

### 성능 지표
- [ ] 스택 감지 시간 < 1초
- [ ] shadcn 설치 시간 < 30초 (npm install 제외)
- [ ] 토큰 생성 시간 < 500ms
- [ ] Monorepo 빌드 시간 < 30초

### 문서화 지표
- [ ] README 업데이트 (Monorepo 구조, 사용법)
- [ ] CLI 명령어 문서 작성
- [ ] Extension 사용 가이드 작성
- [ ] API 문서 생성 (TypeDoc)

---

## 다음 단계

Phase B 완료 후 진행할 항목:

### Phase C: Create Screen Workflow
- Compound Pattern 기반 화면 생성
- 토큰 및 컴포넌트 자동 적용
- 템플릿 기반 스캐폴딩

### Phase D: 고급 기능 확장
- Figma Token 동기화 (Figma Plugin API)
- 디자인 시스템 버전 관리 (Semantic Versioning)
- 팀 협업 기능 (공유 프리셋, 중앙 저장소)

### 유지보수 계획
- 월간 의존성 업데이트 (pnpm update)
- 분기별 shadcn CLI 호환성 테스트
- 신규 프레임워크 지원 검토 (커뮤니티 요청 기반)

---

## 참고 자료

### Phase A 문서
- Phase A 완료 보고서: `.moai/docs/phase-a-completion.md`
- Theme System 문서: `packages/theme/README.md`
- Token Generator 문서: `packages/token-generator/README.md`
- Component Contracts 문서: `packages/contracts/README.md`

### 기술 문서
- pnpm Workspaces: https://pnpm.io/workspaces
- commander.js: https://github.com/tj/commander.js
- VS Code Extension API: https://code.visualstudio.com/api
- shadcn/ui CLI: https://ui.shadcn.com/docs/cli

### MoAI-ADK 문서
- SPEC-First TDD: `moai-workflow-spec`
- TRUST 5 Framework: `moai-foundation-core`
- Token Optimization: `moai-foundation-core`
