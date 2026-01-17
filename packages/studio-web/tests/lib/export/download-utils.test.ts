import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getFileExtension,
  getMimeType,
} from '@/lib/export/download-utils';

describe('download-utils', () => {
  describe('getFileExtension', () => {
    it('returns css for css format', () => {
      expect(getFileExtension('css')).toBe('css');
    });

    it('returns json for json format', () => {
      expect(getFileExtension('json')).toBe('json');
    });

    it('returns ts for stylesheet format', () => {
      expect(getFileExtension('stylesheet')).toBe('ts');
    });
  });

  describe('getMimeType', () => {
    it('returns text/css for css format', () => {
      expect(getMimeType('css')).toBe('text/css');
    });

    it('returns application/json for json format', () => {
      expect(getMimeType('json')).toBe('application/json');
    });

    it('returns text/plain for stylesheet format', () => {
      expect(getMimeType('stylesheet')).toBe('text/plain');
    });
  });
});
