/**
 * @tekton/core - Blueprint Tests
 * Test suite for blueprint creation and validation with layout token support
 * [SPEC-LAYOUT-001] [PHASE-9]
 */

import { describe, it, expect } from 'vitest';
import {
  createBlueprint,
  validateBlueprint,
  isValidComponent,
  getLayoutSlots,
  type CreateBlueprintInput,
} from '../src/blueprint.js';
import type { Blueprint, LayoutType } from '../src/types.js';

// ============================================================================
// Test: createBlueprint - Basic Creation
// ============================================================================

describe('createBlueprint - Basic Creation', () => {
  it('should create a blueprint without layoutToken (backward compatible)', () => {
    const input: CreateBlueprintInput = {
      name: 'Test Blueprint',
      description: 'A test blueprint',
      themeId: 'theme-001',
      layout: 'single-column',
      components: [
        {
          type: 'Button',
          props: { text: 'Click me' },
        },
      ],
    };

    const blueprint = createBlueprint(input);

    expect(blueprint.id).toBeDefined();
    expect(blueprint.id).toMatch(/^bp-\d+-[a-z0-9]{6}$/);
    expect(blueprint.name).toBe('Test Blueprint');
    expect(blueprint.description).toBe('A test blueprint');
    expect(blueprint.themeId).toBe('theme-001');
    expect(blueprint.layout).toBe('single-column');
    expect(blueprint.components).toHaveLength(1);
    expect(blueprint.components[0].type).toBe('Button');

    // layoutToken and layoutConfig should be undefined
    expect(blueprint.layoutToken).toBeUndefined();
    expect(blueprint.layoutConfig).toBeUndefined();
  });

  it('should create a blueprint with minimal required fields', () => {
    const input: CreateBlueprintInput = {
      name: 'Minimal Blueprint',
      themeId: 'theme-002',
      layout: 'dashboard',
      components: [],
    };

    const blueprint = createBlueprint(input);

    expect(blueprint.id).toBeDefined();
    expect(blueprint.name).toBe('Minimal Blueprint');
    expect(blueprint.themeId).toBe('theme-002');
    expect(blueprint.layout).toBe('dashboard');
    expect(blueprint.components).toEqual([]);
    expect(blueprint.description).toBeUndefined();
    expect(blueprint.layoutToken).toBeUndefined();
    expect(blueprint.layoutConfig).toBeUndefined();
  });
});

// ============================================================================
// Test: createBlueprint - Layout Token Support
// ============================================================================

describe('createBlueprint - Layout Token Support', () => {
  it('should create a blueprint with shell layoutToken', () => {
    const input: CreateBlueprintInput = {
      name: 'Dashboard Blueprint',
      themeId: 'theme-003',
      layout: 'dashboard',
      layoutToken: 'shell.web.dashboard',
      components: [],
    };

    const blueprint = createBlueprint(input);

    expect(blueprint.layoutToken).toBe('shell.web.dashboard');
    expect(blueprint.layoutConfig).toBeDefined();

    // Should have shell token
    expect(blueprint.layoutConfig?.shell).toBeDefined();
    expect(blueprint.layoutConfig?.shell?.id).toBe('shell.web.dashboard');
    expect(blueprint.layoutConfig?.shell?.platform).toBe('web');

    // Should have responsive config
    expect(blueprint.layoutConfig?.responsive).toBeDefined();

    // Should have CSS variables
    expect(blueprint.layoutConfig?.cssVariables).toBeDefined();
    expect(Object.keys(blueprint.layoutConfig?.cssVariables || {}).length).toBeGreaterThan(0);

    // Sections should be empty for shell layouts
    expect(blueprint.layoutConfig?.sections).toEqual([]);
  });

  it('should create a blueprint with page layoutToken', () => {
    const input: CreateBlueprintInput = {
      name: 'Dashboard Page Blueprint',
      themeId: 'theme-004',
      layout: 'dashboard',
      layoutToken: 'page.dashboard',
      components: [],
    };

    const blueprint = createBlueprint(input);

    expect(blueprint.layoutToken).toBe('page.dashboard');
    expect(blueprint.layoutConfig).toBeDefined();

    // Should have page token
    expect(blueprint.layoutConfig?.page).toBeDefined();
    expect(blueprint.layoutConfig?.page?.id).toBe('page.dashboard');
    expect(blueprint.layoutConfig?.page?.purpose).toBe('dashboard');

    // Should have sections
    expect(blueprint.layoutConfig?.sections).toBeDefined();
    expect(blueprint.layoutConfig?.sections.length).toBeGreaterThan(0);

    // Should have responsive config
    expect(blueprint.layoutConfig?.responsive).toBeDefined();

    // Should have CSS variables
    expect(blueprint.layoutConfig?.cssVariables).toBeDefined();
  });

  it('should create a blueprint with section layoutToken', () => {
    const input: CreateBlueprintInput = {
      name: 'Grid Section Blueprint',
      themeId: 'theme-005',
      layout: 'two-column',
      layoutToken: 'section.grid-3',
      components: [],
    };

    const blueprint = createBlueprint(input);

    expect(blueprint.layoutToken).toBe('section.grid-3');
    expect(blueprint.layoutConfig).toBeDefined();

    // Should have sections
    expect(blueprint.layoutConfig?.sections).toBeDefined();
    expect(blueprint.layoutConfig?.sections.length).toBe(1);
    expect(blueprint.layoutConfig?.sections[0].id).toBe('section.grid-3');
    expect(blueprint.layoutConfig?.sections[0].type).toBe('grid');

    // Should have responsive config
    expect(blueprint.layoutConfig?.responsive).toBeDefined();

    // Should have CSS variables
    expect(blueprint.layoutConfig?.cssVariables).toBeDefined();
  });

  it('should have layoutConfig undefined when layoutToken is not provided', () => {
    const input: CreateBlueprintInput = {
      name: 'No Token Blueprint',
      themeId: 'theme-006',
      layout: 'single-column',
      components: [],
    };

    const blueprint = createBlueprint(input);

    expect(blueprint.layoutToken).toBeUndefined();
    expect(blueprint.layoutConfig).toBeUndefined();
  });
});

