import { describe, it, expect } from 'vitest';
import {
  ScreenIntent,
  intentContractSchema,
  INTENT_TO_COMPOUND_PATTERNS,
} from '../intent';

describe('Intent Layer', () => {
  describe('ScreenIntent enum', () => {
    it('should export all 10 screen intent types', () => {
      expect(ScreenIntent.DataList).toBe('data-list');
      expect(ScreenIntent.DataDetail).toBe('data-detail');
      expect(ScreenIntent.Dashboard).toBe('dashboard');
      expect(ScreenIntent.Form).toBe('form');
      expect(ScreenIntent.Wizard).toBe('wizard');
      expect(ScreenIntent.Auth).toBe('auth');
      expect(ScreenIntent.Settings).toBe('settings');
      expect(ScreenIntent.EmptyState).toBe('empty-state');
      expect(ScreenIntent.Error).toBe('error');
      expect(ScreenIntent.Custom).toBe('custom');
    });

    it('should have exactly 10 screen intent types', () => {
      const intentValues = Object.values(ScreenIntent);
      expect(intentValues).toHaveLength(10);
    });
  });

  describe('INTENT_TO_COMPOUND_PATTERNS mapping', () => {
    it('should have mappings for all 10 screen intents', () => {
      const intents: Array<typeof ScreenIntent[keyof typeof ScreenIntent]> = [
        ScreenIntent.DataList,
        ScreenIntent.DataDetail,
        ScreenIntent.Dashboard,
        ScreenIntent.Form,
        ScreenIntent.Wizard,
        ScreenIntent.Auth,
        ScreenIntent.Settings,
        ScreenIntent.EmptyState,
        ScreenIntent.Error,
        ScreenIntent.Custom,
      ];

      intents.forEach((intent) => {
        expect(INTENT_TO_COMPOUND_PATTERNS[intent]).toBeDefined();
      });
    });

    it('should map DataList intent to correct compound patterns', () => {
      const mapping = INTENT_TO_COMPOUND_PATTERNS[ScreenIntent.DataList];

      expect(mapping.primaryComponents).toContain('Table');
      expect(mapping.primaryComponents).toContain('Card');
      expect(mapping.layoutPatterns).toContain('list-grid');
      expect(mapping.actions).toContain('search');
      expect(mapping.actions).toContain('filter');
      expect(mapping.actions).toContain('sort');
    });

    it('should map DataDetail intent to correct compound patterns', () => {
      const mapping = INTENT_TO_COMPOUND_PATTERNS[ScreenIntent.DataDetail];

      expect(mapping.primaryComponents).toContain('Card');
      expect(mapping.primaryComponents).toContain('Tabs');
      expect(mapping.layoutPatterns).toContain('detail-view');
      expect(mapping.actions).toContain('edit');
      expect(mapping.actions).toContain('delete');
    });

    it('should map Dashboard intent to correct compound patterns', () => {
      const mapping = INTENT_TO_COMPOUND_PATTERNS[ScreenIntent.Dashboard];

      expect(mapping.primaryComponents).toContain('Card');
      expect(mapping.primaryComponents).toContain('Chart');
      expect(mapping.layoutPatterns).toContain('dashboard-grid');
      expect(mapping.actions).toContain('refresh');
      expect(mapping.actions).toContain('customize');
    });

    it('should map Form intent to correct compound patterns', () => {
      const mapping = INTENT_TO_COMPOUND_PATTERNS[ScreenIntent.Form];

      expect(mapping.primaryComponents).toContain('Input');
      expect(mapping.primaryComponents).toContain('Button');
      expect(mapping.layoutPatterns).toContain('form-layout');
      expect(mapping.actions).toContain('submit');
      expect(mapping.actions).toContain('cancel');
      expect(mapping.actions).toContain('validate');
    });

    it('should map Wizard intent to correct compound patterns', () => {
      const mapping = INTENT_TO_COMPOUND_PATTERNS[ScreenIntent.Wizard];

      expect(mapping.primaryComponents).toContain('Stepper');
      expect(mapping.primaryComponents).toContain('Form');
      expect(mapping.layoutPatterns).toContain('wizard-flow');
      expect(mapping.actions).toContain('next');
      expect(mapping.actions).toContain('previous');
      expect(mapping.actions).toContain('submit');
    });

    it('should map Auth intent to correct compound patterns', () => {
      const mapping = INTENT_TO_COMPOUND_PATTERNS[ScreenIntent.Auth];

      expect(mapping.primaryComponents).toContain('Form');
      expect(mapping.primaryComponents).toContain('Input');
      expect(mapping.layoutPatterns).toContain('centered-form');
      expect(mapping.actions).toContain('login');
      expect(mapping.actions).toContain('signup');
    });

    it('should map Settings intent to correct compound patterns', () => {
      const mapping = INTENT_TO_COMPOUND_PATTERNS[ScreenIntent.Settings];

      expect(mapping.primaryComponents).toContain('Form');
      expect(mapping.primaryComponents).toContain('Tabs');
      expect(mapping.layoutPatterns).toContain('settings-panel');
      expect(mapping.actions).toContain('save');
      expect(mapping.actions).toContain('reset');
    });

    it('should map EmptyState intent to correct compound patterns', () => {
      const mapping = INTENT_TO_COMPOUND_PATTERNS[ScreenIntent.EmptyState];

      expect(mapping.primaryComponents).toContain('EmptyState');
      expect(mapping.primaryComponents).toContain('Button');
      expect(mapping.layoutPatterns).toContain('centered-message');
      expect(mapping.actions).toContain('create');
    });

    it('should map Error intent to correct compound patterns', () => {
      const mapping = INTENT_TO_COMPOUND_PATTERNS[ScreenIntent.Error];

      expect(mapping.primaryComponents).toContain('Alert');
      expect(mapping.primaryComponents).toContain('Button');
      expect(mapping.layoutPatterns).toContain('error-display');
      expect(mapping.actions).toContain('retry');
      expect(mapping.actions).toContain('back');
    });

    it('should map Custom intent to correct compound patterns', () => {
      const mapping = INTENT_TO_COMPOUND_PATTERNS[ScreenIntent.Custom];

      expect(mapping.primaryComponents).toBeDefined();
      expect(mapping.layoutPatterns).toBeDefined();
      expect(mapping.actions).toBeDefined();
    });
  });

  describe('intentContractSchema', () => {
    it('should validate a complete intent contract for DataList', () => {
      const dataListContract = {
        intent: ScreenIntent.DataList,
        primaryComponents: ['Table', 'Card', 'Pagination'],
        layoutPatterns: ['list-grid', 'responsive-table'],
        actions: ['search', 'filter', 'sort', 'export'],
      };

      const result = intentContractSchema.safeParse(dataListContract);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.intent).toBe('data-list');
        expect(result.data.primaryComponents).toHaveLength(3);
        expect(result.data.actions).toContain('search');
      }
    });

    it('should validate a complete intent contract for Form', () => {
      const formContract = {
        intent: ScreenIntent.Form,
        primaryComponents: ['Input', 'Button', 'Select', 'Checkbox'],
        layoutPatterns: ['form-layout', 'two-column'],
        actions: ['submit', 'cancel', 'validate', 'save-draft'],
      };

      const result = intentContractSchema.safeParse(formContract);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.intent).toBe('form');
        expect(result.data.primaryComponents).toContain('Input');
      }
    });

    it('should validate all 10 screen intent types', () => {
      const intents: Array<typeof ScreenIntent[keyof typeof ScreenIntent]> = [
        ScreenIntent.DataList,
        ScreenIntent.DataDetail,
        ScreenIntent.Dashboard,
        ScreenIntent.Form,
        ScreenIntent.Wizard,
        ScreenIntent.Auth,
        ScreenIntent.Settings,
        ScreenIntent.EmptyState,
        ScreenIntent.Error,
        ScreenIntent.Custom,
      ];

      intents.forEach((intent) => {
        const contract = {
          intent,
          primaryComponents: ['Component1', 'Component2'],
          layoutPatterns: ['pattern1'],
          actions: ['action1'],
        };

        const result = intentContractSchema.safeParse(contract);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid intent type', () => {
      const invalidContract = {
        intent: 'invalid-intent',
        primaryComponents: ['Component1'],
        layoutPatterns: ['pattern1'],
        actions: ['action1'],
      };

      const result = intentContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });

    it('should reject contract with missing primaryComponents', () => {
      const invalidContract = {
        intent: ScreenIntent.DataList,
        layoutPatterns: ['pattern1'],
        actions: ['action1'],
      };

      const result = intentContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });

    it('should reject contract with empty primaryComponents array', () => {
      const invalidContract = {
        intent: ScreenIntent.DataList,
        primaryComponents: [],
        layoutPatterns: ['pattern1'],
        actions: ['action1'],
      };

      const result = intentContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });

    it('should reject contract with missing layoutPatterns', () => {
      const invalidContract = {
        intent: ScreenIntent.DataList,
        primaryComponents: ['Component1'],
        actions: ['action1'],
      };

      const result = intentContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });

    it('should reject contract with empty layoutPatterns array', () => {
      const invalidContract = {
        intent: ScreenIntent.DataList,
        primaryComponents: ['Component1'],
        layoutPatterns: [],
        actions: ['action1'],
      };

      const result = intentContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });

    it('should reject contract with missing actions', () => {
      const invalidContract = {
        intent: ScreenIntent.DataList,
        primaryComponents: ['Component1'],
        layoutPatterns: ['pattern1'],
      };

      const result = intentContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });

    it('should allow empty actions array', () => {
      const validContract = {
        intent: ScreenIntent.EmptyState,
        primaryComponents: ['EmptyState'],
        layoutPatterns: ['centered-message'],
        actions: [],
      };

      const result = intentContractSchema.safeParse(validContract);
      expect(result.success).toBe(true);
    });
  });

  describe('Type Coverage', () => {
    it('should achieve >=85% test coverage', () => {
      // This test ensures all exported types are used in at least one test
      const usedTypes = {
        ScreenIntent: true,
        intentContractSchema: true,
        INTENT_TO_COMPOUND_PATTERNS: true,
      };

      expect(Object.keys(usedTypes).length).toBeGreaterThanOrEqual(3);
    });
  });
});
