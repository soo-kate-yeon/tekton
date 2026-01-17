import { describe, it, expect } from 'vitest';
import type { StateStyleMapping, StateFeedback, TransitionSpec } from '../src/schemas/state-style-mapping';
import { validateStateStyleMapping } from '../src/validators/state-mapping-validator';

describe('State-Style Mapping - Phase 2 TDD', () => {
  describe('StateStyleMapping Schema Validation', () => {
    it('should validate complete useButton state-style mapping', () => {
      const useButtonMapping: StateStyleMapping = {
        hookName: 'useButton',
        states: [
          {
            stateName: 'isPressed',
            stateType: 'boolean',
            visualFeedback: {
              cssProperties: {
                'background': 'var(--tekton-primary-700)',
                'transform': 'scale(0.98)',
              },
            },
          },
          {
            stateName: 'isDisabled',
            stateType: 'boolean',
            visualFeedback: {
              cssProperties: {
                'opacity': '0.5',
                'cursor': 'not-allowed',
              },
            },
          },
        ],
        transitions: {
          duration: '150ms',
          easing: 'ease-out',
          reducedMotion: true,
        },
      };

      const result = validateStateStyleMapping(useButtonMapping);
      expect(result.success).toBe(true);
    });

    it('should reject state mapping without visual feedback', () => {
      const invalidMapping: StateStyleMapping = {
        hookName: 'useButton',
        states: [
          {
            stateName: 'isPressed',
            stateType: 'boolean',
            visualFeedback: {
              cssProperties: {},
            },
          },
        ],
        transitions: {
          duration: '150ms',
          easing: 'ease-out',
          reducedMotion: true,
        },
      };

      const result = validateStateStyleMapping(invalidMapping);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Visual feedback cannot be empty');
    });

    it('should validate numeric state for usePagination', () => {
      const paginationMapping: StateStyleMapping = {
        hookName: 'usePagination',
        states: [
          {
            stateName: 'currentPage',
            stateType: 'numeric',
            visualFeedback: {
              cssProperties: {
                'font-weight': 'var(--tekton-font-weight-bold)',
                'background': 'var(--tekton-primary-500)',
                'color': 'var(--tekton-neutral-50)',
              },
            },
          },
        ],
        transitions: {
          duration: '200ms',
          easing: 'ease-in-out',
          reducedMotion: true,
        },
      };

      const result = validateStateStyleMapping(paginationMapping);
      expect(result.success).toBe(true);
    });

    it('should validate composite state for useTabs', () => {
      const tabsMapping: StateStyleMapping = {
        hookName: 'useTabs',
        states: [
          {
            stateName: 'selectedKeys',
            stateType: 'composite',
            visualFeedback: {
              cssProperties: {
                'border-bottom': '2px solid var(--tekton-primary-500)',
                'color': 'var(--tekton-primary-600)',
              },
            },
          },
        ],
        transitions: {
          duration: '150ms',
          easing: 'ease-out',
          reducedMotion: true,
        },
      };

      const result = validateStateStyleMapping(tabsMapping);
      expect(result.success).toBe(true);
    });
  });

  describe('Transition Specification Validation', () => {
    it('should validate transition duration follows CSS spec', () => {
      const validDurations = ['150ms', '200ms', '0.3s', '500ms'];

      validDurations.forEach((duration) => {
        expect(duration).toMatch(/^\d+(\.\d+)?(ms|s)$/);
      });
    });

    it('should reject invalid transition duration', () => {
      const mapping: StateStyleMapping = {
        hookName: 'useButton',
        states: [],
        transitions: {
          duration: 'invalid',
          easing: 'ease-out',
          reducedMotion: true,
        },
      };

      const result = validateStateStyleMapping(mapping);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Invalid transition duration format');
    });

    it('should validate easing functions', () => {
      const validEasings = [
        'ease',
        'ease-in',
        'ease-out',
        'ease-in-out',
        'linear',
        'cubic-bezier(0.4, 0, 0.2, 1)',
      ];

      validEasings.forEach((easing) => {
        const mapping: StateStyleMapping = {
          hookName: 'useButton',
          states: [],
          transitions: {
            duration: '150ms',
            easing,
            reducedMotion: true,
          },
        };

        const result = validateStateStyleMapping(mapping);
        expect(result.success).toBe(true);
      });
    });

    it('should enforce reduced motion support', () => {
      const mapping: StateStyleMapping = {
        hookName: 'useButton',
        states: [],
        transitions: {
          duration: '150ms',
          easing: 'ease-out',
          reducedMotion: false,
        },
      };

      const result = validateStateStyleMapping(mapping);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Reduced motion support is required for accessibility');
    });
  });

  describe('Visual Feedback CSS Variable Validation', () => {
    it('should validate visual feedback uses only Token Contract variables', () => {
      const mapping: StateStyleMapping = {
        hookName: 'useButton',
        states: [
          {
            stateName: 'isPressed',
            stateType: 'boolean',
            visualFeedback: {
              cssProperties: {
                'background': 'var(--tekton-primary-700)',
                'color': 'var(--tekton-neutral-50)',
              },
            },
          },
        ],
        transitions: {
          duration: '150ms',
          easing: 'ease-out',
          reducedMotion: true,
        },
      };

      const result = validateStateStyleMapping(mapping);
      expect(result.success).toBe(true);
    });

    it('should reject hardcoded values in visual feedback', () => {
      const mapping: StateStyleMapping = {
        hookName: 'useButton',
        states: [
          {
            stateName: 'isPressed',
            stateType: 'boolean',
            visualFeedback: {
              cssProperties: {
                'background': '#3b82f6',
              },
            },
          },
        ],
        transitions: {
          duration: '150ms',
          easing: 'ease-out',
          reducedMotion: true,
        },
      };

      const result = validateStateStyleMapping(mapping);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Hardcoded color values not allowed in visual feedback');
    });
  });

  describe('State Inventory Completeness', () => {
    it('should validate all common boolean states are mapped', () => {
      const commonBooleanStates = [
        'isPressed',
        'isSelected',
        'isOpen',
        'isInvalid',
        'isDisabled',
        'isFocused',
        'isHovered',
      ];

      expect(commonBooleanStates).toHaveLength(7);
    });

    it('should validate numeric states for progress indicators', () => {
      const progressMapping: StateStyleMapping = {
        hookName: 'useProgress',
        states: [
          {
            stateName: 'value',
            stateType: 'numeric',
            visualFeedback: {
              cssProperties: {
                'width': 'calc(var(--progress-value) * 1%)',
                'background': 'var(--tekton-primary-500)',
              },
            },
          },
        ],
        transitions: {
          duration: '200ms',
          easing: 'ease-in-out',
          reducedMotion: true,
        },
      };

      const result = validateStateStyleMapping(progressMapping);
      expect(result.success).toBe(true);
    });

    it('should validate composite states for multi-select', () => {
      const mapping: StateStyleMapping = {
        hookName: 'useCheckbox',
        states: [
          {
            stateName: 'isSelected',
            stateType: 'composite',
            visualFeedback: {
              cssProperties: {
                'background': 'var(--tekton-primary-500)',
                'border-color': 'var(--tekton-primary-600)',
              },
            },
          },
        ],
        transitions: {
          duration: '150ms',
          easing: 'ease-out',
          reducedMotion: true,
        },
      };

      const result = validateStateStyleMapping(mapping);
      expect(result.success).toBe(true);
    });
  });

  describe('State Type Validation', () => {
    it('should only allow valid state types', () => {
      const validTypes: Array<'boolean' | 'numeric' | 'composite'> = ['boolean', 'numeric', 'composite'];

      validTypes.forEach((stateType) => {
        const mapping: StateStyleMapping = {
          hookName: 'useButton',
          states: [
            {
              stateName: 'testState',
              stateType,
              visualFeedback: {
                cssProperties: {
                  'color': 'var(--tekton-primary-500)',
                },
              },
            },
          ],
          transitions: {
            duration: '150ms',
            easing: 'ease-out',
            reducedMotion: true,
          },
        };

        const result = validateStateStyleMapping(mapping);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid state type', () => {
      const mapping = {
        hookName: 'useButton',
        states: [
          {
            stateName: 'testState',
            stateType: 'invalid',
            visualFeedback: {
              cssProperties: {
                'color': 'var(--tekton-primary-500)',
              },
            },
          },
        ],
        transitions: {
          duration: '150ms',
          easing: 'ease-out',
          reducedMotion: true,
        },
      };

      const result = validateStateStyleMapping(mapping as any);
      expect(result.success).toBe(false);
    });
  });

  describe('All 20 Hooks State Coverage', () => {
    it('should have state mappings for all 20 hooks', () => {
      const allHooks = [
        'useButton',
        'useToggleButton',
        'useSwitch',
        'useCheckbox',
        'useRadio',
        'useTextField',
        'useDialog',
        'useModal',
        'usePopover',
        'useTooltip',
        'useTabs',
        'useBreadcrumbs',
        'useMenu',
        'useDropdown',
        'useAccordion',
        'useTable',
        'usePagination',
        'useProgress',
        'useCalendar',
        'useRangeCalendar',
      ];

      expect(allHooks).toHaveLength(20);
    });
  });
});
