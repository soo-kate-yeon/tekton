/**
 * Fluid Fallback Tests
 * TAG: SPEC-LAYER3-001 Section 5.5.4
 *
 * Tests for fallback component assignment based on slot roles
 */

import { describe, it, expect } from 'vitest';
import { FluidFallback } from '../../src/safety/fluid-fallback';
import { FALLBACK_COMPONENTS } from '../../src/safety/safety.types';

describe('FluidFallback', () => {
  const fallback = new FluidFallback();

  describe('assignFallback', () => {
    it('should assign GenericContainer for primary-content role', () => {
      const result = fallback.assignFallback('main', 'primary-content', 0.2);

      expect(result.componentName).toBe('GenericContainer');
      expect(result.targetSlot).toBe('main');
      expect(result.slotRole).toBe('primary-content');
      expect(result.metadata._fallback).toBe(true);
      expect(result.metadata.reason).toBeDefined();
      expect(result.metadata.originalScore).toBe(0.2);
    });

    it('should assign NavPlaceholder for navigation role', () => {
      const result = fallback.assignFallback('sidebar', 'navigation', 0.15);

      expect(result.componentName).toBe('NavPlaceholder');
      expect(result.targetSlot).toBe('sidebar');
      expect(result.slotRole).toBe('navigation');
      expect(result.metadata._fallback).toBe(true);
      expect(result.metadata.originalScore).toBe(0.15);
    });

    it('should assign ButtonGroup for actions role', () => {
      const result = fallback.assignFallback('card_actions', 'actions', 0.3);

      expect(result.componentName).toBe('ButtonGroup');
      expect(result.targetSlot).toBe('card_actions');
      expect(result.slotRole).toBe('actions');
      expect(result.metadata._fallback).toBe(true);
    });

    it('should assign GenericContainer for auxiliary role', () => {
      const result = fallback.assignFallback('footer', 'auxiliary', 0.25);

      expect(result.componentName).toBe('GenericContainer');
      expect(result.targetSlot).toBe('footer');
      expect(result.slotRole).toBe('auxiliary');
      expect(result.metadata._fallback).toBe(true);
    });

    it('should include reason in metadata', () => {
      const result = fallback.assignFallback('main', 'primary-content', 0.1);

      expect(result.metadata.reason).toContain('Score below threshold');
      expect(result.metadata.reason).toContain('0.1');
    });

    it('should include slot role in reason', () => {
      const result = fallback.assignFallback('sidebar', 'navigation', 0.2);

      expect(result.metadata.reason).toContain('navigation');
    });

    it('should handle hallucination case with original component name', () => {
      const result = fallback.assignFallback(
        'main',
        'primary-content',
        undefined,
        'HallucinatedComponent'
      );

      expect(result.componentName).toBe('GenericContainer');
      expect(result.metadata._fallback).toBe(true);
      expect(result.metadata.originalComponentName).toBe('HallucinatedComponent');
      expect(result.metadata.reason).toContain('Invalid component');
    });

    it('should handle hallucination without score', () => {
      const result = fallback.assignFallback(
        'header',
        'actions',
        undefined,
        'FakeButton'
      );

      expect(result.componentName).toBe('ButtonGroup');
      expect(result.metadata.originalComponentName).toBe('FakeButton');
      expect(result.metadata.originalScore).toBeUndefined();
    });

    it('should create unique metadata for each fallback', () => {
      const result1 = fallback.assignFallback('main', 'primary-content', 0.1);
      const result2 = fallback.assignFallback('sidebar', 'navigation', 0.2);

      expect(result1.metadata).not.toBe(result2.metadata);
      expect(result1.componentName).not.toBe(result2.componentName);
    });
  });

  describe('getFallbackComponent', () => {
    it('should return correct fallback for primary-content', () => {
      const component = fallback.getFallbackComponent('primary-content');

      expect(component).toBe('GenericContainer');
    });

    it('should return correct fallback for navigation', () => {
      const component = fallback.getFallbackComponent('navigation');

      expect(component).toBe('NavPlaceholder');
    });

    it('should return correct fallback for actions', () => {
      const component = fallback.getFallbackComponent('actions');

      expect(component).toBe('ButtonGroup');
    });

    it('should return correct fallback for auxiliary', () => {
      const component = fallback.getFallbackComponent('auxiliary');

      expect(component).toBe('GenericContainer');
    });
  });

  describe('isFallbackComponent', () => {
    it('should detect fallback metadata', () => {
      const result = fallback.assignFallback('main', 'primary-content', 0.2);

      expect(fallback.isFallbackComponent(result.metadata)).toBe(true);
    });

    it('should return true for valid fallback metadata', () => {
      const metadata = {
        _fallback: true as const,
        reason: 'Test reason',
        originalScore: 0.1,
      };

      expect(fallback.isFallbackComponent(metadata)).toBe(true);
    });

    it('should return false for non-fallback metadata', () => {
      const metadata = {
        someOtherProperty: 'value',
      };

      expect(fallback.isFallbackComponent(metadata)).toBe(false);
    });

    it('should return false for empty object', () => {
      expect(fallback.isFallbackComponent({})).toBe(false);
    });
  });

  describe('createFallbackReason', () => {
    it('should create reason for low score', () => {
      const reason = fallback.createFallbackReason('primary-content', 0.15);

      expect(reason).toContain('Score below threshold');
      expect(reason).toContain('0.15');
      expect(reason).toContain('primary-content');
    });

    it('should create reason for hallucination', () => {
      const reason = fallback.createFallbackReason(
        'actions',
        undefined,
        'FakeComponent'
      );

      expect(reason).toContain('Invalid component');
      expect(reason).toContain('FakeComponent');
      expect(reason).toContain('actions');
    });

    it('should handle both low score and hallucination', () => {
      const reason = fallback.createFallbackReason(
        'navigation',
        0.1,
        'FakeNav'
      );

      // Should mention both issues
      expect(reason).toContain('Invalid component');
      expect(reason).toContain('FakeNav');
    });

    it('should include fallback component mapping info', () => {
      const reason = fallback.createFallbackReason('actions', 0.2);

      expect(reason).toContain('ButtonGroup');
    });
  });

  describe('integration with FALLBACK_COMPONENTS constant', () => {
    it('should use correct mappings from FALLBACK_COMPONENTS', () => {
      expect(FALLBACK_COMPONENTS['primary-content']).toBe('GenericContainer');
      expect(FALLBACK_COMPONENTS['navigation']).toBe('NavPlaceholder');
      expect(FALLBACK_COMPONENTS['actions']).toBe('ButtonGroup');
      expect(FALLBACK_COMPONENTS['auxiliary']).toBe('GenericContainer');
    });

    it('should assign fallback components matching FALLBACK_COMPONENTS', () => {
      const roles: Array<'primary-content' | 'navigation' | 'actions' | 'auxiliary'> = [
        'primary-content',
        'navigation',
        'actions',
        'auxiliary',
      ];

      for (const role of roles) {
        const result = fallback.assignFallback('test-slot', role, 0.1);
        expect(result.componentName).toBe(FALLBACK_COMPONENTS[role]);
      }
    });
  });
});
