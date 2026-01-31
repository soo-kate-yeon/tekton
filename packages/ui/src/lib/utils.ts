/**
 * @tekton/ui - Utility Functions
 * [SPEC-COMPONENT-001-C]
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 유틸리티 함수가 코드 재사용성을 보장
 * IMPACT: 유틸리티 오류 시 전체 컴포넌트 영향
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 *
 * Combines clsx for conditional classes and tailwind-merge for deduplication.
 * This ensures that conflicting Tailwind classes are properly resolved.
 *
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged class string with proper Tailwind precedence
 *
 * @example
 * ```tsx
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 * cn('text-red-500', condition && 'text-blue-500') // => 'text-blue-500' if condition is true
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
