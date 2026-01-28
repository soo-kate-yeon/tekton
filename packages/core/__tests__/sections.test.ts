/**
 * @tekton/core - Section Pattern Token Tests
 * Comprehensive tests for 13 section pattern tokens
 * [SPEC-LAYOUT-001] [PHASE-5]
 */

import { describe, test, expect } from 'vitest';
import {
  SECTION_GRID_2,
  SECTION_GRID_3,
  SECTION_GRID_4,
  SECTION_GRID_AUTO,
  SECTION_SPLIT_30_70,
  SECTION_SPLIT_50_50,
  SECTION_SPLIT_70_30,
  SECTION_STACK_START,
  SECTION_STACK_CENTER,
  SECTION_STACK_END,
  SECTION_SIDEBAR_LEFT,
  SECTION_SIDEBAR_RIGHT,
  SECTION_CONTAINER,
  getSectionPatternToken,
  getAllSectionPatternTokens,
  getSectionsByType,
  getSectionCSS,
} from '../src/layout-tokens/sections.js';
import { validateSectionPatternToken } from '../src/layout-validation.js';
import type { SectionPatternToken } from '../src/layout-tokens/types.js';

// ============================================================================
// Individual Section Token Tests
// ============================================================================

describe('Section Pattern Tokens - Individual Validation', () => {
  const patternIds = [
    'section.grid-2',
    'section.grid-3',
    'section.grid-4',
    'section.grid-auto',
    'section.split-30-70',
    'section.split-50-50',
    'section.split-70-30',
    'section.stack-start',
    'section.stack-center',
    'section.stack-end',
    'section.sidebar-left',
    'section.sidebar-right',
    'section.container',
  ];

  test.each(patternIds)('section %s is valid and well-formed', patternId => {
    const pattern = getSectionPatternToken(patternId);

    // Basic existence check
    expect(pattern).toBeDefined();
    expect(pattern!.id).toBe(patternId);

    // Display property must be grid or flex
    expect(pattern!.css.display).toMatch(/^(grid|flex)$/);

    // Description should be non-empty
    expect(pattern!.description).toBeTruthy();
    expect(pattern!.description.length).toBeGreaterThan(10);

    // Type should be valid
    expect(['grid', 'flex', 'split', 'stack', 'container']).toContain(pattern!.type);

    // Validate against Zod schema (throws on error)
    expect(() => validateSectionPatternToken(pattern!)).not.toThrow();
  });

  test.each(patternIds)('section %s has responsive config', patternId => {
    const pattern = getSectionPatternToken(patternId);

    expect(pattern!.responsive).toBeDefined();
    expect(pattern!.responsive.default).toBeDefined();

    // Default config should have display property
    expect(pattern!.responsive.default.display).toBeDefined();
  });

  test.each(patternIds)('section %s has token bindings', patternId => {
    const pattern = getSectionPatternToken(patternId);

    expect(pattern!.tokenBindings).toBeDefined();
    expect(Object.keys(pattern!.tokenBindings).length).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================================
// Grid Pattern Tests
// ============================================================================

describe('Grid Pattern Tokens', () => {
  test('section.grid-2 has correct CSS', () => {
    expect(SECTION_GRID_2.css.display).toBe('grid');
    expect(SECTION_GRID_2.css.gridTemplateColumns).toContain('repeat(2, 1fr)');
    expect(SECTION_GRID_2.type).toBe('grid');
  });

  test('section.grid-3 has correct CSS', () => {
    expect(SECTION_GRID_3.css.display).toBe('grid');
    expect(SECTION_GRID_3.css.gridTemplateColumns).toContain('repeat(3, 1fr)');
    expect(SECTION_GRID_3.type).toBe('grid');
  });

  test('section.grid-4 has correct CSS', () => {
    expect(SECTION_GRID_4.css.display).toBe('grid');
    expect(SECTION_GRID_4.css.gridTemplateColumns).toContain('repeat(4, 1fr)');
    expect(SECTION_GRID_4.type).toBe('grid');
  });

  test('section.grid-auto has correct CSS', () => {
    expect(SECTION_GRID_AUTO.css.display).toBe('grid');
    expect(SECTION_GRID_AUTO.css.gridTemplateColumns).toContain('auto-fill');
    expect(SECTION_GRID_AUTO.css.gridTemplateColumns).toContain('minmax');
    expect(SECTION_GRID_AUTO.type).toBe('grid');
  });

  test('grid sections follow mobile-first responsive pattern', () => {
    const gridSections = [SECTION_GRID_2, SECTION_GRID_3, SECTION_GRID_4, SECTION_GRID_AUTO];

    gridSections.forEach(section => {
      // Default (mobile) should have 1 column
      expect(section.responsive.default.gridTemplateColumns).toContain('1');
      expect(section.responsive.default.display).toBe('grid');

      // Medium breakpoint should have more columns
      if (section.responsive.md?.gridTemplateColumns) {
        expect(section.responsive.md.gridTemplateColumns).toBeTruthy();
      }
    });
  });

  test('grid sections have gap token references', () => {
    const gridSections = [SECTION_GRID_2, SECTION_GRID_3, SECTION_GRID_4, SECTION_GRID_AUTO];

    gridSections.forEach(section => {
      expect(section.css.gap).toBeDefined();
      expect(section.css.gap).toContain('atomic.spacing');
    });
  });
});

// ============================================================================
// Split Pattern Tests
// ============================================================================

describe('Split Pattern Tokens', () => {
  test('section.split-30-70 has correct CSS', () => {
    expect(SECTION_SPLIT_30_70.css.display).toBe('flex');
    expect(SECTION_SPLIT_30_70.css.flexDirection).toBe('row');
    expect(SECTION_SPLIT_30_70.type).toBe('flex');
  });

  test('section.split-50-50 has correct CSS', () => {
    expect(SECTION_SPLIT_50_50.css.display).toBe('flex');
    expect(SECTION_SPLIT_50_50.css.flexDirection).toBe('row');
    expect(SECTION_SPLIT_50_50.type).toBe('flex');
  });

  test('section.split-70-30 has correct CSS', () => {
    expect(SECTION_SPLIT_70_30.css.display).toBe('flex');
    expect(SECTION_SPLIT_70_30.css.flexDirection).toBe('row');
    expect(SECTION_SPLIT_70_30.type).toBe('flex');
  });

  test('split sections stack vertically on mobile', () => {
    const splitSections = [SECTION_SPLIT_30_70, SECTION_SPLIT_50_50, SECTION_SPLIT_70_30];

    splitSections.forEach(section => {
      expect(section.responsive.default.flexDirection).toBe('column');
      expect(section.responsive.default.display).toBe('flex');
    });
  });

  test('split sections have background token bindings', () => {
    const splitSections = [SECTION_SPLIT_30_70, SECTION_SPLIT_50_50, SECTION_SPLIT_70_30];

    splitSections.forEach(section => {
      expect(section.tokenBindings.leftBackground).toBeDefined();
      expect(section.tokenBindings.rightBackground).toBeDefined();
    });
  });
});

// ============================================================================
// Stack Pattern Tests
// ============================================================================

describe('Stack Pattern Tokens', () => {
  test('section.stack-start has correct alignment', () => {
    expect(SECTION_STACK_START.css.display).toBe('flex');
    expect(SECTION_STACK_START.css.flexDirection).toBe('column');
    expect(SECTION_STACK_START.css.alignItems).toBe('flex-start');
    expect(SECTION_STACK_START.type).toBe('flex');
  });

  test('section.stack-center has correct alignment', () => {
    expect(SECTION_STACK_CENTER.css.display).toBe('flex');
    expect(SECTION_STACK_CENTER.css.flexDirection).toBe('column');
    expect(SECTION_STACK_CENTER.css.alignItems).toBe('center');
    expect(SECTION_STACK_CENTER.css.justifyContent).toBe('center');
    expect(SECTION_STACK_CENTER.type).toBe('flex');
  });

  test('section.stack-end has correct alignment', () => {
    expect(SECTION_STACK_END.css.display).toBe('flex');
    expect(SECTION_STACK_END.css.flexDirection).toBe('column');
    expect(SECTION_STACK_END.css.alignItems).toBe('flex-end');
    expect(SECTION_STACK_END.type).toBe('flex');
  });

  test('stack sections maintain column direction on all breakpoints', () => {
    const stackSections = [SECTION_STACK_START, SECTION_STACK_CENTER, SECTION_STACK_END];

    stackSections.forEach(section => {
      expect(section.css.flexDirection).toBe('column');
      expect(section.responsive.default.flexDirection).toBe('column');
      if (section.responsive.md) {
        expect(section.responsive.md.flexDirection).toBe('column');
      }
    });
  });

  test('stack sections have gap token references', () => {
    const stackSections = [SECTION_STACK_START, SECTION_STACK_CENTER, SECTION_STACK_END];

    stackSections.forEach(section => {
      expect(section.css.gap).toBeDefined();
      expect(section.css.gap).toContain('atomic.spacing');
    });
  });
});

// ============================================================================
// Sidebar Pattern Tests
// ============================================================================

describe('Sidebar Pattern Tokens', () => {
  test('section.sidebar-left has correct CSS', () => {
    expect(SECTION_SIDEBAR_LEFT.css.display).toBe('flex');
    expect(SECTION_SIDEBAR_LEFT.css.flexDirection).toBe('row');
    expect(SECTION_SIDEBAR_LEFT.type).toBe('flex');
  });

  test('section.sidebar-right has correct CSS', () => {
    expect(SECTION_SIDEBAR_RIGHT.css.display).toBe('flex');
    expect(SECTION_SIDEBAR_RIGHT.css.flexDirection).toBe('row');
    expect(SECTION_SIDEBAR_RIGHT.type).toBe('flex');
  });

  test('sidebar sections stack vertically on mobile', () => {
    const sidebarSections = [SECTION_SIDEBAR_LEFT, SECTION_SIDEBAR_RIGHT];

    sidebarSections.forEach(section => {
      expect(section.responsive.default.flexDirection).toBe('column');
      expect(section.responsive.default.display).toBe('flex');
    });
  });

  test('sidebar sections have sidebar width token bindings', () => {
    const sidebarSections = [SECTION_SIDEBAR_LEFT, SECTION_SIDEBAR_RIGHT];

    sidebarSections.forEach(section => {
      expect(section.tokenBindings.sidebarWidth).toBeDefined();
      expect(section.tokenBindings.sidebarWidth).toContain('atomic.spacing');
    });
  });

  test('sidebar sections have background token bindings', () => {
    const sidebarSections = [SECTION_SIDEBAR_LEFT, SECTION_SIDEBAR_RIGHT];

    sidebarSections.forEach(section => {
      expect(section.tokenBindings.sidebarBackground).toBeDefined();
      expect(section.tokenBindings.mainBackground).toBeDefined();
    });
  });
});

// ============================================================================
// Container Pattern Tests
// ============================================================================

describe('Container Pattern Token', () => {
  test('section.container has correct CSS', () => {
    expect(SECTION_CONTAINER.css.display).toBe('flex');
    expect(SECTION_CONTAINER.css.flexDirection).toBe('column');
    expect(SECTION_CONTAINER.css.maxWidth).toBeDefined();
    expect(SECTION_CONTAINER.css.padding).toBeDefined();
    expect(SECTION_CONTAINER.type).toBe('flex');
  });

  test('section.container has maxWidth constraints', () => {
    expect(SECTION_CONTAINER.css.maxWidth).toContain('atomic.spacing');
    expect(SECTION_CONTAINER.tokenBindings.maxWidth).toBeDefined();
  });

  test('section.container has responsive maxWidth', () => {
    // Mobile: no maxWidth constraint (undefined = full width)
    expect(SECTION_CONTAINER.responsive.default.maxWidth).toBeUndefined();
    // Tablet and Desktop: maxWidth defined with token references
    expect(SECTION_CONTAINER.responsive.md?.maxWidth).toBeDefined();
    expect(SECTION_CONTAINER.responsive.md?.maxWidth).toContain('atomic.spacing');
    expect(SECTION_CONTAINER.responsive.lg?.maxWidth).toBeDefined();
    expect(SECTION_CONTAINER.responsive.lg?.maxWidth).toContain('atomic.spacing');
  });

  test('section.container has padding token references', () => {
    expect(SECTION_CONTAINER.css.padding).toContain('atomic.spacing');
    expect(SECTION_CONTAINER.tokenBindings.padding).toBeDefined();
  });
});

// ============================================================================
// Utility Functions Tests
// ============================================================================

describe('Utility Functions', () => {
  test('getSectionPatternToken returns correct section', () => {
    const grid3 = getSectionPatternToken('section.grid-3');

    expect(grid3).toBeDefined();
    expect(grid3!.id).toBe('section.grid-3');
    expect(grid3!.css.display).toBe('grid');
  });

  test('getSectionPatternToken returns undefined for invalid ID', () => {
    const invalid = getSectionPatternToken('section.invalid');

    expect(invalid).toBeUndefined();
  });

  test('getAllSectionPatternTokens returns 13 sections', () => {
    const sections = getAllSectionPatternTokens();

    expect(sections).toHaveLength(13);
    expect(sections.every(s => s.id.startsWith('section.'))).toBe(true);
  });

  test('getSectionsByType filters grid sections', () => {
    const gridSections = getSectionsByType('grid');

    expect(gridSections.length).toBe(4);
    expect(gridSections.every(s => s.type === 'grid')).toBe(true);
    expect(gridSections.every(s => s.css.display === 'grid')).toBe(true);
  });

  test('getSectionsByType filters flex sections', () => {
    const flexSections = getSectionsByType('flex');

    expect(flexSections.length).toBe(9);
    expect(flexSections.every(s => s.type === 'flex')).toBe(true);
    expect(flexSections.every(s => s.css.display === 'flex')).toBe(true);
  });

  test('getSectionCSS returns correct CSS', () => {
    const css = getSectionCSS('section.grid-4');

    expect(css).toBeDefined();
    expect(css!.display).toBe('grid');
    expect(css!.gridTemplateColumns).toContain('repeat(4, 1fr)');
  });

  test('getSectionCSS returns undefined for invalid ID', () => {
    const css = getSectionCSS('section.invalid');

    expect(css).toBeUndefined();
  });
});

// ============================================================================
// Type Distribution Tests
// ============================================================================

describe('Section Type Distribution', () => {
  test('correct number of sections per type', () => {
    const allSections = getAllSectionPatternTokens();

    const gridCount = allSections.filter(s => s.type === 'grid').length;
    const flexCount = allSections.filter(s => s.type === 'flex').length;

    expect(gridCount).toBe(4); // grid-2, grid-3, grid-4, grid-auto
    expect(flexCount).toBe(9); // 3 splits + 3 stacks + 2 sidebars + 1 container
    expect(gridCount + flexCount).toBe(13);
  });

  test('all grid sections use display: grid', () => {
    const gridSections = getSectionsByType('grid');

    gridSections.forEach(section => {
      expect(section.css.display).toBe('grid');
      expect(section.css.gridTemplateColumns).toBeDefined();
    });
  });

  test('all flex sections use display: flex', () => {
    const flexSections = getSectionsByType('flex');

    flexSections.forEach(section => {
      expect(section.css.display).toBe('flex');
      expect(section.css.flexDirection).toBeDefined();
    });
  });
});

// ============================================================================
// Responsive Behavior Tests
// ============================================================================

describe('Responsive Configuration', () => {
  test('all sections have default responsive config', () => {
    const allSections = getAllSectionPatternTokens();

    allSections.forEach(section => {
      expect(section.responsive.default).toBeDefined();
      expect(section.responsive.default.display).toBeDefined();
    });
  });

  test('mobile-first pattern: default is most restrictive', () => {
    // Grid sections should have fewer columns on mobile
    expect(SECTION_GRID_3.responsive.default.gridTemplateColumns).toContain('1');
    expect(SECTION_GRID_4.responsive.default.gridTemplateColumns).toContain('1');

    // Split sections should stack on mobile
    expect(SECTION_SPLIT_50_50.responsive.default.flexDirection).toBe('column');
    expect(SECTION_SPLIT_30_70.responsive.default.flexDirection).toBe('column');
  });

  test('sections have appropriate gap values for mobile', () => {
    const allSections = getAllSectionPatternTokens();

    allSections.forEach(section => {
      if (section.responsive.default.gap) {
        expect(section.responsive.default.gap).toContain('atomic.spacing');
      }
    });
  });
});

// ============================================================================
// Token Binding Tests
// ============================================================================

describe('Token Bindings', () => {
  test('all sections have at least 1 token binding', () => {
    const allSections = getAllSectionPatternTokens();

    allSections.forEach(section => {
      expect(Object.keys(section.tokenBindings).length).toBeGreaterThanOrEqual(1);
    });
  });

  test('token bindings use valid token reference format', () => {
    const allSections = getAllSectionPatternTokens();
    const tokenReferencePattern = /^[a-z]+\.[a-z-]+(\.[a-z0-9-]+)*$/;

    allSections.forEach(section => {
      Object.values(section.tokenBindings).forEach(value => {
        if (typeof value === 'string') {
          expect(value).toMatch(tokenReferencePattern);
        }
      });
    });
  });

  test('common token bindings exist', () => {
    const allSections = getAllSectionPatternTokens();

    // Most sections should have gap binding
    const sectionsWithGap = allSections.filter(s => s.tokenBindings.gap);
    expect(sectionsWithGap.length).toBeGreaterThan(8);

    // Background bindings should be common
    const sectionsWithBackground = allSections.filter(
      s => s.tokenBindings.background || s.tokenBindings.itemBackground
    );
    expect(sectionsWithBackground.length).toBeGreaterThan(5);
  });
});

// ============================================================================
// Validation Integration Tests
// ============================================================================

describe('Zod Validation Integration', () => {
  test('all 13 sections pass strict validation', () => {
    const allSections = getAllSectionPatternTokens();

    allSections.forEach(section => {
      expect(() => validateSectionPatternToken(section)).not.toThrow();
    });
  });

  test('validation catches missing required fields', () => {
    const invalidSection = {
      id: 'section.invalid',
      // Missing type, css, responsive, tokenBindings
    };

    expect(() => validateSectionPatternToken(invalidSection)).toThrow();
  });

  test('validation catches invalid display values', () => {
    const invalidSection = {
      id: 'section.invalid',
      type: 'grid',
      description: 'Test',
      css: {
        display: 'block', // Invalid: must be 'grid' or 'flex'
      },
      responsive: {
        default: { display: 'block' },
      },
      tokenBindings: { gap: 'atomic.spacing.4' },
    };

    expect(() => validateSectionPatternToken(invalidSection)).toThrow();
  });

  test('validation allows valid token references', () => {
    const validSection: SectionPatternToken = {
      id: 'section.test',
      type: 'flex',
      description: 'Test section',
      css: {
        display: 'flex',
        gap: 'atomic.spacing.4',
      },
      responsive: {
        default: {
          display: 'flex',
          gap: 'atomic.spacing.2',
        },
      },
      tokenBindings: {
        gap: 'atomic.spacing.4',
        background: 'semantic.background.surface',
      },
    };

    expect(() => validateSectionPatternToken(validSection)).not.toThrow();
  });
});

// ============================================================================
// Edge Cases and Error Handling
// ============================================================================

describe('Edge Cases', () => {
  test('getSectionPatternToken handles empty string', () => {
    const result = getSectionPatternToken('');
    expect(result).toBeUndefined();
  });

  test('getSectionsByType returns empty array for invalid type', () => {
    // @ts-expect-error Testing invalid type
    const result = getSectionsByType('invalid');
    expect(result).toEqual([]);
  });

  test('section IDs follow naming convention', () => {
    const allSections = getAllSectionPatternTokens();

    allSections.forEach(section => {
      expect(section.id).toMatch(/^section\.[a-z0-9-]+$/);
    });
  });

  test('section descriptions are descriptive', () => {
    const allSections = getAllSectionPatternTokens();

    allSections.forEach(section => {
      expect(section.description.length).toBeGreaterThan(20);
      expect(section.description).not.toBe(section.id);
    });
  });
});
