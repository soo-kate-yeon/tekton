/**
 * Blueprint Layout Extension Tests
 * SPEC-LAYOUT-001 - TASK-005
 *
 * Tests for BlueprintResultV2 with layout and environment fields.
 */

import { describe, it, expect } from 'vitest';
import {
  blueprintResultV2Schema,
  type BlueprintResultV2,
} from '../src/types/knowledge-schema.js';

describe('blueprintResultV2Schema', () => {
  describe('AC-007: Backward Compatibility with Existing Blueprints', () => {
    it('should validate a legacy blueprint without layout field', () => {
      const legacyBlueprint = {
        blueprintId: 'bp-001',
        recipeName: 'TestPage',
        analysis: { intent: 'test', tone: 'neutral' },
        structure: { componentName: 'div', props: {} },
      };

      const result = blueprintResultV2Schema.safeParse(legacyBlueprint);
      expect(result.success).toBe(true);
    });

    it('should validate a blueprint with only environment field', () => {
      const blueprint = {
        blueprintId: 'bp-002',
        recipeName: 'MobilePage',
        analysis: { intent: 'test', tone: 'casual' },
        environment: 'mobile',
        structure: { componentName: 'div', props: {} },
      };

      const result = blueprintResultV2Schema.safeParse(blueprint);
      expect(result.success).toBe(true);
    });

    it('should validate a blueprint with layout configuration', () => {
      const blueprint: BlueprintResultV2 = {
        blueprintId: 'bp-003',
        recipeName: 'DashboardPage',
        analysis: { intent: 'display dashboard', tone: 'professional' },
        environment: 'responsive',
        layout: {
          container: 'fixed',
          maxWidth: '2xl',
          padding: 6,
          grid: {
            default: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 4,
          },
          gap: { x: 6, y: 8 },
        },
        structure: {
          componentName: 'div',
          props: {},
          slots: {
            content: [
              { componentName: 'MetricCard', props: { title: 'Revenue' } },
              { componentName: 'MetricCard', props: { title: 'Users' } },
            ],
          },
        },
      };

      const result = blueprintResultV2Schema.safeParse(blueprint);
      expect(result.success).toBe(true);
    });
  });

  describe('Environment field validation', () => {
    const validEnvironments = [
      'web',
      'mobile',
      'tablet',
      'responsive',
      'tv',
      'kiosk',
    ];

    for (const environment of validEnvironments) {
      it(`should accept environment: "${environment}"`, () => {
        const blueprint = {
          blueprintId: 'bp-env',
          recipeName: 'TestPage',
          analysis: { intent: 'test', tone: 'neutral' },
          environment,
          structure: { componentName: 'div', props: {} },
        };

        const result = blueprintResultV2Schema.safeParse(blueprint);
        expect(result.success).toBe(true);
      });
    }

    it('should reject invalid environment value', () => {
      const blueprint = {
        blueprintId: 'bp-env',
        recipeName: 'TestPage',
        analysis: { intent: 'test', tone: 'neutral' },
        environment: 'invalid',
        structure: { componentName: 'div', props: {} },
      };

      const result = blueprintResultV2Schema.safeParse(blueprint);
      expect(result.success).toBe(false);
    });
  });

  describe('Layout field validation', () => {
    it('should reject invalid layout configuration', () => {
      const blueprint = {
        blueprintId: 'bp-invalid',
        recipeName: 'TestPage',
        analysis: { intent: 'test', tone: 'neutral' },
        layout: {
          container: 'invalid', // invalid value
        },
        structure: { componentName: 'div', props: {} },
      };

      const result = blueprintResultV2Schema.safeParse(blueprint);
      expect(result.success).toBe(false);
    });

    it('should accept partial layout configuration', () => {
      const blueprint = {
        blueprintId: 'bp-partial',
        recipeName: 'TestPage',
        analysis: { intent: 'test', tone: 'neutral' },
        layout: {
          maxWidth: 'lg',
        },
        structure: { componentName: 'div', props: {} },
      };

      const result = blueprintResultV2Schema.safeParse(blueprint);
      expect(result.success).toBe(true);
    });
  });

  describe('Required fields validation', () => {
    it('should reject blueprint without blueprintId', () => {
      const blueprint = {
        recipeName: 'TestPage',
        analysis: { intent: 'test', tone: 'neutral' },
        structure: { componentName: 'div', props: {} },
      };

      const result = blueprintResultV2Schema.safeParse(blueprint);
      expect(result.success).toBe(false);
    });

    it('should reject blueprint without recipeName', () => {
      const blueprint = {
        blueprintId: 'bp-001',
        analysis: { intent: 'test', tone: 'neutral' },
        structure: { componentName: 'div', props: {} },
      };

      const result = blueprintResultV2Schema.safeParse(blueprint);
      expect(result.success).toBe(false);
    });

    it('should reject blueprint without analysis', () => {
      const blueprint = {
        blueprintId: 'bp-001',
        recipeName: 'TestPage',
        structure: { componentName: 'div', props: {} },
      };

      const result = blueprintResultV2Schema.safeParse(blueprint);
      expect(result.success).toBe(false);
    });

    it('should reject blueprint without structure', () => {
      const blueprint = {
        blueprintId: 'bp-001',
        recipeName: 'TestPage',
        analysis: { intent: 'test', tone: 'neutral' },
      };

      const result = blueprintResultV2Schema.safeParse(blueprint);
      expect(result.success).toBe(false);
    });
  });

  describe('Complex structure validation', () => {
    it('should validate blueprint with nested component structure', () => {
      const blueprint = {
        blueprintId: 'bp-nested',
        recipeName: 'ComplexPage',
        analysis: { intent: 'complex layout', tone: 'professional' },
        environment: 'web',
        layout: {
          container: 'fixed',
          maxWidth: 'xl',
          grid: { default: 1, md: 2, lg: 3 },
          gap: 6,
        },
        structure: {
          componentName: 'Container',
          props: { className: 'main' },
          slots: {
            header: {
              componentName: 'Header',
              props: { title: 'Dashboard' },
            },
            content: [
              {
                componentName: 'Card',
                props: { variant: 'elevated' },
                slots: {
                  body: {
                    componentName: 'Text',
                    props: { content: 'Hello' },
                  },
                },
              },
            ],
          },
        },
      };

      const result = blueprintResultV2Schema.safeParse(blueprint);
      expect(result.success).toBe(true);
    });
  });
});
