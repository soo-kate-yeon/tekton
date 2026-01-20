/**
 * Global Slot Registry
 * Manages application-level layout slots
 * SPEC-LAYER3-001 Phase 1
 */

import type {
  GlobalSlotType,
  SlotDefinition,
  SlotRole,
  SlotConstraints,
} from '../types/slot-types';

/**
 * Registry for global application-level slots
 */
export class GlobalSlotRegistry {
  private slots: Map<GlobalSlotType, SlotDefinition>;

  constructor() {
    this.slots = new Map<GlobalSlotType, SlotDefinition>([
      [
        'header',
        {
          name: 'header',
          scope: 'global',
          role: 'layout',
          constraints: {
            maxChildren: 3,
            excludedComponents: ['DataTable'],
          },
        },
      ],
      [
        'sidebar',
        {
          name: 'sidebar',
          scope: 'global',
          role: 'layout',
          constraints: {
            maxChildren: 10,
            excludedComponents: ['DataTable'],
          },
        },
      ],
      [
        'main',
        {
          name: 'main',
          scope: 'global',
          role: 'content',
          constraints: {
            maxChildren: undefined, // unlimited
          },
        },
      ],
      [
        'footer',
        {
          name: 'footer',
          scope: 'global',
          role: 'layout',
          constraints: {
            maxChildren: 5,
            excludedComponents: ['DataTable'],
          },
        },
      ],
    ]);
  }

  /**
   * Get a specific global slot definition
   */
  getSlot(name: GlobalSlotType): SlotDefinition {
    const slot = this.slots.get(name);
    if (!slot) {
      throw new Error(`Global slot '${name}' not found`);
    }
    return slot;
  }

  /**
   * Get all global slot definitions
   */
  getAllSlots(): SlotDefinition[] {
    return Array.from(this.slots.values());
  }

  /**
   * Check if a global slot exists
   */
  hasSlot(name: GlobalSlotType): boolean {
    return this.slots.has(name);
  }

  /**
   * Get the role of a global slot
   */
  getSlotRole(name: GlobalSlotType): SlotRole {
    return this.getSlot(name).role;
  }

  /**
   * Get the constraints of a global slot
   */
  getSlotConstraints(name: GlobalSlotType): SlotConstraints | undefined {
    return this.getSlot(name).constraints;
  }
}
