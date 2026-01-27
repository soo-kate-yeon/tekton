/**
 * LLM Generator for Tier 2 Export
 * SPEC-COMPONENT-001-D: Hybrid Export System
 *
 * Tier 2: LLM을 사용하여 커스텀 컴포넌트 생성
 * - Claude API를 사용한 코드 생성
 * - 생성된 코드 검증
 * - 최대 3회 재시도 로직
 */

import { getComponentSchema, type ComponentSchema } from '@tekton/core';
import { TIER1_COMPONENTS, getTier1Example } from './core-resolver.js';

/**
 * LLM 생성 설정
 */
export interface LLMGeneratorConfig {
  /** Anthropic API 키 (환경변수에서 가져옴) */
  apiKey?: string;
  /** 사용할 모델 */
  model?: string;
  /** 최대 재시도 횟수 */
  maxRetries?: number;
  /** 타임아웃 (밀리초) */
  timeout?: number;
}

/**
 * LLM 생성 결과
 */
export interface LLMGenerationResult {
  success: boolean;
  code?: string;
  componentName?: string;
  attempts?: number;
  validationErrors?: string[];
  error?: string;
}

/**
 * 코드 검증 결과
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * 기본 설정
 */
const DEFAULT_CONFIG: Required<LLMGeneratorConfig> = {
  apiKey: process.env.ANTHROPIC_API_KEY || '',
  model: 'claude-sonnet-4-20250514',
  maxRetries: 3,
  timeout: 30000,
};

/**
 * LLM 컨텍스트 빌드
 * 컴포넌트 생성을 위한 프롬프트 구성
 *
 * @param componentName - 생성할 컴포넌트 이름
 * @param description - 컴포넌트 설명
 * @param schema - 컴포넌트 스키마 (있는 경우)
 * @returns LLM 프롬프트
 */
export function buildLLMContext(
  componentName: string,
  description?: string,
  schema?: ComponentSchema
): string {
  // Tier 1 예제들을 참조로 포함
  const referenceExamples = TIER1_COMPONENTS.slice(0, 3)
    .map(name => {
      const result = getTier1Example(name);
      return result.success ? `// Example: ${name}\n${result.code}` : '';
    })
    .filter(Boolean)
    .join('\n\n');

  let prompt = `Generate a React component following @tekton/ui conventions.

## Component Name
${componentName}

## Description
${description || `A ${componentName} component`}

## Requirements
1. Use TypeScript with proper type definitions
2. Use CSS Variables for theming (var(--component-property))
3. Use @tekton/ui imports where applicable
4. Follow WCAG 2.1 AA accessibility guidelines
5. Include proper aria attributes
6. Export the component as named export

## Reference Examples (from @tekton/ui)
${referenceExamples}

`;

  if (schema) {
    prompt += `## Component Schema
\`\`\`json
${JSON.stringify(schema, null, 2)}
\`\`\`

`;
  }

  prompt += `## Output Format
Return ONLY the TypeScript code, no explanations. Start with imports.`;

  return prompt;
}

/**
 * 생성된 코드에서 실제 코드 추출
 * 마크다운 코드 블록 등을 처리
 *
 * @param response - LLM 응답 텍스트
 * @returns 추출된 코드
 */
export function extractCodeFromResponse(response: string): string {
  // 마크다운 코드 블록 처리
  const codeBlockMatch = response.match(/```(?:typescript|tsx|ts)?\n?([\s\S]*?)```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1].trim();
  }

  // 코드 블록이 없으면 전체 응답 반환
  return response.trim();
}

/**
 * 생성된 코드 검증
 *
 * @param code - 검증할 코드
 * @param componentName - 컴포넌트 이름
 * @returns 검증 결과
 */
