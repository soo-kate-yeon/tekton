/**
 * Zod 스키마 정의
 * 클라이언트 측 데이터 검증을 위한 스키마
 */

import { z } from 'zod';

// ============================================================================
// Blueprint 스키마
// ============================================================================

/**
 * 컴포넌트 노드 스키마
 * @tekton/core ComponentNode 타입과 일치
 */
export const ComponentNodeSchema: z.ZodType<{
  type: string;
  props?: Record<string, unknown>;
  children?: (unknown | string)[];
  slot?: string;
}> = z.lazy(() =>
  z.object({
    type: z.string().min(1, 'Component type is required'),
    props: z.record(z.unknown()).optional(),
    children: z.array(z.union([ComponentNodeSchema, z.string()])).optional(),
    slot: z.string().optional(),
  })
);

export type ComponentNode = z.infer<typeof ComponentNodeSchema>;

/**
 * Layout 타입 스키마
 */
export const LayoutTypeSchema = z.enum([
  'single-column',
  'two-column',
  'sidebar-left',
  'sidebar-right',
  'dashboard',
  'landing',
]);

export type LayoutType = z.infer<typeof LayoutTypeSchema>;

/**
 * Blueprint 스키마
 * @tekton/core Blueprint 타입과 일치
 */
export const BlueprintSchema = z.object({
  id: z.string().min(1, 'Blueprint ID is required'),
  name: z.string().min(1, 'Blueprint name is required'),
  description: z.string().optional(),
  themeId: z.string().min(1, 'Theme ID is required'),
  layout: LayoutTypeSchema,
  components: z.array(ComponentNodeSchema),
});

export type Blueprint = z.infer<typeof BlueprintSchema>;

/**
 * Blueprint 생성 요청 스키마
 */
export const BlueprintRequestSchema = z.object({
  brandName: z
    .string()
    .min(1, '브랜드 이름을 입력해주세요')
    .max(50, '브랜드 이름은 50자 이하여야 합니다'),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, '유효한 HEX 색상 코드를 입력해주세요')
    .optional(),
  accentColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, '유효한 HEX 색상 코드를 입력해주세요')
    .optional(),
});

export type BlueprintRequest = z.infer<typeof BlueprintRequestSchema>;

/**
 * 환경 변수 스키마
 */
export const EnvSchema = z.object({
  MCP_SERVER_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

/**
 * 환경 변수 검증
 */
export function validateEnv() {
  const parsed = EnvSchema.safeParse({
    MCP_SERVER_URL: process.env.MCP_SERVER_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    console.error('환경 변수 검증 실패:', parsed.error.format());
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}
