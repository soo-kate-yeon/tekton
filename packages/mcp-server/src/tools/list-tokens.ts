/**
 * List Tokens MCP Tool
 * SPEC-LAYOUT-002 Phase 4: List available layout tokens from SPEC-LAYOUT-001
 */

import type { ListTokensInput, ListTokensOutput, TokenMetadata } from '../schemas/mcp-schemas.js';
import { extractErrorMessage } from '../utils/error-handler.js';

/**
 * Apply pattern filter to tokens
 *
 * @param tokens - Array of token metadata
 * @param filter - Optional pattern filter (case-insensitive substring match)
 * @returns Filtered tokens
 */
function applyFilter(tokens: TokenMetadata[], filter?: string): TokenMetadata[] {
  if (!filter) {
    return tokens;
  }

  const lowerFilter = filter.toLowerCase();
  return tokens.filter(
    token =>
      token.id.toLowerCase().includes(lowerFilter) ||
      token.name?.toLowerCase().includes(lowerFilter) ||
      token.description?.toLowerCase().includes(lowerFilter)
  );
}

/**
 * List available layout tokens from @tekton/core
 *
 * @param input - Token type filter and optional pattern filter
 * @returns Categorized list of available tokens
 */
export async function listTokensTool(input: ListTokensInput): Promise<ListTokensOutput> {
  try {
    const { tokenType = 'all', filter } = input;

    // Import token getters from @tekton/core
    const {
      getAllShellTokens,
      getAllMobileShellTokens,
      getAllPageLayoutTokens,
      getAllSectionPatternTokens,
    } = await import('@tekton/core');

    // Get tokens based on type
    let shells: TokenMetadata[] = [];
    let pages: TokenMetadata[] = [];
    let sections: TokenMetadata[] = [];

    if (tokenType === 'all' || tokenType === 'shell') {
      // Get both web and mobile shell tokens (SPEC-LAYOUT-001 + SPEC-LAYOUT-004)
      const webShellTokens = getAllShellTokens();
      const mobileShellTokens = getAllMobileShellTokens();

      const allShellTokens = [...webShellTokens, ...mobileShellTokens];

      shells = allShellTokens.map(token => ({
        id: token.id,
        name: token.id.split('.').pop() || token.id, // Extract name from id
        description: token.description,
        platform: token.platform,
      }));
    }

    if (tokenType === 'all' || tokenType === 'page') {
      const pageTokens = getAllPageLayoutTokens();
      pages = pageTokens.map(token => ({
        id: token.id,
        name: token.id.split('.').pop() || token.id, // Extract name from id
        description: token.description,
        purpose: token.purpose,
      }));
    }

    if (tokenType === 'all' || tokenType === 'section') {
      const sectionTokens = getAllSectionPatternTokens();
      sections = sectionTokens.map(token => ({
        id: token.id,
        name: token.id.split('.').pop() || token.id, // Extract name from id
        description: token.description,
        type: token.type,
      }));
    }

    // Apply filter if provided
    if (filter) {
      shells = applyFilter(shells, filter);
      pages = applyFilter(pages, filter);
      sections = applyFilter(sections, filter);
    }

    const total = shells.length + pages.length + sections.length;

    return {
      success: true,
      shells: shells.length > 0 ? shells : undefined,
      pages: pages.length > 0 ? pages : undefined,
      sections: sections.length > 0 ? sections : undefined,
      metadata: {
        total,
        filtered: filter ? total : undefined,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}
