/**
 * Generators Module Index
 * SPEC-COMPONENT-001-D: Hybrid Export System
 *
 * 3계층 Export 시스템:
 * - CSS Generator: 테마에서 CSS Variables 생성
 * - Core Resolver (Tier 1): @tekton/ui에서 컴포넌트 가져오기
 * - LLM Generator (Tier 2): Claude API로 커스텀 컴포넌트 생성
 */

// CSS Generator
export {
  generateCSS,
  generateCSSFromThemeId,
  extractCSSVariables,
  type CSSGenerationResult,
  type ThemeV2,
} from './css-generator.js';

// Core Resolver (Tier 1)
export {
  isTier1Component,
  getTier1Example,
  getTier1Source,
  resolveFromTier1,
  resolveMultipleFromTier1,
  TIER1_COMPONENTS,
  type ComponentResolutionResult,
} from './core-resolver.js';

// LLM Generator (Tier 2)
export {
  generateWithLLM,
  generateMockComponent,
  resolveFromTier2,
  buildLLMContext,
  extractCodeFromResponse,
  validateGeneratedCode,
  type LLMGeneratorConfig,
  type LLMGenerationResult,
  type ValidationResult,
} from './llm-generator.js';
