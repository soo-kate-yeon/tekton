/**
 * @tekton/ui - Utility Functions Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { cn } from '../../src/lib/utils';

describe('cn (className utility)', () => {
  it('merges class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    // eslint-disable-next-line no-constant-binary-expression
    expect(cn('base', true && 'truthy', false && 'falsy')).toBe('base truthy');
  });

  it('merges Tailwind classes with proper precedence', () => {
    // Later px-4 should override earlier px-2
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles conflicting Tailwind classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles arrays of classes', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });

  it('handles objects with conditional classes', () => {
    expect(
      cn({
        class1: true,
        class2: false,
        class3: true,
      })
    ).toBe('class1 class3');
  });

  it('handles undefined and null values', () => {
    expect(cn('class1', undefined, 'class2', null)).toBe('class1 class2');
  });

  it('handles empty input', () => {
    expect(cn()).toBe('');
  });

  it('handles complex Tailwind class merging', () => {
    expect(cn('bg-red-500 text-white p-4', 'bg-blue-500 m-2')).toBe(
      'text-white p-4 bg-blue-500 m-2'
    );
  });

  it('merges multiple sets of conflicting classes', () => {
    expect(cn('px-2 py-1', 'px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('handles arbitrary values', () => {
    expect(cn('bg-[#ffffff]', 'bg-[#000000]')).toBe('bg-[#000000]');
  });

  it('preserves non-conflicting classes', () => {
    expect(cn('flex items-center justify-between', 'gap-2 rounded-md')).toBe(
      'flex items-center justify-between gap-2 rounded-md'
    );
  });
});
