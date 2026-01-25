/**
 * Error Handler Tests
 * SPEC-MCP-002: AC-004 Error Response Consistency
 */

import { describe, it, expect } from 'vitest';
import {
  createErrorResponse,
  createThemeNotFoundError,
  createValidationError,
  createStorageError,
  extractErrorMessage
} from '../../src/utils/error-handler.js';

describe('Error Handler', () => {
  describe('createErrorResponse', () => {
    it('should create standardized error response', () => {
      const result = createErrorResponse('Test error message');
      expect(result).toEqual({
        success: false,
        error: 'Test error message'
      });
    });
  });

  describe('createThemeNotFoundError', () => {
    it('should create theme not found error with available themes', () => {
      const result = createThemeNotFoundError('invalid-theme', [
        'calm-wellness',
        'dynamic-fitness',
        'premium-editorial'
      ]);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Theme not found: invalid-theme');
      expect(result.error).toContain('Available themes:');
      expect(result.error).toContain('calm-wellness');
      expect(result.error).toContain('dynamic-fitness');
    });
  });

  describe('createValidationError', () => {
    it('should create validation error with multiple errors', () => {
      const result = createValidationError([
        'Field is required',
        'Value must be positive'
      ]);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Validation errors:');
      expect(result.error).toContain('Field is required');
      expect(result.error).toContain('Value must be positive');
    });
  });

  describe('createStorageError', () => {
    it('should create storage error with operation and reason', () => {
      const result = createStorageError('save blueprint', 'disk full');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to save blueprint');
      expect(result.error).toContain('disk full');
    });
  });

  describe('extractErrorMessage', () => {
    it('should extract message from Error object', () => {
      const error = new Error('Test error');
      const message = extractErrorMessage(error);
      expect(message).toBe('Test error');
    });

    it('should handle string errors', () => {
      const message = extractErrorMessage('String error');
      expect(message).toBe('String error');
    });

    it('should handle unknown error types', () => {
      const message = extractErrorMessage({ unknown: 'object' });
      expect(message).toBe('Unknown error occurred');
    });

    it('should handle null and undefined', () => {
      expect(extractErrorMessage(null)).toBe('Unknown error occurred');
      expect(extractErrorMessage(undefined)).toBe('Unknown error occurred');
    });
  });
});
