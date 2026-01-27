/**
 * @tekton/core - Screen Definition Validation Tests
 * Tests for screen definition validation with Zod schemas
 * [SPEC-LAYOUT-002] [PHASE-1]
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  validateScreenDefinition,
  validateComponent,
  validateSection,
  assertValidScreenDefinition,
  validateScreenDefinitions,
  isValidShellToken,
  isValidPageToken,
  isValidSectionToken,
  getUsedComponentTypes,
  ScreenDefinitionSchema,
  ComponentDefinitionSchema,
  SectionDefinitionSchema,
} from '../src/screen-generation/validators.js';
import type {
  ScreenDefinition,
  ComponentDefinition,
  SectionDefinition,
  ValidationContext,
} from '../src/screen-generation/types.js';

// ============================================================================
// Test Fixtures
// ============================================================================

const validScreenDefinition: ScreenDefinition = {
  id: 'test-screen',
  name: 'Test Screen',
  description: 'A test screen definition',
  shell: 'shell.web.dashboard',
  page: 'page.dashboard',
  themeId: 'default',
  sections: [
    {
      id: 'test-section',
      pattern: 'section.grid-4',
      components: [
        {
          type: 'Button',
          props: {
            variant: 'primary',
            size: 'medium',
          },
          children: ['Click Me'],
        },
      ],
    },
  ],
  meta: {
    author: 'Test Author',
    createdAt: '2026-01-28T10:00:00Z',
    version: '1.0.0',
    tags: ['test'],
  },
};

const validComponent: ComponentDefinition = {
  type: 'Card',
  props: {
    variant: 'elevated',
  },
  children: [
    {
      type: 'Heading',
      props: {
        level: 2,
      },
      children: ['Title'],
    },
    'Some text content',
  ],
};

const validSection: SectionDefinition = {
  id: 'test-section',
  pattern: 'section.grid-3',
  components: [
    {
      type: 'Button',
      props: {},
    },
  ],
};

// ============================================================================
// Schema Validation Tests
// ============================================================================

describe('Screen Definition Schema Validation', () => {
  describe('ScreenDefinitionSchema', () => {
    it('should validate a complete valid screen definition', () => {
      const result = ScreenDefinitionSchema.safeParse(validScreenDefinition);
      expect(result.success).toBe(true);
    });

    it('should fail on missing required field: id', () => {
      const invalid = { ...validScreenDefinition };
      delete (invalid as Partial<ScreenDefinition>).id;
      const result = ScreenDefinitionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should fail on missing required field: name', () => {
      const invalid = { ...validScreenDefinition };
      delete (invalid as Partial<ScreenDefinition>).name;
      const result = ScreenDefinitionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should fail on missing required field: shell', () => {
      const invalid = { ...validScreenDefinition };
      delete (invalid as Partial<ScreenDefinition>).shell;
      const result = ScreenDefinitionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should fail on missing required field: page', () => {
      const invalid = { ...validScreenDefinition };
      delete (invalid as Partial<ScreenDefinition>).page;
      const result = ScreenDefinitionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should fail on missing required field: sections', () => {
      const invalid = { ...validScreenDefinition };
      delete (invalid as Partial<ScreenDefinition>).sections;
      const result = ScreenDefinitionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should accept optional fields', () => {
      const minimal: ScreenDefinition = {
        id: 'minimal-screen',
        name: 'Minimal Screen',
        shell: 'shell.web.dashboard',
        page: 'page.dashboard',
        sections: [
          {
            id: 'section-1',
            pattern: 'section.grid-2',
            components: [{ type: 'Text', props: {} }],
          },
        ],
      };
      const result = ScreenDefinitionSchema.safeParse(minimal);
      expect(result.success).toBe(true);
    });
  });

  describe('ComponentDefinitionSchema', () => {
    it('should validate a valid component definition', () => {
      const result = ComponentDefinitionSchema.safeParse(validComponent);
      expect(result.success).toBe(true);
    });

    it('should validate nested components', () => {
      const nested: ComponentDefinition = {
        type: 'Card',
        props: {},
        children: [
          {
            type: 'Modal',
            props: {},
            children: [
              {
                type: 'Form',
                props: {},
                children: [{ type: 'Input', props: {} }],
              },
            ],
          },
        ],
      };
      const result = ComponentDefinitionSchema.safeParse(nested);
      expect(result.success).toBe(true);
    });

    it('should validate string children', () => {
      const withText: ComponentDefinition = {
        type: 'Text',
        props: {},
        children: ['Hello World'],
      };
      const result = ComponentDefinitionSchema.safeParse(withText);
      expect(result.success).toBe(true);
    });

    it('should fail on invalid component type', () => {
      const invalid = {
        type: 'InvalidComponent',
        props: {},
      };
      const result = ComponentDefinitionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Component type must be one of');
      }
    });

    it('should fail on missing props', () => {
      const invalid = {
        type: 'Button',
      };
      const result = ComponentDefinitionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('SectionDefinitionSchema', () => {
    it('should validate a valid section definition', () => {
      const result = SectionDefinitionSchema.safeParse(validSection);
      expect(result.success).toBe(true);
    });

    it('should fail on empty components array', () => {
      const invalid = {
        ...validSection,
        components: [],
      };
      const result = SectionDefinitionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least one component');
      }
    });

    it('should validate responsive overrides', () => {
      const withResponsive: SectionDefinition = {
        ...validSection,
        responsive: {
          sm: { gridColumns: 1 },
          md: { gridColumns: 2 },
          lg: { gridColumns: 3 },
        },
      };
      const result = SectionDefinitionSchema.safeParse(withResponsive);
      expect(result.success).toBe(true);
    });
  });
});

// ============================================================================
// Token ID Pattern Validation Tests
// ============================================================================

describe('Token ID Pattern Validation', () => {
  describe('Shell Token Pattern', () => {
    it('should validate correct shell token IDs', () => {
      expect(isValidShellToken('shell.web.dashboard')).toBe(true);
      expect(isValidShellToken('shell.mobile.app')).toBe(true);
      expect(isValidShellToken('shell.desktop.main')).toBe(true);
    });

    it('should reject invalid shell token IDs', () => {
      expect(isValidShellToken('shell.web')).toBe(false);
      expect(isValidShellToken('page.dashboard')).toBe(false);
      expect(isValidShellToken('shell.Web.Dashboard')).toBe(false);
      expect(isValidShellToken('shell_web_dashboard')).toBe(false);
    });

    it('should fail validation with helpful error message', () => {
      const invalid = {
        ...validScreenDefinition,
        shell: 'invalid-shell-token',
      };
      const result = validateScreenDefinition(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0]).toContain('shell.{platform}.{name}');
    });
  });

  describe('Page Token Pattern', () => {
    it('should validate correct page token IDs', () => {
      expect(isValidPageToken('page.dashboard')).toBe(true);
      expect(isValidPageToken('page.settings')).toBe(true);
      expect(isValidPageToken('page.user-detail')).toBe(true);
    });

    it('should reject invalid page token IDs', () => {
      expect(isValidPageToken('page')).toBe(false);
      expect(isValidPageToken('shell.web.dashboard')).toBe(false);
      expect(isValidPageToken('page.Dashboard')).toBe(false);
      expect(isValidPageToken('page_dashboard')).toBe(false);
    });

    it('should fail validation with helpful error message', () => {
      const invalid = {
        ...validScreenDefinition,
        page: 'invalid-page-token',
      };
      const result = validateScreenDefinition(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0]).toContain('page.{name}');
    });
  });

  describe('Section Token Pattern', () => {
    it('should validate correct section token IDs', () => {
      expect(isValidSectionToken('section.grid-4')).toBe(true);
      expect(isValidSectionToken('section.hero')).toBe(true);
      expect(isValidSectionToken('section.split')).toBe(true);
      expect(isValidSectionToken('section.flex')).toBe(true);
    });

    it('should reject invalid section token IDs', () => {
      expect(isValidSectionToken('section')).toBe(false);
      expect(isValidSectionToken('page.grid-4')).toBe(false);
      expect(isValidSectionToken('section.Grid-4')).toBe(false);
      expect(isValidSectionToken('section_grid_4')).toBe(false);
    });

    it('should fail validation with helpful error message', () => {
      const invalid: ScreenDefinition = {
        ...validScreenDefinition,
        sections: [
          {
            id: 'test',
            pattern: 'invalid-section-token',
            components: [{ type: 'Button', props: {} }],
          },
        ],
      };
      const result = validateScreenDefinition(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0]).toContain('section.{name}');
    });
  });

  describe('Screen ID Pattern', () => {
    it('should validate kebab-case screen IDs', () => {
      const valid = {
        ...validScreenDefinition,
        id: 'user-dashboard-screen',
      };
      const result = validateScreenDefinition(valid);
      expect(result.valid).toBe(true);
    });

    it('should reject non-kebab-case screen IDs', () => {
      const invalid = {
        ...validScreenDefinition,
        id: 'UserDashboard',
      };
      const result = validateScreenDefinition(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0]).toContain('kebab-case');
    });
  });
});

// ============================================================================
// Validation Function Tests
// ============================================================================

describe('Validation Functions', () => {
  describe('validateScreenDefinition', () => {
    it('should return valid for correct screen definition', () => {
      const result = validateScreenDefinition(validScreenDefinition);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should detect duplicate section IDs', () => {
      const invalid: ScreenDefinition = {
        ...validScreenDefinition,
        sections: [
          {
            id: 'duplicate-section',
            pattern: 'section.grid-2',
            components: [{ type: 'Button', props: {} }],
          },
          {
            id: 'duplicate-section',
            pattern: 'section.grid-3',
            components: [{ type: 'Text', props: {} }],
          },
        ],
      };
      const result = validateScreenDefinition(invalid);
      expect(result.valid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings![0]).toContain('Duplicate section IDs');
    });

    it('should validate with context - available tokens', () => {
      const context: ValidationContext = {
        availableShells: ['shell.web.dashboard'],
        availablePages: ['page.dashboard'],
        availableSections: ['section.grid-4'],
      };
      const result = validateScreenDefinition(validScreenDefinition, context);
      expect(result.valid).toBe(true);
    });

    it('should warn on unavailable shell token', () => {
      const context: ValidationContext = {
        availableShells: ['shell.web.other'],
      };
      const result = validateScreenDefinition(validScreenDefinition, context);
      expect(result.valid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings![0]).toContain('not found in available shells');
    });

    it('should fail in strict mode with warnings', () => {
      const context: ValidationContext = {
        availableShells: ['shell.web.other'],
        strict: true,
      };
      const result = validateScreenDefinition(validScreenDefinition, context);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('validateComponent', () => {
    it('should validate a valid component', () => {
      const result = validateComponent(validComponent);
      expect(result.valid).toBe(true);
    });

    it('should provide clear error for invalid type', () => {
      const invalid = {
        type: 'NotAComponent',
        props: {},
      };
      const result = validateComponent(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0]).toContain('Component type must be one of');
    });
  });

  describe('validateSection', () => {
    it('should validate a valid section', () => {
      const result = validateSection(validSection);
      expect(result.valid).toBe(true);
    });

    it('should provide clear error for missing pattern', () => {
      const invalid = {
        id: 'test',
        components: [{ type: 'Button', props: {} }],
      };
      const result = validateSection(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('assertValidScreenDefinition', () => {
    it('should not throw for valid screen', () => {
      expect(() => {
        assertValidScreenDefinition(validScreenDefinition);
      }).not.toThrow();
    });

    it('should throw for invalid screen', () => {
      const invalid = { ...validScreenDefinition, id: 'Invalid ID!' };
      expect(() => {
        assertValidScreenDefinition(invalid);
      }).toThrow('Invalid screen definition');
    });
  });

  describe('validateScreenDefinitions', () => {
    it('should validate multiple screens', () => {
      const screens = [validScreenDefinition, validScreenDefinition];
      const result = validateScreenDefinitions(screens);
      expect(result.totalScreens).toBe(2);
      expect(result.validScreens).toBe(2);
      expect(result.invalidScreens).toBe(0);
    });

    it('should report invalid screens', () => {
      const invalid = { ...validScreenDefinition, shell: 'invalid' };
      const screens = [validScreenDefinition, invalid];
      const result = validateScreenDefinitions(screens);
      expect(result.totalScreens).toBe(2);
      expect(result.validScreens).toBe(1);
      expect(result.invalidScreens).toBe(1);
    });
  });
});

// ============================================================================
// Utility Function Tests
// ============================================================================

describe('Utility Functions', () => {
  describe('getUsedComponentTypes', () => {
    it('should collect all component types from screen', () => {
      const types = getUsedComponentTypes(validScreenDefinition);
      expect(types.has('Button')).toBe(true);
    });

    it('should collect nested component types', () => {
      const screen: ScreenDefinition = {
        ...validScreenDefinition,
        sections: [
          {
            id: 'nested',
            pattern: 'section.grid-2',
            components: [
              {
                type: 'Card',
                props: {},
                children: [
                  {
                    type: 'Modal',
                    props: {},
                    children: [{ type: 'Form', props: {} }],
                  },
                ],
              },
            ],
          },
        ],
      };
      const types = getUsedComponentTypes(screen);
      expect(types.has('Card')).toBe(true);
      expect(types.has('Modal')).toBe(true);
      expect(types.has('Form')).toBe(true);
      expect(types.size).toBe(3);
    });
  });
});

// ============================================================================
// Example Screen Validation Tests
// ============================================================================

describe('Example Screen Validation', () => {
  const examplesDir = join(__dirname, '../src/screen-generation/examples');

  it('should validate dashboard-screen.json', () => {
    const jsonPath = join(examplesDir, 'dashboard-screen.json');
    const jsonContent = readFileSync(jsonPath, 'utf-8');
    const screenDef = JSON.parse(jsonContent);
    const result = validateScreenDefinition(screenDef);
    expect(result.valid).toBe(true);
  });

  it('should validate settings-screen.json', () => {
    const jsonPath = join(examplesDir, 'settings-screen.json');
    const jsonContent = readFileSync(jsonPath, 'utf-8');
    const screenDef = JSON.parse(jsonContent);
    const result = validateScreenDefinition(screenDef);
    expect(result.valid).toBe(true);
  });

  it('should validate detail-screen.json', () => {
    const jsonPath = join(examplesDir, 'detail-screen.json');
    const jsonContent = readFileSync(jsonPath, 'utf-8');
    const screenDef = JSON.parse(jsonContent);
    const result = validateScreenDefinition(screenDef);
    expect(result.valid).toBe(true);
  });
});

// ============================================================================
// Component Type Enum Tests
// ============================================================================

describe('Component Type Validation', () => {
  const allComponentTypes = [
    'Button',
    'Input',
    'Card',
    'Text',
    'Heading',
    'Image',
    'Link',
    'List',
    'Form',
    'Modal',
    'Tabs',
    'Table',
    'Badge',
    'Avatar',
    'Dropdown',
    'Checkbox',
    'Radio',
    'Switch',
    'Slider',
    'Progress',
  ];

  allComponentTypes.forEach(type => {
    it(`should accept component type: ${type}`, () => {
      const component: ComponentDefinition = {
        type: type as any,
        props: {},
      };
      const result = validateComponent(component);
      expect(result.valid).toBe(true);
    });
  });

  it('should have exactly 20 component types', () => {
    expect(allComponentTypes.length).toBe(20);
  });
});

// ============================================================================
// Meta Field Validation Tests
// ============================================================================

describe('Meta Field Validation', () => {
  it('should validate valid createdAt timestamp', () => {
    const screen = {
      ...validScreenDefinition,
      meta: {
        createdAt: '2026-01-28T10:00:00Z',
      },
    };
    const result = validateScreenDefinition(screen);
    expect(result.valid).toBe(true);
  });

  it('should fail on invalid createdAt format', () => {
    const screen = {
      ...validScreenDefinition,
      meta: {
        createdAt: 'invalid-date',
      },
    };
    const result = validateScreenDefinition(screen);
    expect(result.valid).toBe(false);
    expect(result.errors![0]).toContain('ISO 8601');
  });

  it('should validate semantic version format', () => {
    const screen = {
      ...validScreenDefinition,
      meta: {
        version: '1.2.3',
      },
    };
    const result = validateScreenDefinition(screen);
    expect(result.valid).toBe(true);
  });

  it('should fail on invalid version format', () => {
    const screen = {
      ...validScreenDefinition,
      meta: {
        version: 'v1.0',
      },
    };
    const result = validateScreenDefinition(screen);
    expect(result.valid).toBe(false);
    expect(result.errors![0]).toContain('semantic versioning');
  });
});
