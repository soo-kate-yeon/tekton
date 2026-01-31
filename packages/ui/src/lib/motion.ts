/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */

import type { Transition, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Motion token values (동기화됨: globals.css)
 */
export const motionTokens = {
  duration: {
    instant: 0,
    fast: 100,
    moderate: 200,
    slow: 300,
    complex: 500,
  },
  easing: {
    linear: [0, 0, 1, 1],
    standard: [0, 0, 0.2, 1], // ease-out
    emphasized: [0.2, 0, 0, 1], // emphasized
    decelerate: [0, 0, 0.2, 1],
    accelerate: [0.4, 0, 1, 1],
  },
} as const;

/**
 * Transition 프리셋
 * REQ-UI-O-001: Framer Motion 기반 애니메이션 토큰
 */
export const transitions = {
  fast: {
    duration: motionTokens.duration.fast / 1000,
    ease: motionTokens.easing.standard,
  } satisfies Transition,

  moderate: {
    duration: motionTokens.duration.moderate / 1000,
    ease: motionTokens.easing.standard,
  } satisfies Transition,

  slow: {
    duration: motionTokens.duration.slow / 1000,
    ease: motionTokens.easing.emphasized,
  } satisfies Transition,

  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  } satisfies Transition,
};

/**
 * Fade 애니메이션 variants
 */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Slide 애니메이션 variants
 */
export const slideVariants = {
  fromLeft: {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  } satisfies Variants,

  fromRight: {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
  } satisfies Variants,

  fromTop: {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  } satisfies Variants,

  fromBottom: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  } satisfies Variants,
};

/**
 * Scale 애니메이션 variants
 */
export const scaleVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
};

/**
 * prefers-reduced-motion 감지 Hook
 * 접근성: 모션 감소 설정 사용자를 위한 애니메이션 비활성화
 *
 * WHY: WCAG 2.1 Success Criterion 2.3.3 준수
 * IMPACT: 모션 민감도가 있는 사용자의 접근성 향상
 */
export function useMotionSafe(): boolean {
  const [motionSafe, setMotionSafe] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionSafe(!mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMotionSafe(!e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return motionSafe;
}

/**
 * Motion-safe transition helper
 * 사용자 설정에 따라 애니메이션 비활성화
 */
export function getMotionTransition(transition: Transition, motionSafe: boolean): Transition {
  if (!motionSafe) {
    return { duration: 0.01 };
  }
  return transition;
}
