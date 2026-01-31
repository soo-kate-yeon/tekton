/**
 * @tekton/tokens - Motion Token Definitions
 * [SPEC-UI-001] [TAG-018]
 * Animation and transition tokens for Framer Motion integration
 *
 * WHY: Motion tokens는 일관된 애니메이션 경험을 보장합니다
 * IMPACT: 모든 애니메이션이 동일한 타이밍과 이징을 사용하여 통일된 UX 제공
 */

import type { TokenReference } from './types.js';

/**
 * Duration tokens for animation timing
 * REQ-UI-O-001: Framer Motion 기반 애니메이션 토큰 제공
 */
export interface MotionDurationTokens {
  instant: TokenReference; // 0ms - immediate feedback
  fast: TokenReference; // 100ms - micro-interactions
  moderate: TokenReference; // 200ms - standard transitions
  slow: TokenReference; // 300ms - layout changes
  complex: TokenReference; // 500ms - complex animations
}

/**
 * Easing tokens for animation curves
 * Based on Material Design motion guidelines
 */
export interface MotionEasingTokens {
  linear: TokenReference; // linear - constant speed
  standard: TokenReference; // ease-out - natural deceleration
  emphasized: TokenReference; // cubic-bezier(0.2, 0, 0, 1) - emphasized motion
  decelerate: TokenReference; // cubic-bezier(0, 0, 0.2, 1) - decelerate
  accelerate: TokenReference; // cubic-bezier(0.4, 0, 1, 1) - accelerate
}

/**
 * Complete motion token interface
 * REQ-STY-003: IDE 자동완성 지원
 */
export interface MotionTokens {
  duration: MotionDurationTokens;
  easing: MotionEasingTokens;
}
