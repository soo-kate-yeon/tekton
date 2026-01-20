import { describe, it, expect } from 'vitest';
import { COMPONENT_CATALOG, getComponentByName, getAllComponents } from '../../src/catalog/component-catalog';
import { validateComponentKnowledge } from '../../src/catalog/component-knowledge';

describe('Component Catalog', () => {
  describe('Catalog Completeness', () => {
    it('should have exactly 20 components', () => {
      const allComponents = getAllComponents();
      expect(allComponents).toHaveLength(20);
    });

    it('should have all expected component names', () => {
      const expectedNames = [
        'Button', 'Input', 'Card', 'Modal', 'Dropdown',
        'Checkbox', 'Radio', 'Switch', 'Slider', 'Badge',
        'Alert', 'Toast', 'Tooltip', 'Popover', 'Tabs',
        'Accordion', 'Select', 'Textarea', 'Progress', 'Avatar',
      ];

      const allComponents = getAllComponents();
      const actualNames = allComponents.map(c => c.name).sort();
      expect(actualNames).toEqual(expectedNames.sort());
    });

    it('should allow lookup by component name', () => {
      const button = getComponentByName('Button');
      expect(button).toBeDefined();
      expect(button?.name).toBe('Button');
    });

    it('should return undefined for non-existent component', () => {
      const nonExistent = getComponentByName('NonExistent');
      expect(nonExistent).toBeUndefined();
    });
  });

  describe('Component Type Distribution', () => {
    it('should have atoms', () => {
      const atoms = getAllComponents().filter(c => c.type === 'atom');
      expect(atoms.length).toBeGreaterThan(0);
    });

    it('should have molecules', () => {
      const molecules = getAllComponents().filter(c => c.type === 'molecule');
      expect(molecules.length).toBeGreaterThan(0);
    });

    it('should have organisms', () => {
      const organisms = getAllComponents().filter(c => c.type === 'organism');
      expect(organisms.length).toBeGreaterThan(0);
    });
  });

  describe('Individual Component Validation', () => {
    it('should validate all components successfully', () => {
      const allComponents = getAllComponents();
      const catalogNames = allComponents.map(c => c.name);

      for (const component of allComponents) {
        const result = validateComponentKnowledge(component, catalogNames);
        if (!result.valid) {
          console.error(`Validation failed for ${component.name}:`, result.errors);
        }
        expect(result.valid).toBe(true);
      }
    });

    it('should have all 5 required states for each component', () => {
      const allComponents = getAllComponents();
      const requiredStates = ['default', 'hover', 'focus', 'active', 'disabled'];

      for (const component of allComponents) {
        const states = Object.keys(component.tokenBindings.states);
        for (const required of requiredStates) {
          expect(states).toContain(required);
        }
      }
    });

    it('should have semantic descriptions for all components', () => {
      const allComponents = getAllComponents();

      for (const component of allComponents) {
        expect(component.semanticDescription.purpose.length).toBeGreaterThanOrEqual(20);
        expect(['subtle', 'neutral', 'prominent']).toContain(component.semanticDescription.visualImpact);
        expect(['low', 'medium', 'high']).toContain(component.semanticDescription.complexity);
      }
    });

    it('should have slot affinity for each component', () => {
      const allComponents = getAllComponents();

      for (const component of allComponents) {
        const affinityKeys = Object.keys(component.slotAffinity);
        expect(affinityKeys.length).toBeGreaterThan(0);

        // All affinity values should be in range
        for (const affinity of Object.values(component.slotAffinity)) {
          expect(affinity).toBeGreaterThanOrEqual(0.0);
          expect(affinity).toBeLessThanOrEqual(1.0);
        }
      }
    });
  });

  describe('Specific Component Tests', () => {
    it('Button should be an action atom', () => {
      const button = getComponentByName('Button');
      expect(button?.type).toBe('atom');
      expect(button?.category).toBe('action');
    });

    it('DataTable would be organism if present (Modal is organism)', () => {
      const modal = getComponentByName('Modal');
      expect(modal?.type).toBe('organism');
    });

    it('Input should be an input atom', () => {
      const input = getComponentByName('Input');
      expect(input?.type).toBe('atom');
      expect(input?.category).toBe('input');
    });

    it('Card should be a container molecule', () => {
      const card = getComponentByName('Card');
      expect(card?.type).toBe('molecule');
      expect(card?.category).toBe('container');
    });
  });
});
