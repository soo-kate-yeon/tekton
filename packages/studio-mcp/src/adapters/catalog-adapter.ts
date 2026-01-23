/**
 * CatalogAdapter
 * Wraps @tekton/component-knowledge catalog access
 *
 * Benefits:
 * - Stable API even if COMPONENT_CATALOG structure changes
 * - Easy to mock for testing
 * - Simplified component information extraction
 */

import { COMPONENT_CATALOG, type ComponentKnowledge } from '@tekton/component-knowledge';

export interface ComponentInfo {
  name: string;
  description: string;
  category?: string;
  slots?: string[];
  props?: string[];
}

export class CatalogAdapter {
  /**
   * Get all components from catalog
   */
  getAllComponents(): ComponentInfo[] {
    return Array.from(COMPONENT_CATALOG).map((comp: ComponentKnowledge) => ({
      name: comp.name,
      description: comp.semanticDescription.purpose,
      category: comp.category,
      slots: comp.slotAffinity ? Object.keys(comp.slotAffinity) : undefined,
      props: Object.keys(comp.tokenBindings.states.default),
    }));
  }

  /**
   * Get component by name
   */
  getComponent(name: string): ComponentInfo | null {
    const comp = COMPONENT_CATALOG.find((c: ComponentKnowledge) => c.name === name);
    if (!comp) return null;

    return {
      name: comp.name,
      description: comp.semanticDescription.purpose,
      category: comp.category,
      slots: comp.slotAffinity ? Object.keys(comp.slotAffinity) : undefined,
      props: Object.keys(comp.tokenBindings.states.default),
    };
  }

  /**
   * Get components by category
   */
  getComponentsByCategory(category: string): ComponentInfo[] {
    return this.getAllComponents().filter(
      (comp) => comp.category === category
    );
  }

  /**
   * Check if component exists in catalog
   */
  hasComponent(name: string): boolean {
    return COMPONENT_CATALOG.some((c: ComponentKnowledge) => c.name === name);
  }
}
