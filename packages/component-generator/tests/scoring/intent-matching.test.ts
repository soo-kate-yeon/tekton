/**
 * Intent Matching Tests
 * TAG: SPEC-LAYER3-001 Section 5.4
 *
 * Tests for intent-based score adjustments
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { IntentInjector } from '../../src/scoring/intent-injector';
import type { BlueprintIntent } from '../../src/scoring/scoring.types';
import {
  INTENT_MATCH_BASELINE,
  KEYWORD_MATCH_BONUS,
} from '../../src/scoring/scoring.types';

describe('IntentInjector', () => {
  let injector: IntentInjector;

  beforeEach(() => {
    injector = new IntentInjector();
  });

  describe('getModeAdjustment', () => {
    describe('read-only mode', () => {
      it('should return -0.3 for action category', () => {
        expect(injector.getModeAdjustment('read-only', 'action')).toBe(-0.3);
      });

      it('should return 0 for display category', () => {
        expect(injector.getModeAdjustment('read-only', 'display')).toBe(0);
      });

      it('should return 0 for input category', () => {
        expect(injector.getModeAdjustment('read-only', 'input')).toBe(0);
      });

      it('should return 0 for container category', () => {
        expect(injector.getModeAdjustment('read-only', 'container')).toBe(0);
      });

      it('should return 0 for navigation category', () => {
        expect(injector.getModeAdjustment('read-only', 'navigation')).toBe(0);
      });
    });

    describe('interactive mode', () => {
      it('should return +0.2 for action category', () => {
        expect(injector.getModeAdjustment('interactive', 'action')).toBe(0.2);
      });

      it('should return 0 for display category', () => {
        expect(injector.getModeAdjustment('interactive', 'display')).toBe(0);
      });

      it('should return 0 for input category', () => {
        expect(injector.getModeAdjustment('interactive', 'input')).toBe(0);
      });
    });

    describe('data-entry mode', () => {
      it('should return +0.2 for input category', () => {
        expect(injector.getModeAdjustment('data-entry', 'input')).toBe(0.2);
      });

      it('should return 0 for action category', () => {
        expect(injector.getModeAdjustment('data-entry', 'action')).toBe(0);
      });

      it('should return 0 for display category', () => {
        expect(injector.getModeAdjustment('data-entry', 'display')).toBe(0);
      });
    });

    describe('dashboard mode', () => {
      it('should return +0.2 for display category', () => {
        expect(injector.getModeAdjustment('dashboard', 'display')).toBe(0.2);
      });

      it('should return 0 for action category', () => {
        expect(injector.getModeAdjustment('dashboard', 'action')).toBe(0);
      });

      it('should return 0 for input category', () => {
        expect(injector.getModeAdjustment('dashboard', 'input')).toBe(0);
      });
    });
  });

  describe('calculateKeywordBonus', () => {
    it('should return 0 when no keywords match', () => {
      const bonus = injector.calculateKeywordBonus(
        ['submit', 'form'],
        'A simple container for content.'
      );

      expect(bonus).toBe(0);
    });

    it('should return 0.1 for one keyword match', () => {
      const bonus = injector.calculateKeywordBonus(
        ['submit', 'form'],
        'Button for submitting data.'
      );

      expect(bonus).toBe(KEYWORD_MATCH_BONUS);
    });

    it('should return 0.2 for two keyword matches', () => {
      const bonus = injector.calculateKeywordBonus(
        ['submit', 'form'],
        'Button for submitting form data.'
      );

      expect(bonus).toBe(KEYWORD_MATCH_BONUS * 2);
    });

    it('should return cumulative bonus for multiple matches', () => {
      const bonus = injector.calculateKeywordBonus(
        ['user', 'profile', 'avatar', 'image'],
        'User profile avatar showing user image.'
      );

      // All 4 keywords match
      expect(bonus).toBe(KEYWORD_MATCH_BONUS * 4);
    });

    it('should be case-insensitive', () => {
      const bonus = injector.calculateKeywordBonus(
        ['SUBMIT', 'FORM'],
        'button for submitting form data.'
      );

      expect(bonus).toBe(KEYWORD_MATCH_BONUS * 2);
    });

    it('should handle empty keywords array', () => {
      const bonus = injector.calculateKeywordBonus(
        [],
        'Any purpose text here.'
      );

      expect(bonus).toBe(0);
    });

    it('should handle empty purpose string', () => {
      const bonus = injector.calculateKeywordBonus(
        ['submit', 'form'],
        ''
      );

      expect(bonus).toBe(0);
    });

    it('should match partial words', () => {
      const bonus = injector.calculateKeywordBonus(
        ['submit'],
        'Button for submitting data.'
      );

      expect(bonus).toBe(KEYWORD_MATCH_BONUS);
    });
  });

  describe('calculateIntentScore', () => {
    it('should return baseline score when no adjustments apply', () => {
      const intent: BlueprintIntent = {
        mode: 'read-only',
        keywords: [],
        complexity: 'simple',
      };

      const result = injector.calculateIntentScore(
        intent,
        'container',
        'A simple container.'
      );

      expect(result.score).toBe(INTENT_MATCH_BASELINE);
      expect(result.reasons).toHaveLength(0);
    });

    it('should apply mode adjustment and include reason', () => {
      const intent: BlueprintIntent = {
        mode: 'interactive',
        keywords: [],
        complexity: 'simple',
      };

      const result = injector.calculateIntentScore(
        intent,
        'action',
        'A button component.'
      );

      expect(result.score).toBe(INTENT_MATCH_BASELINE + 0.2);
      expect(result.reasons.length).toBeGreaterThan(0);
      expect(result.reasons[0]).toContain('interactive');
      expect(result.reasons[0]).toContain('action');
    });

    it('should apply keyword bonus and include reason', () => {
      const intent: BlueprintIntent = {
        mode: 'read-only',
        keywords: ['button', 'click'],
        complexity: 'simple',
      };

      const result = injector.calculateIntentScore(
        intent,
        'container',
        'A button for clicking actions.'
      );

      expect(result.score).toBe(INTENT_MATCH_BASELINE + 0.2);
      expect(result.reasons.some(r => r.includes('Keyword'))).toBe(true);
    });

    it('should combine mode adjustment and keyword bonus', () => {
      const intent: BlueprintIntent = {
        mode: 'interactive',
        keywords: ['submit', 'form'],
        complexity: 'simple',
      };

      const result = injector.calculateIntentScore(
        intent,
        'action',
        'Button for submitting form data.'
      );

      // Baseline 0.5 + mode +0.2 + keywords +0.2 = 0.9
      expect(result.score).toBe(INTENT_MATCH_BASELINE + 0.2 + 0.2);
      expect(result.reasons.length).toBe(2);
    });

    it('should apply negative adjustment correctly', () => {
      const intent: BlueprintIntent = {
        mode: 'read-only',
        keywords: [],
        complexity: 'simple',
      };

      const result = injector.calculateIntentScore(
        intent,
        'action',
        'A button component.'
      );

      expect(result.score).toBe(INTENT_MATCH_BASELINE - 0.3);
      expect(result.reasons[0]).toContain('penalty');
    });
  });

  describe('static factory methods', () => {
    describe('createDefaultIntent', () => {
      it('should create intent with specified mode and empty keywords', () => {
        const intent = IntentInjector.createDefaultIntent('dashboard');

        expect(intent.mode).toBe('dashboard');
        expect(intent.keywords).toEqual([]);
        expect(intent.complexity).toBe('simple');
      });

      it('should work for all intent modes', () => {
        expect(IntentInjector.createDefaultIntent('read-only').mode).toBe('read-only');
        expect(IntentInjector.createDefaultIntent('interactive').mode).toBe('interactive');
        expect(IntentInjector.createDefaultIntent('data-entry').mode).toBe('data-entry');
        expect(IntentInjector.createDefaultIntent('dashboard').mode).toBe('dashboard');
      });
    });

    describe('createIntent', () => {
      it('should create intent with all specified properties', () => {
        const intent = IntentInjector.createIntent(
          'data-entry',
          ['form', 'input'],
          'complex'
        );

        expect(intent.mode).toBe('data-entry');
        expect(intent.keywords).toEqual(['form', 'input']);
        expect(intent.complexity).toBe('complex');
      });

      it('should use default complexity when not specified', () => {
        const intent = IntentInjector.createIntent('interactive', ['action']);

        expect(intent.complexity).toBe('simple');
      });
    });

    describe('createDefaultContext', () => {
      it('should create empty context', () => {
        const context = IntentInjector.createDefaultContext();

        expect(context.siblingComponents).toEqual([]);
        expect(context.slotConstraints).toEqual([]);
        expect(context.requirements).toEqual([]);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle very long purpose strings', () => {
      const longPurpose = 'submit '.repeat(1000);
      const bonus = injector.calculateKeywordBonus(['submit'], longPurpose);

      // Should still just count as one match (the word appears multiple times)
      expect(bonus).toBe(KEYWORD_MATCH_BONUS);
    });

    it('should handle special characters in purpose', () => {
      const result = injector.calculateIntentScore(
        { mode: 'read-only', keywords: ['user'], complexity: 'simple' },
        'display',
        'User@email.com display for $100 value!'
      );

      expect(result.score).toBe(INTENT_MATCH_BASELINE + KEYWORD_MATCH_BONUS);
    });

    it('should handle unicode characters', () => {
      const result = injector.calculateIntentScore(
        { mode: 'read-only', keywords: ['button'], complexity: 'simple' },
        'container',
        'Button component with emoji .'
      );

      expect(result.score).toBe(INTENT_MATCH_BASELINE + KEYWORD_MATCH_BONUS);
    });
  });
});