// ============================================================================
// Test: createBlueprint - Layout Token Validation
// ============================================================================

describe('createBlueprint - Layout Token Validation', () => {
  it('should throw error for invalid layoutToken format', () => {
    const input: CreateBlueprintInput = {
      name: 'Invalid Token Blueprint',
      themeId: 'theme-007',
      layout: 'dashboard',
      layoutToken: 'invalid-format',
      components: [],
    };

    expect(() => createBlueprint(input)).toThrow(/Invalid layoutToken format/);
  });

  it('should throw error for shell layoutToken with invalid format', () => {
    const input: CreateBlueprintInput = {
      name: 'Invalid Shell Token',
      themeId: 'theme-008',
      layout: 'dashboard',
      layoutToken: 'shell.invalid',
      components: [],
    };

    expect(() => createBlueprint(input)).toThrow(/Invalid layoutToken format/);
  });

  it('should throw error for layoutToken with uppercase letters', () => {
    const input: CreateBlueprintInput = {
      name: 'Uppercase Token',
      themeId: 'theme-009',
      layout: 'dashboard',
      layoutToken: 'shell.Web.Dashboard',
      components: [],
    };

    expect(() => createBlueprint(input)).toThrow(/Invalid layoutToken format/);
  });

  it('should throw error for non-existent layoutToken', () => {
    const input: CreateBlueprintInput = {
      name: 'Non-existent Token',
      themeId: 'theme-010',
      layout: 'dashboard',
      layoutToken: 'shell.web.nonexistent',
      components: [],
    };

    expect(() => createBlueprint(input)).toThrow(/Failed to resolve layoutToken/);
  });
});

// ============================================================================
// Test: validateBlueprint - Basic Validation
// ============================================================================

describe('validateBlueprint - Basic Validation', () => {
  it('should validate a valid blueprint', () => {
    const blueprint: Blueprint = {
      id: 'bp-001',
      name: 'Valid Blueprint',
      themeId: 'theme-001',
      layout: 'single-column',
      components: [
        {
          type: 'Button',
          props: { text: 'Click me' },
        },
      ],
    };

    const result = validateBlueprint(blueprint);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should validate a blueprint with layoutToken', () => {
    const input: CreateBlueprintInput = {
      name: 'Token Blueprint',
      themeId: 'theme-011',
      layout: 'dashboard',
      layoutToken: 'shell.web.dashboard',
      components: [],
    };

    const blueprint = createBlueprint(input);
    const result = validateBlueprint(blueprint);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should return errors for missing required fields', () => {
    const blueprint = {
      name: 'Invalid Blueprint',
    } as Blueprint;

    const result = validateBlueprint(blueprint);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors).toContain('Missing blueprint id');
    expect(result.errors).toContain('Missing themeId');
    expect(result.errors).toContain('Missing layout');
  });

  it('should return error for invalid layout', () => {
    const blueprint: Blueprint = {
      id: 'bp-002',
      name: 'Invalid Layout',
      themeId: 'theme-002',
      layout: 'invalid-layout' as LayoutType,
      components: [],
    };

    const result = validateBlueprint(blueprint);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid layout: invalid-layout');
  });

  it('should return error for invalid components', () => {
    const blueprint: Blueprint = {
      id: 'bp-003',
      name: 'Invalid Components',
      themeId: 'theme-003',
      layout: 'single-column',
      components: [
        {
          type: '',
        },
      ],
    };

    const result = validateBlueprint(blueprint);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Component missing type');
  });
});

// ============================================================================
// Test: Helper Functions
// ============================================================================

describe('Helper Functions', () => {
  it('should validate component types', () => {
    expect(isValidComponent('Button')).toBe(true);
    expect(isValidComponent('Input')).toBe(true);
    expect(isValidComponent('Card')).toBe(true);
    expect(isValidComponent('InvalidComponent')).toBe(false);
  });

  it('should get layout slots for a layout type', () => {
    const slots = getLayoutSlots('single-column');
    expect(slots).toBeDefined();
    expect(slots.length).toBeGreaterThan(0);
    expect(slots.some(slot => slot.name === 'main')).toBe(true);
  });

  it('should get layout slots for dashboard layout', () => {
    const slots = getLayoutSlots('dashboard');
    expect(slots).toBeDefined();
    expect(slots.some(slot => slot.name === 'header')).toBe(true);
    expect(slots.some(slot => slot.name === 'sidebar')).toBe(true);
    expect(slots.some(slot => slot.name === 'main')).toBe(true);
  });
});
