/**
 * MCP 서버 클라이언트
 * SPEC-MCP-002 서버와 통신하기 위한 클라이언트 유틸리티
 */

import { BlueprintSchema, type Blueprint } from './schemas';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3000';

export interface McpRequest {
  method: string;
  params?: Record<string, unknown>;
}

export interface McpResponse<T = unknown> {
  result?: T;
  error?: {
    code: number;
    message: string;
  };
}

/**
 * MCP 서버로 요청을 전송합니다
 */
export async function sendMcpRequest<T>(request: McpRequest): Promise<McpResponse<T>> {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return {
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

/**
 * Blueprint를 생성합니다
 */
export async function generateBlueprint(params: {
  brandName: string;
  primaryColor?: string;
  accentColor?: string;
}) {
  return sendMcpRequest({
    method: 'generate-blueprint',
    params,
  });
}

/**
 * Timestamp로 Blueprint를 가져옵니다
 * Next.js 캐싱: 1시간 재검증
 */
export async function fetchBlueprint(timestamp: string): Promise<Blueprint | null> {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/api/blueprints/${timestamp}`, {
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Zod 검증
    const validated = BlueprintSchema.safeParse(data);
    if (!validated.success) {
      console.error('Blueprint validation failed:', validated.error);
      throw new Error(`Invalid blueprint data: ${validated.error.message}`);
    }

    return validated.data;
  } catch (error) {
    console.error('Failed to fetch blueprint:', error);
    return null;
  }
}
