/**
 * Semantic Scoring Algorithm Tests
 * TAG: SPEC-LAYER3-001 Section 5.4
 *
 * Tests for the complete Semantic Scoring Algorithm
 * Formula: Score = (BaseAffinity * 0.5) + (IntentMatch * 0.3) + (ContextPenalty * 0.2)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SemanticScorer } from '../../src/scoring/semantic-scorer';
import type {
  ScoringInput,
  BlueprintIntent,
  ScoringContext,
} from '../../src/scoring/scoring.types';
import {
  SCORING_WEIGHTS,
  DEFAULT_AFFINITY,
  INTENT_MATCH_BASELINE,
  NO_PENALTY,
} from '../../src/scoring/scoring.types';
import type { ComponentKnowledge } from '@tekton/component-knowledge';

/**
 * Test fixture: Create a minimal ComponentKnowledge for testing
 */
function createTestComponent(
  overrides: Partial<ComponentKnowledge> = {}
): ComponentKnowledge {
  return {
    name: 'TestButton',
    type: 'atom',
    category: 'action',
    slotAffinity: {
      main: 0.6,
      sidebar: 0.8,
      header: 0.7,
      footer: 0.9,
      card_actions: 0.95,
    },
    semanticDescription: {
      purpose: 'Primary interactive element for user actions like submit, confirm, or navigate.',
      visualImpact: 'prominent',
      complexity: 'low',
    },
    constraints: {
      requires: [],
      conflictsWith: [],
      excludedSlots: [],
    },
    tokenBindings: {
      states: {
        default: {},
        hover: {},
        focus: {},
        active: {},
        disabled: {},
      },
    },
    ...overrides,
  };
}

/**
 * Test fixture: Create a default BlueprintIntent
 */
function createTestIntent(
  overrides: Partial<BlueprintIntent> = {}
): BlueprintIntent {
  return {
    mode: 'interactive',
    keywords: [],
    complexity: 'simple',
    ...overrides,
  };
}

/**
 * Test fixture: Create a default ScoringContext
 */
function createTestContext(
  overrides: Partial<ScoringContext> = {}
): ScoringContext {
  return {
    siblingComponents: [],
    slotConstraints: [],
    requirements: [],
    ...overrides,
  };
}

/**
 * Test fixture: Create a complete ScoringInput
 */
function createTestInput(
  overrides: Partial<ScoringInput> = {}
): ScoringInput {
  return {
    component: createTestComponent(),
    targetSlot: 'main',
    intent: createTestIntent(),
    context: createTestContext(),
    ...overrides,
  };
}