export function validateGeneratedCode(code: string, componentName: string): ValidationResult {
  const errors: string[] = [];

  // 빈 코드 검사
  if (!code || code.trim().length === 0) {
    errors.push('Generated code is empty');
    return { valid: false, errors };
  }

  // 최소 길이 검사
  if (code.length < 50) {
    errors.push('Generated code is too short (minimum 50 characters)');
  }

  // import 문 존재 확인
  if (!code.includes('import')) {
    errors.push('Missing import statements');
  }

  // export 문 존재 확인
  if (!code.includes('export')) {
    errors.push('Missing export statement');
  }

  // 컴포넌트 함수 정의 확인
  const functionPatterns = [
    new RegExp(`function\\s+${componentName}`),
    new RegExp(`const\\s+${componentName}\\s*=`),
    new RegExp(`export\\s+(default\\s+)?function\\s+${componentName}`),
  ];

  const hasComponentDefinition = functionPatterns.some(pattern => pattern.test(code));

  if (!hasComponentDefinition) {
    errors.push(`Component "${componentName}" definition not found`);
  }

  // return 문 확인 (JSX 반환)
  if (!code.includes('return')) {
    errors.push('Missing return statement');
  }

  // JSX 문법 확인 (기본적인 < > 태그)
  if (!/<[A-Za-z]/.test(code)) {
    errors.push('No JSX elements found');
  }

  // 구문 오류 가능성 검사
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Mismatched braces: ${openBraces} open, ${closeBraces} close`);
  }

  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push(`Mismatched parentheses: ${openParens} open, ${closeParens} close`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * LLM을 사용하여 컴포넌트 생성 (재시도 로직 포함)
 *
 * @param componentName - 생성할 컴포넌트 이름
 * @param description - 컴포넌트 설명
 * @param config - LLM 설정
 * @returns 생성 결과
 */
export async function generateWithLLM(
  componentName: string,
  description?: string,
  config?: LLMGeneratorConfig
): Promise<LLMGenerationResult> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // API 키 확인
  if (!finalConfig.apiKey) {
    return {
      success: false,
      componentName,
      error: 'ANTHROPIC_API_KEY is not set. Please set it in environment variables.',
    };
  }

  // 스키마 가져오기 (있는 경우)
  let schema: ComponentSchema | undefined;
  try {
    schema = getComponentSchema(componentName);
  } catch {
    // 스키마가 없어도 계속 진행
  }

  const prompt = buildLLMContext(componentName, description, schema);
  let lastError: string | undefined;
  let allValidationErrors: string[] = [];

  for (let attempt = 1; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      // Anthropic SDK 동적 import
      const anthropicModule = await import('@anthropic-ai/sdk');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Anthropic = (anthropicModule as any).default || (anthropicModule as any).Anthropic;

      const client = new Anthropic({
        apiKey: finalConfig.apiKey,
      });

      const response = await client.messages.create({
        model: finalConfig.model,
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content:
              prompt +
              (attempt > 1
                ? `\n\nPrevious attempt failed validation with errors: ${allValidationErrors.join(', ')}. Please fix these issues.`
                : ''),
          },
        ],
      });

      // 응답에서 텍스트 추출
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const textContent = response.content.find((block: any) => block.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        lastError = 'No text content in LLM response';
        continue;
      }

      const rawCode = textContent.text;
      const code = extractCodeFromResponse(rawCode);

      // 코드 검증
      const validation = validateGeneratedCode(code, componentName);

      if (validation.valid) {
        return {
          success: true,
          code,
          componentName,
          attempts: attempt,
        };
      }

      allValidationErrors = [...allValidationErrors, ...validation.errors];
      lastError = `Validation failed: ${validation.errors.join(', ')}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error during LLM generation';
    }
  }

  return {
    success: false,
    componentName,
    attempts: finalConfig.maxRetries,
    validationErrors: allValidationErrors,
    error: lastError || 'Max retries exceeded',
  };
}

/**
 * Mock LLM 생성 (테스트용)
 * API 키가 없을 때 사용
 *
 * @param componentName - 컴포넌트 이름
 * @param description - 컴포넌트 설명
 * @returns Mock 생성 결과
 */
export function generateMockComponent(
  componentName: string,
  description?: string
): LLMGenerationResult {
  const mockCode = `import * as React from 'react';
import { cn } from '@tekton/ui';

export interface ${componentName}Props extends React.HTMLAttributes<HTMLDivElement> {
  /** 컴포넌트 설명: ${description || componentName} */
  children?: React.ReactNode;
}

/**
 * ${componentName} Component
 * ${description || `Auto-generated ${componentName} component`}
 */
export const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-[var(--surface-primary)] text-[var(--foreground-primary)]',
          'rounded-[var(--radius-md)] p-[var(--spacing-4)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

${componentName}.displayName = '${componentName}';
`;

  return {
    success: true,
    code: mockCode,
    componentName,
    attempts: 1,
  };
}

/**
 * Tier 2 컴포넌트 해결
 * LLM 생성 또는 Mock 생성 사용
 *
 * @param componentName - 컴포넌트 이름
 * @param description - 컴포넌트 설명
 * @param config - LLM 설정
 * @returns 생성 결과
 */
export async function resolveFromTier2(
  componentName: string,
  description?: string,
  config?: LLMGeneratorConfig
): Promise<LLMGenerationResult> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // API 키가 없으면 Mock 사용
  if (!finalConfig.apiKey) {
    console.warn(
      `[LLM Generator] ANTHROPIC_API_KEY not set, using mock generation for ${componentName}`
    );
    return generateMockComponent(componentName, description);
  }

  return generateWithLLM(componentName, description, finalConfig);
}
