/**
 * @tekton/ui - Tekton Token CSS Variable Mappings
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 토큰 시스템이 테마 일관성과 유지보수성을 보장
 * IMPACT: 토큰 정의 누락 시 UI 불일치 발생
 *
 * This file maps shadcn-ui semantic tokens to Tekton's global token system.
 * All values use `var(--tekton-*)` pattern for theme consistency.
 */

import type { TokenReference } from '@tekton/tokens';

/**
 * Tekton Token CSS Variables
 * Pattern: var(--tekton-{category}-{name})
 */
export const tokenVars = {
  // ========================================
  // Background Tokens
  // ========================================
  bg: {
    background: 'var(--tekton-bg-background)' as TokenReference,
    foreground: 'var(--tekton-bg-foreground)' as TokenReference,
    card: 'var(--tekton-bg-card)' as TokenReference,
    cardForeground: 'var(--tekton-bg-card-foreground)' as TokenReference,
    popover: 'var(--tekton-bg-popover)' as TokenReference,
    popoverForeground: 'var(--tekton-bg-popover-foreground)' as TokenReference,
    primary: 'var(--tekton-bg-primary)' as TokenReference,
    primaryForeground: 'var(--tekton-bg-primary-foreground)' as TokenReference,
    secondary: 'var(--tekton-bg-secondary)' as TokenReference,
    secondaryForeground: 'var(--tekton-bg-secondary-foreground)' as TokenReference,
    muted: 'var(--tekton-bg-muted)' as TokenReference,
    mutedForeground: 'var(--tekton-bg-muted-foreground)' as TokenReference,
    accent: 'var(--tekton-bg-accent)' as TokenReference,
    accentForeground: 'var(--tekton-bg-accent-foreground)' as TokenReference,
    destructive: 'var(--tekton-bg-destructive)' as TokenReference,
    destructiveForeground: 'var(--tekton-bg-destructive-foreground)' as TokenReference,
  },

  // ========================================
  // Border Tokens
  // ========================================
  border: {
    default: 'var(--tekton-border-default)' as TokenReference,
    input: 'var(--tekton-border-input)' as TokenReference,
    ring: 'var(--tekton-border-ring)' as TokenReference,
  },

  // ========================================
  // Radius Tokens
  // ========================================
  radius: {
    sm: 'var(--tekton-radius-sm)' as TokenReference,
    md: 'var(--tekton-radius-md)' as TokenReference,
    lg: 'var(--tekton-radius-lg)' as TokenReference,
    xl: 'var(--tekton-radius-xl)' as TokenReference,
    full: 'var(--tekton-radius-full)' as TokenReference,
  },

  // ========================================
  // Spacing Tokens (4px base)
  // ========================================
  spacing: {
    0: 'var(--tekton-spacing-0)' as TokenReference,
    1: 'var(--tekton-spacing-1)' as TokenReference,
    2: 'var(--tekton-spacing-2)' as TokenReference,
    3: 'var(--tekton-spacing-3)' as TokenReference,
    4: 'var(--tekton-spacing-4)' as TokenReference,
    5: 'var(--tekton-spacing-5)' as TokenReference,
    6: 'var(--tekton-spacing-6)' as TokenReference,
    8: 'var(--tekton-spacing-8)' as TokenReference,
    10: 'var(--tekton-spacing-10)' as TokenReference,
    12: 'var(--tekton-spacing-12)' as TokenReference,
    16: 'var(--tekton-spacing-16)' as TokenReference,
  },
} as const;

/**
 * Type-safe token accessor
 * Ensures all token references follow the TokenReference pattern
 */
export type TektonTokenVars = typeof tokenVars;

/**
 * Helper function to validate token references at runtime
 */
export function isTokenReference(value: string): value is TokenReference {
  return value.startsWith('var(--tekton-') && value.endsWith(')');
}

/**
 * Extract token name from TokenReference
 * Example: var(--tekton-bg-primary) → bg-primary
 */
export function extractTokenName(token: TokenReference): string {
  const match = token.match(/var\(--tekton-(.*)\)/);
  return match ? match[1] : '';
}
