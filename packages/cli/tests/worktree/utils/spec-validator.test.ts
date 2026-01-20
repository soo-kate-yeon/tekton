import { describe, it, expect } from 'vitest';
import { validateSpecId, formatSpecId } from '../../../src/worktree/utils/spec-validator.js';

describe('Spec Validator', () => {
  describe('validateSpecId', () => {
    describe('Valid IDs', () => {
      it('should validate SPEC-ABC-001', () => {
        expect(validateSpecId('SPEC-ABC-001')).toBe(true);
      });

      it('should validate SPEC-TEST-999', () => {
        expect(validateSpecId('SPEC-TEST-999')).toBe(true);
      });

      it('should validate SPEC-XYZ-123', () => {
        expect(validateSpecId('SPEC-XYZ-123')).toBe(true);
      });

      it('should validate SPEC-A-001 (single letter)', () => {
        expect(validateSpecId('SPEC-A-001')).toBe(true);
      });

      it('should validate SPEC-ABCDEFG-999 (long identifier)', () => {
        expect(validateSpecId('SPEC-ABCDEFG-999')).toBe(true);
      });

      it('should validate SPEC-A1B2-001 (alphanumeric identifier)', () => {
        expect(validateSpecId('SPEC-A1B2-001')).toBe(true);
      });
    });

    describe('Invalid IDs - Wrong case', () => {
      it('should reject spec-abc-001 (lowercase prefix)', () => {
        expect(validateSpecId('spec-abc-001')).toBe(false);
      });

      it('should reject SPEC-abc-001 (lowercase identifier)', () => {
        expect(validateSpecId('SPEC-abc-001')).toBe(false);
      });

      it('should reject Spec-ABC-001 (mixed case prefix)', () => {
        expect(validateSpecId('Spec-ABC-001')).toBe(false);
      });
    });

    describe('Invalid IDs - Wrong format', () => {
      it('should reject SPEC-ABC (missing number)', () => {
        expect(validateSpecId('SPEC-ABC')).toBe(false);
      });

      it('should reject SPEC-ABC-1 (less than 3 digits)', () => {
        expect(validateSpecId('SPEC-ABC-1')).toBe(false);
      });

      it('should reject SPEC-ABC-12 (less than 3 digits)', () => {
        expect(validateSpecId('SPEC-ABC-12')).toBe(false);
      });

      it('should reject SPEC-ABC-1234 (more than 3 digits)', () => {
        expect(validateSpecId('SPEC-ABC-1234')).toBe(false);
      });

      it('should reject ABC-001 (missing SPEC prefix)', () => {
        expect(validateSpecId('ABC-001')).toBe(false);
      });

      it('should reject SPEC-001 (missing identifier)', () => {
        expect(validateSpecId('SPEC-001')).toBe(false);
      });

      it('should reject empty string', () => {
        expect(validateSpecId('')).toBe(false);
      });

      it('should reject SPEC--001 (empty identifier)', () => {
        expect(validateSpecId('SPEC--001')).toBe(false);
      });

      it('should reject SPEC-ABC_DEF-001 (underscore in identifier)', () => {
        expect(validateSpecId('SPEC-ABC_DEF-001')).toBe(false);
      });

      it('should reject SPEC-ABC.001 (dot separator)', () => {
        expect(validateSpecId('SPEC-ABC.001')).toBe(false);
      });
    });
  });

  describe('formatSpecId', () => {
    describe('Normalization', () => {
      it('should normalize spec-abc-001 to SPEC-ABC-001', () => {
        expect(formatSpecId('spec-abc-001')).toBe('SPEC-ABC-001');
      });

      it('should normalize SPEC-abc-001 to SPEC-ABC-001', () => {
        expect(formatSpecId('SPEC-abc-001')).toBe('SPEC-ABC-001');
      });

      it('should normalize Spec-Abc-001 to SPEC-ABC-001', () => {
        expect(formatSpecId('Spec-Abc-001')).toBe('SPEC-ABC-001');
      });

      it('should keep SPEC-ABC-001 unchanged', () => {
        expect(formatSpecId('SPEC-ABC-001')).toBe('SPEC-ABC-001');
      });
    });

    describe('Whitespace handling', () => {
      it('should trim leading whitespace', () => {
        expect(formatSpecId('  SPEC-ABC-001')).toBe('SPEC-ABC-001');
      });

      it('should trim trailing whitespace', () => {
        expect(formatSpecId('SPEC-ABC-001  ')).toBe('SPEC-ABC-001');
      });

      it('should trim both sides', () => {
        expect(formatSpecId('  spec-abc-001  ')).toBe('SPEC-ABC-001');
      });
    });

    describe('Invalid inputs', () => {
      it('should return empty string for invalid format', () => {
        expect(formatSpecId('invalid')).toBe('');
      });

      it('should return empty string for empty input', () => {
        expect(formatSpecId('')).toBe('');
      });

      it('should return empty string for whitespace-only input', () => {
        expect(formatSpecId('   ')).toBe('');
      });

      it('should return empty string for partial ID (SPEC-ABC)', () => {
        expect(formatSpecId('SPEC-ABC')).toBe('');
      });
    });

    describe('Edge cases', () => {
      it('should handle single character identifier', () => {
        expect(formatSpecId('spec-a-001')).toBe('SPEC-A-001');
      });

      it('should handle alphanumeric identifiers', () => {
        expect(formatSpecId('spec-a1b2-999')).toBe('SPEC-A1B2-999');
      });

      it('should handle long identifiers', () => {
        expect(formatSpecId('spec-verylongid-123')).toBe('SPEC-VERYLONGID-123');
      });
    });
  });
});
