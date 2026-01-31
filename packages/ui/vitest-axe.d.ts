/**
 * @tekton/ui - vitest-axe Type Declarations
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-015] 타입 오류 @ts-ignore로 회피 금지
 *
 * WHY: vitest-axe의 toHaveNoViolations 메서드 타입이 Vitest Assertion에 자동으로 추가되지 않음
 * IMPACT: 타입 정의 누락 시 21개 TypeScript 컴파일 오류 발생
 */

import 'vitest';

declare module 'vitest' {
  /**
   * Extends Vitest Assertion interface with axe accessibility matchers
   * Provides toHaveNoViolations() method for accessibility testing
   */
  interface Assertion<T = any> {
    /**
     * Assert that an element has no accessibility violations
     * Uses axe-core to check for WCAG compliance
     *
     * @example
     * ```typescript
     * const results = await axe(container);
     * expect(results).toHaveNoViolations();
     * ```
     */
    toHaveNoViolations(): void;
  }

  /**
   * Extends AsymmetricMatchersContaining for asymmetric matchers (expect.any, expect.anything, etc.)
   */
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
