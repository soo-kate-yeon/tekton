/**
 * Error handling utilities for MCP server
 * SPEC-MCP-002: U-004 Error Response Consistency
 */

import type { ErrorResponse } from '../schemas/mcp-schemas.js';

/**
 * Create standardized error response
 * SPEC: U-004 Error Response Consistency
 */
export function createErrorResponse(error: string): ErrorResponse {
  return {
    success: false,
    error
  };
}

/**
 * Format theme not found error with available themes list
 * SPEC: S-002 Theme Availability Check
 */
export function createThemeNotFoundError(themeId: string, availableThemes: string[]): ErrorResponse {
  const themeList = availableThemes.join(', ');
  return createErrorResponse(
    `Theme not found: ${themeId}. Available themes: ${themeList}`
  );
}

/**
 * Format validation error with details
 * SPEC: U-002 Input Schema Validation
 */
export function createValidationError(errors: string[]): ErrorResponse {
  return createErrorResponse(`Validation errors: ${errors.join(', ')}`);
}

/**
 * Format storage error
 */
export function createStorageError(operation: string, reason: string): ErrorResponse {
  return createErrorResponse(`Failed to ${operation}: ${reason}`);
}

/**
 * Safe error message extraction from unknown error type
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
}