describe('SemanticScorer', () => {
  let scorer: SemanticScorer;

  beforeEach(() => {
    scorer = new SemanticScorer();
  });

  describe('calculateBaseAffinity', () => {
    it('should return the slot affinity value when slot exists in affinity map', () => {
      const input = createTestInput({
        component: createTestComponent({
          slotAffinity: { main: 0.6, sidebar: 0.8 },
        }),
        targetSlot: 'main',
      });

      const result = scorer.calculateBaseAffinity(input);

      expect(result).toBe(0.6);
    });

    it('should return default affinity (0.5) when slot is not in affinity map', () => {
      const input = createTestInput({
        component: createTestComponent({
          slotAffinity: { main: 0.6 },
        }),
        targetSlot: 'unknown_slot',
      });

      const result = scorer.calculateBaseAffinity(input);

      expect(result).toBe(DEFAULT_AFFINITY);
    });

    it('should return correct affinity for each defined slot', () => {
      const input = createTestInput({
        component: createTestComponent({
          slotAffinity: {
            header: 0.9,
            footer: 0.3,
            sidebar: 0.7,
          },
        }),
      });

      expect(scorer.calculateBaseAffinity({ ...input, targetSlot: 'header' })).toBe(0.9);
      expect(scorer.calculateBaseAffinity({ ...input, targetSlot: 'footer' })).toBe(0.3);
      expect(scorer.calculateBaseAffinity({ ...input, targetSlot: 'sidebar' })).toBe(0.7);
    });

    it('should handle empty slotAffinity map', () => {
      const input = createTestInput({
        component: createTestComponent({
          slotAffinity: {},
        }),
        targetSlot: 'main',
      });

      const result = scorer.calculateBaseAffinity(input);

      expect(result).toBe(DEFAULT_AFFINITY);
    });

    it('should handle affinity value of 0', () => {
      const input = createTestInput({
        component: createTestComponent({
          slotAffinity: { main: 0.0 },
        }),
        targetSlot: 'main',
      });

      const result = scorer.calculateBaseAffinity(input);

      expect(result).toBe(0.0);
    });

    it('should handle affinity value of 1', () => {
      const input = createTestInput({
        component: createTestComponent({
          slotAffinity: { overlay: 1.0 },
        }),
        targetSlot: 'overlay',
      });

      const result = scorer.calculateBaseAffinity(input);

      expect(result).toBe(1.0);
    });
  });

  describe('calculateIntentMatch', () => {
    describe('baseline score', () => {
      it('should start with baseline score of 0.5', () => {
        const input = createTestInput({
          component: createTestComponent({ category: 'container' }),
          intent: createTestIntent({ mode: 'read-only', keywords: [] }),
        });

        const result = scorer.calculateIntentMatch(input);

        // Container has no adjustment in read-only mode
        expect(result.score).toBe(INTENT_MATCH_BASELINE);
      });
    });

    describe('mode adjustments', () => {
      it('should apply -0.3 penalty for action category in read-only mode', () => {
        const input = createTestInput({
          component: createTestComponent({ category: 'action' }),
          intent: createTestIntent({ mode: 'read-only', keywords: [] }),
        });

        const result = scorer.calculateIntentMatch(input);

        expect(result.score).toBe(INTENT_MATCH_BASELINE - 0.3);
        expect(result.reasons).toContainEqual(expect.stringContaining('read-only'));
        expect(result.reasons).toContainEqual(expect.stringContaining('action'));
      });

      it('should apply +0.2 boost for display category in dashboard mode', () => {
        const input = createTestInput({
          component: createTestComponent({ category: 'display' }),
          intent: createTestIntent({ mode: 'dashboard', keywords: [] }),
        });

        const result = scorer.calculateIntentMatch(input);

        expect(result.score).toBe(INTENT_MATCH_BASELINE + 0.2);
        expect(result.reasons).toContainEqual(expect.stringContaining('dashboard'));
        expect(result.reasons).toContainEqual(expect.stringContaining('display'));
      });

      it('should apply +0.2 boost for input category in data-entry mode', () => {
        const input = createTestInput({
          component: createTestComponent({ category: 'input' }),
          intent: createTestIntent({ mode: 'data-entry', keywords: [] }),
        });

        const result = scorer.calculateIntentMatch(input);

        expect(result.score).toBe(INTENT_MATCH_BASELINE + 0.2);
        expect(result.reasons).toContainEqual(expect.stringContaining('data-entry'));
        expect(result.reasons).toContainEqual(expect.stringContaining('input'));
      });

      it('should apply +0.2 boost for action category in interactive mode', () => {
        const input = createTestInput({
          component: createTestComponent({ category: 'action' }),
          intent: createTestIntent({ mode: 'interactive', keywords: [] }),
        });

        const result = scorer.calculateIntentMatch(input);

        expect(result.score).toBe(INTENT_MATCH_BASELINE + 0.2);
        expect(result.reasons).toContainEqual(expect.stringContaining('interactive'));
        expect(result.reasons).toContainEqual(expect.stringContaining('action'));
      });

      it('should not apply adjustment for non-matching category/mode combinations', () => {
        const input = createTestInput({
          component: createTestComponent({ category: 'display' }),
          intent: createTestIntent({ mode: 'read-only', keywords: [] }),
        });

        const result = scorer.calculateIntentMatch(input);

        // Display category has no adjustment in read-only mode
        expect(result.score).toBe(INTENT_MATCH_BASELINE);
      });
    });

    describe('keyword matching', () => {
      it('should add +0.1 bonus per keyword match', () => {
        const input = createTestInput({
          component: createTestComponent({
            category: 'container',
            semanticDescription: {
              purpose: 'Primary interactive element for user actions like submit, confirm, or navigate.',
              visualImpact: 'prominent',
              complexity: 'low',
            },
          }),
          intent: createTestIntent({
            mode: 'read-only',
            keywords: ['submit', 'confirm'],
          }),
        });

        const result = scorer.calculateIntentMatch(input);

        // Baseline 0.5 + 2 keyword matches * 0.1 = 0.7
        expect(result.score).toBe(INTENT_MATCH_BASELINE + 0.2);
        expect(result.reasons).toContainEqual(expect.stringContaining('Keyword'));
      });

      it('should perform case-insensitive keyword matching', () => {
        const input = createTestInput({
          component: createTestComponent({
            category: 'container',
            semanticDescription: {
              purpose: 'Primary SUBMIT element for USER actions.',
              visualImpact: 'neutral',
              complexity: 'low',
            },
          }),
          intent: createTestIntent({
            mode: 'read-only',
            keywords: ['submit', 'user'],
          }),
        });

        const result = scorer.calculateIntentMatch(input);

        expect(result.score).toBe(INTENT_MATCH_BASELINE + 0.2);
      });

      it('should not add bonus for non-matching keywords', () => {
        const input = createTestInput({
          component: createTestComponent({
            category: 'container',
            semanticDescription: {
              purpose: 'Simple container for content.',
              visualImpact: 'neutral',
              complexity: 'low',
            },
          }),
          intent: createTestIntent({
            mode: 'read-only',
            keywords: ['button', 'submit'],
          }),
        });

        const result = scorer.calculateIntentMatch(input);

        expect(result.score).toBe(INTENT_MATCH_BASELINE);
      });

      it('should combine mode adjustment and keyword bonus', () => {
        const input = createTestInput({
          component: createTestComponent({
            category: 'action',
            semanticDescription: {
              purpose: 'Button for submitting forms.',
              visualImpact: 'prominent',
              complexity: 'low',
            },
          }),
          intent: createTestIntent({
            mode: 'interactive',
            keywords: ['submit', 'form'],
          }),
        });

        const result = scorer.calculateIntentMatch(input);

        // Baseline 0.5 + action boost 0.2 + 2 keywords * 0.1 = 0.9
        expect(result.score).toBe(INTENT_MATCH_BASELINE + 0.2 + 0.2);
      });
    });
  });

  describe('calculateContextPenalty', () => {
    describe('no penalty baseline', () => {
      it('should return 1.0 (no penalty) when no conflicts or mismatches', () => {
        const input = createTestInput({
          component: createTestComponent({
            constraints: { conflictsWith: [], excludedSlots: [], requires: [] },
          }),
          context: createTestContext({
            siblingComponents: [],
            slotConstraints: ['action'],
          }),
        });

        const result = scorer.calculateContextPenalty(input);

        expect(result.score).toBe(NO_PENALTY);
      });
    });

    describe('conflict detection', () => {
      it('should apply -0.5 penalty when component conflicts with sibling', () => {
        const input = createTestInput({
          component: createTestComponent({
            constraints: { conflictsWith: ['Modal'], excludedSlots: [], requires: [] },
          }),
          context: createTestContext({
            siblingComponents: ['Modal', 'Card'],
            slotConstraints: [],
          }),
        });

        const result = scorer.calculateContextPenalty(input);

        expect(result.score).toBe(NO_PENALTY - 0.5);
        expect(result.reasons).toContainEqual(expect.stringContaining('Conflict'));
      });

      it('should not apply conflict penalty when no conflicting siblings', () => {
        const input = createTestInput({
          component: createTestComponent({
            constraints: { conflictsWith: ['Modal'], excludedSlots: [], requires: [] },
          }),
          context: createTestContext({
            siblingComponents: ['Card', 'Button'],
            slotConstraints: [],
          }),
        });

        const result = scorer.calculateContextPenalty(input);

        expect(result.score).toBe(NO_PENALTY);
      });

      it('should handle empty conflictsWith array', () => {
        const input = createTestInput({
          component: createTestComponent({
            constraints: { conflictsWith: [], excludedSlots: [], requires: [] },
          }),
          context: createTestContext({
            siblingComponents: ['Modal', 'Card'],
            slotConstraints: [],
          }),
        });

        const result = scorer.calculateContextPenalty(input);

        expect(result.score).toBe(NO_PENALTY);
      });
    });

    describe('category mismatch', () => {
      it('should apply -0.3 penalty when category does not match slot constraints', () => {
        const input = createTestInput({
          component: createTestComponent({ category: 'action' }),
          context: createTestContext({
            siblingComponents: [],
            slotConstraints: ['display', 'container'],
          }),
        });

        const result = scorer.calculateContextPenalty(input);

        expect(result.score).toBe(NO_PENALTY - 0.3);
        expect(result.reasons).toContainEqual(expect.stringContaining('mismatch'));
      });

      it('should not apply mismatch penalty when category matches constraints', () => {
        const input = createTestInput({
          component: createTestComponent({ category: 'action' }),
          context: createTestContext({
            siblingComponents: [],
            slotConstraints: ['action', 'display'],
          }),
        });

        const result = scorer.calculateContextPenalty(input);

        expect(result.score).toBe(NO_PENALTY);
      });

      it('should not apply mismatch penalty when constraints are empty', () => {
        const input = createTestInput({
          component: createTestComponent({ category: 'action' }),
          context: createTestContext({
            siblingComponents: [],
            slotConstraints: [],
          }),
        });

        const result = scorer.calculateContextPenalty(input);

        expect(result.score).toBe(NO_PENALTY);
      });
    });

    describe('combined penalties', () => {
      it('should apply both conflict and mismatch penalties', () => {
        const input = createTestInput({
          component: createTestComponent({
            category: 'action',
            constraints: { conflictsWith: ['Modal'], excludedSlots: [], requires: [] },
          }),
          context: createTestContext({
            siblingComponents: ['Modal'],
            slotConstraints: ['display'],
          }),
        });

        const result = scorer.calculateContextPenalty(input);

        // 1.0 - 0.5 (conflict) - 0.3 (mismatch) = 0.2
        expect(result.score).toBe(NO_PENALTY - 0.5 - 0.3);
      });
    });
  });

  describe('clampScore', () => {
    it('should return score unchanged when within range', () => {
      expect(scorer.clampScore(0.5)).toBe(0.5);
      expect(scorer.clampScore(0.0)).toBe(0.0);
      expect(scorer.clampScore(1.0)).toBe(1.0);
    });

    it('should clamp negative scores to 0', () => {
      expect(scorer.clampScore(-0.5)).toBe(0.0);
      expect(scorer.clampScore(-1.0)).toBe(0.0);
    });

    it('should clamp scores above 1 to 1', () => {
      expect(scorer.clampScore(1.5)).toBe(1.0);
      expect(scorer.clampScore(2.0)).toBe(1.0);
    });
  });

  describe('matchesKeyword', () => {
    it('should return true when keyword is found in purpose', () => {
      expect(scorer.matchesKeyword('submit', 'Button for submitting forms')).toBe(true);
    });

    it('should perform case-insensitive matching', () => {
      expect(scorer.matchesKeyword('SUBMIT', 'button for submitting forms')).toBe(true);
      expect(scorer.matchesKeyword('submit', 'BUTTON FOR SUBMITTING FORMS')).toBe(true);
    });

    it('should return false when keyword is not found', () => {
      expect(scorer.matchesKeyword('delete', 'Button for submitting forms')).toBe(false);
    });

    it('should handle partial word matches', () => {
      expect(scorer.matchesKeyword('form', 'Button for forms')).toBe(true);
    });
  });

  describe('hasConflictWithSiblings', () => {
    it('should return true when conflict exists', () => {
      expect(scorer.hasConflictWithSiblings(['Modal', 'Toast'], ['Modal', 'Card'])).toBe(true);
    });

    it('should return false when no conflict exists', () => {
      expect(scorer.hasConflictWithSiblings(['Modal'], ['Card', 'Button'])).toBe(false);
    });

    it('should return false when conflictsWith is empty', () => {
      expect(scorer.hasConflictWithSiblings([], ['Modal', 'Card'])).toBe(false);
    });

    it('should return false when siblings is empty', () => {
      expect(scorer.hasConflictWithSiblings(['Modal'], [])).toBe(false);
    });
  });

  describe('categoryMatchesConstraints', () => {
    it('should return true when category matches one of the constraints', () => {
      expect(scorer.categoryMatchesConstraints('action', ['action', 'display'])).toBe(true);
    });

    it('should return false when category does not match any constraint', () => {
      expect(scorer.categoryMatchesConstraints('action', ['display', 'container'])).toBe(false);
    });

    it('should return true when constraints are empty (no restrictions)', () => {
      expect(scorer.categoryMatchesConstraints('action', [])).toBe(true);
    });
  });

  describe('calculateScore (complete formula)', () => {
    it('should calculate correct score using formula: (BaseAffinity * 0.5) + (IntentMatch * 0.3) + (ContextPenalty * 0.2)', () => {
      const input = createTestInput({
        component: createTestComponent({
          category: 'action',
          slotAffinity: { main: 0.8 },
          semanticDescription: {
            purpose: 'Button component for actions.',
            visualImpact: 'prominent',
            complexity: 'low',
          },
          constraints: { conflictsWith: [], excludedSlots: [], requires: [] },
        }),
        targetSlot: 'main',
        intent: createTestIntent({ mode: 'interactive', keywords: [] }),
        context: createTestContext({ siblingComponents: [], slotConstraints: ['action'] }),
      });

      const result = scorer.calculateScore(input);

      // BaseAffinity: 0.8
      // IntentMatch: 0.5 (baseline) + 0.2 (action in interactive mode) = 0.7
      // ContextPenalty: 1.0 (no conflicts, category matches)
      // Score = (0.8 * 0.5) + (0.7 * 0.3) + (1.0 * 0.2) = 0.4 + 0.21 + 0.2 = 0.81
      expect(result.score).toBeCloseTo(0.81, 2);
      expect(result.breakdown.baseAffinity).toBe(0.8);
      expect(result.breakdown.intentMatch).toBeCloseTo(0.7, 2);
      expect(result.breakdown.contextPenalty).toBe(1.0);
    });

    it('should return clamped score when formula result exceeds 1.0', () => {
      const input = createTestInput({
        component: createTestComponent({
          category: 'action',
          slotAffinity: { main: 1.0 },
          semanticDescription: {
            purpose: 'Button for submit, confirm, navigate, action, click.',
            visualImpact: 'prominent',
            complexity: 'low',
          },
          constraints: { conflictsWith: [], excludedSlots: [], requires: [] },
        }),
        targetSlot: 'main',
        intent: createTestIntent({
          mode: 'interactive',
          keywords: ['submit', 'confirm', 'navigate', 'action', 'click'],
        }),
        context: createTestContext({ siblingComponents: [], slotConstraints: ['action'] }),
      });

      const result = scorer.calculateScore(input);

      expect(result.score).toBeLessThanOrEqual(1.0);
      expect(result.score).toBeGreaterThanOrEqual(0.0);
    });

    it('should return clamped score when formula result goes below 0.0', () => {
      const input = createTestInput({
        component: createTestComponent({
          category: 'action',
          slotAffinity: { main: 0.0 },
          semanticDescription: {
            purpose: 'Action button.',
            visualImpact: 'prominent',
            complexity: 'low',
          },
          constraints: { conflictsWith: ['Modal', 'Toast'], excludedSlots: [], requires: [] },
        }),
        targetSlot: 'main',
        intent: createTestIntent({ mode: 'read-only', keywords: [] }),
        context: createTestContext({
          siblingComponents: ['Modal', 'Toast'],
          slotConstraints: ['display'],
        }),
      });

      const result = scorer.calculateScore(input);

      expect(result.score).toBeGreaterThanOrEqual(0.0);
      expect(result.score).toBeLessThanOrEqual(1.0);
    });

    it('should include componentName and targetSlot in result', () => {
      const input = createTestInput({
        component: createTestComponent({ name: 'CustomButton' }),
        targetSlot: 'sidebar',
      });

      const result = scorer.calculateScore(input);

      expect(result.componentName).toBe('CustomButton');
      expect(result.targetSlot).toBe('sidebar');
    });

    it('should include breakdown with all scores', () => {
      const input = createTestInput();

      const result = scorer.calculateScore(input);

      expect(result.breakdown).toHaveProperty('baseAffinity');
      expect(result.breakdown).toHaveProperty('intentMatch');
      expect(result.breakdown).toHaveProperty('contextPenalty');
      expect(result.breakdown).toHaveProperty('finalScore');
    });

    it('should include reasons for score adjustments', () => {
      const input = createTestInput({
        component: createTestComponent({
          category: 'action',
          semanticDescription: {
            purpose: 'Submit button for forms.',
            visualImpact: 'prominent',
            complexity: 'low',
          },
          constraints: { conflictsWith: ['Modal'], excludedSlots: [], requires: [] },
        }),
        intent: createTestIntent({ mode: 'interactive', keywords: ['submit'] }),
        context: createTestContext({
          siblingComponents: ['Modal'],
          slotConstraints: ['display'],
        }),
      });

      const result = scorer.calculateScore(input);

      expect(result.reasons.length).toBeGreaterThan(0);
    });
  });

  describe('performance', () => {
    it('should calculate score in less than 10ms', () => {
      const input = createTestInput();

      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        scorer.calculateScore(input);
      }
      const end = performance.now();

      const averageTime = (end - start) / 100;
      expect(averageTime).toBeLessThan(10);
    });
  });

  describe('edge cases', () => {
    it('should handle component with minimal data', () => {
      const minimalComponent: ComponentKnowledge = {
        name: 'Minimal',
        type: 'atom',
        category: 'display',
        slotAffinity: {},
        semanticDescription: {
          purpose: 'A minimal component for testing purposes.',
          visualImpact: 'subtle',
          complexity: 'low',
        },
        constraints: {},
        tokenBindings: {
          states: {
            default: {},
            hover: {},
            focus: {},
            active: {},
            disabled: {},
          },
        },
      };

      const input = createTestInput({ component: minimalComponent });

      const result = scorer.calculateScore(input);

      expect(result.score).toBeGreaterThanOrEqual(0.0);
      expect(result.score).toBeLessThanOrEqual(1.0);
    });

    it('should handle undefined constraints gracefully', () => {
      const component = createTestComponent({
        constraints: undefined as any,
      });

      const input = createTestInput({ component });

      // Should not throw
      expect(() => scorer.calculateScore(input)).not.toThrow();
    });

    it('should handle special characters in keywords', () => {
      const input = createTestInput({
        component: createTestComponent({
          category: 'container',
          semanticDescription: {
            purpose: 'Component with special chars: @#$% and numbers 123.',
            visualImpact: 'neutral',
            complexity: 'low',
          },
        }),
        intent: createTestIntent({
          mode: 'read-only',
          keywords: ['@#$%', '123'],
        }),
      });

      const result = scorer.calculateIntentMatch(input);

      expect(result.score).toBeGreaterThanOrEqual(0);
    });
  });
});
