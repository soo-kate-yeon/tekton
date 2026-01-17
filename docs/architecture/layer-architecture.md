# Tekton Layer Architecture

Tekton 컴포넌트 시스템의 4-레이어 아키텍처를 정의합니다.

---

## 레이어 개요

```
┌─────────────────────────────────────────────────────────┐
│  Layer 4: Structure (구조)                              │
│  "버튼은 <button> 태그, 모달은 <dialog> 태그"            │
├─────────────────────────────────────────────────────────┤
│  Layer 3: Archetype (연결 규칙)                         │
│  "isPressed=true → background: primary-700"             │
├─────────────────────────────────────────────────────────┤
│  Layer 2: Token (디자인 토큰)                           │
│  "primary-500 = oklch(0.5 0.15 220)"                   │
├─────────────────────────────────────────────────────────┤
│  Layer 1: Hook (동작 로직)                              │
│  "클릭하면 isPressed=true"                              │
└─────────────────────────────────────────────────────────┘
```

---

## 각 레이어 역할

### Layer 1: Hook (동작 로직)
- **담당**: 사용자 인터랙션 감지, 상태 관리, 접근성(ARIA)
- **SPEC**: SPEC-COMPONENT-001
- **위치**: `@tekton/headless-components`
- **반환값**: Props 객체 + 상태 값

```typescript
const { buttonProps, isPressed } = useButton();
// buttonProps: onClick, onKeyDown, role, aria-* 등
// isPressed: boolean 상태
```

### Layer 2: Token (디자인 토큰)
- **담당**: 색상, 간격, 폰트, 그림자 등 디자인 값
- **SPEC**: SPEC-COMPONENT-002
- **위치**: `@tekton/token-contract`
- **출력**: CSS 변수

```css
--tekton-primary-500: oklch(0.5 0.15 220);
--tekton-spacing-md: 1rem;
--tekton-border-radius: 4px;
```

### Layer 3: Archetype (연결 규칙)
- **담당**: Hook 상태 ↔ Token 스타일 매핑
- **SPEC**: SPEC-ARCHETYPE-001
- **위치**: `packages/archetype-system`
- **역할**:
  - 상태별 스타일 규칙 (`isPressed` → 어떤 CSS)
  - 변형(variant) 분기 규칙
  - AI가 참조하는 생성 가이드

```json
{
  "state": "isPressed",
  "styles": {
    "background": "var(--tekton-primary-700)",
    "transform": "scale(0.98)"
  }
}
```

**Implementation Details**:
- **Schemas**: JSON Schema definitions in `packages/archetype-system/src/schemas/`
  - `hook-prop-rules.schema.json` - Hook-to-prop mapping validation
  - `state-style-mapping.schema.json` - State-to-style mapping validation
  - `variant-branching.schema.json` - Variant configuration validation
- **Validators**: Runtime validation utilities in `packages/archetype-system/src/validators/`
- **Documentation**:
  - `docs/preset_archetypes.md` - Complete archetype reference for AI
  - `docs/element-mapping.md` - HTML element selection guide
  - `docs/composition-patterns.md` - Nested component patterns
  - `docs/variant-decision-trees.md` - Conditional styling logic
- **Test Coverage**: 87.78% (142 tests passing)
- **Quality Status**: TRUST 5 PASS

### Layer 4: Structure (구조/형태)
- **담당**: HTML 마크업 구조, 컴포넌트 템플릿
- **SPEC**: SPEC-ARCHETYPE-001 내 권장 템플릿 + SPEC-COMPONENT-003
- **역할**:
  - 권장 HTML 요소 (`<button>`, `<dialog>` 등)
  - 자식 요소 배치 (아이콘 + 라벨 순서)
  - 중첩 구조 (Dropdown = Trigger + Menu + Items)

```jsx
// Button 권장 구조
<button {...buttonProps} className={computedStyles}>
  {icon && <span className="button-icon">{icon}</span>}
  <span className="button-label">{children}</span>
</button>
```

---

## 데이터 흐름

```
사용자 클릭
    ↓
[Hook] isPressed = true 상태 반환
    ↓
[Archetype] isPressed 상태에 해당하는 스타일 규칙 조회
    ↓
[Token] CSS 변수 값 참조 (--tekton-primary-700)
    ↓
[Structure] JSX 템플릿에 스타일 적용 후 렌더링
    ↓
화면에 눌린 버튼 표시
```

---

## SPEC 매핑

| 레이어 | SPEC | 패키지 | 상태 | 문서 |
|:---|:---|:---|:---:|:---|
| Hook | SPEC-COMPONENT-001 | `@tekton/headless-components` | ✅ 완료 | - |
| Token | SPEC-COMPONENT-002 | `@tekton/token-contract` | ✅ 완료 | - |
| Archetype | SPEC-ARCHETYPE-001 | `packages/archetype-system` | ✅ 완료 | [AI Master Guide](../preset_archetypes.md), [Element Mapping](../element-mapping.md), [Composition Patterns](../composition-patterns.md), [Variant Trees](../variant-decision-trees.md) |
| Structure | SPEC-COMPONENT-003 | `@tekton/components` | ⬜ 대기 | - |

---

## AI 컴포넌트 생성 워크플로우

1. **사용자 프롬프트**: "Professional 스타일 파란색 버튼 만들어줘"
2. **AI가 참조**:
   - Hook: `useButton` (SPEC-001)
   - Token: Professional 프리셋의 CSS 변수 (SPEC-002)
   - Archetype: Button 상태-스타일 매핑 (SPEC-ARCHETYPE)
   - Structure: Button 권장 JSX 템플릿 (SPEC-ARCHETYPE)
3. **AI 출력**: 완성된 Button 컴포넌트 코드

---

**Last Updated**: 2026-01-17
