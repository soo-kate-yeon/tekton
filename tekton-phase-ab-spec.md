# FigmArchitect Phase A-B 개발 구현 스펙

> **목적**: 개발 에이전트가 바로 구현을 시작할 수 있도록 작성된 상세 기술 스펙
> **대상 스택**: Next.js + Tailwind CSS + shadcn/ui
> **버전**: v0.1.0-draft

---

## 목차

1. [Phase A: shadcn Preset + Token Generator](#phase-a-shadcn-preset--token-generator)
2. [Phase B: IDE Bootstrap + 연결/초기화](#phase-b-ide-bootstrap--연결초기화)
3. [테스트 전략](#테스트-전략)
4. [마일스톤 체크리스트](#마일스톤-체크리스트)

---

## Phase A: shadcn Preset + Token Generator

### A1. Preset 정의

#### 목표
프로젝트에 shadcn 기반 디자인 시스템을 적용하기 위한 메타 정보 정의

#### 구현 상세

**파일**: `packages/preset/src/presets/next-tailwind-shadcn.json`

```json
{
  "id": "next-tailwind-shadcn",
  "version": "0.1.0",
  "name": "Next.js + Tailwind + shadcn",
  "description": "Production-ready preset for Next.js apps with Tailwind CSS and shadcn/ui",
  
  "stack": {
    "framework": "nextjs",
    "styling": "tailwindcss",
    "components": "shadcn"
  },
  
  "dependencies": {
    "required": {
      "clsx": "^2.1.0",
      "tailwind-merge": "^2.2.0",
      "lucide-react": "^0.400.0",
      "class-variance-authority": "^0.7.0"
    },
    "devDependencies": {
      "tailwindcss": "^3.4.0",
      "postcss": "^8.4.0",
      "autoprefixer": "^10.4.0"
    }
  },
  
  "fileStructure": {
    "components/ui": "shadcn 컴포넌트 디렉토리",
    "lib/utils.ts": "cn() 유틸리티 함수",
    "styles/tokens.css": "생성된 디자인 토큰",
    "app/globals.css": "전역 스타일 (또는 styles/globals.css)",
    "components.json": "shadcn CLI 설정",
    "tailwind.config.ts": "Tailwind 설정"
  },
  
  "componentWhitelist": [
    "button",
    "input", 
    "card",
    "dialog",
    "tabs",
    "dropdown-menu",
    "alert",
    "toast",
    "label",
    "separator",
    "badge"
  ],
  
  "themeMode": "css-variables"
}
```

#### 타입 정의

**파일**: `packages/preset/src/types/preset.ts`

```typescript
export interface Preset {
  id: string;
  version: string;
  name: string;
  description: string;
  
  stack: {
    framework: 'nextjs' | 'vite' | 'remix';
    styling: 'tailwindcss';
    components: 'shadcn';
  };
  
  dependencies: {
    required: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  
  fileStructure: Record<string, string>;
  componentWhitelist: ShadcnComponent[];
  themeMode: 'css-variables' | 'tailwind-config';
}

export type ShadcnComponent = 
  | 'button' | 'input' | 'card' | 'dialog' 
  | 'tabs' | 'dropdown-menu' | 'alert' | 'toast'
  | 'label' | 'separator' | 'badge' | 'checkbox'
  | 'select' | 'textarea' | 'switch' | 'slider';
```

#### 성공 기준
- [ ] preset.json 스키마 검증 통과
- [ ] 빈 Next.js 프로젝트에 적용 시 에러 없음
- [ ] 모든 whitelist 컴포넌트가 정상 렌더링

#### 테스트 방법
```bash
# 유닛 테스트
pnpm test packages/preset

# 통합 테스트: 빈 프로젝트에 적용
pnpm create next-app test-project --typescript --tailwind --app
cd test-project
npx figmarchitect apply-preset next-tailwind-shadcn
pnpm dev # 정상 구동 확인
```

---

### A2. Token Q&A → Theme 생성

#### 목표
사용자 Q&A 응답을 기반으로 shadcn 호환 CSS 변수 토큰 생성

#### A2-1. Q&A 스키마

**파일**: `packages/token-generator/src/schema/questionnaire.ts`

```typescript
export interface TokenQuestionnaire {
  // Q1: 브랜드 톤
  brandTone: 'minimal' | 'neutral' | 'playful' | 'serious' | 'luxury';
  
  // Q2: 대비 수준
  contrast: 'standard' | 'high';
  
  // Q3: UI 밀도
  density: 'comfortable' | 'compact';
  
  // Q4: 모서리 라운딩
  borderRadius: 'none' | 'sm' | 'md' | 'lg';
  
  // Q5: Primary 색상
  primaryColor: {
    type: 'preset' | 'custom';
    value: string; // preset: 'blue' | 'green' | 'purple' 등, custom: hex
  };
  
  // Q6: Neutral 톤
  neutralTone: 'warm' | 'cool' | 'gray';
  
  // Q7: 폰트 스케일
  fontScale: 'small' | 'default' | 'large';
}

// 기본값
export const DEFAULT_QUESTIONNAIRE: TokenQuestionnaire = {
  brandTone: 'neutral',
  contrast: 'standard',
  density: 'comfortable',
  borderRadius: 'md',
  primaryColor: { type: 'preset', value: 'blue' },
  neutralTone: 'gray',
  fontScale: 'default'
};
```

#### A2-2. Token Generator 핵심 로직

**파일**: `packages/token-generator/src/generator.ts`

```typescript
import { TokenQuestionnaire } from './schema/questionnaire';
import { ColorPalette, generatePalette } from './utils/color';
import { RadiusScale, SpacingScale } from './utils/scales';

export interface GeneratedTokens {
  cssVariables: string;      // CSS 변수 문자열
  tokensJson: TokensJson;    // 구조화된 토큰 데이터
  tailwindExtend: object;    // tailwind.config extend 객체
}

export interface TokensJson {
  version: string;
  generated: string;
  seed: TokenQuestionnaire;
  tokens: {
    color: ColorTokens;
    radius: RadiusTokens;
    spacing: SpacingTokens;
    typography: TypographyTokens;
  };
}

export function generateTokens(input: TokenQuestionnaire): GeneratedTokens {
  // 1. 색상 팔레트 생성
  const colors = generateColorTokens(input);
  
  // 2. 라운딩 스케일
  const radius = generateRadiusTokens(input.borderRadius);
  
  // 3. 스페이싱 (밀도 기반)
  const spacing = generateSpacingTokens(input.density);
  
  // 4. 타이포그래피
  const typography = generateTypographyTokens(input.fontScale);
  
  // 5. CSS 변수 문자열 생성
  const cssVariables = composeCssVariables({ colors, radius, spacing, typography });
  
  // 6. tokens.json 구조
  const tokensJson: TokensJson = {
    version: '0.1.0',
    generated: new Date().toISOString(),
    seed: input,
    tokens: { color: colors, radius, spacing, typography }
  };
  
  // 7. Tailwind extend 객체
  const tailwindExtend = composeTailwindExtend({ colors, radius, spacing });
  
  return { cssVariables, tokensJson, tailwindExtend };
}
```

#### A2-3. 색상 생성 로직 (OKLCH 기반)

> **참고**: 이 알고리즘은 figmarchitect-spec.md의 OKLCH 기반 팔레트 생성 로직을 따름

**파일**: `packages/token-generator/src/utils/color.ts`

```typescript
import { oklch, formatHex, clampChroma, type Oklch } from 'culori';

// ============================================
// CONSTANTS
// ============================================

const PALETTE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

// OKLCH Lightness & Chroma scaling per step
const LIGHTNESS_SCALE: Record<number, { l: number; chromaScale: number }> = {
  50:  { l: 0.97, chromaScale: 0.25 },
  100: { l: 0.93, chromaScale: 0.40 },
  200: { l: 0.87, chromaScale: 0.60 },
  300: { l: 0.78, chromaScale: 0.80 },
  400: { l: 0.68, chromaScale: 0.95 },
  500: { l: 0.55, chromaScale: 1.00 },  // Base step
  600: { l: 0.48, chromaScale: 0.95 },
  700: { l: 0.40, chromaScale: 0.85 },
  800: { l: 0.32, chromaScale: 0.75 },
  900: { l: 0.24, chromaScale: 0.65 },
};

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface OKLCHColor {
  l: number;  // 0-1
  c: number;  // 0-0.4
  h: number;  // 0-360
}

export interface ColorScale {
  [step: number]: {
    hex: string;
    oklch: OKLCHColor;
    srgb: [number, number, number];
  };
}

export interface ShadcnColorTokens {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

// ============================================
// PRIMARY PALETTE GENERATION
// ============================================

export function generatePrimaryPalette(primaryHex: string): ColorScale {
  const base = oklch(primaryHex);
  if (!base) throw new Error(`Invalid color: ${primaryHex}`);

  const palette: ColorScale = {};

  for (const step of PALETTE_STEPS) {
    const params = LIGHTNESS_SCALE[step];
    
    const rawColor: Oklch = {
      mode: 'oklch',
      l: params.l,
      c: (base.c ?? 0.15) * params.chromaScale,
      h: base.h ?? 0,
    };

    // Clamp to sRGB gamut
    const clamped = clampChroma(rawColor, 'oklch');
    const hex = formatHex(clamped);

    palette[step] = {
      hex,
      oklch: { l: clamped.l, c: clamped.c ?? 0, h: clamped.h ?? 0 },
      srgb: hexToSRGB(hex),
    };
  }

  return palette;
}

// ============================================
// NEUTRAL PALETTE GENERATION (BACKGROUND-BASED)
// ============================================

interface NeutralConfig {
  backgroundHex: string;
  primaryHex: string;
  mode: 'pure' | 'tinted' | 'custom';
}

export function generateNeutralPalette(config: NeutralConfig): ColorScale {
  const background = oklch(config.backgroundHex);
  const primary = oklch(config.primaryHex);
  
  if (!background || !primary) {
    throw new Error('Invalid color input');
  }

  const isLightMode = background.l > 0.5;
  
  // Neutral hue: tinted면 primary hue 사용, 아니면 background hue
  const neutralHue = config.mode === 'tinted' 
    ? primary.h ?? 0
    : background.h ?? 0;
  
  // Neutral chroma: tinted면 약간의 채도, 아니면 거의 무채색
  const neutralChroma = config.mode === 'tinted' ? 0.012 : 0.005;

  const lightnessScale = isLightMode
    ? generateLightModeScale(background.l)
    : generateDarkModeScale(background.l);

  const palette: ColorScale = {};

  for (const step of PALETTE_STEPS) {
    const targetL = lightnessScale[step];
    
    const rawColor: Oklch = {
      mode: 'oklch',
      l: targetL,
      c: neutralChroma,
      h: neutralHue,
    };
    
    const clamped = clampChroma(rawColor, 'oklch');
    const hex = formatHex(clamped);
    
    palette[step] = {
      hex,
      oklch: { l: clamped.l, c: clamped.c ?? 0, h: clamped.h ?? 0 },
      srgb: hexToSRGB(hex),
    };
  }

  return palette;
}

function generateLightModeScale(backgroundL: number): Record<number, number> {
  return {
    50:  backgroundL,
    100: Math.max(0.90, backgroundL - 0.03),
    200: Math.max(0.85, backgroundL - 0.08),
    300: 0.78,
    400: 0.65,
    500: 0.55,
    600: 0.45,
    700: 0.35,
    800: 0.25,
    900: 0.15,
  };
}

function generateDarkModeScale(backgroundL: number): Record<number, number> {
  return {
    50:  0.97,
    100: 0.93,
    200: 0.85,
    300: 0.75,
    400: 0.60,
    500: 0.50,
    600: 0.40,
    700: 0.30,
    800: Math.min(0.25, backgroundL + 0.05),
    900: backgroundL,
  };
}

// ============================================
// STATUS COLOR PALETTES
// ============================================

const STATUS_COLORS = {
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export function generateStatusPalettes(): Record<string, ColorScale> {
  return {
    success: generatePrimaryPalette(STATUS_COLORS.success),
    warning: generatePrimaryPalette(STATUS_COLORS.warning),
    error: generatePrimaryPalette(STATUS_COLORS.error),
    info: generatePrimaryPalette(STATUS_COLORS.info),
  };
}

// ============================================
// SHADCN TOKEN MAPPING
// ============================================

export function mapToShadcnTokens(
  primaryPalette: ColorScale,
  neutralPalette: ColorScale,
  isLightMode: boolean
): ShadcnColorTokens {
  if (isLightMode) {
    return {
      background: oklchToHSL(neutralPalette[50].oklch),
      foreground: oklchToHSL(neutralPalette[900].oklch),
      card: oklchToHSL(neutralPalette[50].oklch),
      cardForeground: oklchToHSL(neutralPalette[900].oklch),
      popover: oklchToHSL(neutralPalette[50].oklch),
      popoverForeground: oklchToHSL(neutralPalette[900].oklch),
      primary: oklchToHSL(primaryPalette[500].oklch),
      primaryForeground: oklchToHSL(neutralPalette[50].oklch),
      secondary: oklchToHSL(neutralPalette[100].oklch),
      secondaryForeground: oklchToHSL(neutralPalette[900].oklch),
      muted: oklchToHSL(neutralPalette[100].oklch),
      mutedForeground: oklchToHSL(neutralPalette[500].oklch),
      accent: oklchToHSL(neutralPalette[100].oklch),
      accentForeground: oklchToHSL(neutralPalette[900].oklch),
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%',
      border: oklchToHSL(neutralPalette[200].oklch),
      input: oklchToHSL(neutralPalette[200].oklch),
      ring: oklchToHSL(primaryPalette[500].oklch),
    };
  } else {
    // Dark mode mappings
    return {
      background: oklchToHSL(neutralPalette[900].oklch),
      foreground: oklchToHSL(neutralPalette[50].oklch),
      card: oklchToHSL(neutralPalette[800].oklch),
      cardForeground: oklchToHSL(neutralPalette[50].oklch),
      popover: oklchToHSL(neutralPalette[800].oklch),
      popoverForeground: oklchToHSL(neutralPalette[50].oklch),
      primary: oklchToHSL(primaryPalette[500].oklch),
      primaryForeground: oklchToHSL(neutralPalette[900].oklch),
      secondary: oklchToHSL(neutralPalette[800].oklch),
      secondaryForeground: oklchToHSL(neutralPalette[50].oklch),
      muted: oklchToHSL(neutralPalette[800].oklch),
      mutedForeground: oklchToHSL(neutralPalette[400].oklch),
      accent: oklchToHSL(neutralPalette[800].oklch),
      accentForeground: oklchToHSL(neutralPalette[50].oklch),
      destructive: '0 62% 50%',
      destructiveForeground: '0 0% 100%',
      border: oklchToHSL(neutralPalette[700].oklch),
      input: oklchToHSL(neutralPalette[700].oklch),
      ring: oklchToHSL(primaryPalette[400].oklch),
    };
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function hexToSRGB(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
}

function oklchToHSL(color: OKLCHColor): string {
  // OKLCH to HSL approximation for CSS variables
  // Note: This is a simplified conversion; for production, use culori's converter
  const h = Math.round(color.h);
  const s = Math.round(Math.min(100, color.c * 400)); // Approximate saturation
  const l = Math.round(color.l * 100);
  return `${h} ${s}% ${l}%`;
}

// ============================================
// PRIMARY COLOR PRESETS
// ============================================

export const PRIMARY_PRESETS: Record<string, string> = {
  blue: '#3b82f6',
  indigo: '#6366f1',
  purple: '#a855f7',
  pink: '#ec4899',
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  lime: '#84cc16',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  slate: '#64748b',
};
```

#### A2-4. CSS 변수 출력

**파일**: `packages/token-generator/src/output/css.ts`

```typescript
export function composeCssVariables(tokens: {
  colors: ColorTokens;
  radius: RadiusTokens;
  spacing: SpacingTokens;
  typography: TypographyTokens;
}): string {
  return `@layer base {
  :root {
    /* Colors - Light Mode */
    --background: ${tokens.colors.background};
    --foreground: ${tokens.colors.foreground};
    --card: ${tokens.colors.card};
    --card-foreground: ${tokens.colors.cardForeground};
    --popover: ${tokens.colors.popover};
    --popover-foreground: ${tokens.colors.popoverForeground};
    --primary: ${tokens.colors.primary};
    --primary-foreground: ${tokens.colors.primaryForeground};
    --secondary: ${tokens.colors.secondary};
    --secondary-foreground: ${tokens.colors.secondaryForeground};
    --muted: ${tokens.colors.muted};
    --muted-foreground: ${tokens.colors.mutedForeground};
    --accent: ${tokens.colors.accent};
    --accent-foreground: ${tokens.colors.accentForeground};
    --destructive: ${tokens.colors.destructive};
    --destructive-foreground: ${tokens.colors.destructiveForeground};
    --border: ${tokens.colors.border};
    --input: ${tokens.colors.input};
    --ring: ${tokens.colors.ring};
    
    /* Radius */
    --radius: ${tokens.radius.base};
    
    /* Spacing (density) */
    --spacing-unit: ${tokens.spacing.unit};
  }

  .dark {
    /* Dark mode overrides - generated separately */
    --background: /* dark values */;
    /* ... */
  }
}`;
}
```

#### 성공 기준
- [ ] 동일 입력 → 동일 출력 (deterministic)
- [ ] 생성된 CSS 변수가 shadcn 컴포넌트에 즉시 적용
- [ ] 모든 Q&A 조합에서 유효한 색상 출력
- [ ] chroma.js로 접근성 대비율 검증 (AA 이상)

#### 테스트 방법
```typescript
// packages/token-generator/src/__tests__/generator.test.ts
import { generateTokens, DEFAULT_QUESTIONNAIRE } from '../generator';

describe('Token Generator', () => {
  it('produces deterministic output', () => {
    const result1 = generateTokens(DEFAULT_QUESTIONNAIRE);
    const result2 = generateTokens(DEFAULT_QUESTIONNAIRE);
    expect(result1.cssVariables).toBe(result2.cssVariables);
  });
  
  it('generates valid CSS', () => {
    const result = generateTokens(DEFAULT_QUESTIONNAIRE);
    // CSS 파싱 검증
    expect(() => postcss.parse(result.cssVariables)).not.toThrow();
  });
  
  it('all color combinations meet WCAG AA', () => {
    const result = generateTokens(DEFAULT_QUESTIONNAIRE);
    const tokens = result.tokensJson.tokens.color;
    
    // primary-foreground on primary 대비 검증
    const contrast = chroma.contrast(
      hslToHex(tokens.primary),
      hslToHex(tokens.primaryForeground)
    );
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });
});
```

---

### A3. Contracts & Policies 정의

#### 목표
shadcn 전체 컴포넌트에 대한 사용 규칙(Contracts)과 레이아웃 가이드라인(Policies) 정의

> **프로덕션 레벨 고려사항**: 실제 프로덕션 앱을 만들려면 shadcn의 모든 컴포넌트(~50개)를 커버해야 하며, 각 컴포넌트당 평균 5-15개의 constraint가 필요함

#### A3-1. Contract 스키마

**파일**: `packages/contracts/src/schema/contract.ts`

```typescript
// ============================================
// COMPLETE SHADCN COMPONENT LIST
// ============================================

export type ShadcnComponent =
  // Layout & Structure
  | 'accordion' | 'aspect-ratio' | 'card' | 'collapsible'
  | 'resizable' | 'scroll-area' | 'separator' | 'sheet'
  // Navigation
  | 'breadcrumb' | 'command' | 'context-menu' | 'dropdown-menu'
  | 'menubar' | 'navigation-menu' | 'pagination' | 'tabs'
  // Forms & Inputs
  | 'button' | 'calendar' | 'checkbox' | 'combobox'
  | 'date-picker' | 'form' | 'input' | 'input-otp'
  | 'label' | 'radio-group' | 'select' | 'slider'
  | 'switch' | 'textarea' | 'toggle' | 'toggle-group'
  // Data Display
  | 'avatar' | 'badge' | 'carousel' | 'chart'
  | 'data-table' | 'hover-card' | 'table'
  // Feedback & Overlays
  | 'alert' | 'alert-dialog' | 'dialog' | 'drawer'
  | 'popover' | 'progress' | 'skeleton' | 'sonner'
  | 'toast' | 'tooltip';

// ============================================
// CONTRACT SCHEMA
// ============================================

export interface ComponentContract {
  component: ShadcnComponent;
  version: string;
  category: ComponentCategory;
  constraints: Constraint[];
  bestPractices?: BestPractice[];
}

export type ComponentCategory = 
  | 'layout' | 'navigation' | 'form' | 'data-display' | 'feedback';

export interface Constraint {
  id: string;
  severity: 'error' | 'warning' | 'info';
  description: string;
  rule: ConstraintRule;
  message: string;
  autoFixable: boolean;
  fixSuggestion?: string;
}

export type ConstraintRule = 
  | PropCombinationRule
  | ChildrenRule
  | AccessibilityRule
  | ContextRule
  | CompositionRule
  | StateRule;

export interface PropCombinationRule {
  type: 'prop-combination';
  forbidden?: Array<{
    props: Record<string, unknown>;
    reason: string;
  }>;
  required?: Array<{
    condition: Record<string, unknown>;
    requires: string[];
  }>;
}

export interface ChildrenRule {
  type: 'children';
  maxCount?: { selector: string; count: number };
  minCount?: { selector: string; count: number };
  required?: string[];
  forbidden?: string[];
  order?: string[];  // Required order of children
}

export interface AccessibilityRule {
  type: 'accessibility';
  require: ('label' | 'aria-label' | 'aria-labelledby' | 'aria-describedby' | 'role')[];
  wcagLevel?: 'A' | 'AA' | 'AAA';
}

export interface ContextRule {
  type: 'context';
  allowedIn?: string[];
  forbiddenIn?: string[];
  requiredParent?: string;
}

export interface CompositionRule {
  type: 'composition';
  requiredSiblings?: string[];
  incompatibleWith?: string[];
}

export interface StateRule {
  type: 'state';
  requiredStates?: ('loading' | 'error' | 'empty' | 'disabled')[];
  forbiddenStates?: string[];
}

export interface BestPractice {
  id: string;
  description: string;
  recommendation: string;
}
```

#### A3-2. 전체 컴포넌트 Contract 정의

**파일**: `packages/contracts/src/definitions/index.ts`

```typescript
// ============================================
// COMPONENT CONTRACT REGISTRY
// ============================================

import { ComponentContract, ShadcnComponent } from '../schema/contract';

// Import all component contracts
import { buttonContract } from './button';
import { inputContract } from './input';
import { dialogContract } from './dialog';
import { formContract } from './form';
import { tableContract } from './table';
import { cardContract } from './card';
import { selectContract } from './select';
import { alertContract } from './alert';
import { toastContract } from './toast';
import { tabsContract } from './tabs';
import { dropdownContract } from './dropdown-menu';
import { navigationContract } from './navigation-menu';
import { accordionContract } from './accordion';
import { sheetContract } from './sheet';
import { popoverContract } from './popover';
import { tooltipContract } from './tooltip';
import { avatarContract } from './avatar';
import { badgeContract } from './badge';
import { checkboxContract } from './checkbox';
import { radioGroupContract } from './radio-group';
import { switchContract } from './switch';
import { sliderContract } from './slider';
import { progressContract } from './progress';
import { skeletonContract } from './skeleton';
import { scrollAreaContract } from './scroll-area';
import { separatorContract } from './separator';
import { calendarContract } from './calendar';
import { datePickerContract } from './date-picker';
import { comboboxContract } from './combobox';
import { commandContract } from './command';
import { contextMenuContract } from './context-menu';
import { menubarContract } from './menubar';
import { paginationContract } from './pagination';
import { breadcrumbContract } from './breadcrumb';
import { carouselContract } from './carousel';
import { hoverCardContract } from './hover-card';
import { drawerContract } from './drawer';
import { alertDialogContract } from './alert-dialog';
import { collapsibleContract } from './collapsible';
import { aspectRatioContract } from './aspect-ratio';
import { toggleContract } from './toggle';
import { toggleGroupContract } from './toggle-group';
import { textareaContract } from './textarea';
import { labelContract } from './label';
import { inputOtpContract } from './input-otp';
import { resizableContract } from './resizable';
import { chartContract } from './chart';
import { dataTableContract } from './data-table';
import { sonnerContract } from './sonner';

export const ALL_CONTRACTS: Map<ShadcnComponent, ComponentContract> = new Map([
  ['button', buttonContract],
  ['input', inputContract],
  ['dialog', dialogContract],
  ['form', formContract],
  ['table', tableContract],
  ['card', cardContract],
  ['select', selectContract],
  ['alert', alertContract],
  ['toast', toastContract],
  ['tabs', tabsContract],
  ['dropdown-menu', dropdownContract],
  ['navigation-menu', navigationContract],
  ['accordion', accordionContract],
  ['sheet', sheetContract],
  ['popover', popoverContract],
  ['tooltip', tooltipContract],
  ['avatar', avatarContract],
  ['badge', badgeContract],
  ['checkbox', checkboxContract],
  ['radio-group', radioGroupContract],
  ['switch', switchContract],
  ['slider', sliderContract],
  ['progress', progressContract],
  ['skeleton', skeletonContract],
  ['scroll-area', scrollAreaContract],
  ['separator', separatorContract],
  ['calendar', calendarContract],
  ['date-picker', datePickerContract],
  ['combobox', comboboxContract],
  ['command', commandContract],
  ['context-menu', contextMenuContract],
  ['menubar', menubarContract],
  ['pagination', paginationContract],
  ['breadcrumb', breadcrumbContract],
  ['carousel', carouselContract],
  ['hover-card', hoverCardContract],
  ['drawer', drawerContract],
  ['alert-dialog', alertDialogContract],
  ['collapsible', collapsibleContract],
  ['aspect-ratio', aspectRatioContract],
  ['toggle', toggleContract],
  ['toggle-group', toggleGroupContract],
  ['textarea', textareaContract],
  ['label', labelContract],
  ['input-otp', inputOtpContract],
  ['resizable', resizableContract],
  ['chart', chartContract],
  ['data-table', dataTableContract],
  ['sonner', sonnerContract],
]);
```

**파일**: `packages/contracts/src/definitions/button.ts`

```typescript
import { ComponentContract } from '../schema/contract';

export const buttonContract: ComponentContract = {
  component: 'button',
  version: '0.1.0',
  category: 'form',
  constraints: [
    // Accessibility
    {
      id: 'BTN-A01',
      severity: 'error',
      description: 'Icon-only 버튼에 접근성 레이블 필수',
      rule: {
        type: 'accessibility',
        require: ['aria-label'],
        wcagLevel: 'A'
      },
      message: 'Icon-only 버튼에는 aria-label이 필요합니다.',
      autoFixable: true,
      fixSuggestion: 'aria-label="버튼 설명"을 추가하세요.'
    },
    {
      id: 'BTN-A02',
      severity: 'warning',
      description: 'disabled 상태에서 aria-disabled 사용 권장',
      rule: {
        type: 'prop-combination',
        required: [
          { condition: { disabled: true }, requires: ['aria-disabled'] }
        ]
      },
      message: 'disabled 대신 aria-disabled를 사용하면 스크린 리더 사용자에게 더 나은 경험을 제공합니다.',
      autoFixable: true
    },
    
    // Variant combinations
    {
      id: 'BTN-V01',
      severity: 'error',
      description: 'Icon-only destructive 버튼 금지',
      rule: {
        type: 'prop-combination',
        forbidden: [
          {
            props: { variant: 'destructive', children: '$$icon-only$$' },
            reason: '의도 파악이 어려워 위험한 작업을 실수로 트리거할 수 있음'
          }
        ]
      },
      message: 'Destructive 버튼에는 반드시 텍스트 레이블을 포함하세요.',
      autoFixable: false
    },
    {
      id: 'BTN-V02',
      severity: 'warning',
      description: 'Ghost variant와 destructive 조합 자제',
      rule: {
        type: 'prop-combination',
        forbidden: [
          {
            props: { variant: 'ghost', className: '$$contains:text-destructive$$' },
            reason: 'Ghost의 낮은 시각적 강조와 destructive의 높은 중요도가 충돌'
          }
        ]
      },
      message: 'Destructive 액션에는 variant="destructive"를 사용하세요.',
      autoFixable: true,
      fixSuggestion: 'variant="destructive"로 변경'
    },
    
    // Context rules
    {
      id: 'BTN-C01',
      severity: 'warning',
      description: 'Form 내부 버튼에 type 명시 권장',
      rule: {
        type: 'context',
        allowedIn: ['form']
      },
      message: 'Form 내부 버튼에는 type="button" 또는 type="submit"을 명시하세요.',
      autoFixable: true,
      fixSuggestion: 'type="submit" 또는 type="button" 추가'
    },
    {
      id: 'BTN-C02',
      severity: 'error',
      description: 'Dialog footer에 primary 버튼 2개 이상 금지',
      rule: {
        type: 'context',
        forbiddenIn: ['$$dialog-footer-with-multiple-primary$$']
      },
      message: 'Dialog footer에는 primary 버튼을 1개만 사용하세요.',
      autoFixable: false
    },
    
    // State rules
    {
      id: 'BTN-S01',
      severity: 'info',
      description: '비동기 작업 버튼에 loading 상태 권장',
      rule: {
        type: 'state',
        requiredStates: ['loading']
      },
      message: '비동기 작업을 트리거하는 버튼에는 loading 상태를 표시하세요.',
      autoFixable: false
    },
    
    // Size consistency
    {
      id: 'BTN-Z01',
      severity: 'warning',
      description: '버튼 그룹 내 일관된 size 사용',
      rule: {
        type: 'composition',
        requiredSiblings: ['$$same-size-buttons$$']
      },
      message: '인접한 버튼들은 동일한 size를 사용하세요.',
      autoFixable: true
    }
  ],
  bestPractices: [
    {
      id: 'BTN-BP01',
      description: '명확한 액션 동사 사용',
      recommendation: '"확인" 대신 "저장하기", "삭제하기" 등 구체적인 동사를 사용하세요.'
    },
    {
      id: 'BTN-BP02',
      description: '버튼 텍스트 길이 제한',
      recommendation: '버튼 텍스트는 2-4 단어로 유지하세요.'
    }
  ]
};
```

**파일**: `packages/contracts/src/definitions/form.ts`

```typescript
import { ComponentContract } from '../schema/contract';

export const formContract: ComponentContract = {
  component: 'form',
  version: '0.1.0',
  category: 'form',
  constraints: [
    // Structure
    {
      id: 'FRM-S01',
      severity: 'error',
      description: 'Form은 최소 하나의 submit 버튼 필요',
      rule: {
        type: 'children',
        minCount: { selector: 'Button[type="submit"]', count: 1 }
      },
      message: 'Form에는 type="submit"인 버튼이 필요합니다.',
      autoFixable: false
    },
    {
      id: 'FRM-S02',
      severity: 'warning',
      description: 'FormField 사용 권장',
      rule: {
        type: 'children',
        required: ['FormField']
      },
      message: '일관된 폼 구조를 위해 FormField 컴포넌트를 사용하세요.',
      autoFixable: false
    },
    
    // Accessibility
    {
      id: 'FRM-A01',
      severity: 'error',
      description: 'Form에 aria-label 또는 aria-labelledby 필수',
      rule: {
        type: 'accessibility',
        require: ['aria-label', 'aria-labelledby'],
        wcagLevel: 'A'
      },
      message: 'Form에는 접근성 레이블이 필요합니다.',
      autoFixable: true
    },
    {
      id: 'FRM-A02',
      severity: 'warning',
      description: '필수 필드 표시',
      rule: {
        type: 'prop-combination',
        required: [
          { condition: { required: true }, requires: ['aria-required'] }
        ]
      },
      message: '필수 필드는 시각적으로도 표시하세요.',
      autoFixable: true
    },
    
    // Validation
    {
      id: 'FRM-V01',
      severity: 'warning',
      description: '에러 메시지 영역 준비',
      rule: {
        type: 'children',
        required: ['FormMessage']
      },
      message: '유효성 검사 에러를 표시할 FormMessage를 포함하세요.',
      autoFixable: true
    },
    {
      id: 'FRM-V02',
      severity: 'info',
      description: '실시간 유효성 검사 권장',
      rule: {
        type: 'state',
        requiredStates: ['error']
      },
      message: '필드 이탈(blur) 시 유효성 검사를 실행하세요.',
      autoFixable: false
    },
    
    // Layout
    {
      id: 'FRM-L01',
      severity: 'warning',
      description: '폼 필드 간격 일관성',
      rule: {
        type: 'composition',
        requiredSiblings: ['$$consistent-spacing$$']
      },
      message: '폼 필드 간격으로 space-y-4 이상을 권장합니다.',
      autoFixable: true,
      fixSuggestion: 'className="space-y-6" 추가'
    }
  ],
  bestPractices: [
    {
      id: 'FRM-BP01',
      description: '논리적 필드 그룹핑',
      recommendation: '관련 필드들을 fieldset으로 그룹화하세요.'
    },
    {
      id: 'FRM-BP02',
      description: '진행 상황 표시',
      recommendation: '긴 폼은 단계별로 나누고 진행률을 표시하세요.'
    },
    {
      id: 'FRM-BP03',
      description: '자동 저장',
      recommendation: '중요한 폼은 자동 저장 기능을 고려하세요.'
    }
  ]
};
```

**파일**: `packages/contracts/src/definitions/dialog.ts`

```typescript
import { ComponentContract } from '../schema/contract';

export const dialogContract: ComponentContract = {
  component: 'dialog',
  version: '0.1.0',
  category: 'feedback',
  constraints: [
    // Structure
    {
      id: 'DLG-S01',
      severity: 'error',
      description: 'DialogContent 필수',
      rule: {
        type: 'children',
        required: ['DialogContent']
      },
      message: 'Dialog에는 DialogContent가 필요합니다.',
      autoFixable: false
    },
    {
      id: 'DLG-S02',
      severity: 'warning',
      description: 'DialogHeader 권장',
      rule: {
        type: 'children',
        required: ['DialogHeader']
      },
      message: 'Dialog에는 DialogHeader를 포함하세요.',
      autoFixable: true
    },
    {
      id: 'DLG-S03',
      severity: 'error',
      description: 'DialogTitle 필수',
      rule: {
        type: 'children',
        required: ['DialogTitle']
      },
      message: 'Dialog에는 DialogTitle이 필요합니다 (접근성).',
      autoFixable: true
    },
    
    // Footer rules
    {
      id: 'DLG-F01',
      severity: 'error',
      description: 'Footer에 primary CTA 1개 제한',
      rule: {
        type: 'children',
        maxCount: { selector: 'DialogFooter Button[variant="default"]', count: 1 }
      },
      message: 'Dialog footer에는 primary 버튼을 1개만 사용하세요.',
      autoFixable: false
    },
    {
      id: 'DLG-F02',
      severity: 'warning',
      description: 'Cancel 버튼 우선 배치',
      rule: {
        type: 'children',
        order: ['Button[variant="outline"]', 'Button[variant="default"]']
      },
      message: 'Cancel 버튼을 왼쪽에, Confirm 버튼을 오른쪽에 배치하세요.',
      autoFixable: true
    },
    
    // Accessibility
    {
      id: 'DLG-A01',
      severity: 'error',
      description: 'Dialog 접근성 레이블',
      rule: {
        type: 'accessibility',
        require: ['aria-labelledby', 'aria-describedby'],
        wcagLevel: 'A'
      },
      message: 'Dialog에는 aria-labelledby와 aria-describedby가 필요합니다.',
      autoFixable: true
    },
    {
      id: 'DLG-A02',
      severity: 'warning',
      description: 'DialogDescription 권장',
      rule: {
        type: 'children',
        required: ['DialogDescription']
      },
      message: '스크린 리더 사용자를 위해 DialogDescription을 추가하세요.',
      autoFixable: true
    },
    
    // Behavior
    {
      id: 'DLG-B01',
      severity: 'warning',
      description: 'Escape로 닫기 지원',
      rule: {
        type: 'prop-combination',
        forbidden: [
          { props: { onEscapeKeyDown: '$$prevented$$' }, reason: '사용자가 예상하는 동작' }
        ]
      },
      message: 'Escape 키로 Dialog를 닫을 수 있어야 합니다.',
      autoFixable: false
    },
    {
      id: 'DLG-B02',
      severity: 'info',
      description: '포커스 트랩',
      rule: {
        type: 'state',
        requiredStates: ['$$focus-trapped$$']
      },
      message: 'Dialog가 열려 있는 동안 포커스가 Dialog 내부에 유지되어야 합니다.',
      autoFixable: false
    }
  ],
  bestPractices: [
    {
      id: 'DLG-BP01',
      description: '모달 크기 제한',
      recommendation: 'Dialog는 뷰포트의 90% 이하로 유지하세요.'
    },
    {
      id: 'DLG-BP02',
      description: 'Destructive 작업 확인',
      recommendation: '삭제 등 되돌릴 수 없는 작업에는 AlertDialog를 사용하세요.'
    }
  ]
};
```

**파일**: `packages/contracts/src/definitions/data-table.ts`

```typescript
import { ComponentContract } from '../schema/contract';

export const dataTableContract: ComponentContract = {
  component: 'data-table',
  version: '0.1.0',
  category: 'data-display',
  constraints: [
    // Structure
    {
      id: 'TBL-S01',
      severity: 'error',
      description: 'TableHeader 필수',
      rule: {
        type: 'children',
        required: ['TableHeader']
      },
      message: 'Table에는 TableHeader가 필요합니다.',
      autoFixable: false
    },
    {
      id: 'TBL-S02',
      severity: 'warning',
      description: 'TableCaption 권장 (접근성)',
      rule: {
        type: 'children',
        required: ['TableCaption']
      },
      message: '스크린 리더 사용자를 위해 TableCaption을 추가하세요.',
      autoFixable: true
    },
    
    // State handling
    {
      id: 'TBL-ST01',
      severity: 'error',
      description: 'Empty state 필수',
      rule: {
        type: 'state',
        requiredStates: ['empty']
      },
      message: '데이터가 없을 때 표시할 Empty state를 구현하세요.',
      autoFixable: false
    },
    {
      id: 'TBL-ST02',
      severity: 'warning',
      description: 'Loading state 권장',
      rule: {
        type: 'state',
        requiredStates: ['loading']
      },
      message: '데이터 로딩 중 Skeleton 또는 로딩 인디케이터를 표시하세요.',
      autoFixable: false
    },
    {
      id: 'TBL-ST03',
      severity: 'warning',
      description: 'Error state 권장',
      rule: {
        type: 'state',
        requiredStates: ['error']
      },
      message: '데이터 로드 실패 시 에러 메시지와 재시도 버튼을 표시하세요.',
      autoFixable: false
    },
    
    // Accessibility
    {
      id: 'TBL-A01',
      severity: 'error',
      description: '정렬 가능한 컬럼에 aria-sort 필수',
      rule: {
        type: 'accessibility',
        require: ['aria-sort'],
        wcagLevel: 'A'
      },
      message: '정렬 가능한 컬럼 헤더에 aria-sort를 추가하세요.',
      autoFixable: true
    },
    {
      id: 'TBL-A02',
      severity: 'warning',
      description: '행 선택 시 접근성 표시',
      rule: {
        type: 'accessibility',
        require: ['aria-selected'],
        wcagLevel: 'AA'
      },
      message: '선택된 행에 aria-selected="true"를 적용하세요.',
      autoFixable: true
    },
    
    // Interaction
    {
      id: 'TBL-I01',
      severity: 'info',
      description: '키보드 내비게이션',
      rule: {
        type: 'prop-combination',
        required: [
          { condition: { selectable: true }, requires: ['onKeyDown'] }
        ]
      },
      message: '테이블 행을 키보드로 탐색할 수 있게 하세요.',
      autoFixable: false
    },
    {
      id: 'TBL-I02',
      severity: 'warning',
      description: 'Pagination 일관성',
      rule: {
        type: 'composition',
        requiredSiblings: ['Pagination']
      },
      message: '많은 데이터에는 Pagination을 함께 사용하세요.',
      autoFixable: false
    },
    
    // Performance
    {
      id: 'TBL-P01',
      severity: 'info',
      description: '가상화 권장 (대량 데이터)',
      rule: {
        type: 'state',
        requiredStates: ['$$virtualized$$']
      },
      message: '100행 이상의 데이터에는 가상 스크롤을 고려하세요.',
      autoFixable: false
    }
  ],
  bestPractices: [
    {
      id: 'TBL-BP01',
      description: '반응형 테이블',
      recommendation: '모바일에서는 카드 레이아웃으로 전환하거나 수평 스크롤을 제공하세요.'
    },
    {
      id: 'TBL-BP02',
      description: '일괄 작업',
      recommendation: '다중 선택 시 Bulk actions 툴바를 제공하세요.'
    },
    {
      id: 'TBL-BP03',
      description: '컬럼 커스터마이징',
      recommendation: '사용자가 컬럼 표시/숨김을 설정할 수 있게 하세요.'
    }
  ]
};
```

#### A3-3. Layout Policies

**파일**: `packages/contracts/src/policies/layout.ts`

```typescript
export interface LayoutPolicy {
  id: string;
  severity: 'error' | 'warning' | 'info';
  description: string;
  detector: PolicyDetector;
  message: string;
}

export type PolicyDetector = 
  | TailwindClassDetector
  | SpacingDetector
  | ContainerDetector;

export const layoutPolicies: LayoutPolicy[] = [
  // 섹션 간격
  {
    id: 'LAY-001',
    severity: 'warning',
    description: '섹션 간 최소 간격 권장',
    detector: {
      type: 'spacing',
      context: 'section-gap',
      minimum: { class: 'gap-y-6', value: 24 },
      recommended: { class: 'gap-y-8', value: 32 }
    },
    message: '섹션 간격이 너무 좁습니다. gap-y-6 이상을 권장합니다.'
  },
  
  // 폼 필드 간격
  {
    id: 'LAY-002',
    severity: 'warning',
    description: '폼 필드 간 최소 간격',
    detector: {
      type: 'spacing',
      context: 'form-field-gap',
      minimum: { class: 'space-y-4', value: 16 },
      recommended: { class: 'space-y-6', value: 24 }
    },
    message: '폼 필드 간격을 space-y-4 이상으로 설정하세요.'
  },
  
  // 컨테이너 폭
  {
    id: 'LAY-003',
    severity: 'info',
    description: '페이지 컨테이너 최대 폭 권장',
    detector: {
      type: 'container',
      pattern: 'max-w-*',
      recommended: ['max-w-4xl', 'max-w-5xl', 'max-w-6xl', 'max-w-7xl']
    },
    message: '페이지 컨테이너에 max-w-* 클래스 사용을 권장합니다.'
  },
  
  // CTA 개수 제한
  {
    id: 'LAY-004',
    severity: 'warning',
    description: '단일 뷰에서 primary CTA 개수 제한',
    detector: {
      type: 'tailwind-class',
      context: 'view',
      selector: 'Button[variant="default"]',
      maxCount: 2
    },
    message: '하나의 뷰에 primary 버튼이 2개를 초과합니다.'
  },
  
  // Card 내부 패딩
  {
    id: 'LAY-005',
    severity: 'info',
    description: 'Card 내부 패딩 일관성',
    detector: {
      type: 'spacing',
      context: 'card-padding',
      recommended: { class: 'p-6', value: 24 }
    },
    message: 'Card 내부 패딩으로 p-6을 권장합니다.'
  },
  
  // 버튼 그룹 간격
  {
    id: 'LAY-006',
    severity: 'warning',
    description: '버튼 그룹 간격',
    detector: {
      type: 'spacing',
      context: 'button-group',
      minimum: { class: 'gap-2', value: 8 },
      recommended: { class: 'gap-3', value: 12 }
    },
    message: '버튼 그룹 간격으로 gap-2 이상을 사용하세요.'
  }
];
```

#### A3-4. Contract Registry

**파일**: `packages/contracts/src/registry.ts`

```typescript
import { ComponentContract } from './schema/contract';
import { LayoutPolicy } from './policies/layout';
import { buttonContract } from './definitions/button';
import { dialogContract } from './definitions/dialog';
import { inputContract } from './definitions/input';
import { layoutPolicies } from './policies/layout';

export interface ContractRegistry {
  version: string;
  contracts: Map<string, ComponentContract>;
  policies: LayoutPolicy[];
}

export function createRegistry(): ContractRegistry {
  const contracts = new Map<string, ComponentContract>();
  
  // 컴포넌트 contracts 등록
  [buttonContract, dialogContract, inputContract].forEach(c => {
    contracts.set(c.component, c);
  });
  
  return {
    version: '0.1.0',
    contracts,
    policies: layoutPolicies
  };
}

export function getConstraintsForComponent(
  registry: ContractRegistry,
  component: string
): Constraint[] {
  return registry.contracts.get(component)?.constraints || [];
}
```

#### 성공 기준
- [ ] 8개 이상의 컴포넌트 contract 정의 완료
- [ ] 6개 이상의 layout policy 정의 완료
- [ ] 각 constraint에 고유 ID 부여
- [ ] 모든 constraint가 명확한 detection 로직 보유

#### 테스트 방법
```typescript
// packages/contracts/src/__tests__/registry.test.ts
describe('Contract Registry', () => {
  const registry = createRegistry();
  
  it('has all required component contracts', () => {
    const required = ['button', 'input', 'dialog', 'card', 'tabs'];
    required.forEach(comp => {
      expect(registry.contracts.has(comp)).toBe(true);
    });
  });
  
  it('all constraints have unique IDs', () => {
    const allIds = new Set<string>();
    registry.contracts.forEach(contract => {
      contract.constraints.forEach(c => {
        expect(allIds.has(c.id)).toBe(false);
        allIds.add(c.id);
      });
    });
  });
});
```

---

## Phase B: IDE Bootstrap + 연결/초기화

### B1. IDE 커맨드 정의

#### 목표
VS Code Extension에서 "딸깍 한 번"으로 전체 설정 완료

#### B1-1. 커맨드 스키마

**파일**: `packages/vscode-extension/src/commands/index.ts`

```typescript
export interface CommandDefinition {
  id: string;
  title: string;
  category: string;
  handler: () => Promise<void>;
}

export const commands: CommandDefinition[] = [
  {
    id: 'figmarchitect.setup',
    title: 'Setup Design System',
    category: 'Design',
    handler: handleSetup
  },
  {
    id: 'figmarchitect.bootstrap',
    title: 'Bootstrap shadcn',
    category: 'Design',
    handler: handleBootstrap
  },
  {
    id: 'figmarchitect.verify',
    title: 'Verify Components',
    category: 'Design',
    handler: handleVerify
  },
  {
    id: 'figmarchitect.fix',
    title: 'Fix Violations',
    category: 'Design',
    handler: handleFix
  },
  {
    id: 'figmarchitect.createScreen',
    title: 'Create Screen (Agentic)',
    category: 'Design',
    handler: handleCreateScreen
  }
];
```

#### B1-2. Setup 커맨드 구현

**파일**: `packages/vscode-extension/src/commands/setup.ts`

```typescript
import * as vscode from 'vscode';
import { TokenQuestionnaire } from '@figmarchitect/token-generator';

export async function handleSetup(): Promise<void> {
  // Step 1: 프리셋 선택
  const preset = await vscode.window.showQuickPick(
    [
      { label: 'Next.js + Tailwind + shadcn', value: 'next-tailwind-shadcn' }
    ],
    { placeHolder: 'Select a preset' }
  );
  
  if (!preset) return;
  
  // Step 2: Token Q&A
  const questionnaire = await runTokenQA();
  if (!questionnaire) return;
  
  // Step 3: 설정 저장
  await saveConfig({ preset: preset.value, questionnaire });
  
  // Step 4: Bootstrap 제안
  const shouldBootstrap = await vscode.window.showInformationMessage(
    'Setup complete! Would you like to install dependencies now?',
    'Yes', 'Later'
  );
  
  if (shouldBootstrap === 'Yes') {
    await vscode.commands.executeCommand('figmarchitect.bootstrap');
  }
}

async function runTokenQA(): Promise<TokenQuestionnaire | undefined> {
  const result: Partial<TokenQuestionnaire> = {};
  
  // Q1: Brand tone
  const tone = await vscode.window.showQuickPick(
    ['minimal', 'neutral', 'playful', 'serious', 'luxury'],
    { placeHolder: 'Select brand tone' }
  );
  if (!tone) return;
  result.brandTone = tone as TokenQuestionnaire['brandTone'];
  
  // Q2: Contrast
  const contrast = await vscode.window.showQuickPick(
    ['standard', 'high'],
    { placeHolder: 'Select contrast level' }
  );
  if (!contrast) return;
  result.contrast = contrast as TokenQuestionnaire['contrast'];
  
  // Q3-7: 나머지 질문들...
  // (동일 패턴으로 구현)
  
  return result as TokenQuestionnaire;
}
```

### B2. Stack 감지 & Bootstrap 플로우

#### B2-1. Stack Detector

**파일**: `packages/bootstrap/src/detector.ts`

```typescript
import * as fs from 'fs/promises';
import * as path from 'path';

export interface DetectedStack {
  framework: {
    type: 'nextjs' | 'vite' | 'remix' | 'unknown';
    version?: string;
    router?: 'app' | 'pages';
  };
  tailwind: {
    installed: boolean;
    version?: string;
    configPath?: string;
  };
  typescript: {
    enabled: boolean;
    version?: string;
  };
  shadcn: {
    initialized: boolean;
    configPath?: string;
    installedComponents: string[];
  };
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
}

export async function detectStack(projectRoot: string): Promise<DetectedStack> {
  const pkg = await readPackageJson(projectRoot);
  
  return {
    framework: await detectFramework(projectRoot, pkg),
    tailwind: await detectTailwind(projectRoot, pkg),
    typescript: await detectTypescript(projectRoot, pkg),
    shadcn: await detectShadcn(projectRoot),
    packageManager: await detectPackageManager(projectRoot)
  };
}

async function detectFramework(root: string, pkg: PackageJson) {
  // next.js 감지
  if (pkg.dependencies?.next || pkg.devDependencies?.next) {
    const version = pkg.dependencies?.next || pkg.devDependencies?.next;
    
    // App Router vs Pages Router 감지
    const hasAppDir = await pathExists(path.join(root, 'app'));
    const hasPagesDir = await pathExists(path.join(root, 'pages'));
    
    return {
      type: 'nextjs' as const,
      version,
      router: hasAppDir ? 'app' as const : hasPagesDir ? 'pages' as const : undefined
    };
  }
  
  // vite 감지
  if (pkg.devDependencies?.vite) {
    return { type: 'vite' as const, version: pkg.devDependencies.vite };
  }
  
  return { type: 'unknown' as const };
}

async function detectShadcn(root: string) {
  const configPath = path.join(root, 'components.json');
  const exists = await pathExists(configPath);
  
  if (!exists) {
    return { initialized: false, installedComponents: [] };
  }
  
  const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
  const uiDir = path.join(root, config.aliases?.components || 'components', 'ui');
  
  const installedComponents = await listInstalledComponents(uiDir);
  
  return {
    initialized: true,
    configPath,
    installedComponents
  };
}
```

#### B2-2. Bootstrap Executor

**파일**: `packages/bootstrap/src/executor.ts`

```typescript
import { DetectedStack } from './detector';
import { Preset } from '@figmarchitect/preset';
import { execSync } from 'child_process';

export interface BootstrapResult {
  success: boolean;
  steps: StepResult[];
  rollbackData?: RollbackData;
}

export interface StepResult {
  step: string;
  status: 'success' | 'skipped' | 'failed';
  message?: string;
}

export async function executeBootstrap(
  projectRoot: string,
  stack: DetectedStack,
  preset: Preset,
  tokens: GeneratedTokens
): Promise<BootstrapResult> {
  const steps: StepResult[] = [];
  const rollback = new RollbackCollector();
  
  try {
    // Step 1: Git clean 상태 확인
    await ensureGitClean(projectRoot);
    
    // Step 2: 의존성 설치
    const depsResult = await installDependencies(projectRoot, stack, preset, rollback);
    steps.push(depsResult);
    if (depsResult.status === 'failed') throw new Error(depsResult.message);
    
    // Step 3: shadcn 초기화
    const shadcnResult = await initShadcn(projectRoot, stack, rollback);
    steps.push(shadcnResult);
    if (shadcnResult.status === 'failed') throw new Error(shadcnResult.message);
    
    // Step 4: 컴포넌트 설치
    const componentsResult = await installComponents(
      projectRoot, 
      stack, 
      preset.componentWhitelist,
      rollback
    );
    steps.push(componentsResult);
    
    // Step 5: 토큰 적용
    const tokensResult = await applyTokens(projectRoot, tokens, rollback);
    steps.push(tokensResult);
    if (tokensResult.status === 'failed') throw new Error(tokensResult.message);
    
    // Step 6: Tailwind 설정 보정
    const tailwindResult = await configureTailwind(projectRoot, stack, rollback);
    steps.push(tailwindResult);
    
    // Step 7: utils.ts 보장
    const utilsResult = await ensureUtils(projectRoot, rollback);
    steps.push(utilsResult);
    
    return { success: true, steps };
    
  } catch (error) {
    // 롤백 실행
    await rollback.execute();
    return {
      success: false,
      steps,
      rollbackData: rollback.getData()
    };
  }
}

async function installDependencies(
  root: string,
  stack: DetectedStack,
  preset: Preset,
  rollback: RollbackCollector
): Promise<StepResult> {
  const pm = stack.packageManager;
  const installCmd = {
    npm: 'npm install',
    yarn: 'yarn add',
    pnpm: 'pnpm add',
    bun: 'bun add'
  }[pm];
  
  const deps = Object.entries(preset.dependencies.required)
    .map(([name, version]) => `${name}@${version}`)
    .join(' ');
  
  const devDeps = Object.entries(preset.dependencies.devDependencies)
    .map(([name, version]) => `${name}@${version}`)
    .join(' ');
  
  try {
    // 이전 package.json 백업
    const pkgPath = path.join(root, 'package.json');
    rollback.addFileBackup(pkgPath);
    
    execSync(`${installCmd} ${deps}`, { cwd: root, stdio: 'pipe' });
    execSync(`${installCmd} -D ${devDeps}`, { cwd: root, stdio: 'pipe' });
    
    return { step: 'install-dependencies', status: 'success' };
  } catch (error) {
    return { 
      step: 'install-dependencies', 
      status: 'failed',
      message: `Failed to install dependencies: ${error.message}`
    };
  }
}

async function initShadcn(
  root: string,
  stack: DetectedStack,
  rollback: RollbackCollector
): Promise<StepResult> {
  if (stack.shadcn.initialized) {
    return { step: 'init-shadcn', status: 'skipped', message: 'Already initialized' };
  }
  
  try {
    // components.json 생성될 것이므로 롤백에 추가
    rollback.addFileCreation(path.join(root, 'components.json'));
    
    const initCmd = stack.packageManager === 'npm'
      ? 'npx shadcn@latest init -y'
      : `${stack.packageManager} dlx shadcn@latest init -y`;
    
    execSync(initCmd, { cwd: root, stdio: 'pipe' });
    
    return { step: 'init-shadcn', status: 'success' };
  } catch (error) {
    return {
      step: 'init-shadcn',
      status: 'failed',
      message: `Failed to initialize shadcn: ${error.message}`
    };
  }
}

async function installComponents(
  root: string,
  stack: DetectedStack,
  whitelist: string[],
  rollback: RollbackCollector
): Promise<StepResult> {
  const installed = new Set(stack.shadcn.installedComponents);
  const toInstall = whitelist.filter(c => !installed.has(c));
  
  if (toInstall.length === 0) {
    return { step: 'install-components', status: 'skipped', message: 'All components installed' };
  }
  
  try {
    const addCmd = stack.packageManager === 'npm'
      ? 'npx shadcn@latest add'
      : `${stack.packageManager} dlx shadcn@latest add`;
    
    execSync(`${addCmd} ${toInstall.join(' ')} -y`, { cwd: root, stdio: 'pipe' });
    
    return { 
      step: 'install-components', 
      status: 'success',
      message: `Installed: ${toInstall.join(', ')}`
    };
  } catch (error) {
    return {
      step: 'install-components',
      status: 'failed',
      message: `Failed to install components: ${error.message}`
    };
  }
}

async function applyTokens(
  root: string,
  tokens: GeneratedTokens,
  rollback: RollbackCollector
): Promise<StepResult> {
  try {
    // tokens.css 생성
    const tokensPath = path.join(root, 'styles', 'tokens.css');
    await fs.mkdir(path.dirname(tokensPath), { recursive: true });
    rollback.addFileCreation(tokensPath);
    await fs.writeFile(tokensPath, tokens.cssVariables);
    
    // tokens.json 생성
    const jsonPath = path.join(root, 'design', 'tokens.json');
    await fs.mkdir(path.dirname(jsonPath), { recursive: true });
    rollback.addFileCreation(jsonPath);
    await fs.writeFile(jsonPath, JSON.stringify(tokens.tokensJson, null, 2));
    
    // globals.css에 import 추가
    await injectTokensImport(root, rollback);
    
    return { step: 'apply-tokens', status: 'success' };
  } catch (error) {
    return {
      step: 'apply-tokens',
      status: 'failed',
      message: `Failed to apply tokens: ${error.message}`
    };
  }
}
```

### B3. 로컬 캐시 & 프로젝트 설정

#### B3-1. 캐시 구조

**파일**: `packages/cache/src/manager.ts`

```typescript
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs/promises';

export interface CacheManager {
  getPreset(id: string, version: string): Promise<Preset | null>;
  setPreset(preset: Preset): Promise<void>;
  getContracts(version: string): Promise<ContractRegistry | null>;
  setContracts(registry: ContractRegistry): Promise<void>;
}

const CACHE_DIR = path.join(os.homedir(), '.design-ai');

export function createCacheManager(): CacheManager {
  return {
    async getPreset(id, version) {
      const cachePath = path.join(CACHE_DIR, 'presets', `${id}@${version}`, 'preset.json');
      try {
        const data = await fs.readFile(cachePath, 'utf-8');
        return JSON.parse(data);
      } catch {
        return null;
      }
    },
    
    async setPreset(preset) {
      const cachePath = path.join(CACHE_DIR, 'presets', `${preset.id}@${preset.version}`);
      await fs.mkdir(cachePath, { recursive: true });
      await fs.writeFile(
        path.join(cachePath, 'preset.json'),
        JSON.stringify(preset, null, 2)
      );
    },
    
    // ... contracts 메서드들
  };
}
```

#### B3-2. 프로젝트 설정 파일

**파일**: `.designairc` (프로젝트 루트에 생성)

```typescript
export interface ProjectConfig {
  version: string;
  preset: {
    id: string;
    version: string;
  };
  tokens: {
    seed: TokenQuestionnaire;
    generated: string; // ISO timestamp
  };
  contracts: {
    version: string;
  };
  componentWhitelist: string[];
}

// 예시 .designairc
const exampleConfig: ProjectConfig = {
  version: '0.1.0',
  preset: {
    id: 'next-tailwind-shadcn',
    version: '0.1.0'
  },
  tokens: {
    seed: {
      brandTone: 'neutral',
      contrast: 'standard',
      density: 'comfortable',
      borderRadius: 'md',
      primaryColor: { type: 'preset', value: 'blue' },
      neutralTone: 'gray',
      fontScale: 'default'
    },
    generated: '2024-01-15T10:30:00Z'
  },
  contracts: {
    version: '0.1.0'
  },
  componentWhitelist: [
    'button', 'input', 'card', 'dialog', 
    'tabs', 'dropdown-menu', 'alert', 'toast'
  ]
};
```

### B4. Create Screen 준비 (Production-Ready)

#### 목표
Phase C의 제약 기반 화면 생성을 위한 확장 가능한 Screen Type 시스템 준비

> **프로덕션 레벨 고려사항**: 실제 앱에는 기본 CRUD 외에 도메인별 특화 화면이 필요함. 확장 가능한 구조로 설계하여 점진적으로 Screen Type을 추가할 수 있어야 함.

#### B4-1. Screen Type 체계

**파일**: `packages/screen-types/src/types/index.ts`

```typescript
// ============================================
// SCREEN TYPE TAXONOMY
// ============================================

/**
 * Screen Type은 3-level 계층 구조:
 * Category > Type > Variant
 * 
 * 예: crud > list > data-table
 *     commerce > checkout > multi-step
 */

export type ScreenCategory = 
  | 'crud'        // 기본 데이터 관리
  | 'auth'        // 인증/인가
  | 'commerce'    // 전자상거래
  | 'dashboard'   // 대시보드/분석
  | 'content'     // 콘텐츠 관리
  | 'social'      // 소셜/커뮤니티
  | 'settings'    // 설정/관리
  | 'onboarding'  // 온보딩/가이드
  | 'utility'     // 유틸리티 화면
  | 'custom';     // 커스텀

// ============================================
// CRUD SCREENS (기본 데이터 관리)
// ============================================

export interface CrudScreenTypes {
  // List screens
  'list-table': {
    description: '테이블 기반 데이터 목록';
    features: ['pagination', 'sorting', 'filtering', 'bulk-actions'];
    components: ['data-table', 'pagination', 'input', 'select', 'checkbox', 'button', 'dropdown-menu'];
  };
  'list-cards': {
    description: '카드 그리드 형태의 목록';
    features: ['pagination', 'filtering', 'view-toggle'];
    components: ['card', 'pagination', 'input', 'select', 'toggle-group'];
  };
  'list-kanban': {
    description: '칸반 보드 형태';
    features: ['drag-drop', 'columns', 'cards'];
    components: ['card', 'scroll-area', 'badge', 'avatar'];
  };
  
  // Detail screens
  'detail-view': {
    description: '단일 엔티티 상세 보기';
    features: ['tabs', 'actions', 'related-data'];
    components: ['card', 'tabs', 'button', 'badge', 'separator', 'avatar'];
  };
  'detail-split': {
    description: '마스터-디테일 분할 뷰';
    features: ['list-panel', 'detail-panel', 'resizable'];
    components: ['resizable', 'scroll-area', 'card'];
  };
  
  // Form screens
  'form-create': {
    description: '새 엔티티 생성 폼';
    features: ['validation', 'auto-save', 'draft'];
    components: ['form', 'input', 'select', 'textarea', 'checkbox', 'button', 'label'];
  };
  'form-edit': {
    description: '기존 엔티티 수정 폼';
    features: ['validation', 'dirty-check', 'revert'];
    components: ['form', 'input', 'select', 'textarea', 'checkbox', 'button', 'label', 'alert'];
  };
  'form-wizard': {
    description: '다단계 마법사 폼';
    features: ['steps', 'validation', 'progress', 'navigation'];
    components: ['form', 'progress', 'button', 'card', 'separator'];
  };
}

// ============================================
// AUTH SCREENS (인증)
// ============================================

export interface AuthScreenTypes {
  'auth-login': {
    description: '로그인 화면';
    features: ['email-password', 'social-login', 'remember-me', 'forgot-password'];
    components: ['card', 'form', 'input', 'button', 'checkbox', 'separator', 'label'];
  };
  'auth-register': {
    description: '회원가입 화면';
    features: ['validation', 'terms', 'email-verification'];
    components: ['card', 'form', 'input', 'button', 'checkbox', 'label'];
  };
  'auth-forgot-password': {
    description: '비밀번호 찾기';
    features: ['email-input', 'success-state'];
    components: ['card', 'form', 'input', 'button', 'alert'];
  };
  'auth-reset-password': {
    description: '비밀번호 재설정';
    features: ['validation', 'strength-indicator'];
    components: ['card', 'form', 'input', 'button', 'progress'];
  };
  'auth-otp': {
    description: 'OTP 인증';
    features: ['code-input', 'resend', 'timer'];
    components: ['card', 'input-otp', 'button'];
  };
  'auth-mfa': {
    description: '2차 인증 설정';
    features: ['qr-code', 'backup-codes', 'verification'];
    components: ['card', 'input-otp', 'button', 'alert'];
  };
}

// ============================================
// COMMERCE SCREENS (전자상거래)
// ============================================

export interface CommerceScreenTypes {
  'commerce-product-list': {
    description: '상품 목록';
    features: ['filtering', 'sorting', 'view-toggle', 'wishlist'];
    components: ['card', 'badge', 'button', 'select', 'slider', 'checkbox', 'pagination'];
  };
  'commerce-product-detail': {
    description: '상품 상세';
    features: ['gallery', 'variants', 'reviews', 'add-to-cart'];
    components: ['carousel', 'tabs', 'button', 'badge', 'select', 'avatar', 'separator'];
  };
  'commerce-cart': {
    description: '장바구니';
    features: ['quantity', 'remove', 'summary', 'promo-code'];
    components: ['card', 'button', 'input', 'separator', 'badge'];
  };
  'commerce-checkout': {
    description: '결제 (단일 페이지)';
    features: ['address', 'payment', 'summary', 'validation'];
    components: ['form', 'input', 'select', 'card', 'radio-group', 'button', 'separator'];
  };
  'commerce-checkout-multi': {
    description: '결제 (다단계)';
    features: ['steps', 'address', 'shipping', 'payment', 'review'];
    components: ['form', 'input', 'select', 'card', 'radio-group', 'button', 'progress'];
  };
  'commerce-order-history': {
    description: '주문 내역';
    features: ['list', 'status', 'detail-link'];
    components: ['card', 'badge', 'button', 'pagination'];
  };
  'commerce-order-detail': {
    description: '주문 상세';
    features: ['items', 'status-timeline', 'tracking', 'actions'];
    components: ['card', 'badge', 'separator', 'button', 'progress'];
  };
}

// ============================================
// DASHBOARD SCREENS (대시보드)
// ============================================

export interface DashboardScreenTypes {
  'dashboard-overview': {
    description: '대시보드 개요';
    features: ['kpi-cards', 'charts', 'recent-activity'];
    components: ['card', 'chart', 'badge', 'avatar', 'separator'];
  };
  'dashboard-analytics': {
    description: '분석 대시보드';
    features: ['date-range', 'charts', 'drill-down', 'export'];
    components: ['card', 'chart', 'date-picker', 'select', 'button', 'tabs'];
  };
  'dashboard-reports': {
    description: '리포트 화면';
    features: ['filters', 'table', 'export', 'schedule'];
    components: ['data-table', 'date-picker', 'select', 'button', 'dialog'];
  };
  'dashboard-realtime': {
    description: '실시간 모니터링';
    features: ['live-data', 'alerts', 'status-indicators'];
    components: ['card', 'chart', 'badge', 'alert', 'progress'];
  };
}

// ============================================
// CONTENT SCREENS (콘텐츠)
// ============================================

export interface ContentScreenTypes {
  'content-article': {
    description: '아티클/블로그 포스트';
    features: ['reading-time', 'author', 'toc', 'share'];
    components: ['card', 'avatar', 'badge', 'separator', 'button'];
  };
  'content-gallery': {
    description: '이미지/미디어 갤러리';
    features: ['grid', 'lightbox', 'filtering'];
    components: ['card', 'dialog', 'aspect-ratio', 'button'];
  };
  'content-documentation': {
    description: '문서/도움말';
    features: ['sidebar-nav', 'search', 'toc', 'code-blocks'];
    components: ['scroll-area', 'accordion', 'input', 'navigation-menu'];
  };
  'content-feed': {
    description: '피드/타임라인';
    features: ['infinite-scroll', 'reactions', 'comments'];
    components: ['card', 'avatar', 'button', 'textarea', 'separator'];
  };
}

// ============================================
// SOCIAL SCREENS (소셜)
// ============================================

export interface SocialScreenTypes {
  'social-profile': {
    description: '사용자 프로필';
    features: ['avatar', 'bio', 'stats', 'activity'];
    components: ['avatar', 'card', 'tabs', 'button', 'badge'];
  };
  'social-messaging': {
    description: '메시징/채팅';
    features: ['conversation-list', 'chat-window', 'typing-indicator'];
    components: ['scroll-area', 'input', 'button', 'avatar', 'separator'];
  };
  'social-notifications': {
    description: '알림 센터';
    features: ['list', 'mark-read', 'filtering'];
    components: ['card', 'avatar', 'badge', 'button', 'tabs'];
  };
}

// ============================================
// SETTINGS SCREENS (설정)
// ============================================

export interface SettingsScreenTypes {
  'settings-general': {
    description: '일반 설정';
    features: ['form', 'sections', 'save'];
    components: ['form', 'input', 'select', 'switch', 'button', 'card', 'separator'];
  };
  'settings-profile': {
    description: '프로필 설정';
    features: ['avatar-upload', 'form', 'validation'];
    components: ['form', 'input', 'textarea', 'button', 'avatar', 'card'];
  };
  'settings-security': {
    description: '보안 설정';
    features: ['password-change', 'mfa', 'sessions'];
    components: ['form', 'input', 'switch', 'button', 'card', 'alert', 'dialog'];
  };
  'settings-notifications': {
    description: '알림 설정';
    features: ['channels', 'preferences', 'toggle'];
    components: ['card', 'switch', 'checkbox', 'button', 'separator'];
  };
  'settings-billing': {
    description: '결제/구독 관리';
    features: ['plan', 'payment-method', 'invoices'];
    components: ['card', 'badge', 'button', 'dialog', 'data-table'];
  };
  'settings-team': {
    description: '팀/멤버 관리';
    features: ['member-list', 'invite', 'roles'];
    components: ['data-table', 'avatar', 'badge', 'button', 'dialog', 'select'];
  };
  'settings-integrations': {
    description: '연동 설정';
    features: ['app-list', 'connect', 'configure'];
    components: ['card', 'switch', 'button', 'dialog', 'badge'];
  };
}

// ============================================
// ONBOARDING SCREENS (온보딩)
// ============================================

export interface OnboardingScreenTypes {
  'onboarding-welcome': {
    description: '웰컴 화면';
    features: ['hero', 'value-props', 'cta'];
    components: ['card', 'button'];
  };
  'onboarding-wizard': {
    description: '설정 마법사';
    features: ['steps', 'progress', 'skip'];
    components: ['card', 'progress', 'button', 'form'];
  };
  'onboarding-tour': {
    description: '제품 투어';
    features: ['highlights', 'tooltips', 'navigation'];
    components: ['popover', 'button', 'progress'];
  };
  'onboarding-empty-state': {
    description: '빈 상태 + 가이드';
    features: ['illustration', 'cta', 'help'];
    components: ['card', 'button'];
  };
}

// ============================================
// UTILITY SCREENS (유틸리티)
// ============================================

export interface UtilityScreenTypes {
  'utility-error-404': {
    description: '404 에러';
    features: ['message', 'navigation', 'search'];
    components: ['card', 'button', 'input'];
  };
  'utility-error-500': {
    description: '서버 에러';
    features: ['message', 'retry', 'support'];
    components: ['card', 'button', 'alert'];
  };
  'utility-maintenance': {
    description: '점검 중';
    features: ['message', 'eta', 'notification'];
    components: ['card', 'progress'];
  };
  'utility-loading': {
    description: '로딩 화면';
    features: ['spinner', 'progress', 'message'];
    components: ['skeleton', 'progress'];
  };
  'utility-search-results': {
    description: '검색 결과';
    features: ['results', 'filtering', 'pagination'];
    components: ['card', 'input', 'tabs', 'pagination', 'badge'];
  };
}

// ============================================
// UNIFIED SCREEN TYPE
// ============================================

export type ScreenType = 
  | keyof CrudScreenTypes
  | keyof AuthScreenTypes
  | keyof CommerceScreenTypes
  | keyof DashboardScreenTypes
  | keyof ContentScreenTypes
  | keyof SocialScreenTypes
  | keyof SettingsScreenTypes
  | keyof OnboardingScreenTypes
  | keyof UtilityScreenTypes
  | 'custom';

export interface ScreenTypeDefinition {
  id: ScreenType;
  category: ScreenCategory;
  description: string;
  features: string[];
  requiredComponents: string[];
  optionalComponents: string[];
  suggestedLayout: 'single-column' | 'two-column' | 'three-column' | 'dashboard-grid' | 'full-width';
  constraints?: string[];  // 관련 constraint IDs
}
```

#### B4-2. Screen Creation Payload (확장)

**파일**: `packages/vscode-extension/src/commands/create-screen.ts`

```typescript
import { ScreenType, ScreenCategory } from '@figmarchitect/screen-types';

export interface ScreenCreationPayload {
  // 기본 정보
  screenType: ScreenType;
  category: ScreenCategory;
  entityName?: string;
  screenName: string;
  
  // 상세 설정
  features: string[];           // 선택된 기능들
  customDescription?: string;   // custom type인 경우
  
  // 제약 정보 (preset에서 로드)
  allowedComponents: string[];
  policySetVersion: string;
  
  // 토큰 요약
  tokensSummary: {
    primaryColor: string;
    borderRadius: string;
    density: string;
    fontScale: string;
  };
  
  // 컨텍스트
  projectContext: {
    existingScreens: string[];  // 기존 화면 목록
    entityModels: string[];     // 정의된 엔티티들
    designSystemVersion: string;
  };
}

// Screen Type 메타데이터 레지스트리
export const SCREEN_TYPE_REGISTRY: Map<ScreenType, ScreenTypeMetadata> = new Map([
  ['list-table', {
    label: '데이터 테이블',
    description: '정렬, 필터, 페이지네이션이 포함된 테이블 목록',
    category: 'crud',
    icon: 'table',
    commonFeatures: ['pagination', 'sorting', 'filtering'],
    requiredComponents: ['data-table', 'pagination', 'button'],
    complexity: 'medium'
  }],
  ['list-cards', {
    label: '카드 그리드',
    description: '카드 형태의 그리드 목록',
    category: 'crud',
    icon: 'grid',
    commonFeatures: ['pagination', 'filtering'],
    requiredComponents: ['card', 'pagination'],
    complexity: 'low'
  }],
  ['form-wizard', {
    label: '다단계 폼',
    description: '여러 단계로 나뉜 입력 폼',
    category: 'crud',
    icon: 'list-ordered',
    commonFeatures: ['steps', 'validation', 'progress'],
    requiredComponents: ['form', 'progress', 'button'],
    complexity: 'high'
  }],
  ['auth-login', {
    label: '로그인',
    description: '이메일/비밀번호 로그인 화면',
    category: 'auth',
    icon: 'log-in',
    commonFeatures: ['email-password', 'social-login'],
    requiredComponents: ['card', 'form', 'input', 'button'],
    complexity: 'low'
  }],
  ['dashboard-overview', {
    label: '대시보드 개요',
    description: 'KPI 카드와 차트가 포함된 대시보드',
    category: 'dashboard',
    icon: 'layout-dashboard',
    commonFeatures: ['kpi-cards', 'charts'],
    requiredComponents: ['card', 'chart'],
    complexity: 'high'
  }],
  ['commerce-checkout', {
    label: '결제 페이지',
    description: '배송/결제 정보 입력 및 주문 완료',
    category: 'commerce',
    icon: 'credit-card',
    commonFeatures: ['address', 'payment', 'summary'],
    requiredComponents: ['form', 'input', 'select', 'card', 'button'],
    complexity: 'high'
  }],
  ['settings-general', {
    label: '일반 설정',
    description: '기본 설정 화면',
    category: 'settings',
    icon: 'settings',
    commonFeatures: ['form', 'sections'],
    requiredComponents: ['form', 'input', 'switch', 'button', 'card'],
    complexity: 'medium'
  }],
  // ... 나머지 screen types
]);

interface ScreenTypeMetadata {
  label: string;
  description: string;
  category: ScreenCategory;
  icon: string;
  commonFeatures: string[];
  requiredComponents: string[];
  complexity: 'low' | 'medium' | 'high';
}

export async function handleCreateScreen(): Promise<void> {
  // Step 1: 프로젝트 설정 로드
  const config = await loadProjectConfig();
  if (!config) {
    vscode.window.showErrorMessage('Run "Design: Setup" first');
    return;
  }
  
  // Step 2: 카테고리 선택
  const category = await vscode.window.showQuickPick(
    [
      { label: '📋 CRUD', value: 'crud', description: '목록, 상세, 폼 화면' },
      { label: '🔐 Auth', value: 'auth', description: '로그인, 회원가입' },
      { label: '🛒 Commerce', value: 'commerce', description: '상품, 장바구니, 결제' },
      { label: '📊 Dashboard', value: 'dashboard', description: '대시보드, 분석' },
      { label: '📝 Content', value: 'content', description: '아티클, 갤러리' },
      { label: '👥 Social', value: 'social', description: '프로필, 메시징' },
      { label: '⚙️ Settings', value: 'settings', description: '설정 화면' },
      { label: '🚀 Onboarding', value: 'onboarding', description: '온보딩 플로우' },
      { label: '🔧 Utility', value: 'utility', description: '에러, 로딩 화면' },
      { label: '✨ Custom', value: 'custom', description: '직접 설명' }
    ],
    { placeHolder: '화면 카테고리 선택' }
  );
  
  if (!category) return;
  
  // Step 3: Screen Type 선택 (카테고리별 필터링)
  const screenTypes = Array.from(SCREEN_TYPE_REGISTRY.entries())
    .filter(([_, meta]) => meta.category === category.value)
    .map(([id, meta]) => ({
      label: meta.label,
      value: id,
      description: meta.description,
      detail: `복잡도: ${meta.complexity} | 필수: ${meta.requiredComponents.join(', ')}`
    }));
  
  const screenType = await vscode.window.showQuickPick(screenTypes, {
    placeHolder: '화면 타입 선택'
  });
  
  if (!screenType) return;
  
  // Step 4: 화면 이름
  const screenName = await vscode.window.showInputBox({
    prompt: '화면 이름 (예: UserList, ProductDetail)',
    placeHolder: 'PascalCase로 입력'
  });
  
  if (!screenName) return;
  
  // Step 5: 엔티티 이름 (해당되는 경우)
  let entityName: string | undefined;
  if (['crud', 'commerce'].includes(category.value as string)) {
    entityName = await vscode.window.showInputBox({
      prompt: '엔티티 이름 (선택)',
      placeHolder: 'e.g., User, Product, Order'
    });
  }
  
  // Step 6: 기능 선택 (다중 선택)
  const meta = SCREEN_TYPE_REGISTRY.get(screenType.value as ScreenType)!;
  const selectedFeatures = await vscode.window.showQuickPick(
    meta.commonFeatures.map(f => ({ label: f, picked: true })),
    {
      placeHolder: '포함할 기능 선택',
      canPickMany: true
    }
  );
  
  // Step 7: Payload 생성
  const payload: ScreenCreationPayload = {
    screenType: screenType.value as ScreenType,
    category: category.value as ScreenCategory,
    entityName,
    screenName: screenName!,
    features: selectedFeatures?.map(f => f.label) || [],
    allowedComponents: config.componentWhitelist,
    policySetVersion: config.contracts.version,
    tokensSummary: {
      primaryColor: config.tokens.seed.primaryColor.value,
      borderRadius: config.tokens.seed.borderRadius,
      density: config.tokens.seed.density,
      fontScale: config.tokens.seed.fontScale
    },
    projectContext: {
      existingScreens: await scanExistingScreens(),
      entityModels: await scanEntityModels(),
      designSystemVersion: config.preset.version
    }
  };
  
  // Phase B에서는 payload 생성까지만
  // Phase C에서 이 payload를 LLM 오케스트레이터에 전달
  
  vscode.window.showInformationMessage(
    `Screen creation payload ready: ${screenName} (${meta.label})`
  );
  
  // 디버그용 출력
  console.log('Screen creation payload:', JSON.stringify(payload, null, 2));
}
```

#### B4-3. Screen Type 확장 가이드

새로운 Screen Type을 추가하는 방법:

```typescript
// 1. types/index.ts에 새 interface 추가
export interface NewDomainScreenTypes {
  'new-screen-type': {
    description: string;
    features: string[];
    components: string[];
  };
}

// 2. ScreenType union에 추가
export type ScreenType = 
  | keyof CrudScreenTypes
  | keyof NewDomainScreenTypes  // 추가
  | 'custom';

// 3. SCREEN_TYPE_REGISTRY에 메타데이터 추가
SCREEN_TYPE_REGISTRY.set('new-screen-type', {
  label: '새 화면 타입',
  description: '...',
  category: 'new-category',
  // ...
});
```

---

## 테스트 전략

### Unit Tests

```typescript
// 각 패키지별 단위 테스트
packages/
├── preset/src/__tests__/
│   ├── schema.test.ts          // 스키마 검증
│   └── loader.test.ts          // 프리셋 로딩
├── token-generator/src/__tests__/
│   ├── generator.test.ts       // 토큰 생성 로직
│   ├── color.test.ts           // 색상 생성
│   └── accessibility.test.ts   // 대비율 검증
├── contracts/src/__tests__/
│   ├── registry.test.ts        // 레지스트리
│   └── detector.test.ts        // 위반 감지
└── bootstrap/src/__tests__/
    ├── detector.test.ts        // 스택 감지
    └── executor.test.ts        // 부트스트랩 실행
```

### Integration Tests

**파일**: `tests/integration/bootstrap.test.ts`

```typescript
import { createTempProject, cleanup } from './helpers';

describe('Bootstrap Integration', () => {
  let projectDir: string;
  
  beforeEach(async () => {
    projectDir = await createTempProject('nextjs-tailwind');
  });
  
  afterEach(async () => {
    await cleanup(projectDir);
  });
  
  it('bootstraps empty Next.js project successfully', async () => {
    const stack = await detectStack(projectDir);
    const preset = await loadPreset('next-tailwind-shadcn');
    const tokens = generateTokens(DEFAULT_QUESTIONNAIRE);
    
    const result = await executeBootstrap(projectDir, stack, preset, tokens);
    
    expect(result.success).toBe(true);
    expect(result.steps.every(s => s.status !== 'failed')).toBe(true);
    
    // 파일 생성 확인
    expect(await pathExists(path.join(projectDir, 'components.json'))).toBe(true);
    expect(await pathExists(path.join(projectDir, 'components/ui/button.tsx'))).toBe(true);
    expect(await pathExists(path.join(projectDir, 'styles/tokens.css'))).toBe(true);
  });
  
  it('rolls back on failure', async () => {
    // 의도적으로 실패 유발
    await fs.chmod(path.join(projectDir, 'package.json'), 0o444);
    
    const result = await executeBootstrap(projectDir, stack, preset, tokens);
    
    expect(result.success).toBe(false);
    expect(result.rollbackData).toBeDefined();
  });
});
```

### E2E Tests (VS Code Extension)

**파일**: `packages/vscode-extension/src/__tests__/e2e/setup.test.ts`

```typescript
import * as vscode from 'vscode';

describe('VS Code Extension E2E', () => {
  it('Setup command completes successfully', async () => {
    // 커맨드 실행
    await vscode.commands.executeCommand('figmarchitect.setup');
    
    // .designairc 생성 확인
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    const configUri = vscode.Uri.joinPath(workspaceFolder!.uri, '.designairc');
    
    const configExists = await vscode.workspace.fs.stat(configUri)
      .then(() => true)
      .catch(() => false);
    
    expect(configExists).toBe(true);
  });
});
```

---

## 마일스톤 체크리스트

### Phase A 완료 기준

- [ ] **A1: Preset 정의**
  - [ ] `next-tailwind-shadcn.json` 스키마 완성
  - [ ] TypeScript 타입 정의
  - [ ] 프리셋 로더 구현
  - [ ] 빈 프로젝트 적용 테스트 통과

- [ ] **A2: Token Generator (OKLCH 기반)**
  - [ ] Q&A 스키마 정의 (7문항)
  - [ ] OKLCH 색상 생성 로직 (culori)
  - [ ] Primary palette 생성 (50-900 steps)
  - [ ] Neutral palette 생성 (background mode: pure/tinted/custom)
  - [ ] Status palettes 생성 (success/warning/error/info)
  - [ ] shadcn CSS 변수 매핑
  - [ ] Light/Dark mode 지원
  - [ ] tokens.json 출력 (DTCG 포맷)
  - [ ] Deterministic 테스트 통과
  - [ ] WCAG AA 대비율 테스트 통과

- [ ] **A3: Contracts & Policies (Production-Ready)**
  - [ ] Contract 스키마 정의 (6 rule types)
  - [ ] shadcn 전체 컴포넌트 목록 정의 (~50개)
  - [ ] MVP 컴포넌트 contract 구현 (button, input, dialog, form, data-table, card, select, alert)
  - [ ] 각 컴포넌트당 5-15개 constraints
  - [ ] Layout policy 정의 (10개 이상)
  - [ ] Contract registry 구현
  - [ ] 고유 ID 체계 확립 (BTN-A01, DLG-S01 형식)
  - [ ] Best practices 섹션 포함

### Phase B 완료 기준

- [ ] **B1: IDE 커맨드**
  - [ ] `figmarchitect.setup` 커맨드
  - [ ] `figmarchitect.bootstrap` 커맨드
  - [ ] `figmarchitect.verify` 커맨드 (stub)
  - [ ] `figmarchitect.createScreen` 커맨드 (확장된 screen types)

- [ ] **B2: Stack Detection & Bootstrap**
  - [ ] Next.js (App/Pages) 감지
  - [ ] Tailwind 감지
  - [ ] TypeScript 감지
  - [ ] shadcn 초기화 상태 감지
  - [ ] 패키지 매니저 감지 (npm/yarn/pnpm/bun)
  - [ ] 의존성 설치
  - [ ] shadcn init
  - [ ] 컴포넌트 설치 (whitelist 기반)
  - [ ] 토큰 적용
  - [ ] 롤백 메커니즘

- [ ] **B3: 캐시 & 설정**
  - [ ] 로컬 캐시 디렉토리 구조
  - [ ] `.designairc` 스키마
  - [ ] 설정 읽기/쓰기

- [ ] **B4: Create Screen (Production-Ready)**
  - [ ] Screen Type 체계 정의 (9 categories, 40+ types)
  - [ ] `ScreenCreationPayload` 타입 정의 (확장)
  - [ ] 카테고리/타입 선택 UI
  - [ ] Feature 선택 UI
  - [ ] Project context 수집
  - [ ] Payload 생성 로직

### 통합 테스트 완료 기준

- [ ] 빈 Next.js + Tailwind 프로젝트에서 1회 실행으로 shadcn 설정 완료
- [ ] 기존 프로젝트에서 충돌 없이 병합 또는 명확한 가이드 제공
- [ ] 실패 시 안전한 롤백
- [ ] 재실행 시 중복 설치 없음 (멱등성)
- [ ] 모든 preset 컴포넌트가 생성된 토큰으로 정상 렌더링

---

## 프로덕션 레벨 확장 가이드

### Component Contracts 확장 전략

현재 MVP에서 8개 컴포넌트로 시작하지만, 실제 프로덕션 앱에는 shadcn의 모든 컴포넌트(~50개)를 커버해야 함.

**우선순위 그룹:**

| 우선순위 | 컴포넌트 | 이유 |
|---------|---------|------|
| P0 (MVP) | button, input, card, dialog, form, data-table, select, alert | 모든 앱의 기본 |
| P1 | tabs, dropdown-menu, toast, navigation-menu, sheet, popover | 네비게이션/피드백 필수 |
| P2 | checkbox, radio-group, switch, slider, textarea, label | 폼 확장 |
| P3 | avatar, badge, progress, skeleton, separator | 데이터 표시 |
| P4 | accordion, calendar, carousel, command, tooltip | 고급 인터랙션 |
| P5 | alert-dialog, drawer, hover-card, menubar, context-menu | 특수 케이스 |

**Constraint 확장 가이드:**

```typescript
// 컴포넌트당 권장 constraint 수
const CONSTRAINT_TARGETS = {
  high_usage: 10-15,  // button, input, form
  medium_usage: 7-10, // card, dialog, tabs
  low_usage: 3-5,     // separator, aspect-ratio
};

// Constraint 카테고리별 분배
const CONSTRAINT_CATEGORIES = {
  accessibility: '30%',  // WCAG 준수
  composition: '25%',    // 컴포넌트 조합 규칙
  variant: '20%',        // 스타일 variant 규칙
  context: '15%',        // 사용 컨텍스트 규칙
  state: '10%',          // 상태 관리 규칙
};
```

### Screen Types 확장 전략

현재 9개 카테고리, 40+ 타입으로 시작하지만 도메인별로 확장 가능.

**도메인별 확장 예시:**

```typescript
// Healthcare
export interface HealthcareScreenTypes {
  'health-patient-record': {...};
  'health-appointment-booking': {...};
  'health-prescription': {...};
}

// Education
export interface EducationScreenTypes {
  'edu-course-catalog': {...};
  'edu-lesson-player': {...};
  'edu-quiz': {...};
  'edu-gradebook': {...};
}

// Finance
export interface FinanceScreenTypes {
  'fin-portfolio': {...};
  'fin-transaction-history': {...};
  'fin-budget-planner': {...};
}
```

**확장 시 고려사항:**

1. **Component 매핑**: 각 Screen Type에 필요한 컴포넌트 목록 정의
2. **Feature 정의**: 해당 화면에서 지원하는 기능들
3. **Layout 권장**: 권장 레이아웃 패턴
4. **Constraint 연결**: 관련 contract constraint IDs

---

## 부록: 디렉토리 구조 (확장)

```
figmarchitect/
├── packages/
│   ├── preset/                 # A1: 프리셋 정의
│   │   ├── src/
│   │   │   ├── presets/
│   │   │   │   └── next-tailwind-shadcn.json
│   │   │   ├── types/
│   │   │   │   └── preset.ts
│   │   │   └── loader.ts
│   │   └── package.json
│   │
│   ├── token-generator/        # A2: 토큰 생성 (OKLCH)
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   │   └── questionnaire.ts
│   │   │   ├── utils/
│   │   │   │   ├── color.ts          # OKLCH palette generation
│   │   │   │   ├── semantic.ts       # Semantic color mapping
│   │   │   │   └── scales.ts
│   │   │   ├── output/
│   │   │   │   ├── css.ts
│   │   │   │   └── dtcg.ts           # DTCG format export
│   │   │   └── generator.ts
│   │   └── package.json
│   │
│   ├── contracts/              # A3: 계약 & 정책 (확장)
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   │   └── contract.ts
│   │   │   ├── definitions/
│   │   │   │   ├── index.ts          # Registry
│   │   │   │   ├── button.ts
│   │   │   │   ├── input.ts
│   │   │   │   ├── dialog.ts
│   │   │   │   ├── form.ts
│   │   │   │   ├── data-table.ts
│   │   │   │   ├── card.ts
│   │   │   │   ├── select.ts
│   │   │   │   ├── alert.ts
│   │   │   │   └── ... (50+ files)
│   │   │   ├── policies/
│   │   │   │   └── layout.ts
│   │   │   └── registry.ts
│   │   └── package.json
│   │
│   ├── screen-types/           # B4: 화면 타입 시스템 (NEW)
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── index.ts          # All screen types
│   │   │   │   ├── crud.ts
│   │   │   │   ├── auth.ts
│   │   │   │   ├── commerce.ts
│   │   │   │   ├── dashboard.ts
│   │   │   │   ├── content.ts
│   │   │   │   ├── social.ts
│   │   │   │   ├── settings.ts
│   │   │   │   ├── onboarding.ts
│   │   │   │   └── utility.ts
│   │   │   ├── registry.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── bootstrap/              # B2: 부트스트랩
│   │   ├── src/
│   │   │   ├── detector.ts
│   │   │   ├── executor.ts
│   │   │   └── rollback.ts
│   │   └── package.json
│   │
│   ├── cache/                  # B3: 캐시 관리
│   │   ├── src/
│   │   │   └── manager.ts
│   │   └── package.json
│   │
│   └── vscode-extension/       # B1: IDE 확장
│       ├── src/
│       │   ├── commands/
│       │   │   ├── setup.ts
│       │   │   ├── bootstrap.ts
│       │   │   └── create-screen.ts
│       │   └── extension.ts
│       └── package.json
│
├── tests/
│   ├── unit/
│   │   ├── token-generator/
│   │   └── contracts/
│   └── integration/
│       └── bootstrap.test.ts
│
└── pnpm-workspace.yaml
```
