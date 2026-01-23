import { describe, it, expect, beforeEach } from 'vitest';
import { CatalogAdapter } from '../../src/adapters/catalog-adapter.js';

describe('CatalogAdapter', () => {
  let adapter: CatalogAdapter;

  beforeEach(() => {
    adapter = new CatalogAdapter();
  });

  describe('getAllComponents', () => {
    it('should return all catalog components', () => {
      const components = adapter.getAllComponents();

      expect(Array.isArray(components)).toBe(true);
      expect(components.length).toBeGreaterThan(0);

      // Verify component structure
      const firstComponent = components[0];
      expect(firstComponent).toHaveProperty('name');
      expect(firstComponent).toHaveProperty('description');
      expect(typeof firstComponent.name).toBe('string');
      expect(typeof firstComponent.description).toBe('string');
    });

    it('should include category for components', () => {
      const components = adapter.getAllComponents();

      const componentWithCategory = components.find(c => c.category);
      expect(componentWithCategory).toBeDefined();
      expect(typeof componentWithCategory?.category).toBe('string');
    });

    it('should extract slots from component knowledge', () => {
      const components = adapter.getAllComponents();

      const componentWithSlots = components.find(c => c.slots && c.slots.length > 0);
      expect(componentWithSlots).toBeDefined();
      expect(Array.isArray(componentWithSlots?.slots)).toBe(true);
    });

    it('should extract props from token bindings', () => {
      const components = adapter.getAllComponents();

      const firstComponent = components[0];
      expect(firstComponent.props).toBeDefined();
      expect(Array.isArray(firstComponent.props)).toBe(true);
    });
  });

  describe('getComponent', () => {
    it('should find component by name', () => {
      const allComponents = adapter.getAllComponents();
      const targetName = allComponents[0].name;

      const component = adapter.getComponent(targetName);

      expect(component).not.toBeNull();
      expect(component?.name).toBe(targetName);
      expect(component?.description).toBeDefined();
    });

    it('should return null for missing component', () => {
      const component = adapter.getComponent('NonExistentComponent');

      expect(component).toBeNull();
    });

    it('should return component with all properties', () => {
      const allComponents = adapter.getAllComponents();
      const targetName = allComponents[0].name;

      const component = adapter.getComponent(targetName);

      expect(component).not.toBeNull();
      expect(component).toHaveProperty('name');
      expect(component).toHaveProperty('description');
      expect(component).toHaveProperty('category');
      expect(component).toHaveProperty('slots');
      expect(component).toHaveProperty('props');
    });
  });

  describe('getComponentsByCategory', () => {
    it('should filter components by category', () => {
      const allComponents = adapter.getAllComponents();
      const componentWithCategory = allComponents.find(c => c.category);

      if (componentWithCategory?.category) {
        const filtered = adapter.getComponentsByCategory(componentWithCategory.category);

        expect(Array.isArray(filtered)).toBe(true);
        expect(filtered.length).toBeGreaterThan(0);

        filtered.forEach(comp => {
          expect(comp.category).toBe(componentWithCategory.category);
        });
      }
    });

    it('should return empty array for non-existent category', () => {
      const filtered = adapter.getComponentsByCategory('NonExistentCategory');

      expect(Array.isArray(filtered)).toBe(true);
      expect(filtered.length).toBe(0);
    });

    it('should return multiple components for valid category', () => {
      const allComponents = adapter.getAllComponents();

      // Find a category with multiple components
      const categoryMap = new Map<string, number>();
      allComponents.forEach(comp => {
        if (comp.category) {
          categoryMap.set(comp.category, (categoryMap.get(comp.category) || 0) + 1);
        }
      });

      const categoryWithMultiple = Array.from(categoryMap.entries())
        .find(([_, count]) => count > 1);

      if (categoryWithMultiple) {
        const [category, expectedCount] = categoryWithMultiple;
        const filtered = adapter.getComponentsByCategory(category);

        expect(filtered.length).toBe(expectedCount);
      }
    });
  });

  describe('hasComponent', () => {
    it('should check component existence', () => {
      const allComponents = adapter.getAllComponents();
      const existingName = allComponents[0].name;

      const exists = adapter.hasComponent(existingName);

      expect(exists).toBe(true);
    });

    it('should return false for non-existent component', () => {
      const exists = adapter.hasComponent('NonExistentComponent');

      expect(exists).toBe(false);
    });

    it('should be case-sensitive', () => {
      const allComponents = adapter.getAllComponents();
      const existingName = allComponents[0].name;
      const lowerCaseName = existingName.toLowerCase();

      if (existingName !== lowerCaseName) {
        const exists = adapter.hasComponent(lowerCaseName);
        expect(exists).toBe(false);
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle components without slots gracefully', () => {
      const allComponents = adapter.getAllComponents();

      const componentWithoutSlots = allComponents.find(c => !c.slots || c.slots.length === 0);
      if (componentWithoutSlots) {
        expect(componentWithoutSlots.slots).toBeDefined();
        expect(componentWithoutSlots.slots).toEqual(undefined);
      }
    });

    it('should handle components without category gracefully', () => {
      const allComponents = adapter.getAllComponents();

      allComponents.forEach(comp => {
        // Category can be undefined
        if (comp.category === undefined) {
          expect(comp.category).toBeUndefined();
        } else {
          expect(typeof comp.category).toBe('string');
        }
      });
    });

    it('should always return props array', () => {
      const allComponents = adapter.getAllComponents();

      allComponents.forEach(comp => {
        expect(comp.props).toBeDefined();
        expect(Array.isArray(comp.props)).toBe(true);
      });
    });
  });
});
